/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'system-ui', 'sans-serif'],
				heading: ['Montserrat', 'system-ui', 'sans-serif'],
			},

			/* ⭐ YOUR RADIUS SYSTEM */
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
			},

			/* ⭐ YOUR COLOR SYSTEM */
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',

				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},

				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},

				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))',
				},

				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},

				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},

				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					light: 'hsl(var(--accent-light))',
					dark: 'hsl(var(--accent-dark))',
				},

				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},

				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},

				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},

				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',

				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))',
				},

				/* ⭐ ADDED – MY DARK THEME COLORS */
				darkbg: '#06090F',
				darkcard: '#0E121A',
				neon: '#24ffce',
			},

			/* ⭐ YOUR SHADOW SYSTEM */
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				card: 'var(--shadow-card)',
				elevated: 'var(--shadow-elevated)',

				/* ⭐ ADDED – PREMIUM SHADOWS */
				neon: '0 0 15px rgba(0,255,180,0.5)',
				'depth-lg': '0 25px 50px rgba(0,0,0,0.35)',
				'depth-sm': '0 8px 20px rgba(0,0,0,0.25)',
			},

			/* ⭐ YOUR KEYFRAMES + PREMIUM */
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},

				'fade-in': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},

				/* ⭐ SLIDER GLOW + FLOAT */
				'depth-float': {
					'0%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-6px)' },
					'100%': { transform: 'translateY(0px)' },
				},

				/* ⭐ CARD BOUNCE */
				'bounce-card': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
				},

				/* ⭐ APPLE SHINE */
				'shine-sweep': {
					'0%': { transform: 'translateX(-150%) skewX(-20deg)' },
					'100%': { transform: 'translateX(250%) skewX(-20deg)' },
				},

				/* ⭐ PULSE GLOW */
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 15px rgba(36,255,206,0.3)' },
					'50%': { boxShadow: '0 0 30px rgba(36,255,206,0.8)' },
				},

				/* ⭐ SPOTLIGHT */
				spotlight: {
					'0%': { opacity: 0, transform: 'scale(0.9)' },
					'100%': { opacity: 1, transform: 'scale(1)' },
				},
			},

			/* ⭐ ANIMATIONS */
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',

				'fade-in': 'fade-in 0.5s ease-out forwards',

				/* ⭐ PREMIUM ANIMATIONS */
				'depth-float': 'depth-float 3s ease-in-out infinite',
				'bounce-card': 'bounce-card 1.5s ease-in-out infinite',
				'shine-sweep': 'shine-sweep 3s infinite',
				'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
				spotlight: 'spotlight 0.5s ease-out forwards',
			},

			/* ⭐ YOUR SPACE SYSTEM */
			spacing: {
				18: '4.5rem',
				22: '5.5rem',
				30: '7.5rem',
			},

			/* ⭐ EXTRA BLUR FOR PREMIUM UI */
			backdropBlur: {
				xs: '2px',
				sm: '4px',
				md: '8px',
			},
		},
	},

	plugins: [require('tailwindcss-animate')],
};
