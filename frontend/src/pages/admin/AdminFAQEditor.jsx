/**
 * AdminFAQEditor.jsx
 *
 * Routes:
 *   /admin/faqs/new       → create category
 *   /admin/faqs/:id/edit  → edit category
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	Plus,
	Trash2,
	Loader2,
	Save,
	HelpCircle,
	GripVertical,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

/* ── Suggested emoji icons for FAQ categories ─────────────────────────────── */
const ICON_OPTIONS = [
	'❓',
	'🏠',
	'🔑',
	'🏢',
	'💼',
	'📋',
	'💰',
	'🤝',
	'🌆',
	'🛡️',
	'📞',
	'⭐',
	'🔧',
	'📝',
	'🧾',
	'🏗️',
	'🚪',
	'💡',
	'🎯',
	'📌',
];

/* ── Empty FAQ item template ──────────────────────────────────────────────── */
const emptyFaq = () => ({ question: '', answer: '' });

/* ── Single collapsible FAQ row ──────────────────────────────────────────── */
const FAQRow = ({
	faq,
	index,
	onChange,
	onRemove,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
}) => {
	const [open, setOpen] = useState(true);

	return (
		<div className="border border-border rounded-xl overflow-hidden bg-card">
			{/* row header */}
			<div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
				<GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
				<span className="text-xs font-semibold text-muted-foreground w-6">
					{index + 1}.
				</span>
				<p className="flex-1 text-sm font-medium line-clamp-1 text-foreground">
					{faq.question || (
						<span className="text-muted-foreground italic">
							Untitled question
						</span>
					)}
				</p>
				<div className="flex items-center gap-1 shrink-0">
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={onMoveUp}
						disabled={isFirst}
					>
						<ChevronUp className="w-3.5 h-3.5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={onMoveDown}
						disabled={isLast}
					>
						<ChevronDown className="w-3.5 h-3.5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={() => setOpen((p) => !p)}
					>
						{open ? (
							<ChevronUp className="w-3.5 h-3.5" />
						) : (
							<ChevronDown className="w-3.5 h-3.5" />
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-destructive hover:text-destructive"
						onClick={onRemove}
					>
						<Trash2 className="w-3.5 h-3.5" />
					</Button>
				</div>
			</div>

			{/* row body */}
			{open && (
				<div className="p-4 space-y-3">
					<div>
						<Label className="text-xs mb-1.5 block">Question</Label>
						<Input
							value={faq.question}
							onChange={(e) => onChange({ ...faq, question: e.target.value })}
							placeholder="What is...?"
						/>
					</div>
					<div>
						<Label className="text-xs mb-1.5 block">Answer</Label>
						<Textarea
							value={faq.answer}
							onChange={(e) => onChange({ ...faq, answer: e.target.value })}
							placeholder="Write your answer here..."
							rows={3}
							className="resize-none"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

/* ── Main editor ──────────────────────────────────────────────────────────── */
const AdminFAQEditor = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(isEdit);

	/* ── Form state ── */
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [description, setDescription] = useState('');
	const [icon, setIcon] = useState('❓');
	const [customIcon, setCustomIcon] = useState('');
	const [order, setOrder] = useState(0);
	const [status, setStatus] = useState('published');
	const [faqs, setFaqs] = useState([emptyFaq()]);

	/* ── Auto-slug from name ── */
	const autoSlug = (text) =>
		text
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');

	useEffect(() => {
		if (!isEdit) return;
		const load = async () => {
			try {
				const { data } = await api.get(`/faqs/${id}`);
				setName(data.name || '');
				setSlug(data.slug || '');
				setDescription(data.description || '');
				setIcon(data.icon || '❓');
				setOrder(data.order ?? 0);
				setStatus(data.status || 'published');
				setFaqs(data.faqs?.length ? data.faqs : [emptyFaq()]);
			} catch {
				toast.error('Failed to load FAQ category');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [id, isEdit]);

	/* ── FAQ helpers ── */
	const addFaq = () => setFaqs((prev) => [...prev, emptyFaq()]);

	const removeFaq = (i) =>
		setFaqs((prev) => prev.filter((_, idx) => idx !== i));

	const updateFaq = (i, updated) =>
		setFaqs((prev) => prev.map((f, idx) => (idx === i ? updated : f)));

	const moveFaq = (i, direction) => {
		const j = i + direction;
		if (j < 0 || j >= faqs.length) return;
		const next = [...faqs];
		[next[i], next[j]] = [next[j], next[i]];
		setFaqs(next);
	};

	/* ── Save ── */
	const handleSave = async (saveStatus = status) => {
		if (!name.trim()) {
			toast.error('Category name is required');
			return;
		}

		// Filter out empty FAQ rows
		const cleanFaqs = faqs.filter((f) => f.question.trim() || f.answer.trim());

		const resolvedIcon = customIcon.trim() || icon;

		const payload = {
			name: name.trim(),
			slug: slug.trim() || autoSlug(name),
			description: description.trim(),
			icon: resolvedIcon,
			order: Number(order),
			status: saveStatus,
			faqs: cleanFaqs,
		};

		setSaving(true);
		try {
			if (isEdit) {
				await api.put(`/faqs/${id}`, payload);
				toast.success('FAQ category updated');
			} else {
				const { data } = await api.post('/faqs/', payload);
				toast.success('FAQ category created');
				navigate(`/admin/faqs/${data._id || data.id}/edit`);
				return;
			}
		} catch (err) {
			console.error(err);
			toast.error('Failed to save FAQ category');
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-3xl mx-auto">
			{/* Top bar */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" asChild>
						<Link to="/admin/faqs">
							<ArrowLeft className="w-4 h-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-xl font-bold text-foreground">
							{isEdit ? 'Edit FAQ Category' : 'New FAQ Category'}
						</h1>
						<p className="text-sm text-muted-foreground">
							{isEdit
								? `Editing: ${name}`
								: 'Create a new category with questions'}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<Button
						variant="outline"
						onClick={() => handleSave('draft')}
						disabled={saving}
					>
						{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
						Save Draft
					</Button>
					<Button
						variant="teal"
						onClick={() => handleSave('published')}
						disabled={saving}
					>
						{saving ? (
							<Loader2 className="w-4 h-4 animate-spin mr-2" />
						) : (
							<Save className="w-4 h-4 mr-2" />
						)}
						Publish
					</Button>
				</div>
			</div>

			{/* ── Category details ── */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<CardTitle className="text-base">Category Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<Label className="mb-1.5 block">Category Name *</Label>
							<Input
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									if (!isEdit) setSlug(autoSlug(e.target.value));
								}}
								placeholder="e.g. General, For Tenants, Payments..."
							/>
						</div>
						<div>
							<Label className="mb-1.5 block">Slug (URL)</Label>
							<Input
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								placeholder="auto-generated"
								className="font-mono text-sm"
							/>
						</div>
					</div>

					<div>
						<Label className="mb-1.5 block">Description</Label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Brief description of this FAQ category..."
							rows={2}
							className="resize-none"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{/* Icon picker */}
						<div>
							<Label className="mb-1.5 block">Icon (pick or type)</Label>
							<div className="flex flex-wrap gap-1.5 mb-2">
								{ICON_OPTIONS.map((em) => (
									<button
										key={em}
										type="button"
										onClick={() => {
											setIcon(em);
											setCustomIcon('');
										}}
										className={cn(
											'w-8 h-8 text-lg rounded-lg border transition-colors',
											icon === em && !customIcon
												? 'border-primary bg-primary/10'
												: 'border-border hover:border-primary/50',
										)}
									>
										{em}
									</button>
								))}
							</div>
							<Input
								value={customIcon}
								onChange={(e) => setCustomIcon(e.target.value)}
								placeholder="Or type any emoji…"
								className="text-center text-lg"
								maxLength={4}
							/>
						</div>

						{/* Display order */}
						<div>
							<Label className="mb-1.5 block">Display Order</Label>
							<Input
								type="number"
								min={0}
								value={order}
								onChange={(e) => setOrder(e.target.value)}
								placeholder="0"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Lower = shown first
							</p>
						</div>

						{/* Status */}
						<div>
							<Label className="mb-1.5 block">Status</Label>
							<Select value={status} onValueChange={setStatus}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="published">Published</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* ── FAQ Items ── */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-base">
								Questions &amp; Answers
							</CardTitle>
							<p className="text-xs text-muted-foreground mt-0.5">
								{faqs.filter((f) => f.question.trim()).length} questions
							</p>
						</div>
						<Button variant="outline" size="sm" onClick={addFaq}>
							<Plus className="w-4 h-4 mr-2" /> Add Question
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{faqs.length === 0 ? (
						<div className="text-center py-10 text-muted-foreground">
							<HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
							<p className="text-sm">No questions yet.</p>
							<Button variant="link" onClick={addFaq} className="mt-1">
								Add your first question
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{faqs.map((faq, i) => (
								<FAQRow
									key={i}
									faq={faq}
									index={i}
									onChange={(updated) => updateFaq(i, updated)}
									onRemove={() => removeFaq(i)}
									onMoveUp={() => moveFaq(i, -1)}
									onMoveDown={() => moveFaq(i, 1)}
									isFirst={i === 0}
									isLast={i === faqs.length - 1}
								/>
							))}
						</div>
					)}

					{faqs.length > 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={addFaq}
							className="mt-4 w-full border-dashed"
						>
							<Plus className="w-4 h-4 mr-2" /> Add Another Question
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Bottom save bar */}
			<div className="flex justify-end gap-2 pb-6">
				<Button
					variant="outline"
					onClick={() => handleSave('draft')}
					disabled={saving}
				>
					Save Draft
				</Button>
				<Button
					variant="teal"
					onClick={() => handleSave('published')}
					disabled={saving}
				>
					{saving ? (
						<Loader2 className="w-4 h-4 animate-spin mr-2" />
					) : (
						<Save className="w-4 h-4 mr-2" />
					)}
					{isEdit ? 'Save Changes' : 'Publish Category'}
				</Button>
			</div>
		</div>
	);
};

export default AdminFAQEditor;
