"use client";

import type { RequestType } from "@/lib/request";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export type RequestPreset = { type: RequestType; icon?: string };

type Ctx = {
	open: boolean;
	preset: RequestPreset;
	session: number;
	openRequest: (preset: RequestPreset) => void;
	closeRequest: () => void;
};

const RequestContext = createContext<Ctx | null>(null);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [preset, setPreset] = useState<RequestPreset>({ type: "icon" });
	const [session, setSession] = useState(0);

	const openRequest = useCallback((next: RequestPreset) => {
		setPreset(next);
		setSession((count) => count + 1);
		setOpen(true);
	}, []);

	const closeRequest = useCallback(() => setOpen(false), []);

	const value = useMemo<Ctx>(
		() => ({ open, preset, session, openRequest, closeRequest }),
		[open, preset, session, openRequest, closeRequest],
	);

	return (
		<RequestContext.Provider value={value}>{children}</RequestContext.Provider>
	);
};

export const useRequest = (): Ctx => {
	const ctx = useContext(RequestContext);
	if (!ctx) throw new Error("useRequest must be used within a RequestProvider");
	return ctx;
};
