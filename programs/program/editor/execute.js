// 一括に実行する関数
function exe(code) {
    pyodideReadyPromise.then(pyodide => {
        try {
            let loopcnt = 0; // ループ回数
            let codeLoop = "loopcnt = 0\n" + code;
        
            // while文にカウントを追加
            // 無限ループを防止するための回数をeditor.htmlから読み取りその回数で打ち切る
            let loopLimit = document.getElementById("loopCnt").value;
            codeLoop = codeLoop.replace(/while\s+.*?:/, (match) => match + 
            "\n    loopcnt += 1\n" +
            "    if loopcnt > " + loopLimit + ":\n" +
            "        print('無限ループを防止しました')\n" +
            "        break");
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

${codeLoop}

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

// 繰り返し回数を数える関数
function countLoop(code) {
    return new Promise((resolve) => { // Promiseを返すようにする
        let loopcnt = 0; // ループ回数
        let codeLoop = "loopcnt = 0\n" + code;
        
        // while文にカウントを追加
            // 無限ループを防止するための回数をeditor.htmlから読み取りその回数で打ち切る
            let loopLimit = document.getElementById("loopCnt").value;
            codeLoop = codeLoop.replace(/while\s+.*?:/, (match) => match + 
            "\n    loopcnt += 1\n" +
            "    if loopcnt > " + loopLimit + ":\n" +
            "        print('無限ループを防止しました')\n" +
            "        break");
        
        //console.log("組み込み後コード\n"+code);
        
        pyodideReadyPromise.then(pyodide => {
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

${codeLoop}

sys.stdout = old_stdout
mystdout.getvalue()
`;
            
            // コードを実行
            pyodide.runPython(captureOutputCode);
            
            // ループ回数を取得
            loopcnt = pyodide.globals.get('loopcnt');
            resolve(loopcnt); // 取得したloopcntをresolveする
        });
    });
}
