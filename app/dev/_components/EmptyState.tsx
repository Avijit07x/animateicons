import { CircleCheckIcon } from "@/icons/lucide/circle-check-icon";

type Props = { title: string; text: string };

const EmptyState: React.FC<Props> = ({ title, text }) => (
	<div className="bg-surface flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
		<span className="bg-surfaceElevated text-textSecondary grid size-12 place-items-center rounded-full">
			<CircleCheckIcon size={22} />
		</span>
		<p className="text-textPrimary text-sm font-medium">{title}</p>
		<p className="text-textMuted max-w-sm text-sm">{text}</p>
	</div>
);

export default EmptyState;
