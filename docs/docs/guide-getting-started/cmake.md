---
sidebar_position: 2
---

# 2. Setting up your CMake environment and building

## Creating a CMakeLists.txt

At the root of your project, create a `CMakeList.txt`. Here's one to get you started:
```cmake title="CMakeLists.txt"
# Specify a minimum version of CMake
# (this may be lower if you're using a different image than the basis development image)
cmake_minimum_required(VERSION 3.28)

# Declare a project, using C++
project(MyAwesomeRobot LANGUAGES CXX)

# Set some required or useful settings for C++
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_EXPORT_COMPILE_COMMANDS True)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

```

Now you have a few options, depending on how you are including Basis:

### Specify an sibling or external folder to include Basis
```cmake title="CMakeLists.txt - subdirectories"
# Add basis from a sibling directory, additionally specifying a subdirectory underneath
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/../basis/ basis)
```

### Use a submodule to include Basis (checked out as `basis/`)
```cmake title="CMakeLists.txt - submodule"
add_subdirectory(basis)
```

### Use CMake FetchContent to include Basis
```cmake title="CMakeLists.txt - FetchContent"
# This will download basis as part of your cmake configuration
# It will live in build/
# Consider using something like CPM - https://github.com/cpm-cmake/CPM.cmake - if you want better caching behavior
include(FetchContent)
FetchContent_Declare(basis
    GIT_REPOSITORY https://github.com/basis-robotics/basis
    GIT_TAG main # Or your release of choice
    )
FetchContent_MakeAvailable(basis)
```

### The rest of your CMakeLists.txt

Finally, you will want to `add_subdirectory` for each subdirectory containing code:
```cmake
# These may change, depending on how you've arranged your project
add_subdirectory(lib)
add_subdirectory(unit)
```

## Compiling

Follow these steps to build your project (and the underlying framework)...

From the root directory of your project:
```bash
# Create the build directory
mkdir build
# Jump to it
cd build
# Run cmake to generate makefiles
cmake ..

# Every time you want to compile, run make
make -j
# Every time you want to run with 'basis launch', run make install
sudo make install
```

## Running

Let's ensure that basis is installed properly. You will need three separate terminals (`run-env.sh` invoked again will open a new shell into your docker container, if you don't want to run `tmux` or `screen`)

```bash title="Start the Coordinator"
coordinator
```

```bash title="Start Foxglove's bridge"
foxglove_bridge
```

```bash title="Print the logging topic"
basis topic print /log
```

If you're fast enough with the last command, you should see some output from the logger. Otherwise, either launch [Foxglove Studio](https://foxglove.dev/) or relaunch the bridge, and you should get output.

```log
basis@ubuntu:/basis/build$ basis topic print /log
timestamp {
  seconds: 3263274
  nanos: 325340038
}
level: INFO
message: "[1970-02-07 18:27:54.325] [FoxgloveBridge] [info] [foxglove_bridge.cpp:110] [WS] Client 127.0.0.1:57246 connected via /\n"
name: "FoxgloveBridge"
file: "/basis/cpp/plugins/bridges/foxglove/src/foxglove_bridge.cpp"
line: 110
```

## Troubleshooting

Coming soon, sorry!

## Next

Now that you have a valid basis environment and CMake project, [it's time to create your first units](your-first-unit).