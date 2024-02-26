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
      if (!response.ok) {
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
      if (!response.ok) {
        // console.log(response);
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

// change the behavior of pressing tab in textarea
code.addEventListener("keydown", function (e) {
  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault(); // Stop the default tab action (focus change)
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // Set textarea value to: text before caret + tab + text after caret
    this.value =
      this.value.substring(0, start) + "\t" + this.value.substring(end);

    // Put caret at right position again (after the tab character)
    this.selectionStart = this.selectionEnd = start + 1;
  }
});
