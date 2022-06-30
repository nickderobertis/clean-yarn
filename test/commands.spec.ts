import { existsSync } from "fs";
import { resolve } from "path";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import CleanYarnCommand from "../src/commands";
import { createNonMonorepoProject } from "../testutils/project";
import { cleanUpTempDir, createTempDir } from "../testutils/temp-dir";

let tempDir: string;
const result: string[] = [];

describe("clean-yarn", () => {
  beforeEach(() => {
    tempDir = createTempDir();
    // @ts-ignore
    vi.spyOn(console._stdout, "write").mockImplementation(val => {
      result.push(val as string);
      return true;
    });
  });

  afterEach(() => {
    cleanUpTempDir();
    vi.restoreAllMocks();
  });

  it("cleans yarn.lock and node_modules", async () => {
    await createNonMonorepoProject(tempDir);

    await CleanYarnCommand.run(["--cwd", tempDir]);

    // Assert that one of the output lines contains yarn.lock and one contains node_modules
    expect(result.some(line => line.includes("yarn.lock"))).toBe(true);
    expect(result.some(line => line.includes("node_modules"))).toBe(true);

    // Assert that the files were removed
    const nodeModulesPath = resolve(tempDir, "node_modules");
    expect(existsSync(nodeModulesPath)).toBe(false);
    const yarnLockPath = resolve(tempDir, "yarn.lock");
    expect(existsSync(yarnLockPath)).toBe(false);
  });
});
