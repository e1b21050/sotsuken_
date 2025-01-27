function getVariables(code, variableNamesInput) {
    // 変数名を取得
    let codeLines = code.split('\n');
    let lineNumberScoring = 1; // 行番号
    let tmpPointOfEmpties = 0; // 一時的保存減点
    let startEmptyline = 1; // 空行の開始行
    let endEmptyline = 1; // 空行の終了行
    let emptiesDouble = [];
    for (let line of codeLines) {
        // 変数→'='が含まれている行として処理
        if (line.includes('=') && !line.includes('==') && 
        !line.includes('!=') && !line.includes('<=') && 
        !line.includes('>=') && !line.includes('+=') &&
        !line.includes('-=') && !line.includes('*=') &&
        !line.includes('/=')) { 
            let variableName = line.split('=')[0].trim();
            let ValueOrName = line.split('=')[1].trim();
            // ,が含まれている場合は分割
            if (variableName.includes(',')) {
                variableName = variableName.split(',');
                for (let name of variableName) {
                    //重複を避ける
                    if (!variableNamesInput.includes(name.trim())){
                        variableNamesInput.push(name.trim());
                    }
                    if(!ValueOrName.includes('(')){
                        variableNamesInsert.push(name.trim());
                        variableNamesInsert.push(ValueOrName);
                    }
                }
            } else {
                //重複を避ける
                if (!variableNamesInput.includes(variableName)){
                    variableNamesInput.push(variableName);
                }
                if(!ValueOrName.includes('(')){
                    variableNamesInsert.push(variableName);
                    variableNamesInsert.push(ValueOrName);
                }
            }
            if(cntEmptyLine > 1 && line !== ''){
                endEmptyline = lineNumberScoring - 1;
                deductionPointOfEmptyLine++;
                cntEmptyLine = 0;
                resultEmptyLine += startEmptyline + '行-' + endEmptyline + '行 ';           
            }
        }else if(line === '\r' || line === '    \r'){
            if(cntEmptyLine === 0){
                startEmptyline = lineNumberScoring;
            }
            cntEmptyLine++;
        }else if(cntEmptyLine > 1 && line !== ''){
            endEmptyline = lineNumberScoring - 1;
            deductionPointOfEmptyLine++;
            cntEmptyLine = 0;
            resultEmptyLine += startEmptyline + '行-' + endEmptyline + '行 ';           
        }else{
            cntEmptyLine = 0;
        }
        // 空白が2つ以上含まれている行として処理
        if(line.includes('  ') && !line.includes('    ')){
            // 行の中で空白が2つ以上含まれている箇所をカウント
            emptiesDouble = line.match(/  /g);
            if(emptiesDouble.length > 0){
                deductionPointOfEmpties += emptiesDouble.length;
            }

        }
        // 括弧やコロンなどの後に空白が含まれている行として処理
        // ダメとするパターン(_を不要な空白とする)
        // ex.) print_(_b_, a_)
        if(line.includes(' (')){
            deductionPointOfEmpties++;
        }
        if(line.includes(' )')){
            deductionPointOfEmpties++;
        }
        if(line.includes('( ')){
            deductionPointOfEmpties++;
        }
        if(line.includes(' [')){
            deductionPointOfEmpties++;
        }
        if(line.includes(' ]')){
            deductionPointOfEmpties++;
        }
        if(line.includes('[ ')){
            deductionPointOfEmpties++;
        }
        if(line.includes(' ,')){
            deductionPointOfEmpties++;
        }
        if(line.includes(' :')){
            deductionPointOfEmpties++;
        }
        if(lineNumberScoring !== codeLines.length && deductionPointOfEmpties !== 0){
            resultEmpties += lineNumberScoring + '行目: ' + (deductionPointOfEmpties - tmpPointOfEmpties) + '箇所<br>';
        }
        lineNumberScoring++;
        tmpPointOfEmpties = deductionPointOfEmpties;
    }
    checkTmp(variableNamesInsert, variableNamesInput);
}

// swapでのパターン対応
function checkTmp(variableNamesInsert, variableNamesInput){
    if(variableNamesInsert.length === 6){
        if( variableNamesInsert[0] === variableNamesInput[2] && 
            variableNamesInsert[1] === variableNamesInput[0] && 
            variableNamesInsert[2] === variableNamesInput[0] &&
            variableNamesInsert[3] === variableNamesInput[1] &&
            variableNamesInsert[4] === variableNamesInput[1] &&
            variableNamesInsert[5] === variableNamesInput[2]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[2] && 
            variableNamesInsert[1] === variableNamesInput[1] && 
            variableNamesInsert[2] === variableNamesInput[1] &&
            variableNamesInsert[3] === variableNamesInput[0] &&
            variableNamesInsert[4] === variableNamesInput[0] &&
            variableNamesInsert[5] === variableNamesInput[2]){
                flgTmp = true;
            }
    }else if(variableNamesInsert.length === 12){
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[0] && 
            variableNamesInsert[2] === variableNamesInput[0] &&
            variableNamesInsert[3] === variableNamesInput[1] &&
            variableNamesInsert[4] === variableNamesInput[1] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[0] &&
            variableNamesInsert[8] === variableNamesInput[0] &&
            variableNamesInsert[9] === variableNamesInput[2] &&
            variableNamesInsert[10] === variableNamesInput[2] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[1] && 
            variableNamesInsert[2] === variableNamesInput[1] &&
            variableNamesInsert[3] === variableNamesInput[0] &&
            variableNamesInsert[4] === variableNamesInput[0] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[2] &&
            variableNamesInsert[8] === variableNamesInput[2] &&
            variableNamesInsert[9] === variableNamesInput[0] &&
            variableNamesInsert[10] === variableNamesInput[0] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[0] && 
            variableNamesInsert[2] === variableNamesInput[0] &&
            variableNamesInsert[3] === variableNamesInput[2] &&
            variableNamesInsert[4] === variableNamesInput[2] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[0] &&
            variableNamesInsert[8] === variableNamesInput[0] &&
            variableNamesInsert[9] === variableNamesInput[1] &&
            variableNamesInsert[10] === variableNamesInput[1] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[2] && 
            variableNamesInsert[2] === variableNamesInput[2] &&
            variableNamesInsert[3] === variableNamesInput[0] &&
            variableNamesInsert[4] === variableNamesInput[0] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[1] &&
            variableNamesInsert[8] === variableNamesInput[1] &&
            variableNamesInsert[9] === variableNamesInput[0] &&
            variableNamesInsert[10] === variableNamesInput[0] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[1] && 
            variableNamesInsert[2] === variableNamesInput[1] &&
            variableNamesInsert[3] === variableNamesInput[2] &&
            variableNamesInsert[4] === variableNamesInput[2] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[0] &&
            variableNamesInsert[8] === variableNamesInput[0] &&
            variableNamesInsert[9] === variableNamesInput[1] &&
            variableNamesInsert[10] === variableNamesInput[1] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[2] && 
            variableNamesInsert[2] === variableNamesInput[2] &&
            variableNamesInsert[3] === variableNamesInput[1] &&
            variableNamesInsert[4] === variableNamesInput[1] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[1] &&
            variableNamesInsert[8] === variableNamesInput[1] &&
            variableNamesInsert[9] === variableNamesInput[0] &&
            variableNamesInsert[10] === variableNamesInput[0] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
    }
}

// 単一入力を複数文を一文にまとめる
function convertToPython(code) {
    let codeLines = code.split('\n');
    let convertedCode = '';
    let cnt = 0;
    // 1行ずつ処理
    for (let line of codeLines) {
        // input()を','に変換
        if (line.includes('map(')){
        }else if(line.match(/input\(\)/)){
            line = line.replace(/=input\(\)/g, ',');
            line = line.replace(/= input\(\)/g, ',');
            cnt++;
        }else{
            if(cnt > 1){
                // 最後の','を'= map(int, input().split())\n'に変換
                convertedCode = convertedCode.replace(/,([^,]*)$/, '= map(int, input().split())\n');
                cnt = 0;
            }else if(cnt == 1){
                // ','を'= int(input())\n'に変換
                convertedCode = convertedCode.replace(/,/g, '= input()\n');
                cnt = 0;
            }
        }
        convertedCode += line;
        if(cnt === 0){
            convertedCode += '\n';
        }
    }

    return convertedCode;
}