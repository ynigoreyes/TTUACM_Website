/* eslint-disable */

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

MaterialModule = require('@angular/material');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('@angular/material')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    browsers: ['Chrome'],
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    import: [MaterialModule],
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false
  });
};
