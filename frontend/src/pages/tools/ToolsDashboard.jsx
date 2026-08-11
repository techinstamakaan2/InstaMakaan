import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Home, Banknote, Search, TrendingUp, HelpCircle } from 'lucide-react';

const tools = [
  {
    title: 'Rent vs Buy Calculator',
    description: 'Compare the long-term financial impact of renting versus buying a home.',
    path: '/tools/rent-vs-buy',
    icon: <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    color: 'bg-blue-50 dark:bg-blue-900/20',
    tags: ['Featured', 'Popular']
  },
  {
    title: 'Loan Affordability Calculator',
    description: 'Find out exactly how much home you can afford based on your income and debts.',
    path: '/tools/loan-affordability',
    icon: <Calculator className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
    color: 'bg-emerald-50 dark:bg-emerald-900/20',
    tags: ['Popular']
  },
  {
    title: 'Home Loan Prepayment',
    description: 'See how much interest you can save by prepaying your home loan faster.',
    path: '/tools/home-loan-prepayment',
    icon: <Banknote className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    color: 'bg-purple-50 dark:bg-purple-900/20',
    tags: []
  },
];

const faqs = [
  {
    question: "How accurate are these calculators?",
    answer: "Our calculators use standard financial formulas identical to what major banks use in India. However, actual loan terms may vary based on your credit score and the lender's specific policies."
  },
  {
    question: "What is FOIR in the affordability calculator?",
    answer: "FOIR stands for Fixed Obligation to Income Ratio. It is the maximum percentage of your monthly income that a bank allows to go towards EMI payments (usually around 40-50%)."
  },
  {
    question: "Should I reduce EMI or Tenure when prepaying?",
    answer: "Reducing tenure keeps your EMI the same but finishes the loan much faster, saving the maximum amount of interest. Reducing EMI lowers your monthly burden but saves less interest overall."
  }
];

export default function ToolsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Helmet>
        <title>Real Estate Tools & Financial Calculators | Instamakaan</title>
        <meta name="description" content="Free suite of real estate calculators. Accurately calculate home loan affordability, EMI prepayment savings, and compare renting vs buying." />
        <meta name="keywords" content="real estate calculators, home loan calculator, rent vs buy calculator, EMI prepayment, property affordability" />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
            <TrendingUp className="w-4 h-4" /> Data-Driven Real Estate
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Smart Tools for Smart Buyers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Make confident, data-backed financial decisions with our advanced suite of real estate calculators. We handle the complex math so you can focus on finding your dream home.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search calculators (e.g., 'rent', 'loan', 'emi')..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Calculators</h2>
            <span className="text-sm font-medium text-gray-500">{filteredTools.length} results</span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => (
                <Link key={index} to={tool.path} className="group flex flex-col h-full">
                  <Card className="h-full flex flex-col border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 ${tool.color.split(' ')[0]}`}></div>
                    
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${tool.color}`}>
                          {tool.icon}
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                          {tool.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors mb-3">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-6 mt-auto">
                      <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                        Launch Calculator 
                        <ArrowRight className="w-5 h-5 ml-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No calculators found</h3>
              <p className="text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </div>

        {/* Quick Links & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Got questions about our real estate calculators or financial models? Here's what people usually ask.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

      </div>
    </Layout>
  );
}
