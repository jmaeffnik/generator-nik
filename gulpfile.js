const fs = require('fs-extra');
const gulp = require('gulp');
const babel = require('gulp-babel');

async function clean() {

    let promises = Promise.all([
        fs.remove('generators'),
        fs.remove('junit.xml')
    ]);

    return await promises;
}

async function compile() {

    process.env.BABEL_ENV = 'development';
    const config = require('./babel.config');

    delete config.sourceMaps;
    delete config.ignore;

    return gulp
        .src(['src/**/*.ts', '!src/**/templates/**', '!src/**/__tests__/**'])
        .pipe(babel(config))
        .pipe(gulp.dest('generators'));
}

async function copyStatic() {

    return await fs.copy('src/app/templates', 'generators/app/templates')
}

const build = gulp.series(clean, compile, copyStatic);

module.exports = {
    clean,
    build,
    compile,
    copyStatic
};
