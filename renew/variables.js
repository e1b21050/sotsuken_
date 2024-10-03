let variables = {};
let variables_step = {};
let variables_loop = {};

function updateVariableTable(code) {
    const tableBody = document.querySelector('#variables_table tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>';
    for (const [name, value] of Object.entries(variables)) {
        if(code.includes(name)) {
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

function updateVariableTable_step(code){
    const tableBody = document.querySelector('#variables_table_output tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>';
    for (const [name, value] of Object.entries(variables_step)) {
        if(code.includes(name)){
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

function updateVariableTable_loop(code){
    const tableBody = document.querySelector('#variables_table_loop tbody');
    tableBody.innerHTML = '<tr><td>変数名</td><td>値</td></tr><tbody></tbody>';
    for (const [name, value] of Object.entries(variables_loop)) {
        if(code.includes(name)){
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
