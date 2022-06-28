const rimraf = require("rimraf");
const { getWorkspaces } = require("react-native-monorepo-tools");
const { ungzip } = require("pako");
const Listr = require("listr");

/**
 * Display Header
 * @returns void
 */
function cloud() {
  const gzippedData = Buffer.from(
    "H4sIAJQcFFwAA11NQQrDMAy7+xW6NYHiPKAv2B8CTgeBHsYKbcbopW+fHRraTrYSI0UO0CBgsbOvEzXZCTo4JMCrzSL+sJyWtRrK5O1uphOxYE2zqtb9GbX3+56ibmYEG0+jYjD+aUEZSa4IAv0o3jSy2KN0K8qUMb9fG77jhjLjmbF+lsxE9APlrOhe9gAAAA==",
    "base64"
  );
  const unzipedData = ungzip(gzippedData);
  console.log("\n");
  console.log(new TextDecoder().decode(unzipedData));
}

/**
 * Promisfied rimraf
 * @param {string} rmPath
 * @returns {Promise<unknown>}
 */
const promisedRimraf = rmPath => {
  return new Promise((resolve, reject) => {
    rimraf(rmPath, resolve);
  });
};

// Display Header
cloud();

const workspaceNms = getWorkspaces();

const cleanWorkspaceNMTasks = workspaceNms.map(w => ({
  title: `${w}/node_modules`,
  task: () => promisedRimraf(`${w}/node_modules`),
}));

const cleanRootNmTask = {
  title: "Removing Root node_modules",
  task: () => promisedRimraf("./node_modules"),
};

const cleanYarnLock = {
  title: "Removing Root yarn.lock",
  task: () => promisedRimraf("./yarn.lock"),
};

const tasks = new Listr([
  {
    title: "Removing Workspace Node_Modules & Root Lock File",
    task: () => {
      return new Listr(
        [...cleanWorkspaceNMTasks, cleanRootNmTask, cleanYarnLock],
        {
          concurrent: true,
        }
      );
    },
  },
]);

tasks.run().catch(err => console.error(err));
