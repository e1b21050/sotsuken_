window.onload = function() {
    const mondai = document.getElementById("mondai");
    let problems = "";

    // 1-1 から 1-10 の問題を生成
    for (let i = 1; i <= 10; i++) {
        let problemText = "<br>[問題]<br>";
        let answerText = "<br>[解答]<br>";         
        problemText = createQuestion(problemText, i);
        answerText = createAnswer(answerText, i);
        problems += `
            <p>
                <span class="toggle-btn" id="toggle-${i}">1-${i}: 問題を表示</span>
                <span class="problem-text" id="problem-${i}" style="display:none;">
                    ${problemText}
                </span>
            </p>
            <p>
                <span class="toggle-btn_s" id="toggle-${i}_s">1-${i}: 解答を表示</span>
                <span class="answer-text" id="answer-${i}" style="display:none;">
                    ${answerText}
                </span>
            </p>
        `;
    }

    // 問題を挿入
    mondai.innerHTML += problems;

    // クリックイベントを追加
    for (let i = 1; i <= 10; i++) {
        const toggleBtn = document.getElementById(`toggle-${i}`);
        const problemText = document.getElementById(`problem-${i}`);
        const toggleBtn_s = document.getElementById(`toggle-${i}_s`);
        const answerText = document.getElementById(`answer-${i}`);

        toggleBtn.addEventListener("click", function() {
            if (problemText.style.display === "none") {
                problemText.style.display = "inline";
                toggleBtn.textContent = `1-${i}: 問題を隠す`;
            } else {
                problemText.style.display = "none";
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

function createQuestion(problemText, i){
    switch (i) {
        case 1:
            problemText += 
            " A, B の 2 つの整数が与えられます。A と B の数値を入れ替えた後、A, B を出力しなさい。" +
            "<br>[入力]<br>" +
            " 入力は以下の形式で標準入力から与えられる。" +
            "1 行目には、2 つの整数 A,B(1≦A,B≦100) が与えられる。" +
            "<br> a b" +
            "<br>[出力]<br>" +
            "数字の入れ替えた後の A と B を、スペース区切りで 1 行で出力せよ。出力の末尾には改行をいれること。" +
            "<br>入力例1<br>" +
            "1 2" +
            "<br>出力例1<br>" +
            "2 1" +
            "<br>入力例2<br>" +
            "5 5" +
            "<br>出力例2<br>" +
            "5 5";
            break;
        case 2:
            problemText += 
            "3 つの箱 A,B,C があります。それぞれの箱には、整数が 1 つ入っています。現在、箱 A,B,C に入っている整数はそれぞれ X,Y,Z です。これらの箱に対して以下の操作を順に行った後の、それぞれの箱に入っている整数を求めてください。<br>" +
            "・箱 A と箱 B の中身を入れ替える<br>・箱 A と箱 C の中身を入れ替える<br>" +
            "<br>[制約]<br>" +
            "・1≦X,Y,Z≦100(入力はすべて実数)" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> X Y Z" +
            "<br>[出力]<br>" +
            "箱 A,B,C に入っている整数を、順番に空白区切りで出力せよ。" +
            "<br>入力例1<br>" +
            "1 2 3" +
            "<br>出力例1<br>" +
            "3 1 2" +
            "<br>入力例2<br>" +
            "100 100 100" +
            "<br>出力例2<br>" +
            "100 100 100" +
            "<br>入力例3<br>" +
            "41 59 31" +
            "<br>出力例3<br>" +
            "31 41 59";
            break;
        case 3:
            problemText += 
            "N 個のボールが入っていた箱から A 個のボールを取り出し、新たに B 個のボールを入れました。今、箱にはボールが何個入っていますか?" +
            "<br>[制約]<br>" +
            "・入力はすべて整数" +
            "・100≦N≦200" +
            "・1≦A,B≦100" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> N A B" +
            "<br>[出力]<br>" +
            "箱に入っているボールの数を出力せよ。" +
            "<br>入力例1<br>" +
            "100 1 2" +
            "<br>出力例1<br>" +
            "101" +
            "<br>入力例2<br>" +
            "100 2 1" +
            "<br>出力例2<br>" +
            "99" +
            "<br>入力例3<br>" +
            "100 1 1" +
            "<br>出力例3<br>" +
            "100";
            ;
            break;
        case 4:
            problemText += 
            "高橋君は子供の頃の写真を整理している。整理している最中に、写真を入れている木箱が出てきたので、木箱内にある写真をアルバムに貼って整理することにした。どの位の大きさのアルバムが必要なのか確認するために、木箱の中にある写真の枚数が知りたくなった。高橋君はすべての写真に正整数の通し番号を付けており、木箱内には通し番号が S 以上 T 以下であるすべての写真が入っている。高橋君は、木箱にある写真の枚数が知りたいが、写真を 1 枚ずつ数えるのは大変である。あなたは高橋くんの代わりに、S と T の値からアルバムに貼られている写真の枚数を計算するプログラムを作成せよ。"+
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> S T" +
            "・1 行目には、アルバムに貼られている写真の範囲を表す 2 つの整数 S,T(1≦S≦T≦1,000) が与えられる。" +
            "<br>[出力]<br>" +
            "木箱内にある写真の枚数を出力せよ。出力の末尾にも改行を入れること。" +
            "<br>入力例1<br>" +
            "4 7" +
            "<br>出力例1<br>" +
            "4" +
            "<br>入力例2<br>" +
            "1 1" +
            "<br>出力例2<br>" +
            "1";
            break;
        case 5:
            problemText += 
            "クイズです。<br>" +
            "・第 1 問： あなたが今参加しているこのコンテストの略称は何でしょう？ アルファベット大文字 3 文字で答えてください。<br>" +
            "・第 2 問： あなたが今参加しているこのコンテストなどを運営しているAtCoder株式会社の代表取締役社長は誰でしょう？ アルファベット小文字 8 文字のハンドルネームで答えてください。<br>" +
            "標準入力から整数 1 または 2 が与えられます。 1 が入力された場合は第 1 問の答えを、 2 の場合は第 2 問の答えを出力してください。なお、クイズの答えに関してはこの問題ページ内に記載があります。" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> Q" +
            "・1 行目には、整数 Q(1 または 2) が与えられる。" +
            "<br>[出力]<br>" +
            "標準出力に、 Q=1 であれば第 1 問の答えを、 Q=2 であれば第 2 問の答えを出力せよ。アルファベットの大文字と小文字は区別される。末尾の改行を忘れないこと。" +
            "<br>入力例1<br>" +
            "1" +
            "<br>出力例1<br>" +
            "ABC" +
            "<br>入力例2<br>" +
            "2" +
            "<br>出力例2<br>" +
            "chokudai";
            break;
        case 6:
            problemText += 
            "高橋君が 3 つのサイコロを振ったところそれぞれ a,b,c の目が出ました。a,b,c のうちある 2 つが同じときは残りの 1 つのサイコロの目を、同じものがないときは 0 を出力してください。" +
            "<br>[制約]<br>" +
            "・1≦a,b,c≦6(a,b,c:整数)" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> a b c" +
            "<br>[出力]<br>" +
            "a,b,c のうちある 2 つが同じときは残りの 1 つのサイコロの目を、同じものがないときは 0 を出力せよ。" +
            "<br>入力例1<br>" +
            "2 5 2" +
            "<br>出力例1<br>" +
            "5" +
            "<br>入力例2<br>" +
            "4 5 6" +
            "<br>出力例2<br>" +
            "0" +
            "<br>入力例3<br>" +
            "3 3 3" +
            "<br>出力例3<br>" +
            "3";
            break;
        case 7:
            problemText += 
            "v と w のみからなる文字列 S が与えられます。S の中に、下に尖っている部分が何箇所あるかを出力してください（入出力例にある図もご参照ください）。" +
            "<br>[制約]<br>" +
            "・S は v と w のみからなる文字列<br>" +
            "・1≦|S|≦100" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> S" +
            "<br>[出力]<br>" +
            "S の中に、下に尖っている部分が何箇所あるかを出力してください。" +
            "<br>入力例1<br>" +
            "vvwvw" +
            "<br>出力例1<br>" +
            "7" +
            "<br>入力例2<br>" +
            "v" +
            "<br>出力例2<br>" +
            "1" +
            "<br>入力例3<br>" +
            "wwwvvvvvv" +
            "<br>出力例3<br>" +
            "12";
            break;
        case 8:
            problemText += 
            "N 以下の非負整数を大きい方から順にすべて出力してください。" +
            "<br>[制約]<br>" +
            "・1≦N≦100(N:整数)" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> N" +
            "<br>[出力]<br>" +
            "N 以下の非負整数が X 個存在するとき、X 行出力せよ。i=1,2,…,X に対し、i 行目には N 以下の非負整数のうち大きい方から i 番目のものを出力せよ。" +
            "<br>入力例1<br>" +
            "3" +
            "<br>出力例1<br>" +
            "3" +
            "2" +
            "1" +
            "0" +
            "<br>入力例2<br>" +
            "1" +
            "<br>出力例2<br>" +
            "1" +
            "0";
            break;
        case 9:
            problemText += 
            "高橋くんは満月が好きです。今日を 1 日目とすると、今日以降で満月を見られる最初の日は M 日目です。以後は P 日ごと、つまり M+P 日目、M+2P 日目、… に満月を見られます。1 日目から N 日目まで（両端を含む）の中で、高橋くんが満月を見られる日の数を求めてください。" +
            "<br>[制約]<br>" +
            "・1≦N≦2*10^5" +
            "・1≦M≦P≦2*10^5" +
            "入力される数値は全て整数" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> N M P" +
            "<br>[出力]<br>" +
            "1 日目から N 日目まで（両端を含む）の中で、高橋くんが満月を見られる日の数を出力せよ。" +
            "<br>入力例1<br>" +
            "13 3 5" +
            "<br>出力例1<br>" +
            "3" +
            "<br>入力例2<br>" +
            "5 6 6" +
            "<br>出力例2<br>" +
            "0" +
            "<br>入力例3<br>" +
            "200000 314 318" +
            "<br>出力例3<br>" +
            "628";
            break;
        case 10:
            problemText += 
            "青木君は整数 a で割り切れる数が好きです。 高橋君は整数 b で割り切れる数が好きです。n 以上の整数で、青木君と高橋君の両方が好きな最小の数を答えてください。" +
            "<br>[入力]<br>" +
            "入力は以下の形式で標準入力から与えられる。" +
            "<br> a" +
            "<br> b" +
            "<br> n" +
            "・1 行目には、整数 a(1≦a≦100) が与えられる。" +
            "・2 行目には、整数 b(1≦b≦100) が与えられる。" +
            "・3 行目には、整数 n(1≦n≦20,000) が与えられる。" +
            "<br>[出力]<br>" +
            "出力は以下の形式で標準出力に行うこと。1行目に、n 以上の整数で、青木君と高橋君の両方が好きな最小の数を出力してください。末尾の改行を忘れないこと。" +
            "<br>入力例1<br>" +
            "2" +
            "3" +
            "8" +
            "<br>出力例1<br>" +
            "12" +
            "<br>入力例2<br>" +
            "2" +
            "2" +
            "2" +
            "<br>出力例2<br>" +
            "2" +
            "<br>入力例3<br>" +
            "12" +
            "8" +
            "25" +
            "<br>出力例3<br>" +
            "48";
            break;
    }
    return problemText;
}

function createAnswer(answerText, i){
    switch (i) {
        case 1:
            answerText += 
            "a, b = map(int, input().split())<br>" +
            "print(b, a)";
            break;
        case 2:
            answerText += 
            "X, Y, Z = map(int, input().split())<br>" +
            "print(Z, X, Y)";
            break;
        case 3:
            answerText += 
            "N, A, B = map(int, input().split())<br>" +
            "print(N - A + B)";
            break;
        case 4:
            answerText += 
            "S, T = map(int, input().split())<br>" +
            "print(T-S+1)";
            break;
        case 5:
            answerText += 
            "Q = int(input())<br>" +
            "if Q == 1:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print('ABC')<br>" +
            "if Q == 2:もしくはelse:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print('chokudai')<br>";
            break;
        case 6:
            answerText += 
            "a, b, c = map(int, input().split())>br>" +
            "if a == b:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(c)<br>" +
            "elif a == c:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(b)<br>" +
            "elif b == c:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(a)<br>" +
            "else:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(0)";
            break;
        case 7:
            answerText += 
            "S = input()<br>" +
            "count = 0<br>" +
            "for s in S:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;if s == 'v':<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count += 1<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;if s == 'w':<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count += 2<br>" +
            "print(count)";
            break;
        case 8:
            answerText += 
            "N = int(input())<br>" +
            "for i in range(N+1):<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(N-i)<br>" +
            "もしくは<br>" +
            "N = int(input())<br>" +
            "for i in range(N, -1, -1):<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(i)";
            break;
        case 9:
            answerText += 
            "N, M, P = map(int, input().split())<br>" +
            "count = 0<br>" +
            "for i in range(N):<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;if M <= N:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count += 1<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M += P<br>" +
            "print(count)<br>" +
            "もしくは<br>" +
            "N, M, P = map(int, input().split())<br>" +
            "count = 0<br>" +
            "while M <= N:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;count += 1<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;M += P<br>" +
            "print(count)<br>";
            break;
        case 10:
            answerText += 
            "a, b, n = [int(input()) for i in range(3)]<br>" +
            "while n % a != 0 or n % b != 0:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;n += 1<br>" +
            "print(n)<br>" +
            "もしくは<br>" +
            "a, b, n = [int(input()) for i in range(3)]<br>" +
            "while not (n % a == 0 and n % b == 0):<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;n += 1<br>" +
            "print(n)";
            break;
    }
    return answerText;
}
