"use client";

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

export const useIconConfig = () => {
	const [config, setConfig] = useState<IconConfig>(DEFAULT);

	const update = useCallback(
		<K extends keyof IconConfig>(key: K, value: IconConfig[K]) => {
			setConfig((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const reset = useCallback(() => setConfig(DEFAULT), []);

	const isDefault =
		config.size === DEFAULT.size &&
		config.color === DEFAULT.color &&
		config.duration === DEFAULT.duration;

	return { config, update, reset, isDefault };
};
