const lex = require('./lexer');
const fs = require('fs');

const content = fs.readFileSync('./file.oc', 'utf-8', (err, dat) => {
    if(err) {
        console.log(err);
    } else {
        return dat
    }
});

const tokens = lex(content);

function parse(tokens) {
  let tokenIndex = 0;
  function incrementToken() {
    if(tokenIndex < tokens.length - 1) tokenIndex++;
  }
  
  function begin() {
    const currToken = tokens[tokenIndex];

    if (currToken.type === 'Function') {
      if (currToken.value === 'print') {
        incrementToken();
        parsePrint();
      } else {
        throw new Error(`Invalid Function Call -> ${currToken.value}`)
      }
    } else if (currToken.type === 'Number') {
      return parseExpr();
    }
  }

  function parsePrint() {
    let line = '';

    while(tokens[tokenIndex].value !== ';') {
      line += tokens[tokenIndex].value;
      incrementToken();
    }

    console.log(line);
    incrementToken();
    begin(); // end of line, begin parsing next line
  }

  function parseExpr() {
    let result = parseTerm();

    while (tokenIndex < tokens.length && (tokens[tokenIndex].value === '+' || tokens[tokenIndex].value === '-')) {
      const op = tokens[tokenIndex].value;
      incrementToken();
      const right = parseTerm();
      
      if (op === '+') {
        result += right;
      } else if (op === '-') {
        result -= right;
      }
    }

    return result;
  }

  function parseTerm() {
    let result = parseFactor();

    while (tokenIndex < tokens.length && (tokens[tokenIndex].value === '*' || tokens[tokenIndex].value === '/')) {
      const op = tokens[tokenIndex].value;
      incrementToken();
      const right = parseFactor();

      if (op === '*') {
        result *= right;
      } else if (op === '/') {
        result /= right;
      } else {
        throw new Error(`Unexpected Token -> ${op}`);
      }
    }

    return result;
  }

  function parseFactor() {
    const curr = tokens[tokenIndex];
    incrementToken();
    
    if (curr.type === 'Number') {
      return curr.value;
    }

    throw new Error('Invalid token -> Expected a Number');
  }

  return begin();
}

parse(tokens);
