import FeatureSection from "@/components/feature/FeatureSection";
import HeroSection from "@/components/Hero";
import IconLibrariesSection from "@/components/Iconlibraries/IconLibrariesSection";
import Sponsors from "@/components/Sponsors";

const page = () => {
	return (
		<div className="relative min-h-dvh overflow-hidden">
			<HeroSection />
			<IconLibrariesSection />
			<FeatureSection />
			<Sponsors />
		</div>
	);
};

export default page;
