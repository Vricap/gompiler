FROM golang:1.22.0-alpine

WORKDIR /usr/src/gompiler

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
# install uuidgen package to generate unique name
RUN apk add --no-cache util-linux 
RUN go build -v -o gompiler .
RUN ls

EXPOSE 8000

CMD ["./gompiler"]

