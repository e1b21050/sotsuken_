let push_select = document.getElementById("selectProblem");
let push_scoring = document.getElementById("submit");
const modal = document.getElementById('problemSelector');
const problemList = document.getElementById('problemList');
const closeModal = document.getElementById('closeModal');
let problemNumber = 0; // 問題番号を保存
let inputExamples = []; // 入力例を保存
let answerCode = ''; // 正解のコードを保存
const results = []; // 入力例ごとの実行結果を保存
const resultsAnswer = []; // 入力例ごとの正解の実行結果を保存
const variablesScoring = {}; // 変数を保存
let variableResult = []; // 変数の結果を保存
const variablesAnswer = {}; // 正解の変数を保存
let variableResultAnswer = []; // 正解の変数の結果を保存

async function loadPyodideAndPackages() {
    let pyodideScoring = await loadPyodide();
    return pyodideScoring;
}

let pyodideScoringReadyPromise = loadPyodideAndPackages();
let pyodideAnswerReadyPromise = loadPyodideAndPackages();

async function runPythonWithInput(code) {
    // Pyodideが初期化されているかを確認
    const pyodideScoring = await pyodideScoringReadyPromise;
    if (!pyodideScoring) {
        console.error("Pyodideがロードされていません。");
        return;
    }

    code = convertToPython(code);
    console.log(code);

    const pythonCode = `
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

    // 全ての結果をログに出力
    console.log("すべての実行結果:", results);

    // 必要に応じて結果を表示
    results.forEach(({ input, output }) => {
        console.log(`入力: ${input}\n出力:\n${output}`);
    });
}

async function runPythonWithInputOfAnswer(code) {
    // Pyodideが初期化されているかを確認
    const pyodideAnswer = await pyodideAnswerReadyPromise;
    if (!pyodideAnswer) {
        console.error("Pyodideがロードされていません。");
        return;
    }

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

    // 全ての結果をログに出力
    console.log("すべての実行結果:", resultsAnswer);

    // 必要に応じて結果を表示
    resultsAnswer.forEach(({ input, output }) => {
        console.log(`入力: ${input}\n出力:\n${output}`);
    });
    runScoring(results, resultsAnswer);
}

function selectProblem() {
    // 仮の問題データ
    const problems = ['問題1-1','問題1-2', '問題1-3', '問題1-4', '問題1-5', '問題1-6', '問題1-7', '問題1-8', '問題1-9', '問題1-10'];
    
    // モーダルを開く処理
    // 問題リストを生成
    problemList.innerHTML = '';
    problems.forEach((problem, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = problem;
        listItem.addEventListener('click', () => {
            selectProblem(index);
        });
        problemList.appendChild(listItem);
    });
    modal.style.display = 'block';

    // モーダルを閉じる処理
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 問題を選択したときの処理
    function selectProblem(index) {
        modal.style.display = 'none';
        document.getElementById('result').innerHTML += '<br>選択された問題:' + `${problems[index]}` + 'を採点します。';
        // ここで選択された問題に応じた採点処理を追加
        problemNumber = index + 1;
        console.log(`問題1-${problemNumber}を選択しました。`);
        selectInputExample(problemNumber);
    }
}

function selectInputExample(problemNumber) {
    switch(problemNumber){
        case 1:
            inputExamples = ['1 2', '5 5'];
            answerCode = `
a, b = map(int, input().split())
print(b, a)`;
            break;
        case 2:
            inputExamples = ['1 2 3', '100 100 100', '41 59 31'];
            answerCode = `
X, Y, Z = map(int, input().split())
print(Z, X, Y)`;
            break;
        case 3:
            inputExamples = ['100 1 2', '100  2 1', '100 1 1'];
            answerCode = `
N, A, B = map(int, input().split())
print(N - A + B)`;
            break;
        case 4:
            inputExamples = ['4 7', '1 1'];
            answerCode = `
S, T = map(int, input().split())
print(T-S+1)`;
            break;
        case 5:
            inputExamples = ['1', '2'];
            answerCode = `
Q = int(input())
if Q == 1:
    print('ABC')
else:
    print('chokudai')`;
            break;
        case 6:
            inputExamples = ['2 5 2', '4 5 6', '3 3 3'];
            answerCode = `
a, b, c = map(int, input().split())
if a == b:
    print(c)
elif a == c:
    print(b)
elif b == c:
    print(a)
else:
    print(0)`;
            break;
        case 7:
            inputExamples = ['vvwvw', 'v', 'wwwvvvvvv'];
            answerCode = `
S = input()
count = 0
for s in S:
    if s == 'v':
        count += 1
    if s == 'w':
        count += 2
print(count)`;
            break;
        case 8:
            inputExamples = ['3', '1'];
            answerCode = `
N = int(input())
for i in range(N+1):
    print(N-i)`;
            break;
        case 9:
            inputExamples = ['13 3 5', '5 6 6', '200000 314 318'];
            answerCode = `
N, M, P = map(int, input().split())
count = 0
for i in range(N):
    if M <= N:
        count += 1
        M += P
print(count)`;
            break;
        case 10:
            inputExamples = ['1 2', '1 1', '3 1'];
            answerCode = `
A, B = map(int, input().split())
if A == B:
    print(-1)
if A == 1 and B == 2:
    print(3)
if A == 1 and B == 3:
    print(2)
if A == 2 and B == 1:
    print(3)
if A == 2 and B == 3:
    print(1)
if A == 3 and B == 1:
    print(2)
if A == 3 and B == 2:
    print(1)`;            
            break;
        default:
            inputExamples = [];
    }
}

function convertToPython(code) {
    let codeLines = code.split('\n');
    let convertedCode = '';
    let cnt = 0;
    // 1行ずつ処理
    for (let line of codeLines) {
        // input()を','に変換
        if (line.includes('map(')){
        }else if(line.match(/input\(\)/)){
            line = line.replace(/=input\(\)/g, ',');
            line = line.replace(/= input\(\)/g, ',');
            cnt++;
        }else{
            if(cnt > 1){
                // 最後の','を'= map(int, input().split())\n'に変換
                convertedCode = convertedCode.replace(/,([^,]*)$/, '= map(int, input().split())\n');
                cnt = 0;
            }else if(cnt == 1){
                // ','を'= int(input())\n'に変換
                convertedCode = convertedCode.replace(/,/g, '= input()\n');
                cnt = 0;
            }
        }
        convertedCode += line;
        if(cnt === 0){
            convertedCode += '\n';
        }
    }

    return convertedCode;
}

function runScoring(results, resultsAnswer) {
    let correctCount = 0;
    let incorrectCount = 0;
    // 入力例ごとに結果を比較
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const resultAnswer = resultsAnswer[i];
        if (result.output === resultAnswer.output) {
            correctCount++;
            console.log(`入力: ${result.input} => 正解`);
            document.getElementById('result').innerHTML += `<br>入力: ${result.input} => 正解`;
        } else {
            incorrectCount++;
            console.log(`入力: ${result.input} => 不正解`);
            document.getElementById('result').innerHTML += `<br>入力: ${result.input} => 不正解`;
        }
    }
    document.getElementById('result').innerHTML += `<br>正答率: ${correctCount} / ${correctCount + incorrectCount}`;
}

// ボタンがクリックされたときの処理
document.addEventListener('DOMContentLoaded', (event) => {
    push_select.addEventListener("click", function () {
        selectProblem();
    });
    push_scoring.addEventListener("click", function () {
        let codeScoring = editor.getSession().getValue();
        runPythonWithInput(codeScoring);
        runPythonWithInputOfAnswer(answerCode);
    });
});
