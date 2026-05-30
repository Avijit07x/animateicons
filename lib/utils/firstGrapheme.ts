/**
 * firstGrapheme - return the first user-perceived character of a
 * string, uppercased.
 *
 * `"abc".charAt(0)` is fine for ASCII but breaks on:
 *   - Emoji ("🐈 helio" → "\uD83D" - half a surrogate pair, renders as ?)
 *   - Combining marks ("é" composed as e + ́ → "e", losing accent)
 *   - Astral-plane CJK characters
 *
 * `Intl.Segmenter` walks the string by grapheme cluster, which is the
 * unit a human would call "one character". Falls back to the first
 * code point on engines that don't ship Segmenter (older Safari).
 */

export const firstGrapheme = (input: string): string => {
	const trimmed = input.trim();
	if (!trimmed) return "?";

	if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
		const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
		const { value } = seg.segment(trimmed)[Symbol.iterator]().next();
		return (value?.segment ?? "?").toLocaleUpperCase();
	}

	// Fallback: first Unicode code point (handles surrogate pairs, not combining marks).
	const codePoint = trimmed.codePointAt(0);
	if (codePoint == null) return "?";
	return String.fromCodePoint(codePoint).toLocaleUpperCase();
};
