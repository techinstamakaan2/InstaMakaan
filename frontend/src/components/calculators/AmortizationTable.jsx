import React from 'react';
import { formatCurrency } from '../../utils/formatter';

export const AmortizationTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">Month</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Principal</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Interest</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right text-emerald-600 dark:text-emerald-400">Extra Pay</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right text-blue-600 dark:text-blue-400">Total EMI</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr 
              key={i} 
              className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                row.month % 12 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/20' : 'bg-white dark:bg-gray-900'
              }`}
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {row.month} <span className="text-xs text-gray-400 font-normal ml-1">(Yr {row.year})</span>
              </td>
              <td className="px-6 py-4 text-right">
                {formatCurrency(row.principal)}
              </td>
              <td className="px-6 py-4 text-right">
                {formatCurrency(row.interest)}
              </td>
              <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                {row.extraPayment > 0 ? formatCurrency(row.extraPayment) : '-'}
              </td>
              <td className="px-6 py-4 text-right text-blue-600 dark:text-blue-400 font-medium">
                {formatCurrency(row.emi + row.extraPayment)}
              </td>
              <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(row.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
