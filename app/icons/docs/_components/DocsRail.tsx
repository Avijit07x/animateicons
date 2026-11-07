import { fetchStars } from "@/lib/github/stars";
import RailLinks from "./RailLinks";
import TableOfContents from "./TableOfContents";

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
