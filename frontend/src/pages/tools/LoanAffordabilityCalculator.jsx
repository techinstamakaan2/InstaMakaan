import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, BarChart3, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAffordability } from '../../hooks/useAffordability';
import { SliderInput } from '../../components/calculators/SliderInput';
import { ResultCard } from '../../components/calculators/ResultCard';
import { RecommendationCard } from '../../components/calculators/RecommendationCard';
import { AnimatedCounter } from '../../components/calculators/AnimatedCounter';
import { InfoTooltip } from '../../components/calculators/InfoTooltip';
import { InsightsPanel } from '../../components/calculators/InsightsPanel';
import { ExportPanel } from '../../components/calculators/ExportPanel';
import { formatCurrency, formatPercentage } from '../../utils/formatter';
import { generateCSV } from '../../utils/exportUtils';

export default function LoanAffordabilityCalculator() {
  const { state, results } = useAffordability();

  // Generate CSV data payload
  const csvData = [
    { 
      "Income": results.combinedIncome, 
      "Debts": results.totalExistingDebts,
      "Max Loan": results.maxLoanAmount,
      "Home Price": results.maxHomePrice,
      "EMI": results.maxHomeLoanEmi,
      "Debt Ratio": `${results.debtRatio.toFixed(2)}%`,
      "Risk Level": results.riskLevel
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Advanced Home Loan Affordability Calculator | Instamakaan</title>
        <meta name="description" content="Calculate your true home buying power based on combined income, household expenses, and existing debts." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-10 mt-16 print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
            <BarChart3 className="w-4 h-4" /> Pro-Grade Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-teal-600 dark:text-teal-400">Loan Affordability</span>{' '}
            <span className="text-amber-500 dark:text-amber-400">Calculator</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find out exactly how much home you can afford. Our advanced calculator factors in your entire financial picture to give you a bank-grade affordability assessment.
          </p>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block text-center mb-10 border-b pb-8">
            <h1 className="text-3xl font-bold text-gray-900">Instamakaan Affordability Report</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - INPUTS */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Incomes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderInput 
                  label="Your Income (Net)" 
                  value={state.partner1Income} min={0} max={1000000} step={5000} isCurrency
                  onChange={state.setPartner1Income} formatDisplay={formatCurrency} 
                />
                <SliderInput 
                  label="Partner's Income (Net)" 
                  value={state.partner2Income} min={0} max={1000000} step={5000} isCurrency
                  onChange={state.setPartner2Income} formatDisplay={formatCurrency} 
                />
                
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center group transition-colors hover:bg-primary/10">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Combined Monthly Income</span>
                    <span className="font-bold text-primary text-xl"><AnimatedCounter value={results.combinedIncome} formatter={formatCurrency} /></span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-500" />
                    Monthly Obligations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderInput 
                  label="Household Expenses" 
                  value={state.householdExpenses} min={0} max={500000} step={5000} isCurrency
                  onChange={state.setHouseholdExpenses} formatDisplay={formatCurrency} 
                />
                <SliderInput 
                  label="Credit Card EMIs" 
                  value={state.creditCardEmi} min={0} max={200000} step={1000} isCurrency
                  onChange={state.setCreditCardEmi} formatDisplay={formatCurrency} 
                />
                <SliderInput 
                  label="Car Loan EMI" 
                  value={state.carLoanEmi} min={0} max={100000} step={1000} isCurrency
                  onChange={state.setCarLoanEmi} formatDisplay={formatCurrency} 
                />
                <SliderInput 
                  label="Personal/Other EMIs" 
                  value={state.personalLoanEmi} min={0} max={100000} step={1000} isCurrency
                  onChange={state.setPersonalLoanEmi} formatDisplay={formatCurrency} 
                />
                
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 flex justify-between items-center group transition-colors hover:bg-red-100 dark:hover:bg-red-900/20">
                    <span className="font-medium text-red-700 dark:text-red-400">Total Existing Debts</span>
                    <span className="font-bold text-red-600 dark:text-red-400 text-xl"><AnimatedCounter value={results.totalExistingDebts} formatter={formatCurrency} /></span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Loan & Market Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderInput 
                  label="Home Loan Interest Rate" 
                  value={state.homeLoanRate} min={5} max={15} step={0.1}
                  onChange={state.setHomeLoanRate} formatDisplay={formatPercentage} 
                />
                <SliderInput 
                  label="Loan Tenure (Years)" 
                  value={state.loanTenure} min={1} max={30} step={1}
                  onChange={state.setLoanTenure} formatDisplay={(v) => `${v} Yrs`} 
                />
                <SliderInput 
                  label="Down Payment %" 
                  value={state.downPaymentPercent} min={10} max={90} step={5}
                  onChange={state.setDownPaymentPercent} formatDisplay={formatPercentage} 
                />
                <SliderInput 
                  label={<InfoTooltip text="Bank Max FOIR Limit" content="Fixed Obligation to Income Ratio. The maximum percentage of your income that banks allow to go towards EMI payments." />}
                  value={state.customFoir} min={30} max={70} step={1}
                  onChange={state.setCustomFoir} formatDisplay={formatPercentage} 
                />
              </CardContent>
            </Card>

            <ExportPanel csvData={generateCSV(csvData)} csvFilename="affordability_analysis.csv" />

          </div>

          {/* RIGHT COLUMN - RESULTS */}
          <div className="lg:col-span-7 space-y-6">
            
            {results.combinedIncome === 0 ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to calculate</h3>
                    <p className="text-gray-500 text-center max-w-sm">Enter your financial details in the panel to begin your affordability analysis.</p>
                </div>
            ) : (
                <>
                    <InsightsPanel insights={results.insights} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultCard 
                            title={<InfoTooltip text="Maximum Home Price" content="The total cost of the house you can afford, including your down payment." />}
                            value={<AnimatedCounter value={results.maxHomePrice} formatter={formatCurrency} />} 
                            subtitle={`Based on ${state.downPaymentPercent}% down payment`}
                            highlight={true}
                        />
                        <ResultCard 
                            title="Maximum Loan Amount" 
                            value={<AnimatedCounter value={results.maxLoanAmount} formatter={formatCurrency} />} 
                            subtitle="Approved by lender (est.)"
                        />
                        <ResultCard 
                            title={<InfoTooltip text="Affordable Home EMI" content="The maximum monthly payment you can safely afford based on the FOIR limit." />}
                            value={<AnimatedCounter value={results.maxHomeLoanEmi} formatter={formatCurrency} />} 
                            subtitle="Max EMI you can safely pay"
                        />
                        <ResultCard 
                            title="Required Down Payment" 
                            value={<AnimatedCounter value={results.downPaymentRequired} formatter={formatCurrency} />} 
                            subtitle={`Which is ${state.downPaymentPercent}% of Home Price`}
                        />
                    </div>
                    
                    <RecommendationCard level={results.riskLevel} message={results.riskMessage} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:flex print:flex-row print:gap-8">
                        <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl print:shadow-none print:border print:w-1/2">
                            <CardHeader>
                                <CardTitle className="text-lg">Property Cost Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={results.chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                    >
                                    {results.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl print:shadow-none print:border print:w-1/2">
                            <CardHeader>
                                <CardTitle className="text-lg">Income Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={results.incomeData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                    >
                                    {results.incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultCard 
                            title={<InfoTooltip text="Debt-to-Income Ratio" content="Percentage of your gross monthly income that goes toward paying debts. Lower is better." />}
                            value={<AnimatedCounter value={results.debtRatio} formatter={formatPercentage} />} 
                        />
                        <ResultCard 
                            title={<InfoTooltip text="Monthly Surplus (Buffer)" content="Cash left over after paying all EMIs and Household Expenses." />}
                            value={<AnimatedCounter value={results.disposableIncome - state.householdExpenses} formatter={formatCurrency} />} 
                        />
                    </div>

                    {/* COMPARE DOWN PAYMENT SCENARIOS */}
                    <Card className="mt-8 shadow-lg border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl overflow-hidden print:shadow-none print:border">
                      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2.5 text-gray-900 dark:text-white">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Layers className="w-4 h-4" />
                              </div>
                              Compare Down Payment Scenarios
                            </CardTitle>
                            <CardDescription className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Analyze how higher or lower down payments impact your required loan amount, monthly EMI & total interest
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse min-w-[620px]">
                            <thead>
                              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                <th className="py-3 px-4 md:px-5">Down Payment</th>
                                <th className="py-3 px-4 md:px-5 text-right">Down Payment Amount</th>
                                <th className="py-3 px-4 md:px-5 text-right">Loan Needed</th>
                                <th className="py-3 px-4 md:px-5 text-right">Monthly EMI</th>
                                <th className="py-3 px-4 md:px-5 text-right">Total Interest</th>
                                <th className="py-3 px-4 md:px-5 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs md:text-sm">
                              {results.scenarios.map((scen, idx) => {
                                const isCurrent = scen.downPaymentPct === state.downPaymentPercent;
                                return (
                                  <tr 
                                    key={idx} 
                                    className={`transition-colors ${
                                      isCurrent 
                                        ? 'bg-blue-50/80 dark:bg-blue-950/40 font-medium' 
                                        : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/40'
                                    }`}
                                  >
                                    <td className="py-3.5 px-4 md:px-5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                                          {scen.downPaymentPct}%
                                        </span>
                                        {isCurrent && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                                            Current
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 md:px-5 text-right text-gray-700 dark:text-gray-300 font-medium">
                                      {formatCurrency(scen.downPaymentAmt)}
                                    </td>
                                    <td className="py-3.5 px-4 md:px-5 text-right text-gray-600 dark:text-gray-400">
                                      {formatCurrency(scen.loanAmount)}
                                    </td>
                                    <td className="py-3.5 px-4 md:px-5 text-right font-bold text-gray-900 dark:text-white">
                                      {formatCurrency(scen.emi)}
                                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal block">/ month</span>
                                    </td>
                                    <td className="py-3.5 px-4 md:px-5 text-right text-gray-600 dark:text-gray-400 font-medium">
                                      {formatCurrency(scen.totalInterest)}
                                    </td>
                                    <td className="py-3.5 px-4 md:px-5 text-center">
                                      {isCurrent ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/50 px-2.5 py-1 rounded-lg">
                                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                                        </span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => state.setDownPaymentPercent(scen.downPaymentPct)}
                                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-150 shadow-2xs"
                                        >
                                          Apply
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
