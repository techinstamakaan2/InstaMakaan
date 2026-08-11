import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, BarChart3, TrendingUp, Layers } from 'lucide-react';
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Loan Affordability Calculator
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

                    {/* SENSITIVITY & SCENARIOS */}
                    <Accordion.Root type="single" collapsible className="mt-8 space-y-4 print:hidden">
                        <Accordion.Item value="scenarios" className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                            <Accordion.Header className="flex">
                                <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors [&[data-state=open]>svg]:rotate-180">
                                    Compare Down Payment Scenarios
                                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                                </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content className="overflow-hidden text-gray-700 dark:text-gray-300 text-sm data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                                <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b dark:border-gray-700 text-xs uppercase text-gray-500">
                                                    <th className="pb-3 pr-4 font-semibold">Down Payment</th>
                                                    <th className="pb-3 px-4 font-semibold text-right">Amount</th>
                                                    <th className="pb-3 px-4 font-semibold text-right">Loan Needed</th>
                                                    <th className="pb-3 px-4 font-semibold text-right text-primary">Monthly EMI</th>
                                                    <th className="pb-3 pl-4 font-semibold text-right text-red-500">Total Interest</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.scenarios.map((scen, idx) => (
                                                    <tr key={idx} className={`border-b dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors ${scen.downPaymentPct === state.downPaymentPercent ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                                                        <td className="py-4 pr-4 font-medium">
                                                            {scen.downPaymentPct}% 
                                                            {scen.downPaymentPct === state.downPaymentPercent && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Current</span>}
                                                        </td>
                                                        <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(scen.downPaymentAmt)}</td>
                                                        <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(scen.loanAmount)}</td>
                                                        <td className="py-4 px-4 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(scen.emi)}</td>
                                                        <td className="py-4 pl-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(scen.totalInterest)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>

                    <ExportPanel csvData={generateCSV(csvData)} csvFilename="affordability_analysis.csv" />
                </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
