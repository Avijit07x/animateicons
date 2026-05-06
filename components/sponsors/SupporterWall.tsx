/**
 * SupporterWall
 *
 * Server component that pulls the merged BMC + GitHub Sponsors list
 * once and hands it to the client-side `SupporterExplorer` for tab
 * filtering. Keeping the fetch on the server means the token never
 * crosses the network and the page stays ISR-cacheable.
 */

import { getAllSupporters } from "@/lib/supporters";
import SupporterExplorer from "./SupporterExplorer";

const SupporterWall = async () => {
	const supporters = await getAllSupporters();
	return <SupporterExplorer supporters={supporters} />;
};

export default SupporterWall;
