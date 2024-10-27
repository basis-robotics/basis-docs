---
sidebar_position: 2
---

# Pubs / Subs by Hand

In addition to using the code generator, developers can implement publishers and subscribers manually through the lower-level API, which is always available.

:::warning
Units created by hand won't have the required metadata for use with deterministic replay.
:::

## Implementing a Publisher Manually

To publish a message on the `/chatter` topic, you create a publisher by calling `Advertise` within the Unit:

```c++
my_publisher = Advertise<StringMessage>("/chatter");
```

Once the publisher is set up, you can publish a `StringMessage` like this:

```c++
std::shared_ptr<StringMessage> msg{std::make_shared<StringMessage>()};
msg->set_message(std::string("Hello, world!"));

my_publisher->Publish(msg);
```

## Setting Up a Subscriber

To set up a subscriber that listens to the `/chatter` topic, use the `Subscribe` function, which binds the incoming message to a callback method (in this case, `MyUnit::OnChatter`):

```c++
my_subscriber = Subscribe<StringMessage>("/chatter", std::bind(&MyUnit::OnChatter, this, _1));
```

The `OnChatter` callback method is defined with the following prototype:

```c++
MyUnit::OnChatter(std::shared_ptr<const StringMessage> msg) {
    // Process the incoming message
}
```

This method is invoked whenever a new message is received on the `/chatter` topic, allowing the Unit to process the incoming data.
