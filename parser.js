import lex from './lexer.js';
import { readFileSync } from 'fs';

const content = readFileSync('./file.oc', 'utf-8', (error, data) => {
    if(error) {
        console.log(err);
    } else {
        return data
    }
}).replace(/(\r\n|\n|\r)/g, "");

const tokens = lex(content);

function parse(tokens) {
  let tokenIndex = 0;
  const evaluation = [];
  const memory = {};

  function incrementToken(num = 1) {
    if(tokenIndex < tokens.length - 1) tokenIndex += num;
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
    } else if(currToken.type === 'Declaration') {
      incrementToken();
      const identifier = tokens[tokenIndex].value;
      const value = parseVariable();

      const temp = {}
      temp[identifier] = value;

      memory[identifier] = value
      evaluation.push(temp)
    } else if(currToken.type === 'Identifier') {
      if(memory[currToken.value]) {
        console.log(memory[currToken.value])
      } else {
        throw new Error(`Variable ${currToken.value} doesn't exist`)
      }
      incrementToken();
    }

    return begin(); // recurse until no tokens are left
  }

  function parseVariable() {
    incrementToken(2)
    return parseExpr();
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
    } else if(curr.type !== 'Number' && curr.type !== 'Operator') {
      throw new Error(`Unexpected token -> ${curr.value}: missing end of line operator ';'`);
    }

    throw new Error(`Unexpected token -> ${curr.value}`);
  }

  return begin();
}

const result = parse(tokens);

for(let evaluation of result) { // loop through the array of results
  console.log(evaluation);
}