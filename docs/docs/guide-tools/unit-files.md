---
sidebar_position: 1
---


# Unit Files

### Overview
This section describes the YAML schema for defining a Unit in Basis. The schema is used by the code generator to automatically create necessary boilerplate code, such as publishers and subscribers, based on the inputs provided. The Unit operates within a specified threading model and handles synchronization tasks through a set of inputs and outputs. The `args` section allows for the configuration of runtime parameters that are passed to the Unit by the Launcher during its creation.

### Schema Structure

The schema for a Basis Unit defines several key properties:

- **args**: A set of runtime arguments passed to the Unit during its instantiation. These arguments are configured by the Launcher and allow the Unit to be customized at runtime. Each argument is defined by a type (which corresponds to a C++ type), with options to specify whether the argument is optional or has a default value. If an argument is marked as optional, it will be wrapped in `std::optional`. However, an argument cannot have both an `optional` flag and a `default` value at the same time.

  Example declaration taken from [yuyv_to_rgb.unit.yaml](https://github.com/basis-robotics/basis_test_robot/blob/main/unit/yuyv_to_rgb/yuyv_to_rgb.unit.yaml):
  ```yaml
  args:
    topic_namespace:
      type: string
      default: "/camera"
  ```
  And usage:
  ```yaml
  handlers:
  OnCameraImage:
    sync:
    ...
    handlers:
      OnYUYV:
      ...
        inputs:
          "{{args.topic_namespace}}/yuyv":
            type: protobuf:foxglove.RawImage
        outputs:
          "{{args.topic_namespace}}/rgb":
            type: protobuf:foxglove.RawImage
    ```

- **cpp_includes**: A list of C++ headers required for the Unit’s implementation. This section specifies the additional include files for the Unit's operation; it is typically used for including the input and output message declarations.

  Example from [simple_pub.unit.yaml](https://github.com/basis-robotics/basis-examples/blob/main/cpp/simple_pub_sub/unit/simple_pub/simple_pub.unit.yaml):
  ```yaml
  cpp_includes:
    - simple_pub_sub.pb.h
  ```

- **threading_model**: Defines the threading behavior of the Unit. It supports one model currently:
  - `single`: All handlers run mutually exclusive from each other within a Unit.
  - Future releases will add other threading models.

  Example from [simple_pub.unit.yaml](https://github.com/basis-robotics/basis-examples/blob/main/cpp/simple_pub_sub/unit/simple_pub/simple_pub.unit.yaml):
  ```yaml
  threading_model:
    single
  ```

- **handlers**: This section describes the message delivery logic, or handlers, that execute within the Unit. Each handler is defined by its synchronization type, which determines how and when the handler is triggered. The handler may require inputs to be satisfied, and it produces a set of outputs.
  
  - **sync**: The synchronization method, handled by a Syncrhonizer, for the handler. It can be defined as:
    - `all`: The handler is triggered when all inputs are satisfied.
    - `equal`: The handler is triggered when inputs match specified conditions.
    - `approximate`: Optional inputs may be provided, and the handler will use approximations if necessary.

    Example from [simple_sub.unit.yaml](https://github.com/basis-robotics/basis-examples/blob/main/cpp/simple_pub_sub/unit/simple_sub/simple_sub.unit.yaml):
    ```yaml
    handlers:
      OnChatter:
        sync:
          type: all
        inputs:
        ...
    ```

  - **rate**: When present, a RateSubscriber is applied to the synchronizeer. It triggers at regular intervals specified by the `rate` field.
    Example from [simple_pub.unit.yaml](https://github.com/basis-robotics/basis-examples/blob/main/cpp/simple_pub_sub/unit/simple_pub/simple_pub.unit.yaml):
    ```yaml
    handlers:
      PublishAt1Hz:
        sync:
          type: all
          rate: 1
        outputs:
        ...
    ```

  - **buffer_size**: Specifies the maximum number of messages to buffer for each input. Once the buffer reaches the defined `buffer_size`, additional messages will be dropped.
  
    Example:
      ```yaml
      handlers:
        # This handler looks for two image messages coming in with the same timestamp and outputs one stereo image
        StereoMatch:
          sync:
            # require exact field matching
            type: equal
            # buffer at most 2 messages on each channel before dropping
            buffer_size: 2
      ```

  - **inputs**: A set of input topics that the handler waits for before execution. Each input is described by several properties, such as a synchronization field (`sync_field`), caching options, and whether the input allows or denies certain transport methods. Inputs are configured with a defined message type, and options such as accumulated data and quality of service (QoS) can be specified.

    Example from [perception_demo.unit.yaml](https://github.com/basis-robotics/basis_test_robot/blob/main/unit/perception_demo/perception_demo.unit.yaml):
    ```yaml
    handlers:
      OnRGB:
        sync:
          type: all      
        inputs:
          /camera/rgb:
            type: protobuf:foxglove.RawImage
            inproc_type: image_conversion::CudaManagedImage
            qos:
              depth: 1
    ```

  
  - **outputs**: The outputs generated by the handler, which are typically messages published to other components. Similar to inputs, outputs are described by message types, transport methods, and other properties such as QoS settings.
    Example from the same file [perception_demo.unit.yaml](https://github.com/basis-robotics/basis_test_robot/blob/main/unit/perception_demo/perception_demo.unit.yaml):

    ```yaml
    handlers:
      OnRGB:
        sync:
        ...
        inputs:
        ...
        outputs:
          /camera/detections/annotations:
            type: protobuf:foxglove.ImageAnnotations
          /camera/inference_buffer/r:
            type: protobuf:foxglove.RawImage
            optional: True
          /camera/inference_buffer/g:
            type: protobuf:foxglove.RawImage
            optional: True
          /camera/inference_buffer/b:
            type: protobuf:foxglove.RawImage
            optional: True
    ```

### Synchronization Field

In each input, the `sync_field` property specifies how the field is accessed for synchronization. Depending on how the message data is structured, the `sync_field` can be set in various ways:

- **Direct Field Access**: When a field can be accessed directly from the message, you can specify the field name. For example:

  ```yaml
  inputs:
    /camera: 
      type: rosmsg:sensor_msgs::Image
      sync_field: ::width
  ```

  This corresponds to the code `msg->width`, directly accessing the `width` field in the `sensor_msgs::Image` message.

- **Lambda Transformation**: For more complex cases where a transformation or combination of fields is required, you can use a lambda function. For example:

  ```yaml
  inputs:
    /ultrasound: 
      type: protobuf::Ultrasound
      sync_field: calibration.MinDistance()
  ```

  This is conceptually equivalent to a lambda like `[](T_MSG* msg)[]{ return msg->calibration.MinDistance(); }`, allowing for flexible access to the data in the `protobuf::Ultrasound` message.


### Usage
The YAML schema is designed for the automatic generation of C++ code, making it easier to manage the configuration of Units, their runtime arguments, threading models, and synchronization handlers. Developers can use this schema to declaratively define how a Unit operates, including its inputs, outputs, and overall synchronization behavior, without manually writing boilerplate code for handling publishers and subscribers.
