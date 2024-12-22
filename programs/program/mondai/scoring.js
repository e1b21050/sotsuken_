const push_select = document.getElementById("selectMondai");
const push_scoring = document.getElementById("submit");
const scoring_reset = document.getElementById("reset");
const modal = document.getElementById('mondaiSelector');
const mondaiList = document.getElementById('mondaiList');
const closeModal = document.getElementById('closeModal');
const pushHelpMondai = document.getElementById('helpMondai');
let mondaiNumber = 0; // 問題番号を保存
let inputExamples = []; // 入力例を保存
let answerCode = ''; // 正解のコードを保存
let results = []; // 入力例ごとの実行結果を保存
let resultsAnswer = []; // 入力例ごとの正解の実行結果を保存
let variableNamesInput = []; // 変数名を保存 
let variableNamesAnswer = []; // 正解の変数名を保存
let variableNamesInsert = []; // 変数名を保存
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

function runScoringResult(results, resultsAnswer) {
    let correctCount = 0;
    let incorrectCount = 0;
    // 入力例ごとに結果を比較
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const resultAnswer = resultsAnswer[i];
        if (result.output === resultAnswer.output) {
            correctCount++;
            document.getElementById('result').innerHTML += `<br>入力: ${result.input} => 正解`;
        } else {
            incorrectCount++;
            document.getElementById('result').innerHTML += `<br>入力: ${result.input} => 不正解`;
        }
    }
    document.getElementById('result').innerHTML += `<br>[正答率]: ${correctCount} / ${correctCount + incorrectCount} (${(correctCount / (correctCount + incorrectCount) * 100).toFixed(2)}%)`;
}

function runScoringCode(variableNamesInput, variableNamesAnswer){
    let flg = false; // 変数名が一致したかのフラグ
    for(let i=0; i<variableNamesInput.length; i++){
        // 変数名が一致したものがあるかを確認
        if(!variableNamesAnswer.includes(variableNamesInput[i])){
            if(!flgTmp){
                document.getElementById('result').innerHTML += `<br>[不要な変数]: ${variableNamesInput[i]}`;
            }else{
                document.getElementById('result').innerHTML += `<br>[不要な変数]: なし`;
            }    
            flg = true;
        }
    }
    if(!flg){
        document.getElementById('result').innerHTML += `<br>[不要な変数]: なし`;
    }
    document.getElementById('result').innerHTML += `<br>[不要な空行]: ${deductionPointOfEmptyLine}箇所`;
    document.getElementById('result').innerHTML += `<br>[不要な空白]: ${deductionPointOfEmpties}箇所`;
}

// ボタンがクリックされたときの処理
document.addEventListener('DOMContentLoaded', (event) => {
    let cntPushScoring = 0; // 採点ボタンが押された回数
    push_select.addEventListener("click", function () {
        selectMondai();
    });
    push_scoring.addEventListener("click", function () {
        cntPushScoring++;
        if(cntPushScoring > 1){
            document.getElementById('result').innerHTML += `<br>もう採点済みです。`;
        }else if(mondaiNumber === 0){
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
        editor.setValue(''); // エディタの中身をリセット
        cntPushScoring = 0; // 採点ボタンが押された回数をリセット
        mondaiNumber = 0; // 問題番号をリセット
        deductionPointOfEmpties = 0; // 空白の減点をリセット
        results = []; // 入力例ごとの実行結果をリセット
        resultsAnswer = []; // 入力例ごとの正解の実行結果をリセット
        variableNamesInput = []; // 変数名をリセット
        flgTmp = false; // tmpが含まれているかのフラグをリセット
    });
    pushHelpMondai.addEventListener("click", function () {
        var modal = document.getElementById('helpMondaiText');
        if(modal.style.display === "block"){
            modal.style.display = "none";
            pushHelpMondai.textContent = "？";
        }
        else{
            modal.style.display = "block";
            pushHelpMondai.textContent = "×";
        }
    });
});
