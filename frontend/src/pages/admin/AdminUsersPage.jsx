import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
	Users, Search, Trash2, Shield, ChevronLeft, ChevronRight,
	RefreshCw, UserCheck, Clock, Wallet, Copy, Check,
	MoreVertical, X, AlertTriangle, Loader2, Filter,
	Mail, Phone, Star, TrendingUp, Gift,
} from 'lucide-react';
import { toast } from 'sonner';

const ROLES = ['USER', 'AGENT', 'OWNER', 'ADMIN'];

const roleBadge = (role) => {
	const cfg = {
		ADMIN: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
		AGENT: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
		OWNER: { bg: '#faf5ff', border: '#e9d5ff', color: '#7c3aed' },
		USER:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
	};
	const c = cfg[role] || cfg.USER;
	return (
		<span style={{
			background: c.bg, border: `1px solid ${c.border}`, color: c.color,
			fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: 20,
			display: 'inline-flex', alignItems: 'center', gap: 4,
		}}>
			<Shield size={9} /> {role}
		</span>
	);
};

const fmtDate = (d) => d
	? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
	: '—';

/* ── Delete confirm modal ── */
const DeleteModal = ({ user, onConfirm, onCancel }) => (
	<div style={{
		position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
		display: 'flex', alignItems: 'center', justifyContent: 'center',
		zIndex: 9999, padding: 16,
	}}>
		<div style={{
			background: '#fff', borderRadius: 20, padding: 28, maxWidth: 400, width: '100%',
			boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
		}}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
				<div style={{ width: 44, height: 44, borderRadius: 14, background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<AlertTriangle size={20} color="#dc2626" />
				</div>
				<div>
					<div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Delete User</div>
					<div style={{ color: '#64748b', fontSize: '0.82rem' }}>This action cannot be undone</div>
				</div>
			</div>
			<p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: 20 }}>
				Are you sure you want to delete <strong>{user.name || user.email}</strong>? All their data will be permanently removed.
			</p>
			<div style={{ display: 'flex', gap: 10 }}>
				<button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
					Cancel
				</button>
				<button onClick={onConfirm} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
					Delete User
				</button>
			</div>
		</div>
	</div>
);

/* ── Edit role modal ── */
const EditRoleModal = ({ user, onSave, onCancel }) => {
	const [role, setRole] = useState(user.role);
	const [walletDelta, setWalletDelta] = useState('');

	return (
		<div style={{
			position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
			display: 'flex', alignItems: 'center', justifyContent: 'center',
			zIndex: 9999, padding: 16,
		}}>
			<div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
				<div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: 20 }}>
					Edit User: {user.name || user.email}
				</div>
				<label style={{ display: 'block', marginBottom: 14 }}>
					<div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</div>
					<select
						value={role}
						onChange={e => setRole(e.target.value)}
						style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
					>
						{ROLES.map(r => <option key={r} value={r}>{r}</option>)}
					</select>
				</label>
				<label style={{ display: 'block', marginBottom: 24 }}>
					<div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add/Remove Wallet Balance (₹)</div>
					<input
						type="number"
						placeholder="e.g. 500 to add, -200 to remove"
						value={walletDelta}
						onChange={e => setWalletDelta(e.target.value)}
						style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
					/>
				</label>
				<div style={{ display: 'flex', gap: 10 }}>
					<button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
						Cancel
					</button>
					<button onClick={() => onSave(role, walletDelta ? parseFloat(walletDelta) : null)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: '#0d9488', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

/* ── Main Component ── */
const AdminUsersPage = () => {
	const [users, setUsers] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [roleFilter, setRoleFilter] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [editTarget, setEditTarget] = useState(null);
	const [copiedId, setCopiedId] = useState(null);

	const fetchStats = useCallback(async () => {
		try {
			const res = await api.get('/admin/users/stats');
			setStats(res.data);
		} catch { /* silent */ }
	}, []);

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({ page, limit: 20 });
			if (search) params.set('search', search);
			if (roleFilter) params.set('role', roleFilter);
			const res = await api.get(`/admin/users/?${params}`);
			setUsers(res.data.users || []);
			setTotalPages(res.data.pages || 1);
			setTotal(res.data.total || 0);
		} catch {
			toast.error('Failed to load users');
		} finally {
			setLoading(false);
		}
	}, [page, search, roleFilter]);

	useEffect(() => { fetchStats(); }, [fetchStats]);
	useEffect(() => { fetchUsers(); }, [fetchUsers]);

	const handleDelete = async () => {
		try {
			await api.delete(`/admin/users/${deleteTarget.id}`);
			toast.success('User deleted');
			setDeleteTarget(null);
			fetchUsers();
			fetchStats();
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Delete failed');
		}
	};

	const handleSaveEdit = async (role, walletDelta) => {
		try {
			const updates = { role };
			if (walletDelta !== null) {
				const currentBalance = editTarget.wallet_balance || 0;
				updates.wallet_balance = Math.max(0, currentBalance + walletDelta);
			}
			await api.patch(`/admin/users/${editTarget.id}`, updates);
			toast.success('User updated');
			setEditTarget(null);
			fetchUsers();
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Update failed');
		}
	};

	const copyCode = (code, id) => {
		navigator.clipboard.writeText(code);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 1500);
	};

	const handleSearch = (e) => {
		setSearch(e.target.value);
		setPage(1);
	};

	return (
		<div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
			{/* ── Header ── */}
			<div style={{ marginBottom: 24 }}>
				<h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>User Management</h1>
				<p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 4 }}>Manage all registered users, roles, and wallet balances</p>
			</div>

			{/* ── Stats ── */}
			{stats && (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 24 }}>
					{[
						{ label: 'Total Users', value: stats.total, icon: <Users size={18} color="#0d9488" />, color: '#0d9488' },
						{ label: 'Verified', value: stats.verified, icon: <UserCheck size={18} color="#16a34a" />, color: '#16a34a' },
						{ label: 'Via Referral', value: stats.referred, icon: <Gift size={18} color="#d97706" />, color: '#d97706' },
					].map(s => (
						<div key={s.label} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
							<div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, border: `1.5px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{s.icon}</div>
							<div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
							<div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
						</div>
					))}
					{stats.by_role && Object.entries(stats.by_role).map(([role, count]) => (
						<div key={role} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
							<div style={{ marginBottom: 10 }}>{roleBadge(role)}</div>
							<div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{role} Count</div>
							<div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>{count}</div>
						</div>
					))}
				</div>
			)}

			{/* ── Filters ── */}
			<div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
				<div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
					<Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
					<input
						type="text"
						placeholder="Search name, email, phone..."
						value={search}
						onChange={handleSearch}
						style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '0.88rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
					/>
				</div>
				<select
					value={roleFilter}
					onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
					style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '0.88rem', outline: 'none', background: '#fff', cursor: 'pointer' }}
				>
					<option value="">All Roles</option>
					{ROLES.map(r => <option key={r} value={r}>{r}</option>)}
				</select>
				<button onClick={() => { setSearch(''); setRoleFilter(''); setPage(1); }} style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
					<RefreshCw size={14} /> Reset
				</button>
			</div>

			{/* ── Table ── */}
			<div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
				<div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
						<Users size={16} color="#0d9488" /> Users
					</div>
					<span style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.2)', color: '#0d9488', fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
						{total} total
					</span>
				</div>

				{loading ? (
					<div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
						<Loader2 className="animate-spin" size={28} color="#0d9488" />
					</div>
				) : users.length === 0 ? (
					<div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
						<Users size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
						<p style={{ fontWeight: 600, marginBottom: 4 }}>No users found</p>
						<p style={{ fontSize: '0.82rem' }}>Try adjusting your search or filters</p>
					</div>
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f8fafc' }}>
									{['User', 'Role', 'Referral Code', 'Wallet', 'Verified', 'Joined', 'Actions'].map(h => (
										<th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{users.map((u, i) => (
									<tr key={u.id || i} style={{ borderTop: '1px solid #f1f5f9' }}
										onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
										onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
									>
										<td style={{ padding: '13px 16px' }}>
											<div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{u.name || '—'}</div>
											<div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 2 }}>{u.email}</div>
											{u.phone && <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: 1 }}>{u.phone}</div>}
										</td>
										<td style={{ padding: '13px 16px' }}>{roleBadge(u.role)}</td>
										<td style={{ padding: '13px 16px' }}>
											{u.referral_code ? (
												<button
													onClick={() => copyCode(u.referral_code, u.id)}
													style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: '#0d9488' }}
												>
													{copiedId === u.id ? <Check size={11} /> : <Copy size={11} />}
													{u.referral_code}
												</button>
											) : <span style={{ color: '#cbd5e1' }}>—</span>}
										</td>
										<td style={{ padding: '13px 16px', fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
											₹{(u.wallet_balance || 0).toLocaleString('en-IN')}
										</td>
										<td style={{ padding: '13px 16px' }}>
											{u.email_verified ? (
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>
													<UserCheck size={10} /> Yes
												</span>
											) : (
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', color: '#d97706', fontSize: '0.7rem', fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>
													<Clock size={10} /> Pending
												</span>
											)}
										</td>
										<td style={{ padding: '13px 16px', fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
											{fmtDate(u.created_at)}
										</td>
										<td style={{ padding: '13px 16px' }}>
											<div style={{ display: 'flex', gap: 6 }}>
												<button
													onClick={() => setEditTarget(u)}
													title="Edit user"
													style={{ width: 32, height: 32, borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
													onMouseEnter={e => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.color = '#0d9488'; }}
													onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = 'inherit'; }}
												>
													<Shield size={14} />
												</button>
												{u.id !== 'admin-1' && (
													<button
														onClick={() => setDeleteTarget(u)}
														title="Delete user"
														style={{ width: 32, height: 32, borderRadius: 9, border: '1.5px solid #fecaca', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
													>
														<Trash2 size={14} color="#dc2626" />
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<span style={{ color: '#64748b', fontSize: '0.82rem' }}>
							Page {page} of {totalPages} ({total} users)
						</span>
						<div style={{ display: 'flex', gap: 8 }}>
							<button
								onClick={() => setPage(p => Math.max(1, p - 1))}
								disabled={page <= 1}
								style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}
							>
								<ChevronLeft size={16} />
							</button>
							<button
								onClick={() => setPage(p => Math.min(totalPages, p + 1))}
								disabled={page >= totalPages}
								style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}
							>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			{deleteTarget && <DeleteModal user={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
			{editTarget && <EditRoleModal user={editTarget} onSave={handleSaveEdit} onCancel={() => setEditTarget(null)} />}
		</div>
	);
};

export default AdminUsersPage;
