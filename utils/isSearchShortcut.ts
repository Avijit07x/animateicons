export const isSearchShortcut = (event: KeyboardEvent, isMac: boolean) =>
	(isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === "k";
