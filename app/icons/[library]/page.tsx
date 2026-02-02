"use client";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import dynamic from "next/dynamic";
import IconLibraryEmptyState from "../_components/IconLibraryEmptyState";
import IconListSkeleton from "../_components/IconListSkeleton";
import Navbar from "../_components/Navbar";

const IconList = dynamic(() => import("../_components/IconList"), {
	ssr: false,
	loading: () => <IconListSkeleton />,
});

const Page = () => {
	const library = useIconLibrary();

	if (!library) {
		return <IconLibraryEmptyState />;
	}

	return (
		<div className="flex w-full flex-col">
			<Navbar />
			<main className="min-h-[calc(100dvh-3.75rem)] py-3">
				<div className="mx-auto max-w-7xl h-full w-full">
					<IconList />
				</div>
			</main>
		</div>
	);
};

export default Page;
