import ReducedMotionNotice from "@/components/ReducedMotionNotice";
import type { Metadata } from "next";
import {
	getLibraryConfig,
	LIBRARY_CONFIG,
	type LibraryId,
} from "@/utils/libraryConfig";
import IconListClient from "../_components/iconlist/IconListClient";
import Navbar from "../_components/navbar/Navbar";

export function generateStaticParams() {
	return Object.keys(LIBRARY_CONFIG).map((library) => ({ library }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ library: string }>;
}): Promise<Metadata> {
	const { library } = await params;
	const { name, description, ogDescription } = getLibraryConfig(library);

	return {
		title: `${name} Animated Icons for React`,
		description,
		openGraph: {
			title: `${name} Animated Icons for React | AnimateIcons`,
			description: ogDescription,
			url: `https://animateicons.in/icons/${library}`,
			siteName: "AnimateIcons",
			type: "website",
			images: ["/og.png"],
		},
		twitter: {
			card: "summary_large_image",
			title: `${name} Animated Icons for React | AnimateIcons`,
			description: ogDescription,
			images: ["/og.png"],
		},
		alternates: {
			canonical: `/icons/${library}`,
		},
	};
}

type Props = {
	params: Promise<{ library: LibraryId }>;
};

const Page: React.FC<Props> = async ({ params }) => {
	const { library } = await params;
	const { name } = getLibraryConfig(library);

	return (
		<div className="flex w-full flex-col">
			<Navbar />
			<main className="min-h-[calc(100dvh-3.75rem)] px-4 py-3 lg:px-6">
				<div className="mx-auto h-full w-full max-w-384">
					<h1 className="sr-only">{name} Animated Icons for React</h1>

					<IconListClient />
				</div>
			</main>
			<ReducedMotionNotice />
		</div>
	);
};

export default Page;
