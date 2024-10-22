---
sidebar_position: 1
---
# Install, Build, and Test

## Obtaining the Basis Codebase

The Basis framework's Git repository is available at [https://github.com/basis-robotics/basis](https://github.com/basis-robotics/basis).

To clone the repository using the command line:
```bash
git clone https://github.com/basis-robotics/basis.git
```

Alternatively, using GitHub CLI:
```bash
gh repo clone basis-robotics/basis
```

## Setting Up the Development Environment

### Using Docker

The `docker` directory in the root of the Basis repository contains:
- **Dockerfile**: A Docker definition file.
- **build-env.sh**: A script to build the Docker image.
- **run-env.sh**: A script to run the Docker container.


To use Docker, navigate to the `docker` folder and execute these scripts as needed.


If you prefer to use Docker directly, you can build the environment with the following command:
```bash
docker build --tag basis-env --target basis-env .
```

To run the container:
```bash
docker run -v <BASIS_ROOT>:/basis -p 8765:8765 --name basis --rm -it basis-env /bin/bash
```

Where `<BASIS_ROOT>` represents the path to the Basis root directory.

Port forwarding of port `8765` is optional and is used by the Foxglove bridge Unit to interface with [**Foxglove**](https://foxglove.dev/), a widely-used visualization tool.

### Native Ubuntu Installation

For a native installation, refer to the Dockerfile as a reference for the necessary dependencies. Key requirements include:
- **Build System**: `cmake` and `make`
- **Compiler**: `clang-18` for C++
- **Code Generator**: Python 3

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

## Verification

To run the unit tests and verify the installation, use the following command:
```bash
ctest .
```

