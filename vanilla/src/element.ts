import { mountIcon, type MountedIcon } from "./icon";
import type { IconControls, IconData, IconOptions } from "./types";

export interface AnimateIconsElement extends HTMLElement, IconControls {}

export type IconSet = Iterable<IconData> | Record<string, IconData>;

const DEFAULT_TAG = "animate-icons";

const OBSERVED_ATTRIBUTES = [
	"name",
	"library",
	"size",
	"color",
	"duration",
	"is-animated",
];

const iconsByKey = new Map<string, IconData>();
const iconsByName = new Map<string, IconData>();
const waiting = new Set<{ render: () => void }>();

const keyOf = (library: string, name: string) => `${library}/${name}`;

const findIcon = (name: string | null, library: string | null) => {
	if (!name) return undefined;
	return library ? iconsByKey.get(keyOf(library, name)) : iconsByName.get(name);
};

const readNumber = (element: Element, attribute: string) => {
	const value = Number(element.getAttribute(attribute));
	return Number.isFinite(value) && value > 0 ? value : undefined;
};

const readOptions = (element: Element): IconOptions => ({
	size: readNumber(element, "size"),
	duration: readNumber(element, "duration"),
	color: element.getAttribute("color") ?? undefined,
	isAnimated: element.getAttribute("is-animated") !== "false",
});

const createElementClass = () =>
	class extends HTMLElement implements AnimateIconsElement {
		static observedAttributes = OBSERVED_ATTRIBUTES;

		#mounted: MountedIcon | undefined;

		connectedCallback() {
			this.render();
		}

		disconnectedCallback() {
			waiting.delete(this);
			this.#mounted?.destroy();
			this.#mounted = undefined;
		}

		attributeChangedCallback() {
			if (this.isConnected) this.render();
		}

		startAnimation() {
			this.#mounted?.startAnimation();
		}

		stopAnimation() {
			this.#mounted?.stopAnimation();
		}

		render() {
			this.#mounted?.destroy();
			const data = findIcon(
				this.getAttribute("name"),
				this.getAttribute("library"),
			);
			if (!data) {
				this.#mounted = undefined;
				waiting.add(this);
				return;
			}
			waiting.delete(this);
			this.#mounted = mountIcon(this, data, readOptions(this));
		}
	};

export function defineIcons(icons: IconSet, tagName = DEFAULT_TAG) {
	const list = Symbol.iterator in icons ? [...icons] : Object.values(icons);
	for (const icon of list) {
		iconsByKey.set(keyOf(icon.library, icon.name), icon);
		if (!iconsByName.has(icon.name)) iconsByName.set(icon.name, icon);
	}
	if (typeof customElements === "undefined") return;
	if (!customElements.get(tagName)) {
		customElements.define(tagName, createElementClass());
	}
	for (const element of [...waiting]) element.render();
}
