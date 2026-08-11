import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.aisensy.com/aabbf5';
const PHONE_NUMBER = '+919771034916';

/**
 * Mobile-only bottom action bar. The AiSensy WhatsApp widget is desktop-only
 * (gated at min-width:768px in index.html), so every mobile page needs its
 * own WhatsApp entry point here — this is that entry point.
 *
 * Props:
 *   message : string (optional) — pre-filled WhatsApp text for this page
 *   browsePath : string (optional) — where the "Properties" button goes (default /rent)
 *   browseLabel : string (optional) — label for the "Properties" button
 */
const MobileBottomBar = ({
	message = 'Hi, I want to know more about InstaMakaan',
	browsePath = '/rent',
	browseLabel = 'Properties',
}) => {
	const navigate = useNavigate();

	const handleCall = () => {
		window.location.href = `tel:${PHONE_NUMBER}`;
	};

	const handleWhatsApp = () => {
		window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
	};

	return (
		<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
			<div
				className="flex justify-around items-center px-4 py-2 rounded-2xl
	bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-lg
	border border-gray-200 dark:border-white/10
	shadow-xl"
			>
				<button
					onClick={() => navigate(-1)}
					className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
				>
					<ArrowLeft className="w-5 h-5 mb-1" />
					Back
				</button>

				<button
					onClick={() => navigate(browsePath)}
					className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
				>
					<Building2 className="w-5 h-5 mb-1" />
					{browseLabel}
				</button>

				<button
					onClick={handleCall}
					className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
				>
					<Phone className="w-5 h-5 mb-1" />
					Call
				</button>

				<button
					onClick={handleWhatsApp}
					className="flex flex-col items-center text-[11px] text-green-600 active:scale-90 transition"
				>
					<MessageCircle className="w-5 h-5 mb-1" />
					WhatsApp
				</button>
			</div>
		</div>
	);
};

export default MobileBottomBar;
