'use strict';
import {
    html,
    render,
} from 'https://unpkg.com/htm/preact/standalone.module.js';

import App from './App.mjs';

const loading = document.querySelector('body > .loading');
loading.classList.add('loaded');

render(html`<${App} />`, document.body.querySelector('#app'));
