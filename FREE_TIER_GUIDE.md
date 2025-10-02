# Finnhub Free Tier - What's Available

## ✅ Always Available (Free Tier)

### 1. Real-Time Quote (`/quote`)
**What you get:**
- Current stock price (`c`)
- Previous close (`pc`)
- Today's open (`o`)
- Today's high (`h`)
- Today's low (`l`)
- Price change and percentage

**Used for:**
- Current price display
- Daily performance metrics
- Price change indicators

---

### 2. Company Profile (`/stock/profile2`)
**What you get:**
- Company name
- Ticker symbol
- Exchange (NASDAQ, NYSE, etc.)
- Industry/Sector (finnhubIndustry)
- Company description
- Country
- Currency
- IPO date
- Market capitalization
- Website URL
- Company logo
- Number of shares outstanding

**Used for:**
- Company overview card
- Business description
- Sector-based business levers

---

## ❌ Often Restricted (Free Tier)

### 3. Historical Candle Data (`/stock/candle`)
**What it provides:**
- 90 days of OHLC (Open, High, Low, Close)
- Daily volume
- Historical price trends

**Why restricted:**
- Premium feature on many free plans
- Returns 403 Forbidden
- May require contacting Finnhub support
- Often included only in paid tiers ($10-50/month)

**Without it:**
- No historical price charts
- Can't show 90-day trends
- Can't analyze historical patterns

---

## Other Finnhub Endpoints (Not Currently Used)

### Available in Free Tier:
- **News** (`/company-news`) - Recent company news articles
- **Recommendations** (`/stock/recommendation`) - Analyst recommendations
- **Basic Financials** (`/stock/metric`) - Some financial metrics
- **Peers** (`/stock/peers`) - Similar companies

### Usually Restricted:
- **Earnings** - Detailed earnings data
- **SEC Filings** - EDGAR filings
- **Insider Transactions** - Insider trading data
- **Institutional Ownership** - Institutional holdings

---

## Current App Behavior

### With Free Tier API Key:

```
✅ Company Overview
   - Name: Apple Inc.
   - Symbol: AAPL
   - Exchange: NASDAQ
   - Sector: Technology
   - Description: [Full description from API]

✅ Current Price & Performance
   - Current Price: $178.25
   - Open: $177.50
   - High: $179.00
   - Low: $177.00
   - Change: +$1.25 (+0.70%)

⚠️ Historical Price Chart
   - NOT SHOWN (API restriction)
   - Warning displayed instead
   - No fake/simulated data

✅ Business Levers
   - Based on company sector
   - Interactive simulation
   - Educational tool
```

---

## Recommendations

### For Free Tier Users:
1. **Accept limitations** - Current price data is still valuable
2. **Request access** - Email Finnhub support (support@finnhub.io)
3. **Use external charts** - View historical charts on Yahoo Finance, TradingView
4. **Focus on real-time** - Use the app for current analysis

### For Full Features:
1. **Upgrade Plan** - Finnhub paid plans start at ~$10/month
2. **Alternative APIs**:
   - Alpha Vantage (500 calls/day free)
   - IEX Cloud (50k messages/month free)
   - Yahoo Finance (unofficial, no key needed but unreliable)
   - Polygon.io (free tier available)

---

## API Call Usage

Each stock lookup uses:
- 1 call for company profile
- 1 call for real-time quote
- 1 call for historical data (if available)

**Total: 3 calls per stock**

With free tier limit of 60 calls/minute:
- Can look up ~20 stocks per minute
- More than enough for individual use

---

## Testing Your API Key

To see what your API key can access:

1. **Profile endpoint:**
   ```
   https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=YOUR_KEY
   ```
   Should return company data

2. **Quote endpoint:**
   ```
   https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY
   ```
   Should return current price

3. **Candle endpoint:**
   ```
   https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=1728000000&to=1735776000&token=YOUR_KEY
   ```
   May return 403 Forbidden on free tier

---

## Summary

**TakeStock works with free tier!**
- ✅ You get real current prices
- ✅ You get real company information  
- ⚠️ You don't get historical charts
- ❌ You never get fake data

**Still valuable for:**
- Checking current stock prices
- Learning about companies
- Understanding business levers
- Educational stock analysis
- Quick price lookups

**For complete features:**
- Contact Finnhub for historical access
- Or upgrade to paid plan
- Or use supplementary tools for charts
