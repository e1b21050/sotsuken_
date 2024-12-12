async function runPythonWithInput(code) {
    const pyodideScoring = await pyodideScoringReadyPromise;

    code = convertToPython(code);
    //console.log(code);

    let loopcnt = 0; // ループ回数
    let codeLoop = "loopcnt = 0\n" + code;
        
    // while文にカウントを追加
    // 無限ループを防止するために100回で打ち切る
    codeLoop = codeLoop.replace(/while\s+.*?:/, (match) => match + 
        "\n    loopcnt += 1\n" +
        "    if loopcnt > 100:\n" +
        "        break");

    const pythonCode = `
import sys
from io import StringIO

# 標準出力をキャプチャ
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

${codeLoop}

# キャプチャした出力を取得
sys.stdout = old_stdout
mystdout.getvalue()
`;

    for (const inputExample of inputExamples) {
        // 入力例をPython側で参照できるようにセット
        pyodideScoring.globals.set("input_examples", [inputExample]); // 各例をリストとしてセット

        // input関数を上書き
        pyodideScoring.runPython(`
import builtins

def input(prompt=""):
    if len(input_examples) > 0:
        return input_examples.pop(0)
    else:
        raise ValueError("No more input examples left.")

builtins.input = input
        `);

        // Pythonコードを実行
        try {
            const result = pyodideScoring.runPython(pythonCode);
            results.push({ input: inputExample, output: result }); // 結果を保存
        } catch (error) {
            console.error(`エラー (入力: ${inputExample}):`, error);
        }

        // カスタムinput関数の解除
        pyodideScoring.runPython("builtins.input = builtins.input.__globals__['__builtins__'].input");
    }

    getVariables(code, variableNamesInput);

    //必要に応じて結果を表示
    /*results.forEach(({ input, output }) => {
        console.log(`入力: ${input}\n出力:\n${output}`);
    });*/
}

async function runPythonWithInputOfAnswer(code) {
    const pyodideAnswer = await pyodideAnswerReadyPromise;

    const pythonCodeAnswer = `
import sys
from io import StringIO

# 標準出力をキャプチャ
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

# 変数状態を保持
global_vars = globals().copy()

${code}

# キャプチャした出力を取得
sys.stdout = old_stdout
mystdout.getvalue()
`;

    for (const inputExample of inputExamples) {
        // 入力例をPython側で参照できるようにセット
        pyodideAnswer.globals.set("input_examples", [inputExample]); // 各例をリストとしてセット

        // input関数を上書き
        pyodideAnswer.runPython(`
import builtins

def input(prompt=""):
    if len(input_examples) > 0:
        return input_examples.pop(0)
    else:
        raise ValueError("No more input examples left.")

builtins.input = input
        `);

        // Pythonコードを実行
        try {
            const result = pyodideAnswer.runPython(pythonCodeAnswer);
            resultsAnswer.push({ input: inputExample, output: result }); // 結果を保存
        } catch (error) {
            console.error(`エラー (入力: ${inputExample}):`, error);
        }

        // カスタムinput関数の解除
        pyodideAnswer.runPython("builtins.input = builtins.input.__globals__['__builtins__'].input");
    }

    //必要に応じて結果を表示
    /*resultsAnswer.forEach(({ input, output }) => {
        console.log(`入力: ${input}\n出力:\n${output}`);
    });*/
    runScoringResult(results, resultsAnswer);
    runScoringCode(variableNamesInput, variableNamesAnswer);
}