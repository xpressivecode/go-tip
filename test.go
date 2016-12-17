package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	fmt.Println("foo")

	err := ioutil.ReadFile("foobar.txt")

	fmt.Println(err)
}
