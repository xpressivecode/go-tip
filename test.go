package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
)

func main() {
	fmt.Println("foo")

	err := ioutil.ReadFile("foobar.txt")

	fmt.Println(err)

	strconv.AppendBool(dst, b)

	f := &foo{}
	f.DoSomething()
}

type foo struct {
}

func (f *foo) DoSomething() string {
	return ""
}
