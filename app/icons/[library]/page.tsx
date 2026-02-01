"use client";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import IconLibraryEmptyState from "../_components/IconLibraryEmptyState";
import IconList from "../_components/IconList";
import Navbar from "../_components/Navbar";

const Page = () => {
	const library = useIconLibrary();

	if (!library) {
		return <IconLibraryEmptyState />;
	}

	return (
		<div className="flex w-full flex-col">
			<Navbar />
			<main className="min-h-[calc(100dvh-3.75rem)] py-3">
				<IconList />
			</main>
		</div>
	);
};

export default Page;
