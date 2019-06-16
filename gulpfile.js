const fs = require('fs-extra');
const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const execa = require('execa');
const ts = require("gulp-typescript");

const OUT_DIR = 'build';
const TEST_RUNNER = 'jest';
const SRC_DIR = 'src';

/**
 * Source file uri builder
 *
 * @param rel - relative path to src
 * @param neg - set to true to negate the pattern
 * @returns {string}
 */
const srcFile = (rel, neg) => neg ? `!${SRC_DIR.concat('/', rel)}` : SRC_DIR.concat('/', rel);
const outFile = rel => OUT_DIR.concat('/', rel);

/**
 * Runner for different jest environments, configurable using the JEST_ENV environment variable.
 * @param args - what arguments should be passed to the jest runner
 * @param cmd - what is the command name
 */
const runner = (args, cmd) => async env => {
    const cmdPath = path.join('node_modules', '.bin', cmd);
    return await execa(cmdPath, args, {stdio: 'inherit', env})
};

const devJestRunner = runner(process.argv.slice(3), TEST_RUNNER);
const CIJestRunner = runner(['--ci', ...process.argv.slice(3)], TEST_RUNNER);

async function clean() {

    let promises = Promise.all([
        fs.remove('build'),
        fs.remove('junit.xml')
    ]);

    return await promises;
}

function compile() {

    /**
     * Where should we get our source files?
     * @type {string[]}
     */
    const SRC_FILES = [srcFile('**/*.ts'), srcFile('**/templates/**', true)];

    process.env.BABEL_ENV = 'production';
    const config = require('./babel.config');

    delete config.sourceMaps;
    delete config.ignore;

    return gulp
        .src(SRC_FILES, {sourcemaps: true})
        .pipe(babel(config))
        .pipe(gulp.dest(outFile('generators'), {sourcemaps: '.'}));
}

function tsGen() {
    const { compilerOptions } = require("./tsconfig");

    delete compilerOptions.allowJs;

    return gulp
        .src(["src/**/*.ts", "!src/**/__tests__/**", "!src/**/__mocks__/**"])
        .pipe(ts(compilerOptions))
        .dts.pipe(gulp.dest(outFile('generators')));
}


function copyStatic() {

    const SRC_FILES = [
        srcFile('**/templates/**'),
    ];

    return gulp.src(SRC_FILES).pipe(gulp.dest(outFile('generators')));
}

async function buildMeta() {
    const SRC_FILES = [
        srcFile('.npmignore'),
        'license',
        'README.md'
    ];

    const {dependencies} = require('./package');
    const buildPkg = require(path.join(__dirname, SRC_DIR, 'package.json'));

    await fs.writeJSON(
        path.join(__dirname, OUT_DIR, 'package.json'),
        Object.assign({}, {dependencies}, buildPkg),
        {spaces: 2});

    return gulp.src(SRC_FILES).pipe(gulp.dest(OUT_DIR))
}
async function testUnit() {

    return await devJestRunner({JEST_ENV: 'dev-unit'});
}

async function testE2e() {

    return await devJestRunner({JEST_ENV: 'dev-e2e'});
}

async function testCIUnit() {
    return await CIJestRunner({JEST_ENV: 'ci-unit'});

}

async function testCIE2e() {
    return await CIJestRunner({JEST_ENV: 'ci-e2e'});

}

/**
 * What set of tasks will build our project?
 * @type {Undertaker.TaskFunction}
 */
const build = gulp.series(clean, compile, copyStatic, buildMeta);

module.exports = {
    clean,
    build,
    compile,
    copyStatic,
    testUnit,
    testE2e,
    testCIUnit,
    testCIE2e,
    buildMeta
};
