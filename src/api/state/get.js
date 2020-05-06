const log = require('littlelog');
const { Component } = require('@leverage/core');

class GetState extends Component {
    type = 'http';
    config = {
        http: {
            method: 'get',
            path: '/api/state',
        },
        dependencies: {
            plugins: ['args'],
            services: ['k8s'],
        },
    };

    async http(req, res) {
        log.info(
            `${this.config.http.method.toUpperCase()} ${this.config.http.path}`,
        );
        const { state } = this.services.k8s;

        res.json(state);
    }
}

module.exports = GetState;
