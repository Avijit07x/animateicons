# @animateicons/mcp

## 0.2.0

### Minor Changes

- `search_icons` is rebuilt and finds what the agent meant. It now matches plurals (`files` finds `file`), small typos (`calender` finds `calendar`) and several words in any order (`arrow up` finds `arrow-up`). Exact and close name matches come first, and loose keyword matches come last.
- Icon names written the way they appear in code now work: `BellRingIcon`, `bell-ring-icon` and `bell-ring.tsx` all find `bell-ring`.
- Search no longer depends on `fuse.js`. It is bundled into the server like the rest of the shared code.
- The server now reports its real version to the client, read from its own `package.json`.
