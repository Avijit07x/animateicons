import fs from "fs";
import { ImageResponse } from "next/og";
import path from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
	const iconPath = path.join(process.cwd(), "src/app/logo.svg");
	const iconSvg = fs.readFileSync(iconPath, "utf8");

	return new ImageResponse(
		(
			<img
				src={`data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`}
				width={32}
				height={32}
			/>
		),
		size,
	);
}
