process.env.BABEL_ENV = "test";
process.env.JEST_ENV = "wallaby";

module.exports = function(wallaby) {
  return {
    files: [
      "!**/node_modules/**",
      "!dist/**",
      "!**/*.test.ts",
      "!**/*.e2e.ts",
      "!src/**/*.d.ts",
      {pattern: "**/__fixtures__/**", instrument: false},
      {pattern: "**/__snapshots__/**", instrument: false},
      "**/__mocks__/**",
      "src/**/*.ts"
    ],
    tests: ["!**/node_modules/**", "**/*.test.ts"],
    filesWithNoCoverageCalculated: ["**/__mocks__/**", "**/__fixtures__/**"],

    env: {
      type: "node",
      runner: "node"
    },

    testFramework: "jest",

    compilers: {
      "**/*.ts?(x)": wallaby.compilers.babel()
    }

  };
};
