import FeatureSection from "@/components/feature/FeatureSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Hero";
import IconLibrariesSection from "@/components/Iconlibraries/IconLibrariesSection";
import Navbar from "@/components/Navbar";
import Sponsors from "@/components/Sponsors";

const page = () => {
	return (
		<>
			<Navbar />
			<main>
				<div className="relative min-h-dvh overflow-hidden">
					<HeroSection />
					<IconLibrariesSection />
					<FeatureSection />
					<Sponsors />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default page;
