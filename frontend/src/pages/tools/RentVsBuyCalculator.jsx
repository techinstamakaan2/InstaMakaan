import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, BarChart3, TrendingUp, Home, ArrowRightLeft, Layers, CheckCircle2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useRentVsBuy } from '../../hooks/useRentVsBuy';
import { SliderInput } from '../../components/calculators/SliderInput';
import { ResultCard } from '../../components/calculators/ResultCard';
import { AnimatedCounter } from '../../components/calculators/AnimatedCounter';
import { InfoTooltip } from '../../components/calculators/InfoTooltip';
import { InsightsPanel } from '../../components/calculators/InsightsPanel';
import { ExportPanel } from '../../components/calculators/ExportPanel';
import { Timeline } from '../../components/calculators/Timeline';
import { formatCurrency, formatPercentage } from '../../utils/formatter';
import { generateCSV } from '../../utils/exportUtils';

export default function RentVsBuyCalculator() {
  const { state, results } = useRentVsBuy();

  // Prepare CSV Data
  const csvData = results.chartData.map(d => ({
    Year: d.year,
    "Buying Net Worth": d.Buy,
    "Renting Net Worth": d.Rent,
    "Property Value": d.propertyValue,
    "Loan Balance": d.loanBalance,
    "Monthly Rent": d.rentCost
  }));

  // Prepare Timeline Milestones
  const milestones = [
    {
      title: "Today",
      subtitle: "Year 0",
      description: `You decide between a ${formatCurrency(results.totalUpfrontBuy)} downpayment vs ${formatCurrency(results.totalUpfrontRent)} rent deposit.`,
      highlight: false
    }
  ];

  if (results.breakEvenYear) {
    milestones.push({
      title: "Break-even Reached",
      subtitle: `Year ${results.breakEvenYear}`,
      description: "Buying becomes more profitable than renting from this point forward.",
      highlight: true
    });
  }

  milestones.push({
    title: "Loan Completed",
    subtitle: `Year ${state.loanTenure}`,
    description: `You now own the house outright. Final Net Worth: Buy (${formatCurrency(results.finalBuyNetWorth)}) vs Rent (${formatCurrency(results.finalRentNetWorth)}).`,
    highlight: false
  });


  return (
    <Layout>
      <Helmet>
        <title>Advanced Rent vs Buy Calculator | Instamakaan</title>
        <meta name="description" content="A data-driven financial model to compare the true cost of renting versus buying a home in India." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-10 mt-16 print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-6">
            <ArrowRightLeft className="w-4 h-4" /> Comprehensive Financial Model
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-teal-600 dark:text-teal-400">Rent vs Buy</span>{' '}
            <span className="text-amber-500 dark:text-amber-400">Calculator</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stop guessing. This model factors in property taxes, maintenance, rent inflation, compounding investments, and home equity to give you a definitive mathematical answer.
          </p>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block text-center mb-10 border-b pb-8">
            <h1 className="text-3xl font-bold text-gray-900">Instamakaan Rent vs Buy Report</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - INPUTS */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
                <TabsTrigger value="buy" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Buying</TabsTrigger>
                <TabsTrigger value="rent" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Renting</TabsTrigger>
                <TabsTrigger value="market" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Market</TabsTrigger>
              </TabsList>

              {/* BUYING TAB */}
              <TabsContent value="buy" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2"><Home className="w-5 h-5 text-blue-500" /> Property & Loan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <SliderInput 
                      label="Property Value" 
                      value={state.propertyValue} min={1000000} max={100000000} step={100000} isCurrency
                      onChange={state.setPropertyValue} formatDisplay={formatCurrency} 
                    />
                    <SliderInput 
                      label="Down Payment %" 
                      value={state.downPaymentPercent} min={10} max={100} step={1}
                      onChange={state.setDownPaymentPercent} formatDisplay={formatPercentage} 
                    />
                    <SliderInput 
                      label="Loan Tenure (Years)" 
                      value={state.loanTenure} min={1} max={30} step={1}
                      onChange={state.setLoanTenure} formatDisplay={(v) => `${v} Yrs`} 
                    />
                    <SliderInput 
                      label="Home Loan Interest Rate" 
                      value={state.homeLoanRate} min={5} max={15} step={0.1}
                      onChange={state.setHomeLoanRate} formatDisplay={formatPercentage} 
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-600">Hidden Buying Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <SliderInput 
                      label={<InfoTooltip text="Annual Maintenance" content="Yearly cost to repair and maintain the property as a % of its value." />}
                      value={state.maintenancePercent} min={0} max={5} step={0.1}
                      onChange={state.setMaintenancePercent} formatDisplay={formatPercentage} 
                    />
                    <SliderInput 
                      label={<InfoTooltip text="Property Tax" content="Annual tax paid to the municipality as a % of property value." />}
                      value={state.propertyTaxPercent} min={0} max={5} step={0.1}
                      onChange={state.setPropertyTaxPercent} formatDisplay={formatPercentage} 
                    />
                    <SliderInput 
                      label="Registration & Stamp Duty (%)" 
                      value={state.registrationPercent} min={0} max={15} step={0.5}
                      onChange={state.setRegistrationPercent} formatDisplay={formatPercentage} 
                    />
                    <SliderInput 
                      label="Brokerage (%)" 
                      value={state.brokeragePercent} min={0} max={5} step={0.5}
                      onChange={state.setBrokeragePercent} formatDisplay={formatPercentage} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* RENTING TAB */}
              <TabsContent value="rent" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-emerald-600">Renting Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <SliderInput 
                      label="Monthly Rent" 
                      value={state.monthlyRent} min={5000} max={500000} step={1000} isCurrency
                      onChange={state.setMonthlyRent} formatDisplay={formatCurrency} 
                    />
                    <SliderInput 
                      label="Rent Security Deposit" 
                      value={state.rentSecurityDeposit} min={0} max={2000000} step={10000} isCurrency
                      onChange={state.setRentSecurityDeposit} formatDisplay={formatCurrency} 
                    />
                    <SliderInput 
                      label="Brokerage & Moving Costs" 
                      value={state.rentBrokerage} min={0} max={500000} step={5000} isCurrency
                      onChange={state.setRentBrokerage} formatDisplay={formatCurrency} 
                    />
                    <SliderInput 
                      label={<InfoTooltip text="Annual Rent Inflation" content="The percentage by which your rent increases every year." />}
                      value={state.rentInflation} min={0} max={15} step={0.5}
                      onChange={state.setRentInflation} formatDisplay={formatPercentage} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MARKET TAB */}
              <TabsContent value="market" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Market Assumptions</CardTitle>
                    <CardDescription>How will your investments and property grow?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <SliderInput 
                      label={<InfoTooltip text="Property Appreciation Rate" content="The estimated yearly percentage increase in the home's market value." />}
                      value={state.appreciationRate} min={0} max={20} step={0.5}
                      onChange={state.setAppreciationRate} formatDisplay={formatPercentage} 
                    />
                    <SliderInput 
                      label={<InfoTooltip text="Investment Return Rate" content="Expected annual returns if you invested your down payment and monthly savings in the market (e.g., Mutual Funds)." />}
                      value={state.investmentReturn} min={5} max={25} step={0.5}
                      onChange={state.setInvestmentReturn} formatDisplay={formatPercentage} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* TIMELINE */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl print:shadow-none print:border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-blue-500" /> Financial Timeline
                </CardTitle>
                <CardDescription className="text-sm">Key financial milestones across your loan tenure</CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline milestones={milestones} />
              </CardContent>
            </Card>

            {/* EXPORT PANEL */}
            <ExportPanel csvData={generateCSV(csvData)} csvFilename="rent_vs_buy_projection.csv" />

          </div>

          {/* RIGHT COLUMN - RESULTS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Winner Card */}
            <div className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-500 shadow-xl overflow-hidden relative ${
              results.winner === 'Buy' 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/40 dark:to-indigo-900/40 dark:border-blue-800' 
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/40 dark:border-emerald-800'
            }`}>
                <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Financial Recommendation
                    </h3>
                    <div className={`text-4xl md:text-6xl font-extrabold mb-4 ${
                        results.winner === 'Buy' ? 'text-blue-700 dark:text-blue-400' : 'text-emerald-700 dark:text-emerald-400'
                    }`}>
                        {results.winner === 'Buy' ? 'Buy Property' : 'Rent & Invest'}
                    </div>
                    
                    <ul className="space-y-3 mt-6">
                        {results.recommendationMessage.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-60" />
                            <span dangerouslySetInnerHTML={{ __html: reason }} />
                            </li>
                        ))}
                    </ul>

                    {results.breakEvenYear && results.winner === 'Buy' && (
                         <div className="mt-6 inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-bold shadow-sm">
                            Breakeven in Year {results.breakEvenYear}
                        </div>
                    )}
                </div>
            </div>

            <InsightsPanel insights={results.insights} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard 
                title={<InfoTooltip text="Buying Net Worth" content="Value of your property MINUS your remaining loan balance." />}
                value={<AnimatedCounter value={results.finalBuyNetWorth} formatter={formatCurrency} />} 
                subtitle={`After ${state.loanTenure} Years`}
              />
              <ResultCard 
                title={<InfoTooltip text="Renting Net Worth" content="Value of your investment portfolio built from your down payment and monthly EMI savings." />}
                value={<AnimatedCounter value={results.finalRentNetWorth} formatter={formatCurrency} />} 
                subtitle={`After ${state.loanTenure} Years`}
              />
              <ResultCard 
                title="Total Upfront Buy Cost" 
                value={<AnimatedCounter value={results.totalUpfrontBuy} formatter={formatCurrency} />} 
                subtitle="Downpayment, Reg, Brokerage"
              />
              <ResultCard 
                title="Total Upfront Rent Cost" 
                value={<AnimatedCounter value={results.totalUpfrontRent} formatter={formatCurrency} />} 
                subtitle="Deposit, Brokerage"
              />
            </div>

            {/* CHARTS */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl">Net Worth Projection</CardTitle>
                <CardDescription>Compare your total wealth over the loan tenure</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <YAxis 
                      tickFormatter={(value) => `₹${(value/10000000).toFixed(1)}Cr`} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 12}}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    
                    {results.breakEvenYear && (
                       <ReferenceLine x={`Year ${results.breakEvenYear}`} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Break-even', fill: '#f59e0b', fontSize: 12 }} />
                    )}

                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '8px' }}
                      cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Area type="monotone" dataKey="Buy" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBuy)" animationDuration={2000} />
                    <Area type="monotone" dataKey="Rent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRent)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* COMPARE DOWN PAYMENT SCENARIOS */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl overflow-hidden print:shadow-none print:border">
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
                      Analyze how higher or lower down payments impact your required loan amount & monthly EMI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <th className="py-3 px-4 md:px-5">Down Payment</th>
                        <th className="py-3 px-4 md:px-5 text-right">Down Payment Amount</th>
                        <th className="py-3 px-4 md:px-5 text-right">Loan Needed</th>
                        <th className="py-3 px-4 md:px-5 text-right">Monthly EMI</th>
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

          </div>

        </div>
      </div>
    </Layout>
  );
}
