import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
	const { isAuthenticated, user, loading } = useAuth();
	const location = useLocation();

	/* ================= LOADING ================= */
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	/* ================= NOT AUTHENTICATED ================= */
	if (!isAuthenticated) {
		return <Navigate to="/auth/login" state={{ from: location }} replace />;
	}

	/* ================= ROLE NOT ALLOWED ================= */
	if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
		// USER → user dashboard
		if (user?.role === 'USER') {
			return <Navigate to="/user/dashboard" replace />;
		}

		// OWNER → owner dashboard
		if (user?.role === 'OWNER') {
			return <Navigate to="/owner" replace />;
		}

		// AGENT → agent dashboard
		if (user?.role === 'AGENT') {
			return <Navigate to="/agent" replace />;
		}

		// ADMIN fallback
		return <Navigate to="/admin" replace />;
	}

	return children;
};

/* ================= ROLE-BASED REDIRECT ================= */
export const RoleBasedRedirect = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	// USER → user dashboard
	if (user?.role === 'USER') {
		return <Navigate to="/user/dashboard" replace />;
	}

	// OWNER
	if (user?.role === 'OWNER') {
		return <Navigate to="/owner" replace />;
	}

	// AGENT
	if (user?.role === 'AGENT') {
		return <Navigate to="/agent" replace />;
	}

	// ADMIN (default)
	return <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
