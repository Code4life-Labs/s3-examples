// Define you application's endpoints in `src/endpoints` directory.
// Please follow the conventions to avoid errors

const fs = require("fs");
const path = require("path");

// Import configs
const configs = require("../configs");

// Get path of endpoints folder
const rootFolder = "endpoints";
const rootPath = path.resolve(`./src/${rootFolder}`);

// Import utils
const { ErrorUtils } = require("../utils/error");

/**
 * Use to check if `path` is in `black list`.
 * @param {string} path
 * @returns
 */
function isInBlackList(path) {
  for (const restrict of configs.blacklistOfEndpoints) {
    if (path.includes(restrict)) return true;
  }
  return false;
}

/**
 * Use to get paths of content in `pathDir` directory.
 * @param {string} pathDir
 * @param {Function} fn
 * @returns
 */
async function readDir(pathDir, fn = (files) => files) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathDir, function (err, files) {
      // Skip error
      if (err) return;
      resolve(fn(files));
    });
  });
}

/**
 * Use to get path to files of directory recursively, including sub directory.
 * @param {string} startPath
 * @param {Array<string>} accumulation
 * @returns
 */
async function getAllPathsToFiles(startPath, accumulation = []) {
  const files = await readDir(startPath);

  for (const file of files) {
    // Check if file is in blacklist
    if (isInBlackList(file)) continue;

    const pathToFile = path.resolve(startPath, file);
    const stat = fs.statSync(pathToFile);

    if (stat.isDirectory()) {
      await getAllPathsToFiles(pathToFile, accumulation);
    } else {
      accumulation.push(pathToFile);
    }
  }

  return accumulation;
}

/**
 * Get module from `p`, design for endpoint code
 * @param {string} p
 */
function getModule(p) {
  // Convert \\ to / if needed
  let parts;
  if (process.platform === "win32") parts = p.split("\\");
  else if (process.platform === "linux") parts = p.split("/");

  const module = require(p);
  const lastEndpointItem = parts[parts.length - 1];
  const [method, rest] = lastEndpointItem.split(".");

  // Get endpoint
  let endpoint = "";
  let i = parts.length - 2;
  let matchedPattern = null;
  while (rootFolder != parts[i]) {
    matchedPattern = parts[i].match(/\[(\w+)\]/);

    // Match [\w+]
    if (matchedPattern) {
      endpoint = "/" + ":" + matchedPattern[1] + endpoint;
      matchedPattern = null;
    } else {
      endpoint = "/" + parts[i] + endpoint;
    }

    i--;
  }

  return {
    middlewares: module.middlewares,
    handler: (res, req) => module.handler(res, req, { ErrorUtils }),
    method,
    endpoint,
  };
}

module.exports = {
  async buildEndpoints(router) {
    const fullPaths = await getAllPathsToFiles(rootPath);
    const _modules = [];

    for (const path of fullPaths) {
      const moduleMetadata = getModule(path);
      _modules.push(moduleMetadata);

      router[moduleMetadata.method](
        moduleMetadata.endpoint,
        ...moduleMetadata.middlewares,
        moduleMetadata.handler
      );
    }

    console.table(_modules);
  },
};
