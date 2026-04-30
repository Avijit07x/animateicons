/**
 * ComposedProviders
 *
 * SRP: collapse a list of context providers into a single React tree so
 * the AnimateIcons /icons layout doesn't grow a JSX pyramid as we add
 * features (search, package-manager preference, playground, etc.).
 *
 * Order matters: the first entry is the OUTERMOST provider. Children of
 * the last entry receive context from every provider in the list.
 *
 * Usage in app/icons/layout.tsx:
 *   <ComposedProviders providers={[Sidebar, Category, IconSearch, ...]}>
 *     {children}
 *   </ComposedProviders>
 */

type ProviderComponent = React.FC<{ children: React.ReactNode }>;

type Props = {
	providers: ProviderComponent[];
	children: React.ReactNode;
};

const ComposedProviders: React.FC<Props> = ({ providers, children }) => {
	return providers.reduceRight<React.ReactNode>(
		(tree, Provider) => <Provider>{tree}</Provider>,
		children,
	);
};

export default ComposedProviders;
