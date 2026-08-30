// ────────────────────────────────────────────────────────────────────────
// PROJECT REVIEWS DATA
// Editorial-style review data for all buy-section projects.
// Scores reflect InstaMakaan's own editorial assessment based on
// project specifications, developer track record, location factors,
// and amenity quality — NOT sourced from individual buyer surveys.
// ────────────────────────────────────────────────────────────────────────

const SCORE_DIMENSIONS = [
	{ key: 'construction', label: 'Construction Quality' },
	{ key: 'amenities', label: 'Amenities & Lifestyle' },
	{ key: 'location', label: 'Location & Connectivity' },
	{ key: 'value', label: 'Value for Money' },
	{ key: 'builder', label: 'Builder Track Record' },
];

const ALL_PROJECT_REVIEWS = [
	// ──────────────────────────────────────────────────
	// 1. NX ONE — ARK
	// ──────────────────────────────────────────────────
	{
		slug: 'nx-one-ark',
		name: 'NX ONE – ARK',
		type: 'Commercial',
		developer: 'SP SAI IT Private Limited',
		location: 'Tech Zone IV, Greater Noida (West), U.P.',
		projectLink: '/sell-companies/nx-one-ark',
		overallScore: 4.3,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 4.4 },
			{ ...SCORE_DIMENSIONS[1], value: 4.6 },
			{ ...SCORE_DIMENSIONS[2], value: 4.2 },
			{ ...SCORE_DIMENSIONS[3], value: 4.0 },
			{ ...SCORE_DIMENSIONS[4], value: 4.3 },
		],
		highlights: [
			'Premium G+26 commercial tower with 9 Mitsubishi high-speed elevators across 4 wings',
			'46-ft triple-height Italian marble lobby with dedicated concierge reception',
			'Club π amenities: Auditorium, Gymnasium, Sky Bar, Amphitheatre, Conference Rooms, Crèche, Café',
			'AQI-controlled environment with Saint-Gobain façade and 3-tier security',
			'500 metres from upcoming Metro Station — strong future connectivity advantage',
			'Fully fitted offices with Kohler sanitary fittings and branded workspace features',
		],
		considerations: [
			'Located in Tech Zone IV which is still developing — surrounding infrastructure is evolving',
			'BSP of ₹11,990/sqft is at the premium end for Greater Noida West commercial',
			'Jewar Airport connectivity (60 min) is a future benefit but not yet operational',
			'Being a new project — construction timeline and possession dates should be confirmed directly',
		],
		bestFor: ['Business Owners', 'Investors', 'Corporate Offices'],
		overview:
			'NX ONE – ARK is a G+26 premium commercial tower situated in the NX ONE Township at Tech Zone IV, Greater Noida (West). Developed by SP SAI IT Private Limited and RERA-approved (UPRERAPRJ448845/02/2025), the project offers four unit types ranging from 851 sqft to 3,049 sqft — designed for offices, co-working spaces, and corporate suites. The tower distinguishes itself with Club π, a comprehensive amenity floor featuring an auditorium, gymnasium, sky bar, amphitheatre, conference rooms, crèche, and café. The building includes 9 Mitsubishi high-speed elevators, a 46-ft triple-height Italian marble lobby, AQI-controlled ventilation, EV charging stations, and 3-tier security. Its location is 500 metres from an upcoming Metro station with access to the Noida–Greater Noida Expressway network.',
		verdict:
			'NX ONE – ARK presents a compelling commercial proposition for businesses and investors looking at the Greater Noida West corridor. The Club π amenities, premium specifications (Kohler, Saint-Gobain, Italian marble), and upcoming Metro connectivity are strong differentiators. However, buyers should factor in the evolving surrounding infrastructure and verify construction timelines. For those seeking a premium commercial address in this growth corridor, it stands out for build quality and specification level.',
		keyFacts: {
			rera: 'UPRERAPRJ448845/02/2025',
			bsp: '₹11,990/sqft',
			unitTypes: '851 – 3,049 sqft (4 configurations)',
			towerHeight: 'G+26 Storeys',
			township: 'NX ONE Township (~25 Acres)',
			elevators: '9 Mitsubishi High-Speed',
		},
	},

	// ──────────────────────────────────────────────────
	// 2. ASPIRE CENTURIAN PARK
	// ──────────────────────────────────────────────────
	{
		slug: 'aspire-centurian-park',
		name: 'Aspire Centurian Park',
		type: 'Residential',
		developer: 'Gaurs Group',
		location: 'Techzone-4, Greater Noida (West), U.P.',
		projectLink: '/sell-companies/aspire-centurian-park',
		overallScore: 4.4,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 4.5 },
			{ ...SCORE_DIMENSIONS[1], value: 4.7 },
			{ ...SCORE_DIMENSIONS[2], value: 4.3 },
			{ ...SCORE_DIMENSIONS[3], value: 4.0 },
			{ ...SCORE_DIMENSIONS[4], value: 4.5 },
		],
		highlights: [
			'Massive 12-acre project with 11 towers including a 45-floor Iconic Tower — tallest in Greater Noida West',
			'64 world-class amenities across Sports Zone, Aqua Zone, Interactive Zone, and Undercroft Zone',
			'40,000 sqft 5-star lavish clubhouse — one of the largest in the region',
			'Designed by Chapman Taylor — internationally acclaimed architecture firm',
			'10-acre green park adjacent to the project — extensive open green space',
			'Supreme Court–monitored project managed via UCO Bank escrow — strong compliance framework',
		],
		considerations: [
			'4 BHK configurations only (3,360–3,862 sqft) — premium price bracket, not entry-level',
			'BSP ranges from ₹13,000–14,000/sqft — among the higher end for the area',
			'Metro station (Gaur Chowk) is upcoming but 2 km away — not immediately walkable',
			'Being a Supreme Court–managed project, possession timelines may depend on regulatory processes',
		],
		bestFor: ['Families', 'Luxury Homebuyers', 'NRI Buyers'],
		overview:
			'Aspire Centurian Park by Gaurs Group is a grand luxury residential development spread across 12 acres in Techzone-4, Greater Noida (West). The project features 11 towers, including a landmark 45-floor Iconic Tower — the tallest residential structure in Greater Noida West. Designed by the internationally acclaimed Chapman Taylor architects, the project offers exclusively 4 BHK residences (3,360–3,862 sqft). It boasts 64 amenities organized into four zones: Sports (badminton, basketball, cricket, tennis, jogging track), Aqua (swimming pool, jacuzzi, floating cabana, lily pond), Interactive (butterfly garden, amphitheatre, maze runner, pets park), and Undercroft (yoga, co-working, library, ladies corner). A 40,000 sqft 5-star clubhouse and a 10-acre adjacent green park add to the lifestyle quotient. The project is managed under Supreme Court oversight with an UCO Bank escrow account. Connectivity includes Gaur Chowk Metro (2 km), Noida (6 km), and IGI Airport (42 km).',
		verdict:
			'Aspire Centurian Park is a standout project for luxury homebuyers seeking spacious 4 BHK homes with world-class amenities in Greater Noida West. The Chapman Taylor design, 45-floor Iconic Tower, 64 amenities, and 40,000 sqft clubhouse place it among the premium developments in the region. Gaurs Group — with 65+ projects delivered and 100M+ sqft of development — is one of NCR\'s most established developers. The premium pricing and 4 BHK–only offering make it best suited for families and NRI buyers looking for a flagship address.',
		keyFacts: {
			rera: 'SC-Monitored · NBCC Delivery Oversight',
			bsp: '₹13,000–14,000/sqft',
			unitTypes: '4 BHK + Study (3,360–3,862 sqft)',
			towerHeight: 'Up to 45 Floors (Iconic Tower)',
			clubhouse: '40,000 sqft',
			amenities: '64 Amenities',
		},
	},

	// ──────────────────────────────────────────────────
	// 3. ETERNIA
	// ──────────────────────────────────────────────────
	{
		slug: 'eternia',
		name: 'Eternia',
		type: 'Residential',
		developer: 'Great Value Group (Managed by NBCC)',
		location: 'Dream Valley, Techzone-4, Greater Noida (West), U.P.',
		projectLink: '/sell-companies/eternia',
		overallScore: 4.2,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 4.3 },
			{ ...SCORE_DIMENSIONS[1], value: 4.4 },
			{ ...SCORE_DIMENSIONS[2], value: 4.2 },
			{ ...SCORE_DIMENSIONS[3], value: 4.2 },
			{ ...SCORE_DIMENSIONS[4], value: 3.9 },
		],
		highlights: [
			'Low-density 6-acre serene enclave with 6 towers (Lotus, Lily, Orchid, Rose, Dahlia, Tulip) — G+30 floors',
			'Facing 100-metre fully developed green belt — assured open views and fresh air',
			'25,000 sqft curated 5-star clubhouse with swimming pool, gymnasium, yoga pavilion, and billiards',
			'Managed by NBCC on behalf of Hon\'ble Supreme Court Receiver — assured construction oversight',
			'Monolithic aluminium shuttering earthquake-resistant framework — modern build technology',
			'Double-glazed 3-track UPVC soundproof windows with mosquito mesh across all units',
		],
		considerations: [
			'Original developer (Great Value) faced delays — now under NBCC/Supreme Court management',
			'Possession timelines are dependent on NBCC\'s construction progress — confirm current status',
			'Located on a 130-metre expressway link road — may have traffic noise during peak hours',
			'Limited unit type diversity — primarily 3 BHK and 4 BHK + Study configurations',
		],
		bestFor: ['End Users', 'Families', 'Long-term Investors'],
		overview:
			'Eternia is a premium residential project situated in Dream Valley, Techzone-4, Greater Noida (West), spread across 6 acres with 6 towers rising to G+30 floors. Originally developed by Great Value Group, the project is now managed by NBCC (National Buildings Construction Corporation) on behalf of the Hon\'ble Supreme Court Receiver, providing assured construction oversight. The project faces a 100-metre fully developed green belt, ensuring open views and ample natural light. It offers 3 BHK (1,932 sqft), 3 BHK + Study (2,239 sqft), and 4 BHK + Study (2,625 sqft) configurations across towers named Lotus, Lily, Orchid, Rose, Dahlia, and Tulip. The 25,000 sqft clubhouse includes a swimming pool, gymnasium, yoga pavilion, multipurpose hall, billiards, toddler play area, and senior garden. Engineering highlights include monolithic aluminium shuttering, 4 lifts per tower (3 high-speed + 1 service), and double-glazed UPVC windows. Connectivity via the 130-metre expressway link road is a major advantage.',
		verdict:
			'Eternia offers a strong value proposition for homebuyers who prioritize green views, modern construction technology, and the security of Supreme Court–managed NBCC execution. The 100-metre green belt frontage, 25,000 sqft clubhouse, and earthquake-resistant construction set it apart. However, buyers should independently verify current construction progress and expected possession timelines given the project\'s history. For families seeking spacious 3–4 BHK homes in a low-density enclave with green surroundings, Eternia is worth serious consideration.',
		keyFacts: {
			rera: 'UPRERA Registered (NBCC Managed)',
			bsp: '₹9,400–10,350/sqft (varies by unit)',
			unitTypes: '3 BHK, 3 BHK + Study, 4 BHK + Study (1,932–2,625 sqft)',
			towerHeight: 'G+30 Floors',
			clubhouse: '25,000 sqft',
			greenBelt: '100 Mtr Fully Developed',
		},
	},

	// ──────────────────────────────────────────────────
	// 4. ASPIRE LEISURE PARK
	// ──────────────────────────────────────────────────
	{
		slug: 'aspire-leisure-park',
		name: 'Aspire Leisure Park',
		type: 'Residential',
		developer: 'Gaurs Group',
		location: 'Techzone-4, Greater Noida (West), U.P.',
		projectLink: '/sell-companies/aspire-leisure-park',
		overallScore: 4.3,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 4.4 },
			{ ...SCORE_DIMENSIONS[1], value: 4.5 },
			{ ...SCORE_DIMENSIONS[2], value: 4.2 },
			{ ...SCORE_DIMENSIONS[3], value: 4.1 },
			{ ...SCORE_DIMENSIONS[4], value: 4.5 },
		],
		highlights: [
			'7-acre development with 7 towers including a 33-floor Iconic Tower with only 2 units per floor',
			'23,960 sqft ultra-modern clubhouse — among the premium community facilities in the micro-market',
			'4-level podium parking enabling vehicle-free landscaped podium living',
			'Iconic Tower Duplex option (5 BHK, 7,263 sqft) — a rare penthouse configuration in the area',
			'60-metre and 45-metre road frontage providing excellent visibility and access',
			'Gaurs Group developer with 10+ ongoing RERA-registered projects — established track record',
		],
		considerations: [
			'Primarily 3 BHK and 4 BHK units — premium positioning, limited options for smaller budgets',
			'BSP of ₹13,000–14,000/sqft places this at the higher end of Greater Noida West pricing',
			'Podium parking means parking is in the lower levels — may not appeal to all buyers',
			'Surrounding area infrastructure (Techzone-4) is still maturing — roads and retail are developing',
		],
		bestFor: ['Families', 'Luxury Homebuyers', 'Investors'],
		overview:
			'Aspire Leisure Park by Gaurs Group is a landmark luxury residential development spread across approximately 7 acres in Techzone-4, Greater Noida (West). The project comprises 7 towers including a signature 33-floor Iconic Tower that offers an exclusive 2-units-per-floor configuration. Unit types range from 3 BHK + Servant Room (2,299 sqft) to 4 BHK + Servant Room (2,783–3,769 sqft) and an ultra-premium Duplex 5 BHK (7,263 sqft) in the Iconic Tower. The 23,960 sqft clubhouse features a swimming pool, gymnasium, indoor games, community hall, and central greens. The project offers 4-level podium parking, creating a vehicle-free elevated landscape above. Located on prime 60-metre and 45-metre road frontage, connectivity to the broader NCR network is convenient. Gaurs Group has 10+ ongoing RERA-registered projects, providing confidence in execution capability.',
		verdict:
			'Aspire Leisure Park is a compelling choice for premium homebuyers who value spacious layouts, podium-level living, and the reliability of Gaurs Group. The Iconic Tower with its exclusive 2-units-per-floor configuration and rare 5 BHK Duplex offering makes it unique in the Greater Noida West market. The 23,960 sqft clubhouse and 4-level podium parking are practical differentiators. Best suited for families seeking large-format residences with strong community amenities.',
		keyFacts: {
			rera: 'UPRERA Registered (Gaurs)',
			bsp: '₹13,000–14,000/sqft',
			unitTypes: '3 BHK, 4 BHK, 5 BHK Duplex (2,299–7,263 sqft)',
			towerHeight: 'Up to 33 Floors (Iconic Tower)',
			clubhouse: '23,960 sqft',
			parking: '4-Level Podium Parking',
		},
	},

	// ──────────────────────────────────────────────────
	// 5. PARADISE CITY
	// ──────────────────────────────────────────────────
	{
		slug: 'paradise-city',
		name: 'Paradise City',
		type: 'Plots',
		developer: 'Sumpri Infratech Pvt Ltd (via GRDA Infra)',
		location: 'Sector-138, Noida, Uttar Pradesh',
		projectLink: '/sell-companies/paradise-city',
		overallScore: 4.0,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 3.8 },
			{ ...SCORE_DIMENSIONS[1], value: 3.9 },
			{ ...SCORE_DIMENSIONS[2], value: 4.3 },
			{ ...SCORE_DIMENSIONS[3], value: 4.0 },
			{ ...SCORE_DIMENSIONS[4], value: 3.8 },
		],
		highlights: [
			'Prime Sector-138 location on 45-metre Pusta Road adjoining FNG Highway — excellent connectivity',
			'Plotted development offering freedom to build your own dream home design',
			'Multiple plot sizes: 150, 200, 250, 1000, and 2000 sq yd — options for every requirement',
			'RERA-registered (BRERAA12606/24/2024) — regulatory compliance confirmed',
			'Gated community with 24-metre internal road — grand entrance with boom barriers',
			'Proximity to Noida–Greater Noida Expressway, FNG corridor, and upcoming Jewar Airport zone',
		],
		considerations: [
			'Plotted development means you bear the additional cost and effort of construction on top of plot price',
			'BSP of ₹60,000/sq yd requires significant upfront investment — confirm current availability and pricing',
			'GRDA Infra is the marketing agent (not the land developer) — independently verify ownership chain, land title, and all approvals before purchase',
			'Sector-138 Pusta Road area has historically faced regulatory scrutiny from Noida Authority — conduct thorough legal due diligence on layout approvals',
			'Located in the outer zone of Noida — daily commute to central Noida/Delhi hubs may be longer',
		],
		bestFor: ['Home Builders', 'Long-term Investors'],
		overview:
			'Paradise City is a plotted residential development in Sector-138, Noida, situated on a 45-metre Pusta Road adjoining the FNG (Faridabad-Noida-Ghaziabad) Highway corridor. Developed by Sumpri Infratech Pvt Ltd and marketed by GRDA Infra Private Limited, the project is RERA-registered (BRERAA12606/24/2024). It offers plots in five sizes — 150, 200, 250, 1,000, and 2,000 sq yd — catering to individual home builders and investors. The gated community features a 24-metre internal road, grand entrance with boom barriers, and planned amenities including a clubhouse. Key location advantages include proximity to the Noida–Greater Noida Expressway, Yamuna Expressway, and the upcoming Noida International Airport at Jewar. The payment plan requires 10% at booking, 30% within 30 days, and 60% within 90 days.',
		verdict:
			'Paradise City is an interesting proposition for buyers who want the freedom to design and build their own home in a gated community with strong location fundamentals. The Sector-138 location near FNG Highway offers future appreciation potential, especially with Jewar Airport development in progress. However, buyers should conduct thorough due diligence on land title, verify all approvals independently, and factor in construction costs beyond the plot BSP. Best suited for those with a long-term investment horizon and the willingness to manage their own construction.',
		keyFacts: {
			rera: 'BRERAA12606/24/2024',
			bsp: '₹60,000/sq yd',
			unitTypes: '150, 200, 250, 1000, 2000 sq yd plots',
			roadFrontage: '45 Mtr Pusta Road',
			entrance: '24 Mtr Internal Road',
			paymentPlan: '10% + 30% (30 days) + 60% (90 days)',
		},
	},

	// ──────────────────────────────────────────────────
	// 6. SHRI VILLA
	// ──────────────────────────────────────────────────
	{
		slug: 'shri-villa',
		name: 'Shri Villa',
		type: 'Plots / Villas',
		developer: 'GRDA Infra Private Limited',
		location: 'Vill-Sorna, Dehradun, Uttarakhand',
		projectLink: '/sell-companies/shri-villa',
		overallScore: 3.9,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 3.7 },
			{ ...SCORE_DIMENSIONS[1], value: 4.1 },
			{ ...SCORE_DIMENSIONS[2], value: 3.6 },
			{ ...SCORE_DIMENSIONS[3], value: 4.2 },
			{ ...SCORE_DIMENSIONS[4], value: 3.8 },
		],
		highlights: [
			'Himalayan foothill location in Dehradun with pristine AQI (<35) — ideal for nature lovers',
			'Low-density enclave of only 50 villa plots on 22,941 sq yd estate — exclusive and private',
			'Immediate registry and bank loan sanction available — clear title with no waiting period',
			'30 ft+ wide internal boulevards with 5,014 sq yd dedicated roadways',
			'Planned amenities: clubhouse with infinity pool, wellness gym, temple, cricket turf, party hall',
			'4 km from Yamunotri Highway — good corridor access for Dehradun–Mussoorie connectivity',
		],
		considerations: [
			'Dehradun location means it is primarily a second home or retirement property, not for daily NCR commuters',
			'GRDA Infra is a relatively newer developer — limited track record compared to established NCR builders',
			'Amenities like clubhouse and pool are planned but should be confirmed as operational before purchase',
			'Resale liquidity for Dehradun villa plots may be lower compared to NCR urban properties',
		],
		bestFor: ['Retirees', 'Second Home Buyers', 'Nature Enthusiasts'],
		overview:
			'Shri Villa is a boutique villa-plot development nestled in the Himalayan foothills at Vill-Sorna, Dehradun, Uttarakhand. Developed by GRDA Infra Private Limited, the project offers 50 exclusive villa plots on a 22,941 sq yd (2.06 lakh sqft) greenfield estate. The community features 30 ft+ wide internal boulevards, a grand gated entrance with 24x7 security, and planned amenities including a clubhouse with infinity pool, wellness open gym, temple, cricket sports turf, badminton court, and party hall. The location is 4 km from Yamunotri Highway, providing access to Dehradun city and Mussoorie. A key USP is the pristine air quality (AQI < 35) and pine valley vistas. The project offers immediate registry with bank loan sanction availability, providing clear ownership from day one.',
		verdict:
			'Shri Villa is a niche offering for buyers seeking a tranquil second home or retirement residence in the Dehradun foothills. The low-density layout (only 50 plots), immediate registry, and planned lifestyle amenities make it attractive for nature lovers who want to build their dream mountain home. However, buyers should verify the current status of amenity construction, and treat this as a lifestyle or long-term investment rather than a quick-return commercial bet. Site visits are strongly recommended before committing.',
		keyFacts: {
			rera: 'N/A (Uttarakhand)',
			bsp: 'Contact for pricing',
			unitTypes: '50 Villa Plots',
			totalArea: '22,941 sq yd Estate',
			roadWidth: '30 ft+ Internal Boulevards',
			highlight: 'Immediate Registry Available',
		},
	},

	// ──────────────────────────────────────────────────
	// 7. CODENAME: BENTO
	// ──────────────────────────────────────────────────
	{
		slug: 'codename-bento',
		name: 'CodeName: Bento',
		type: 'Luxury Studios',
		developer: 'Gaurs Group',
		location: 'Sector-19, Gaur Yamuna City, Yamuna Expressway',
		projectLink: '/sell-companies/codename-bento',
		overallScore: 4.1,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 4.2 },
			{ ...SCORE_DIMENSIONS[1], value: 4.4 },
			{ ...SCORE_DIMENSIONS[2], value: 3.8 },
			{ ...SCORE_DIMENSIONS[3], value: 4.1 },
			{ ...SCORE_DIMENSIONS[4], value: 4.5 },
		],
		highlights: [
			'Part of 250-acre Gaur Yamuna City integrated township — built-in township ecosystem',
			'Twin 40-storey iconic glass towers — landmark architectural presence on Yamuna Expressway',
			'45,000 sqft luxury clubhouse with premium lifestyle amenities',
			'Fully furnished luxury studio apartments starting from ₹1 Cr — complete move-in-ready units',
			'8,000 car parking spaces — one of the highest parking ratios in the segment',
			'Gaurs Group developer with decades of NCR experience and 10+ RERA-registered projects',
		],
		considerations: [
			'Yamuna Expressway location is 30+ km from Noida city centre — not ideal for daily Noida commuters',
			'Studio apartments are a niche segment — resale demand may be limited compared to traditional 2/3 BHK',
			'Jewar Airport is the primary growth catalyst but operational timeline should be confirmed',
			'Township amenities scale depends on how many other phases of Gaur Yamuna City are occupied',
		],
		bestFor: ['Investors', 'Young Professionals', 'Airbnb/Rental Income Seekers'],
		overview:
			'CodeName: Bento by Gaurs Group is a luxury studio apartment project within the 250-acre Gaur Yamuna City integrated township on the Yamuna Expressway. The project features two iconic 40-storey glass towers offering fully furnished studio apartments starting from approximately ₹1 Cr. The 45,000 sqft clubhouse provides premium amenities, and the project offers 8,000 car parking spaces across the township. Studio types range from approximately 650 sqft (Type A) with BSP around ₹15,385/sqft. The Yamuna Expressway location positions the project in the growth corridor of the upcoming Noida International Airport (Jewar), Film City, and various industrial nodes. Gaurs Group\'s township infrastructure includes existing retail, schools, and hospitals within the Gaur Yamuna City ecosystem.',
		verdict:
			'CodeName: Bento is strategically positioned for investors and young professionals betting on the Yamuna Expressway growth story driven by Jewar Airport. The Gaurs Group backing, 250-acre township infrastructure, and fully furnished delivery reduce entry barriers. However, buyers should evaluate current occupancy and connectivity realistically — the Yamuna Expressway corridor is still in its early growth phase. As a rental-income or appreciation play, it has strong fundamentals; as a primary residence, the distance from NCR\'s established urban centres is a factor.',
		keyFacts: {
			rera: 'UPRERA Registered (Gaurs)',
			bsp: '~₹15,385/sqft',
			unitTypes: 'Luxury Studios (~650 sqft, fully furnished)',
			towerHeight: 'G+40 Floors (2 Towers)',
			clubhouse: '45,000 sqft',
			township: '250-Acre Gaur Yamuna City',
		},
	},

	// ──────────────────────────────────────────────────
	// 8. THE CORE ULTRA WIDE TOWER
	// ──────────────────────────────────────────────────
	{
		slug: 'core-ultra-wide',
		name: 'The Core Ultra Wide Tower',
		type: 'Mixed-Use Commercial',
		developer: 'Indumaa (RERA Promoter: Concept Capital Infra Projects)',
		location: 'Crossing Republik, Near Gaur City, Ghaziabad, NCR',
		projectLink: '/sell-companies/core-ultra-wide',
		overallScore: 4.0,
		scores: [
			{ ...SCORE_DIMENSIONS[0], value: 4.0 },
			{ ...SCORE_DIMENSIONS[1], value: 4.3 },
			{ ...SCORE_DIMENSIONS[2], value: 4.1 },
			{ ...SCORE_DIMENSIONS[3], value: 3.9 },
			{ ...SCORE_DIMENSIONS[4], value: 3.7 },
		],
		highlights: [
			'Unique mixed-use concept with 5 revenue streams: Retail, Dining, Cinema, Hotel Suites, Sky Lounge',
			'FashionTV (FTV) Sky Bar & Lounge on Level 10 — exclusive rooftop destination in NCR',
			'Zudio anchor retail across Ground and Level 1 — Tier-1 brand ensuring consistent footfall',
			'MAD Cinemas Multiplex on Level 3 with Dolby Atmos and VIP recliners',
			'500,000+ affluent residents in Crossing Republik & Gaur City catchment — strong demand base',
			'RERA-approved (UPRERAPRJ9641) — regulatory compliance confirmed',
		],
		considerations: [
			'G+10 height is relatively modest compared to high-rise commercial towers in the corridor',
			'Indumaa is the marketing face — the RERA-registered promoter is Concept Capital Infra Projects; verify all commitments against the registered builder-buyer agreement',
			'Branded partnerships (FTV, Zudio, MAD) should be independently confirmed as contracted vs aspirational',
			'Crossing Republik market has several competing commercial options — differentiation depends on execution quality',
		],
		bestFor: ['Commercial Investors', 'Passive Income Seekers', 'Retail Entrepreneurs'],
		overview:
			'The Core Ultra Wide Tower by Indumaa is a G+10 mixed-use commercial development located at Crossing Republik, near Gaur City, Ghaziabad. RERA-approved (UPRERAPRJ9641), the project\'s unique proposition is its vertically integrated concept with five distinct revenue streams across 10 floors: Zudio anchor retail (Ground & Level 1), gourmet dining terrace (Level 2), MAD Cinemas multiplex (Level 3), executive hotel studio suites (Levels 4–9), and a FashionTV (FTV) Sky Bar & Rooftop Lounge (Level 10). The project is positioned to serve a catchment of 500,000+ affluent residents in the Crossing Republik and Gaur City micro-market. The Sushant Aquapolis township location provides additional footfall from the residential community.',
		verdict:
			'The Core Ultra Wide Tower stands out for its creative mixed-use concept — the combination of anchor retail, multiplex, dining, hotel suites, and an FTV sky lounge under one roof is distinctive. For commercial investors seeking diversified revenue exposure, the concept is appealing. However, execution risk is the key variable — buyers should independently verify the status of brand tie-ups (FTV, Zudio, MAD Cinemas) and assess Indumaa\'s delivery capability. The strong catchment area of 500,000+ residents is a solid demand fundamental. Best suited for investors comfortable with commercial real estate risk and a medium-term investment horizon.',
		keyFacts: {
			rera: 'UPRERAPRJ9641',
			bsp: 'Contact for pricing',
			unitTypes: 'Retail, Hotel Suites, F&B Spaces',
			towerHeight: 'G+10 Floors',
			catchment: '500,000+ Residents',
			anchor: 'Zudio, FTV, MAD Cinemas',
		},
	},
];

// Filter out paradise-city for now since it is hidden on the main site
export const PROJECT_REVIEWS = ALL_PROJECT_REVIEWS.filter(p => p.slug !== 'paradise-city');

// ────────────────────────────────────────────────────────────────────────
// HELPER — get review data by slug
// ────────────────────────────────────────────────────────────────────────
export function getProjectReview(slug) {
	return PROJECT_REVIEWS.find((p) => p.slug === slug) || null;
}

// ────────────────────────────────────────────────────────────────────────
// EXPORTS — score dimensions for use in the review page component
// ────────────────────────────────────────────────────────────────────────
export { SCORE_DIMENSIONS };
