const code = document.getElementById("code");
const runBtn = document.querySelector(".run-btn");
const outputBlock = document.querySelector(".output-block");

let url = "http://0.0.0.0:8080";

const runCode = () => {
  let codeToRun = code.value;
  let codeOutput = outputBlock.textContent;

  fetch(url + "/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // using text would be easier
      code: codeToRun,
    }),
  })
    .then((response) => {
      if (!response) {
        throw new Error("Theres was some error running your code.");
      }
      return response.text();
    })
    .then((data) => {
      codeOutput = data;
    })
    .catch((error) => {
      codeOutput = error;
    });
};
