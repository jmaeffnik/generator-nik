const fs = require('fs-extra');
const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const execa = require('execa');

async function run(cmd) {
    const cmdPath = path.join('node_modules', '.bin', cmd);
    return await execa(cmdPath,{stdio: 'inherit'})
}

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
        .src(['src/**/*.ts', '!src/**/templates/**'], )
        .pipe(babel(config))
        .pipe(gulp.dest('generators', ));
}

async function copyStatic() {

    await fs.copy('src/app/templates', 'generators/app/templates');
    return await fs.copy('src/.npmignore','generators/.npmignore')
}

async function testUnit() {

    process.env.JEST_ENV = 'dev-unit';

    return await run('jest');
}

async function testE2e() {
    process.env.JEST_ENV = 'dev-e2e';

    return await run('jest');
}

async function testCIUnit() {

    process.env.JEST_ENV = 'ci-unit';

    return await run('jest');
}

async function testCIE2e() {

    process.env.JEST_ENV = 'ci-e2e';

    return await run('jest');

}
const build = gulp.series(clean, compile, copyStatic);

module.exports = {
    clean,
    build,
    compile,
    copyStatic,
    testUnit,
    testE2e,
    testCIUnit,
    testCIE2e
};
