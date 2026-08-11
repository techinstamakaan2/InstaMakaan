import { calculateEMI } from '../utils/finance';

/**
 * Calculates a standard loan amortization schedule and a prepayment scenario.
 */
export const calculatePrepayment = ({
  principal,
  interestRate,
  tenureYears,
  prepaymentAmount,
  prepaymentFrequency, // 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'
  prepaymentStartYear,
  prepaymentType // 'Reduce Tenure' or 'Reduce EMI'
}) => {
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  const baseEmi = calculateEMI(principal, interestRate, tenureYears);
  
  if (principal <= 0 || tenureYears <= 0) {
    return { baseEmi: 0, interestSaved: 0, monthsSaved: 0, chartData: [], amortization: [] };
  }

  // Scenario 1: Base Loan (Without Prepayment)
  let balanceBase = principal;
  let totalInterestBase = 0;
  let monthsBase = 0;

  for (let m = 1; m <= n; m++) {
    if (balanceBase <= 0) break;
    const interest = balanceBase * r;
    totalInterestBase += interest;
    let principalPaid = baseEmi - interest;
    if (principalPaid > balanceBase) principalPaid = balanceBase;
    balanceBase -= principalPaid;
    monthsBase++;
  }

  // Scenario 2: With Prepayment
  let balancePrepay = principal;
  let totalInterestPrepay = 0;
  let monthsPrepay = 0;
  let currentEmi = baseEmi;
  const startMonth = (prepaymentStartYear - 1) * 12 + 1;
  const amortization = [];
  const chartData = [];

  // Initial chart data point
  chartData.push({
    year: 0,
    Base: Math.round(principal),
    Prepay: Math.round(principal)
  });

  // Track yearly balances for chart
  let yearlyBalanceBase = principal;
  let yearlyBalancePrepay = principal;

  // Simulate month by month for maximum 40 years to prevent infinite loops on weird inputs
  for (let m = 1; m <= 480; m++) {
    if (balancePrepay <= 0 && yearlyBalanceBase <= 0) break; // Both loans finished

    // --- Process Base Loan (just for yearly chart tracking) ---
    if (yearlyBalanceBase > 0) {
      const baseInt = yearlyBalanceBase * r;
      let basePrin = baseEmi - baseInt;
      if (basePrin > yearlyBalanceBase) basePrin = yearlyBalanceBase;
      yearlyBalanceBase -= basePrin;
    }

    // --- Process Prepay Loan ---
    let interestForMonth = 0;
    let principalPaid = 0;
    let extraPayment = 0;

    if (balancePrepay > 0) {
      interestForMonth = balancePrepay * r;
      totalInterestPrepay += interestForMonth;

      // Determine if a prepayment happens this month
      if (m >= startMonth) {
        if (prepaymentFrequency === 'Monthly') extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'Quarterly' && (m - startMonth) % 3 === 0) extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'Half-Yearly' && (m - startMonth) % 6 === 0) extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'Yearly' && (m - startMonth) % 12 === 0) extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'One-Time' && m === startMonth) extraPayment = prepaymentAmount;
      }

      // If Reduce EMI strategy is selected and a prepayment was just made, recalculate EMI
      if (extraPayment > 0 && prepaymentType === 'Reduce EMI') {
         // Temporarily subtract extra payment to calculate new EMI for remaining tenure
         const newBalance = Math.max(0, balancePrepay - extraPayment);
         const remainingMonths = n - m + 1; // months left including this one
         if (remainingMonths > 0) {
             currentEmi = calculateEMI(newBalance, interestRate, remainingMonths / 12);
         }
      }

      const totalMonthlyPayment = currentEmi + extraPayment;
      principalPaid = totalMonthlyPayment - interestForMonth;
      
      if (principalPaid > balancePrepay) {
          principalPaid = balancePrepay; // Final month
      }
      
      balancePrepay -= principalPaid;
      monthsPrepay++;
      yearlyBalancePrepay = balancePrepay;
      
      // Save amortization details
      amortization.push({
        month: m,
        year: Math.ceil(m / 12),
        emi: currentEmi,
        extraPayment,
        principal: principalPaid - extraPayment,
        interest: interestForMonth,
        balance: Math.max(0, balancePrepay)
      });
    }

    // Save chart data at the end of every year
    if (m % 12 === 0) {
      chartData.push({
        year: m / 12,
        Base: Math.max(0, Math.round(yearlyBalanceBase)),
        Prepay: Math.max(0, Math.round(yearlyBalancePrepay))
      });
    }
  }

  // Handle fractional year at the end if loan ends mid-year
  if (monthsBase % 12 !== 0 || monthsPrepay % 12 !== 0) {
    const finalYear = Math.ceil(Math.max(monthsBase, monthsPrepay) / 12);
    // Ensure we don't duplicate the last year if it exactly hit a 12 month mark in the loop
    if (chartData[chartData.length - 1].year !== finalYear) {
      chartData.push({
        year: finalYear,
        Base: 0,
        Prepay: 0
      });
    } else {
        chartData[chartData.length - 1].Base = 0;
        chartData[chartData.length - 1].Prepay = 0;
    }
  }

  const interestSaved = Math.max(0, totalInterestBase - totalInterestPrepay);
  const monthsSaved = Math.max(0, monthsBase - monthsPrepay);
  const yearsSaved = Math.floor(monthsSaved / 12);
  const extraMonthsSaved = monthsSaved % 12;

  // Generate Insights
  const insights = [];
  if (interestSaved > 0) {
    insights.push(`Paying <strong>₹${prepaymentAmount.toLocaleString('en-IN')}</strong> ${prepaymentFrequency.toLowerCase()} saves you <strong>₹${(interestSaved >= 100000 ? (interestSaved/100000).toFixed(1) + ' Lakhs' : interestSaved.toLocaleString('en-IN'))}</strong>.`);
    insights.push(`Your loan finishes <strong>${yearsSaved} years and ${extraMonthsSaved} months</strong> earlier.`);
    if (prepaymentStartYear > 1) {
      insights.push(`Starting prepayment from Year 1 instead of Year ${prepaymentStartYear} would save you significantly more, as interest is heaviest early on.`);
    } else {
      insights.push(`You are maximizing savings by prepaying early when the interest component of your EMI is at its highest.`);
    }
  } else {
    insights.push(`Increase your prepayment amount to see significant interest savings.`);
  }

  return {
    baseEmi,
    totalInterestBase,
    totalInterestPrepay,
    interestSaved,
    monthsSaved,
    yearsSaved,
    extraMonthsSaved,
    newTenureMonths: monthsPrepay,
    chartData,
    amortization,
    insights
  };
};
