var _ = require('lodash');
var minimist = require('minimist');
var chalk = require('chalk');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');

var PARAMS_DEFAULT = {
    resolve: {
        extensions: ['.js', '.tpl.html', '.css', '.json', '.scss', '.svg', '.ttf', '.woff'],
        alias: {
            'angular': __dirname + '/node_modules/angular',
            //'angular-schema-form':           '../node_modules/angular-schema-form',
            'angular-schema-form': __dirname + '/node_modules/angular-schema-form/dist/schema-form.js'
            //'spectrum': '../node_modules/spectrum-colorpicker'
            //'angular-schema-form-bootstrap': '../node_modules/angular-schema-form-bootstrap/bootstrap-decorator.js'
        }
    },
    target: 'web',
    entry: {
        main: './src/main.js',
        vendor: [
            'lodash',
            'jquery',
            'bootstrap',
            
            'angular',
            'angular-aria',
            
            'angular-animate',
            'angular-sanitize',
            
            'objectpath',
            
            'angular-clipboard/angular-clipboard.js',
            
            'angular-strap/dist/angular-strap.js',
            'angular-strap/dist/angular-strap.tpl.js',
            
            'humanize-duration',
            'c3',
            'qrcode-generator/qrcode_UTF8.js'
            //'angular-qr'
        ]
    },
    output: {
        filename: '[name].[chunkhash].js',
        sourceMapFilename: '[name].[chunkhash].map'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            c3: 'c3',
            qrcode: 'qrcode-generator',
        }),
    
    ],
    devServer: {
        port: 8081,
        host: '0.0.0.0'
    },
};
var PARAMS_PER_TARGET = {
    DEV: {
        devtool: 'eval',
        output: {
            filename: '[name].js'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.SourceMapDevToolPlugin({filename: '[file].map'}),
            new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
            //new OpenBrowserWebpackPlugin({
            //    url: 'http://localhost:' + PARAMS_DEFAULT.devServer.port
            //})
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        ]
    },
    BUILD: {
        output: {
            path: __dirname + '/build'
        },
        devtool: 'eval',
        plugins: [
            new CleanWebpackPlugin(['build']),
            new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.[chunkhash].js'}),
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        ]
    },
    DIST: {
        output: {
            path: __dirname + '/dist',
            publicPath: '/hfos-frontend/'
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.[chunkhash].js'}),
            new webpack.optimize.UglifyJsPlugin({
                mangle: false
            })
        ]
    }
};
var TARGET = minimist(process.argv.slice(2)).TARGET || 'BUILD';
//var target = 'web';
var params = _.merge(PARAMS_DEFAULT, PARAMS_PER_TARGET[TARGET], _mergeArraysCustomizer);

_printBuildInfo(params);

module.exports = {
    resolve: params.resolve,
    entry: params.entry,
    output: params.output,
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /(\.test.js$|node_modules)/},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.tpl.html/, loader: 'html-loader', exclude: /(index.html)/},
            {test: /\.json/, loader: 'json-loader'},
            //{test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader'}, //  url?limit=50000'}
            {test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff(2)).*$/, loader: 'file-loader'},
            {test: /[\/]angular\.js$/, loader: "exports-loader?angular"},
            {test: /\.scss/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
            {
                test: require.resolve('tinymce/tinymce'),
                loaders: [
                    'exports-loader?window.tinymce',
                    'imports-loader?this=>window'
                ]
            },
            {
                test: /tinymce\/(themes|plugins)\//,
                loaders: [
                    'exports-loader?window.tinymce',
                    'imports-loader?this=>window'
                ]
            }
        ]
    },
    plugins: params.plugins,
    devServer: params.devServer,
    devtool: params.devtool,
};

function _printBuildInfo(params) {
    console.log('\nStarting ' + chalk.bold.green('"' + TARGET + '"') + ' build');
    if (TARGET === 'DEV') {
        console.log('Dev server: ' +
            chalk.bold.yellow('http://localhost:' + params.devServer.port + '/webpack-dev-server/index.html') + '\n\n');
    } else {
        console.log('\n\n');
    }
}

function _mergeArraysCustomizer(a, b) {
    if (_.isArray(a)) {
        return a.concat(b);
    }
}
