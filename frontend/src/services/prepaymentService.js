import { calculateEMI } from '../utils/finance';

/**
 * Calculates a standard loan amortization schedule and a prepayment scenario.
 */
export const calculatePrepayment = ({
  principal,
  interestRate,
  tenureYears,
  monthsAlreadyPaid = 0,
  prepaymentAmount,
  prepaymentFrequency, // 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'
  prepaymentStartYear = 1,
  prepaymentType = 'Reduce Tenure' // 'Reduce Tenure' or 'Reduce EMI'
}) => {
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  const baseEmi = calculateEMI(principal, interestRate, tenureYears);
  
  if (principal <= 0 || tenureYears <= 0) {
    return {
      baseEmi: 0,
      outstandingBalance: 0,
      totalInterestBase: 0,
      totalInterestPrepay: 0,
      interestSaved: 0,
      monthsSaved: 0,
      yearsSaved: 0,
      extraMonthsSaved: 0,
      newTenureMonths: 0,
      chartData: [],
      amortization: [],
      insights: []
    };
  }

  // 1. Calculate actual current balance after monthsAlreadyPaid
  let outstandingBalance = principal;
  let totalInterestAlreadyPaid = 0;
  const actualMonthsPaid = Math.min(monthsAlreadyPaid, n - 1);

  for (let m = 1; m <= actualMonthsPaid; m++) {
    const interest = outstandingBalance * r;
    totalInterestAlreadyPaid += interest;
    let prin = baseEmi - interest;
    if (prin > outstandingBalance) prin = outstandingBalance;
    outstandingBalance -= prin;
  }

  const remainingMonths = n - actualMonthsPaid;

  // Scenario 1: Base Loan (Without Prepayment over remaining tenure)
  let balanceBase = outstandingBalance;
  let totalInterestBase = 0;
  let monthsBase = 0;

  for (let m = 1; m <= remainingMonths; m++) {
    if (balanceBase <= 0) break;
    const interest = balanceBase * r;
    totalInterestBase += interest;
    let principalPaid = baseEmi - interest;
    if (principalPaid > balanceBase) principalPaid = balanceBase;
    balanceBase -= principalPaid;
    monthsBase++;
  }

  // Scenario 2: With Prepayment
  let balancePrepay = outstandingBalance;
  let totalInterestPrepay = 0;
  let monthsPrepay = 0;
  let currentEmi = baseEmi;
  const startMonth = (prepaymentStartYear - 1) * 12 + 1;
  const amortization = [];
  const chartData = [];

  // Initial chart point (at starting month)
  chartData.push({
    month: actualMonthsPaid,
    balanceWithoutPrepay: Math.round(outstandingBalance),
    balanceWithPrepay: Math.round(outstandingBalance)
  });

  let yearlyBalanceBase = outstandingBalance;
  let yearlyBalancePrepay = outstandingBalance;

  for (let m = 1; m <= 480; m++) {
    if (balancePrepay <= 0 && yearlyBalanceBase <= 0) break;

    // Process Base Loan for chart tracking
    if (yearlyBalanceBase > 0) {
      const baseInt = yearlyBalanceBase * r;
      let basePrin = baseEmi - baseInt;
      if (basePrin > yearlyBalanceBase) basePrin = yearlyBalanceBase;
      yearlyBalanceBase -= basePrin;
    }

    // Process Prepay Loan
    let interestForMonth = 0;
    let principalPaid = 0;
    let extraPayment = 0;

    if (balancePrepay > 0) {
      interestForMonth = balancePrepay * r;
      totalInterestPrepay += interestForMonth;

      if (m >= startMonth) {
        if (prepaymentFrequency === 'Monthly') extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'Quarterly' && (m - startMonth) % 3 === 0) extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'Half-Yearly' && (m - startMonth) % 6 === 0) extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'Yearly' && (m - startMonth) % 12 === 0) extraPayment = prepaymentAmount;
        else if (prepaymentFrequency === 'One-Time' && m === startMonth) extraPayment = prepaymentAmount;
      }

      if (extraPayment > 0 && prepaymentType === 'Reduce EMI') {
        const newBalance = Math.max(0, balancePrepay - extraPayment);
        const remM = remainingMonths - m + 1;
        if (remM > 0) {
          currentEmi = calculateEMI(newBalance, interestRate, remM / 12);
        }
      }

      const totalMonthlyPayment = currentEmi + extraPayment;
      principalPaid = totalMonthlyPayment - interestForMonth;
      if (principalPaid > balancePrepay) {
        principalPaid = balancePrepay;
      }

      balancePrepay -= principalPaid;
      monthsPrepay++;
      yearlyBalancePrepay = balancePrepay;

      const currentMonthNumber = actualMonthsPaid + m;
      amortization.push({
        month: currentMonthNumber,
        year: Math.ceil(currentMonthNumber / 12),
        emi: currentEmi,
        extraPayment,
        principal: Math.max(0, principalPaid - extraPayment),
        interest: interestForMonth,
        balance: Math.max(0, balancePrepay),
        remainingBalance: Math.max(0, balancePrepay),
        principalPaid: Math.max(0, principalPaid - extraPayment),
        interestPaid: interestForMonth,
        prepaymentAmount: extraPayment
      });
    }

    const monthNumber = actualMonthsPaid + m;
    if (m % 12 === 0 || balancePrepay <= 0) {
      chartData.push({
        month: monthNumber,
        balanceWithoutPrepay: Math.max(0, Math.round(yearlyBalanceBase)),
        balanceWithPrepay: Math.max(0, Math.round(yearlyBalancePrepay))
      });
    }
  }

  const interestSaved = Math.max(0, totalInterestBase - totalInterestPrepay);
  const monthsSaved = Math.max(0, monthsBase - monthsPrepay);
  const yearsSaved = Math.floor(monthsSaved / 12);
  const extraMonthsSaved = monthsSaved % 12;

  const insights = [];
  if (interestSaved > 0) {
    insights.push(`Paying <strong>₹${prepaymentAmount.toLocaleString('en-IN')}</strong> ${prepaymentFrequency.toLowerCase()} saves you <strong>₹${(interestSaved >= 100000 ? (interestSaved/100000).toFixed(2) + ' Lakhs' : interestSaved.toLocaleString('en-IN'))}</strong> in interest.`);
    insights.push(`Your loan finishes <strong>${yearsSaved} years and ${extraMonthsSaved} months</strong> earlier.`);
    if (actualMonthsPaid > 0) {
      insights.push(`With ${actualMonthsPaid} months already paid, your current outstanding loan balance is <strong>₹${(outstandingBalance >= 100000 ? (outstandingBalance/100000).toFixed(2) + ' Lakhs' : outstandingBalance.toLocaleString('en-IN'))}</strong>.`);
    }
  } else {
    insights.push(`Increase your prepayment amount to see significant interest savings.`);
  }

  return {
    baseEmi,
    outstandingBalance,
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
