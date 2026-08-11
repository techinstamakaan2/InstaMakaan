import React, { Suspense, lazy, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ModeProvider } from '@/context/ModeContext';
import ProtectedRoute, {
	RoleBasedRedirect,
} from '@/components/auth/ProtectedRoute';
const NxOneArkDetailPage = lazy(() => import('@/pages/sell/NxOneArkDetailPage'));
const AspireCenturianParkPage = lazy(() => import('@/pages/sell/AspireCenturianParkPage'));
const AlpgPage = lazy(() => import('@/pages/sell/AlpgPage'));
const ParadiseCityPage = lazy(() => import('@/pages/sell/ParadiseCityPage'));
/* ================= PUBLIC PAGES ================= */
const HomePage = lazy(() => import('@/pages/HomePage'));
const AllPropertiesPage = lazy(() => import('@/pages/AllPropertiesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const LocalityPage = lazy(() => import('@/pages/LocalityPage'));
const SocietyReviewsIndexPage = lazy(() => import('@/pages/SocietyReviewsIndexPage'));
const SocietyReviewPage = lazy(() => import('@/pages/SocietyReviewPage'));
const PillarGuidesIndexPage = lazy(() => import('@/pages/PillarGuidesIndexPage'));
const PillarGuidePage = lazy(() => import('@/pages/PillarGuidePage'));
const ServicesIndexPage = lazy(() => import('@/pages/ServicesIndexPage'));
const ServicePage = lazy(() => import('@/pages/ServicePage'));
const AreaHubsIndexPage = lazy(() => import('@/pages/AreaHubsIndexPage'));
const AreaHubPage = lazy(() => import('@/pages/AreaHubPage'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const AdminInstagramPage = lazy(
	() => import('@/pages/admin/AdminInstagramPage'),
);
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ReferPage = lazy(() => import('@/pages/ReferPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
import ScrollToTop from '@/components/ScrollToTop';
import ScrollRevealObserver from '@/components/ScrollRevealObserver';
const HeroReviews = lazy(() => import('@/pages/Reviews'));
const ToolsDashboard = lazy(() => import('@/pages/tools/ToolsDashboard'));
const RentVsBuyCalculator = lazy(() => import('@/pages/tools/RentVsBuyCalculator'));
const LoanAffordabilityCalculator = lazy(() => import('@/pages/tools/LoanAffordabilityCalculator'));
const HomeLoanPrepaymentCalculator = lazy(() => import('@/pages/tools/HomeLoanPrepaymentCalculator'));
/* ================= AUTH PAGES ================= */
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const AdminLoginPage = lazy(() => import('@/pages/auth/AdminLoginPage'));

/* ================= ADMIN PAGES ================= */
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const PropertiesListPage = lazy(
	() => import('@/pages/admin/PropertiesListPage'),
);
const PropertyFormPage = lazy(() => import('@/pages/admin/PropertyFormPage'));
const InquiriesPage = lazy(() => import('@/pages/admin/InquiriesPage'));
const OwnersPage = lazy(() => import('@/pages/admin/OwnersPage'));
const AdminOwnerDashboardPage = lazy(
	() => import('@/pages/admin/OwnerDashboardPage'),
);
const AgentsPage = lazy(() => import('@/pages/admin/AgentsPage'));
const AdminAgentInquiriesPage = lazy(
	() => import('@/pages/admin/AgentInquiriesPage'),
);
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminReferralsPage = lazy(() => import('@/pages/admin/AdminReferralsPage'));
const AdminBlogPage = lazy(() => import('@/pages/admin/AdminBlogPage'));
const AdminBlogEditor = lazy(() => import('@/pages/admin/AdminBlogEditor'));
const AdminFAQPage = lazy(() => import('@/pages/admin/AdminFAQPage'));
const AdminFAQEditor = lazy(() => import('@/pages/admin/AdminFAQEditor'));

/* ================= AGENT PAGES ================= */
const AgentLayout = lazy(() => import('@/pages/agent/AgentLayout'));
const AgentDashboard = lazy(() => import('@/pages/agent/AgentDashboard'));

/* ================= USER PAGES ================= */
const UserDashboard = lazy(() => import('@/pages/user/UserDashboard'));

/* ================= OWNER PAGES ================= */
const OwnerLayout = lazy(() => import('@/pages/owner/OwnerLayout'));
const OwnerDashboard = lazy(() => import('@/pages/owner/OwnerDashboard'));
const OwnerProperties = lazy(() => import('@/pages/owner/OwnerProperties'));
const OwnerEarnings = lazy(() => import('@/pages/owner/OwnerEarnings'));

function App() {
	// Site has a single design, but should still render correctly if the
	// visitor's browser/OS is set to dark mode — no manual toggle, just
	// mirror whatever the browser reports, live.
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			document.documentElement.classList.toggle('dark', savedTheme === 'dark');
			return;
		}
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const applyTheme = (isDark) => document.documentElement.classList.toggle('dark', isDark);
		applyTheme(mq.matches);
		const handleChange = (e) => applyTheme(e.matches);
		mq.addEventListener('change', handleChange);
		return () => mq.removeEventListener('change', handleChange);
	}, []);

	return (
		<div className="App">
			<ModeProvider>
			<AuthProvider>
				<BrowserRouter>
					<ScrollToTop />
					<ScrollRevealObserver />
					<Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
						<Routes>
							{/* ================= PUBLIC ROUTES ================= */}
							<Route path="/" element={<HomePage />} />
							<Route path="/all-properties" element={<AllPropertiesPage />} />
							<Route path="/property/:id" element={<PropertyDetailPage />} />
							<Route
								path="/listings/:id"
								element={<PropertyDetailPage />}
							/>{' '}
							<Route path="/blog" element={<BlogPage />} />
							<Route path="/blog/:slug" element={<BlogDetailPage />} />
							<Route path="/about" element={<AboutPage />} />
							<Route path="/refer" element={<ReferPage />} />
							<Route path="/faq" element={<FAQPage />} />
							<Route path="/contact" element={<ContactPage />} />
							<Route path="/privacy-policy" element={<PrivacyPolicy />} />
							<Route path="/terms" element={<TermsOfService />} />
							<Route path="/reviews" element={<HeroReviews />} />
							<Route path="/tools" element={<ToolsDashboard />} />
							<Route path="/tools/rent-vs-buy" element={<RentVsBuyCalculator />} />
							<Route path="/tools/loan-affordability" element={<LoanAffordabilityCalculator />} />
							<Route path="/tools/home-loan-prepayment" element={<HomeLoanPrepaymentCalculator />} />
							<Route path="/rent/:slug" element={<LocalityPage />} />
							<Route path="/rent" element={<AllPropertiesPage />} />
							<Route path="/buy" element={<HomePage />} />
							<Route path="/society-reviews" element={<SocietyReviewsIndexPage />} />
							<Route path="/society-reviews/:slug" element={<SocietyReviewPage />} />
							<Route path="/guides" element={<PillarGuidesIndexPage />} />
							<Route path="/guides/:slug" element={<PillarGuidePage />} />
							<Route path="/services" element={<ServicesIndexPage />} />
							<Route path="/services/:slug" element={<ServicePage />} />
							<Route path="/areas" element={<AreaHubsIndexPage />} />
							<Route path="/areas/:slug" element={<AreaHubPage />} />
							<Route path="/sell-companies/nx-one-ark" element={<NxOneArkDetailPage />} />
							<Route path="/sell-companies/aspire-centurian-park" element={<AspireCenturianParkPage />} />
							<Route path="/sell-companies/aspire-leisure-park" element={<AlpgPage />} />
							<Route path="/sell-companies/paradise-city" element={<ParadiseCityPage />} />
							{/* ================= AUTH ROUTES ================= */}
							<Route path="/auth/login" element={<LoginPage />} />
							<Route path="/auth/register" element={<RegisterPage />} />
							<Route
								path="/auth/forgot-password"
								element={<ForgotPasswordPage />}
							/>
							<Route
								path="/auth/reset-password/:token"
								element={<ResetPasswordPage />}
							/>
							<Route path="/auth/verify-email" element={<VerifyEmailPage />} />
							<Route path="/admin/login" element={<AdminLoginPage />} />
							{/* ================= ROLE BASED REDIRECT ================= */}
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<RoleBasedRedirect />
									</ProtectedRoute>
								}
							/>
							{/* ================= USER DASHBOARD ================= */}
							<Route
								path="/user/dashboard"
								element={
									<ProtectedRoute allowedRoles={['USER']}>
										<UserDashboard />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin"
								element={
									<ProtectedRoute allowedRoles={['ADMIN']}>
										<AdminLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<DashboardPage />} />
								<Route path="properties" element={<PropertiesListPage />} />
								<Route path="properties/new" element={<PropertyFormPage />} />
								<Route
									path="properties/:id/edit"
									element={<PropertyFormPage />}
								/>
								<Route path="blog" element={<AdminBlogPage />} />
								<Route path="blog/new" element={<AdminBlogEditor />} />
								<Route path="blog/:id/edit" element={<AdminBlogEditor />} />

								<Route path="faqs" element={<AdminFAQPage />} />
								<Route path="faqs/new" element={<AdminFAQEditor />} />
								<Route path="faqs/:id/edit" element={<AdminFAQEditor />} />

								<Route path="owners" element={<OwnersPage />} />
								<Route path="agents" element={<AgentsPage />} />
								<Route path="inquiries" element={<InquiriesPage />} />
								<Route path="instagram" element={<AdminInstagramPage />} />
								<Route path="users" element={<AdminUsersPage />} />
								<Route path="referrals" element={<AdminReferralsPage />} />
							</Route>
							{/* ================= AGENT ROUTES ================= */}
							<Route
								path="/agent"
								element={
									<ProtectedRoute allowedRoles={['AGENT']}>
										<AgentLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<AgentDashboard />} />
							</Route>
							{/* ================= OWNER ROUTES ================= */}
							<Route
								path="/owner"
								element={
									<ProtectedRoute allowedRoles={['OWNER']}>
										<OwnerLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<OwnerDashboard />} />
								<Route path="properties" element={<OwnerProperties />} />
								<Route path="earnings" element={<OwnerEarnings />} />
							</Route>
							{/* ================= 404 ================= */}
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</Suspense>
				</BrowserRouter>
				{/* <ScrollToTop /> */}
				<Toaster position="top-right" />
			</AuthProvider>
			</ModeProvider>
		</div>
	);
}

export default App;
