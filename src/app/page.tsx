import FeatureSection from "@/components/feature/FeatureSection";
import Footer from "@/components/Footer";
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
			<Footer />
		</div>
	);
};

export default page;
