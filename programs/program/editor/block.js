let flg = 0; // for文のフラグ
let flgDoubleFor = 0; // 2重for文のフラグ
let flgDoubleForLoop = 0; 
let flgWhile = 0; // while文のフラグ
let variable = []; // 変数名
let value = []; // 値
let number = 0; // 変数の数
let codeBlockTmp = ""; // コードブロックの一時保存
let variablesSecond = []; // 2重for文の変数名
let indentDownNumOfLines = 0; //インデントが下がった行数
const indentBlock = []; // インデントブロック
const indentBlockTmp = []; // インデントブロックの一時保存

//コードブロックとして変換する関数
function getCodeBlock(lines, index) {
    let codeBlock = ""; // コードブロック
    let currentIndentLevel = getIndentLevel(lines[index]); // 現在のインデントレベル
    
    // `if` 文 or `elif` 文 or `else` 文の変換
    if (lines[index].trim().startsWith("if ") || lines[index].trim().startsWith("elif ") || lines[index].trim().startsWith("else")) {
        //インデントが同じになるまでコードを追加
        let i = index + 1; // インデントが同じ行のインデックス
        let codeBlockNest = ""; // ネストされたコードブロック
        codeBlockNest = lines[index].replace(/^\s+/, '');  // `if` 文 or `elif` 文 or `else` 文
        if(getIndentLevel(lines[index]) === 0){ // インデントレベル(深さ)が0の時
            while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
                // インデントレベル(深さ)が現在のインデントレベルより大きい間codeBlockに追加
                let code = lines[i];
                if(getIndentLevel(lines[i]) > getIndentLevel(lines[i-1])){
                        codeBlock += codeBlockTmp + codeBlockNest + ' ' + code.replace(/^\s+/, '') + "\n";
                }else{
                    codeBlock += code.replace(/^\s+/, '') + "\n";
                }
                // 追加内容を保持
                codeBlockTmp = codeBlock;
                i++;
            }
        }else{
            // インデントレベル(深さ)が0以外の時,保持内容を追加
            codeBlock = codeBlockTmp;
        }
    }
    // `for` 文の変換
    else if (lines[index].trim().startsWith("for ") && flgDoubleFor === 0) {
        flg = 1;
        indentDownNumOfLines = 1;
        if(lines[index-indentDownNumOfLines]){
            while(true){
                if(lines[index-indentDownNumOfLines]){
                    indentDownNumOfLines++;
                }else{
                    break;
                }
            }
            for(let i = indentDownNumOfLines; i > 1; i--){
                codeBlock += lines[index-i+1]+ "\n";
            }
            codeBlock += "i=0\n";
        }else{
            codeBlock = "i=0\n";
        }
        loop.push(codeBlock);
        let iterator = {
            variable: null,
            value: null
        };
        let iteratorSecond = {
            variable: null,
            value: null
        };
        iterator.variable = getLoopIterable(lines[index]);
        // iteratorがrangeの場合の処理
        if(iterator.variable.startsWith('range(')) {
            iterator.variable = null;
        }
        for(let i = 0; i < number; i++) {
            if(iterator.variable === variable[i]) {
                iterator.value = value[i];
            }
        }
        // iteratorがrange(O)の場合の処理
        let iterator_f = getLoopIterable_f(lines[index]);
        let iteratorSecond_f;
        // iteratorがrange(O, O)の場合の処理
        let iterator_d1 = getLoopIterable_d1(lines[index]);
        let iterator_d2 = getLoopIterable_d2(lines[index]);
        let iteratorSecond_d1;
        let iteratorSecond_d2;
        // iteratorがrange(O, O, O)の場合の処理
        let iterator_t1 = getLoopIterable_t1(lines[index]);
        let iterator_t2 = getLoopIterable_t2(lines[index]);
        let iterator_t3 = getLoopIterable_t3(lines[index]);
        let iteratorSecond_t1;
        let iteratorSecond_t2;
        let iteratorSecond_t3;
        
        let loopVariable = getLoopVariable(lines[index]);
        let loopVariableSecond;
        let codeBlockNest = "";
        let variableIf = "";
        let i = index + 1;
        if(indentBlock.length === 0){
            while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
                let code = lines[i].replace(/\r/g, '');
                if(lines[i].trim().startsWith("if ") || lines[i].trim().startsWith("elif ") || lines[i].trim().startsWith("else ")){
                    // インデントの削除
                    codeBlockNest = code.replace(/^\s+/, '');
                    variableIf = getIfVariable(lines[i]);
                    if(variableIf !== null){
                        codeBlockNest = codeBlockNest.replace(variableIf, iterator.variable + '[i]');
                    }else{
                        codeBlockNest = code.replace(/^\s+/, '');
                    }
                }else if(lines[i].trim().startsWith("for ")){
                    flgDoubleFor = 1;
                    iteratorSecond.variable = getLoopIterable(lines[i]);
                    // iteratorがrangeの場合の処理
                    if(iteratorSecond.variable.startsWith('range(')) {
                        iteratorSecond.variable = null;
                    }
                    for(let j = 0; j < number; j++) {
                        if(iteratorSecond.variable === variable[j]) {
                            iteratorSecond.value = value[j];
                        }
                    }
                    // iteratorがrange(O)の場合の処理
                    iteratorSecond_f = getLoopIterable_f(lines[i]);
                    // iteratorがrange(O, O)の場合の処理
                    iteratorSecond_d1 = getLoopIterable_d1(lines[i]);
                    iteratorSecond_d2 = getLoopIterable_d2(lines[i]);
                    // iteratorがrange(O, O, O)の場合の処理
                    iteratorSecond_t1 = getLoopIterable_t1(lines[i]);
                    iteratorSecond_t2 = getLoopIterable_t2(lines[i]);
                    iteratorSecond_t3 = getLoopIterable_t3(lines[i]);
                    loopVariableSecond = getLoopVariable(lines[i]);
                    let j = i + 1;
                    while (j < lines.length && getIndentLevel(lines[j]) > getIndentLevel(lines[i])) {
                        let code = lines[j].replace(/\r/g, '');
                        if(getIndentLevel(lines[j]) > getIndentLevel(lines[j-1])){
                            indentBlockTmp.push(code.replace(/^\s+/, '') + "\n");
                            indentBlockTmp.push('j+=1\n');
                        }else{
                            indentBlockTmp.push(code.replace(/^\s+/, '') + "\n");
                        }
                        j++;
                    }
                }else if(getIndentLevel(lines[i]) > getIndentLevel(lines[i-1])){
                        if(variableIf !== ''){
                            indentBlock.push(codeBlockNest + " " + code.replace(/^\s+/, '') + "\n");
                            indentBlock.push(codeBlockNest + variableIf + "=" + iterator.variable + "[i]\n");
                        }else{
                            indentBlock.push(code.replace(/^\s+/, '') + "\n");
                        }
                }else{
                    indentBlock.push(code.replace(/^\s+/, '') + "\n");
                }
                i++;
            }
            indentBlock.push("i+=1\n");
        }
        //console.log(indentBlock);
        //console.log(indentBlockTmp);
        //console.log(variable, value, iterator, iterator_f, iterator_d1, iterator_d2, iterator_t1, iterator_t2, iterator_t3, variableIf);
        //console.log(iteratorSecond, iteratorSecond_f, iteratorSecond_d1, iteratorSecond_d2, iteratorSecond_t1, iteratorSecond_t2, iteratorSecond_t3);
        if (iterator.variable !== null && iterator.value !== null) {
            loop.push(codeBlock);
            let j = 0;
            let k = 0;
            let elementCnt = 0; // 要素数
            let elementCntSecond = 0; // 要素数(2段)
            // iteratorが文字列のとき文字列を配列に変換
            if(isString(iterator.value) || isNumber(iterator.value)) {
                iterator.value.split('');
                elementCnt = iterator.value.length - 2; // 配列の長さ-'"'の数
            }
            // iteratorが配列のとき配列に変換
            if(iterator.value.includes(',')) {
                iterator.value = iterator.value.replace(/ /g, '').split(',');
                //'['の数を数える
                let cnt = 0;
                for(let i = 0; i < iterator.value.length; i++) {
                    if(iterator.value[i].includes('[')) {
                        cnt++;
                    }
                }
                if(cnt == 1) {
                    elementCnt = iterator.value.length; // 配列の長さ
                }else {
                    elementCnt = cnt;
                    elementCntSecond = iterator.value.length/cnt; 
                }
            }
            if(iteratorSecond.variable !== null) {
                for (j = 0; j < elementCnt; j++) {
                    for(k = 0; k < elementCntSecond; k++) {
                        indentBlockTmp.forEach(line => {
                            if(line.includes('print(')) {
                                if(j === 0 && k === 0){
                                    codeBlock += 'j=0\n\n\n';
                                    loop.push('\n\n');
                                }else if(k === 0) {
                                    codeBlock += 'j=0\n';
                                }
                                codeBlock += line.replace('(' + loopVariableSecond, '(' + iterator.variable + '[' + j + ']' + '[' + k + ']');
                            }else if(k === elementCntSecond - 1 && j === elementCnt - 1) {
                                codeBlock += line.replace('j+=1', '');
                            }else {
                                if(k !== elementCntSecond - 1) {
                                    codeBlock += line + '\n'; 
                                }else{
                                    codeBlock += line.replace('j+=1\n', '');
                                }
                            }
                            loop.push(codeBlock);
                        });
                        loop.push(codeBlock);
                    }
                    if(j !== elementCnt - 1) {
                        codeBlock += 'i+=1\n';
                    }
                }
                codeBlockTmp = codeBlock;
            }else {
                for (j = 0; j < elementCnt; j++) {
                    if(j === 0){
                        codeBlock += '\n';
                    }
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('(' + loopVariable, '(' + iterator.variable + '[' + j + ']');
                        loop.push(codeBlock);
                    });
                }
                codeBlock += "\n";
                loop.push(codeBlock);
                codeBlockTmp = codeBlock;
            }
        } else if (iterator_f !== null) {
            let j = 0;
            let k = 0;
            // iterator_fを数字に変換
            iterator_f = Number(iterator_f);
            iteratorSecond_f = Number(iteratorSecond_f);
            //console.log(iterator_f, iteratorSecond_f);
            // iteratorSecond_fがNaNでiteratorに数値があるとき
            if(isNaN(iteratorSecond_f) && !isNaN(iterator_f)) {
                 //console.log(indentBlock);
                 for (j = 0; j < iterator_f; j++) {
                    if(j === 0){
                        loop.push('\n');
                        codeBlock += '\n';
                    }
                    indentBlock.forEach(line => {
                        if(line.includes('[')) {
                            codeBlock += line.replace('[' + loopVariable, '[' + j); // print(x[i])に対応
                        }else if(line.includes('(')) {
                            codeBlock += line.replace('(' + loopVariable, '(' + j); // print(i)に対応
                        }else if(j === iterator_f - 1) {
                            codeBlock += line.replace('i+=1', '');
                        }else {
                            codeBlock += line;
                        }
                        loop.push(codeBlock);
                    });
                }
            }else {
                //console.log(indentBlock);
                for(j = 0; j < iterator_f; j++) {
                    for(k = 0; k < iteratorSecond_f; k++) {
                        indentBlockTmp.forEach(line => {
                            if(line.includes('[')) {
                                if(k === 0){
                                    codeBlock += 'j=0\n';
                                    if(j === 0){
                                        codeBlock += '\n\n';
                                        loop.push('\n');
                                        loop.push(codeBlock);
                                    }
                                }
                                codeBlock += line.replace('[' + loopVariable + ']' + '[' + loopVariableSecond, '[' + j + ']' + '[' + k); // print(x[i][j])に対応
                            }else if(k === iteratorSecond_f - 1) {
                                codeBlock += line.replace('j+=1\n', '');
                            }else {
                                codeBlock += line + '\n';
                            }
                            loop.push(codeBlock);
                        });
                        loop.push(codeBlock);
                    }
                    if(j !== iterator_f - 1) {
                        codeBlock += 'i+=1\n';
                    }
                }
            }
            codeBlockTmp = codeBlock;
            //console.log(loop);
        } else if (iterator_d1 !== null && iterator_d2 !== null) {
            let j = 0;
            // iterator_d1~2を数字に変換
            iterator_d1 = Number(iterator_d1);
            iterator_d2 = Number(iterator_d2);
            for (j = iterator_d1; j < iterator_d2; j++) {
                codeBlock = codeBlock.replace('i=0', 'i=' + iterator_d1);
                indentBlock.forEach(line => {
                    if(line.includes('(')) {
                        codeBlock += line.replace('(' + loopVariable, '(' + j);
                    }else if(j == iterator_d2 - 1) {
                        codeBlock += line.replace('i+=1', '');
                    }else {
                        codeBlock += line;
                    }
                    loop.push(codeBlock);
                });
            }
            codeBlockTmp = codeBlock;
        } else if (iterator_t1 !== null && iterator_t2 !== null && iterator_t3 !== null) {
            // iterator_t1~3を数字に変換
            iterator_t1 = Number(iterator_t1);
            iterator_t2 = Number(iterator_t2);
            iterator_t3 = Number(iterator_t3);
            //console.log(iterator_t1, iterator_t2, iterator_t3);
            let j;
            // iterator_t3が正のときはiterator_t1がiterator_t2より小さい間ループ
            // iterator_t3が負のときはiterator_t1がiterator_t2より大きい間ループ
            if(iterator_t3 > 0) {
                for (j = iterator_t1; j < iterator_t2; j += iterator_t3) {
                    codeBlock = codeBlock.replace('i=0', 'i=' + iterator_t1);
                    indentBlock.forEach(line => {
                        if(line.includes('(')) {
                            codeBlock += line.replace('(' + loopVariable, '(' + j);
                        }else if(j == iterator_t2 - 1) {
                            codeBlock += line.replace('i+=1', '');
                        }else {
                            codeBlock += line.replace('i+=1', 'i+=' + iterator_t3);
                        }
                        loop.push(codeBlock);
                    });
                }
            }else {
                for (j = iterator_t1; j > iterator_t2; j += iterator_t3) {
                    codeBlock = codeBlock.replace('i=0', 'i=' + iterator_t1);
                    indentBlock.forEach(line => {
                        if(line.includes('(')) {
                            codeBlock += line.replace('(' + loopVariable, '(' + j);
                        }else if(j == iterator_t2 + 1) {
                            codeBlock += line.replace('i+=1', '');
                        }else {
                            codeBlock += line.replace('i+=1', 'i-=' + Math.abs(iterator_t3));
                        }
                        loop.push(codeBlock);
                    });
                }
            }
            codeBlockTmp = codeBlock;
        }
    }
    else if (lines[index].trim().startsWith("for ") && flgDoubleFor === 1) {
        codeBlock = codeBlockTmp;
        flgDoubleForLoop = flgDoubleFor;
        flgDoubleFor = 0;
    }   
    // `while` 文の変換
    else if (lines[index].trim().startsWith("while ")) {
        flg = 1;
        indentDownNumOfLines = 1;
        flgWhile = 1;
        if(lines[index-indentDownNumOfLines]){
            while(true){
                if(lines[index-indentDownNumOfLines]){
                    indentDownNumOfLines++;
                }else{
                    break;
                }
            }
            for(let i = indentDownNumOfLines; i > 1; i--){
                codeBlock += lines[index-i+1]+ "\n";
            }
        }
        codeBlock += "\n\n";
        loop.push(codeBlock);
        loop.push("\n");
        let loopCondition_s = getLoopWhileCondition_s(lines[index]);
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        if(indentBlock.length === 0){
            while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
                //\rを削除
                let code = lines[i].replace(/\r/g, '');
                indentBlock.push(code.replace(/^\s+/, ''));
                i++;
            }
        }
        if(loopCondition_s !== null){
            for(let m = 0; m < loopcnt_s; m++){    
                indentBlock.forEach(line => {
                    if(line !== ""){
                        codeBlock += line + "\n";
                        loop.push(codeBlock);
                    }
                });
            }
            codeBlock += "\n";
            loop.push(codeBlock);
            codeBlockTmp = codeBlock;
        }
    } else {
        //代入文の時は変数名と値を取得して保存する
        variable[number] = getVariable(lines[index]);
        value[number] = getValue(lines[index]);
        variablesSecond[number] = getVariables(lines[index]);
        number++;
        if(flg === 1){
            if(getIndentLevel(lines[index]) === 0){
                codeBlock = codeBlockTmp + lines[index] + "\n";
            }else{
                codeBlock = codeBlockTmp;
            }
        }else{
            codeBlock = lines.slice(0, index + 1).join('\n');
        }
    }
    return codeBlock;
}