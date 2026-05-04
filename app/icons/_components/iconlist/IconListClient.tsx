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
			{isMobile ? <SearchBar /> : null}
			<IconList />
			<PlaygroundSheet />
		</>
	);
};

export default IconListClient;
