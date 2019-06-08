import Generator from "yeoman-generator";

interface IScaffoldMeta
{
    to: string
    from: string
    type?: 'ejs'
}

type IScaffoldManifest = IScaffoldMeta[]

export default class extends Generator
{

    /**
     * Initial custom data
     */
    _store: {
        appName: string;
        license: string;
        answers;
    };

    constructor(args, opts)
    {
        super(args, opts);
        this._store = {} as any;
        this.argument('appName', {type: String, description: 'what is the appName of the project?', required: false});
        this._store.appName = this.options.appName;
    }

    async prompting()
    {

        let baseQuestions = [];

        if(!this._store.appName)
        {
            baseQuestions.push({
                type: 'input',
                name: 'appName',
                message: 'Your package name (no word-breaks)',
            })
        }

        const answers = await this.prompt([
            ...baseQuestions,
            {
                type: 'list',
                name: 'license',
                message: 'License',
                choices: ['MIT']
            },
            {
                type: 'input',
                name: 'version',
                message: 'Initial project version',
                default: '0.1.0'
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
            }] as any);

        this._store = Object.assign(this._store, answers);

    }

    writing()
    {
        this._meta();
        this._lang();
        this._test();
        this._build();
        this._utilities();
    }

    _meta()
    {
        let scaffoldManifest: IScaffoldManifest = [
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
                from: this.templatePath('.gitignore'),
                to: this.destinationPath('.gitignore'),
            },
            {
                from: this.templatePath('.npmrc'),
                to: this.destinationPath('.npmrc'),
            },
        ];
        this._scaffold(scaffoldManifest);
    }

    _lang()
    {
        let scaffoldManifest: IScaffoldManifest = [
            {
                from: this.templatePath('babel.config.js'),
                to: this.destinationPath('babel.config.js')
            },
            {
                from: this.templatePath('tsconfig.ejs'),
                to: this.destinationPath('tsconfig.json'),
                type: "ejs"
            },
            {
                from: this.templatePath('src'),
                to: this.destinationPath('src')
            }
        ];

        this.fs.extendJSON(this.destinationPath('package.json'), {
            devDependencies: {
                "@types/node": "10.14.4",
                "@babel/core": "^7.4.5",
                "@babel/plugin-proposal-class-properties": "^7.4.4",
                "@babel/plugin-proposal-object-rest-spread": "^7.4.4",
                "@babel/preset-env": "^7.4.5",
                "@babel/preset-typescript": "^7.3.3",
                "babel-preset-minify": "^0.5.0",
                "babel-preset-jest": "^24.6.0",
                "typescript": "^3.4.5",
            }
        })

        this._scaffold(scaffoldManifest);
    }

    _test()
    {
        let scaffoldManifest: IScaffoldManifest = [
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
                "jest": "^24.8.0",
            }
        });
        this._scaffold(scaffoldManifest);
    }

    _build()
    {
        let scaffoldManifest: IScaffoldManifest = [
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

    _utilities()
    {
        let scaffoldManifest: IScaffoldManifest = [
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
                "@types/fs-extra": "^7.0.0",
                "@types/gulp": "^4.0.6",
                "@types/gulp-babel": "^6.1.29",
                "gulp-babel": "^8.0.0",
                "fs-extra": "^8.0.1",
                "gulp": "^4.0.2",
                "execa": "^1.0.0"
            }
        });

        this._scaffold(scaffoldManifest);

    }

    _scaffold(manifest: IScaffoldManifest)
    {
        for(const el of manifest)
        {

            if(el.type === "ejs")
            {
                this.fs.copyTpl(el.from, el.to, this._store);
            }
            else
            {
                this.fs.copy(el.from, el.to);
            }

        }
    }

    install()
    {
        this.npmInstall()
    }
}
