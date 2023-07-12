const path = require('path')
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals')
require('dotenv').config({ path: './.env' });

module.exports = {
    entry: {
        server: './src/server.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    target: 'node',
    externals: [
        nodeExternals()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        })
    ]
}