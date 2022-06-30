import rimraf from "rimraf";
import { getWorkspaces } from "react-native-monorepo-tools";
import Listr from "listr";
import { resolve } from "path";
import { isYarnWorkspacesMonorepo } from "./workspaces";
import { displayHeader } from "./ui";

function promisedRimraf(rmPath: string): Promise<unknown> {
  return new Promise(resolve => {
    rimraf(rmPath, resolve);
  });
}

export function clean(cwd = "."): Promise<void> {
  displayHeader();

  const cleanRootNmTask = {
    title: "Removing Root node_modules",
    task: () => promisedRimraf(resolve(cwd, "node_modules")),
  };

  const cleanYarnLock = {
    title: "Removing Root yarn.lock",
    task: () => promisedRimraf(resolve(cwd, "yarn.lock")),
  };

  const tasks: Listr.ListrTask<void>[] = [cleanRootNmTask, cleanYarnLock];

  if (isYarnWorkspacesMonorepo(cwd)) {
    const workspaceNms = getWorkspaces({ cwd: resolve(cwd) });

    const cleanWorkspaceNMTasks = workspaceNms.map(w => ({
      title: `${w}/node_modules`,
      task: () => promisedRimraf(resolve(w, "node_modules")),
    }));
    tasks.push(...cleanWorkspaceNMTasks);
  }

  const taskRunner = new Listr<void>([
    {
      title: "Removing Workspace Node_Modules & Root Lock File",
      task: () => {
        return new Listr(tasks, {
          concurrent: true,
        });
      },
    },
  ]);

  return taskRunner.run().catch(err => console.error(err));
}
