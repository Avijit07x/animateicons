const FAMILY_ALIASES: Record<string, string> = {
	alarm: "clock",
	audio: "music",
	bell: "notification",
	checkmark: "check",
	chevrons: "chevron",
	delete: "trash",
	edit: "pencil",
	files: "file",
	film: "video",
	messages: "message",
	pen: "pencil",
	pin: "map",
	smartphone: "phone",
	sparkles: "sparkle",
	speaker: "volume",
	tags: "tag",
	timer: "clock",
	upload: "download",
	users: "user",
};

const collator = new Intl.Collator("en", { numeric: true });

export const familyOf = (name: string): string => {
	const first = name.split("-")[0];
	return FAMILY_ALIASES[first] ?? first;
};

const variantOf = (name: string): string => name.split("-").slice(1).join("-");

const rankIn = (family: string, name: string): number =>
	name === family ? 0 : 1;

const groupIn = (family: string, name: string): string => {
	const first = name.split("-")[0];
	return first === family ? "" : first;
};

export const sortIconsByFamily = <T extends { name: string }>(
	icons: readonly T[],
): T[] => {
	const families = new Map<string, T[]>();

	for (const icon of icons) {
		const family = familyOf(icon.name);
		const members = families.get(family);
		if (members) members.push(icon);
		else families.set(family, [icon]);
	}

	return [...families].flatMap(([family, members]) =>
		[...members].sort(
			(a, b) =>
				rankIn(family, a.name) - rankIn(family, b.name) ||
				collator.compare(groupIn(family, a.name), groupIn(family, b.name)) ||
				collator.compare(variantOf(a.name), variantOf(b.name)) ||
				collator.compare(a.name, b.name),
		),
	);
};
