import CartDemo from "./in-use/CartDemo";
import LikeDemo from "./in-use/LikeDemo";
import PlayerDemo from "./in-use/PlayerDemo";
import TabBarDemo from "./in-use/TabBarDemo";

const TILES = [
	{ label: "Toolbar", Demo: TabBarDemo },
	{ label: "Product card", Demo: CartDemo },
	{ label: "Player", Demo: PlayerDemo },
	{ label: "Like button", Demo: LikeDemo },
];

const InUse: React.FC = () => (
	<section aria-label="In real interfaces" className="home-section">
		<div className="mx-auto max-w-7xl px-6">
			<h2 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
				Made for real interfaces<span className="text-primary">.</span>
			</h2>
			<p className="text-textSecondary mx-auto mt-3.5 max-w-xl leading-relaxed max-sm:text-[15px]">
				Drop them into the toolbars, players and carts you already build.
			</p>

			<div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{TILES.map(({ label, Demo }) => (
					<div
						key={label}
						className="bg-surface flex h-56 flex-col items-center justify-between rounded-3xl p-5 sm:h-64 sm:p-6"
					>
						<div className="grid w-full flex-1 place-items-center">
							<Demo />
						</div>
						<p className="text-textMuted text-sm">{label}</p>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default InUse;
