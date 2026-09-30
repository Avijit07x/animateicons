"use client";

import IconButton from "@/components/IconButton";
import { Chat01Icon } from "@/icons/huge/chat-0-1-icon";
import { Compass01Icon } from "@/icons/huge/compass-0-1-icon";
import { Home01Icon } from "@/icons/huge/home-0-1-icon";
import { UserIcon } from "@/icons/huge/user-icon";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TABS = [
	{ icon: Home01Icon, label: "Home" },
	{ icon: Compass01Icon, label: "Explore" },
	{ icon: Chat01Icon, label: "Messages" },
	{ icon: UserIcon, label: "Profile" },
];

const TabBarDemo: React.FC = () => {
	const [active, setActive] = useState(0);

	return (
		<div
			role="tablist"
			aria-label="App tabs"
			className="bg-surfaceElevated relative flex rounded-full p-1"
		>
			<span
				aria-hidden="true"
				className="bg-surfaceActive absolute inset-y-1 left-1 w-11 rounded-full transition-transform duration-300"
				style={{ transform: `translateX(${active * 100}%)` }}
			/>
			{TABS.map(({ icon, label }, i) => (
				<IconButton
					key={label}
					icon={icon}
					iconSize={20}
					role="tab"
					aria-selected={i === active}
					aria-label={label}
					onClick={() => setActive(i)}
					className={cn(
						"relative grid size-11 place-items-center rounded-full transition-colors",
						i === active
							? "text-primary"
							: "text-textMuted hover:text-textPrimary",
					)}
				/>
			))}
		</div>
	);
};

export default TabBarDemo;
