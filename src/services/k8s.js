const log = require('littlelog');
const { Service } = require('@leverage/core');
const { Client } = require('kubernetes-client');

const util = require('../util');

class K8s extends Service {
    name = 'k8s';
    config = {
        dependencies: {
            plugins: ['args'],
        },
    };

    constructor() {
        super();

        this.state = {};

        log.info('Creating Kubernetes client.');
        this.client = new Client();

        util.microtask(() => {
            this.initialize();
        });
    }

    async initialize() {
        const { args } = this.plugins.args.config;

        const pollingDelay = Number(
            process.env.POLLING_DELAY ||
                args['--polling-delay'] ||
                1000 * 60 * 5,
        );

        await this.client.loadSpec();

        try {
            this.update();
        } catch (error) {
            log.info('Error retrieving information from Kubernetes API.');
            log.info(error);
        }

        setInterval(() => {
            try {
                this.update();
            } catch (error) {
                log.info('Error retrieving information from Kubernetes API.');
                log.info(error);
            }
        }, pollingDelay);
    }

    async update() {
        log.debug('Polling Kubernetes for new data.');
        const { args } = this.plugins.args.config;

        log.debug('Requesting namespaces.');
        const namespaces = (
            await this.client.api.v1.namespaces.get()
        ).body.items.filter((namespace) => {
            const name = namespace.metadata.name;

            if (args['--namespace-allow']) {
                if (args['--namespace-deny']) {
                    return (
                        !util.inside(name, args['--namespace-deny']) &&
                        util.inside(name, args['--namespace-allow'])
                    );
                } else {
                    return util.inside(name, args['--namespace-allow']);
                }
            } else if (args['--namespace-deny']) {
                return !util.inside(name, args['--namespace-deny']);
            } else {
                return true;
            }
        });

        log.debug('Requesting deployments.');
        const resources = await Promise.all(
            namespaces.map(async (namespace) => {
                const deployments = (
                    await this.client.apis.apps.v1
                        .namespaces(namespace.metadata.name)
                        .deployments.get()
                ).body.items.filter((deployment) => {
                    const name = namespace.metadata.name;

                    if (args['--deployment-allow']) {
                        if (args['--deployment-deny']) {
                            return (
                                !util.inside(name, args['--deployment-deny']) &&
                                util.inside(name, args['--deployment-allow'])
                            );
                        } else {
                            return util.inside(
                                name,
                                args['--deployment-allow'],
                            );
                        }
                    } else if (args['--deployment-deny']) {
                        return !util.inside(name, args['--deployment-deny']);
                    } else {
                        return true;
                    }
                });

                return {
                    namespace,
                    deployments,
                };
            }),
        );

        log.trace('Updating Kubernetes state.');
        this.state = resources.reduce((state, resource) => {
            state[resource.namespace.metadata.name] = {
                deployments: resource.deployments,
            };

            return state;
        }, {});
    }
}

module.exports = K8s;
