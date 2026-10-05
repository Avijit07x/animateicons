import JsonLd from "@/components/JsonLd";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackButton from "../../_components/docs/BackButton";
import IconDetailPlayground from "./IconDetailPlayground";
import RelatedIconCard from "./RelatedIconCard";
import { buildIconJsonLd, buildIconMetadata } from "./_seo";

type LibraryKey = "lucide" | "huge";

const isLibrary = (v: string): v is LibraryKey =>
	v === "lucide" || v === "huge";

const getList = (lib: LibraryKey) =>
	lib === "lucide" ? LUCIDE_ICON_LIST : HUGE_ICON_LIST;

const getLibraryPrefix = (lib: LibraryKey) => (lib === "lucide" ? "lu" : "hu");

const componentNameFromSlug = (slug: string): string =>
	slug
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("") + "Icon";

const RELATED_LIMIT = 6;

const nameTokens = (name: string) =>
	name.split("-").filter((token) => !/^\d+$/.test(token));

const findRelatedIcons = (
	library: LibraryKey,
	name: string,
): { name: string; icon: React.ElementType }[] => {
	const list = getList(library);
	const current = list.find((candidate) => candidate.name === name);
	const root = name.split("-")[0];
	const tokens = new Set(nameTokens(name));
	const keywords = new Set(current?.keywords?.map((k) => k.toLowerCase()));
	const categories = new Set(current?.category);

	const family: typeof list = [];
	const others: { item: (typeof list)[number]; score: number }[] = [];
	for (const candidate of list) {
		if (candidate.name === name) continue;
		if (candidate.name === root || candidate.name.startsWith(`${root}-`)) {
			family.push(candidate);
			continue;
		}
		const sharedTokens = nameTokens(candidate.name).filter((t) =>
			tokens.has(t),
		).length;
		const sharedKeywords =
			candidate.keywords?.filter((k) => keywords.has(k.toLowerCase())).length ??
			0;
		if (sharedTokens + sharedKeywords === 0) continue;
		const sharedCategory = candidate.category?.some((c) => categories.has(c));
		others.push({
			item: candidate,
			score: sharedTokens * 5 + sharedKeywords * 2 + (sharedCategory ? 1 : 0),
		});
	}
	others.sort((a, b) => b.score - a.score);

	return [...family, ...others.map(({ item }) => item)]
		.slice(0, RELATED_LIMIT)
		.map((item) => ({ name: item.name, icon: item.icon }));
};

export const dynamicParams = false;

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

	const related = findRelatedIcons(library, name);
	const jsonLd = buildIconJsonLd({
		library,
		name,
		componentName,
		keywords: item.keywords,
	});

	return (
		<main
			id={MAIN_CONTENT_ID}
			className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-6 lg:py-12"
		>
			<JsonLd data={jsonLd} />

			<div className="mb-10 flex items-center gap-3">
				<BackButton />
				<nav
					aria-label="Breadcrumb"
					className="text-textMuted flex flex-wrap items-center gap-2 text-sm"
				>
					<Link href="/" className="hover:text-textPrimary transition-colors">
						Home
					</Link>
					<span aria-hidden="true">/</span>
					<Link
						href={`/icons/${library}`}
						className="hover:text-textPrimary transition-colors"
					>
						{libDisplay}
					</Link>
					<span aria-hidden="true">/</span>
					<span className="text-textPrimary">{name}</span>
				</nav>
			</div>

			<header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
							{componentName}
						</h1>
						<span className="bg-surfaceElevated text-textSecondary rounded-full px-3 py-1 text-xs font-medium">
							{libDisplay}
						</span>
					</div>
					<p className="text-textSecondary mt-3 text-base">
						Animated icon from the {libDisplay} library. Tweak it, then copy the
						code.
					</p>
				</div>

				{!!(item.category?.length || item.keywords?.length) && (
					<div className="flex flex-wrap items-center gap-2 lg:max-w-lg lg:justify-end">
						{item.category?.slice(0, 2).map((c) => (
							<span
								key={c}
								className="bg-primary/12 text-primary rounded-full px-3 py-1 text-xs font-medium"
							>
								{c}
							</span>
						))}
						{item.keywords?.slice(0, 4).map((k) => (
							<span
								key={k}
								className="text-textSecondary rounded-full bg-white/6 px-3 py-1 text-xs"
							>
								{k}
							</span>
						))}
					</div>
				)}
			</header>

			<IconDetailPlayground
				Icon={item.icon}
				componentName={componentName}
				library={library}
				prefix={prefix}
				name={name}
			/>

			{related.length > 0 && (
				<section className="mt-14 space-y-4">
					<h2 className="text-textMuted text-sm">Related icons</h2>
					<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
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
		</main>
	);
};

export default Page;
