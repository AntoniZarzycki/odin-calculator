let state = {
  num1: "",
  num2: "",
  operator: "",
};

let result = undefined;
let allowPoint = true;

const stateProxy = new Proxy(state, {
  set(target, prop, value) {
    target[prop] = value;
    if (
      !(stateProxy.num1 === "") &&
      !(stateProxy.num2 === "") &&
      !(stateProxy.operator === "")
    ) {
      calculateResult();
    }

    const display = document.querySelector("#display");
    if (
      (!(stateProxy.num1 === "") && stateProxy.num1.length > 12) ||
      (!(stateProxy.num2 === "") && stateProxy.num2.length > 12)
    ) {
      display.classList.add("text-small");
    } else {
      display.classList.remove("text-small");
    }

    const pointButton = document.querySelector("#point");
    if (stateProxy.operator && stateProxy.num2.includes(".")) {
      pointButton.classList.add("disabled");
      allowPoint = false;
    } else if (!stateProxy.operator && stateProxy.num1.includes(".")) {
      pointButton.classList.add("disabled");
      allowPoint = false;
    } else {
      pointButton.classList.remove("disabled");
      allowPoint = true;
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
  num1 = breakBrackets(num1);
  num2 = breakBrackets(num2);

  switch (operator) {
    case "+":
      return add(Number(num1), Number(num2));
    case "-":
      return subtract(Number(num1), Number(num2));
    case "*":
      return multiply(Number(num1), Number(num2));
    case "/":
      return divide(Number(num1), Number(num2));
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
    if (id === "subtract") {
      if (!stateProxy.num1) return numberPressed("-");
      if (!stateProxy.operator && stateProxy.num1 === "(")
        return numberPressed("-");
      if (stateProxy.operator && stateProxy.num2 === "(")
        return numberPressed("-");
      return operatorPressed(id);
    } else operatorPressed(id);
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
    if (result || result === 0) {
      clearAll();
    }

    if (!(stateProxy.num1 === "") && stateProxy.num1.length >= 18) return;

    num1Display.textContent += String(number);
    stateProxy.num1 = num1Display.textContent;
  } else {
    if (!(stateProxy.num2 === "") && stateProxy.num2.length >= 18) return;

    num2Display.textContent += String(number);
    stateProxy.num2 = num2Display.textContent;
  }
}

function operatorPressed(id) {
  const operatorDisplay = document.querySelector("#operator");
  const num1Display = document.querySelector("#num1");
  if (operatorDisplay.textContent) return;
  if (!num1Display.textContent) return;

  num1Display.classList.remove("text-green");

  if (stateProxy.num1.includes("(") && !stateProxy.num1.includes(")"))
    numberPressed(")");

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
    default:
      operatorDisplay.textContent = id;
      stateProxy.operator = id;
      break;
  }
}

function clearAll() {
  const operatorDisplay = document.querySelector("#operator");
  operatorDisplay.textContent = "";
  stateProxy.operator = "";

  const num1Display = document.querySelector("#num1");
  num1Display.textContent = "";
  stateProxy.num1 = "";
  num1Display.classList.remove("text-green");

  const num2Display = document.querySelector("#num2");
  num2Display.textContent = "";
  stateProxy.num2 = "";

  const subDisplay = document.querySelector("#sub-display");
  subDisplay.textContent = "";
  result = undefined;
}

function clear() {
  if (stateProxy.num2 || stateProxy.num2 === "0") {
    const num2Display = document.querySelector("#num2");
    num2Display.textContent = "";
    stateProxy.num2 = "";
  } else if (stateProxy.operator) {
    const operatorDisplay = document.querySelector("#operator");
    operatorDisplay.textContent = "";
    stateProxy.operator = "";
  } else if (stateProxy.num1 || stateProxy.num1 === "0") {
    const num1Display = document.querySelector("#num1");
    num1Display.textContent = "";
    stateProxy.num1 = "";
    num1Display.classList.remove("text-green");
  }

  const subDisplay = document.querySelector("#sub-display");
  subDisplay.textContent = "";
  result = undefined;
}

function backspacePressed() {
  result = undefined;

  if (stateProxy.operator && stateProxy.num2) {
    const arr = Array.from(stateProxy.num2);
    arr.pop();

    const num2Display = document.querySelector("#num2");
    num2Display.textContent = arr.join("");

    stateProxy.num2 = num2Display.textContent;
  } else if (stateProxy.operator) {
    const operatorDisplay = document.querySelector("#operator");
    operatorDisplay.textContent = "";
    stateProxy.operator = "";
  } else if (stateProxy.num1) {
    const arr = Array.from(stateProxy.num1);
    arr.pop();

    const num1Display = document.querySelector("#num1");
    num1Display.textContent = arr.join("");

    stateProxy.num1 = num1Display.textContent;
  }

  if (
    !(stateProxy.num1 === "") &&
    !(stateProxy.num2 === "") &&
    !(stateProxy.operator === "")
  ) {
    calculateResult();
  } else {
    const subDisplay = document.querySelector("#sub-display");
    subDisplay.textContent = "";
  }
}

function bracketsPressed() {
  if (stateProxy.operator) {
    // for num2
    if (!stateProxy.num2) return numberPressed("(");
    if (stateProxy.num2.includes(")")) return;
    if (stateProxy.num2.includes("(")) return numberPressed(")");
    return;
  } else {
    //for num1
    if (!stateProxy.num1) return numberPressed("(");
    if (stateProxy.num1.includes(")")) return;
    if (stateProxy.num1.includes("(")) return numberPressed(")");
    return;
  }
}

function pointPressed() {
  if (allowPoint) numberPressed(".");
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
  stateProxy.num2 = "";

  const num1Display = document.querySelector("#num1");
  num1Display.textContent = String(result);
  stateProxy.num1 = String(result);

  num1Display.classList.add("text-green");
}

function calculateResult() {
  let num1 = stateProxy.num1;
  let num2 = stateProxy.num2;

  if (stateProxy.num2.includes("(") && !stateProxy.num2.includes(")"))
    num2 += ")";

  if (num2 === "()") return;

  result = operate(stateProxy.operator, num1, num2);

  result = parseFloat(result.toFixed(8));

  if (result.toString().length > 18) result = result.toExponential();

  const subDisplay = document.querySelector("#sub-display");
  subDisplay.textContent = result;
}

function breakBrackets(num) {
  if (!num.includes("(")) {
    return num;
  } else {
    return num.substring(1, num.length - 1);
  }
}

document.addEventListener("keydown", (e) => {
  e.preventDefault(); // Prevents inputting the button that was last clicked with a mouse if Enter is clicked

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const operators = ["+", "-", "*", "/"];

  if (numbers.includes(e.key)) {
    numberPressed(e.key);
  } else if (operators.includes(e.key)) {
    if (e.key === "-") {
      if (!stateProxy.num1) return numberPressed("-");
      if (!stateProxy.operator && stateProxy.num1 === "(")
        return numberPressed("-");
      if (stateProxy.operator && stateProxy.num2 === "(")
        return numberPressed("-");
      return operatorPressed(e.key);
    } else operatorPressed(e.key);
  } else {
    switch (e.key) {
      case "Backspace":
        backspacePressed();
        break;
      case "Enter":
        equalPressed();
        break;
      case ".":
        pointPressed();
        break;
      case ",":
        pointPressed();
        break;
      case "(":
        bracketsPressed();
        break;
      case ")":
        bracketsPressed();
        break;
      case "Escape":
        clearAll();
        break;
      case "Delete":
        clear();
        break;
    }
  }
});
