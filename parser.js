import lex from './lexer.js';
import { readFileSync } from 'fs';

const content = readFileSync('./file.oc', 'utf-8', (err, dat) => {
    if(err) {
        console.log(err);
    } else {
        return dat
    }
}).replace(/(\r\n|\n|\r)/g, "");

const tokens = lex(content);

function parse(tokens) {
  let tokenIndex = 0;
  const evaluation = [];

  function incrementToken() {
    if(tokenIndex < tokens.length - 1) tokenIndex++;
  }
  
  function begin() {
    const currToken = tokens[tokenIndex];
    if(currToken.value === ';') {
      incrementToken();
    }

    if(!tokens[tokenIndex + 1]) { // check for tokens at next index, if none, then return the full result
      return evaluation;
    }

    if (currToken.type === 'Function') {
      if (currToken.value === 'print') {
        incrementToken();
        evaluation.push(parsePrint());
      } else {
        throw new Error(`Invalid Function Call -> ${currToken.value}`)
      }
    } else if (currToken.type === 'Number') {
      evaluation.push(parseExpr());
      incrementToken();
    }

    return begin(); // recurse until no tokens are left
  }

  function parsePrint() {
    let line = '';

    while(tokens[tokenIndex].value !== ';') {
      line += tokens[tokenIndex].value;
      incrementToken();
    }

    incrementToken();
    // begin(); // end of line, begin parsing next line // NOT NEEDED
    return line;
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

const result = parse(tokens);

for(let evaluation of result) { // loop through the array of results
  console.log(evaluation);
}
