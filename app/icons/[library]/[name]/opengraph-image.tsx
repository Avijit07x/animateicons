/**
 * Per-icon Open Graph image generator.
 *
 * Next.js auto-wires this file: visiting /icons/lucide/bell-ring's
 * social meta produces /icons/lucide/bell-ring/opengraph-image as the
 * og:image URL. The image is rendered via Satori (next/og) at request
 * time and cached by the CDN.
 *
 * For Lucide icons we render the matching component from lucide-react
 * inside the card so the social preview shows the actual icon glyph.
 * For Huge icons we don't have a matching static-SVG package, so we
 * fall back to a brand-led card with the icon name large — still
 * unique per URL, just without the glyph.
 *
 * Output: 1200×630 PNG, the standard OG card size (Twitter / LinkedIn /
 * Slack / Discord / iMessage all crop to this aspect).
 */

import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { ImageResponse } from "next/og";
import * as Lucide from "lucide-react";

// Node runtime instead of edge — `import * as Lucide` pulls every
// lucide-react icon, which exceeds Vercel's 1MB edge function limit.
// Node functions on Vercel allow up to 50MB. The OG image is cached
// by the CDN per URL, so the slower cold start is paid once.
export const runtime = "nodejs";
export const alt = "AnimateIcons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type LibraryKey = "lucide" | "huge";

const isLibrary = (v: string): v is LibraryKey =>
	v === "lucide" || v === "huge";

/** "bell-ring" → "BellRing" for lucide-react export lookup. */
const toPascalCase = (s: string): string =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");

/** "bell-ring" → "BellRingIcon" — the AnimateIcons component name. */
const toComponentName = (s: string): string => `${toPascalCase(s)}Icon`;

const PRIMARY = "#f45b48";
const BG = "#0b0b0b";
const TEXT = "#e5e7eb";
const SUBTLE = "#7c7c7c";

export default async function OGImage({
	params,
}: {
	params: Promise<{ library: string; name: string }>;
}) {
	const { library, name } = await params;

	// Validate the icon exists; otherwise render a generic AnimateIcons
	// card so we never serve a broken OG image.
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

	// Pull the matching glyph from lucide-react when applicable.
	let GlyphComponent: React.ComponentType<{
		size?: number;
		color?: string;
		strokeWidth?: number;
	}> | null = null;
	if (validLibrary === "lucide" && item) {
		const exportKey = toPascalCase(item.name);
		const candidate = (Lucide as Record<string, unknown>)[exportKey];
		if (typeof candidate === "function" || typeof candidate === "object") {
			GlyphComponent = candidate as React.ComponentType<{
				size?: number;
				color?: string;
				strokeWidth?: number;
			}>;
		}
	}

	return new ImageResponse(
		(
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
				{/* Top brand row */}
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
					<div
						style={{
							width: 40,
							height: 40,
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

					{/* Glyph card (lucide only) */}
					{GlyphComponent && (
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
								color: PRIMARY,
							}}
						>
							<GlyphComponent size={140} strokeWidth={1.6} />
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
			</div>
		),
		{
			...size,
		},
	);
}
