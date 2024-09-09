let parsedTokens = []; // グローバル変数を追加

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
    TK_RANGE: 'TK_RANGE',
    TK_SEPARATOR: 'TK_SEPARATOR',
    TK_END: 'TK_END',
    TK_IF: 'TK_IF',
    TK_ELIF: 'TK_ELIF',
    TK_ELSE: 'TK_ELSE',
    TK_WHILE: 'TK_WHILE',
    TK_L_BRACE: 'TK_L_BRACE',
    TK_R_BRACE: 'TK_R_BRACE',
    TK_PLUS: 'TK_PLUS',
    TK_MINUS: 'TK_MINUS',
    TK_MULTIPLY: 'TK_MULTIPLY',
    TK_DIVIDE: 'TK_DIVIDE',
    TK_GREATER: 'TK_GREATER',
    TK_LESS: 'TK_LESS',
    TK_EXCLAMATION: 'TK_EXCLAMATION', 
    TK_SHARP: 'TK_SHARP',
    TK_PERCENT: 'TK_PERCENT',
    TK_NOT: 'TK_NOT',
    TK_DOT: 'TK_DOT',
    TK_INT: 'TK_INT',
    TK_FL: 'TK_FL',
    TK_INPUT: 'TK_INPUT',
    TK_MAP: 'TK_MAP',
    TK_LIST: 'TK_LIST',
    TK_SPLIT: 'TK_SPLIT',
    TK_IMPORT: 'TK_IMPORT',
    TK_AND: 'TK_AND',
    TK_OR: 'TK_OR',
    TK_DELIMITER: 'TK_DELIMITER'
};

class Token {
    constructor(word, type, lineNumber, tkNumber, tabCount) {
        this.word = word;
        this.type = type;
        this.lineNumber = lineNumber;
        this.tkNumber = tkNumber;
        this.tabCount = tabCount;
    }
}

function createToken(word, type, lineNumber, tkNumber, tabCount) {
    return new Token(word, type, lineNumber, tkNumber, tabCount);
}

function isIdentifier(word) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word);
}

function isInteger(word) {
    return /^[0-9]+$/.test(word);
}

function isFloat(word) {
    return /^[0-9]*\.[0-9]+$/.test(word);
}

function isString(word) {
    // "で囲まれた文字列か'で囲まれた文字列かを判定"
    return /^".*"$/.test(word) || /^'.*'$/.test(word);
}

function getTokenType(word) {
    if (isInteger(word)) return tk_type.TK_INTEGER;
    else if (isFloat(word)) return tk_type.TK_FLOAT;
    else if (word === 'print') return tk_type.TK_PRINT;
    else if (word === '(') return tk_type.TK_L_PAR;
    else if (word === ')') return tk_type.TK_R_PAR;
    else if (word === ',') return tk_type.TK_COMMA;
    else if (word === '=') return tk_type.TK_EQUAL;
    else if (word === ':') return tk_type.TK_COLON;
    else if (word === '[') return tk_type.TK_L_INDEX;
    else if (word === ']') return tk_type.TK_R_INDEX;
    else if (word === 'for') return tk_type.TK_FOR;
    else if (word === 'in') return tk_type.TK_IN;
    else if (word === 'range') return tk_type.TK_RANGE;
    else if (word === '\t') return tk_type.TK_TAB;
    else if (word === '\n') return tk_type.TK_ENTER;
    else if (word === 'sep') return tk_type.TK_SEPARATOR;
    else if (word === 'end') return tk_type.TK_END;
    else if (word === 'else if') return tk_type.TK_IF;
    else if (word === 'elelse if') return tk_type.TK_ELIF;
    else if (word === 'else') return tk_type.TK_ELSE;
    else if (word === 'while') return tk_type.TK_WHILE;
    else if (word === '{') return tk_type.TK_L_BRACE;
    else if (word === '}') return tk_type.TK_R_BRACE;
    else if (word === '+') return tk_type.TK_PLUS;
    else if (word === '-') return tk_type.TK_MINUS;
    else if (word === '*') return tk_type.TK_MULTIPLY;
    else if (word === '/') return tk_type.TK_DIVIDE;
    else if (word === '>') return tk_type.TK_GREATER;
    else if (word === '<') return tk_type.TK_LESS;
    else if (word === '!') return tk_type.TK_EXCLAMATION;
    else if (word === '#') return tk_type.TK_SHARP;
    else if (word === '%') return tk_type.TK_PERCENT;
    else if (word === 'not') return tk_type.TK_NOT;
    else if (word === '.') return tk_type.TK_DOT;
    else if (word === 'int') return tk_type.TK_INT;
    else if (word === 'float') return tk_type.TK_FL;
    else if (word === 'input') return tk_type.TK_INPUT;
    else if (word === 'map') return tk_type.TK_MAP;
    else if (word === 'list') return tk_type.TK_LIST;
    else if (word === 'split') return tk_type.TK_SPLIT;
    else if (word === 'import') return tk_type.TK_IMPORT;
    else if (word === 'and') return tk_type.TK_AND;
    else if (word === 'or') return tk_type.TK_OR;
    else if (isIdentifier(word)) return tk_type.TK_IDENTIFIER;
    else if (isString(word)) return tk_type.TK_STRING;
}

function tokenNumber(word) {
    if (isInteger(word)) return 2;
    else if (isFloat(word)) return 3;
    else if (word === 'print') return 5;
    else if (word === '(') return 6;
    else if (word === ')') return 7;
    else if (word === ',') return 8;
    else if (word === '=') return 9;
    else if (word === ':') return 10;
    else if (word === '[') return 11;
    else if (word === ']') return 12;
    else if (word === 'for') return 13;
    else if (word === 'in') return 14;
    else if (word === 'range') return 15;
    else if (word === '\t' || word === '    ') return 16;
    else if (word === '\n') return 17;
    else if (word === 'sep') return 18;
    else if (word === 'end') return 19;
    else if (word === 'if') return 20;
    else if (word === 'elif') return 21;
    else if (word === 'else') return 22;
    else if (word === 'while') return 23;
    else if (word === '{') return 24;
    else if (word === '}') return 25;
    else if (word === '+') return 26;
    else if (word === '-') return 27;
    else if (word === '*') return 28;
    else if (word === '/') return 29;
    else if (word === '>') return 30;
    else if (word === '<') return 31;
    else if (word === '!') return 32;
    else if (word === '#') return 33;
    else if (word === '%') return 34;
    else if (word === 'not') return 35;
    else if (word === '.') return 36;
    else if (word === 'int') return 37;
    else if (word === 'float') return 38;
    else if (word === 'input') return 39;
    else if (word === 'map') return 40;
    else if (word === 'list') return 41;
    else if (word === 'split') return 42;
    else if (word === 'import') return 43;
    else if (word === 'and') return 44;
    else if (word === 'or') return 45;
    else if (isIdentifier(word)) return 1;
    else if (isString(word)) return 4;
}

// コードを解析する関数
function processCode(code) {
    let lines = code.split('\n');
    let lineNumber = 1;

    // 解析処理
    lines.forEach(line => {
        let tabCount = (line.match(/^ +/) || [''])[0].length / 4; // タブの数を数える
        let words = line.split(/(\s+|(?=[^\w\s])|(?<=[^\w\s])|(?=[.])|(?<=[.]))/g).filter(Boolean); 
        let combinedString = '';
        let isString = false;

        for (let i = 0; i < words.length; i++) {
            let word = words[i];

            if (/\s{4,}/.test(word) && word.length % 4 === 0) {
                for (let j = 0; j < tabCount; j++) {
                    let newToken = createToken(/\t/, tk_type.TK_TAB, lineNumber, tokenNumber('\t'), tabCount);
                    parsedTokens.push(newToken);
                    console.log(newToken);
                }
            } else {
                if (word === '"' || word === "'") {
                    if (isString) {
                        combinedString += word;
                        let newToken = createToken(combinedString, tk_type.TK_STRING, lineNumber, tokenNumber(combinedString), tabCount);
                        parsedTokens.push(newToken);
                        console.log(newToken);
                        combinedString = '';
                        isString = false;
                    } else {
                        combinedString = word;
                        isString = true;
                    }
                } else if (isString) {
                    combinedString += word;
                } else if (!/\s{1,}/.test(word)) {
                    if (isInteger(word) && i + 1 < words.length && words[i + 1] === '.') {
                        let floatValue = word + '.';
                        i++;
                        if (i + 1 < words.length && isInteger(words[i + 1])) {
                            floatValue += words[i + 1];
                            i++;
                        }
                        let newToken = createToken(floatValue, tk_type.TK_FLOAT, lineNumber, tokenNumber(floatValue), tabCount);
                        parsedTokens.push(newToken);
                        console.log(newToken);
                    } else if (word === '.' && i + 1 < words.length && isInteger(words[i + 1])) {
                        let floatValue = word;
                        if (i + 1 < words.length && isInteger(words[i + 1])) {
                            floatValue += words[i + 1];
                            i++;
                        }
                        let newToken = createToken(floatValue, tk_type.TK_FLOAT, lineNumber, tokenNumber(floatValue), tabCount);
                        parsedTokens.push(newToken);
                        console.log(newToken);
                    } else if (isInteger(word)) {
                        let newToken = createToken(word, tk_type.TK_INTEGER, lineNumber, tokenNumber(word), tabCount);

                        parsedTokens.push(newToken);
                        console.log(newToken);
                    } else {
                        let type = getTokenType(word);
                        let newToken = createToken(word, type, lineNumber, tokenNumber(word), tabCount);
                        parsedTokens.push(newToken);
                        console.log(newToken);
                    }
                }
            }
        }

        let newToken = createToken(/\n/, tk_type.TK_ENTER, lineNumber, tokenNumber('\n'), tabCount);
        parsedTokens.push(newToken);
        console.log(newToken);
        lineNumber++;
    });
    return parsedTokens;
}

// 実行ボタンをクリックしたときの処理
pushRun.addEventListener("click", function() {
    let code = editor.getSession().getValue();
    processCode(code);
});
