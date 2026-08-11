import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Building2, Clock } from 'lucide-react';

export const CompanyTwoCard = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/sell-companies/company-two')}
      className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-md hover:shadow-xl hover:shadow-slate-500/10 hover:border-slate-400/40 transition-all duration-300 flex flex-col md:flex-row md:h-[300px]"
    >
      {/* ── Left: Placeholder panel ── */}
      <div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <Building2 size={64} className="text-white/20" />
          <span className="text-white/30 text-xs font-semibold tracking-[0.2em] uppercase">Coming Soon</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-slate-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Commercial Property
          </span>
        </div>
      </div>

      {/* ── Right: Content ── */}
      <div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">

        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors leading-tight">
              Company Two
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              <Clock size={10} /> Coming Soon
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-2">
            Details will be published shortly
          </p>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-5">
            <MapPin size={12} className="flex-shrink-0" />
            <span>Location, City</span>
          </div>

          {/* Placeholder content */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2">
            <Building2 size={24} className="text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              We're onboarding this developer partner.<br />
              Register your interest to get early access.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 mt-1 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 hidden sm:block">Developer Name · City</p>
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/sell-companies/company-two'); }}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors ml-auto whitespace-nowrap"
          >
            Register Interest <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
