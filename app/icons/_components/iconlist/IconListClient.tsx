"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import { usePlayground } from "../../_contexts/PlaygroundContext";
import SearchBar from "../navbar/SearchBar";
import PlaygroundSheet from "../playground/PlaygroundSheet";
import IconListSkeleton from "./IconListSkeleton";

const IconList = dynamic(() => import("./IconList"), {
	ssr: false,
	loading: () => <IconListSkeleton />,
});

const IconListClient = () => {
	const isMobile = useIsMobile();
	const { icon, open, closePlayground } = usePlayground();

	return (
		<>
			{isMobile ? <SearchBar /> : null}
			<IconList />
			<PlaygroundSheet
				icon={icon}
				open={open}
				onOpenChange={(next) => {
					if (!next) closePlayground();
				}}
			/>
		</>
	);
};

export default IconListClient;
