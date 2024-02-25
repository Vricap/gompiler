const code = document.getElementById("code");
const runBtn = document.querySelector(".run-btn");
const outputBlock = document.querySelector(".output-block");

let url = "http://0.0.0.0:8080";

const runCode = () => {
  let codeToRun = code.value;
  outputBlock.textContent = "Running your code...";

  fetch(url + "/run", {
    method: "POST",
    // TODO: Use plain TEXT instead of json
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
      outputBlock.textContent = data;
    })
    .catch((error) => {
      outputBlock.textContent = error;
    });
};

const formatCode = () => {
  let codeToRun = code.value;

  fetch(url + "/format", {
    method: "POST",
    // TODO: Use plain TEXT instead of json
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: codeToRun,
    }),
  })
    .then((response) => {
      if (!response) {
        console.log(response);
        throw new Error("Error when attempting to format your code.");
      }
      return response.text();
    })
    .then((data) => {
      code.value = data;
    })
    .catch((err) => {
      outputBlock.textContent = err;
    });
};
