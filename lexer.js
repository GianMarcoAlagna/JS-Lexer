const fs = require('fs');

const content = fs.readFileSync('./file.oc', 'utf-8', async (err, dat) => {
    if(err) {
        console.log(err);
    } else {
        return dat
    }
});

// console.log(content);
let result = [];

function parseStatement(str) {
    const obj = {};

    console.log(str)
    if(str === 'variable') {
        obj['type'] = 'declaration';
        obj['value'] = str;

    } else if(str === '=') {
        obj['type'] = 'equals';
        obj['value'] = str;
    } else {
        obj['type'] = 'identifier';
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
}

lex(content);

console.log(result);