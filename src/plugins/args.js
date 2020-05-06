// @ts-check
const log = require('littlelog');
const { Plugin } = require('@leverage/core');

class Args extends Plugin {
    type = 'args';
    config = {
        args: {},
    };

    args(component) {
        if (component.config && component.config.args) {
            log.trace('Using new configuration.');
            log.trace(JSON.stringify(component.config.args, null, 2));
            this.config.args = component.config.args;
        } else {
            log.info('Invalid args component');
            log.info(component);
        }
    }
}

module.exports = Args;
