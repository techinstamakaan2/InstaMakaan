
/**
 * AdminBlogEditor.jsx  — Enhanced Edition
 *
 * New features vs original:
 *   ✅ Table support — insert tables + paste from Word/Excel/web preserves tables
 *   ✅ Font family picker (Times New Roman, Georgia, Arial, Courier New, etc.)
 *   ✅ Scrollable fixed-height editor (600 px, toolbar always visible at top)
 *   ✅ Table context toolbar (add/remove rows & cols, delete table)
 *
 * Install / update TipTap packages once:
 *   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline
 *               @tiptap/extension-text-align @tiptap/extension-placeholder
 *               @tiptap/extension-link @tiptap/extension-image
 *               @tiptap/extension-table @tiptap/extension-table-row
 *               @tiptap/extension-table-header @tiptap/extension-table-cell
 *               @tiptap/extension-font-family @tiptap/extension-text-style
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
	Bold,
	Italic,
	UnderlineIcon,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	Quote,
	RotateCcw,
	HelpCircle,
	BarChart2,
	FileText,
	Image as ImageIcon,
	Tag,
	X,
	Upload,
	Link2,
	Search,
	ExternalLink,
	BookOpen,
	Home,
	Strikethrough,
	AlignRight,
	AlignJustify,
	Code,
	Table as TableIcon,
	ChevronDown,
	Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

// TipTap core
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
// Table extensions
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';
// Font family
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
/* ─── CONSTANTS ───────────────────────────────────────────────────────────── */
const CATEGORIES = [
	'Real Estate',
	'For Owners',
	'For Tenants',
	'Investment',
	'Community',
	'Noida Living',
	'Corporate',
];

const FONT_FAMILIES = [
	{ label: 'Default', value: '' },
	{ label: 'Times New Roman', value: 'Times New Roman, serif' },
	{ label: 'Georgia', value: 'Georgia, serif' },
	{ label: 'Garamond', value: 'Garamond, serif' },
	{ label: 'Arial', value: 'Arial, sans-serif' },
	{ label: 'Helvetica', value: 'Helvetica, sans-serif' },
	{ label: 'Verdana', value: 'Verdana, sans-serif' },
	{ label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
	{ label: 'Courier New', value: 'Courier New, monospace' },
	{ label: 'Lucida Console', value: 'Lucida Console, monospace' },
];

function makeSlug(title) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-');
}

const defaultForm = {
	title: '',
	slug: '',
	excerpt: '',
	category: 'Real Estate',
	date: new Date().toISOString().split('T')[0],
	readTime: '5 min read',
	heroImage: '',
	heroFile: null,
	author: { name: '', role: '' },
	content: '',
	tags: [],
	faqs: [{ q: '', a: '' }],
	keyStats: [],
	status: 'draft',
};

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const tiptapStyles = `
  .tiptap-main { display:flex; flex-direction:column; border-radius:0 0 12px 12px; overflow:hidden; }

  /* Fixed-height scrollable editor */
  .tiptap-editor-scroll {
    height: 600px; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth;
  }
  .tiptap-main .ProseMirror {
    min-height: 580px; padding: 20px 24px; outline: none;
    font-size: 0.9375rem; line-height: 1.85;
    color: hsl(var(--foreground)); font-family: inherit;
  }
  .tiptap-main .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder); float: left;
    color: hsl(var(--muted-foreground)); pointer-events: none; height: 0;
  }
  .tiptap-main .ProseMirror h1 { font-size:1.85rem; font-weight:800; margin:1.2em 0 .5em; line-height:1.25; }
  .tiptap-main .ProseMirror h2 { font-size:1.45rem; font-weight:700; margin:1.1em 0 .4em; line-height:1.3; }
  .tiptap-main .ProseMirror h3 { font-size:1.2rem;  font-weight:600; margin:.9em 0 .3em; line-height:1.35; }
  .tiptap-main .ProseMirror h4 { font-size:1.05rem; font-weight:600; margin:.8em 0 .3em; }
  .tiptap-main .ProseMirror h5 { font-size:.95rem;  font-weight:600; margin:.7em 0 .25em; text-transform:uppercase; letter-spacing:.04em; }
  .tiptap-main .ProseMirror h6 { font-size:.85rem;  font-weight:600; margin:.6em 0 .2em; text-transform:uppercase; letter-spacing:.06em; color:hsl(var(--muted-foreground)); }
  .tiptap-main .ProseMirror strong { font-weight:700; }
  .tiptap-main .ProseMirror em     { font-style:italic; }
  .tiptap-main .ProseMirror u      { text-decoration:underline; }
  .tiptap-main .ProseMirror s      { text-decoration:line-through; }
  .tiptap-main .ProseMirror ul { list-style:disc;    padding-left:1.6em; }
  .tiptap-main .ProseMirror ol { list-style:decimal; padding-left:1.6em; }
  .tiptap-main .ProseMirror li { margin-bottom:.3em; }
  .tiptap-main .ProseMirror blockquote {
    border-left:4px solid hsl(var(--primary)); padding-left:1em;
    color:hsl(var(--muted-foreground)); margin:1em 0; font-style:italic;
  }
  .tiptap-main .ProseMirror p { margin-bottom:.6em; }
  .tiptap-main .ProseMirror a { color:#0d9488; text-decoration:underline; cursor:pointer; }
  .tiptap-main .ProseMirror a:hover { color:#0f766e; }
  .tiptap-main .ProseMirror code {
    background:hsl(var(--muted)); padding:.15em .4em; border-radius:4px;
    font-size:.85em; font-family:monospace;
  }
  .tiptap-main .ProseMirror img {
    max-width:100%; height:auto; border-radius:10px; margin:.8em 0;
    display:block; cursor:pointer;
  }
  .tiptap-main .ProseMirror img.ProseMirror-selectednode {
    outline:3px solid hsl(var(--primary)); border-radius:10px;
  }
  .tiptap-main .ProseMirror hr {
    border:none; border-top:2px solid hsl(var(--border)); margin:1.5em 0;
  }

  /* TABLE styles */
  .tiptap-main .ProseMirror table {
    border-collapse: collapse; width: 100%; margin: 1.2em 0;
    font-size: 0.9em; box-shadow: 0 0 0 1px hsl(var(--border));
    border-radius: 8px; overflow: hidden;
  }
  .tiptap-main .ProseMirror table th,
  .tiptap-main .ProseMirror table td {
    border: 1px solid hsl(var(--border)); padding: 8px 12px;
    min-width: 80px; vertical-align: top; position: relative;
  }
  .tiptap-main .ProseMirror table th {
    background: hsl(var(--muted)); font-weight: 600; text-align: left;
  }
  .tiptap-main .ProseMirror table tr:nth-child(even) td {
    background: hsl(var(--muted) / 0.3);
  }
  .tiptap-main .ProseMirror table .selectedCell {
    background: hsl(var(--primary) / 0.12) !important;
  }
  .tiptap-main .ProseMirror table .column-resize-handle {
    position: absolute; right: -2px; top: 0; bottom: 0;
    width: 4px; background: hsl(var(--primary)); cursor: col-resize; pointer-events: auto;
  }
  .tiptap-main .ProseMirror .tableWrapper { overflow-x: auto; }
  .tiptap-main .ProseMirror.resize-cursor { cursor: col-resize; }

  @keyframes _spin { to { transform:rotate(360deg); } }
  .spin { animation: _spin 1s linear infinite; }

  /* Font family dropdown */
  .font-family-dropdown { position:relative; display:inline-flex; }
  .font-family-dropdown select {
    appearance: none; background: transparent;
    border: 1px solid hsl(var(--border)); border-radius: 6px;
    padding: 2px 22px 2px 8px; font-size: 12px;
    color: hsl(var(--foreground)); cursor: pointer;
    height: 28px; min-width: 120px; outline: none;
  }
  .font-family-dropdown select:hover { background: hsl(var(--accent)); }
  .font-family-dropdown .dd-arrow {
    position: absolute; right: 5px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
    color: hsl(var(--muted-foreground));
  }

  /* Table context bar */
  .table-context-bar {
    display: flex; flex-wrap: wrap; gap: 2px;
    padding: 4px 8px; background: hsl(var(--muted) / 0.5);
    border-bottom: 1px solid hsl(var(--border)); font-size: 11px;
  }
  .table-context-bar .ctx-label {
    color: hsl(var(--muted-foreground)); margin-right: 4px;
    font-weight: 600; align-self: center; font-size: 11px;
  }
  .table-context-bar button {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 7px; border-radius: 5px; cursor: pointer;
    background: hsl(var(--background)); border: 1px solid hsl(var(--border));
    color: hsl(var(--foreground)); font-size: 11px; transition: background .12s;
  }
  .table-context-bar button:hover { background: hsl(var(--accent)); }
  .table-context-bar button.danger { color: hsl(var(--destructive)); border-color: hsl(var(--destructive)/0.4); }
  .table-context-bar button.danger:hover { background: hsl(var(--destructive)/0.08); }
  .table-context-bar .sep { width:1px; background:hsl(var(--border)); margin:0 3px; align-self:stretch; }

  /* Table insert grid */
  .table-modal-overlay {
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; padding:16px;
  }
  .table-modal {
    background:hsl(var(--card)); border-radius:18px;
    width:100%; max-width:380px;
    box-shadow:0 24px 64px rgba(0,0,0,0.2); overflow:hidden;
  }
  .table-grid-picker { display:grid; grid-template-columns:repeat(8, 28px); gap:3px; padding:14px; }
  .table-grid-picker .gcell {
    width:24px; height:24px; border-radius:4px;
    border:1px solid hsl(var(--border)); cursor:pointer;
    transition: background .1s, border-color .1s;
  }
  .table-grid-picker .gcell.highlighted { background: hsl(var(--primary)/0.25); border-color: hsl(var(--primary)); }

  /* Interlink modal */
  .interlink-modal-overlay {
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; padding:16px;
  }
  .interlink-modal {
    background:hsl(var(--card)); border-radius:18px;
    width:100%; max-width:560px;
    box-shadow:0 24px 64px rgba(0,0,0,0.2);
    overflow:hidden; display:flex; flex-direction:column; max-height:80vh;
  }
  .interlink-result-item {
    display:flex; align-items:flex-start; gap:12px;
    padding:10px 16px; cursor:pointer; border-radius:10px; transition:background .15s ease;
  }
  .interlink-result-item:hover { background:hsl(var(--muted)); }

  /* Image insert modal */
  .img-insert-overlay {
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; padding:16px;
  }
  .img-insert-modal {
    background:hsl(var(--card)); border-radius:18px;
    width:100%; max-width:480px;
    box-shadow:0 24px 64px rgba(0,0,0,0.2); overflow:hidden;
  }
`;

/* ─── INTERLINK MODAL ────────────────────────────────────────────────────── */
const InterlinkModal = ({ onClose, onInsert }) => {
	const [query, setQuery] = useState('');
	const [tab, setTab] = useState('blog');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [customUrl, setCustomUrl] = useState('');
	const [customLabel, setCustomLabel] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, [tab]);

	const search = useCallback(
		async (q) => {
			if (tab === 'custom') return;
			if (!q.trim() && tab === 'blog') {
				setResults([]);
				return;
			}
			setLoading(true);
			try {
				if (tab === 'blog') {
					const { data } = await api.get('/blogs', {
						params: { search: q, status: 'published', limit: 10 },
					});
					const arr = Array.isArray(data) ? data : data.posts || [];
					setResults(
						arr.map((p) => ({
							id: p._id || p.id,
							title: p.title,
							subtitle: p.category,
							url: `/blog/${p._id || p.id}`,
							image: p.image,
						})),
					);
				} else {
					try {
						const { data } = await api.get('/properties/', {
							params: { limit: 20 },
						});
						const arr = data.data || [];
						const filtered = q.trim()
							? arr.filter(
									(p) =>
										p.title?.toLowerCase().includes(q.toLowerCase()) ||
										p.city?.toLowerCase().includes(q.toLowerCase()),
								)
							: arr;
						setResults(
							filtered.map((p) => ({
								id: p.id,
								title: p.title,
								subtitle:
									`${p.city || ''} ${p.sector || ''}`.trim() || 'Property',
								url: `/listings/${p.id}`,
								image: p.thumbnail,
							})),
						);
					} catch {
						setResults([]);
					}
				}
			} catch {
				setResults([]);
			} finally {
				setLoading(false);
			}
		},
		[tab],
	);

	useEffect(() => {
		const t = setTimeout(() => search(query), 350);
		return () => clearTimeout(t);
	}, [query, search]);
	useEffect(() => {
		search(query || '');
	}, [tab]); // eslint-disable-line

	const TabBtn = ({ value, icon: Icon, label }) => (
		<button
			onClick={() => {
				setTab(value);
				setResults([]);
				setQuery('');
			}}
			className={cn(
				'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
				tab === value
					? 'bg-teal-600 text-white'
					: 'text-muted-foreground hover:bg-muted',
			)}
		>
			<Icon className="w-3.5 h-3.5" /> {label}
		</button>
	);

	return (
		<div
			className="interlink-modal-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="interlink-modal">
				<div className="flex items-center justify-between px-5 py-4 border-b border-border">
					<div>
						<h3 className="font-bold text-base">Insert Interlink</h3>
						<p className="text-xs text-muted-foreground mt-0.5">
							Select text first, then choose what to link
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<div className="flex gap-2 px-5 py-3 border-b border-border bg-muted/30">
					<TabBtn value="blog" icon={BookOpen} label="Blog Posts" />
					<TabBtn value="property" icon={Home} label="Properties" />
					<TabBtn value="custom" icon={Link2} label="Custom URL" />
				</div>
				{tab !== 'custom' ? (
					<>
						<div className="px-5 py-3 border-b border-border">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									ref={inputRef}
									placeholder={
										tab === 'blog' ? 'Search blog posts…' : 'Search properties…'
									}
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="pl-9 text-sm"
								/>
							</div>
						</div>
						<div className="overflow-y-auto flex-1 px-3 py-2 space-y-0.5 min-h-[160px]">
							{loading && (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-5 h-5 animate-spin text-teal-600" />
								</div>
							)}
							{!loading && results.length === 0 && (
								<div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
									<Search className="w-8 h-8 mb-2 opacity-30" />
									<p className="text-sm">
										{query ? 'No results found' : 'Type to search…'}
									</p>
								</div>
							)}
							{!loading &&
								results.map((item) => (
									<div
										key={item.id}
										className="interlink-result-item"
										onClick={() =>
											onInsert({ url: item.url, label: item.title })
										}
									>
										{item.image ? (
											<img
												src={item.image}
												alt={item.title}
												className="w-12 h-10 rounded-lg object-cover shrink-0 bg-muted"
												onError={(e) => {
													e.target.style.display = 'none';
												}}
											/>
										) : (
											<div className="w-12 h-10 rounded-lg bg-muted shrink-0 flex items-center justify-center">
												{tab === 'blog' ? (
													<BookOpen className="w-4 h-4 text-muted-foreground" />
												) : (
													<Home className="w-4 h-4 text-muted-foreground" />
												)}
											</div>
										)}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium line-clamp-1">
												{item.title}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{item.url}
											</p>
										</div>
										<ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" />
									</div>
								))}
						</div>
					</>
				) : (
					<div className="px-5 py-4 space-y-4 flex-1">
						<div>
							<Label className="text-xs">Link URL *</Label>
							<Input
								ref={inputRef}
								placeholder="https://instamakaan.com/listings/abc123"
								value={customUrl}
								onChange={(e) => setCustomUrl(e.target.value)}
								className="text-sm mt-1"
							/>
						</div>
						<div>
							<Label className="text-xs">
								Link label{' '}
								<span className="text-muted-foreground font-normal">
									(optional)
								</span>
							</Label>
							<Input
								placeholder="e.g. View this property"
								value={customLabel}
								onChange={(e) => setCustomLabel(e.target.value)}
								className="text-sm mt-1"
							/>
						</div>
						<Button
							className="w-full bg-teal-600 hover:bg-teal-700 text-white"
							onClick={() => {
								if (!customUrl.trim()) {
									toast.error('Please enter a URL');
									return;
								}
								onInsert({
									url: customUrl.trim(),
									label: customLabel.trim() || customUrl.trim(),
								});
							}}
						>
							<Link2 className="w-4 h-4 mr-2" /> Insert Link
						</Button>
					</div>
				)}
				<div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground flex items-center gap-1.5">
					<Link2 className="w-3.5 h-3.5 text-teal-600" /> Tip: Select the text
					you want to link first, then click 🔗 in the toolbar.
				</div>
			</div>
		</div>
	);
};

/* ─── IMAGE INSERT MODAL ─────────────────────────────────────────────────── */
const ImageInsertModal = ({ onClose, onInsert, onUpload }) => {
	const [url, setUrl] = useState('');
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef(null);

	const handleFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			onInsert(await onUpload(file));
		} catch {
			toast.error('Image upload failed');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div
			className="img-insert-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="img-insert-modal">
				<div className="flex items-center justify-between px-5 py-4 border-b border-border">
					<h3 className="font-bold text-base">Insert Image</h3>
					<button
						onClick={onClose}
						className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<div className="px-5 py-5 space-y-4">
					<div
						className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors"
						onClick={() => fileRef.current?.click()}
					>
						{uploading ? (
							<div className="flex flex-col items-center gap-2 text-muted-foreground">
								<Loader2 className="w-8 h-8 animate-spin" />
								<p className="text-sm">Uploading…</p>
							</div>
						) : (
							<div className="flex flex-col items-center gap-2 text-muted-foreground">
								<Upload className="w-8 h-8 opacity-40" />
								<p className="text-sm font-medium">Click to upload image</p>
								<p className="text-xs opacity-60">PNG, JPG, WEBP up to 10MB</p>
							</div>
						)}
					</div>
					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFile}
					/>
					<div className="flex items-center gap-2">
						<div className="flex-1 h-px bg-border" />
						<span className="text-xs text-muted-foreground">or paste URL</span>
						<div className="flex-1 h-px bg-border" />
					</div>
					<div className="flex gap-2">
						<Input
							placeholder="https://images.unsplash.com/…"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && url.trim()) onInsert(url.trim());
							}}
						/>
						<Button
							variant="teal"
							onClick={() => {
								if (url.trim()) onInsert(url.trim());
								else toast.error('Enter a URL');
							}}
						>
							Insert
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

/* ─── TABLE INSERT MODAL ─────────────────────────────────────────────────── */
const TableInsertModal = ({ onClose, onInsert }) => {
	const [hov, setHov] = useState({ r: 0, c: 0 });
	const [manualR, setManualR] = useState('');
	const [manualC, setManualC] = useState('');
	const MAX = 8;

	const doInsert = (r, c) => {
		if (r > 0 && c > 0) {
			onInsert(r, c);
			onClose();
		} else toast.error('Pick table size first');
	};

	return (
		<div
			className="table-modal-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="table-modal">
				<div className="flex items-center justify-between px-5 py-4 border-b border-border">
					<div>
						<h3 className="font-bold text-base">Insert Table</h3>
						<p className="text-xs text-muted-foreground mt-0.5">
							{hov.r > 0 && hov.c > 0
								? `${hov.r} × ${hov.c} table`
								: 'Hover grid or enter size manually'}
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<div className="table-grid-picker">
					{Array.from({ length: MAX * MAX }).map((_, i) => {
						const r = Math.floor(i / MAX) + 1,
							c = (i % MAX) + 1;
						return (
							<div
								key={i}
								className={cn(
									'gcell',
									r <= hov.r && c <= hov.c ? 'highlighted' : '',
								)}
								onMouseEnter={() => setHov({ r, c })}
								onClick={() => doInsert(r, c)}
							/>
						);
					})}
				</div>
				<div className="px-4 pb-4 pt-1 flex gap-2 items-end border-t border-border pt-3">
					<div className="flex-1">
						<Label className="text-xs">Rows</Label>
						<Input
							type="number"
							min={1}
							max={30}
							value={manualR}
							onChange={(e) => {
								setManualR(e.target.value);
								setHov((h) => ({ ...h, r: parseInt(e.target.value) || 0 }));
							}}
							className="mt-1 text-sm"
							placeholder="e.g. 5"
						/>
					</div>
					<div className="flex-1">
						<Label className="text-xs">Columns</Label>
						<Input
							type="number"
							min={1}
							max={10}
							value={manualC}
							onChange={(e) => {
								setManualC(e.target.value);
								setHov((h) => ({ ...h, c: parseInt(e.target.value) || 0 }));
							}}
							className="mt-1 text-sm"
							placeholder="e.g. 4"
						/>
					</div>
					<Button
						size="sm"
						variant="teal"
						onClick={() => doInsert(hov.r, hov.c)}
					>
						Insert
					</Button>
				</div>
			</div>
		</div>
	);
};

/* ─── TABLE CONTEXT BAR ──────────────────────────────────────────────────── */
const TableContextBar = ({ editor }) => {
	// Re-render when selection changes
	const [, forceUpdate] = useState(0);
	useEffect(() => {
		if (!editor) return;
		const update = () => forceUpdate((n) => n + 1);
		editor.on('selectionUpdate', update);
		editor.on('update', update);
		return () => {
			editor.off('selectionUpdate', update);
			editor.off('update', update);
		};
	}, [editor]);

	if (!editor || !editor.isActive('table')) return null;

	return (
		<div className="table-context-bar">
			<span className="ctx-label">Table:</span>
			<button onClick={() => editor.chain().focus().addRowBefore().run()}>
				+ Row above
			</button>
			<button onClick={() => editor.chain().focus().addRowAfter().run()}>
				+ Row below
			</button>
			<div className="sep" />
			<button onClick={() => editor.chain().focus().addColumnBefore().run()}>
				+ Col left
			</button>
			<button onClick={() => editor.chain().focus().addColumnAfter().run()}>
				+ Col right
			</button>
			<div className="sep" />
			<button onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
				Header row
			</button>
			<button onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
				Header col
			</button>
			<div className="sep" />
			<button
				className="danger"
				onClick={() => editor.chain().focus().deleteRow().run()}
			>
				✕ Row
			</button>
			<button
				className="danger"
				onClick={() => editor.chain().focus().deleteColumn().run()}
			>
				✕ Col
			</button>
			<button
				className="danger"
				onClick={() => editor.chain().focus().deleteTable().run()}
			>
				✕ Table
			</button>
		</div>
	);
};

/* ─── MAIN TOOLBAR ───────────────────────────────────────────────────────── */
const MainToolbar = ({
	editor,
	onInterlinkOpen,
	onImageInsert,
	onTableInsert,
}) => {
	const [, tick] = useState(0);
	useEffect(() => {
		if (!editor) return;
		const upd = () => tick((n) => n + 1);
		editor.on('selectionUpdate', upd);
		editor.on('update', upd);
		return () => {
			editor.off('selectionUpdate', upd);
			editor.off('update', upd);
		};
	}, [editor]);

	if (!editor) return null;

	const Btn = ({ action, active, title, children, disabled }) => (
		<button
			type="button"
			onMouseDown={(e) => {
				e.preventDefault();
				if (!disabled) action();
			}}
			title={title}
			disabled={disabled}
			className={cn(
				'inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors text-sm',
				active
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
				disabled && 'opacity-40 cursor-not-allowed',
			)}
		>
			{children}
		</button>
	);
	const Sep = () => <div className="w-px h-5 bg-border mx-0.5 self-center" />;

	const currentFont = FONT_FAMILIES.find(
		(f) => f.value && editor.isActive('textStyle', { fontFamily: f.value }),
	);

	return (
		<div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/40 rounded-t-lg">
			{/* Font Family */}
			<div className="font-family-dropdown mr-1">
				<select
					value={currentFont?.value || ''}
					title="Font Family"
					onChange={(e) => {
						const val = e.target.value;
						if (!val) editor.chain().focus().unsetFontFamily().run();
						else editor.chain().focus().setFontFamily(val).run();
					}}
				>
					{FONT_FAMILIES.map((f) => (
						<option key={f.value} value={f.value}>
							{f.label}
						</option>
					))}
				</select>
				<ChevronDown className="dd-arrow w-3 h-3" />
			</div>
			<Sep />
			{/* Formatting */}
			<Btn
				action={() => editor.chain().focus().toggleBold().run()}
				active={editor.isActive('bold')}
				title="Bold"
			>
				<Bold size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().toggleItalic().run()}
				active={editor.isActive('italic')}
				title="Italic"
			>
				<Italic size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().toggleUnderline().run()}
				active={editor.isActive('underline')}
				title="Underline"
			>
				<UnderlineIcon size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().toggleStrike().run()}
				active={editor.isActive('strike')}
				title="Strikethrough"
			>
				<Strikethrough size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().toggleCode().run()}
				active={editor.isActive('code')}
				title="Inline Code"
			>
				<Code size={12} />
			</Btn>
			<Sep />
			{/* Heading Level Dropdown */}
			<div className="font-family-dropdown mr-1">
				<select
					title="Heading Level"
					value={
						editor.isActive('heading', { level: 1 })
							? '1'
							: editor.isActive('heading', { level: 2 })
								? '2'
								: editor.isActive('heading', { level: 3 })
									? '3'
									: editor.isActive('heading', { level: 4 })
										? '4'
										: editor.isActive('heading', { level: 5 })
											? '5'
											: editor.isActive('heading', { level: 6 })
												? '6'
												: '0'
					}
					onChange={(e) => {
						const val = parseInt(e.target.value);
						if (val === 0) editor.chain().focus().setParagraph().run();
						else editor.chain().focus().toggleHeading({ level: val }).run();
					}}
					style={{ minWidth: '90px' }}
				>
					<option value="0">Paragraph</option>
					<option value="1">H1 — Title</option>
					<option value="2">H2 — Section</option>
					<option value="3">H3 — Sub</option>
					<option value="4">H4 — Minor</option>
					<option value="5">H5 — Small</option>
					<option value="6">H6 — Tiny</option>
				</select>
				<ChevronDown className="dd-arrow w-3 h-3" />
			</div>
			<Sep />
			{/* Lists */}
			<Btn
				action={() => editor.chain().focus().toggleBulletList().run()}
				active={editor.isActive('bulletList')}
				title="Bullet List"
			>
				<List size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().toggleOrderedList().run()}
				active={editor.isActive('orderedList')}
				title="Numbered List"
			>
				<ListOrdered size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().toggleBlockquote().run()}
				active={editor.isActive('blockquote')}
				title="Blockquote"
			>
				<Quote size={12} />
			</Btn>
			<Sep />
			{/* Alignment */}
			<Btn
				action={() => editor.chain().focus().setTextAlign('left').run()}
				active={editor.isActive({ textAlign: 'left' })}
				title="Align Left"
			>
				<AlignLeft size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().setTextAlign('center').run()}
				active={editor.isActive({ textAlign: 'center' })}
				title="Align Center"
			>
				<AlignCenter size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().setTextAlign('right').run()}
				active={editor.isActive({ textAlign: 'right' })}
				title="Align Right"
			>
				<AlignRight size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().setTextAlign('justify').run()}
				active={editor.isActive({ textAlign: 'justify' })}
				title="Justify"
			>
				<AlignJustify size={12} />
			</Btn>
			<Sep />
			{/* Table */}
			<Btn
				action={() => onTableInsert(editor)}
				active={editor.isActive('table')}
				title="Insert Table"
			>
				<TableIcon size={12} />
			</Btn>
			<Sep />
			{/* Media / Links */}
			<Btn
				action={() => onImageInsert(editor)}
				active={false}
				title="Insert Image"
			>
				<ImageIcon size={12} />
			</Btn>
			<Btn
				action={() => onInterlinkOpen(editor)}
				active={editor.isActive('link')}
				title="Insert Interlink"
			>
				<Link2 size={12} />
			</Btn>
			{editor.isActive('link') && (
				<Btn
					action={() => editor.chain().focus().unsetLink().run()}
					active={false}
					title="Remove link"
				>
					<X size={12} />
				</Btn>
			)}
			<Sep />
			{/* Undo/Redo */}
			<Btn
				action={() => editor.chain().focus().undo().run()}
				active={false}
				title="Undo"
			>
				<RotateCcw size={12} />
			</Btn>
			<Btn
				action={() => editor.chain().focus().redo().run()}
				active={false}
				title="Redo"
				disabled={!editor.can().redo()}
			>
				<RotateCcw size={12} className="scale-x-[-1]" />
			</Btn>
		</div>
	);
};

/* ─── IMAGE UPLOAD FIELD ─────────────────────────────────────────────────── */
const ImageUploadField = ({
	url,
	onFileChange,
	onUrlChange,
	label = 'Image',
}) => {
	const inputRef = useRef(null);
	const [preview, setPreview] = useState(url || '');
	const handleFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const ou = URL.createObjectURL(file);
		setPreview(ou);
		onFileChange(file, ou);
	};
	useEffect(() => {
		setPreview(url || '');
	}, [url]);
	return (
		<div className="space-y-2">
			<Label className="flex items-center gap-1.5">
				<ImageIcon className="w-3.5 h-3.5" /> {label}
			</Label>
			<div
				className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors"
				onClick={() => inputRef.current?.click()}
			>
				{preview ? (
					<div className="relative">
						<img
							src={preview}
							alt="preview"
							className="w-full h-40 object-cover rounded-lg"
							onError={() => setPreview('')}
						/>
						<button
							type="button"
							className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
							onClick={(e) => {
								e.stopPropagation();
								setPreview('');
								onFileChange(null, '');
								onUrlChange?.('');
							}}
						>
							<X className="w-3 h-3" />
						</button>
					</div>
				) : (
					<div className="py-4 flex flex-col items-center gap-2 text-muted-foreground">
						<Upload className="w-8 h-8 opacity-40" />
						<p className="text-sm font-medium">Click to upload image</p>
						<p className="text-xs opacity-60">PNG, JPG, WEBP up to 10MB</p>
					</div>
				)}
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFile}
			/>
			<div className="flex items-center gap-2">
				<div className="flex-1 h-px bg-border" />
				<span className="text-xs text-muted-foreground">or paste URL</span>
				<div className="flex-1 h-px bg-border" />
			</div>
			<Input
				placeholder="https://images.unsplash.com/…"
				value={preview?.startsWith('blob:') ? '' : url || ''}
				onChange={(e) => {
					onUrlChange?.(e.target.value);
					setPreview(e.target.value);
				}}
			/>
		</div>
	);
};

/* ─── TAGS INPUT ─────────────────────────────────────────────────────────── */
const TagsInput = ({ tags, onChange }) => {
	const [input, setInput] = useState('');
	const add = () => {
		const val = input.trim().replace(/^#/, '');
		if (!val || tags.includes(val)) {
			setInput('');
			return;
		}
		onChange([...tags, val]);
		setInput('');
	};
	const remove = (t) => onChange(tags.filter((x) => x !== t));
	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-2">
				{tags.map((t) => (
					<span
						key={t}
						className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
					>
						#{t}
						<button
							type="button"
							onClick={() => remove(t)}
							className="hover:text-destructive"
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}
			</div>
			<div className="flex gap-2">
				<Input
					placeholder="Add a tag (e.g. Noida, Investment)"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							add();
						}
					}}
					className="text-sm"
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={add}
					className="shrink-0"
				>
					<Plus className="w-3.5 h-3.5 mr-1" /> Add
				</Button>
			</div>
		</div>
	);
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const AdminBlogEditor = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const [form, setForm] = useState(defaultForm);
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(isEditing);
	const [heroUploading, setHeroUploading] = useState(false);
	const [customCategory, setCustomCategory] = useState(false);
	const [slugLocked, setSlugLocked] = useState(isEditing); // locked when editing, auto when new
	const [interlinkOpen, setInterlinkOpen] = useState(false);
	const [imageInsertOpen, setImageInsertOpen] = useState(false);
	const [tableInsertOpen, setTableInsertOpen] = useState(false);
	const activeEditorRef = useRef(null);

	const mainEditor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3, 4, 5, 6] },
			}),
			Underline,
			TextStyle,
			FontFamily,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			Placeholder.configure({
				placeholder:
					'Start writing your blog post here… Paste content from Word, Excel, or any website — tables are preserved automatically.',
			}),
			TiptapLink.configure({
				openOnClick: false,
				autolink: false,
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer',
					class: 'interlink',
				},
			}),
			TiptapImage.configure({ inline: false, allowBase64: false }),
			// Table extensions handle paste from Word/Excel/web automatically
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
		],
		content: form.content || '',
		onUpdate: ({ editor }) => {
			setForm((f) => ({ ...f, content: editor.getHTML() }));
		},
	});

	useEffect(() => {
		if (mainEditor && form.content !== undefined) {
			const current = mainEditor.getHTML();
			if (current !== form.content && form.content !== '')
				mainEditor.commands.setContent(form.content, false);
		}
	}, [mainEditor, loading]); // eslint-disable-line

	const openInterlink = useCallback((editor) => {
		activeEditorRef.current = editor;
		setInterlinkOpen(true);
	}, []);
	const handleInterlinkInsert = useCallback(({ url, label }) => {
		const editor = activeEditorRef.current;
		if (!editor) return;
		if (editor.state.selection.empty)
			editor
				.chain()
				.focus()
				.insertContent(
					`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
				)
				.run();
		else editor.chain().focus().setLink({ href: url }).run();
		setInterlinkOpen(false);
		toast.success('Link inserted!');
	}, []);

	const openImageInsert = useCallback((editor) => {
		activeEditorRef.current = editor;
		setImageInsertOpen(true);
	}, []);
	const handleImageInsert = useCallback((url) => {
		const editor = activeEditorRef.current;
		if (!editor) return;
		editor.chain().focus().setImage({ src: url }).run();
		setImageInsertOpen(false);
		toast.success('Image inserted!');
	}, []);

	const openTableInsert = useCallback((editor) => {
		activeEditorRef.current = editor;
		setTableInsertOpen(true);
	}, []);
	const handleTableInsert = useCallback((rows, cols) => {
		const editor = activeEditorRef.current;
		if (!editor) return;
		editor
			.chain()
			.focus()
			.insertTable({ rows, cols, withHeaderRow: true })
			.run();
		toast.success(`${rows}×${cols} table inserted!`);
	}, []);

	const uploadImageFile = async (file) => {
		const resolveUrl = (url) => {
			if (!url || !url.startsWith('/')) return url;
			return `${api.defaults?.baseURL?.replace(/\/api\/?$/, '') || window.location.origin}${url}`;
		};
		const fd = new FormData();
		fd.append('file', file);
		const { data } = await api.post('/blogs/upload/image', fd, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return resolveUrl(data.url);
	};

	useEffect(() => {
		if (!isEditing) return;
		(async () => {
			try {
				const { data } = await api.get(`/blogs/${id}`);
				let content = '';
				if (data.blocks?.length) {
					content = data.blocks
						.map((b) => {
							if (b.type === 'section')
								return (
									(b.heading ? `<h2>${b.heading}</h2>` : '') + (b.body || '')
								);
							if (b.type === 'image' && b.url)
								return `<img src="${b.url}" alt="${b.caption || ''}" />${b.caption ? `<p><em>${b.caption}</em></p>` : ''}`;
							return '';
						})
						.join('\n');
				} else if (data.sections?.length) {
					content = data.sections
						.map(
							(s) =>
								(s.heading ? `<h2>${s.heading}</h2>` : '') + (s.body || ''),
						)
						.join('\n');
				}
				setForm({
					title: data.title || '',
					slug: data.slug || makeSlug(data.title || ''),
					excerpt: data.excerpt || '',
					category: data.category || 'Real Estate',
					date: data.date || new Date().toISOString().split('T')[0],
					readTime: data.readTime || '5 min read',
					heroImage: data.image || data.heroImage || '',
					heroFile: null,
					author: data.author || { name: '', role: '' },
					content,
					tags: data.tags || [],
					faqs: data.faqs?.length ? data.faqs : [{ q: '', a: '' }],
					keyStats: data.keyStats || [],
					status: data.status || 'draft',
				});
				if (data.category && !CATEGORIES.includes(data.category))
					setCustomCategory(true);
			} catch {
				toast.error('Failed to load post');
			} finally {
				setLoading(false);
			}
		})();
	}, [id, isEditing]);

	const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

	// Auto-generate slug from title when slug is not manually locked
	useEffect(() => {
		if (!slugLocked && form.title) {
			setForm((f) => ({ ...f, slug: makeSlug(f.title) }));
		}
	}, [form.title, slugLocked]);
	const setAuthor = (key, val) =>
		setForm((f) => ({ ...f, author: { ...f.author, [key]: val } }));
	const updateFAQ = (i, k, v) =>
		setForm((f) => ({
			...f,
			faqs: f.faqs.map((q, idx) => (idx === i ? { ...q, [k]: v } : q)),
		}));
	const addFAQ = () =>
		setForm((f) => ({ ...f, faqs: [...f.faqs, { q: '', a: '' }] }));
	const removeFAQ = (i) =>
		setForm((f) => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));
	const updateStat = (i, k, v) =>
		setForm((f) => ({
			...f,
			keyStats: f.keyStats.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)),
		}));
	const addStat = () =>
		setForm((f) => ({
			...f,
			keyStats: [...f.keyStats, { label: '', value: '', icon: '' }],
		}));
	const removeStat = (i) =>
		setForm((f) => ({
			...f,
			keyStats: f.keyStats.filter((_, idx) => idx !== i),
		}));
	const buildTOC = (html) =>
		[...html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi)]
			.map((m) => m[1].replace(/<[^>]+>/g, '').trim())
			.filter(Boolean);

	const handleSave = async (status = form.status) => {
		if (!form.title.trim()) {
			toast.error('Title is required');
			return;
		}
		setSaving(true);
		try {
			let heroImageUrl = form.heroImage;
			if (form.heroFile) {
				setHeroUploading(true);
				try {
					heroImageUrl = await uploadImageFile(form.heroFile);
				} catch {
					toast.error('Hero image upload failed');
					setSaving(false);
					setHeroUploading(false);
					return;
				}
				setHeroUploading(false);
			}
			const html = mainEditor?.getHTML() || form.content || '';
			const payload = {
				title: form.title,
				slug: form.slug || makeSlug(form.title),
				excerpt: form.excerpt,
				category: form.category,
				date: form.date,
				readTime: form.readTime,
				image: heroImageUrl,
				heroImage: heroImageUrl,
				author: form.author,
				blocks: [{ type: 'section', heading: '', body: html }],
				sections: [{ heading: '', body: html }],
				tags: form.tags,
				faqs: form.faqs,
				keyStats: form.keyStats,
				toc: buildTOC(html),
				status,
			};
			if (isEditing) await api.put(`/blogs/${id}`, payload);
			else await api.post('/blogs', payload);
			toast.success(
				isEditing ? 'Post updated successfully' : 'Post created successfully',
			);
			navigate('/admin/blog');
		} catch (err) {
			console.error(err);
			toast.error('Failed to save post');
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);

	return (
		<div className="space-y-6">
			<style>{tiptapStyles}</style>

			{interlinkOpen && (
				<InterlinkModal
					onClose={() => setInterlinkOpen(false)}
					onInsert={handleInterlinkInsert}
				/>
			)}
			{imageInsertOpen && (
				<ImageInsertModal
					onClose={() => setImageInsertOpen(false)}
					onInsert={handleImageInsert}
					onUpload={uploadImageFile}
				/>
			)}
			{tableInsertOpen && (
				<TableInsertModal
					onClose={() => setTableInsertOpen(false)}
					onInsert={handleTableInsert}
				/>
			)}

			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" asChild>
						<Link to="/admin/blog">
							<ArrowLeft className="w-5 h-5" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-foreground">
							{isEditing ? 'Edit Post' : 'New Blog Post'}
						</h1>
						<p className="text-muted-foreground text-sm">
							{isEditing
								? `Editing: ${form.title || '…'}`
								: 'Fill in the details and publish'}
						</p>
					</div>
				</div>
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => handleSave('draft')}
						disabled={saving}
					>
						{saving ? (
							<Loader2 className="w-4 h-4 mr-2 spin" />
						) : (
							<FileText className="w-4 h-4 mr-2" />
						)}
						Save Draft
					</Button>
					<Button
						variant="teal"
						onClick={() => handleSave('published')}
						disabled={saving}
					>
						{saving ? (
							<Loader2 className="w-4 h-4 mr-2 spin" />
						) : (
							<Save className="w-4 h-4 mr-2" />
						)}
						{isEditing ? 'Update' : 'Publish'}
					</Button>
				</div>
			</div>

			{/* POST DETAILS */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<FileText className="w-4 h-4 text-primary" /> Post Details
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							placeholder="e.g. Top 5 Emerging Real Estate Corridors in Greater Noida"
							value={form.title}
							onChange={(e) => setField('title', e.target.value)}
						/>
					</div>

					{/* Slug field */}
					<div>
						<Label htmlFor="slug" className="flex items-center gap-2">
							URL Slug
							<span className="text-xs text-muted-foreground font-normal">
								(yoursite.com/blog/
								<span className="text-primary font-medium">
									{form.slug || '…'}
								</span>
								)
							</span>
						</Label>
						<div className="flex gap-2 mt-1">
							<div className="relative flex-1">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs select-none pointer-events-none">
									/blog/
								</span>
								<Input
									id="slug"
									value={form.slug}
									disabled={!slugLocked}
									onChange={(e) => {
										// Clean input: lowercase, replace spaces → hyphens, strip invalid chars
										const cleaned = e.target.value
											.toLowerCase()
											.replace(/\s+/g, '-')
											.replace(/[^a-z0-9-]/g, '');
										setField('slug', cleaned);
									}}
									className="pl-12 font-mono text-sm"
									placeholder="auto-generated-from-title"
								/>
							</div>
							<Button
								type="button"
								variant={slugLocked ? 'default' : 'outline'}
								size="sm"
								className="shrink-0 gap-1.5"
								onClick={() => {
									if (slugLocked) {
										// Unlock: allow manual edit
										setSlugLocked(false);
									} else {
										// Lock / regenerate from title
										setForm((f) => ({ ...f, slug: makeSlug(f.title) }));
										setSlugLocked(true);
									}
								}}
								title={
									slugLocked
										? 'Click to edit slug manually'
										: 'Click to regenerate from title'
								}
							>
								{slugLocked ? <>✏️ Edit</> : <>🔄 Auto</>}
							</Button>
						</div>
						{!slugLocked && (
							<p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
								⚠️ Changing the slug will break existing links to this post.
								Click <strong>Auto</strong> to regenerate from the title.
							</p>
						)}
					</div>
					<div>
						<Label htmlFor="excerpt">
							Meta Description (SEO Only){' '}
							<span className="ml-2 text-xs text-muted-foreground font-normal">
								({form.excerpt.length}/160 chars)
							</span>
						</Label>
						<div className="flex items-center gap-2 mb-2 mt-1">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
								🔍 Invisible to readers — only Google & SEO tools see this
							</span>
						</div>
						<Textarea
							id="excerpt"
							rows={2}
							placeholder="Describe the post for Google (120–160 chars ideal)."
							value={form.excerpt}
							onChange={(e) => setField('excerpt', e.target.value)}
						/>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<Label>Category</Label>
							<Select
								value={customCategory ? '__custom__' : form.category}
								onValueChange={(v) => {
									if (v === '__custom__') {
										setCustomCategory(true);
										setField('category', '');
									} else {
										setCustomCategory(false);
										setField('category', v);
									}
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									{CATEGORIES.map((c) => (
										<SelectItem key={c} value={c}>
											{c}
										</SelectItem>
									))}
									<SelectItem value="__custom__">✏️ Custom…</SelectItem>
								</SelectContent>
							</Select>
							{customCategory && (
								<div className="mt-2 flex gap-2">
									<Input
										autoFocus
										placeholder="Type your category"
										value={form.category}
										onChange={(e) => setField('category', e.target.value)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="shrink-0 text-muted-foreground"
										onClick={() => {
											setCustomCategory(false);
											setField('category', 'Real Estate');
										}}
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							)}
						</div>
						<div>
							<Label>Status</Label>
							<Select
								value={form.status}
								onValueChange={(v) => setField('status', v)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="draft">Draft</SelectItem>
									<SelectItem value="published">Published</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="date">Publish Date</Label>
							<Input
								id="date"
								type="date"
								value={form.date}
								onChange={(e) => setField('date', e.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="readTime">Read Time</Label>
							<Input
								id="readTime"
								placeholder="e.g. 5 min read"
								value={form.readTime}
								onChange={(e) => setField('readTime', e.target.value)}
							/>
						</div>
					</div>
					<ImageUploadField
						label={heroUploading ? 'Uploading hero image…' : 'Hero Image'}
						url={form.heroImage}
						onFileChange={(file, prev) =>
							setForm((f) => ({ ...f, heroFile: file, heroImage: prev || '' }))
						}
						onUrlChange={(url) =>
							setForm((f) => ({ ...f, heroImage: url, heroFile: null }))
						}
					/>
				</CardContent>
			</Card>

			{/* AUTHOR */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<CardTitle className="text-base">Author</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<Label>Author Name</Label>
							<Input
								placeholder="e.g. Arjun Sharma"
								value={form.author.name}
								onChange={(e) => setAuthor('name', e.target.value)}
							/>
						</div>
						<div>
							<Label>Author Role</Label>
							<Input
								placeholder="e.g. Senior Real Estate Analyst"
								value={form.author.role}
								onChange={(e) => setAuthor('role', e.target.value)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* TAGS */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Tag className="w-4 h-4 text-primary" /> Tags
					</CardTitle>
					<p className="text-xs text-muted-foreground mt-1">
						Tags are shown on the blog detail page and help with SEO.
					</p>
				</CardHeader>
				<CardContent>
					<TagsInput
						tags={form.tags}
						onChange={(tags) => setField('tags', tags)}
					/>
				</CardContent>
			</Card>

			{/* MAIN CONTENT EDITOR */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<FileText className="w-4 h-4 text-primary" /> Blog Content
					</CardTitle>
					<p className="text-xs text-muted-foreground mt-1">
						Write or paste content here.{' '}
						<strong>
							Tables pasted from Word, Excel, or any website are preserved
							automatically.
						</strong>{' '}
						Use the <strong>⊞</strong> table button to insert a new table. When
						your cursor is inside a table, an extra row of table controls
						appears below the toolbar.
					</p>
				</CardHeader>
				<CardContent className="p-0">
					<div className="tiptap-main border rounded-b-xl overflow-hidden">
						{/* Sticky toolbar — always visible */}
						<MainToolbar
							editor={mainEditor}
							onInterlinkOpen={openInterlink}
							onImageInsert={openImageInsert}
							onTableInsert={openTableInsert}
						/>
						{/* Table context bar — only appears when cursor is inside a table */}
						<TableContextBar editor={mainEditor} />
						{/* Scrollable editor body — 600px tall */}
						<div className="tiptap-editor-scroll">
							<EditorContent editor={mainEditor} />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* FAQs */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-base flex items-center gap-2">
							<HelpCircle className="w-4 h-4 text-primary" /> FAQs (
							{form.faqs.length})
						</CardTitle>
						<Button variant="outline" size="sm" onClick={addFAQ}>
							<Plus className="w-4 h-4 mr-1" /> Add FAQ
						</Button>
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						FAQs appear at the bottom and are indexed by Google for rich
						snippets.
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					{form.faqs.map((faq, i) => (
						<div
							key={i}
							className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3"
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
									Q{i + 1}
								</span>
								{form.faqs.length > 1 && (
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive hover:text-destructive h-7 w-7"
										onClick={() => removeFAQ(i)}
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								)}
							</div>
							<div>
								<Label>Question</Label>
								<Input
									placeholder="e.g. Is Greater Noida a good investment?"
									value={faq.q}
									onChange={(e) => updateFAQ(i, 'q', e.target.value)}
								/>
							</div>
							<div>
								<Label>Answer</Label>
								<Textarea
									rows={3}
									placeholder="Provide a clear, helpful answer…"
									value={faq.a}
									onChange={(e) => updateFAQ(i, 'a', e.target.value)}
								/>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* KEY STATS */}
			<Card className="bg-card border-0 shadow-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-base flex items-center gap-2">
							<BarChart2 className="w-4 h-4 text-primary" /> Key Stats (
							{form.keyStats.length})
						</CardTitle>
						<Button variant="outline" size="sm" onClick={addStat}>
							<Plus className="w-4 h-4 mr-1" /> Add Stat
						</Button>
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						Optional highlight widget shown above the article. Use emoji for
						icons (e.g. 📈).
					</p>
				</CardHeader>
				<CardContent className="space-y-3">
					{form.keyStats.length === 0 && (
						<p className="text-sm text-muted-foreground text-center py-4">
							No stats yet — click "Add Stat" to add highlight numbers.
						</p>
					)}
					{form.keyStats.map((stat, i) => (
						<div
							key={i}
							className="grid grid-cols-[1fr_1fr_80px_36px] gap-3 items-end"
						>
							<div>
								{i === 0 && <Label>Label</Label>}
								<Input
									placeholder="e.g. Rental Growth"
									value={stat.label}
									onChange={(e) => updateStat(i, 'label', e.target.value)}
								/>
							</div>
							<div>
								{i === 0 && <Label>Value</Label>}
								<Input
									placeholder="e.g. +18%"
									value={stat.value}
									onChange={(e) => updateStat(i, 'value', e.target.value)}
								/>
							</div>
							<div>
								{i === 0 && <Label>Icon</Label>}
								<Input
									placeholder="📈"
									value={stat.icon}
									onChange={(e) => updateStat(i, 'icon', e.target.value)}
									className="text-center text-lg"
								/>
							</div>
							<div className={i === 0 ? 'pt-6' : ''}>
								<Button
									variant="ghost"
									size="icon"
									className="text-destructive hover:text-destructive h-9 w-9"
									onClick={() => removeStat(i)}
								>
									<Trash2 className="w-3.5 h-3.5" />
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* BOTTOM SAVE BAR */}
			<div className="flex justify-end gap-3 pt-2 pb-6">
				<Button
					variant="outline"
					onClick={() => handleSave('draft')}
					disabled={saving}
				>
					<FileText className="w-4 h-4 mr-2" /> Save as Draft
				</Button>
				<Button
					variant="teal"
					onClick={() => handleSave('published')}
					disabled={saving}
				>
					{saving ? (
						<Loader2 className="w-4 h-4 mr-2 spin" />
					) : (
						<Save className="w-4 h-4 mr-2" />
					)}
					{isEditing ? 'Update Post' : 'Publish Post'}
				</Button>
			</div>
		</div>
	);
};

export default AdminBlogEditor;
