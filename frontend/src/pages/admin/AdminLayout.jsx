import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
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
	MessageSquare,
	Menu,
	LogOut,
	Plus,
	Home,
	Users,
	UserCheck,
	User,
	ChevronDown,
	FileText,
	Instagram,
	HelpCircle,
	Gift,
	UserCog,
	Sun,
	Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const sidebarItems = [
	{
		name: 'Dashboard',
		path: '/admin',
		icon: LayoutDashboard,
	},
	{
		name: 'Properties',
		path: '/admin/properties',
		icon: Building2,
	},
	{
		name: 'Owners',
		path: '/admin/owners',
		icon: Users,
	},
	{
		name: 'Agents',
		path: '/admin/agents',
		icon: UserCheck,
	},
	{
		name: 'Inquiries',
		path: '/admin/inquiries',
		icon: MessageSquare,
	},
	{
		name: 'Blog Posts',
		path: '/admin/blog',
		icon: FileText,
	},
	{
		name: 'FAQs',
		path: '/admin/faqs',
		icon: HelpCircle,
	},
	{
		name: 'Instagram',
		path: '/admin/instagram',
		icon: Instagram,
	},
	{
		name: 'Users',
		path: '/admin/users',
		icon: UserCog,
	},
	{
		name: 'Referrals',
		path: '/admin/referrals',
		icon: Gift,
	},
];

const Sidebar = ({ className }) => {
	const location = useLocation();
	const { theme, toggleTheme } = useTheme();

	const isActive = (path) => {
		if (path === '/admin') {
			return location.pathname === '/admin';
		}
		return location.pathname.startsWith(path);
	};

	return (
		<div
			className={cn(
				'flex flex-col h-full bg-card text-card-foreground border-r border-border',
				className,
			)}
		>
			{/* Logo Header */}
			<div className="p-6 border-b border-border/60 flex-shrink-0">
				<Link to="/admin" className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
						<span className="text-primary-foreground font-bold text-lg">
							IM
						</span>
					</div>
					<div>
						<span className="text-lg font-bold text-primary">Insta</span>
						<span className="text-lg font-bold text-accent">Makaan</span>
					</div>
				</Link>
				<p className="text-xs text-muted-foreground mt-2 font-medium">Admin Panel</p>
			</div>

			{/* Navigation with Custom Scrollbar */}
			<nav className="flex-1 p-4 overflow-y-auto min-h-0 custom-scrollbar space-y-1">
				<ul className="space-y-1.5">
					{sidebarItems.map((item) => (
						<li key={item.path}>
							<Link
								to={item.path}
								className={cn(
									'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
									isActive(item.path)
										? 'bg-primary text-primary-foreground shadow-sm font-semibold'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground',
								)}
							>
								<item.icon className="w-5 h-5 flex-shrink-0" />
								<span>{item.name}</span>
							</Link>
						</li>
					))}
				</ul>

				<div className="mt-6 pt-6 border-t border-border/60">
					<Link
						to="/admin/properties/new"
						className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 shadow-sm"
					>
						<Plus className="w-5 h-5 flex-shrink-0" />
						<span>Add Property</span>
					</Link>
				</div>
			</nav>

			{/* Sidebar Footer with Theme Toggle */}
			<div className="p-4 border-t border-border/60 flex-shrink-0 space-y-2">
				<button
					onClick={toggleTheme}
					type="button"
					className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
				>
					<div className="flex items-center gap-3">
						{theme === 'dark' ? (
							<Sun className="w-5 h-5 text-amber-400 flex-shrink-0" />
						) : (
							<Moon className="w-5 h-5 flex-shrink-0" />
						)}
						<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
					</div>
					<span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
						{theme === 'dark' ? 'Dark' : 'Light'}
					</span>
				</button>

				<Link
					to="/"
					className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
				>
					<Home className="w-5 h-5 flex-shrink-0" />
					<span>Back to Website</span>
				</Link>
			</div>
		</div>
	);
};

const AdminLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		toast.success('Logged out successfully');
		navigate('/auth/login');
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Desktop Sidebar */}
			<aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
				<Sidebar />
			</aside>

			{/* Mobile Header */}
			<header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center justify-between px-4">
				<div className="flex items-center">
					<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="w-6 h-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-64 p-0 border-r border-border">
							<Sidebar />
						</SheetContent>
					</Sheet>

					<Link to="/admin" className="flex items-center gap-2 ml-4">
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
							<span className="text-primary-foreground font-bold">IM</span>
						</div>
						<span className="font-semibold">Admin</span>
					</Link>
				</div>

				{/* Mobile Controls: Theme Button & User Menu */}
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						aria-label="Toggle theme"
						title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
						className="w-9 h-9 rounded-lg"
					>
						{theme === 'dark' ? (
							<Sun className="w-5 h-5 text-amber-400" />
						) : (
							<Moon className="w-5 h-5 text-slate-700" />
						)}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="gap-2">
								<User className="w-4 h-4" />
								<ChevronDown className="w-3 h-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium">{user?.name}</p>
									<p className="text-xs text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="text-destructive cursor-pointer"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			{/* Desktop Top Bar */}
			<div className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-card border-b border-border h-16">
				<div className="h-full px-6 flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Welcome back,{' '}
						<span className="font-medium text-foreground">{user?.name}</span>
					</div>

					<div className="flex items-center gap-3">
						{/* Desktop Theme Toggle Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							aria-label="Toggle theme"
							title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
							className="w-9 h-9 rounded-xl border border-border hover:bg-muted transition-colors"
						>
							{theme === 'dark' ? (
								<Sun className="w-4 h-4 text-amber-400 transition-transform duration-300" />
							) : (
								<Moon className="w-4 h-4 text-slate-700 transition-transform duration-300" />
							)}
						</Button>

						{/* Desktop User Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="gap-2">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
										<User className="w-4 h-4 text-primary" />
									</div>
									<div className="text-left hidden sm:block">
										<p className="text-sm font-medium">{user?.name}</p>
										<p className="text-xs text-muted-foreground capitalize">
											{user?.role}
										</p>
									</div>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium">{user?.name}</p>
										<p className="text-xs text-muted-foreground">{user?.email}</p>
										<p className="text-xs text-primary capitalize">
											{user?.role}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link to="/" className="cursor-pointer">
										<Home className="w-4 h-4 mr-2" />
										View Website
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleLogout}
									className="text-destructive cursor-pointer"
								>
									<LogOut className="w-4 h-4 mr-2" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="lg:pl-64 pt-16 min-h-screen">
				<div className="p-4 md:p-6 lg:p-8">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default AdminLayout;
