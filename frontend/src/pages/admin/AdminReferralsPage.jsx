import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
	Gift, Search, ChevronLeft, ChevronRight,
	RefreshCw, UserCheck, Clock, CheckCircle2,
	Loader2, Users, TrendingUp, ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

const fmtDate = (d) => d
	? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
	: '—';

const AdminReferralsPage = () => {
	const [referrals, setReferrals] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	const fetchReferrals = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({ page, limit: 30 });
			if (search) params.set('search', search);
			const res = await api.get(`/referrals/admin/all?${params}`);
			setReferrals(res.data.referrals || []);
			setTotalPages(res.data.pages || 1);
			setTotal(res.data.total || 0);
			if (res.data.stats) setStats(res.data.stats);
		} catch {
			toast.error('Failed to load referrals');
		} finally {
			setLoading(false);
		}
	}, [page, search]);

	useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

	const handleSearch = (e) => {
		setSearch(e.target.value);
		setPage(1);
	};

	return (
		<div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
			{/* ── Header ── */}
			<div style={{ marginBottom: 24 }}>
				<h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Referral Tracking</h1>
				<p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 4 }}>Track all referral relationships and conversion status</p>
			</div>

			{/* ── Stats ── */}
			{stats && (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
					{[
						{ label: 'Total Referrals', value: stats.total_referrals, icon: <Users size={18} color="#0d9488" />, color: '#0d9488' },
						{ label: 'Verified', value: stats.verified, icon: <CheckCircle2 size={18} color="#16a34a" />, color: '#16a34a' },
						{ label: 'Pending', value: stats.pending, icon: <Clock size={18} color="#d97706" />, color: '#d97706' },
					].map(s => (
						<div key={s.label} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
							<div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, border: `1.5px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{s.icon}</div>
							<div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
							<div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
						</div>
					))}
					{stats.total_referrals > 0 && (
						<div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
							<div style={{ width: 36, height: 36, borderRadius: 10, background: '#7c3aed12', border: '1.5px solid #7c3aed25', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
								<TrendingUp size={18} color="#7c3aed" />
							</div>
							<div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Conversion Rate</div>
							<div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>
								{Math.round((stats.verified / stats.total_referrals) * 100)}%
							</div>
						</div>
					)}
				</div>
			)}

			{/* ── Search ── */}
			<div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
				<div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
					<Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
					<input
						type="text"
						placeholder="Search by name or email..."
						value={search}
						onChange={handleSearch}
						style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '0.88rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
					/>
				</div>
				<button onClick={() => { setSearch(''); setPage(1); }} style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
					<RefreshCw size={14} /> Reset
				</button>
			</div>

			{/* ── Table ── */}
			<div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
				<div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
						<Gift size={16} color="#d97706" /> Referral Relationships
					</div>
					<span style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.2)', color: '#0d9488', fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
						{total} total
					</span>
				</div>

				{loading ? (
					<div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
						<Loader2 className="animate-spin" size={28} color="#d97706" />
					</div>
				) : referrals.length === 0 ? (
					<div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
						<Gift size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
						<p style={{ fontWeight: 600, marginBottom: 4 }}>No referrals found</p>
						<p style={{ fontSize: '0.82rem' }}>When users sign up through referral links, they'll appear here</p>
					</div>
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f8fafc' }}>
									{['Referred User', 'Referred By', 'Referral Code', 'Joined', 'Status'].map(h => (
										<th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{referrals.map((ref, i) => (
									<tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}
										onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
										onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
									>
										<td style={{ padding: '13px 16px' }}>
											<div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{ref.name || '—'}</div>
											<div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 2 }}>{ref.email}</div>
										</td>
										<td style={{ padding: '13px 16px' }}>
											{ref.referrer?.name || ref.referrer?.email ? (
												<div>
													<div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{ref.referrer.name || '—'}</div>
													<div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 2 }}>{ref.referrer.email}</div>
												</div>
											) : <span style={{ color: '#cbd5e1' }}>—</span>}
										</td>
										<td style={{ padding: '13px 16px' }}>
											<span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem', color: '#d97706', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', padding: '3px 10px', borderRadius: 8 }}>
												{ref.referred_by || '—'}
											</span>
										</td>
										<td style={{ padding: '13px 16px', fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
											{fmtDate(ref.created_at)}
										</td>
										<td style={{ padding: '13px 16px' }}>
											{ref.email_verified ? (
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
													<CheckCircle2 size={10} /> Verified
												</span>
											) : (
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', color: '#d97706', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
													<Clock size={10} /> Pending
												</span>
											)}
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
						<span style={{ color: '#64748b', fontSize: '0.82rem' }}>Page {page} of {totalPages}</span>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
								style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>
								<ChevronLeft size={16} />
							</button>
							<button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
								style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminReferralsPage;
