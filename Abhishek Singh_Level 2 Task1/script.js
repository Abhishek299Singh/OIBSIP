/**
 * Quantum Calc - Core Logic, Themes, & History Integration
 */

class Calculator {
    constructor(prevOperandElement, currOperandElement) {
        this.prevOperandElement = prevOperandElement;
        this.currOperandElement = currOperandElement;
        
        // Load history logs from localStorage
        this.history = JSON.parse(localStorage.getItem('calcHistory')) || [];
        
        this.clear();
        this.renderHistory();
    }

    /**
     * Resets the calculator state to defaults
     */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.isErrorState = false;
    }

    /**
     * Deletes the last character of the current operand
     */
    delete() {
        if (this.isErrorState) {
            this.clear();
            return;
        }
        if (this.shouldResetScreen) {
            this.clear();
            return;
        }
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    /**
     * Appends a number or decimal to the display
     */
    appendNumber(number) {
        if (this.isErrorState) {
            this.clear();
        }

        // If a calculation was just completed, start a new number
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        // Prevent multiple decimals
        if (number === '.' && this.currentOperand.includes('.')) return;

        // If display is '0' and we type a digit, overwrite the '0' unless it's a decimal
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    /**
     * Handles operator input
     */
    chooseOperation(operation) {
        if (this.isErrorState) return;

        // Allow negative prefix for subtraction if screen is empty
        if (this.currentOperand === '0' && (operation === '−' || operation === '-')) {
            this.currentOperand = '-';
            return;
        }
        if (this.currentOperand === '-') return;

        // If there's an operator selected and user clicks another without typing numbers, swap them
        if (this.currentOperand === '' || this.currentOperand === '0') {
            if (this.previousOperand !== '') {
                this.operation = operation;
                return;
            }
        }

        // If there is already a previous operand, compute first
        if (this.previousOperand !== '') {
            this.compute();
            if (this.isErrorState) return;
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    /**
     * Calculates the percentage of the current operand
     */
    percentage() {
        if (this.isErrorState) return;
        
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
        this.shouldResetScreen = true;
    }

    /**
     * Computes the math expression and adds it to history
     */
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // If there's no previous number or current number, return
        if (isNaN(prev) || isNaN(current)) return;

        const opSymbol = this.operation;

        switch (opSymbol) {
            case '+':
                computation = prev + current;
                break;
            case '−':
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Cannot divide by 0';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.isErrorState = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Handle JS float precision issues (e.g. 0.1 + 0.2)
        const precisionFactor = 1e12;
        computation = Math.round(computation * precisionFactor) / precisionFactor;

        const finalResult = computation.toString();

        // Save calculation to History logs before resetting state variables
        this.saveToHistory(this.previousOperand, opSymbol, this.currentOperand, finalResult);

        this.currentOperand = finalResult;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    /**
     * Appends a calculation to the history log
     */
    saveToHistory(prev, op, curr, result) {
        const expression = `${this.getDisplayNumber(prev)} ${op} ${this.getDisplayNumber(curr)} =`;
        const formattedResult = this.getDisplayNumber(result);

        this.history.unshift({
            expression: expression,
            result: formattedResult,
            rawResult: result
        });

        // Cap history items count to 50
        if (this.history.length > 50) {
            this.history.pop();
        }

        localStorage.setItem('calcHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    /**
     * Clears all saved history logs
     */
    clearHistory() {
        this.history = [];
        localStorage.removeItem('calcHistory');
        this.renderHistory();
    }

    /**
     * Renders history log list items on screen
     */
    renderHistory() {
        const historyListElement = document.getElementById('history-list');
        if (!historyListElement) return;

        if (this.history.length === 0) {
            historyListElement.innerHTML = '<div class="no-history-msg">No recent calculations</div>';
            return;
        }

        historyListElement.innerHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}" tabindex="0" title="Click to load result">
                <span class="history-expr">${item.expression}</span>
                <span class="history-result">${item.result}</span>
            </div>
        `).join('');

        // Attach click listeners to history items
        const historyItems = historyListElement.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = item.getAttribute('data-index');
                const historyRecord = this.history[index];
                if (historyRecord) {
                    this.currentOperand = historyRecord.rawResult;
                    this.shouldResetScreen = true;
                    this.isErrorState = false;
                    this.updateDisplay();
                }
            });

            // Enter key listener for keyboard accessibility
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    item.click();
                }
            });
        });
    }

    /**
     * Formats numbers to include comma separators, keeping decimals intact
     */
    getDisplayNumber(number) {
        if (number === 'Cannot divide by 0' || this.isErrorState) {
            return number;
        }

        const stringNumber = number.toString();
        if (stringNumber === '-') return '-';

        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en-US', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    /**
     * Updates the calculator screen markup
     */
    updateDisplay() {
        this.currOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        // Dynamically adjust font sizes based on text length to prevent overflow
        const displayLength = this.currOperandElement.innerText.length;
        this.currOperandElement.classList.remove('long-input', 'very-long-input');
        if (displayLength > 14) {
            this.currOperandElement.classList.add('very-long-input');
        } else if (displayLength > 10) {
            this.currOperandElement.classList.add('long-input');
        }

        if (this.operation != null) {
            this.prevOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.prevOperandElement.innerText = '';
        }
    }
}

// Initialize Elements
const prevOperandElement = document.getElementById('prev-operand');
const currOperandElement = document.getElementById('curr-operand');
const calculator = new Calculator(prevOperandElement, currOperandElement);

// Setup Click Listeners for Calculator Grid
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const percentButton = document.querySelector('[data-operator="%"]');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    if (button.getAttribute('data-operator') === '%') return; // Handled separately
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
        calculator.updateDisplay();
    });
});

percentButton.addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// ==========================================================================
/* THEME SWITCHER LOGIC (Defaults to Light) */
// ==========================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

// Load preferred theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    bodyElement.classList.remove('light-theme');
    bodyElement.classList.add('dark-theme');
} else {
    bodyElement.classList.remove('dark-theme');
    bodyElement.classList.add('light-theme');
}

themeToggleBtn.addEventListener('click', () => {
    if (bodyElement.classList.contains('dark-theme')) {
        bodyElement.classList.remove('dark-theme');
        bodyElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        bodyElement.classList.remove('light-theme');
        bodyElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
});

// ==========================================================================
/* HISTORY DRAWER TOGGLE LOGIC */
// ==========================================================================
const calculatorContainer = document.getElementById('calculator-container');
const historyToggleBtn = document.getElementById('history-toggle');
const closeHistoryBtn = document.getElementById('close-history');
const clearHistoryBtn = document.getElementById('clear-history');

historyToggleBtn.addEventListener('click', () => {
    calculatorContainer.classList.toggle('history-active');
});

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => {
        calculatorContainer.classList.remove('history-active');
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        calculator.clearHistory();
    });
}

// ==========================================================================
/* PHYSICAL KEYBOARD INTEGRATION & ANIMATION FEEDBACK */
// ==========================================================================
const keyMap = {
    '0': 'btn-0',
    '1': 'btn-1',
    '2': 'btn-2',
    '3': 'btn-3',
    '4': 'btn-4',
    '5': 'btn-5',
    '6': 'btn-6',
    '7': 'btn-7',
    '8': 'btn-8',
    '9': 'btn-9',
    '.': 'btn-dot',
    '+': 'btn-add',
    '-': 'btn-sub',
    '*': 'btn-mul',
    '/': 'btn-div',
    '%': 'btn-pct',
    'Enter': 'btn-eq',
    '=': 'btn-eq',
    'Backspace': 'btn-del',
    'Escape': 'btn-ac',
    'Delete': 'btn-ac'
};

document.addEventListener('keydown', (e) => {
    const buttonId = keyMap[e.key];
    if (!buttonId) return;

    // Prevent default browser operations (like scroll/search)
    e.preventDefault();

    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('active-press');
        setTimeout(() => button.classList.remove('active-press'), 100);
        
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            calculator.appendNumber(e.key);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
            calculator.chooseOperation(opMap[e.key]);
        } else if (e.key === '%') {
            calculator.percentage();
        } else if (e.key === 'Enter' || e.key === '=') {
            calculator.compute();
        } else if (e.key === 'Backspace') {
            calculator.delete();
        } else if (e.key === 'Escape' || e.key === 'Delete') {
            calculator.clear();
        }
        
        calculator.updateDisplay();
    }
});
