'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from '../hooks/useCSS.mjs';
import useTheme from '../hooks/useTheme.mjs';

import DeploymentLabel from './DeploymentLabel.mjs';
import DeploymentIngressLabel from './DeploymentIngressLabel.mjs';

const Deployment = ({ deployment, ingressroutes }) => {
    const theme = useTheme();

    useCSS(`
        .deployment {
            display: grid;
            grid-template: 2fr / max-content 1fr;
            grid-row-gap: 0.5rem;
            grid-column-gap: 1rem;
            width: 100%;
            padding: 1rem;

            border-radius: 0.25rem;
            box-shadow: ${theme.shadows[1]};
        }

        .deployment__name {
            font-size: 1.15rem;
            font-weight: bold;
        }

        .deployment__ingress-labels {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-start;
        }

        .deployment__labels {
            display: flex;
            flex-wrap: wrap;
            grid-area: 2 / span 2;
        }
    `);

    const renderIngressLabels = () => {
        return ingressroutes
            .map((ingressroute) =>
                ingressroute.spec.routes.map(
                    (route) =>
                        html`
                            <${DeploymentIngressLabel}
                                entrypoints="${ingressroute.spec.entryPoints}"
                                route="${route}"
                            />
                        `,
                ),
            )
            .flat();
    };

    const renderLabels = () => {
        const keys = Object.keys(deployment.metadata.labels);

        return keys.map(
            (name) =>
                html`
                    <${DeploymentLabel}
                        name="${name}"
                        value="${deployment.metadata.labels[name]}"
                    />
                `,
        );
    };

    return html`
        <div class="deployment">
            <div class="deployment__name">
                ${deployment.metadata.name}
            </div>
            <div class="deployment__ingress-labels">
                ${renderIngressLabels()}
            </div>
            <div class="deployment__labels">
                ${renderLabels()}
            </div>
        </div>
    `;
};

export default Deployment;
