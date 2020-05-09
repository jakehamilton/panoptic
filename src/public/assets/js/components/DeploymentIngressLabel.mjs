'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from '../hooks/useCSS.mjs';
import useTheme from '../hooks/useTheme.mjs';

import shade from '../util/shade.mjs';
import hexToRGBA from '../util/hexToRGBA.mjs';
import * as traefik from '../util/traefik.mjs';

const DeploymentLabel = ({ entrypoints, route }) => {
    const theme = useTheme();

    useCSS(`
        .deployment-ingress-label {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            padding-left: 0.75rem;
            padding-right: 0.75rem;

            margin-right: 0.5rem;
            margin-bottom: 0.5rem;

            border-radius: 0.75rem;

            color: ${theme.secondary};
            background: ${hexToRGBA(theme.secondary, 0.2)};
        }

        .deployment-ingress-label__link {
            color: inherit;
            text-decoration: none;
        }

        .deployment-ingress-label__link:hover {
            text-decoration: underline;
        }

        .deployment-ingress-label__link-icon {
            fill: ${theme.secondary};
            vertical-align: bottom;
        }

        .deployment-ingress-label__name {
            margin-left: 0.25rem;
        }

        .deployment-ingress-label__value {
        }
    `);

    const routes = traefik.compile(route.match);

    return entrypoints.map((entrypoint) => {
        return routes.map((route) => {
            return html`
                <div class="deployment-ingress-label">
                    <a
                        href="${entrypoint === 'http' || entrypoint === 'https'
                            ? `${entrypoint}://${route}`
                            : '#'}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="deployment-ingress-label__link"
                    >
                        <img
                            src="/assets/img/launch-icon.svg"
                            alt="launch"
                            class="deployment-ingress-label__link-icon"
                        />
                        <span class="deployment-ingress-label__name">
                            ${entrypoint === 'http' || entrypoint === 'https'
                                ? `${entrypoint}://`
                                : ': '}
                        </span>
                        <span class="deployment-ingress-label__value">
                            ${route}
                        </span>
                    </a>
                </div>
            `;
        });
    });
};

export default DeploymentLabel;
