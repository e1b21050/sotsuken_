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
            "a, b, c = map(int, input().split())<br>" +
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
            "A, B = map(int, input().split())<br>" +
            "if A == B:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(-1)<br>" +
            "if A == 1 and B == 2:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(3)<br>" +
            "if A == 1 and B == 3:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(2)<br>" +
            "if A == 2 and B == 1:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(3)<br>" +
            "if A == 2 and B == 3:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(1)<br>" +
            "if A == 3 and B == 1:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(2)<br>" +
            "if A == 3 and B == 2:<br>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;print(1)";
            break;
    }
    return answerText;
}