const pkgname = 'vongform';

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const outputFile = pkgname + '.js';

const PROJECT_ROOT = __dirname;
// Corresponds to npm script run (e.g. 'npm run <cmd-here>')
const CMD = process.env.npm_lifecycle_event || 'dev';
// Map scripts to a build profile, 'npm run build' => build, all others
// default to 'dev' for now.
const BUILD_PROFILE = (function (cmd) {
    switch (cmd) {
        case 'build': return 'build';
        default: return 'dev';
    }
})(CMD);

console.log("Build Profile: '" + BUILD_PROFILE + "'");

const common = {
    entry: path.resolve(PROJECT_ROOT, 'src'),
    devtool: 'source-map',
    target: 'node',
    // don't try to bundle code in node_modules
    externals: [nodeExternals()],
    output: {
        path: path.resolve(PROJECT_ROOT, 'lib'),
        filename: outputFile,
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
        ]
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            // Allow using npm link or similar in 'deps' folder to supply
            // vendor-deps (outside of npm registry)
            path.resolve(PROJECT_ROOT, 'deps'),
            path.resolve(PROJECT_ROOT, 'node_modules')
        ],
        alias: {
            "@": path.resolve(__dirname)
        }
    }
};

if (BUILD_PROFILE === 'dev') {
    module.exports = merge(common, {
        output: {
            filename: pkgname + '.js'
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: false,
                debug: true
            }),
            //do not emit erroneous assets
            new webpack.NoEmitOnErrorsPlugin(),
        ]
    })
} else if (BUILD_PROFILE === 'build') {
    module.exports = merge(common, {
        output: {
            filename: pkgname + '.min.js'
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                sourceMap: false
            })
        ]
    })
}