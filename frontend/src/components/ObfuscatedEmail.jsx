import React, { useState, useEffect } from 'react';

export const ObfuscatedEmail = ({
	user = 'support',
	domain = 'instamakaan.com',
	className = '',
	text = null,
}) => {
	const [email, setEmail] = useState('');

	useEffect(() => {
		setEmail(`${user}@${domain}`);
	}, [user, domain]);

	const handleClick = (e) => {
		e.preventDefault();
		const address = `${user}@${domain}`;
		window.location.href = `mailto:${address}`;
	};

	if (!email) {
		return (
			<span className={className} aria-label="Email address protected from spam">
				{text || `${user} [at] ${domain}`}
			</span>
		);
	}

	return (
		<a
			href={`mailto:${email}`}
			onClick={handleClick}
			className={className}
		>
			{text || email}
		</a>
	);
};

export default ObfuscatedEmail;
