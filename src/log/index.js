// @ts-check
const util = require('./util');
const config = require('./config');
const logger = require('./logger');

module.exports = {
    util,
    config,
    ...logger,
};
