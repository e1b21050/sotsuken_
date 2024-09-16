// Aceエディタのセットアップ
let editor;

editorInit();

function editorInit() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai"); // テーマを設定
    editor.session.setMode("ace/mode/python"); // 言語モードを設定
    editor.setFontSize(18); // フォントサイズを設定
    editor.getSession().setTabSize(4); // タブサイズを設定
    editor.getSession().setUseWrapMode(true); // 折り返し表示を設定
}

let pushReset = document.getElementById("reset");

pushReset.addEventListener("click", function () {
    editor.setValue('');  // エディタの内容をリセット
    document.getElementById("result").innerHTML = "<p>＜構文解析ログ＞</p>"; 
    document.getElementById("output").innerHTML = "<p>＜ステップ実行＞</p>"; // 出力をクリア
    document.getElementById("variables_table_output").innerHTML = "<tr><td>変数名</td><td>値</td></tr>";
    document.getElementById("loop").innerHTML = "<p>＜ループ実行＞</p>"; // ループ表示をクリア
    document.getElementById("variables_table_loop").innerHTML = "<tr><td>変数名</td><td>値</td></tr>"; // 変数表をクリア
    document.getElementById("execute").innerHTML = "<p>＜実行結果＞</p>"; // 実行結果をクリア 
    document.getElementById("variables_table").innerHTML = "<tr><td>変数名</td><td>値</td></tr>"; // 変数表をクリア
    removeHighlight(currentStep); // 現在のハイライトを削除
    k = 0; // ループ回数をリセット
    loop = [];
    flg = 0; // ループフラグをリセット
});