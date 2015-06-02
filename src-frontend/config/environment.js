/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'src-frontend',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  var enableLogging = false;

  if (environment === 'development') {
    ENV.APP.API_HOST = 'http://localhost:8000';
    ENV.APP.API_NAMESPACE = 'api';
    ENV.APP.LOG_RESOLVER = enableLogging;
    ENV.APP.LOG_ACTIVE_GENERATION = enableLogging;
    ENV.APP.LOG_TRANSITIONS = enableLogging;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = enableLogging;
    ENV.APP.LOG_VIEW_LOOKUPS = enableLogging;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.API_HOST = 'https://sanaprotocolbuilder.me';
    ENV.APP.API_NAMESPACE = 'api';
  }

  return ENV;
};
