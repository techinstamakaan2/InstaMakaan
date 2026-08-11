import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Plus,
	Search,
	Pencil,
	Trash2,
	Eye,
	UserCheck,
	Phone,
	Mail,
	MessageSquare,
	Loader2,
	RefreshCw,
	X,
	SortAsc,
	SortDesc,
	ChevronRight,
	Copy,
	CheckSquare,
	Square,
	Download,
	AlertCircle,
	Activity,
	TrendingUp,
	Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/lib/api';

const EMPTY_FORM = {
	name: '',
	email: '',
	phone: '',
	designation: 'Field Agent',
	notes: '',
};

const AgentsPage = () => {
	const [agents, setAgents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatus] = useState('all');
	const [desigFilter, setDesig] = useState('all');
	const [sortKey, setSortKey] = useState('name');
	const [sortDir, setSortDir] = useState('asc');
	const [selected, setSelected] = useState(new Set());
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [editingAgent, setEditing] = useState(null);
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [saving, setSaving] = useState(false);

	const fetchAgents = useCallback(async (silent = false) => {
		if (silent) setRefreshing(true);
		else setLoading(true);
		try {
			const { data } = await api.get('/agents');
			setAgents(data);
		} catch {
			toast.error('Failed to load agents');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchAgents();
	}, [fetchAgents]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			editingAgent
				? await api.put(`/agents/${editingAgent.id}`, formData)
				: await api.post('/agents', formData);
			toast.success(editingAgent ? 'Agent updated' : 'Agent created');
			setDialogOpen(false);
			resetForm();
			fetchAgents(true);
		} catch {
			toast.error('Failed to save agent');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/agents/${id}`);
			setAgents((p) => p.filter((a) => a.id !== id));
			toast.success('Agent deleted');
		} catch {
			toast.error('Failed to delete');
		}
	};

	const bulkDelete = async () => {
		if (!window.confirm(`Delete ${selected.size} agents?`)) return;
		try {
			await Promise.all([...selected].map((id) => api.delete(`/agents/${id}`)));
			setAgents((p) => p.filter((a) => !selected.has(a.id)));
			setSelected(new Set());
			toast.success(`${selected.size} agents deleted`);
		} catch {
			toast.error('Bulk delete failed');
		}
	};

	const toggleStatus = async (agent) => {
		const s = agent.status === 'active' ? 'inactive' : 'active';
		try {
			await api.put(`/agents/${agent.id}`, { status: s });
			setAgents((p) =>
				p.map((a) => (a.id === agent.id ? { ...a, status: s } : a)),
			);
			toast.success(`Agent ${s === 'active' ? 'activated' : 'deactivated'}`);
		} catch {
			toast.error('Failed to update status');
		}
	};

	const openEdit = (agent) => {
		setEditing(agent);
		setFormData({
			name: agent.name,
			email: agent.email,
			phone: agent.phone,
			designation: agent.designation || 'Field Agent',
			notes: agent.notes || '',
		});
		setDialogOpen(true);
	};

	const resetForm = () => {
		setEditing(null);
		setFormData(EMPTY_FORM);
	};

	const exportCSV = () => {
		const rows = [
			['Name', 'Email', 'Phone', 'Designation', 'Status', 'Inquiries'],
			...filteredSorted.map((a) => [
				a.name,
				a.email,
				a.phone,
				a.designation || '',
				a.status,
				a.total_inquiries_handled || 0,
			]),
		];
		const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
		a.download = 'agents.csv';
		a.click();
	};

	const toggleSelect = (id) =>
		setSelected((p) => {
			const n = new Set(p);
			n.has(id) ? n.delete(id) : n.add(id);
			return n;
		});
	const toggleAll = () =>
		selected.size === filteredSorted.length
			? setSelected(new Set())
			: setSelected(new Set(filteredSorted.map((a) => a.id)));

	const toggleSort = (key) => {
		if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		else {
			setSortKey(key);
			setSortDir('asc');
		}
	};
	const SortBtn = ({ col, label }) => (
		<button
			onClick={() => toggleSort(col)}
			className="flex items-center gap-1 hover:text-foreground transition-colors"
		>
			{label}{' '}
			{sortKey === col ? (
				sortDir === 'asc' ? (
					<SortAsc className="w-3 h-3 text-primary" />
				) : (
					<SortDesc className="w-3 h-3 text-primary" />
				)
			) : (
				<SortAsc className="w-3 h-3 opacity-30" />
			)}
		</button>
	);

	const filteredSorted = agents
		.filter((a) => {
			if (
				search &&
				!a.name.toLowerCase().includes(search.toLowerCase()) &&
				!a.email.toLowerCase().includes(search.toLowerCase()) &&
				!a.phone.includes(search)
			)
				return false;
			if (statusFilter !== 'all' && a.status !== statusFilter) return false;
			if (desigFilter !== 'all' && a.designation !== desigFilter) return false;
			return true;
		})
		.sort((a, b) => {
			const mul = sortDir === 'asc' ? 1 : -1;
			if (sortKey === 'inquiries')
				return (
					((a.total_inquiries_handled || 0) -
						(b.total_inquiries_handled || 0)) *
					mul
				);
			return (a.name || '').localeCompare(b.name || '') * mul;
		});

	const activeCount = agents.filter((a) => a.status === 'active').length;
	const totalInquiries = agents.reduce(
		(s, a) => s + (a.total_inquiries_handled || 0),
		0,
	);
	const hasFilters = search || statusFilter !== 'all' || desigFilter !== 'all';

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Agents</h1>
					<div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
						<span>
							<strong className="text-foreground">{agents.length}</strong> total
						</span>
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
							{activeCount} active
						</span>
						<span>
							<strong className="text-foreground">{totalInquiries}</strong>{' '}
							inquiries handled
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => fetchAgents(true)}
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
					<Dialog
						open={isDialogOpen}
						onOpenChange={(o) => {
							setDialogOpen(o);
							if (!o) resetForm();
						}}
					>
						<DialogTrigger asChild>
							<Button className="gap-2">
								<Plus className="w-4 h-4" /> Add Agent
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>
									{editingAgent ? 'Edit Agent' : 'Add New Agent'}
								</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4 mt-2">
								<div className="grid sm:grid-cols-2 gap-4">
									<div>
										<Label>Name *</Label>
										<Input
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<Label>Phone *</Label>
										<Input
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
											required
										/>
									</div>
								</div>
								<div>
									<Label>Email *</Label>
									<Input
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label>Designation</Label>
									<Select
										value={formData.designation}
										onValueChange={(v) =>
											setFormData({ ...formData, designation: v })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Field Agent">Field Agent</SelectItem>
											<SelectItem value="Senior Agent">Senior Agent</SelectItem>
											<SelectItem value="Team Lead">Team Lead</SelectItem>
											<SelectItem value="Manager">Manager</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Notes</Label>
									<Textarea
										value={formData.notes}
										onChange={(e) =>
											setFormData({ ...formData, notes: e.target.value })
										}
										rows={2}
									/>
								</div>
								<div className="flex justify-end gap-3 pt-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => setDialogOpen(false)}
									>
										Cancel
									</Button>
									<Button type="submit" disabled={saving} className="gap-2">
										{saving && <Loader2 className="w-4 h-4 animate-spin" />}
										{editingAgent ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* ── Filters ── */}
			<Card className="bg-card border border-border shadow-none">
				<CardContent className="p-4">
					<div className="flex flex-wrap gap-3">
						<div className="relative flex-1 min-w-48">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search agents..."
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
						<Select value={statusFilter} onValueChange={setStatus}>
							<SelectTrigger className="w-36">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
						<Select value={desigFilter} onValueChange={setDesig}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="All Roles" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="Field Agent">Field Agent</SelectItem>
								<SelectItem value="Senior Agent">Senior Agent</SelectItem>
								<SelectItem value="Team Lead">Team Lead</SelectItem>
								<SelectItem value="Manager">Manager</SelectItem>
							</SelectContent>
						</Select>
						{hasFilters && (
							<button
								onClick={() => {
									setSearch('');
									setStatus('all');
									setDesig('all');
								}}
								className="text-xs text-primary hover:underline flex items-center gap-1 px-1"
							>
								<X className="w-3 h-3" /> Clear
							</button>
						)}
					</div>
					{hasFilters && !loading && (
						<p className="text-xs text-muted-foreground mt-2">
							Showing {filteredSorted.length} of {agents.length} agents
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
				{filteredSorted.length > 0 && !loading && (
					<div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
						<button
							onClick={toggleAll}
							className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{selected.size === filteredSorted.length ? (
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
									<SortBtn col="name" label="Agent" />
								</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>Designation</TableHead>
								<TableHead>
									<SortBtn col="inquiries" label="Inquiries" />
								</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										{[...Array(7)].map((_, j) => (
											<TableCell key={j}>
												<div className="h-4 bg-muted rounded animate-pulse" />
											</TableCell>
										))}
									</TableRow>
								))
							) : filteredSorted.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7}>
										<div className="flex flex-col items-center py-14 text-muted-foreground">
											{hasFilters ? (
												<>
													<AlertCircle className="w-8 h-8 mb-2 opacity-30" />
													<p className="text-sm">
														No agents match your filters
													</p>
												</>
											) : (
												<>
													<UserCheck className="w-10 h-10 mb-3 opacity-30" />
													<p className="text-sm">No agents yet</p>
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredSorted.map((agent) => (
									<TableRow
										key={agent.id}
										className={cn(selected.has(agent.id) && 'bg-primary/5')}
									>
										<TableCell>
											<button onClick={() => toggleSelect(agent.id)}>
												{selected.has(agent.id) ? (
													<CheckSquare className="w-4 h-4 text-primary" />
												) : (
													<Square className="w-4 h-4 text-muted-foreground" />
												)}
											</button>
										</TableCell>
										<TableCell>
											<Link
												to={`/admin/agents/${agent.id}/inquiries`}
												className="flex items-center gap-2.5 group"
											>
												<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
													{agent.name?.charAt(0)?.toUpperCase()}
												</div>
												<div>
													<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
														{agent.name}
													</p>
													<p className="text-xs text-muted-foreground">
														Since{' '}
														{format(new Date(agent.created_at), 'MMM yyyy')}
													</p>
												</div>
											</Link>
										</TableCell>
										<TableCell>
											<div className="space-y-0.5">
												<a
													href={`tel:${agent.phone}`}
													className="text-xs flex items-center gap-1 hover:text-primary transition-colors"
												>
													<Phone className="w-3 h-3" />
													{agent.phone}
												</a>
												<a
													href={`mailto:${agent.email}`}
													className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
												>
													<Mail className="w-3 h-3" />
													{agent.email}
												</a>
											</div>
										</TableCell>
										<TableCell>
											<span className="text-sm px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
												{agent.designation}
											</span>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1.5">
												<MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
												<span className="font-semibold">
													{agent.total_inquiries_handled || 0}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<button
												onClick={() => toggleStatus(agent)}
												className={cn(
													'text-xs px-2.5 py-1 rounded-full font-medium capitalize transition-colors cursor-pointer',
													agent.status === 'active'
														? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
														: 'bg-muted text-muted-foreground hover:bg-muted/80',
												)}
											>
												{agent.status}
											</button>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-end gap-1">
												<button
													onClick={() => {
														navigator.clipboard.writeText(agent.phone);
														toast.success('Phone copied');
													}}
													className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
													title="Copy phone"
												>
													<Copy className="w-3.5 h-3.5" />
												</button>
												<Button variant="ghost" size="icon" asChild>
													<Link to={`/admin/agents/${agent.id}/inquiries`}>
														<Eye className="w-4 h-4" />
													</Link>
												</Button>
												<button
													onClick={() => openEdit(agent)}
													className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
												>
													<Pencil className="w-3.5 h-3.5" />
												</button>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<button className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
															<Trash2 className="w-3.5 h-3.5" />
														</button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Delete Agent</AlertDialogTitle>
															<AlertDialogDescription>
																Delete "{agent.name}"? This cannot be undone.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(agent.id)}
																className="bg-destructive text-destructive-foreground"
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
				{!loading && filteredSorted.length > 0 && (
					<div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
						<span>{filteredSorted.length} agents</span>
						<span>
							{activeCount} active · {agents.length - activeCount} inactive
						</span>
					</div>
				)}
			</Card>
		</div>
	);
};

export default AgentsPage;
