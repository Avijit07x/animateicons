import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import InstallSection from "../components/home/InstallSection";
import KineticWall from "../components/home/KineticWall";
import LibrariesEditorial from "../components/home/LibrariesEditorial";
import Playground from "../components/home/Playground";
import Navbar from "../components/Navbar";
import Sponsors from "../components/Sponsors";

const page = () => {
	return (
		<>
			<Navbar />
			<main>
				<div className="relative overflow-hidden">
					<HeroSection />
					<KineticWall />
					<Playground />
					<LibrariesEditorial />
					<InstallSection />
					<Sponsors />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default page;
