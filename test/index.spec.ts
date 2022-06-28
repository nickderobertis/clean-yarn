import { resolve } from "path";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { cleanUpTempDir, createTempDir } from "../testutils/temp-dir";
import {
  createMonorepoProject,
  createNonMonorepoProject,
} from "../testutils/project";

let tempDir: string;

describe("index", () => {
  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanUpTempDir();
  });

  it("creates a non-monorepo", async () => {
    await createNonMonorepoProject(tempDir);
  });

  it("creates a monorepo", async () => {
    await createMonorepoProject(tempDir);
  }, 10000);
});
