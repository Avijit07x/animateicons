import { LoaderVisual } from "@/components/loader/LoaderVisual";

/**
 * Root loading UI. Next renders this automatically as the Suspense fallback
 * while a route segment is loading (initial dynamic render + navigations) -
 * this is the App Router's built-in dynamic/code-split loading mechanism.
 */
export default function Loading() {
	return (
		<div className="bg-bgDark flex min-h-dvh items-center justify-center">
			<LoaderVisual />
		</div>
	);
}
