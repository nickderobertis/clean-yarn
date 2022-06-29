declare module "react-native-monorepo-tools" {
  type GetWorkspacesOptions = { cwd?: string };
  export function getWorkspaces(opts?: GetWorkspacesOptions): string[];
}
