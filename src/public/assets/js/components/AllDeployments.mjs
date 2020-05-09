'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from '../hooks/useCSS.mjs';

import Namespace from './Namespace.mjs';

const AllDeployments = ({ resources }) => {
    useCSS(`
        .deployments {
            display: flex;
            flex-direction: column;

            width: 100%;
            max-width: 1024px;

            margin: 0 auto;
            margin-bottom: 2rem;
            padding: 1rem;
        }
    `);

    const renderNamespaces = () => {
        const namespaces = Object.keys(resources);

        return namespaces.map(
            (namespace) => html`
                <${Namespace}
                    namespace="${namespace}"
                    deployments="${resources[namespace].deployments}"
                    services="${resources[namespace].services}"
                    ingressroutes="${resources[namespace].ingressroutes}"
                />
            `,
        );
    };

    return html`<div class="deployments">${renderNamespaces()}</div>`;
};

export default AllDeployments;
