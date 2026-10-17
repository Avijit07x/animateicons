import type { IconData, IconLibrary } from "@animateicons/vanilla";
import * as huge from "@animateicons/vanilla/huge";
import * as lucide from "@animateicons/vanilla/lucide";
import type { ComponentType, Ref } from "react";

export interface ReactIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

export type ReactIcon = ComponentType<{
	size?: number;
	duration?: number;
	ref?: Ref<ReactIconHandle>;
}>;

export interface TestIcon {
	key: string;
	library: IconLibrary;
	name: string;
	data: IconData;
}

const reactModules = import.meta.glob<Record<string, unknown>>(
	"../../icons/*/*-icon.tsx",
);

const toPascalCase = (name: string) =>
	name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

const toTestIcons = (icons: Record<string, IconData>): TestIcon[] =>
	Object.values(icons).map((data) => ({
		key: `${data.library}/${data.name}`,
		library: data.library,
		name: data.name,
		data,
	}));

export const TEST_ICONS: TestIcon[] = [
	...toTestIcons(lucide),
	...toTestIcons(huge),
].sort((a, b) => a.key.localeCompare(b.key));

const loaded = new Map<string, Promise<ReactIcon>>();

export const loadReactIcon = ({ key, library, name }: TestIcon) => {
	let icon = loaded.get(key);
	if (!icon) {
		const load = reactModules[`../../icons/${library}/${name}-icon.tsx`];
		if (!load) throw new Error(`No React icon for ${key}`);
		icon = load().then(
			(module) => module[`${toPascalCase(name)}Icon`] as ReactIcon,
		);
		loaded.set(key, icon);
	}
	return icon;
};
