var webpack = require('webpack');

// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config) {
    config.set({
        frameworks: [
            // Reference: https://github.com/karma-runner/karma-jasmine
            // Set framework to jasmine
            'jasmine'
        ],
        
        reporters: [
            // Reference: https://github.com/mlex/karma-spec-reporter
            // Set reporter to print detailed results to console
            'spec',
            
            // Reference: https://github.com/karma-runner/karma-coverage
            // Output code coverage files
            'coverage'
        ],
        
        files: [
            // Grab all files in the app folder that contain .test.
            'src/tests.webpack.js'
        ],
        
        preprocessors: {
            // Reference: http://webpack.github.io/docs/testing.html
            // Reference: https://github.com/webpack/karma-webpack
            // Convert files with webpack and load sourcemaps
            'src/tests.webpack.js': ['webpack', 'sourcemap']
        },
        
        browsers: [
            // Run tests using Chrome/Chromium
            'Chrome'
        ],
        
        singleRun: true,
        
        // Configure code coverage reporter
        coverageReporter: {
            dir: 'build/coverage/',
            type: 'html'
        },
        
        webpack: {
            devtool: 'eval',
            module: {
                loaders: [
                    {test: /\.js$/, loader: 'babel-loader', exclude: /(\.test.js$|node_modules)/},
                    {test: /\.css$/, loader: 'style!css-loader'},
                    {test: /\.tpl.html/, loader: 'html-loader'},
                    {test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, loader: 'url-loader?limit=50000'}
                ]
            },
            plugins: [
                new webpack.LoaderOptionsPlugin({
                   debug: true
                }),
                new webpack.ProvidePlugin({
                    'window.jQuery': 'jquery'
                })
            ]
        }
    });
};
