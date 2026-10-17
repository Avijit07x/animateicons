import type { IconData } from "@animateicons/vanilla";

interface MountOptions {
	size: number;
	duration: number;
}

export interface MountedFramework {
	start: () => void;
	stop: () => void;
	destroy: () => void;
}

export interface Framework {
	id: "vanilla" | "vue" | "angular";
	label: string;
	mount: (
		host: HTMLElement,
		icon: IconData,
		options: MountOptions,
	) => Promise<MountedFramework>;
}
