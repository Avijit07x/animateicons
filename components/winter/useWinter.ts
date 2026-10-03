import { useSyncExternalStore } from "react";

const START = { month: 12, day: 1 } as const;
const END = { month: 1, day: 5 } as const;
const PARAM = "season";

export const isWinter = (date: Date) => {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const afterStart =
		month > START.month || (month === START.month && day >= START.day);
	const beforeEnd =
		month < END.month || (month === END.month && day <= END.day);
	return afterStart || beforeEnd;
};

let override: boolean | null = null;

const readOverride = () => {
	const param = new URLSearchParams(window.location.search).get(PARAM);
	if (param === "winter") override = true;
	else if (param === "off") override = false;
	return override;
};

const getSnapshot = () => readOverride() ?? isWinter(new Date());

const subscribe = () => () => {};

export const useWinter = () =>
	useSyncExternalStore(subscribe, getSnapshot, () => false);
