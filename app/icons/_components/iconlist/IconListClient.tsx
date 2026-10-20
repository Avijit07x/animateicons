"use client";

import dynamic from "next/dynamic";
import SearchBar from "../navbar/SearchBar";
import PlaygroundSheet from "../playground/PlaygroundSheet";
import IconListSkeleton from "./IconListSkeleton";

const IconList = dynamic(() => import("./IconList"), {
	ssr: false,
	loading: () => <IconListSkeleton />,
});

const IconListClient = () => {
	return (
		<>
			<div className="bg-bgDark sticky top-14 z-40 px-4 pt-3 pb-2 md:hidden">
				<SearchBar />
			</div>
			<IconList />
			<PlaygroundSheet />
		</>
	);
};

export default IconListClient;
