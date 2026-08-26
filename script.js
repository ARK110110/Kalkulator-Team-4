const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

function appendNumber(number) {
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
        updateDisplay();
        return;
    }

    if (number === '.' && currentOperand.includes('.')) return;

    if (shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else {
        currentOperand += number;
    }

    updateDisplay();
}

function appendOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
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
                alert("Tidak dapat membagi dengan nol!");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    currentOperand = Math.round(computation * 1e10) / 1e10;
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
    if (shouldResetScreen) return;
    
    if (currentOperand.length === 1 || currentOperand === '0') {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.toString().slice(0, -1);
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