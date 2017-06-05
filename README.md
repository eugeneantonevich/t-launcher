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

Action allows to insert default values before launching a task.

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

Action allows to rename some values before and after start of a task. For the transform operation used library jsonpath-object- transform. Transform format is described here https://www.npmjs.com/package/jsonpath-object-transform.

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

Action rules can be statically-set (use section "rules").

For example:

```

  mapping: {
    rules: {
      some static rules
    }   
    
```

### Dynamic

To resolve rules in runtime you can set a resolver name (use section "resolver").

```

  mapping: {
    resolver: "resolver_name"
  }
  
```

Before start of a task, mapping rules will be resolved with a registered resolver.

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

## Library static instance

You can create and use new objects, as well as register and execute processes with the created instances. The library contains static instance of t-launcher. Use static instance via the property “static”.

### Example:

```

const launcher = require('t-launcher');

let staticInstance = launcher.static;
...

```

### Keep in mind
 Static instance is set not for the whole node program. It is shared only for a package.

## Tasks priority
For sequentially task execution you can use priority. First will be called tasks with priority 0, then 1 and so on. Default value of property is 0.


## Launcher description

Priorities may be used for sequential tasks execution. Tasks with priority “0” will be called first, after which tasks with priority “1” will follow, and so on. Default property value is “0”.

A launcher should have the following properties:
1. requiredFields (array, optional) – fields which are used in a launcher. If there are any missing fields in the input values, respective tasks will be skipped from processing.
    Important: call context consists of requiredFields only;
2. type (string, mandatory) - name of a launcher;
3. outputFields (array, optional) - enumeration of resulted fields within a launch (not in use yet).

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

