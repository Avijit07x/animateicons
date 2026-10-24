import { useEffect, useState } from "react";
import { loadRegistry, type Registry } from "../_lib/registry";

export const useIconRegistry = () => {
	const [registry, setRegistry] = useState<Registry | null>(null);

	useEffect(() => {
		let alive = true;
		loadRegistry().then((loaded) => {
			if (alive) setRegistry(loaded);
		});
		return () => {
			alive = false;
		};
	}, []);

	return registry;
};
