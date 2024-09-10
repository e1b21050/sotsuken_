let pushRun_convert = document.getElementById("run");
let pushRun_step = document.getElementById("run_step");
let pushRun_prev = document.getElementById("prev_step");
let pushRun_next = document.getElementById("next_step");
let pushRun_loop = document.getElementById("next_loop");

let currentStep = 0;
let codeLines = [];

let k = 0;
let loop = [];

async function loadPyodideAndPackages() {
    let pyodide = await loadPyodide();
    return pyodide;
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

${code}

sys.stdout = old_stdout
mystdout.getvalue()
`;
            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("execute").innerHTML = "<p>＜実行結果＞</p><pre>" + formattedOutput + "</pre>";
        } catch (error) {
            console.error(error);
        }
    });
}

function exe_step(lines, index) {
    pyodideReadyPromise.then(pyodide => {
        let accumulatedCode = getCodeBlock(lines, index);
        highlightLine(index); // 現在の行をハイライト
        try {
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

# 無限ループ防止のための制限
MAX_ITERATIONS = 1000

def safe_exec(code, global_vars):
    try:
        exec(code, global_vars)
    except Exception as e:
        print(f"Error: {e}")

# ステップごとのコードを実行
safe_exec('''
${accumulatedCode}
''', global_vars)

sys.stdout = old_stdout
mystdout.getvalue()
`;
            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre>" + formattedOutput + "</pre>";
            
        } catch (error) {
            console.error(error);
            document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre></pre>";
        }
    });
}

function exe_loop(code){
    pyodideReadyPromise.then(pyodide => {
        try {
            //　読み取ったコードを１行ずつ実行
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

# 無限ループ防止のための制限
MAX_ITERATIONS = 1000

def safe_exec(code, global_vars):
    try:
        exec(code, global_vars)
    except Exception as e:
        print(f"Error: {e}")


# ステップごとのコードを実行
safe_exec('''
${code}
''', global_vars)

sys.stdout = old_stdout

mystdout.getvalue()

`;

            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("loop").innerHTML = "<p>＜ループ実行" + k + "＞</p><pre>" + formattedOutput + "</pre>";
        } catch (error) {
            console.error(error);
        }
    });
}

let flg = 0;
let variable = null;
let value = null;
function getCodeBlock(lines, index) {
    let codeBlock = "";
    let currentIndentLevel = getIndentLevel(lines[index]);
    
    // `if` 文の変換
    if (lines[index].trim().startsWith("if ")) {
        let condition = lines[index].match(/if (.*):/)[1];
        codeBlock = lines[index] + "\n";  // `if` 文の追加
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }
    }
    // `elif` 文の変換
    else if (lines[index].trim().startsWith("elif ")) {
        let condition = lines[index].match(/elif (.*):/)[1];
        codeBlock = lines[index] + "\n";  // `elif` 文の追加
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }
    }
    // `else` 文の変換
    else if (lines[index].trim() === "else:") {
        codeBlock = lines[index] + "\n";  // `else` 文の追加
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }
    }
    // `for` 文の変換
    else if (lines[index].trim().startsWith("for ")) {
        flg = 1;
        if(lines[index-1]){
            codeBlock = lines[index-1]+ "\n" + "i=0\n";
        }else{
            codeBlock = "i=0\n";
        }
        let itelater = {
            variable: null,
            value: null
        };
        itelater.variable = getLoopIterable(lines[index]);
        // itelaterがrangeの場合の処理
        if(itelater.variable.startsWith('range(')) {
            itelater.variable = null;
        }
        if(itelater.variable === variable) {
            itelater.value = value;
        }
        // itelaterがrange(O)の場合の処理
        let itelater2 = getLoopIterable_f(lines[index]);
        // itelaterがrange(O, O)の場合の処理
        let itelater3 = getLoopIterable_d1(lines[index]);
        let itelater4 = getLoopIterable_d2(lines[index]);
        // itelaterがrange(O, O, O)の場合の処理
        let itelater5 = getLoopIterable_t1(lines[index]);
        let itelater6 = getLoopIterable_t2(lines[index]);
        let itelater7 = getLoopIterable_t3(lines[index]);
        
        let loopVariable = getLoopVariable(lines[index]);
        const indentBlock = [];
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            indentBlock.push(lines[i].replace(/^\s+/, '') + "\n");
            i++;
        }
        //console.log(indentBlock);
        console.log(itelater, itelater2, itelater3, itelater4, itelater5, itelater6, itelater7);
        if (itelater.variable !== null && itelater.value !== null) {
            loop.push(codeBlock);
            let j = 0;
            let loopcnt = 0; // ループ回数
            // itelaterが文字列のとき文字列を配列に変換
            if(isString(itelater.value) || isNumber(itelater.value)) {
                itelater.value.split('');
                loopcnt = itelater.value.length - 2; // 配列の長さ-'"'の数
            }
            // itelaterが配列のとき配列に変換
            if(itelater.value.includes(',')) {
                itelater.value = itelater.value.replace(/ /g, '').split(',');
                //'['の数を数える
                let cnt = 0;
                for(let i = 0; i < itelater.value.length; i++) {
                    if(itelater.value[i].includes('[')) {
                        cnt++;
                    }
                }
                if(cnt == 1) {
                    loopcnt = itelater.value.length; // 配列の長さ
                }else {
                    loopcnt = cnt; 
                }
            }
            for (j = 0; j < loopcnt; j++) {
                indentBlock.forEach(line => {
                    codeBlock += line.replace('(' + loopVariable, '(' + itelater.variable + '[' + j + ']');
                    loop.push(codeBlock);
                });
            }
        } else if (itelater2 !== null) {
            let j = 0;
            // itelater2を数字に変換
            itelater2 = Number(itelater2);
            for (j = 0; j < itelater2; j++) {
                indentBlock.forEach(line => {
                    codeBlock += line.replace('(' + loopVariable, '(' + j);
                    loop.push(codeBlock);
                });
            }
        } else if (itelater3 !== null && itelater4 !== null) {
            let j = 0;
            // itelater3~4を数字に変換
            itelater3 = Number(itelater3);
            itelater4 = Number(itelater4);
            for (j = itelater3; j < itelater4; j++) {
                indentBlock.forEach(line => {
                    codeBlock += line.replace('(' + loopVariable, '(' + j);
                    loop.push(codeBlock);
                });
            }
        } else if (itelater5 !== null && itelater6 !== null && itelater7 !== null) {
            // itelater5~7を数字に変換
            itelater5 = Number(itelater5);
            itelater6 = Number(itelater6);
            itelater7 = Number(itelater7);
            console.log(itelater5, itelater6, itelater7);
            let j;
            // itelater7が正のときはitelater5がitelater6より小さい間ループ
            // itelater7が負のときはitelater5がitelater6より大きい間ループ
            if(itelater7 > 0) {
                for (j = itelater5; j < itelater6; j += itelater7) {
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('(' + loopVariable, '(' + j);
                        loop.push(codeBlock);
                    });
                }
            }else {
                for (j = itelater5; j > itelater6; j += itelater7) {
                    indentBlock.forEach(line => {
                        codeBlock += line.replace('(' + loopVariable, '(' + j);
                        loop.push(codeBlock);
                    });
                }
            }
        }
    }   
    // `while` 文の変換
    else if (lines[index].trim().startsWith("while ")) {
        codeBlock = lines[index] + "\n";  // `while` 文の追加
        //インデントが同じになるまでコードを追加
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }
        flg = 1;
    } else {
        if (flg == 1 && getIndentLevel(lines[index]) > currentIndentLevel){
            flg = 0;
        }else{
            //代入文の時は変数名と値を取得して保存する
            variable = getVariable(lines[index]);
            value = getValue(lines[index]);
            codeBlock = lines.slice(0, index + 1).join('\n');
        }
    }
    console.log(codeBlock);
    
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
        if(flg == 1 && k < loop.length){
            exe_loop(loop[k]);
            k++;
        }else if(flg == 0){
            document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>繰り返し処理がありません</pre>";
        }else{
            document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>繰り返し処理が終了しました</pre>";
        }
    });
});