"use client";

/**
 * useIconConfig
 *
 * SRP: holds local state for the AnimateIcons playground sheet
 * (size / color / duration). Lives next to the playground because no
 * other component on the AnimateIcons site needs it.
 *
 * Note: trigger mode (hover/click/loop) was removed — hover is the only
 * mode users actually want from a gallery preview, and the toggle was
 * adding clutter without earning its keep. `stroke` is intentionally
 * omitted because every AnimateIcons source file hardcodes
 * `strokeWidth="2"` in its SVG paths.
 */

import { useCallback, useState } from "react";

export type IconConfig = {
	size: number;
	color: string;
	duration: number;
};

const DEFAULT: IconConfig = {
	size: 64,
	color: "#ffffff",
	duration: 1,
};

export const useIconConfig = (initial: Partial<IconConfig> = {}) => {
	const [config, setConfig] = useState<IconConfig>({ ...DEFAULT, ...initial });

	const update = useCallback(
		<K extends keyof IconConfig>(key: K, value: IconConfig[K]) => {
			setConfig((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const reset = useCallback(
		() => setConfig({ ...DEFAULT, ...initial }),
		[initial],
	);

	return { config, update, reset };
};
