import { useState, useMemo } from 'react';
import { calculateRentVsBuy } from '../services/rentVsBuyService';

export const useRentVsBuy = (initialState = {}) => {
  // Buy Inputs
  const [propertyValue, setPropertyValue] = useState(initialState.propertyValue || 10000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(initialState.downPaymentPercent || 20);
  const [loanTenure, setLoanTenure] = useState(initialState.loanTenure || 20);
  const [homeLoanRate, setHomeLoanRate] = useState(initialState.homeLoanRate || 8.5);
  const [appreciationRate, setAppreciationRate] = useState(initialState.appreciationRate || 6.0);
  const [maintenancePercent, setMaintenancePercent] = useState(initialState.maintenancePercent || 1.5);
  const [propertyTaxPercent, setPropertyTaxPercent] = useState(initialState.propertyTaxPercent || 0.5);
  const [registrationPercent, setRegistrationPercent] = useState(initialState.registrationPercent || 6.0);
  const [brokeragePercent, setBrokeragePercent] = useState(initialState.brokeragePercent || 1.0);

  // Rent Inputs
  const [monthlyRent, setMonthlyRent] = useState(initialState.monthlyRent || 25000);
  const [rentInflation, setRentInflation] = useState(initialState.rentInflation || 5.0);
  const [rentSecurityDeposit, setRentSecurityDeposit] = useState(initialState.rentSecurityDeposit || 100000);
  const [rentBrokerage, setRentBrokerage] = useState(initialState.rentBrokerage || 25000);

  // Investment Inputs
  const [investmentReturn, setInvestmentReturn] = useState(initialState.investmentReturn || 12.0);

  const results = useMemo(() => {
    return calculateRentVsBuy({
      propertyValue,
      downPaymentPercent,
      loanTenure,
      homeLoanRate,
      appreciationRate,
      maintenancePercent,
      propertyTaxPercent,
      registrationPercent,
      brokeragePercent,
      monthlyRent,
      rentInflation,
      rentSecurityDeposit,
      rentBrokerage,
      investmentReturn
    });
  }, [
    propertyValue, downPaymentPercent, loanTenure, homeLoanRate, appreciationRate,
    maintenancePercent, propertyTaxPercent, registrationPercent, brokeragePercent,
    monthlyRent, rentInflation, rentSecurityDeposit, rentBrokerage, investmentReturn
  ]);

  return {
    state: {
      propertyValue, setPropertyValue,
      downPaymentPercent, setDownPaymentPercent,
      loanTenure, setLoanTenure,
      homeLoanRate, setHomeLoanRate,
      appreciationRate, setAppreciationRate,
      maintenancePercent, setMaintenancePercent,
      propertyTaxPercent, setPropertyTaxPercent,
      registrationPercent, setRegistrationPercent,
      brokeragePercent, setBrokeragePercent,
      monthlyRent, setMonthlyRent,
      rentInflation, setRentInflation,
      rentSecurityDeposit, setRentSecurityDeposit,
      rentBrokerage, setRentBrokerage,
      investmentReturn, setInvestmentReturn
    },
    results
  };
};
