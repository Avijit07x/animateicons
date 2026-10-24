"use client";

import dynamic from "next/dynamic";

const LazySponsorCards = dynamic(() => import("./SponsorCards"), {
	ssr: false,
});

export default LazySponsorCards;
