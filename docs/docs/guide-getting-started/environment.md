---
sidebar_position: 1
---
# Creating your new project

<talk about folder structure>

## Creating your project's environment

<talk about docker vs host>

### Docker

Basis Robotics does not currently maintain pre-built images for Basis. The Dockerfile and scripts in [`docker/`](https://github.com/basis-robotics/basis/tree/main/docker) can be used to easily build images.

Our Dockerfile has two main arguments:

- `BASE_IMAGE` - the base image to build on top of (defaulting to a recent version of `ubuntu`)
- `BASIS_ENABLE_ROS` - used to enable ROS support (currently defaulting to `1`, this may change)

See the scripts in https://github.com/basis-robotics/basis_test_robot/blob/main/docker/ for examples of automating this.

### Host

Building from host is supported, but is not currently well documented. Please see the Dockerfile for the dependencies that must be installed.
