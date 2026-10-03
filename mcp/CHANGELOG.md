# @animateicons/mcp

## 0.3.0

### Minor Changes

- New `get_docs` tool. It lists the AnimateIcons docs pages, or returns one page as markdown: install, props, the ref handle, the `useIconHover` hook and the examples. A page can be named by its slug (`examples/hover-helper`), its last part (`hover-helper`), its title or its URL.
- The server now sends short instructions to the agent, telling it to read the docs before it wires an icon into a button, card, menu or input.
- The docs are read from `animateicons.in/r/docs.json` on every call, so a site update reaches agents without a new release of the MCP.

## 0.2.0

### Minor Changes

- `search_icons` is rebuilt and finds what the agent meant. It now matches plurals (`files` finds `file`), small typos (`calender` finds `calendar`) and several words in any order (`arrow up` finds `arrow-up`). Exact and close name matches come first, and loose keyword matches come last.
- Icon names written the way they appear in code now work: `BellRingIcon`, `bell-ring-icon` and `bell-ring.tsx` all find `bell-ring`.
- Search no longer depends on `fuse.js`. It is bundled into the server like the rest of the shared code.
- The server now reports its real version to the client, read from its own `package.json`.
