import React, { useState, useMemo } from 'react';
import { ArrowRight, TrendingDown, Banknote, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fmt = (n) =>
	n >= 10000000
		? `₹${(n / 10000000).toFixed(2)} Cr`
		: n >= 100000
		? `₹${(n / 100000).toFixed(1)} L`
		: `₹${n.toLocaleString('en-IN')}`;

/* Smooth custom slider — fills track up to thumb */
const Slider = ({ min, max, step, value, onChange, fillColor = '#0d9488' }) => {
	const pct = ((value - min) / (max - min)) * 100;
	return (
		<div className="relative w-full h-6 flex items-center">
			<div className="absolute w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-150"
					style={{ width: `${pct}%`, background: `linear-gradient(to right, ${fillColor}cc, ${fillColor})` }}
				/>
			</div>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={onChange}
				className="absolute w-full opacity-0 h-6 cursor-pointer z-10"
			/>
			{/* Custom thumb */}
			<div
				className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg shadow-black/20 pointer-events-none transition-all duration-150"
				style={{ left: `calc(${pct}% - 10px)`, background: fillColor }}
			/>
		</div>
	);
};

/* Donut SVG chart */
const Donut = ({ principal, interest }) => {
	const total = principal + interest;
	const pPct = (principal / total) * 100;
	const r = 54;
	const circ = 2 * Math.PI * r;
	const pDash = (pPct / 100) * circ;
	return (
		<svg viewBox="0 0 128 128" className="w-full h-full">
			<circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="16" />
			<circle
				cx="64" cy="64" r={r} fill="none"
				stroke="rgba(255,255,255,0.9)"
				strokeWidth="16"
				strokeDasharray={`${pDash} ${circ - pDash}`}
				strokeDashoffset={circ / 4}
				strokeLinecap="round"
				style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
			/>
			<circle
				cx="64" cy="64" r={r} fill="none"
				stroke="rgba(251,191,36,0.85)"
				strokeWidth="16"
				strokeDasharray={`${circ - pDash} ${pDash}`}
				strokeDashoffset={-(pDash - circ / 4)}
				strokeLinecap="round"
				style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
			/>
		</svg>
	);
};

export const EMICalculatorSection = () => {
	const navigate = useNavigate();
	const [loanAmt, setLoanAmt] = useState(5000000);
	const [rate, setRate] = useState(8.5);
	const [tenure, setTenure] = useState(20);

	const { emi, totalAmt, totalInterest } = useMemo(() => {
		const r = rate / 12 / 100;
		const n = tenure * 12;
		if (r === 0) return { emi: loanAmt / n, totalAmt: loanAmt, totalInterest: 0 };
		const emi = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
		const totalAmt = emi * n;
		return { emi, totalAmt, totalInterest: totalAmt - loanAmt };
	}, [loanAmt, rate, tenure]);

	const principalPct = Math.round((loanAmt / (loanAmt + totalInterest)) * 100);

	return (
		<section className="py-10 md:py-14 bg-gradient-to-b from-slate-50 to-white dark:from-[#0c1528] dark:to-[#0b1220] overflow-hidden">
			<div className="container-custom">

				{/* Header */}
				{/* Compact header row */}
				<div data-reveal="fade" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
					<div>
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-500 dark:text-teal-400 mb-1">Plan Your Purchase</p>
						<h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">EMI Calculator</h2>
					</div>
					<p className="text-slate-400 dark:text-slate-500 text-xs max-w-xs">Slide to estimate your monthly home loan repayment instantly.</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

					{/* LEFT — Result card (compact) */}
					<div data-reveal="left" className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-2xl p-5 md:p-6 text-white shadow-xl shadow-teal-700/25 flex flex-col justify-between relative overflow-hidden">
						<div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
						<div className="relative z-10">
							<p className="text-teal-200 text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5">Monthly EMI</p>
							<p key={Math.round(emi)} className="text-4xl font-black mb-4 transition-all duration-300">
								{fmt(Math.round(emi))}
							</p>

							{/* Donut + legend — compact */}
							<div className="flex items-center gap-4 mb-4">
								<div className="w-16 h-16 flex-shrink-0">
									<Donut principal={loanAmt} interest={totalInterest} />
								</div>
								<div className="space-y-1.5 flex-1 text-xs">
									<div className="flex items-center gap-1.5">
										<span className="w-2 h-2 rounded-full bg-white/90 flex-shrink-0" />
										<span className="text-teal-100">Principal: <strong>{fmt(loanAmt)}</strong> · {principalPct}%</span>
									</div>
									<div className="flex items-center gap-1.5">
										<span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
										<span className="text-teal-100">Interest: <strong>{fmt(Math.round(totalInterest))}</strong> · {100 - principalPct}%</span>
									</div>
								</div>
							</div>

							<div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
								<div>
									<p className="text-teal-200 text-[10px] uppercase tracking-wide">Total Payment</p>
									<p className="font-black">{fmt(Math.round(totalAmt))}</p>
								</div>
								<p className="text-teal-300 text-xs">{tenure} yrs</p>
							</div>
						</div>
						<button
							onClick={() => navigate('/sell-companies/nx-one-ark')}
							className="relative z-10 mt-4 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-full transition-all text-xs border border-white/20"
						>
							View NX ONE – ARK <ArrowRight className="w-3.5 h-3.5" />
						</button>
					</div>

					{/* RIGHT — Sliders (compact) */}
					<div data-reveal="right" data-delay="150" className="bg-white dark:bg-[#111827] rounded-2xl p-5 md:p-6 border border-slate-100 dark:border-white/8 shadow-md flex flex-col justify-between">
						<div className="space-y-5">

							{/* Loan Amount */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Loan Amount</label>
									<span className="text-teal-600 dark:text-teal-400 font-black text-sm">{fmt(loanAmt)}</span>
								</div>
								<Slider min={500000} max={50000000} step={100000} value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))} fillColor="#0d9488" />
								<div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>₹5L</span><span>₹5Cr</span></div>
							</div>

							{/* Interest Rate */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Interest Rate</label>
									<span className="text-amber-500 font-black text-sm">{rate.toFixed(1)}% p.a.</span>
								</div>
								<Slider min={6} max={15} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} fillColor="#f59e0b" />
								<div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>6%</span><span>15%</span></div>
							</div>

							{/* Tenure */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Loan Tenure</label>
									<span className="text-teal-600 dark:text-teal-400 font-black text-sm">{tenure} yrs</span>
								</div>
								<Slider min={5} max={30} step={1} value={tenure} onChange={e => setTenure(Number(e.target.value))} fillColor="#0d9488" />
								<div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>5 yrs</span><span>30 yrs</span></div>
							</div>
						</div>

						{/* Quick presets */}
						<div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/8">
							<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Quick Presets</p>
							<div className="flex flex-wrap gap-1.5">
								{[
									{ label: '₹50L·20yr', amt: 5000000, t: 20 },
									{ label: '₹1Cr·20yr', amt: 10000000, t: 20 },
									{ label: '₹2.5Cr·15yr', amt: 25000000, t: 15 },
									{ label: '₹5Cr·10yr', amt: 50000000, t: 10 },
								].map((p) => (
									<button
										key={p.label}
										onClick={() => { setLoanAmt(p.amt); setTenure(p.t); }}
										className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all font-medium"
									>
										{p.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
