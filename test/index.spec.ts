import { resolve } from "path";
import { existsSync } from "fs";
import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { createPackageJsonAndInstall } from "../testutils/ext-yarn";
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

  it("noop", async () => {
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
});
