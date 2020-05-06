'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from '../hooks/useCSS.mjs';
import useTheme from '../hooks/useTheme.mjs';

const Toolbar = ({ children }) => {
    const theme = useTheme();

    useCSS(`
        .toolbar {
            display: grid;
            grid-template: 1fr / max-content 1fr;
            width: 100%;
            height: 3.75rem;
            padding: 0.5rem 1rem;

            font-size: 1rem;
            font-weight: bold;

            background: ${theme.white};
            box-shadow: ${theme.shadows[1]};
        }

        .toolbar > * {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        .toolbar__logo {
            font-size: 1.25rem;
        }
    `);

    return html`
        <div class="toolbar">
            <div class="toolbar__logo">
                🔭 Panoptic
            </div>
        </div>
    `;
};

export default Toolbar;
