import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Building2,
	Home,
	Key,
	MessageSquare,
	TrendingUp,
	Plus,
	Eye,
	Clock,
	Users,
	RefreshCw,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	ChevronRight,
	Filter,
	MoreHorizontal,
	CheckCircle2,
	AlertCircle,
	Circle,
	Phone,
	Mail,
	MapPin,
	Calendar,
	Activity,
	BarChart3,
	Layers,
	UserCheck,
	Inbox,
	Star,
	ExternalLink,
	Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

// ── Tiny sparkline using SVG ────────────────────────────────────────────────
const Sparkline = ({ data = [], color = 'currentColor' }) => {
	if (!data.length) return null;
	const max = Math.max(...data, 1);
	const min = Math.min(...data);
	const range = max - min || 1;
	const w = 80;
	const h = 28;
	const pts = data
		.map((v, i) => {
			const x = (i / (data.length - 1)) * w;
			const y = h - ((v - min) / range) * h;
			return `${x},${y}`;
		})
		.join(' ');
	return (
		<svg width={w} height={h} className="opacity-60">
			<polyline
				points={pts}
				fill="none"
				stroke={color}
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

// ── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({
	title,
	value,
	icon: Icon,
	color,
	change,
	trend,
	sparkline,
	linkTo,
	loading,
}) => {
	const trendIcon =
		trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
	const TrendIcon = trendIcon;
	const trendColor =
		trend === 'up'
			? 'text-green-500'
			: trend === 'down'
				? 'text-red-400'
				: 'text-muted-foreground';

	return (
		<Card className="bg-card border border-border shadow-none hover:border-primary/30 transition-colors group">
			<CardContent className="p-5">
				<div className="flex items-start justify-between mb-3">
					<div
						className={cn(
							'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
							color,
						)}
					>
						<Icon className="w-5 h-5" />
					</div>
					{linkTo && (
						<Link
							to={linkTo}
							className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-muted text-muted-foreground"
						>
							<ChevronRight className="w-4 h-4" />
						</Link>
					)}
				</div>
				<div className="flex items-end justify-between">
					<div>
						<p className="text-xs text-muted-foreground mb-0.5">{title}</p>
						<p className="text-2xl font-bold text-foreground tabular-nums">
							{loading ? (
								<span className="text-muted-foreground">—</span>
							) : (
								value
							)}
						</p>
						{change != null && !loading && (
							<div
								className={cn(
									'flex items-center gap-0.5 mt-1 text-xs',
									trendColor,
								)}
							>
								<TrendIcon className="w-3 h-3" />
								<span>{change}</span>
							</div>
						)}
					</div>
					{sparkline && !loading && <Sparkline data={sparkline} />}
				</div>
			</CardContent>
		</Card>
	);
};

// ── Inquiry status config ───────────────────────────────────────────────────
const statusConfig = {
	new: { label: 'New', icon: Circle, className: 'bg-warning/10 text-warning' },
	assigned: {
		label: 'Assigned',
		icon: UserCheck,
		className: 'bg-primary/10 text-primary',
	},
	closed: {
		label: 'Closed',
		icon: CheckCircle2,
		className: 'bg-muted text-muted-foreground',
	},
	pending: {
		label: 'Pending',
		icon: AlertCircle,
		className: 'bg-orange-500/10 text-orange-500',
	},
};

const InquiryRow = ({ inquiry }) => {
	const cfg = statusConfig[inquiry.status] || statusConfig.new;
	const StatusIcon = cfg.icon;
	const timeAgo = inquiry.created_at
		? new Date(inquiry.created_at).toLocaleDateString('en-IN', {
				day: 'numeric',
				month: 'short',
			})
		: null;

	return (
		<div className="flex items-start gap-3 py-3 border-b border-border last:border-0 group">
			{/* Avatar */}
			<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary">
				{inquiry.name?.charAt(0)?.toUpperCase() || '?'}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<p className="text-sm font-medium text-foreground truncate">
						{inquiry.name}
					</p>
					<span
						className={cn(
							'text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 flex-shrink-0',
							cfg.className,
						)}
					>
						<StatusIcon className="w-2.5 h-2.5" />
						{cfg.label}
					</span>
				</div>
				<div className="flex items-center gap-3 mt-0.5 flex-wrap">
					{inquiry.phone && (
						<a
							href={`tel:${inquiry.phone}`}
							className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
						>
							<Phone className="w-3 h-3" />
							{inquiry.phone}
						</a>
					)}
					{inquiry.inquiry_type && (
						<span className="text-xs text-muted-foreground capitalize">
							{inquiry.inquiry_type.replace('_', ' ')}
						</span>
					)}
					{timeAgo && (
						<span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
							<Calendar className="w-3 h-3" />
							{timeAgo}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

// ── Property type bar ────────────────────────────────────────────────────────
const PropertyTypeBar = ({ type, count, total, icon: Icon }) => {
	const pct = total ? Math.round((count / total) * 100) : 0;
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
						<Icon className="w-3.5 h-3.5 text-primary" />
					</div>
					<span className="text-sm font-medium capitalize">
						{type.replace('-', ' ')}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">{count}</span>
					<span className="text-xs text-muted-foreground w-8 text-right">
						{pct}%
					</span>
				</div>
			</div>
			<div className="h-1.5 rounded-full bg-muted overflow-hidden">
				<div
					className="h-full rounded-full bg-primary transition-all duration-500"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
};

// ── Main Page ────────────────────────────────────────────────────────────────
const DashboardPage = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [inquiryFilter, setInquiryFilter] = useState('all');
	const [lastUpdated, setLastUpdated] = useState(null);

	const fetchStats = useCallback(async (silent = false) => {
		if (!silent) setLoading(true);
		else setRefreshing(true);
		try {
			const { data } = await api.get('/dashboard/stats');
			const normalized = {
				...data,
				recent_inquiries: (data.recent_inquiries || []).map((i) => ({
					...i,
					status: i.stage?.toLowerCase(),
				})),
			};
			setStats(normalized);
			setLastUpdated(new Date());
		} catch (error) {
			console.error('Error fetching stats:', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	const propertyTypeIcons = { rent: Key, buy: Building2 };

	const statCards = [
		{
			title: 'Total Properties',
			value: stats?.total_properties ?? 0,
			icon: Building2,
			color: 'bg-primary/10 text-primary',
			linkTo: '/admin/properties',
			sparkline: [3, 5, 4, 7, 8, 6, stats?.total_properties ?? 0],
		},
		{
			title: 'Active Listings',
			value: stats?.active_properties ?? 0,
			icon: Activity,
			color: 'bg-green-500/10 text-green-500',
			trend: 'up',
			change: 'Live now',
			linkTo: '/admin/properties',
		},
		{
			title: 'Total Owners',
			value: stats?.total_owners ?? 0,
			icon: Users,
			color: 'bg-violet-500/10 text-violet-500',
			linkTo: '/admin/owners',
		},
		{
			title: 'Active Agents',
			value: stats?.total_agents ?? 0,
			icon: UserCheck,
			color: 'bg-cyan-500/10 text-cyan-500',
			linkTo: '/admin/agents',
		},
		{
			title: 'Total Inquiries',
			value: stats?.total_inquiries ?? 0,
			icon: Inbox,
			color: 'bg-orange-500/10 text-orange-500',
			linkTo: '/admin/inquiries',
			sparkline: [2, 4, 3, 8, 6, 9, stats?.total_inquiries ?? 0],
		},
		{
			title: 'New Inquiries',
			value: stats?.new_inquiries ?? 0,
			icon: AlertCircle,
			color: 'bg-yellow-500/10 text-yellow-500',
			trend: stats?.new_inquiries > 0 ? 'up' : 'neutral',
			change: stats?.new_inquiries > 0 ? 'Needs attention' : 'All clear',
			linkTo: '/admin/inquiries',
		},
		{
			title: 'Registered Users',
			value: stats?.total_users ?? 0,
			icon: Users,
			color: 'bg-teal-500/10 text-teal-500',
			linkTo: '/admin/users',
		},
		{
			title: 'Total Referrals',
			value: stats?.total_referrals ?? 0,
			icon: Star,
			color: 'bg-amber-500/10 text-amber-500',
			linkTo: '/admin/referrals',
		},
	];

	// Filter inquiries
	const allInquiries = stats?.recent_inquiries || [];
	const filteredInquiries =
		inquiryFilter === 'all'
			? allInquiries
			: allInquiries.filter((i) => i.status === inquiryFilter);

	const inquiryStatusCounts = allInquiries.reduce((acc, i) => {
		acc[i.status] = (acc[i.status] || 0) + 1;
		return acc;
	}, {});

	const propertyTypes = Object.entries(stats?.properties_by_type || {});
	const totalByType = propertyTypes.reduce((s, [, c]) => s + c, 0);

	return (
		<div className="space-y-6">
			{/* ── Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
					<p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
						Welcome to InstaMakaan Admin Panel
						{lastUpdated && (
							<span className="text-xs text-muted-foreground/60">
								· Updated{' '}
								{lastUpdated.toLocaleTimeString('en-IN', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</span>
						)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => fetchStats(true)}
						disabled={refreshing}
						className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
						title="Refresh stats"
					>
						<RefreshCw
							className={cn('w-4 h-4', refreshing && 'animate-spin')}
						/>
					</button>
					<Button asChild>
						<Link to="/admin/properties/new">
							<Plus className="w-4 h-4 mr-2" />
							Add Property
						</Link>
					</Button>
				</div>
			</div>

			{/* ── Stats Grid ── */}
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
				{statCards.map((card) => (
					<StatCard key={card.title} {...card} loading={loading} />
				))}
			</div>

			{/* ── Middle Row ── */}
			<div className="grid lg:grid-cols-2 gap-6">
				{/* Properties by Type */}
				<Card className="bg-card border border-border shadow-none">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<BarChart3 className="w-4 h-4 text-muted-foreground" />
								Properties by Type
							</CardTitle>
							<Link
								to="/admin/properties"
								className="text-xs text-primary hover:underline flex items-center gap-1"
							>
								View all <ChevronRight className="w-3 h-3" />
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-8 bg-muted rounded animate-pulse" />
								))}
							</div>
						) : propertyTypes.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
								<p className="text-sm">No properties yet</p>
							</div>
						) : (
							<div className="space-y-4 pt-1">
								{propertyTypes.map(([type, count]) => (
									<PropertyTypeBar
										key={type}
										type={type}
										count={count}
										total={totalByType}
										icon={propertyTypeIcons[type] || Building2}
									/>
								))}
								<div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
									<span>Total properties</span>
									<span className="font-semibold text-foreground">
										{totalByType}
									</span>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent Inquiries */}
				<Card className="bg-card border border-border shadow-none">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<MessageSquare className="w-4 h-4 text-muted-foreground" />
								Recent Inquiries
							</CardTitle>
							<Button variant="ghost" size="sm" asChild className="h-7 text-xs">
								<Link to="/admin/inquiries">
									View all <ChevronRight className="w-3 h-3 ml-1" />
								</Link>
							</Button>
						</div>
						{/* Filter tabs */}
						<div className="flex items-center gap-1 mt-2 flex-wrap">
							{[
								{ key: 'all', label: 'All', count: allInquiries.length },
								{
									key: 'new',
									label: 'New',
									count: inquiryStatusCounts.new || 0,
								},
								{
									key: 'assigned',
									label: 'Assigned',
									count: inquiryStatusCounts.assigned || 0,
								},
								{
									key: 'closed',
									label: 'Closed',
									count: inquiryStatusCounts.closed || 0,
								},
							].map(({ key, label, count }) => (
								<button
									key={key}
									onClick={() => setInquiryFilter(key)}
									className={cn(
										'px-2.5 py-1 text-xs rounded-full border transition-colors',
										inquiryFilter === key
											? 'bg-primary text-primary-foreground border-primary'
											: 'border-border text-muted-foreground hover:border-primary/50',
									)}
								>
									{label}
									{count > 0 && (
										<span className="ml-1 opacity-70">{count}</span>
									)}
								</button>
							))}
						</div>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-3">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-12 bg-muted rounded animate-pulse"
									/>
								))}
							</div>
						) : filteredInquiries.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
								<p className="text-sm">
									No {inquiryFilter !== 'all' ? inquiryFilter : ''} inquiries
								</p>
							</div>
						) : (
							<div className="divide-y divide-border -mt-1">
								{filteredInquiries.slice(0, 6).map((inquiry) => (
									<InquiryRow key={inquiry.id} inquiry={inquiry} />
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* ── Quick Actions ── */}
			<Card className="bg-card border border-border shadow-none">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-semibold">
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
						{[
							{
								icon: Plus,
								label: 'Add Property',
								to: '/admin/properties/new',
								highlight: true,
							},
							{ icon: Building2, label: 'Properties', to: '/admin/properties' },
							{
								icon: MessageSquare,
								label: 'Inquiries',
								to: '/admin/inquiries',
								badge: stats?.new_inquiries,
							},
							{ icon: Users, label: 'Owners', to: '/admin/owners' },
							{ icon: UserCheck, label: 'Agents', to: '/admin/agents' },
							{ icon: Layers, label: 'Blog Posts', to: '/admin/blog' },
							{ icon: Star, label: 'Instagram', to: '/admin/instagram' },
							{ icon: Eye, label: 'View Website', to: '/', external: true },
						].map(({ icon: Icon, label, to, highlight, badge, external }) => (
							<Button
								key={label}
								variant={highlight ? 'default' : 'outline'}
								className="h-auto py-3 flex-col gap-1.5 relative"
								asChild
							>
								<Link to={to} {...(external ? { target: '_blank' } : {})}>
									<Icon className="w-5 h-5" />
									<span className="text-xs">{label}</span>
									{badge > 0 && (
										<span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] bg-warning text-warning-foreground rounded-full flex items-center justify-center font-bold">
											{badge > 9 ? '9+' : badge}
										</span>
									)}
									{external && (
										<ExternalLink className="absolute top-1.5 right-1.5 w-3 h-3 text-muted-foreground" />
									)}
								</Link>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardPage;
