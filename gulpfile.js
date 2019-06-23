const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const execa = require('execa');

const SRC_DIR = 'src';
const OUT_DIR = 'build';
const TEST_RUNNER = 'jest';

/**
 * Runner for different jest environments, configurable using the JEST_ENV environment variable.
 * @param args - what arguments should be passed to the jest runner
 * @param cmd - what is the command name
 */
const runner = (args, cmd) => async env => {
    const cmdPath = path.join('node_modules', '.bin', cmd);
    return await execa(cmdPath, args, {stdio: 'inherit', env})
};

const CIJestRunner = runner(['--ci', ...process.argv.slice(3)], TEST_RUNNER);

async function clean() {

    let promises = Promise.all([
        fs.remove('junit.xml'),
        fs.remove('build'),
        fs.remove('coverage'),

    ]);

    return await promises;
}

function copyStatic() {

    const SRC_FILES = [
        'license',
        'README.md',
        'package.json',
        'src/**',
        '!**/.tmp/**'
    ];

    return gulp.src(SRC_FILES, { dot: true }).pipe(gulp.dest(OUT_DIR));
}

async function testCIUnit() {
    return await CIJestRunner({JEST_ENV: 'ci-unit'});

}

async function testCIE2e() {
    return await CIJestRunner({JEST_ENV: 'ci-e2e'});

}

const build = gulp.series(clean, copyStatic);

module.exports = {
    clean,
    build,
    copyStatic,
    testCIUnit,
    testCIE2e,
};
