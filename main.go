package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CodeStrc struct {
	Code string `json:"code"`
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	router.LoadHTMLGlob("frontend/*")
	router.Static("/static", "./frontend")

	router.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{})
	})

	router.POST("/run", func(c *gin.Context) {
		var code CodeStrc
		err := c.BindJSON(&code) // using text would incrementally easier
		if err != nil {
			fmt.Println("ERROR here: ", err)
			return
		}

		fmt.Println(code.Code)

		// specify the file name
		fileName := "input/main.go"

		// create a file with said name
		file, err := os.Create(fileName)
		if err != nil {
			c.JSON(500, gin.H{
				"status":  "error",
				"message": err,
			})
			return
		}
		defer file.Close()

		// write the conten to the file
		_, err = file.WriteString(code.Code)
		if err != nil {
			c.JSON(500, gin.H{
				"status":  "error",
				"message": err,
			})
			return
		}

		// run the go file
		cmd := exec.Command("go", "run", fileName)
		output, _ := cmd.CombinedOutput()
		// if err != nil {
		// 	fmt.Println("ERROR here too: ", err)
		// 	c.JSON(500, gin.H{
		// 		"status": "error",
		// 		"message": err,
		// 	})
		// 	return
		// }

		fmt.Println(string(output))
		c.String(200, string(output))
	})

	router.POST("/format", func(c *gin.Context) {
		var code CodeStrc
		err := c.BindJSON(&code) // using text would incrementally easier
		if err != nil {
			fmt.Println("ERROR here: ", err)
			return
		}

		// specify the file name
		fileName := "input/main.go"

		// create a file with said name
		file, err := os.Create(fileName)
		if err != nil {
			fmt.Println("ERROR here too: ", err)
			c.JSON(500, gin.H{
				"status":  "error",
				"message": err,
			})
			return
		}
		defer file.Close()

		// write the conten to the file
		_, err = file.WriteString(code.Code)
		if err != nil {
			fmt.Println("ERROR here too: ", err)
			c.JSON(500, gin.H{
				"status":  "error",
				"message": err,
			})
			return
		}

		// run the go file
		cmd := exec.Command("gofmt", "-w", fileName)
		_, err = cmd.CombinedOutput()
		if err != nil {
			fmt.Println("ERROR here too: ", err)
			c.String(500, err.Error())
			return
		}

		// fmt.Println(string(output))
		output,err := os.ReadFile(fileName)
		if err != nil {
			fmt.Println("ERROR here too: ", err)
			c.String(500, err.Error())
			return 
		}
		c.String(200, string(output))
	})
	router.Run()
}
