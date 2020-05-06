'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from '../hooks/useCSS.mjs';
import useTheme from '../hooks/useTheme.mjs';

import shade from '../util/shade.mjs';
import hexToRGBA from '../util/hexToRGBA.mjs';

const DeploymentLabel = ({ name, value }) => {
    const theme = useTheme();

    const primary = shade(0.3, theme.primary);

    useCSS(`
        .deployment-label {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            padding-left: 1rem;
            padding-right: 0.75rem;

            margin-right: 0.5rem;
            margin-bottom: 0.5rem;

            border-radius: 0.75rem;
            background: ${hexToRGBA(primary, 0.2)};
        }

        .deployment-label__name {
            color: ${primary};
        }

        .deployment-label__value {
            color: ${primary};
            text-decoration: underline;
        }
    `);

    return html`
        <div class="deployment-label">
            <span class="deployment-label__name">
                ${name}:
            </span>
            ${' '}
            <span class="deployment-label__value">
                ${value}
            </span>
        </div>
    `;
};

export default DeploymentLabel;
