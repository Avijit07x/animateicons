/**
 * Per-icon detail page: /icons/[library]/[name]
 *
 * Generates a static page for every icon in both libraries (Lucide +
 * Huge). Each page is the canonical, shareable URL for one animated
 * icon — what Cmd+K search results, Google rich results, and social
 * shares all link to.
 *
 * Server component. Pre-renders shiki-highlighted code at build time
 * so we don't ship shiki to the browser. Reads from the same ICON_LIST
 * exports the gallery uses, so adding a new icon to the library
 * automatically gets a detail page on the next build with no
 * code changes here.
 */

import JsonLd from "@/components/JsonLd";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import BackButton from "../../_components/docs/BackButton";
import CopyButton from "./CopyButton";
import IconDetailPlayground from "./IconDetailPlayground";
import RelatedIconCard from "./RelatedIconCard";
import { buildIconJsonLd, buildIconMetadata } from "./_seo";

type LibraryKey = "lucide" | "huge";

const isLibrary = (v: string): v is LibraryKey =>
	v === "lucide" || v === "huge";

const getList = (lib: LibraryKey) =>
	lib === "lucide" ? LUCIDE_ICON_LIST : HUGE_ICON_LIST;

const getLibraryPrefix = (lib: LibraryKey) => (lib === "lucide" ? "lu" : "hu");

/** Convert "bell-ring" → "BellRingIcon" — same convention every icon
 *  source file follows when it names its forwardRef export. */
const componentNameFromSlug = (slug: string): string =>
	slug
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("") + "Icon";

const titleCase = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(" ");

/** Sibling icons that share a name prefix (e.g. for "bell" → bell-ring,
 *  bell-minus, bell-plus, bell-off). Capped at 6 so the section stays
 *  scannable on small screens. */
const findRelatedIcons = (
	library: LibraryKey,
	name: string,
): { name: string; icon: React.ElementType }[] => {
	const list = getList(library);
	const baseTokens = name.split("-");
	const root = baseTokens[0];

	const scored: { item: (typeof list)[number]; score: number }[] = [];
	for (const candidate of list) {
		if (candidate.name === name) continue;
		if (!candidate.name.startsWith(`${root}-`) && candidate.name !== root)
			continue;
		// More shared tokens = higher relevance.
		const candTokens = candidate.name.split("-");
		const sharedTokens = candTokens.filter((t) => baseTokens.includes(t)).length;
		scored.push({ item: candidate, score: sharedTokens });
	}
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, 6).map(({ item }) => ({
		name: item.name,
		icon: item.icon,
	}));
};

export function generateStaticParams() {
	const params: { library: string; name: string }[] = [];
	for (const item of LUCIDE_ICON_LIST) {
		params.push({ library: "lucide", name: item.name });
	}
	for (const item of HUGE_ICON_LIST) {
		params.push({ library: "huge", name: item.name });
	}
	return params;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ library: string; name: string }>;
}): Promise<Metadata> {
	const { library, name } = await params;
	if (!isLibrary(library)) return {};
	const item = getList(library).find((i) => i.name === name);
	if (!item) return {};
	return buildIconMetadata({
		library,
		name,
		componentName: componentNameFromSlug(name),
		keywords: item.keywords,
	});
}

type Props = {
	params: Promise<{ library: string; name: string }>;
};

const Page = async ({ params }: Props) => {
	const { library, name } = await params;
	if (!isLibrary(library)) notFound();

	const item = getList(library).find((i) => i.name === name);
	if (!item) notFound();

	const componentName = componentNameFromSlug(name);
	const prefix = getLibraryPrefix(library);
	const libDisplay = library === "lucide" ? "Lucide" : "Huge";

	const shadcnCmd = `pnpm dlx shadcn@latest add https://animateicons.in/r/${prefix}-${name}.json`;
	const npmCmd = `pnpm add @animateicons/react`;
	const usageCode = `import { ${componentName} } from "@animateicons/react/${library}";\n\nexport default function Demo() {\n\treturn <${componentName} size={24} color="#f45b48" />;\n}`;

	const [shadcnHtml, npmHtml, usageHtml] = await Promise.all([
		codeToHtml(shadcnCmd, { lang: "bash", theme: "github-dark-default" }),
		codeToHtml(npmCmd, { lang: "bash", theme: "github-dark-default" }),
		codeToHtml(usageCode, { lang: "tsx", theme: "github-dark-default" }),
	]);

	const related = findRelatedIcons(library, name);
	const jsonLd = buildIconJsonLd({
		library,
		name,
		componentName,
		keywords: item.keywords,
	});

	const SHIKI_RESET = "[&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-0!";
	const GLASS_CARD = cn(
		"relative overflow-hidden rounded-2xl",
		"border-border/60 border",
		"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
	);

	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-10 lg:py-16">
			<JsonLd data={jsonLd} />

			<div className="mb-6 flex items-center gap-3">
				<BackButton />
				<nav
					aria-label="Breadcrumb"
					className="text-textSecondary flex flex-wrap items-center gap-1.5 text-xs"
				>
					<Link
						href="/"
						className="hover:text-textPrimary transition-colors"
					>
						Home
					</Link>
					<span>/</span>
					<Link
						href={`/icons/${library}`}
						className="hover:text-textPrimary transition-colors"
					>
						{libDisplay}
					</Link>
					<span>/</span>
					<span className="text-textPrimary font-mono">{name}</span>
				</nav>
			</div>

			<header className="mb-8 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-textPrimary text-3xl font-semibold sm:text-4xl">
						{componentName}
					</h1>
					<p className="text-textSecondary mt-1.5 text-sm">
						{titleCase(name)} · {libDisplay} library
					</p>
				</div>
				<div className="text-textMuted flex items-center gap-2 text-[11px] tracking-wide uppercase">
					{item.category?.slice(0, 2).map((c) => (
						<span
							key={c}
							className="border-border/60 rounded-full border px-2 py-1"
						>
							{c}
						</span>
					))}
				</div>
			</header>

			<IconDetailPlayground
				Icon={item.icon}
				componentName={componentName}
				library={library}
			/>

			<section className="mt-10 space-y-3">
				<h2 className="text-textSecondary text-[11px] tracking-wide uppercase">
					Install — shadcn CLI
				</h2>
				<div className={GLASS_CARD}>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
					/>
					<div className="border-border/40 text-textSecondary flex items-center justify-between border-b px-4 py-2 text-[11px] tracking-wide uppercase">
						<span>Terminal</span>
						<CopyButton value={shadcnCmd} label="Copy install command" />
					</div>
					<div
						className={`overflow-x-auto px-4 py-3 text-sm ${SHIKI_RESET}`}
						dangerouslySetInnerHTML={{ __html: shadcnHtml }}
					/>
				</div>
			</section>

			<section className="mt-8 space-y-3">
				<h2 className="text-textSecondary text-[11px] tracking-wide uppercase">
					Install — npm package
				</h2>
				<div className={GLASS_CARD}>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
					/>
					<div className="border-border/40 text-textSecondary flex items-center justify-between border-b px-4 py-2 text-[11px] tracking-wide uppercase">
						<span>Terminal</span>
						<CopyButton value={npmCmd} label="Copy install command" />
					</div>
					<div
						className={`overflow-x-auto px-4 py-3 text-sm ${SHIKI_RESET}`}
						dangerouslySetInnerHTML={{ __html: npmHtml }}
					/>
				</div>
			</section>

			<section className="mt-8 space-y-3">
				<h2 className="text-textSecondary text-[11px] tracking-wide uppercase">
					Usage
				</h2>
				<div className={GLASS_CARD}>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
					/>
					<div className="border-border/40 text-textSecondary flex items-center justify-between border-b px-4 py-2 text-[11px] tracking-wide uppercase">
						<span>Demo.tsx</span>
						<CopyButton value={usageCode} label="Copy usage code" />
					</div>
					<div
						className={`overflow-x-auto px-4 py-3 text-xs leading-relaxed sm:text-sm ${SHIKI_RESET}`}
						dangerouslySetInnerHTML={{ __html: usageHtml }}
					/>
				</div>
			</section>

			{related.length > 0 && (
				<section className="mt-12 space-y-4">
					<h2 className="text-textSecondary text-[11px] tracking-wide uppercase">
						Related icons
					</h2>
					<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{related.map((rel) => (
							<li key={rel.name}>
								<RelatedIconCard
									href={`/icons/${library}/${rel.name}`}
									name={rel.name}
									Icon={rel.icon}
								/>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
};

export default Page;
