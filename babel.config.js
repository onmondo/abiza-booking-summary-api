module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-typescript', { allowDeclareFields: true }],
    ],
    // plugins: ['@babel/plugin-proposal-decorators']
    plugins: [['@babel/plugin-syntax-decorators', { "version": "2023-11" }]]
};
