import { useCallback, useEffect, useRef, useState } from "react";

const writeToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
};

export const useCopy = (resetMs = 1600) => {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	const copy = useCallback(
		async (text: string) => {
			const ok = await writeToClipboard(text);
			if (ok) {
				setCopied(true);
				clearTimeout(timer.current);
				timer.current = setTimeout(() => setCopied(false), resetMs);
			}
			return ok;
		},
		[resetMs],
	);

	return { copied, copy };
};
