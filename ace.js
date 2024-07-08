// Aceエディタのセットアップ
let editor;

editorInit();

function editorInit() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai"); // テーマを設定
    editor.session.setMode("ace/mode/python"); // 言語モードを設定
    editor.setFontSize(14); // フォントサイズを設定
    editor.getSession().setTabSize(4); // タブサイズを設定
    editor.getSession().setUseWrapMode(true); // 折り返し表示を設定
}

