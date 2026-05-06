/**
 * Supporter sort comparator.
 *
 * Dated supporters (BMC tips have a timestamp) come first, newest →
 * oldest. GitHub sponsors with no createdAt fall to the end, sorted
 * alphabetically by name so the order is stable across renders.
 *
 * Pure function, no module side effects — safe to import from tests.
 */

import type { Supporter } from "./types";

export const compareSupporters = (a: Supporter, b: Supporter): number => {
	if (a.createdAt && b.createdAt) {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	}
	if (a.createdAt) return -1;
	if (b.createdAt) return 1;
	return a.name.localeCompare(b.name);
};
