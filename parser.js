const tokensList = [
    { type: 'Number', value: 123 },
    { type: 'Operator', value: '+' },
    { type: 'Number', value: 3 },
    { type: 'Operator', value: '-' },
    { type: 'Number', value: 2 }
];
let token = 0;

function parse(tokens) {
    function parseExpr() {
        let result = parseTerm();

        while(token < tokens.length && (tokens[token].value) === '+' || (tokens[token].value) === '-') {
            let op = tokens[token];
            const right = parseTerm();
            
            if(op.value === '+') {
                token++
                result += right;
            }
        }
        
        return result;
    }
    
    function parseTerm() {
        let result = parseNum()
        
        console.log(tokens[token])
        while(token < tokens.length && tokens[token].value === '*' || tokens[token].value === '/') {
            token++;
            console.log('test');
        }

        return result;
    }

    function parseNum() {
        let curr = tokens[token];

        if(curr.type === 'Number') {
            token++;
            return curr.value;
        }
    }

    return parseExpr();
}

console.log(parse(tokensList));