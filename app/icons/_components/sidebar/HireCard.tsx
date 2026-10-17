import { SidebarFooter } from "@/components/ui/sidebar";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HIRE_URL } from "../../docs/_lib/links";

const HireCard: React.FC = () => {
	const { ref, triggerProps } = useIconHover();

	return (
		<SidebarFooter className="bg-bgDark border-border/60 border-t p-2">
			<Link
				href={HIRE_URL}
				target="_blank"
				rel="noopener noreferrer"
				{...triggerProps}
				className="bg-surface hover:bg-surfaceHover flex items-center gap-2.5 rounded-[18px] bg-[radial-gradient(120%_120%_at_100%_0%,rgb(244_91_72/0.14),transparent_60%)] p-2 transition-colors"
			>
				<Image
					src="/avijit07x.svg"
					alt=""
					width={32}
					height={32}
					className="size-8 shrink-0"
				/>
				<span className="min-w-0 flex-1">
					<span className="text-textPrimary block truncate text-[13px] leading-tight font-semibold">
						Frontend engineer
					</span>
					<span className="text-success mt-0.5 flex items-center gap-1.5 text-xs">
						<span className="relative flex size-1.5 shrink-0">
							<span className="bg-success/60 absolute inset-0 animate-ping rounded-full motion-reduce:hidden" />
							<span className="bg-success relative size-1.5 rounded-full" />
						</span>
						Available for hire
					</span>
				</span>
				<span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full text-(--cta-text)">
					<ArrowUpRight01Icon ref={ref} size={14} />
				</span>
			</Link>
		</SidebarFooter>
	);
};

export default HireCard;
