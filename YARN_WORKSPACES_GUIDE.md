## `yarn` workspace guide

| Action                               | Command                                       | Exmple                           |
| ------------------------------------ | --------------------------------------------- | -------------------------------- |
| Install dependency in root level     | `yarn add -W <package>`                       | `yarn add -W concurrently`       |
| Install dev-dependency in root level | `yarn add -DW <package>`                      | `yarn add -DW prettier`          |
| Install dependency in workspace      | `yarn workspace <workspace> add <package>`    | `yarn workspace api add express` |
| Install dev-dependency in workspace  | `yarn workspace <workspace> add -D <package>` | `yarn workspace api add -D jest` |
