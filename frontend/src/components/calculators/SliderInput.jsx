import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';
import { validateInput } from '../../utils/validation';

export const SliderInput = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  formatDisplay, // Function to format the display (e.g. ₹ or %)
  isCurrency = false 
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Sync internal state with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSliderChange = (newVal) => {
    const val = newVal[0];
    setInputValue(val);
    onChange(val);
  };

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    setInputValue(rawVal); // Update display immediately for smooth typing
  };

  const handleInputBlur = () => {
    const validValue = validateInput(inputValue, min, max);
    setInputValue(validValue);
    onChange(validValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const decrement = () => {
    const newVal = Math.max(min, Number(value) - step);
    setInputValue(newVal);
    onChange(newVal);
  };

  const increment = () => {
    const newVal = Math.min(max, Number(value) + step);
    setInputValue(newVal);
    onChange(newVal);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Label className="text-gray-600 dark:text-gray-400 font-medium">{label}</Label>
        
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 w-full sm:w-48">
          <button 
            type="button"
            onClick={decrement}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Decrease value"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="relative flex-1">
            {isCurrency && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent text-center font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md ${isCurrency ? 'pl-6' : ''}`}
            />
          </div>
          
          <button 
            type="button"
            onClick={increment}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Increase value"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-2">
        <Slider 
          min={min} 
          max={max} 
          step={step} 
          value={[Number(value)]} 
          onValueChange={handleSliderChange}
          className="cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 font-medium px-2">
        <span>{formatDisplay ? formatDisplay(min) : min}</span>
        <span>{formatDisplay ? formatDisplay(max) : max}</span>
      </div>
    </div>
  );
};
