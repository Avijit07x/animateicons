"use client";

import dynamic from "next/dynamic";
import IconListSkeleton from "../_components/IconListSkeleton";
import Navbar from "../_components/Navbar";

const IconList = dynamic(() => import("../_components/IconList"), {
	ssr: false,
	loading: () => <IconListSkeleton />,
});

const Page = () => {
	return (
		<div className="flex w-full flex-col">
			<Navbar />
			<main className="min-h-[calc(100dvh-3.75rem)] px-4 py-3 lg:px-6">
				<div className="mx-auto h-full w-full max-w-384">
					<IconList />
				</div>
			</main>
		</div>
	);
};

export default Page;
