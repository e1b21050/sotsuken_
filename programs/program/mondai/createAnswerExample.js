function selectInputExample(questionNumber) {
    switch(questionNumber){
        case 1:
            inputExamples = ['1 2', '5 5', '3 5', '10 20', '23 12', '11 11'];
            answerCode = `
a, b = map(int, input().split())
print(b, a)`;
            variableNamesAnswer = ['a', 'b'];
            break;
        case 2:
            inputExamples = ['1 2 3', '100 100 100', '41 59 31', '1 50 100', '25 75 50', '100 1 2'];
            answerCode = `
X, Y, Z = map(int, input().split())
print(Z, X, Y)`;
            variableNamesAnswer = ['X', 'Y', 'Z'];
            break;
        case 3:
            inputExamples = ['100 1 2', '100  2 1', '100 1 1', '100 3 5', '121 11 11', '100 100 100'];
            answerCode = `
N, A, B = map(int, input().split())
print(N - A + B)`;
            variableNamesAnswer = ['N', 'A', 'B'];
            break;
        case 4:
            inputExamples = ['4 7', '1 1', '1 100', '100 100', '3 1000'];
            answerCode = `
S, T = map(int, input().split())
print(T-S+1)`;
            variableNamesAnswer = ['S', 'T'];
            break;
        case 5:
            inputExamples = ['1', '2'];
            answerCode = `
Q = int(input())
if Q == 1:
    print('ABC')
else:
    print('chokudai')`;
            variableNamesAnswer = ['Q'];
            break;
        case 6:
            inputExamples = ['2 5 2', '4 5 6', '3 3 3', '1 1 1', '1 2 2', '2 2 2'];
            answerCode = `
a, b, c = map(int, input().split())
if a == b:
    print(c)
elif a == c:
    print(b)
elif b == c:
    print(a)
else:
    print(0)`;
            variableNamesAnswer = ['a', 'b', 'c'];
            break;
        case 7:
            inputExamples = ['vvwvw', 'v', 'wwwvvvvvv', 'w', 'vvvwv', 'wv'];
            answerCode = `
S = input()
count = 0
for s in S:
    if s == 'v':
        count += 1
    if s == 'w':
        count += 2
print(count)`;
            variableNamesAnswer = ['S', 'count'];
            break;
        case 8:
            inputExamples = ['3', '1', '5', '13', '100', '8'];
            answerCode = `
N = int(input())
for i in range(N+1):
    print(N-i)`;
            variableNamesAnswer = ['N'];
            break;
        case 9:
            inputExamples = ['13 3 5', '5 6 6', '200000 314 318', '23 1 1', '100 100 100', '255 2 3'];
            answerCode = `
N, M, P = map(int, input().split())
count = 0
for i in range(N):
    if M <= N:
        count += 1
        M += P
print(count)`;
            variableNamesAnswer = ['N', 'M', 'P', 'count'];
            break;
        case 10:
            inputExamples = ['1 2', '1 1', '3 1', '2 3', '3 2', '2 1'];
            answerCode = `
A, B = map(int, input().split())
if A == B:
    print(-1)
if A == 1 and B == 2:
    print(3)
if A == 1 and B == 3:
    print(2)
if A == 2 and B == 1:
    print(3)
if A == 2 and B == 3:
    print(1)
if A == 3 and B == 1:
    print(2)
if A == 3 and B == 2:
    print(1)`;
            variableNamesAnswer = ['A', 'B'];            
            break;
        default:
            inputExamples = [];
    }
}
