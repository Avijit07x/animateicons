import React from "react";

export interface HugeIconProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
	strokeWidth?: number;
}

const HugeIcon: React.FC<HugeIconProps> = ({
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
			<path d="M2 9.5H22" />
			<path d="M20.5 9.5H3.5L4.23353 15.3682C4.59849 18.2879 4.78097 19.7477 5.77343 20.6239C6.76589 21.5 8.23708 21.5 11.1795 21.5H12.8205C15.7629 21.5 17.2341 21.5 18.2266 20.6239C19.219 19.7477 19.4015 18.2879 19.7665 15.3682L20.5 9.5Z" />
			<path d="M5 9C5 5.41015 8.13401 2.5 12 2.5C15.866 2.5 19 5.41015 19 9" />
		</svg>
	);
};

HugeIcon.displayName = "HugeIcon";

export default HugeIcon;
