"use client";

import React, { createContext, useContext, useState } from "react";

interface IconTileContextType {
	copiedCodeId: string | null;
	setCopiedCodeId: React.Dispatch<React.SetStateAction<string | null>>;
	copiedCliId: string | null;
	setCopiedCliId: React.Dispatch<React.SetStateAction<string | null>>;
	loadingId: string | null;
	setLoadingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const IconTileContext = createContext<IconTileContextType | undefined>(
	undefined,
);

export const IconTileProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
	const [copiedCliId, setCopiedCliId] = useState<string | null>(null);
	const [loadingId, setLoadingId] = useState<string | null>(null);

	return (
		<IconTileContext.Provider
			value={{
				copiedCodeId,
				setCopiedCodeId,
				copiedCliId,
				setCopiedCliId,
				loadingId,
				setLoadingId,
			}}
		>
			{children}
		</IconTileContext.Provider>
	);
};

export const useIconTileState = () => {
	const context = useContext(IconTileContext);
	if (!context) {
		throw new Error("useIconTileState must be used within an IconTileProvider");
	}
	return context;
};
