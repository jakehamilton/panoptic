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
        const namespaces = await this.getNamespaces();

        log.debug('Requesting deployments.');
        const deployments = await this.getDeployments(namespaces);

        log.debug('Requesting services.');
        const services = await this.getServices(namespaces);

        log.debug('Requesting ingress.');
        const ingressroutes = await this.getIngressRoutes(namespaces);

        log.trace('Updating Kubernetes state.');
        for (const namespace of namespaces) {
            const { name } = namespace.metadata;

            this.state[name] = {
                metadata: namespace.metadata,
                deployments: deployments[name],
                services: services[name],
                ingressroutes: ingressroutes[name],
            };
        }

        return;
    }

    async getNamespaces() {
        const { args } = this.plugins.args.config;
        const namespaces = [];

        const response = await this.client.api.v1.namespaces.get();

        for (const namespace of response.body.items) {
            const { name } = namespace.metadata;

            if (
                args['--namespace-deny'] &&
                util.inside(name, args['--namespace-deny'])
            ) {
                // skip this name since it is blocked
                continue;
            }

            if (
                args['--namespace-allow'] &&
                !util.inside(name, args['--namespace-allow'])
            ) {
                // skip this name since it is not allowed
                continue;
            }

            // the namespace is valid if we got here, add it to the list
            namespaces.push(namespace);
        }

        return namespaces;
    }

    async getServices(namespaces) {
        const { args } = this.plugins.args.config;
        const services = {};

        if (!namespaces) {
            namespaces = await this.getNamespaces();
        }

        if (!Array.isArray(namespaces)) {
            namespaces = [namespaces];
        }

        for (const namespace of namespaces) {
            services[namespace.metadata.name] = [];
        }

        for (const namespace of namespaces) {
            const response = await this.client.api.v1
                .namespaces(namespace.metadata.name)
                .services.get();

            for (const service of response.body.items) {
                const { name } = service.metadata;

                if (
                    args['--service-deny'] &&
                    util.inside(name, args['--service-deny'])
                ) {
                    // skip this name since it is blocked
                    continue;
                }

                if (
                    args['--service-allow'] &&
                    !util.inside(name, args['--service-allow'])
                ) {
                    // skip this name since it is not allowed
                    continue;
                }

                // the deployment is valid if we got here, add it to the list
                services[namespace.metadata.name].push(service);
            }
        }

        return services;
    }

    async getDeployments(namespaces) {
        const { args } = this.plugins.args.config;
        const deployments = {};

        if (!namespaces) {
            namespaces = await this.getNamespaces();
        }

        if (!Array.isArray(namespaces)) {
            namespaces = [namespaces];
        }

        for (const namespace of namespaces) {
            deployments[namespace.metadata.name] = [];
        }

        for (const namespace of namespaces) {
            const response = await this.client.apis.apps.v1
                .namespaces(namespace.metadata.name)
                .deployments.get();

            for (const deployment of response.body.items) {
                const { name } = deployment.metadata;

                if (
                    args['--deployment-deny'] &&
                    util.inside(name, args['--deployment-deny'])
                ) {
                    // skip this name since it is blocked
                    continue;
                }

                if (
                    args['--deployment-allow'] &&
                    !util.inside(name, args['--deployment-allow'])
                ) {
                    // skip this name since it is not allowed
                    continue;
                }

                // the deployment is valid if we got here, add it to the list
                deployments[namespace.metadata.name].push(deployment);
            }
        }

        return deployments;
    }

    async getIngressRoutes(namespaces) {
        const { args } = this.plugins.args.config;
        const ingressroutes = {};

        if (!namespaces) {
            namespaces = await this.getNamespaces();
        }

        if (!Array.isArray(namespaces)) {
            namespaces = [namespaces];
        }

        for (const namespace of namespaces) {
            ingressroutes[namespace.metadata.name] = [];
        }

        for (const namespace of namespaces) {
            const response = await this.client.apis[
                'traefik.containo.us'
            ].v1alpha1
                .namespaces(namespace.metadata.name)
                .ingressroutes.get();

            for (const ingressroute of response.body.items) {
                const { name } = ingressroute.metadata;

                if (
                    args['--ingress-deny'] &&
                    util.inside(name, args['--ingress-deny'])
                ) {
                    // skip this name since it is blocked
                    continue;
                }

                if (
                    args['--ingress-allow'] &&
                    !util.inside(name, args['--ingress-allow'])
                ) {
                    // skip this name since it is not allowed
                    continue;
                }

                // the deployment is valid if we got here, add it to the list
                ingressroutes[namespace.metadata.name].push(ingressroute);
            }
        }

        return ingressroutes;
    }
}

module.exports = K8s;
