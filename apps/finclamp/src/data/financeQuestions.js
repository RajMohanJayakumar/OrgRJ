// Finance Quest Question Bank - Comprehensive Financial Knowledge Questions
// Organized by difficulty levels for progressive learning

export const financeQuestions = {
  level1: [
    // Basic EMI and Loan Calculations
    {
      id: "emi_001",
      question: "If you take a ₹10,00,000 home loan at 8% interest for 20 years, what will be your approximate monthly EMI?",
      options: ["₹8,364", "₹9,500", "₹7,200", "₹10,000"],
      correct: 0,
      explanation: "EMI = P×r×(1+r)^n/((1+r)^n-1). For ₹10L at 8% for 20 years = ₹8,364",
      category: "loans"
    },
    {
      id: "emi_002", 
      question: "What happens to your EMI if you increase the loan tenure from 15 to 20 years?",
      options: ["EMI decreases", "EMI increases", "EMI stays same", "EMI doubles"],
      correct: 0,
      explanation: "Longer tenure spreads payments over more months, reducing monthly EMI but increasing total interest",
      category: "loans"
    },
    {
      id: "interest_001",
      question: "₹50,000 invested at 6% simple interest for 2 years will grow to?",
      options: ["₹56,000", "₹53,000", "₹58,000", "₹55,000"],
      correct: 0,
      explanation: "Simple Interest = P + (P×R×T/100) = 50,000 + (50,000×6×2/100) = ₹56,000",
      category: "investments"
    },
    {
      id: "inflation_001",
      question: "If inflation is 5% and you have ₹1,00,000, what's its purchasing power after 1 year?",
      options: ["₹95,238", "₹95,000", "₹90,000", "₹94,000"],
      correct: 0,
      explanation: "Real value = ₹1,00,000 ÷ 1.05 = ₹95,238. Inflation reduces purchasing power",
      category: "planning"
    },
    {
      id: "fd_001",
      question: "₹2,00,000 FD at 7% for 3 years will mature to approximately?",
      options: ["₹2,45,000", "₹2,42,000", "₹2,50,000", "₹2,40,000"],
      correct: 0,
      explanation: "Compound Interest: A = P(1+r)^t = 2,00,000(1.07)^3 = ₹2,45,010",
      category: "savings"
    },

    // Basic Tax Knowledge
    {
      id: "tax_001",
      question: "Under new tax regime, what's the tax on ₹8,00,000 annual income?",
      options: ["₹62,500", "₹70,000", "₹50,000", "₹80,000"],
      correct: 0,
      explanation: "New regime: 0% up to 3L, 5% on 3-6L, 10% on 6-9L. Tax = 15,000 + 20,000 + 20,000 = ₹62,500",
      category: "tax"
    },
    {
      id: "tax_002",
      question: "What is the maximum deduction under Section 80C?",
      options: ["₹1,50,000", "₹1,00,000", "₹2,00,000", "₹50,000"],
      correct: 0,
      explanation: "Section 80C allows maximum deduction of ₹1,50,000 for investments like PPF, ELSS, etc.",
      category: "tax"
    },

    // Basic Investment Concepts
    {
      id: "sip_001",
      question: "SIP of ₹5,000 monthly for 1 year at 12% returns will be approximately?",
      options: ["₹63,412", "₹60,000", "₹65,000", "₹70,000"],
      correct: 0,
      explanation: "SIP future value formula with monthly compounding for 12 months",
      category: "investments"
    },
    {
      id: "emergency_001",
      question: "How many months of expenses should you keep as emergency fund?",
      options: ["6-12 months", "2-3 months", "1 month", "24 months"],
      correct: 0,
      explanation: "Financial experts recommend 6-12 months of living expenses as emergency fund",
      category: "planning"
    },
    {
      id: "insurance_001",
      question: "What should be the ideal life insurance cover amount?",
      options: ["10-15x annual income", "5x annual income", "2x annual income", "Equal to annual income"],
      correct: 0,
      explanation: "Life insurance should be 10-15 times your annual income to provide adequate protection",
      category: "insurance"
    },

    // Basic Financial Planning
    {
      id: "budget_001",
      question: "What is the 50-30-20 budgeting rule?",
      options: ["50% needs, 30% wants, 20% savings", "50% savings, 30% needs, 20% wants", "50% wants, 30% needs, 20% savings", "Equal distribution"],
      correct: 0,
      explanation: "50% for needs (rent, food), 30% for wants (entertainment), 20% for savings and debt repayment",
      category: "planning"
    },
    {
      id: "credit_001",
      question: "What is considered a good credit score in India?",
      options: ["750 and above", "600 and above", "500 and above", "850 and above"],
      correct: 0,
      explanation: "Credit scores of 750 and above are considered excellent and get best loan rates",
      category: "credit"
    },
    {
      id: "retirement_001",
      question: "At what age can you withdraw from EPF without penalty?",
      options: ["58 years", "60 years", "55 years", "65 years"],
      correct: 0,
      explanation: "EPF can be withdrawn without penalty after 58 years of age or retirement",
      category: "retirement"
    },

    // Basic Investment Vehicles
    {
      id: "ppf_001",
      question: "What is the lock-in period for PPF (Public Provident Fund)?",
      options: ["15 years", "10 years", "5 years", "20 years"],
      correct: 0,
      explanation: "PPF has a mandatory lock-in period of 15 years with option to extend",
      category: "savings"
    },
    {
      id: "nps_001",
      question: "What percentage of NPS corpus is tax-free at maturity?",
      options: ["60%", "40%", "80%", "100%"],
      correct: 0,
      explanation: "60% of NPS corpus is tax-free at maturity, 40% must be used to buy annuity",
      category: "retirement"
    },
    {
      id: "mutual_fund_001",
      question: "What is the expense ratio in mutual funds?",
      options: ["Annual fee charged by fund", "Entry load fee", "Exit load fee", "Dividend amount"],
      correct: 0,
      explanation: "Expense ratio is the annual fee charged by mutual fund for managing your money",
      category: "investments"
    },

    // Additional Level 1 Questions
    {
      id: "savings_001",
      question: "Which savings account offers the highest interest rate typically?",
      options: ["Salary account", "Zero balance account", "High-value savings account", "Basic savings account"],
      correct: 2,
      explanation: "High-value savings accounts typically offer better interest rates for higher balances",
      category: "savings"
    },
    {
      id: "credit_card_001",
      question: "What is the typical credit card interest rate per month in India?",
      options: ["3-4%", "1-2%", "5-6%", "0.5-1%"],
      correct: 0,
      explanation: "Credit cards typically charge 3-4% per month (36-48% annually) on outstanding balances",
      category: "credit"
    },
    {
      id: "gold_001",
      question: "What percentage of portfolio should be allocated to gold?",
      options: ["5-10%", "20-25%", "30-40%", "50%"],
      correct: 0,
      explanation: "Financial advisors recommend 5-10% allocation to gold as a hedge against inflation",
      category: "investments"
    },
    {
      id: "term_insurance_001",
      question: "At what age should you buy term insurance?",
      options: ["As early as possible", "After 30", "After marriage", "After 40"],
      correct: 0,
      explanation: "Term insurance premiums are lowest when young and healthy, so buy as early as possible",
      category: "insurance"
    },
    {
      id: "rd_001",
      question: "What is the minimum tenure for Recurring Deposit (RD)?",
      options: ["6 months", "1 year", "2 years", "3 months"],
      correct: 0,
      explanation: "Most banks offer RD with minimum tenure of 6 months",
      category: "savings"
    },
    {
      id: "loan_emi_001",
      question: "Which loan typically has the lowest interest rate?",
      options: ["Home loan", "Personal loan", "Credit card", "Car loan"],
      correct: 0,
      explanation: "Home loans have lowest rates (7-9%) as they're secured by property",
      category: "loans"
    },
    {
      id: "financial_goal_001",
      question: "What should be your first financial goal?",
      options: ["Emergency fund", "Buying a house", "Retirement planning", "Vacation fund"],
      correct: 0,
      explanation: "Emergency fund should be the first priority before any other financial goals",
      category: "planning"
    },
    {
      id: "bank_fd_001",
      question: "What is the typical FD interest rate for senior citizens?",
      options: ["0.5% extra", "1% extra", "Same as regular", "2% extra"],
      correct: 0,
      explanation: "Senior citizens typically get 0.5% additional interest on FDs",
      category: "savings"
    },
    {
      id: "ulip_001",
      question: "What is the lock-in period for ULIP?",
      options: ["5 years", "3 years", "10 years", "15 years"],
      correct: 0,
      explanation: "ULIPs have a mandatory lock-in period of 5 years",
      category: "insurance"
    },
    {
      id: "systematic_001",
      question: "What does SWP stand for in mutual funds?",
      options: ["Systematic Withdrawal Plan", "Systematic Weekly Plan", "Special Withdrawal Plan", "Systematic Wealth Plan"],
      correct: 0,
      explanation: "SWP allows you to withdraw fixed amounts regularly from mutual fund investments",
      category: "investments"
    }
  ],

  level2: [
    // Intermediate Calculations
    {
      id: "sip_advanced_001",
      question: "SIP of ₹10,000 monthly for 15 years at 12% CAGR will grow to approximately?",
      options: ["₹50 lakhs", "₹40 lakhs", "₹60 lakhs", "₹35 lakhs"],
      correct: 0,
      explanation: "Long-term SIP with compound growth: ₹10,000 × 12 months × 15 years with 12% returns",
      category: "investments"
    },
    {
      id: "tax_planning_001",
      question: "Which investment gives triple tax benefit (EEE)?",
      options: ["PPF", "ELSS", "FD", "NSC"],
      correct: 0,
      explanation: "PPF offers Exempt-Exempt-Exempt: investment deduction, growth tax-free, withdrawal tax-free",
      category: "tax"
    },
    {
      id: "home_loan_001",
      question: "Maximum home loan interest deduction under Section 24(b)?",
      options: ["₹2,00,000", "₹1,50,000", "₹3,00,000", "No limit"],
      correct: 0,
      explanation: "Section 24(b) allows maximum ₹2,00,000 deduction for home loan interest",
      category: "tax"
    },
    {
      id: "capital_gains_001",
      question: "Long-term capital gains tax on equity mutual funds above ₹1 lakh?",
      options: ["10%", "15%", "20%", "30%"],
      correct: 0,
      explanation: "LTCG on equity funds is 10% on gains above ₹1 lakh per year (without indexation)",
      category: "tax"
    },
    {
      id: "asset_allocation_001",
      question: "What should be equity allocation for a 30-year-old investor?",
      options: ["70-80%", "50-60%", "30-40%", "90-100%"],
      correct: 0,
      explanation: "Rule of thumb: 100 minus age = equity allocation. For 30-year-old: 70% equity",
      category: "investments"
    },
    {
      id: "insurance_planning_001",
      question: "What percentage of income should go towards insurance premiums?",
      options: ["10-15%", "5-8%", "20-25%", "2-3%"],
      correct: 0,
      explanation: "Insurance premiums should not exceed 10-15% of annual income for optimal planning",
      category: "insurance"
    },
    {
      id: "debt_management_001",
      question: "What is debt-to-income ratio that banks prefer for loan approval?",
      options: ["Below 40%", "Below 60%", "Below 80%", "Below 20%"],
      correct: 0,
      explanation: "Banks prefer debt-to-income ratio below 40% for loan approvals",
      category: "loans"
    },
    {
      id: "retirement_planning_001",
      question: "How much corpus needed to generate ₹50,000 monthly at 6% withdrawal rate?",
      options: ["₹1 crore", "₹75 lakhs", "₹1.25 crore", "₹50 lakhs"],
      correct: 0,
      explanation: "Monthly income = Corpus × Annual rate / 12. ₹50,000 = Corpus × 6% / 12",
      category: "retirement"
    },
    {
      id: "goal_planning_001",
      question: "To accumulate ₹25 lakhs in 10 years at 10% return, monthly SIP needed?",
      options: ["₹12,915", "₹15,000", "₹10,000", "₹20,000"],
      correct: 0,
      explanation: "Using SIP formula for future value calculation with 10% annual return",
      category: "planning"
    },
    {
      id: "real_estate_001",
      question: "What is the holding period for long-term capital gains on property?",
      options: ["2 years", "1 year", "3 years", "5 years"],
      correct: 0,
      explanation: "Property held for more than 2 years qualifies for long-term capital gains",
      category: "investments"
    },

    // Additional Level 2 Questions
    {
      id: "elss_001",
      question: "What is the lock-in period for ELSS mutual funds?",
      options: ["3 years", "5 years", "1 year", "No lock-in"],
      correct: 0,
      explanation: "ELSS (Equity Linked Savings Scheme) has the shortest lock-in of 3 years among 80C investments",
      category: "tax"
    },
    {
      id: "nsc_001",
      question: "What is the maturity period for National Savings Certificate (NSC)?",
      options: ["5 years", "10 years", "15 years", "3 years"],
      correct: 0,
      explanation: "NSC has a fixed maturity period of 5 years with compound interest",
      category: "savings"
    },
    {
      id: "health_insurance_001",
      question: "What is the waiting period for pre-existing diseases in health insurance?",
      options: ["2-4 years", "1 year", "6 months", "No waiting period"],
      correct: 0,
      explanation: "Most health insurance policies have 2-4 years waiting period for pre-existing conditions",
      category: "insurance"
    },
    {
      id: "mutual_fund_sip_001",
      question: "What is step-up SIP?",
      options: ["Increasing SIP amount annually", "Daily SIP", "Lump sum investment", "Decreasing SIP"],
      correct: 0,
      explanation: "Step-up SIP allows you to increase your SIP amount by a fixed percentage annually",
      category: "investments"
    },
    {
      id: "loan_prepayment_001",
      question: "When is the best time to prepay a home loan?",
      options: ["Early years", "Middle years", "Last years", "Never prepay"],
      correct: 0,
      explanation: "Prepaying in early years saves maximum interest as most EMI goes toward interest initially",
      category: "loans"
    },
    {
      id: "dividend_001",
      question: "How are dividends from Indian companies taxed?",
      options: ["As per income tax slab", "10% flat", "15% flat", "Tax-free"],
      correct: 0,
      explanation: "Dividends are added to income and taxed as per your income tax slab rates",
      category: "tax"
    },
    {
      id: "index_fund_001",
      question: "What is the typical expense ratio of index funds?",
      options: ["0.1-0.5%", "1-2%", "2-3%", "0.05%"],
      correct: 0,
      explanation: "Index funds have low expense ratios typically between 0.1-0.5% due to passive management",
      category: "investments"
    },
    {
      id: "car_loan_001",
      question: "What is the typical down payment required for car loans?",
      options: ["10-20%", "30-40%", "50%", "No down payment"],
      correct: 0,
      explanation: "Car loans typically require 10-20% down payment, with banks financing 80-90%",
      category: "loans"
    },
    {
      id: "sukanya_001",
      question: "What is the maximum annual investment in Sukanya Samriddhi Yojana?",
      options: ["₹1,50,000", "₹1,00,000", "₹2,00,000", "₹50,000"],
      correct: 0,
      explanation: "SSY allows maximum annual investment of ₹1,50,000 for girl child education",
      category: "savings"
    },
    {
      id: "credit_score_001",
      question: "How often should you check your credit score?",
      options: ["Once every 3-6 months", "Daily", "Once a year", "Never"],
      correct: 0,
      explanation: "Check credit score every 3-6 months to monitor and maintain good credit health",
      category: "credit"
    }
  ],

  level3: [
    // Advanced Financial Concepts
    {
      id: "cagr_001",
      question: "Investment growing from ₹1 lakh to ₹4 lakhs in 8 years has CAGR of?",
      options: ["18.92%", "20%", "15%", "25%"],
      correct: 0,
      explanation: "CAGR = (Final/Initial)^(1/years) - 1 = (4/1)^(1/8) - 1 = 18.92%",
      category: "investments"
    },
    {
      id: "portfolio_001",
      question: "What is the Sharpe ratio used for?",
      options: ["Risk-adjusted returns", "Absolute returns", "Tax efficiency", "Liquidity measure"],
      correct: 0,
      explanation: "Sharpe ratio measures risk-adjusted returns: (Return - Risk-free rate) / Standard deviation",
      category: "investments"
    },
    {
      id: "derivatives_001",
      question: "What is the maximum loss in buying a call option?",
      options: ["Premium paid", "Unlimited", "Strike price", "Zero"],
      correct: 0,
      explanation: "Maximum loss when buying call option is limited to the premium paid",
      category: "investments"
    },
    {
      id: "bond_001",
      question: "When interest rates rise, bond prices generally?",
      options: ["Fall", "Rise", "Stay same", "Become volatile"],
      correct: 0,
      explanation: "Bond prices and interest rates have inverse relationship - when rates rise, prices fall",
      category: "investments"
    },
    {
      id: "valuation_001",
      question: "P/E ratio of 25 means you're paying ₹25 for every ₹1 of?",
      options: ["Annual earnings", "Book value", "Sales", "Dividend"],
      correct: 0,
      explanation: "P/E ratio = Price per share / Earnings per share. Shows price paid per rupee of earnings",
      category: "investments"
    },
    {
      id: "tax_advanced_001",
      question: "What is the surcharge rate for income above ₹5 crores?",
      options: ["37%", "25%", "15%", "10%"],
      correct: 0,
      explanation: "Surcharge of 37% applies on income above ₹5 crores in the highest tax bracket",
      category: "tax"
    },
    {
      id: "international_001",
      question: "What is the annual limit for Liberalized Remittance Scheme (LRS)?",
      options: ["$250,000", "$200,000", "$100,000", "$500,000"],
      correct: 0,
      explanation: "RBI allows $250,000 per financial year under LRS for individuals",
      category: "investments"
    },
    {
      id: "estate_planning_001",
      question: "What is the maximum exemption for gifts from relatives?",
      options: ["No limit", "₹50,000", "₹2,00,000", "₹1,00,000"],
      correct: 0,
      explanation: "Gifts from specified relatives (parents, spouse, siblings) have no tax implications",
      category: "tax"
    },
    {
      id: "business_001",
      question: "What is the presumptive taxation rate for professionals under Section 44ADA?",
      options: ["50%", "8%", "6%", "44%"],
      correct: 0,
      explanation: "Professionals can opt for presumptive taxation at 50% of gross receipts under 44ADA",
      category: "tax"
    },
    {
      id: "advanced_planning_001",
      question: "What is the ideal withdrawal rate for retirement corpus (4% rule)?",
      options: ["4%", "6%", "8%", "10%"],
      correct: 0,
      explanation: "4% rule suggests withdrawing 4% annually from retirement corpus for sustainable income",
      category: "retirement"
    },

    // Additional Level 3 Questions
    {
      id: "options_001",
      question: "What is the maximum profit potential when selling a call option?",
      options: ["Premium received", "Unlimited", "Strike price", "Zero"],
      correct: 0,
      explanation: "When selling (writing) a call option, maximum profit is limited to premium received",
      category: "investments"
    },
    {
      id: "beta_001",
      question: "A stock with beta of 1.5 means it is?",
      options: ["50% more volatile than market", "50% less volatile", "Same as market", "150% of market price"],
      correct: 0,
      explanation: "Beta of 1.5 means stock moves 50% more than market - if market moves 10%, stock moves 15%",
      category: "investments"
    },
    {
      id: "arbitrage_001",
      question: "What is arbitrage in finance?",
      options: ["Risk-free profit from price differences", "High-risk investment", "Long-term investment", "Tax-saving investment"],
      correct: 0,
      explanation: "Arbitrage involves buying and selling same asset in different markets to profit from price differences",
      category: "investments"
    },
    {
      id: "hedge_001",
      question: "What is the primary purpose of hedging?",
      options: ["Risk reduction", "Profit maximization", "Tax saving", "Liquidity improvement"],
      correct: 0,
      explanation: "Hedging is primarily used to reduce or eliminate financial risk, not to maximize profits",
      category: "investments"
    },
    {
      id: "reit_001",
      question: "What is the minimum investment in REITs in India?",
      options: ["₹10,000-15,000", "₹1,00,000", "₹50,000", "₹5,000"],
      correct: 0,
      explanation: "REITs in India typically have minimum investment of ₹10,000-15,000 per unit",
      category: "investments"
    },
    {
      id: "forex_001",
      question: "What affects currency exchange rates the most?",
      options: ["Interest rate differentials", "Stock market performance", "Gold prices", "Real estate prices"],
      correct: 0,
      explanation: "Interest rate differentials between countries are primary drivers of currency exchange rates",
      category: "investments"
    },
    {
      id: "commodity_001",
      question: "Which commodity is considered the best inflation hedge?",
      options: ["Gold", "Silver", "Oil", "Agricultural products"],
      correct: 0,
      explanation: "Gold is traditionally considered the best hedge against inflation and currency devaluation",
      category: "investments"
    },
    {
      id: "startup_001",
      question: "What is the tax rate on ESOP (Employee Stock Options)?",
      options: ["As per income slab", "10% flat", "20% flat", "Tax-free"],
      correct: 0,
      explanation: "ESOP gains are taxed as perquisites at the time of exercise as per income tax slab",
      category: "tax"
    },
    {
      id: "angel_tax_001",
      question: "What is angel tax in India?",
      options: ["Tax on startup funding above fair value", "Tax on angel investors", "Tax on startup profits", "Tax on employee stock options"],
      correct: 0,
      explanation: "Angel tax is levied on startups when funding received exceeds fair market value",
      category: "tax"
    },
    {
      id: "offshore_001",
      question: "What is the tax implication of offshore mutual funds?",
      options: ["Taxed as debt funds", "Taxed as equity funds", "Tax-free", "Flat 30% tax"],
      correct: 0,
      explanation: "Offshore/international mutual funds are taxed as debt funds regardless of underlying assets",
      category: "tax"
    },
    {
      id: "alternative_001",
      question: "What is AIF (Alternative Investment Fund)?",
      options: ["Privately pooled investment fund", "Government bond fund", "Bank deposit scheme", "Insurance product"],
      correct: 0,
      explanation: "AIF is a privately pooled investment vehicle for sophisticated investors with high minimum investment",
      category: "investments"
    },
    {
      id: "liquidity_001",
      question: "What is the liquidity ratio banks must maintain?",
      options: ["LCR of 100%", "50%", "25%", "No requirement"],
      correct: 0,
      explanation: "Banks must maintain Liquidity Coverage Ratio (LCR) of at least 100% as per Basel III norms",
      category: "business"
    },
    {
      id: "merger_001",
      question: "In a stock merger, what happens to your shares?",
      options: ["Converted as per swap ratio", "Sold at market price", "Become worthless", "Doubled"],
      correct: 0,
      explanation: "In mergers, your shares are converted to acquiring company shares as per predetermined swap ratio",
      category: "investments"
    },
    {
      id: "buyback_001",
      question: "How is buyback of shares taxed for shareholders?",
      options: ["As capital gains", "As dividend", "Tax-free", "As business income"],
      correct: 0,
      explanation: "Share buyback is treated as capital gains transaction for tax purposes",
      category: "tax"
    },
    {
      id: "inflation_bond_001",
      question: "What are inflation-indexed bonds?",
      options: ["Bonds with returns linked to inflation", "High-yield bonds", "Government bonds", "Corporate bonds"],
      correct: 0,
      explanation: "Inflation-indexed bonds provide returns that adjust with inflation to maintain real purchasing power",
      category: "investments"
    }
  ]
}

// Question categories for filtering and organization
export const questionCategories = {
  loans: "Loans & EMI",
  investments: "Investments & Markets", 
  savings: "Savings & Deposits",
  tax: "Tax Planning",
  insurance: "Insurance",
  retirement: "Retirement Planning",
  planning: "Financial Planning",
  credit: "Credit & Loans",
  business: "Business Finance"
}

// Utility function to get questions by level
export const getQuestionsByLevel = (level) => {
  return financeQuestions[`level${level}`] || []
}

// Utility function to get random questions without repetition
export const getRandomQuestions = (level, count = 10, excludeIds = []) => {
  const levelQuestions = getQuestionsByLevel(level)
  const availableQuestions = levelQuestions.filter(q => !excludeIds.includes(q.id))
  
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...availableQuestions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Get total question count
export const getTotalQuestions = () => {
  return Object.values(financeQuestions).reduce((total, level) => total + level.length, 0)
}

// Get questions by category
export const getQuestionsByCategory = (category, level = null) => {
  if (level) {
    return getQuestionsByLevel(level).filter(q => q.category === category)
  }
  
  return Object.values(financeQuestions)
    .flat()
    .filter(q => q.category === category)
}
