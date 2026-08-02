import { differenceInDays } from "date-fns";

export const NEW_WINDOW_DAYS = 3;

/** An icon counts as "new" when it was added within the last few days.
 *  Single source of truth for the gallery's NEW badge, the "New" sidebar
 *  filter, and its count. */
export const isIconNew = (addedAt?: string): boolean =>
	!!(
		addedAt &&
		differenceInDays(new Date(), new Date(addedAt)) <= NEW_WINDOW_DAYS
	);
