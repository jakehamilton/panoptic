// @ts-check

const SILENT = 0;
const INFO = 1;
const DEBUG = 2;
const TRACE = 3;

/** @typedef {{ SILENT: typeof SILENT, INFO: typeof INFO, DEBUG: typeof DEBUG, TRACE: typeof TRACE }} Config */

/** @type {Config} */
module.exports = {
    SILENT,
    INFO,
    DEBUG,
    TRACE,
};
