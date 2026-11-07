import fs from "node:fs/promises";
import path from "node:path";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AnimateIcons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type LibraryKey = "lucide" | "huge";

const isLibrary = (v: string): v is LibraryKey =>
	v === "lucide" || v === "huge";

const toComponentName = (s: string): string =>
	`${s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("")}Icon`;

const PRIMARY = "#f45b48";
const BG = "#0b0b0b";
const TEXT = "#e5e7eb";
const SUBTLE = "#7c7c7c";

const SHAPE_TAGS = [
	"path",
	"circle",
	"rect",
	"line",
	"ellipse",
	"polyline",
	"polygon",
] as const;
type ShapeTag = (typeof SHAPE_TAGS)[number];

const VALID_ATTRS = new Set([
	"d",
	"cx",
	"cy",
	"r",
	"rx",
	"ry",
	"x",
	"y",
	"x1",
	"y1",
	"x2",
	"y2",
	"width",
	"height",
	"points",
	"transform",
	"opacity",
	"fill",
	"stroke",
	"strokeWidth",
	"strokeLinecap",
	"strokeLinejoin",
]);

type Shape = { tag: ShapeTag; attrs: Record<string, string> };

const readIconShapes = async (
	library: LibraryKey,
	name: string,
): Promise<Shape[]> => {
	try {
		const filePath = path.join(
			process.cwd(),
			"icons",
			library,
			`${name}-icon.tsx`,
		);
		const source = await fs.readFile(filePath, "utf8");

		const tagPattern = SHAPE_TAGS.join("|");
		const elementRe = new RegExp(
			`<(?:motion\\.|m\\.)?(${tagPattern})\\b([^>]*?)/?>`,
			"g",
		);
		const attrRe = /(\w+)=(?:"([^"]*)"|'([^']*)'|\{\s*["']([^"']+)["']\s*\})/g;

		const shapes: Shape[] = [];
		for (const elMatch of source.matchAll(elementRe)) {
			const tag = elMatch[1] as ShapeTag;
			const attrsStr = elMatch[2] ?? "";
			const attrs: Record<string, string> = {};
			for (const aMatch of attrsStr.matchAll(attrRe)) {
				const [, key, dq, sq, expr] = aMatch;
				if (!VALID_ATTRS.has(key)) continue;
				attrs[key] = dq ?? sq ?? expr ?? "";
			}
			if (Object.keys(attrs).length === 0) continue;
			shapes.push({ tag, attrs });
		}
		return shapes;
	} catch {
		return [];
	}
};

const readLogoDataUrl = async (): Promise<string | null> => {
	try {
		const filePath = path.join(process.cwd(), "public", "logo.svg");
		const buf = await fs.readFile(filePath);
		return `data:image/svg+xml;base64,${buf.toString("base64")}`;
	} catch {
		return null;
	}
};

export default async function OGImage({
	params,
}: {
	params: Promise<{ library: string; name: string }>;
}) {
	const { library, name } = await params;

	const validLibrary = isLibrary(library) ? library : null;
	const list =
		validLibrary === "lucide"
			? LUCIDE_ICON_LIST
			: validLibrary === "huge"
				? HUGE_ICON_LIST
				: [];
	const item = list.find((i) => i.name === name);

	const componentName = item ? toComponentName(item.name) : "AnimateIcons";
	const libraryDisplay =
		validLibrary === "lucide"
			? "Lucide"
			: validLibrary === "huge"
				? "Huge"
				: "";

	const [iconShapes, logoDataUrl] = await Promise.all([
		validLibrary && item
			? readIconShapes(validLibrary, name)
			: Promise.resolve([] as Shape[]),
		readLogoDataUrl(),
	]);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: BG,
				backgroundImage: `radial-gradient(circle at 80% 20%, ${PRIMARY}25, transparent 60%), radial-gradient(circle at 20% 80%, ${PRIMARY}15, transparent 55%)`,
				padding: 64,
				fontFamily: "sans-serif",
				color: TEXT,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 14,
					fontSize: 22,
					fontWeight: 600,
					letterSpacing: -0.3,
				}}
			>
				{logoDataUrl ? (
					<img
						src={logoDataUrl}
						width={44}
						height={44}
						alt=""
						style={{ display: "block" }}
					/>
				) : (
					<div
						style={{
							width: 44,
							height: 44,
							borderRadius: 10,
							background: `linear-gradient(180deg, ${PRIMARY}, ${PRIMARY}cc)`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#ffffff",
							fontWeight: 700,
							fontSize: 22,
						}}
					>
						A
					</div>
				)}
				<span>AnimateIcons</span>
			</div>

			<div
				style={{
					display: "flex",
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 48,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: 16,
						flex: 1,
					}}
				>
					{libraryDisplay && (
						<div
							style={{
								display: "flex",
								padding: "6px 14px",
								borderRadius: 999,
								border: `1px solid ${PRIMARY}55`,
								color: PRIMARY,
								fontSize: 16,
								fontWeight: 600,
								letterSpacing: 1.4,
								textTransform: "uppercase",
							}}
						>
							{libraryDisplay}
						</div>
					)}
					<h1
						style={{
							fontSize: 88,
							fontWeight: 700,
							letterSpacing: -2,
							lineHeight: 1.05,
							margin: 0,
							color: TEXT,
						}}
					>
						{componentName}
					</h1>
					<p
						style={{
							fontSize: 26,
							color: SUBTLE,
							margin: 0,
							fontWeight: 400,
						}}
					>
						{item ? "Animated React icon" : "Free animated icons for React"}
					</p>
				</div>

				{iconShapes.length > 0 && (
					<div
						style={{
							display: "flex",
							width: 280,
							height: 280,
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 32,
							border: "1px solid rgba(255,255,255,0.1)",
							background:
								"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
							boxShadow:
								"inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -30px rgba(0,0,0,0.6)",
						}}
					>
						<svg
							width={140}
							height={140}
							viewBox="0 0 24 24"
							fill="none"
							stroke={PRIMARY}
							strokeWidth={1.6}
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							{iconShapes.map((shape, i) => {
								const Tag = shape.tag as React.ElementType;
								return <Tag key={i} {...shape.attrs} />;
							})}
						</svg>
					</div>
				)}
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 16,
					fontSize: 22,
					color: SUBTLE,
					fontFamily: "monospace",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						padding: "10px 18px",
						borderRadius: 14,
						border: "1px solid rgba(255,255,255,0.1)",
						background: "rgba(255,255,255,0.03)",
						color: TEXT,
					}}
				>
					pnpm add @animateicons/react
				</div>
				<span style={{ display: "flex" }}>animateicons.in</span>
			</div>
		</div>,
		{
			...size,
			headers: {
				"Cache-Control":
					"public, max-age=31536000, s-maxage=31536000, immutable",
			},
		},
	);
}
