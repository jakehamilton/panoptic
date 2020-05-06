// @ts-check
const arg = require('arg');

const args = {
    // Options
    '--help': Boolean,
    '--verbose': arg.COUNT,
    '--port': Number,
    '--polling-delay': Number,
    '--namespace-allow': [String],
    '--namespace-deny': [String],
    '--deployment-allow': [String],
    '--deployment-deny': [String],

    // Aliases
    '-h': '--help',
    '-v': '--verbose',
    '-p': '--port',
    '-P': '--polling-delay',
    '-a': '--namespace-allow',
    '-d': '--namespace-deny',
    '-A': '--deployment-allow',
    '-D': '--deployment-deny',
};

module.exports = args;
