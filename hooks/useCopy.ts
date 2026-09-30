import { useCallback, useEffect, useRef, useState } from "react";

export const useCopy = (resetMs = 1600) => {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	const copy = useCallback(
		(text: string) => {
			navigator.clipboard?.writeText(text).then(() => {
				setCopied(true);
				clearTimeout(timer.current);
				timer.current = setTimeout(() => setCopied(false), resetMs);
			});
		},
		[resetMs],
	);

	return { copied, copy };
};
