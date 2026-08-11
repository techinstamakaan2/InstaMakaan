import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	ArrowLeft,
	Building2,
	TrendingUp,
	Wallet,
	Calendar,
	MapPin,
	User,
	Phone,
	Mail,
	Loader2,
	RefreshCw,
	ExternalLink,
	CheckCircle2,
	Clock,
	AlertCircle,
	ChevronRight,
	Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PropertyPreviewDrawer from '@/components/admin/PropertyPreviewDrawer';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const formatPrice = (n) => {
	if (!n && n !== 0) return '—';
	const num = Number(n);
	if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
	if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
	if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
	return `₹${num.toLocaleString()}`;
};

const getStatusConfig = (s) =>
	({
		active: { cls: 'bg-green-500/10 text-green-600', dot: 'bg-green-500' },
		inactive: {
			cls: 'bg-muted text-muted-foreground',
			dot: 'bg-muted-foreground',
		},
		rented: { cls: 'bg-primary/10 text-primary', dot: 'bg-primary' },
		sold: { cls: 'bg-orange-500/10 text-orange-500', dot: 'bg-orange-500' },
	})[s] || {
		cls: 'bg-muted text-muted-foreground',
		dot: 'bg-muted-foreground',
	};

// ── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data = [] }) => {
	if (data.length < 2) return null;
	const max = Math.max(...data, 1);
	const min = Math.min(...data);
	const range = max - min || 1;
	const w = 64;
	const h = 24;
	const pts = data
		.map(
			(v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`,
		)
		.join(' ');
	return (
		<svg width={w} height={h} className="opacity-50">
			<polyline
				points={pts}
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, sub, sparkline }) => (
	<Card className="bg-card border border-border shadow-none">
		<CardContent className="p-5">
			<div className="flex items-start justify-between mb-3">
				<div
					className={cn(
						'w-10 h-10 rounded-xl flex items-center justify-center',
						color,
					)}
				>
					<Icon className="w-5 h-5" />
				</div>
				{sparkline && <Sparkline data={sparkline} />}
			</div>
			<p className="text-xs text-muted-foreground">{title}</p>
			<p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
			{sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
		</CardContent>
	</Card>
);

const OwnerDashboardPage = () => {
	const { ownerId } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [previewId, setPreviewId] = useState(null);

	const fetchDashboard = useCallback(
		async (silent = false) => {
			if (silent) setRefreshing(true);
			else setLoading(true);
			try {
				const res = await fetch(
					`${BACKEND_URL}/api/owners/${ownerId}/dashboard`,
				);
				if (res.ok) setData(await res.json());
			} catch {
				toast.error('Failed to load dashboard');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[ownerId],
	);

	useEffect(() => {
		fetchDashboard();
	}, [fetchDashboard]);

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	if (!data)
		return (
			<div className="text-center py-12">
				<AlertCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
				<p className="text-muted-foreground mb-3">Owner not found</p>
				<Button variant="link" asChild>
					<Link to="/admin/owners">Back to Owners</Link>
				</Button>
			</div>
		);

	const {
		owner,
		total_properties,
		active_properties,
		total_earnings,
		current_month_earnings,
		properties,
		earnings_history,
	} = data;

	const paidTotal =
		earnings_history
			?.filter((e) => e.status === 'paid')
			.reduce((s, e) => s + (e.amount || 0), 0) || 0;
	const pendingTotal =
		earnings_history
			?.filter((e) => e.status !== 'paid')
			.reduce((s, e) => s + (e.amount || 0), 0) || 0;
	const earningsTrend =
		earnings_history?.slice(-6).map((e) => e.amount || 0) || [];

	const statCards = [
		{
			title: 'Total Properties',
			value: total_properties,
			icon: Building2,
			color: 'bg-primary/10 text-primary',
		},
		{
			title: 'Active Listings',
			value: active_properties,
			icon: TrendingUp,
			color: 'bg-green-500/10 text-green-600',
		},
		{
			title: 'Total Earnings',
			value: `₹${(total_earnings || 0).toLocaleString()}`,
			icon: Wallet,
			color: 'bg-violet-500/10 text-violet-500',
			sparkline: earningsTrend,
		},
		{
			title: 'This Month',
			value: `₹${(current_month_earnings || 0).toLocaleString()}`,
			icon: Calendar,
			color: 'bg-orange-500/10 text-orange-500',
			sub:
				pendingTotal > 0
					? `₹${pendingTotal.toLocaleString()} pending`
					: undefined,
		},
	];

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/admin/owners">
						<ArrowLeft className="w-5 h-5" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-foreground">
						Owner Dashboard
					</h1>
					<p className="text-sm text-muted-foreground">
						Properties and earnings overview
					</p>
				</div>
				<button
					onClick={() => fetchDashboard(true)}
					disabled={refreshing}
					className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
				>
					<RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
				</button>
			</div>

			{/* ── Owner card ── */}
			<Card className="bg-card border border-border shadow-none">
				<CardContent className="p-5">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4">
						<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
							{owner.name?.charAt(0)?.toUpperCase()}
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 flex-wrap">
								<h2 className="text-lg font-semibold text-foreground">
									{owner.name}
								</h2>
								<span
									className={cn(
										'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
										getStatusConfig(owner.status).cls,
									)}
								>
									{owner.status}
								</span>
							</div>
							<div className="flex flex-wrap gap-3 mt-1.5 text-sm text-muted-foreground">
								<a
									href={`tel:${owner.phone}`}
									className="flex items-center gap-1.5 hover:text-primary transition-colors"
								>
									<Phone className="w-3.5 h-3.5" />
									{owner.phone}
								</a>
								<a
									href={`mailto:${owner.email}`}
									className="flex items-center gap-1.5 hover:text-primary transition-colors"
								>
									<Mail className="w-3.5 h-3.5" />
									{owner.email}
								</a>
								{owner.address && (
									<span className="flex items-center gap-1.5">
										<MapPin className="w-3.5 h-3.5" />
										{owner.address}
									</span>
								)}
							</div>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => {
									navigator.clipboard.writeText(owner.phone);
									toast.success('Phone copied');
								}}
								className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
								title="Copy phone"
							>
								<Copy className="w-4 h-4" />
							</button>
						</div>
					</div>
					{owner.bank_details && (
						<div className="mt-3 pt-3 border-t border-border">
							<p className="text-xs text-muted-foreground mb-0.5">
								Bank Details
							</p>
							<p className="text-sm text-foreground">{owner.bank_details}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* ── Stats ── */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{statCards.map((s) => (
					<StatCard key={s.title} {...s} />
				))}
			</div>

			<div className="grid lg:grid-cols-2 gap-5">
				{/* Properties */}
				<Card className="bg-card border border-border shadow-none">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<Building2 className="w-4 h-4 text-muted-foreground" />
								Properties ({total_properties})
							</CardTitle>
							<Link
								to="/admin/properties"
								className="text-xs text-primary hover:underline flex items-center gap-1"
							>
								All <ChevronRight className="w-3 h-3" />
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						{properties.length === 0 ? (
							<div className="flex flex-col items-center py-10 text-muted-foreground">
								<Building2 className="w-8 h-8 mb-2 opacity-30" />
								<p className="text-sm">No properties assigned yet</p>
							</div>
						) : (
							<div className="space-y-3">
								{properties.map((prop) => {
									const imgSrc = prop.images?.[0]
										? prop.images[0].startsWith('http')
											? prop.images[0]
											: `${BACKEND_URL}${prop.images[0]}`
										: null;
									const { cls } = getStatusConfig(prop.status);
									return (
										<div
											key={prop.id}
											className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors group"
										>
											<div className="w-14 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
												{imgSrc ? (
													<img
														src={imgSrc}
														alt={prop.title}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<Building2 className="w-4 h-4 text-muted-foreground/40" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<button
													onClick={() => setPreviewId(prop.id)}
													className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1 text-left w-full"
												>
													{prop.title}
												</button>
												<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
													<MapPin className="w-3 h-3 flex-shrink-0" />
													<span className="truncate">{prop.location}</span>
												</p>
											</div>
											<div className="text-right flex-shrink-0">
												<p className="text-sm font-semibold">
													{formatPrice(prop.price)}
												</p>
												<span
													className={cn(
														'text-[10px] px-1.5 py-0.5 rounded-full capitalize',
														cls,
													)}
												>
													{prop.status}
												</span>
											</div>
											<Link
												to={`/property/${prop.id}`}
												target="_blank"
												className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
											>
												<ExternalLink className="w-3.5 h-3.5" />
											</Link>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Earnings History */}
				<Card className="bg-card border border-border shadow-none">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<Wallet className="w-4 h-4 text-muted-foreground" />
								Earnings History
							</CardTitle>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								{paidTotal > 0 && (
									<span className="text-green-600">
										₹{paidTotal.toLocaleString()} paid
									</span>
								)}
								{pendingTotal > 0 && (
									<span className="text-orange-500">
										₹{pendingTotal.toLocaleString()} pending
									</span>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{earnings_history.length === 0 ? (
							<div className="flex flex-col items-center py-10 text-muted-foreground">
								<Wallet className="w-8 h-8 mb-2 opacity-30" />
								<p className="text-sm">No earnings recorded yet</p>
							</div>
						) : (
							<div className="space-y-2">
								{earnings_history.map((earning, i) => (
									<div
										key={i}
										className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border"
									>
										<div className="flex items-center gap-2.5">
											<div
												className={cn(
													'w-7 h-7 rounded-full flex items-center justify-center',
													earning.status === 'paid'
														? 'bg-green-500/10'
														: 'bg-orange-500/10',
												)}
											>
												{earning.status === 'paid' ? (
													<CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
												) : (
													<Clock className="w-3.5 h-3.5 text-orange-500" />
												)}
											</div>
											<div>
												<p className="text-sm font-medium text-foreground">
													{earning.month}
												</p>
												<p className="text-xs text-muted-foreground capitalize">
													{earning.status}
												</p>
											</div>
										</div>
										<p
											className={cn(
												'text-base font-semibold',
												earning.status === 'paid'
													? 'text-green-600'
													: 'text-orange-500',
											)}
										>
											₹{(earning.amount || 0).toLocaleString()}
										</p>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<PropertyPreviewDrawer
				propertyId={previewId}
				isOpen={!!previewId}
				onClose={() => setPreviewId(null)}
			/>
		</div>
	);
};

export default OwnerDashboardPage;
