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
    '--service-allow': [String],
    '--service-deny': [String],
    '--ingress-allow': [String],
    '--ingress-deny': [String],

    // Aliases
    '-h': '--help',
    '-v': '--verbose',
    '-p': '--port',
    '-P': '--polling-delay',
    '-n': '--namespace-allow',
    '-N': '--namespace-deny',
    '-d': '--deployment-allow',
    '-D': '--deployment-deny',
    '-s': '--service-allow',
    '-S': '--service-deny',
    '-i': '--ingress-allow',
    '-I': '--ingress-deny',
};

module.exports = args;
