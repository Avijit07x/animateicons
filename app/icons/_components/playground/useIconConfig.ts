"use client";

/**
 * useIconConfig
 *
 * SRP: holds local state for the AnimateIcons playground sheet
 * (size / color / duration / trigger). Lives next to the playground
 * because no other component on the AnimateIcons site needs it.
 *
 * Note: stroke is intentionally omitted because every AnimateIcons
 * source file hardcodes `strokeWidth="2"` in its SVG paths. Exposing
 * a stroke slider here without first threading a `strokeWidth` prop
 * through all 281 icons would be misleading — slider would do nothing.
 */

import { useCallback, useState } from "react";

export type TriggerMode = "hover" | "click" | "loop";

export type IconConfig = {
	size: number;
	color: string;
	duration: number;
	trigger: TriggerMode;
};

const DEFAULT: IconConfig = {
	size: 64,
	color: "#ffffff",
	duration: 1,
	trigger: "hover",
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
