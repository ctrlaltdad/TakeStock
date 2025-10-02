// TakeStock - Stock Analysis Application
// Main application logic

// State management
let currentStock = null;
let priceChart = null;

// Business levers database for different sectors/companies
const businessLeversDB = {
    default: [
        {
            name: "Revenue Growth",
            description: "Quarter-over-quarter and year-over-year revenue growth indicating market share gains and business expansion.",
            impact: "High",
            weight: 0.25
        },
        {
            name: "Profit Margins",
            description: "Operating and net profit margins showing operational efficiency and pricing power.",
            impact: "High",
            weight: 0.2
        },
        {
            name: "Market Conditions",
            description: "Overall economic conditions, industry trends, and competitive landscape.",
            impact: "Medium",
            weight: 0.15
        },
        {
            name: "Innovation & R&D",
            description: "Investment in research and development, new product launches, and technological advancement.",
            impact: "Medium",
            weight: 0.15
        },
        {
            name: "Regulatory Environment",
            description: "Government regulations, compliance requirements, and policy changes affecting the industry.",
            impact: "Medium",
            weight: 0.1
        }
    ],
    "Consumer Defensive": [
        {
            name: "Brand Marketing & New Products",
            description: "Marketing campaigns, brand recognition, and new product introductions that drive consumer demand and market share.",
            impact: "High",
            weight: 0.25
        },
        {
            name: "Supply Chain Efficiency",
            description: "Distribution network optimization, inventory management, and supply chain resilience against disruptions.",
            impact: "High",
            weight: 0.25
        },
        {
            name: "Commodity Prices",
            description: "Raw material costs (sugar, corn, packaging) that directly impact profit margins.",
            impact: "High",
            weight: 0.2
        },
        {
            name: "Consumer Trends",
            description: "Shifts in consumer preferences (health consciousness, sustainability) affecting product demand.",
            impact: "Medium",
            weight: 0.15
        },
        {
            name: "International Expansion",
            description: "Growth in emerging markets and geographic diversification of revenue streams.",
            impact: "Medium",
            weight: 0.15
        }
    ],
    "Technology": [
        {
            name: "Product Innovation",
            description: "New product launches, feature updates, and technological breakthroughs that drive user adoption.",
            impact: "High",
            weight: 0.3
        },
        {
            name: "User Growth & Engagement",
            description: "Active user base growth, user retention, and platform engagement metrics.",
            impact: "High",
            weight: 0.25
        },
        {
            name: "R&D Investment",
            description: "Research and development spending to maintain competitive advantage and future product pipeline.",
            impact: "High",
            weight: 0.2
        },
        {
            name: "Market Competition",
            description: "Competitive landscape, market share battles, and potential disruption from new entrants.",
            impact: "Medium",
            weight: 0.15
        },
        {
            name: "Regulatory Risk",
            description: "Data privacy regulations, antitrust concerns, and government intervention in the tech sector.",
            impact: "Medium",
            weight: 0.1
        }
    ],
    "Healthcare": [
        {
            name: "Drug Pipeline & Approvals",
            description: "Clinical trial results, FDA approvals, and new drug launches that drive revenue growth.",
            impact: "High",
            weight: 0.3
        },
        {
            name: "Patent Expirations",
            description: "Loss of patent protection leading to generic competition and revenue decline.",
            impact: "High",
            weight: 0.25
        },
        {
            name: "R&D Success Rate",
            description: "Effectiveness of research programs and probability of successful drug development.",
            impact: "High",
            weight: 0.2
        },
        {
            name: "Healthcare Policy",
            description: "Government healthcare policies, drug pricing regulations, and reimbursement rates.",
            impact: "Medium",
            weight: 0.15
        },
        {
            name: "M&A Activity",
            description: "Strategic acquisitions to expand product portfolio and market reach.",
            impact: "Medium",
            weight: 0.1
        }
    ],
    "Financial Services": [
        {
            name: "Interest Rate Environment",
            description: "Central bank policy rates affecting lending margins and investment returns.",
            impact: "High",
            weight: 0.3
        },
        {
            name: "Credit Quality",
            description: "Loan default rates, credit loss provisions, and overall asset quality.",
            impact: "High",
            weight: 0.25
        },
        {
            name: "Digital Transformation",
            description: "Investment in fintech, mobile banking, and operational efficiency improvements.",
            impact: "Medium",
            weight: 0.2
        },
        {
            name: "Regulatory Compliance",
            description: "Banking regulations, capital requirements, and compliance costs.",
            impact: "Medium",
            weight: 0.15
        },
        {
            name: "Economic Conditions",
            description: "Overall economic growth, unemployment rates, and consumer confidence.",
            impact: "Medium",
            weight: 0.1
        }
    ]
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const stockSymbol = document.getElementById('stockSymbol');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeModal');
    const saveApiKeys = document.getElementById('saveApiKeys');
    const clearApiKeys = document.getElementById('clearApiKeys');
    const finnhubKeyInput = document.getElementById('finnhubKeyInput');
    const alphaVantageKeyInput = document.getElementById('alphaVantageKeyInput');
    const polygonKeyInput = document.getElementById('polygonKeyInput');

    // Check API key status on load
    checkApiKeyStatus();

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // Stock analysis
    analyzeBtn.addEventListener('click', analyzeStock);
    stockSymbol.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyzeStock();
    });

    // Settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        loadApiKeys();
    });

    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        clearApiInputs();
        document.getElementById('apiKeyStatus').textContent = '';
    });

    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
            clearApiInputs();
            document.getElementById('apiKeyStatus').textContent = '';
        }
    });

    // Save API keys
    saveApiKeys.addEventListener('click', () => {
        const statusEl = document.getElementById('apiKeyStatus');
        let saved = false;

        // Save Finnhub key
        const finnhubKey = finnhubKeyInput.value.trim();
        if (finnhubKey && !finnhubKey.startsWith('••••')) {
            localStorage.setItem('finnhub_api_key', finnhubKey);
            saved = true;
        }

        // Save Alpha Vantage key
        const alphaVantageKey = alphaVantageKeyInput.value.trim();
        if (alphaVantageKey && !alphaVantageKey.startsWith('••••')) {
            localStorage.setItem('alphavantage_api_key', alphaVantageKey);
            saved = true;
        }

        // Save Polygon key
        const polygonKey = polygonKeyInput.value.trim();
        if (polygonKey && !polygonKey.startsWith('••••')) {
            localStorage.setItem('polygon_api_key', polygonKey);
            saved = true;
        }

        if (saved) {
            statusEl.textContent = '✓ API keys saved successfully!';
            statusEl.className = 'status-message success';
            checkApiKeyStatus();

            setTimeout(() => {
                settingsModal.style.display = 'none';
                clearApiInputs();
                statusEl.textContent = '';
            }, 2000);
        } else {
            statusEl.textContent = 'Please enter at least one API key';
            statusEl.className = 'status-message error';
        }
    });

    // Clear API keys
    clearApiKeys.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove all API keys?')) {
            localStorage.removeItem('finnhub_api_key');
            localStorage.removeItem('alphavantage_api_key');
            localStorage.removeItem('polygon_api_key');
            clearApiInputs();
            
            const statusEl = document.getElementById('apiKeyStatus');
            statusEl.textContent = 'All API keys removed';
            statusEl.className = 'status-message success';
            
            checkApiKeyStatus();

            setTimeout(() => {
                statusEl.textContent = '';
            }, 2000);
        }
    });
});

// Load API keys into modal inputs
function loadApiKeys() {
    const finnhubKey = localStorage.getItem('finnhub_api_key');
    const alphaVantageKey = localStorage.getItem('alphavantage_api_key');
    const polygonKey = localStorage.getItem('polygon_api_key');

    finnhubKeyInput.value = finnhubKey && finnhubKey !== 'YOUR_API_KEY_HERE' 
        ? '••••••••••••' + finnhubKey.slice(-4) 
        : '';
    
    alphaVantageKeyInput.value = alphaVantageKey && alphaVantageKey !== 'YOUR_API_KEY_HERE'
        ? '••••••••••••' + alphaVantageKey.slice(-4)
        : '';
    
    polygonKeyInput.value = polygonKey && polygonKey !== 'YOUR_API_KEY_HERE'
        ? '••••••••••••' + polygonKey.slice(-4)
        : '';
}

// Clear API key inputs
function clearApiInputs() {
    finnhubKeyInput.value = '';
    alphaVantageKeyInput.value = '';
    polygonKeyInput.value = '';
}

// Check API key configuration status
function checkApiKeyStatus() {
    const finnhubKey = localStorage.getItem('finnhub_api_key');
    const alphaVantageKey = localStorage.getItem('alphavantage_api_key');
    const polygonKey = localStorage.getItem('polygon_api_key');
    const statusEl = document.getElementById('apiStatus');
    
    const hasAnyKey = (finnhubKey && finnhubKey !== 'YOUR_API_KEY_HERE') ||
                      (alphaVantageKey && alphaVantageKey !== 'YOUR_API_KEY_HERE') ||
                      (polygonKey && polygonKey !== 'YOUR_API_KEY_HERE');
    
    if (!hasAnyKey) {
        statusEl.textContent = '⚠️ Configure API keys in Settings to use real-time stock data';
        statusEl.className = 'api-status warning';
        statusEl.style.display = 'block';
    } else {
        let sources = [];
        if (finnhubKey && finnhubKey !== 'YOUR_API_KEY_HERE') sources.push('Finnhub (quotes)');
        if (alphaVantageKey && alphaVantageKey !== 'YOUR_API_KEY_HERE') sources.push('Alpha Vantage (historical)');
        if (polygonKey && polygonKey !== 'YOUR_API_KEY_HERE') sources.push('Polygon (historical)');
        
        statusEl.textContent = `✓ Active APIs: ${sources.join(', ')}`;
        statusEl.className = 'api-status success';
        statusEl.style.display = 'block';
    }
}

// Main analysis function
async function analyzeStock() {
    const symbolInput = document.getElementById('stockSymbol');
    const symbol = symbolInput.value.trim().toUpperCase();

    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }

    showLoading(true);
    hideError();
    hideResults();

    try {
        // Fetch stock data
        const stockData = await fetchStockData(symbol);
        currentStock = stockData;

        // Display all results
        displayCompanyInfo(stockData);
        displayPriceInfo(stockData);
        displayKeyMetrics(stockData);
        displayTechnicals(stockData);
        displayNews(stockData);
        displayRecommendations(stockData);
        displayEarnings(stockData);
        
        // Build comprehensive data source message
        const sources = stockData.dataSources;
        let sourceMessage = '✓ Data from: ';
        const sourceList = [];
        
        if (sources.quote) sourceList.push(`${sources.quote} (quotes)`);
        if (sources.historical) sourceList.push(`${sources.historical} (history)`);
        if (sources.fundamentals) sourceList.push(`${sources.fundamentals} (fundamentals)`);
        if (sources.technicals) sourceList.push(`${sources.technicals} (technicals)`);
        if (sources.news) sourceList.push(`${sources.news} (news)`);
        
        sourceMessage += sourceList.join(', ');
        
        // Only show historical chart if data is available
        if (stockData.historicalAvailable) {
            await displayHistoricalChart(stockData);
            showInfo(sourceMessage);
        } else {
            hideHistoricalChart();
            const quoteSource = sources.quote || 'API';
            showWarning(`⚠️ Current price from ${quoteSource} • Historical data not available (configure Alpha Vantage or Polygon API key for charts)`);
        }
        
        displayBusinessLevers(stockData);

        showResults();
    } catch (error) {
        showError(error.message || 'Failed to fetch stock data. Please try again.');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

// Fetch stock data from API (Multi-API approach)
async function fetchStockData(symbol) {
    // Get all available API keys
    const finnhubKey = localStorage.getItem('finnhub_api_key');
    const alphaVantageKey = localStorage.getItem('alphavantage_api_key');
    const polygonKey = localStorage.getItem('polygon_api_key');
    
    // Check if at least one API key is configured
    const hasAnyKey = (finnhubKey && finnhubKey !== 'YOUR_API_KEY_HERE') ||
                      (alphaVantageKey && alphaVantageKey !== 'YOUR_API_KEY_HERE') ||
                      (polygonKey && polygonKey !== 'YOUR_API_KEY_HERE');
    
    if (!hasAnyKey) {
        showError('Please configure at least one API key. Click the "⚙️ Settings" button to add your keys.');
        throw new Error('No API keys configured');
    }
    
    // Strategy: Use all available APIs to get maximum data
    let finnhubData = null;
    let alphaVantageData = null;
    let polygonData = null;
    let dataSources = {
        quote: null,
        profile: null,
        historical: null,
        fundamentals: null,
        news: null,
        technicals: null
    };
    
    try {
        // Step 1: Fetch from Finnhub (comprehensive)
        if (finnhubKey && finnhubKey !== 'YOUR_API_KEY_HERE') {
            try {
                finnhubData = await fetchFromFinnhub(symbol, finnhubKey);
                if (finnhubData && finnhubData.profile && finnhubData.quote) {
                    dataSources.quote = 'Finnhub';
                    dataSources.profile = 'Finnhub';
                    if (finnhubData.news) dataSources.news = 'Finnhub';
                }
            } catch (finnhubError) {
                console.warn('Finnhub fetch failed:', finnhubError.message);
            }
        }
        
        // Step 2: Fetch from Alpha Vantage (comprehensive)
        if (alphaVantageKey && alphaVantageKey !== 'YOUR_API_KEY_HERE') {
            try {
                alphaVantageData = await fetchHistoricalFromAlphaVantage(symbol, alphaVantageKey);
                if (alphaVantageData) {
                    if (alphaVantageData.historical) dataSources.historical = 'Alpha Vantage';
                    if (alphaVantageData.overview) dataSources.fundamentals = 'Alpha Vantage';
                    if (alphaVantageData.technicals) dataSources.technicals = 'Alpha Vantage';
                    // Use AV quote as fallback if Finnhub failed
                    if (!finnhubData && alphaVantageData.quote) {
                        dataSources.quote = 'Alpha Vantage';
                        dataSources.profile = 'Alpha Vantage';
                    }
                }
            } catch (avError) {
                console.warn('Alpha Vantage fetch failed:', avError.message);
            }
        }
        
        // Step 3: Fetch from Polygon (comprehensive, fallback)
        if (polygonKey && polygonKey !== 'YOUR_API_KEY_HERE') {
            try {
                polygonData = await fetchHistoricalFromPolygon(symbol, polygonKey);
                if (polygonData) {
                    // Use Polygon as fallback for historical if AV didn't work
                    if (!dataSources.historical && polygonData.historical) {
                        dataSources.historical = 'Polygon';
                    }
                    // Use Polygon news as additional source
                    if (polygonData.news && !dataSources.news) {
                        dataSources.news = 'Polygon';
                    }
                }
            } catch (polygonError) {
                console.warn('Polygon fetch failed:', polygonError.message);
            }
        }

        // Validate we have at least basic quote data
        const hasQuote = (finnhubData && finnhubData.quote) || 
                        (alphaVantageData && alphaVantageData.quote);
        const hasProfile = (finnhubData && finnhubData.profile) || 
                          (alphaVantageData && alphaVantageData.overview);
        
        if (!hasQuote || !hasProfile) {
            throw new Error('Unable to fetch stock data. Please check your API keys and the stock symbol.');
        }

        // Convert to our internal format
        return convertMultiApiData(symbol, finnhubData, alphaVantageData, polygonData, dataSources);
        
    } catch (error) {
        console.error('API Error:', error.message);
        
        // Show user-friendly error with emphasis on real data requirement
        if (error.message.includes('Historical data access is restricted')) {
            showError('❌ HISTORICAL DATA ACCESS REQUIRED: ' + error.message + ' This app does not use simulated data.');
        } else if (error.message.includes('API key')) {
            showError('❌ API KEY ISSUE: ' + error.message);
        } else if (error.message.includes('rate limit')) {
            showError('❌ RATE LIMIT: Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('No historical data')) {
            showError('❌ NO HISTORICAL DATA: ' + error.message + ' Cannot display chart without real API data.');
        } else {
            showError('❌ UNABLE TO FETCH REAL DATA: ' + error.message + ' This app requires valid API access and does not show simulated data.');
        }
        
        throw error;
    }
}

// Fetch comprehensive data from Finnhub (all available endpoints)
async function fetchFromFinnhub(symbol, apiKey) {
    const data = {
        profile: null,
        quote: null,
        news: null,
        sentiment: null,
        recommendations: null,
        priceTarget: null,
        insiderTransactions: null,
        peers: null,
        metrics: null
    };
    
    try {
        // 1. Company profile (required)
        const profileResponse = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
        );
        
        if (profileResponse.status === 429) {
            throw new Error('Finnhub rate limit exceeded');
        }
        
        if (profileResponse.status === 401) {
            throw new Error('Invalid Finnhub API key');
        }
        
        data.profile = await profileResponse.json();
        
        if (!data.profile || !data.profile.ticker) {
            throw new Error('Invalid stock symbol');
        }

        // 2. Real-time quote (required)
        const quoteResponse = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        );
        data.quote = await quoteResponse.json();
        
        if (!data.quote || data.quote.c === 0) {
            throw new Error('No quote data available');
        }
        
        // 3. Company News (last 7 days)
        try {
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const newsResponse = await fetch(
                `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${apiKey}`
            );
            data.news = await newsResponse.json();
        } catch (e) {
            console.warn('Finnhub news failed:', e.message);
        }
        
        // 4. News Sentiment
        try {
            const sentimentResponse = await fetch(
                `https://finnhub.io/api/v1/news-sentiment?symbol=${symbol}&token=${apiKey}`
            );
            data.sentiment = await sentimentResponse.json();
        } catch (e) {
            console.warn('Finnhub sentiment failed:', e.message);
        }
        
        // 5. Analyst Recommendations
        try {
            const recsResponse = await fetch(
                `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${apiKey}`
            );
            data.recommendations = await recsResponse.json();
        } catch (e) {
            console.warn('Finnhub recommendations failed:', e.message);
        }
        
        // 6. Price Target
        try {
            const targetResponse = await fetch(
                `https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${apiKey}`
            );
            data.priceTarget = await targetResponse.json();
        } catch (e) {
            console.warn('Finnhub price target failed:', e.message);
        }
        
        // 7. Insider Transactions
        try {
            const insiderResponse = await fetch(
                `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${symbol}&token=${apiKey}`
            );
            data.insiderTransactions = await insiderResponse.json();
        } catch (e) {
            console.warn('Finnhub insider transactions failed:', e.message);
        }
        
        // 8. Company Peers (competitors)
        try {
            const peersResponse = await fetch(
                `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${apiKey}`
            );
            data.peers = await peersResponse.json();
        } catch (e) {
            console.warn('Finnhub peers failed:', e.message);
        }
        
        // 9. Basic Financials (metrics)
        try {
            const metricsResponse = await fetch(
                `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`
            );
            data.metrics = await metricsResponse.json();
        } catch (e) {
            console.warn('Finnhub metrics failed:', e.message);
        }
        
        return data;
        
    } catch (error) {
        console.error('Finnhub comprehensive fetch error:', error);
        throw error;
    }
}

// Fetch comprehensive data from Alpha Vantage (all available endpoints)
async function fetchHistoricalFromAlphaVantage(symbol, apiKey) {
    const data = {
        historical: null,
        overview: null,
        quote: null,
        earnings: null,
        income: null,
        balance: null,
        cashflow: null,
        technicals: {}
    };
    
    try {
        // 1. Historical price data (TIME_SERIES_DAILY)
        const historicalResponse = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`
        );
        const historicalData = await historicalResponse.json();
        
        if (historicalData['Note']) {
            throw new Error('Alpha Vantage rate limit reached');
        }
        
        if (historicalData['Error Message']) {
            throw new Error('Invalid symbol or Alpha Vantage error');
        }
        
        const timeSeries = historicalData['Time Series (Daily)'];
        if (timeSeries) {
            const dates = Object.keys(timeSeries).sort().reverse().slice(0, 90);
            data.historical = dates.map(date => ({
                date: date,
                open: parseFloat(timeSeries[date]['1. open']),
                high: parseFloat(timeSeries[date]['2. high']),
                low: parseFloat(timeSeries[date]['3. low']),
                close: parseFloat(timeSeries[date]['4. close']),
                volume: parseInt(timeSeries[date]['5. volume'])
            }));
        }
        
        // 2. Company Overview (fundamentals) - OVERVIEW
        try {
            const overviewResponse = await fetch(
                `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
            );
            const overviewData = await overviewResponse.json();
            if (overviewData && !overviewData['Note'] && !overviewData['Error Message']) {
                data.overview = overviewData;
            }
        } catch (e) {
            console.warn('Alpha Vantage OVERVIEW failed:', e.message);
        }
        
        // 3. Current Quote - GLOBAL_QUOTE
        try {
            const quoteResponse = await fetch(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
            );
            const quoteData = await quoteResponse.json();
            if (quoteData && quoteData['Global Quote']) {
                data.quote = quoteData['Global Quote'];
            }
        } catch (e) {
            console.warn('Alpha Vantage GLOBAL_QUOTE failed:', e.message);
        }
        
        // 4. Earnings History - EARNINGS
        try {
            const earningsResponse = await fetch(
                `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`
            );
            const earningsData = await earningsResponse.json();
            if (earningsData && !earningsData['Note'] && !earningsData['Error Message']) {
                data.earnings = earningsData;
            }
        } catch (e) {
            console.warn('Alpha Vantage EARNINGS failed:', e.message);
        }
        
        // 5. Income Statement - INCOME_STATEMENT
        try {
            const incomeResponse = await fetch(
                `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`
            );
            const incomeData = await incomeResponse.json();
            if (incomeData && !incomeData['Note'] && !incomeData['Error Message']) {
                data.income = incomeData;
            }
        } catch (e) {
            console.warn('Alpha Vantage INCOME_STATEMENT failed:', e.message);
        }
        
        // 6. Balance Sheet - BALANCE_SHEET
        try {
            const balanceResponse = await fetch(
                `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`
            );
            const balanceData = await balanceResponse.json();
            if (balanceData && !balanceData['Note'] && !balanceData['Error Message']) {
                data.balance = balanceData;
            }
        } catch (e) {
            console.warn('Alpha Vantage BALANCE_SHEET failed:', e.message);
        }
        
        // 7. Cash Flow - CASH_FLOW
        try {
            const cashflowResponse = await fetch(
                `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=${apiKey}`
            );
            const cashflowData = await cashflowResponse.json();
            if (cashflowData && !cashflowData['Note'] && !cashflowData['Error Message']) {
                data.cashflow = cashflowData;
            }
        } catch (e) {
            console.warn('Alpha Vantage CASH_FLOW failed:', e.message);
        }
        
        // 8. Technical Indicators - SMA (50-day and 200-day)
        try {
            const sma50Response = await fetch(
                `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=50&series_type=close&apikey=${apiKey}`
            );
            const sma50Data = await sma50Response.json();
            if (sma50Data && sma50Data['Technical Analysis: SMA']) {
                data.technicals.sma50 = sma50Data['Technical Analysis: SMA'];
            }
        } catch (e) {
            console.warn('Alpha Vantage SMA50 failed:', e.message);
        }
        
        try {
            const sma200Response = await fetch(
                `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=200&series_type=close&apikey=${apiKey}`
            );
            const sma200Data = await sma200Response.json();
            if (sma200Data && sma200Data['Technical Analysis: SMA']) {
                data.technicals.sma200 = sma200Data['Technical Analysis: SMA'];
            }
        } catch (e) {
            console.warn('Alpha Vantage SMA200 failed:', e.message);
        }
        
        // 9. RSI - Relative Strength Index
        try {
            const rsiResponse = await fetch(
                `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`
            );
            const rsiData = await rsiResponse.json();
            if (rsiData && rsiData['Technical Analysis: RSI']) {
                data.technicals.rsi = rsiData['Technical Analysis: RSI'];
            }
        } catch (e) {
            console.warn('Alpha Vantage RSI failed:', e.message);
        }
        
        // 10. MACD - Moving Average Convergence Divergence
        try {
            const macdResponse = await fetch(
                `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${apiKey}`
            );
            const macdData = await macdResponse.json();
            if (macdData && macdData['Technical Analysis: MACD']) {
                data.technicals.macd = macdData['Technical Analysis: MACD'];
            }
        } catch (e) {
            console.warn('Alpha Vantage MACD failed:', e.message);
        }
        
        // Return at least historical data (minimum requirement)
        if (!data.historical) {
            throw new Error('No historical data from Alpha Vantage');
        }
        
        return data;
        
    } catch (error) {
        console.error('Alpha Vantage comprehensive fetch error:', error);
        throw error;
    }
}

// Fetch comprehensive data from Polygon (all available endpoints)
async function fetchHistoricalFromPolygon(symbol, apiKey) {
    const polygonData = {
        historical: null,
        tickerDetails: null,
        previousClose: null,
        relatedCompanies: null,
        marketStatus: null,
        financials: null,
        news: null
    };
    
    try {
        const to = new Date().toISOString().split('T')[0];
        const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // 1. Historical Aggregates (candles/bars)
        const aggResponse = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`
        );
        
        const aggData = await aggResponse.json();
        
        if (aggData.status === 'ERROR') {
            throw new Error('Polygon error: ' + (aggData.error || 'Unknown error'));
        }
        
        if (aggData.results && aggData.results.length > 0) {
            polygonData.historical = aggData.results.map(bar => ({
                date: new Date(bar.t).toISOString().split('T')[0],
                open: bar.o,
                high: bar.h,
                low: bar.l,
                close: bar.c,
                volume: bar.v
            }));
        }
        
        // 2. Ticker Details (company information)
        try {
            const detailsResponse = await fetch(
                `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`
            );
            const detailsData = await detailsResponse.json();
            if (detailsData && detailsData.results) {
                polygonData.tickerDetails = detailsData.results;
            }
        } catch (e) {
            console.warn('Polygon ticker details failed:', e.message);
        }
        
        // 3. Previous Close
        try {
            const prevCloseResponse = await fetch(
                `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`
            );
            const prevCloseData = await prevCloseResponse.json();
            if (prevCloseData && prevCloseData.results && prevCloseData.results.length > 0) {
                polygonData.previousClose = prevCloseData.results[0];
            }
        } catch (e) {
            console.warn('Polygon previous close failed:', e.message);
        }
        
        // 4. Related Companies (similar tickers)
        try {
            const relatedResponse = await fetch(
                `https://api.polygon.io/v1/related-companies/${symbol}?apiKey=${apiKey}`
            );
            const relatedData = await relatedResponse.json();
            if (relatedData && relatedData.results) {
                polygonData.relatedCompanies = relatedData.results;
            }
        } catch (e) {
            console.warn('Polygon related companies failed:', e.message);
        }
        
        // 5. Market Status
        try {
            const statusResponse = await fetch(
                `https://api.polygon.io/v1/marketstatus/now?apiKey=${apiKey}`
            );
            const statusData = await statusResponse.json();
            if (statusData) {
                polygonData.marketStatus = statusData;
            }
        } catch (e) {
            console.warn('Polygon market status failed:', e.message);
        }
        
        // 6. Financials (vX endpoint)
        try {
            const financialsResponse = await fetch(
                `https://api.polygon.io/vX/reference/financials?ticker=${symbol}&limit=4&apiKey=${apiKey}`
            );
            const financialsData = await financialsResponse.json();
            if (financialsData && financialsData.results) {
                polygonData.financials = financialsData.results;
            }
        } catch (e) {
            console.warn('Polygon financials failed:', e.message);
        }
        
        // 7. Ticker News
        try {
            const newsResponse = await fetch(
                `https://api.polygon.io/v2/reference/news?ticker=${symbol}&limit=10&apiKey=${apiKey}`
            );
            const newsData = await newsResponse.json();
            if (newsData && newsData.results) {
                polygonData.news = newsData.results;
            }
        } catch (e) {
            console.warn('Polygon news failed:', e.message);
        }
        
        // Return at least historical data (minimum requirement)
        if (!polygonData.historical) {
            throw new Error('No historical data from Polygon');
        }
        
        return polygonData;
        
    } catch (error) {
        console.error('Polygon comprehensive fetch error:', error);
        throw error;
    }
}

// Convert multi-API data to our internal format (comprehensive version)
function convertMultiApiData(symbol, finnhubData, alphaVantageData, polygonData, sources) {
    // Extract quote data (priority: Finnhub > Alpha Vantage > Polygon)
    let quote = null;
    let currentPrice = 0;
    let previousClose = 0;
    
    if (finnhubData && finnhubData.quote) {
        quote = finnhubData.quote;
        currentPrice = quote.c;
        previousClose = quote.pc;
    } else if (alphaVantageData && alphaVantageData.quote) {
        const avQuote = alphaVantageData.quote;
        currentPrice = parseFloat(avQuote['05. price'] || 0);
        previousClose = parseFloat(avQuote['08. previous close'] || 0);
        quote = {
            o: parseFloat(avQuote['02. open'] || 0),
            h: parseFloat(avQuote['03. high'] || 0),
            l: parseFloat(avQuote['04. low'] || 0),
            c: currentPrice,
            pc: previousClose
        };
    } else if (polygonData && polygonData.previousClose) {
        const pc = polygonData.previousClose;
        currentPrice = pc.c;
        previousClose = pc.c; // Polygon doesn't provide real previous close in same format
        quote = {
            o: pc.o,
            h: pc.h,
            l: pc.l,
            c: pc.c,
            pc: pc.c
        };
    }
    
    // Extract profile data (priority: Finnhub > Alpha Vantage > Polygon)
    let profile = {
        Symbol: symbol,
        Name: symbol,
        Exchange: 'N/A',
        Sector: 'N/A',
        Industry: 'N/A',
        Description: '',
        MarketCapitalization: 'N/A',
        Country: 'N/A',
        Currency: 'USD',
        IPO: 'N/A',
        ShareOutstanding: 'N/A',
        Logo: ''
    };
    
    if (finnhubData && finnhubData.profile) {
        const fp = finnhubData.profile;
        profile.Name = fp.name || symbol;
        profile.Exchange = fp.exchange || 'N/A';
        profile.Sector = fp.finnhubIndustry || 'N/A';
        profile.Industry = fp.finnhubIndustry || 'N/A';
        profile.Description = fp.description || '';
        profile.MarketCapitalization = fp.marketCapitalization ? (fp.marketCapitalization * 1000000).toString() : 'N/A';
        profile.Country = fp.country || 'N/A';
        profile.Currency = fp.currency || 'USD';
        profile.IPO = fp.ipo || 'N/A';
        profile.ShareOutstanding = fp.shareOutstanding || 'N/A';
        profile.Logo = fp.logo || '';
    } else if (alphaVantageData && alphaVantageData.overview) {
        const avo = alphaVantageData.overview;
        profile.Name = avo.Name || symbol;
        profile.Exchange = avo.Exchange || 'N/A';
        profile.Sector = avo.Sector || 'N/A';
        profile.Industry = avo.Industry || 'N/A';
        profile.Description = avo.Description || '';
        profile.MarketCapitalization = avo.MarketCapitalization || 'N/A';
        profile.Country = avo.Country || 'N/A';
        profile.Currency = avo.Currency || 'USD';
    } else if (polygonData && polygonData.tickerDetails) {
        const pd = polygonData.tickerDetails;
        profile.Name = pd.name || symbol;
        profile.Exchange = pd.primary_exchange || 'N/A';
        profile.Sector = pd.sic_description || 'N/A';
        profile.Industry = pd.sic_description || 'N/A';
        profile.Description = pd.description || '';
        profile.MarketCapitalization = pd.market_cap ? pd.market_cap.toString() : 'N/A';
        profile.Currency = pd.currency_name || 'USD';
    }
    
    // Extract historical data (priority: Alpha Vantage > Polygon)
    const timeSeries = {};
    let historical = null;
    
    if (alphaVantageData && alphaVantageData.historical) {
        historical = alphaVantageData.historical;
    } else if (polygonData && polygonData.historical) {
        historical = polygonData.historical;
    }
    
    if (historical && historical.length > 0) {
        historical.forEach(day => {
            timeSeries[day.date] = {
                '1. open': day.open.toFixed(2),
                '2. high': day.high.toFixed(2),
                '3. low': day.low.toFixed(2),
                '4. close': day.close.toFixed(2),
                '5. volume': day.volume.toString()
            };
        });
    }
    
    // Calculate change and percent change
    const change = currentPrice - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;
    
    // Build comprehensive result object
    const result = {
        symbol: symbol,
        overview: profile,
        quote: {
            '01. symbol': symbol,
            '02. open': quote ? quote.o.toFixed(2) : 'N/A',
            '03. high': quote ? quote.h.toFixed(2) : 'N/A',
            '04. low': quote ? quote.l.toFixed(2) : 'N/A',
            '05. price': currentPrice.toFixed(2),
            '06. volume': 'N/A',
            '09. change': change.toFixed(2),
            '10. change percent': changePercent.toFixed(2) + '%',
            '11. previous close': previousClose.toFixed(2)
        },
        timeSeries: timeSeries,
        historicalAvailable: historical && historical.length > 0,
        dataSources: sources
    };
    
    // Add enhanced data from Alpha Vantage
    if (alphaVantageData) {
        if (alphaVantageData.overview) {
            result.fundamentals = {
                PERatio: alphaVantageData.overview.PERatio || 'N/A',
                PEGRatio: alphaVantageData.overview.PEGRatio || 'N/A',
                DividendYield: alphaVantageData.overview.DividendYield || 'N/A',
                EPS: alphaVantageData.overview.EPS || 'N/A',
                Beta: alphaVantageData.overview.Beta || 'N/A',
                '52WeekHigh': alphaVantageData.overview['52WeekHigh'] || 'N/A',
                '52WeekLow': alphaVantageData.overview['52WeekLow'] || 'N/A',
                ProfitMargin: alphaVantageData.overview.ProfitMargin || 'N/A',
                OperatingMarginTTM: alphaVantageData.overview.OperatingMarginTTM || 'N/A',
                ReturnOnEquityTTM: alphaVantageData.overview.ReturnOnEquityTTM || 'N/A',
                ReturnOnAssetsTTM: alphaVantageData.overview.ReturnOnAssetsTTM || 'N/A',
                RevenuePerShareTTM: alphaVantageData.overview.RevenuePerShareTTM || 'N/A',
                QuarterlyRevenueGrowthYOY: alphaVantageData.overview.QuarterlyRevenueGrowthYOY || 'N/A',
                QuarterlyEarningsGrowthYOY: alphaVantageData.overview.QuarterlyEarningsGrowthYOY || 'N/A',
                AnalystTargetPrice: alphaVantageData.overview.AnalystTargetPrice || 'N/A'
            };
        }
        if (alphaVantageData.earnings) {
            result.earnings = alphaVantageData.earnings;
        }
        if (alphaVantageData.income) {
            result.incomeStatement = alphaVantageData.income;
        }
        if (alphaVantageData.balance) {
            result.balanceSheet = alphaVantageData.balance;
        }
        if (alphaVantageData.cashflow) {
            result.cashFlow = alphaVantageData.cashflow;
        }
        if (alphaVantageData.technicals) {
            result.technicals = alphaVantageData.technicals;
        }
    }
    
    // Add enhanced data from Finnhub
    if (finnhubData) {
        if (finnhubData.news) {
            result.news = finnhubData.news;
        }
        if (finnhubData.sentiment) {
            result.sentiment = finnhubData.sentiment;
        }
        if (finnhubData.recommendations) {
            result.recommendations = finnhubData.recommendations;
        }
        if (finnhubData.priceTarget) {
            result.priceTarget = finnhubData.priceTarget;
        }
        if (finnhubData.insiderTransactions) {
            result.insiderTransactions = finnhubData.insiderTransactions;
        }
        if (finnhubData.peers) {
            result.peers = finnhubData.peers;
        }
        if (finnhubData.metrics) {
            result.metrics = finnhubData.metrics;
        }
    }
    
    // Add enhanced data from Polygon
    if (polygonData) {
        if (polygonData.news && !result.news) {
            result.news = polygonData.news;
        }
        if (polygonData.relatedCompanies) {
            result.relatedCompanies = polygonData.relatedCompanies;
        }
        if (polygonData.financials) {
            result.polygonFinancials = polygonData.financials;
        }
        if (polygonData.marketStatus) {
            result.marketStatus = polygonData.marketStatus;
        }
    }
    
    return result;
}

// Convert Finnhub API response to our internal format (LEGACY - for backward compatibility)
function convertFinnhubData(symbol, profile, quote, candle, historicalAvailable) {
    // Build time series from real API data (only if available)
    const timeSeries = {};
    const currentPrice = quote.c;
    const previousClose = quote.pc;
    
    // Use real historical data from API if available
    if (historicalAvailable && candle && candle.t && candle.t.length > 0) {
        for (let i = 0; i < candle.t.length; i++) {
            const date = new Date(candle.t[i] * 1000).toISOString().split('T')[0];
            timeSeries[date] = {
                '1. open': candle.o[i].toFixed(2),
                '2. high': candle.h[i].toFixed(2),
                '3. low': candle.l[i].toFixed(2),
                '4. close': candle.c[i].toFixed(2),
                '5. volume': candle.v[i].toString()
            };
        }
    }
    
    // Calculate change and percent change
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
        symbol: symbol,
        overview: {
            Symbol: symbol,
            Name: profile.name || symbol,
            Exchange: profile.exchange || 'N/A',
            Sector: profile.finnhubIndustry || 'N/A',
            Industry: profile.finnhubIndustry || 'N/A',
            Description: profile.description || `${profile.name} is a publicly traded company.`,
            MarketCapitalization: (profile.marketCapitalization * 1000000).toString(),
            Country: profile.country || 'N/A',
            Currency: profile.currency || 'USD',
            IPO: profile.ipo || 'N/A',
            ShareOutstanding: profile.shareOutstanding || 'N/A',
            Logo: profile.logo || ''
        },
        quote: {
            '01. symbol': symbol,
            '02. open': quote.o.toFixed(2),
            '03. high': quote.h.toFixed(2),
            '04. low': quote.l.toFixed(2),
            '05. price': currentPrice.toFixed(2),
            '06. volume': 'N/A', // Finnhub doesn't provide volume in quote
            '09. change': change.toFixed(2),
            '10. change percent': changePercent.toFixed(2) + '%',
            '11. previous close': previousClose.toFixed(2)
        },
        timeSeries: timeSeries,
        historicalAvailable: historicalAvailable
    };
}

// Display company information
function displayCompanyInfo(data) {
    const overview = data.overview;
    
    document.getElementById('companyName').textContent = overview.Name || 'N/A';
    document.getElementById('symbol').textContent = overview.Symbol || data.symbol;
    document.getElementById('exchange').textContent = overview.Exchange || 'N/A';
    document.getElementById('sector').textContent = overview.Sector || 'N/A';
    document.getElementById('industry').textContent = overview.Industry || 'N/A';
    document.getElementById('description').textContent = overview.Description || 'No description available.';
}

// Display current price information
function displayPriceInfo(data) {
    const quote = data.quote;
    
    const currentPrice = parseFloat(quote['05. price']) || 0;
    const change = parseFloat(quote['09. change']) || 0;
    const changePercent = quote['10. change percent'] || '0%';
    
    document.getElementById('currentPrice').textContent = `$${currentPrice.toFixed(2)}`;
    document.getElementById('openPrice').textContent = `$${parseFloat(quote['02. open'] || 0).toFixed(2)}`;
    document.getElementById('highPrice').textContent = `$${parseFloat(quote['03. high'] || 0).toFixed(2)}`;
    document.getElementById('lowPrice').textContent = `$${parseFloat(quote['04. low'] || 0).toFixed(2)}`;
    document.getElementById('volume').textContent = formatVolume(quote['06. volume'] || 0);
    
    const priceChangeEl = document.getElementById('priceChange');
    const changeSign = change >= 0 ? '+' : '';
    priceChangeEl.textContent = `${changeSign}${change.toFixed(2)} (${changePercent})`;
    priceChangeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
}

// Display historical price chart
async function displayHistoricalChart(data) {
    const timeSeries = data.timeSeries;
    
    // Make sure chart card is visible
    const chartCard = document.querySelector('.card:has(#priceChart)');
    if (chartCard) {
        chartCard.style.display = 'block';
    }
    
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
        console.warn('No time series data to display');
        return;
    }
    
    const dates = Object.keys(timeSeries).reverse().slice(-90); // Last 90 days
    const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
    
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (priceChart) {
        priceChart.destroy();
    }
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Close Price',
                data: prices,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Display key metrics and fundamentals
function displayKeyMetrics(data) {
    if (!data.fundamentals) {
        // Hide card content but keep card visible
        document.getElementById('keyMetricsCard').innerHTML = '<h2>📊 Key Metrics & Fundamentals</h2><p class="info-message">⚠️ Fundamental data not available. Configure Alpha Vantage API key for full analysis.</p>';
        return;
    }
    
    const f = data.fundamentals;
    document.getElementById('peRatio').textContent = f.PERatio !== 'N/A' ? parseFloat(f.PERatio).toFixed(2) : 'N/A';
    document.getElementById('marketCap').textContent = formatMarketCap(data.overview.MarketCapitalization);
    document.getElementById('dividendYield').textContent = f.DividendYield !== 'N/A' ? (parseFloat(f.DividendYield) * 100).toFixed(2) + '%' : 'N/A';
    document.getElementById('eps').textContent = f.EPS !== 'N/A' ? '$' + parseFloat(f.EPS).toFixed(2) : 'N/A';
    document.getElementById('beta').textContent = f.Beta !== 'N/A' ? parseFloat(f.Beta).toFixed(2) : 'N/A';
    document.getElementById('profitMargin').textContent = f.ProfitMargin !== 'N/A' ? (parseFloat(f.ProfitMargin) * 100).toFixed(2) + '%' : 'N/A';
    document.getElementById('roe').textContent = f.ReturnOnEquityTTM !== 'N/A' ? (parseFloat(f.ReturnOnEquityTTM) * 100).toFixed(2) + '%' : 'N/A';
    document.getElementById('revenueGrowth').textContent = f.QuarterlyRevenueGrowthYOY !== 'N/A' ? (parseFloat(f.QuarterlyRevenueGrowthYOY) * 100).toFixed(2) + '%' : 'N/A';
    
    // 52-week range
    if (f['52WeekHigh'] !== 'N/A' && f['52WeekLow'] !== 'N/A') {
        const high = parseFloat(f['52WeekHigh']);
        const low = parseFloat(f['52WeekLow']);
        const current = parseFloat(data.quote['05. price']);
        const position = ((current - low) / (high - low)) * 100;
        
        document.getElementById('week52Low').textContent = '$' + low.toFixed(2);
        document.getElementById('week52High').textContent = '$' + high.toFixed(2);
        document.getElementById('week52Current').textContent = '$' + current.toFixed(2);
        document.getElementById('week52Indicator').style.left = position + '%';
    }
}

// Display technical indicators
function displayTechnicals(data) {
    if (!data.technicals || Object.keys(data.technicals).length === 0) {
        document.getElementById('technicalCard').innerHTML = '<h2>📈 Technical Analysis</h2><p class="info-message">⚠️ Technical indicators not available. Configure Alpha Vantage API key for technical analysis.</p>';
        return;
    }
    
    const currentPrice = parseFloat(data.quote['05. price']);
    
    // SMA 50
    if (data.technicals.sma50) {
        const sma50Data = Object.values(data.technicals.sma50)[0];
        const sma50Value = parseFloat(sma50Data['SMA']);
        document.getElementById('sma50').textContent = '$' + sma50Value.toFixed(2);
        
        const sma50Signal = document.getElementById('sma50Signal');
        if (currentPrice > sma50Value) {
            sma50Signal.textContent = '🔼 Bullish';
            sma50Signal.className = 'tech-signal bullish';
        } else {
            sma50Signal.textContent = '🔽 Bearish';
            sma50Signal.className = 'tech-signal bearish';
        }
    }
    
    // SMA 200
    if (data.technicals.sma200) {
        const sma200Data = Object.values(data.technicals.sma200)[0];
        const sma200Value = parseFloat(sma200Data['SMA']);
        document.getElementById('sma200').textContent = '$' + sma200Value.toFixed(2);
        
        const sma200Signal = document.getElementById('sma200Signal');
        if (currentPrice > sma200Value) {
            sma200Signal.textContent = '🔼 Bullish';
            sma200Signal.className = 'tech-signal bullish';
        } else {
            sma200Signal.textContent = '🔽 Bearish';
            sma200Signal.className = 'tech-signal bearish';
        }
    }
    
    // RSI
    if (data.technicals.rsi) {
        const rsiData = Object.values(data.technicals.rsi)[0];
        const rsiValue = parseFloat(rsiData['RSI']);
        document.getElementById('rsi').textContent = rsiValue.toFixed(2);
        
        const rsiSignal = document.getElementById('rsiSignal');
        if (rsiValue > 70) {
            rsiSignal.textContent = '🔴 Overbought';
            rsiSignal.className = 'tech-signal bearish';
        } else if (rsiValue < 30) {
            rsiSignal.textContent = '🟢 Oversold';
            rsiSignal.className = 'tech-signal bullish';
        } else {
            rsiSignal.textContent = '⚪ Neutral';
            rsiSignal.className = 'tech-signal neutral';
        }
    }
    
    // MACD
    if (data.technicals.macd) {
        const macdData = Object.values(data.technicals.macd)[0];
        const macdValue = parseFloat(macdData['MACD']);
        const signalValue = parseFloat(macdData['MACD_Signal']);
        document.getElementById('macd').textContent = macdValue.toFixed(2);
        
        const macdSignal = document.getElementById('macdSignal');
        if (macdValue > signalValue) {
            macdSignal.textContent = '🔼 Bullish';
            macdSignal.className = 'tech-signal bullish';
        } else {
            macdSignal.textContent = '🔽 Bearish';
            macdSignal.className = 'tech-signal bearish';
        }
    }
    
    document.getElementById('technicalCard').style.display = 'block';
}

// Display news
function displayNews(data) {
    const newsList = document.getElementById('newsList');
    
    if (!data.news || data.news.length === 0) {
        newsList.innerHTML = '<p class="info-message">⚠️ No recent news available. Configure Finnhub or Polygon API key for news feed.</p>';
        return;
    }
    newsList.innerHTML = '';
    
    // Show top 5 most recent news items
    data.news.slice(0, 5).forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        // Handle different timestamp formats
        let timestamp = item.datetime || item.published_utc;
        // Finnhub uses Unix seconds, need to convert to milliseconds
        if (timestamp && timestamp < 10000000000) {
            timestamp = timestamp * 1000;
        }
        
        const date = new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        newsItem.innerHTML = `
            <div class="news-headline">${item.headline || item.title}</div>
            <div class="news-meta">
                <span>📅 ${date}</span>
                <span>📰 ${item.source || item.publisher?.name || 'Unknown'}</span>
            </div>
            ${item.summary ? `<div class="news-summary">${item.summary.substring(0, 150)}...</div>` : ''}
            <a href="${item.url || item.article_url}" target="_blank" class="news-link">Read more →</a>
        `;
        
        newsList.appendChild(newsItem);
    });
    
    document.getElementById('newsCard').style.display = 'block';
}

// Display analyst recommendations
function displayRecommendations(data) {
    const recsList = document.getElementById('recommendationsList');
    
    if (!data.recommendations || data.recommendations.length === 0) {
        recsList.innerHTML = '<p class="info-message">⚠️ Analyst recommendations not available. Configure Finnhub API key for analyst data.</p>';
        document.getElementById('priceTargetSection').innerHTML = '';
        return;
    }
    recsList.innerHTML = '';
    
    // Show most recent recommendation
    const latest = data.recommendations[0];
    const recItem = document.createElement('div');
    recItem.className = 'recommendation-item';
    
    const period = latest.period || new Date(latest.date).toLocaleDateString();
    
    recItem.innerHTML = `
        <h3>Latest Recommendations (${period})</h3>
        <div class="recommendation-grid">
            <div class="recommendation-stat">
                <span class="recommendation-stat-label">Strong Buy</span>
                <span class="recommendation-stat-value strong-buy">${latest.strongBuy || 0}</span>
            </div>
            <div class="recommendation-stat">
                <span class="recommendation-stat-label">Buy</span>
                <span class="recommendation-stat-value buy">${latest.buy || 0}</span>
            </div>
            <div class="recommendation-stat">
                <span class="recommendation-stat-label">Hold</span>
                <span class="recommendation-stat-value hold">${latest.hold || 0}</span>
            </div>
            <div class="recommendation-stat">
                <span class="recommendation-stat-label">Sell</span>
                <span class="recommendation-stat-value sell">${latest.sell || 0}</span>
            </div>
            <div class="recommendation-stat">
                <span class="recommendation-stat-label">Strong Sell</span>
                <span class="recommendation-stat-value strong-sell">${latest.strongSell || 0}</span>
            </div>
        </div>
    `;
    
    recsList.appendChild(recItem);
    
    // Price target
    if (data.priceTarget) {
        const targetSection = document.getElementById('priceTargetSection');
        targetSection.innerHTML = `
            <h3>Analyst Price Targets</h3>
            <div class="price-target-grid">
                <div class="price-target-item">
                    <div class="price-target-label">Target High</div>
                    <div class="price-target-value">$${data.priceTarget.targetHigh?.toFixed(2) || 'N/A'}</div>
                </div>
                <div class="price-target-item">
                    <div class="price-target-label">Target Median</div>
                    <div class="price-target-value">$${data.priceTarget.targetMedian?.toFixed(2) || 'N/A'}</div>
                </div>
                <div class="price-target-item">
                    <div class="price-target-label">Target Low</div>
                    <div class="price-target-value">$${data.priceTarget.targetLow?.toFixed(2) || 'N/A'}</div>
                </div>
            </div>
        `;
    }
    
}

// Display earnings history
function displayEarnings(data) {
    const earningsList = document.getElementById('earningsList');
    
    if (!data.earnings || !data.earnings.quarterlyEarnings) {
        earningsList.innerHTML = '<p class="info-message">⚠️ Earnings history not available. Configure Alpha Vantage API key for earnings data.</p>';
        return;
    }
    earningsList.innerHTML = '';
    
    // Show last 4 quarters
    data.earnings.quarterlyEarnings.slice(0, 4).forEach(quarter => {
        const earningsItem = document.createElement('div');
        earningsItem.className = 'earnings-item';
        
        const actual = parseFloat(quarter.reportedEPS || 0);
        const estimate = parseFloat(quarter.estimatedEPS || 0);
        const surprise = actual - estimate;
        const surprisePercent = estimate ? ((surprise / estimate) * 100).toFixed(1) : 0;
        
        const beatMiss = surprise >= 0 ? 'beat' : 'miss';
        const surpriseText = surprise >= 0 ? `Beat by ${surprisePercent}%` : `Miss by ${Math.abs(surprisePercent)}%`;
        
        earningsItem.innerHTML = `
            <div class="earnings-quarter">${quarter.fiscalDateEnding}</div>
            <div class="earnings-eps">
                <span class="earnings-actual">$${actual.toFixed(2)}</span>
                <span class="earnings-estimate">Est: $${estimate.toFixed(2)}</span>
                <span class="earnings-surprise ${beatMiss}">${surpriseText}</span>
            </div>
        `;
        
        earningsList.appendChild(earningsItem);
    });
    
    document.getElementById('earningsCard').style.display = 'block';
}

// Helper function to format market cap
function formatMarketCap(marketCap) {
    const num = parseFloat(marketCap);
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + num.toFixed(0);
}

// Display business levers
function displayBusinessLevers(data) {
    const sector = data.overview.Sector || 'default';
    let levers = businessLeversDB[sector] || businessLeversDB.default;
    
    const leversList = document.getElementById('leversList');
    leversList.innerHTML = '';
    
    levers.forEach(lever => {
        const leverItem = document.createElement('div');
        leverItem.className = 'lever-item';
        leverItem.innerHTML = `
            <h4>${lever.name}</h4>
            <p>${lever.description}</p>
            <span class="lever-impact">Impact: ${lever.impact}</span>
        `;
        leversList.appendChild(leverItem);
    });
    
    // Create simulation controls
    createSimulationControls(levers);
}

// Create simulation controls
function createSimulationControls(levers) {
    const controlsContainer = document.getElementById('simulationControls');
    controlsContainer.innerHTML = '';
    
    levers.forEach((lever, index) => {
        const controlItem = document.createElement('div');
        controlItem.className = 'control-item';
        controlItem.innerHTML = `
            <div class="control-label">
                <span>${lever.name}</span>
                <span class="control-value" id="value-${index}">0%</span>
            </div>
            <input 
                type="range" 
                id="lever-${index}" 
                min="-50" 
                max="50" 
                value="0" 
                step="5"
                data-weight="${lever.weight}"
            >
        `;
        controlsContainer.appendChild(controlItem);
        
        const slider = controlItem.querySelector(`#lever-${index}`);
        const valueDisplay = controlItem.querySelector(`#value-${index}`);
        
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = `${value > 0 ? '+' : ''}${value}%`;
            updateSimulation();
        });
    });
}

// Update simulation result
function updateSimulation() {
    const sliders = document.querySelectorAll('#simulationControls input[type="range"]');
    let totalImpact = 0;
    
    sliders.forEach(slider => {
        const value = parseFloat(slider.value);
        const weight = parseFloat(slider.dataset.weight);
        totalImpact += value * weight;
    });
    
    const impactValueEl = document.getElementById('impactValue');
    const sign = totalImpact > 0 ? '+' : '';
    impactValueEl.textContent = `${sign}${totalImpact.toFixed(1)}%`;
    impactValueEl.className = `impact-value ${totalImpact > 0 ? 'positive' : totalImpact < 0 ? 'negative' : ''}`;
}

// Utility functions
function formatVolume(volume) {
    const num = parseInt(volume);
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
}

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

function showResults() {
    document.getElementById('resultsSection').style.display = 'block';
    // Reset to first tab when showing results
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="overview"]').classList.add('active');
    document.getElementById('overview-tab').classList.add('active');
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.className = 'error-message';
    errorEl.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function showInfo(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.className = 'info-message';
    errorEl.style.display = 'block';
}

function showWarning(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.className = 'warning-message';
    errorEl.style.display = 'block';
}

function hideHistoricalChart() {
    const chartCard = document.querySelector('.card:has(#priceChart)');
    if (chartCard) {
        chartCard.style.display = 'none';
    }
}
