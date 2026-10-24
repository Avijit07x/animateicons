import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IconReview from "./_components/IconReview";
import { readBranch, readIconChanges } from "./_lib/git";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Icon review",
	robots: { index: false, follow: false },
};

const Page = () => {
	if (process.env.NODE_ENV !== "development") notFound();
	return <IconReview changes={readIconChanges()} branch={readBranch()} />;
};

export default Page;
