const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;

    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
        updateDisplay();
        return;
    }

    if (shouldResetScreen) {
        currentOperand = number === '.' ? '0.' : number;
        shouldResetScreen = false;
    } else {
        currentOperand += number;
    }

    updateDisplay();
}

function appendOperation(op) {
    if (currentOperand === '' && previousOperand === '') return;

    if (currentOperand === '') {
        // lagi ganti operator sebelum ngetik angka baru
        operation = op;
        updateDisplay();
        return;
    }

    if (previousOperand !== '') {
        compute();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    shouldResetScreen = false;
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentOperand = 'Error';
                previousOperand = '';
                operation = undefined;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // FIX: dijadiin string, biar .includes('.') di appendNumber gak error
    currentOperand = (Math.round(computation * 1e10) / 1e10).toString();
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;

    updateDisplay();
}

function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
    updateDisplay();
}

function deleteDigit() {
    if (shouldResetScreen || currentOperand === 'Error') {
        clearDisplay();
        return;
    }

    if (currentOperand.length === 1 || currentOperand === '0') {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }

    updateDisplay();
}

function updateDisplay() {
    currentOperandElement.innerText = currentOperand;

    if (operation != null) {
        let displayOp = operation;
        if (operation === '*') displayOp = '×';
        if (operation === '/') displayOp = '÷';

        previousOperandElement.innerText = `${previousOperand} ${displayOp}`;
    } else {
        previousOperandElement.innerText = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.') appendNumber('.');
    else if (['+', '-', '*', '/'].includes(e.key)) appendOperation(e.key);
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
    else if (e.key === 'Backspace') deleteDigit();
    else if (e.key === 'Escape') clearDisplay();
});