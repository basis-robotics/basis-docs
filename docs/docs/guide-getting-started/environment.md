---
sidebar_position: 1
---

# Creating your new project

Basis does not impose any requirements on folder structure for your project. We do encourage a few practices such as separating out library code from unit code.

Here's one example folder structure
```bash
docs/ # Project documentation
docker/ # Dockerfile for the project, along with docker specific artifacts
launch/ # Launch files used by the project
lib/ # Library code shared by units
unit/ # Unit definitions and implementations
.gitignore
CMakeLists.txt # Top level CMake file for the project
README.md
LICENSE
```

## Creating your project's environment

Docker is encouraged for development use. In production you may want to build or deploy directly to the robot host system, which won't be covered in this tutorial.

### Docker

Basis Robotics does not currently maintain pre-built images for Basis. The Dockerfile and scripts in [`docker/`](https://github.com/basis-robotics/basis/tree/main/docker) can be used to easily build images.

Our Dockerfile has two main arguments:

- `BASE_IMAGE` - the base image to build on top of (defaulting to a recent version of `ubuntu`)
- `BASIS_ENABLE_ROS` - used to enable ROS support (currently defaulting to `1`, this may change)

See the scripts in https://github.com/basis-robotics/basis_test_robot/blob/main/docker/ for examples of automating this.

### Host

Building from host is supported, but is not currently well documented. Please see the Dockerfile for the dependencies that must be installed.
