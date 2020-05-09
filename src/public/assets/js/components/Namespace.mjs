'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from '../hooks/useCSS.mjs';
import useTheme from '../hooks/useTheme.mjs';
import * as k8s from '../util/k8s.mjs';

import Deployment from './Deployment.mjs';

const Namespace = ({ namespace, deployments, services, ingressroutes }) => {
    useCSS(`
        .namespace {
        }

        .namespace__deployments {
            display: grid;
            grid-auto-rows: auto;
            grid-template-columns: 1fr;
            grid-row-gap: 1rem;
        }
    `);

    const renderDeployments = () => {
        return deployments.map((deployment) => {
            const matchingIngresses = k8s.findIngressForDeployment(
                ingressroutes,
                services,
                deployment,
            );

            return html`<${Deployment}
                deployment="${deployment}"
                ingressroutes="${matchingIngresses}"
            />`;
        });
    };

    return html`
        <div class="namespace">
            <h1 class="namespace__title">
                ${namespace}
            </h1>
            <div class="namespace__deployments">
                ${renderDeployments()}
            </div>
        </div>
    `;
};

export default Namespace;
