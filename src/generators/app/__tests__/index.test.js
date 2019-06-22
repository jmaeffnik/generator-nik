jest.mock('yeoman-generator', () => {

    return class {

        constructor({args, opts}) {
            this.options = opts || {};

        }

        argument(arg, values) {

            this.options[arg] = values;
        }
    }
});

const Generator = require('../');
const generator = new Generator({});

// TODO: Figure out how to best unit test yeoman...
describe.skip("examples", function()
{


    test("writing", function()
    {
        expect(true).toBeTruthy();
    });

});

describe("definitions", function () {

    test.each([
        'install'
    ])("properties", function (prop) {

        expect(generator).toHaveProperty(prop);
    });
});
