import React, { useEffect, useState, useRef } from 'react';
import {
	Instagram,
	Trash2,
	Plus,
	Video,
	ImageIcon,
	ToggleLeft,
	ToggleRight,
	Loader2,
	ExternalLink,
	Search,
	Filter,
	GripVertical,
	CheckSquare,
	Square,
	Eye,
	EyeOff,
	Copy,
	Edit2,
	Check,
	X,
	ChevronDown,
	RefreshCw,
	SortAsc,
	SortDesc,
	LayoutGrid,
	List,
	Hash,
	AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

const EMPTY_FORM = { embed_url: '', has_video: false, order: 0 };

// Extract Instagram shortcode from URL for thumbnail
const extractShortcode = (url = '') => {
	const match = url.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
	return match ? match[2] : null;
};

const getThumbnailUrl = (url) => {
	const code = extractShortcode(url);
	return code ? `https://www.instagram.com/p/${code}/media/?size=m` : null;
};

// ─── Inline Edit Cell ──────────────────────────────────────────────────────
const InlineEdit = ({ value, onSave, type = 'text', className = '' }) => {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const inputRef = useRef(null);

	useEffect(() => {
		if (editing) inputRef.current?.focus();
	}, [editing]);

	const commit = () => {
		onSave(draft);
		setEditing(false);
	};

	const cancel = () => {
		setDraft(value);
		setEditing(false);
	};

	if (!editing) {
		return (
			<span
				className={`group flex items-center gap-1.5 cursor-pointer ${className}`}
				onClick={() => setEditing(true)}
			>
				<span>{value}</span>
				<Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
			</span>
		);
	}

	return (
		<span className="flex items-center gap-1">
			<input
				ref={inputRef}
				type={type}
				value={draft}
				onChange={(e) =>
					setDraft(type === 'number' ? Number(e.target.value) : e.target.value)
				}
				onKeyDown={(e) => {
					if (e.key === 'Enter') commit();
					if (e.key === 'Escape') cancel();
				}}
				className="w-24 px-2 py-0.5 text-xs border border-primary rounded bg-background focus:outline-none"
			/>
			<button onClick={commit} className="text-green-500 hover:text-green-600">
				<Check className="w-3.5 h-3.5" />
			</button>
			<button
				onClick={cancel}
				className="text-muted-foreground hover:text-foreground"
			>
				<X className="w-3.5 h-3.5" />
			</button>
		</span>
	);
};

// ─── Post Row ─────────────────────────────────────────────────────────────
const PostRow = ({
	post,
	selected,
	onSelect,
	onToggle,
	onDelete,
	onUpdate,
	view,
	dragHandleProps,
	isDragging,
}) => {
	const thumb = getThumbnailUrl(post.embed_url);

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(post.embed_url);
		toast.success('URL copied!');
	};

	if (view === 'grid') {
		return (
			<div
				className={`relative border rounded-xl overflow-hidden transition-all ${
					selected ? 'border-primary ring-1 ring-primary' : 'border-border'
				} ${!post.is_active ? 'opacity-50' : ''} ${isDragging ? 'shadow-lg' : ''}`}
			>
				{/* Thumbnail */}
				<div className="relative bg-muted aspect-square">
					{thumb ? (
						<img
							src={thumb}
							alt="Instagram post"
							className="w-full h-full object-cover"
							onError={(e) => {
								e.target.style.display = 'none';
							}}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<Instagram className="w-10 h-10 text-muted-foreground/30" />
						</div>
					)}
					{/* Select overlay */}
					<button
						onClick={() => onSelect(post.id)}
						className="absolute top-2 left-2 p-1 bg-background/80 rounded-md backdrop-blur-sm"
					>
						{selected ? (
							<CheckSquare className="w-3.5 h-3.5 text-primary" />
						) : (
							<Square className="w-3.5 h-3.5 text-muted-foreground" />
						)}
					</button>
					{/* Type badge */}
					<div className="absolute top-2 right-2 px-1.5 py-0.5 bg-background/80 backdrop-blur-sm rounded text-xs flex items-center gap-1">
						{post.has_video ? (
							<Video className="w-3 h-3 text-primary" />
						) : (
							<ImageIcon className="w-3 h-3 text-primary" />
						)}
					</div>
				</div>

				{/* Info */}
				<div className="p-3">
					<p className="text-xs font-mono text-muted-foreground truncate">
						{post.embed_url.replace('https://www.instagram.com/', '')}
					</p>
					<div className="flex items-center justify-between mt-2">
						<span
							className={`text-xs font-medium ${
								post.is_active ? 'text-green-500' : 'text-muted-foreground'
							}`}
						>
							{post.is_active ? '● Active' : '● Hidden'}
						</span>
						<div className="flex gap-1">
							<button
								onClick={() => onToggle(post)}
								className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
							>
								{post.is_active ? (
									<EyeOff className="w-3.5 h-3.5" />
								) : (
									<Eye className="w-3.5 h-3.5" />
								)}
							</button>
							<a
								href={post.embed_url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
							>
								<ExternalLink className="w-3.5 h-3.5" />
							</a>
							<button
								onClick={() => onDelete(post)}
								className="p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// List view
	return (
		<div
			className={`flex items-center gap-3 px-4 py-3 transition-colors ${
				!post.is_active ? 'opacity-50' : ''
			} ${isDragging ? 'bg-muted shadow-lg rounded-lg' : 'hover:bg-muted/30'}`}
		>
			{/* Drag Handle */}
			<button
				{...dragHandleProps}
				className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0"
			>
				<GripVertical className="w-4 h-4" />
			</button>

			{/* Select */}
			<button onClick={() => onSelect(post.id)} className="flex-shrink-0">
				{selected ? (
					<CheckSquare className="w-4 h-4 text-primary" />
				) : (
					<Square className="w-4 h-4 text-muted-foreground" />
				)}
			</button>

			{/* Thumbnail */}
			<div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
				{thumb ? (
					<img
						src={thumb}
						alt=""
						className="w-full h-full object-cover"
						onError={(e) => {
							e.target.style.display = 'none';
						}}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						{post.has_video ? (
							<Video className="w-4 h-4 text-primary" />
						) : (
							<ImageIcon className="w-4 h-4 text-primary" />
						)}
					</div>
				)}
			</div>

			{/* URL + Meta */}
			<div className="flex-1 min-w-0">
				<p className="text-sm text-foreground font-mono truncate">
					{post.embed_url}
				</p>
				<div className="flex items-center gap-3 mt-0.5 flex-wrap">
					<span
						className={`text-xs font-medium ${
							post.is_active ? 'text-green-500' : 'text-muted-foreground'
						}`}
					>
						{post.is_active ? '● Active' : '● Hidden'}
					</span>
					{post.has_video && (
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							<Video className="w-3 h-3" /> Reel
						</span>
					)}
					<span className="text-xs text-muted-foreground flex items-center gap-1">
						<Hash className="w-3 h-3" />
						Order:{' '}
						<InlineEdit
							value={post.order}
							type="number"
							onSave={(val) => onUpdate(post, { order: val })}
						/>
					</span>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-1 flex-shrink-0">
				<button
					onClick={handleCopyUrl}
					title="Copy URL"
					className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				>
					<Copy className="w-3.5 h-3.5" />
				</button>
				<a
					href={post.embed_url}
					target="_blank"
					rel="noopener noreferrer"
					className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
					title="Open on Instagram"
				>
					<ExternalLink className="w-3.5 h-3.5" />
				</a>
				<button
					onClick={() => onToggle(post)}
					title={post.is_active ? 'Hide post' : 'Show post'}
					className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				>
					{post.is_active ? (
						<ToggleRight className="w-5 h-5 text-primary" />
					) : (
						<ToggleLeft className="w-5 h-5" />
					)}
				</button>
				<button
					onClick={() => onDelete(post)}
					title="Delete post"
					className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

// ─── Main Page ────────────────────────────────────────────────────────────
const AdminInstagramPage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState(EMPTY_FORM);

	// Controls
	const [search, setSearch] = useState('');
	const [filterType, setFilterType] = useState('all'); // all | active | hidden | reel | image
	const [sortBy, setSortBy] = useState('order'); // order | added
	const [sortDir, setSortDir] = useState('asc');
	const [view, setView] = useState('list'); // list | grid
	const [selected, setSelected] = useState(new Set());
	const [bulkLoading, setBulkLoading] = useState(false);

	// Drag state (simple index swap)
	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	// ── Fetch ───────────────────────────────────────────────────────────────
	const fetchPosts = async () => {
		setLoading(true);
		try {
			const res = await api.get('/instagram/admin/all');
			setPosts(res.data.data || []);
		} catch {
			toast.error('Failed to load Instagram posts');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	// ── Add ─────────────────────────────────────────────────────────────────
	const handleAdd = async (e) => {
		e.preventDefault();
		if (!form.embed_url.trim()) {
			toast.error('Please paste an Instagram post or reel URL');
			return;
		}
		setSaving(true);
		try {
			await api.post('/instagram/', form);
			toast.success('Instagram post added!');
			setForm(EMPTY_FORM);
			fetchPosts();
		} catch (err) {
			toast.error(err?.response?.data?.detail || 'Failed to add post');
		} finally {
			setSaving(false);
		}
	};

	// ── Toggle ──────────────────────────────────────────────────────────────
	const handleToggle = async (post) => {
		try {
			await api.put(`/instagram/${post.id}`, { is_active: !post.is_active });
			toast.success(post.is_active ? 'Post hidden' : 'Post shown');
			fetchPosts();
		} catch {
			toast.error('Failed to update post');
		}
	};

	// ── Update field ────────────────────────────────────────────────────────
	const handleUpdate = async (post, fields) => {
		try {
			await api.put(`/instagram/${post.id}`, fields);
			toast.success('Post updated');
			fetchPosts();
		} catch {
			toast.error('Failed to update post');
		}
	};

	// ── Delete ──────────────────────────────────────────────────────────────
	const handleDelete = async (post) => {
		if (!window.confirm('Delete this Instagram post?')) return;
		try {
			await api.delete(`/instagram/${post.id}`);
			toast.success('Post deleted');
			fetchPosts();
		} catch {
			toast.error('Failed to delete post');
		}
	};

	// ── Bulk actions ────────────────────────────────────────────────────────
	const handleBulkShow = async () => {
		setBulkLoading(true);
		try {
			await Promise.all(
				[...selected].map((id) =>
					api.put(`/instagram/${id}`, { is_active: true }),
				),
			);
			toast.success(`${selected.size} posts shown`);
			setSelected(new Set());
			fetchPosts();
		} catch {
			toast.error('Bulk update failed');
		} finally {
			setBulkLoading(false);
		}
	};

	const handleBulkHide = async () => {
		setBulkLoading(true);
		try {
			await Promise.all(
				[...selected].map((id) =>
					api.put(`/instagram/${id}`, { is_active: false }),
				),
			);
			toast.success(`${selected.size} posts hidden`);
			setSelected(new Set());
			fetchPosts();
		} catch {
			toast.error('Bulk update failed');
		} finally {
			setBulkLoading(false);
		}
	};

	const handleBulkDelete = async () => {
		if (
			!window.confirm(`Delete ${selected.size} posts? This cannot be undone.`)
		)
			return;
		setBulkLoading(true);
		try {
			await Promise.all(
				[...selected].map((id) => api.delete(`/instagram/${id}`)),
			);
			toast.success(`${selected.size} posts deleted`);
			setSelected(new Set());
			fetchPosts();
		} catch {
			toast.error('Bulk delete failed');
		} finally {
			setBulkLoading(false);
		}
	};

	// ── Drag reorder ────────────────────────────────────────────────────────
	const handleDragEnd = async () => {
		if (dragItem.current === null || dragOverItem.current === null) return;
		const items = [...filteredPosts];
		const dragged = items.splice(dragItem.current, 1)[0];
		items.splice(dragOverItem.current, 0, dragged);
		dragItem.current = null;
		dragOverItem.current = null;

		// Assign new order values based on new positions
		const updates = items.map((post, idx) =>
			api.put(`/instagram/${post.id}`, { order: idx }),
		);
		try {
			await Promise.all(updates);
			toast.success('Order saved');
			fetchPosts();
		} catch {
			toast.error('Failed to save order');
		}
	};

	// ── Selection helpers ───────────────────────────────────────────────────
	const toggleSelect = (id) => {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const toggleSelectAll = () => {
		if (selected.size === filteredPosts.length) {
			setSelected(new Set());
		} else {
			setSelected(new Set(filteredPosts.map((p) => p.id)));
		}
	};

	// ── Filter + Sort ────────────────────────────────────────────────────────
	const filteredPosts = posts
		.filter((p) => {
			if (search && !p.embed_url.toLowerCase().includes(search.toLowerCase()))
				return false;
			if (filterType === 'active') return p.is_active;
			if (filterType === 'hidden') return !p.is_active;
			if (filterType === 'reel') return p.has_video;
			if (filterType === 'image') return !p.has_video;
			return true;
		})
		.sort((a, b) => {
			const mul = sortDir === 'asc' ? 1 : -1;
			if (sortBy === 'order') return (a.order - b.order) * mul;
			if (sortBy === 'added') return (a.id - b.id) * mul;
			return 0;
		});

	const activeCount = posts.filter((p) => p.is_active).length;
	const reelCount = posts.filter((p) => p.has_video).length;

	return (
		<div className="space-y-5">
			{/* ── Header ── */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Instagram Posts
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Manage the posts shown in the Instagram section on the website
					</p>
				</div>
				<div className="flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Instagram className="w-4 h-4 text-pink-500" />
						<span>
							<strong className="text-foreground">{activeCount}</strong> active
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Video className="w-4 h-4" />
						<span>
							<strong className="text-foreground">{reelCount}</strong> reels
						</span>
					</div>
					<button
						onClick={fetchPosts}
						disabled={loading}
						className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
						title="Refresh"
					>
						<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
					</button>
				</div>
			</div>

			{/* ── Add New Post ── */}
			<div className="bg-card border border-border rounded-xl p-5">
				<h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
					<Plus className="w-4 h-4" />
					Add New Post
				</h2>
				<form onSubmit={handleAdd}>
					<div className="flex gap-3 flex-wrap">
						<div className="flex-1 min-w-64">
							<input
								type="url"
								placeholder="https://www.instagram.com/reel/DTf0gCZAWLu/"
								value={form.embed_url}
								onChange={(e) =>
									setForm({ ...form, embed_url: e.target.value })
								}
								className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
							/>
						</div>

						<label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
							<input
								type="checkbox"
								checked={form.has_video}
								onChange={(e) =>
									setForm({ ...form, has_video: e.target.checked })
								}
								className="w-4 h-4 accent-primary rounded"
							/>
							<Video className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-foreground whitespace-nowrap">
								Is Reel
							</span>
						</label>

						<div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border">
							<Hash className="w-4 h-4 text-muted-foreground" />
							<input
								type="number"
								min="0"
								value={form.order}
								onChange={(e) =>
									setForm({ ...form, order: Number(e.target.value) })
								}
								className="w-14 bg-transparent text-foreground text-sm focus:outline-none"
								placeholder="Order"
							/>
						</div>

						<Button
							type="submit"
							disabled={saving}
							className="gap-2 whitespace-nowrap"
						>
							{saving ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Plus className="w-4 h-4" />
							)}
							{saving ? 'Adding...' : 'Add Post'}
						</Button>
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Paste the full URL from Instagram (post or reel)
					</p>
				</form>
			</div>

			{/* ── Posts List ── */}
			<div className="bg-card border border-border rounded-xl">
				{/* Toolbar */}
				<div className="p-4 border-b border-border space-y-3">
					{/* Row 1: Search + View toggle */}
					<div className="flex items-center gap-3">
						<div className="relative flex-1 max-w-xs">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search by URL..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
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

						<div className="flex items-center gap-1 ml-auto">
							<button
								onClick={() => setView('list')}
								className={`p-2 rounded-lg transition-colors ${
									view === 'list'
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:bg-muted'
								}`}
							>
								<List className="w-4 h-4" />
							</button>
							<button
								onClick={() => setView('grid')}
								className={`p-2 rounded-lg transition-colors ${
									view === 'grid'
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:bg-muted'
								}`}
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Row 2: Filters + Sort */}
					<div className="flex items-center gap-2 flex-wrap">
						<Filter className="w-3.5 h-3.5 text-muted-foreground" />
						{[
							{ key: 'all', label: 'All' },
							{ key: 'active', label: 'Active' },
							{ key: 'hidden', label: 'Hidden' },
							{ key: 'reel', label: 'Reels' },
							{ key: 'image', label: 'Images' },
						].map(({ key, label }) => (
							<button
								key={key}
								onClick={() => setFilterType(key)}
								className={`px-3 py-1 text-xs rounded-full border transition-colors ${
									filterType === key
										? 'bg-primary text-primary-foreground border-primary'
										: 'border-border text-muted-foreground hover:border-primary hover:text-foreground'
								}`}
							>
								{label}
							</button>
						))}

						<div className="ml-auto flex items-center gap-2">
							<span className="text-xs text-muted-foreground">Sort:</span>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
							>
								<option value="order">Display Order</option>
								<option value="added">Date Added</option>
							</select>
							<button
								onClick={() =>
									setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
								}
								className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
							>
								{sortDir === 'asc' ? (
									<SortAsc className="w-3.5 h-3.5" />
								) : (
									<SortDesc className="w-3.5 h-3.5" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Bulk Actions Bar */}
				{selected.size > 0 && (
					<div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border-b border-border">
						<span className="text-sm font-medium text-foreground">
							{selected.size} selected
						</span>
						<div className="flex items-center gap-2 ml-2">
							<Button
								size="sm"
								variant="outline"
								onClick={handleBulkShow}
								disabled={bulkLoading}
								className="h-7 text-xs gap-1"
							>
								<Eye className="w-3 h-3" />
								Show All
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={handleBulkHide}
								disabled={bulkLoading}
								className="h-7 text-xs gap-1"
							>
								<EyeOff className="w-3 h-3" />
								Hide All
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={handleBulkDelete}
								disabled={bulkLoading}
								className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:border-destructive"
							>
								<Trash2 className="w-3 h-3" />
								Delete All
							</Button>
						</div>
						<button
							onClick={() => setSelected(new Set())}
							className="ml-auto text-xs text-muted-foreground hover:text-foreground"
						>
							Clear selection
						</button>
					</div>
				)}

				{/* Select All row */}
				{filteredPosts.length > 0 && view === 'list' && (
					<div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
						<button
							onClick={toggleSelectAll}
							className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{selected.size === filteredPosts.length &&
							filteredPosts.length > 0 ? (
								<CheckSquare className="w-4 h-4 text-primary" />
							) : (
								<Square className="w-4 h-4" />
							)}
							Select all ({filteredPosts.length})
						</button>
						<span className="text-xs text-muted-foreground ml-auto">
							Drag <GripVertical className="w-3 h-3 inline" /> to reorder
						</span>
					</div>
				)}

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
					</div>
				) : filteredPosts.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
						{search || filterType !== 'all' ? (
							<>
								<AlertCircle className="w-8 h-8 mb-3 opacity-30" />
								<p className="text-sm">No posts match your filters</p>
								<button
									onClick={() => {
										setSearch('');
										setFilterType('all');
									}}
									className="text-xs text-primary mt-2 hover:underline"
								>
									Clear filters
								</button>
							</>
						) : (
							<>
								<Instagram className="w-10 h-10 mb-3 opacity-30" />
								<p className="text-sm">No posts yet. Add one above!</p>
							</>
						)}
					</div>
				) : view === 'grid' ? (
					<div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{filteredPosts.map((post) => (
							<PostRow
								key={post.id}
								post={post}
								selected={selected.has(post.id)}
								onSelect={toggleSelect}
								onToggle={handleToggle}
								onDelete={handleDelete}
								onUpdate={handleUpdate}
								view="grid"
							/>
						))}
					</div>
				) : (
					<div className="divide-y divide-border">
						{filteredPosts.map((post, idx) => (
							<div
								key={post.id}
								draggable
								onDragStart={() => (dragItem.current = idx)}
								onDragEnter={() => (dragOverItem.current = idx)}
								onDragEnd={handleDragEnd}
								onDragOver={(e) => e.preventDefault()}
							>
								<PostRow
									post={post}
									selected={selected.has(post.id)}
									onSelect={toggleSelect}
									onToggle={handleToggle}
									onDelete={handleDelete}
									onUpdate={handleUpdate}
									view="list"
									dragHandleProps={{}}
									isDragging={false}
								/>
							</div>
						))}
					</div>
				)}

				{/* Footer */}
				{filteredPosts.length > 0 && (
					<div className="px-4 py-3 border-t border-border flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							Showing {filteredPosts.length} of {posts.length} posts
						</span>
						<span className="text-xs text-muted-foreground">
							{activeCount} active · {posts.length - activeCount} hidden
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminInstagramPage;
