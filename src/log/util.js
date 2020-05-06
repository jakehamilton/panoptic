// @ts-check
const config = require('./config');

/**
 *
 * @typedef {import('./config')} LogLevels
 */

/**
 *
 * @returns {LogLevels['SILENT'] | LogLevels['INFO'] | LogLevels['DEBUG'] | LogLevels['TRACE']}
 */
const getVerbosity = () => {
    switch (process.env.LOG_LEVEL) {
        default:
        case 'SILENT':
            return 0;
        case 'INFO':
            return 1;
        case 'DEBUG':
            return 2;
        case 'TRACE':
            return 3;
    }
};

module.exports = {
    getVerbosity,
};
