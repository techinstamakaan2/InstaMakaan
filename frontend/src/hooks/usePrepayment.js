import { useState, useMemo } from 'react';
import { calculatePrepayment } from '../services/prepaymentService';

export const usePrepayment = (initialState = {}) => {
  const [principal, setPrincipal] = useState(initialState.principal || 5000000);
  const [interestRate, setInterestRate] = useState(initialState.interestRate || 8.5);
  const [tenureYears, setTenureYears] = useState(initialState.tenureYears || 20);
  
  const [prepaymentAmount, setPrepaymentAmount] = useState(initialState.prepaymentAmount || 10000);
  const [prepaymentFrequency, setPrepaymentFrequency] = useState(initialState.prepaymentFrequency || 'Monthly'); // Monthly, Quarterly, Half-Yearly, Yearly, One-Time
  const [prepaymentStartYear, setPrepaymentStartYear] = useState(initialState.prepaymentStartYear || 1);
  const [prepaymentType, setPrepaymentType] = useState(initialState.prepaymentType || 'Reduce Tenure'); // Reduce Tenure vs Reduce EMI

  const results = useMemo(() => {
    return calculatePrepayment({
      principal,
      interestRate,
      tenureYears,
      prepaymentAmount,
      prepaymentFrequency,
      prepaymentStartYear,
      prepaymentType
    });
  }, [
    principal, interestRate, tenureYears,
    prepaymentAmount, prepaymentFrequency, prepaymentStartYear, prepaymentType
  ]);

  return {
    state: {
      principal, setPrincipal,
      interestRate, setInterestRate,
      tenureYears, setTenureYears,
      prepaymentAmount, setPrepaymentAmount,
      prepaymentFrequency, setPrepaymentFrequency,
      prepaymentStartYear, setPrepaymentStartYear,
      prepaymentType, setPrepaymentType
    },
    results
  };
};
