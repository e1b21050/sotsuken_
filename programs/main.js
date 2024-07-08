let pushRun = document.getElementById("run");

const tk_type = {
    TK_IDENTIFIER: 'TK_IDENTIFIER',
    TK_INTEGER: 'TK_INTEGER',
    TK_FLOAT: 'TK_FLOAT',
    TK_STRING: 'TK_STRING',
    TK_PRINT: 'TK_PRINT',
    TK_L_PAR: 'TK_L_PAR',
    TK_R_PAR: 'TK_R_PAR',
    TK_COMMA: 'TK_COMMA',
    TK_EQUAL: 'TK_EQUAL',
    TK_COLON: 'TK_COLON',
    TK_L_INDEX: 'TK_L_INDEX',
    TK_R_INDEX: 'TK_R_INDEX',
    TK_FOR: 'TK_FOR',
    TK_IN: 'TK_IN',
    TK_TAB: 'TK_TAB',
    TK_ENTER: 'TK_ENTER',
    TK_DELIMITER: 'TK_DELIMITER' 
};

class Token {
    constructor(word, type, lineNumber, tkNumber) {
        this.word = word;
        this.type = type;
        this.lineNumber = lineNumber;
        this.tkNumber = tkNumber;
    }
}

function createToken(word, type, lineNumber, tkNumber) {
    return new Token(word, type, lineNumber, tkNumber);
}

function isIdentifier(word) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
        return false;
    }
    return true;
}

function isInteger(word) {
    return /^[0-9]+$/.test(word);
}

function isFloat(word) {
    return /^[0-9]*\.[0-9]+$/.test(word);
}

function isString(word) {
    return /^".*"$/.test(word);
}

function getTokenType(word) {
    if (isInteger(word)) {
        return tk_type.TK_INTEGER;
    }
    if (isFloat(word)) {
        return tk_type.TK_FLOAT;
    }
    if (isString(word)) {
        return tk_type.TK_STRING;
    }
    if (word === 'print') {
        return tk_type.TK_PRINT;
    }
    if (word === '(') {
        return tk_type.TK_L_PAR;
    }
    if (word === ')') {
        return tk_type.TK_R_PAR;
    }
    if (word === ',') {
        return tk_type.TK_COMMA;
    }
    if (word === '=') {
        return tk_type.TK_EQUAL;
    }
    if (word === ':') {
        return tk_type.TK_COLON;
    }
    if (word === '[') {
        return tk_type.TK_L_INDEX;
    }
    if (word === ']') {
        return tk_type.TK_R_INDEX;
    }
    if (word === 'for') {
        return tk_type.TK_FOR;
    }
    if (word === 'in') {
        return tk_type.TK_IN;
    }
    if (word === '\t') { 
        return tk_type.TK_TAB;
    }
    if (word === '\n') { 
        return tk_type.TK_ENTER;
    }

    return tk_type.TK_IDENTIFIER;
}

function tokenTypeToString(type) {
    return type;
}

function tokenNumber(word) {
    if (isInteger(word)) {
        return 2;
    }
    if (isFloat(word)) {
        return 3;
    }
    if (isString(word)) {
        return 4;
    }
    if (word === 'print') {
        return 5;
    }
    if (word === '(') {
        return 6;
    }
    if (word === ')') {
        return 7;
    }
    if (word === ',') {
        return 8;
    }
    if (word === '=') {
        return 9;
    }
    if (word === ':') {
        return 10;
    }
    if (word === '[') {
        return 11;
    }
    if (word === ']') {
        return 12;
    }
    if (word === 'for') {
        return 13;
    }
    if (word === 'in') {
        return 14;
    }
    if (word === '\t' || word === '    ') {
        return 15;
    }
    if (word === '\n') {
        return 16;
    }
    return 1;
}


function processCode(code) {
    let lines = code.split('\n');
    let lineNumber = 1;
    lines.forEach(line => {
        let tabCount = (line.match(/^ +/) || [''])[0].length / 4;
        console.log(`Tab: ${tabCount}`);
        let words = line.split(/(\s+|(?=[^\w\s])|(?<=[^\w\s]))/g).filter(Boolean);
        words.forEach(word => {
            if (word === '\t' || word % 4 === 0) {
                for (let i = 0; i < tabCount; i++) {
                    let newToken = createToken('\t', tk_type.TK_TAB, lineNumber, tokenNumber('\t'));
                    console.log(`Line: ${newToken.lineNumber} Type: ${tokenTypeToString(newToken.type)} Value: /t Number: ${newToken.tkNumber}`);
                }
            } else {
                let type = getTokenType(word);
                let newToken = createToken(word, type, lineNumber, tokenNumber(word));
                console.log(`Line: ${newToken.lineNumber} Type: ${tokenTypeToString(newToken.type)} Value: ${newToken.word} Number: ${newToken.tkNumber}`);
            }
        });
        let newToken = createToken('\n', tk_type.TK_ENTER, lineNumber, tokenNumber('\n'));
        console.log(`Line: ${newToken.lineNumber} Type: ${tokenTypeToString(newToken.type)} Value: /n Number: ${newToken.tkNumber}`);
        lineNumber++;
    });
}

// ボタンがクリックされたときに実行
pushRun.addEventListener("click", function() {
    let code = editor.getSession().getValue();
    processCode(code);
});