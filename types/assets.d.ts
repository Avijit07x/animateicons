/**
 * Ambient declarations for asset imports used across the AnimateIcons
 * site (homepage IconCard, sponsor logos, etc.).
 *
 * Why this exists separate from `next-env.d.ts`:
 *   `next-env.d.ts` references `next/image-types/global` AND imports
 *   `./.next/types/routes.d.ts` — that second file only exists after
 *   `next build` or `next dev` has run at least once. In a fresh CI
 *   environment running `pnpm typecheck` BEFORE `pnpm build`, that
 *   import errors out and TypeScript falls back to "no asset types",
 *   which makes `import logo from './assets/lucide.svg'` blow up.
 *
 *   These declarations give the same image-import types unconditionally
 *   so `pnpm typecheck` works independently of the Next build cache.
 */

declare module "*.png" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.jpg" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.jpeg" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.webp" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.avif" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.gif" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.svg" {
	const value: import("next/image").StaticImageData;
	export default value;
}
