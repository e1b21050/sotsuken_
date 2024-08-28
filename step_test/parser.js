let pushRun_parser = document.getElementById("run");

let currentTokenIndex = 0;
let tokens = [];
let token;
let token_t;
let nestedLevel;
let nestedLevel_t;
let nestedlevel_if;
let identifierImport;
let cnt_else = new Number(nestedLevel);
let code_ts = [];
let code_t = "";
let code_result = "";
let i;
let j;
let resultDiv = document.getElementById('result');
let flg_let = false;

function appendToResult(message, isError = false) {
    let resultElement = document.createElement('p');
    resultElement.textContent = message;
    if (isError) {
        resultElement.style.color = 'red'; // エラーメッセージを赤くする
    }
    resultDiv.appendChild(resultElement);
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
        console.log(token.type, token.word);
        appendToResult(token.lineNumber + "行目  構文エラー: " + error.message, true);
    }
}

function parseProgram() {
    i = 0;
    while (currentTokenIndex < tokens.length) {
        parseStatement();
        if(code_t !== "") {
            code_ts[i] = code_t + ";";
            console.log(code_ts[i]);
        }
        code_t = "";
        i++;
        j =i;
    }
    for(i = 0; i < j; i++){
        code_result += code_ts[i];
    }
    eval(code_result);
}


// 構文解析のための関数
function parseStatement() {
    token = getNextToken();
    switch (token.type) {
        case tk_type.TK_IMPORT:
            parseImportStatement();
            break;
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

// import文の解析
function parseImportStatement() {
    token = getNextToken(); // Consume 'import'
    if (token.type !== tk_type.TK_IDENTIFIER) {
        throw new Error("importの後に識別子が必要です");
    }
    identifierImport = token;
    token = getNextToken(); // Consume identifier
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("import文の後に改行が必要です");
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
    nestedlevel_if = token.tabCount;
    cnt_else[nestedLevel] = 0;
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
    if(isNaN(nestedlevel_if)){
        throw new Error("if文が必要です");
    }
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
    if(isNaN(nestedlevel_if)){
        throw new Error("if文が必要です");
    }
    cnt_else[nestedLevel] += 1;
    if(cnt_else[nestedLevel] > 1){
        throw new Error("else文は連続してはいけません");
    }
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
        throw new Error("forの後に識別子が必要です");
    }
    token = getNextToken(); // Consume identifier
    
    if (token.type !== tk_type.TK_IN) {
        throw new Error("識別子の後に 'in' が必要です");
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
    code_t += "console.log";
    token = getNextToken(); // Consume 'print'
    if (token.type !== tk_type.TK_L_PAR) {
        throw new Error("'(' が必要です");
    }
    code_t += token.word;
    token = getNextToken(); // Consume '('
    while (token.type !== tk_type.TK_R_PAR) {
        parseExpression();
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // ',' を消費
        } else if (token.type === tk_type.TK_SEPARATOR || token.type === tk_type.TK_END) {
            let keyword = token.type;
            token = getNextToken(); // 'sep' または 'end' を消費
            if (token.type !== tk_type.TK_EQUAL) {
                throw new Error("sepまたはendの後に'='が必要です");
            }
            token = getNextToken(); // '=' を消費
            if (token.type !== tk_type.TK_STRING) {
                throw new Error("sepまたはendの後に文字列が必要です");
            }
            token = getNextToken(); // 文字列を消費
            if (token.type === tk_type.TK_COMMA) {
                token = getNextToken(); // ',' を消費
            }
        } else {
            break;
        }
    }
    code_t += token.word;
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
    // 代入の左辺の識別子リストを解析
    let leftIdentifiers = parseListExpression();
    let rightList = [];
    
    // インデックス式を左辺として扱う
    if (token.type === tk_type.TK_L_INDEX) {
        parseIndexingExpression(); // Parse index expression
        leftIdentifiers.push(token); // Push indexing expression to leftIdentifiers
    }

    if (token.type === tk_type.TK_EQUAL) {
        code_t += token.word;
        token = getNextToken(); // Consume '='
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        if(token.type === tk_type.TK_MINUS){
            token = getNextToken(); // Consume '-'
        }
        if(token.type === tk_type.TK_IDENTIFIER || token.type === tk_type.TK_INTEGER || token.type === tk_type.TK_FLOAT || token.type === tk_type.TK_STRING){
            code_t += token.word;
            token = getNextToken(); // Consume identifier
            if(token.type === tk_type.TK_COMMA){ 
                token = getNextToken(); // Consume ','   
                // 代入の右辺の識別子リストを解析
                rightList = parseListExpression();
                // 左辺と右辺の識別子や値の数をチェック
                if (leftIdentifiers.length !== rightList.length + 1) {
                    throw new Error("代入の左辺と右辺の要素数が一致しません");
                }
            }else{
                parseLogicalExpression();
            }
        }if(token.type === tk_type.TK_INT || token.type === tk_type.TK_FL){
            parseInt();    
        }else if(token.type === tk_type.TK_INPUT){
            parseInput();
        }else if(token.type === tk_type.TK_MAP){
            parseMap();
        }else if(token.type === tk_type.TK_SPLIT){
            parseSplit();
        }else if(token.type === tk_type.TK_L_INDEX){
            token = getNextToken(); // Consume '['
            if(token.type === tk_type.TK_INT || token.type === tk_type.TK_INPUT || token.type === tk_type.TK_MAP || token.type === tk_type.TK_LIST){
                parseLists();
            }else{
                parseListExpressionLiteral();
            }
        }else if(token.type === tk_type.TK_LIST){
            parseList();
        }
    }else if(token.type === tk_type.TK_L_INDEX){
        parseIndexingExpression();
        if(token.type === tk_type.TK_L_INDEX) {
            parseIndexingExpression();
        }
        if(token.type === tk_type.TK_IN){
            token = getNextToken(); // Consume 'in'
            parseExpression();
        }
    }else if(token.type === tk_type.TK_INT || token.type === tk_type.TK_FL){
        parseInt();
    }else {
        parseLogicalExpression();
    }
}

// int float文の解析 
function parseInt(){
    token = getNextToken(); // Consume 'int'
    if(token.type !== tk_type.TK_L_PAR){
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    if(token.type === tk_type.TK_INPUT){
        parseInput();     
    }
    if(token.type === tk_type.TK_STRING || token.type === tk_type.TK_INTEGER || token.type === tk_type.TK_FLOAT || token.type === tk_type.TK_IDENTIFIER){
        parseExpression();
    }
    token = getNextToken(); // Consume ')'
}
// input文の解析
function parseInput(){
    token = getNextToken(); // Consume 'input'
    if(token.type !== tk_type.TK_L_PAR){
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    if(token.type !== tk_type.TK_R_PAR){
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
    if(token.type === tk_type.TK_DOT){
        token = getNextToken(); // Consume '.'
        if(token.type !== tk_type.TK_SPLIT){
            throw new Error("splitが必要です");
        }else{
            parseSplit();
        }
    }
}
// map文の解析
function parseMap(){
    token = getNextToken(); // Consume 'map'
    if(token.type !== tk_type.TK_L_PAR){
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    if(token.type !== tk_type.TK_INT && token.type !== tk_type.TK_FLOAT){
        throw new Error("intまたはfloatが必要です");
    }
    token = getNextToken(); // Consume 'int' or 'float'
    if(token.type !== tk_type.TK_COMMA){
        throw new Error("',' が必要です");
    }
    token = getNextToken(); // Consume ','
    if(token.type === tk_type.TK_INPUT){
        parseInput();
    }
    token = getNextToken(); // Consume ')'

}
// split文の解析
function parseSplit(){
    token = getNextToken(); // Consume 'split'
    if(token.type !== tk_type.TK_L_PAR){
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    if(token.type === tk_type.TK_STRING){
        token = getNextToken(); // Consume 'string'
    }
    if(token.type !== tk_type.TK_R_PAR){
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
}
// list文の解析
function parseList(){
    token = getNextToken(); // Consume 'list'
    if(token.type !== tk_type.TK_L_PAR){
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    if(token.type === tk_type.TK_MAP){
        parseMap();
    }
    if(token.type !== tk_type.TK_R_PAR){
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
}

function parseLists(){
    if(token.type === tk_type.TK_INT || token.type === tk_type.TK_FL){
        parseInt();
    }else if(token.type === tk_type.TK_INPUT){
        parseInput();
    }else if(token.type === tk_type.TK_MAP){
        parseMap();
    }else if(token.type === tk_type.TK_LIST){
        parseList();
    }
    console.log(token.type, token.word);
    if(token.type !== tk_type.TK_FOR){
        throw new Error("'for' が必要です");
    }
    token = getNextToken(); // Consume 'for'
    if(token.type !== tk_type.TK_IDENTIFIER){
        throw new Error("識別子が必要です");
    }
    token = getNextToken(); // Consume identifier
    if(token.type !== tk_type.TK_IN){
        throw new Error("'in' が必要です");
    }
    token = getNextToken(); // Consume 'in'
    if(token.type !== tk_type.TK_RANGE){
        throw new Error("'range' が必要です");
    }
    token = getNextToken(); // Consume 'range'
    if(token.type !== tk_type.TK_L_PAR){
        throw new Error("'(' が必要です");
    }
    token = getNextToken(); // Consume '('
    parseExpression();
    if(token.type !== tk_type.TK_R_PAR){
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
    if(token.type !== tk_type.TK_R_INDEX){
        throw new Error("']' が必要です");
    }
    token = getNextToken(); // Consume ']'

}
// リスト式の解析
function parseListExpression() {
    let identifiers = [];
    while (token.type === tk_type.TK_IDENTIFIER || token.type === tk_type.TK_INTEGER || token.type === tk_type.TK_FLOAT || token.type === tk_type.TK_STRING) {
        identifiers.push(token);
        if(token.type === tk_type.TK_IDENTIFIER && flg_let === false){
            code_t += "let ";
            flg_let = true;
        }
        code_t += token.word;
        token = getNextToken();
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // Consume ','
        } else {
            break;
        }
    }
    return identifiers;
}

function parseExpressionList() {
    let expressions = [];
    parseExpression();
    expressions.push(token);
    while (token.type === tk_type.TK_COMMA) {
        token = getNextToken(); // Consume ','
        parseExpression();
        expressions.push(token);
    }
    return expressions;
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
    }else if(token.type === tk_type.TK_AND || token.type === tk_type.TK_OR){
        token = getNextToken(); // Consume 'and' or 'or'
        parseExpression();
    }else if(token.type === tk_type.TK_NOT){
        token = getNextToken(); // Consume 'not'
        if(token.type === tk_type.TK_IN){
            token = getNextToken(); // Consume 'in'
        }
        parseExpression();
    }
    if(token.type === tk_type.TK_EQUAL || token.type === tk_type.TK_GREATER || token.type === tk_type.TK_LESS || token.type === tk_type.TK_EXCLAMATION || token.type === tk_type.TK_IN || token.type === tk_type.TK_AND || token.type === tk_type.TK_OR){
        parseLogicalExpression();
    }
}
// 算術式の解析
function parseArithmeticExpression() {
    parseTerm();
    if(token.type === tk_type.TK_EQUAL){
        code_t += token.word;
        token = getNextToken(); // Consume '='
    }
    parseTerm();
}
// 項の解析
function parseTerm() {
    parseFactor();
    while (token.type === tk_type.TK_MULTIPLY || token.type === tk_type.TK_DIVIDE || token.type === tk_type.TK_PERCENT) {
        token = getNextToken(); // Consume '*' or '/' or '%'
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
        code_t += token.word;
        token = getNextToken(); // Consume literal or identifier
        if (token.type === tk_type.TK_L_INDEX) {
            parseIndexingExpression();
            if(token.type === tk_type.TK_L_INDEX) {
                parseIndexingExpression();
            }
        }
    } else if (token.type === tk_type.TK_L_INDEX) {
        parseListExpressionLiteral();
    } else if(token.type === tk_type.TK_DOT){
        token = getNextToken(); // Consume '.'
        if(token.type === tk_type.TK_IDENTIFIER){
            token = getNextToken(); // Consume identifier
        }else{
            throw new Error("識別子が必要です");
        }
        if(token.type === tk_type.TK_L_PAR){
            token = getNextToken(); // Consume '('
            parseExpression();
            if(token.type === tk_type.TK_R_PAR){
                token = getNextToken(); // Consume ')'
            }else{
                throw new Error("')' が必要です");
            }
        }
    }else if(token.type === tk_type.TK_L_BRACE){
        token = getNextToken(); // Consume '{'
        parseExpression();
        if(token.type === tk_type.TK_R_BRACE){
            token = getNextToken(); // Consume '}'
        }else{
            throw new Error("'}' が必要です");
        }
    }
}
// リストリテラルの解析
function parseListExpressionLiteral() {
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
// インデントされた2行目以降の文の解析
function parseIndentedStatementsSecond() {
    for (let i = 0; i < nestedLevel; i++) {
        token = getNextToken();
    }
    nestedLevel = nestedLevel_t;
    nestedLevel_t = token.tabCount;
    if (token.type === tk_type.TK_ELIF){
        parseElifStatement();
    }else if (token.type === tk_type.TK_ELSE){
        parseElseStatement();
    }else if (nestedLevel_t !== nestedLevel) {
        throw new Error("インデントが間違っています");
    }else {
        parseStatement();
        if(token.type !== tk_type.TK_ENTER){
            token = getNextToken();
        }
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
