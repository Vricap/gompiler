# GOMPILER

Gompiler is an live or online compiler for Go programming language. It is of course primarily written in Golang for its backend.

## How It Works

Just for note, i'm pretty sure those online compiler out there had better mechanism, and how it work in general, more safe, secure, clean and less verbose. However, this is how mines work.

When you write your code in the text area element and click `RUN`, it send your code as JSON (i have no idea why i didn't just use text). On the server, the server is then create an Go file with unique name--it had to be unique since if it not, users when running code at the same time might override their code one another. After creating that unique Go file, server then write the content (your code) to the file. Server then execute command `go run fileName.go`, which the output of that command is then send back to client, which is then rendered in the output text area.

Now for when you `FORMAT`, it essentially the same, your code get send to the server, server create unique Go file and write the code to that file. However, it is here where the similiarity ends. The command that the server run is `gofmt -w fileName.go`, `gofmt` is a tool part of Go tools chain, it used to format Go program. Now, that the Go file is nicely formatted, the server is then read the content and send it back to client as text.

Also, it is run on Docker container. The image that is used is the official golang image, with alpine variant. Making it Go and its tools chain already installed. Check the 'Dockerfile' on the project Github repo for more info.  
To try, pull the image from docker hub.
```
$ docker run -p 3000:8000 vricap/gompiler
```
