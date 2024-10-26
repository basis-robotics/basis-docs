---
sidebar_position: 1
---

# Unit
In Basis, a **Unit** is a component that interfaces with robot code and interacts with other Units to perform coordinated tasks. Units can communicate with one another within the same process, across different processes, or even on separate machines. This inter-Unit communication is achieved through a publish-subscribe mechanism centered around **topics**.

**Topics** are named channels that facilitate the passing of messages between Units. When a Unit publishes a message to a topic, any Unit subscribed to that topic will receive the message. The messages transmitted over these topics are serialized using serialization protocols such as ROS messages or Protocol Buffers, which are provided by default in Basis. Users have the flexibility to add other serialization protocols, and Basis plans to include additional ones in the future.

For communications occurring within the same process, serialization can be skipped to improve performance. Instead of serializing the message, a shared pointer to the message object is passed between Units, reducing overhead. When communication occurs between different processes or machines, messages are sent through a **transport layer**. Basis uses TCP as the default transport layer but allows users to incorporate other network transport layers as needed. Additional transport layers will also be added by Basis over time.

The coordination of which Units publish to which topics and which Units subscribe to those topics is managed by the **Coordinator**. The Coordinator handles the binding of publishers to subscribers, ensuring that messages are routed correctly between Units.
