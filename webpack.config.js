var webpack = require('webpack');
module.exports = {
    entry: [
      "./index.js"
    ],
    output: {
        path: './build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ["babel"], exclude: /node_modules/ },
            {
                test: /\.less$/,
                loader: "style!css!less"
            }
        ]
    }
};