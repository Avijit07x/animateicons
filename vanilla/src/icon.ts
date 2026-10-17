import { play } from "./play";
import { renderIcon } from "./render";
import type { IconControls, IconData, IconOptions } from "./types";

export interface MountedIcon extends IconControls {
	destroy: () => void;
}

export type IconElement = HTMLSpanElement & MountedIcon;

export const HOST_STYLE = {
	position: "relative",
	display: "inline-flex",
} as const;

export function attachIcon(
	host: Element,
	svg: SVGSVGElement,
	data: IconData,
	{ duration = 1, isAnimated = true }: IconOptions = {},
): MountedIcon {
	const player = play(svg, data, { duration });
	const handleEnter = () => {
		if (isAnimated) player.start();
	};
	const handleLeave = () => {
		if (isAnimated) player.stop();
	};
	host.addEventListener("mouseenter", handleEnter);
	host.addEventListener("mouseleave", handleLeave);

	return {
		startAnimation: player.start,
		stopAnimation: player.stop,
		destroy: () => {
			host.removeEventListener("mouseenter", handleEnter);
			host.removeEventListener("mouseleave", handleLeave);
			player.destroy();
		},
	};
}

export function mountIcon(
	host: HTMLElement,
	data: IconData,
	options: IconOptions = {},
): MountedIcon {
	Object.assign(host.style, HOST_STYLE);
	host.style.color = options.color ?? "";
	const svg = renderIcon(data, options.size, host.ownerDocument);
	host.replaceChildren(svg);
	const attached = attachIcon(host, svg, data, options);
	return {
		...attached,
		destroy: () => {
			attached.destroy();
			svg.remove();
		},
	};
}

export function createIcon(
	data: IconData,
	options: IconOptions = {},
): IconElement {
	const host = document.createElement("span");
	return Object.assign(host, mountIcon(host, data, options));
}
