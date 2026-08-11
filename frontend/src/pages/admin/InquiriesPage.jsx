import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Search,
	Phone,
	Mail,
	MessageSquare,
	Calendar,
	Eye,
	CheckCircle2,
	Clock,
	XCircle,
	UserCheck,
	Send,
	Loader2,
	RefreshCw,
	X,
	Filter,
	ChevronLeft,
	ChevronRight,
	SortAsc,
	SortDesc,
	Download,
	Copy,
	CheckSquare,
	Square,
	Trash2,
	AlertCircle,
	PhoneCall,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/lib/api';

const statusOptions = [
	{ value: 'new', label: 'New', color: 'bg-yellow-500/10 text-yellow-600' },
	{ value: 'assigned', label: 'Assigned', color: 'bg-primary/10 text-primary' },
	{ value: 'talked', label: 'Talked', color: 'bg-blue-500/10 text-blue-600' },
	{
		value: 'visit_scheduled',
		label: 'Visit Scheduled',
		color: 'bg-green-500/10 text-green-600',
	},
	{
		value: 'visit_completed',
		label: 'Visit Completed',
		color: 'bg-violet-500/10 text-violet-600',
	},
	{ value: 'closed', label: 'Closed', color: 'bg-muted text-muted-foreground' },
];

const statusIcon = {
	new: Clock,
	assigned: UserCheck,
	talked: MessageSquare,
	visit_scheduled: Calendar,
	visit_completed: CheckCircle2,
	closed: XCircle,
};
const typeIcon = {
	schedule_visit: Calendar,
	callback: PhoneCall,
	general: MessageSquare,
};

const getStatus = (v) =>
	statusOptions.find((o) => o.value === v) || statusOptions[0];

const PAGE_SIZE = 15;

const InquiriesPage = () => {
	const [inquiries, setInquiries] = useState([]);
	const [agents, setAgents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Filters
	const [search, setSearch] = useState('');
	const [statusFilter, setStatus] = useState('all');
	const [typeFilter, setType] = useState('all');
	const [agentFilter, setAgent] = useState('all');

	// Sort
	const [sortKey, setSortKey] = useState('date');
	const [sortDir, setSortDir] = useState('desc');

	// Pagination
	const [page, setPage] = useState(1);

	// Selection
	const [selected, setSelected] = useState(new Set());

	// Detail
	const [selectedInquiry, setSelectedInquiry] = useState(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);

	// ── Fetch ─────────────────────────────────────────────────────────────
	const fetchInquiries = useCallback(async (silent = false) => {
		if (silent) setRefreshing(true);
		else setLoading(true);
		try {
			const { data } = await api.get('/inquiries/');
			setInquiries(data.map((i) => ({ ...i, status: i.stage?.toLowerCase() })));
		} catch {
			toast.error('Failed to load inquiries');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	const fetchAgents = async () => {
		try {
			const { data } = await api.get('/agents/', {
				params: { status: 'active' },
			});
			setAgents(data);
		} catch {}
	};

	useEffect(() => {
		fetchInquiries();
		fetchAgents();
	}, [fetchInquiries]);

	// ── Assign ────────────────────────────────────────────────────────────
	const assignAgent = async (inquiryId, agentId) => {
		try {
			await api.put(`/inquiries/${inquiryId}/assign`, null, {
				params: { agent_id: agentId },
			});
			toast.success('Agent assigned');
			fetchInquiries(true);
		} catch {
			toast.error('Failed to assign');
		}
	};

	// ── Open detail ───────────────────────────────────────────────────────
	const openDetail = async (inquiry) => {
		try {
			const { data } = await api.get(`/inquiries/${inquiry.id}`);
			setSelectedInquiry({ ...data, status: data.stage?.toLowerCase() });
			setIsDetailOpen(true);
		} catch {}
	};

	// ── Add log ───────────────────────────────────────────────────────────
	const addLog = async () => {
		if (!newMessage.trim() || !selectedInquiry) return;
		setSubmitting(true);
		try {
			await api.post(`/inquiries/${selectedInquiry.id}/notes`, null, {
				params: { note: newMessage },
			});
			toast.success('Note added');
			setNewMessage('');
			const { data } = await api.get(`/inquiries/${selectedInquiry.id}`);
			setSelectedInquiry({ ...data, status: data.stage?.toLowerCase() });
			fetchInquiries(true);
		} catch {
			toast.error('Failed to add note');
		} finally {
			setSubmitting(false);
		}
	};

	// ── Bulk delete ───────────────────────────────────────────────────────
	const bulkDelete = async () => {
		if (!window.confirm(`Delete ${selected.size} inquiries?`)) return;
		try {
			await Promise.all(
				[...selected].map((id) => api.delete(`/inquiries/${id}`)),
			);
			toast.success(`${selected.size} deleted`);
			setSelected(new Set());
			fetchInquiries(true);
		} catch {
			toast.error('Bulk delete failed');
		}
	};

	// ── Export ────────────────────────────────────────────────────────────
	const exportCSV = () => {
		const rows = [
			['Name', 'Phone', 'Email', 'Type', 'Status', 'Agent', 'Date'],
			...filteredSorted.map((i) => [
				i.name,
				i.phone,
				i.email || '',
				i.inquiry_type || '',
				i.status,
				i.assigned_agent_name || '',
				i.created_at ? format(new Date(i.created_at), 'MMM d yyyy') : '',
			]),
		];
		const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
		a.download = 'inquiries.csv';
		a.click();
		toast.success('Exported');
	};

	// ── Selection ─────────────────────────────────────────────────────────
	const toggleSelect = (id) =>
		setSelected((p) => {
			const n = new Set(p);
			n.has(id) ? n.delete(id) : n.add(id);
			return n;
		});
	const toggleAll = () =>
		selected.size === paginatedRows.length
			? setSelected(new Set())
			: setSelected(new Set(paginatedRows.map((i) => i.id)));

	// ── Filter + sort ─────────────────────────────────────────────────────
	const filteredSorted = inquiries
		.filter((i) => {
			if (
				search &&
				!i.name?.toLowerCase().includes(search.toLowerCase()) &&
				!i.phone?.includes(search) &&
				!i.email?.toLowerCase().includes(search.toLowerCase())
			)
				return false;
			if (statusFilter !== 'all' && i.status !== statusFilter) return false;
			if (typeFilter !== 'all' && i.inquiry_type !== typeFilter) return false;
			if (agentFilter !== 'all' && String(i.assigned_agent_id) !== agentFilter)
				return false;
			return true;
		})
		.sort((a, b) => {
			const mul = sortDir === 'asc' ? 1 : -1;
			if (sortKey === 'name')
				return (a.name || '').localeCompare(b.name || '') * mul;
			if (sortKey === 'status')
				return (a.status || '').localeCompare(b.status || '') * mul;
			return (new Date(a.created_at) - new Date(b.created_at)) * mul;
		});

	const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const paginatedRows = filteredSorted.slice(
		(safePage - 1) * PAGE_SIZE,
		safePage * PAGE_SIZE,
	);

	const statusCounts = statusOptions.reduce((acc, s) => {
		acc[s.value] = inquiries.filter((i) => i.status === s.value).length;
		return acc;
	}, {});

	const toggleSort = (key) => {
		if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		else {
			setSortKey(key);
			setSortDir('desc');
		}
	};

	const hasFilters =
		search ||
		statusFilter !== 'all' ||
		typeFilter !== 'all' ||
		agentFilter !== 'all';
	const clearFilters = () => {
		setSearch('');
		setStatus('all');
		setType('all');
		setAgent('all');
	};

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Manage customer inquiries and assign to agents
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => fetchInquiries(true)}
						disabled={refreshing}
						className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
					>
						<RefreshCw
							className={cn('w-4 h-4', refreshing && 'animate-spin')}
						/>
					</button>
					<Button
						variant="outline"
						onClick={exportCSV}
						className="gap-2 hidden sm:flex"
					>
						<Download className="w-4 h-4" /> Export
					</Button>
				</div>
			</div>

			{/* ── Status summary pills ── */}
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => {
						setStatus('all');
						setPage(1);
					}}
					className={cn(
						'px-3 py-1.5 text-xs rounded-full border transition-colors font-medium',
						statusFilter === 'all'
							? 'bg-foreground text-background border-foreground'
							: 'border-border text-muted-foreground hover:border-primary',
					)}
				>
					All <span className="ml-1 opacity-70">{inquiries.length}</span>
				</button>
				{statusOptions.map((s) => (
					<button
						key={s.value}
						onClick={() => {
							setStatus(s.value);
							setPage(1);
						}}
						className={cn(
							'px-3 py-1.5 text-xs rounded-full border transition-colors font-medium',
							statusFilter === s.value
								? 'bg-primary text-primary-foreground border-primary'
								: 'border-border text-muted-foreground hover:border-primary/50',
						)}
					>
						{s.label}{' '}
						{statusCounts[s.value] > 0 && (
							<span className="ml-1 opacity-70">{statusCounts[s.value]}</span>
						)}
					</button>
				))}
			</div>

			{/* ── Filters ── */}
			<Card className="bg-card border border-border shadow-none">
				<CardContent className="p-4">
					<div className="flex flex-wrap gap-3">
						<div className="relative flex-1 min-w-48">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search name, phone, email..."
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
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

						<Select
							value={typeFilter}
							onValueChange={(v) => {
								setType(v);
								setPage(1);
							}}
						>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="general">General</SelectItem>
								<SelectItem value="schedule_visit">Schedule Visit</SelectItem>
								<SelectItem value="callback">Callback</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={agentFilter}
							onValueChange={(v) => {
								setAgent(v);
								setPage(1);
							}}
						>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="All Agents" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Agents</SelectItem>
								<SelectItem value="unassigned">Unassigned</SelectItem>
								{agents.map((a) => (
									<SelectItem key={a.id} value={String(a.id)}>
										{a.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{hasFilters && (
							<button
								onClick={clearFilters}
								className="text-xs text-primary hover:underline flex items-center gap-1 px-1"
							>
								<X className="w-3 h-3" /> Clear
							</button>
						)}
					</div>
					{hasFilters && !loading && (
						<p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
							<Filter className="w-3 h-3" /> Showing {filteredSorted.length} of{' '}
							{inquiries.length}
						</p>
					)}
				</CardContent>
			</Card>

			{/* ── Bulk bar ── */}
			{selected.size > 0 && (
				<div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
					<span className="text-sm font-medium">{selected.size} selected</span>
					<Button
						size="sm"
						variant="outline"
						onClick={bulkDelete}
						className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:border-destructive"
					>
						<Trash2 className="w-3 h-3" /> Delete
					</Button>
					<button
						onClick={() => setSelected(new Set())}
						className="ml-auto text-xs text-muted-foreground hover:text-foreground"
					>
						Clear
					</button>
				</div>
			)}

			{/* ── Table ── */}
			<Card className="bg-card border border-border shadow-none overflow-hidden">
				{paginatedRows.length > 0 && !loading && (
					<div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
						<button
							onClick={toggleAll}
							className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{selected.size === paginatedRows.length ? (
								<CheckSquare className="w-4 h-4 text-primary" />
							) : (
								<Square className="w-4 h-4" />
							)}
							Select all
						</button>
					</div>
				)}
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-8" />
								<TableHead>
									<button
										onClick={() => toggleSort('name')}
										className="flex items-center gap-1 hover:text-foreground"
									>
										Contact{' '}
										{sortKey === 'name' ? (
											sortDir === 'asc' ? (
												<SortAsc className="w-3 h-3 text-primary" />
											) : (
												<SortDesc className="w-3 h-3 text-primary" />
											)
										) : (
											<SortAsc className="w-3 h-3 opacity-30" />
										)}
									</button>
								</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Assign Agent</TableHead>
								<TableHead>
									<button
										onClick={() => toggleSort('date')}
										className="flex items-center gap-1 hover:text-foreground"
									>
										Date{' '}
										{sortKey === 'date' ? (
											sortDir === 'asc' ? (
												<SortAsc className="w-3 h-3 text-primary" />
											) : (
												<SortDesc className="w-3 h-3 text-primary" />
											)
										) : (
											<SortAsc className="w-3 h-3 opacity-30" />
										)}
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => toggleSort('status')}
										className="flex items-center gap-1 hover:text-foreground"
									>
										Status{' '}
										{sortKey === 'status' ? (
											sortDir === 'asc' ? (
												<SortAsc className="w-3 h-3 text-primary" />
											) : (
												<SortDesc className="w-3 h-3 text-primary" />
											)
										) : (
											<SortAsc className="w-3 h-3 opacity-30" />
										)}
									</button>
								</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 6 }).map((_, i) => (
									<TableRow key={i}>
										{[...Array(7)].map((_, j) => (
											<TableCell key={j}>
												<div className="h-4 bg-muted rounded animate-pulse" />
											</TableCell>
										))}
									</TableRow>
								))
							) : paginatedRows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7}>
										<div className="flex flex-col items-center py-16 text-muted-foreground">
											{hasFilters ? (
												<>
													<AlertCircle className="w-8 h-8 mb-2 opacity-30" />
													<p className="text-sm">
														No inquiries match your filters
													</p>
													<button
														onClick={clearFilters}
														className="text-xs text-primary mt-1 hover:underline"
													>
														Clear filters
													</button>
												</>
											) : (
												<>
													<MessageSquare className="w-8 h-8 mb-2 opacity-30" />
													<p className="text-sm">No inquiries yet</p>
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							) : (
								paginatedRows.map((inquiry) => {
									const TypeIcon =
										typeIcon[inquiry.inquiry_type] || MessageSquare;
									const StatusIcon =
										statusIcon[inquiry.status] || MessageSquare;
									const status = getStatus(inquiry.status);
									return (
										<TableRow
											key={inquiry.id}
											className={cn(selected.has(inquiry.id) && 'bg-primary/5')}
										>
											<TableCell>
												<button onClick={() => toggleSelect(inquiry.id)}>
													{selected.has(inquiry.id) ? (
														<CheckSquare className="w-4 h-4 text-primary" />
													) : (
														<Square className="w-4 h-4 text-muted-foreground" />
													)}
												</button>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2.5">
													<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
														{inquiry.name?.charAt(0)?.toUpperCase()}
													</div>
													<div>
														<button
															onClick={() => openDetail(inquiry)}
															className="text-sm font-medium text-foreground hover:text-primary transition-colors"
														>
															{inquiry.name}
														</button>
														<div className="flex flex-col gap-0.5 mt-0.5">
															<a
																href={`tel:${inquiry.phone}`}
																className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
															>
																<Phone className="w-3 h-3" />
																{inquiry.phone}
															</a>
															{inquiry.email && (
																<span className="text-xs text-muted-foreground flex items-center gap-1">
																	<Mail className="w-3 h-3" />
																	{inquiry.email}
																</span>
															)}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<span className="flex items-center gap-1.5 text-sm capitalize">
													<TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
													{inquiry.inquiry_type?.replace('_', ' ') || 'General'}
												</span>
											</TableCell>
											<TableCell>
												<Select
													value={
														inquiry.assigned_agent_id
															? String(inquiry.assigned_agent_id)
															: ''
													}
													onValueChange={(v) => assignAgent(inquiry.id, v)}
												>
													<SelectTrigger className="w-36 h-8 text-xs">
														{inquiry.assigned_agent_name ? (
															<div className="flex items-center gap-1">
																<UserCheck className="w-3 h-3 text-green-500" />
																<span className="truncate">
																	{inquiry.assigned_agent_name}
																</span>
															</div>
														) : (
															<SelectValue placeholder="Assign agent" />
														)}
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="unassign">Unassign</SelectItem>
														{agents.map((a) => (
															<SelectItem key={a.id} value={String(a.id)}>
																{a.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</TableCell>
											<TableCell>
												<p className="text-sm tabular-nums">
													{inquiry.created_at
														? format(
																new Date(
																	inquiry.created_at.endsWith('Z')
																		? inquiry.created_at
																		: inquiry.created_at + 'Z',
																),
																'MMM d, yyyy',
															)
														: '—'}
												</p>
												<p className="text-xs text-muted-foreground">
													{inquiry.created_at
														? format(
																new Date(
																	inquiry.created_at.endsWith('Z')
																		? inquiry.created_at
																		: inquiry.created_at + 'Z',
																),
																'h:mm a',
															)
														: ''}
												</p>
											</TableCell>
											<TableCell>
												<span
													className={cn(
														'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium capitalize',
														status.color,
													)}
												>
													<StatusIcon className="w-3 h-3" />
													{inquiry.status?.replace('_', ' ')}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
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
													<Button
														variant="ghost"
														size="sm"
														onClick={() => openDetail(inquiry)}
														className="h-7 text-xs gap-1"
													>
														<Eye className="w-3.5 h-3.5" /> View
													</Button>
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* ── Pagination ── */}
			{!loading && filteredSorted.length > PAGE_SIZE && (
				<div className="flex items-center justify-between">
					<span className="text-xs text-muted-foreground">
						{(safePage - 1) * PAGE_SIZE + 1}–
						{Math.min(safePage * PAGE_SIZE, filteredSorted.length)} of{' '}
						{filteredSorted.length}
					</span>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={safePage === 1}
							className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<span className="text-xs font-medium px-2">
							{safePage} / {totalPages}
						</span>
						<button
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={safePage === totalPages}
							className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			)}

			{/* ── Detail Dialog ── */}
			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<MessageSquare className="w-4 h-4 text-muted-foreground" />{' '}
							Inquiry Details
						</DialogTitle>
					</DialogHeader>
					{selectedInquiry && (
						<div className="space-y-5">
							{/* Contact block */}
							<div className="p-4 bg-muted/30 rounded-xl border border-border">
								<div className="flex items-start gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
										{selectedInquiry.name?.charAt(0)?.toUpperCase()}
									</div>
									<div className="flex-1">
										<h3 className="font-semibold text-foreground">
											{selectedInquiry.name}
										</h3>
										<div className="flex flex-wrap gap-3 mt-1.5 text-sm text-muted-foreground">
											<a
												href={`tel:${selectedInquiry.phone}`}
												className="flex items-center gap-1 hover:text-primary transition-colors"
											>
												<Phone className="w-3.5 h-3.5" />
												{selectedInquiry.phone}
											</a>
											{selectedInquiry.email && (
												<span className="flex items-center gap-1">
													<Mail className="w-3.5 h-3.5" />
													{selectedInquiry.email}
												</span>
											)}
										</div>
									</div>
									<span
										className={cn(
											'text-xs px-2 py-1 rounded-full font-medium capitalize',
											getStatus(selectedInquiry.status).color,
										)}
									>
										{selectedInquiry.status?.replace('_', ' ')}
									</span>
								</div>
								{selectedInquiry.message && (
									<p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
										{selectedInquiry.message}
									</p>
								)}
							</div>

							{/* Meta row */}
							<div className="grid grid-cols-2 gap-3">
								<div className="p-3 bg-muted/20 rounded-lg border border-border">
									<p className="text-xs text-muted-foreground mb-0.5">
										Assigned Agent
									</p>
									<p className="text-sm font-medium">
										{selectedInquiry.assigned_agent_name || (
											<span className="text-muted-foreground">
												Not assigned
											</span>
										)}
									</p>
								</div>
								<div className="p-3 bg-muted/20 rounded-lg border border-border">
									<p className="text-xs text-muted-foreground mb-0.5">
										Inquiry Type
									</p>
									<p className="text-sm font-medium capitalize">
										{selectedInquiry.inquiry_type?.replace('_', ' ') ||
											'General'}
									</p>
								</div>
							</div>

							{/* Notes */}
							<div>
								<p className="text-sm font-medium mb-3">Conversation History</p>
								<div className="space-y-2 max-h-56 overflow-y-auto pr-1">
									{selectedInquiry.notes?.length > 0 ? (
										selectedInquiry.notes.map((log, i) => (
											<div
												key={i}
												className="flex gap-2.5 p-3 bg-muted/30 rounded-lg border border-border"
											>
												<div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
													<CheckCircle2 className="w-3.5 h-3.5 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm">{log.text}</p>
													<p className="text-xs text-muted-foreground mt-1 flex justify-between">
														<span>{log.author || 'Agent'}</span>
														<span>
															{log.timestamp
																? format(
																		new Date(
																			log.timestamp.endsWith('Z')
																				? log.timestamp
																				: log.timestamp + 'Z',
																		),
																		'MMM d, h:mm a',
																	)
																: ''}
														</span>
													</p>
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground text-center py-6">
											No notes yet
										</p>
									)}
								</div>
							</div>

							{/* Add note */}
							<div className="pt-4 border-t border-border space-y-3">
								<Label>Add Note</Label>
								<Textarea
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									placeholder="Enter notes about this inquiry..."
									rows={3}
								/>
								<Button
									disabled={!newMessage.trim() || submitting}
									onClick={addLog}
									className="gap-2"
								>
									{submitting ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Send className="w-4 h-4" />
									)}
									Add Note
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default InquiriesPage;
