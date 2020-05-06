// @ts-check

const logger = require('../log/logger');

const range = (min, max, x) => {
    return Math.min(Math.max(x, min), max);
};

const inside = (string, array) => {
    return array.some((value) => {
        const expression = new RegExp(value);
        const result = expression.exec(string);

        return Boolean(result);
    });
};

const microtask = (f) => {
    setTimeout(f, 0);
};

module.exports = {
    range,
    inside,
    microtask,
};
