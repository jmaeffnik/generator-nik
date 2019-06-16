const baseConfig = {
    presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', {targets: {node: 'current'}}]
    ],
    plugins: [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
    ],
    sourceMaps: true,
    ignore: ['build']
};

let config;

switch (process.env.BABEL_ENV) {

    case 'production':
        config = Object.assign({}, baseConfig);
        config.presets.unshift('jest');
        break;

    case 'development':
    case 'test':
        config = Object.assign({}, baseConfig);
        break;

}

module.exports = config;
