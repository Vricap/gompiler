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

const heloWorld = `
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;

const fibonacci = `
package main

import "fmt"

func main() {
    var n, a, b int = 10, 0, 1
    fmt.Println("Fibonacci Series up to", n, "terms:")
    for i := 0; i < n; i++ {
        fmt.Print(a, " ")
        next := a + b
        a = b
        b = next
    }
    fmt.Println()
}`;

const bubbleSort = `
package main

import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func main() {
    arr := []int{64, 34, 25, 12, 22, 11, 90}
    fmt.Println("Original array:", arr)
    bubbleSort(arr)
    fmt.Println("Sorted array:  ", arr)
}`;

const example = {
  "helo world": heloWorld,
  fibonacci: fibonacci,
  "bubble sort": bubbleSort,
};

document.getElementById("example").addEventListener("change", function () {
  let selectedExample = this.value;
  code.value = example[selectedExample];
});
