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