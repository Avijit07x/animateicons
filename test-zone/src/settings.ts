import type { IconLibrary } from "@animateicons/vanilla";

export interface Settings {
	library: IconLibrary | "all";
	size: number;
	duration: number;
	autoRun: boolean;
}

export const SIZES = [24, 64];
export const DURATIONS = [1, 2];
export const LIBRARIES: Settings["library"][] = ["all", "lucide", "huge"];

const pick = <T>(value: string | null, allowed: readonly T[], fallback: T) =>
	allowed.find((option) => String(option) === value) ?? fallback;

export function readSettings(search = window.location.search): Settings {
	const params = new URLSearchParams(search);
	return {
		library: pick(params.get("library"), LIBRARIES, "all"),
		size: pick(params.get("size"), SIZES, 64),
		duration: pick(params.get("duration"), DURATIONS, 1),
		autoRun: params.get("run") === "1",
	};
}

export function settingsHref(settings: Settings, change: Partial<Settings>) {
	const next = { ...settings, ...change };
	const params = new URLSearchParams({
		library: next.library,
		size: String(next.size),
		duration: String(next.duration),
	});
	return `?${params}`;
}
