# Quick Setup Guide - Multi-API Real Stock Data

## ⚠️ CRITICAL: Real Data Only

**This application displays ONLY real data from financial APIs.** There is no mock, simulated, or generated data. The app uses multiple APIs to provide complete stock information:
- **Finnhub**: Real-time quotes
- **Alpha Vantage**: Historical price data (primary)
- **Polygon.io**: Historical data backup

If APIs fail or lack permissions, you'll see error messages instead of fabricated data. **Never make financial decisions based on unverified data.**

## 🚀 Get Started - Choose Your Setup

### Option 1: Quick Start (Minimum Setup)
**Get current prices only**
- Time: 2 minutes
- APIs needed: Finnhub only
- What works: Current prices, company info
- What's missing: Historical charts

### Option 2: Full Features (Recommended)
**Get everything including charts**
- Time: 5 minutes
- APIs needed: Finnhub + Alpha Vantage
- What works: Everything (prices + 90-day charts)
- Best for: Complete stock analysis

### Option 3: Maximum Reliability
**Backup historical data source**
- Time: 7 minutes
- APIs needed: Finnhub + Alpha Vantage + Polygon
- What works: Everything with redundancy
- Best for: Heavy usage, maximum uptime

---

## 📋 Step-by-Step Setup

### Step 1: Get API Keys (Choose Your Option)

#### Required: Finnhub (Real-time Quotes)
1. Go to **[https://finnhub.io/register](https://finnhub.io/register)**
2. Sign up with email (no credit card!)
3. Copy your API key from the dashboard
4. Format: `abc123xyz456`

#### Recommended: Alpha Vantage (Historical Data)
1. Go to **[https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)**
2. Enter your email to get a free key
3. Check your email for the API key
4. Free tier: 25 calls/day (or register for 500/day)

#### Optional: Polygon.io (Historical Backup)
1. Go to **[https://polygon.io/dashboard/signup](https://polygon.io/dashboard/signup)**
2. Create a free account
3. Copy your API key from the dashboard
4. Free tier: 5 calls/minute, 15-min delayed data

### Step 2: Configure the App

1. Open TakeStock (http://localhost:8000 or open index.html)
2. Click the **⚙️ Settings** button (top right)
3. You'll see three sections:
   - **Finnhub API Key** (for real-time quotes)
   - **Alpha Vantage API Key** (for historical charts)
   - **Polygon.io API Key** (backup for charts)
4. Paste your key(s) in the appropriate fields
5. Click **Save API Keys**
6. See: "✓ API keys saved successfully!"

The status bar will show which APIs are active:
```
✓ Active APIs: Finnhub (quotes), Alpha Vantage (historical)
```

### Step 3: Analyze Stocks!

Try these examples:
- **PEP** - PepsiCo (Consumer Defensive sector)
- **AAPL** - Apple (Technology sector)
- **TSLA** - Tesla (Auto Manufacturers)
- **MSFT** - Microsoft (Software)
- **JPM** - JPMorgan Chase (Financial Services)

## 🎯 What You'll Get

### With Finnhub Only:
- ✅ Current stock price (real-time)
- ✅ Daily open, high, low, close
- ✅ Price change and percentage
- ✅ Company name and description
- ✅ Sector and industry
- ❌ No historical price charts

### With Finnhub + Alpha Vantage/Polygon:
- ✅ Everything above, PLUS:
- ✅ 90-day historical price chart
- ✅ Interactive chart with tooltips
- ✅ Visual trend analysis
- ✅ Complete stock analysis

**⚠️ IMPORTANT**: The app shows which API provided each piece of data:
```
✓ Data from: Finnhub (real-time quote), Alpha Vantage (90-day history)
```

### Business Intelligence:
- 📊 Interactive historical price charts
- 🎚️ Sector-specific business levers
- 🔮 Impact simulation sliders
- 📈 Visual trend analysis

## 💡 Understanding API Limits

### Finnhub (Real-time Quotes):
- **60 calls per minute**
- Each stock lookup uses 2 calls (profile + quote)
- You can look up ~30 stocks per minute
- Resets every 60 seconds

### Alpha Vantage (Historical Data):
- **25 calls per day** (free key)
- **500 calls per day** (with free registration)
- Each stock lookup uses 1 call
- Resets at midnight UTC

### Polygon (Historical Backup):
- **5 calls per minute**
- Each stock lookup uses 1 call
- Data has 15-minute delay
- Resets every 60 seconds

### Smart Usage:
- Look up a stock once, then use business lever simulations (no extra API calls)
- If you hit Alpha Vantage limit, app automatically uses Polygon
- Spread your searches throughout the day for Alpha Vantage

### Best Practices:
1. Keep your API key private (don't share screenshots with your key visible)
2. The key is stored locally in your browser (localStorage)
3. You only need to enter it once - it will persist
4. Click "Clear Key" in settings if you want to remove it

## 🔍 Testing Real Data

To verify you're getting real data:

1. Look up **PEP** (PepsiCo)
2. Check the price - it should be around $170-180 (current market price)
3. The historical chart should show realistic price movements
4. Company description should read: "PepsiCo, Inc. operates as a food and beverage company worldwide..."

Compare with:
- [Yahoo Finance](https://finance.yahoo.com/quote/PEP)
- [Google Finance](https://www.google.com/finance/quote/PEP:NASDAQ)

The prices should match!

## ❓ Troubleshooting

### "Please add your Finnhub API key"
- You haven't configured an API key yet
- Click ⚙️ Settings and add your key

### "Invalid API key"
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Try generating a new key on Finnhub

### "API rate limit exceeded"
- You've made more than 60 calls in a minute
- Wait 60 seconds and try again
- This is rare unless you're rapidly clicking

### Data looks wrong
- Some stocks may not have complete data on Finnhub
- Try major stocks like AAPL, MSFT, TSLA, PEP
- Check if the symbol is correct (must be exact)

### "Historical data endpoint forbidden" or 403 Error
- Your Finnhub API key does not have access to historical candle data
- **The app will NOT show simulated data** - you'll see this error message
- **Solution**: Contact Finnhub support to request historical data access, or upgrade your plan
- **DO NOT use the app for financial decisions** if you cannot access complete real data

## 🆘 Still Need Help?

1. Check the browser console (F12) for error messages
2. Verify your API key is still valid on Finnhub dashboard
3. Try a different stock symbol
4. Make sure you have internet connection

## 🎉 Enjoy!

You now have a professional stock analysis tool with real-time data! Experiment with the business levers simulation to see how different factors might impact stock prices.

**Remember**: This is for educational purposes only. Always do your own research before making investment decisions.
