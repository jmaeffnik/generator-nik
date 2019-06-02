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
    ignore: ['dist']
};

let config;

switch (process.env.BABEL_ENV) {

    case 'production':
        config = Object.assign({}, baseConfig);
        config.presets.unshift('jest', 'minify');
        break;

    case 'development':
        config = Object.assign({}, baseConfig);
        break;

    case 'test':
        config = Object.assign({}, baseConfig, {
        // exclude: [
        //     /node_modules\/(?!@nj)/
        // ]
    });
        break;

}

module.exports = config;