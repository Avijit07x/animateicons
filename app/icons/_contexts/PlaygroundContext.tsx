"use client";

/**
 * PlaygroundContext
 *
 * Holds the "which icon is currently open in the playground sheet"
 * state. IconTile dispatches `openPlayground(item)` on click; the
 * sheet listens via `usePlayground()` and renders accordingly. Lives
 * inside the /icons gallery layout — no other route mounts the sheet.
 */

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export type PlaygroundIcon = {
	name: string;
	library: "lucide" | "huge";
	prefix: "lu" | "hu";
	Component: React.ElementType;
	componentName: string;
};

type Ctx = {
	icon: PlaygroundIcon | null;
	open: boolean;
	openPlayground: (icon: PlaygroundIcon) => void;
	closePlayground: () => void;
};

const PlaygroundContext = createContext<Ctx | null>(null);

/** "bell-ring" → "BellRingIcon" so the snippet displays the canonical
 *  component name a consumer would import. */
export const iconNameToComponent = (name: string): string =>
	`${name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("")}Icon`;

export const PlaygroundProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [icon, setIcon] = useState<PlaygroundIcon | null>(null);
	const [open, setOpen] = useState(false);

	const openPlayground = useCallback((next: PlaygroundIcon) => {
		setIcon(next);
		setOpen(true);
	}, []);

	const closePlayground = useCallback(() => setOpen(false), []);

	const value = useMemo<Ctx>(
		() => ({ icon, open, openPlayground, closePlayground }),
		[icon, open, openPlayground, closePlayground],
	);

	return (
		<PlaygroundContext.Provider value={value}>
			{children}
		</PlaygroundContext.Provider>
	);
};

export const usePlayground = (): Ctx => {
	const ctx = useContext(PlaygroundContext);
	if (!ctx)
		throw new Error("usePlayground must be used within a PlaygroundProvider");
	return ctx;
};
