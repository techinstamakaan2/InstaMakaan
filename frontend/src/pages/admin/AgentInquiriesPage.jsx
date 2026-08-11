import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	ArrowLeft,
	UserCheck,
	Phone,
	Mail,
	Clock,
	CheckCircle2,
	Calendar,
	Eye,
	Loader2,
	PhoneCall,
	CalendarCheck,
	CheckCheck,
	Search,
	Filter,
	X,
	RefreshCw,
	ChevronDown,
	ChevronUp,
	SortAsc,
	SortDesc,
	MessageSquare,
	Copy,
	AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import InquiryDetailDrawer from '@/components/admin/InquiryDetailDrawer';
import api from '@/lib/api';

const statusWorkflow = [
	{
		value: 'assigned',
		label: 'Assigned',
		icon: UserCheck,
		color: 'bg-primary/10 text-primary',
		dot: 'bg-primary',
	},
	{
		value: 'talked',
		label: 'Talked',
		icon: PhoneCall,
		color: 'bg-blue-500/10 text-blue-600',
		dot: 'bg-blue-500',
	},
	{
		value: 'visit_scheduled',
		label: 'Visit Scheduled',
		icon: Calendar,
		color: 'bg-yellow-500/10 text-yellow-600',
		dot: 'bg-yellow-500',
	},
	{
		value: 'visit_confirmed',
		label: 'Visit Confirmed',
		icon: CalendarCheck,
		color: 'bg-green-500/10 text-green-600',
		dot: 'bg-green-500',
	},
	{
		value: 'closed',
		label: 'Closed',
		icon: CheckCheck,
		color: 'bg-muted text-muted-foreground',
		dot: 'bg-muted-foreground',
	},
];

const getStatusInfo = (status) =>
	statusWorkflow.find((s) => s.value === status) || statusWorkflow[0];
const getNextStatus = (status) => {
	const idx = statusWorkflow.findIndex((s) => s.value === status);
	return idx < statusWorkflow.length - 1 ? statusWorkflow[idx + 1] : null;
};

// ── Pipeline progress bar ────────────────────────────────────────────────────
const PipelineBar = ({ statusCounts }) => {
	const total =
		statusWorkflow.reduce((s, w) => s + (statusCounts[w.value] || 0), 0) || 1;
	return (
		<div className="flex rounded-full overflow-hidden h-2 gap-px">
			{statusWorkflow.map((s) => {
				const count = statusCounts[s.value] || 0;
				const pct = (count / total) * 100;
				if (!count) return null;
				return (
					<div
						key={s.value}
						style={{ width: `${pct}%` }}
						className={cn('h-full', s.dot)}
						title={`${s.label}: ${count}`}
					/>
				);
			})}
		</div>
	);
};

// ── Inquiry Card ─────────────────────────────────────────────────────────────
const InquiryCard = ({
	inquiry,
	agentId,
	onStatusUpdate,
	onView,
	submitting,
}) => {
	const [expanded, setExpanded] = useState(false);
	const statusInfo = getStatusInfo(inquiry.status);
	const nextStatus = getNextStatus(inquiry.status);
	const StatusIcon = statusInfo.icon;

	return (
		<div
			className={cn(
				'border rounded-xl overflow-hidden transition-all',
				inquiry.status === 'closed' ? 'opacity-60' : 'border-border',
			)}
		>
			<div className="p-4">
				<div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1.5 flex-wrap">
							<button
								onClick={() => onView(inquiry.id)}
								className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
							>
								{inquiry.name}
							</button>
							<span
								className={cn(
									'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
									statusInfo.color,
								)}
							>
								<StatusIcon className="w-3 h-3" />
								{statusInfo.label}
							</span>
						</div>
						<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
							<a
								href={`tel:${inquiry.phone}`}
								className="flex items-center gap-1 hover:text-primary transition-colors"
							>
								<Phone className="w-3 h-3" />
								{inquiry.phone}
							</a>
							{inquiry.email && (
								<span className="flex items-center gap-1">
									<Mail className="w-3 h-3" />
									{inquiry.email}
								</span>
							)}
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{format(new Date(inquiry.created_at), 'MMM d, yyyy')}
							</span>
						</div>
						{inquiry.message && (
							<p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
								{inquiry.message}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						{nextStatus && inquiry.status !== 'closed' && (
							<Button
								size="sm"
								onClick={() => onStatusUpdate(inquiry.id, nextStatus.value)}
								disabled={submitting}
								className="h-7 text-xs gap-1"
							>
								{submitting ? (
									<Loader2 className="w-3 h-3 animate-spin" />
								) : (
									<nextStatus.icon className="w-3 h-3" />
								)}
								{nextStatus.label}
							</Button>
						)}
						<button
							onClick={() => onView(inquiry.id)}
							className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							title="Details"
						>
							<Eye className="w-4 h-4" />
						</button>
						<button
							onClick={() => {
								navigator.clipboard.writeText(inquiry.phone);
								toast.success('Phone copied');
							}}
							className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							title="Copy phone"
						>
							<Copy className="w-3.5 h-3.5" />
						</button>
						{inquiry.conversation_logs?.length > 0 && (
							<button
								onClick={() => setExpanded(!expanded)}
								className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							>
								{expanded ? (
									<ChevronUp className="w-4 h-4" />
								) : (
									<ChevronDown className="w-4 h-4" />
								)}
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Activity logs */}
			{expanded && inquiry.conversation_logs?.length > 0 && (
				<div className="px-4 pb-4 pt-0 border-t border-border mt-0 bg-muted/20">
					<p className="text-xs font-medium text-muted-foreground mb-2 mt-3">
						Recent Activity
					</p>
					<div className="space-y-2">
						{inquiry.conversation_logs.slice(-3).map((log, i) => (
							<div key={i} className="flex items-start gap-2 text-xs">
								<CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
								<div>
									<p className="text-foreground">{log.message}</p>
									<p className="text-muted-foreground mt-0.5">
										{log.agent_name} ·{' '}
										{format(new Date(log.timestamp), 'MMM d, h:mm a')}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

// ── Main page ─────────────────────────────────────────────────────────────────
const AgentInquiriesPage = () => {
	const { agentId } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedInquiryId, setView] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	const [search, setSearch] = useState('');
	const [statusFilter, setStatus] = useState('all');
	const [sortDir, setSortDir] = useState('desc');

	const fetchAgentInquiries = useCallback(
		async (silent = false) => {
			if (silent) setRefreshing(true);
			else setLoading(true);
			try {
				const { data: d } = await api.get(`/agents/${agentId}/inquiries`);
				setData(d);
			} catch {
				toast.error('Failed to load agent inquiries');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[agentId],
	);

	useEffect(() => {
		fetchAgentInquiries();
	}, [fetchAgentInquiries]);

	const updateStatus = async (inquiryId, status) => {
		setSubmitting(true);
		try {
			await api.post(`/inquiries/${inquiryId}/log`, null, {
				params: {
					agent_id: agentId,
					message: `Status updated to ${status.replace('_', ' ')}`,
					new_status: status,
				},
			});
			toast.success(`Marked as ${status.replace('_', ' ')}`);
			fetchAgentInquiries(true);
		} catch {
			toast.error('Failed to update status');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	if (!data)
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground mb-2">Agent not found</p>
				<Button variant="link" asChild>
					<Link to="/admin/agents">Back to Agents</Link>
				</Button>
			</div>
		);

	const { agent, total_inquiries, status_counts, inquiries } = data;

	const filtered = (inquiries || [])
		.filter((i) => {
			if (
				search &&
				!i.name?.toLowerCase().includes(search.toLowerCase()) &&
				!i.phone?.includes(search)
			)
				return false;
			if (statusFilter !== 'all' && i.status !== statusFilter) return false;
			return true;
		})
		.sort((a, b) =>
			sortDir === 'desc'
				? new Date(b.created_at) - new Date(a.created_at)
				: new Date(a.created_at) - new Date(b.created_at),
		);

	const hasFilters = search || statusFilter !== 'all';

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/admin/agents">
						<ArrowLeft className="w-5 h-5" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-foreground">
						Agent Dashboard
					</h1>
					<p className="text-sm text-muted-foreground">
						Assigned inquiries and progress
					</p>
				</div>
				<button
					onClick={() => fetchAgentInquiries(true)}
					disabled={refreshing}
					className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
				>
					<RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
				</button>
			</div>

			{/* ── Agent Card ── */}
			<Card className="bg-card border border-border shadow-none">
				<CardContent className="p-5">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4">
						<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
							{agent.name?.charAt(0)?.toUpperCase()}
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 flex-wrap">
								<h2 className="text-lg font-semibold text-foreground">
									{agent.name}
								</h2>
								<span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
									{agent.designation}
								</span>
							</div>
							<div className="flex flex-wrap gap-3 mt-1.5 text-sm text-muted-foreground">
								<a
									href={`tel:${agent.phone}`}
									className="flex items-center gap-1 hover:text-primary transition-colors"
								>
									<Phone className="w-3.5 h-3.5" />
									{agent.phone}
								</a>
								<a
									href={`mailto:${agent.email}`}
									className="flex items-center gap-1 hover:text-primary transition-colors"
								>
									<Mail className="w-3.5 h-3.5" />
									{agent.email}
								</a>
							</div>
							<div className="mt-3">
								<PipelineBar statusCounts={status_counts} />
							</div>
						</div>
						<div className="text-center sm:text-right">
							<p className="text-3xl font-bold text-primary">
								{total_inquiries}
							</p>
							<p className="text-xs text-muted-foreground">Total Inquiries</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* ── Pipeline counts ── */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
				{statusWorkflow.map((s) => {
					const count = status_counts[s.value] || 0;
					const Icon = s.icon;
					return (
						<button
							key={s.value}
							onClick={() =>
								setStatus(statusFilter === s.value ? 'all' : s.value)
							}
							className={cn(
								'p-4 rounded-xl border text-left transition-all',
								statusFilter === s.value
									? 'border-primary ring-1 ring-primary bg-primary/5'
									: count > 0
										? 'border-border hover:border-primary/50'
										: 'border-border opacity-50',
							)}
						>
							<div className="flex items-center gap-2.5">
								<div
									className={cn(
										'w-8 h-8 rounded-lg flex items-center justify-center',
										s.color,
									)}
								>
									<Icon className="w-4 h-4" />
								</div>
								<div>
									<p className="text-xl font-bold text-foreground leading-none">
										{count}
									</p>
									<p className="text-xs text-muted-foreground mt-0.5">
										{s.label}
									</p>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			{/* ── Filters ── */}
			<div className="flex flex-wrap gap-3">
				<div className="relative flex-1 min-w-48">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name or phone..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 pr-8"
					/>
					{search && (
						<button
							onClick={() => setSearch('')}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
				<button
					onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
					className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground"
				>
					{sortDir === 'desc' ? (
						<SortDesc className="w-4 h-4" />
					) : (
						<SortAsc className="w-4 h-4" />
					)}
					{sortDir === 'desc' ? 'Newest' : 'Oldest'}
				</button>
				{hasFilters && (
					<button
						onClick={() => {
							setSearch('');
							setStatus('all');
						}}
						className="text-xs text-primary hover:underline flex items-center gap-1 px-2"
					>
						<X className="w-3 h-3" /> Clear
					</button>
				)}
			</div>

			{/* ── Inquiries ── */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-sm font-semibold text-foreground">
						{statusFilter !== 'all' ? getStatusInfo(statusFilter).label : 'All'}{' '}
						Inquiries
						<span className="ml-2 text-muted-foreground font-normal">
							({filtered.length})
						</span>
					</h2>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
						{hasFilters ? (
							<>
								<AlertCircle className="w-8 h-8 mb-2 opacity-30" />
								<p className="text-sm">No inquiries match your filters</p>
							</>
						) : (
							<>
								<MessageSquare className="w-8 h-8 mb-2 opacity-30" />
								<p className="text-sm">No inquiries assigned yet</p>
							</>
						)}
					</div>
				) : (
					<div className="space-y-3">
						{filtered.map((inquiry) => (
							<InquiryCard
								key={inquiry.id}
								inquiry={inquiry}
								agentId={agentId}
								onStatusUpdate={updateStatus}
								onView={setView}
								submitting={submitting}
							/>
						))}
					</div>
				)}
			</div>

			<InquiryDetailDrawer
				inquiryId={selectedInquiryId}
				agentId={agentId}
				isOpen={!!selectedInquiryId}
				onClose={() => setView(null)}
				onUpdate={fetchAgentInquiries}
			/>
		</div>
	);
};

export default AgentInquiriesPage;
