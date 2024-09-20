let push_parser = document.getElementById("compile");

let currentTokenIndex = 0;
let tokens = [];
let token;
let token_tmp;
let nestedLevel;
let nestedLevel_t;
let nestedlevel_if;
let identifierImport;
let cnt_else = new Number(nestedLevel);
let cnt_shugo = 0;
let code_ts = [];
let code_t = "";
let code_result = "";
let i;
let resultDiv = document.getElementById('result');

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
    resultDiv.innerHTML = '<p>＜構文解析ログ＞</p>';

    try {
        parseProgram();
        appendToResult("正常に終了しました");
    } catch (error) {
        if (token) {
            console.log(token.type, token.word, token.lineNumber);
        }
        appendToResult(token.lineNumber + "行目  構文エラー: " + error.message, true);
    }
}

// プログラムの解析
function parseProgram() {
    while (currentTokenIndex < tokens.length) {
        parseStatement();
    }
}


// 文の解析
function parseStatement() {
    token = getNextToken();
    //console.log(token);
    switch (token.type) {
        case tk_type.TK_IMPORT:
            parseImportStatement();
            break;
        case tk_type.TK_IDENTIFIER:
        case tk_type.TK_INTEGER:
        case tk_type.TK_FLOAT:
        case tk_type.TK_STRING:
        case tk_type.TK_L_BRACE:
        case tk_type.TK_L_PAR:
        case tk_type.TK_L_INDEX: 
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
        case tk_type.TK_TAB:
            parseIndentedStatementsSecond();
            break;
        case tk_type.TK_ENTER:
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
    token = getNextToken(); // Consume identifier
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("import文の後に改行が必要です");
    }
}

//式文の解析
function parseExpressionStatement() {
    parseExpression();
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("式の後に改行が必要です");
    }
}


// 式の解析
function parseExpression() {
    if (token.type === tk_type.TK_IDENTIFIER) {
        while (true) {
            if(token.type === tk_type.TK_IDENTIFIER || token.type === tk_type.TK_COMMA){
                token = getNextToken(); 
            }else{
                break;
            }
        }
        if (token.type === tk_type.TK_EQUAL) {
            parseAssignmentStatement();
        } else if (token.type === tk_type.TK_L_INDEX) {
            parseIndexingExpression();
            if(token.type === tk_type.TK_EQUAL){
                parseAssignmentStatement();
            }
            if(token.type === tk_type.TK_COMMA){
                token = getNextToken(); // Consume ','
                parseExpression();
            }
        }else if(token.type === tk_type.TK_DOT){
            token = getNextToken(); // Consume '.'
            if(token.type === tk_type.TK_IDENTIFIER){
                token = getNextToken(); // Consume identifier
            }else{
                throw new Error("識別子が必要です");
            }
            if(token.type === tk_type.TK_L_PAR){
                token = getNextToken(); // Consume '('
                parseExpression();
                if(token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS || token.type === tk_type.TK_MULTIPLY || token.type === tk_type.TK_DIVIDE){
                    parseArithmeticExpression();
                }
                if(token.type === tk_type.TK_R_PAR){
                    token = getNextToken(); // Consume ')'
                }else{
                    throw new Error("')' が必要です");
                }
            }
        }else if(token.type === tk_type.TK_L_PAR){
            token = getNextToken(); // Consume '('
            parseExpression();
            if(token.type === tk_type.TK_R_PAR){
                token = getNextToken(); // Consume ')'
            }else{
                throw new Error("')' が必要です");
            }
        }
        parseArithmeticExpression();
    }else if (token.type === tk_type.TK_L_BRACE) {
        parseShugoStatement();
    }else if (token.type === tk_type.TK_L_PAR) {
        parseKetsugouStatement();
    }else if (token.type === tk_type.TK_L_INDEX) {
        parseIndexingExpression();
    }else{
        parseArithmeticExpression();
    }
}

// 集合文の解析
function parseShugoStatement() {
    cnt_shugo += 1;
    token = getNextToken(); // Consume '{'
    while (true) {
        parseExpression();   
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // ',' を消費
        }else if (token.type === tk_type.TK_R_BRACE) {
            break;
        }
    }
    if (token.type !== tk_type.TK_R_BRACE) {
        throw new Error("'}' が必要です");
    }
    token = getNextToken(); // Consume '}'
}

// 結合文の解析
function parseKetsugouStatement() {
    token = getNextToken(); // Consume '('
    while (true) {
        parseExpression();
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // ',' を消費
        }else if (token.type === tk_type.TK_R_PAR) {
            break;
        }
    }
    if (token.type !== tk_type.TK_R_PAR) {
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
}

// リストの解析
function parseListExpressionLiteral() {
    while (true) {
        parseExpression();
        if (token.type === tk_type.TK_COMMA) {
            token = getNextToken(); // ',' を消費
        }else if (token.type === tk_type.TK_R_INDEX) {
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
    if (token.type !== tk_type.TK_INT && token.type !== tk_type.TK_FL && token.type !== tk_type.TK_MAP && token.type !== tk_type.TK_LIST && token.type !== tk_type.TK_INPUT) {
        parseExpression();
        if(token.type === tk_type.TK_COLON){
            token = getNextToken(); // Consume ':'
            parseExpression();
            if(token.type === tk_type.TK_COLON){
                token = getNextToken(); // Consume ':'
                parseExpression();
            }
        }
    }else{
        parseLists();
    }
    while (token.type === tk_type.TK_COMMA) {
        token = getNextToken(); // Consume ','
        parseExpression();
    }
    if (token.type !== tk_type.TK_R_INDEX) {
        throw new Error("']' が必要です");
    }
    token = getNextToken(); // Consume ']'
}

// 代入文の解析
function parseAssignmentStatement() {
    if (token.type !== tk_type.TK_EQUAL) {
        throw new Error("代入文には'='が必要です");
    }
    token = getNextToken(); // Consume '='
    if (token.type === tk_type.TK_INPUT){
        parseInput();
    }else if (token.type === tk_type.TK_INT || token.type === tk_type.TK_FL){
        parseInt();
    }else if (token.type === tk_type.TK_MAP){
        parseMap();
    }else if (token.type === tk_type.TK_LIST){
        parseList();
    }else {
        parseExpression();
    }
}

// 算術式の解析
function parseArithmeticExpression() {
    parseArithmeticTerm1();
    while (token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS || token.type === tk_type.TK_EQUAL) {
        token = getNextToken(); // Consume '+', '-' or '='
        parseArithmeticTerm1();
    }
}

// 算術項1の解析
function parseArithmeticTerm1() {
    parseArithmeticTerm2();
    if (token.type === tk_type.TK_MULTIPLY) {
        token = getNextToken(); // Consume '*'
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseArithmeticTerm2();
    }else if(token.type === tk_type.TK_DIVIDE){
        token = getNextToken(); // Consume '/'
        if(token.type === tk_type.TK_DIVIDE){
            token = getNextToken(); // Consume '/'
        }
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseArithmeticTerm2();
    }else if(token.type === tk_type.TK_PERCENT){
        token = getNextToken(); // Consume '%'
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseArithmeticTerm2();
    }
}

// 算術項2の解析
function parseArithmeticTerm2() {
    parseArithmeticFactor();
    if (token.type === tk_type.TK_MULTIPLY) {
        token = getNextToken(); // Consume '*'
        if (token.type === tk_type.TK_MULTIPLY) {
            token = getNextToken(); // Consume '*'
        }
        if(token.type === tk_type.TK_EQUAL){
            token = getNextToken(); // Consume '='
        }
        parseArithmeticFactor();
    }
}

// 算術因子の解析
function parseArithmeticFactor() {
    if (token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS) {
        token = getNextToken(); // Consume '+' or '-'
    }
    if (token.type === tk_type.TK_L_PAR) {
        token = getNextToken(); // Consume '('
        parseArithmeticExpression();
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
        }else if(token.type === tk_type.TK_COMMA){
            token = getNextToken(); // Consume ','
            parseExpression();
        }else if(token.type === tk_type.TK_L_PAR){
            token = getNextToken(); // Consume '('
            parseExpression();
            if(token.type !== tk_type.TK_R_PAR){
                throw new Error("')' が必要です");
            }
            token = getNextToken(); // Consume ')'
        }else if(token.type === tk_type.TK_DOT){
            token = getNextToken(); // Consume '.'
            if(token.type === tk_type.TK_IDENTIFIER){
                token = getNextToken(); // Consume identifier
            }else{
                throw new Error("識別子が必要です");
            }
            if(token.type === tk_type.TK_L_PAR){
                token = getNextToken(); // Consume '('
                parseExpression();
                if(token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS || token.type === tk_type.TK_MULTIPLY || token.type === tk_type.TK_DIVIDE){
                    parseArithmeticExpression();
                }
                if(token.type === tk_type.TK_R_PAR){
                    token = getNextToken(); // Consume ')'
                }else{
                    throw new Error("')' が必要です");
                }
            }
        }
    }if(token.type === tk_type.TK_DOT){
        token = getNextToken(); // Consume '.'
        if(token.type === tk_type.TK_IDENTIFIER){
            token = getNextToken(); // Consume identifier
        }else{
            throw new Error("識別子が必要です");
        }
        if(token.type === tk_type.TK_L_PAR){
            token = getNextToken(); // Consume '('
            parseExpression();
            if(token.type === tk_type.TK_PLUS || token.type === tk_type.TK_MINUS || token.type === tk_type.TK_MULTIPLY || token.type === tk_type.TK_DIVIDE){
                parseArithmeticExpression();
            }
            if(token.type === tk_type.TK_R_PAR){
                token = getNextToken(); // Consume ')'
            }else{
                throw new Error("')' が必要です");
            }
        }
    }
}

// if文の解析
function parseIfStatement() {
    nestedlevel_if = token.tabCount;
    cnt_else[nestedLevel] = 0;
    token = getNextToken(); // Consume 'if'
    parseConditionExpression();
    if (token.type !== tk_type.TK_COLON) {
        throw new Error("':' が必要です");
    }
    token = getNextToken(); // Consume ':'
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("if文の後に改行が必要です");
    }
    //console.log(token);
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
    parseConditionExpression();
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

// 条件式の解析
function parseConditionExpression() {
    parseConditionTerm();
    if (token.type === tk_type.TK_OR) {
        token = getNextToken(); // Consume 'or'
        parseConditionTerm();
    }
}

// 条件項の解析
function parseConditionTerm() {
    parseConditionFactor();
    if (token.type === tk_type.TK_AND) {
        token = getNextToken(); // Consume 'and'
        parseConditionFactor();
    }
}

// 条件因子の解析
function parseConditionFactor() {
    if (token.type === tk_type.TK_L_PAR && cnt_shugo === 0) {
        token = getNextToken(); // Consume '('
        parseConditionExpression();
        if (token.type !== tk_type.TK_R_PAR) {
            throw new Error("')' が必要です");
        }
        token = getNextToken(); // Consume ')'
    } else {
        parseCompareExpression();
    }
}

// 比較式の解析
function parseCompareExpression() {
    if (token.type === tk_type.TK_L_PAR && cnt_shugo !== 0) {
        parseKetsugouStatement();
    } else if (token.type === tk_type.TK_L_INDEX) {
        parseIndexingExpression();
    } else {
        parseArithmeticExpression();
    }
    if (token.type === tk_type.TK_EQUAL || token.type === tk_type.TK_EXCLAMATION || token.type === tk_type.TK_GREATER || token.type === tk_type.TK_LESS) {
        token = getNextToken(); // Consume '=', '!', '<', '<'
        if (token.type === tk_type.TK_EQUAL) {
            token = getNextToken(); // Consume '='
        }
        parseArithmeticExpression();
        if (token.type === tk_type.TK_EQUAL || token.type === tk_type.TK_EXCLAMATION || token.type === tk_type.TK_GREATER || token.type === tk_type.TK_LESS) {
            parseCompareExpression();
        }
    }
    if(token.type === tk_type.TK_IN){
        token = getNextToken(); // Consume 'in'
        parseExpression();
    }
    if (token.type === tk_type.TK_NOT) {
        token = getNextToken(); // Consume 'not'
        if (token.type === tk_type.TK_IN) {
            token = getNextToken(); // Consume 'in'
        }
        if(token.type !== tk_type.TK_L_PAR){
            parseExpression();
        }else{
            token = getNextToken(); // Consume '('
            parseConditionExpression();
            if(token.type !== tk_type.TK_R_PAR){
                throw new Error("')' が必要です");
            }
            token = getNextToken(); // Consume ')'
        }
    }
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
    
    if (token.type !== tk_type.TK_R_PAR) {
        throw new Error("')' が必要です");
    }
    token = getNextToken(); // Consume ')'
}

// while文の解析
function parseWhileStatement() {
    token = getNextToken(); // Consume 'while'
    parseConditionExpression();
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
    let isCondition = false; // 条件式かどうかを判定するフラグ
    while (token.type !== tk_type.TK_R_PAR) {
        if (isConditionExpression(token) || token.word === "True" || token.word === "False") {
            isCondition = true;
            parseConditionExpression(); // 条件式の解析
        } else {
            parseExpression();
        }
        if (token.type === tk_type.TK_SEPARATOR) {
            parseSepExpression();
        }else if (token.type === tk_type.TK_END) {
            parseEndExpression();
        }else if (token.type === tk_type.TK_INT || token.type === tk_type.TK_FL){
            parseInt();
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

// 条件式かどうかを判定する関数
function isConditionExpression(token) {
    if(token.type === tk_type.TK_EQUAL || token.type === tk_type.TK_EXCLAMATION || token.type === tk_type.TK_GREATER || token.type === tk_type.TK_LESS || token.type === tk_type.TK_NOT || token.type === tk_type.TK_IN){
        return true;
    }else{
        return false;
    }
}

//sep式の解析
function parseSepExpression() {
    token = getNextToken(); // 'sep' を消費
    if (token.type !== tk_type.TK_EQUAL) {
        throw new Error("sepの後に'='が必要です");
    }
    token = getNextToken(); // '=' を消費
    if (token.type !== tk_type.TK_STRING) {
        throw new Error("sepの後に文字列が必要です");
    }
    token = getNextToken(); // 文字列を消費
}

//end式の解析
function parseEndExpression() {
    token = getNextToken(); // 'end' を消費
    if (token.type !== tk_type.TK_EQUAL) {
        throw new Error("endの後に'='が必要です");
    }
    token = getNextToken(); // '=' を消費
    if (token.type !== tk_type.TK_STRING) {
        throw new Error("endの後に文字列が必要です");
    }
    token = getNextToken(); // 文字列を消費
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
    if(token.type === tk_type.TK_L_INDEX){
        parseIndexingExpression();
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

// リスト式の解析
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

// 実行部分
document.addEventListener("DOMContentLoaded", function () {
    push_parser.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        parsedTokens = []; 
        parsedTokens = processCode(code);
        parseTokens(parsedTokens);
    });
});
