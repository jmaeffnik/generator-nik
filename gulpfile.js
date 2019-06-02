const fs = require('fs-extra');

async function clean() {

    let promises = Promise.all([
        fs.remove('dist'),
        fs.remove('junit.xml')
    ]);

    return await promises;
}

module.exports = {
    clean,
};
