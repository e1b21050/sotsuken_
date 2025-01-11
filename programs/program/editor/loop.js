// loop実行する関数
function exe_loop(code){
    pyodideReadyPromise.then(pyodide => {
        //console.log(code); 
        highlightLine(k_loop); // 現在の行をハイライト
        highlightLine(lineNoConvertCode); // 現在の行をハイライト
        try {
            //　読み取ったコードを１行ずつ実行
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