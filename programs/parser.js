let pushRun_parser = document.getElementById("run");

let currentTokenIndex = 0;
let tokens = [];
let token;

function tokenName(tokenNumber) {
    switch (tokenNumber) {
        case 2:
            return tk_type.TK_INTEGER;
        case 3:
            return tk_type.TK_FLOAT;
        case 4:
            return tk_type.TK_STRING;
        case 5:
            return tk_type.TK_PRINT;
        case 6:
            return tk_type.TK_L_PAR;
        case 7:
            return tk_type.TK_R_PAR;
        case 8:
            return tk_type.TK_COMMA;
        case 9:
            return tk_type.TK_EQUAL;
        case 10:
            return tk_type.TK_COLON;
        case 11:
            return tk_type.TK_L_INDEX;
        case 12:
            return tk_type.TK_R_INDEX;
        case 13:
            return tk_type.TK_FOR;
        case 14:
            return tk_type.TK_IN;
        case 15:
            return tk_type.TK_RANGE;
        case 16:
            return tk_type.TK_TAB;
        case 17:
            return tk_type.TK_ENTER;
        case 18:
            return tk_type.TK_SEPARATOR;
        case 19:
            return tk_type.TK_END;
        case 20:
            return tk_type.TK_IF;
        case 21:
            return tk_type.TK_ELIF;
        case 22:
            return tk_type.TK_ELSE;
        default:
            return tk_type.TK_IDENTIFIER;;
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
    try {
        while (currentTokenIndex < tokens.length) {
            parseStatement();
        }
        console.log("構文解析成功");
    } catch (error) {
        console.error("構文エラー: " + error.message);
    }
}

function parseStatement() {
    token = getNextToken();
    console.log("parseStatement: " + token.type);
    switch (token.type) {
        case tk_type.TK_IDENTIFIER:
            parseExpressionStatement();
            break;
        case tk_type.TK_PRINT:
            parsePrintStatement();
            break;
        case tk_type.TK_ENTER:
            break;
        default:
            throw new Error("不明な文です: " + token.tokenNumber);
    }
}

function parsePrintStatement() {
    token = getNextToken();
    console.log("parsePrintStatement: " + token.type);
    if (token.type !== tk_type.TK_L_PAR) {
        throw new Error("'(' が必要です");
    }

    token = getNextToken();
    console.log("parsePrintStatement: " + token.type);
    while (token.type !== tk_type.TK_R_PAR) {
        parseExpression();
        console.log("parsePrintStatement: " + token.type);
        token = getNextToken();
        if (token.type === tk_type.TK_COMMA) {
            getNextToken(); // ',' を消費
            token = getNextToken();
            if (token.type === tk_type.TK_IDENTIFIER) {
                if (token.value === "sep") {
                    parseSepStatement();
                } else if (token.value === "end") {
                    parseEndStatement();
                }
            }
        } else {
            break;
        }
    }

    if(token.type !== tk_type.TK_R_PAR){
        token = getNextToken(); 
    }
    console.log("parsePrintStatement: " + token.type);
    if (token.type !== tk_type.TK_R_PAR) {
        throw new Error("')' が必要です");
    }

    token = getNextToken();
    if(token.type !== tk_type.TK_ENTER){
        token = getNextToken(); 
    }
    console.log("parsePrintStatement: " + token.type);
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("print文の後に改行が必要です");
    }
}

function parseSepStatement() {
    if (token.type !== tk_type.TK_IDENTIFIER || token.value !== "sep") {
        throw new Error("'sep' が必要です");
    }
    token = getNextToken();
    if (token.type !== tk_type.TK_EQUAL) {
        throw new Error("'=' が必要です");
    }
    token = getNextToken();
    if (token.type !== tk_type.TK_STRING) {
        throw new Error("sepには文字列が必要です");
    }
    token = getNextToken();
}

function parseEndStatement() {
    if (token.type !== tk_type.TK_IDENTIFIER || token.value !== "end") {
        throw new Error("'end' が必要です");
    }
    token = getNextToken();
    if (token.type !== tk_type.TK_EQUAL) {
        throw new Error("'=' が必要です");
    }
    token = getNextToken();
    if (token.type !== tk_type.TK_STRING) {
        throw new Error("endには文字列が必要です");
    }
    token = getNextToken();
}

function parseExpressionStatement() {
    parseExpression();
    if(token.type !== tk_type.TK_ENTER){
        token = getNextToken(); 
    }
    console.log("parseExpressionStatement: " + token.type);
    if (token.type !== tk_type.TK_ENTER) {
        throw new Error("式文の後に改行が必要です");
    }
}

function parseExpression() {
    if (token.type === tk_type.TK_IDENTIFIER) {
        token = getNextToken();
        if (token.type === tk_type.TK_EQUAL) {
            parseExpression2();
        } 
    } else {
        parseExpression2();
    }
}

function parseExpression2() {
    if(token.type === tk_type.TK_EQUAL){
        token = getNextToken();
    }
    console.log("parseExpression2: " + token.type);
    if (token.type !== tk_type.TK_IDENTIFIER && token.type !== tk_type.TK_INTEGER &&
        token.type !== tk_type.TK_FLOAT && token.type !== tk_type.TK_STRING && token.type !== tk_type.TK_R_PAR) {
        throw new Error("識別子、整数、実数、または文字列が必要です");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    pushRun_parser.addEventListener("click", function() {
        let code = editor.getSession().getValue();
        let parsedTokens = processCode(code);
        parseTokens(parsedTokens);
    });
});
