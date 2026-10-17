import { AnimateIcons } from "@animateicons/vue";
import { createApp, h, shallowRef } from "vue";
import type { Framework } from "./types";

export const vue: Framework = {
	id: "vue",
	label: "Vue",
	mount: async (host, icon, { size, duration }) => {
		const container = document.createElement("div");
		host.replaceChildren(container);
		const component = shallowRef<InstanceType<typeof AnimateIcons>>();
		const app = createApp({
			render: () =>
				h(AnimateIcons, {
					ref: component,
					icon,
					size,
					duration,
					isAnimated: false,
				}),
		});
		app.mount(container);
		return {
			start: () => component.value?.startAnimation(),
			stop: () => component.value?.stopAnimation(),
			destroy: () => {
				app.unmount();
				container.remove();
			},
		};
	},
};
