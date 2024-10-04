---
sidebar_position: 2
---

# Code Generator

Code generation in Basis occurs when the project is built, and it is initiated through the `generate_unit` function in the CMake project file. This function triggers the code generator to create necessary boilerplate code based on the Unit's YAML definition. The YAML file must be named after the Unit, with a suffix `_unit.yaml`. For example, for a Unit named `simple_pub`, the corresponding YAML file would be `simple_pub.unit.yaml`.

In the Simple Pub/Sub demo, the CMake file includes the publisher (`simple_pub`) and subscriber (`simple_sub`) Units. Although the demo includes both Units in the same CMake file, it is more common to have a separate CMake file for each Unit in larger projects.

Here is the complete CMake file for the Simple Pub/Sub project:

```CMake
cmake_minimum_required(VERSION 3.28)

project(SimplePubSub)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_subdirectory(/basis/ /basis/build)
add_subdirectory(proto)

generate_unit(simple_pub)
generate_unit(simple_sub)

target_link_libraries(unit_simple_pub simple_pub_sub_proto)
target_link_libraries(unit_simple_sub simple_pub_sub_proto)
```

In this CMake file:

- **`generate_unit(simple_pub)`**: Triggers the code generation for the publisher Unit (`simple_pub`) based on its YAML definition file (`simple_pub.unit.yaml`).
- **`generate_unit(simple_sub)`**: Triggers code generation for the subscriber Unit (`simple_sub`) in a similar fashion.
- **`target_link_libraries`**: Links the generated Units with the necessary protocol buffer message library (`simple_pub_sub_proto`) from the sub-folder project `proto`

This setup enables the automatic creation of publisher and subscriber code for each Unit based on its YAML definition.


