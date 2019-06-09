const fs = require('fs-extra');
const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const execa = require('execa');

const runner = (args, cmd) => async jestEnv => {
    const cmdPath = path.join('node_modules', '.bin', cmd);
    return await execa(cmdPath, args, {stdio: 'inherit', env: {JEST_ENV: jestEnv}})
};

const devJestRunner = runner(process.argv.slice(3), 'jest');
const CIJestRunner = runner(['--ci', ...process.argv.slice(3)], 'jest');

async function clean() {

    let promises = Promise.all([
        fs.remove('generators'),
        fs.remove('junit.xml')
    ]);

    return await promises;
}

async function compile() {

    process.env.BABEL_ENV = 'production';
    const config = require('./babel.config');

    delete config.sourceMaps;
    delete config.ignore;

    return gulp
        .src(['src/**/*.ts',],{sourcemaps:true})
        .pipe(babel(config))
        .pipe(gulp.dest('dist', {sourcemaps:'.'}));
}

async function testUnit() {

    return await devJestRunner('dev-unit');
}

async function testE2e() {

    return await devJestRunner('dev-e2e');
}

async function testCIUnit() {
    return await CIJestRunner('ci-unit');

}

async function testCIE2e() {
    return await CIJestRunner('ci-e2e');

}

const build = gulp.series(clean, compile,);

module.exports = {
    clean,
    build,
    compile,
    testUnit,
    testE2e,
    testCIUnit,
    testCIE2e
};
