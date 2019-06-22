const helpers = require('yeoman-test');
const path = require('path');
const fs = require('fs-extra');

jest.setTimeout(1000 * 60 * 60);

describe("examples", function()
{

    const tmpDir = path.join(process.cwd(), '.tmp');

    beforeEach(() =>
    {
        fs.removeSync(tmpDir);
    });

    test("default", async function()
    {
        await helpers.run(path.join(__dirname, '../../app'))
            .inDir(tmpDir)
            .withPrompts({
                appName: 'app-name',
                description: 'app description'
            })

    });

});
