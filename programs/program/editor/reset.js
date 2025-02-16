const pushReset = document.getElementById("reset");

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
    while(loop.length > 0) loop.pop(); // ループスタックをリセット
    flg = 0; // ループフラグをリセット
    flgWhileRest = 0; // while文変換制限フラグをリセット
});