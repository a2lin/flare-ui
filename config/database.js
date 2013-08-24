module.exports = {
    development: {
        driver:   'mongodb',
        url:      'mongodb://localhost/schedule-dev'
    },
    test: {
        driver:   'mongodb',
        url:      'mongodb://localhost/schedule-test'
    },
    production: {
        driver:   'mongodb',
        url:      'mongodb://localhost/schedule-production'
    }
};
