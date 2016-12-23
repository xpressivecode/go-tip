package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("foo")

	af := http.StatusOK

	fmt.Printf("%v", af)

	f := &foo{}

	f.DoSomething()

	ff := newFoo()

	log.Print(ff)
}

type foo struct {
	Name    string `json:"name" valid:"true"`
	IsValid []bool `json:"valid"`
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
