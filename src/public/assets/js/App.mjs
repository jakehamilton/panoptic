'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

import useCSS from './hooks/useCSS.mjs';
import useFetch from './hooks/useFetch.mjs';

import AppProvider from './components/AppProvider.mjs';
import Toolbar from './components/Toolbar.mjs';
import AllDeployments from './components/AllDeployments.mjs';

const App = () => {
    useCSS(`
        .app {
            width: 100%;
            height: 100%;
        }
    `);

    const { data, loaded } = useFetch('/api/state');

    return html`
        <${AppProvider}>
            <div class="app">
                <${Toolbar}>test</${Toolbar}>
                ${loaded && html`<${AllDeployments} resources="${data}" />`}
            </div>
        </${AppProvider}>
    `;
};

export default App;
