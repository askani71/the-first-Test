class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.isNewNumber = true;
        this.operationString = '';
        this.showResult = false;

        this.display = document.querySelector('.display-text');
        this.operationDisplay = document.querySelector('.operation-text');
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        const buttons = document.querySelectorAll('.button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent;

                if (button.classList.contains('number')) {
                    this.handleNumber(buttonText);
                } else if (button.classList.contains('operator')) {
                    this.handleOperator(buttonText);
                } else if (button.classList.contains('equals')) {
                    this.handleEquals();
                } else if (button.classList.contains('clear')) {
                    this.handleClear();
                } else if (button.classList.contains('sign')) {
                    this.handleSignChange();
                } else if (button.classList.contains('percent')) {
                    this.handlePercent();
                } else if (button.classList.contains('decimal')) {
                    this.handleDecimal();
                }
            });
        });
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
    }

    updateOperationDisplay() {
        this.operationDisplay.textContent = this.operationString;
    }

    handleNumber(number) {
        if (this.showResult) {
            // Starting a new calculation after showing result
            this.operationString = '';
            this.showResult = false;
            this.updateOperationDisplay();
        }

        if (this.isNewNumber) {
            this.currentValue = number;
            this.isNewNumber = false;
        } else {
            if (this.currentValue === '0') {
                this.currentValue = number;
            } else {
                this.currentValue += number;
            }
        }
        this.updateDisplay();
    }

    handleOperator(operator) {
        if (this.showResult) {
            // Using result as first operand for new operation
            this.operationString = this.currentValue + ' ' + operator;
            this.showResult = false;
        } else if (this.previousValue !== null && !this.isNewNumber) {
            // Chain operation - calculate first, then continue
            this.calculate();
            this.operationString = this.currentValue + ' ' + operator;
        } else {
            // Normal operation - first operand + operator
            this.operationString = this.currentValue + ' ' + operator;
        }

        this.updateOperationDisplay();
        this.previousValue = parseFloat(this.currentValue);
        this.operation = operator;
        this.isNewNumber = true;
    }

    handleEquals() {
        if (this.previousValue !== null && this.operation !== null) {
            // Complete the operation string with second operand and equals
            this.operationString += ' ' + this.currentValue + ' =';
            this.updateOperationDisplay();

            this.calculate();
            this.operation = null;
            this.previousValue = null;
            this.showResult = true;
        }
        this.isNewNumber = true;
    }

    handleClear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.isNewNumber = true;
        this.operationString = '';
        this.showResult = false;
        this.updateDisplay();
        this.updateOperationDisplay();
    }

    handleSignChange() {
        if (this.currentValue !== '0') {
            this.currentValue = (parseFloat(this.currentValue) * -1).toString();
            this.updateDisplay();
        }
    }

    handlePercent() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }

    handleDecimal() {
        if (this.isNewNumber) {
            this.currentValue = '0.';
            this.isNewNumber = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    calculate() {
        const current = parseFloat(this.currentValue);
        const previous = this.previousValue;
        let result;

        switch (this.operation) {
            case '+':
                result = previous + current;
                break;
            case '-':
                result = previous - current;
                break;
            case '×':
                result = previous * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentValue = 'Error';
                    this.operationString = previous + ' ÷ 0 =';
                    this.updateDisplay();
                    this.updateOperationDisplay();
                    this.showResult = true;
                    return;
                }
                result = previous / current;
                break;
            default:
                return;
        }

        // Handle large numbers and decimals
        if (result.toString().length > 12) {
            result = parseFloat(result.toFixed(10));
        }

        this.currentValue = result.toString();
        this.updateDisplay();
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
