import React from "react";

export interface LucideIconProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
	strokeWidth?: number;
}

const LucideIcon: React.FC<LucideIconProps> = ({
	size = 24,
	strokeWidth = 2,
	className,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<path d="M14 12a4 4 0 0 0-8 0 8 8 0 1 0 16 0 11.97 11.97 0 0 0-4-8.944" />
			<path d="M10 12a4 4 0 0 0 8 0 8 8 0 1 0-16 0 11.97 11.97 0 0 0 4.063 9" />
		</svg>
	);
};

LucideIcon.displayName = "LucideIcon";

export default LucideIcon;
