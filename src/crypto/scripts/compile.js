const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "../compiled");
fs.removeSync(buildPath);

const cubaCoinPath = path.resolve(__dirname, "../contracts", "cuba_coin.sol");
const source = fs.readFileSync(cubaCoinPath, "utf8");
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
