#!/usr/bin/env node

const fs = require(`fs`);
const path = require(`path`);
const babel = require(`@babel/core`);
const os = require(`os`);
const root = path.dirname(__dirname);

// Makes it possible to access our dependencies
const pnpFile = `${__dirname}/../../../.pnp.cjs`;
if (fs.existsSync(pnpFile)) require(pnpFile).setup();

// Adds TS support to Node
// The cache in @babel/register never clears itself and will therefore grow
// forever causing massive slowdowns if left unchecked for a while
// this ensures a new cache key is generated every week
const weeksSinceUNIXEpoch = Math.floor(Date.now() / 604800000);

if (!process.env.BABEL_CACHE_PATH)
  process.env.BABEL_CACHE_PATH = path.join(
    os.tmpdir(),
    `babel`,
    `.babel.${babel.version}.${babel.getEnv()}.${weeksSinceUNIXEpoch}.json`
  );

require(`@babel/register`)({
  root,
  extensions: [`.tsx`, `.ts`],
  only: [p => `/`],
});

// Exposes the CLI version as like for the bundle
global.YARN_VERSION = `${require(`@yarnpkg/cli/package.json`).version}-dev`;

module.exports = require(`@yarnpkg/cli/lib/main`);
