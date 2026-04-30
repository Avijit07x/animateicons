import JsonLd from "@/components/JsonLd";
import ReducedMotionNotice from "@/components/ReducedMotionNotice";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IconListClient from "../_components/iconlist/IconListClient";
import Navbar from "../_components/navbar/Navbar";
import { buildLibraryJsonLd, buildLibraryMetadata, isLibrary } from "./_seo";

const ICON_COUNTS = {
	lucide: LUCIDE_ICON_LIST.length,
	huge: HUGE_ICON_LIST.length,
} as const;

export function generateStaticParams() {
	return [{ library: "lucide" }, { library: "huge" }];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ library: string }>;
}): Promise<Metadata> {
	const { library } = await params;
	if (!isLibrary(library)) return {};
	return buildLibraryMetadata(library);
}

type Props = {
	params: Promise<{ library: string }>;
};

const Page: React.FC<Props> = async ({ params }) => {
	const { library } = await params;
	if (!isLibrary(library)) {
		notFound();
	}

	// After the guard, TS narrows `library` to "lucide" | "huge".
	const jsonLd = buildLibraryJsonLd(library, ICON_COUNTS[library]);
	const displayName = library === "lucide" ? "Lucide" : "Huge";

	return (
		<div className="flex w-full flex-col">
			<JsonLd data={jsonLd} />

			<Navbar />
			<main className="min-h-[calc(100dvh-3.75rem)] px-4 py-3 lg:px-6">
				<div className="mx-auto h-full w-full max-w-384">
					<h1 className="sr-only">{displayName} Animated Icons for React</h1>

					<IconListClient />
				</div>
			</main>
			<ReducedMotionNotice />
		</div>
	);
};

export default Page;
