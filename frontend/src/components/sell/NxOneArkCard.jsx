import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BadgeCheck, ArrowRight, Download, Check, UserCheck } from 'lucide-react';

const BROCHURE_PATH = '/brochures/nx-one-ark-brochure.pdf';

const STATS = [
  { label: 'Structure', value: 'G+26 Floors' },
  { label: 'BSP', value: '₹11,990/sqft', accent: true },
  { label: 'Units', value: '851–3,049 sqft' },
  { label: 'RERA', value: 'Approved' },
];

const CHIPS = [
  'Club π · 10+ Amenities',
  '9 Mitsubishi Elevators',
  'AQI Controlled',
  'EV Charging',
];

export const NxOneArkCard = () => {
  const navigate = useNavigate();
  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = BROCHURE_PATH;
    a.download = 'NX-ONE-ARK-Brochure.pdf';
    a.target = '_blank';
    a.click();
  };

  return (
    <div
      onClick={() => navigate('/sell-companies/nx-one-ark')}
      className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-md hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-400/40 transition-all duration-300 flex flex-col md:flex-row md:h-[300px]"
    >
      {/* ── Left: Video ── */}
      <div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-900">
        <video
          src="/videos/Entrancegate.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

        {/* top badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-teal-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Commercial Office Space
          </span>
        </div>

        {/* bottom left: RERA */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 bg-green-600/90 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
            <BadgeCheck size={11} /> RERA Approved
          </span>
        </div>

        {/* bottom right: developer */}
        <div className="absolute bottom-3 right-3">
          <span className="text-white/70 text-[10px] font-medium">SP SAI IT PVT LTD</span>
        </div>
      </div>

      {/* ── Right: Content ── */}
      <div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">

        {/* Top: name + location */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <img src="/images/nx-one-ark/logo-nxone.png" alt="NX ONE" className="h-8 w-auto object-contain" />
              <span className="text-slate-300 dark:text-slate-600 text-base font-light">–</span>
              <img src="/images/nx-one-ark/logo-ark.png" alt="ARK" className="h-6 w-auto object-contain" />
            </div>
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/30 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              New Launch
            </span>
          </div>
          <p className="text-teal-600 dark:text-teal-400 text-sm font-medium mb-2">
            Your Business. Elevated.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1.5">
            <MapPin size={12} className="text-teal-500 flex-shrink-0" />
            <span className="truncate">Tech Zone IV, Greater Noida (West), U.P.</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs mb-4">
            <UserCheck size={12} className="flex-shrink-0" />
            <span>Managed by Rahul Sharma</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {STATS.map(({ label, value, accent }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-400 mb-0.5 leading-tight">{label}</p>
                <p className={`font-bold text-xs leading-tight ${accent ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-white'}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map((c) => (
              <span key={c} className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                <Check size={9} className="text-teal-500" /> {c}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: CTA row */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400 hidden sm:block">
            G+26 · Tech Zone IV · Greater Noida West
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 border border-teal-500/50 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download size={13} /> Brochure
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/sell-companies/nx-one-ark'); }}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              View Details <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
