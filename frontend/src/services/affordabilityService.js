import { calculateEMI, calculateMaxLoanFromEMI } from '../utils/finance';

/**
 * Calculates affordability based on combined income and debts.
 */
export const calculateAffordability = ({
  partner1Income,
  partner2Income,
  householdExpenses,
  creditCardEmi,
  carLoanEmi,
  personalLoanEmi,
  otherEmi,
  homeLoanRate,
  loanTenure,
  downPaymentPercent,
  customFoir
}) => {
  const combinedIncome = partner1Income + partner2Income;
  const totalExistingDebts = creditCardEmi + carLoanEmi + personalLoanEmi + otherEmi;
  const totalFixedObligations = totalExistingDebts + householdExpenses;
  
  // Use custom FOIR (Fraction of Income Ratio) or fallback to 50%
  const foir = customFoir / 100 || 0.5;
  
  // Max allowed EMI based on FOIR
  const maxTotalEmi = combinedIncome * foir;
  const maxHomeLoanEmi = Math.max(0, maxTotalEmi - totalExistingDebts);

  // Maximum loan based on the affordable EMI
  const maxLoanAmount = calculateMaxLoanFromEMI(maxHomeLoanEmi, homeLoanRate, loanTenure);
  
  // Property price based on down payment percentage
  const maxHomePrice = maxLoanAmount / (1 - (downPaymentPercent / 100));
  const downPaymentRequired = maxHomePrice - maxLoanAmount;

  // Disposable income left after paying all debts and home loan EMI
  const disposableIncome = Math.max(0, combinedIncome - totalExistingDebts - maxHomeLoanEmi);
  
  // Debt Ratio (Total debts / Total Income)
  const debtRatio = combinedIncome > 0 ? ((totalExistingDebts + maxHomeLoanEmi) / combinedIncome) * 100 : 0;

  // Recommendation Engine Logic (Using bullet points)
  let riskLevel = 'Average';
  let riskMessage = [];

  if (debtRatio < 35) {
    riskLevel = 'Excellent';
    riskMessage = [
      'Your debt ratio is low, placing you in a very safe financial bracket.',
      'You will have a healthy monthly surplus after paying all EMIs.',
      'Lenders are highly likely to approve your loan at the best interest rates.'
    ];
  } else if (debtRatio < 45) {
    riskLevel = 'Good';
    riskMessage = [
      'Your disposable income remains healthy.',
      'You have room for emergencies without defaulting on payments.',
      'Consider keeping an emergency fund of at least 6 months.'
    ];
  } else if (debtRatio <= 55) {
    riskLevel = 'Average';
    riskMessage = [
      'Your EMI burden is standard, but you are nearing maximum limits.',
      'You may feel a cash squeeze during unexpected emergencies.',
      'Consider lowering your home price budget slightly for safety.'
    ];
  } else {
    riskLevel = 'Risky';
    riskMessage = [
      'Your EMI burden is exceptionally high against your income.',
      'Lenders may reject the loan or require a co-applicant.',
      'You should pay off existing debts (like Credit Cards) before applying.'
    ];
  }

  // Generate Dynamic Insights
  const insights = [];
  insights.push(`You still have a buffer of <strong>₹${Math.max(0, disposableIncome - householdExpenses).toLocaleString('en-IN')}</strong> left every month after paying all household expenses and EMIs.`);
  
  if (totalExistingDebts > 0) {
    const loanWithoutDebts = calculateMaxLoanFromEMI(maxTotalEmi, homeLoanRate, loanTenure);
    const difference = loanWithoutDebts - maxLoanAmount;
    if (difference > 100000) {
      insights.push(`If you pay off your existing debts, your maximum loan eligibility increases by <strong>₹${(difference/100000).toFixed(1)} Lakhs</strong>.`);
    }
  }

  const loanWithLowerRate = calculateMaxLoanFromEMI(maxHomeLoanEmi, Math.max(1, homeLoanRate - 1), loanTenure);
  const rateDiff = loanWithLowerRate - maxLoanAmount;
  if (rateDiff > 100000) {
      insights.push(`A 1% lower interest rate would increase your affordability by <strong>₹${(rateDiff/100000).toFixed(1)} Lakhs</strong>.`);
  }

  // Compare Scenarios (10%, 20%, 30%, 40%, 50% + current if custom)
  const defaultPcts = [10, 20, 30, 40, 50];
  const pcts = Array.from(new Set([...defaultPcts, downPaymentPercent])).sort((a, b) => a - b);
  const scenarios = pcts.map(pct => {
      const dpAmt = (maxHomePrice * (pct / 100));
      const loanAmt = maxHomePrice - dpAmt;
      const emi = calculateEMI(loanAmt, homeLoanRate, loanTenure);
      return {
          downPaymentPct: pct,
          downPaymentAmt: dpAmt,
          loanAmount: loanAmt,
          emi: emi,
          totalInterest: (emi * loanTenure * 12) - loanAmt
      };
  });


  // Chart Data Preparation
  const chartData = [
    { name: 'Max Loan Amount', value: maxLoanAmount, color: '#3b82f6' }, // blue-500
    { name: 'Down Payment', value: downPaymentRequired, color: '#10b981' } // emerald-500
  ];

  const incomeData = [
    { name: 'Existing Debts', value: totalExistingDebts, color: '#ef4444' }, // red-500
    { name: 'New Home EMI', value: maxHomeLoanEmi, color: '#f59e0b' }, // amber-500
    { name: 'Disposable Income', value: disposableIncome, color: '#10b981' } // emerald-500
  ];

  return {
    combinedIncome,
    totalExistingDebts,
    maxHomeLoanEmi,
    maxLoanAmount,
    maxHomePrice,
    downPaymentRequired,
    disposableIncome,
    debtRatio,
    riskLevel,
    riskMessage,
    insights,
    scenarios,
    chartData,
    incomeData
  };
};
