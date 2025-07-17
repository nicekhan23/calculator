class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.justCalculated = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const numberButtons = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const numberValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        numberButtons.forEach((id, index) => {
            document.getElementById(id).addEventListener('click', () => {
                this.inputNumber(numberValues[index]);
            });
        });

        document.getElementById('add').addEventListener('click', () => this.inputOperator('+'));
        document.getElementById('subtract').addEventListener('click', () => this.inputOperator('-'));
        document.getElementById('multiply').addEventListener('click', () => this.inputOperator('*'));
        document.getElementById('divide').addEventListener('click', () => this.inputOperator('/'));

        document.getElementById('decimal').addEventListener('click', () => this.inputDecimal());
        document.getElementById('clear').addEventListener('click', () => this.clear());
        document.getElementById('equals').addEventListener('click', () => this.calculate());
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            if (this.currentInput === '-') {
                this.currentInput = '-' + num;
            } else if (this.currentInput === '0' && num === '0') {
                return;
            } else if (this.currentInput === '0') {
                this.currentInput = num;
            } else {
                this.currentInput += num;
            }
        }

        this.justCalculated = false;
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        // Handle invalid lone "-"
        if (this.currentInput === '-') {
            this.currentInput = String(this.previousInput || '0');
        }

        const inputValue = parseFloat(this.currentInput);

        if (this.justCalculated) {
            this.previousInput = inputValue;
            this.operator = nextOperator;
            this.waitingForOperand = true;
            this.justCalculated = false;
            return;
        }

        if (this.waitingForOperand) {
            // Allow negative numbers after an operator
            if (nextOperator === '-' && this.currentInput !== '-') {
                this.currentInput = '-';
                this.waitingForOperand = false;
                return;
            }

            // Replace the last operator with the new one
            this.operator = nextOperator;
            return;
        }

        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const newValue = this.performCalculation(this.previousInput, inputValue, this.operator);
            this.previousInput = newValue;
            this.currentInput = String(newValue);
            this.updateDisplay();
        }

        this.operator = nextOperator;
        this.waitingForOperand = true;
        this.justCalculated = false;
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput === '-') {
            this.currentInput = '-0.';
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }

        this.justCalculated = false;
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.justCalculated = false;
        this.updateDisplay();
    }

    calculate() {
        // Prevent calculation on incomplete negative sign
        if (this.currentInput === '-' || this.currentInput === '') return;

        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== '' && this.operator) {
            const newValue = this.performCalculation(this.previousInput, inputValue, this.operator);
            this.currentInput = String(newValue);
            this.previousInput = '';
            this.operator = null;
            this.waitingForOperand = true;
            this.justCalculated = true;
            this.updateDisplay();
        }
    }

    performCalculation(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return Math.round((firstOperand + secondOperand) * 100000000) / 100000000;
            case '-':
                return Math.round((firstOperand - secondOperand) * 100000000) / 100000000;
            case '*':
                return Math.round((firstOperand * secondOperand) * 100000000) / 100000000;
            case '/':
                if (secondOperand === 0) return firstOperand;
                return Math.round((firstOperand / secondOperand) * 100000000) / 100000000;
            default:
                return secondOperand;
        }
    }

    updateDisplay() {
        let displayValue = this.currentInput;

        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            displayValue = Math.abs(num) >= 1e12
                ? num.toExponential(6)
                : num.toPrecision(12);
        }

        this.display.textContent = displayValue;
    }
}

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
