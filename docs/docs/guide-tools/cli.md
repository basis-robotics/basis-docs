---
sidebar_position: 3
---

# Command-Line Interface (CLI)

This section describes the command-line arguments and subcommands available in the Basis framework. The commands are designed to provide information on topics, schemas, and the ability to launch processes defined in YAML files.

## Global Options

- **`--port`**: Specifies the port number that the Basis coordinator is listening on.
  - Default: `1492`
  - Example: `--port 8080`

## Commands

### `topic` Command

The `topic` command provides information about topics within the Basis system.

- **`ls`**: Lists the available topics.
  - Example: `basis topic ls`
  
- **`info`**: Retrieves information about a specific topic.
  - **Argument**: `topic` (The name of the topic)
  - Example: `basis topic info /example_topic`

- **`print`**: Prints messages on a specified topic.
  - **Argument**: `topic` (The name of the topic)
  - **Option**: `-n` (Number of messages to print, defaults to infinite)
  - **Option**: `--json` or `-j` (If specified, messages are output in JSON format)
  - Example: `basis topic print /example_topic -n 10 --json`

- **`hz`**: Monitors the receive rate (frequency) of messages on a specified topic.
  - **Argument**: `topic` (The name of the topic)
  - Example: `basis topic hz /example_topic`

### `schema` Command

The `schema` command provides information about schemas used within the Basis system.
  
- **`print`**: Prints the structure of a specified schema.
  - **Argument**: `schema` (The name of the schema)
  - Example: `basis schema print example_schema`

### `launch` Command

The `launch` command is used to start processes defined in YAML configuration files.

- **Option**: `--process` (Specifies a particular process within the YAML file to launch. Defaults to an empty string, meaning all processes will be launched.)
  - Example: `basis launch --process process_name example_launch.yaml`

- **Option**: `--sim` (Indicates whether to wait for simulated time messages. Defaults to `false`, but can be enabled with `true`.)
  - Example: `basis launch --sim example_launch.yaml`

- **Argument**: `launch_yaml` (The path to the YAML file that defines the processes to launch.)
  - Example: `basis launch example_launch.yaml`

## Usage Examples

1. To list all available topics:
   ```bash
   basis topic ls
   ```

2. To print information about a specific topic:
   ```bash
   basis topic info /camera
   ```

3. To launch a process defined in a YAML file with simulation enabled:
   ```bash
   basis launch --sim example.yaml
   ```

4. To print 5 messages from a topic in JSON format:
   ```bash
   basis topic print /example_topic -n 5 --json
   ``` 

