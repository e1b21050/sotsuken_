window.onload = function() {
    const mondai = document.getElementById("mondai");
    const answer = document.getElementById("answer");
    let mondais = "";
    let answers = "";

    // 1-1 から 1-10 の問題を生成
    for (let i = 1; i <= 10; i++) {
        let mondaiText = "<br>[問題]<br>";
        let answerText = "<br>[解答]<br>";         
        mondaiText = createMondai(mondaiText, i);
        answerText = createAnswer(answerText, i);
        mondais += `
            <p>
                <span class="toggle-btn" id="toggle-${i}">1-${i}: 問題を表示</span>
                <span class="mondai-text" id="mondai-${i}" style="display:none;">
                    ${mondaiText}
                </span>
            </p>
        `;
        answers += `
            <p>
                <span class="toggle-btn_s" id="toggle-${i}_s">1-${i}: 解答を表示</span>
                <span class="answer-text" id="answer-${i}" style="display:none;">
                    ${answerText}
                </span>
            </p>
        `;
    }

    // 問題を挿入
    mondai.innerHTML += mondais;
    // 解答を挿入
    answer.innerHTML += answers;

    // クリックイベントを追加
    for (let i = 1; i <= 10; i++) {
        const toggleBtn = document.getElementById(`toggle-${i}`);
        const mondaiText = document.getElementById(`mondai-${i}`);
        const toggleBtn_s = document.getElementById(`toggle-${i}_s`);
        const answerText = document.getElementById(`answer-${i}`);

        toggleBtn.addEventListener("click", function() {
            if (mondaiText.style.display === "none") {
                mondaiText.style.display = "inline";
                toggleBtn.textContent = `1-${i}: 問題を隠す`;
            } else {
                mondaiText.style.display = "none";
                toggleBtn.textContent = `1-${i}: 問題を表示`;
            }
        });
        toggleBtn_s.addEventListener("click", function() {
            if (answerText.style.display === "none") {
                answerText.style.display = "inline";
                toggleBtn_s.textContent = `1-${i}: 解答を隠す`;
            }else {
                answerText.style.display = "none";
                toggleBtn_s.textContent = `1-${i}: 解答を表示`;
            }
        });
    }
};

