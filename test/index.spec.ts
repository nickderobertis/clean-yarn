import { describe, it, beforeEach, afterEach } from "vitest";
import { packageJsonAndInstall } from "../testutils/yarn-utils";
import { cleanUpTempDir, createTempDir } from "../testutils/temp-dir";

let tempDir: string;

describe("index", () => {
  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanUpTempDir();
  });

  it("noop", async () => {
    const result = await packageJsonAndInstall(
      { dependencies: { lodash: "*" } },
      { cwd: tempDir }
    );
    console.log(result);
  });
});
