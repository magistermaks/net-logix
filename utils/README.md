## Logix Utilities

#### Save Merging
Used to merge two logix save files into one, usage:
```sh
merge.py save1.lxs save2.lxs out.lxs 0 0
```
the `0 0` at the end is the offset (x y) by which the second sketch should be moved, leave at `0 0` to merge "in place"
> Warning: This command only supports **Logix Save Format v2**
