import { differenceInDays } from "date-fns";

const NEW_WINDOW_DAYS = 3;

export const isIconNew = (addedAt?: string): boolean =>
	!!(
		addedAt &&
		differenceInDays(new Date(), new Date(addedAt)) <= NEW_WINDOW_DAYS
	);
