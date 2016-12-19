package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
)

func main() {
	fmt.Println("foo")

	_, err := fmt.Printf("%v", ioutil.ReadFile("foobar.txt"))

	fmt.Println(err)

	af := http.StatusOK

	fmt.Printf(af)

	strconv.AppendBool(dst, b)

	f := &foo{}

	f.DoSomething()

	ff := newFoo()

	log.Print(ff)
}

type foo struct {
	Name    string `json:"name"`
	IsValid bool   `json:"valid"`
	Age     int
}

func newFoo() *foo {
	return &foo{}
}

func (f *foo) DoSomething2() {

}

func (f *foo) DoSomething() string {
	return ""
}
