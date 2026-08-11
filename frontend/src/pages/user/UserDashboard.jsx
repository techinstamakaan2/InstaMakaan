import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
	Copy, Check, Gift, Users, Share2, LogOut, Home,
	CheckCircle2, Clock, Loader2, IndianRupee, Bookmark,
	Building2, MapPin, ExternalLink, X, ChevronRight,
	Sparkles, ArrowUpRight, Mail, Phone, CalendarDays,
	FileText, Wrench, MessageSquare, AlertCircle,
	TrendingUp, Shield, Zap, LayoutDashboard,
	UserCircle2, Lock, BadgeCheck
} from 'lucide-react';
import { toast } from 'sonner';

const APP_URL  = process.env.REACT_APP_FRONTEND_URL || 'https://instamakaann.vercel.app';
const API_BASE = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
const fmt  = (n) => Number(n || 0).toLocaleString('en-IN');
const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
/* Resolve relative image URLs — handles string, {url:string}, or null */
const resolveImg = (raw) => {
	if (!raw) return null;
	const url = typeof raw === 'object' ? (raw.url || null) : raw;
	if (!url || typeof url !== 'string') return null;
	if (url.startsWith('http') || url.startsWith('//')) return url;
	return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const VS = {
	pending:   { label:'Pending',   bg:'#fff7ed', border:'#fed7aa', text:'#c2410c' },
	confirmed: { label:'Confirmed', bg:'#f0fdf4', border:'#bbf7d0', text:'#15803d' },
	completed: { label:'Completed', bg:'#f8fafc', border:'#e2e8f0', text:'#475569' },
	cancelled: { label:'Cancelled', bg:'#fef2f2', border:'#fecaca', text:'#dc2626' },
};

export default function UserDashboard() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [tab, setTab]           = useState('overview');
	const [stats, setStats]       = useState(null);
	const [history, setHistory]   = useState([]);
	const [saved, setSaved]       = useState([]);
	const [visits, setVisits]     = useState([]);
	const [copied, setCopied]     = useState(false);
	const [ld, setLd]             = useState({ s:true, h:true, sv:true, v:true });
	const [modal, setModal]       = useState(false);
	const [mReason, setMReason]   = useState('');
	const [mMsg, setMMsg]         = useState('');
	const [mSending, setMSending] = useState(false);

	/* profile state */
	const [profile, setProfile]     = useState(null);
	const [pEdit, setPEdit]         = useState(false);
	const [pForm, setPForm]         = useState({});
	const [pSaving, setPSaving]     = useState(false);

	const refLink = stats?.referral_code ? `${APP_URL}/auth/register?ref=${stats.referral_code}` : '';
	const name    = stats?.name || user?.name || user?.email?.split('@')[0] || 'User';
	const initial = name[0]?.toUpperCase() || 'U';
	const lset    = (k,v) => setLd(p=>({...p,[k]:v}));
	const greeting = (()=>{ const h=new Date().getHours(); return h<12?'Good morning':h<17?'Good afternoon':'Good evening'; })();

	const load = useCallback(async () => {
		try { const r = await api.get('/referrals/my-stats');   setStats(r.data); }     catch {} finally { lset('s', false); }
		try { const r = await api.get('/referrals/history');    setHistory(r.data.referrals||[]); } catch {} finally { lset('h', false); }
		try { const r = await api.get('/users/me/saved');       setSaved(r.data.saved_properties||[]); } catch {} finally { lset('sv', false); }
		try { const r = await api.get('/users/me/visits');      setVisits(r.data.visits||[]); } catch {} finally { lset('v', false); }
		try { const r = await api.get('/users/me/profile');     setProfile(r.data); setPForm(r.data||{}); } catch {}
	}, []);

	/* Wait for auth to be ready — on page refresh, _memToken is set asynchronously
	   by AuthContext after /auth/me resolves. Running load() before that causes
	   all API calls to fail with 401 silently, leaving saved/visits/etc. empty. */
	useEffect(() => { if (user) load(); }, [user, load]);

	const copy = () => {
		if (!refLink) return;
		navigator.clipboard.writeText(refLink).then(() => { setCopied(true); toast.success('Copied!'); setTimeout(()=>setCopied(false),2000); });
	};
	const share = async () => {
		if (navigator.share && refLink) { try { await navigator.share({ title:'Join InstaMakaan', url: refLink }); return; } catch {} }
		copy();
	};
	const unsave = async (id) => {
		try { await api.post(`/users/me/saved/${id}`); setSaved(p=>p.filter(x=>(x.id||x._id)!==id)); toast.success('Removed'); } catch { toast.error('Failed'); }
	};
	const cancelVisit = async (id) => {
		try { await api.patch(`/users/me/visits/${id}/cancel`); setVisits(p=>p.map(v=>v.id===id?{...v,status:'cancelled'}:v)); toast.success('Visit cancelled'); } catch { toast.error('Failed'); }
	};
	const sendMsg = async () => {
		if (!mReason || !mMsg.trim()) { toast.error('Fill all fields'); return; }
		setMSending(true);
		try { await api.post('/inquiries/', { name, phone: user?.phone||'', requirement:`[${mReason}] ${mMsg}`, message: mMsg, inquiry_type:'support' }); toast.success('Sent!'); setModal(false); setMReason(''); setMMsg(''); }
		catch { toast.error('Failed to send'); } finally { setMSending(false); }
	};
	const doLogout = async () => { await logout(); navigate('/', { replace:true }); };

	const saveProfile = async () => {
		setPSaving(true);
		try {
			const r = await api.patch('/users/me/profile', pForm);
			setProfile(r.data); setPForm(r.data||{}); setPEdit(false);
			toast.success('Profile updated!');
		} catch { toast.error('Failed to save'); } finally { setPSaving(false); }
	};

	/* Profile completion calculation */
	const profileFields = [
		{ key:'name',            label:'Full Name',         done: !!(profile?.name) },
		{ key:'email',           label:'Email Address',     done: !!(profile?.email) },
		{ key:'phone',           label:'Phone Number',      done: !!(profile?.phone || user?.phone) },
		{ key:'email_verified',  label:'Email Verified',    done: !!(profile?.email_verified) },
		{ key:'dob',             label:'Date of Birth',     done: !!(profile?.dob) },
		{ key:'gender',          label:'Gender',            done: !!(profile?.gender) },
		{ key:'pan_number',      label:'PAN Card',          done: !!(profile?.pan_number) },
		{ key:'aadhaar_last4',   label:'Aadhaar (last 4)', done: !!(profile?.aadhaar_last4) },
		{ key:'emergency_name',  label:'Emergency Contact', done: !!(profile?.emergency_name) },
		{ key:'address',         label:'Current Address',   done: !!(profile?.address) },
	];
	const completedCount = profileFields.filter(f=>f.done).length;
	const completionPct  = Math.round((completedCount / profileFields.length) * 100);
	const ringColor      = completionPct >= 80 ? '#22c55e' : completionPct >= 50 ? '#f59e0b' : '#ef4444';
	const CIRC           = 2 * Math.PI * 36; // r=36

	const TABS = [
		{ id:'overview',     label:'Overview',        icon:<LayoutDashboard size={13}/> },
		{ id:'profile',      label:'My Profile',      icon:<UserCircle2 size={13}/> },
		{ id:'property',     label:'My Property',     icon:<Building2 size={13}/> },
		{ id:'visits',       label:`Visits${visits.length?' ('+visits.length+')':''}`, icon:<CalendarDays size={13}/> },
		{ id:'applications', label:'Applications',    icon:<FileText size={13}/> },
		{ id:'saved',        label:`Saved${saved.length?' ('+saved.length+')':''}`, icon:<Bookmark size={13}/> },
		{ id:'referrals',    label:'Referrals',       icon:<Gift size={13}/> },
	];

	/* ── RENDER ── */
	return (
		<div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>

			{/* ─── TOP NAV ─── */}
			<nav className="dash-top-nav" style={{background:'#fff', borderBottom:'1px solid #e2e8f0', height:58, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(0,0,0,0.05)'}}>
				<Link to="/" style={{textDecoration:'none', fontWeight:900, fontSize:'1.25rem', display:'flex', gap:1}}>
					<span style={{color:'#0d9488'}}>Insta</span><span style={{color:'#f59e0b'}}>Makaan</span>
				</Link>
				<div style={{display:'flex', alignItems:'center', gap:6}}>
					<Link to="/" className="dash-nav-link" style={{display:'flex',alignItems:'center',gap:5,color:'#64748b',fontSize:'0.8rem',fontWeight:600,textDecoration:'none',padding:'7px 13px',borderRadius:10,border:'1px solid #e2e8f0',background:'#fafafa',transition:'all 0.15s'}}><Home size={13}/><span className="dash-nav-text">Home</span></Link>
					<Link to="/all-properties" className="dash-nav-link" style={{display:'flex',alignItems:'center',gap:5,color:'#64748b',fontSize:'0.8rem',fontWeight:600,textDecoration:'none',padding:'7px 13px',borderRadius:10,border:'1px solid #e2e8f0',background:'#fafafa'}}><Building2 size={13}/><span className="dash-nav-text">Properties</span></Link>
					<button onClick={doLogout} style={{display:'flex',alignItems:'center',gap:5,color:'#ef4444',fontSize:'0.8rem',fontWeight:700,padding:'7px 13px',borderRadius:10,border:'1px solid #fecaca',background:'#fef2f2',cursor:'pointer'}}><LogOut size={13}/><span className="dash-nav-text">Sign Out</span></button>
				</div>
			</nav>

			{/* ─── PROFILE BANNER ─── */}
			<div style={{background:'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)', padding:'0 0 0 0', position:'relative', overflow:'hidden'}}>
				{/* decorative circles */}
				<div style={{position:'absolute',top:-80,right:-80,width:320,height:320,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none'}}/>
				<div style={{position:'absolute',bottom:-60,left:-60,width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none'}}/>
				<div style={{position:'absolute',top:20,right:200,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none'}}/>

				<div className="hero-inner" style={{maxWidth:980,margin:'0 auto',padding:'32px 20px 0',position:'relative',zIndex:2}}>
					{/* Profile row */}
					<div style={{display:'flex',alignItems:'flex-start',gap:20,flexWrap:'wrap',marginBottom:28}}>
						{/* Avatar */}
						<div style={{width:84,height:84,borderRadius:'50%',background:'rgba(255,255,255,0.15)',border:'3px solid rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',fontWeight:900,color:'#fff',flexShrink:0,backdropFilter:'blur(10px)'}}>
							{initial}
						</div>
						{/* Info */}
						<div style={{flex:1,minWidth:0}}>
							<div style={{display:'flex',alignItems:'center',gap:6,color:'rgba(255,255,255,0.6)',fontSize:'0.78rem',fontWeight:600,marginBottom:4}}><Sparkles size={11}/>{greeting}</div>
							<div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:8}}>
								<h1 style={{margin:0,fontSize:'clamp(1.3rem,4vw,1.9rem)',fontWeight:900,color:'#fff',letterSpacing:'-0.02em'}}>{name}</h1>
								<span style={{display:'inline-flex',alignItems:'center',gap:5,background:'rgba(34,197,94,0.18)',border:'1px solid rgba(134,239,172,0.4)',color:'#fff',fontSize:'0.68rem',fontWeight:800,padding:'4px 12px',borderRadius:999,letterSpacing:'0.03em',backdropFilter:'blur(6px)'}}><BadgeCheck size={11}/>Verified Customer</span>
							</div>
							<div style={{display:'flex',gap:18,flexWrap:'wrap'}}>
								{stats?.email && <span style={{display:'inline-flex',alignItems:'center',gap:5,color:'rgba(255,255,255,0.7)',fontSize:'0.8rem'}}><Mail size={12}/>{stats.email}</span>}
								{user?.phone  && <span style={{display:'inline-flex',alignItems:'center',gap:5,color:'rgba(255,255,255,0.7)',fontSize:'0.8rem'}}><Phone size={12}/>{user.phone}</span>}
							</div>
						</div>
						{/* Referral Code pill */}
						{stats?.referral_code && (
							<div style={{background:'rgba(255,255,255,0.12)',border:'1.5px solid rgba(255,255,255,0.25)',borderRadius:20,padding:'14px 20px',backdropFilter:'blur(10px)',flexShrink:0}}>
								<div style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.55)',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:4}}>Your Referral Code</div>
								<div style={{fontFamily:'monospace',fontWeight:900,fontSize:'1.4rem',color:'#fff',letterSpacing:5}}>{stats.referral_code}</div>
								<button onClick={copy} style={{display:'inline-flex',alignItems:'center',gap:5,marginTop:8,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,padding:'5px 14px',cursor:'pointer',color:'#fff',fontSize:'0.72rem',fontWeight:700}}>
									{copied?<><Check size={11}/>Copied!</>:<><Copy size={11}/>Copy Link</>}
								</button>
							</div>
						)}
					</div>

					{/* Stat strip */}
					<div className="stat-strip" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',borderTop:'1px solid rgba(255,255,255,0.12)'}}>
						{ld.s
							? <div style={{gridColumn:'1/-1',padding:'20px 0',display:'flex',justifyContent:'center'}}><Loader2 size={22} className="animate-spin" color="rgba(255,255,255,0.5)"/></div>
							: [
								{l:'Visits',    v:visits.length,                   ic:<CalendarDays size={15}/>, acc:'#fef3c7'},
								{l:'Referrals', v:stats?.referral_count??0,         ic:<Users size={15}/>,        acc:'#dbeafe'},
								{l:'Verified',  v:stats?.verified_count??0,         ic:<CheckCircle2 size={15}/>, acc:'#d1fae5'},
								{l:'Saved',     v:saved.length,                    ic:<Bookmark size={15}/>,    acc:'#fce7f3'},
								{l:'Wallet',    v:`₹${fmt(stats?.wallet_balance)}`, ic:<IndianRupee size={15}/>, acc:'#ede9fe'},
							].map(s=>(
								<div key={s.l} style={{padding:'18px 12px',textAlign:'center',borderRight:'1px solid rgba(255,255,255,0.1)'}}>
									<div style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',border:'1px solid rgba(255,255,255,0.2)'}}>{React.cloneElement(s.ic,{color:'#fff'})}</div>
									<div style={{fontSize:'1.35rem',fontWeight:900,color:'#fff',lineHeight:1,marginBottom:4}}>{s.v}</div>
									<div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.55)',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700}}>{s.l}</div>
								</div>
							))
						}
					</div>
				</div>
			</div>

			{/* ─── MAIN BODY ─── */}
			<div className="body-inner" style={{maxWidth:980,margin:'0 auto',padding:'28px 16px'}}>

				{/* TABS */}
				<div style={{display:'flex',gap:3,marginBottom:24,background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:16,padding:'5px',boxShadow:'0 1px 6px rgba(0,0,0,0.05)',overflowX:'auto',scrollbarWidth:'none'}}>
					{TABS.map(t=>(
						<button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:6,flex:1,padding:'9px 12px',borderRadius:11,border:'none',fontSize:'0.8rem',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',minWidth:86,justifyContent:'center',transition:'all 0.2s',
							background: tab===t.id ? 'linear-gradient(135deg,#0d9488,#0f766e)' : 'none',
							color: tab===t.id ? '#fff' : '#64748b',
							boxShadow: tab===t.id ? '0 3px 12px rgba(13,148,136,0.3)' : 'none',
						}}>{t.icon}{t.label}</button>
					))}
				</div>

				{/* ══════ OVERVIEW ══════ */}
				{tab==='overview' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						{/* Quick Actions */}
						<SectionCard title="Quick Actions" icon={<Zap size={15} color="#f59e0b"/>}>
							<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(195px,1fr))',gap:10}}>
								{[
									{label:'Browse Properties', sub:'Find your next home',          icon:<Building2 size={19}/>,    color:'#0d9488', to:'/all-properties', isLink:true},
									{label:'Schedule a Visit',  sub:'Book a free site visit',       icon:<CalendarDays size={19}/>, color:'#3b82f6', action:()=>setTab('visits')},
									{label:'My Saved',          sub:`${saved.length} saved`,        icon:<Bookmark size={19}/>,    color:'#f59e0b', action:()=>setTab('saved')},
									{label:'My Property',       sub:'View your rented flat',        icon:<Shield size={19}/>,      color:'#22c55e', action:()=>setTab('property')},
									{label:'Earn Rewards',      sub:'Refer & earn ₹25,000',         icon:<Gift size={19}/>,        color:'#a855f7', action:()=>setTab('referrals')},
									{label:'Contact Support',   sub:'Raise an issue or query',      icon:<MessageSquare size={19}/>,color:'#ef4444', action:()=>setModal(true)},
								].map(item=>(
									item.isLink
										? <Link key={item.label} to={item.to} style={qaStyle(item.color)}>
											<div style={qaIco(item.color)}>{React.cloneElement(item.icon,{color:item.color})}</div>
											<div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:'0.87rem',color:'#0f172a'}}>{item.label}</div><div style={{fontSize:'0.72rem',color:'#94a3b8',marginTop:2}}>{item.sub}</div></div>
											<ArrowUpRight size={14} color="#cbd5e1"/>
										</Link>
										: <button key={item.label} onClick={item.action} style={{...qaStyle(item.color),width:'100%',textAlign:'left',cursor:'pointer'}}>
											<div style={qaIco(item.color)}>{React.cloneElement(item.icon,{color:item.color})}</div>
											<div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:'0.87rem',color:'#0f172a'}}>{item.label}</div><div style={{fontSize:'0.72rem',color:'#94a3b8',marginTop:2}}>{item.sub}</div></div>
											<ArrowUpRight size={14} color="#cbd5e1"/>
										</button>
								))}
							</div>
						</SectionCard>

						<div className="resp-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginTop:18}}>
							{/* Wallet */}
							<div style={{background:'linear-gradient(135deg,#0f766e,#0d9488,#14b8a6)',borderRadius:20,padding:24,position:'relative',overflow:'hidden',border:'none'}}>
								<div style={{position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.08)',pointerEvents:'none'}}/>
								<div style={{position:'absolute',bottom:-20,left:-20,width:90,height:90,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none'}}/>
								<div style={{position:'relative',zIndex:1}}>
									<div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20}}>
										<div>
											<div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.55)',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:6}}>Wallet Balance</div>
											<div style={{fontSize:'2.3rem',fontWeight:900,color:'#fff',lineHeight:1}}>₹{fmt(stats?.wallet_balance)}</div>
											<div style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.5)',marginTop:6}}>Available for bookings &amp; services</div>
										</div>
										<div style={{width:52,height:52,borderRadius:16,background:'rgba(255,255,255,0.15)',border:'1.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}><IndianRupee size={24} color="#fff"/></div>
									</div>
									<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
										<div style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'11px 14px',border:'1px solid rgba(255,255,255,0.15)'}}>
											<div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.07em'}}>Rent Bonus</div>
											<div style={{fontWeight:900,fontSize:'1.2rem',color:'#fff',marginTop:3}}>₹2,000</div>
										</div>
										<div style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'11px 14px',border:'1px solid rgba(255,255,255,0.15)'}}>
											<div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.07em'}}>Buy Bonus</div>
											<div style={{fontWeight:900,fontSize:'1.2rem',color:'#fff',marginTop:3}}>₹25,000</div>
										</div>
									</div>
								</div>
							</div>

							{/* Upcoming visit */}
							<SectionCard title="Upcoming Visit" icon={<CalendarDays size={14} color="#3b82f6"/>} noPad>
								{ld.v ? <Spin color="#3b82f6"/>
									: (()=>{
										const up = visits.filter(v=>v.status==='pending'||v.status==='confirmed');
										return up.length===0
											? <Empty icon={<CalendarDays size={32} color="#bfdbfe"/>} msg="No upcoming visits" cta={<Link to="/all-properties" style={linkBtn('#3b82f6')}>Browse & Book</Link>}/>
											: <div style={{padding:'0 4px'}}>
												<div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
													{resolveImg(up[0].property_image)
														? <img src={resolveImg(up[0].property_image)} alt="" style={{width:64,height:64,borderRadius:10,objectFit:'cover',flexShrink:0}} onError={e=>{e.currentTarget.style.display='none';}}/>
														: <PlaceholderImg size={64}/>}
													<div>
														<div style={{fontWeight:700,fontSize:'0.9rem',color:'#0f172a',marginBottom:4}}>{up[0].property_title}</div>
														{up[0].property_location && <div style={{fontSize:'0.73rem',color:'#64748b',display:'flex',alignItems:'center',gap:3,marginBottom:6}}><MapPin size={10} color="#0d9488"/>{up[0].property_location}</div>}
														<div style={{fontSize:'0.79rem',color:'#0d9488',fontWeight:700,marginBottom:6}}>📅 {fmtD(up[0].visit_date)} · {up[0].visit_time}</div>
														<span style={statusBadge(VS[up[0].status])}>{VS[up[0].status]?.label}</span>
													</div>
												</div>
												{up.length>1 && <div style={{marginTop:12,fontSize:'0.75rem',color:'#64748b',textAlign:'center'}}><button onClick={()=>setTab('visits')} style={{color:'#0d9488',fontWeight:700,background:'none',border:'none',cursor:'pointer'}}>+{up.length-1} more visit{up.length>2?'s':''}</button></div>}
											</div>;
									})()
								}
							</SectionCard>

							{/* Referral mini */}
							<SectionCard title="Referral Overview" icon={<Gift size={14} color="#a855f7"/>}>
								<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
									{[{l:'Total',v:stats?.referral_count??0,c:'#a855f7'},{l:'Verified',v:stats?.verified_count??0,c:'#22c55e'},{l:'Pending',v:stats?.pending_count??0,c:'#f59e0b'}].map(s=>(
										<div key={s.l} style={{textAlign:'center',background:`${s.c}0d`,border:`1.5px solid ${s.c}22`,borderRadius:12,padding:'12px 6px'}}>
											<div style={{fontWeight:900,fontSize:'1.4rem',color:s.c}}>{s.v}</div>
											<div style={{fontSize:'0.63rem',color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:3}}>{s.l}</div>
										</div>
									))}
								</div>
								<button onClick={()=>setTab('referrals')} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',border:'1.5px solid #e9d5ff',borderRadius:12,background:'#faf5ff',color:'#7c3aed',fontSize:'0.82rem',fontWeight:700,cursor:'pointer'}}>
									View Full Referral Program <ChevronRight size={13}/>
								</button>
							</SectionCard>

							{/* Saved mini */}
							<SectionCard title="Recently Saved" icon={<Bookmark size={14} color="#f59e0b"/>}>
								{ld.sv ? <Spin color="#f59e0b"/>
									: saved.length===0
										? <Empty icon={<Bookmark size={32} color="#fde68a"/>} msg="Nothing saved yet" cta={<Link to="/all-properties" style={linkBtn('#f59e0b')}>Browse Properties</Link>}/>
										: <>
											{saved.slice(0,3).map(p=>(
												<Link key={p.id||p._id} to={`/property/${p.id}`} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid #f8fafc',textDecoration:'none'}}>
													{resolveImg(p.images?.[0])
														? <img src={resolveImg(p.images[0])} alt="" style={{width:40,height:40,borderRadius:8,objectFit:'cover',flexShrink:0}} onError={e=>{e.currentTarget.style.display='none';}}/>
														: <PlaceholderImg size={40}/>}
													<div style={{flex:1,minWidth:0}}>
														<div style={{fontWeight:600,fontSize:'0.83rem',color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.title||'Property'}</div>
														{p.location&&<div style={{fontSize:'0.71rem',color:'#94a3b8'}}>{p.location}</div>}
													</div>
													<ChevronRight size={13} color="#cbd5e1"/>
												</Link>
											))}
											{saved.length>3&&<button onClick={()=>setTab('saved')} style={{width:'100%',marginTop:10,padding:'8px',border:'1px solid #e2e8f0',borderRadius:10,background:'#fafafa',color:'#0d9488',fontSize:'0.8rem',fontWeight:700,cursor:'pointer'}}>See all {saved.length} →</button>}
										</>
								}
							</SectionCard>
						</div>

						{/* Profile Completion mini-card */}
						{completionPct < 100 && (
							<div style={{marginTop:18,background:'linear-gradient(135deg,#fffbeb,#fef3c7)',border:'1.5px solid #fcd34d',borderRadius:20,padding:'18px 22px',display:'flex',alignItems:'center',gap:18,flexWrap:'wrap'}}>
								<svg width={88} height={88} viewBox="0 0 88 88">
									<circle cx={44} cy={44} r={36} fill="none" stroke="#fde68a" strokeWidth={7}/>
									<circle cx={44} cy={44} r={36} fill="none" stroke={ringColor} strokeWidth={7}
										strokeDasharray={CIRC} strokeDashoffset={CIRC - (completionPct/100)*CIRC}
										strokeLinecap="round" transform="rotate(-90 44 44)" style={{transition:'stroke-dashoffset 0.6s ease'}}/>
									<text x={44} y={44} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={900} fill={ringColor}>{completionPct}%</text>
								</svg>
								<div style={{flex:1,minWidth:200}}>
									<div style={{fontWeight:800,fontSize:'0.95rem',color:'#92400e',marginBottom:4}}>Complete your profile — {completionPct}% done</div>
									<div style={{fontSize:'0.8rem',color:'#b45309',marginBottom:10,lineHeight:1.5}}>A complete profile helps us match you with the right properties faster. Missing: {profileFields.filter(f=>!f.done).map(f=>f.label).join(', ')}.</div>
									<button onClick={()=>setTab('profile')} style={{display:'inline-flex',alignItems:'center',gap:6,background:'#d97706',border:'none',borderRadius:10,padding:'8px 18px',color:'#fff',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',boxShadow:'0 3px 10px rgba(217,119,6,0.3)'}}>
										<UserCircle2 size={13}/>Complete Profile
									</button>
								</div>
								<div style={{display:'flex',flexDirection:'column',gap:6,minWidth:160}}>
									{profileFields.slice(0,5).map(f=>(
										<div key={f.key} style={{display:'flex',alignItems:'center',gap:7,fontSize:'0.75rem',color: f.done?'#15803d':'#92400e'}}>
											{f.done ? <Check size={12} color="#22c55e"/> : <div style={{width:12,height:12,borderRadius:'50%',border:'2px solid #fca5a5',flexShrink:0}}/>}
											{f.label}
										</div>
									))}
								</div>
							</div>
						)}

					</div>
				)}

				{/* ══════ PROFILE ══════ */}
				{tab==='profile' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						<div className="resp-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>

							{/* Completion ring card */}
							<div style={{background:'#fff',borderRadius:20,border:'1.5px solid #e2e8f0',boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
								<svg width={120} height={120} viewBox="0 0 120 120" style={{marginBottom:16}}>
									<circle cx={60} cy={60} r={50} fill="none" stroke="#f1f5f9" strokeWidth={9}/>
									<circle cx={60} cy={60} r={50} fill="none" stroke={ringColor} strokeWidth={9}
										strokeDasharray={2*Math.PI*50} strokeDashoffset={(2*Math.PI*50)-(completionPct/100)*(2*Math.PI*50)}
										strokeLinecap="round" transform="rotate(-90 60 60)" style={{transition:'stroke-dashoffset 0.8s ease'}}/>
									<text x={60} y={56} textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={900} fill={ringColor}>{completionPct}%</text>
									<text x={60} y={76} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fill="#94a3b8">COMPLETE</text>
								</svg>
								<h3 style={{margin:'0 0 6px',fontSize:'1rem',fontWeight:800,color:'#0f172a'}}>
									{completionPct===100 ? '🎉 Profile Complete!' : `${completedCount} of ${profileFields.length} fields done`}
								</h3>
								<p style={{fontSize:'0.78rem',color:'#64748b',margin:'0 0 16px',lineHeight:1.5,maxWidth:260}}>
									{completionPct===100 ? 'Your profile is fully complete. You get priority matching for properties!' : 'Fill in remaining details to get better property matches and unlock all features.'}
								</p>

								{/* Field checklist */}
								<div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
									{profileFields.map(f=>(
										<div key={f.key} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background: f.done?'#f0fdf4':'#fafafa',border:`1px solid ${f.done?'#86efac':'#e2e8f0'}`,borderRadius:10}}>
											{f.done
												? <div style={{width:22,height:22,borderRadius:'50%',background:'#22c55e',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Check size={12} color="#fff"/></div>
												: <div style={{width:22,height:22,borderRadius:'50%',border:'2px solid #fca5a5',background:'#fef2f2',flexShrink:0}}/>}
											<span style={{fontSize:'0.82rem',fontWeight:600,color: f.done?'#15803d':'#64748b',flex:1,textAlign:'left'}}>{f.label}</span>
											{!f.done && <span style={{fontSize:'0.68rem',color:'#f87171',fontWeight:700}}>Missing</span>}
										</div>
									))}
								</div>
							</div>

							{/* Edit form */}
							<div style={{background:'#fff',borderRadius:20,border:'1.5px solid #e2e8f0',boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
								<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
									<div style={{display:'flex',alignItems:'center',gap:8}}>
										<UserCircle2 size={15} color="#0d9488"/>
										<span style={{fontWeight:700,fontSize:'0.93rem',color:'#0f172a'}}>Profile Details</span>
									</div>
									{!pEdit
										? <button onClick={()=>setPEdit(true)} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',border:'1.5px solid #e2e8f0',borderRadius:10,background:'#fafafa',color:'#0d9488',fontWeight:700,fontSize:'0.8rem',cursor:'pointer'}}>✏️ Edit</button>
										: <div style={{display:'flex',gap:8}}>
											<button onClick={()=>{setPEdit(false);setPForm(profile||{});}} style={{padding:'7px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,background:'#fafafa',color:'#64748b',fontWeight:700,fontSize:'0.8rem',cursor:'pointer'}}>Cancel</button>
											<button onClick={saveProfile} disabled={pSaving} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',border:'none',borderRadius:10,background:'linear-gradient(135deg,#0d9488,#0f766e)',color:'#fff',fontWeight:700,fontSize:'0.8rem',cursor:'pointer',boxShadow:'0 3px 10px rgba(13,148,136,0.3)'}}>
												{pSaving?<><Loader2 size={12} className="animate-spin"/>Saving…</>:<><Check size={12}/>Save</>}
											</button>
										</div>
									}
								</div>

								<div style={{display:'flex',flexDirection:'column',gap:14}}>
									{[
										{ key:'name',           label:'Full Name',           type:'text',   placeholder:'Enter your full name',     icon:<UserCircle2 size={13}/> },
										{ key:'dob',            label:'Date of Birth',        type:'date',   placeholder:'',                         icon:<CalendarDays size={13}/> },
										{ key:'gender',         label:'Gender',               type:'select', options:['Male','Female','Other','Prefer not to say'], icon:<Users size={13}/> },
										{ key:'pan_number',     label:'PAN Card Number',      type:'text',   placeholder:'ABCDE1234F',               icon:<BadgeCheck size={13}/> },
										{ key:'aadhaar_last4',  label:'Aadhaar Last 4 Digits',type:'text',   placeholder:'XXXX',                    icon:<Lock size={13}/> },
										{ key:'emergency_name', label:'Emergency Contact Name',type:'text',  placeholder:'Contact person name',      icon:<Phone size={13}/> },
										{ key:'emergency_phone',label:'Emergency Contact Phone',type:'text', placeholder:'+91 XXXXX XXXXX',          icon:<Phone size={13}/> },
										{ key:'address',        label:'Current Address',       type:'textarea',placeholder:'Flat no, Street, City, Pin',icon:<MapPin size={13}/> },
									].map(field => {
										const val = pEdit ? (pForm[field.key]||'') : (profile?.[field.key]||'');
										const fieldStyle = {width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:'0.84rem',color:'#0f172a',outline:'none',background: pEdit?'#fff':'#fafafa',fontFamily:'inherit',resize:'none',boxSizing:'border-box'};
										return (
											<div key={field.key}>
												<label style={{fontSize:'0.72rem',fontWeight:700,color:'#475569',display:'flex',alignItems:'center',gap:5,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em'}}>
													{React.cloneElement(field.icon,{color:'#0d9488'})} {field.label}
													{profile?.[field.key] && <Check size={10} color="#22c55e"/>}
												</label>
												{field.type==='select'
													? <select value={val} disabled={!pEdit} onChange={e=>setPForm(p=>({...p,[field.key]:e.target.value}))} style={fieldStyle}>
														<option value="">Select…</option>
														{field.options.map(o=><option key={o} value={o}>{o}</option>)}
													</select>
													: field.type==='textarea'
														? <textarea value={val} disabled={!pEdit} placeholder={field.placeholder} rows={2} onChange={e=>setPForm(p=>({...p,[field.key]:e.target.value}))} style={fieldStyle}/>
														: <input type={field.type} value={val} disabled={!pEdit} placeholder={field.placeholder} onChange={e=>setPForm(p=>({...p,[field.key]:e.target.value}))} style={fieldStyle}/>
												}
											</div>
										);
									})}
								</div>

								{/* Read-only fields */}
								<div style={{marginTop:16,padding:'14px 16px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:12}}>
									<div style={{fontSize:'0.7rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>Auto-filled from your account</div>
									{[
										{l:'Email',   v:profile?.email||stats?.email||'—',  ic:<Mail size={12}/>},
										{l:'Phone',   v:profile?.phone||user?.phone||'—',   ic:<Phone size={12}/>},
										{l:'Status',  v:profile?.email_verified?'✅ Verified':'⏳ Pending', ic:<BadgeCheck size={12}/>},
									].map(f=>(
										<div key={f.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
											{React.cloneElement(f.ic,{color:'#94a3b8'})}
											<span style={{fontSize:'0.75rem',color:'#64748b',fontWeight:600,minWidth:52}}>{f.l}:</span>
											<span style={{fontSize:'0.78rem',color:'#0f172a',fontWeight:500}}>{f.v}</span>
										</div>
									))}
								</div>
							</div>

							{/* Privacy & Security card */}
							<div style={{gridColumn:'1/-1',background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'1.5px solid #86efac',borderRadius:20,padding:'22px 26px'}}>
								<div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
									<div style={{width:52,height:52,borderRadius:16,background:'#22c55e',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 14px rgba(34,197,94,0.3)'}}>
										<Lock size={24} color="#fff"/>
									</div>
									<div style={{flex:1,minWidth:260}}>
										<div style={{fontWeight:800,fontSize:'0.97rem',color:'#15803d',marginBottom:6,display:'flex',alignItems:'center',gap:8}}>
											🔒 Your Data is Safe with Us
										</div>
										<div style={{fontSize:'0.82rem',color:'#166534',lineHeight:1.7}}>
											All your personal information — including PAN, Aadhaar, and contact details — is encrypted and stored securely. We <strong>never</strong> share your data with third parties without your consent. Your privacy is our highest priority.
										</div>
										<div style={{display:'flex',gap:14,marginTop:14,flexWrap:'wrap'}}>
											{[
												'🔐 End-to-end encrypted',
												'🚫 Never sold to third parties',
												'📋 Used only for property matching',
												'🗑️ Delete anytime on request',
											].map(t=>(
												<span key={t} style={{display:'inline-flex',alignItems:'center',gap:5,background:'rgba(34,197,94,0.12)',border:'1px solid #86efac',borderRadius:20,padding:'4px 12px',fontSize:'0.73rem',fontWeight:700,color:'#15803d'}}>{t}</span>
											))}
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				)}

				{/* ══════ MY PROPERTY ══════ */}
				{tab==='property' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						<SectionCard title="My Assigned Property" icon={<Building2 size={14} color="#22c55e"/>}>
							<div style={{textAlign:'center',padding:'28px 0'}}>
								<div style={{width:90,height:90,borderRadius:28,background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'2px solid #86efac',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}><Building2 size={42} color="#22c55e"/></div>
								<h3 style={{margin:'0 0 8px',fontSize:'1.1rem',fontWeight:800,color:'#0f172a'}}>No Property Assigned Yet</h3>
								<p style={{color:'#64748b',fontSize:'0.86rem',margin:'0 0 12px',maxWidth:380,marginInline:'auto',lineHeight:1.6}}>Once you confirm a rental with us, your assigned flat appears here with photos, rent details, landlord contact &amp; more.</p>
								<div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:12,padding:'11px 18px',display:'inline-block',fontSize:'0.8rem',color:'#16a34a',marginBottom:20}}>
									Call us: <strong>+91 98765 43210</strong>
								</div><br/>
								<Link to="/all-properties" style={{...primaryBtn('#16a34a','#15803d')}}><Building2 size={14}/>Browse Properties</Link>
							</div>
						</SectionCard>

						<SectionCard title="Raise an Issue / Contact" icon={<MessageSquare size={14} color="#ef4444"/>} style={{marginTop:18}}>
								{[
									{l:'Report Maintenance Issue', i:<Wrench size={13}/>,       c:'#f59e0b', r:'Maintenance Issue'},
									{l:'Rent Payment Query',       i:<IndianRupee size={13}/>,  c:'#22c55e', r:'Rent Payment Query'},
									{l:'Noise / Disturbance',      i:<AlertCircle size={13}/>,  c:'#ef4444', r:'Noise / Disturbance'},
									{l:'Early Exit Notice',        i:<LogOut size={13}/>,       c:'#a855f7', r:'Early Exit Notice'},
									{l:'Visit Enquiry',            i:<CalendarDays size={13}/>, c:'#3b82f6', r:'Visit Query'},
									{l:'General Query',            i:<MessageSquare size={13}/>,c:'#0d9488', r:'General Query'},
								].map(item=>(
									<button key={item.r} onClick={()=>{setMReason(item.r);setModal(true);}} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 13px',borderRadius:13,border:`1.5px solid ${item.c}18`,background:'#fafafa',cursor:'pointer',width:'100%',marginBottom:8,transition:'all 0.18s'}}>
										<div style={{width:30,height:30,borderRadius:9,background:`${item.c}10`,border:`1px solid ${item.c}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{React.cloneElement(item.i,{color:item.c})}</div>
										<span style={{fontWeight:600,fontSize:'0.84rem',color:'#0f172a',flex:1,textAlign:'left'}}>{item.l}</span>
										<ChevronRight size={13} color="#cbd5e1"/>
									</button>
								))}
							</SectionCard>
						</div>
					)}

				{/* ══════ VISITS ══════ */}
				{tab==='visits' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						<SectionCard title="Scheduled Visits" icon={<CalendarDays size={14} color="#3b82f6"/>} extra={<CountBadge n={visits.length} color="#3b82f6"/>}>
							{ld.v ? <Spin color="#3b82f6"/>
								: visits.length===0
									? <Empty icon={<CalendarDays size={40} color="#93c5fd"/>} msg="No visits scheduled" sub="Browse properties and book a free site visit" cta={<Link to="/all-properties" style={primaryBtn('#3b82f6','#2563eb')}><Building2 size={13}/>Browse Properties</Link>}/>
									: <div style={{display:'flex',flexDirection:'column',gap:12}}>
										{visits.map(v=>(
											<div key={v.id} style={{display:'flex',gap:14,alignItems:'flex-start',padding:16,background:'#fafafa',border:'1.5px solid #e2e8f0',borderRadius:16,transition:'all 0.2s'}}>
												{resolveImg(v.property_image)
													? <img src={resolveImg(v.property_image)} alt="" style={{width:72,height:72,borderRadius:12,objectFit:'cover',flexShrink:0}} onError={e=>{e.currentTarget.style.display='none';}}/>
													: <PlaceholderImg size={72}/>}
												<div style={{flex:1,minWidth:0}}>
													<div style={{fontWeight:700,fontSize:'0.92rem',color:'#0f172a',marginBottom:3}}>{v.property_title}</div>
													{v.property_location&&<div style={{fontSize:'0.73rem',color:'#64748b',display:'flex',alignItems:'center',gap:3,marginBottom:6}}><MapPin size={9} color="#0d9488"/>{v.property_location}</div>}
													<div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
														<span style={{fontSize:'0.8rem',color:'#0f766e',fontWeight:700}}>📅 {fmtD(v.visit_date)} · {v.visit_time}</span>
														<span style={statusBadge(VS[v.status])}>{VS[v.status]?.label}</span>
													</div>
													{v.admin_note&&<div style={{marginTop:6,fontSize:'0.73rem',color:'#475569',background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:'5px 10px'}}>📌 {v.admin_note}</div>}
												</div>
												{(v.status==='pending'||v.status==='confirmed')&&(
													<button onClick={()=>cancelVisit(v.id)} style={{flexShrink:0,padding:'6px 13px',border:'1.5px solid #fecaca',background:'#fef2f2',borderRadius:10,color:'#ef4444',fontSize:'0.73rem',fontWeight:700,cursor:'pointer'}}>Cancel</button>
												)}
											</div>
										))}
									</div>
							}
						</SectionCard>

						<SectionCard title="Visit Summary" icon={<Zap size={14} color="#f59e0b"/>} style={{marginTop:18}}>
							<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
								{[{l:'Total',v:visits.length,c:'#0d9488'},{l:'Upcoming',v:visits.filter(v=>v.status==='pending'||v.status==='confirmed').length,c:'#3b82f6'},{l:'Completed',v:visits.filter(v=>v.status==='completed').length,c:'#22c55e'},{l:'Cancelled',v:visits.filter(v=>v.status==='cancelled').length,c:'#ef4444'}].map(s=>(
									<div key={s.l} style={{textAlign:'center',background:`${s.c}0d`,border:`1.5px solid ${s.c}22`,borderRadius:14,padding:'16px 10px'}}>
										<div style={{fontWeight:900,fontSize:'1.6rem',color:s.c,lineHeight:1}}>{s.v}</div>
										<div style={{fontSize:'0.63rem',color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:4}}>{s.l}</div>
									</div>
								))}
							</div>
						</SectionCard>
					</div>
				)}

				{/* ══════ APPLICATIONS ══════ */}
				{tab==='applications' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						<SectionCard title="My Applications" icon={<FileText size={14} color="#a855f7"/>}>
							<div style={{textAlign:'center',padding:'28px 0'}}>
								<div style={{width:90,height:90,borderRadius:28,background:'linear-gradient(135deg,#faf5ff,#ede9fe)',border:'2px solid #c4b5fd',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}><FileText size={42} color="#a855f7"/></div>
								<h3 style={{margin:'0 0 8px',fontSize:'1.05rem',fontWeight:800,color:'#0f172a'}}>Application Tracking — Coming Soon</h3>
								<p style={{color:'#64748b',fontSize:'0.84rem',margin:'0 0 20px',maxWidth:360,marginInline:'auto',lineHeight:1.6}}>Track all your rental &amp; buy applications with real-time status updates when you enquire about properties.</p>
								<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,maxWidth:360,margin:'0 auto 20px'}}>
									{[{l:'Applied',c:'#a855f7'},{l:'Reviewing',c:'#3b82f6'},{l:'Approved',c:'#22c55e'},{l:'Rejected',c:'#ef4444'}].map(s=>(
										<div key={s.l} style={{textAlign:'center',background:`${s.c}0d`,border:`1.5px solid ${s.c}22`,borderRadius:12,padding:12}}>
											<div style={{fontWeight:900,fontSize:'1.4rem',color:s.c}}>—</div>
											<div style={{fontSize:'0.63rem',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:3}}>{s.l}</div>
										</div>
									))}
								</div>
								<Link to="/all-properties" style={primaryBtn('#a855f7','#9333ea')}><Building2 size={13}/>Browse Properties</Link>
							</div>
						</SectionCard>
					</div>
				)}

				{/* ══════ SAVED ══════ */}
				{tab==='saved' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						<SectionCard title="Saved Properties" icon={<Bookmark size={14} color="#f59e0b"/>} extra={<CountBadge n={saved.length} color="#f59e0b"/>}>
							{ld.sv ? <Spin color="#f59e0b"/>
								: saved.length===0
									? <Empty icon={<Bookmark size={40} color="#fde68a"/>} msg="No Saved Properties" sub="Tap the bookmark icon on any property card" cta={<Link to="/all-properties" style={primaryBtn('#f59e0b','#d97706')}><Building2 size={13}/>Browse Properties</Link>}/>
									: <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:14}}>
										{saved.map((p,i)=>{
											const imgSrc = resolveImg(p.images?.[0]);
											const price  = p.price?`₹${fmt(p.price)}`:p.rent?`₹${fmt(p.rent)}/mo`:'—';
											return (
												<div key={p.id||p._id||i} style={{background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:16,overflow:'hidden',transition:'all 0.22s',cursor:'pointer'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.1)';e.currentTarget.style.borderColor='#0d9488';}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='#e2e8f0';}}>
													<div style={{position:'relative',height:148,background:'#f1f5f9',overflow:'hidden'}}>
														{imgSrc?<img src={imgSrc} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextSibling.style.display='flex';}}/>:<></> }<div style={{width:'100%',height:'100%',display:imgSrc?'none':'flex',alignItems:'center',justifyContent:'center'}}><Building2 size={30} color="#94a3b8"/></div>
														<button onClick={e=>{e.stopPropagation();unsave(p.id||p._id);}} style={{position:'absolute',top:8,right:8,width:28,height:28,borderRadius:8,border:'none',background:'rgba(239,68,68,0.85)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',backdropFilter:'blur(4px)'}}><X size={11}/></button>
														{p.property_type&&<span style={{position:'absolute',bottom:8,left:8,background:'rgba(0,0,0,0.65)',color:'#fff',fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:6,textTransform:'uppercase',backdropFilter:'blur(4px)'}}>{p.property_type}</span>}
													</div>
													<div style={{padding:'12px 13px'}}>
														<div style={{fontWeight:700,fontSize:'0.86rem',color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3}}>{p.title||'Property'}</div>
														{p.location&&<div style={{display:'flex',alignItems:'center',gap:3,color:'#64748b',fontSize:'0.72rem',marginBottom:9}}><MapPin size={9} color="#0d9488"/>{p.location}</div>}
														<div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
															<span style={{fontWeight:800,fontSize:'0.9rem',color:'#0d9488'}}>{price}</span>
															{p.id&&<Link to={`/property/${p.id}`} onClick={e=>e.stopPropagation()} style={{display:'flex',alignItems:'center',gap:3,color:'#64748b',fontSize:'0.7rem',textDecoration:'none',padding:'4px 8px',borderRadius:7,background:'#f8fafc',border:'1px solid #e2e8f0'}}>View <ExternalLink size={9}/></Link>}
														</div>
													</div>
												</div>
											);
										})}
									</div>
							}
						</SectionCard>
					</div>
				)}

				{/* ══════ REFERRALS ══════ */}
				{tab==='referrals' && (
					<div style={{animation:'fadein 0.3s ease'}}>
						<div className="ref-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
							{/* Share card */}
							<div style={{background:'linear-gradient(135deg,#4c1d95,#5b21b6,#7c3aed)',borderRadius:20,padding:24,position:'relative',overflow:'hidden',border:'1.5px solid rgba(139,92,246,0.3)'}}>
								<div style={{position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none'}}/>
								<div style={{position:'absolute',bottom:-40,left:-40,width:140,height:140,borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none'}}/>
								<div style={{position:'relative',zIndex:1}}>
									<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
										<div style={{width:46,height:46,borderRadius:14,background:'rgba(255,255,255,0.15)',border:'1.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}><Gift size={22} color="#fff"/></div>
										<div><div style={{color:'#fff',fontWeight:800,fontSize:'1rem'}}>Refer &amp; Earn</div><div style={{color:'rgba(255,255,255,0.55)',fontSize:'0.75rem'}}>Share your code, earn rewards</div></div>
									</div>

									{stats?.referral_code&&(
										<div style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:14,padding:'12px 16px',marginBottom:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
											<span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.08em'}}>Your Code</span>
											<span style={{fontFamily:'monospace',fontWeight:900,fontSize:'1.4rem',color:'#fff',letterSpacing:5}}>{stats.referral_code}</span>
										</div>
									)}

									<div style={{display:'flex',gap:8,marginBottom:14}}>
										<div style={{flex:1,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'10px 14px',overflow:'hidden'}}>
											<div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Referral Link</div>
											<div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.7)',fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{refLink||'—'}</div>
										</div>
										<button onClick={copy} style={{width:46,height:46,borderRadius:12,background:copied?'rgba(34,197,94,0.2)':'rgba(255,255,255,0.12)',border:`1.5px solid ${copied?'rgba(34,197,94,0.4)':'rgba(255,255,255,0.2)'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',flexShrink:0}}>
											{copied?<Check size={15}/>:<Copy size={15}/>}
										</button>
									</div>

									<button onClick={share} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'rgba(255,255,255,0.18)',border:'1.5px solid rgba(255,255,255,0.25)',borderRadius:13,padding:13,color:'#fff',fontWeight:800,fontSize:'0.9rem',cursor:'pointer',backdropFilter:'blur(10px)'}}>
										<Share2 size={15}/>Share My Referral Link
									</button>

									<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:18}}>
										{[{l:'Total',v:stats?.referral_count??0},{l:'Verified',v:stats?.verified_count??0},{l:'Pending',v:stats?.pending_count??0}].map(s=>(
											<div key={s.l} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'12px 8px',textAlign:'center'}}>
												<div style={{fontWeight:900,fontSize:'1.4rem',color:'#fff'}}>{s.v}</div>
												<div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.45)',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:3}}>{s.l}</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Earnings tiers */}
							<SectionCard title="Earning Tiers" icon={<TrendingUp size={14} color="#22c55e"/>}>
								{[
									{type:'Registration Bonus',earn:'₹500',   icon:'👤',c:'#3b82f6',d:'Friend signs up & verifies email'},
									{type:'Rent Confirmation', earn:'₹2,000', icon:'🏠',c:'#22c55e',d:'Friend rents via your referral link'},
									{type:'Buy Confirmation',  earn:'₹25,000',icon:'🏢',c:'#a855f7',d:'Friend buys property via your link'},
								].map(t=>(
									<div key={t.type} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:`${t.c}0a`,border:`1.5px solid ${t.c}1a`,borderRadius:14,marginBottom:12}}>
										<span style={{fontSize:'1.6rem',lineHeight:1}}>{t.icon}</span>
										<div style={{flex:1}}>
											<div style={{fontWeight:700,fontSize:'0.87rem',color:'#0f172a'}}>{t.type}</div>
											<div style={{fontSize:'0.73rem',color:'#64748b',marginTop:2}}>{t.d}</div>
										</div>
										<div style={{fontWeight:900,fontSize:'1.1rem',color:t.c,whiteSpace:'nowrap'}}>{t.earn}</div>
									</div>
								))}
								<div style={{background:'linear-gradient(135deg,#fef3c7,#fde68a)',border:'1.5px solid #fcd34d',borderRadius:14,padding:'14px 16px',textAlign:'center',marginTop:4}}>
									<div style={{fontWeight:800,fontSize:'0.86rem',color:'#92400e'}}>🏆 Max you can earn per referral</div>
									<div style={{fontWeight:900,fontSize:'1.8rem',color:'#d97706',marginTop:4}}>₹25,000</div>
								</div>
							</SectionCard>

							{/* History table */}
							<div style={{gridColumn:'1/-1',background:'#fff',borderRadius:20,border:'1.5px solid #e2e8f0',boxShadow:'0 2px 12px rgba(0,0,0,0.04)',overflow:'hidden'}}>
								<div style={{padding:'18px 22px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:8}}>
									<Users size={14} color="#a855f7"/>
									<span style={{fontWeight:700,fontSize:'0.93rem',color:'#0f172a'}}>People You've Referred</span>
									<CountBadge n={history.length} color="#a855f7" style={{marginLeft:'auto'}}/>
								</div>
								{ld.h ? <Spin color="#a855f7"/>
									: history.length===0
										? <div style={{padding:'36px 24px',textAlign:'center'}}><Gift size={40} color="#e9d5ff" style={{marginBottom:10}}/><p style={{fontWeight:600,color:'#94a3b8',margin:'0 0 4px'}}>No referrals yet</p><p style={{color:'#cbd5e1',fontSize:'0.78rem',margin:0}}>Share your code to earn rewards</p></div>
										: <div style={{overflowX:'auto'}}>
											<table style={{width:'100%',borderCollapse:'collapse'}}>
												<thead><tr style={{background:'#fafafa'}}>{['Person','Joined','Email','Status'].map(h=><th key={h} style={{padding:'11px 18px',textAlign:'left',fontSize:'0.67rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.07em'}}>{h}</th>)}</tr></thead>
												<tbody>
													{history.map((r,i)=>(
														<tr key={i} style={{borderTop:'1px solid #f8fafc'}} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
															<td style={{padding:'12px 18px'}}>
																<div style={{display:'flex',alignItems:'center',gap:10}}>
																	<div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#0d9488,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'0.82rem',flexShrink:0}}>{(r.name||r.email||'U')[0].toUpperCase()}</div>
																	<div style={{fontWeight:600,fontSize:'0.85rem',color:'#0f172a'}}>{r.name||'—'}</div>
																</div>
															</td>
															<td style={{padding:'12px 18px',fontSize:'0.77rem',color:'#94a3b8',whiteSpace:'nowrap'}}>{fmtD(r.created_at)}</td>
															<td style={{padding:'12px 18px',fontSize:'0.77rem',color:'#94a3b8'}}>{r.email}</td>
															<td style={{padding:'12px 18px'}}>
																{r.email_verified
																	? <span style={{display:'inline-flex',alignItems:'center',gap:4,background:'#f0fdf4',border:'1px solid #86efac',color:'#16a34a',fontSize:'0.67rem',fontWeight:700,padding:'3px 10px',borderRadius:20}}><CheckCircle2 size={9}/>Verified · ₹500 earned</span>
																	: <span style={{display:'inline-flex',alignItems:'center',gap:4,background:'#fff7ed',border:'1px solid #fed7aa',color:'#c2410c',fontSize:'0.67rem',fontWeight:700,padding:'3px 10px',borderRadius:20}}><Clock size={9}/>Pending</span>}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
								}
							</div>
						</div>
					</div>
				)}

				<div style={{textAlign:'center',padding:'6px 0 40px',display:'flex',alignItems:'center',justifyContent:'center',gap:28}}>
					<Link to="/" style={{color:'#94a3b8',fontSize:'0.79rem',textDecoration:'none'}}>← Home</Link>
					<Link to="/all-properties" style={{color:'#0d9488',fontSize:'0.79rem',textDecoration:'none',fontWeight:700,display:'flex',alignItems:'center',gap:4}}>Browse Properties <ChevronRight size={12}/></Link>
				</div>
			</div>

			{/* ─── CONTACT MODAL ─── */}
			{modal && (
				<div style={{position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
					<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(6px)'}} onClick={()=>setModal(false)}/>
					<div style={{position:'relative',background:'#fff',borderRadius:24,padding:28,width:'100%',maxWidth:440,boxShadow:'0 24px 80px rgba(0,0,0,0.2)',zIndex:1}}>
						<button onClick={()=>setModal(false)} style={{position:'absolute',top:16,right:16,width:32,height:32,borderRadius:10,border:'1px solid #e2e8f0',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} color="#64748b"/></button>
						<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
							<div style={{width:44,height:44,borderRadius:14,background:'#f0fdf4',border:'1.5px solid #86efac',display:'flex',alignItems:'center',justifyContent:'center'}}><MessageSquare size={20} color="#0d9488"/></div>
							<div><h3 style={{margin:0,fontWeight:800,fontSize:'1rem',color:'#0f172a'}}>Contact Support</h3><p style={{margin:0,fontSize:'0.76rem',color:'#64748b'}}>We respond within 2 hours</p></div>
						</div>
						<label style={{fontSize:'0.77rem',fontWeight:700,color:'#475569',display:'block',marginBottom:6}}>Reason</label>
						<select value={mReason} onChange={e=>setMReason(e.target.value)} style={{width:'100%',padding:'11px 14px',border:'1.5px solid #e2e8f0',borderRadius:12,fontSize:'0.87rem',color:'#0f172a',outline:'none',background:'#fafafa',marginBottom:14}}>
							<option value="">Select a reason…</option>
							{['Maintenance Issue','Rent Payment Query','Noise / Disturbance','Early Exit Notice','Visit Query','Referral Issue','General Query'].map(r=><option key={r} value={r}>{r}</option>)}
						</select>
						<label style={{fontSize:'0.77rem',fontWeight:700,color:'#475569',display:'block',marginBottom:6}}>Message</label>
						<textarea value={mMsg} onChange={e=>setMMsg(e.target.value)} rows={4} placeholder="Describe your issue…" style={{width:'100%',padding:'11px 14px',border:'1.5px solid #e2e8f0',borderRadius:12,fontSize:'0.85rem',color:'#0f172a',outline:'none',resize:'none',fontFamily:'inherit',background:'#fafafa',boxSizing:'border-box',marginBottom:18}}/>
						<button onClick={sendMsg} disabled={mSending} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'linear-gradient(135deg,#0d9488,#0f766e)',border:'none',borderRadius:13,padding:'13px',color:'#fff',fontWeight:700,fontSize:'0.9rem',cursor:mSending?'not-allowed':'pointer',opacity:mSending?0.7:1,boxShadow:'0 4px 16px rgba(13,148,136,0.3)'}}>
							{mSending?<><Loader2 size={14} className="animate-spin"/>Sending…</>:<><Share2 size={14}/>Send Message</>}
						</button>
					</div>
				</div>
			)}

			<style>{`
				@keyframes fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
				.animate-spin { animation: spin 1s linear infinite; }
				@keyframes spin { to { transform: rotate(360deg); } }

				@media (max-width:768px) {
					.resp-grid  { grid-template-columns: 1fr !important; }
					.ref-grid   { grid-template-columns: 1fr !important; }
					.qa-grid    { grid-template-columns: 1fr 1fr !important; }
					.code-box   { width: 100% !important; box-sizing: border-box; }
					.stat-strip { grid-template-columns: repeat(3, 1fr) !important; }
					.stat-strip > div:nth-child(4),
					.stat-strip > div:nth-child(5) { border-top: 1px solid rgba(255,255,255,0.1); }
					.hero-inner { padding: 22px 16px 0 !important; }
					.body-inner { padding: 18px 12px !important; }
					.dash-nav-text { display: none; }
					.dash-nav-link { padding: 8px !important; border-radius: 9px !important; }
				}

				@media (max-width:500px) {
					.hero-inner { padding: 16px 12px 0 !important; }
					.body-inner { padding: 14px 10px !important; }
					.stat-strip {
						grid-template-columns: repeat(5, minmax(70px, 1fr)) !important;
						overflow-x: auto !important;
						-webkit-overflow-scrolling: touch;
						scrollbar-width: none;
					}
					.stat-strip::-webkit-scrollbar { display: none; }
					.prop-grid  { grid-template-columns: 1fr !important; }
					.qa-grid    { grid-template-columns: 1fr !important; }
				}

				/* Scrollbar hidden on tab bar */
				div::-webkit-scrollbar { display: none; }
			`}</style>
		</div>
	);
}

/* ── SMALL REUSABLE COMPONENTS ── */
function SectionCard({title,icon,children,extra,style={},noPad=false}){
	return (
		<div style={{background:'#fff',borderRadius:20,border:'1.5px solid #e2e8f0',boxShadow:'0 2px 12px rgba(0,0,0,0.04)',overflow:'hidden',...style}}>
			<div style={{display:'flex',alignItems:'center',gap:8,padding:'18px 22px 14px',borderBottom:'1px solid #f8fafc'}}>
				{icon}<span style={{fontWeight:700,fontSize:'0.93rem',color:'#0f172a',flex:1}}>{title}</span>{extra}
			</div>
			<div style={noPad?{}:{padding:'16px 22px'}}>{children}</div>
		</div>
	);
}
function Empty({icon,msg,sub,cta}){
	return <div style={{padding:'32px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center'}}>{icon}<p style={{fontWeight:700,fontSize:'0.95rem',color:'#334155',margin:'12px 0 4px'}}>{msg}</p>{sub&&<p style={{fontSize:'0.79rem',color:'#94a3b8',margin:'0 0 16px'}}>{sub}</p>}{cta}</div>;
}
function Spin({color='#0d9488'}){
	return <div style={{padding:32,display:'flex',justifyContent:'center'}}><Loader2 size={22} className="animate-spin" color={color}/></div>;
}
function PlaceholderImg({size}){
	return <div style={{width:size,height:size,borderRadius:size>50?12:8,background:'linear-gradient(135deg,#f1f5f9,#e2e8f0)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Building2 size={size*0.38} color="#94a3b8"/></div>;
}
function CountBadge({n,color,style={}}){
	return <span style={{display:'inline-flex',alignItems:'center',padding:'3px 12px',borderRadius:20,border:`1px solid ${color}44`,color,background:`${color}0d`,fontSize:'0.7rem',fontWeight:700,...style}}>{n} total</span>;
}
function statusBadge(vs){
	return {display:'inline-flex',alignItems:'center',gap:3,background:vs?.bg,border:`1px solid ${vs?.border}`,color:vs?.text,fontSize:'0.67rem',fontWeight:700,padding:'3px 10px',borderRadius:20};
}
function qaStyle(color){
	return {display:'flex',alignItems:'center',gap:12,padding:'12px 13px',borderRadius:14,border:'1.5px solid #f1f5f9',background:'#fafafa',textDecoration:'none',color:'inherit',transition:'all 0.18s'};
}
function qaIco(color){
	return {width:38,height:38,borderRadius:11,background:`${color}10`,border:`1.5px solid ${color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0};
}
function primaryBtn(c1,c2){
	return {display:'inline-flex',alignItems:'center',gap:8,background:`linear-gradient(135deg,${c1},${c2})`,color:'#fff',border:'none',borderRadius:13,padding:'11px 22px',fontSize:'0.87rem',fontWeight:700,cursor:'pointer',textDecoration:'none',boxShadow:`0 4px 14px ${c1}40`,transition:'all 0.2s'};
}
function linkBtn(color){
	return {display:'inline-flex',alignItems:'center',gap:5,color:'#fff',background:`linear-gradient(135deg,${color},${color}cc)`,border:'none',borderRadius:10,padding:'7px 14px',fontSize:'0.8rem',fontWeight:700,textDecoration:'none',cursor:'pointer'};
}
