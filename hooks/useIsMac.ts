import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export const useIsMac = () =>
	useSyncExternalStore(
		noopSubscribe,
		() => /Mac|iPhone|iPad|iPod/.test(navigator.platform),
		() => true,
	);
