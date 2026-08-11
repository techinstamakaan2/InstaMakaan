import React from 'react';
import { Download, Printer } from 'lucide-react';
import { downloadCSV } from '../../utils/exportUtils';

/**
 * ExportPanel
 * Provides buttons for printing to PDF and downloading CSV data.
 * The print function relies on @media print CSS to format the page.
 */
export const ExportPanel = ({ csvData, csvFilename = "calculator_export.csv" }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (csvData) {
      downloadCSV(csvData, csvFilename);
    }
  };

  return (
    <div className="flex gap-3 mt-8 print:hidden">
      <button 
        onClick={handlePrint}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-all hover:shadow-md"
      >
        <Printer className="w-4 h-4" />
        Save as PDF / Print
      </button>
      
      {csvData && (
        <button 
          onClick={handleDownload}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      )}
    </div>
  );
};
