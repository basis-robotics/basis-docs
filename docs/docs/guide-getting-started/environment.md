---
sidebar_position: 1
---

# 1. Setting up your project's environment

## Obtaining the Basis Codebase

The Basis framework's Git repository is available at [https://github.com/basis-robotics/basis](https://github.com/basis-robotics/basis)

To clone the repository using the command line:
```bash
git clone git@github.com:basis-robotics/basis.git
```

Alternatively, using GitHub CLI:
```bash
gh repo clone basis-robotics/basis
```

For ease of development, it's recommended to check out basis alongside your project's directory as a sibling. Alternatively, basis can be referenced as a git submodule, or even downloaded solely via CMake FetchContent.

## Creating your new project

Basis does not impose any requirements on folder structure for your project. We do encourage a few practices such as separating out library code from unit code.

Here's one example folder structure
```bash
docs/ # Project documentation
docker/ # Dockerfile for the project, along with docker specific artifacts
launch/ # Launch files used by the project
lib/ # Library code shared by units
proto/ # Protobuf definitions
unit/ # Unit definitions and implementations
.gitignore
CMakeLists.txt # Top level CMake file for the project
README.md
LICENSE
```

## Creating an environment

Docker is encouraged for development use. In production you may want to build or deploy directly to the robot host system, which won't be covered in this tutorial.

### Docker

Basis Robotics does not currently maintain pre-built images for Basis. The Dockerfile and scripts in [`docker/`](https://github.com/basis-robotics/basis/tree/main/docker) can be used to easily build images.

Our Dockerfile has two main arguments:

- `BASE_IMAGE` - the base image to build on top of (defaulting to a recent version of `ubuntu`)
- `BASIS_ENABLE_ROS` - used to enable ROS support (currently defaulting to `1`, this may change)

See the scripts in https://github.com/basis-robotics/basis_test_robot/blob/main/docker/ for examples of automating this. One "easy" option is to run `BASIS_ENABLE_ROS=0 basis/docker/build-env.sh --build-arg BASE_IMAGE=ubuntu:focal` once to generate the base image (`basis-env`) once, and then either work within `basis-env` use your favorite Docker workflow of choice to build an image on top.

Note: `basis/docker/run-env.sh` may not give correct permissions to modify mounted directories inside the container. Take care!

### Host

Building from host is supported, but is not currently well documented. Please see the Dockerfile for the dependencies that must be installed.
