"use client";

/**
 * DistributionContext
 *
 * SRP: single source of truth for which distribution method the
 * AnimateIcons gallery user prefers — `shadcn` (CLI copy) or `npm`
 * (`@animateicons/react` import). Drives the "Copy" button text and
 * payload on every IconTile so a user who prefers npm sees and copies
 * `import { BellRingIcon } from "@animateicons/react/lucide"`, and a
 * user who prefers shadcn keeps copying the install URL command.
 *
 * Mirrors the shape of PackageManagerContext so the wiring is familiar:
 *   - hydrate from localStorage on mount
 *   - persist changes back
 *   - one provider, one writer, all 281 tiles share the same value
 */

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type Distribution = "shadcn" | "npm";

const STORAGE_KEY = "distribution";
const VALID: ReadonlyArray<Distribution> = ["shadcn", "npm"];

const isValid = (v: string | null): v is Distribution =>
	v !== null && (VALID as ReadonlyArray<string>).includes(v);

type DistributionContextValue = {
	distribution: Distribution;
	setDistribution: (d: Distribution) => void;
};

const DistributionContext = createContext<DistributionContextValue | undefined>(
	undefined,
);

export const DistributionProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [distribution, setState] = useState<Distribution>("shadcn");

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (isValid(saved)) setState(saved);
		} catch {
			// localStorage may be unavailable; ignore.
		}
	}, []);

	const setDistribution = useCallback((d: Distribution) => {
		setState(d);
		try {
			localStorage.setItem(STORAGE_KEY, d);
		} catch {
			// ignore
		}
	}, []);

	const value = useMemo(
		() => ({ distribution, setDistribution }),
		[distribution, setDistribution],
	);

	return (
		<DistributionContext.Provider value={value}>
			{children}
		</DistributionContext.Provider>
	);
};

export const useDistribution = (): DistributionContextValue => {
	const ctx = useContext(DistributionContext);
	if (!ctx) {
		throw new Error(
			"useDistribution must be used within a DistributionProvider",
		);
	}
	return ctx;
};

/**
 * Convert a kebab-case icon stem ("bell-ring") into its npm export
 * name ("BellRingIcon"). Pure function, exported so any AnimateIcons
 * surface that needs to format the npm import can stay consistent.
 */
export const npmComponentName = (stem: string): string =>
	`${stem
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("")}Icon`;

/**
 * Build the import line a consumer should paste when using the
 * @animateicons/react npm package.
 *
 *   import { BellRingIcon } from "@animateicons/react/lucide";
 */
export const npmImportLine = (
	stem: string,
	library: "lucide" | "huge",
): string =>
	`import { ${npmComponentName(stem)} } from "@animateicons/react/${library}";`;
