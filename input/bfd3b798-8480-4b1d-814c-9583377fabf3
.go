package main

import "fmt"

func main() {
	var n, a, b int = 10000000000000, 0, 1
	fmt.Println("Fibonacci Series up to", n, "terms:")
	for i := 0; i < n; i++ {
		fmt.Print(a, " ")
		next := a + b
		a = b
		b = next
	}
	fmt.Println()
}
