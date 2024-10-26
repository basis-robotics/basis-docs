---
sidebar_position: 3
---

# 3. Creating your first unit(s)

## Creating your first units - a simple publisher & subscriber

This tutorial will guide you through the steps to create a simple demo using a publisher and a subscriber. The publisher will send a text message every second, and the subscriber will print the message it receives. We'll use Basis’ code generator to create the skeleton code and boilerplate logic. While using the code generator is optional, it simplifies the implementation.

In Basis, publishers and subscribers are called units. A unit has a number of inputs and outputs. An input listens to a topic defined by a name, while an output publishes messages on a topic. Before delivering inputs to the unit logic, a synchronizer determines when they should be delivered. For instance, the synchronizer can ensure that two input messages are present and received within a given time window before being delivered. In this tutorial, we'll use a simple pass-through synchronizer. 

A process may contain one or more units. Here, the publisher and the subscriber will each operate in their own process, showing how different processes can communicate with each other using Basis’ built-in TCP transport layer. Basis also supports in-process communication, which is much more efficient but will be the subject of another tutorial.

We'll use Protocol Buffers for message serialization. Basis also supports ROS natively and allows for the addition of other serialization methods, including custom ones.

### Protocol Buffers
<!-- TODO: best practices around protobuf namespacing -->
The first file to add is a message schema to communicate between your units. Create a file named `proto/simple_pub_sub.proto` with the following contents:

```protobuf title="simple_pub_sub.proto
syntax = "proto3";

message StringMessage {
  string message = 1;
}
```
This defines the `StringMessage` message, which contains a single string property called `message`. Next, we need a CMake file to build this schema. We assume that you’re familiar with CMake. This file will be located at `proto/CMakeLists.txt`:

```cmake title="proto/CMakeLists.txt"
# This is a little verbose, but you can mostly copy this and do some simple renames
include(FindProtobuf)
find_package(Protobuf REQUIRED)

# Create a library, with one protobuf file (you can add more schema files here!)
add_library(simple_pub_sub_proto simple_pub_sub.proto)
# Link against basis's protobuf helpers
target_link_libraries(simple_pub_sub_proto basis::plugins::serialization::protobuf)

# Declare the output directory, for reuse
set(GENERATED_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
make_directory(${GENERATED_DIR})
target_include_directories(simple_pub_sub_proto SYSTEM PUBLIC "$<BUILD_INTERFACE:${GENERATED_DIR}>")

protobuf_generate(
 LANGUAGE cpp
 TARGET simple_pub_sub_proto
  PROTOC_OUT_DIR "${GENERATED_DIR}"
 )
```

**Also: ensure you add the protobuf subdirectory to your root CMakeLists.txt**
```cmake title="CMakeLists.txt"
add_subdirectory(proto)
```

The name of this project is `simple_pub_sub_proto`. The output will be transient and located in the build folder, meaning they will not be pushed to the git repository. The path is defined by the variable `GENERATED_DIR`. The line `target_link_libraries(...)` links Basis’ Protocol Buffers serialization plugin.

### Units

To declare the units, we will now create two YAML files. The first file describes the publisher, which has no external input and instead relies on a "rate subscriber" to produce its output at regular intervals. In this example, the synchronizer is set to 'all' input, making it a pass-through. The publisher's output will be sent on the `/chatter` topic, using the `StringMessage` type we defined earlier. The second file describes the subscriber.

The publisher unit description `simple_pub.unit.yaml`:
```yaml title="unit/simple_pub/simple_pub.unit.yaml"
# Simple, single threaded unit (one handler can execute at a time)
threading_model:
  single
# Includes needed for our messages
cpp_includes:
  - simple_pub_sub.pb.h
handlers:
  # Declare a single handler
  PublishAt1Hz:
    # It executes when all messages (of which there are none) are recv'd AND a timer ticking every 1 second has ticked
    sync:
      type: all
      rate: 1.0
    outputs:
      /chatter:
        type: protobuf:StringMessage
```

The subscriber has one input, listening to the `/chatter` topic, and no output. Synchronization is also set to 'all'.

The subscriber unit description `simple_sub.unit.yaml`:
```yaml title="unit/simple_pub/simple_sub.unit.yaml"
threading_model:
  single
cpp_includes:
  - simple_pub_sub.pb.h
handlers:
  # Declare a handler that executes when all messages have been recv'd
  OnChatter:
    sync:
      type: all
    inputs:
      # There's one message, on /chatter
      /chatter:
        # It uses protobuf as the serializer, and an unnamespaced "StringMessage" as the schema name
        type: protobuf:StringMessage
```

### First build
We are now ready to set up the boilerplate code using Basis’ code generator. We will create a CMake for the publisher and one for the subscriber:

```CMake unit/simple_pub/CMakeLists.txt
generate_unit(simple_pub)
target_link_libraries(unit_simple_pub simple_pub_sub_proto)
```

```CMake unit/simple_sub/CMakeLists.txt
generate_unit(simple_sub)
target_link_libraries(unit_simple_sub simple_pub_sub_proto)
```

The generated units will be named `unit_simple_pub` and `unit_simple_sub`.

We will also need to let CMake know about these new files, we can do so by adding them to the root CMakeLists.txt
```CMakeLists.txt
add_subdirectory(unit/simple_pub)
add_subdirectory(unit/simple_sub)
```

Before we build, this is what your project should look like:
```
my_awesome_robot/
├╴ build/
│  └╴...
├╴ docker/
│  └╴...
├╴ proto/
│  ├╴ CMakeLists.txt
│  └╴ simple_pub_sub.proto
├╴ unit/
│  ├╴ simple_pub/
│  │  ├╴ CMakeLists.txt
│  │  └╴ simple_pub.unit.yaml
│  └╴ simple_sub/
│     ├╴ CMakeLists.txt
│     └╴ simple_sub.unit.yaml
└╴ CMakeLists.txt
```
(with the addition of a `basis/` directory, depending on how you've pulled it in)

To build, we run `make -j` in the `build/` directory.

This will fail, which is intended. We’ll soon see why and how to fix it. The following errors will appear:
```log
[..]/src/simple_pub.cpp:13:19: error: static assertion failed: Implement me
   13 |     static_assert(false, "Implement me");
      |                   ^~~~~
[..]/src/simple_sub.cpp:13:19: error: static assertion failed: Implement me
   13 |     static_assert(false, "Implement me");
      |                   ^~~~~
1 error generated.
```

Since it’s the first build, the code generator added four files to our folder structure: a header and a source file for both the publisher and the subscriber. They will be inside the `include/` and `src/` directories for your two units. Additionally, some example files will have been generated - there's no need to edit them.

### Implementation
The build failed because the implementation of the publisher and the subscriber is missing. The generator created a placeholder with a static assert. For instance, the publisher code in `simple_pub/src/simple_pub.cpp` is:

```cpp
PublishAt1Hz::Output
simple_pub::PublishAt1Hz(const PublishAt1Hz::Input &input) {
    static_assert(false, "Implement me");
}
```

We can now implement our logic in the publisher and the subscriber.

The publisher `simple_pub/src/simple_pub.cpp`:

```cpp title="simple_pub/src/simple_pub.cpp"
#include <simple_pub.h>

using namespace unit::simple_pub;

PublishAt1Hz::Output
simple_pub::PublishAt1Hz(const PublishAt1Hz::Input &input) {
  spdlog::info("simple_pub::PublishAt1Hz");
  PublishAt1Hz::Output output;
  std::shared_ptr<StringMessage> msg{std::make_shared<StringMessage>()};
  msg->set_message(std::string("Hello, world!"));
  output.chatter = msg;
  return output;
}
```

The method returns a `PublishAt1Hz::Output` struct that was produced by the code generator. It holds all the output topics of this unit and other metadata:

```cpp title="autogenerated"
struct Output {
    // /chatter
    std::shared_ptr<const StringMessage> chatter;
};
```

The subscriber `simple_sub/src/simple_sub.cpp`:

```cpp title="simple_sub/src/simple_sub.cpp"
#include <simple_sub.h>

using namespace unit::simple_sub;

OnChatter::Output simple_sub::OnChatter(const OnChatter::Input &input) {
  spdlog::info("simple_sub::OnChatter: {}", input.chatter->message());
  return OnChatter::Output();
}
```

## Run individual processes

We can now build our code and run it. As before, we build with:

```bash
make -j
```

To run this tutorial code, we start three processes: the coordinator, the publisher, and the subscriber. The coordinator handles all the communications between units.

```log
$ /basis/build/cpp/core/coordinator/coordinator
[2024-07-04 21:24:01.609] [info] Adding schema protobuf:StringMessage
[2024-07-04 21:24:11.608] [error] Client connection disconnect after 0 bytes
[2024-07-04 21:24:44.607] [error] Client connection disconnect after 0 bytes
```

```log
$ ./simple_pub 
[2024-07-04 21:24:34.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:35.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:36.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:37.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:38.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:39.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:40.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:41.467] [info] simple_pub::PublishAt1Hz
[2024-07-04 21:24:42.467] [info] simple_pub::PublishAt1Hz
^C
```

```log
$ ./simple_sub
[2024-07-04 21:24:36.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:37.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:38.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:39.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:40.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:41.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:42.468] [info] simple_sub::OnChatter: Hello, world!
[2024-07-04 21:24:43.071] [error] Disconnecting from topic /chatter
^C
```

## Run with the Basis Launcher

Another way to run our code is to use the Basis launcher. The launcher requires a configuration file to specify how the units will be composed and which arguments they will take. Here we will look at how we can use the configuration file to run the publisher and subscriber either as two processes or as two threads within one process.

We recommend storing your launch files in a central directory, for better discoverability.

### Two processes

Two processes with one thread each (`launch_two_process.yaml`):

```yaml title="launch/launch_two_process.yaml"
recording:
  directory: /tmp/
  # list of glob expressions to record to disk
  topics:
    - /chatter
    - /log
groups:
  simple_pub:
    process: True
    units:
      simple_pub: {}
  simple_sub:
    process: True
    units:
      simple_sub: {}
```

Note: The `recording` section is optional. Its purpose is to specify the topic the recorder will use. The recorder saves messages in an MCAP log, which can later be used for replay.

Launching:
```bash
basis launch launch/launch_two_process.yaml
```

### Single process

Two units within one process (`launch_single_process.yaml`):
```yaml title="launch/launch_single_process.yaml"
recording:
  directory: /tmp/
  # list of glob expressions to record to disk
  topics:
    - /chatter
    - /log
groups:
  simple_pub_sub:
    units:
      simple_pub: {}
      simple_sub: {}
```

Launching:
```bash
basis launch launch/launch_single_process.yaml
```

# Using the Command Line Interface (CLI)

Once the code is running, it is useful to look at the message traffic: topics, publishers, schemas, and print messages on a topic. Basis includes a Command Line Interface (CLI) tool that can do all these things.

Let's first look at what topics exist while our publisher/subscriber units are running. Using Basis' CLI, we request the list of topics:

```
$ basis topic ls
topics:
  /log [protobuf:foxglove.Log] (1 publisher)
  /chatter [protobuf:StringMessage] (1 publisher)
```

We recognize the `/chatter` topic we created for this project. There's also `/log` for the log of all units.

To retrieve a summary of information about the `/chatter` topic, use the following command:
```
$ basis topic info /chatter
topic: /chatter
type: protobuf:StringMessage

id: ef1159476af615b620011ac42022f9f
  endpoints: 
    net_tcp: 40341
    inproc: 2541
```

We can also get the schema for the `protobuf:StringMessage` type used by `/chatter`:

```
$ basis schema print protobuf:StringMessage
protobuf:StringMessage
file {
  name: "simple_pub_sub.proto"
  message_type {
    name: "StringMessage"
    field {
      name: "message"
      number: 1
      label: LABEL_OPTIONAL
      type: TYPE_STRING
    }
  }
  syntax: "proto3"
}
```

Finally, we can print new messages published on a topic. For `/chatter`, let's show the next three messages in `JSON` format:
```
$ basis topic print /chatter -n 3 --json
{"message":"Hello, world!"}
{"message":"Hello, world!"}
{"message":"Hello, world!"}
```

Without the `-n 3` option, it would continuously print messages on the topic.

For the `/log` topic, let's use a plain text output:
```
$ basis topic print /log -n 3       
timestamp {
  seconds: 3279
  nanos: 612674074
}
level: INFO
message: "[2024-07-21 12:49:41.025] [/simple_pub] [info] [simple_pub.cpp:7] PublishAt1Hz\n"
name: "/simple_pub"
file: "/basis/demos/simple_pub_sub/src/simple_pub.cpp"
line: 7

timestamp {
  seconds: 3279
  nanos: 612759490
}
level: INFO
message: "[2024-07-21 12:49:41.025] [/simple_sub] [info] [simple_sub.cpp:6] OnChatter: Hello, world!\n"
name: "/simple_sub"
file: "/basis/demos/simple_pub_sub/src/simple_sub.cpp"
line: 6

timestamp {
  seconds: 3280
  nanos: 612365658
}
level: INFO
message: "[2024-07-21 12:49:42.025] [/simple_pub] [info] [simple_pub.cpp:7] PublishAt1Hz\n"
name: "/simple_pub"
file: "/basis/demos/simple_pub_sub/src/simple_pub.cpp"
line: 7

timestamp {
  seconds: 3280
  nanos: 612579699
}
level: INFO
message: "[2024-07-21 12:49:42.025] [/simple_sub] [info] [simple_sub.cpp:6] OnChatter: Hello, world!\n"
name: "/simple_sub"
file: "/basis/demos/simple_pub_sub/src/simple_sub.cpp"
line: 6

```
