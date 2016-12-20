# go-tip
This package adds the ability to inspect variables, functions, types etc., by hovering over them.
* Github: https://github.com/foobar/go-tip
* Atom: https://atom.io/packages/go-tip

![go-tip-demo](https://cloud.githubusercontent.com/assets/957896/21336934/ee03e48a-c636-11e6-9652-6a63dd34db11.gif)

## Overview
This package can return information on the following:
* Functions
* Types (including structs with tags)
* Variables
* Packages
* Constants (includes value)
* Literals

## Dependencies
This package relies on <a href="https://atom.io/packages/go-config" target="_blank">go-config</a> to locate your go sdk and tools.

This package relies on guru to retrieve information about the code you wish to inspect.

```go get -u golang.org/x/tools/cmd/guru```

## Having Issues?
As guru works by analyzing files, you must be sure to have saved your changes if your code has been modified.

## Contributing
Any contributions would be appreciated. Please fork the repo and submit a pull request.
