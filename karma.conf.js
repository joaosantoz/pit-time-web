module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-spec-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    mime: {
      'text/x-typescript': ['ts']
    },

    files: [
      { pattern: 'src/**/*.ts', type: 'module', included: false },
      { pattern: 'src/**/*.spec.ts', type: 'module' }
    ],

    preprocessors: {
      'src/app/**/!(*.spec|*.mock|*.module).ts': ['coverage']
    },

    client: {
      jasmine: {
        random: false,
        failFast: true
      },
      clearContext: false
    },

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/pit-time-web'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcovonly' }],
      includeAllSources: true,
      instrumenterOptions: {
        istanbul: {
          preserveComments: true,
          noCompact: true,
          produceSourceMap: true,
          ignoreClassMethods: []
        }
      },
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      },
      watermarks: {
        statements: [50, 75],
        functions: [50, 75],
        branches: [50, 75],
        lines: [50, 75]
      }
    },

    reporters: ['spec', 'progress', 'kjhtml', 'coverage'],
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};
