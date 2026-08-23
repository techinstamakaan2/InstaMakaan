import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children, noPadding = false, className = '' }) => {
	return (
		<div className={`min-h-screen flex flex-col ${className}`}>
			<Header />
			<main className={`flex-1 ${noPadding ? '' : 'pt-16 md:pt-20'}`}>{children}</main>
			<Footer />
		</div>
	);
};
