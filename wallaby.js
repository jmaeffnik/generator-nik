process.env.BABEL_ENV = 'test';

module.exports = function (wallaby) {
    return {
        files: [
            '!**/node_modules/**',
            '!dist/**',
            '!**/*.test.ts',
            {pattern: '**/__fixtures__/**', instrument: false},
            {pattern: '**/__snapshots__/**', instrument: false},
            '**/__mocks__/**',
            'src/**/*.ts',
        ],
        tests: [
            '!**/node_modules/**',
            '**/*.test.ts',
        ],
        filesWithNoCoverageCalculated: [
            '**/__mocks__/**',
            '**/__fixtures__/**',
        ],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest',

        compilers: {
            '**/*.ts?(x)': wallaby.compilers.babel()
        },

        // setup: function (wallaby) {
        //     let jestConfig = require('./jest.config2');
        //     wallaby.testFramework.configure(jestConfig);
        // }
    };
};

