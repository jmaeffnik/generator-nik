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

const build = gulp.series(clean, compile);

module.exports = {
    clean,
    build,
    compile,
};
