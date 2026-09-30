import { useEffect, useState } from "react";

const START_MS = 300;
const TYPE_MS = 95;
const ERASE_MS = 40;
const HOLD_MS = 2200;
const GAP_MS = 400;

export const useTypewriter = (words: readonly string[], active: boolean) => {
	const [text, setText] = useState("");

	useEffect(() => {
		if (!active || words.length === 0) return;
		let word = 0;
		let length = 0;
		let erasing = false;
		let id: ReturnType<typeof setTimeout>;

		const step = () => {
			const target = words[word];
			if (!erasing) {
				length += 1;
				setText(target.slice(0, length));
				erasing = length === target.length;
				id = setTimeout(step, erasing ? HOLD_MS : TYPE_MS);
				return;
			}
			length -= 1;
			setText(target.slice(0, length));
			if (length === 0) {
				erasing = false;
				word = (word + 1) % words.length;
			}
			id = setTimeout(step, length === 0 ? GAP_MS : ERASE_MS);
		};

		id = setTimeout(step, START_MS);
		return () => clearTimeout(id);
	}, [words, active]);

	return text;
};
