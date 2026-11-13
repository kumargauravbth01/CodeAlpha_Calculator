const previousOperandText = document.getElementById("previous-operand");
const currentOperandText = document.getElementById("current-operand");

let currentOperand = "0";
let previousOperand = "";
let operation = undefined;

function clear() {
  currentOperand = "0";
  previousOperand = "";
  operation = undefined;
}

function deleteNumber() {
  if (currentOperand === "Error") {
    clear();
    return;
  }
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === "" || currentOperand === "-") {
    currentOperand = "0";
  }
}

function appendNumber(number) {
  if (currentOperand === "Error") currentOperand = "0";
  if (number === "." && currentOperand.includes(".")) return;
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number.toString();
  } else {
    currentOperand = currentOperand.toString() + number.toString();
  }
}

function chooseOperation(op) {
  if (currentOperand === "Error") return;
  if (currentOperand === "" && previousOperand !== "") {
    operation = op;
    return;
  }
  if (previousOperand !== "") {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = "";
}

function compute() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      if (current === 0) {
        currentOperand = "Error";
        previousOperand = "";
        operation = undefined;
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  currentOperand = Math.round(computation * 100000000) / 100000000;
  operation = undefined;
  previousOperand = "";
}

function updateDisplay() {
  currentOperandText.innerText = currentOperand;
  if (operation != null) {
    previousOperandText.innerText = `${previousOperand} ${operation}`;
  } else {
    previousOperandText.innerText = "";
  }
}

// Button Click Listeners
document.querySelectorAll("[data-number]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appendNumber(btn.dataset.number);
    updateDisplay();
  });
});

document.querySelectorAll("[data-operator]").forEach((btn) => {
  btn.addEventListener("click", () => {
    chooseOperation(btn.dataset.operator);
    updateDisplay();
  });
});

document.querySelector('[data-action="equals"]').addEventListener("click", () => {
  compute();
  updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener("click", () => {
  clear();
  updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener("click", () => {
  deleteNumber();
  updateDisplay();
});

// Bonus: Keyboard Support
document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    appendNumber(e.key);
  } else if (e.key === "+" || e.key === "-" || e.key === "*") {
    chooseOperation(e.key);
  } else if (e.key === "/") {
    e.preventDefault();
    chooseOperation("÷");
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    compute();
  } else if (e.key === "Backspace") {
    deleteNumber();
  } else if (e.key === "Escape") {
    clear();
  }
  updateDisplay();
});