import path from "path";
import fs from "fs";
import os from "os";

// Set to true to output files in the generated folder in the project
// for debugging purposes
const useLocalDir = false;

let tempDirPath: string;

export function createTempDir(): string {
  const baseDir = useLocalDir
    ? path.join(__dirname, "../generated")
    : os.tmpdir();
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
