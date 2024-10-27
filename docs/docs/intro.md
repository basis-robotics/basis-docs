---
sidebar_position: 1
slug: /
hide_table_of_contents: true
hide_title: true
breadcrumbs: false

---
# Introduction to Basis

Basis is a robotics development framework developed by Basis Robotics, designed to accelerate your journey from concept to prototype, and from prototype to production. Many of the concepts will be familiar to ROS users, such as pub/sub-based communication, launch files, and a central coordinator. However, there are some aspects that we approach differently.

## Concepts
- [**Units**](guide-concepts/unit): The fundamental components in Basis that encapsulate functionality and define how your system interacts with messages, topics, and other Units.
- [**The Code Generator**](guide-concepts/code-generator): A tool that simplifies development by automatically generating code based on YAML configuration files, reducing the need for boilerplate code.
- [**Serialization**](guide-concepts/serialization): How messages are encoded and decoded when passed between different processes or systems.
- [**Publishing / subscribing**](guide-concepts/pubsub): How to publish messages and subscribe to topics.

## Getting Started
- [**Install, build and test**](guide-getting-started/): Install Basis, build the code, and write your first units

## Tools and schemas
- [**CLI Tools**](guide-tools/cli): Command-line utilities that help you manage, monitor, and launch Units and processes.
- [**Launch files**](guide-tools/launch-files): Launch configuration files.
- [**Unit YAML schema**](guide-tools/unit-yaml-schema): Unit definition file.

## Advanced features
- [**Synchronizers**](guide-advanced/synchronizers): Mechanisms used to coordinate data flow and ensure that your system processes messages.
- [**Pub/sub by hand**](guide-advanced/pubsub-by-hand): How to create publishers and subscribers at runtime. 