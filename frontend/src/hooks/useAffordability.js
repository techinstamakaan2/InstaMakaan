import { useState, useMemo } from 'react';
import { calculateAffordability } from '../services/affordabilityService';

export const useAffordability = (initialState = {}) => {
  const [partner1Income, setPartner1Income] = useState(initialState.partner1Income || 100000);
  const [partner2Income, setPartner2Income] = useState(initialState.partner2Income || 50000);
  const [householdExpenses, setHouseholdExpenses] = useState(initialState.householdExpenses || 40000);
  const [creditCardEmi, setCreditCardEmi] = useState(initialState.creditCardEmi || 5000);
  const [carLoanEmi, setCarLoanEmi] = useState(initialState.carLoanEmi || 10000);
  const [personalLoanEmi, setPersonalLoanEmi] = useState(initialState.personalLoanEmi || 0);
  const [otherEmi, setOtherEmi] = useState(initialState.otherEmi || 0);
  
  const [homeLoanRate, setHomeLoanRate] = useState(initialState.homeLoanRate || 8.5);
  const [loanTenure, setLoanTenure] = useState(initialState.loanTenure || 20);
  const [downPaymentPercent, setDownPaymentPercent] = useState(initialState.downPaymentPercent || 20);
  const [customFoir, setCustomFoir] = useState(initialState.customFoir || 50);

  const results = useMemo(() => {
    return calculateAffordability({
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
    });
  }, [
    partner1Income, partner2Income, householdExpenses, 
    creditCardEmi, carLoanEmi, personalLoanEmi, otherEmi,
    homeLoanRate, loanTenure, downPaymentPercent, customFoir
  ]);

  return {
    state: {
      partner1Income, setPartner1Income,
      partner2Income, setPartner2Income,
      householdExpenses, setHouseholdExpenses,
      creditCardEmi, setCreditCardEmi,
      carLoanEmi, setCarLoanEmi,
      personalLoanEmi, setPersonalLoanEmi,
      otherEmi, setOtherEmi,
      homeLoanRate, setHomeLoanRate,
      loanTenure, setLoanTenure,
      downPaymentPercent, setDownPaymentPercent,
      customFoir, setCustomFoir
    },
    results
  };
};
