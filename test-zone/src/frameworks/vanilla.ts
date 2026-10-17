import { createIcon } from "@animateicons/vanilla";
import type { Framework } from "./types";

export const vanilla: Framework = {
	id: "vanilla",
	label: "Plain JS",
	mount: async (host, data, { size, duration }) => {
		const icon = createIcon(data, { size, duration, isAnimated: false });
		host.replaceChildren(icon);
		return {
			start: icon.startAnimation,
			stop: icon.stopAnimation,
			destroy: () => {
				icon.destroy();
				icon.remove();
			},
		};
	},
};
