import { html } from 'https://unpkg.com/htm/preact/standalone.module.js';

export const lex = (source) => {
    const tokens = [];

    let cursor = 0;
    let buffer = '';

    const pushBuffer = () => {
        if (buffer.length > 0) {
            tokens.push({
                type: 'ident',
                value: buffer,
            });

            buffer = '';
        }
    };

    const peek = (offset = 0) => {
        return source[cursor + offset];
    };

    const consume = (length = 1) => {
        let string = '';

        for (let i = 0; i < length; i++) {
            string += source[cursor + i];
        }

        cursor += length;

        return string;
    };

    while (cursor < source.length) {
        const char = peek();

        if (char === '(') {
            pushBuffer();
            tokens.push({
                type: 'lparen',
                value: consume(),
            });
            continue;
        }

        if (char === ')') {
            pushBuffer();
            tokens.push({
                type: 'rparen',
                value: consume(),
            });
            continue;
        }

        if (char === '&' && peek(1) === '&') {
            pushBuffer();
            tokens.push({
                type: 'and',
                value: consume(2),
            });
            continue;
        }

        if (char === '|' && peek(1) === '|') {
            pushBuffer();
            tokens.push({
                type: 'or',
                value: consume(2),
            });
            continue;
        }

        if (char === '`') {
            pushBuffer();

            consume();

            let length = 1;
            while (peek(length) && peek(length) !== '`') {
                length++;
            }

            tokens.push({
                type: 'string',
                value: consume(length),
            });

            if (peek()) {
                consume();
            }
            continue;
        }

        if (char === ' ' || char === '\n') {
            pushBuffer();
            consume();
            continue;
        }

        buffer += consume();
    }

    pushBuffer();

    return tokens;
};

export const parse = (tokens) => {
    const body = [];

    let cursor = 0;

    const peek = (offset = 0) => {
        return tokens[cursor + offset];
    };

    const consume = (length = 1) => {
        let items = [];

        for (let i = 0; i < length; i++) {
            items.push(tokens[cursor + i]);
        }

        cursor += length;

        return items;
    };

    const parseFCall = () => {
        const [name] = consume();
        const [lparen] = consume(); // lparen

        const args = [];

        while (peek() && peek().type !== 'rparen') {
            args.push(consume()[0]);
        }

        let rparen;
        if (peek()) {
            rparen = consume()[0]; // rparen
        }

        const fcall = {
            type: 'fcall',
            name: name.value,
            args,
            length: args.length + 2 + (rparen ? 1 : 0),
        };

        return fcall;
    };

    const parseExpression = () => {
        let depth = 1;
        let toks = [];

        consume(); // lparen

        while (peek() && depth > 0) {
            const token = peek();
            if (token.type === 'lparen') {
                depth++;
            } else if (token.type === 'rparen') {
                depth--;
            }

            if (depth > 0) {
                toks.push(consume()[0]);
            }
        }

        if (peek()) {
            consume(); // rparen
        }

        const ast = parse(toks);

        return ast.body[0];
    };

    const parseNode = () => {
        const token = peek();

        let lnode;
        let operator;
        let rnode;

        if (token.type === 'ident' && peek(1) && peek(1).type === 'lparen') {
            // function call
            lnode = parseFCall();
        } else if (token.type === 'lparen') {
            lnode = parseExpression();
        }

        if (
            lnode &&
            peek() &&
            (peek().type === 'and' || peek().type === 'or')
        ) {
            operator = consume()[0];

            if (peek()) {
                rnode = parseNode();
            }
        }

        if (lnode && operator && rnode) {
            return {
                type: operator.type,
                left: lnode,
                right: rnode,
            };
        } else {
            return lnode;
        }
    };

    while (cursor < tokens.length) {
        const node = parseNode();

        if (node) {
            body.push(node);
        } else {
            consume();
        }
    }

    return {
        body,
    };
};

export const getRoutes = (node) => {
    if (node.type === 'or') {
        return [getRoutes(node.left), getRoutes(node.right)].flat();
    }

    if (node.type === 'and') {
        if (node.left.type === 'fcall' && node.right.type === 'fcall') {
            const lroutes = getRoutes(node.left);
            const rroutes = getRoutes(node.right);

            if (node.left.name === 'Host' && node.right.name === 'Host') {
                if (node.left.args[0].value === node.right.args[0].value) {
                    return lroutes;
                } else {
                    return [];
                }
            }

            if (node.left.name === 'Host' && node.right.name === 'PathPrefix') {
                return [lroutes[0] + rroutes[0]];
            }

            if (node.left.name === 'PathPrefix' && node.right.name === 'Host') {
                return [rroutes[0] + lroutes[0]];
            }

            return [lroutes, rroutes];
        }
        return [getRoutes(node.left), getRoutes(node.right)].flat();
    }

    if (node.type === 'fcall') {
        if (node.name === 'Host') {
            return [node.args[0].value];
        }

        if (node.name === 'PathPrefix') {
            return [node.args[0].value];
        }
    }

    return [];
};

export const compile = (expression) => {
    const ast = parse(lex(expression));

    console.log(expression);
    console.log(ast);
    if (ast.body.length > 0) {
        const routes = getRoutes(ast.body[0]);
        return routes;
    }

    return [];
};
