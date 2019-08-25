const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'source-map',
    target: 'electron-main',

    output: {
        path: path.resolve(__dirname, '../build/dist'),
        publicPath: '',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
    },
    mode: 'production',


    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
            __DEVELOPMENT__: false,
        }),
        new ExtractTextPlugin('bundle.css'),
        new CopyWebpackPlugin([
            {
              from: 'index.html',
              to: path.resolve(__dirname, '../build'),
            },
        ]),
        new CopyWebpackPlugin([
            {
              from: 'server.js',
              to: path.resolve(__dirname, '../build'),
            },
        ]),
        new CopyWebpackPlugin([
            {
              from: 'electron-app.js',
              to: path.resolve(__dirname, '../build'),
            },
        ]),
        new CopyWebpackPlugin([
            {
              from: 'package.json',
              to: path.resolve(__dirname, '../build'),
            },
        ]),
    ],
};
