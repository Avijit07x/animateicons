import { SearchIcon } from "@/icons/huge/search-icon";
import { cn } from "@/lib/utils";

type Props = {
	value: string;
	onChange: (value: string) => void;
	total: number;
	className?: string;
};

const SearchField: React.FC<Props> = ({
	value,
	onChange,
	total,
	className,
}) => (
	<label
		className={cn(
			"bg-surfaceElevated focus-within:bg-surfaceActive h-9 w-full items-center gap-2 rounded-full px-3.5 transition-colors",
			className,
		)}
	>
		<SearchIcon size={16} className="text-textMuted shrink-0" />
		<input
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={(e) => e.key === "Escape" && onChange("")}
			placeholder={`Search ${total} changed icons...`}
			aria-label="Search changed icons"
			className="placeholder:text-textMuted caret-primary min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none"
		/>
	</label>
);

export default SearchField;
