# t-launcher

## Description:

t-launcher allows to call some predefined functions (launcher) in a determinate order, pass outcome data to other functions and then deliver consolidated execution result. The approach is similar to pipe-line. There are three processing stages to call a predefined function: preprocess (optional), process (mandatory), postprocess (optional). At preprocess and postprocess stages you can to transform input and output data by using actions, such as mapping values or setting default ones.

## Example

### Server code

```

class ExampleLauncher() {
  process(input) {
    ...
  }
}

const launcher = require('t-launcher');

let instance = launcher();
let instance.containers.launchers.register(ExampleLaucnher);

```

### Client code

```
```
