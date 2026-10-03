# animateicons

## 0.3.0

### Minor Changes

- Search is rebuilt and finds what you meant. It now matches plurals (`files` finds `file`), small typos (`calender` finds `calendar`) and several words in any order (`arrow up` finds `arrow-up`). Exact and close name matches come first, and loose keyword matches come last.
- `search` now understands icon names written the way they appear in code: `BellRingIcon`, `bell-ring-icon` and `bell-ring.tsx` all find `bell-ring`.
- `info` suggests the closest names when it finds nothing, for example `bellring` suggests `hu-bell-ring` and `lu-bell-ring`.
- `--limit` now rejects a bad value with a clear message, for example `searchIcons: limit must be a whole number of 1 or more, received 0.`
- Fixed `animateicons --version` printing `0.1.0`. It now prints the installed version.
- Search no longer depends on `fuse.js`. It is bundled into the CLI like the rest of the shared code.
