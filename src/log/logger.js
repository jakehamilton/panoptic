// @ts-check
const chalk = require('chalk');

const util = require('../util');
const logUtil = require('./util');

/**
 * @typedef {import('./config')} LogLevels
 */

/**
 * Get the prefix for a log.
 *
 * @param {LogLevels['SILENT'] | LogLevels['INFO'] | LogLevels['DEBUG'] | LogLevels['TRACE']} level
 * @returns {string} prefix
 */
const getLogPrefix = (level) => {
    switch (level) {
        case 0:
            return '';
        case 1:
            return chalk`{blueBright.bold [INFO]} `;
        case 2:
            return chalk`{yellow.bold [DEBUG]} `;
        case 3:
            return chalk`{bold [TRACE]} `;
    }
};

/**
 * @type {LogLevels['SILENT'] | LogLevels['INFO'] | LogLevels['DEBUG'] | LogLevels['TRACE']}
 */
let verbosity = logUtil.getVerbosity();

/**
 * Create an info logger for a log level.
 *
 * @param {number} level
 * @returns {void}
 */
const setVerbosity = (level) => {
    if (level !== 0) {
        // @ts-ignore
        verbosity = util.range(1, 3, level);
    }
};

/**
 * Create an info logger for a log level.
 *
 * @param {LogLevels['SILENT'] | LogLevels['INFO'] | LogLevels['DEBUG'] | LogLevels['TRACE']} level
 */
const logger = (level) => {
    /**
     * Log a message to stdout.
     *
     * @param {string} message
     */
    const logger = (message) => {
        if (verbosity >= level) {
            console.log(chalk`${getLogPrefix(level)}${message}`);
        }
    };

    return logger;
};

module.exports = {
    setVerbosity,
    silent: logger(0),
    info: logger(1),
    debug: logger(2),
    trace: logger(3),
};
