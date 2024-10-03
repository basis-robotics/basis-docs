---
sidebar_position: 5
---
# Serialization

When messages are exchanged between processes in Basis, they must be serialized by the publisher and deserialized by the subscriber. In Basis, this is accomplished using a serializer plugin. The serialization format and the corresponding serializer plugin are determined by the prefix of the `type` field in the Unit's configuration.

For example, in the following Unit configuration YAML, the `/camera` input uses the ROS Message (`rosmsg`) serializer, while the `/lidar` input uses Protocol Buffers (`protobuf`):

```yaml
inputs:
  /camera:
    type: rosmsg:sensor_msgs::Image
  /lidar:
    type: protobuf:SensorMsgs::PointCloud
```

Basis provides built-in support for ROS and Protocol Buffers serializers. Additional serializers can be easily added by developers through the creation of custom serializer plugins.
