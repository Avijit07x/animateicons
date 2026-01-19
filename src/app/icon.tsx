import fs from "fs";
import { ImageResponse } from "next/og";
import path from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
	const iconPath = path.join(process.cwd(), "src/app/favicon.png");
	const iconBuffer = fs.readFileSync(iconPath);

	return new ImageResponse(
		(
			<img
				src={`data:image/png;base64,${iconBuffer.toString("base64")}`}
				width={32}
				height={32}
			/>
		),
		size,
	);
}
