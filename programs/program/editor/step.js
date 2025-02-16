function exe_step(lines, index) {
    pyodideReadyPromise.then(pyodide => {
        let accumulatedCode = getCodeBlock(lines, index);
        highlightLine(index); // 現在の行をハイライト
        //console.log(loop, indentDownNumOfLines);
        console.log(codeLines);
        try {
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# コードブロック全体を実行
${accumulatedCode}

sys.stdout = old_stdout
mystdout.getvalue()
`;
            let output = pyodide.runPython(captureOutputCode);
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');
            document.getElementById("output").innerHTML = "<p>＜ステップ " + (index + 1) + "＞</p><pre>" + formattedOutput + "</pre>";
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
            console.log(loop);
        }
    });
}