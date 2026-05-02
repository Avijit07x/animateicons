"use client";

/**
 * CommandSearchProvider
 *
 * Owns the open/close state of the global Cmd+K palette and binds the
 * keyboard shortcut so any component on the site can trigger search via
 * `useCommandSearch().open()`. Mounts the CommandSearch modal once at
 * the root so the palette is portal-free and there's only ever one in
 * the tree no matter how deeply nested the consumer is.
 *
 * Shortcuts:
 *   - Cmd+K / Ctrl+K — toggle the palette
 *   - "/" (when no input is focused) — open the palette
 *   - Esc — handled by the modal itself
 */

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import CommandSearch from "./CommandSearch";

type Ctx = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

const CommandSearchContext = createContext<Ctx | null>(null);

const isEditableTarget = (el: EventTarget | null): boolean => {
	if (!(el instanceof HTMLElement)) return false;
	const tag = el.tagName;
	return (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		tag === "SELECT" ||
		el.isContentEditable
	);
};

export const CommandSearchProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			// Cmd+K / Ctrl+K — toggle from anywhere
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
				return;
			}
			// "/" — open only when not typing into another input
			if (e.key === "/" && !isEditableTarget(e.target) && !isOpen) {
				e.preventDefault();
				setIsOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isOpen]);

	return (
		<CommandSearchContext.Provider value={{ isOpen, open, close }}>
			{children}
			<CommandSearch isOpen={isOpen} onClose={close} />
		</CommandSearchContext.Provider>
	);
};

export const useCommandSearch = (): Ctx => {
	const ctx = useContext(CommandSearchContext);
	if (!ctx)
		throw new Error("useCommandSearch must be used inside CommandSearchProvider");
	return ctx;
};
