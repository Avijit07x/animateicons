# Naming report

Icons whose `forwardRef` component name and handle interface name
don't match the canonical `XxxIcon` / `XxxIconHandle` pattern.

The npm package re-exports them under whatever name each file actually
defines, so they work — but consumers will see inconsistent typing
between, e.g., `BellRingIcon` (paired with `BellRingIconHandle`) and
`BlendIcon` (paired with `BlendHandle`).

Worth a follow-up pass to rename in-place.
