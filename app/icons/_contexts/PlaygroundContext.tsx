"use client";

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
