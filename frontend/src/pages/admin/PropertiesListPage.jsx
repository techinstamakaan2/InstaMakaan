import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	Plus,
	Search,
	Pencil,
	Trash2,
	Eye,
	Building2,
	Home,
	Key,
	MapPin,
	RefreshCw,
	X,
	CheckSquare,
	Square,
	LayoutGrid,
	List,
	SortAsc,
	SortDesc,
	Filter,
	Download,
	Copy,
	ExternalLink,
	ChevronLeft,
	ChevronRight,
	AlertCircle,
	TrendingUp,
	Activity,
	Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PropertyPreviewDrawer from '@/components/admin/PropertyPreviewDrawer';
import api from '@/lib/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

// ── Helpers ──────────────────────────────────────────────────────────────────
const getTypeIcon = (type) => {
	switch (type) {
		case 'rent':
			return Key;
		case 'buy':
			return Building2;
		default:
			return Building2;
	}
};

const getStatusConfig = (status) => {
	switch (status) {
		case 'active':
			return { cls: 'bg-green-500/10 text-green-600', dot: 'bg-green-500' };
		case 'inactive':
			return {
				cls: 'bg-muted text-muted-foreground',
				dot: 'bg-muted-foreground',
			};
		case 'rented':
			return { cls: 'bg-primary/10 text-primary', dot: 'bg-primary' };
		case 'sold':
			return { cls: 'bg-orange-500/10 text-orange-500', dot: 'bg-orange-500' };
		default:
			return {
				cls: 'bg-muted text-muted-foreground',
				dot: 'bg-muted-foreground',
			};
	}
};

const getImageSrc = (images) => {
	const img = images?.[0];
	if (!img) return null;
	const url = typeof img === 'object' ? img.url : img;
	if (!url) return null;
	return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
};

const formatPrice = (price) => {
	if (!price && price !== 0) return '—';
	const n = Number(price);
	if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
	if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
	if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
	return `₹${n}`;
};

// ── Summary Bar ───────────────────────────────────────────────────────────────
// Shows filtered count vs total. When no filter: "14 total". When filtered: "3 of 14"
const SummaryBar = ({ properties, totalInDB }) => {
	const total = properties.length;
	const active = properties.filter((p) => p.status === 'active').length;
	const inactive = properties.filter((p) => p.status === 'inactive').length;
	const rented = properties.filter((p) => p.status === 'rented').length;
	const sold = properties.filter((p) => p.status === 'sold').length;
	const isFiltered = total !== totalInDB;

	return (
		<div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
			<span className="font-medium text-foreground">
				{isFiltered ? `${total} of ${totalInDB}` : `${total} total`}
			</span>
			<span className="flex items-center gap-1">
				<span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
				{active} active
			</span>
			<span className="flex items-center gap-1">
				<span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
				{inactive} inactive
			</span>
			<span className="flex items-center gap-1">
				<span className="w-2 h-2 rounded-full bg-primary inline-block" />
				{rented} rented
			</span>
			<span className="flex items-center gap-1">
				<span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
				{sold} sold
			</span>
		</div>
	);
};

// ── Property Card (grid view) ─────────────────────────────────────────────────
const PropertyCard = ({
	property,
	selected,
	onSelect,
	onPreview,
	onDelete,
}) => {
	const TypeIcon = getTypeIcon(property.property_type);
	const { cls: statusCls } = getStatusConfig(property.status);
	const imgSrc = getImageSrc(property.images);

	return (
		<div
			className={cn(
				'border rounded-xl overflow-hidden bg-card transition-all hover:border-primary/40 group',
				selected ? 'border-primary ring-1 ring-primary' : 'border-border',
			)}
		>
			{/* Image */}
			<div className="relative aspect-video bg-muted">
				{imgSrc ? (
					<img
						src={imgSrc}
						alt={property.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Building2 className="w-8 h-8 text-muted-foreground/30" />
					</div>
				)}
				{/* Select */}
				<button
					onClick={() => onSelect(property.id)}
					className="absolute top-2 left-2 p-1 bg-background/80 backdrop-blur-sm rounded-md"
				>
					{selected ? (
						<CheckSquare className="w-3.5 h-3.5 text-primary" />
					) : (
						<Square className="w-3.5 h-3.5 text-muted-foreground" />
					)}
				</button>
				{/* Status */}
				<span
					className={cn(
						'absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-medium capitalize',
						statusCls,
					)}
				>
					{property.status}
				</span>
			</div>

			{/* Info */}
			<div className="p-3">
				<button
					onClick={() => onPreview(property.id)}
					className="text-sm font-semibold text-foreground hover:text-primary line-clamp-1 text-left w-full"
				>
					{property.title}
				</button>
				<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
					<MapPin className="w-3 h-3 flex-shrink-0" />
					<span className="truncate">
						{property.location}
						{property.city ? ` · ${property.city}` : ''}
					</span>
				</p>
				<div className="flex items-center justify-between mt-2.5">
					<span className="text-sm font-bold text-foreground">
						{formatPrice(property.price)}
					</span>
					<span className="text-xs text-muted-foreground flex items-center gap-1 capitalize">
						<TypeIcon className="w-3 h-3" />
						{property.property_type?.replace('-', ' ')}
					</span>
				</div>
				{/* Actions */}
				<div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-border">
					<button
						onClick={() => onPreview(property.id)}
						className="flex-1 text-xs py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground flex items-center justify-center gap-1"
					>
						<Eye className="w-3 h-3" /> Preview
					</button>
					<Link
						to={`/admin/properties/${property.id}/edit`}
						className="flex-1 text-xs py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground flex items-center justify-center gap-1"
					>
						<Pencil className="w-3 h-3" /> Edit
					</Link>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<button className="px-2 py-1.5 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground">
								<Trash2 className="w-3 h-3" />
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Property</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete "{property.title}"? This
									cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => onDelete(property.id)}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	);
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const PropertiesListPage = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Filters
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [cityFilter, setCityFilter] = useState('');

	// Sort
	const [sortKey, setSortKey] = useState('created'); // created | title | price
	const [sortDir, setSortDir] = useState('desc');

	// View + Selection
	const [view, setView] = useState('list');
	const [selected, setSelected] = useState(new Set());

	// Pagination
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Preview
	const [previewPropertyId, setPreviewPropertyId] = useState(null);

	// ── Fetch ALL properties for admin (limit=1000 so nothing is cut off) ───
	const fetchProperties = useCallback(async (silent = false) => {
		if (silent) setRefreshing(true);
		else setLoading(true);
		try {
			const res = await api.get('/properties?limit=1000');
			const list = Array.isArray(res.data)
				? res.data
				: Array.isArray(res.data?.data)
					? res.data.data
					: [];
			setProperties(list);
		} catch (error) {
			console.error('Error fetching properties:', error);
			toast.error('Failed to load properties');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchProperties();
	}, [fetchProperties]);

	// ── Delete ──────────────────────────────────────────────────────────────
	const handleDelete = async (id) => {
		try {
			await api.delete(`/properties/${id}`);
			setProperties((prev) => prev.filter((p) => p.id !== id));
			setSelected((prev) => {
				const n = new Set(prev);
				n.delete(id);
				return n;
			});
			toast.success('Property deleted');
		} catch {
			toast.error('Failed to delete property');
		}
	};

	// ── Bulk delete ─────────────────────────────────────────────────────────
	const handleBulkDelete = async () => {
		if (
			!window.confirm(
				`Delete ${selected.size} properties? This cannot be undone.`,
			)
		)
			return;
		try {
			await Promise.all(
				[...selected].map((id) => api.delete(`/properties/${id}`)),
			);
			setProperties((prev) => prev.filter((p) => !selected.has(p.id)));
			setSelected(new Set());
			toast.success(`${selected.size} properties deleted`);
		} catch {
			toast.error('Bulk delete failed');
		}
	};

	// ── Status quick-update ─────────────────────────────────────────────────
	const handleStatusChange = async (id, status) => {
		try {
			await api.put(`/properties/${id}`, { status });
			setProperties((prev) =>
				prev.map((p) => (p.id === id ? { ...p, status } : p)),
			);
			toast.success('Status updated');
		} catch {
			toast.error('Failed to update status');
		}
	};

	// ── Export CSV ──────────────────────────────────────────────────────────
	const handleExportCSV = () => {
		const rows = [
			['ID', 'Title', 'Type', 'Status', 'Price', 'Location', 'City'],
			...filteredSorted.map((p) => [
				p.id,
				p.title,
				p.property_type,
				p.status,
				p.price,
				p.location,
				p.city || '',
			]),
		];
		const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'properties.csv';
		a.click();
		URL.revokeObjectURL(url);
		toast.success('CSV exported');
	};

	// ── Selection ───────────────────────────────────────────────────────────
	const toggleSelect = (id) =>
		setSelected((prev) => {
			const n = new Set(prev);
			n.has(id) ? n.delete(id) : n.add(id);
			return n;
		});
	const toggleSelectAll = () => {
		if (selected.size === paginatedRows.length) setSelected(new Set());
		else setSelected(new Set(paginatedRows.map((p) => p.id)));
	};

	// ── Filter + Sort ────────────────────────────────────────────────────────
	const filteredSorted = (properties || [])
		.filter((p) => {
			if (
				searchQuery &&
				!p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!p.location.toLowerCase().includes(searchQuery.toLowerCase())
			)
				return false;
			if (typeFilter !== 'all' && p.property_type !== typeFilter) return false;
			if (statusFilter !== 'all' && p.status !== statusFilter) return false;
			if (
				cityFilter &&
				!(p.city || '').toLowerCase().includes(cityFilter.toLowerCase())
			)
				return false;
			return true;
		})
		.sort((a, b) => {
			const mul = sortDir === 'asc' ? 1 : -1;
			if (sortKey === 'title') return a.title.localeCompare(b.title) * mul;
			if (sortKey === 'price') return (Number(a.price) - Number(b.price)) * mul;
			return (a.id - b.id) * mul;
		});

	const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
	const safePage = Math.min(page, totalPages);
	const paginatedRows = filteredSorted.slice(
		(safePage - 1) * pageSize,
		safePage * pageSize,
	);

	const hasActiveFilters =
		searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || cityFilter;

	const clearFilters = () => {
		setSearchQuery('');
		setTypeFilter('all');
		setStatusFilter('all');
		setCityFilter('');
	};

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
			{label}
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

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Properties</h1>
					<div className="mt-1">
						{/* SummaryBar now receives filteredSorted + totalInDB so count updates with filters */}
						{!loading && (
							<SummaryBar
								properties={filteredSorted}
								totalInDB={properties.length}
							/>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => fetchProperties(true)}
						disabled={refreshing}
						className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
						title="Refresh"
					>
						<RefreshCw
							className={cn('w-4 h-4', refreshing && 'animate-spin')}
						/>
					</button>
					<Button
						variant="outline"
						onClick={handleExportCSV}
						className="gap-2 hidden sm:flex"
					>
						<Download className="w-4 h-4" /> Export CSV
					</Button>
					<Button asChild>
						<Link to="/admin/properties/new">
							<Plus className="w-4 h-4 mr-2" /> Add Property
						</Link>
					</Button>
				</div>
			</div>

			{/* ── Filters ── */}
			<Card className="bg-card border border-border shadow-none">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-3 flex-wrap">
						{/* Search */}
						<div className="relative flex-1 min-w-48">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search title or location..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
								className="pl-10 pr-8"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									<X className="w-3.5 h-3.5" />
								</button>
							)}
						</div>

						{/* City */}
						<div className="relative w-full sm:w-36">
							<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="City..."
								value={cityFilter}
								onChange={(e) => {
									setCityFilter(e.target.value);
									setPage(1);
								}}
								className="pl-9"
							/>
						</div>

						{/* Type */}
						<Select
							value={typeFilter}
							onValueChange={(v) => {
								setTypeFilter(v);
								setPage(1);
							}}
						>
							<SelectTrigger className="w-full sm:w-40">
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="rent">Rent</SelectItem>
								<SelectItem value="buy">Buy</SelectItem>
							</SelectContent>
						</Select>

						{/* Status */}
						<Select
							value={statusFilter}
							onValueChange={(v) => {
								setStatusFilter(v);
								setPage(1);
							}}
						>
							<SelectTrigger className="w-full sm:w-36">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="rented">Rented</SelectItem>
								<SelectItem value="sold">Sold</SelectItem>
							</SelectContent>
						</Select>

						{/* Clear */}
						{hasActiveFilters && (
							<button
								onClick={clearFilters}
								className="text-xs text-primary hover:underline flex items-center gap-1 px-2"
							>
								<X className="w-3 h-3" /> Clear filters
							</button>
						)}

						{/* View toggle */}
						<div className="flex items-center gap-1 ml-auto">
							<button
								onClick={() => setView('list')}
								className={cn(
									'p-2 rounded-lg transition-colors',
									view === 'list'
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:bg-muted',
								)}
							>
								<List className="w-4 h-4" />
							</button>
							<button
								onClick={() => setView('grid')}
								className={cn(
									'p-2 rounded-lg transition-colors',
									view === 'grid'
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:bg-muted',
								)}
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Filter result summary — removed, now handled by SummaryBar above */}
				</CardContent>
			</Card>

			{/* ── Bulk Actions ── */}
			{selected.size > 0 && (
				<div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
					<span className="text-sm font-medium">{selected.size} selected</span>
					<Button
						size="sm"
						variant="outline"
						onClick={handleBulkDelete}
						className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:border-destructive"
					>
						<Trash2 className="w-3 h-3" /> Delete Selected
					</Button>
					<button
						onClick={() => setSelected(new Set())}
						className="ml-auto text-xs text-muted-foreground hover:text-foreground"
					>
						Clear
					</button>
				</div>
			)}

			{/* ── Table / Grid ── */}
			{view === 'grid' ? (
				<div>
					{loading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="border border-border rounded-xl overflow-hidden animate-pulse"
								>
									<div className="aspect-video bg-muted" />
									<div className="p-3 space-y-2">
										<div className="h-4 bg-muted rounded w-3/4" />
										<div className="h-3 bg-muted rounded w-1/2" />
									</div>
								</div>
							))}
						</div>
					) : paginatedRows.length === 0 ? (
						<EmptyState
							hasFilters={!!hasActiveFilters}
							onClear={clearFilters}
						/>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{paginatedRows.map((property) => (
								<PropertyCard
									key={property.id}
									property={property}
									selected={selected.has(property.id)}
									onSelect={toggleSelect}
									onPreview={setPreviewPropertyId}
									onDelete={handleDelete}
								/>
							))}
						</div>
					)}
				</div>
			) : (
				<Card className="bg-card border border-border shadow-none overflow-hidden">
					{/* Select all bar */}
					{paginatedRows.length > 0 && !loading && (
						<div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
							<button
								onClick={toggleSelectAll}
								className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
							>
								{selected.size === paginatedRows.length &&
								paginatedRows.length > 0 ? (
									<CheckSquare className="w-4 h-4 text-primary" />
								) : (
									<Square className="w-4 h-4" />
								)}
								Select all on page
							</button>
						</div>
					)}

					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-8" />
									<TableHead>
										<SortBtn col="title" label="Property" />
									</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>
										<SortBtn col="price" label="Price" />
									</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{loading ? (
									Array.from({ length: 6 }).map((_, i) => (
										<TableRow key={i}>
											{[...Array(6)].map((_, j) => (
												<TableCell key={j}>
													<div className="h-4 bg-muted rounded animate-pulse" />
												</TableCell>
											))}
										</TableRow>
									))
								) : paginatedRows.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="py-0">
											<EmptyState
												hasFilters={!!hasActiveFilters}
												onClear={clearFilters}
											/>
										</TableCell>
									</TableRow>
								) : (
									paginatedRows.map((property) => {
										const TypeIcon = getTypeIcon(property.property_type);
										const { cls: statusCls, dot } = getStatusConfig(
											property.status,
										);
										const imgSrc = getImageSrc(property.images);

										return (
											<TableRow
												key={property.id}
												className={cn(
													!selected.has(property.id) ? '' : 'bg-primary/5',
												)}
											>
												{/* Checkbox */}
												<TableCell>
													<button onClick={() => toggleSelect(property.id)}>
														{selected.has(property.id) ? (
															<CheckSquare className="w-4 h-4 text-primary" />
														) : (
															<Square className="w-4 h-4 text-muted-foreground" />
														)}
													</button>
												</TableCell>

												{/* Property */}
												<TableCell>
													<div className="flex items-center gap-3">
														<div className="w-14 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
															{imgSrc ? (
																<img
																	src={imgSrc}
																	alt={property.title}
																	className="w-full h-full object-cover"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center">
																	<Building2 className="w-5 h-5 text-muted-foreground/40" />
																</div>
															)}
														</div>
														<div className="min-w-0">
															<button
																onClick={() =>
																	setPreviewPropertyId(property.id)
																}
																className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1 text-left"
															>
																{property.title}
															</button>
															<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
																<MapPin className="w-3 h-3 flex-shrink-0" />
																<span className="truncate max-w-48">
																	{property.location}
																	{property.city ? ` · ${property.city}` : ''}
																</span>
															</p>
														</div>
													</div>
												</TableCell>

												{/* Type */}
												<TableCell>
													<span className="flex items-center gap-1.5 text-sm capitalize">
														<TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
														{property.property_type?.replace('-', ' ')}
													</span>
												</TableCell>

												{/* Price */}
												<TableCell>
													<p className="font-semibold text-sm">
														{formatPrice(property.price)}
													</p>
													{property.price_label && (
														<p className="text-xs text-muted-foreground">
															{property.price_label}
														</p>
													)}
												</TableCell>

												{/* Status — inline editable */}
												<TableCell>
													<select
														value={property.status}
														onChange={(e) =>
															handleStatusChange(property.id, e.target.value)
														}
														className={cn(
															'text-xs px-2 py-1 rounded-full font-medium capitalize border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50',
															statusCls,
														)}
													>
														<option value="active">Active</option>
														<option value="inactive">Inactive</option>
														<option value="rented">Rented</option>
														<option value="sold">Sold</option>
													</select>
												</TableCell>

												{/* Actions */}
												<TableCell>
													<div className="flex items-center justify-end gap-1">
														<button
															onClick={() => setPreviewPropertyId(property.id)}
															title="Quick preview"
															className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
														>
															<Eye className="w-4 h-4" />
														</button>
														<Link
															to={`/property/${property.id}`}
															target="_blank"
															title="View live"
															className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
														>
															<ExternalLink className="w-3.5 h-3.5" />
														</Link>
														<Link
															to={`/admin/properties/${property.id}/edit`}
															title="Edit"
															className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
														>
															<Pencil className="w-4 h-4" />
														</Link>
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<button
																	title="Delete"
																	className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
																>
																	<Trash2 className="w-4 h-4" />
																</button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Delete Property
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		Delete "{property.title}"? This cannot be
																		undone.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Cancel</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => handleDelete(property.id)}
																		className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
																	>
																		Delete
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
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
			)}

			{/* ── Pagination ── */}
			{!loading && filteredSorted.length > 0 && (
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span>Rows per page:</span>
						<select
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
								setPage(1);
							}}
							className="border border-border rounded-lg px-2 py-1 bg-background text-foreground text-xs focus:outline-none"
						>
							{PAGE_SIZE_OPTIONS.map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground">
							{(safePage - 1) * pageSize + 1}–
							{Math.min(safePage * pageSize, filteredSorted.length)} of{' '}
							{filteredSorted.length}
						</span>
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

			{/* ── Preview Drawer ── */}
			<PropertyPreviewDrawer
				propertyId={previewPropertyId}
				isOpen={!!previewPropertyId}
				onClose={() => setPreviewPropertyId(null)}
			/>
		</div>
	);
};

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilters, onClear }) => (
	<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
		{hasFilters ? (
			<>
				<AlertCircle className="w-10 h-10 mb-3 opacity-30" />
				<p className="text-sm">No properties match your filters</p>
				<button
					onClick={onClear}
					className="text-xs text-primary mt-2 hover:underline"
				>
					Clear filters
				</button>
			</>
		) : (
			<>
				<Building2 className="w-10 h-10 mb-3 opacity-30" />
				<p className="text-sm mb-3">No properties yet</p>
				<Button asChild size="sm">
					<Link to="/admin/properties/new">
						<Plus className="w-3.5 h-3.5 mr-1.5" /> Add your first property
					</Link>
				</Button>
			</>
		)}
	</div>
);

export default PropertiesListPage;
