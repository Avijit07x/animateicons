"use client";

import type { Variants } from "motion/react";
import { m } from "motion/react";
import { useId } from "react";

type Props = {
	duration: number;
};

const FUR = "#f6f8fb";
const FUR_SHADE = "#dbe3ee";

const WinterHat: React.FC<Props> = ({ duration }) => {
	const gradientId = useId();

	const swingVariants: Variants = {
		normal: { rotate: 0 },
		animate: {
			rotate: [0, -3, 1.5, 0],
			transition: {
				duration: 1.1 * duration,
				times: [0, 0.3, 0.65, 1],
				ease: "easeInOut",
			},
		},
	};

	const pomVariants: Variants = {
		normal: { rotate: 0 },
		animate: {
			rotate: [0, 16, -11, 6, 0],
			transition: {
				duration: 1.1 * duration,
				times: [0, 0.25, 0.5, 0.75, 1],
				ease: "easeInOut",
			},
		},
	};

	return (
		<g className="animate-in fade-in duration-700">
			<g transform="translate(256.8 193.6) rotate(-40) scale(-1.1 1.1)">
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="#e5303c" />
						<stop offset="1" stopColor="#bb1b29" />
					</linearGradient>
				</defs>
				<m.g
					variants={swingVariants}
					style={{ transformBox: "view-box", originX: "0px", originY: "0px" }}
				>
					<path
						d="M -178 -20 C -176 -150 -98 -252 16 -292 C 104 -320 190 -286 222 -214 C 244 -164 224 -96 186 -20 Z"
						fill={`url(#${gradientId})`}
					/>
					<path
						d="M 84 -300 C 168 -300 232 -246 220 -150 C 214 -96 196 -52 186 -20 L 120 -20 C 168 -110 170 -230 84 -300 Z"
						fill="#9f1522"
						opacity={0.55}
					/>
					<m.g
						variants={pomVariants}
						style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
					>
						<circle cx="226" cy="-168" r="50" fill={FUR} />
						<circle cx="238" cy="-156" r="30" fill={FUR_SHADE} opacity={0.7} />
					</m.g>
				</m.g>
				<rect x="-214" y="-66" width="428" height="112" rx="56" fill={FUR} />
				<rect
					x="-214"
					y="6"
					width="428"
					height="40"
					rx="20"
					fill={FUR_SHADE}
					opacity={0.65}
				/>
			</g>
		</g>
	);
};

export default WinterHat;
