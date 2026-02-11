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
	img: {
		href: string;
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


