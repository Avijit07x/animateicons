/**
 * Canonical handle exposed by every @animateicons/react icon's
 * `forwardRef`. Each icon also re-exports its own named alias
 * (e.g. `BellRingIconHandle`) for ergonomic typing at the call site.
 */
export type IconHandle = {
	startAnimation: () => void;
	stopAnimation: () => void;
};
