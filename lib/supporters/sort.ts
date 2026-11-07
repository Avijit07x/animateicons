import type { Supporter } from "./types";

export const compareSupporters = (a: Supporter, b: Supporter): number => {
	if (a.createdAt && b.createdAt) {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	}
	if (a.createdAt) return -1;
	if (b.createdAt) return 1;
	return a.name.localeCompare(b.name);
};
