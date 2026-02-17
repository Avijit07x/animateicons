import ReducedMotionNotice from "@/components/ReducedMotionNotice";
import type { Metadata } from "next";
import IconListClient from "../_components/iconlist/IconListClient";
import Navbar from "../_components/navbar/Navbar";

export function generateStaticParams() {
	return [{ library: "lucide" }, { library: "huge" }];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ library: string }>;
}): Promise<Metadata> {
	const { library } = await params;

	const isLucide = library === "lucide";
	const name = isLucide ? "Lucide" : "Huge";

	return {
		title: `${name} Animated Icons for React`,
		description: isLucide
			? "Free and open-source animated Lucide icons for React. Smooth SVG micro-interactions built with motion, lightweight and fully customizable for modern web apps."
			: "Free and open-source animated Huge icons for React. High-quality SVG animations with smooth micro-interactions, optimized for performance and customization.",
		openGraph: {
			title: `${name} Animated Icons for React | AnimateIcons`,
			description: isLucide
				? "Animated Lucide SVG icons for React with smooth motion and micro-interactions."
				: "Animated Huge SVG icon library for React with smooth motion and lightweight performance.",
			url: `https://animateicons.in/icons/${library}`,
			siteName: "AnimateIcons",
			type: "website",
			images: ["/og.png"],
		},
		twitter: {
			card: "summary_large_image",
			title: `${name} Animated Icons for React | AnimateIcons`,
			description: isLucide
				? "Animated Lucide SVG icons for React with smooth motion and micro-interactions."
				: "Animated Huge SVG icons for React with smooth motion and lightweight performance.",
			images: ["/og.png"],
		},
		alternates: {
			canonical: `/icons/${library}`,
		},
	};
}

type Props = {
	params: Promise<{ library: "lucide" | "huge" }>;
};

const Page: React.FC<Props> = async ({ params }) => {
	const { library } = await params;
	const name = library === "lucide" ? "Lucide" : "Huge";

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
