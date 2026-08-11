import React from 'react';

/**
 * Timeline
 * A vertical timeline to display financial milestones.
 */
export const Timeline = ({ milestones }) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-4 py-2 space-y-8">
      {milestones.map((milestone, index) => (
        <div key={index} className="relative pl-6 md:pl-8 group">
          {/* Timeline Dot */}
          <span 
            className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 transition-colors duration-300 ${
              milestone.highlight 
                ? 'bg-primary scale-125' 
                : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-primary/50'
            }`} 
          />
          
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
            <h4 className={`text-lg font-bold ${milestone.highlight ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
              {milestone.title}
            </h4>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {milestone.subtitle}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {milestone.description}
          </p>
        </div>
      ))}
    </div>
  );
};
