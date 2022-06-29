import type { PackageJson } from "type-fest";

type YarnSpecificPackageJson = {
  installConfig?: {
    hoistingLimits?: "workspaces" | "dependencies" | "none";
  };
};

export type YarnPackageJson = PackageJson & YarnSpecificPackageJson;
