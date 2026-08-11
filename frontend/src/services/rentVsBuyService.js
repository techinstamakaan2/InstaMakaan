/**
 * Advanced Rent vs Buy financial model.
 */
export const calculateRentVsBuy = (inputs) => {
  const {
    propertyValue,
    loanTenure,
    homeLoanRate,
    downPaymentPercent,
    appreciationRate,
    monthlyRent,
    rentInflation,
    investmentReturn,
    maintenancePercent, // Annual maintenance as % of property value
    propertyTaxPercent, // Annual property tax as % of property value
    registrationPercent, // One-time cost
    brokeragePercent, // One time cost (Buy)
    rentBrokerage, // One time cost (Rent)
    rentSecurityDeposit,
  } = inputs;

  const downPayment = propertyValue * (downPaymentPercent / 100);
  const loanAmount = propertyValue - downPayment;
  const registrationCost = propertyValue * (registrationPercent / 100);
  const brokerageCost = propertyValue * (brokeragePercent / 100);
  
  const totalUpfrontBuy = downPayment + registrationCost + brokerageCost;
  const totalUpfrontRent = rentSecurityDeposit + rentBrokerage;

  // EMI
  const r = homeLoanRate / 12 / 100;
  const n = loanTenure * 12;
  const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;

  let chartData = [];
  let currentRent = monthlyRent;
  
  // Variables for compounding
  // Renting starts with an investment pot equal to the difference in upfront costs
  let investmentPot = Math.max(0, totalUpfrontBuy - totalUpfrontRent); 
  
  let buyNetWorth = 0;
  let rentNetWorth = investmentPot;
  let outstandingLoan = loanAmount;
  let currentPropertyValue = propertyValue;

  let breakEvenYear = null;

  // Simulate year by year
  for (let year = 1; year <= loanTenure; year++) {
    // --- BUY MATH ---
    currentPropertyValue = currentPropertyValue * (1 + appreciationRate / 100);
    
    // Remaining Loan
    const p = year * 12;
    if (year === loanTenure) {
      outstandingLoan = 0;
    } else if (r > 0) {
      outstandingLoan = loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, p)) / (Math.pow(1 + r, n) - 1);
    } else {
      outstandingLoan = loanAmount - (emi * p);
    }

    // Annual Buy Costs
    const maintenanceCost = currentPropertyValue * (maintenancePercent / 100);
    const taxCost = currentPropertyValue * (propertyTaxPercent / 100);
    const totalAnnualBuyCosts = maintenanceCost + taxCost;
    
    buyNetWorth = currentPropertyValue - outstandingLoan;

    // --- RENT MATH ---
    // Rent goes up yearly
    if (year > 1) {
      currentRent = currentRent * (1 + rentInflation / 100);
    }

    const annualRentPaid = currentRent * 12;
    const annualEmiPaid = emi * 12;
    
    // Annual investment is the difference between Buy cashflow (EMI + maintenance + taxes) and Rent cashflow
    // If renting is cheaper, we invest the difference.
    // If buying is cheaper, renting pot gets depleted (negative savings).
    const annualSavings = (annualEmiPaid + totalAnnualBuyCosts) - annualRentPaid;
    
    // Compound the investment pot yearly (simplified for performance over monthly)
    investmentPot = investmentPot * (1 + investmentReturn / 100) + annualSavings;
    
    rentNetWorth = investmentPot;

    // Check for Break Even
    if (breakEvenYear === null && buyNetWorth > rentNetWorth) {
      breakEvenYear = year;
    }

    chartData.push({
      year: `Year ${year}`,
      Buy: Math.round(buyNetWorth),
      Rent: Math.round(rentNetWorth),
      rentCost: Math.round(currentRent),
      propertyValue: Math.round(currentPropertyValue),
      loanBalance: Math.round(outstandingLoan)
    });
  }

  const winner = buyNetWorth > rentNetWorth ? 'Buy' : 'Rent';
  const difference = Math.abs(buyNetWorth - rentNetWorth);
  
  let recommendationMessage = [];
  if (winner === 'Buy') {
      recommendationMessage = [
        `Buying creates a higher net wealth by <strong>${difference >= 10000000 ? (difference/10000000).toFixed(2) + ' Cr' : (difference/100000).toFixed(2) + ' Lakhs'}</strong> over ${loanTenure} years.`,
        `Property appreciation outpaces your investment returns after accounting for rent inflation.`,
        `You recover buying costs (downpayment, registration) after Year ${breakEvenYear}.`
      ];
  } else {
      recommendationMessage = [
        `Renting creates a higher net wealth by <strong>${difference >= 10000000 ? (difference/10000000).toFixed(2) + ' Cr' : (difference/100000).toFixed(2) + ' Lakhs'}</strong> over ${loanTenure} years.`,
        `The flexibility of renting and compounding your savings yields better returns.`,
        `You avoid heavy upfront costs and maintenance expenses associated with buying.`
      ];
  }

  // Dynamic Insights
  const insights = [];
  insights.push(`Your rent will increase from <strong>₹${monthlyRent.toLocaleString('en-IN')}</strong> to <strong>₹${Math.round(currentRent).toLocaleString('en-IN')}</strong> by Year ${loanTenure} at ${rentInflation}% inflation.`);
  if (appreciationRate > investmentReturn) {
    insights.push(`Property appreciates faster (${appreciationRate}%) than your investment return (${investmentReturn}%), favoring buying heavily.`);
  } else {
    insights.push(`Investment returns (${investmentReturn}%) beat property appreciation (${appreciationRate}%), giving renting an edge if you invest disciplinedly.`);
  }
  if (breakEvenYear) {
    insights.push(`Break-even occurs in <strong>Year ${breakEvenYear}</strong>. If you plan to move before this, renting is financially safer.`);
  }

  // Scenarios for Rent vs Buy (Down payments 10%, 20%, 30%)
  // For simplicity we just return a structured object for the UI to render if needed
  const scenarios = [10, 20, 30].map(pct => {
      const dpAmt = propertyValue * (pct / 100);
      const loanAmt = propertyValue - dpAmt;
      const r_scenario = homeLoanRate / 12 / 100;
      const emi_scenario = r_scenario > 0 ? (loanAmt * r_scenario * Math.pow(1 + r_scenario, n)) / (Math.pow(1 + r_scenario, n) - 1) : loanAmt / n;
      return {
          downPaymentPct: pct,
          downPaymentAmt: dpAmt,
          loanAmount: loanAmt,
          emi: emi_scenario
      };
  });

  return {
    downPayment,
    loanAmount,
    totalUpfrontBuy,
    totalUpfrontRent,
    emi,
    finalBuyNetWorth: buyNetWorth,
    finalRentNetWorth: rentNetWorth,
    winner,
    difference,
    breakEvenYear,
    recommendationMessage,
    insights,
    scenarios,
    chartData
  };
};
