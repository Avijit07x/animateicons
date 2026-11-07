export const firstGrapheme = (input: string): string => {
	const trimmed = input.trim();
	if (!trimmed) return "?";

	if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
		const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
		const { value } = seg.segment(trimmed)[Symbol.iterator]().next();
		return (value?.segment ?? "?").toLocaleUpperCase();
	}

	const codePoint = trimmed.codePointAt(0);
	if (codePoint == null) return "?";
	return String.fromCodePoint(codePoint).toLocaleUpperCase();
};
