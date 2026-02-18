"use client";

import React, { createContext, useContext, useState } from "react";

export type FontAwesomeType = "solid" | "regular";

interface FontAwesomeTypeContextValue {
	iconType: FontAwesomeType;
	setIconType: React.Dispatch<React.SetStateAction<FontAwesomeType>>;
}

const FontAwesomeTypeContext =
	createContext<FontAwesomeTypeContextValue | null>(null);

type Props = { children: React.ReactNode };

const FontAwesomeTypeProvider: React.FC<Props> = ({ children }) => {
	const [iconType, setIconType] = useState<FontAwesomeType>("regular");

	return (
		<FontAwesomeTypeContext.Provider value={{ iconType, setIconType }}>
			{children}
		</FontAwesomeTypeContext.Provider>
	);
};

export default FontAwesomeTypeProvider;

export const useFontAwesomeType = () => {
	const ctx = useContext(FontAwesomeTypeContext);
	if (!ctx) {
		throw new Error(
			"useFontAwesomeType must be used inside FontAwesomeTypeProvider",
		);
	}
	return ctx;
};
