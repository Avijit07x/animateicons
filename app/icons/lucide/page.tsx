"use client";

import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import IconList from "../_components/IconList";
import Navbar from "../_components/Navbar";
type Props = {};

const page: React.FC<Props> = () => {
	const [query, setQuery] = useState<string>("");
	const [debouncedQuery] = useDebounce(query, 300);
	return (
		<>
			<div className="flex w-full flex-col">
				<Navbar setQuery={setQuery} query={query} />
				<main className="px-3 py-3">
					<IconList query={debouncedQuery} />
				</main>
			</div>
		</>
	);
};

export default page;
