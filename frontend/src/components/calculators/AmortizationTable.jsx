import React from 'react';
import { formatCurrency } from '../../utils/formatter';

export const AmortizationTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full max-h-[420px] overflow-y-auto overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 custom-scrollbar relative">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300 sticky top-0 z-10 shadow-xs">
          <tr>
            <th scope="col" className="px-6 py-3.5 font-semibold">Month</th>
            <th scope="col" className="px-6 py-3.5 font-semibold text-right">Principal</th>
            <th scope="col" className="px-6 py-3.5 font-semibold text-right">Interest</th>
            <th scope="col" className="px-6 py-3.5 font-semibold text-right text-emerald-600 dark:text-emerald-400">Extra Pay</th>
            <th scope="col" className="px-6 py-3.5 font-semibold text-right text-blue-600 dark:text-blue-400">Total EMI</th>
            <th scope="col" className="px-6 py-3.5 font-semibold text-right">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((row, i) => {
            const principalVal = row.principal !== undefined ? row.principal : row.principalPaid;
            const interestVal = row.interest !== undefined ? row.interest : row.interestPaid;
            const extraVal = row.extraPayment !== undefined ? row.extraPayment : row.prepaymentAmount;
            const emiVal = row.emi !== undefined ? row.emi : (principalVal + interestVal);
            const balanceVal = row.balance !== undefined ? row.balance : row.remainingBalance;

            return (
              <tr 
                key={i} 
                className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors ${
                  row.month % 12 === 0 ? 'bg-gray-50/60 dark:bg-gray-800/30 font-medium' : 'bg-white dark:bg-gray-900'
                }`}
              >
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                  {row.month} <span className="text-xs text-gray-400 font-normal ml-1">(Yr {row.year || Math.ceil(row.month / 12)})</span>
                </td>
                <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(principalVal)}
                </td>
                <td className="px-6 py-3 text-right text-gray-600 dark:text-gray-400">
                  {formatCurrency(interestVal)}
                </td>
                <td className="px-6 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  {extraVal > 0 ? formatCurrency(extraVal) : '-'}
                </td>
                <td className="px-6 py-3 text-right text-blue-600 dark:text-blue-400 font-medium">
                  {formatCurrency(emiVal + extraVal)}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(balanceVal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
