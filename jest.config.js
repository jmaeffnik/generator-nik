const CI_ROOT = "build";
const SRC_ROOT = "src";
const E2E_TESTMATCH = ["**/__tests__/**/*.e2e.[jt]s?(x)"];
const UNIT_TESTMATCH = ["**/__tests__/**/*.test.[jt]s?(x)"];
const rooter = arr => root => arr.map((file) => `<rootDir>/${root}/${file}`);
const e2e = rooter([E2E_TESTMATCH]);
const unit = rooter(UNIT_TESTMATCH);


let config = {};
const moduleNameMapper = {
};

let base = {
    modulePathIgnorePatterns: ["templates", ".tmp"],
    collectCoverage: true
};

let ciBase = {
    transform: {},
    reporters: ["default", "jest-junit"],
    moduleNameMapper
};

let devBase = {
    moduleNameMapper
};

let wallabyBase = {
    moduleNameMapper
};

switch (process.env.JEST_ENV) {
    case "ci-unit":
        config = { ...base, ...ciBase, testMatch: unit(CI_ROOT)};
        break;

    case "ci-e2e":
        config = { ...base, ...ciBase, testMatch: e2e(CI_ROOT) };
        break;

    case "dev-unit":
        config = { ...base, ...devBase, testMatch: unit(SRC_ROOT) };
        break;

    case "dev-e2e":
        config = { ...base, ...devBase, testMatch: e2e(SRC_ROOT) };
        break;

    case "wallaby":
        config = { ...base, ...wallabyBase, testMatch: unit(SRC_ROOT) };
        break;

    default:
        throw new Error(`JEST_ENV variable not set to correct value...`);
}

module.exports = config;
