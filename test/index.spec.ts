import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import {
  createPackageJson,
  createPackageJsonAndInstall,
  yarnInstall,
} from "../testutils/ext-yarn";
import { cleanUpTempDir, createTempDir } from "../testutils/temp-dir";
import { createYarnRCYaml } from "../testutils/yarn-utils";

let tempDir: string;

describe("index", () => {
  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanUpTempDir();
  });

  it("creates a non-monorepo", async () => {
    await createYarnRCYaml({ nodeLinker: "node-modules" }, tempDir);
    await createPackageJsonAndInstall(
      { dependencies: { lodash: "*" } },
      { cwd: tempDir }
    );
    const nodeModulesPath = resolve(tempDir, "node_modules");
    expect(existsSync(nodeModulesPath)).toBe(true);
    const yarnLockPath = resolve(tempDir, "yarn.lock");
    expect(existsSync(yarnLockPath)).toBe(true);
  });

  it("creates a monorepo", async () => {
    await createYarnRCYaml({ nodeLinker: "node-modules" }, tempDir);
    // Create apps and packages folders in the tempDir
    const appPath = resolve(tempDir, "apps/my-app");
    const packagePath = resolve(tempDir, "packages/my-package");
    mkdirSync(appPath, { recursive: true });
    mkdirSync(packagePath, { recursive: true });

    await createPackageJson(
      {
        workspaces: { packages: ["packages/*", "apps/*"] },
        dependencies: { lodash: "*" },
        name: "monorepo",
      },
      { cwd: tempDir }
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
    const result = await yarnInstall(tempDir);
    console.log(result);

    // Check that root node_modules and yarn.lock exist
    const nodeModulesPath = resolve(tempDir, "node_modules");
    expect(existsSync(nodeModulesPath)).toBe(true);
    const yarnLockPath = resolve(tempDir, "yarn.lock");
    expect(existsSync(yarnLockPath)).toBe(true);

    // Check that node_modules folders exist in apps and package folders
    const appNodeModulesPath = resolve(appPath, "node_modules");
    expect(existsSync(appNodeModulesPath)).toBe(true);
    const packageNodeModulesPath = resolve(packagePath, "node_modules");
    expect(existsSync(packageNodeModulesPath)).toBe(true);
  }, 10000);
});
