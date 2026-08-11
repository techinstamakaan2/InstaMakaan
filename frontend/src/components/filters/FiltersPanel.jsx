import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
	RotateCcw,
	ChevronDown,
	Sparkles,
	Home,
	Sofa,
	Bath,
	Layers,
	Ruler,
	Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── tiny animated section wrapper ── */
const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
	const [open, setOpen] = useState(defaultOpen);
	const bodyRef = useRef(null);

	return (
		<div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#121a2f] transition-all duration-300">
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between px-4 py-3.5 text-left group"
			>
				<span className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-white">
					{Icon && (
						<span className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
							<Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
						</span>
					)}
					{title}
				</span>
				<ChevronDown
					className={cn(
						'w-4 h-4 text-slate-400 transition-transform duration-300',
						open && 'rotate-180',
					)}
				/>
			</button>
			<div
				ref={bodyRef}
				className={cn(
					'overflow-hidden transition-all duration-300 ease-in-out',
					open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0',
				)}
			>
				<div className="px-4 pb-4">{children}</div>
			</div>
		</div>
	);
};

/* ── pill toggle button ── */
const PillBtn = ({ label, active, onClick, className }) => (
	<button
		onClick={onClick}
		className={cn(
			'px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95',
			active
				? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20 scale-[1.02]'
				: 'bg-white dark:bg-[#0f172a] hover:bg-teal-50 dark:hover:bg-teal-500/5 hover:border-teal-300 dark:hover:border-teal-700 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300',
			className,
		)}
	>
		{label}
	</button>
);

/* ── checkbox row ── */
const CheckRow = ({ label, checked, onChange }) => (
	<label
		className={cn(
			'flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-200 cursor-pointer group',
			checked
				? 'bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-700'
				: 'bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10',
		)}
	>
		<Checkbox
			checked={checked}
			onCheckedChange={onChange}
			className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
		/>
		<span
			className={cn(
				'text-sm font-medium transition-colors',
				checked
					? 'text-teal-700 dark:text-teal-300'
					: 'text-slate-700 dark:text-slate-300',
			)}
		>
			{label}
		</span>
		{checked && (
			<span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
		)}
	</label>
);

/* ── active filter badge ── */
const ActiveBadge = ({ count }) => {
	if (!count) return null;
	return (
		<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold animate-bounce-once">
			{count}
		</span>
	);
};

const FiltersPanel = ({
	isMobile = false,
	filterTab,
	setFilterTab,
	beds,
	setBeds,
	toggleArray,
	priceRange,
	minPrice,
	maxPriceInput,
	handleMinInput,
	handleMaxInput,
	handleSliderChange,
	setPriceRange,
	maxRent,
	propertyTypes,
	setPropertyTypes,
	furnishing,
	setFurnishing,
	managedOnly,
	setManagedOnly,
	clearFilters,
}) => {
	/* local more-filters state */
	const [area, setArea] = useState([0, 10000]);
	const [propertyAge, setPropertyAge] = useState([]);
	const [showOnly, setShowOnly] = useState([]);
	const [bathrooms, setBathrooms] = useState([]);
	const [floors, setFloors] = useState([]);

	/* count active filters */
	const mainCount =
		beds.length +
		furnishing.length +
		(managedOnly ? 1 : 0) +
		(priceRange[0] > 0 || priceRange[1] < maxRent ? 1 : 0);
	const moreCount =
		propertyAge.length + showOnly.length + bathrooms.length + floors.length;

	/* price display */
	const formatPrice = (v) =>
		v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString()}`;

	return (
		<div className={cn('w-full', isMobile && 'pb-28')}>
			{/* ── TAB BAR ── */}
			<div className="flex items-center gap-2 mb-5">
				<div className="flex flex-1 rounded-xl bg-slate-100 dark:bg-[#0f172a] p-1 border border-slate-200 dark:border-white/10">
					{[
						{ key: 'filters', label: 'Filters', badge: mainCount },
						{ key: 'premium', label: 'More Filters', badge: moreCount },
					].map(({ key, label, badge }) => (
						<button
							key={key}
							onClick={() => setFilterTab(key)}
							className={cn(
								'flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-lg transition-all duration-200',
								filterTab === key
									? 'bg-white dark:bg-[#1b253b] shadow-md text-teal-700 dark:text-teal-400'
									: 'text-slate-500 dark:text-slate-400 hover:text-slate-700',
							)}
						>
							{label}
							{badge > 0 && (
								<span
									className={cn(
										'w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center transition-all',
										filterTab === key
											? 'bg-teal-600 text-white'
											: 'bg-slate-300 dark:bg-white/20 text-slate-600 dark:text-white',
									)}
								>
									{badge}
								</span>
							)}
						</button>
					))}
				</div>

				<button
					onClick={clearFilters}
					title="Reset all filters"
					className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 active:scale-95"
				>
					<RotateCcw className="w-3.5 h-3.5" />
					Reset
				</button>
			</div>

			{/* ════ MAIN FILTERS ════ */}
			{filterTab === 'filters' ? (
				<div className="space-y-3">
					{/* BHK */}
					<Section title="BHK Type" icon={Home} defaultOpen={true}>
						<div className="grid grid-cols-3 gap-2">
							{['1', '2', '3', '4', '5+'].map((b) => (
								<PillBtn
									key={b}
									label={b === '5+' ? '4+ BHK' : `${b} BHK`}
									active={beds.includes(b)}
									onClick={() => toggleArray(b, setBeds)}
								/>
							))}
						</div>
					</Section>

					{/* PRICE */}
					<Section title="Rent Range" icon={Sparkles} defaultOpen={true}>
						{/* Live price display */}
						<div className="flex items-center justify-between mb-4 px-1">
							<div className="text-center">
								<p className="text-[10px] text-slate-400 mb-0.5">Min</p>
								<p className="text-sm font-bold text-teal-600">
									{formatPrice(priceRange[0])}
								</p>
							</div>
							<div className="flex-1 mx-3 h-px bg-gradient-to-r from-teal-400 to-cyan-400 opacity-40" />
							<div className="text-center">
								<p className="text-[10px] text-slate-400 mb-0.5">Max</p>
								<p className="text-sm font-bold text-teal-600">
									{formatPrice(priceRange[1])}
								</p>
							</div>
						</div>

						<div className="px-1 mb-4">
							<Slider
								min={0}
								max={maxRent}
								step={500}
								value={priceRange}
								onValueChange={handleSliderChange}
								onValueCommit={(val) => setPriceRange(val)}
							/>
						</div>

						{/* Quick presets */}
						<div className="flex flex-wrap gap-1.5 mb-4">
							{[
								{ label: 'Under 15K', val: [0, 15000] },
								{ label: '15K–30K', val: [15000, 30000] },
								{ label: '30K–50K', val: [30000, 50000] },
								{ label: '50K+', val: [50000, maxRent] },
							].map(({ label, val }) => {
								const isActive =
									priceRange[0] === val[0] && priceRange[1] === val[1];
								return (
									<button
										key={label}
										onClick={() => {
											setPriceRange(val);
											handleSliderChange(val);
										}}
										className={cn(
											'px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-200 active:scale-95',
											isActive
												? 'bg-teal-600 text-white border-teal-600'
												: 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-teal-400',
										)}
									>
										{label}
									</button>
								);
							})}
						</div>

						{/* Manual inputs */}
						<div className="flex gap-2">
							<div className="flex-1">
								<p className="text-[10px] text-slate-400 mb-1 px-1">Min (₹)</p>
								<input
									type="number"
									value={minPrice}
									onChange={handleMinInput}
									className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-white focus:outline-none focus:border-teal-400 dark:focus:border-teal-600 transition-colors"
								/>
							</div>
							<div className="flex-1">
								<p className="text-[10px] text-slate-400 mb-1 px-1">Max (₹)</p>
								<input
									type="number"
									value={maxPriceInput}
									onChange={handleMaxInput}
									className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-white focus:outline-none focus:border-teal-400 dark:focus:border-teal-600 transition-colors"
								/>
							</div>
						</div>
					</Section>

					{/* FURNISHING */}
					<Section title="Furnishing" icon={Sofa} defaultOpen={true}>
						<div className="space-y-2">
							{['Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
								<CheckRow
									key={f}
									label={f}
									checked={furnishing.includes(f)}
									onChange={() => toggleArray(f, setFurnishing)}
								/>
							))}
						</div>
					</Section>

					{/* MANAGED */}
					<Section title="Show Only" icon={Star} defaultOpen={false}>
						<CheckRow
							label="Managed Homes Only"
							checked={managedOnly}
							onChange={() => setManagedOnly((p) => !p)}
						/>
						{managedOnly && (
							<p className="mt-2 text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1.5 px-1 animate-fade-in">
								<Sparkles className="w-3 h-3" />
								Showing only verified managed properties
							</p>
						)}
					</Section>

					{isMobile && (
						<div className="flex gap-3 pt-2">
							<Button
								variant="outline"
								onClick={clearFilters}
								className="w-full rounded-xl"
							>
								Clear All
							</Button>
							<Button
								variant="teal"
								className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white"
							>
								Apply Filters
								{mainCount > 0 && (
									<span className="ml-2 w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
										{mainCount}
									</span>
								)}
							</Button>
						</div>
					)}
				</div>
			) : (
				/* ════ MORE FILTERS ════ */
				<div className="space-y-3">
					{/* BUILT UP AREA */}
					<Section
						title="Built Up Area (sq.ft.)"
						icon={Ruler}
						defaultOpen={true}
					>
						<div className="flex items-center justify-between mb-4 px-1">
							<span className="text-xs font-semibold text-teal-600">
								{area[0].toLocaleString()} sq.ft
							</span>
							<span className="text-xs font-semibold text-teal-600">
								{area[1].toLocaleString()} sq.ft
							</span>
						</div>
						<div className="px-1 mb-4">
							<Slider
								min={0}
								max={10000}
								step={100}
								value={area}
								onValueChange={setArea}
							/>
						</div>
						<div className="flex gap-2">
							<div className="flex-1">
								<p className="text-[10px] text-slate-400 mb-1 px-1">Min</p>
								<input
									value={area[0]}
									onChange={(e) => setArea([+e.target.value, area[1]])}
									className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-[#0f172a] focus:outline-none focus:border-teal-400 transition-colors"
									placeholder="0"
								/>
							</div>
							<div className="flex-1">
								<p className="text-[10px] text-slate-400 mb-1 px-1">Max</p>
								<input
									value={area[1]}
									onChange={(e) => setArea([area[0], +e.target.value])}
									className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-[#0f172a] focus:outline-none focus:border-teal-400 transition-colors"
									placeholder="10,000"
								/>
							</div>
						</div>
					</Section>

					{/* PROPERTY AGE */}
					<Section title="Property Age" icon={Layers} defaultOpen={true}>
						<div className="grid grid-cols-2 gap-2">
							{[
								'< 1 year',
								'1–3 years',
								'3–5 years',
								'5–10 years',
								'10+ years',
							].map((t) => (
								<PillBtn
									key={t}
									label={t}
									active={propertyAge.includes(t)}
									onClick={() =>
										setPropertyAge((prev) =>
											prev.includes(t)
												? prev.filter((x) => x !== t)
												: [...prev, t],
										)
									}
								/>
							))}
						</div>
					</Section>

					{/* BATHROOM */}
					<Section title="Bathrooms" icon={Bath} defaultOpen={false}>
						<div className="flex flex-wrap gap-2">
							{['1+', '2+', '3+'].map((t) => (
								<PillBtn
									key={t}
									label={t}
									active={bathrooms.includes(t)}
									onClick={() =>
										setBathrooms((prev) =>
											prev.includes(t)
												? prev.filter((x) => x !== t)
												: [...prev, t],
										)
									}
									className="flex-1"
								/>
							))}
						</div>
					</Section>

					{/* FLOORS */}
					<Section title="Floor" icon={Layers} defaultOpen={false}>
						<div className="grid grid-cols-3 gap-2">
							{['Ground', '1–3', '4–6', '7–9', '10+', 'Top'].map((t) => (
								<PillBtn
									key={t}
									label={t}
									active={floors.includes(t)}
									onClick={() =>
										setFloors((prev) =>
											prev.includes(t)
												? prev.filter((x) => x !== t)
												: [...prev, t],
										)
									}
								/>
							))}
						</div>
					</Section>

					{/* SHOW ONLY */}
					<Section title="Amenities" icon={Star} defaultOpen={false}>
						<div className="grid grid-cols-2 gap-2">
							{[
								'Gated Society',
								'Non-Veg OK',
								'With Photos',
								'Gym',
								'Parking',
								'Lift',
							].map((t) => (
								<PillBtn
									key={t}
									label={t}
									active={showOnly.includes(t)}
									onClick={() =>
										setShowOnly((prev) =>
											prev.includes(t)
												? prev.filter((x) => x !== t)
												: [...prev, t],
										)
									}
								/>
							))}
						</div>
					</Section>

					{isMobile && (
						<div className="flex gap-3 pt-2">
							<Button
								variant="outline"
								onClick={() => {
									setPropertyAge([]);
									setShowOnly([]);
									setBathrooms([]);
									setFloors([]);
									setArea([0, 10000]);
								}}
								className="w-full rounded-xl"
							>
								Clear
							</Button>
							<Button
								variant="teal"
								className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white"
							>
								Apply
								{moreCount > 0 && (
									<span className="ml-2 w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
										{moreCount}
									</span>
								)}
							</Button>
						</div>
					)}
				</div>
			)}

			<style>{`
				@keyframes fade-in {
					from { opacity: 0; transform: translateY(-4px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in { animation: fade-in 0.25s ease both; }

				@keyframes bounce-once {
					0%   { transform: scale(1); }
					40%  { transform: scale(1.3); }
					70%  { transform: scale(0.9); }
					100% { transform: scale(1); }
				}
				.animate-bounce-once { animation: bounce-once 0.4s ease both; }
			`}</style>
		</div>
	);
};

export default FiltersPanel;
