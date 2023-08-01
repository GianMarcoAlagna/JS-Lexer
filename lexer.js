function handleEnd() {
    return { type: 'Symbol', value: ';' };
}

function parseStatement(token) {
    const obj = {};

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

    function isFunction(token) {
        return token === 'print' || token === 'func';
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
    } else if(isFunction(token)) {
        obj['type'] = 'Function';
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
        if(content[iter] === ';') { // handle end of line
            tokens.push(parseStatement(buffer));
            tokens.push(handleEnd());
            iter++ // iterate past the line ending symbol
            buffer = '';
        }
        if(content[iter] === ' ') { // handle next statement, marked by spaces
        tokens.push(parseStatement(buffer));
            buffer = '';
        } else {
            buffer += content[iter]; // add the current index to the buffer
        }

        iter++;
    }
    
    // this was originally for when the iterator went over and there was content left in the buffer, but with the semi-colon,
    // the lexer knows where the end of a statement is
    // if (buffer !== '') {
    //     tokens.push(parseStatement(buffer));
    // }

    return tokens;
}


export default lex;