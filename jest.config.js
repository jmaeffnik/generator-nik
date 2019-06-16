process.env.BABEL_ENV = "test";

const CI_ROOT = "build";
const SRC_ROOT = "src";
const E2E_TESTMATCH = ["**/__tests__/**/*.e2e.[jt]s?(x)"];
const UNIT_TESTMATCH = ["**/__tests__/**/*.test.[jt]s?(x)"];
let config = {};

let base = {
    modulePathIgnorePatterns: ["templates", ".tmp"]
};

const pkg = require("./package");
const modules = `^${pkg.name}/(.*)`;
const main = `^${pkg.name}$`;

let ciBase = {
    rootDir: CI_ROOT,
    transform: {},
    reporters: ["default", "jest-junit"],
    moduleNameMapper: {
        [modules]: "<rootDir>/$1",
        [main]: "<rootDir>"
    },
    moduleFileExtensions: ["js", "json"]
};

let devBase = {
    rootDir: SRC_ROOT,
    moduleNameMapper: {
        [modules]: "<rootDir>/$1",
        [main]: "<rootDir>"
    }
};

let wallabyBase = {
    moduleNameMapper: {
        [modules]: "<rootDir>/src/$1",
        [main]: "<rootDir>/src"
    }
};

switch (process.env.JEST_ENV) {
    case "ci-unit":
        config = { ...base, ...ciBase, testMatch: UNIT_TESTMATCH };
        break;

    case "ci-e2e":
        config = { ...base, ...ciBase, testMatch: E2E_TESTMATCH };
        break;

    case "dev-unit":
        config = { ...base, ...devBase, testMatch: UNIT_TESTMATCH };
        break;

    case "dev-e2e":
        config = { ...base, ...devBase, testMatch: E2E_TESTMATCH };
        break;

    case "wallaby":
        config = { ...base, ...wallabyBase, testMatch: UNIT_TESTMATCH };
        break;

    default:
        throw new Error(`JEST_ENV variable not set to correct value...`);
}

module.exports = config;
