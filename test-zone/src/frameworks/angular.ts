import "@angular/compiler";
import {
	createComponent,
	provideZonelessChangeDetection,
	type ApplicationRef,
} from "@angular/core";
import { createApplication } from "@angular/platform-browser";
import { AnimateIcons } from "@animateicons/angular";
import type { Framework } from "./types";

let application: Promise<ApplicationRef> | undefined;

const getApplication = () =>
	(application ??= createApplication({
		providers: [provideZonelessChangeDetection()],
	}));

export const angular: Framework = {
	id: "angular",
	label: "Angular",
	mount: async (host, icon, { size, duration }) => {
		const app = await getApplication();
		const element = document.createElement("animate-icons");
		host.replaceChildren(element);
		const component = createComponent(AnimateIcons, {
			environmentInjector: app.injector,
			hostElement: element,
		});
		component.setInput("icon", icon);
		component.setInput("size", size);
		component.setInput("duration", duration);
		component.setInput("isAnimated", false);
		app.attachView(component.hostView);
		app.tick();
		return {
			start: () => component.instance.startAnimation(),
			stop: () => component.instance.stopAnimation(),
			destroy: () => {
				app.detachView(component.hostView);
				component.destroy();
				element.remove();
			},
		};
	},
};
