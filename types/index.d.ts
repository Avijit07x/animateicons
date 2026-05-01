type IconLibrary = "lucide" | "huge";
type IconLibraryPrefix = "lu" | "hu";

type IconListItem = {
	name: string;
	icon: React.ElementType;
	category?: string[];
	addedAt: string;
	keywords: string[];
};

type IconLibraryCardData = {
	id?: string;
	title: string;
	description: string;
	/** Total icons in the library — rendered as a stat in the card header. */
	count: number;
	img: {
		// Accept either a remote URL/string path OR a statically-imported
		// image (`import logo from "./assets/foo.png"` resolves to
		// StaticImageData). Next/Image accepts both — the AnimateIcons
		// IconCard does too.
		href: string | import("next/image").StaticImageData;
		className: string;
	};

	icons: React.ComponentType<{
		size?: number;
		className?: string;
	}>[];
	href: string;
};

type FeatureItem = {
	id: string;
	title: string;
	description: string;
	Icon: React.ComponentType<{
		size?: number;
		className?: string;
		ref: React.RefObject;
	}>;
};

type RegistryFile = {
	path: string;
	type: "registry:ui";
	target: string;
};

type RegistryItem = {
	name: string;
	type: "registry:ui";
	registryDependencies: string[];
	dependencies: string[];
	devDependencies: string[];
	files: RegistryFile[];
};

type Registry = {
	$schema: string;
	name: string;
	homepage: string;
	items: RegistryItem[];
};
