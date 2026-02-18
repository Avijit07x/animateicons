"use client";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import FontAwesomeTypeToggle from "./FontAwesomeTypeToggle";

const NavbarLibraryControls: React.FC = () => {
	const { library } = useIconLibrary();

	if (library !== "fontawesome") return null;

	return <FontAwesomeTypeToggle />;
};

export default NavbarLibraryControls;
