"use client";

/**
 * PackageManagerContext
 *
 * SRP: single source of truth for the AnimateIcons gallery user's
 * preferred package manager (npm / pnpm / bun). Hydrates from
 * localStorage once on mount and persists changes back. Drives the
 * "Copy CLI command" output on every AnimateIcons tile so the
 * generated `shadcn add ...` command matches the user's tooling.
 *
 * Replaces the previous setup where:
 *  - PackageManagerToggle owned its own useState + localStorage R/W
 *  - every IconTile subscribed independently via useSyncExternalStore
 *    to the "storage" event (~250 listeners on the Lucide gallery)
 *
 * Now: one localStorage read on mount, one writer, all AnimateIcons
 * tiles consume the same context value.
 */

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type PackageManager = "npm" | "pnpm" | "bun";

const STORAGE_KEY = "tab";
const VALID: ReadonlyArray<PackageManager> = ["npm", "pnpm", "bun"];

const isValid = (v: string | null): v is PackageManager =>
	v !== null && (VALID as ReadonlyArray<string>).includes(v);

type PackageManagerContextValue = {
	packageManager: PackageManager;
	setPackageManager: (pm: PackageManager) => void;
};

const PackageManagerContext = createContext<
	PackageManagerContextValue | undefined
>(undefined);

export const PackageManagerProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [packageManager, setState] = useState<PackageManager>("npm");

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (isValid(saved)) setState(saved);
		} catch {
			// localStorage may be unavailable (SSR-mismatch, privacy mode); ignore.
		}
	}, []);

	const setPackageManager = useCallback((pm: PackageManager) => {
		setState(pm);
		try {
			localStorage.setItem(STORAGE_KEY, pm);
		} catch {
			// ignore write failures
		}
	}, []);

	const value = useMemo(
		() => ({ packageManager, setPackageManager }),
		[packageManager, setPackageManager],
	);

	return (
		<PackageManagerContext.Provider value={value}>
			{children}
		</PackageManagerContext.Provider>
	);
};

export const usePackageManager = (): PackageManagerContextValue => {
	const ctx = useContext(PackageManagerContext);
	if (!ctx) {
		throw new Error(
			"usePackageManager must be used within a PackageManagerProvider",
		);
	}
	return ctx;
};

/**
 * Maps a PackageManager preference to its `shadcn add` invocation
 * prefix used by AnimateIcons install commands. Pure function, exported
 * so every AnimateIcons consumer (tile copy button, per-icon page,
 * docs) shares the same npx / pnpm dlx / bunx --bun mapping.
 */
export const cliCommandFor = (pm: PackageManager): string => {
	switch (pm) {
		case "bun":
			return "bunx --bun";
		case "pnpm":
			return "pnpm dlx";
		case "npm":
		default:
			return "npx";
	}
};
