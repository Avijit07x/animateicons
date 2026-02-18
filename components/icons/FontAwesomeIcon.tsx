import React from "react";

export interface FontAwesomeIconProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
}

const FontAwesomeIcon: React.FC<FontAwesomeIconProps> = ({
	size = 24,
	className,
}) => {
	return (
		<svg
			data-prefix="fac"
			data-icon="font-awesome-logo"
			role="img"
			viewBox="0 0 16 16"
			aria-hidden="true"
			className="svg-inline--fa fa-font-awesome-logo fa-lg"
		>
			<path
				fill="currentColor"
				d="M2.86642 3C3.32224 2.71217 3.625 2.20394 3.625 1.625C3.625 0.72754 2.89746 0 2 0C1.10254 0 0.375 0.72754 0.375 1.625C0.375 2.14533 0.61956 2.60854 1 2.90596V16H3V14H14.6751C15.1307 14 15.5 13.6307 15.5 13.1751C15.5 13.0596 15.4758 12.9455 15.4289 12.84L13.5 8.5L15.4289 4.15998C15.4758 4.0545 15.5 3.94036 15.5 3.82494C15.5 3.36934 15.1307 3 14.6751 3H2.86642Z"
				className={className}
			></path>
		</svg>
	);
};

FontAwesomeIcon.displayName = "FontAwesomeIcon";

export default FontAwesomeIcon;
