import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	LayoutDashboard,
	Building2,
	Menu,
	LogOut,
	Home,
	User,
	ChevronDown,
	Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const sidebarItems = [
	{ name: 'Dashboard', path: '/owner', icon: LayoutDashboard },
	{ name: 'My Properties', path: '/owner/properties', icon: Building2 },
	{ name: 'Earnings', path: '/owner/earnings', icon: Wallet },
];

const Sidebar = ({ className, ownerName }) => {
	const location = useLocation();

	const isActive = (path) =>
		path === '/owner'
			? location.pathname === '/owner'
			: location.pathname.startsWith(path);

	return (
		<div
			className={cn(
				'flex flex-col h-full bg-foreground text-background',
				className,
			)}
		>
			<div className="p-6 border-b border-muted/20">
				<Link to="/owner" className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-lg">
							IM
						</span>
					</div>
					<div>
						<span className="text-lg font-bold text-primary">Insta</span>
						<span className="text-lg font-bold text-accent">Makaan</span>
					</div>
				</Link>
				<p className="text-xs text-muted-foreground mt-2">Owner Portal</p>
			</div>

			<nav className="flex-1 p-4">
				<ul className="space-y-2">
					{sidebarItems.map((item) => (
						<li key={item.path}>
							<Link
								to={item.path}
								className={cn(
									'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
									isActive(item.path)
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:bg-muted/20 hover:text-background',
								)}
							>
								<item.icon className="w-5 h-5" />
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<div className="p-4 border-t border-muted/20">
				<Link
					to="/"
					className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/20 hover:text-background transition-colors"
				>
					<Home className="w-5 h-5" />
					Back to Website
				</Link>
			</div>
		</div>
	);
};

const OwnerLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [ownerData, setOwnerData] = useState(null);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const fetchOwnerData = useCallback(async () => {
		if (!user?.linked_id) return;

		try {
			const response = await fetch(
				`${BACKEND_URL}/api/owners/${user.linked_id}`,
			);
			if (response.ok) {
				const data = await response.json();
				setOwnerData(data);
			}
		} catch (error) {
			console.error('Error fetching owner data:', error);
		}
	}, [user?.linked_id]);

	useEffect(() => {
		fetchOwnerData();
	}, [fetchOwnerData]);

	const handleLogout = () => {
		logout();
		toast.success('Logged out successfully');
		navigate('/auth/login');
	};

	const ownerName = ownerData?.name || user?.name || 'Owner';

	return (
		<div className="min-h-screen bg-background">
			<aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
				<Sidebar ownerName={ownerName} />
			</aside>

			<main className="lg:pl-64 pt-16 min-h-screen">
				<Outlet />
			</main>
		</div>
	);
};

export default OwnerLayout;
