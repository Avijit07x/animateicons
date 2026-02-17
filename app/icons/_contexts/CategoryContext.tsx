"use client";

import React, {
	createContext,
	SetStateAction,
	useContext,
	useState,
} from "react";

interface CategoryContextValue {
	category: string;
	setCategory: React.Dispatch<SetStateAction<string>>;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

type Props = { children: React.ReactNode };

const CategoryContextProvider: React.FC<Props> = ({ children }) => {
	const [category, setCategory] = useState<string>("all");

	return (
		<CategoryContext.Provider value={{ category, setCategory }}>
			{children}
		</CategoryContext.Provider>
	);
};

export default CategoryContextProvider;

export const useCategory = () => {
	const ctx = useContext(CategoryContext);
	if (!ctx) {
		throw new Error("useCategory must be used inside CategoryContextProvider");
	}
	return ctx;
};
