import React from 'react';
import { Info } from 'lucide-react';

export const ResultCard = ({ title, value, subtitle, highlight = false, infoText }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      highlight 
        ? 'bg-primary/5 border-primary/20 shadow-sm dark:bg-primary/10 dark:border-primary/30' 
        : 'bg-white border-gray-100 shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        {infoText && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-900 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {infoText}
            </div>
          </div>
        )}
      </div>
      <div className={`text-2xl md:text-3xl font-bold ${highlight ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
