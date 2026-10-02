"use client";

import { useStoredPreference } from "@/hooks/useStoredPreference";
import { createContext, useContext, useMemo } from "react";

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
	const [packageManager, setPackageManager] =
		useStoredPreference<PackageManager>(STORAGE_KEY, "npm", isValid);

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

export const installCommandFor = (pm: PackageManager): string => {
	switch (pm) {
		case "bun":
			return "bun add";
		case "pnpm":
			return "pnpm add";
		case "npm":
		default:
			return "npm i";
	}
};

export const shadcnAddCommand = (
	pm: PackageManager,
	prefix: string,
	name: string,
): string =>
	`${cliCommandFor(pm)} shadcn@latest add @animateicons/${prefix}-${name}`;
