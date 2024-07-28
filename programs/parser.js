let pushRun_parser = document.getElementById("run");
let resultDiv = document.getElementById("result"); // 追加

let currentTokenIndex = 0;
let tokens = [];
let token;
let token_t;
let nestedLevel;
let nestedLevel_t;

function appendToResult(message, isError = false) {
    let resultElement = document.createElement('p');
    resultElement.textContent = message;
    if (isError) {
        resultElement.style.color = 'red'; // エラーメッセージを赤くする
    }
    resultDiv.appendChild(resultElement);
}

function tokenName(tokenNumber) {
    switch (tokenNumber) {
        case 2: return tk_type.TK_INTEGER;
        case 3: return tk_type.TK_FLOAT;
        case 4: return tk_type.TK_STRING;
        case 5: return tk_type.TK_PRINT;
        case 6: return tk_type.TK_L_PAR;
        case 7: return tk_type.TK_R_PAR;
        case 8: return tk_type.TK_COMMA;
        case 9: return tk_type.TK_EQUAL;
        case 10: return tk_type.TK_COLON;
        case 11: return tk_type.TK_L_INDEX;
        case 12: return tk_type.TK_R_INDEX;
        case 13: return tk_type.TK_FOR;
        case 14: return tk_type.TK_IN;
        case 15: return tk_type.TK_RANGE;
        case 16: return tk_type.TK_TAB;
        case 17: return tk_type.TK_ENTER;
        case 18: return tk_type.TK_SEPARATOR;
        case 19: return tk_type.TK_END;
        case 20: return tk_type.TK_IF;
        case 21: return tk_type.TK_ELIF;
        case 22: return tk_type.TK_ELSE;
        case 23: return tk_type.TK_WHILE;
        case 24: return tk_type.TK_L_BRACE;
        case 25: return tk_type.TK_R_BRACE;
        case 26: return tk_type.TK_PLUS;
        case 27: return tk_type.TK_MINUS;
        case 28: return tk_type.TK_MULTIPLY;
        case 29: return tk_type.TK_DIVIDE;
        case 30: return tk_type.TK_GREATER;
        case 31: return tk_type.TK_LESS;
        case 32: return tk_type.TK_EXCLAMATION;
        case 33: return tk_type.TK_SHARP;
        case 34: return tk_type.TK_PERCENT;
        case 35: return tk_type.TK_NOT;
        default: return tk_type.TK_IDENTIFIER;
    }
}

function getNextToken() {
    return tokens[currentTokenIndex++];
}

function peekNextToken() {
    return tokens[currentTokenIndex];
}

function parseTokens(tokenList) {
    tokens = tokenList;
    currentTokenIndex = 0;
    token = null; // トークンをリセット
     // 結果表示エリアをリセット
     resultDiv.innerHTML = '＜構文解析ログ＞';

    try {
        parseProgram();
        appendToResult("正常に終了しました");
    } catch (error) {
        appendToResult(token.lineNumber + "行目  構文エラー: " + error.message, true);
    }
}

function parseProgram() {
    while (currentTokenIndex < tokens.length) {
        parseStatement();
    }
}

// 構文解析のための関数
function parseStatement() {
    token = getNextToken();
    console.log(token.type, token.word);
    switch (token.type) {
        case tk_type.TK_IDENTIFIER:
            parseExpressionStatement();
            break;
        case tk_type.TK_PRINT:
            parsePrintStatement();
            break;
        case tk_type.TK_IF:
            parseIfStatement();
            break;
        case tk_type.TK_ELIF:
            parseElifStatement();
            break;
        case tk_type.TK_ELSE:
            parseElseStatement();
            break;
        case tk_type.TK_FOR:
            parseForStatement();
            break;
        case tk_type.TK_WHILE:
            parseWhileStatement();
            break;
        case tk_type.TK_L_BRACE:
            parseCompoundStatement();
            break;
        case tk_type.TK_TAB:
            parseIndentedStatementsSecond();
            break;
        case tk_type.TK_ENTER:
            break;
        case tk_type.TK_SHARP:
            parserCommentStatement();
            break;
        default:
            appendToResult(token.word);
            throw new Error("不明な文です: " + token.tokenNumber);
    }
}

// コメント文の解析
function parserCommentStatement() {
    while (peekNextToken().type !== tk_type.TK_ENTER) {
        token = getNextToken();
    }
}

// 複合文の解析
function parseCompoundStatement() {
    while (peekNextToken().type !== tk_type.TK_R_BRACE) {
        parseStatement();
    }
    token = getNextToken(); // Consume '}'
}

// 式文の解析
function parseExpressionStatement() {
    parseExpression();
    if(token.type !== tk_type.TK_ENTER) {
        token = getNextToken(); // Consume ENTER
    }
    if (token.type !== tk_type.TK_ENTER) {
        if(token.type === tk_type.TK_COMMA) {
            throw new Error("'[' が必要です");
        }else{
            throw new Error("式文の後に改行が必要です");
        }
    }
}

// if文の解析
function parseIfStatement() {
    token = getNextToken(); // Consume 'if'
    parseExpression();
    if (token.type !== tk_type.TK_COLON) {
        throw new Error("':' が必要です");
    }
    token = getNextToken(); // Consume ':'
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("if文の後に改行が必要です");
    }
    parseIndentedStatements();
    if(token.type !== tk_type.TK_ENTER){
        token = getNextToken();
    }
}

// elif文の解析
function parseElifStatement() {
    token = getNextToken(); // Consume 'elif'
    parseExpression();
    if (token.type !== tk_type.TK_COLON) {
        throw new Error("':' が必要です");
    }
    token = getNextToken(); // Consume ':'
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("elif文の後に改行が必要です");
    }
    parseIndentedStatements();
}

// else文の解析
function parseElseStatement() {
    token = getNextToken(); // Consume 'else'
    if (token.type !== tk_type.TK_COLON) {
        throw new Error("':' が必要です");
    }
    token = getNextToken(); // Consume ':'
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("else文の後に改行が必要です");
    }
    parseIndentedStatements();
}

// for文の解析
function parseForStatement() {
    token = getNextToken();
    if (token.type !== tk_type.TK_IDENTIFIER) {
        throw new Error("識別子が必要です");
    }
    token = getNextToken(); // Consume identifier
    
    if (token.type !== tk_type.TK_IN) {
        throw new Error("'in' が必要です");
    }
    token = getNextToken(); // Consume 'in'
    
    if (token.type !== tk_type.TK_RANGE) {
        parseExpression();
    } else {
        parseRangeExpression();
    }
    
    if (token.type !== tk_type.TK_COLON) {
        throw new Error("':' が必要です");
    }
    token = getNextToken(); // Consume ':'
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("for文の後に改行が必要です");
    }
    parseIndentedStatements();
}

// range式の解析
function parseRangeExpression() {
    token = getNextToken(); // Consume 'range'
    if (token.type !== tk_type.TK_L_PAR) {
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    parseExpression();
    while (token.type === tk_type.TK_COMMA) {
        token = getNextToken(); // Consume ','
        parseExpression(); // 2つ目以降の引数
    }
    
    if (token.type !== tk_type.TK_R_PAR) {
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
}

// while文の解析
function parseWhileStatement() {
    token = getNextToken(); // Consume 'while'
    parseExpression();
    if (token.type !== tk_type.TK_COLON) {
        throw new Error("':' が必要です");
    }
    token = getNextToken(); // Consume ':'
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("while文の後に改行が必要です");
    }
    parseIndentedStatements();
}

// print文の解析
function parsePrintStatement() {
    token = getNextToken();
    if (token.type !== tk_type.TK_L_PAR) {
        throw new Error("'(' が必要です");
    }

    token = getNextToken();
    while (token.type !== tk_type.TK_R_PAR) {
        parseExpression();
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // ',' を消費
            if (token.type === tk_type.TK_R_PAR) {
                token = getNextToken();
                break;
            }else if(token.type === tk_type.TK_SEPARATOR || token.type === tk_type.TK_END) {
                token = getNextToken();
                if(token.type !== tk_type.TK_EQUAL){
                    throw new Error("sepまたはendの後に'='が必要です");
                }
                token = getNextToken();
                if(token.type !== tk_type.TK_STRING){
                    throw new Error("sepまたはendの後に文字列が必要です");
                }
                token = getNextToken();
                break;
            }
        } else {
            break;
        }
    }
    if (token.type !== tk_type.TK_R_PAR) {
        throw new Error("')' が必要です");
    }

    token = getNextToken();
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("print文の後に改行が必要です");
    }
}

// 式の解析
function parseExpression() {
    parseAssignmentExpression();
}

// 代入式の解析
function parseAssignmentExpression() {
    parseLogicalExpression();
    if (token.type === tk_type.TK_EQUAL) {
        token = getNextToken(); // Consume '='
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseExpression();
    }
}
// 論理式の解析
function parseLogicalExpression() {
    parseArithmeticExpression();
    if(token.type === tk_type.TK_GREATER || token.type === tk_type.TK_LESS){
        token = getNextToken(); // Consume '>' or '<'
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseExpression();
    }else if(token.type === tk_type.TK_EXCLAMATION){
        token = getNextToken(); // Consume '!'
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseExpression();
    }else if(token.type === tk_type.TK_IN){
        token = getNextToken(); // Consume 'in'
        parseExpression();
    }
}
// 算術式の解析
function parseArithmeticExpression() {
    parseTerm();
    while (token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS) {
        token = getNextToken(); // Consume '+' or '-'
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseTerm();
    }
}
// 項の解析
function parseTerm() {
    parseFactor();
    while (token.type === tk_type.TK_MULTIPLY || token.type === tk_type.TK_DIVIDE || token.type === tk_type.TK_PERCENT) {
        token = getNextToken(); // Consume '*' or '/'
        if(token.type === tk_type.TK_MULTIPLY || token.type === tk_type.TK_DIVIDE){
            token = getNextToken(); // Consume '*' or '/'
        }
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseFactor();
    }
}
// 因子の解析
function parseFactor() {
    if (token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS || token.type === tk_type.TK_NOT) {
        token = getNextToken(); // Consume '+' or '-' or 'not'
    }
    if (token.type === tk_type.TK_L_PAR) {
        token = getNextToken(); // Consume '('
        parseExpression();

        if (token.type !== tk_type.TK_R_PAR) {
            throw new Error("')' が必要です");
        }
        token = getNextToken(); // Consume ')'
    } else if (token.type === tk_type.TK_INTEGER || token.type === tk_type.TK_FLOAT || token.type === tk_type.TK_STRING || token.type === tk_type.TK_IDENTIFIER) {
        token = getNextToken(); // Consume literal or identifier
        if (token.type === tk_type.TK_L_INDEX) {
            parseIndexingExpression();
            if(token.type === tk_type.TK_L_INDEX) {
                parseIndexingExpression();
            }
        }
    } else if (token.type === tk_type.TK_L_INDEX) {
        parseListLiteral();
    } else {
        console.log(token.type, token.word);
        throw new Error("不明な因子です: " + token.tokenNumber);
    }
}
// リストリテラルの解析
function parseListLiteral() {
    token = getNextToken(); // Consume '['
    while (token.type !== tk_type.TK_R_INDEX) {
        parseExpression();
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // ',' を消費
        } else {
            break;
        }
    }
    if (token.type !== tk_type.TK_R_INDEX) {
        throw new Error("']' が必要です");
    }
    token = getNextToken(); // Consume ']'
}
// インデックス式の解析
function parseIndexingExpression() {
    token = getNextToken(); // Consume '['
    parseExpression();
    if (token.type !== tk_type.TK_R_INDEX) {
        throw new Error("']' が必要です");
    }
    token = getNextToken(); // Consume ']'
}
// インデントされた文の解析
function parseIndentedStatements() {
    nestedLevel = token.tabCount;
    for (let i = 0; i < nestedLevel+1; i++) {
        token = getNextToken();
    }
    nestedLevel_t = token.tabCount;
     
    if (nestedLevel_t === nestedLevel) {
        throw new Error("インデントが必要です");
    }
    parseStatement();
    if(token.type !== tk_type.TK_ENTER){
        token = getNextToken();
    }   
}
// インデントされた文の解析
function parseIndentedStatementsSecond() {
    for (let i = 0; i < nestedLevel; i++) {
        token = getNextToken();
    }
    nestedLevel = nestedLevel_t;
    nestedLevel_t = token.tabCount;
    if (nestedLevel_t !== nestedLevel) {
        throw new Error("インデントが間違っています");
    }
    parseStatement();
    if(token.type !== tk_type.TK_ENTER){
        token = getNextToken();
    }   
}

document.addEventListener("DOMContentLoaded", function () {
    pushRun_parser.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        parsedTokens = []; 
        parsedTokens = processCode(code);
        parseTokens(parsedTokens);
    });
});
