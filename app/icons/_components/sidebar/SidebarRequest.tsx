"use client";

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

const SidebarRequest: React.FC = () => {
	return (
		<SidebarGroup className="mt-auto">
			<SidebarGroupContent>
				<div className="border-border/50 bg-surface/50 rounded-lg border p-3">
					<p className="text-textPrimary text-sm font-medium">
						Missing an icon?
					</p>

					<p className="text-textMuted mt-1 text-xs">
						Request it or suggest one.
					</p>

					<div className="mt-3 space-y-2">
						<Link
							href="https://discord.com/users/486217717238726656"
							target="_blank"
							className="border-border bg-surfaceHover text-textPrimary hover:bg-surfaceElevated block w-full rounded-md border px-3 py-1.5 text-center text-xs font-medium transition"
						>
							Message on Discord
						</Link>

						<Link
							href="https://github.com/Avijit07x/animateicons/issues"
							target="_blank"
							className="text-textSecondary hover:text-textPrimary block text-center text-xs font-medium transition"
						>
							Suggest on GitHub
						</Link>
					</div>
				</div>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};

export default SidebarRequest;
