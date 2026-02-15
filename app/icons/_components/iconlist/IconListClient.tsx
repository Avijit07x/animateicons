"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import SearchBar from "../navbar/SearchBar";
import IconListSkeleton from "./IconListSkeleton";

const IconList = dynamic(() => import("./IconList"), {
	ssr: false,
	loading: () => <IconListSkeleton />,
});

const IconListClient = () => {
	const isMobile = useIsMobile();

	return (
		<div>
			{isMobile ? <SearchBar /> : null}
			<IconList />;
		</div>
	);
};

export default IconListClient;
