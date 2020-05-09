// @ts-check
const chalk = require('chalk');

let executable = process.argv0;

if (executable === 'node') {
    const cwd = process.cwd();
    const file = process.argv[1];

    executable += ` .${file.substring(cwd.length)}`;
}

const help = chalk`
    {bold USAGE}

        {dim $} {bold ${executable}} \
            [--help] \
            [--verbose] \
            [--port {underline number}] \
            [--polling-delay {underline number}] \
            [--namespace-allow {underline name}] \
            [--namespace-deny {underline name}] \
            [--deployment-allow {underline name}] \
            [--deployment-deny {underline name}] \

    {bold OPTIONS}
        --help                Show this help message.
        --verbose             Enable verbose logging (up to 3x).
        --port                Set the port to listen on.
        --polling-delay       Delay in ms between calls to Kubernetes.
        --namespace-allow     A regex for filtering namespace names.
        --namespace-deny      A regex for filtering namespace names.
        --deployment-allow    A regex for filtering deployment names.
        --deployment-deny     A regex for filtering deployment names.
        --service-allow       A regex for filtering deployment names.
        --service-deny        A regex for filtering deployment names.
        --ingress-allow       A regex for filtering ingress names.
        --ingress-deny        A regex for filtering ingress names.

    {bold ALIASES}
        -h                    --help
        -v                    --verbose
        -p                    --port
        -n                    --namespace-allow
        -N                    --namespace-deny
        -d                    --deployment-allow
        -D                    --deployment-deny
        -s                    --service-allow
        -S                    --service-deny
        -i                    --ingress-allow
        -I                    --ingress-deny

    {bold ENVIRONMENT}

        NODE_PORT             The port to listen on (default: 3000).
        KUBECONFIG            The Kubeconfig file to use (default: ~/.kube/config).
        POLLING_DELAY         The delay in ms between calls to Kubernetes (default: 5min).

    {bold EXAMPLE}
    
        Normal Usage:

        {dim $} {bold ${executable}}

        Verbose Usage:

        {dim $} {bold ${executable}} -v
        {dim $} {bold ${executable}} -vv
        {dim $} {bold ${executable}} -vvv

        Changing The Polling Delay:

        {dim $} {bold ${executable}} --polling-delay 30000

        Only Allow Certain Namespaces:

        {dim $} {bold ${executable}} -a my-namespace
        {dim $} {bold ${executable}} -a my-namespace -a my-other-namespace

        Deny Certain Namespaces:

        {dim $} {bold ${executable}} -d my-namespace
        {dim $} {bold ${executable}} -d my-namespace -d my-other-namespace

        Only Allow Certain Deployments:

        {dim $} {bold ${executable}} -A my-deployment
        {dim $} {bold ${executable}} -A my-deployment -A my-other-deployment

        Deny Certain Deployments:

        {dim $} {bold ${executable}} -D my-deployment
        {dim $} {bold ${executable}} -D my-deployment -D "my-prefix-*"
`;

module.exports = help;
