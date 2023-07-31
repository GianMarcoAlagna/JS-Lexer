const tokensList = [
  { type: 'Number', value: 123 },
  { type: 'Operator', value: '+' },
  { type: 'Number', value: 3 },
  { type: 'Operator', value: '*' },
  { type: 'Number', value: 10 },
];

function parse(tokens) {
  let tokenIndex = 0;

  function parseExpr() {
    let result = parseTerm();

    while (tokenIndex < tokens.length && (tokens[tokenIndex].value === '+' || tokens[tokenIndex].value === '-')) {
      const op = tokens[tokenIndex].value;
      if(tokenIndex < tokens.length - 1) tokenIndex++;
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
      if(tokenIndex < tokens.length - 1) tokenIndex++;
      const right = parseFactor();

      if (op === '*') {
        result *= right;
      } else if (op === '/') {
        result /= right;
      } else {
        throw new Error(`Unexpected Token: ${op}`);
      }
    }

    return result;
  }

  function parseFactor() {
    const curr = tokens[tokenIndex];
    
    if(tokenIndex < tokens.length - 1) tokenIndex++;
    if (curr.type === 'Number') {
      return curr.value;
    }

    throw new Error('Invalid token: Expected a Number');
  }

  return parseExpr();
}

parse(tokensList);
