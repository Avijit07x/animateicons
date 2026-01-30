type IconListItem = {
	name: string;
	icon: React.ElementType;
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
