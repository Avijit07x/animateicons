import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import IconSearch from "../components/home/IconSearch";
import InUse from "../components/home/InUse";
import Libraries from "../components/home/Libraries";
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
					<IconSearch />
					<Playground />
					<Libraries />
					<InUse />
					<Sponsors />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default page;
