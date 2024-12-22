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

function getVariables(line) {
    // x, y = 1, 2 のような行から`x, y`を抽出
    // x, y, z = 1, 2, 3 にも対応
    let match = line.match(/(\w+(?:,\s*\w+)*)\s*=/);
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

function getLoopWhileCondition_s(whileLine) {
    // while n % a != 0 or n % b != 0: のような行から`n % a != 0 or n % b != 0`を抽出
    let match = whileLine.match(/while (.+):/);
    return match ? match[1] : null;
}

