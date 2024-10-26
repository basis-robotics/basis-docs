---
sidebar_position: 2
---

# 2. Setting up the CMake environment, building

TODO

## Foundation

The first step is to create the foundation of our project. This includes creating the Protocol Buffers schema, the Basis units description, and the related CMake files. The initial layout of the folders and files will look like this:

```
.
|-- CMakeLists.txt
|-- proto
|   |-- CMakeLists.txt
|   `-- simple_pub_sub.proto
|-- simple_pub.unit.yaml
`-- simple_sub.unit.yaml
```


## Building Basis

Follow these steps to build the Basis framework:

1. Create a build directory.
2. Run `cmake` to configure the build.
3. Compile the code using `make`.
4. Install Basis binaries with `make install`.

From the root directory of the Basis repository:
```bash
mkdir build
cd build
cmake ..
make -j
sudo make install
```
