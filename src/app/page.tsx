import HeroSection from "@/components/Hero";
import IconSection from "@/components/IconSection";
import Navbar from "@/components/Navbar";
import Sponsors from "@/components/Sponsors";

const page = () => {
	return (
		<div className="from-bgDark to-bgDark relative min-h-screen overflow-hidden bg-gradient-to-br via-zinc-900">
			<Navbar />
			<HeroSection />
			<div className="relative z-100 mx-auto max-w-7xl px-3 md:px-6 lg:px-8">
				<IconSection />
			</div>
			<Sponsors />
		</div>
	);
};

export default page;
