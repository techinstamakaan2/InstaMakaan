import React, { useState, useEffect, useRef } from 'react';
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
import {
	Plus,
	Search,
	Pencil,
	Trash2,
	Eye,
	FileText,
	Loader2,
	Clock,
	GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/lib/api';

const CATEGORIES = [
	'All',
	'Real Estate',
	'For Owners',
	'For Tenants',
	'Investment',
	'Community',
	'Noida Living',
	'Corporate',
];

const categoryColors = {
	Investment: 'bg-amber-50 text-amber-700',
	'For Tenants': 'bg-teal-50 text-teal-700',
	'For Owners': 'bg-blue-50 text-blue-700',
	'Real Estate': 'bg-purple-50 text-purple-700',
	Community: 'bg-rose-50 text-rose-700',
	Corporate: 'bg-slate-100 text-slate-700',
	'Noida Living': 'bg-green-50 text-green-700',
};

const AdminBlogPage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('All');
	const [statusFilter, setStatusFilter] = useState('all');
	const [reordering, setReordering] = useState(false);
	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const { data } = await api.get('/blogs?status=all');
			setPosts(Array.isArray(data) ? data : data.posts || []);
		} catch (error) {
			console.error('Error fetching blog posts:', error);
			toast.error('Failed to load blog posts');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/blogs/${id}`);
			setPosts((prev) => prev.filter((p) => (p._id || p.id) !== id));
			toast.success('Post deleted successfully');
		} catch (error) {
			console.error('Error deleting post:', error);
			toast.error('Failed to delete post');
		}
	};

	const toggleStatus = async (post) => {
		const newStatus = post.status === 'published' ? 'draft' : 'published';
		try {
			await api.put(`/blogs/${post._id || post.id}`, {
				...post,
				status: newStatus,
			});
			setPosts((prev) =>
				prev.map((p) =>
					(p._id || p.id) === (post._id || post.id)
						? { ...p, status: newStatus }
						: p,
				),
			);
			toast.success(
				`Post ${newStatus === 'published' ? 'published' : 'moved to draft'}`,
			);
		} catch (error) {
			toast.error('Failed to update status');
		}
	};

	const filteredPosts = posts.filter((post) => {
		const matchesSearch =
			post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === 'All' || post.category === categoryFilter;
		const matchesStatus =
			statusFilter === 'all' || post.status === statusFilter;
		return matchesSearch && matchesCategory && matchesStatus;
	});

	// Reordering rewrites `order` for exactly the posts currently on screen —
	// only safe to do when the full, unfiltered list is showing. Otherwise
	// posts hidden by a filter would keep stale order values relative to
	// the ones being dragged, and the sequence would end up scrambled.
	const canReorder =
		!searchQuery && categoryFilter === 'All' && statusFilter === 'all';

	const handleDragEnd = async () => {
		const from = dragItem.current;
		const to = dragOverItem.current;
		dragItem.current = null;
		dragOverItem.current = null;
		if (from === null || to === null || from === to) return;

		const reordered = [...filteredPosts];
		const [moved] = reordered.splice(from, 1);
		reordered.splice(to, 0, moved);
		setPosts(reordered);

		setReordering(true);
		try {
			await Promise.all(
				reordered.map((post, idx) =>
					api.put(`/blogs/${post._id || post.id}`, { order: idx }),
				),
			);
			toast.success('Post order updated');
		} catch (error) {
			toast.error('Failed to save new order');
			fetchPosts();
		} finally {
			setReordering(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground">
						Blog Posts
					</h1>
					<p className="text-muted-foreground">
						Create and manage blog articles ({posts.length} total)
					</p>
				</div>
				<Button variant="teal" asChild>
					<Link to="/admin/blog/new">
						<Plus className="w-4 h-4 mr-2" />
						New Post
					</Link>
				</Button>
			</div>

			{/* Filters */}
			<Card className="bg-card border-0 shadow-card">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search posts..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>

						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="w-full sm:w-44">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((c) => (
									<SelectItem key={c} value={c}>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-36">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="published">Published</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card className="bg-card border-0 shadow-card overflow-hidden">
				{filteredPosts.length > 0 && (
					<div className="px-4 pt-3 flex items-center gap-2 text-xs text-muted-foreground">
						<GripVertical className="w-3.5 h-3.5" />
						{canReorder ? (
							<span>
								Drag <strong className="text-foreground">⠿</strong> to change the order posts appear in on the website
								{reordering && <Loader2 className="w-3 h-3 inline animate-spin ml-2" />}
							</span>
						) : (
							<span>Clear search &amp; filters to reorder posts</span>
						)}
					</div>
				)}
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-8" />
								<TableHead>Post</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Author</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-8">
										<Loader2 className="w-6 h-6 animate-spin mx-auto" />
									</TableCell>
								</TableRow>
							) : filteredPosts.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-8">
										<div className="text-muted-foreground">
											<FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
											<p>No posts found</p>
											<Button variant="link" asChild className="mt-2">
												<Link to="/admin/blog/new">Create your first post</Link>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredPosts.map((post, idx) => {
									const postId = post._id || post.id;
									return (
										<TableRow
											key={postId}
											draggable={canReorder}
											onDragStart={() => (dragItem.current = idx)}
											onDragEnter={() => (dragOverItem.current = idx)}
											onDragEnd={handleDragEnd}
											onDragOver={(e) => e.preventDefault()}
											className={canReorder ? 'cursor-grab active:cursor-grabbing' : ''}
										>
											{/* Drag handle */}
											<TableCell className="px-2">
												{canReorder && (
													<GripVertical className="w-4 h-4 text-muted-foreground/40" />
												)}
											</TableCell>

											{/* Post title + thumbnail */}
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="w-16 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
														{post.image ? (
															<img
																src={post.image}
																alt={post.title}
																className="w-full h-full object-cover"
																onError={(e) => {
																	e.target.style.display = 'none';
																}}
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center">
																<FileText className="w-5 h-5 text-muted-foreground" />
															</div>
														)}
													</div>
													<div>
														<p className="font-medium line-clamp-1 text-foreground">
															{post.title}
														</p>
														<p className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">
															{post.excerpt}
														</p>
													</div>
												</div>
											</TableCell>

											{/* Category */}
											<TableCell>
												<span
													className={cn(
														'text-xs px-2.5 py-1 rounded-full font-medium',
														categoryColors[post.category] ||
															'bg-gray-100 text-gray-600',
													)}
												>
													{post.category}
												</span>
											</TableCell>

											{/* Author */}
											<TableCell>
												<p className="text-sm font-medium">
													{post.author?.name || '—'}
												</p>
												<p className="text-xs text-muted-foreground">
													{post.author?.role || ''}
												</p>
											</TableCell>

											{/* Date */}
											<TableCell>
												<p className="text-sm flex items-center gap-1 text-muted-foreground">
													<Clock className="w-3 h-3" />
													{post.date ||
														(post.created_at
															? format(new Date(post.created_at), 'MMM d, yyyy')
															: '—')}
												</p>
												<p className="text-xs text-muted-foreground">
													{post.readTime}
												</p>
											</TableCell>

											{/* Status toggle */}
											<TableCell>
												<button
													onClick={() => toggleStatus(post)}
													className={cn(
														'text-xs px-2.5 py-1 rounded-full font-medium capitalize cursor-pointer transition-colors',
														post.status === 'published'
															? 'bg-success/10 text-success hover:bg-success/20'
															: 'bg-muted text-muted-foreground hover:bg-muted/80',
													)}
												>
													{post.status || 'draft'}
												</button>
											</TableCell>

											{/* Actions */}
											<TableCell>
												<div className="flex items-center justify-end gap-1">
													{/* View on site — public page looks posts up by slug, not id */}
													<Button variant="ghost" size="icon" asChild>
														<Link to={`/blog/${post.slug || postId}`} target="_blank">
															<Eye className="w-4 h-4" />
														</Link>
													</Button>

													{/* Edit */}
													<Button variant="ghost" size="icon" asChild>
														<Link to={`/admin/blog/${postId}/edit`}>
															<Pencil className="w-4 h-4" />
														</Link>
													</Button>

													{/* Delete */}
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="text-destructive hover:text-destructive"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>Delete Post</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to delete &quot;
																	{post.title}&quot;? This action cannot be
																	undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => handleDelete(postId)}
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
		</div>
	);
};

export default AdminBlogPage;
