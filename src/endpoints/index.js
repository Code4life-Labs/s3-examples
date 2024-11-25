// Define you application's endpoints in `src/endpoints` directory.
// Please follow the conventions to avoid errors

const fs = require("fs");
const path = require("path");

// Import configs
const configs = require("../configs");

// Get path of endpoints folder
const rootFolder = "endpoints";
const endpointsPath = path.resolve(`./src/${rootFolder}`);

function isInBlackList(path) {
  for (const restrict of configs.blacklistOfEndpoints) {
    if (path.includes(restrict)) return true;
  }
  return false;
}

async function readDir(startPath, fn = (files) => files) {
  return new Promise((resolve, reject) => {
    fs.readdir(startPath, function (err, files) {
      // Skip error
      if (err) return;
      resolve(fn(files));
    });
  });
}

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

function getModule(p) {
  // Convert \\ to / if needed
  let parts;
  if (process.platform === "win32") parts = p.split("\\");
  else if (process.platform === "linux") parts = p.split("/");

  const module = require(p);
  const lastEndpointItem = parts[parts.length - 1];
  let trueLastEndpointItem;

  if ((trueLastEndpointItem = lastEndpointItem.match(/\[(\w+)\]/)[1])) {
    // Match [\w+]
    trueLastEndpointItem = ":" + trueLastEndpointItem;
  }

  // Get endpoint
  let endpoint = "/" + trueLastEndpointItem;
  let i = parts.length - 2;
  while (rootFolder != parts[i]) {
    endpoint = "/" + parts[i] + endpoint;
    i--;
  }

  console.log("Endpoint:", endpoint);
  // Set up endpoints' handler
}

getAllPathsToFiles(endpointsPath).then((paths) => {
  for (const path of paths) {
    getModule(path);
  }
});

module.exports = {
  buildEndpoints(router) {},
};
