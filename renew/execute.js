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