const fs = require('fs');

const content = fs.readFileSync('./file.oc', 'utf-8', async (err, dat) => {
    if(err) {
        console.log(err);
    } else {
        return dat
    }
});

function parseStatement(token) {
    const obj = {};
    console.log(token)

    function isOp(token) {
        return /[+\-*/=]/.test(token);
    }

    function isString(token) {
        return ((token[0] === '"' || token[0] === "'") 
                && token[0] === token[token.length - 1]);
    }

    function isNum(token) {
        return !(isNaN(Number(token)));
    }

    if(token === 'variable') {
        obj['type'] = 'Declaration';
        obj['value'] = token;
    } else if(isString(token)) {
        obj['type'] = 'String'
        obj['value'] = token;
    } else if(isNum(token)) {
        obj['type'] = 'Number';
        obj['value'] = Number(token);
    } else if(token === '=') {
        obj['type'] = 'Assignment';
        obj['value'] = token;
    } else if(isOp(token)) {
        obj['type'] = `Operator`;
        obj['value'] = token;
    } else {
        obj['type'] = 'Identifier';
        obj['value'] = token;
    }

    return obj;
}

function lex(content) {
    let buffer = '';
    let iter = 0;
    let tokens = [];

    while(iter < content.length) {
        if(content[iter] === ' ') {
            tokens.push(parseStatement(buffer));
            buffer = '';
        } else {
            buffer += content[iter];
        }

        iter++;
    }

    if (buffer !== '') {
        tokens.push(parseStatement(buffer));
    }

    return tokens;
}

const result = lex(content);

console.log(result);