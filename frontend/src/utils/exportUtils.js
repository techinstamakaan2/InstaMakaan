/**
 * Utility functions for exporting data from the calculators.
 */

/**
 * Converts an array of objects into a CSV string.
 * @param {Array<Object>} data The array of data objects to convert.
 * @returns {string} The CSV formatted string.
 */
export const generateCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Escape strings containing commas
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Triggers a download of a CSV file.
 * @param {string} csvContent The CSV string.
 * @param {string} filename The desired filename (e.g. 'export.csv').
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) { 
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.style.visibility = 'hidden';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
