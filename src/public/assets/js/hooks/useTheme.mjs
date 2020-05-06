'use strict';
import {
    useState,
    useContext,
    createContext,
} from 'https://unpkg.com/htm/preact/standalone.module.js';
import useCSS from '../hooks/useCSS.mjs';

const DEFAULT_THEME = {
    white: '#fdfdfd',
    black: '#222222',
    primary: '#842dbf',
    secondary: '#ecb33a',
    shadows: {
        0: '0 1px 2px rgba(0, 0, 0, 0.05)',
        1: '0 2px 3px rgba(0, 0, 0, 0.075)',
    },
};

const ThemeContext = createContext({});

const useTheme = () => {
    return useContext(ThemeContext);
};

export default useTheme;

export { useTheme, ThemeContext, DEFAULT_THEME };
