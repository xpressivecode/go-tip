package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

func main() {
	fmt.Println("foo")

	err := fmt.Printf("%v", ioutil.ReadFile("foobar.txt"))

	fmt.Println(err)

	af := http.StatusOK

	fmt.Printf(af)

	strconv.AppendBool(dst, b)

	f := &foo{}
	f.DoSomething()
}

type foo struct {
}

func (f *foo) DoSomething() string {
	return ""
}
