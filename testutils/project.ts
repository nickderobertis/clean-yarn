import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import { expect } from "vitest";
import {
  createPackageJson,
  createPackageJsonAndInstall,
  yarnInstall,
} from "../testutils/ext-yarn";
import { createYarnRCYaml } from "./yarn-utils";

export async function createNonMonorepoProject(dir: string): Promise<void> {
  await createYarnRCYaml({ nodeLinker: "node-modules" }, dir);
  await createPackageJsonAndInstall(
    { dependencies: { lodash: "*" } },
    { cwd: dir }
  );
  const nodeModulesPath = resolve(dir, "node_modules");
  expect(existsSync(nodeModulesPath)).toBe(true);
  const yarnLockPath = resolve(dir, "yarn.lock");
  expect(existsSync(yarnLockPath)).toBe(true);
}

export async function createMonorepoProject(dir: string): Promise<void> {
  await createYarnRCYaml({ nodeLinker: "node-modules" }, dir);
  // Create apps and packages folders in the tempDir
  const appPath = resolve(dir, "apps/my-app");
  const packagePath = resolve(dir, "packages/my-package");
  mkdirSync(appPath, { recursive: true });
  mkdirSync(packagePath, { recursive: true });

  await createPackageJson(
    {
      workspaces: { packages: ["packages/*", "apps/*"] },
      dependencies: { lodash: "*" },
      name: "monorepo",
    },
    { cwd: dir }
  );
  await createPackageJson(
    {
      dependencies: { lodash: "*", typescript: "*", chalk: "*" },
      name: "my-app",
      installConfig: { hoistingLimits: "workspaces" },
    },
    { cwd: appPath }
  );
  await createPackageJson(
    {
      dependencies: { typescript: "*", request: "*" },
      name: "my-package",
      installConfig: { hoistingLimits: "workspaces" },
    },
    { cwd: packagePath }
  );
  const result = await yarnInstall(dir);
  console.log(result);

  // Check that root node_modules and yarn.lock exist
  const nodeModulesPath = resolve(dir, "node_modules");
  expect(existsSync(nodeModulesPath)).toBe(true);
  const yarnLockPath = resolve(dir, "yarn.lock");
  expect(existsSync(yarnLockPath)).toBe(true);

  // Check that node_modules folders exist in apps and package folders
  const appNodeModulesPath = resolve(appPath, "node_modules");
  expect(existsSync(appNodeModulesPath)).toBe(true);
  const packageNodeModulesPath = resolve(packagePath, "node_modules");
  expect(existsSync(packageNodeModulesPath)).toBe(true);
}
