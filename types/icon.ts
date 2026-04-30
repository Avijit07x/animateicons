/**
 * Canonical handle exposed by every AnimateIcons component's `forwardRef`.
 *
 * Each AnimateIcons file in `icons/lucide/` and `icons/huge/` re-declares
 * a structurally identical handle type (e.g. `BellRingIconHandle`,
 * `EyeIconHandle`) for an ergonomic public API — those stay because
 * users import them by icon name. This shared type is for the
 * AnimateIcons gallery's internal code that needs to accept "any
 * AnimateIcons icon" generically: `handleHover`, `IconAction`, the
 * playground preview, and the home-page feature card.
 *
 * Importable via `@/types/icon`.
 */
export type IconHandle = {
	startAnimation: () => void;
	stopAnimation: () => void;
};
