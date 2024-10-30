---
sidebar_position: 2
---

# Launch Files

Basis launch files are YAML files used to define the launch configuration for a project. Each launch file can contain one or two documents, separated by `---`. If there are two documents, the first is for defining launch arguments (`args`), and the second is the main content of the launch (`content`). If there is only one document, it represents the launch content.

### Structure of a Launch File

A typical Basis launch file is organized as follows:

```yaml
# Launch arguments declaration
args:
  ARG_A:
    type: <TYPE>                 # Data type of the argument (e.g., string, int)
    default: <DEFAULT>           # Default value for the argument (optional)
    optional: <True/False>       # Whether the argument is optional
    help: "<HELP_STRING>"        # Optional description

  ARG_B:
    ...

---

# Message logger configuration
recording:
  directory: <FOLDER>            # Directory where log files are stored
  name: <FILE_NAME_PREFIX>       # Prefix for log file names
  topics:
    - /TOPIC_1                   # List of topics to record

# Launch configuration
# Defines the groups and units to be launched
groups:
  GROUP_1:
    process: <True/False>        # Whether the group runs in a separate process
    units:
      UNIT_A:
        args:
          UNIT_A_ARG_1: <VALUE>  # Arguments for UNIT_A
          ...
      UNIT_B: {}                 # UNIT_B without specific arguments
      ...

  GROUP_2:
    ...
```

### Explanation

- **Arguments (`args`)**: Defines any arguments that can be passed to customize the launch. These arguments include their data type, default values, help message and whether they are optional.
- **Recording Configuration (`recording`)**: Sets up message logging, specifying where to save recorded data and which topics to record.
- **Groups and Units (`groups`)**: Describes the units (e.g., nodes or components) to be launched, organized in groups. Each group can be launched in its own process, and each unit within the group can have specific arguments.

### Notes

- Placeholder names like `ARG_A`, `GROUP_1`, `UNIT_A`, etc., should be replaced with project-specific names.
- Values indicated with `<...>` should be customized according to your project's requirements.

This structure allows you to define the parameters, components, and behaviors of your application in a flexible and readable manner.

### Document Structure

A Basis launch file consists of the following sections:

- **Arguments (`args`)**: Defines the configurable parameters for the launch.
- **Launch Content**: Contains the main configuration, including message logging (`recording`) and group/unit definitions (`groups`).


## Arguments

The `args` section of the configuration YAML file has the following structure:

```yaml
args: 
  ARG_A:
    type: <TYPE>                 # Data type of the argument (e.g., string, int)
    default: <DEFAULT>           # Default value for the argument (optional)
    optional: <True/False>       # Whether the argument is optional
    help: "<HELP_STRING>"        # Optional description

  ARG_B:
    ...
```

Here is an example:
```yaml
args: 
  camera_topic_namespace:
    type: string
    help: the prefix to use for this pipeline's topics
    default: /camera
  enable_perception:
    type: bool
    help: run object detection on this camera
    default: True 
  additional_log_pattern:
    type: string
    help: an optional, additional log pattern to pass to the recorder
    optional: True
```

The args document must always contain a map named `args`. Currently, no other keys are valid. This is a mapping from argument name to argument definition.

**⚠️ Do not use inja templating in the args document - it will not be processed.**

### Argument Definition

A single argument used for this launch file, with type safety. May be optional or supply a default.

| Argument Field | Description                                                                                         | Required | Default Value |
| -------------- | --------------------------------------------------------------------------------------------------- | -------- | ------------- |
| `type`         | The data type of the argument (e.g., string, float).                                                | Yes      | N/A           |
| `default`      | The default value for the argument. Mutually exclusive with `optional`.                             | No       | N/A           |
| `optional`     | Indicates if the argument is optional. Mutually exclusive with `default`.                           | No       | N/A           |
| `help`         | A string describing the argument, used when displaying error messages about the required arguments. | No       | `""`          |

:::note

Any arguments passed to the launch file will be converted to these types, with range checking.

* `bool` - `0`/`1`/`true`/`false`, case insensitive
* `string` - any string (converted to `std::string`)

Floating point types, can use scientific notation:
* `float` - any floating point number
* `double` - any floating point number, double precision

Any cpp integer type, with range checking:
* `uint8_t`
* `int8_t`
* `uint16_t`
* `int16_t`
* `uint32_t`
* `int32_t`
* `uint64_t`
* `int64_t`
:::

## Launch content

The launch content document contains information about the units to be launched, as well as other relevant launch information. Before being executed, this document is preprocessed using `inja` (see https://github.com/pantor/inja). Refer to Inja's documentation for usage guidelines. If you are familiar with `jinja2`, you will find Inja very similar. Jinja is not used here due to its Python dependency, and `jinja2cpp` was also considered but not selected due to its dependency on `boost`.

Using inja enables lifting out functionality such as filtering and argument handling from the launch system to an already written preprocessor.

When preprocessing, all values for args will be supplied in an inja variable named `args`. Future updates will add other variables.

:::note
Some other notes:
 * inja currently requires double quotes `"` for strings, single quotes `'` are not allowed
 * inja doesn't use filter expressions like jinja - think `lower("MY_STRING")` instead of `"MY_STRING" | lower`.
 * Take care when using inja includes - they aren't well tested and are tricky to get correct with regular YAML syntax (consider using json style syntax in these cases)
:::

### Recording settings

```yaml
recording:
  directory: /tmp/
  name: camera_pipeline
  topics:
    - /log
    - */image/*
```

Settings used for recording. Currently only used for the top level launch file in a launch. **Included recording settings are ignored** Recording settings are applied to every process in the launch.

**⚠️ Recording syntax is WIP - future updates will enable features such as the ability to record to multiple files, more customizable names, and per process recording settings**

#### directory
The directory to write the records to. 

### name
The prefix of the record file. Generally, records will be named as `${name}_${process_name}_${timestamp}.mcap`

#### topics

A list of topic **globs** to be used as a filter when recording.

### Group Definition

```yaml
# The root of the document is also a group named "/"!
groups:
  parent:
    groups:
      child: # /parent/child
        process: True
        units:
          foxglove: {} # named as /parent/child/foxglove
    include:
      - awesome.launch.yaml: # all units/processes with /parent
          my_string_arg: foobar
          my_int_arg: 33
```

A group is a collection of units. Groups may recursively define other groups. **The root of the document is a group named `/` with some special properties.**

#### groups

Defines child groups for this group. Will concatenate the names together with `/` as a separator.

#### include

Includes a child launch file. Arguments are passed as a simple map, with type checking. Recursive includes are allowed up to a depth of 32. Groups and units will be prefixed with the current group name.

**⚠️ Clever use of includes can result in units or processes with the same name as others from different files. This is not allowed and will cause a launch error.**

Both:
```yaml
    include:
      - camera.launch.yaml: 
          camera: front 
      - camera.launch.yaml: 
          camera: back
```
and
```yaml
    include:
      camera.launch.yaml:
        camera: front 
      lidar.launch.yaml: 
        lidar: front 
```
are valid: the second is more natural, but the first is **required** to include the same file twice.

#### process

Default: `false`

When set to `true`, will split this group into a separate process when launching. Not valid for the root group in a document (it's implicitly `true` for the main launch file, and implicitly `false` for any included launch files).

**⚠️Process syntax is experimental and subject to change.**

#### units

Units to launch in this group. See Unit Definition.

### Unit Definition
```yaml
  units:
    foxglove:
      args:
        port: 3344
    camera_driver_{{args.device}}:
      type: v4l2_camera_driver
      args:
        device: {{args.device}} # Templated into the launch file args
        topic_namespace: {{args.camera_topic_namespace}}
```

A unit to run with this launch. The key the unit has in the `units` field is the name, and by default also the type.

#### type

default: (the name of the unit)

The type of unit to be launched. If not specified, will be the name of the unit.

#### args:

The arguments to be passed to the unit. Has the exact same semantics as launch file args, with type checking - the only difference is that they are in the content section of the launch file, and thus can be filled with templated values (including launch argument values). See [Argument Definition](#Argument Definition)