"use client";

/**
 * DistributionContext
 *
 * SRP: single source of truth for how the AnimateIcons gallery user
 * installs icons: React via `shadcn` (CLI copy) or `npm`
 * (`@animateicons/react`), or the `vanilla`, `vue` and `angular`
 * packages. Drives the "Copy" button text and payload on every IconTile,
 * the playground snippets and the install commands, so a user who
 * prefers Vue sees and copies
 * `import { BellRingIcon } from "@animateicons/vue/lucide"`, and a user
 * who prefers shadcn keeps copying the install URL command.
 *
 * Mirrors the shape of PackageManagerContext so the wiring is familiar:
 *   - hydrate from localStorage on mount
 *   - persist changes back
 *   - one provider, one writer, every tile shares the same value
 */

import { useStoredPreference } from "@/hooks/useStoredPreference";
import { iconNameToComponent } from "@/utils/iconNameToComponent";
import { createContext, useContext, useMemo } from "react";

export type Distribution = "shadcn" | "npm" | "vanilla" | "vue" | "angular";

export type Framework = "react" | "vanilla" | "vue" | "angular";

export const FRAMEWORKS: ReadonlyArray<Framework> = [
	"react",
	"vue",
	"angular",
	"vanilla",
];

export const FRAMEWORK_LABELS: Record<Framework, string> = {
	react: "React",
	vanilla: "Plain JS",
	vue: "Vue",
	angular: "Angular",
};

const STORAGE_KEY = "distribution";
const VALID: ReadonlyArray<Distribution> = [
	"shadcn",
	"npm",
	"vanilla",
	"vue",
	"angular",
];

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
	const [distribution, setDistribution] = useStoredPreference<Distribution>(
		STORAGE_KEY,
		"npm",
		isValid,
	);

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

export const frameworkOf = (distribution: Distribution): Framework =>
	distribution === "shadcn" || distribution === "npm" ? "react" : distribution;

export const withFramework = (
	distribution: Distribution,
	framework: Framework,
): Distribution => {
	if (frameworkOf(distribution) === framework) return distribution;
	return framework === "react" ? "npm" : framework;
};

export const packageFor = (distribution: Distribution): string =>
	`@animateicons/${frameworkOf(distribution)}`;

export const iconDataName = (stem: string): string =>
	iconNameToComponent(stem).slice(0, -"Icon".length);

const exportName = (distribution: Distribution, stem: string): string => {
	const framework = frameworkOf(distribution);
	return framework === "vanilla" || framework === "angular"
		? iconDataName(stem)
		: iconNameToComponent(stem);
};

export const importLine = (
	distribution: Distribution,
	stem: string,
	library: "lucide" | "huge",
): string =>
	`import { ${exportName(distribution, stem)} } from "${packageFor(distribution)}/${library}";`;
