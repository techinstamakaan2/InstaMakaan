import React, { useState, useEffect } from 'react';
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
	HelpCircle,
	Loader2,
	GripVertical,
	LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/lib/api';

const AdminFAQPage = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const { data } = await api.get('/faqs?status=all');
			setCategories(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error('Error fetching FAQ categories:', error);
			toast.error('Failed to load FAQ categories');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/faqs/${id}`);
			setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
			toast.success('Category deleted successfully');
		} catch (error) {
			toast.error('Failed to delete category');
		}
	};

	const toggleStatus = async (cat) => {
		try {
			const { data } = await api.patch(
				`/faqs/${cat._id || cat.id}/toggle-status`,
			);
			setCategories((prev) =>
				prev.map((c) =>
					(c._id || c.id) === (cat._id || cat.id)
						? { ...c, status: data.status }
						: c,
				),
			);
			toast.success(
				`Category ${data.status === 'published' ? 'published' : 'moved to draft'}`,
			);
		} catch (error) {
			toast.error('Failed to update status');
		}
	};

	const filteredCategories = categories.filter((cat) => {
		const matchesSearch =
			cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cat.description?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground">
						FAQ Manager
					</h1>
					<p className="text-muted-foreground">
						Manage FAQ categories and questions ({categories.length} categories,{' '}
						{categories.reduce((acc, c) => acc + (c.faqs?.length || 0), 0)}{' '}
						total questions)
					</p>
				</div>
				<Button variant="teal" asChild>
					<Link to="/admin/faqs/new">
						<Plus className="w-4 h-4 mr-2" />
						New Category
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
								placeholder="Search categories..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
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
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Category</TableHead>
								<TableHead>Questions</TableHead>
								<TableHead>Icon</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Last Updated</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										<Loader2 className="w-6 h-6 animate-spin mx-auto" />
									</TableCell>
								</TableRow>
							) : filteredCategories.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										<div className="text-muted-foreground">
											<HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
											<p>No FAQ categories found</p>
											<Button variant="link" asChild className="mt-2">
												<Link to="/admin/faqs/new">
													Create your first category
												</Link>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredCategories.map((cat) => {
									const catId = cat._id || cat.id;
									return (
										<TableRow key={catId}>
											{/* Category name + description */}
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
														<LayoutGrid className="w-5 h-5 text-primary" />
													</div>
													<div>
														<p className="font-medium text-foreground">
															{cat.name}
														</p>
														<p className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">
															{cat.description || cat.slug}
														</p>
													</div>
												</div>
											</TableCell>

											{/* FAQ count */}
											<TableCell>
												<span className="text-sm font-medium">
													{cat.faqs?.length || 0}
												</span>
												<span className="text-xs text-muted-foreground ml-1">
													questions
												</span>
											</TableCell>

											{/* Icon */}
											<TableCell>
												<span className="text-2xl">{cat.icon || '❓'}</span>
											</TableCell>

											{/* Status toggle */}
											<TableCell>
												<button
													onClick={() => toggleStatus(cat)}
													className={cn(
														'text-xs px-2.5 py-1 rounded-full font-medium capitalize cursor-pointer transition-colors',
														cat.status === 'published'
															? 'bg-success/10 text-success hover:bg-success/20'
															: 'bg-muted text-muted-foreground hover:bg-muted/80',
													)}
												>
													{cat.status || 'draft'}
												</button>
											</TableCell>

											{/* Date */}
											<TableCell>
												<p className="text-sm text-muted-foreground">
													{cat.updated_at
														? format(new Date(cat.updated_at), 'MMM d, yyyy')
														: '—'}
												</p>
											</TableCell>

											{/* Actions */}
											<TableCell>
												<div className="flex items-center justify-end gap-1">
													<Button variant="ghost" size="icon" asChild>
														<Link to={`/admin/faqs/${catId}/edit`}>
															<Pencil className="w-4 h-4" />
														</Link>
													</Button>

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
																<AlertDialogTitle>
																	Delete FAQ Category
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to delete &quot;
																	{cat.name}&quot; and all its questions? This
																	action cannot be undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => handleDelete(catId)}
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

export default AdminFAQPage;
