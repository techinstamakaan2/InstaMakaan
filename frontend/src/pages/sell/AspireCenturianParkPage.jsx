import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	MapPin, Building2, Check, ArrowRight, Download,
	Star, Shield, ChevronRight, X, Home,
	Award, Phone, MessageCircle, ChevronLeft,
	ChevronDown, ArrowUp,
	Bed, ChefHat, Sofa, BookOpen, Droplets, Wind, Layers,
} from 'lucide-react';

/* ─── image base ─── */
const B = '/images/aspire-centurian-park';
const I = {
	heroBg:        `${B}/connectivity.jpg`,          // towers front render (verified photo)
	logoAcp:       `${B}/logo-acp-boxed.png`,        // "Aspire Centurian Park by GAURS" gold box
	logoGaurs:     `${B}/logo-gaurs-hq.png`,         // GAURS your own world
	towersStats:   `${B}/towers-overview.jpg`,       // towers + key stats (4.85ha, 11 towers…)
	masterpieceArt:`${B}/hero-render.jpg`,           // dried flower parchment "A Living Masterpiece"
	lifestyleInt:  `${B}/tower-view.jpg`,            // luxury interior "Because Where You Live Counts"
	iconicBalcony: `${B}/master-plan.jpg`,           // sunset balcony Iconic Tower
	chapmanTaylor: `${B}/amenities.jpg`,             // Chapman Taylor architect page
	connectivity:  `${B}/aerial-view.jpg`,           // car + distances map
	locationMap:   `${B}/site-plan.jpg`,             // satellite location map with nearby places
	locationNearby:`${B}/location-map.jpg`,          // towers + distance badges
	clubhouse:     `${B}/pool.jpg`,                  // clubhouse glass building exterior
	poolAerial:    `${B}/garden.jpg`,                // aerial pool "Soak in Serenity"
	lilyPond:      `${B}/sports.jpg`,                // lily pond garden
	amenityList1:  `${B}/amenity-detail-1.jpg`,      // Sports Zone + Aqua Zone list
	centralGreens: `${B}/amenity-detail-2.jpg`,      // central greens tower render
	reflexology:   `${B}/amenity-detail-3.jpg`,      // reflexology park + butterfly garden
	petsPark:      `${B}/amenity-detail-4.jpg`,      // pets park + central & theme garden
	gymYoga:       `${B}/amenity-detail-5.jpg`,      // gym + yoga
	seniorLib:     `${B}/amenity-detail-6.jpg`,      // senior citizen + library
	amenityList2:  `${B}/amenity-detail-7.jpg`,      // Interactive Zone + Undercroft Zone list
	masterPlan:    `${B}/floor-plan-4.jpg`,          // full master plan (64 amenities numbered)
	masterPlanMap: `${B}/master-plan-map.jpg`,       // cropped map only (text removed)
	sitePlan:      `${B}/floor-plan-5.jpg`,          // site plan color-coded
	fpIntro:       `${B}/floor-plan-3.jpg`,          // "Live Grand with Spacious Plans" line drawing
	fpLiving:      `${B}/floor-plan-1.jpg`,          // luxury living room render
	fpBedroom:     `${B}/floor-plan-2.jpg`,          // luxury bedroom render
	fpIconic:      `${B}/floor-plan-6.jpg`,          // Iconic Tower floor plan
	fpUnit1:       `${B}/floor-plan-7.jpg`,          // Unit 1 floor plan
	fpUnit2:       `${B}/floor-plan-8.jpg`,          // Unit 2 floor plan
	fpUnit3:       `${B}/floor-plan-9.jpg`,          // Unit 3 floor plan
	fpUnit4:       `${B}/floor-plan-10.jpg`,         // Unit 4 floor plan
	specs:         `${B}/floor-plan-11.jpg`,         // Tower Specifications
	lobbyIconic:   `${B}/iconic-tower.jpg`,          // Iconic Tower lobby render
	lobbyTypical:  `${B}/typical-tower.jpg`,         // Typical Tower lobby render
	developerMiles:`${B}/developer.jpg`,             // Gaurs Milestones chess board
	gaursAwards:   `${B}/floor-plan-12.jpg`,         // 3 Decades of Trust & Triumphs
	approvalBadge: `${B}/approval-badge.jpg`,        // SC Court approval + "The Iconic Landmark"
	logoAcpClean:    `${B}/logo-acp-boxed.png`,      // Aspire gold logo PNG
	logoIconicTower: `${B}/logo-strip.jpeg`,         // "ICONIC TOWER" gold text
	kidsPlay:        `${B}/lobby.jpg`,               // kids play area
	joggingTrack:    `${B}/interior.jpg`,            // jogging track
	gardenGazebo:    `${B}/exterior.jpg`,            // garden gazebo
	lifestyleWoman:  `${B}/amenities-2.jpg`,         // woman geometric — "Residences That Redefine Opulence"
	locationMapFull: `${B}/clubhouse.jpg`,           // satellite location map with Aspire pin + landmarks
};

/* ─── EXACT DATA FROM BROCHURE PDF ─── */
const PROJECT = {
	name:       'Aspire Centurian Park',
	byLine:     'by GAURS',
	tagline:    'Grand Luxury Residences',
	location:   'Plot No. GH-05, Techzone-4, Greater Noida (W)',
	architect:  'Chapman Taylor',
	phone:      '+919771034916',
	phoneDisplay: '+91 97710 34916',
	wa:         'https://wa.aisensy.com/aabbf5',
	brochure:   '/brochures/aspire-centurian-park-brochure.pdf',
};

const STATS = [
	{ label: 'Project Expanse',     value: '12 Acres',   sub: 'Approx 4.85 Hectares' },
	{ label: 'Towers',             value: '11',          sub: 'Including Iconic Tower' },
	{ label: 'Iconic Tower',       value: '45 Floors',   sub: 'Tallest in Gr. Noida (W)' },
	{ label: 'Clubhouse',          value: '40,000 sq.ft',sub: '3716 sq.mtr · 5-Star Lavish' },
	{ label: 'Green Park',         value: '10 Acres',    sub: 'Next to Project' },
	{ label: 'Lifts (Typical)',    value: '4',           sub: 'Per Typical Tower' },
];

const UNIT_TYPES = [
	{
		label:     'Iconic Tower',
		towers:    'Tower I-1, I-2, I-3',
		type:      '4 BHK + 5T',
		sqmtr:     '358.79 sq.mtr',
		sqft:      3862,
		bsp:       14000,
		carpet:    '198.99 sq.mtr / 2142 sq.ft',
		balcony:   '64.28 sq.mtr / 692 sq.ft',
		builtup:   '275.91 sq.mtr / 2970 sq.ft',
		fpImg:     I.fpIconic,
		tag:       'ICONIC',
		gold:      true,
	},
	{
		label:     'Unit 1',
		towers:    'Tower 1 to 10',
		type:      '4 BHK + Study + 5T',
		sqmtr:     '312.15 sq.mtr',
		sqft:      3360,
		bsp:       13000,
		carpet:    '180.78 sq.mtr / 1946 sq.ft',
		balcony:   '47 sq.mtr / 506 sq.ft',
		builtup:   '241.17 sq.mtr / 2996 sq.ft',
		fpImg:     I.fpUnit1,
		tag:       '',
		gold:      false,
	},
	{
		label:     'Unit 2',
		towers:    'Tower 1 to 10',
		type:      '4 BHK + Study + 5T',
		sqmtr:     '312.24 sq.mtr',
		sqft:      3361,
		bsp:       13000,
		carpet:    '180.78 sq.mtr / 1946 sq.ft',
		balcony:   '46.73 sq.mtr / 503 sq.ft',
		builtup:   '241.26 sq.mtr / 2597 sq.ft',
		fpImg:     I.fpUnit2,
		tag:       '',
		gold:      false,
	},
	{
		label:     'Unit 3',
		towers:    'Tower 1 to 10',
		type:      '3 BHK + Study + 4T',
		sqmtr:     '255.11 sq.mtr',
		sqft:      2746,
		bsp:       13000,
		carpet:    '149.98 sq.mtr / 1614 sq.ft',  // approx from plan
		balcony:   '35.11 sq.mtr / 378 sq.ft',
		builtup:   '196.48 sq.mtr / 2115 sq.ft',
		fpImg:     I.fpUnit3,
		tag:       'POPULAR',
		gold:      false,
	},
	{
		label:     'Unit 4',
		towers:    'Tower 1 to 10',
		type:      '3 BHK + Study + 4T',
		sqmtr:     '257.52 sq.mtr',
		sqft:      2772,
		bsp:       13000,
		carpet:    '148.84 sq.mtr / 1600 sq.ft',
		balcony:   '38.55 sq.mtr / 415 sq.ft',
		builtup:   '199.18 sq.mtr / 2144 sq.ft',
		fpImg:     I.fpUnit4,
		tag:       '',
		gold:      false,
	},
];

/* EXACT FROM PRICE LIST PDF (W.E.F. 21 JAN 2026) */
const FLOOR_PLC_ICONIC = [
	{ floor: '1st – 5th',      plc: 750 },
	{ floor: '6th – 10th',     plc: 700 },
	{ floor: '11th – 15th',    plc: 600 },
	{ floor: '16th – 20th',    plc: 500 },
	{ floor: '21st – 25th',    plc: 400 },
	{ floor: '26th – 30th',    plc: 300 },
	{ floor: '31st & Above',   plc: 200 },
	{ floor: 'Top Floor',      plc: 0   },
];
const FLOOR_PLC_TYPICAL = [
	{ floor: '1st – 5th',      plc: 750 },
	{ floor: '6th – 10th',     plc: 700 },
	{ floor: '11th – 15th',    plc: 600 },
	{ floor: '16th – 20th',    plc: 500 },
	{ floor: '21st – 25th',    plc: 400 },
	{ floor: '26th – 29th',    plc: 300 },
	{ floor: '30th Floor',     plc: 0   },
];
const VIEW_PLC = [
	{ view: 'Central Greens',  plc: 400 },
	{ view: 'Road Facing',     plc: 300 },
	{ view: 'Corner Unit',     plc: 200 },
];
const ADD_CHARGES = [
	{ name: '1 Parking Slot',                  val: '₹5,50,000' },
	{ name: 'Club Membership',                 val: '₹7,00,000' },
	{ name: 'Power Backup (upto 3.5 KVA)',     val: '₹2,00,000' },
	{ name: 'Electricity Infrastructure',      val: '₹1,00,000' },
	{ name: 'IFMS',                            val: '₹25 / sq.ft' },
	{ name: 'Lease Rent',                      val: '₹50 / sq.ft' },
	{ name: 'Additional Car Parking',          val: '₹3,50,000 + taxes' },
	{ name: 'Maintenance',                     val: '₹2.99 / sq.ft + GST 18%' },
];

/* EXACT FROM PAYMENT PLAN PDF */
const CLP = [
	{ milestone: 'On Booking',                            pct: 10  },
	{ milestone: 'Within 45 Days from Booking',           pct: 10  },
	{ milestone: 'On Start of Rafting',                   pct: 5   },
	{ milestone: 'On Start of Lower Basement',            pct: 5   },
	{ milestone: 'On Completion of Ground Floor',         pct: 10  },
	{ milestone: 'On Completion of 4th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 9th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 14th Floor Roof',      pct: 7.5 },
	{ milestone: 'On Completion of 19th Floor Roof',      pct: 7.5 },
	{ milestone: 'On Completion of 24th Floor Roof',      pct: 7.5 },
	{ milestone: 'On Completion of 29th Floor Roof',      pct: 5   },
	{ milestone: 'On Completion of Super Structure',      pct: 7.5 },
	{ milestone: 'On Start of MEP / Flooring / Finishing',pct: 5   },
	{ milestone: 'On Offer of Possession',                pct: 5   },
];
const SPECIAL_PLAN = [
	{ milestone: 'On Booking',                              pct: 10  },
	{ milestone: '5% per Month (in 3 months)',              pct: 15  },
	{ milestone: 'On Completion of 20th Floor',             pct: 25  },
	{ milestone: 'On Completion of Top Floor (25th Floor)', pct: 25  },
	{ milestone: 'On Offer for Possession',                 pct: 25  },
];

/* EXACT FROM BROCHURE - ALL 64 AMENITIES (numbered on master plan) */
const AMENITY_ZONES = [
	{
		zone: 'Sports Zone',
		color: '#d97706',
		items: [
			'Badminton Court','Basketball Court','Billiard\'s Area','Box Cricket',
			'Jogging Track','Kids Play Area','Toddler\'s Development & Play Area',
			'Mound & Sculpture Area','Adventures Play Area','Lawn Tennis',
			'Skating Rink','Table Tennis','Volleyball Court',
		],
	},
	{
		zone: 'Aqua Zone',
		color: '#1a7fa0',
		items: [
			'Swimming Pool','Kids Pool','Deck','Floating Cabana',
			'Jacuzzi','Fountain','Gazebo','Lily Pond',
		],
	},
	{
		zone: 'Interactive Zone',
		color: '#2d7a3a',
		items: [
			'Birds & Butterfly Garden','Central Green','Flower Garden','Herbs Garden',
			'Manicured Landscape','Nature Walk','Palm Court','Reflexology Garden',
			'Theme Garden','Urban Garden','Party Lawn','Amphitheater',
			'Maze Runner','Pergola','Pets Park',
		],
	},
	{
		zone: 'Undercroft Zone',
		color: '#6a3fa6',
		items: [
			'Yoga & Zumba','Co-working Spaces','Open Gym','Ladies Corner',
			'Library','Maintenance Room','Multipurpose Room','Senior Citizen Area',
			'Community Cooking Area','Meditation Area',
		],
	},
];

const CONNECTIVITY = [
	{ dist: '2 kms',  place: 'Gaur Chowk (Upcoming Metro Station)' },
	{ dist: '6 kms',  place: 'Noida' },
	{ dist: '9 kms',  place: 'Sector 71, Noida' },
	{ dist: '25 kms', place: 'Hindon Airport' },
	{ dist: '42 kms', place: 'IGI Airport, Delhi' },
	{ dist: '65 kms', place: 'Upcoming Noida International Airport, Jewar' },
];

const NEARBY = {
	'Conveniences':      ['D-Mart — 0.75 kms', 'Gaur City Mall — 2 kms'],
	'Schools':           ['Ryan International School — 0.3 kms', 'Gaurs International School — 4.2 kms'],
	'Hotels':            ['The Gaurs Sarovar Premiere — 5 kms', 'Radisson Blu (under development) — 2 kms'],
	'Hospitals':         ['Sarvodaya Hospital — 4.2 kms', 'Fortis Hospital, Sector 62 — 9 kms'],
	'Railway Stations':  ['Ghaziabad — 12 kms', 'New Delhi — 30 kms'],
	'Metro Stations':    ['Gaur Chowk (Upcoming) — 2 kms', 'Sector 51 — 8 kms'],
};

const BANK = {
	name:    'UCO Bank',
	account: 'Receiver Amp. New Unit Sale – Centurian Park Phase – III',
	branch:  'Supreme Court India Building, Tilak Marg, New Delhi – 110001',
	accNo:   '02070210004678',
	ifsc:    'UCBA0000207',
};

const MASTER_PLAN_AMENITIES = [
	{ n:  1, name: 'Entry Portal 01' },
	{ n:  2, name: 'Entry Portal 02' },
	{ n:  3, name: 'Surface Parking' },
	{ n:  4, name: 'Fire Tender Ramp for Podium' },
	{ n:  5, name: 'Grand Stairs to the Podium' },
	{ n:  6, name: 'Water Sheet Fall' },
	{ n:  7, name: 'Way to Tower' },
	{ n:  8, name: 'Water Fountain' },
	{ n:  9, name: 'Community Center' },
	{ n: 10, name: 'Pool' },
	{ n: 11, name: 'Kids Pool' },
	{ n: 12, name: 'Jacuzzi' },
	{ n: 13, name: 'Floating Cabana' },
	{ n: 14, name: 'Deck' },
	{ n: 15, name: 'Mound & Sculpture Court' },
	{ n: 16, name: 'Party Lawn' },
	{ n: 17, name: 'Central Green' },
	{ n: 18, name: 'Amphitheater' },
	{ n: 19, name: "Kid's Play Area" },
	{ n: 20, name: "Toddler's Development & Play Area" },
	{ n: 21, name: 'Adventures Play Area' },
	{ n: 22, name: 'Traditional Games Zone' },
	{ n: 23, name: 'Ladies Corner' },
	{ n: 24, name: 'Board Games Area' },
	{ n: 25, name: 'Yoga / Zumba / Aerobics' },
	{ n: 26, name: 'Senior Citizen Area' },
	{ n: 27, name: 'Outdoor Gym' },
	{ n: 28, name: 'Multipurpose Room' },
	{ n: 29, name: 'Co-Working Room' },
	{ n: 30, name: 'Maintenance Room' },
	{ n: 31, name: 'Meditation Room' },
	{ n: 32, name: 'Community Cooking / Dining — Veg' },
	{ n: 33, name: 'Community Cooking / Dining — Non-Veg' },
	{ n: 34, name: 'Gentlemen Area' },
	{ n: 35, name: 'Youth Corner' },
	{ n: 36, name: 'Library' },
	{ n: 37, name: 'Lawn Tennis Court' },
	{ n: 38, name: 'Half Basketball Court' },
	{ n: 39, name: 'Volleyball Court' },
	{ n: 40, name: 'Box Cricket' },
	{ n: 41, name: 'Skating Rink' },
	{ n: 42, name: 'Badminton Court' },
	{ n: 43, name: 'Table Tennis' },
	{ n: 44, name: 'Billiards Area' },
	{ n: 45, name: 'Maze Runner' },
	{ n: 46, name: 'Jogging Track' },
	{ n: 47, name: 'Pets Garden' },
	{ n: 48, name: 'Butterfly Garden' },
	{ n: 49, name: "Birds' Park" },
	{ n: 50, name: 'Theme Garden' },
	{ n: 51, name: "Herb's Garden" },
	{ n: 52, name: 'Urban Farming' },
	{ n: 53, name: 'Nature Walk' },
	{ n: 54, name: 'Flower Garden' },
	{ n: 55, name: 'Manicured Landscape' },
	{ n: 56, name: 'Mangroves' },
	{ n: 57, name: 'Guava Orchard' },
	{ n: 58, name: 'Gazebo' },
	{ n: 59, name: 'Lily Pond' },
	{ n: 60, name: 'Pergola' },
	{ n: 61, name: 'Xeriscape Garden' },
	{ n: 62, name: 'Palm Court' },
	{ n: 63, name: 'Reflexology Path' },
	{ n: 64, name: 'Feature Wall' },
];

const GAURS_MILESTONES = [
	{ val: '3 Decades', label: 'of Unfaltering Commitment' },
	{ val: '70+',       label: 'Successfully Delivered Projects' },
	{ val: '75,000+',   label: 'Total Delivered Units' },
	{ val: '1,00,000+', label: 'Satisfied Customers' },
	{ val: '35',        label: 'Delivered Residential Projects' },
	{ val: '30',        label: 'Delivered Commercial Projects' },
	{ val: '3',         label: 'Township Projects' },
	{ val: '4',         label: 'Schools' },
	{ val: '2',         label: 'Retail Projects (Malls)' },
	{ val: '2',         label: 'Hotels' },
];

const ICONIC_SPECS = [
	{ room: 'Master Bedroom', emoji: '🛏️', specs: [
		{ label: 'Flooring', value: 'Laminated Wooden Flooring' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Bedroom', emoji: '🛏️', specs: [
		{ label: 'Flooring', value: 'Laminated Wooden Flooring' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Kitchen', emoji: '🍳', specs: [
		{ label: 'Flooring', value: 'Antiskid Vitrified Tile' },
		{ label: 'Wall', value: 'Ceramic Tile, Low Voc Plastic Emulsion Paint' },
		{ label: 'Window', value: 'UPVC Frame With Door' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Cooking Platform', value: 'Quartz Stone' },
		{ label: 'Sink & Cabinets', value: 'SS Sink Double Bowl, CP Fittings, Modular Kitchen' },
	]},
	{ room: 'Dining — Living Room', emoji: '🛋️', specs: [
		{ label: 'Flooring', value: 'Italian Marble' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
	]},
	{ room: 'Study Room', emoji: '📚', specs: [
		{ label: 'Flooring', value: 'Vitrified Tiles' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Bathroom', emoji: '🚿', specs: [
		{ label: 'Flooring', value: 'Master & Powder Room: Italian Marble · Other: Vitrified Tile' },
		{ label: 'Wall', value: 'Master & Powder Room: Italian Marble · Other: Vitrified Tile' },
		{ label: 'Ceiling', value: 'Grid Ceiling' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Balcony', emoji: '🌿', specs: [
		{ label: 'Flooring', value: 'Antiskid Vitrified Flooring' },
		{ label: 'Railing', value: 'Glass Railing — Aluminium Extrude Section' },
		{ label: 'Door', value: 'UPVC Sliding Door Cum Window with Clear Glass' },
	]},
	{ room: 'Staircase', emoji: '🪜', specs: [
		{ label: 'Flooring', value: 'Granite Stone' },
		{ label: 'Ceiling', value: 'Low Voc Premium Acrylic Emulsion Paint' },
		{ label: 'Railing', value: 'Duco Painted MS Railing' },
	]},
	{ room: 'Lift Lobbies', emoji: '🛗', specs: [
		{ label: 'Flooring', value: 'Stilt & Ground: Italian Marble · Typical Floors: Granite Stone' },
		{ label: 'Ceiling', value: 'Gypsum False Ceiling — Acrylic Emulsion Paint' },
	]},
	{ room: 'Exterior Wall Finish', emoji: '🏛️', specs: [
		{ label: 'Paint', value: 'Quartz Reinforced Textured Paint' },
	]},
];

const TYPICAL_SPECS = [
	{ room: 'Master Bedroom', emoji: '🛏️', specs: [
		{ label: 'Flooring', value: 'Laminated Wooden Flooring' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Bedroom', emoji: '🛏️', specs: [
		{ label: 'Flooring', value: 'Vitrified Tiles' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Kitchen', emoji: '🍳', specs: [
		{ label: 'Flooring', value: 'Antiskid Vitrified Tile' },
		{ label: 'Wall', value: 'Ceramic Tile, Low Voc Plastic Emulsion Paint' },
		{ label: 'Window', value: 'UPVC Frame With Door' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Cooking Platform', value: 'Quartz Stone' },
		{ label: 'Sink & Cabinets', value: 'SS Sink Double Bowl, CP Fittings, Modular Kitchen' },
	]},
	{ room: 'Dining — Living Room', emoji: '🛋️', specs: [
		{ label: 'Flooring', value: 'Vitrified Tiles' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
	]},
	{ room: 'Study Room', emoji: '📚', specs: [
		{ label: 'Flooring', value: 'Vitrified Tiles' },
		{ label: 'Wall', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Ceiling', value: 'Low Voc Plastic Emulsion Paint' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Bathroom', emoji: '🚿', specs: [
		{ label: 'Flooring', value: 'Vitrified Tile' },
		{ label: 'Wall', value: 'Ceramic Tile' },
		{ label: 'Ceiling', value: 'Grid Ceiling' },
		{ label: 'Door', value: 'Factory Laminated Flush Door with Frame' },
	]},
	{ room: 'Balcony', emoji: '🌿', specs: [
		{ label: 'Flooring', value: 'Antiskid Vitrified Flooring' },
		{ label: 'Railing', value: 'Glass Railing — Aluminium Extrude Section' },
		{ label: 'Door', value: 'UPVC Sliding Door Cum Window with Clear Glass' },
	]},
	{ room: 'Staircase', emoji: '🪜', specs: [
		{ label: 'Flooring', value: 'Granite Stone' },
		{ label: 'Ceiling', value: 'Low Voc Premium Acrylic Emulsion Paint' },
		{ label: 'Railing', value: 'Duco Painted MS Railing' },
	]},
	{ room: 'Lift Lobbies', emoji: '🛗', specs: [
		{ label: 'Flooring', value: 'Stilt & Ground: Italian Marble · Typical Floors: Granite Stone' },
		{ label: 'Ceiling', value: 'Gypsum False Ceiling — Acrylic Emulsion Paint' },
	]},
	{ room: 'Exterior Wall Finish', emoji: '🏛️', specs: [
		{ label: 'Paint', value: 'Quartz Reinforced Textured Paint' },
	]},
];

const AMENITY_SLIDES = [
	{ img: I.amenityList1,   caption: 'Exceptional Clubhouse — Pool Deck & Lounge',           label: 'Pool Deck' },
	{ img: I.centralGreens,  caption: 'Central Greens — Nature in Perfect Harmony',           label: 'Central Greens' },
	{ img: I.poolAerial,     caption: 'Soak in Serenity. Swim in Style.',                     label: 'Swimming Pool' },
	{ img: I.lilyPond,       caption: 'Lily Pond Bliss Meets Flowing Elegance',               label: 'Lily Pond' },
	{ img: I.gardenGazebo,   caption: 'Bask in Serene Beauty at the Garden Gazebos',          label: 'Garden Gazebo' },
	{ img: I.reflexology,    caption: 'Reflexology Park for a Healthier You',                  label: 'Reflexology Park' },
	{ img: I.petsPark,       caption: 'Pets Park — For Your Fur Babies',                      label: 'Pets Park' },
	{ img: I.gymYoga,        caption: 'Elevated Fitness — Everyday Excellence',               label: 'Gym & Fitness' },
	{ img: I.seniorLib,      caption: 'Library & Knowledge Hub for All Ages',                 label: 'Library' },
	{ img: I.kidsPlay,       caption: 'Play Area to Nurture Joy & Growth',                    label: 'Kids Play Area' },
	{ img: I.joggingTrack,   caption: 'A Jogging Track Crafted for the Elite Stride',         label: 'Jogging Track' },
	{ img: I.amenityList2,   caption: 'Central Greens After Dark — Outdoor Lounge & Gardens', label: 'Outdoor Lounge' },
];

/* ── helpers ── */
const fmtINR = (n) =>
	n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr*` : `₹${(n / 100000).toFixed(0)} L*`;

/* ── Shared sub-components ── */

/* ══════════════════════════════════════════════
   ANIMATION SYSTEM
══════════════════════════════════════════════ */
const GLOBAL_CSS = `
	@keyframes acpKenburns { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
	@keyframes acpFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
	@keyframes acpFadeIn { from { opacity: 0; } to { opacity: 1; } }
	@keyframes acpZoomIn { from { opacity: 0; transform: scale(.94) translateY(12px); } to { opacity: 1; transform: none; } }
	@keyframes acpShine { 0% { left: -90%; } 60%, 100% { left: 130%; } }
	@keyframes acpFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
	@keyframes acpBounceDown { 0%, 100% { transform: translateY(0); opacity: .9; } 50% { transform: translateY(7px); opacity: .5; } }
	@keyframes acpGrowBar { from { width: 0; } }

	.acp-hero-anim { opacity: 0; animation: acpFadeUp .85s cubic-bezier(.22,1,.36,1) forwards; }
	.acp-kenburns { animation: acpKenburns 22s ease-out forwards; }
	.acp-float { animation: acpFloat 4.5s ease-in-out infinite; }
	.acp-bounce-down { animation: acpBounceDown 2s ease-in-out infinite; }
	.acp-zoom-in { animation: acpZoomIn .35s cubic-bezier(.22,1,.36,1) both; }
	.acp-fade-in { animation: acpFadeIn .3s ease both; }
	.acp-grow-bar { animation: acpGrowBar 1s cubic-bezier(.22,1,.36,1) both; }

	.acp-shine { position: relative; overflow: hidden; }
	.acp-shine::after {
		content: ''; position: absolute; top: 0; left: -90%;
		width: 45%; height: 100%;
		background: linear-gradient(105deg, transparent, rgba(255,255,255,.38), transparent);
		transform: skewX(-20deg);
		animation: acpShine 3.4s ease-in-out infinite;
		pointer-events: none;
	}
	.acp-img-hover { transition: transform .7s cubic-bezier(.22,1,.36,1); }
	.group:hover .acp-img-hover { transform: scale(1.06); }
	.acp-card-lift { transition: transform .3s ease, box-shadow .3s ease; }
	.acp-card-lift:hover { transform: translateY(-5px); box-shadow: 0 18px 40px -12px rgba(180,120,20,.28); }
	.acp-scrollbar-none::-webkit-scrollbar { display: none; }
	.acp-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
	html { scroll-behavior: smooth; }
	section[id] { scroll-margin-top: 84px; }
	@media (prefers-reduced-motion: reduce) {
		.acp-hero-anim, .acp-kenburns, .acp-float, .acp-bounce-down,
		.acp-zoom-in, .acp-fade-in, .acp-grow-bar { animation: none !important; opacity: 1 !important; transform: none !important; }
		.acp-shine::after { animation: none !important; display: none; }
		html { scroll-behavior: auto; }
	}
`;

const prefersReduced = () =>
	typeof window !== 'undefined' && window.matchMedia &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useInView = (threshold = 0.15) => {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (prefersReduced() || typeof IntersectionObserver === 'undefined') { setVis(true); return; }
		const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold, rootMargin: '0px 0px -40px 0px' });
		ob.observe(el);
		return () => ob.disconnect();
	}, [threshold]);
	return [ref, vis];
};

const Reveal = ({ children, delay = 0, x = 0, y = 26, className = '' }) => {
	const [ref, vis] = useInView();
	return (
		<div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : `translate(${x}px,${y}px)`, transition: `opacity .7s ease ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`, willChange: 'opacity, transform' }}>
			{children}
		</div>
	);
};

const Counter = ({ text, duration = 1500 }) => {
	const m = String(text).match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
	const [ref, vis] = useInView(0.4);
	const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0;
	const [val, setVal] = useState(0);
	useEffect(() => {
		if (!vis || !m) return;
		if (prefersReduced()) { setVal(target); return; }
		let raf;
		const t0 = performance.now();
		const tick = (t) => { const p = Math.min(1, (t - t0) / duration); setVal(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [vis]); // eslint-disable-line react-hooks/exhaustive-deps
	if (!m) return <span>{text}</span>;
	const display = m[2].includes('.') ? val.toFixed(2) : Math.round(val).toLocaleString('en-IN');
	return <span ref={ref}>{m[1]}{display}{m[3]}</span>;
};

const ScrollProgress = () => {
	const [p, setP] = useState(0);
	useEffect(() => {
		const onScroll = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; setP(max > 0 ? h.scrollTop / max : 0); };
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);
	return <div className="fixed top-0 left-0 z-[60] h-[3px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,.6)]" style={{ width: `${p * 100}%`, transition: 'width .1s linear' }} />;
};

const FloatingActions = () => {
	const [show, setShow] = useState(false);
	useEffect(() => {
		const f = () => setShow(window.scrollY > 600);
		f(); window.addEventListener('scroll', f, { passive: true });
		return () => window.removeEventListener('scroll', f);
	}, []);
	return (
		<div className="fixed right-4 bottom-20 md:bottom-6 z-40 flex flex-col gap-3 items-end">
			<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
				className="hidden md:flex acp-float w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white items-center justify-center shadow-xl shadow-green-600/30 transition" aria-label="Chat on WhatsApp">
				<MessageCircle size={22} />
			</a>
			<button onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })} aria-label="Back to top"
				className={`w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-amber-600 hover:text-white ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
				<ArrowUp size={17} />
			</button>
		</div>
	);
};

const PER_SLIDE = 16;
const TOTAL_SLIDES = Math.ceil(64 / PER_SLIDE);

const AmenitiesSlider = () => {
	const [slide, setSlide] = useState(0);
	const prev = () => setSlide(s => (s - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
	const next = () => setSlide(s => (s + 1) % TOTAL_SLIDES);
	const items = MASTER_PLAN_AMENITIES.slice(slide * PER_SLIDE, slide * PER_SLIDE + PER_SLIDE);
	const from = slide * PER_SLIDE + 1;
	const to   = Math.min(slide * PER_SLIDE + PER_SLIDE, 64);
	return (
		<div className="flex flex-col gap-5">
			{/* header row */}
			<div className="flex items-center justify-between border-b border-amber-300/50 pb-3">
				<span className="text-[11px] font-bold text-amber-600 tracking-[0.2em] uppercase">
					{from}–{to} <span className="text-slate-400 font-normal">/ 64 amenities</span>
				</span>
				<div className="flex items-center gap-1.5">
					<button onClick={prev} className="w-7 h-7 rounded-full hover:bg-amber-100 flex items-center justify-center transition text-amber-700">
						<ChevronLeft size={16} />
					</button>
					<button onClick={next} className="w-7 h-7 rounded-full hover:bg-amber-100 flex items-center justify-center transition text-amber-700">
						<ChevronRight size={16} />
					</button>
				</div>
			</div>

			{/* grid */}
			<div key={slide} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0 acp-fade-in">
				{items.map((a, i) => (
					<div key={a.n} className="flex items-center gap-3 py-2.5 border-b border-amber-200/40 last:border-0"
						style={{ animation: prefersReduced() ? 'none' : `acpFadeUp .4s ease ${i * 22}ms both` }}>
						<span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
							{a.n}
						</span>
						<span className="text-slate-700 text-[13px] leading-snug">{a.name}</span>
					</div>
				))}
			</div>

			{/* dots */}
			<div className="flex items-center gap-1.5 pt-1">
				{Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
					<button key={i} onClick={() => setSlide(i)} aria-label={`Amenities page ${i + 1}`}
						className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-1.5 bg-amber-600' : 'w-1.5 h-1.5 bg-amber-300 hover:bg-amber-500'}`}
					/>
				))}
			</div>
		</div>
	);
};

const SPEC_ICON_MAP = {
	'Master Bedroom': Bed, 'Bedroom': Bed, 'Kitchen': ChefHat,
	'Dining — Living Room': Sofa, 'Study Room': BookOpen,
	'Bathroom': Droplets, 'Balcony': Wind,
	'Staircase': Layers, 'Lift Lobbies': Building2,
	'Exterior Wall Finish': Home,
};

const SpecsPanel = () => {
	const [tab, setTab]           = useState('iconic');
	const [roomIdx, setRoomIdx]   = useState(0);
	const specs = tab === 'iconic' ? ICONIC_SPECS : TYPICAL_SPECS;
	const room  = specs[roomIdx] || specs[0];

	const switchTab = (t) => { setTab(t); setRoomIdx(0); };

	return (
		<div>
			{/* Tower toggle */}
			<div className="flex justify-center mb-8">
				<div className="inline-flex rounded-full border border-amber-300/60 overflow-hidden">
					{[
						{ key: 'iconic',  label: 'Iconic Tower',   sub: '45 Floors · 4 BHK+ST' },
						{ key: 'typical', label: 'Typical Towers', sub: 'T1–T10 · 3 & 4 BHK' },
					].map(t => (
						<button key={t.key} onClick={() => switchTab(t.key)}
							className={`px-7 py-2.5 text-sm font-semibold transition-all duration-200 ${
								tab === t.key ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-800 bg-white/40'
							}`}>
							{t.label}
							<span className={`block text-[10px] font-normal leading-tight ${tab === t.key ? 'text-amber-100' : 'text-slate-400'}`}>{t.sub}</span>
						</button>
					))}
				</div>
			</div>

			{/* Split panel */}
			<div className="flex flex-col md:flex-row min-h-[380px]">

				{/* Left: room list — horizontal snap on mobile */}
				<div className="flex md:flex-col overflow-x-auto md:overflow-visible acp-scrollbar-none snap-x snap-mandatory md:snap-none gap-0 md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-r border-amber-200/50 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
					{specs.map((r, i) => {
						const Icon = SPEC_ICON_MAP[r.room] || Home;
						const active = i === roomIdx;
						return (
							<button key={r.room} onClick={() => setRoomIdx(i)}
								className={`flex items-center gap-2.5 px-4 py-3.5 text-left whitespace-nowrap md:whitespace-normal flex-shrink-0 snap-start border-b border-amber-100/50 transition-all duration-200 ${
									active
										? 'text-amber-700 font-semibold border-b-2 border-b-amber-500 md:border-b md:border-b-amber-100/50 md:border-l-2 md:border-l-amber-500 bg-amber-50/40'
										: 'text-slate-500 text-sm hover:text-slate-800 hover:bg-white/20'
								}`}>
								<Icon size={13} className={active ? 'text-amber-600 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
								<span className="text-xs">{r.room}</span>
							</button>
						);
					})}
				</div>

				{/* Right: spec detail */}
				<div key={`${tab}-${roomIdx}`} className="flex-1 md:pl-10 pt-6 md:pt-0 acp-fade-in">
					<div className="flex items-center gap-3 mb-5 border-b border-amber-200/40 pb-4">
						{(() => { const Icon = SPEC_ICON_MAP[room.room] || Home; return (
							<div className="w-9 h-9 rounded-xl bg-amber-100/60 flex items-center justify-center flex-shrink-0">
								<Icon size={16} className="text-amber-600" />
							</div>
						); })()}
						<div>
							<p className="text-xs text-amber-600 font-bold tracking-widest uppercase mb-0.5">
								{tab === 'iconic' ? 'Iconic Tower · 45 Floors' : 'Typical Towers · T1–T10'}
							</p>
							<h3 className="text-xl font-bold text-slate-900">{room.room}</h3>
						</div>
					</div>
					<div className="space-y-0">
						{room.specs.map((s, j) => (
							<div key={j} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3.5 border-b border-amber-100/50 last:border-0"
								style={{ animation: prefersReduced() ? 'none' : `acpFadeUp .4s ease ${j * 50}ms both` }}>
								<span className="text-amber-600 text-sm font-medium sm:w-36 flex-shrink-0">{s.label}</span>
								<span className="text-slate-800 text-sm leading-relaxed">{s.value}</span>
							</div>
						))}
					</div>
					<p className="text-slate-400/60 text-[10px] mt-6">As per brochure · Subject to developer confirmation</p>
				</div>
			</div>
		</div>
	);
};

const GoldDivider = ({ center = true }) => (
	<div className={`flex items-center gap-3 my-4 ${center ? 'justify-center' : ''}`}>
		<div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
		<div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
		<div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
	</div>
);

const SectionHeading = ({ kicker, title, sub, center = true, light = false }) => (
	<Reveal>
		<div className={`mb-8 ${center ? 'text-center' : ''}`}>
			{kicker && (
				<p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-2 text-amber-600">{kicker}</p>
			)}
			<h2 className={`text-2xl md:text-3xl font-bold ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
				{title}
			</h2>
			<GoldDivider center={center} />
			{sub && <p className={`text-sm leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-slate-600 dark:text-slate-400'}`}>{sub}</p>}
		</div>
	</Reveal>
);

/* Lead form — all enquiries go to InstaMakaan */
const ACP_UNITS = [
	'3 BHK + Study — 2746 sq.ft',
	'3 BHK + Study — 2772 sq.ft',
	'4 BHK + Study — 3360 sq.ft',
	'4 BHK + Study — 3361 sq.ft',
	'4 BHK Iconic Tower — 3862 sq.ft',
];

const LeadForm = ({ dark = false, compact = false }) => {
	const [form, setForm] = useState({ name: '', phone: '', query: '' });
	const [sent, setSent] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [err, setErr] = useState('');
	const [ddOpen, setDdOpen] = useState(false);
	const ddRef = useRef(null);

	useEffect(() => {
		if (!ddOpen) return;
		const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
		document.addEventListener('mousedown', h);
		return () => document.removeEventListener('mousedown', h);
	}, [ddOpen]);

	const submit = async (e) => {
		e.preventDefault();
		setSubmitting(true); setErr('');
		try {
			await api.post('/inquiries/', {
				name: form.name,
				phone: form.phone,
				preferred_property_type: form.query || null,
				inquiry_type: 'SELL_ENQUIRY',
				source_page: 'aspire-centurian-park',
				whatsapp_opt_in: false,
			});
			setSent(true);
			setTimeout(() => { setSent(false); setForm({ name: '', phone: '', query: '' }); }, 4000);
		} catch {
			setErr('Something went wrong. Please try again.');
		} finally { setSubmitting(false); }
	};

	if (sent) return (
		<div className={`py-8 text-center rounded-2xl acp-zoom-in ${dark ? 'bg-white/5' : 'bg-amber-50'}`}>
			<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
				<Check className="text-green-600" size={22} />
			</div>
			<p className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Thank you!</p>
			<p className={`text-sm mt-1 ${dark ? 'text-white/60' : 'text-slate-600'}`}>InstaMakaan team will call you shortly.</p>
		</div>
	);

	const inp = dark
		? 'w-full bg-transparent border-b border-white/30 px-0 py-2.5 text-sm text-white placeholder-white/50 focus:border-amber-400 focus:outline-none transition'
		: 'w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition';

	return (
		<form onSubmit={submit} className="space-y-3">
			<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
				placeholder="Your Full Name" className={inp} />
			<div className={`flex items-center ${dark ? 'border-b border-white/30' : 'border border-amber-200 rounded-lg bg-white'}`}>
				<span className={`pl-3 pr-2 text-sm ${dark ? 'text-white/70' : 'text-slate-600'}`}>🇮🇳 +91</span>
				<input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
					placeholder="Phone Number"
					className={`flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none ${dark ? 'text-white placeholder-white/50' : 'text-slate-900 placeholder-slate-400'}`} />
			</div>
			{!compact && (
				<div ref={ddRef} className="relative">
					<button type="button" onClick={() => setDdOpen(o => !o)}
						className={`w-full flex items-center justify-between gap-2 cursor-pointer text-left ${dark
							? 'border-b border-white/30 px-0 py-2.5 text-sm bg-transparent'
							: 'border border-amber-200 rounded-lg px-4 py-2.5 text-sm bg-white'
						}`}>
						<span className={form.query ? (dark ? 'text-white' : 'text-slate-900') : (dark ? 'text-white/50' : 'text-slate-400')}>
							{form.query || 'Select Unit Type'}
						</span>
						<ChevronDown size={15} className={`flex-shrink-0 transition-transform duration-200 ${ddOpen ? 'rotate-180' : ''} ${dark ? 'text-white/50' : 'text-slate-400'}`} />
					</button>
					{ddOpen && (
						<div className={`absolute z-50 top-full mt-1 left-0 right-0 rounded-xl overflow-hidden shadow-2xl border ${dark ? 'border-white/10' : 'border-amber-200'}`}
							style={{ background: dark ? '#2a1800' : '#fff' }}>
							{ACP_UNITS.map(u => (
								<button key={u} type="button"
									onClick={() => { setForm({ ...form, query: u }); setDdOpen(false); }}
									className={`w-full text-left px-4 py-3 text-sm transition-colors ${
										form.query === u
											? (dark ? 'bg-amber-900/50 text-amber-300 font-semibold' : 'bg-amber-50 text-amber-700 font-semibold')
											: (dark ? 'text-white/80 hover:bg-white/5' : 'text-slate-700 hover:bg-amber-50/60')
									}`}>
									{u}
								</button>
							))}
						</div>
					)}
				</div>
			)}
			{err && <p className="text-red-400 text-xs">{err}</p>}
			<p className={`text-[10px] leading-tight ${dark ? 'text-white/40' : 'text-slate-400'}`}>
				By submitting, I authorise InstaMakaan to contact me via call/SMS/WhatsApp regarding this property.
			</p>
			<button type="submit" disabled={submitting}
				className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition acp-shine">
				{submitting ? 'Sending…' : <><span>Enquire via InstaMakaan</span><ArrowRight size={15} /></>}
			</button>
		</form>
	);
};

const PopupModal = ({ open, onClose }) => {
	useEffect(() => {
		if (!open) return;
		const h = (e) => { if (e.key === 'Escape') onClose(); };
		document.addEventListener('keydown', h);
		return () => document.removeEventListener('keydown', h);
	}, [open, onClose]);
	if (!open) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 acp-fade-in">
			<div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative acp-zoom-in">
				<button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition hover:rotate-90">
					<X size={18} />
				</button>
				<div className="h-40 overflow-hidden bg-slate-900">
					<img src={I.logoAcp} alt="Aspire Centurian Park" className="w-full h-full object-contain p-4" />
				</div>
				<div className="p-6">
					<div className="flex items-center justify-center gap-2 mb-1">
						<img src={I.logoGaurs} alt="GAURS" className="h-5 w-auto object-contain" />
					</div>
					<p className="text-xs text-slate-600 text-center mb-4">Techzone-4, Greater Noida (W) · ₹13,000–₹14,000/sq.ft</p>
					<LeadForm compact />
				</div>
			</div>
		</div>
	);
};

const Lightbox = ({ images, idx, onClose, onNav }) => {
	const tsX = useRef(null);
	useEffect(() => {
		if (idx === null) return;
		const h = (e) => {
			if (e.key === 'Escape') onClose();
			else if (e.key === 'ArrowLeft') onNav((idx - 1 + images.length) % images.length);
			else if (e.key === 'ArrowRight') onNav((idx + 1) % images.length);
		};
		document.addEventListener('keydown', h);
		return () => document.removeEventListener('keydown', h);
	}, [idx, images.length, onClose, onNav]);
	if (idx === null) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 acp-fade-in"
			onTouchStart={e => { tsX.current = e.touches[0].clientX; }}
			onTouchEnd={e => { if (tsX.current === null) return; const d = tsX.current - e.changedTouches[0].clientX; if (Math.abs(d) > 50) onNav(d > 0 ? (idx + 1) % images.length : (idx - 1 + images.length) % images.length); tsX.current = null; }}>
			<button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition hover:rotate-90"><X size={20} /></button>
			<div onClick={e => e.stopPropagation()} className="max-w-5xl w-full acp-zoom-in">
				<img src={images[idx]} className="w-full max-h-[82vh] object-contain rounded-xl" />
				<div className="flex justify-center gap-3 mt-4">
					<button onClick={() => onNav((idx - 1 + images.length) % images.length)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"><ChevronLeft size={16} /></button>
					<span className="px-4 py-2 text-white/60 text-sm">{idx + 1} / {images.length}</span>
					<button onClick={() => onNav((idx + 1) % images.length)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"><ChevronRight size={16} /></button>
				</div>
			</div>
		</div>
	);
};

/* ── Amenity Image Slider ── */
const AmenitySlider = ({ slides }) => {
	const [idx, setIdx] = useState(0);
	const [paused, setPaused] = useState(false);
	const go = useCallback((n) => setIdx((n + slides.length) % slides.length), [slides.length]);
	const next = useCallback(() => go(idx + 1), [idx, go]);
	useEffect(() => {
		if (paused) return;
		const t = setInterval(next, 4500);
		return () => clearInterval(t);
	}, [next, paused]);

	return (
		<div className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
			onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
			{slides.map((s, i) => (
				<div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
					<img src={s.img} alt={s.label} className="w-full h-full object-cover" />
				</div>
			))}
			<div className="relative z-20" style={{ paddingTop: '50%' }} />

			{/* gradient + caption */}
			<div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 md:p-6">
				<p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
					{String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · Aspire Centurian Park
				</p>
				<p className="text-white text-base md:text-xl font-bold">{slides[idx].caption}</p>
			</div>

			{/* nav arrows */}
			<button onClick={() => go(idx - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-amber-600/80 text-white flex items-center justify-center transition">
				<ChevronLeft size={18} />
			</button>
			<button onClick={() => go(idx + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-amber-600/80 text-white flex items-center justify-center transition">
				<ChevronRight size={18} />
			</button>

			{/* dot nav */}
			<div className="absolute bottom-3 right-4 z-30 flex gap-1">
				{slides.map((_, i) => (
					<button key={i} onClick={() => go(i)}
						className="rounded-full transition-all"
						style={{ width: i === idx ? 20 : 6, height: 6, background: i === idx ? '#f59e0b' : 'rgba(255,255,255,0.4)' }} />
				))}
			</div>
		</div>
	);
};

/* ── Interactive Floor Plan Viewer (NX One style) ── */
const FloorPlanViewer = ({ units }) => {
	const [sel, setSel] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [panning, setPanning] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const pinchRef = useRef(null);
	const containerRef = useRef(null);

	const reset = (i) => { setSel(i); setZoom(1); setPan({ x: 0, y: 0 }); };
	const onDown = (e) => { if (zoom <= 1) return; setPanning(true); dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }; };
	const onMove = (e) => {
		if (!panning) return;
		const el = containerRef.current;
		const maxX = el ? (el.offsetWidth  * (zoom - 1)) / 2 : 999;
		const maxY = el ? (el.offsetHeight * (zoom - 1)) / 2 : 999;
		setPan({
			x: Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.current.x)),
			y: Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.current.y)),
		});
	};
	const onUp = () => setPanning(false);

	const onTouchStart = (e) => {
		if (e.touches.length === 1 && zoom > 1) {
			setPanning(true);
			dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
		} else if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			pinchRef.current = { dist: Math.hypot(dx, dy), zoom };
		}
	};
	const onTouchMove = (e) => {
		e.preventDefault();
		if (e.touches.length === 1 && panning) {
			const el = containerRef.current;
			const maxX = el ? (el.offsetWidth * (zoom - 1)) / 2 : 999;
			const maxY = el ? (el.offsetHeight * (zoom - 1)) / 2 : 999;
			setPan({
				x: Math.max(-maxX, Math.min(maxX, e.touches[0].clientX - dragStart.current.x)),
				y: Math.max(-maxY, Math.min(maxY, e.touches[0].clientY - dragStart.current.y)),
			});
		} else if (e.touches.length === 2 && pinchRef.current) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const dist = Math.hypot(dx, dy);
			setZoom(Math.max(1, Math.min(3, +(pinchRef.current.zoom * dist / pinchRef.current.dist).toFixed(1))));
		}
	};
	const onTouchEnd = () => { setPanning(false); pinchRef.current = null; };

	const u = units[sel];

	return (
		<Reveal>
		<div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-amber-200 shadow-2xl shadow-black/30">
			{/* Tab bar */}
			<div className="bg-slate-900 px-4 py-3 flex items-center gap-2 flex-wrap border-b border-amber-900/20">
				{units.map((u, i) => (
					<button key={i} onClick={() => reset(i)}
						className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sel === i ? 'bg-amber-600 text-white shadow-md' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}>
						{u.label}
						{u.tag && <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sel === i ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-400'}`}>{u.tag}</span>}
					</button>
				))}
				<div className="flex-1" />
				{/* zoom controls */}
				<div className="flex items-center bg-white/5 border border-white/8 rounded-lg overflow-hidden">
					<button onClick={() => setZoom(z => { const n = Math.max(1, +(z - 0.5).toFixed(1)); if (n === 1) setPan({ x: 0, y: 0 }); return n; })}
						disabled={zoom <= 1} className="px-2.5 py-1 text-white/50 hover:text-amber-400 disabled:opacity-20 text-base font-bold leading-none">−</button>
					<span className="text-white/40 text-[11px] font-mono px-1.5 w-9 text-center select-none">{zoom.toFixed(1)}×</span>
					<button onClick={() => setZoom(z => Math.min(3, +(z + 0.5).toFixed(1)))}
						disabled={zoom >= 3} className="px-2.5 py-1 text-white/50 hover:text-amber-400 disabled:opacity-20 text-base font-bold leading-none">+</button>
				</div>
			</div>

			{/* Floor plan image */}
			<div ref={containerRef} className="relative overflow-hidden bg-[#fafaf7]"
				style={{ height: 'clamp(220px,40vw,360px)', cursor: zoom > 1 ? (panning ? 'grabbing' : 'grab') : 'default', touchAction: 'none' }}
				onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
				onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
				<div className="w-full h-full flex items-center justify-center p-4 select-none"
					style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: 'center', transition: panning ? 'none' : 'transform 0.25s ease' }}>
					<img key={`${sel}`} src={u.fpImg} alt={`${u.label} floor plan`} className="w-full h-full object-contain pointer-events-none" />
				</div>
				{/* badges */}
				<div className="absolute top-3 left-3 bg-amber-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
					{u.label} · {u.type}
				</div>
				<div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-amber-200 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
					{u.sqft.toLocaleString('en-IN')} sq.ft · {fmtINR(u.sqft * u.bsp)}
				</div>
				{zoom > 1 && (
					<button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
						className="absolute bottom-3 left-3 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">↺ Reset</button>
				)}
			</div>

			{/* Specs strip */}
			<div className="bg-slate-900 px-5 py-3 flex flex-wrap items-center gap-4 border-t border-amber-900/20">
				{[
					['Super Built-up', `${u.sqft.toLocaleString('en-IN')} sq.ft`],
					['Carpet Area', u.carpet],
					['Balcony', u.balcony],
					['BSP', `₹${u.bsp.toLocaleString('en-IN')}/sq.ft`],
					['Price', fmtINR(u.sqft * u.bsp)],
				].map(([k, v]) => (
					<div key={k} className="flex items-center gap-1.5">
						<span className="text-white/30 text-[10px] uppercase tracking-wider">{k}</span>
						<span className="text-amber-400 text-sm font-bold">{v}</span>
					</div>
				))}
			</div>
		</div>
		</Reveal>
	);
};

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AspireCenturianParkPage() {
	const [popup, setPopup]   = useState(false);
	const [lbIdx, setLbIdx]   = useState(null);
	const [activeZone, setActiveZone] = useState(0);
	const [payTab, setPayTab] = useState('clp');

	const gallery = [I.heroBg, I.towersStats, I.iconicBalcony, I.lifestyleInt, I.lobbyIconic, I.lobbyTypical, I.clubhouse, I.poolAerial, I.centralGreens, I.lilyPond, I.gymYoga, I.masterPlan];

	// Hide AiSensy widget
	useEffect(() => {
		const hide = () => { const w = document.getElementById('aisensy-wa-widget'); if (w) w.style.display = 'none'; };
		hide(); const t = setTimeout(hide, 1500);
		return () => { clearTimeout(t); const w = document.getElementById('aisensy-wa-widget'); if (w) w.style.display = ''; };
	}, []);

	const dl = () => { const a = document.createElement('a'); a.href = PROJECT.brochure; a.download = 'Aspire-Centurian-Park-Brochure.pdf'; a.target = '_blank'; a.click(); };

	return (
		<Layout>
			<style>{GLOBAL_CSS}</style>
			<ScrollProgress />
			<Helmet>
				<title>Aspire Centurian Park by Gaurs | 3 & 4 BHK Luxury Residences · Techzone-4, Greater Noida</title>
				<meta name="description" content="Aspire Centurian Park by Gaursons India — Supreme Court Monitored luxury residences. 3 BHK + Study from Rs.3.57 Cr* | 4 BHK + Study from Rs.4.37 Cr*. Designed by Chapman Taylor. 12 Acres, 11 Towers, 45-floor Tower. Techzone-4, Greater Noida (W)." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/aspire-centurian-park" />
				<meta property="og:title" content="Aspire Centurian Park by Gaurs | 3 & 4 BHK Luxury Residences · Techzone-4, Greater Noida" />
				<meta property="og:description" content="Supreme Court Monitored luxury residences. 3 BHK from Rs.3.57 Cr*. Designed by Chapman Taylor. 12 Acres, 11 Towers. Techzone-4, Greater Noida West." />
				<meta property="og:url" content="https://instamakaan.com/sell-companies/aspire-centurian-park" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Aspire Centurian Park by Gaurs | 3 & 4 BHK Luxury Residences · Greater Noida" />
				<meta name="twitter:description" content="Supreme Court Monitored luxury residences. 3 BHK from Rs.3.57 Cr*. Techzone-4, Greater Noida West." />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "RealEstateListing",
					"name": "Aspire Centurian Park — Luxury Residences, Techzone-4 Greater Noida West",
					"description": "Supreme Court Monitored luxury residences by Gaursons India. 3 & 4 BHK + Study apartments. Designed by Chapman Taylor. Techzone-4, Greater Noida West.",
					"url": "https://instamakaan.com/sell-companies/aspire-centurian-park",
					"address": { "@type": "PostalAddress", "streetAddress": "Techzone-4", "addressLocality": "Greater Noida", "addressRegion": "Uttar Pradesh", "postalCode": "201306", "addressCountry": "IN" }
				})}</script>
			</Helmet>

			{/* ═══ MOBILE BOTTOM NAV ═══ */}
			<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-amber-100 shadow-2xl">
				<div className="flex items-center justify-around px-2 py-2">
					{[
						{ href: '#overview', icon: <Home size={19} />, label: 'Overview' },
						{ href: '#floor-plans', icon: <Building2 size={19} />, label: 'Plans' },
						{ href: '#pricing', icon: <Star size={19} />, label: 'Price' },
						{ href: '#location', icon: <MapPin size={19} />, label: 'Location' },
					].map(({ href, icon, label }) => (
						<a key={href} href={href} className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-2">
							{icon}{label}
						</a>
					))}
					<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
						className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-green-600">
						<MessageCircle size={19} />WhatsApp
					</a>
				</div>
			</div>

			{/* ═══════════════════════════════════════
			    §1  HERO
			═══════════════════════════════════════ */}
			<section id="home" className="relative min-h-[620px] md:min-h-[740px] flex items-center overflow-hidden">
				<img src={I.heroBg} alt="Aspire Centurian Park Towers" className="absolute inset-0 w-full h-full object-cover acp-kenburns" />
				<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
				{/* gold top line */}
				<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

				<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 pb-24 md:pb-14">
					<div className="lg:col-span-3 text-white">
						{/* ACP Logo */}
						<div className="mb-5 inline-block acp-hero-anim" style={{ animationDelay: '0ms' }}>
							<img src={I.logoAcp} alt="Aspire Centurian Park by GAURS" className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl" />
						</div>

						<p className="text-amber-400 text-sm tracking-[0.25em] uppercase font-semibold mb-2 acp-hero-anim" style={{ animationDelay: '120ms' }}>
							Grand Luxury Residences · Techzone-4, Greater Noida (W)
						</p>

						{/* Trust badges */}
						<div className="flex flex-wrap gap-2 mb-5 acp-hero-anim" style={{ animationDelay: '220ms' }}>
							<span className="flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/40 backdrop-blur-sm text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full">
								<Shield size={11} /> Supreme Court Monitored
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Award size={11} /> NBCC India Ltd. Executed
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Star size={11} /> Chapman Taylor Architect
							</span>
						</div>

						<ul className="space-y-2 mb-7 max-w-xl acp-hero-anim" style={{ animationDelay: '320ms' }}>
							{[
								'12 Acres · 11 Towers · 45-Floor Iconic Tower — Tallest in Greater Noida (W)',
								'3 BHK + Study: 2746–2772 sq.ft · 4 BHK + Study: 3360–3862 sq.ft',
								'BSP ₹13,000/sq.ft (Typical) · ₹14,000/sq.ft (Iconic Tower)',
								'3716 sq.mtr (40,000 sq.ft) 5-Star Lavish Clubhouse · 64 Amenities',
								'Next to approx 4 Hectares (10 Acres) Green Park',
							].map((b, i) => (
								<li key={i} className="flex items-start gap-2.5 text-white/90 text-xs md:text-sm">
									<div className="w-4 h-4 rounded-full bg-amber-600/30 border border-amber-400/50 flex items-center justify-center flex-shrink-0 mt-0.5">
										<Check size={9} className="text-amber-400" />
									</div>
									{b}
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-3 acp-hero-anim" style={{ animationDelay: '420ms' }}>
							<button onClick={dl} className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 shadow-xl shadow-amber-500/30 transition">
								<Download size={15} /> Download Brochure
							</button>
							<button onClick={() => setPopup(true)} className="bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition">
								Enquire Now <ArrowRight size={14} />
							</button>
						</div>
					</div>

					{/* hero lead form */}
					<div className="hidden lg:block lg:col-span-2 bg-black/50 backdrop-blur-md border border-amber-100 rounded-2xl p-6">
						<img src={I.logoGaurs} alt="GAURS your own world" className="h-10 w-auto object-contain mb-3 opacity-90" />
						<h3 className="text-white text-lg font-bold">Register Your Interest</h3>
						<p className="text-amber-400 text-base font-bold mb-1">Get Exclusive Pre-Launch Pricing</p>
						<p className="text-white/50 text-xs mb-4">InstaMakaan · Official Channel Partner</p>
						<LeadForm dark />
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §2  STATS STRIP
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] dark:bg-slate-900 border-b border-amber-300/40">
				<div className="container-custom py-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
					{STATS.map((s, i) => (
						<div key={i} className="text-center py-3 px-2 border-r last:border-r-0 border-amber-100/60 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r md:[&:nth-child(2n)]:border-r">
							<p className="text-[9px] uppercase tracking-widest text-amber-600 font-bold mb-1">{s.label}</p>
							<p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight"><Counter text={s.value} /></p>
							<p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">{s.sub}</p>
						</div>
					))}
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §3  "A LIVING MASTERPIECE" OPENER
			═══════════════════════════════════════ */}
			<section id="overview" className="relative overflow-hidden">
				<img src={I.masterpieceArt} alt="A Living Masterpiece" className="w-full object-cover" style={{ maxHeight: 420, objectPosition: 'center 40%' }} />
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
					<div className="container-custom text-white py-12">
						<p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-bold mb-2">Techzone-4 · Greater Noida (W)</p>
						<h2 className="text-3xl md:text-5xl font-bold leading-tight mb-2">A Living Masterpiece</h2>
						<p className="text-xl md:text-2xl font-light italic text-white/80 mb-4">of Artistry in the Heart of Gr. Noida (W)</p>
						<p className="text-xs text-white/50 uppercase tracking-widest">
							Approved by Hon'ble Supreme Court · Executed through NBCC India Ltd.
						</p>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §4  TOWERS OVERVIEW + KEY FEATURES
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] dark:bg-slate-900 py-16 md:py-20">
				<div className="container-custom">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
						<div className="relative">
							<img src={I.towersStats} alt="Aspire Centurian Park Towers" className="w-full rounded-2xl shadow-2xl shadow-amber-200/50 ring-1 ring-amber-200/60" />
							{/* floating badge */}
							<div className="absolute -bottom-5 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 ring-1 ring-amber-200/60">
								<div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
									<Building2 size={18} className="text-white" />
								</div>
								<div>
									<p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">Iconic Tower</p>
									<p className="text-lg font-bold text-slate-900 dark:text-white leading-none">45 Storeys</p>
								</div>
							</div>
						</div>

						<div className="pt-6 lg:pt-0">
							<SectionHeading kicker="A Living Canvas of Unparalleled Craftsmanship" title="Why Aspire Centurian Park?" center={false} />
							<ul className="space-y-3">
								{[
									'Approved by Hon\'ble Supreme Court Monitored Housing Projects through LD. Court Receiver',
									'Executed through NBCC India Ltd. — Aspire is a Section 8 Company',
									'Designed by Chapman Taylor — Global Award-Winning Architects, Masterplanners & Interior Designers',
									'11 Towers — 10 Typical Towers (30 floors each) + 1 Iconic Tower (45 floors)',
									'The Iconic Tower is the Tallest Iconic Landmark of Greater Noida (W)',
									'3 Lavish Residences each floor in Iconic Tower with 7 high-speed elevators',
									'4.85 Hectares (12 Acres) project expanse — Next to 4 Hectares (10 Acres) Green Park',
									'3716 sq.mtr (40,000 sq.ft) 5-Star Lavish Clubhouse with 64 world-class amenities',
								].map((h, i) => (
									<li key={i} className="group flex items-start gap-3 bg-white/60 dark:bg-slate-800/60 border border-amber-100 rounded-xl px-4 py-3 hover:border-amber-400 hover:shadow-md transition-all">
										<div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-50 group-hover:bg-amber-600 flex items-center justify-center mt-0.5 transition-colors">
											<Check size={12} className="text-amber-600 group-hover:text-white transition-colors" />
										</div>
										<span className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed">{h}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §7  CHAPMAN TAYLOR — ARCHITECT
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] dark:bg-slate-900 py-16">
				<div className="container-custom">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
						<div>
							<SectionHeading kicker="Designed by World Renowned Architect" title="Chapman Taylor" center={false}
								sub="Global Award-Winning Architects, Masterplanners and Interior Designers" />
							<div className="space-y-4 text-sm text-slate-800 dark:text-slate-300 leading-relaxed">
								<p>Chapman Taylor is an internationally renowned architectural practice known for designing landmark buildings across the globe. Their portfolio spans luxury residential towers, award-winning retail destinations, and iconic mixed-use developments.</p>
								<p>Other projects designed by Chapman Taylor include Saadiyat Beach District Residences (Abu Dhabi, UAE), Hayes Village (London, UK), Mirabad Avenue (Tashkent, Uzbekistan), and Friars Park (London, UK).</p>
							</div>
							<button onClick={dl} className="mt-6 inline-flex items-center gap-2 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-bold px-6 py-2.5 rounded-lg text-sm transition">
								<Download size={14} /> Download Brochure
							</button>
						</div>
						<div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-amber-200/60">
							<img src={I.chapmanTaylor} alt="Chapman Taylor — Architect" className="w-full object-cover" />
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §8  CONNECTIVITY
			═══════════════════════════════════════ */}
			<section className="relative bg-[#e8d4b5] py-16 overflow-hidden">
				{/* decorative concentric rings */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
					<div className="w-[500px] h-[500px] rounded-full border border-amber-600/12 absolute" />
					<div className="w-[750px] h-[750px] rounded-full border border-amber-600/8 absolute" />
					<div className="w-[1000px] h-[1000px] rounded-full border border-amber-600/5 absolute" />
				</div>
				<div className="container-custom relative">
					<div className="text-center mb-10">
						<p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">In the Heart of the City</p>
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Where Landmarks Meet Life</h2>
						<div className="mx-auto h-[2px] w-20 bg-gradient-to-r from-transparent via-amber-600 to-transparent rounded-full mb-4" />
						<p className="text-slate-700/70 text-sm max-w-xl mx-auto leading-relaxed">Greater Noida West offers unmatched connectivity to Noida, Delhi, Ghaziabad, NH-24, and the upcoming Noida International Airport at Jewar.</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
						{CONNECTIVITY.map((c, i) => (
							<div key={i} className="group relative bg-white/75 hover:bg-white/90 border border-amber-200/80 hover:border-amber-400 rounded-2xl px-3 py-5 text-center transition-all duration-300 shadow-sm hover:shadow-md">
								<p className="text-amber-600 font-bold text-2xl leading-none mb-2 group-hover:scale-110 transition-transform duration-200">{c.dist}</p>
								<div className="h-[1px] w-8 bg-amber-600/40 mx-auto mb-2 rounded-full" />
								<p className="text-slate-700 text-[11px] leading-tight">{c.place}</p>
							</div>
						))}
					</div>
					<p className="text-center text-slate-400 text-[10px] mt-6">* All distances are approximate and may vary depending on exact route and mode of travel.</p>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §9  LOCATION + NEARBY PLACES
			═══════════════════════════════════════ */}
			<section id="location" className="bg-[#e8d4b5] dark:bg-slate-800 py-16">
				<div className="container-custom">
					<SectionHeading kicker="Where Everything is Seamlessly Within Reach" title="Location & Nearby" />

					{/* Address pill */}
					<div className="flex items-center justify-center gap-3 mb-10 bg-white/85 dark:bg-slate-800/60 border border-amber-200 rounded-2xl px-6 py-4 max-w-lg mx-auto shadow-sm">
						<div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-600/35 flex items-center justify-center flex-shrink-0">
							<MapPin size={18} className="text-amber-600" />
						</div>
						<div>
							<p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">Plot No. GH-05, Techzone-4</p>
							<p className="text-slate-600 dark:text-slate-400 text-sm">Greater Noida (West), Uttar Pradesh</p>
						</div>
					</div>

					{/* Nearby 3-column grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
						{Object.entries(NEARBY).map(([cat, items]) => (
							<div key={cat} className="bg-white/85 dark:bg-slate-800/60 border border-amber-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1.5 h-6 rounded-full bg-amber-600" />
									<p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">{cat}</p>
								</div>
								{items.map((item, i) => (
									<p key={i} className="text-sm text-slate-800 dark:text-slate-300 flex items-start gap-2 mb-1.5 last:mb-0">
										<span className="text-amber-600 mt-0.5 flex-shrink-0 font-bold">›</span>{item}
									</p>
								))}
							</div>
						))}
					</div>

					<div className="text-center">
						<a href="https://maps.google.com/?q=GH-05+Techzone+4+Greater+Noida+West" target="_blank" rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-3 rounded-lg text-sm transition shadow-lg">
							<MapPin size={15} /> View on Google Maps
						</a>
					</div>
				</div>
			</section>

			{/* pool / aqua zone */}
			<section className="relative bg-[#e8d4b5] py-14 overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,_#d9770620_0%,_transparent_70%)] pointer-events-none" />
				<div className="container-custom relative text-center">
					<p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">Aqua Zone</p>
					<h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Soak in Serenity.</h3>
					<p className="text-3xl md:text-4xl font-bold text-amber-600 mb-5">Swim in Style.</p>
					<div className="mx-auto h-[2px] w-24 bg-gradient-to-r from-transparent via-amber-600 to-transparent rounded-full mb-8" />
					<div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
						{['Swimming Pool', 'Kids Pool', 'Pool Deck', 'Floating Cabana', 'Jacuzzi', 'Fountain', 'Gazebo', 'Lily Pond'].map((item, i) => (
							<span key={i} className="flex items-center gap-2 bg-white/75 hover:bg-white/90 border border-amber-200 hover:border-amber-400 text-slate-800 hover:text-slate-900 px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-default shadow-sm">
								<span className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
								{item}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §11  AMENITIES — SLIDER + ZONE GRID
			═══════════════════════════════════════ */}
			<section id="amenities" className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Exceptional Clubhouse, Exquisite Lifestyle" title="64 World-Class Amenities" sub="Across 4 curated lifestyle zones — Sports, Aqua, Interactive & Undercroft" />

					<div className="mb-10">
						<AmenitySlider slides={AMENITY_SLIDES} />
					</div>

					{/* Zone tabs + grid */}
					<div className="flex flex-wrap justify-center gap-2 mb-6">
						{AMENITY_ZONES.map((z, i) => (
							<button key={i} onClick={() => setActiveZone(i)}
								className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeZone === i ? 'text-white shadow-lg' : 'bg-white/75 text-slate-800 hover:bg-white/90'}`}
								style={activeZone === i ? { background: z.color } : {}}>
								{z.zone}
							</button>
						))}
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
						{AMENITY_ZONES[activeZone].items.map((item, i) => (
							<div key={i} className="bg-white/85 border border-amber-100 hover:border-amber-400 rounded-xl px-3 py-2.5 flex items-center gap-2 transition-all hover:shadow-md">
								<div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center" style={{ background: AMENITY_ZONES[activeZone].color }}>
									<Check size={11} className="text-white" />
								</div>
								<p className="text-xs text-slate-800 font-medium leading-tight">{item}</p>
							</div>
						))}
					</div>
					<p className="text-center text-[11px] text-slate-600 mt-4">* Amenities as per brochure. Subject to developer confirmation.</p>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §12  MASTER PLAN (zoomable)
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="All 64 Amenities at a Glance" title="Master Plan" />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
						{/* Left: map image */}
						<div
							className="rounded-2xl overflow-hidden shadow-xl border border-amber-200/60 cursor-zoom-in sticky top-24"
							onClick={() => setLbIdx(11)}
						>
							<img
								src={I.masterPlanMap}
								alt="Master Plan — Aspire Centurian Park"
								className="w-full object-contain"
							/>
						</div>

						{/* Right: amenities slider */}
						<AmenitiesSlider />
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §13  SITE PLAN (unit color coding)
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Unit Layout" title="Site Plan" />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
						<div className="rounded-2xl overflow-hidden shadow-xl border border-amber-100 bg-white cursor-zoom-in" onClick={() => setLbIdx(1)}>
							<img src={I.sitePlan} alt="Site Plan — Aspire Centurian Park" className="w-full object-contain" />
						</div>
						<div className="space-y-3">
							{UNIT_TYPES.map((u, i) => (
								<div key={i} className={`rounded-xl p-4 border flex flex-col sm:flex-row sm:items-center gap-3 ${u.gold ? 'bg-amber-50 border-amber-300' : 'bg-white/80 border-amber-200'}`}>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.gold ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600'}`}>{u.label}</span>
											{u.tag && <span className="text-[10px] font-bold text-white bg-amber-600 px-2 py-0.5 rounded-full">{u.tag}</span>}
										</div>
										<p className="font-bold text-slate-900">{u.type}</p>
										<p className="text-xs text-slate-600">{u.towers} · {u.sqmtr} / {u.sqft.toLocaleString('en-IN')} sq.ft</p>
									</div>
									<div className="text-right">
										<p className={`text-lg font-bold ${u.gold ? 'text-amber-600' : 'text-amber-600'}`}>{fmtINR(u.sqft * u.bsp)}</p>
										<p className="text-xs text-slate-600">₹{u.bsp.toLocaleString('en-IN')}/sq.ft</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §14  INTERIOR RENDERS
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-14">
				<div className="container-custom">
					<SectionHeading kicker="Every Detail, Every Finish" title="Residences That Redefine Opulence" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in relative aspect-[4/3]" onClick={() => setLbIdx(2)}>
							<img src={I.fpLiving} alt="Lavish Living Room" className="w-full h-full object-cover object-[center_80%] group-hover:scale-105 transition-transform duration-700" />
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<p className="text-amber-400 text-xs font-bold tracking-widest uppercase">Living · Dining</p>
								<p className="text-white font-bold">Lavish Living, Spacious Luxury</p>
							</div>
						</div>
						<div className="rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in relative aspect-[4/3]" onClick={() => setLbIdx(3)}>
							<img src={I.fpBedroom} alt="Luxury Bedroom" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<p className="text-amber-400 text-xs font-bold tracking-widest uppercase">Master Bedroom</p>
								<p className="text-white font-bold">Bedrooms Designed for Restful Serenity</p>
							</div>
						</div>
					</div>
					{/* Lobby renders */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<div className="rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in relative aspect-[16/9]" onClick={() => setLbIdx(4)}>
							<img src={I.lobbyIconic} alt="Iconic Tower Lobby" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-0.5">Iconic Tower</p>
								<p className="text-white font-bold">Iconic Tower Entrance Lobby</p>
							</div>
						</div>
						<div className="rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in relative aspect-[16/9]" onClick={() => setLbIdx(5)}>
							<img src={I.lobbyTypical} alt="Typical Towers Lobby" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-0.5">Typical Towers (T-1 to T-10)</p>
								<p className="text-white font-bold">Typical Towers Entrance Lobby</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §15  FLOOR PLANS — INTERACTIVE VIEWER
			═══════════════════════════════════════ */}
			<section id="floor-plans" className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Live Grand with Spacious Plans" title="Floor Plans" />
					<FloorPlanViewer units={UNIT_TYPES} />
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §16  SPECIFICATIONS
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<div className="text-center mb-10">
						<div className="flex items-center justify-center gap-5 mb-5 flex-wrap">
							<img src={I.logoAcpClean} alt="Aspire Centurian Park" className="h-10 w-auto object-contain" />
							<div className="w-px h-8 bg-amber-400/40 hidden sm:block" />
							<img src={I.logoGaurs} alt="GAURS" className="h-7 w-auto object-contain" />
						</div>
						<p className="text-amber-600 text-[11px] font-bold tracking-[0.3em] uppercase mb-2">Premium Finishes</p>
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900">Tower Specifications</h2>
						<GoldDivider />
					</div>
					<SpecsPanel />
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §17  PRICING
			═══════════════════════════════════════ */}
			<section id="pricing" className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="W.E.F. 21st January 2026" title="Price List" />
					<p className="text-center text-amber-600 text-sm font-bold mb-8">Iconic Tower: ₹14,000/sq.ft (BSP) · Typical Towers: ₹13,000/sq.ft (BSP)</p>

					{/* Unit price cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
						{UNIT_TYPES.map((u, i) => (
							<Reveal key={i} delay={i * 80}>
								<div className={`rounded-2xl overflow-hidden border acp-card-lift ${u.gold ? 'bg-amber-50 border-amber-300 shadow-lg shadow-amber-500/15' : 'bg-white/80 border-amber-200'}`}>
									<div className={`px-4 py-2.5 ${u.gold ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-gradient-to-r from-amber-100 to-amber-50'}`}>
										<div className="flex items-center justify-between">
											<p className={`font-bold text-sm ${u.gold ? 'text-white' : 'text-slate-900'}`}>{u.label}</p>
											{u.tag && <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${u.gold ? 'bg-white/20 text-white' : 'bg-amber-50 text-slate-900'}`}>{u.tag}</span>}
										</div>
									</div>
									<div className="p-4">
										<p className="text-xs text-slate-600 mb-3">{u.type} · {u.towers}</p>
										<div className="space-y-2 mb-4">
											{[['Area', `${u.sqft.toLocaleString('en-IN')} sq.ft`], ['BSP', `₹${u.bsp.toLocaleString('en-IN')}/sq.ft`], ['Price', fmtINR(u.sqft * u.bsp)]].map(([k, v]) => (
												<div key={k} className="flex justify-between items-center pb-1.5 border-b border-amber-100">
													<span className="text-xs text-slate-500">{k}</span>
													<span className={`text-sm font-bold ${k === 'Price' ? 'text-amber-600' : 'text-slate-900'}`}>{v}</span>
												</div>
											))}
										</div>
										<button onClick={() => setPopup(true)} className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition">
											Enquire <ChevronRight size={12} />
										</button>
									</div>
								</div>
							</Reveal>
						))}
					</div>

					{/* PLC + Additional charges */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
						{/* Iconic PLC */}
						<div className="bg-white/80 border border-amber-100 rounded-2xl p-5">
							<p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">Iconic Tower Floor PLC (₹/sq.ft)</p>
							<table className="w-full">
								<tbody className="divide-y divide-amber-100">
									{FLOOR_PLC_ICONIC.map(f => (
										<tr key={f.floor}><td className="py-1.5 text-slate-700 text-xs">{f.floor}</td><td className="py-1.5 text-right font-bold text-xs">{f.plc > 0 ? <span className="text-slate-900">+₹{f.plc}</span> : <span className="text-green-600">Nil</span>}</td></tr>
									))}
								</tbody>
							</table>
						</div>
						{/* Typical PLC + View PLC */}
						<div className="bg-white/80 border border-amber-100 rounded-2xl p-5 space-y-4">
							<div>
								<p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">Typical Tower Floor PLC (₹/sq.ft)</p>
								<table className="w-full">
									<tbody className="divide-y divide-amber-100">
										{FLOOR_PLC_TYPICAL.map(f => (
											<tr key={f.floor}><td className="py-1.5 text-slate-700 text-xs">{f.floor}</td><td className="py-1.5 text-right font-bold text-xs">{f.plc > 0 ? <span className="text-slate-900">+₹{f.plc}</span> : <span className="text-green-600">Nil</span>}</td></tr>
										))}
									</tbody>
								</table>
							</div>
							<div>
								<p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">View PLC (₹/sq.ft)</p>
								<table className="w-full">
									<tbody className="divide-y divide-amber-100">
										{VIEW_PLC.map(v => (
											<tr key={v.view}><td className="py-1.5 text-slate-700 text-xs">{v.view}</td><td className="py-1.5 text-right font-bold text-slate-900 text-xs">+₹{v.plc}</td></tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						{/* Additional charges */}
						<div className="bg-white/80 border border-amber-100 rounded-2xl p-5">
							<p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">Additional Charges</p>
							<table className="w-full">
								<tbody className="divide-y divide-amber-100">
									{ADD_CHARGES.map(c => (
										<tr key={c.name}><td className="py-1.5 text-slate-700 text-xs">{c.name}</td><td className="py-1.5 text-right font-bold text-slate-900 text-xs">{c.val}</td></tr>
									))}
								</tbody>
							</table>
							<div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
								<p className="text-[10px] text-slate-600">Maintenance: ₹2.99/sq.ft + GST 18%</p>
								<p className="text-[10px] text-slate-600 mt-0.5">1 year advance maintenance payable at possession</p>
							</div>
						</div>
					</div>

					{/* Bank Details */}
					<div className="mt-8 bg-white/80 border border-amber-100 rounded-2xl p-5 max-w-2xl mx-auto">
						<p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3 text-center">Bank Details</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
							{[['Bank Name', BANK.name], ['Account Name', BANK.account], ['Branch', BANK.branch], ['Account No.', BANK.accNo], ['IFSC Code', BANK.ifsc]].map(([k, v]) => (
								<div key={k} className={k === 'Account Name' || k === 'Branch' ? 'col-span-2' : ''}>
									<p className="text-slate-400 text-[10px] uppercase tracking-wider">{k}</p>
									<p className="text-slate-900 font-semibold">{v}</p>
								</div>
							))}
						</div>
					</div>

					{/* Disclaimer */}
					<div className="mt-4 max-w-2xl mx-auto">
						<ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
							<li>Govt. charges / GST as applicable.</li>
							<li>Prices are at sole discretion of management and can be changed anytime.</li>
							<li>*Upto 3.5 KVA — Additional Car Parking @₹3,50,000 + taxes charged extra.</li>
						</ul>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §18  PAYMENT PLANS (EXACT FROM PDF)
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="For All Sizes" title="Payment Plans" />

					{/* Plan tabs */}
					<div className="flex justify-center gap-3 mb-8">
						{[['clp', 'Construction Linked Plan (CLP)'], ['special', 'Special Payment Plan']].map(([key, label]) => (
							<button key={key} onClick={() => setPayTab(key)}
								className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${payTab === key ? 'bg-amber-600 text-white shadow-lg' : 'bg-white/85 text-slate-600 hover:bg-white/90 hover:text-slate-900 border border-amber-200'}`}>
								{label}
							</button>
						))}
					</div>

					<div className="max-w-2xl mx-auto">
						{payTab === 'clp' ? (
							<div className="bg-white/80 border border-amber-200 rounded-2xl overflow-hidden">
								<div className="bg-gradient-to-r from-amber-600/20 to-amber-500/15 px-5 py-3 border-b border-amber-100">
									<p className="text-slate-900 font-bold">Construction Linked Plan (CLP)</p>
									<p className="text-slate-600 text-xs">Linked to construction milestones</p>
								</div>
								<div className="divide-y divide-amber-100/80">
									{CLP.map((step, i) => (
										<div key={i} className="px-5 py-3">
											<div className="flex items-center justify-between mb-1.5">
												<div className="flex items-center gap-3">
													<span className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-600 flex-shrink-0">{i + 1}</span>
													<span className="text-slate-800 text-sm">{step.milestone}</span>
												</div>
												<span className="text-amber-600 font-bold text-base ml-4 flex-shrink-0">{step.pct}%</span>
											</div>
											<div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
												<div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full acp-grow-bar" style={{ width: `${step.pct}%`, animationDelay: `${i * 80}ms` }} />
											</div>
										</div>
									))}
									<div className="px-5 py-3 bg-amber-50 flex justify-between">
										<span className="text-slate-900 font-bold text-sm">Total</span>
										<span className="text-amber-600 font-bold text-base">100%</span>
									</div>
								</div>
							</div>
						) : (
							<div className="bg-white/80 border border-amber-200 rounded-2xl overflow-hidden">
								<div className="bg-gradient-to-r from-amber-100 to-amber-50 px-5 py-3 border-b border-amber-100">
									<p className="text-slate-900 font-bold">Special Payment Plan</p>
									<p className="text-amber-600 text-xs font-semibold">* Valid for a limited period only</p>
								</div>
								<div className="divide-y divide-amber-100/80">
									{SPECIAL_PLAN.map((step, i) => (
										<div key={i} className="px-5 py-3">
											<div className="flex items-center justify-between mb-1.5">
												<div className="flex items-center gap-3">
													<span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-600 flex-shrink-0">{i + 1}</span>
													<span className="text-slate-800 text-sm">{step.milestone}</span>
												</div>
												<span className="text-amber-600 font-bold text-xl ml-4 flex-shrink-0">{step.pct}%</span>
											</div>
											<div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
												<div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full acp-grow-bar" style={{ width: `${step.pct}%`, animationDelay: `${i * 80}ms` }} />
											</div>
										</div>
									))}
									<div className="px-5 py-3 bg-amber-50 flex justify-between">
										<span className="text-slate-900 font-bold text-sm">Total</span>
										<span className="text-amber-600 font-bold text-xl">100%</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §19  DEVELOPER — GAURS
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-16">
				<div className="container-custom">
					<SectionHeading kicker="The Developer" title="3 Decades of Trust & Triumphs" />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
						<Reveal x={-30}>
							<div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-100">
								<img src={I.developerMiles} alt="Gaurs Milestones" className="w-full object-cover" />
							</div>
						</Reveal>
						<Reveal x={30}>
							<div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-100">
								<img src={I.gaursAwards} alt="Gaurs — 3 Decades of Trust & Triumphs" className="w-full object-cover" />
							</div>
						</Reveal>
					</div>

					{/* Milestone stats */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
						{GAURS_MILESTONES.map((m, i) => (
							<Reveal key={i} delay={i * 60}>
								<div className="text-center bg-white/85 border border-amber-100 rounded-2xl py-4 px-3">
									<p className="text-2xl md:text-3xl font-bold text-amber-600"><Counter text={m.val} /></p>
									<p className="text-slate-600 text-xs mt-1 leading-tight">{m.label}</p>
								</div>
							</Reveal>
						))}
					</div>

					{/* Approval badge + Gaurs logo */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
						<div className="rounded-2xl overflow-hidden shadow-xl border border-amber-100">
							<img src={I.approvalBadge} alt="Supreme Court Approval" className="w-full object-contain bg-white p-4" style={{ maxHeight: 280 }} />
						</div>
						<div className="flex flex-col justify-center items-center bg-white/85 border border-amber-100 rounded-2xl p-6 text-center gap-4">
							<img src={I.logoAcpClean} alt="Aspire Centurian Park" className="h-16 w-auto object-contain" />
							<div className="h-px w-full bg-amber-100" />
							<img src={I.logoGaurs} alt="GAURS" className="h-8 w-auto object-contain" />
							<div className="text-slate-700 text-sm space-y-1.5">
								<p className="text-xs text-slate-600">Plot No. GH-05, Techzone-4</p>
								<p className="text-xs text-slate-600">Greater Noida (West)</p>
							</div>
							<button onClick={dl} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition">
								<Download size={14} /> Download Brochure
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §20  ENQUIRE — INSTAMAKAAN ONLY
			═══════════════════════════════════════ */}
			<section className="bg-[#e8d4b5] py-16 relative overflow-hidden">
				<div className="container-custom relative z-10">
					<div className="max-w-4xl mx-auto">
						{/* InstaMakaan branding */}
						<div className="text-center mb-8">
							<p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-2">Official Channel Partner</p>
							<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Enquire via InstaMakaan</h2>
							<GoldDivider />
							<p className="text-slate-600 text-sm mt-2">For bookings, site visits, price negotiation & all property queries</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
							{/* contact card */}
							<div className="bg-white/80 border border-amber-200 rounded-2xl p-6 space-y-4">
								<div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-amber-100">
									<div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center flex-shrink-0">
										<Phone size={22} className="text-white" />
									</div>
									<div>
										<p className="text-slate-500 text-xs uppercase tracking-wider">Call / WhatsApp</p>
										<a href={`tel:${PROJECT.phone}`} className="text-xl font-bold text-slate-900 hover:text-amber-600 transition">{PROJECT.phoneDisplay}</a>
									</div>
								</div>
								<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
									className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition">
									<div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
										<MessageCircle size={22} className="text-white" />
									</div>
									<div>
										<p className="text-green-700 text-xs uppercase tracking-wider">WhatsApp</p>
										<p className="text-green-900 font-bold">Chat with InstaMakaan</p>
									</div>
								</a>
								<div className="p-4 bg-white/60 rounded-xl border border-amber-100">
									<p className="text-amber-600 text-sm font-bold mb-2">About This Project</p>
									<div className="space-y-1.5 text-xs text-slate-600">
										<p><span className="text-slate-800 font-semibold">Project:</span> Aspire Centurian Park by GAURS</p>
										<p><span className="text-slate-800 font-semibold">Location:</span> Plot GH-05, Techzone-4, Gr. Noida (W)</p>
										<p><span className="text-slate-800 font-semibold">Legal:</span> Supreme Court Monitored · NBCC Executed</p>
										<p><span className="text-slate-800 font-semibold">BSP:</span> ₹13,000 (Typical) · ₹14,000 (Iconic) per sq.ft</p>
									</div>
								</div>
								<button onClick={dl} className="w-full border border-amber-400 text-amber-600 hover:bg-amber-50 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition">
									<Download size={15} /> Download Full Brochure (PDF)
								</button>
							</div>

							{/* lead form */}
							<div className="bg-white/80 border border-amber-200 rounded-2xl p-6">
								<p className="text-amber-600 font-bold mb-4">Send Enquiry</p>
								<LeadForm />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* mobile spacer */}
			<div className="h-16 md:hidden" />

			<PopupModal open={popup} onClose={() => setPopup(false)} />
			<Lightbox
				images={[I.masterPlan, I.sitePlan, I.fpLiving, I.fpBedroom, I.lobbyIconic, I.lobbyTypical, I.specs, I.fpIconic, I.fpUnit1, I.fpUnit2, I.fpUnit3, I.fpUnit4]}
				idx={lbIdx}
				onClose={() => setLbIdx(null)}
				onNav={i => setLbIdx(i)}
			/>
		</Layout>
	);
}
