# TakeStock - Stock Analysis Platform

A web-based stock analysis platform that provides comprehensive stock information, historical pricing data, and business intelligence insights for informed investment decisions.

## ⚠️ CRITICAL: Real Data Only - No Mock/Simulated Data

**This application uses ONLY real-time data from financial APIs.** There is no mock, simulated, or generated data. The application uses a multi-API strategy:
- **Finnhub**: Real-time stock quotes and company profiles
- **Alpha Vantage**: 90-day historical price data (primary)
- **Polygon.io**: 90-day historical price data (backup)

If APIs are unavailable or return errors, the application will display error messages rather than showing fabricated data. This ensures you never make financial decisions based on inaccurate information.

## Features

### 🎨 Tabbed Interface
Clean, organized display with 4 main tabs:

**📊 Overview Tab** (Default)
- Company information and business description
- Current stock price and daily performance
- Key fundamentals (P/E, Market Cap, Dividend, Margins, etc.)
- Interactive 52-week price range visualization

**📈 Charts & Technicals Tab**
- Interactive 90-day historical price chart
- Technical indicators (SMA 50/200, RSI, MACD)
- Bullish/bearish signals with color coding

**📰 News & Analysis Tab**
- Recent company news (top 5 articles)
- Analyst recommendations breakdown
- Price targets (High, Median, Low)
- Earnings history with beat/miss indicators

**🎯 Business Simulation Tab**
- Sector-specific business levers
- Interactive sliders to adjust factors
- Weighted impact analysis
- Real-time simulation calculations

### 📊 Comprehensive Stock Analysis
- **Real-Time Quotes**: Current price, OHLC, volume, change %
- **Company Overview**: Business description, sector, industry, exchange
- **Key Metrics**: 15+ fundamental ratios and metrics
- **Technical Analysis**: Moving averages, RSI, MACD with signals
- **Historical Charts**: 90-day price history with Chart.js
- **News Feed**: Latest company news and events
- **Analyst Intelligence**: Recommendations and price targets
- **Earnings Tracking**: Quarterly earnings with estimates
- **Business Levers**: Sector-specific simulation factors

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection for fetching stock data
- (Optional) Alpha Vantage API key for live data

### Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ctrlaltdad/TakeStock.git
   cd TakeStock
   ```

2. Open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

### Configuration

#### Multi-API Strategy
This application uses multiple APIs to provide complete stock data within free tier limitations:

**Recommended Setup (All Free)**:
1. **Finnhub** (real-time quotes): [Get Key](https://finnhub.io/register)
   - Provides: Real-time prices, company profiles
   - Free tier: 60 calls/minute
   - Required for: Current price and company information

2. **Alpha Vantage** (historical data): [Get Key](https://www.alphavantage.co/support/#api-key)
   - Provides: 90-day historical price data
   - Free tier: 25 calls/day (or 500/day with free registration)
   - Required for: Historical price charts

3. **Polygon.io** (backup historical): [Get Key](https://polygon.io/dashboard/signup)
   - Provides: 90-day historical data (15-minute delay)
   - Free tier: 5 calls/minute
   - Optional: Backup if Alpha Vantage unavailable

#### Setup Instructions

1. **Get API Keys** (choose at least one):
   - Minimum: Finnhub (for current prices)
   - Recommended: Finnhub + Alpha Vantage (for full functionality)
   - Best: All three (maximum reliability)

2. **Configure in the App**:
   - Open the application in your browser
   - Click the **⚙️ Settings** button in the header
   - Enter your API key(s) in the appropriate sections
   - Click **Save API Keys**

3. **Start Analyzing**:
   - Enter any stock symbol (e.g., PEP, AAPL, TSLA)
   - The app will automatically use available APIs
   - Status bar shows which APIs are active

**Data Sources Display**:
- The app shows which API provided each piece of data
- Example: "✓ Data from: Finnhub (real-time quote), Alpha Vantage (90-day history)"
- Ensures transparency about data sources

**Graceful Degradation**: 
- Works with any combination of API keys
- Shows current price even without historical data
- Clear warnings when data is unavailable
- All displayed data is real - never simulated

## Usage

1. **Enter a Stock Symbol**: Type a stock ticker symbol (e.g., PEP, AAPL, TSLA) in the search box
2. **Click Analyze**: Press the "Analyze Stock" button or hit Enter
3. **View Results**: 
   - Company overview and business description
   - Current price with daily changes
   - 90-day historical price chart
   - Key business levers specific to the company's sector

4. **Run Simulations**:
   - Scroll to the "Business Levers" section
   - Adjust the sliders to simulate changes in various business factors
   - See the estimated combined impact on stock performance

## Project Structure

```
TakeStock/
├── index.html          # Main HTML structure
├── styles.css          # Application styling
├── app.js             # Core application logic
└── README.md          # Documentation
```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Application logic and API integration
- **Chart.js**: Interactive data visualization
- **Finnhub API**: Real-time stock market data

## Features Explanation

### Business Levers Database
The application includes a comprehensive database of sector-specific business factors:

- **Consumer Defensive** (e.g., PepsiCo): Brand marketing, supply chain, commodity prices, consumer trends, international expansion
- **Technology**: Product innovation, user growth, R&D investment, market competition, regulatory risk
- **Healthcare**: Drug pipeline, patent expirations, R&D success, healthcare policy, M&A activity
- **Financial Services**: Interest rates, credit quality, digital transformation, regulatory compliance

### Simulation Impact
The simulation feature uses weighted calculations to estimate how changes in business levers might affect stock price:
- Each lever has a weight (0.1 to 0.3) representing its typical impact
- Adjusting sliders shows combined effect of multiple factors
- Results are educational estimates, not financial predictions

## Limitations & Disclaimers

⚠️ **CRITICAL DISCLAIMER**: This application is for **educational and informational purposes only**.

### Data Integrity
- **100% Real Data Only**: No mock, simulated, or generated data is ever displayed
- **API Dependent**: The app requires a valid Finnhub API key with appropriate access levels
- **Error Display**: If data cannot be retrieved, you'll see error messages, not fake data
- **Data Accuracy**: Depends entirely on Finnhub API accuracy and your subscription level

### Investment Warning
- ❌ **NOT financial advice** or investment recommendations
- ❌ **NOT a substitute** for professional financial analysis
- ❌ Simulations are **simplified educational models**, not predictions
- ⚠️ **Always consult** with qualified financial professionals before making investment decisions
- ⚠️ **Past performance does NOT guarantee future results**
- ⚠️ **Stock market investments involve substantial risk of loss**

### Verification Required
**Always verify critical information** with:
- Official company investor relations
- SEC filings (EDGAR database)
- Professional financial advisors
- Multiple reputable financial data sources

**Never make investment decisions based solely on this tool.**

## Future Enhancements

Potential features for future development:
- [ ] Multiple stock comparison
- [ ] More detailed financial metrics (P/E, EPS, etc.)
- [ ] News integration
- [ ] Alerts and watchlists
- [ ] Portfolio tracking
- [ ] Machine learning price predictions
- [ ] Social sentiment analysis
- [ ] Export reports to PDF

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Finnhub for providing excellent real-time stock market data API
- Chart.js for powerful and beautiful data visualization
- The open source community for inspiration and tools

## Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: [Your contact information]

---

**Disclaimer**: This tool is for educational purposes only. Stock market investments carry risk. Always do your own research and consult with financial professionals before making investment decisions.
