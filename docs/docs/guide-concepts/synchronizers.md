---
sidebar_position: 4
---
# Synchronizers
In Basis, **synchronizers** define the conditions under which messages are considered "in sync" and can be delivered to the Unit. Each synchronizer operates on multiple inputs, determining when the system can proceed with synchronized data. These inputs can be marked as either *optional* or *non-optional*, where only the non-optional inputs are required to meet the synchronizer's criteria. Optional inputs are passed through but do not influence the readiness of the synchronizer.

### **All Synchronizer**
The **All** synchronizer ensures that all non-optional inputs are present before delivering the messages to the Unit. It is useful when you need to guarantee that each message from every required input source is received. Once all required inputs are available, the messages are forwarded, allowing the system to operate only when all necessary data is present.

### **FieldSync Synchronizer**
The **FieldSync** synchronizer is designed to align messages by specific fields within the messages, like timestamps or unique IDs. It allos you to sync messages based on a particular field value rather than waiting for all messages to arrive in order. This synchronizer is particularly useful when you need to ensure that messages from different sources are aligned on a shared property.

### **FieldSyncEqual**
**FieldSyncEqual** is a variation of FieldSync that synchronizes messages by ensuring the fields are exactly equal. This is appropriate for cases where the matching criterion is strict, such as when working with exact timestamps or unique identifiers.

### **FieldSyncApproximatelyEqual**
In contrast, **FieldSyncApproximatelyEqual** allows for a slight difference between field values. For example, when working with stereo cameras, the timestamps of the image feeds might not be perfectly identical, but they can be close enough to consider the images synchronized. This synchronizer lets you define a small acceptable margin of difference (epsilon) between the fields, making it useful in scenarios where small variations are tolerable.
