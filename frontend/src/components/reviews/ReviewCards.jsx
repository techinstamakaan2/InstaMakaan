import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const reviews = [
	{
		id: 1,
		role: 'Tenant',
		name: 'Rohit Sharma',
		city: 'Bangalore',
		rating: 5,
		review: 'I was searching for a fully furnished flat near my office and came across InstaMakaan. The platform made everything incredibly easy.',
	},
	{
		id: 2,
		role: 'Owner',
		name: 'Amit Verma',
		city: 'Mumbai',
		rating: 5,
		review: 'As a property owner, finding reliable tenants used to be difficult. InstaMakaan simplified the process completely.',
	},
	{
		id: 3,
		role: 'Tenant',
		name: 'Priya Kapoor',
		city: 'Delhi',
		rating: 4,
		review: 'I relocated to Bangalore for work and was worried about accommodation. InstaMakaan helped me find a comfortable place quickly.',
	},
	{
		id: 4,
		role: 'Owner',
		name: 'Rahul Mehta',
		city: 'Pune',
		rating: 5,
		review: 'The platform made renting my property extremely easy. I received verified tenant leads within days.',
	},
];

const ROLE_COLOR = {
	Tenant: { bg: 'bg-teal-50 dark:bg-teal-900/30',   text: 'text-teal-600 dark:text-teal-400',   dot: '#14b8a6' },
	Owner:  { bg: 'bg-amber-50 dark:bg-amber-900/30',  text: 'text-amber-600 dark:text-amber-400',  dot: '#f59e0b' },
	Agent:  { bg: 'bg-violet-50 dark:bg-violet-900/30',text: 'text-violet-600 dark:text-violet-400', dot: '#7c3aed' },
};

function Initials({ name, size = 'md' }) {
	const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
	const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm';
	return (
		<div className={`${sz} rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center font-bold text-white flex-shrink-0`}>
			{initials}
		</div>
	);
}

function Stars({ count, total = 5 }) {
	return (
		<div className="flex gap-0.5">
			{Array.from({ length: total }).map((_, i) => (
				<Star key={i} size={13} className={i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'} />
			))}
		</div>
	);
}

export default function ReviewCards() {
	const [active, setActive]   = useState(0);
	const [filter, setFilter]   = useState('All');
	const touchStartX           = useRef(null);

	const filtered = filter === 'All' ? reviews : reviews.filter(r => r.role === filter);
	const safeActive = Math.min(active, filtered.length - 1);
	const current = filtered[safeActive];

	const next = () => setActive(p => (p + 1) % filtered.length);
	const prev = () => setActive(p => (p - 1 + filtered.length) % filtered.length);

	const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
	const onTouchEnd   = e => {
		if (touchStartX.current === null) return;
		const diff = touchStartX.current - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
		touchStartX.current = null;
	};

	const rc = ROLE_COLOR[current?.role] || ROLE_COLOR.Tenant;

	return (
		<section className="py-10 md:py-20 bg-white dark:bg-[#07101d]">
			<div className="max-w-5xl mx-auto px-4 md:px-6">

				{/* ── HEADING ── */}
				<div className="mb-6 md:mb-10">
					<h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
						Our Happy Customers
					</h2>
					<p className="text-sm text-gray-400 mt-1">Real experiences from real people</p>
				</div>

				{/* ── FILTERS ── */}
				<div className="flex gap-2 mb-6 md:mb-8">
					{['All', 'Tenant', 'Owner'].map(tab => (
						<button
							key={tab}
							onClick={() => { setFilter(tab); setActive(0); }}
							className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
								filter === tab
									? 'bg-teal-500 text-white shadow-sm'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* ══════════ MOBILE LAYOUT ══════════ */}
				<div
					className="md:hidden"
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
				>
					{/* Main card */}
					<div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#111827] p-5 relative overflow-hidden">
						{/* subtle teal line on left */}
						<div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-teal-400 to-emerald-500" />

						{/* Quote icon top-right */}
						<Quote size={32} className="absolute top-4 right-4 text-gray-100 dark:text-white/5" />

						{/* Stars */}
						<Stars count={current?.rating} />

						{/* Review text */}
						<p className="mt-3 mb-5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
							"{current?.review}"
						</p>

						{/* Author row */}
						<div className="flex items-center gap-3">
							<Initials name={current?.name || 'U'} />
							<div>
								<p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{current?.name}</p>
								<p className="text-xs text-gray-400 mt-0.5">{current?.role} · {current?.city}</p>
							</div>
						</div>
					</div>

					{/* Nav row */}
					<div className="flex items-center justify-between mt-4 px-1">
						<button onClick={prev} className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] flex items-center justify-center text-gray-600 dark:text-gray-300 active:scale-90 transition">
							<ChevronLeft size={17} />
						</button>

						{/* dots */}
						<div className="flex gap-1.5">
							{filtered.map((_, i) => (
								<button
									key={i}
									onClick={() => setActive(i)}
									style={{
										width: i === safeActive ? '20px' : '6px',
										height: '6px',
										borderRadius: '999px',
										background: i === safeActive ? '#14b8a6' : '#e2e8f0',
										transition: 'all .3s',
									}}
								/>
							))}
						</div>

						<button onClick={next} className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center active:scale-90 transition shadow-sm">
							<ChevronRight size={17} />
						</button>
					</div>

					{/* Person chips */}
					<div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
						{filtered.map((r, i) => (
							<button
								key={r.id}
								onClick={() => setActive(i)}
								className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
									i === safeActive
										? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300'
										: 'bg-white dark:bg-[#111827] border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400'
								}`}
							>
								<Initials name={r.name} size="sm" />
								{r.name.split(' ')[0]}
							</button>
						))}
					</div>
				</div>

				{/* ══════════ DESKTOP LAYOUT ══════════ */}
				<div className="hidden md:grid md:grid-cols-[280px_1fr] gap-6 items-start">

					{/* LEFT — minimal list */}
					<div className="space-y-2">
						{filtered.map((r, i) => (
							<button
								key={r.id}
								onClick={() => setActive(i)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
									i === safeActive
										? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800'
										: 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'
								}`}
							>
								<Initials name={r.name} />
								<div className="min-w-0">
									<p className={`text-sm font-semibold truncate ${i === safeActive ? 'text-teal-700 dark:text-teal-300' : 'text-gray-800 dark:text-gray-200'}`}>
										{r.name}
									</p>
									<p className="text-xs text-gray-400 truncate">{r.role} · {r.city}</p>
								</div>
								{i === safeActive && (
									<div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
								)}
							</button>
						))}
					</div>

					{/* RIGHT — review card */}
					<div className={`rounded-2xl p-8 border relative overflow-hidden transition-all ${rc.bg} border-gray-100 dark:border-white/10`}>
						{/* accent strip */}
						<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400" />

						<Quote size={40} className="text-gray-200 dark:text-white/10 mb-4" />

						<Stars count={current?.rating} />

						<p className="mt-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
							"{current?.review}"
						</p>

						<div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
							<Initials name={current?.name || 'U'} />
							<div>
								<p className="text-sm font-bold text-gray-900 dark:text-white">{current?.name}</p>
								<p className={`text-xs font-medium ${rc.text}`}>{current?.role} · {current?.city}</p>
							</div>
						</div>
					</div>
				</div>

			</div>
		</section>
	);
}
