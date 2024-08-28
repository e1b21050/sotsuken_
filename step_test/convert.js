let pushRun_convert = document.getElementById("run");
let pushRun_step = document.getElementById("run_step");

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

function exe_step(code) {
    pyodideReadyPromise.then(pyodide => {
        try {
            // デバッグ用のPythonコードを作成
            let debugCode = `
import sys
from io import StringIO
import pdb

# 標準出力をキャプチャする
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# デバッグセッションを開始
def debug_session():
    pdb.run('${code}')

# ユーザーのコードを実行
debug_session()

# キャプチャした出力を取得する
sys.stdout = old_stdout
mystdout.getvalue()
`;

            // Pythonコードを実行して出力を取得
            let output = pyodide.runPython(debugCode);
            console.log(output);  // コンソールに出力

            // 出力を行ごとに分割して、各行の先頭にスペースを追加
            let formattedOutput = output.split('\n').map(line => ' ' + line).join('\n');

            // 実行結果を表示
            document.getElementById("output").innerHTML = "<p>＜実行結果＞</p><pre>" + formattedOutput + "</pre>";
        } catch (error) {
            console.error(error);
            document.getElementById("output").innerHTML = "<p>＜エラー＞</p><pre>" + error + "</pre>";
        }
    });
}


document.addEventListener('DOMContentLoaded', (event) => {
    pushRun_convert.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        exe(code);
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    pushRun_step.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        exe_step(code);
    });
});
