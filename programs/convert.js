let pushRun_convert = document.getElementById("run");

async function loadPyodideAndPackages() {
    // Pyodideをロード
    let pyodide = await loadPyodide();
    return pyodide;
}

let pyodideReadyPromise = loadPyodideAndPackages();

function exe(code) {
    pyodideReadyPromise.then(pyodide => {
        try {
            // stdoutをキャプチャするPythonコードを実行
            let captureOutputCode = `
import sys
from io import StringIO

# 標準出力をキャプチャする
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# ユーザーのコードを実行
${code}

# キャプチャした出力を取得する
sys.stdout = old_stdout
mystdout.getvalue()
`;
            // Pythonコードを実行して出力を取得
            let output = pyodide.runPython(captureOutputCode);
            console.log(output);  // コンソールに出力

            // 出力を行ごとに分割して、各行の先頭にスペースを追加
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');

            // 実行結果を表示
            document.getElementById("execute").innerHTML = "<p>＜実行結果＞</p><pre>" + formattedOutput + "</pre>";
        } catch (error) {
            console.error(error);
            //document.getElementById("execute").innerHTML = "<p>＜エラー＞</p><pre>" + error + "</pre>";
        }
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    pushRun_convert.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        exe(code);
    });
});
