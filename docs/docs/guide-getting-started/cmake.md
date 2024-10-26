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

## Compiling, running

Follow these steps to build the your project (and the underlying framework)...

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

**TODO: running**
