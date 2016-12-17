package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	fmt.Println("foo")

	ioutil.ReadFile("foobar.txt")
}
