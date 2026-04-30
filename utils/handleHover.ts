import type { IconHandle } from "@/types/icon";

/**
 * Drives an AnimateIcons icon's imperative animation in response to a
 * mouse event from any wrapping element. Generic over T so the call
 * site keeps its specific *IconHandle (e.g. `BellRingIconHandle`)
 * without a cast.
 *
 * Used throughout the AnimateIcons gallery — wherever a button, card,
 * or link houses an animated icon and needs to play it on hover.
 */
const handleHover = <T extends IconHandle>(
	e: React.MouseEvent,
	ref: React.RefObject<T | null>,
) => {
	if (e.type === "mouseenter") {
		ref.current?.startAnimation();
	}

	if (e.type === "mouseleave") {
		ref.current?.stopAnimation();
	}
};

export default handleHover;
