let push_select = document.getElementById("selectQuestion");
let push_scoring = document.getElementById("submit");
let scoring_reset = document.getElementById("reset");
const modal = document.getElementById('questionSelector');
const questionList = document.getElementById('questionList');
const closeModal = document.getElementById('closeModal');
let questionNumber = 0; // 問題番号を保存
let inputExamples = []; // 入力例を保存
let answerCode = ''; // 正解のコードを保存
let results = []; // 入力例ごとの実行結果を保存
let resultsAnswer = []; // 入力例ごとの正解の実行結果を保存
let variableNamesInput = []; // 変数名を保存 
let variableNamesAnswer = []; // 正解の変数名を保存
let cntEmptyLine = 0; // 空行のカウント
let deductionPointOfEmptyLine = 0; // 空行の減点
let deductionPointOfEmpties = 0; // 空白の減点
let flgTmp = false; // tmpが含まれているかのフラグ

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
    //console.log(code);

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

    getVariables(code);

    /*必要に応じて結果を表示
    results.forEach(({ input, output }) => {
        console.log(`入力: ${input}\n出力:\n${output}`);
    });*/
}

function getVariables(code) {
    let variableNamesInsert = [];
    // 変数名を取得
    let codeLines = code.split('\n');
    for (let line of codeLines) {
        // 変数→'='が含まれている行として処理
        if (line.includes('=') && !line.includes('==') && 
        !line.includes('!=') && !line.includes('<=') && 
        !line.includes('>=') && !line.includes('+=') &&
        !line.includes('-=') && !line.includes('*=') &&
        !line.includes('/=')) { 
            let variableName = line.split('=')[0].trim();
            let ValueOrName = line.split('=')[1].trim();
            // ,が含まれている場合は分割
            if (variableName.includes(',')) {
                variableName = variableName.split(',');
                for (let name of variableName) {
                    //重複を避ける
                    if (!variableNamesInput.includes(name.trim())){
                        variableNamesInput.push(name.trim());
                    }
                    if(!ValueOrName.includes('(')){
                        variableNamesInsert.push(name.trim());
                        variableNamesInsert.push(ValueOrName);
                    }
                }
            } else {
                //重複を避ける
                if (!variableNamesInput.includes(variableName)){
                    variableNamesInput.push(variableName);
                }
                if(!ValueOrName.includes('(')){
                    variableNamesInsert.push(variableName);
                    variableNamesInsert.push(ValueOrName);
                }
            }
        }else if(line === '\r'){
            cntEmptyLine++;
        }else if(cntEmptyLine > 1 && line !== ''){
            deductionPointOfEmptyLine++;
            cntEmptyLine = 0;
        }
        // 空白が2つ以上含まれている行として処理
        if(line.includes('  ')){
            deductionPointOfEmpties++;
        }
    }
    checkTmp(variableNamesInsert, variableNamesInput);
    console.log(variableNamesInsert);
    console.log(variableNamesInput);
}

function checkTmp(variableNamesInsert, variableNamesInput){
    if(variableNamesInsert.length === 6){
        if( variableNamesInsert[0] === variableNamesInput[2] && 
            variableNamesInsert[1] === variableNamesInput[0] && 
            variableNamesInsert[2] === variableNamesInput[0] &&
            variableNamesInsert[3] === variableNamesInput[1] &&
            variableNamesInsert[4] === variableNamesInput[1] &&
            variableNamesInsert[5] === variableNamesInput[2]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[2] && 
            variableNamesInsert[1] === variableNamesInput[1] && 
            variableNamesInsert[2] === variableNamesInput[1] &&
            variableNamesInsert[3] === variableNamesInput[0] &&
            variableNamesInsert[4] === variableNamesInput[0] &&
            variableNamesInsert[5] === variableNamesInput[2]){
                flgTmp = true;
            }
    }else if(variableNamesInsert.length === 12){
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[0] && 
            variableNamesInsert[2] === variableNamesInput[0] &&
            variableNamesInsert[3] === variableNamesInput[1] &&
            variableNamesInsert[4] === variableNamesInput[1] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[0] &&
            variableNamesInsert[8] === variableNamesInput[0] &&
            variableNamesInsert[9] === variableNamesInput[2] &&
            variableNamesInsert[10] === variableNamesInput[2] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[1] && 
            variableNamesInsert[2] === variableNamesInput[1] &&
            variableNamesInsert[3] === variableNamesInput[0] &&
            variableNamesInsert[4] === variableNamesInput[0] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[2] &&
            variableNamesInsert[8] === variableNamesInput[2] &&
            variableNamesInsert[9] === variableNamesInput[0] &&
            variableNamesInsert[10] === variableNamesInput[0] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[0] && 
            variableNamesInsert[2] === variableNamesInput[0] &&
            variableNamesInsert[3] === variableNamesInput[2] &&
            variableNamesInsert[4] === variableNamesInput[2] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[0] &&
            variableNamesInsert[8] === variableNamesInput[0] &&
            variableNamesInsert[9] === variableNamesInput[1] &&
            variableNamesInsert[10] === variableNamesInput[1] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[2] && 
            variableNamesInsert[2] === variableNamesInput[2] &&
            variableNamesInsert[3] === variableNamesInput[0] &&
            variableNamesInsert[4] === variableNamesInput[0] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[1] &&
            variableNamesInsert[8] === variableNamesInput[1] &&
            variableNamesInsert[9] === variableNamesInput[0] &&
            variableNamesInsert[10] === variableNamesInput[0] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[1] && 
            variableNamesInsert[2] === variableNamesInput[1] &&
            variableNamesInsert[3] === variableNamesInput[2] &&
            variableNamesInsert[4] === variableNamesInput[2] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[0] &&
            variableNamesInsert[8] === variableNamesInput[0] &&
            variableNamesInsert[9] === variableNamesInput[1] &&
            variableNamesInsert[10] === variableNamesInput[1] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
        if( variableNamesInsert[0] === variableNamesInput[3] && 
            variableNamesInsert[1] === variableNamesInput[2] && 
            variableNamesInsert[2] === variableNamesInput[2] &&
            variableNamesInsert[3] === variableNamesInput[1] &&
            variableNamesInsert[4] === variableNamesInput[1] &&
            variableNamesInsert[5] === variableNamesInput[3] &&
            variableNamesInsert[6] === variableNamesInput[3] &&
            variableNamesInsert[7] === variableNamesInput[1] &&
            variableNamesInsert[8] === variableNamesInput[1] &&
            variableNamesInsert[9] === variableNamesInput[0] &&
            variableNamesInsert[10] === variableNamesInput[0] &&
            variableNamesInsert[11] === variableNamesInput[3]){
                flgTmp = true;
            }
    }
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

    /*必要に応じて結果を表示
    resultsAnswer.forEach(({ input, output }) => {
        console.log(`入力: ${input}\n出力:\n${output}`);
    });*/
    runScoringResult(results, resultsAnswer);
    runScoringCode(variableNamesInput, variableNamesAnswer);
}

function selectquestion() {
    // 仮の問題データ
    const questions = ['問題1-1','問題1-2', '問題1-3', '問題1-4', '問題1-5', '問題1-6', '問題1-7', '問題1-8', '問題1-9', '問題1-10'];
    
    // モーダルを開く処理
    // 問題リストを生成
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = question;
        listItem.addEventListener('click', () => {
            selectquestion(index);
        });
        questionList.appendChild(listItem);
    });
    modal.style.display = 'block';

    // モーダルを閉じる処理
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 問題を選択したときの処理
    function selectquestion(index) {
        modal.style.display = 'none';
        document.getElementById('result').innerHTML += '<br>選択された問題:' + `${questions[index]}` + 'を採点します。';
        // ここで選択された問題に応じた採点処理を追加
        questionNumber = index + 1;
        selectInputExample(questionNumber);
    }
}

function selectInputExample(questionNumber) {
    switch(questionNumber){
        case 1:
            inputExamples = ['1 2', '5 5', '3 5', '10 20', '23 12', '11 11'];
            answerCode = `
a, b = map(int, input().split())
print(b, a)`;
            variableNamesAnswer = ['a', 'b'];
            break;
        case 2:
            inputExamples = ['1 2 3', '100 100 100', '41 59 31', '1 50 100', '25 75 50', '100 1 2'];
            answerCode = `
X, Y, Z = map(int, input().split())
print(Z, X, Y)`;
            variableNamesAnswer = ['X', 'Y', 'Z'];
            break;
        case 3:
            inputExamples = ['100 1 2', '100  2 1', '100 1 1', '100 3 5', '121 11 11', '100 100 100'];
            answerCode = `
N, A, B = map(int, input().split())
print(N - A + B)`;
            variableNamesAnswer = ['N', 'A', 'B'];
            break;
        case 4:
            inputExamples = ['4 7', '1 1', '1 100', '100 100', '3 1000'];
            answerCode = `
S, T = map(int, input().split())
print(T-S+1)`;
            variableNamesAnswer = ['S', 'T'];
            break;
        case 5:
            inputExamples = ['1', '2'];
            answerCode = `
Q = int(input())
if Q == 1:
    print('ABC')
else:
    print('chokudai')`;
            variableNamesAnswer = ['Q'];
            break;
        case 6:
            inputExamples = ['2 5 2', '4 5 6', '3 3 3', '1 1 1', '1 2 2', '2 2 2'];
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
            variableNamesAnswer = ['a', 'b', 'c'];
            break;
        case 7:
            inputExamples = ['vvwvw', 'v', 'wwwvvvvvv', 'w', 'vvvwv', 'wv'];
            answerCode = `
S = input()
count = 0
for s in S:
    if s == 'v':
        count += 1
    if s == 'w':
        count += 2
print(count)`;
            variableNamesAnswer = ['S', 'count'];
            break;
        case 8:
            inputExamples = ['3', '1', '5', '13', '100', '8'];
            answerCode = `
N = int(input())
for i in range(N+1):
    print(N-i)`;
            variableNamesAnswer = ['N'];
            break;
        case 9:
            inputExamples = ['13 3 5', '5 6 6', '200000 314 318', '23 1 1', '100 100 100', '255 2 3'];
            answerCode = `
N, M, P = map(int, input().split())
count = 0
for i in range(N):
    if M <= N:
        count += 1
        M += P
print(count)`;
            variableNamesAnswer = ['N', 'M', 'P', 'count'];
            break;
        case 10:
            inputExamples = ['1 2', '1 1', '3 1', '2 3', '3 2', '2 1'];
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
            variableNamesAnswer = ['A', 'B'];            
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

function runScoringResult(results, resultsAnswer) {
    let correctCount = 0;
    let incorrectCount = 0;
    // 入力例ごとに結果を比較
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const resultAnswer = resultsAnswer[i];
        if (result.output === resultAnswer.output) {
            correctCount++;
            //console.log(`入力: ${result.input} => 正解`);
            document.getElementById('result').innerHTML += `<br>入力: ${result.input} => 正解`;
        } else {
            incorrectCount++;
            //console.log(`入力: ${result.input} => 不正解`);
            document.getElementById('result').innerHTML += `<br>入力: ${result.input} => 不正解`;
        }
    }
    document.getElementById('result').innerHTML += `<br>[正答率]: ${correctCount} / ${correctCount + incorrectCount} (${(correctCount / (correctCount + incorrectCount) * 100).toFixed(2)}%)`;
}

function runScoringCode(variableNamesInput, variableNamesAnswer){
    let flg = false;
    for(let i=0; i<variableNamesInput.length; i++){
        // 変数名が一致したものがあるかを確認
        if(!variableNamesAnswer.includes(variableNamesInput[i])){
            if(!flgTmp){
                document.getElementById('result').innerHTML += `<br>[変数]: ${variableNamesInput[i]}`;
            }else{
                document.getElementById('result').innerHTML += `<br>[変数]: なし`;
            }    
            flg = true;
        }
    }
    if(!flg){
        document.getElementById('result').innerHTML += `<br>[変数]: なし`;
    }
    document.getElementById('result').innerHTML += `<br>[空行]: ${deductionPointOfEmptyLine}箇所`;
    document.getElementById('result').innerHTML += `<br>[空白]: ${deductionPointOfEmpties}箇所`;
}

// ボタンがクリックされたときの処理
document.addEventListener('DOMContentLoaded', (event) => {
    let cntPushScoring = 0; // 採点ボタンが押された回数
    push_select.addEventListener("click", function () {
        selectquestion();
    });
    push_scoring.addEventListener("click", function () {
        cntPushScoring++;
        if(cntPushScoring > 1){
            document.getElementById('result').innerHTML += `<br>もう採点済みです。`;
        }else if(questionNumber === 0){
            document.getElementById('result').innerHTML += `<br>問題を選択してください。`;
            cntPushScoring = 0;
        }else{
            let codeScoring = editor.getSession().getValue();
            runPythonWithInput(codeScoring);
            runPythonWithInputOfAnswer(answerCode);
        }
    });
    scoring_reset.addEventListener("click", function () {
        document.getElementById('result').innerHTML = '＜結果＞';
        cntPushScoring = 0;
        questionNumber = 0;
        deductionPointOfEmpties = 0;
        results = [];
        flgTmp = false;
    });
});
