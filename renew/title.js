document.addEventListener('DOMContentLoaded', (event) => {
    let pushHelpTitle = document.getElementById("helpTitle");
    pushHelpTitle.addEventListener('click', function() {
        var helpText = document.getElementById('helpTextTitle');
        if (helpText.style.display === 'none') {
            helpText.style.display = 'block';  // 表示
            pushHelpTitle.textContent = '×';      // ボタンの表記を「×」に変更
        } else {
            helpText.style.display = 'none';   // 非表示
            pushHelpTitle.textContent = '？';     // ボタンの表記を「？」に戻す
        }
    });
});
