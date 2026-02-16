import ReducedMotionNotice from "@/components/ReducedMotionNotice";
import IconListClient from "../_components/iconlist/IconListClient";
import Navbar from "../_components/navbar/Navbar";

const Page = () => {
	return (
		<div className="flex w-full flex-col">
			<Navbar />
			<main className="min-h-[calc(100dvh-3.75rem)] px-4 py-3 lg:px-6">
				<div className="mx-auto h-full w-full max-w-384">
					<IconListClient />
				</div>
			</main>
			<ReducedMotionNotice />
		</div>
	);
};

export default Page;
