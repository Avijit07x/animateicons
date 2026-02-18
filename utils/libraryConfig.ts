export type LibraryId = "lucide" | "huge" | "fontawesome";

export const LIBRARY_CONFIG: Record<
	LibraryId,
	{ name: string; description: string; ogDescription: string }
> = {
	lucide: {
		name: "Lucide",
		description:
			"Free and open-source animated Lucide icons for React. Smooth SVG micro-interactions built with motion, lightweight and fully customizable for modern web apps.",
		ogDescription:
			"Animated Lucide SVG icons for React with smooth motion and micro-interactions.",
	},
	huge: {
		name: "Huge",
		description:
			"Free and open-source animated Huge icons for React. High-quality SVG animations with smooth micro-interactions, optimized for performance and customization.",
		ogDescription:
			"Animated Huge SVG icon library for React with smooth motion and lightweight performance.",
	},
	fontawesome: {
		name: "FontAwesome",
		description:
			"Animated FontAwesome icons for React. Professional icon library with Solid and Pro styles, smooth SVG micro-interactions built with Motion.",
		ogDescription:
			"Animated FontAwesome SVG icons for React with smooth motion and micro-interactions.",
	},
};

const DEFAULT_CONFIG = {
	name: "Icons",
	description: "Animated icons for React.",
	ogDescription: "Animated SVG icons for React.",
};

export const getLibraryConfig = (library: string | null) => {
	if (!library || !(library in LIBRARY_CONFIG)) {
		return DEFAULT_CONFIG;
	}
	return LIBRARY_CONFIG[library as LibraryId];
};
