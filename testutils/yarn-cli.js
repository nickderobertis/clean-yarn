// eslint-disable-next-line arca/import-ordering
const { YarnVersion } = require("@yarnpkg/core");

const { main } = require("@yarnpkg/cli/lib/main");
const packageJson = require("@yarnpkg/cli/package.json");
const cli = require("@yarnpkg/cli");
const core = require("@yarnpkg/core");
const fslib = require("@yarnpkg/fslib");
const libzip = require("@yarnpkg/libzip");
const parsers = require("@yarnpkg/parsers");
const shell = require("@yarnpkg/shell");
const clipanion = require("clipanion");
const semver = require("semver");
const typanion = require("typanion");

function getDynamicLibs() {
  return new Map([
    [`@yarnpkg/cli`, cli],
    [`@yarnpkg/core`, core],
    [`@yarnpkg/fslib`, fslib],
    [`@yarnpkg/libzip`, libzip],
    [`@yarnpkg/parsers`, parsers],
    [`@yarnpkg/shell`, shell],

    // Those ones are always useful
    [`clipanion`, clipanion],
    [`semver`, semver],
    [`typanion`, typanion],
  ]);
}

function getPluginConfiguration() {
  const plugins = new Set();
  for (const dependencyName of packageJson[`@yarnpkg/builder`].bundles.standard)
    plugins.add(dependencyName);

  const modules = getDynamicLibs();
  for (const plugin of plugins) modules.set(plugin, require(plugin).default);

  return { plugins, modules };
}

main({
  binaryVersion: YarnVersion || `<unknown>`,
  pluginConfiguration: getPluginConfiguration(),
});
