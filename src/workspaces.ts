import fs from "fs";
import { resolve } from "path";
import type { YarnPackageJson } from "./types";

export function isYarnWorkspacesMonorepo(path: string): boolean {
  if (!fs.existsSync(path) || !fs.existsSync(resolve(path, "package.json"))) {
    return false;
  }
  const packageJson: YarnPackageJson = JSON.parse(
    fs.readFileSync(resolve(path, "package.json"), "utf8")
  );
  return !!packageJson.workspaces;
}
