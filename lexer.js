const fs = require('fs');

const content = fs.readFileSync('./file.oc', 'utf-8', async (err, dat) => {
    if(err) {
        console.log(err);
    } else {
        return dat
    }
});

let result = [];

function parseStatement(str) {
    const obj = {};
    console.log(str)

    if(str === 'variable') {
        obj['type'] = 'Declaration';
        obj['value'] = str;
    } else if(str === '=') {
        obj['type'] = 'Equals';
        obj['value'] = str;
    } else if((str[0] === '"' && str[str.length - 1] === '"') || 
              (str[0] === "'" && str[str.length - 1] === "'")) {
        obj['type'] = 'String'
        obj['value'] = str;
    } else {
        obj['type'] = 'Identifier';
        obj['value'] = str;
    }

    return obj;
}

function lex(content) {
    let buffer = '';
    let iter = 0;

    while(iter < content.length) {
        if(content[iter] === ' ') {
            result.push(parseStatement(buffer));
            buffer = '';
        } else {
            buffer += content[iter];
        }

        iter++;
    }

    if (buffer !== '') {
        result.push(parseStatement(buffer));
    }
}

lex(content);

console.log(result);