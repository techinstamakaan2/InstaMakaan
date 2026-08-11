import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

/**
 * InfoTooltip
 * Uses Radix UI Tooltip to display helpful definitions when hovering over terms.
 */
export const InfoTooltip = ({ text, content }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help group">
            {text}
            <Info className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            className="z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xl max-w-xs animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
