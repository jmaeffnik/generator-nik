const Generator = require('yeoman-generator');
module.exports = class extends Generator {

    /**
     * Initial custom data
     */

    constructor(args, opts) {
        super(args, opts);
        this._store = {};
        this.argument('appName', {type: String, description: 'what is the appName of the project?', required: false});
        this._store.appName = this.options.appName;
    }

    async prompting() {

        let baseQuestions = [];

        if (!this._store.appName) {
            baseQuestions.push({
                type: 'input',
                name: 'appName',
                message: 'Your package name (no word-breaks)',
            })
        }

        const answers = await this.prompt([
            ...baseQuestions,
            {
                type: 'input',
                name: 'version',
                message: 'Initial project version',
                default: '0.1.0'
            },
            {
                type: 'input',
                name: 'description',
                message: 'What is the project description?',
                default: 'TBD...'
            },
            {
                type: 'input',
                name: 'author',
                message: 'Your name',
                default: 'nikkij'
            },
            {
                type: 'input',
                name: 'email',
                message: 'Your email address',
                default: 'nik@nikkij.me'
            },
            {
                type: 'confirm',
                name: 'runInstall',
                message: 'Would you like to install dependencies?',
                default: true
            }]);

        this._store = Object.assign(this._store, answers);

    }

    writing() {
        this._meta();
        this._lang();
        this._test();
        this._build();
        this._utilities();
    }

    _meta() {
        let scaffoldManifest = [
            {
                from: this.templatePath('package.ejs'),
                to: this.destinationPath('package.json'),
                type: "ejs"
            },
            {
                from: this.templatePath('README.ejs'),
                to: this.destinationPath('README.md'),
                type: "ejs"
            },
            {
                from: this.templatePath('template.gitignore'),
                to: this.destinationPath('.gitignore'),
            },
            {
                from: this.templatePath('.npmrc'),
                to: this.destinationPath('.npmrc'),
            },
            {
                from: this.templatePath('license'),
                to: this.destinationPath('license'),
                type: "ejs"
            },
        ];
        this._scaffold(scaffoldManifest);
    }

    _lang() {
        let scaffoldManifest = [
            {
                from: this.templatePath('src'),
                to: this.destinationPath('src')
            }
        ];

        this.fs.extendJSON(this.destinationPath('package.json'), {
            devDependencies: {
                "@types/node": "10.14.4",
            }
        });

        this._scaffold(scaffoldManifest);
    }

    _test() {
        let scaffoldManifest = [
            {
                from: this.templatePath('wallaby.js'),
                to: this.destinationPath('wallaby.js')
            },
            {
                from: this.templatePath('jest.config.js'),
                to: this.destinationPath('jest.config.js')
            },
        ];

        this.fs.extendJSON(this.destinationPath('package.json'), {
            devDependencies: {
                "@types/jest": "^24.0.13",
                "jest-junit": "^6.4.0",
                "jest": "^24.8.0",
            }
        });
        this._scaffold(scaffoldManifest);
    }

    _build() {
        let scaffoldManifest = [
            {
                from: this.templatePath('.azure-pipelines.yml'),
                to: this.destinationPath('.azure-pipelines.yml')
            },
            {
                from: this.templatePath('.azure-pipelines'),
                to: this.destinationPath('.azure-pipelines')
            }
        ];

        this._scaffold(scaffoldManifest);
    }

    _utilities() {
        let scaffoldManifest = [
            {
                from: this.templatePath('gulpfile.js'),
                to: this.destinationPath('gulpfile.js')
            },
            {
                from: this.templatePath('.editorconfig'),
                to: this.destinationPath('.editorconfig')
             },

        ];

        this.fs.extendJSON(this.destinationPath('package.json'), {
            devDependencies: {
                "fs-extra": "^8.0.1",
                "gulp": "^4.0.2",
                "execa": "^1.0.0"
            }
        });

        this._scaffold(scaffoldManifest);

    }

    _scaffold(manifest) {
        for (const el of manifest) {

            if (el.type === "ejs") {
                this.fs.copyTpl(el.from, el.to, this._store);
            } else {
                this.fs.copy(el.from, el.to);
            }

        }
    }

    install() {
        if (this._store.runInstall) {
            this.npmInstall();
        }
    }
}
