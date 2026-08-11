import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RecommendationCard = ({ level, message }) => {
  const getStyles = () => {
    switch (level) {
      case 'Excellent':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-700 dark:text-emerald-300',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
        };
      case 'Good':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />
        };
      case 'Average':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />
        };
      case 'Risky':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          icon: <AlertCircle className="w-6 h-6 text-red-500" />
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          icon: <Info className="w-6 h-6 text-gray-500" />
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`p-5 rounded-2xl border ${style.bg} ${style.border}`}>
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-1">
          {style.icon}
        </div>
        <div className="w-full">
          <h4 className={`font-semibold text-lg mb-2 ${style.text}`}>
            Status: {level}
          </h4>
          
          {Array.isArray(message) ? (
            <ul className="space-y-2 mt-2">
              {message.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-60" />
                  <span dangerouslySetInnerHTML={{ __html: reason }} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: message }} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
