const readline = require("readline");

const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

const ask = (questionText) =>
  new Promise((resolve, reject) =>
    readlineInterface.question(questionText, resolve)
  );

module.exports = ask;
