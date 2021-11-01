const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const dev = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        open: true,
        port: 8000
    }
};

module.exports = merge(common, dev);
