import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FastForward, Calculator, CalendarClock } from 'lucide-react';
import { usePrepayment } from '../../hooks/usePrepayment';
import { SliderInput } from '../../components/calculators/SliderInput';
import { ResultCard } from '../../components/calculators/ResultCard';
import { AnimatedCounter } from '../../components/calculators/AnimatedCounter';
import { InfoTooltip } from '../../components/calculators/InfoTooltip';
import { InsightsPanel } from '../../components/calculators/InsightsPanel';
import { ExportPanel } from '../../components/calculators/ExportPanel';
import { Timeline } from '../../components/calculators/Timeline';
import { formatCurrency, formatPercentage } from '../../utils/formatter';
import { generateCSV } from '../../utils/exportUtils';
import { AmortizationTable } from '../../components/calculators/AmortizationTable';

export default function HomeLoanPrepaymentCalculator() {
  const { state, results } = usePrepayment();
  const [activeTab, setActiveTab] = useState('analysis');

  // Prepare CSV Data
  const csvData = results.amortization.map(d => ({
    Month: d.month,
    "Principal Paid": d.principalPaid,
    "Interest Paid": d.interestPaid,
    "Extra Prepayment": d.prepaymentAmount,
    "Remaining Balance": d.remainingBalance
  }));

  // Timeline Milestones
  const milestones = [
    {
      title: "Today",
      subtitle: `Month ${state.monthsAlreadyPaid}`,
      description: `You have an outstanding balance of ${formatCurrency(results.amortization.length > 0 ? results.amortization[0].remainingBalance + results.amortization[0].principalPaid : 0)}.`,
      highlight: false
    }
  ];

  if (results.yearsSaved > 0 || results.extraMonthsSaved > 0) {
      milestones.push({
        title: "Loan Completed (With Prepayment)",
        subtitle: `Month ${results.newTenureMonths + state.monthsAlreadyPaid}`,
        description: `By paying ${formatCurrency(state.prepaymentAmount)} extra, you saved ${formatCurrency(results.interestSaved)} and finished ${results.yearsSaved} Years earlier.`,
        highlight: true
      });
  }

  milestones.push({
    title: "Original Loan End Date",
    subtitle: `Month ${(state.loanTenure * 12)}`,
    description: "The date your loan would have finished if you made no extra payments.",
    highlight: false
  });

  return (
    <Layout>
      <Helmet>
        <title>Home Loan Prepayment Calculator | Instamakaan</title>
        <meta name="description" content="Calculate how much interest you can save by prepaying your home loan." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-10 mt-16 print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-medium mb-6">
            <FastForward className="w-4 h-4" /> Debt Freedom Planner
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Home Loan Prepayment Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find out exactly how many years you can shave off your mortgage and how much interest you can save by making extra payments.
          </p>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block text-center mb-10 border-b pb-8">
            <h1 className="text-3xl font-bold text-gray-900">Instamakaan Prepayment Report</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - INPUTS */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2"><Calculator className="w-5 h-5 text-emerald-500" /> Current Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SliderInput 
                  label="Original Loan Amount" 
                  value={state.principal} min={100000} max={100000000} step={100000} isCurrency
                  onChange={state.setPrincipal} formatDisplay={formatCurrency} 
                />
                <SliderInput 
                  label="Interest Rate" 
                  value={state.annualRate} min={5} max={15} step={0.1}
                  onChange={state.setAnnualRate} formatDisplay={formatPercentage} 
                />
                <SliderInput 
                  label="Original Tenure (Years)" 
                  value={state.loanTenure} min={1} max={30} step={1}
                  onChange={state.setLoanTenure} formatDisplay={(v) => `${v} Yrs`} 
                />
                <SliderInput 
                  label={<InfoTooltip text="Months Already Paid" content="How many EMIs you have already paid since taking the loan." />}
                  value={state.monthsAlreadyPaid} min={0} max={state.loanTenure * 12} step={1}
                  onChange={state.setMonthsAlreadyPaid} formatDisplay={(v) => `${v} Months`} 
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2"><FastForward className="w-5 h-5 text-primary" /> Prepayment Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">How often will you prepay?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Monthly', 'Yearly', 'One-time'].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => state.setPrepaymentFrequency(freq)}
                        className={`py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                          state.prepaymentFrequency === freq
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <SliderInput 
                  label={`Extra ${state.prepaymentFrequency} Amount`}
                  value={state.prepaymentAmount} min={0} max={1000000} step={5000} isCurrency
                  onChange={state.setPrepaymentAmount} formatDisplay={formatCurrency} 
                />

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <InfoTooltip text="Prepayment Goal" content="When you prepay, banks give you a choice: keep your EMI the same and finish the loan faster, or reduce your EMI and keep the same timeline." />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Reduce Tenure', 'Reduce EMI'].map((type) => (
                      <button
                        key={type}
                        onClick={() => state.setPrepaymentType(type)}
                        className={`py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                          state.prepaymentType === type
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - RESULTS */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard 
                title="Interest Saved" 
                value={<AnimatedCounter value={results.interestSaved} formatter={formatCurrency} />} 
                highlight={results.interestSaved > 0}
                subtitle="Total money saved from bank"
              />
              <ResultCard 
                title="Time Saved" 
                value={`${results.yearsSaved} Yr ${results.extraMonthsSaved} Mo`} 
                highlight={results.monthsSaved > 0}
                subtitle="Faster loan completion"
              />
              <ResultCard 
                title={<InfoTooltip text="Current Base EMI" content="Your regular monthly payment without any extra prepayments." />}
                value={<AnimatedCounter value={results.baseEmi} formatter={formatCurrency} />} 
              />
              <ResultCard 
                title={<InfoTooltip text="Revised New EMI" content="If you chose to Reduce EMI, this will be your new monthly bill. Otherwise it stays the same." />}
                value={<AnimatedCounter value={state.prepaymentType === 'Reduce EMI' ? (results.baseEmi * 0.9) : results.baseEmi} formatter={formatCurrency} />} 
                subtitle="After prepayment"
              />
            </div>

            <InsightsPanel insights={results.insights} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl print:hidden">
                <TabsTrigger value="analysis" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Visual Analysis</TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Amortization Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6 animate-in fade-in duration-300 print:block">
                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><CalendarClock className="w-5 h-5" /> Outstanding Loan Balance</CardTitle>
                    <CardDescription>See how quickly your debt drops to zero.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPrepay" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tickFormatter={(v) => `Mo ${v}`} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                        <YAxis 
                          tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#6b7280', fontSize: 12}}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)}
                          labelFormatter={(label) => `Month ${label}`}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                        <Area type="monotone" name="Without Prepayment" dataKey="balanceWithoutPrepay" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorBase)" />
                        <Area type="monotone" name="With Prepayment" dataKey="balanceWithPrepay" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrepay)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:flex print:flex-row print:w-full">
                    <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl h-full print:shadow-none print:border print:w-1/2">
                        <CardHeader>
                            <CardTitle className="text-xl">Loan Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Timeline milestones={milestones} />
                        </CardContent>
                    </Card>

                    <div className="space-y-4 print:w-1/2">
                       {/* Additional insights can go here if needed in print mode */}
                    </div>
                </div>

                <ExportPanel csvData={generateCSV(csvData)} csvFilename="prepayment_schedule.csv" />
              </TabsContent>

              <TabsContent value="schedule" className="animate-in fade-in duration-300 print:hidden">
                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl">Monthly Amortization Schedule</CardTitle>
                    <CardDescription>A detailed breakdown of every payment.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="hidden md:block">
                        <AmortizationTable data={results.amortization} />
                    </div>
                    {/* Mobile Card View for Tables to prevent horizontal scroll */}
                    <div className="md:hidden space-y-4 p-4 max-h-[600px] overflow-y-auto">
                        {results.amortization.slice(0, 50).map((row) => (
                            <div key={row.month} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-gray-900 dark:text-white">Month {row.month}</span>
                                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full font-medium">Balance: {formatCurrency(row.remainingBalance)}</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Principal</span>
                                        <span>{formatCurrency(row.principalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500/80">
                                        <span>Interest</span>
                                        <span>{formatCurrency(row.interestPaid)}</span>
                                    </div>
                                    {row.prepaymentAmount > 0 && (
                                        <div className="flex justify-between text-primary font-medium pt-1 border-t dark:border-gray-700 mt-1">
                                            <span>Prepayment</span>
                                            <span>{formatCurrency(row.prepaymentAmount)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {results.amortization.length > 50 && (
                            <div className="text-center text-gray-500 py-4 text-sm font-medium">
                                Showing first 50 months. Export to CSV for full schedule.
                            </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </div>
    </Layout>
  );
}
