'use strict';

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        browsers:   ['Chrome'],
        frameworks: ['jasmine'],
        reporters:  ['mocha'],

        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: true,
        colors: true,
        port: 9876,

        basePath: '',
        files: ['webpack.karma.context.js'],
        preprocessors: { 'webpack.karma.context.js': ['webpack'] },
        exclude: [],
        webpack: {
            devtool: 'eval',
            entry: {
                main: ['./src/main.js',

                    'lodash',
                    'jquery',
                    'bootstrap',
                    'moment',
                    'fullcalendar',

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
                    'qrcode-generator/qrcode_UTF8.js',
                    //'angular-qr'
                ]
            },
            module: {
                loaders: [
                    {test: /\.js$/, loader: 'babel-loader', exclude: /(\.test.js$|node_modules)/},
                    {test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery'},
                    {test: require.resolve('moment'), loader: 'expose-loader?moment'},
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
            plugins: [
                new webpack.ProvidePlugin({
                    'window.jQuery': 'jquery'
                })
            ]
        },

        webpackMiddleware: {
            noInfo: true
        }
    });
};
