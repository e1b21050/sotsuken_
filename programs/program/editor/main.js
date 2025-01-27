const pushRun_convert = document.getElementById("run");
const pushRun_step = document.getElementById("run_step");
const pushRun_prev = document.getElementById("prev_step");
const pushRun_next = document.getElementById("next_step");
const pushRun_loop = document.getElementById("step_loop");
const pushRun_loop_prev = document.getElementById("prev_loop");
const pushRun_loop_next = document.getElementById("next_loop");
const pushShow_execute = document.getElementById("show_execute");
const pushShow_step = document.getElementById("show_step");
const pushShow_loop = document.getElementById("show_loop");
const pushHelp = document.getElementById("help_button");

let currentStep = 0;
let codeLines = [];

let k = 0;
let k_loop = 0;
let lineNoConvertCode = 0;
let flg_loop = 0;
let loop = [];
let loopcnt_s = 0;
let pushStepCnt = 0;
let pushLoopCnt = 0;

async function loadPyodideAndPackages() {
    let pyodide = await loadPyodide();
    return pyodide;
}

let pyodideReadyPromise = loadPyodideAndPackages();

// ボタンがクリックされたときの処理
document.addEventListener('DOMContentLoaded', (event) => {
    pushRun_convert.addEventListener("click", function () {
        let code = editor.getSession().getValue();
        exe(code);
        countLoop(code)
            .then(result => {
                loopcnt_s = result;
                //console.log("繰り返し回数:"+loopcnt_s);
        });
    });

    pushRun_step.addEventListener("click", function () {
        pushStepCnt++;
        if(pushStepCnt > 1){
            removeHighlight(currentStep); // 現在のハイライトを削除
        }
        let code = editor.getSession().getValue();
        codeLines = code.split('\n'); // コードを行ごとに分割
        currentStep = 0;
        document.getElementById("output").innerHTML = ""; // 前回の出力をクリア
        exe_step(codeLines, currentStep); // 最初のステップを実行
    });

    document.getElementById("prev_step").addEventListener("click", function () {
        if (currentStep > 0) {
            removeHighlight(currentStep); // 現在のハイライトを削除
            currentStep--;
            document.getElementById("output").innerHTML = ""; // 出力をクリア
            exe_step(codeLines, currentStep); // 前のステップを実行
        }
    });

    document.getElementById("next_step").addEventListener("click", function () {
        if (currentStep < codeLines.length - 1) {
            removeHighlight(currentStep); // 現在のハイライトを削除
            currentStep++;
            document.getElementById("output").innerHTML = ""; // 出力をクリア
            exe_step(codeLines, currentStep); // 次のステップを実行
        }
    });

    let getCode;
    let getCodeLines;
    pushRun_loop.addEventListener("click", function () {
        pushLoopCnt++;
        removeHighlight(currentStep); // 現在のハイライトを削除
        // 変換コードの表示
        getCode = editor.getSession().getValue();
        //getCodeを行ごとに分割
        getCodeLines = getCode.split('\n');
        let stringConvertCode = '\n\n---<変換コード>---\n';
        if(pushLoopCnt === 1){
            editor.getSession().setValue(getCode + stringConvertCode + loop[loop.length-1]);
        }
        k = 0;
        k_loop = 0;
        lineNoConvertCode = getCode.split('\n').length + 2; // 変換コードの行
        highlightLine(k_loop); // 現在の行をハイライト
        if(flgWhile === 1){//while文がある場合
            for(let i = 0; i < l - 1; i++){
                highlightLine(lineNoConvertCode); // 変換コードの行をハイライト
                lineNoConvertCode++;
            }
        }else if(flgDoubleForLoop === 1){//二重ループがある場合
            for(let i = 0; i < l + 1; i++){
                highlightLine(lineNoConvertCode); // 変換コードの行をハイライト
                if(i < l ){
                    lineNoConvertCode++;
                }
            }
        }else{ //一重for文がある場合
            for(let i = 0; i < l; i++){
                highlightLine(lineNoConvertCode); // 変換コードの行をハイライト
                if(i < l - 1){
                    lineNoConvertCode++;
                }
            }
        }
        if(flg == 1 && k < loop.length - 1 && loop[k].includes("print(")){
            exe_loop(loop[k]);
        }else if(flg == 0){
            document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>繰り返し処理がありません</pre>";
        }
    });

    pushRun_loop_prev.addEventListener("click", function () {
        if(k > 0 ){
            removeHighlight(lineNoConvertCode); // 変換コードのハイライトを削除
            lineNoConvertCode--;
            removeHighlight(k_loop); // 現在のハイライトを削除
            k_loop--;
            k--;
            if(k < loop.length - 1 && loop[k].includes("print(")){
                exe_loop(loop[k]);
            }
        }else if(k === 0){
            lineNoConvertCode--;
            if(flgWhile === 1){//while文がある場合
                for(let i = 0; i < l - 1; i++){
                    highlightLine(lineNoConvertCode); // 変換コードの行をハイライト
                    lineNoConvertCode++;
                }
            }else if(flgDoubleForLoop === 1){//二重ループがある場合
                for(let i = 0; i < l + 1; i++){
                    highlightLine(lineNoConvertCode); // 変換コードの行をハイライト
                    if(i < l ){
                        lineNoConvertCode++;
                    }
                }
            }else{
                for(let i = 0; i < l; i++){//一重for文がある場合
                    highlightLine(lineNoConvertCode); // 変換コードの行をハイライト
                    if(i < l - 1){
                        lineNoConvertCode++;
                    }
                }
            }
        }
    });

    pushRun_loop_next.addEventListener("click", function () {
        if(k < loop.length - 1){
            if(k === 0){
                removeHighlight(k);
                for(let i = lineNoConvertCode; i >= lineNoConvertCode - l; i--){
                    removeHighlight(i); // 変換コードのハイライトを削除
                }
            }
            removeHighlight(lineNoConvertCode); // 変換コードのハイライト
            if(flgWhile === 1){//while文がある場合
                removeHighlight(k_loop); // 変換コードのハイライトを削除
                if(k_loop  <= l){
                    k_loop++;
                }else{
                    k_loop -= indentBlock.length - 1;
                }
            }else if(flgDoubleForLoop === 1){//二重ループがある場合
                removeHighlight(k_loop); // 変換コードのハイライトを削除
                if(k_loop  <= l){
                    k_loop++;
                }else{
                    k_loop -= indentBlock.length - 2;
                }
            }else{ //一重for文がある場合
                removeHighlight(k_loop); // 変換コードのハイライトを削除
                if(k_loop  < l){
                    k_loop++;
                }else{
                    k_loop -= indentBlock.length - 2;
                }
            }
            lineNoConvertCode++;
            k++;
            if(k < loop.length - 1 ){
                exe_loop(loop[k]);
            }
        }else{
            if(flg === 1){
                document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p><pre>繰り返し処理が終了しました</pre>";
            }
        }
    });
    // 表示切り替えボタンがクリックされたときの処理
    pushShow_execute.addEventListener("click", function () {
        document.getElementById("execute").classList.remove("hidden");
        document.getElementById("variable_table").classList.remove("hidden");
        document.getElementById("output").classList.add("hidden");
        document.getElementById("variable_table_output").classList.add("hidden");
        document.getElementById("loop").classList.add("hidden");
        document.getElementById("variable_table_loop").classList.add("hidden");
        document.getElementById("run_step").classList.add("hidden");
        document.getElementById("prev_step").classList.add("hidden");
        document.getElementById("next_step").classList.add("hidden");
        document.getElementById("step_loop").classList.add("hidden");
        document.getElementById("prev_loop").classList.add("hidden");
        document.getElementById("next_loop").classList.add("hidden");
    });
    pushShow_step.addEventListener("click", function () {
        document.getElementById("execute").classList.add("hidden");
        document.getElementById("variable_table").classList.add("hidden");
        document.getElementById("output").classList.remove("hidden");
        document.getElementById("variable_table_output").classList.remove("hidden");
        document.getElementById("loop").classList.add("hidden");
        document.getElementById("variable_table_loop").classList.add("hidden");
        document.getElementById("run_step").classList.remove("hidden");
        document.getElementById("prev_step").classList.remove("hidden");
        document.getElementById("next_step").classList.remove("hidden");
        document.getElementById("step_loop").classList.add("hidden");
        document.getElementById("prev_loop").classList.add("hidden");
        document.getElementById("next_loop").classList.add("hidden");
    });
    pushShow_loop.addEventListener("click", function () {
        document.getElementById("execute").classList.add("hidden");
        document.getElementById("variable_table").classList.add("hidden");
        document.getElementById("output").classList.add("hidden");
        document.getElementById("variable_table_output").classList.add("hidden");
        document.getElementById("loop").classList.remove("hidden");
        document.getElementById("variable_table_loop").classList.remove("hidden");
        document.getElementById("run_step").classList.add("hidden");
        document.getElementById("prev_step").classList.add("hidden");
        document.getElementById("next_step").classList.add("hidden");
        document.getElementById("step_loop").classList.remove("hidden");
        document.getElementById("prev_loop").classList.remove("hidden");
        document.getElementById("next_loop").classList.remove("hidden");
    });

    document.getElementById('help_button').addEventListener('click', function() {
        var helpText = document.getElementById('help_text');
        if (helpText.style.display === 'none') {
            helpText.style.display = 'block';  // 表示
            pushHelp.textContent = '×';      // ボタンの表記を「×」に変更
        } else {
            helpText.style.display = 'none';   // 非表示
            pushHelp.textContent = '？';     // ボタンの表記を「？」に戻す
        }
    });

    
});