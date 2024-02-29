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
	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
}))

	router.LoadHTMLGlob("frontend/*")
	router.Static("/static", "./frontend")

	router.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{})
	})

	router.POST("/run", func(c *gin.Context) {
		// generate the uuid name 
		uuid, err := (exec.Command("uuidgen").Output()) 
    if err != nil { 
			fmt.Println(err)
			c.String(500, "Theres some error running your code.")
			return 
    }

		// specify the unique file name
		fileName := fmt.Sprintf("input/%s.go", uuid)

		// write to file 
		err = writeToFile(string(fileName), c)
		if err != nil {
			return
		}

		// run the go file
		cmd := exec.Command("go", "run", fileName)
		output, _ := cmd.CombinedOutput()

		// fmt.Println(string(output))
		c.String(200, string(output))

		// delete the file once its done
		os.Remove(fileName)
	})

	router.POST("/format", func(c *gin.Context) {
		// generate the uuid name 
		uuid, err := (exec.Command("uuidgen").Output()) 
		if err != nil { 
			fmt.Println(err)
			c.String(500, "Theres some error running your code.")
			return 
		}

		// specify the unique file name
		fileName := fmt.Sprintf("input/%s.go", uuid)

		// write to file 
		err = writeToFile(fileName, c)
		if err != nil {
			return
		}

		// format the go file
		cmd := exec.Command("gofmt", "-w", fileName)
		_, err = cmd.CombinedOutput()
		if err != nil {
			fmt.Println(err)
			c.String(500, "Theres some error running your code.")
			return
		}

		// read the go file to send the formatted code to client
		output,err := os.ReadFile(fileName)
		if err != nil {
			fmt.Println(err)
			c.String(500, "Theres some error running your code.")
			return
		}
		c.String(200, string(output))

		// delete the file once its done
		os.Remove(fileName)
	})
	router.Run("0.0.0.0:8000")
}

func writeToFile(fileName string, c *gin.Context) error {
	// TODO: Use plain TEXT instead of json
	var code CodeStrc
	err := c.BindJSON(&code) // using text would incrementally easier
	if err != nil {
		fmt.Println(err)
		c.String(500, "Theres some error running your code.")
	}

	// fmt.Println(code.Code)

	// create a file with said name
	file, err := os.Create(fileName)
	if err != nil {
		fmt.Println(err)
		c.String(500, "Theres some error running your code.")
		return err
	}
	defer file.Close()

	// write the conten to the file
	_, err = file.WriteString(code.Code)
	if err != nil {
		fmt.Println(err)
		c.String(500, "Theres some error running your code.")
		return err
	}
	return nil
}
