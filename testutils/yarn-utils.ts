import { execFile } from "child_process";
import { promises } from "fs";
import { resolve } from "path";
import { promisify } from "util";
import { PackageJson } from "type-fest";

const execFileP = promisify(execFile);
const { mkdir, writeFile } = promises;

/**
 * Creates a package.json file in the current folder, and an `index.js` that
 * returns the content of this manifest.
 *
 * Ex: await packageJson({
 *   dependencies: {
 *     lodash: '*',
 *   },
 * });
 */
export async function packageJson(
  data: PackageJson,
  { cwd = `.` } = {}
): Promise<void> {
  const target = resolve(cwd);
  await mkdir(target, { recursive: true });

  await writeFile(
    resolve(target, `package.json`),
    `${JSON.stringify(data, null, 2)}\n`
  );
  await writeFile(
    resolve(target, `index.js`),
    `module.exports = require('./package.json');`
  );
}

/**
 * Does the same thing as `packageJson`, but also calls `yarn install` right
 * after generating the files.
 *
 * Ex: await packageJsonAndInstall({
 *   dependencies: {
 *     lodash: '*',
 *   },
 * });
 */
export async function packageJsonAndInstall(
  data: PackageJson,
  { cwd = `.` } = {}
): Promise<string> {
  await packageJson(data, { cwd });
  // When working inside the repo, Yarn won't recogize it as a separate project
  // unless we create an empty yarn.lock file
  const yarnLockPath = resolve(cwd, "yarn.lock");
  await writeFile(yarnLockPath, "");
  return await yarn("install", "--cwd", cwd);
}

/**
 * Calls the right Yarn binary (which has been built from master).
 *
 * Ex: await yarn(`install`);
 */
export async function yarn(...args: string[]): Promise<string> {
  let stdout;
  try {
    ({ stdout } = await execFileP(
      process.execPath,
      [`${__dirname}/run-yarn.js`, ...args],
      {
        env: {
          ...process.env,
          YARN_ENABLE_COLORS: "0",
          YARN_IGNORE_PATH: "1",
          YARN_ENABLE_INLINE_BUILDS: "1",
          YARN_ENABLE_IMMUTABLE_INSTALLS: "0",
        },
      }
    ));
  } catch (error) {
    if (error instanceof Error) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      error.message += `\n${error.stdout || ""}`;
      throw error;
    }
    throw error;
  }

  return stdout;
}

/**
 * Spawns a Node process, executes the specified code, and returns whatever
 * it returned by converting it to and from JSON. Although single line scripts
 * are recommended, you can make them as complex as you want by wrapping your
 * code between a block enclosure.
 *
 * Ex: console.log(await node(`require.resolve('lodash')`))
 *
 * Ex: console.log(await node(`{
 *   const a = await ...;
 *   const b = await ...;
 *   return {a, b};
 * }`))
 */
export async function node(source: string): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(
    await yarn(
      `node`,
      `-e`,
      `Promise.resolve().then(async () => ${source}).catch(err => err).then(res => console.log(JSON.stringify(res)))`
    )
  );
}
