let state = {
  num1: undefined,
  num2: undefined,
  operator: "",
};

let result = undefined;

const stateProxy = new Proxy(state, {
  set(target, prop, value) {
    target[prop] = value;
    if (
      !(stateProxy.num1 === undefined) &&
      !(stateProxy.num2 === undefined) &&
      !(stateProxy.operator === "")
    ) {
      calculateResult();
    }
    return true;
  },
});

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(operator, num1, num2) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      return "Incorrect operator";
  }
}

document.addEventListener("click", (element) => {
  if (!element.target.closest("button")) return;

  const numbers = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  const operators = ["add", "subtract", "multiply", "divide"];

  const id = element.target.closest("button").id;

  if (numbers.includes(id)) {
    numberPressed(convertToNumber(id));
  } else if (operators.includes(id)) {
    operatorPressed(id);
  } else {
    switch (id) {
      case "AC":
        clearAll();
        break;
      case "C":
        clear();
        break;
      case "backspace":
        backspacePressed();
        break;
      case "brackets":
        bracketsPressed();
        break;
      case "point":
        pointPressed();
        break;
      case "equal":
        equalPressed();
        break;
    }
  }
});

function convertToNumber(string) {
  switch (string.toLowerCase()) {
    case "zero":
      return 0;
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    default:
      return NaN;
  }
}

function numberPressed(number) {
  if (number === NaN) return;
  const num1Display = document.querySelector("#num1");
  const num2Display = document.querySelector("#num2");
  const operatorDisplay = document.querySelector("#operator");

  if (!operatorDisplay.textContent) {
    num1Display.textContent += String(number);
    stateProxy.num1 = Number(num1Display.textContent);
  } else {
    num2Display.textContent += String(number);
    stateProxy.num2 = Number(num2Display.textContent);
  }
}

function operatorPressed(id) {
  const operatorDisplay = document.querySelector("#operator");
  const num1Display = document.querySelector("#num1");
  if (operatorDisplay.textContent) return;
  if (!num1Display.textContent) return;

  switch (id) {
    case "add":
      operatorDisplay.textContent = "+";
      stateProxy.operator = "+";
      break;
    case "subtract":
      operatorDisplay.textContent = "-";
      stateProxy.operator = "-";
      break;
    case "multiply":
      operatorDisplay.textContent = "*";
      stateProxy.operator = "*";
      break;
    case "divide":
      operatorDisplay.textContent = "/";
      stateProxy.operator = "/";
      break;
  }
}

function clearAll() {
  const operatorDisplay = document.querySelector("#operator");
  operatorDisplay.textContent = "";
  stateProxy.operator = "";

  const num1Display = document.querySelector("#num1");
  num1Display.textContent = "";
  stateProxy.num1 = undefined;

  const num2Display = document.querySelector("#num2");
  num2Display.textContent = "";
  stateProxy.num2 = undefined;

  const subDisplay = document.querySelector("#sub-display");
  subDisplay.textContent = "";
  result = undefined;
}

function clear() {
  console.log("Clear");
}

function backspacePressed() {
  console.log("Backspace");
}

function bracketsPressed() {
  console.log("Brackets");
}

function pointPressed() {
  console.log("Point");
}

function equalPressed() {
  if (!stateProxy.num1 || !stateProxy.num2 || !stateProxy.operator) return;

  const subDisplay = document.querySelector("#sub-display");
  subDisplay.textContent = "";

  const operatorDisplay = document.querySelector("#operator");
  operatorDisplay.textContent = "";
  stateProxy.operator = "";

  const num2Display = document.querySelector("#num2");
  num2Display.textContent = "";
  stateProxy.num2 = undefined;

  const num1Display = document.querySelector("#num1");
  num1Display.textContent = result;
  stateProxy.num1 = result;
}

function calculateResult() {
  result = operate(stateProxy.operator, stateProxy.num1, stateProxy.num2);

  const subDisplay = document.querySelector("#sub-display");
  subDisplay.textContent = result;
}
