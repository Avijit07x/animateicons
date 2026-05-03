/**
 * Per-icon Open Graph image generator.
 *
 * Visiting /icons/lucide/bell-ring's social meta produces this route as
 * the og:image URL. The image is rendered via Satori (next/og) at
 * request time and cached by the CDN per URL.
 *
 * Strategy for the glyph: instead of importing lucide-react (which has
 * mismatched names like "Dashboard" → "LayoutDashboard" + ships ~250KB
 * to the function), we read the project's own icon source file from
 * disk and extract its `d="…"` path data with a regex. That guarantees
 * every icon — including custom ones not in lucide-react — renders
 * with its actual shape.
 *
 * Strategy for the brand: read public/logo.svg as base64 so the OG
 * shows the real AnimateIcons mark instead of a generic "A" placeholder.
 *
 * Output: 1200×630 PNG.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { ImageResponse } from "next/og";

// Node runtime — `fs` access for icon source + logo, plus larger size
// budget than edge (50MB on Vercel Hobby).
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

/** Every SVG shape primitive an AnimateIcons source might use. Some
 *  icons are pure `<path>`, others mix `<circle>`, `<rect>`, `<line>`,
 *  `<ellipse>`, `<polyline>`, `<polygon>` — all need to be picked up. */
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

/** Whitelist of standard SVG presentation attrs we forward to the OG.
 *  Keeps motion-specific props (variants/animate/initial/transition)
 *  from leaking into Satori's render. */
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

/** Read the icon source file and extract every shape primitive plus
 *  its attributes. Handles `<path>`, `<motion.path>`, and the rest. */
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
		// Match `<path>`, `<motion.path>`, and `<m.path>` (the lazy
		// motion variant). The latter is what every icon source uses
		// after the LazyMotion size-optimization codemod.
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
			// Skip shapes with no useful geometry — e.g., `<motion.path variants={...} />`
			// without a `d` attribute, or `<circle>` with no cx/cy.
			if (Object.keys(attrs).length === 0) continue;
			shapes.push({ tag, attrs });
		}
		return shapes;
	} catch {
		return [];
	}
};

/** Read /public/logo.svg as a base64 data URL. Returns null if the
 *  file is missing so the OG card still renders without it. */
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
			{/* Brand row */}
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
					// eslint-disable-next-line @next/next/no-img-element
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

			{/* Center content */}
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

				{/* Glyph card — uses the project's actual icon shapes from disk */}
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
								// Render each captured shape with its attributes. Cast
								// because TS can't narrow the dynamic tag → element map.
								const Tag = shape.tag as React.ElementType;
								return <Tag key={i} {...shape.attrs} />;
							})}
						</svg>
					</div>
				)}
			</div>

			{/* Bottom install hint */}
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
		},
	);
}
