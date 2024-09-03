let pushRun_convert = document.getElementById("run");
let pushRun_step = document.getElementById("run_step");
let pushRun_prev = document.getElementById("prev_step");
let pushRun_next = document.getElementById("next_step");

let currentStep = 0;
let codeLines = [];
let loopSteps = [];
let currentStepIndex = 0;
let steps = [];
let flg = 0;

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

# 無限ループ防止のための制限
MAX_ITERATIONS = 1000

def safe_exec(code):
    exec(code)

${accumulatedCode}

sys.stdout = old_stdout
mystdout.getvalue()
`;

            // 出力が存在する場合のみ表示
            if (lines[index].trim().startsWith("print(") && flg == 0) {
                let output = pyodide.runPython(captureOutputCode);
                let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
                document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre>" + formattedOutput + "</pre>";
            }else {
                document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre></pre>";
            }
        } catch (error) {
            console.error(error);
            document.getElementById("output").innerHTML += "<p>＜ステップ " + (index + 1) + "＞</p><pre></pre>";
        }
    });
}

function getCodeBlock(lines, index) {
    let codeBlock = "";
    let currentIndentLevel = getIndentLevel(lines[index]);
    let value;
    let variable;
    

    if (lines[index].trim().startsWith("if ")) {
        let condition = lines[index].match(/if (.*):/)[1];
        let variable = getVariableFromCondition(lines[index]);
        codeBlock = lines[index] + "\n";
        let i = index + 1;

        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }

        // `elif` や `else` を条件に基づいて追加する
        while (i < lines.length && (lines[i].trim().startsWith("elif ") || lines[i].trim().startsWith("else:"))) {
            let line = lines[i].trim();
            let indentLevel = getIndentLevel(line);
            if (line.startsWith("elif ")) {
                let elifCondition = line.match(/elif (.*):/)[1];
                codeBlock += line + "\n";
                i++;
                while (i < lines.length && getIndentLevel(lines[i]) > indentLevel) {
                    codeBlock += "    " + lines[i].trim() + "\n";
                    i++;
                }
            } else if (line.startsWith("else:")) {
                codeBlock += line + "\n";
                i++;
                while (i < lines.length && getIndentLevel(lines[i]) > indentLevel) {
                    codeBlock += "    " + lines[i].trim() + "\n";
                    i++;
                }
                break; // `else` 文の後に追加の条件は無視
            }
        }
    } 
    // `for` 文の処理
    else if (lines[index].trim().startsWith("for ") || lines[index].trim().endsWith(":")) {
        let loopVariable = getLoopVariable(lines[index]);
        let loopIterable = getLoopIterable(lines[index]);
        codeBlock = `index = 0\nwhile index < len(${loopIterable}):\n` +
            `    ${loopVariable} = ${loopIterable}[index]\n` +
            `    index += 1\n`;

        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }
    } 
    // `while` 文の処理 無限ループになる可能性があるため、`len` を使って制限を設ける
    else if (lines[index].trim().startsWith("while ") || lines[index].trim().endsWith(":")) {
        let condition = lines[index].match(/while (.*):/)[1];
        let line = lines[index].trim();
        codeBlock = lines[index] + "\n";
        let loopVariable = getLoopVariableWhile(lines[index]);
        let loopValue = getLoopValueWhile(lines[index]);
        codeBlock = `index = 0\nwhile index < len(${loopValue}):\n` +
            `    ${loopVariable} = ${loopValue}[index]\n` +
            `    index += 1\n`;
        let i = index + 1;
        while (i < lines.length && getIndentLevel(lines[i]) > currentIndentLevel) {
            codeBlock += "    " + lines[i].trim() + "\n";
            i++;
        }
    } 
    // その他の行の処理
    else {
        codeBlock = lines.slice(0, index + 1).join('\n');
    }
    
    return codeBlock;
}

function getVariable(line) {
    // 変数を取得するロジックをここに実装
    let match = match(/(\w+)\s*==/);
    return match ? match[1] : null;
}

function getValue(line) {
    // 値を取得するロジックをここに実装
    let match = line.match(/==\s*(.*)/);
    return match ? match[1] : null;
}

function getIndentLevel(line) {
    return line.match(/^\s*/)[0].length;
}

function getLoopVariable(forLine) {
    // `for i in x:`のような行から`i`を抽出
    let match = forLine.match(/for (\w+) in/);
    return match ? match[1] : null;
}

function getLoopIterable(forLine) {
    // `for i in x:`のような行から`x`を抽出
    // `for i in range(5):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in (.+):/);
    return match ? match[1] : null;
}

function getLoopVariableWhile(whileline) {
    // `while` の変数を取得する
    let match = whileline.match(/while (\w+)(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[1] : null;
}

function getLoopValueWhile(whileline) {
    // `while` の条件式から値を取得する
    let match = whileline.match(/while (\w+)(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[3] : null;
}

function getVariableFromCondition(condition) {
    // 条件式から変数を抽出するロジックを実装
    let match = condition.match(/(\w+)\s*(==|!=|>|<|>=|<=)\s*(\w+)/);
    return match ? match[1] : null;  // 演算子の左側の変数を取得
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
});