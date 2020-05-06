'use strict';
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { ThemeContext, DEFAULT_THEME } from '../hooks/useTheme.mjs';

const AppProvider = ({ children }) => {
    return html`
        <${ThemeContext.Provider} value="${DEFAULT_THEME}">
            ${children}
        </${ThemeContext.Provider}>
    `;
};

export default AppProvider;
