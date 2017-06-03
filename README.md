# t-launcher

## Description:

T-Launcher allows to call some predefined functions (launcher) in a determinate order, pass outcome data to other functions and then deliver consolidated execution result. The approach is similar to pipe-line. There are three processing stages to call a predefined function: preprocess (optional), process (mandatory), postprocess (optional). At preprocess and postprocess stages you can to transform input and output data by using actions, such as mapping values or setting default ones.

## Usage example

### Server code

```
class ExampleLauncher() {
  // launcher execution object should contain type property
  static get type() {
    return 'example_launcher';
  }
  
  // each launcher should contain process function
  // return value - object or Promise
  static process(input, parameters) {
    ...
    some opeartion with input values
    ...
  }
}

const launcher = require('t-launcher');

let instance = launcher();
let instance.containers.launchers.register(ExampleLaucnher);

```

### Client code

```

const launchConfiguration = [
  {
    name: example_launcher,
    preprocess: {
      defaults: {
        rules: {
          defValueName: defaultData
        }
      }
    },
    postprocess: {
      mapping: {
        rules: {
          targetFieldNameToOutput: "$.sourceFieldNameFromLaunchResult"
        }
      }
    },
    priority: 1
  }
];

let processingValues = {
  test: valueTest
}

instance.execute(launchConfiguration, processingValues)
  .then(result => {
    ...
    processing result
    ...
  }
  
```

## Preprocess and postprocess actions

### Defaults

Description:

Action allow insert default values before luanch task

Format:

```
preprocess: {
  defaults: {
    rules: {
      fieldName: fieldValue
    }    
  }
}

```

### Mapping

Description:

Action allow rename some value before and after task launch. For transform operation use library jsonpath-object-transform. Transform format is described here https://www.npmjs.com/package/jsonpath-object-transform;

Example:

```
preprocess: {
  mapping: {
    rules: {
      targetFieldNameForLaunch: "$.sourceFieldNameFromInputValues"
    }    
  }
}

```

## Static and dynamic action data

### Static

You can set static action data. (use section "rules")

For example:

```
  mapping: {
    rules: {
      some static rules
    }    
```

### Dynamic

To reolve rules in runtime you can set resolver name. (use section "resolver")

```
  mapping: {
    resolver: "resolver_name"
  }
```

Before launch task mapping rules will be resolved with registered resolver.

Example:

### Server code

```
class ExampleResolver() {
  // resolver object should contain type property
  static get type() {
    return 'example_resolver';
  }
  
  // each resolver should contain resolve function
  // return value - object or Promise
  static resolve(data, parameters) {
    ...
    resolve rules (for example get from data base or some else)
    ...
    return rules;
  }
}

// t-launcher instance get from first example
instance.containers.resolvers.register(ExampleResolver);

```

### Client code

```

const launchConfiguration = [
  {
    name: example_launcher,
    preprocess: {
      mapping: {
        resolver: "example_resolver"
      }
    }
  }
];

let processingValues = {
  test: valueTest
}

instance.execute(launchConfiguration, processingValues)
  .then(result => {
    ...
    processing result
    ...
  }
```

## Static instance of library

You can instance the new object and use it. Register and execute some process on created instace. 
Library contain static instance of t-launcher also. Use this static instance througth property static

### Example:

```
const launcher = require('t-launcher');

let staticInstance = launcher.static;
...
```

### Take in mind
 Static istance is shared not for whole node programm. Only per package.


## Task priority
For sequentially task execution you can use priority. First will be called tasks with priority 0, then 1 and so on. Default value of property is 0.


## Launcher description

Launcher should have next property
1. requiredFields (array, optional) - fields, that launcher use. If some field are not present in input values, processing will be skipped. 
  !!! Call context consist of requiredFields only.
2. type (string, mandatory) - name of launcher
3. outputFields (array, optional) - enumeration of launch result fields.(not use yet)

Launcher should contain process function. Function return object or Promise object.

Example


```
class ExampleLauncher() {
  static get type() {
    return 'example_launcher';
  }
  
  static process(input, parameters) {
    ...
  }
  
  static get requiredFields() {
    return [
        {
          name: 'fieldToLaunch'
        }
      ];
  }
}
```

