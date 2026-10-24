"use client";

import { useIsMac } from "@/hooks/useIsMac";
import { isSearchShortcut } from "@/utils/isSearchShortcut";
import dynamic from "next/dynamic";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useEffectEvent,
	useState,
} from "react";

const CommandSearch = dynamic(() => import("./CommandSearch"), { ssr: false });

type Ctx = {
	open: () => void;
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
	const isMac = useIsMac();

	const open = useCallback(() => setIsOpen(true), []);

	const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
		if (isSearchShortcut(e, isMac)) {
			e.preventDefault();
			setIsOpen((prev) => !prev);
			return;
		}
		if (e.key === "/" && !isEditableTarget(e.target)) {
			e.preventDefault();
			setIsOpen(true);
		}
	});

	useEffect(() => {
		const handler = (e: KeyboardEvent) => onKeyDown(e);
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<CommandSearchContext.Provider value={{ open }}>
			{children}
			{hasOpened && <CommandSearch isOpen={isOpen} onOpenChange={setIsOpen} />}
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
