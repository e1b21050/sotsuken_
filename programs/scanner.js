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
    return /^".*"$/.test(word) || /^'.*'$/.test(word);
}

function getTokenType(word) {
    if (isInteger(word)) return tk_type.TK_INTEGER;
    if (isFloat(word)) return tk_type.TK_FLOAT;
    if (isString(word)) return tk_type.TK_STRING;
    if (word === 'print') return tk_type.TK_PRINT;
    if (word === '(') return tk_type.TK_L_PAR;
    if (word === ')') return tk_type.TK_R_PAR;
    if (word === ',') return tk_type.TK_COMMA;
    if (word === '=') return tk_type.TK_EQUAL;
    if (word === ':') return tk_type.TK_COLON;
    if (word === '[') return tk_type.TK_L_INDEX;
    if (word === ']') return tk_type.TK_R_INDEX;
    if (word === 'for') return tk_type.TK_FOR;
    if (word === 'in') return tk_type.TK_IN;
    if (word === 'range') return tk_type.TK_RANGE;
    if (word === '\t') return tk_type.TK_TAB;
    if (word === '\n') return tk_type.TK_ENTER;
    if (word === 'sep') return tk_type.TK_SEPARATOR;
    if (word === 'end') return tk_type.TK_END;
    if (word === 'if') return tk_type.TK_IF;
    if (word === 'elif') return tk_type.TK_ELIF;
    if (word === 'else') return tk_type.TK_ELSE;
    if (word === 'while') return tk_type.TK_WHILE;
    if (word === '{') return tk_type.TK_L_BRACE;
    if (word === '}') return tk_type.TK_R_BRACE;
    if (word === '+') return tk_type.TK_PLUS;
    if (word === '-') return tk_type.TK_MINUS;
    if (word === '*') return tk_type.TK_MULTIPLY;
    if (word === '/') return tk_type.TK_DIVIDE;
    if (word === '>') return tk_type.TK_GREATER;
    if (word === '<') return tk_type.TK_LESS;
    if (word === '!') return tk_type.TK_EXCLAMATION;
    if (word === '#') return tk_type.TK_SHARP;
    if (word === '%') return tk_type.TK_PERCENT;
    if (word === 'not') return tk_type.TK_NOT;


    return tk_type.TK_IDENTIFIER;
}

function tokenNumber(word) {
    if (isInteger(word)) return 2;
    if (isFloat(word)) return 3;
    if (isString(word)) return 4;
    if (word === 'print') return 5;
    if (word === '(') return 6;
    if (word === ')') return 7;
    if (word === ',') return 8;
    if (word === '=') return 9;
    if (word === ':') return 10;
    if (word === '[') return 11;
    if (word === ']') return 12;
    if (word === 'for') return 13;
    if (word === 'in') return 14;
    if (word === 'range') return 15;
    if (word === '\t' || word === '    ') return 16;
    if (word === '\n') return 17;
    if (word === 'sep') return 18;
    if (word === 'end') return 19;
    if (word === 'if') return 20;
    if (word === 'elif') return 21;
    if (word === 'else') return 22;
    if (word === 'while') return 23;
    if (word === '{') return 24;
    if (word === '}') return 25;
    if (word === '+') return 26;
    if (word === '-') return 27;
    if (word === '*') return 28;
    if (word === '/') return 29;
    if (word === '>') return 30;
    if (word === '<') return 31;
    if (word === '!') return 32;
    if (word === '#') return 33;
    if (word === '%') return 34;
    if (word === 'not') return 35;
    return 1;
}

// コードを解析する関数
function processCode(code) {
    let lines = code.split('\n');
    let lineNumber = 1;
    let tableBody = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // テーブルの内容をクリア

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
                    addRowToTable(newToken);
                    parsedTokens.push(newToken);
                }
            } else {
                if (word === '"' || word === "'") {
                    if (isString) {
                        combinedString += word;
                        let newToken = createToken(combinedString, tk_type.TK_STRING, lineNumber, tokenNumber(combinedString), tabCount);
                        addRowToTable(newToken);
                        parsedTokens.push(newToken);
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
                        addRowToTable(newToken);
                        parsedTokens.push(newToken);
                    } else if (isInteger(word)) {
                        let newToken = createToken(word, tk_type.TK_INTEGER, lineNumber, tokenNumber(word), tabCount);
                        addRowToTable(newToken);
                        parsedTokens.push(newToken);
                    } else {
                        let type = getTokenType(word);
                        let newToken = createToken(word, type, lineNumber, tokenNumber(word), tabCount);
                        addRowToTable(newToken);
                        parsedTokens.push(newToken);
                    }
                }
            }
        }

        let newToken = createToken(/\n/, tk_type.TK_ENTER, lineNumber, tokenNumber('\n'), tabCount);
        addRowToTable(newToken);
        parsedTokens.push(newToken);
        lineNumber++;
    });
    return parsedTokens;
}

// テーブルに行を追加する関数
function addRowToTable(token) {
    let tableBody = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
    let newRow = tableBody.insertRow();
    let lineCell = newRow.insertCell(0);
    let typeCell = newRow.insertCell(1);
    let valueCell = newRow.insertCell(2);
    let numberCell = newRow.insertCell(3);
    let tabCountCell = newRow.insertCell(4);
    lineCell.innerHTML = token.lineNumber;
    typeCell.innerHTML = token.type;
    valueCell.innerHTML = token.word;
    numberCell.innerHTML = token.tkNumber;
    tabCountCell.innerHTML = token.tabCount;
}

// 実行ボタンをクリックしたときの処理
pushRun.addEventListener("click", function() {
    let code = editor.getSession().getValue();
    processCode(code);
});
