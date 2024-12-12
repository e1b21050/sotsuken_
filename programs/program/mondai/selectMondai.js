function selectMondai() {
    // 仮の問題データ
    const mondais = ['問題1-1','問題1-2', '問題1-3', '問題1-4', '問題1-5', '問題1-6', '問題1-7', '問題1-8', '問題1-9', '問題1-10'];
    
    // モーダルを開く処理
    // 問題リストを生成
    mondaiList.innerHTML = '';
    mondais.forEach((mondai, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = mondai;
        listItem.addEventListener('click', () => {
            selectMondai(index);
        });
        mondaiList.appendChild(listItem);
    });
    modal.style.display = 'block';

    // モーダルを閉じる処理
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 問題を選択したときの処理
    function selectMondai(index) {
        modal.style.display = 'none';
        document.getElementById('result').innerHTML += '<br>選択された問題:' + `${mondais[index]}` + 'を採点します。';
        // ここで選択された問題に応じた採点処理を追加
        mondaiNumber = index + 1;
        selectInputExample(mondaiNumber);
    }
}