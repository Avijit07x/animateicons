import { getAllSupporters } from "@/lib/supporters";
import SupporterExplorer from "./SupporterExplorer";

const SupporterWall = async () => {
	const supporters = await getAllSupporters();
	return <SupporterExplorer supporters={supporters} />;
};

export default SupporterWall;
