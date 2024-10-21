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

// 繰り返し回数を数える
function countLoop(code) {
    return new Promise((resolve) => { // Promiseを返すようにする
        let loopcnt = 0;
        code = "loopcnt = 0\n" + code;
        
        // while文にカウントを追加
        code = code.replace(/while\s+.*?:/, (match) => match + "\n    loopcnt += 1");
        
        console.log("組み込み後コード\n"+code);
        
        pyodideReadyPromise.then(pyodide => {
            let captureOutputCode = `
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

# ループ回数を数える

${code}

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
