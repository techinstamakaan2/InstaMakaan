/**
 * Fast, Zero-Dependency Static Pre-Renderer for InstaMakaan
 * 
 * Runs in postbuild on Vercel, CI/CD, and local machines.
 * Reads the generated build/index.html and produces static
 * HTML files for all 29 routes with customized titles, meta
 * descriptions, canonical tags, Open Graph tags, and crawlable H1/body
 * content inside <div id="root">.
 * 
 * Zero external dependencies (no Puppeteer, no Chromium needed).
 * 100% compatible with Vercel serverless build containers.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const ROUTES_FILE = path.join(__dirname, '../public/site-routes.json');

const ROUTE_METADATA = {
	'/': {
		title: 'Rental Flats, PG & Co-Living in Noida | InstaMakaan',
		description: 'Find verified rental flats, PGs & co-living in Noida, Greater Noida & Ghaziabad with InstaMakaan. Verified listings and transparent agreements.',
		h1: 'Rental Properties in Noida, Greater Noida & Ghaziabad',
		summary: 'InstaMakaan simplifies finding, renting, and managing homes across Noida, Greater Noida West (Noida Extension), and Ghaziabad with verified listings, transparent terms, and comprehensive support.'
	},
	'/about': {
		title: 'About InstaMakaan | Verified Rentals in Noida NCR',
		description: 'Learn about InstaMakaan — a rental platform connecting owners with verified tenants in Noida, Greater Noida and Ghaziabad. Transparent pricing.',
		h1: 'About InstaMakaan',
		summary: 'Direct rental platform connecting property owners with verified tenants in Noida, Greater Noida and Ghaziabad. Transparent pricing, genuine listings, and zero brokerage stress.'
	},
	'/contact': {
		title: 'Contact InstaMakaan | Rental Help in Noida NCR',
		description: 'Get in touch with InstaMakaan for rental help in Noida, Greater Noida West and Ghaziabad. Call, email, or visit our office.',
		h1: 'Contact InstaMakaan',
		summary: 'Need assistance finding a rental home or listing your property? Connect with the InstaMakaan team today.'
	},
	'/faq': {
		title: 'FAQs — Rental Flats & PG in Noida | InstaMakaan',
		description: 'Find answers to common questions about renting flats, PGs, tenant KYC, owner services, and agreements with InstaMakaan.',
		h1: 'Frequently Asked Questions',
		summary: 'Answers to the most common questions about renting flats, tenant KYC documents, owner onboarding, and services on InstaMakaan.'
	},
	'/refund-policy': {
		title: 'Refund & Cancellation Policy | InstaMakaan',
		description: 'Review InstaMakaan refund and cancellation terms for rental facilitation services in Noida, Greater Noida, and Ghaziabad.',
		h1: 'Refund & Cancellation Policy',
		summary: 'Detailed explanation of our cancellation terms, tenant service fee refunds, and dispute resolution guidelines.'
	},
	'/privacy-policy': {
		title: 'Privacy Policy | InstaMakaan',
		description: 'InstaMakaan\'s privacy policy and data protection practices for tenants, owners, and website visitors.',
		h1: 'Privacy Policy',
		summary: 'How InstaMakaan collects, protects, and manages user data and privacy across our real estate rental platform.'
	},
	'/terms': {
		title: 'Terms of Service | InstaMakaan Legal Terms & Conditions',
		description: 'Terms of Service and conditions for using InstaMakaan rental platform and services.',
		h1: 'Terms of Service',
		summary: 'Legal terms, usage guidelines, user responsibilities, and conditions for accessing the InstaMakaan real estate platform.'
	},
	'/blog': {
		title: 'Real Estate Blog | Rental Tips Noida | InstaMakaan',
		description: 'Read latest rental tips, tenant rights, area comparisons, and real estate market insights across Noida and Greater Noida.',
		h1: 'Real Estate Blog',
		summary: 'Expert articles on tenant legal rights, rental agreements, stamp duty, market rates, and living guides in Noida & Greater Noida.'
	},
	'/reviews': {
		title: 'Customer Reviews & Testimonials | InstaMakaan Noida & Greater Noida',
		description: 'Read genuine customer reviews and testimonials from tenants and landlords who used InstaMakaan for rentals.',
		h1: 'Customer Reviews & Testimonials',
		summary: 'Authentic reviews and ratings from tenants, families, and property owners who rented or leased properties with InstaMakaan.'
	},
	'/refer': {
		title: 'Refer & Earn | InstaMakaan — Earn up to ₹25,000 per Referral',
		description: 'Refer tenants or property owners to InstaMakaan and earn cash rewards up to ₹25,000.',
		h1: 'Refer & Earn with InstaMakaan',
		summary: 'Invite friends, colleagues, and landlords to InstaMakaan and receive cash referral rewards on successful rental agreements.'
	},
	'/tools': {
		title: 'Real Estate Tools & Financial Calculators | Instamakaan',
		description: 'Free financial calculators for home buyers and tenants: Rent vs Buy, Loan Affordability, and EMI Prepayment.',
		h1: 'Real Estate Tools & Calculators',
		summary: 'Make data-backed housing decisions with our specialized Rent vs Buy, Loan Affordability, and Prepayment calculators.'
	},
	'/tools/rent-vs-buy': {
		title: 'Advanced Rent vs Buy Calculator | Instamakaan',
		description: 'Compare the financial return and long-term costs of renting vs buying a home in Delhi NCR.',
		h1: 'Rent vs Buy Calculator',
		summary: 'Compare financial outcomes of buying a property versus renting and investing the difference over 10-20 years.'
	},
	'/tools/loan-affordability': {
		title: 'Advanced Home Loan Affordability Calculator | Instamakaan',
		description: 'Calculate your maximum eligible home loan and monthly EMI based on income and expenses.',
		h1: 'Home Loan Affordability Calculator',
		summary: 'Estimate your maximum home loan eligibility and comfortable monthly EMI payment based on net take-home salary.'
	},
	'/tools/home-loan-prepayment': {
		title: 'Home Loan Prepayment Calculator | Instamakaan',
		description: 'Calculate how prepaying your home loan saves interest and reduces tenure.',
		h1: 'Home Loan Prepayment Calculator',
		summary: 'See how making regular or lump-sum prepayments drastically cuts total interest paid and tenure on your home loan.'
	},
	'/rent': {
		title: 'Verified Rental Flats, Apartments & PGs | InstaMakaan',
		description: 'Explore verified rental flats, apartments, and co-living spaces in Noida, Greater Noida, and Ghaziabad.',
		h1: 'Flats & Properties for Rent',
		summary: 'Browse verified 1 BHK, 2 BHK, 3 BHK flats and studio apartments available for rent across top residential corridors.'
	},
	'/buy': {
		title: 'Buy Properties in Noida & Greater Noida | InstaMakaan',
		description: 'Browse residential apartments, plots, and commercial properties for sale in Noida and Greater Noida.',
		h1: 'Buy Properties in Noida & Greater Noida',
		summary: 'Explore newly launched and ready-to-move apartments, commercial shops, and residential plots for sale in NCR.'
	},
	'/all-properties': {
		title: 'All Verified Properties | InstaMakaan',
		description: 'View all verified residential and commercial properties available for rent and sale.',
		h1: 'All Verified Properties',
		summary: 'Full directory of verified flats, luxury residences, commercial office spaces, and rental accommodation.'
	},
	'/society-reviews': {
		title: 'Society & Project Reviews — Noida & Greater Noida | InstaMakaan',
		description: 'Comprehensive reviews of residential societies, amenities, maintenance, and resident ratings.',
		h1: 'Society & Project Reviews',
		summary: 'In-depth resident reviews, maintenance ratings, water/power reliability, and security assessments for gated societies.'
	},
	'/guides': {
		title: 'Property Guides — Renting & Buying in Noida | InstaMakaan',
		description: 'Step-by-step guides for tenants, buyers, and investors navigating Noida and Greater Noida real estate.',
		h1: 'Property & Rental Guides',
		summary: 'Comprehensive master guides covering rental agreement laws, security deposit guidelines, society rules, and area connectivity.'
	},
	'/services': {
		title: 'Our Services — Property Management, NRI Investment & More | InstaMakaan',
		description: 'End-to-end rental management, tenant verification, agreement drafting, and NRI property services.',
		h1: 'InstaMakaan Real Estate Services',
		summary: 'Complete suite of rental facilitation, legal tenancy agreements, move-in inspections, and NRI landlord asset management.'
	},
	'/areas': {
		title: 'Explore Areas — Noida & Greater Noida | InstaMakaan',
		description: 'Detailed locality guides for Noida, Greater Noida West, and Ghaziabad residential sectors.',
		h1: 'Explore Areas & Localities',
		summary: 'Neighborhood guides highlighting metro stations, top schools, commercial hubs, hospitals, and rental pricing trends.'
	},
	'/sell-companies/nx-one-ark': {
		title: 'NX ONE ARK | Premium Commercial Tower · Tech Zone IV, Greater Noida',
		description: 'NX One ARK commercial tower in Tech Zone 4 Greater Noida West. Retail shops, office spaces, and high-street amenities.',
		h1: 'NX ONE ARK Commercial Tower',
		summary: 'Premium retail and commercial business tower located strategically in Tech Zone 4, Greater Noida West.'
	},
	'/sell-companies/aspire-centurian-park': {
		title: 'Aspire Centurian Park by Gaurs | 3 & 4 BHK Luxury Residences · Techzone-4, Greater Noida',
		description: 'Aspire Centurian Park by Gaurs in Techzone 4 Greater Noida. Premium 3 and 4 BHK luxury apartments with clubhouse amenities.',
		h1: 'Aspire Centurian Park by Gaurs',
		summary: 'Ultra-luxury 3 and 4 BHK residential apartments with modern amenities and sports facilities in Greater Noida West.'
	},
	'/sell-companies/eternia': {
		title: 'Eternia Techzone 4 Greater Noida West | 3 & 4 BHK Luxury Residences',
		description: 'Eternia in Techzone 4 Greater Noida West. Premium 3 and 4 BHK luxury homes with expansive green views and luxury amenities.',
		h1: 'Eternia Residences Techzone 4',
		summary: 'Exclusive luxury residential living with modern architecture and seamless connectivity to Central Noida and Expressway.'
	},
	'/sell-companies/aspire-leisure-park': {
		title: 'Aspire Leisure Park by GAURS | 3 & 4 BHK Luxury Residences · Techzone-4, Greater Noida',
		description: 'Aspire Leisure Park by Gaurs offering 3 & 4 BHK luxury residences in Techzone-4, Greater Noida West with resort-style living.',
		h1: 'Aspire Leisure Park by Gaurs',
		summary: 'Resort-themed luxury apartments with expansive landscaped parks, swimming pool, and high-end security.'
	},
	'/sell-companies/paradise-city': {
		title: 'Paradise City Sec-138 Noida | Plots ₹60,000/sq.yd | GRDA INFRA',
		description: 'Paradise City residential plots in Sector 138 Noida. Gated community with registry and immediate mutation available.',
		h1: 'Paradise City Sector 138 Noida',
		summary: 'Prime freehold residential plots in Sector 138 Noida with fast access to Noida-Greater Noida Expressway.'
	},
	'/sell-companies/shri-villa': {
		title: 'Shri Villa Dehradun | 50 Premium Mountain Villa Plots by GRDA Infra',
		description: 'Shri Villa Dehradun: 50 exclusive scenic mountain villa plots in Dehradun with gated security and modern infrastructure.',
		h1: 'Shri Villa Dehradun Mountain Plots',
		summary: 'Serene mountain villa plots offering panoramic Himalayan foothills views and private community living.'
	},
	'/sell-companies/codename-bento': {
		title: 'CodeName: Bento by Gaurs | Luxury Studio Apartments · Yamuna Expressway',
		description: 'CodeName: Bento by Gaurs: fully furnished studio apartments on Yamuna Expressway near Noida International Airport.',
		h1: 'CodeName: Bento by Gaurs Studio Apartments',
		summary: 'Modern fully-furnished studio suites with smart amenities directly situated on the booming Yamuna Expressway corridor.'
	},
	'/sell-companies/core-ultra-wide': {
		title: 'The Core Ultra Wide Tower | Crossing Republik Ghaziabad | Indumaa',
		description: 'The Core Ultra Wide Tower in Crossing Republik Ghaziabad. Prime retail shops and commercial office spaces.',
		h1: 'The Core Ultra Wide Tower',
		summary: 'Commercial retail and business hub with immense footfall and prime connectivity in Crossing Republik, Ghaziabad.'
	}
};

function prerender() {
	if (!fs.existsSync(BUILD_DIR)) {
		console.error('[prerender] Build directory not found.');
		process.exit(1);
	}

	const indexHtmlPath = path.join(BUILD_DIR, 'index.html');
	if (!fs.existsSync(indexHtmlPath)) {
		console.error('[prerender] build/index.html not found.');
		process.exit(1);
	}

	const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

	let routes = Object.keys(ROUTE_METADATA);
	if (fs.existsSync(ROUTES_FILE)) {
		try {
			const routesData = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8'));
			if (Array.isArray(routesData.routes)) {
				routes = routesData.routes.map((r) => r.path);
			}
		} catch (e) {
			console.warn('[prerender] Could not read site-routes.json, using default route list.');
		}
	}

	console.log(`[prerender] Pre-rendering static HTML for ${routes.length} routes...`);

	routes.forEach((route, index) => {
		const meta = ROUTE_METADATA[route] || {
			title: `${route.slice(1).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | InstaMakaan`,
			description: 'Find verified rental flats, PGs, and properties in Noida, Greater Noida, and Ghaziabad with InstaMakaan.',
			h1: route.slice(1).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
			summary: 'Explore verified real estate listings, guides, and tools with InstaMakaan.'
		};

		let html = baseHtml;

		// 1. Replace <title>
		html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);

		// 2. Replace or update <meta name="description">
		if (html.includes('name="description"')) {
			html = html.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${meta.description}"`);
		}

		// 3. Update canonical tag
		const canonicalUrl = `https://www.instamakaan.com${route === '/' ? '' : route}`;
		if (html.includes('rel="canonical"')) {
			html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${canonicalUrl}"`);
		} else {
			html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}"></head>`);
		}

		// 4. Update OpenGraph tags
		html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${meta.title}"`);
		html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${meta.description}"`);
		html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"/i, `<meta property="og:url" content="${canonicalUrl}"`);

		// 5. Update Twitter tags
		html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${meta.title}"`);
		html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${meta.description}"`);

		// 6. Inject semantic H1, header nav, and content into <div id="root"> for non-homepage sub-routes
		if (route !== '/') {
			const routeContent = `
<div class="App">
  <div class="min-h-screen flex flex-col">
    <header class="fixed top-0 left-0 right-0 z-[9999] bg-white/85 dark:bg-[#0b1220]/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10">
      <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2"><img src="/images/orglogo.webp" alt="InstaMakaan" class="w-8 h-8 object-contain"><span class="font-bold text-[#42949C]">Insta</span><span class="font-bold text-[#F5C94D]">Makaan</span></a>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
          <a href="/">Home</a><a href="/blog">Blog</a><a href="/reviews">Reviews</a><a href="/tools">Tools</a><a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
    <main class="flex-grow pt-24 pb-16 px-4 max-w-5xl mx-auto w-full">
      <article>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">${meta.h1}</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">${meta.summary}</p>
        <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
          <p>${meta.description}</p>
        </div>
      </article>
      <section class="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Explore More Resources</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-medium">
          <a href="/" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">Home</a>
          <a href="/rent" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">Rental Flats</a>
          <a href="/about" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">About Us</a>
          <a href="/contact" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">Contact Us</a>
          <a href="/faq" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">FAQs</a>
          <a href="/refund-policy" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">Refund Policy</a>
          <a href="/privacy-policy" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">Privacy Policy</a>
          <a href="/terms" class="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:text-teal-600">Terms of Service</a>
        </div>
      </section>
    </main>
    <footer class="bg-slate-50 dark:bg-[#080f1e] py-8 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
      <p class="mb-2"><a href="tel:+919771034916" class="text-teal-700 font-semibold">📞 +91 97710 34916</a> · <a href="https://wa.me/919771034916?text=Hi%20InstaMakaan%2C%20I%20need%20help%20finding%20a%20rental%20property" class="text-green-700 font-semibold" target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a></p>
      <p>© 2026 InstaMakaan. All rights reserved. | <a href="/refund-policy">Refund Policy</a> | <a href="/privacy-policy">Privacy</a> | <a href="/terms">Terms</a></p>
    </footer>
  </div>
</div>`;
			const rootStart = html.indexOf('<div id="root">');
			if (rootStart !== -1) {
				const scriptStart = html.indexOf('<script>document.addEventListener("click"');
				const rootEnd = scriptStart !== -1 ? scriptStart : html.indexOf('</body>');
				html = html.slice(0, rootStart) + `<div id="root">${routeContent}</div>` + html.slice(rootEnd);
			}
		}

		// Write to build directory
		const outDir = route === '/' ? BUILD_DIR : path.join(BUILD_DIR, route);
		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir, { recursive: true });
		}
		fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
		console.log(`[prerender] (${index + 1}/${routes.length}) Pre-rendered ${route}`);
	});

	console.log('[prerender] All routes pre-rendered successfully (0 dependencies, 100% Vercel compatible)!');
}

try {
	prerender();
} catch (err) {
	console.error('[prerender] Error during pre-rendering:', err);
	process.exit(1);
}
