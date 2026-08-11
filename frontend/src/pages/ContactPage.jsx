import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Helmet } from 'react-helmet-async';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	Send,
	CheckCircle2,
	Loader2,
	ShieldCheck,
	Zap,
	Headphones,
	ChevronDown,
	ArrowLeft,
	MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const API_BASE = (
	process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '');

const contactInfo = [
	{
		icon: Phone,
		title: 'Phone',
		value: '+91 9771034916',
		link: 'tel:+919771034916',
	},
	{
		icon: Mail,
		title: 'Email',
		value: 'support@instamakaan.com',
		link: 'mailto:support@instamakaan.com',
	},
	{
		icon: MapPin,
		title: 'Office',
		value:
			'Tower T2, Flat B809, Tech Zone 4, Plot 17, Amrapali Dream Valley Greater Noida, Uttar Pradesh 201310',
		link: null,
	},
	{
		icon: Clock,
		title: 'Hours',
		value: 'Mon-Sat: 9AM - 7PM',
		link: null,
	},
];

const trustBadges = [
	{
		icon: ShieldCheck,
		title: '100% Verified Help',
		desc: 'Trusted support team',
	},
	{
		icon: Headphones,
		title: '24/7 Support',
		desc: 'We’re here anytime',
	},
	{
		icon: Zap,
		title: 'Fast Response',
		desc: 'Quick resolution',
	},
];

const faqs = [
	{
		q: 'How soon will I get a response?',
		a: 'Our team typically responds within a few hours during working hours. For urgent requests, we prioritize faster replies.',
	},
	{
		q: 'Can I visit your office directly?',
		a: 'Yes, you can visit our office during working hours. We recommend booking a quick call before visiting.',
	},
	{
		q: 'Do you help property owners and tenants both?',
		a: 'Yes! We work with both owners and tenants for renting and buying support.',
	},
];

const ContactPage = () => {
	const navigate = useNavigate();

	const handleCall = () => {
		window.location.href = 'tel:+919771034916';
	};

	const handleWhatsApp = () => {
		const message = encodeURIComponent(
			'Hi, I want to know more about InstaMakaan',
		);

		window.open(`https://wa.aisensy.com/aabbf5?text=${message}`, '_blank');
	};
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [openFaq, setOpenFaq] = useState(null);
	const [errors, setErrors] = useState({});
	const formRef = React.useRef(null);
	const validateForm = () => {
		const newErrors = {};

		// NAME
		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		} else if (formData.name.length < 3) {
			newErrors.name = 'Name must be at least 3 characters';
		}

		// EMAIL
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!emailRegex.test(formData.email)) {
			newErrors.email = 'Invalid email address';
		}

		// PHONE
		const phoneRegex = /^[6-9]\d{9}$/;
		if (formData.phone && !phoneRegex.test(formData.phone)) {
			newErrors.phone = 'Enter valid 10 digit phone number';
		}

		// SUBJECT
		if (!formData.subject) {
			newErrors.subject = 'Please select a subject';
		}

		// MESSAGE
		if (!formData.message.trim()) {
			newErrors.message = 'Message is required';
		} else if (formData.message.length < 10) {
			newErrors.message = 'Message must be at least 10 characters';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		if (e?.preventDefault) e.preventDefault();

		if (!validateForm()) return;

		setSubmitting(true);

		const INQUIRY_TYPE_MAP = {
			general: 'GENERAL',
			property: 'PROPERTY',
			owner: 'OWNER',
			tenant: 'TENANT',
			partnership: 'PARTNERSHIP',
			support: 'SUPPORT',
		};

		try {
			const payload = {
				name: formData.name.trim(),
				email: formData.email.trim(),
				message: formData.message.trim(),
				inquiry_type: INQUIRY_TYPE_MAP[formData.subject] || 'GENERAL',
				source_page: window.location.pathname,
			};

			if (formData.phone) {
				payload.phone = formData.phone;
			}

			console.log('Submitting payload:', payload);
			const response = await api.post('/inquiries/', payload);
			console.log('Success:', response?.data);

			setIsSubmitted(true);
			toast.success('Message sent successfully! We will get back to you soon.');
		} catch (error) {
			const errData = error?.response?.data;
			console.error('API Error status:', error?.response?.status);
			console.error('API Error body:', JSON.stringify(errData, null, 2));
			toast.error('Failed to send message. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Layout>
			<Helmet>
				<title>Contact InstaMakaan | Rental Help in Noida, Greater Noida & Ghaziabad</title>
				<meta name="description" content="Contact InstaMakaan for rental properties, PG, flats and property management services in Noida, Greater Noida, Noida Extension and Ghaziabad. Call, WhatsApp or send us a message." />
				<meta name="keywords" content="contact instamakaan, property contact noida, rental help noida, pg support greater noida, real estate contact ghaziabad" />
				<link rel="canonical" href="https://instamakaan.com/contact" />
				<meta property="og:title" content="Contact InstaMakaan | Rental Help in Noida & Greater Noida" />
				<meta property="og:description" content="Call, WhatsApp or message us for rental properties, PG and flats in Noida, Greater Noida and Ghaziabad." />
				<meta property="og:url" content="https://instamakaan.com/contact" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Contact InstaMakaan | Rental Help in Noida & Greater Noida" />
				<meta name="twitter:description" content="Call, WhatsApp or message us for rental properties in Noida, Greater Noida and Ghaziabad." />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "LocalBusiness",
					"name": "InstaMakaan",
					"@id": "https://instamakaan.com",
					"url": "https://instamakaan.com",
					"telephone": "+91-9771034916",
					"email": "support@instamakaan.com",
					"image": "https://instamakaan.com/images/orglogo.webp",
					"description": "Verified rental flats, PGs and co-living spaces across Noida, Greater Noida and Ghaziabad.",
					"address": {
						"@type": "PostalAddress",
						"streetAddress": "Tower T2, Flat B809, Tech Zone 4, Plot 17, Amrapali Dream Valley",
						"addressLocality": "Greater Noida",
						"addressRegion": "Uttar Pradesh",
						"postalCode": "201310",
						"addressCountry": "IN"
					},
					"openingHoursSpecification": {
						"@type": "OpeningHoursSpecification",
						"dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
						"opens": "09:00",
						"closes": "19:00"
					},
					"sameAs": ["https://instamakaan.com"]
				})}</script>
			</Helmet>
			{/* HERO */}
			<section className="relative overflow-hidden py-6 sm:py-10 md:py-16 -mt-6">
				<div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#102536]" />
				<div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-400/20 blur-3xl rounded-full -z-10" />
				<div className="absolute -bottom-24 -right-24 w-80 h-80 bg-yellow-400/20 blur-3xl rounded-full -z-10" />

				<div className="container-custom text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-3">
						Get in Touch
					</h1>
					<p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
						Have questions? We&apos;re here to help. Reach out to our team for
						any inquiries.
					</p>

					{/* TRUST BADGES */}
					<div className="mt-5 flex flex-row flex-wrap justify-center gap-2 sm:gap-4">
						{trustBadges.map((b) => (
							<div
								key={b.title}
								className="
        flex items-center gap-2 
        px-3 py-2 
        sm:px-4 sm:py-3 
        rounded-xl 
        bg-white/70 dark:bg-white/5 
        border border-slate-200/60 dark:border-white/10 
        shadow-sm backdrop-blur
      "
							>
								<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
									<b.icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
								</div>

								<div className="text-left leading-tight">
									<p className="text-sm sm:text-base font-semibold text-foreground">
										{b.title}
									</p>
									<p className="text-[11px] sm:text-xs text-muted-foreground">
										{b.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CONTACT SECTION */}
			<section className="py-10 md:py-16">
				<div className="container-custom overflow-visible">
					<div className="grid lg:grid-cols-3 gap-8 items-start">
						{/* LEFT SIDE */}
						<div className="lg:col-span-1 lg:order-1 order-2">
							<div className="space-y-6">
								{/* CONTACT INFO */}
								<div>
									<h2 className="text-xl font-semibold text-foreground mb-4">
										Contact Information
									</h2>

									<div className="space-y-4">
										{contactInfo.map((info) => (
											<Card
												key={info.title}
												className="bg-card border-0 shadow-card overflow-hidden rounded-3xl"
											>
												<CardContent className="p-3 sm:p-4">
													{info.link ? (
														<a
															href={info.link}
															className="flex items-start gap-4 group"
														>
															<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
																<info.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
															</div>

															<div className="min-w-0">
																<p className="text-sm text-muted-foreground">
																	{info.title}
																</p>
																<p className="font-medium text-foreground group-hover:text-primary transition-colors break-words">
																	{info.value}
																</p>
															</div>
														</a>
													) : (
														<div className="flex items-start gap-4">
															<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
																<info.icon className="w-5 h-5 text-primary" />
															</div>

															<div className="min-w-0">
																<p className="text-sm text-muted-foreground">
																	{info.title}
																</p>
																<p className="font-medium text-foreground break-words">
																	{info.value}
																</p>
															</div>
														</div>
													)}
												</CardContent>
											</Card>
										))}
									</div>
								</div>

								{/* MAP */}
								<Card className="bg-card border-0 shadow-card overflow-hidden rounded-3xl">
									<div className="relative aspect-[4/3]">
										<iframe
											title="InstaMakaan Office Location"
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.965149459954!2d77.4344158!3d28.600822299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef29ba0e1a4f%3A0x63538614dd1688af!2sNX%20One%20Avenue.!5e0!3m2!1sen!2sin!4v1769437555186!5m2!1sen!2sin"
											className="absolute inset-0 w-full h-full border-0"
											allowFullScreen=""
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										/>
									</div>
								</Card>
							</div>
						</div>

						{/* RIGHT SIDE - FORM */}
						<div className="lg:col-span-2 lg:order-2 order-1 sticky top-24 lg:static h-fit">
							<Card className="bg-card border-0 shadow-elevated overflow-hidden rounded-3xl">
								<CardContent className="p-6 md:p-10 relative">
									<div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-teal-50/40 to-yellow-50/30 dark:from-[#0b1220] dark:via-[#0f1f2e] dark:to-[#0b1220]" />

									{isSubmitted ? (
										<div className="text-center py-12">
											<div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
												<CheckCircle2 className="w-8 h-8 text-success" />
											</div>
											<h3 className="text-xl font-semibold text-foreground mb-2">
												Message Sent Successfully!
											</h3>
											<p className="text-muted-foreground mb-6">
												Thank you for reaching out. We&apos;ll get back to you
												within 24 hours.
											</p>
											<Button
												variant="outline"
												onClick={() => {
													setIsSubmitted(false);
													setFormData({
														name: '',
														email: '',
														phone: '',
														subject: '',
														message: '',
													});
												}}
											>
												Send Another Message
											</Button>
										</div>
									) : (
										<>
											<h2 className="text-2xl font-bold text-foreground mb-2">
												Send us a Message
											</h2>
											<p className="text-muted-foreground mb-8">
												Fill the form and our team will contact you shortly.
											</p>

											<form
												ref={formRef}
												onSubmit={handleSubmit}
												className="space-y-6"
											>
												<div className="grid sm:grid-cols-2 gap-4">
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Name *
														</label>
														<Input
															placeholder="Your name"
															value={formData.name}
															onChange={(e) =>
																handleChange('name', e.target.value)
															}
															className={errors.name ? 'border-red-500' : ''}
														/>
														{errors.name && (
															<p className="text-red-500 text-xs mt-1">
																{errors.name}
															</p>
														)}
													</div>
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Email *
														</label>
														<Input
															type="email"
															placeholder="your@email.com"
															value={formData.email}
															onChange={(e) =>
																handleChange('email', e.target.value)
															}
															className={errors.email ? 'border-red-500' : ''}
														/>
														{errors.email && (
															<p className="text-red-500 text-xs mt-1">
																{errors.email}
															</p>
														)}
													</div>
												</div>

												<div className="grid sm:grid-cols-2 gap-4">
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Phone
														</label>
														<Input
															type="tel"
															placeholder="10 digit phone number"
															value={formData.phone}
															onChange={(e) => {
																const value = e.target.value.replace(/\D/g, '');
																if (value.length <= 10)
																	handleChange('phone', value);
															}}
														/>
														{errors.phone && (
															<p className="text-red-500 text-xs mt-1">
																{errors.phone}
															</p>
														)}
													</div>
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Subject *
														</label>
														<Select
															value={formData.subject}
															onValueChange={(value) =>
																handleChange('subject', value)
															}
														>
															<SelectTrigger
																className={
																	errors.subject ? 'border-red-500' : ''
																}
															>
																<SelectValue placeholder="Select a subject" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="general">
																	General Inquiry
																</SelectItem>
																<SelectItem value="property">
																	Property Inquiry
																</SelectItem>
																<SelectItem value="owner">
																	For Property Owners
																</SelectItem>
																<SelectItem value="tenant">
																	For Tenants
																</SelectItem>
																<SelectItem value="partnership">
																	Partnership
																</SelectItem>
																<SelectItem value="support">Support</SelectItem>
															</SelectContent>
														</Select>
														{errors.subject && (
															<p className="text-red-500 text-xs mt-1">
																{errors.subject}
															</p>
														)}
													</div>
												</div>

												<div>
													<label className="text-sm font-medium text-foreground mb-2 block">
														Message *
													</label>
													<Textarea
														placeholder="Tell us how we can help you..."
														rows={6}
														value={formData.message}
														onChange={(e) =>
															handleChange('message', e.target.value)
														}
														className={errors.message ? 'border-red-500' : ''}
													/>
													{errors.message && (
														<p className="text-red-500 text-xs mt-1">
															{errors.message}
														</p>
													)}
												</div>

												{Object.keys(errors).length > 0 && (
													<div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
														Please fix the errors above before submitting.
													</div>
												)}

												<Button
													type="submit"
													variant="teal"
													size="lg"
													className="w-full sm:w-auto"
													disabled={submitting}
												>
													{submitting ? (
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													) : (
														<Send className="w-4 h-4 mr-2" />
													)}
													Send Message
												</Button>
											</form>
										</>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* ── Extended FAQ Section ── */}
			<section className="bg-gray-50 dark:bg-[#0b1220] border-t border-gray-100 dark:border-white/5 py-14 px-4">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
					<p className="text-gray-500 dark:text-gray-400 mb-8">Everything you need to know about renting, buying, and using InstaMakaan.</p>
					<div className="space-y-3">
						{[
							{
								q: 'How soon will I get a response?',
								a: 'Our team typically responds within a few hours during working hours. For urgent requests, we prioritise faster replies.',
							},
							{
								q: 'Can I visit your office directly?',
								a: 'Yes, you can visit our office during working hours (Mon–Sat, 9AM–7PM). We recommend booking a quick call before visiting so we can make sure the right person is available.',
							},
							{
								q: 'Do you help property owners and tenants both?',
								a: 'Yes! We work with both — property owners can list their properties, and tenants can find verified homes to rent or buy.',
							},
							{
								q: 'How is InstaMakaan different from other property portals?',
								a: 'InstaMakaan connects you directly with property owners — no middlemen, no hidden charges. Every listing is verified before it goes live, so you only see real, available properties.',
							},
							{
								q: 'Is there a fee for finding a rental property?',
								a: 'Finding and browsing properties on InstaMakaan is completely free for tenants. A one-time service fee applies only when you finalise a property through us.',
							},
							{
								q: 'How do I schedule a property visit?',
								a: 'Click the "Contact Owner" or "Schedule Visit" button on any property listing. You can also call or WhatsApp us directly at +91 97710 34916 and we will arrange the visit for you.',
							},
							{
								q: 'Are the properties verified?',
								a: 'Yes. Every property listed on InstaMakaan goes through a verification process — we confirm ownership documents and physically verify the property condition before listing.',
							},
							{
								q: 'Can I list my property on InstaMakaan?',
								a: 'Yes! Property owners can list their rental or sale properties through our Owner section. Our team will verify and publish the listing within 24 hours.',
							},
							{
								q: 'What areas do you cover?',
								a: 'We currently focus on Greater Noida West, Techzone 4, Noida Extension, Gaur City, and surrounding sectors. We are expanding to more areas — check back soon.',
							},
							{
								q: 'How long does it take to find a property?',
								a: 'Most of our users find a suitable property within 3–7 days. If you share your requirements with us on WhatsApp, our team will shortlist properties matching your needs within 24 hours.',
							},
						].map((item, i) => (
							<details key={i} className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
								<summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-800 dark:text-white list-none">
									{item.q}
									<span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">⌄</span>
								</summary>
								<p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
							</details>
						))}
					</div>
				</div>
			</section>

			{/* MOBILE BOTTOM BAR */}
			<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
				<div
					className="flex justify-around items-center px-4 py-2 rounded-2xl 
	bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-lg 
	border border-gray-200 dark:border-white/10 
	shadow-xl"
				>
					{/* BACK */}
					<button
						onClick={() => navigate(-1)}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<ArrowLeft className="w-5 h-5 mb-1" />
						Back
					</button>

					{/* CALL (Primary) */}
					<button
						onClick={handleCall}
						className="flex flex-col items-center text-[11px] text-600 font-medium active:scale-90 transition"
					>
						<Phone className="w-5 h-5 mb-1" />
						Call
					</button>

					{/* WHATSAPP */}
					<button
						onClick={handleWhatsApp}
						className="flex flex-col items-center text-[11px] text-green-600"
					>
						<MessageCircle className="w-5 h-5 mb-1" />
						WhatsApp
					</button>

					{/* SUBMIT */}
					<button
						onClick={handleSubmit}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<Send className="w-5 h-5 mb-1" />
						Send
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default ContactPage;
