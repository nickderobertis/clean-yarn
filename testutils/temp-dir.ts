import path from "path";
import fs from "fs";
import os from "os";

let tempDirPath: string;

export function createTempDir(): string {
  // const baseDir = os.tmpdir();
  const baseDir = path.join(__dirname, "../generated");
  tempDirPath = fs.mkdtempSync(path.join(baseDir, randomDirName()));
  return tempDirPath;
}

export function cleanUpTempDir(): void {
  if (tempDirPath) {
    fs.rmdirSync(tempDirPath, { recursive: true });
  }
}

function randomDirName(): string {
  return `nuke-monorepo-${Math.random().toString(36).substring(2)}`;
}
