import helpers from "yeoman-test";
import * as path from "path";
import * as fs from "fs-extra";

jest.setTimeout(1000 * 60 * 60);

describe("examples", function()
{

    const tmpDir = path.join(__dirname, '.tmp');

    beforeEach(() =>
    {
        fs.removeSync(tmpDir);
    });

    test("default", async function()
    {
        await helpers.run(path.join(__dirname, '../../app'))
            .inDir(tmpDir)

    });

});
