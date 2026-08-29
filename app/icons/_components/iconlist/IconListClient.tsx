"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import SearchBar from "../navbar/SearchBar";
import PlaygroundSheet from "../playground/PlaygroundSheet";
import IconListSkeleton from "./IconListSkeleton";

const IconList = dynamic(() => import("./IconList"), {
	ssr: false,
	loading: () => <IconListSkeleton />,
});

const IconListClient = () => {
	const isMobile = useIsMobile();

	return (
		<>
			{isMobile ? (
				<div className="border-border/50 bg-bgDark sticky top-15 z-40 h-13 border-b px-4">
					<SearchBar />
				</div>
			) : null}
			<IconList />
			<PlaygroundSheet />
		</>
	);
};

export default IconListClient;
