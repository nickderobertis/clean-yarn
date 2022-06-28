import { resolve } from "path";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { cleanUpTempDir, createTempDir } from "../testutils/temp-dir";
import {
  createMonorepoProject,
  createNonMonorepoProject,
} from "../testutils/project";
import { existsSync } from "fs";
import { clean } from "../src";

let tempDir: string;

describe("index", () => {
  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanUpTempDir();
  });

  it("cleans a non-monorepo", async () => {
    await createNonMonorepoProject(tempDir);

    clean(tempDir);

    const nodeModulesPath = resolve(tempDir, "node_modules");
    expect(existsSync(nodeModulesPath)).toBe(false);
    const yarnLockPath = resolve(tempDir, "yarn.lock");
    expect(existsSync(yarnLockPath)).toBe(false);
  });

  it("cleans a monorepo", async () => {
    await createMonorepoProject(tempDir);

    clean(tempDir);

    const appPath = resolve(tempDir, "apps/my-app");
    const packagePath = resolve(tempDir, "packages/my-package");

    // Check that root node_modules and yarn.lock no longer exist
    const nodeModulesPath = resolve(tempDir, "node_modules");
    expect(existsSync(nodeModulesPath)).toBe(false);
    const yarnLockPath = resolve(tempDir, "yarn.lock");
    expect(existsSync(yarnLockPath)).toBe(false);

    // Check that node_modules folders no longer exist in apps and package folders
    const appNodeModulesPath = resolve(appPath, "node_modules");
    expect(existsSync(appNodeModulesPath)).toBe(false);
    const packageNodeModulesPath = resolve(packagePath, "node_modules");
    expect(existsSync(packageNodeModulesPath)).toBe(false);
  }, 10000);
});
