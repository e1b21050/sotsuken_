let flg = 0;
let variable = [];
let value = [];
let number = 0;
let codeBlock2 = "";
function getCodeBlock(lines, index) {
    let codeBlock = "";
    let currentIndentLevel = getIndentLevel(lines[index]);
    
    // `if` 文の変換
    if (lines[index].trim().startsWith("if ")) {
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        let codeBlock_else = "";
        codeBlock_else = lines[index].replace(/^\s+/, '');  // `if` 文の追加
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            let code = lines[i];
            if(getIndentLevel(lines[i]) > getIndentLevel(lines[i-1])){
                    codeBlock = codeBlock_else + code.replace(/^\s+/, '') + "\n";
            }else{
                codeBlock = code.replace(/^\s+/, '') + "\n";
            }
            i++;
        }
    }
    // `elif` 文の変換
    else if (lines[index].trim().startsWith("elif ")) {
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        let codeBlock_else = "";
        codeBlock_else = lines[index].replace(/^\s+/, '');  // `elif` 文の追加
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            let code = lines[i];
            if(getIndentLevel(lines[i]) > getIndentLevel(lines[i-1])){
                    codeBlock = codeBlock_else + code.replace(/^\s+/, '') + "\n";
            }else{
                codeBlock = code.replace(/^\s+/, '') + "\n";
            }
            i++;
        }
    }
    // `else` 文の変換
    else if (lines[index].trim() === "else:") {
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        let codeBlock_else = "";
        codeBlock_else = lines[index].replace(/^\s+/, '');  // `else` 文の追加
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            let code = lines[i];
            if(getIndentLevel(lines[i]) > getIndentLevel(lines[i-1])){
                    codeBlock = codeBlock_else + code.replace(/^\s+/, '') + "\n";
            }else{
                codeBlock = code.replace(/^\s+/, '') + "\n";
            }
            i++;
        }
    }
    // `for` 文の変換
    else if (lines[index].trim().startsWith("for ")) {
        flg = 1;
        let l = 1;
        if(lines[index-l]){
            while(true){
                if(lines[index-l]){
                    l++;
                }else{
                    break;
                }
            }
            for(let i = l; i > 1; i--){
                codeBlock += lines[index-i+1]+ "\n";
            }
            codeBlock += "i=0\n";
        }else{
            codeBlock = "i=0\n";
        }
        let iterator = {
            variable: null,
            value: null
        };
        iterator.variable = getLoopIterable(lines[index]);
        // iteratorがrangeの場合の処理
        if(iterator.variable.startsWith('range(')) {
            iterator.variable = null;
        }
        if(iterator.variable === variable[number - 1]) {
            iterator.value = value[number - 1];
        }
        // iteratorがrange(O)の場合の処理
        let iterator_f = getLoopIterable_f(lines[index]);
        // iteratorがrange(O, O)の場合の処理
        let iterator_d1 = getLoopIterable_d1(lines[index]);
        let iterator_d2 = getLoopIterable_d2(lines[index]);
        // iteratorがrange(O, O, O)の場合の処理
        let iterator_t1 = getLoopIterable_t1(lines[index]);
        let iterator_t2 = getLoopIterable_t2(lines[index]);
        let iterator_t3 = getLoopIterable_t3(lines[index]);
        
        let loopVariable = getLoopVariable(lines[index]);
        const indentBlock = [];
        let codeBlock_else = "";
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            let code = lines[i];
            if(lines[i].trim().startsWith("if ") || lines[i].trim().startsWith("elif ") || lines[i].trim().startsWith("else ")){
                // インデントの削除
                codeBlock_else = code.replace(/^\s+/, '');
            }else if(getIndentLevel(lines[i]) > getIndentLevel(lines[i-1])){
                    indentBlock.push(codeBlock_else + code.replace(/^\s+/, '') + "\n");
            }else{
                indentBlock.push(code.replace(/^\s+/, '') + "\n");
            }
            i++;
        }
        indentBlock.push("i+=1\n");
        console.log(indentBlock);
        console.log(variable, value, iterator, iterator_f, iterator_d1, iterator_d2, iterator_t1, iterator_t2, iterator_t3);
        if (iterator.variable !== null && iterator.value !== null) {
            loop.push(codeBlock);
            let j = 0;
            let loopcnt = 0; // ループ回数
            // iteratorが文字列のとき文字列を配列に変換
            if(isString(iterator.value) || isNumber(iterator.value)) {
                iterator.value.split('');
                loopcnt = iterator.value.length - 2; // 配列の長さ-'"'の数
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
                    loopcnt = iterator.value.length; // 配列の長さ
                }else {
                    loopcnt = cnt; 
                }
            }
            for (j = 0; j < loopcnt; j++) {
                indentBlock.forEach(line => {
                    codeBlock += line.replace('(' + loopVariable, '(' + iterator.variable + '[' + j + ']');
                    loop.push(codeBlock);
                });
            }
            codeBlock2 = codeBlock;
        } else if (iterator_f !== null) {
            let j = 0;
            // iterator_fを数字に変換
            iterator_f = Number(iterator_f);
            for (j = 0; j < iterator_f; j++) {
                indentBlock.forEach(line => {
                    if(line.includes('[')) {
                        codeBlock += line.replace('[' + loopVariable, '[' + j); // print(x[i])に対応
                    }else if(line.includes('(')) {
                        codeBlock += line.replace('(' + loopVariable, '(' + j); // print(i)に対応
                    }else if(j == iterator_f - 1) {
                        codeBlock += line.replace('i+=1', '');
                    }else {
                        codeBlock += line;
                    }
                    loop.push(codeBlock);
                });
            }
            codeBlock2 = codeBlock;
        } else if (iterator_d1 !== null && iterator_d2 !== null) {
            let j = 0;
            // iterator_d1~4を数字に変換
            iterator_d1 = Number(iterator_d1);
            iterator_d2 = Number(iterator_d2);
            for (j = iterator_d1; j < iterator_d2; j++) {
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
            codeBlock2 = codeBlock;
        } else if (iterator_t1 !== null && iterator_t2 !== null && iterator_t3 !== null) {
            // iterator_t1~7を数字に変換
            iterator_t1 = Number(iterator_t1);
            iterator_t2 = Number(iterator_t2);
            iterator_t3 = Number(iterator_t3);
            //console.log(iterator_t1, iterator_t2, iterator_t3);
            let j;
            // iterator_t3が正のときはiterator_t1がiterator_t2より小さい間ループ
            // iterator_t3が負のときはiterator_t1がiterator_t2より大きい間ループ
            if(iterator_t3 > 0) {
                for (j = iterator_t1; j < iterator_t2; j += iterator_t3) {
                    indentBlock.forEach(line => {
                        if(line.includes('(')) {
                            codeBlock += line.replace('(' + loopVariable, '(' + j);
                        }else if(j == iterator_t2 - 1) {
                            codeBlock += line.replace('i+=1', '');
                        }else {
                            codeBlock += line;
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
                        }else if(j == iterator_d2 + 1) {
                            codeBlock += line.replace('i+=1', '');
                        }else {
                            codeBlock += line.replace('i+=1', 'i-=1');
                        }
                        loop.push(codeBlock);
                    });
                }
            }
            codeBlock2 = codeBlock;
        }
    }   
    // `while` 文の変換
    else if (lines[index].trim().startsWith("while ")) {
        flg = 1;
        let l = 1;
        if(lines[index-l]){
            while(true){
                if(lines[index-l]){
                    l++;
                }else{
                    break;
                }
            }
            for(let i = l; i > 0; i--){
                codeBlock = lines[index-i]+ "\n";
            }
        }
        let loopVariable = getLoopWhileVariable(lines[index]);
        let loopIterable = getLoopWhileIterable(lines[index]);
        let loopCondition = getLoopWhileConditon(lines[index]);
        let loopVariable_s = getLoopWhileVariable_s(lines[index]);
        let loopCondition_s = getLoopWhileConditon_s(lines[index]);
        let loopIterable_s = getLoopWhileIterable_s(lines[index]);
        //インデントが同じになるまでコードを追加
        const indentBlock = [];
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            indentBlock.push(lines[i].replace(/^\s+/, ''));
            i++;
        }
        if(loopVariable !== null && loopCondition !== null && loopIterable !== null){
            console.log(codeBlock);
            if (loopCondition === '<') {
                let j = 0;
                // loopIterableを数字に変換
                loopIterable = Number(loopIterable);
                while (j < loopIterable) {
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('('+loopVariable, '('+j) + "\n";
                        loop.push(codeBlock);
                    });
                    j++;
                }
                codeBlock2 = codeBlock;
            }else if (loopCondition === '>') {
                let j;
                for(let m = 0; m < variable.length; m++){
                    if(variable[m] === loopVariable){
                        j = value[m];
                    }
                }
                // loopIterableを数字に変換
                loopIterable = Number(loopIterable);
                while (j > loopIterable) {
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('('+loopVariable, '('+j) + "\n";
                        loop.push(codeBlock);
                    });
                    j--;
                }
                codeBlock2 = codeBlock;
            }else if (loopCondition === '<=') {
                let j = 0;
                // loopIterableを数字に変換
                loopIterable = Number(loopIterable);
                while (j <= loopIterable) {
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('('+loopVariable, '('+j) + "\n"; 
                        loop.push(codeBlock);
                    });
                    j++;
                }
                codeBlock2 = codeBlock;
            }else if (loopCondition === '>=') {
                let j;
                for(let m = 0; m < variable.length; m++){
                    if(variable[m] === loopVariable){
                        j = value[m];
                    }
                }
                // loopIterableを数字に変換
                loopIterable = Number(loopIterable);
                while (j >= loopIterable) {
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('('+loopVariable, '('+j) + "\n";
                        loop.push(codeBlock);
                    });
                    j--;
                }
                codeBlock2 = codeBlock;
            }
        }else if(loopVariable_s !== null && loopCondition_s !== null && loopIterable_s !== null){
            evaluted = loopVariable_s + ' ' + loopCondition_s + ' ' +loopIterable_s;
            codeBlock = codeBlock + "if " + evaluted + ": ";    
            indentBlock.forEach(line => {
                codeBlock += line + "\n";
                loop.push(codeBlock);
            });
            codeBlock2 = codeBlock;
        }
    } else {
        //代入文の時は変数名と値を取得して保存する
        variable[number] = getVariable(lines[index]);
        value[number] = getValue(lines[index]);
        number++;
        console.log(variable, value);
        if(flg === 1){
            codeBlock = codeBlock2;
        }else{
            codeBlock = lines.slice(0, index + 1).join('\n');
        }
        console.log(codeBlock);
    }
    
    return codeBlock;
}