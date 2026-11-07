import { LoaderVisual } from "@/components/loader/LoaderVisual";

export default function Loading() {
	return (
		<div className="bg-bgDark flex min-h-dvh items-center justify-center">
			<LoaderVisual />
		</div>
	);
}
