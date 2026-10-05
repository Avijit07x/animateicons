export const MAIN_CONTENT_ID = "main-content";

const SkipLink: React.FC = () => (
	<a
		href={`#${MAIN_CONTENT_ID}`}
		className="bg-bgDark text-textPrimary border-border/60 focus-visible:ring-primary/60 sr-only font-mono text-xs tracking-wider uppercase focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-110 focus:border focus:px-4 focus:py-2 focus-visible:ring-2 focus-visible:outline-none"
	>
		Skip to content
	</a>
);

export default SkipLink;
