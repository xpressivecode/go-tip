# go-tip
This package adds the ability to inspect variables, functions, types etc., by hovering over them.
* Github: https://github.com/foobar/go-tip
* Atom: https://atom.io/packages/go-tip

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)

## Overview
This package can return information on the following:
* Functions
* Types (including structs with tags)
* Variables
* Packages
* Constants (shows value too)
* Literals

## Dependencies
This package relies on <a href="https://atom.io/packages/go-config" target="_blank">go-config</a> to locate your go sdk and tools.

This package relies on guru to retrieve information about the code you wish to inspect.

```go get -u golang.org/x/tools/cmd/guru```

## Having Issues?
As guru works by analyzing files, you must be sure to have saved your changes if you are trying to inspect some new code.

## Contributing
Any contributions would be appreciated. Please fork the repo and submit a pull request.
