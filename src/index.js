// @ts-check

const arg = require('arg');
const { Manager } = require('@leverage/core');
const { HTTP } = require('@leverage/plugin-http');
const log = require('littlelog');

const cli = require('./cli');
const api = require('./api');
const plugins = require('./plugins');
const services = require('./services');
const middleware = require('./middleware');

const DEFAULT_PORT = 3000;

const main = async () => {
    /** @type {import('arg').Result<import('./cli/args')>} */
    // @ts-ignore
    const args = arg(cli.args);

    switch (args['--verbose']) {
        case 1:
            log.setVerbosity('INFO');
            break;
        case 2:
            log.setVerbosity('DEBUG');
            break;
        case 3:
            log.setVerbosity('TRACE');
            break;
    }

    if (args['--help']) {
        log.trace('Printing help message.');
        console.log(cli.help);
    } else {
        const manager = new Manager();
        const http = new HTTP();

        const port = process.env.NODE_ENV || args['--port'] || DEFAULT_PORT;

        const config = {
            is: 'component',
            type: 'args',
            config: {
                args,
            },
        };

        log.trace('Adding units to manager.');
        manager.add(
            http,
            config,
            ...middleware,
            ...plugins,
            ...services,
            ...api,
        );

        log.info(`Starting server on port "${port}".`);
        http.listen(Number(port));
    }
};

main().catch((error) => {
    console.error('Unexpected error occurred.');
    console.error(error);
});
