// 変数表の更新を行う関数
let variables = {};
let variables_step = {};
let variables_loop = {};
// 一括実行用
function updateVariableTable(code) {
    const tableBody = document.querySelector('#variables_table tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>';
    for (const [name, value] of Object.entries(variables)) {
        // codeにあたる部分かつ関数ではないもののみ変数表に行を追加
        if(code.includes(name) && typeof value !== 'function'){
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const valueCell = document.createElement('td');
            nameCell.textContent = name;
            valueCell.textContent = value;
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    }
}
// ステップ実行用
function updateVariableTable_step(code) {
    const tableBody = document.querySelector('#variables_table_output tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>';
    for (const [name, value] of Object.entries(variables_step)) {
        // 関数でないことを確認し、コード内に変数が含まれている場合のみ追加
        if (code.includes(name) && typeof value !== 'function') {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const valueCell = document.createElement('td');
            nameCell.textContent = name;
            valueCell.textContent = value;
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    }
}
// ループ実行用
function updateVariableTable_loop(code){
    const tableBody = document.querySelector('#variables_table_loop tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>';
    for (const [name, value] of Object.entries(variables_loop)) {
        if(code.includes(name) && typeof value !== 'function'){
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const valueCell = document.createElement('td');
            nameCell.textContent = name;
            valueCell.textContent = value;
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    }
}
