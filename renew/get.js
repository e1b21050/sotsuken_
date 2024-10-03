function getVariable(line) {
    // x = 1 のような行から`x`を抽出
    let match = line.match(/(\w+)\s*=/);
    return match ? match[1] : null;
}

function getValue(line) {
    // x = 1 のような行から`1`を抽出
    let match = line.match(/=\s*(.*)/);
    return match ? match[1] : null;
}

function getIndentLevel(line) {
    return line.match(/^\s*/)[0].length;
}

function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return typeof value === 'number';
}

function getLoopVariable(forLine) {
    // `for i in x:`のような行から`i`を抽出
    let match = forLine.match(/for (\w+) in/);
    return match ? match[1] : null;
}

function getLoopIterable(forLine) {
    // `for i in x:`のような行から`x`を抽出
    let match = forLine.match(/for \w+ in (.+):/);
    return match ? match[1] : null;
}

function getLoopIterable_f(forLine) {
    // `for i in range(5):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in range\((\d+)\):/);
    return match ? match[1] : null;
}

function getLoopIterable_d1(forLine) {
    // `for i in range(2, 5):`のような場合は`2`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+)\):/);
    return match ? match[1] : null;
}

function getLoopIterable_d2(forLine) {
    // `for i in range(2, 5):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+)\):/);
    return match ? match[2] : null;
}

function getLoopIterable_t1(forLine) {
    // `for i in range(2, 5, 3):`のような場合は`2`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+), (-?\d+)\):/);
    return match ? match[1] : null;
}

function getLoopIterable_t2(forLine) {
    // `for i in range(2, 5, 3):`のような場合は`5`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+), (-?\d+)\):/);
    return match ? match[2] : null;
}

function getLoopIterable_t3(forLine) {
    // `for i in range(2, 5, 3):`のような場合は`3`を返す
    let match = forLine.match(/for \w+ in range\((-?\d+), (-?\d+), (-?\d+)\):/);
    return match ? match[3] : null;
}

function getLoopWhileVariable(whileLine) {
    // `while i < 5:`のような行から`i`を抽出
    let match = whileLine.match(/while (\w+) /);
    return match ? match[1] : null;
}

function getLoopWhileConditon(whileLine) {
    // `while i < 5:`のような行から`<`を抽出
    let match = whileLine.match(/while \w+ (<|>|<=|>=|==|!=) (-?\d+):/);
    return match ? match[1] : null;
}

function getLoopWhileIterable(whileLine) {
    // `while i < 5:`のような行から`5`を抽出
    let match = whileLine.match(/while \w+ (<|>|<=|>=|==|!=) (-?\d+):/);
    return match ? match[2] : null;
}

function getLoopWhileVariable_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`n % a != 0`を抽出
    let match = whileLine.match(/while (.+) (or|and) (.+):/);
    return match ? match[1] : null;
}

function getLoopWhileConditon_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`or`を抽出
    let match = whileLine.match(/while (.+) (or|and) (.+):/);
    return match ? match[2] : null;
}

function getLoopWhileIterable_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`n % b != 0`を抽出
    let match = whileLine.match(/while (.+) (or|and) (.+):/);
    return match ? match[3] : null;
}

function getIfCondition(line) {
    // `if` の条件式での変数を取得するロジックを実装
    let match = line.match(/if\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[1] : null;  // 演算子の左側の変数を取得
}

function getIfConditionValue(line) {
    // `if` の条件式での値を取得するロジックを実装
    let match = line.match(/if\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[3] : null;  // 演算子の右側の値を取得
}

function getElifCondition(line) {
    // `elif` の条件式での変数を取得するロジックを実装
    let match = line.match(/elif\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[1] : null;  // 演算子の左側の変数を取得
}

function getElifConditionValue(line) {
    // `elif` の条件式での値を取得するロジックを実装
    let match = line.match(/elif\s+(.*)\s*(==|!=|>|<|>=|<=)\s*(.*)/);
    return match ? match[3] : null;  // 演算子の右側の値を取得
}

function getEvaluate(line1, line2, line3) {
    // 条件式を評価するロジックを実装
    let line = line1 + ' ' + line2 + ' ' +line3;
    if(line){
        return true;
    }
    return false;
}