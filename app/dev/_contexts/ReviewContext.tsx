"use client";

import { useStoredPreference } from "@/hooks/useStoredPreference";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { useIconRegistry } from "../_hooks/useIconRegistry";
import { isPreviewSize } from "../_lib/filters";
import type { IconComponent } from "../_lib/registry";
import type { Library, PreviewSize } from "../_lib/types";

const SIZE_KEY = "dev-preview-size";

type Ctx = {
	size: PreviewSize;
	setSize: (size: PreviewSize) => void;
	playToken: number;
	playAll: () => void;
	ready: boolean;
	getIcon: (library: Library, name: string) => IconComponent | undefined;
};

const ReviewContext = createContext<Ctx | null>(null);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [size, setSize] = useStoredPreference<PreviewSize>(
		SIZE_KEY,
		"32",
		isPreviewSize,
	);
	const [playToken, setPlayToken] = useState(0);
	const registry = useIconRegistry();

	const playAll = useCallback(() => setPlayToken((n) => n + 1), []);

	const getIcon = useCallback(
		(library: Library, name: string) => registry?.[library].get(name),
		[registry],
	);

	const value = useMemo<Ctx>(
		() => ({
			size,
			setSize,
			playToken,
			playAll,
			ready: registry !== null,
			getIcon,
		}),
		[size, setSize, playToken, playAll, registry, getIcon],
	);

	return (
		<ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
	);
};

export const useReview = (): Ctx => {
	const ctx = useContext(ReviewContext);
	if (!ctx) throw new Error("useReview must be used within a ReviewProvider");
	return ctx;
};
