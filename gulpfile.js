const execa = require('execa');
const fs = require('fs-extra');
const gulp = require('gulp');


async function clean() {

    let promises = Promise.all([
        fs.remove('generators'),
        fs.remove('junit.xml')
    ]);

    return await promises;
}

async function tsc() {

    return await execa('./node_modules/.bin/babel src -o generators');
}

async function copyStatic() {

    return await fs.copy('src/app/templates', 'generators/app/templates')
}

const build = gulp.series(clean, tsc, copyStatic);

module.exports = {
    clean,
    build,
    tsc,
    copyStatic
};
