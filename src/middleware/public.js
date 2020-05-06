const path = require('path');
const log = require('littlelog');
const express = require('express');
const { Middleware } = require('@leverage/core');

const PUBLIC_FILES = path.resolve(__dirname, '../public');

class Public extends Middleware {
    type = 'http';

    http({ app }) {
        log.trace('Adding static file serving middleware.');
        app.use('/', express.static(PUBLIC_FILES));
    }
}

module.exports = Public;
