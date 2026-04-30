/**
 * Minimal `cn` for @animateicons/react.
 *
 * The AnimateIcons monorepo uses clsx + tailwind-merge to drive its
 * gallery's heavy class composition. The published package's icons
 * only ever call `cn("static-class", className)` with two simple
 * inputs, so we ship a 5-line filter+join instead of pulling in
 * clsx (~600B) and tailwind-merge (~5KB) as runtime dependencies.
 *
 * If a future icon needs richer behavior, swap this to clsx and add
 * it to `dependencies` in package.json.
 */
type ClassValue = string | undefined | null | false | 0;

export const cn = (...inputs: ClassValue[]): string =>
	inputs.filter(Boolean).join(" ");
