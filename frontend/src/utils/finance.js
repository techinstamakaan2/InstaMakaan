/**
 * Core financial mathematics functions.
 */

/**
 * Calculates Equated Monthly Installment (EMI).
 * Uses exact standard compound interest formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 */
export const calculateEMI = (principal, annualRate, tenureYears) => {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  
  if (r === 0) return principal / n;
  
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

/**
 * Calculates Maximum Loan Amount from an EMI capacity.
 * Reverse of the EMI formula.
 */
export const calculateMaxLoanFromEMI = (maxEmi, annualRate, tenureYears) => {
  if (maxEmi <= 0 || tenureYears <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;

  if (r === 0) return maxEmi * n;

  return maxEmi * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
};

/**
 * Calculates compound interest growth.
 * Uses exact Future Value of an Annuity formula.
 * FV = P(1+r/n)^(nt) + PMT * [ ((1+r/n)^(nt) - 1) / (r/n) ]
 */
export const calculateCompoundGrowth = (principal, annualRate, years, monthlyContribution = 0) => {
  const r = annualRate / 100;
  const months = years * 12;
  const monthlyRate = r / 12;
  
  if (monthlyRate === 0) {
    return principal + (monthlyContribution * months);
  }
  
  // Future Value of Initial Principal
  const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
  
  // Future Value of Monthly Contributions (Annuity)
  const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return fvPrincipal + fvContributions;
};

/**
 * Calculates remaining loan balance after a specific number of months.
 * Formula: B = P * ((1+r)^n - (1+r)^p) / ((1+r)^n - 1)
 */
export const calculateRemainingBalance = (principal, annualRate, totalMonths, monthsPaid) => {
  if (monthsPaid >= totalMonths) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) {
    const emi = principal / totalMonths;
    return Math.max(0, principal - (emi * monthsPaid));
  }
  
  const balance = principal * 
    (Math.pow(1 + r, totalMonths) - Math.pow(1 + r, monthsPaid)) / 
    (Math.pow(1 + r, totalMonths) - 1);
    
  return Math.max(0, balance);
};
