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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Plus,
	Search,
	Pencil,
	Trash2,
	Eye,
	User,
	Phone,
	Mail,
	Loader2,
	RefreshCw,
	X,
	SortAsc,
	SortDesc,
	Copy,
	Download,
	Building2,
	CheckSquare,
	Square,
	AlertCircle,
	Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/lib/api';

const EMPTY_FORM = {
	name: '',
	email: '',
	phone: '',
	address: '',
	bank_details: '',
	notes: '',
};

const OwnersPage = () => {
	const [owners, setOwners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatus] = useState('all');
	const [sortKey, setSortKey] = useState('name');
	const [sortDir, setSortDir] = useState('asc');
	const [selected, setSelected] = useState(new Set());
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [editingOwner, setEditing] = useState(null);
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [saving, setSaving] = useState(false);

	const fetchOwners = useCallback(async (silent = false) => {
		if (silent) setRefreshing(true);
		else setLoading(true);
		try {
			const res = await api.get('/owners');
			setOwners(res.data || []);
		} catch {
			setOwners([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchOwners();
	}, [fetchOwners]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			editingOwner
				? await api.put(`/owners/${editingOwner.id}`, formData)
				: await api.post('/owners', formData);
			toast.success(editingOwner ? 'Owner updated' : 'Owner created');
			setDialogOpen(false);
			resetForm();
			fetchOwners(true);
		} catch {
			toast.error('Failed to save owner');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/owners/${id}`);
			setOwners((p) => p.filter((o) => o.id !== id));
			toast.success('Owner deleted');
		} catch {
			toast.error('Failed to delete');
		}
	};

	const bulkDelete = async () => {
		if (!window.confirm(`Delete ${selected.size} owners?`)) return;
		try {
			await Promise.all([...selected].map((id) => api.delete(`/owners/${id}`)));
			setOwners((p) => p.filter((o) => !selected.has(o.id)));
			setSelected(new Set());
			toast.success(`${selected.size} owners deleted`);
		} catch {
			toast.error('Bulk delete failed');
		}
	};

	const toggleStatus = async (owner) => {
		const s = owner.status === 'active' ? 'inactive' : 'active';
		try {
			await api.put(`/owners/${owner.id}`, { status: s });
			setOwners((p) =>
				p.map((o) => (o.id === owner.id ? { ...o, status: s } : o)),
			);
			toast.success(`Owner ${s}`);
		} catch {
			toast.error('Failed to update status');
		}
	};

	const openEdit = (owner) => {
		setEditing(owner);
		setFormData({
			name: owner.name,
			email: owner.email,
			phone: owner.phone,
			address: owner.address || '',
			bank_details: owner.bank_details || '',
			notes: owner.notes || '',
		});
		setDialogOpen(true);
	};

	const resetForm = () => {
		setEditing(null);
		setFormData(EMPTY_FORM);
	};

	const exportCSV = () => {
		const rows = [
			['Name', 'Email', 'Phone', 'Address', 'Properties', 'Status'],
			...filteredSorted.map((o) => [
				o.name,
				o.email,
				o.phone,
				o.address || '',
				o.property_count || 0,
				o.status,
			]),
		];
		const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
		a.download = 'owners.csv';
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
			: setSelected(new Set(filteredSorted.map((o) => o.id)));

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

	const filteredSorted = owners
		.filter((o) => {
			if (
				search &&
				!o.name.toLowerCase().includes(search.toLowerCase()) &&
				!o.email.toLowerCase().includes(search.toLowerCase()) &&
				!o.phone.includes(search)
			)
				return false;
			if (statusFilter !== 'all' && o.status !== statusFilter) return false;
			return true;
		})
		.sort((a, b) => {
			const mul = sortDir === 'asc' ? 1 : -1;
			if (sortKey === 'properties')
				return ((a.property_count || 0) - (b.property_count || 0)) * mul;
			return (a.name || '').localeCompare(b.name || '') * mul;
		});

	const activeCount = owners.filter((o) => o.status === 'active').length;
	const totalProperties = owners.reduce(
		(s, o) => s + (o.property_count || 0),
		0,
	);
	const hasFilters = search || statusFilter !== 'all';

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Property Owners
					</h1>
					<div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
						<span>
							<strong className="text-foreground">{owners.length}</strong> total
						</span>
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
							{activeCount} active
						</span>
						<span className="flex items-center gap-1">
							<Building2 className="w-3 h-3" />
							<strong className="text-foreground">
								{totalProperties}
							</strong>{' '}
							properties
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => fetchOwners(true)}
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
								<Plus className="w-4 h-4" /> Add Owner
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>
									{editingOwner ? 'Edit Owner' : 'Add New Owner'}
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
									<Label>Address</Label>
									<Input
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
									/>
								</div>
								<div>
									<Label>Bank Details</Label>
									<Input
										value={formData.bank_details}
										onChange={(e) =>
											setFormData({ ...formData, bank_details: e.target.value })
										}
										placeholder="Account number / UPI / Bank name"
									/>
								</div>
								<div>
									<Label>Notes</Label>
									<Textarea
										rows={2}
										value={formData.notes}
										onChange={(e) =>
											setFormData({ ...formData, notes: e.target.value })
										}
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
										{editingOwner ? 'Update' : 'Create'}
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
								placeholder="Search name, email, phone..."
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
						<div className="flex items-center gap-1">
							{[
								{ v: 'all', l: 'All' },
								{ v: 'active', l: 'Active' },
								{ v: 'inactive', l: 'Inactive' },
							].map(({ v, l }) => (
								<button
									key={v}
									onClick={() => setStatus(v)}
									className={cn(
										'px-3 py-1.5 text-xs rounded-full border transition-colors',
										statusFilter === v
											? 'bg-primary text-primary-foreground border-primary'
											: 'border-border text-muted-foreground hover:border-primary/50',
									)}
								>
									{l}
								</button>
							))}
						</div>
						{hasFilters && (
							<button
								onClick={() => {
									setSearch('');
									setStatus('all');
								}}
								className="text-xs text-primary hover:underline flex items-center gap-1 px-1"
							>
								<X className="w-3 h-3" /> Clear
							</button>
						)}
					</div>
					{hasFilters && !loading && (
						<p className="text-xs text-muted-foreground mt-2">
							Showing {filteredSorted.length} of {owners.length}
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
									<SortBtn col="name" label="Owner" />
								</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>
									<SortBtn col="properties" label="Properties" />
								</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										{[...Array(6)].map((_, j) => (
											<TableCell key={j}>
												<div className="h-4 bg-muted rounded animate-pulse" />
											</TableCell>
										))}
									</TableRow>
								))
							) : filteredSorted.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6}>
										<div className="flex flex-col items-center py-14 text-muted-foreground">
											{hasFilters ? (
												<>
													<AlertCircle className="w-8 h-8 mb-2 opacity-30" />
													<p className="text-sm">
														No owners match your filters
													</p>
												</>
											) : (
												<>
													<User className="w-10 h-10 mb-3 opacity-30" />
													<p className="text-sm">No owners yet</p>
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredSorted.map((owner) => (
									<TableRow
										key={owner.id}
										className={cn(selected.has(owner.id) && 'bg-primary/5')}
									>
										<TableCell>
											<button onClick={() => toggleSelect(owner.id)}>
												{selected.has(owner.id) ? (
													<CheckSquare className="w-4 h-4 text-primary" />
												) : (
													<Square className="w-4 h-4 text-muted-foreground" />
												)}
											</button>
										</TableCell>
										<TableCell>
											<Link
												to={`/admin/owners/${owner.id}/dashboard`}
												className="flex items-center gap-2.5 group"
											>
												<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
													{owner.name?.charAt(0)?.toUpperCase()}
												</div>
												<div>
													<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
														{owner.name}
													</p>
													<p className="text-xs text-muted-foreground">
														Since{' '}
														{format(new Date(owner.created_at), 'MMM yyyy')}
													</p>
												</div>
											</Link>
										</TableCell>
										<TableCell>
											<div className="space-y-0.5">
												<a
													href={`tel:${owner.phone}`}
													className="text-xs flex items-center gap-1 hover:text-primary transition-colors"
												>
													<Phone className="w-3 h-3" />
													{owner.phone}
												</a>
												<a
													href={`mailto:${owner.email}`}
													className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
												>
													<Mail className="w-3 h-3" />
													{owner.email}
												</a>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1.5">
												<Building2 className="w-3.5 h-3.5 text-muted-foreground" />
												<span className="font-semibold">
													{owner.property_count || 0}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<button
												onClick={() => toggleStatus(owner)}
												className={cn(
													'text-xs px-2.5 py-1 rounded-full font-medium capitalize transition-colors cursor-pointer',
													owner.status === 'active'
														? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
														: 'bg-muted text-muted-foreground hover:bg-muted/80',
												)}
											>
												{owner.status}
											</button>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-end gap-1">
												<button
													onClick={() => {
														navigator.clipboard.writeText(owner.phone);
														toast.success('Phone copied');
													}}
													className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
													title="Copy phone"
												>
													<Copy className="w-3.5 h-3.5" />
												</button>
												<Button variant="ghost" size="icon" asChild>
													<Link to={`/admin/owners/${owner.id}/dashboard`}>
														<Eye className="w-4 h-4" />
													</Link>
												</Button>
												<button
													onClick={() => openEdit(owner)}
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
															<AlertDialogTitle>Delete Owner</AlertDialogTitle>
															<AlertDialogDescription>
																Delete "{owner.name}"? This cannot be undone.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(owner.id)}
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
						<span>{filteredSorted.length} owners</span>
						<span>
							{activeCount} active · {owners.length - activeCount} inactive ·{' '}
							{totalProperties} total properties
						</span>
					</div>
				)}
			</Card>
		</div>
	);
};

export default OwnersPage;
