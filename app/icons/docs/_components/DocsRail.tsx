import { fetchStars } from "@/lib/github/stars";
import RailLinks from "./RailLinks";
import TableOfContents from "./TableOfContents";

/**
 * Right rail: the scroll-spy TOC plus the Contribute / Community links below
 * it. Server component so it can fetch the star count once and hand it to the
 * client RailLinks.
 */
const DocsRail = async () => {
	const stars = await fetchStars();

	return (
		<div className="space-y-8">
			<TableOfContents />
			<RailLinks stars={stars} />
		</div>
	);
};

export default DocsRail;
