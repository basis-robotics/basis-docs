---
sidebar_position: 2
---

# Launch files
Basis launch files are yaml files consisting of one or two documents (separated by `---`). If there are two documents, the first is args, the second is content. If there is just one document, it's just content.

## Args

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

#### type

The type to use for this argument. Any arguments passed to the launch file will be converted to these types, with range checking.

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

#### help

Default: `""`

A string describing this argument. Used when displaying error messages about the arguments a launch file requires. 

#### default

Mutually exclusive with `optional`

When no user supplied value is supplied, this will be used. Must be convertable to `type`. There is currently no syntax for defaulting to the value of another arg, but use of inja variables can avoid this.

#### optional

Mutually exclusive with `default`

Don't throw an error when this argument isn't supplied.

## Launch content

The data containing units to be launched and other information about the launch. This document is first preprocessed using `inja` - https://github.com/pantor/inja. Please see inja's documentation for usage - if you're familiar with `jinja2`, it's nearly the same. Jinja itself isn't used due to python dependency. `jinja2cpp` was also considered, but not used for now due to `boost` dependency.

Using inja enables lifting out functionality such as filtering and argument handling from the launch system to an already written preprocessor.

When preprocessing, all values for args will be supplied in an inja variable named `args`. Future updates will add other variables.

Some other notes:
 * inja currently requires double quotes `"` for strings, single quotes `'` are not allowed
 * inja doesn't use filter expressions like jinja - think `lower("MY_STRING")` instead of `"MY_STRING" | lower`.
 * Take care when using inja includes - they aren't well tested and are tricky to get correct with regular yaml syntax (consider using json style syntax in these cases)

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