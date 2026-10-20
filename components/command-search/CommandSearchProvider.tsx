"use client";

import dynamic from "next/dynamic";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const CommandSearch = dynamic(() => import("./CommandSearch"), { ssr: false });

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
	const [hasOpened, setHasOpened] = useState(false);
	if (isOpen && !hasOpened) setHasOpened(true);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
				return;
			}
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
				return;
			}
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
			{hasOpened && <CommandSearch isOpen={isOpen} onClose={close} />}
		</CommandSearchContext.Provider>
	);
};

export const useCommandSearch = (): Ctx => {
	const ctx = useContext(CommandSearchContext);
	if (!ctx)
		throw new Error(
			"useCommandSearch must be used inside CommandSearchProvider",
		);
	return ctx;
};
