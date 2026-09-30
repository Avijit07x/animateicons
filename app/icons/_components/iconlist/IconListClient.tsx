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
				<div className="bg-bgDark sticky top-14 z-40 px-4 pt-3 pb-2">
					<SearchBar />
				</div>
			) : null}
			<IconList />
			<PlaygroundSheet />
		</>
	);
};

export default IconListClient;
