"use client";

/**
 * PlaygroundContext
 *
 * SRP: tracks which AnimateIcons icon (if any) is currently being
 * explored in the playground sheet. Each AnimateIcons tile dispatches
 * `openPlayground(item)` when clicked; the <PlaygroundSheet> is
 * rendered once at the IconListClient level and reads from this
 * context, avoiding 250+ portals.
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
	Component: React.ElementType;
	componentName: string;
};

type PlaygroundContextValue = {
	icon: PlaygroundIcon | null;
	open: boolean;
	openPlayground: (icon: PlaygroundIcon) => void;
	closePlayground: () => void;
};

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(
	undefined,
);

/**
 * Convert a kebab-case AnimateIcons name into the PascalCase component
 * name the user will paste into their JSX (e.g. "bell-ring" →
 * "BellRingIcon"). Pure helper, used by the playground snippet builder.
 */
export const iconNameToComponent = (name: string): string => {
	const pascal = name
		.split("-")
		.filter(Boolean)
		.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
		.join("");
	return `${pascal}Icon`;
};

export const PlaygroundProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [icon, setIcon] = useState<PlaygroundIcon | null>(null);
	const [open, setOpen] = useState(false);

	const openPlayground = useCallback((next: PlaygroundIcon) => {
		setIcon(next);
		setOpen(true);
	}, []);

	const closePlayground = useCallback(() => {
		setOpen(false);
	}, []);

	const value = useMemo(
		() => ({ icon, open, openPlayground, closePlayground }),
		[icon, open, openPlayground, closePlayground],
	);

	return (
		<PlaygroundContext.Provider value={value}>
			{children}
		</PlaygroundContext.Provider>
	);
};

export const usePlayground = (): PlaygroundContextValue => {
	const ctx = useContext(PlaygroundContext);
	if (!ctx) {
		throw new Error("usePlayground must be used within a PlaygroundProvider");
	}
	return ctx;
};
