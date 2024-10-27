# Time

Basis uses monotonic time for all timestamps. A common antipattern in robotics is to use system time, but not handle time jumps properly - it's very easy to have a misconfigured system clock that jumps instead of skewing, or doesn't wait for GPS synced time before starting the robotics code. Using monotonic time ensures that no guards are needed when writing algorithms dealing with time.

:::note

When replaying data in a loop, time jumps are handled at the launcher level - all units will be restarted when time jumps backwards. Future updates will allow opting out of this behavior and handling this in the unit instead, to handle cases where unit startup is long.

:::

We recognize this causes some difficulty with data visualization and ingestion. Future updates will add easier ways of handling time. Some possible options include:
 - Using dual timestamps (difficult as MCAP doesn't support them)
 - A compile or runtime configuration flag to pick the timestamp type

We welcome feedback on this topic - if monotonic time is too difficult to deal with, please let us know!

Examples for time conversion coming soon.