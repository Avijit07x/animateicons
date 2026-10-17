import "@angular/compiler";
import {
	createComponent,
	provideZonelessChangeDetection,
	type EnvironmentProviders,
	type Provider,
} from "@angular/core";
import { createApplication } from "@angular/platform-browser";
import { AnimateIcons } from "@animateicons/angular";

type Inputs = Partial<
	Record<"icon" | "size" | "color" | "duration" | "isAnimated", unknown>
>;

export async function mountAnimateIcons(
	inputs: Inputs,
	providers: (Provider | EnvironmentProviders)[] = [
		provideZonelessChangeDetection(),
	],
) {
	const app = await createApplication({ providers });
	const host = document.createElement("animate-icons");
	document.body.append(host);
	const component = createComponent(AnimateIcons, {
		environmentInjector: app.injector,
		hostElement: host,
	});

	const update = (next: Inputs) => {
		for (const [name, value] of Object.entries(next)) {
			component.setInput(name, value);
		}
		app.tick();
	};

	update(inputs);
	app.attachView(component.hostView);
	app.tick();

	return {
		host,
		component: component.instance,
		update,
		svg: () => host.querySelector("svg"),
		destroy: () => {
			app.destroy();
			host.remove();
		},
	};
}

export const settle = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
