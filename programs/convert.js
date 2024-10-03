let pushRun_convert = document.getElementById("run");
let pushRun_step = document.getElementById("run_step");
let pushRun_prev = document.getElementById("prev_step");
let pushRun_next = document.getElementById("next_step");
let pushRun_loop = document.getElementById("step_loop");
let pushRun_loop_prev = document.getElementById("prev_loop");
let pushRun_loop_next = document.getElementById("next_loop");

let currentStep = 0;
let codeLines = [];

let k = 0;
let loop = [];

async function loadPyodideAndPackages() {
    let pyodide = await loadPyodide();
    return pyodide;
}

// グローバル変数として、変数とその値を格納するオブジェクトを作成
let variables = {};

// 変数表を更新する関数
function updateVariableTable(code) {
    const tableBody = document.querySelector('#variables_table tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>'; // テーブルをクリア
    for (const [name, value] of Object.entries(variables)) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const valueCell = document.createElement('td');
        nameCell.textContent = name;
        valueCell.textContent = value;
        // codeにあたる部分のみ変数表に行を追加
        if(code.includes(name)){
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    }
}

// ステップごとの変数状態を保持するオブジェクト
let variables_step = {};

function updateVariableTable_step(code){
    const tableBody = document.querySelector('#variables_table_output tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>'; // テーブルをクリア
    for (const [name, value] of Object.entries(variables_step)) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const valueCell = document.createElement('td');
        nameCell.textContent = name;
        valueCell.textContent = value;
        // codeにあたる部分のみ変数表に行を追加
        if(code.includes(name)){
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    }
}

// ループごとの変数状態を保持するオブジェクト
let variables_loop = {};

function updateVariableTable_loop(code){
    const tableBody = document.querySelector('#variables_table_loop tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>'; // テーブルをクリア
    for (const [name, value] of Object.entries(variables_loop)) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const valueCell = document.createElement('td');
        nameCell.textContent = name;
        valueCell.textContent = value;
        // codeにあたる部分のみ変数表に行を追加
        if(code.includes(name)){
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    }
}

let pyodideReadyPromise = loadPyodideAndPackages();

function exe(code) {
    pyodideReadyPromise.then(pyodide => {
        try {
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

${code}

sys.stdout = old_stdout
mystdout.getvalue()
`;
            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("execute").innerHTML = "<p>＜実行結果＞</p><pre>" + formattedOutput + "</pre>";
            // Pyodideから変数を取得
            let variableNames = pyodide.globals.keys();
            for (let name of variableNames) {
                variables[name] = pyodide.globals.get(name);
            }
            // 変数表を更新
            updateVariableTable(code);
        } catch (error) {
            console.error(error);
        }
    });
}

function exe_step(lines, index) {
    pyodideReadyPromise.then(pyodide => {
        let accumulatedCode = getCodeBlock(lines, index);
        highlightLine(index); // 現在の行をハイライト
        //console.log(accumulatedCode); // デバッグ: 生成されたコードを確認
        try {
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 無限ループ防止のための制限
MAX_ITERATIONS = 1000
iteration_count = 0

def safe_exec(code, global_vars):
    global iteration_count
    try:
        if iteration_count >= MAX_ITERATIONS:
            print("Error: Too many iterations")
        else:
            exec(code, global_vars)
            iteration_count += 1
    except Exception as e:
        print(f"Error: {e}")

# コードブロック全体を実行
safe_exec('''${accumulatedCode}''', globals())

sys.stdout = old_stdout
mystdout.getvalue()
`;
            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre>" + formattedOutput + "</pre>";
            // Pyodideから変数を取得
            let variableNames = pyodide.globals.keys();
            for (let name of variableNames) {
                variables_step[name] = pyodide.globals.get(name);
            }
            // 変数表を更新
            updateVariableTable_step(accumulatedCode);
        } catch (error) {
            console.error(error);
            document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre></pre>";
        }
    });
}

function exe_loop(code){
    pyodideReadyPromise.then(pyodide => {
        console.log(code);
        try {
            //　読み取ったコードを１行ずつ実行
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 無限ループ防止のための制限
MAX_ITERATIONS = 1000
iteration_count = 0

def safe_exec(code, global_vars):
    global iteration_count
    try:
        if iteration_count >= MAX_ITERATIONS:
            print("Error: Too many iterations")
        else:
            exec(code, global_vars)
            iteration_count += 1
    except Exception as e:
        print(f"Error: {e}")

# ステップごとのコードを実行
safe_exec('''${code}''', globals())

sys.stdout = old_stdout

mystdout.getvalue()

`;

            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>" + formattedOutput + "</pre>";
            // Pyodideから変数を取得
            let variableNames = pyodide.globals.keys();
            for (let name of variableNames) {
                variables_loop[name] = pyodide.globals.get(name);
            }
            // 変数表を更新
            updateVariableTable_loop(loop[k]);
        } catch (error) {
            console.error(error);
        }
    });
}

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
        if(iterator.variable === variable) {
            iterator.value = value;
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
        //console.log(iterator, iterator_f, iterator_d1, iterator_d2, iterator_t1, iterator_t2, iterator_t3);
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

function getVariable(line) {
    // x = 1 のような行から`x`を抽出
    let match = line.match(/(\w+)\s*=/);
    return match ? match[1] : null;
}

function getValue(line) {
    // x = 1 のような行から`1`を抽出
    let match = line.match(/=\s*(.*)/);
    return match ? match[1] : null;
}

function getIndentLevel(line) {
    return line.match(/^\s*/)[0].length;
}

function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return typeof value === 'number';
}

function getLoopVariable(forLine) {
    // `for i in x:`のような行から`i`を抽出
    let match = forLine.match(/for (\w+) in/);
    return match ? match[1] : null;
}

function getLoopIterable(forLine) {
    // `for i in x:`のような行から`x`を抽出
    let match = forLine.match(/for \w+ in (.+):/);
    return match ? match[1] : null;
}

function getLoopIterable_f(forLine) {
    // `for i in range(5):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in range\((\d+)\):/);
    return match ? match[1] : null;
}

function getLoopIterable_d1(forLine) {
    // `for i in range(2, 5):`のような場合は`2`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+)\):/);
    return match ? match[1] : null;
}

function getLoopIterable_d2(forLine) {
    // `for i in range(2, 5):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+)\):/);
    return match ? match[2] : null;
}

function getLoopIterable_t1(forLine) {
    // `for i in range(2, 5, 3):`のような場合は`2`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+), (-?\d+)\):/);
    return match ? match[1] : null;
}

function getLoopIterable_t2(forLine) {
    // `for i in range(2, 5, 3):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+), (-?\d+)\):/);
    return match ? match[2] : null;
}

function getLoopIterable_t3(forLine) {
    // `for i in range(2, 5, 3):`のような場合は`3`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+), (-?\d+)\):/);
    return match ? match[3] : null;
}

function getLoopWhileVariable(whileLine) {
    // `while i < 5:`のような行から`i`を抽出
    let match = whileLine.match(/while (\w+) /);
    return match ? match[1] : null;
}

function getLoopWhileConditon(whileLine) {
    // `while i < 5:`のような行から`<`を抽出
    let match = whileLine.match(/while \w+ (<|>|<=|>=|==|!=) (-?\d+):/);
    return match ? match[1] : null;
}

function getLoopWhileIterable(whileLine) {
    // `while i < 5:`のような行から`5`を抽出
    let match = whileLine.match(/while \w+ (<|>|<=|>=|==|!=) (-?\d+):/);
    return match ? match[2] : null;
}

function getLoopWhileVariable_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`n % a != 0`を抽出
    let match = whileLine.match(/while (.+) (or|and) (.+):/);
    return match ? match[1] : null;
}

function getLoopWhileConditon_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`or`を抽出
    let match = whileLine.match(/while (.+) (or|and) (.+):/);
    return match ? match[2] : null;
}

function getLoopWhileIterable_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`n % b != 0`を抽出
    let match = whileLine.match(/while (.+) (or|and) (.+):/);
    return match ? match[3] : null;
}

function getIfCondition(line) {
    // `if` の条件式での変数を取得するロジックを実装
    let match = line.match(/if\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[1] : null;  // 演算子の左側の変数を取得
}

function getIfConditionValue(line) {
    // `if` の条件式での値を取得するロジックを実装
    let match = line.match(/if\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[3] : null;  // 演算子の右側の値を取得
}

function getElifCondition(line) {
    // `elif` の条件式での変数を取得するロジックを実装
    let match = line.match(/elif\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[1] : null;  // 演算子の左側の変数を取得
}

function getElifConditionValue(line) {
    // `elif` の条件式での値を取得するロジックを実装
    let match = line.match(/elif\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[3] : null;  // 演算子の右側の値を取得
}

function getEvaluate(line1, line2, line3) {
    // 条件式を評価するロジックを実装
    let line = line1 + ' ' + line2 + ' ' +line3;
    if(line){
        return true;
    }
    return false;
}

function highlightLine(lineNumber) {
    editor.getSession().addGutterDecoration(lineNumber, 'highlight-line');
}

function removeHighlight(lineNumber) {
    editor.getSession().removeGutterDecoration(lineNumber, 'highlight-line');
    let markers = editor.getSession().getMarkers(false);
    for (let id in markers) {
        if (markers[id].clazz === 'highlight-line') {
            editor.getSession().removeMarker(markers[id].id);
        }
    }
}

// ボタンがクリックされたときの処理
document.addEventListener('DOMContentLoaded', (event) => {
    pushRun_convert.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        exe(code);
    });

    pushRun_step.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        codeLines = code.split('\n'); // コードを行ごとに分割
        currentStep = 0;
        document.getElementById("output").innerHTML = ""; // 前回の出力をクリア
        exe_step(codeLines, currentStep); // 最初のステップを実行
    });

    document.getElementById("prev_step").addEventListener("click", function () {
        if (currentStep > 0) {
            removeHighlight(currentStep); // 現在のハイライトを削除
            currentStep--;
            document.getElementById("output").innerHTML = ""; // 出力をクリア
            exe_step(codeLines, currentStep); // 前のステップを実行
        }
    });

    document.getElementById("next_step").addEventListener("click", function () {
        if (currentStep < codeLines.length - 1) {
            removeHighlight(currentStep); // 現在のハイライトを削除
            currentStep++;
            document.getElementById("output").innerHTML = ""; // 出力をクリア
            exe_step(codeLines, currentStep); // 次のステップを実行
        }
    });
    pushRun_loop.addEventListener("click", function () {
        k = 0;
        if(flg == 1 && k < loop.length && loop[k].includes("print(")){
            exe_loop(loop[k]);
        }else if(flg == 0){
            document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>繰り返し処理\nがありません</pre>";
        }
    });
    pushRun_loop_prev.addEventListener("click", function () {
        if(k > 0 ){
            k--;
            if(k < loop.length && loop[k].includes("print(")){
                exe_loop(loop[k]);
            }
        }
    });
    pushRun_loop_next.addEventListener("click", function () {
        if(k < loop.length - 1){
            k++;
            if(k < loop.length && loop[k].includes("print(")){
                exe_loop(loop[k]);
            }
        }else{
            if(flg === 1){
                document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>繰り返し処理\nが終了しました</pre>";
            }
        }
    });
});