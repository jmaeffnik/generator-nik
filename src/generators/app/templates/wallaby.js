process.JEST_ENV = 'wallaby';
module.exports = function () {
    return {
        files: [
            '!**/node_modules/**',
            '!build/**',
            '!**/*.test.js',
            '!**/*.e2e.js',
            {pattern: '**/templates/**', instrument: false},
            {pattern: '**/__fixtures__/**', instrument: false},
            {pattern: '**/__snapshots__/**', instrument: false},
            '**/__mocks__/**',
            'src/**/*.js',
        ],
        tests: [
            '!**/node_modules/**',
            '!**/templates/**',
            'src/**/*.test.js',
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
    };
};

