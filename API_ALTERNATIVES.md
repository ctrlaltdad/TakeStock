# Alternative Free Stock APIs - Comparison Guide

## Overview
If Finnhub's free tier is too limited, here are the best free alternatives for stock market data.

---

## 🥇 Top Recommendations

### 1. **Alpha Vantage** ⭐ Best Free Alternative
**Website:** https://www.alphavantage.co/

**Free Tier:**
- ✅ 25 API calls per day (adjusted from 500 - check current limits)
- ✅ 5 API calls per minute
- ✅ No credit card required
- ✅ Single API key for everything

**What's Available:**
- ✅ Real-time and historical stock quotes
- ✅ Intraday data (1min, 5min, 15min, 30min, 60min)
- ✅ Daily, weekly, monthly historical data
- ✅ Company overview and fundamentals
- ✅ Technical indicators (SMA, EMA, RSI, etc.)
- ✅ Sector performance
- ✅ Forex and crypto data

**API Endpoints:**
```javascript
// Real-time quote
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY

// Daily historical (100 days)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=YOUR_KEY

// Company overview
https://www.alphavantage.co/query?function=OVERVIEW&symbol=AAPL&apikey=YOUR_KEY
```

**Pros:**
- ✅ Most generous free tier for individual use
- ✅ Excellent documentation
- ✅ Includes historical data
- ✅ Company fundamentals included

**Cons:**
- ⚠️ Limited calls per day (25-500 depending on plan)
- ⚠️ Rate limiting can be restrictive
- ⚠️ Data delayed 15 minutes (not real-time for free)

**Best For:** Personal projects, learning, portfolio tracking

---

### 2. **IEX Cloud** ⭐ Great for Real-Time
**Website:** https://iexcloud.io/

**Free Tier:**
- ✅ 50,000 "messages" per month
- ✅ No credit card required for sandbox
- ✅ Production tier available with credit card

**What's Available:**
- ✅ Real-time stock quotes (uses credits)
- ✅ Historical data (1 year+)
- ✅ Company information
- ✅ News and press releases
- ✅ Dividends and splits
- ✅ Financials (balance sheet, income statement)
- ✅ Stats and key metrics

**API Endpoints:**
```javascript
// Real-time quote
https://cloud.iexapis.com/stable/stock/AAPL/quote?token=YOUR_TOKEN

// Historical data (5 years)
https://cloud.iexapis.com/stable/stock/AAPL/chart/5y?token=YOUR_TOKEN

// Company info
https://cloud.iexapis.com/stable/stock/AAPL/company?token=YOUR_TOKEN
```

**Credit System:**
- Each endpoint uses credits (1-500 credits per call)
- Quote = 1 credit
- Historical day = 10 credits
- Company info = 1 credit

**Pros:**
- ✅ Actually real-time (not delayed)
- ✅ Generous free tier if used wisely
- ✅ Excellent data quality
- ✅ Good documentation

**Cons:**
- ⚠️ Credit system can be confusing
- ⚠️ Need to track usage carefully
- ⚠️ Some endpoints use many credits

**Best For:** Real-time data, US markets, serious projects

---

### 3. **Polygon.io** ⭐ Good Balance
**Website:** https://polygon.io/

**Free Tier:**
- ✅ "Starter" plan is free
- ✅ 5 API calls per minute
- ✅ Delayed data (15 minutes)
- ✅ No credit card required

**What's Available:**
- ✅ Stock quotes (delayed 15 min)
- ✅ Historical aggregates (bars)
- ✅ Daily open/close
- ✅ Previous day's data
- ✅ Ticker details
- ✅ Stock splits and dividends

**API Endpoints:**
```javascript
// Previous day's close
https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=YOUR_KEY

// Daily aggregate
https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-01/2023-12-31?apiKey=YOUR_KEY

// Ticker details
https://api.polygon.io/v3/reference/tickers/AAPL?apikey=YOUR_KEY
```

**Pros:**
- ✅ Clean, modern API
- ✅ Good documentation
- ✅ Includes crypto and forex
- ✅ WebSocket support

**Cons:**
- ⚠️ Data delayed 15 minutes
- ⚠️ Limited calls per minute
- ⚠️ Real-time requires paid plan

**Best For:** Historical analysis, delayed data OK

---

## 🆓 Completely Free (No API Key)

### 4. **Yahoo Finance (Unofficial)** ⚠️ Use with Caution
**Library:** https://github.com/ranaroussi/yfinance (Python)

**What's Available:**
- ✅ No API key needed
- ✅ Historical data
- ✅ Real-time quotes
- ✅ Company information
- ✅ Unlimited usage

**Example (Python):**
```python
import yfinance as yf
stock = yf.Ticker("AAPL")
hist = stock.history(period="1y")
info = stock.info
```

**Pros:**
- ✅ Completely free
- ✅ No rate limits (in practice)
- ✅ No API key required
- ✅ Easy to use

**Cons:**
- ⚠️ Unofficial (scrapes Yahoo)
- ⚠️ No guarantees
- ⚠️ Could break anytime
- ⚠️ Python-only (would need backend)

**Best For:** Python projects, prototypes, no commercial use

---

### 5. **Twelve Data** 💰 Limited Free
**Website:** https://twelvedata.com/

**Free Tier:**
- ✅ 800 API calls per day
- ✅ 8 calls per minute
- ✅ No credit card required

**What's Available:**
- ✅ Real-time quotes (15-min delayed)
- ✅ Historical time series
- ✅ Technical indicators
- ✅ Forex, crypto, commodities
- ✅ Company fundamentals

**Pros:**
- ✅ Good free tier
- ✅ Multiple asset classes
- ✅ Technical indicators built-in

**Cons:**
- ⚠️ Data delayed
- ⚠️ Less comprehensive than others

---

## 📊 Comparison Table

| API | Free Calls | Real-Time | Historical | Fundamentals | Difficulty |
|-----|-----------|-----------|------------|--------------|-----------|
| **Alpha Vantage** | 25-500/day | No (15min delay) | ✅ Yes | ✅ Yes | Easy |
| **IEX Cloud** | 50k/month | ✅ Yes | ✅ Yes | ✅ Yes | Medium |
| **Polygon.io** | 5/min | No (15min delay) | ✅ Yes | Limited | Easy |
| **Finnhub** | 60/min | ✅ Yes | ❌ Paid | ✅ Yes | Easy |
| **Twelve Data** | 800/day | No (15min delay) | ✅ Yes | ✅ Yes | Easy |
| **Yahoo (yfinance)** | Unlimited* | ✅ Yes | ✅ Yes | ✅ Yes | Easy |

*Unofficial, no guarantees

---

## 🎯 Recommendations by Use Case

### For TakeStock App (JavaScript/Web):

#### **Best Overall: Alpha Vantage**
```javascript
// Easy to integrate
const API_KEY = 'YOUR_ALPHA_VANTAGE_KEY';
const symbol = 'AAPL';

// Get quote
fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
  .then(response => response.json())
  .then(data => console.log(data));

// Get historical
fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

**Why:** 
- ✅ Has everything we need
- ✅ Free tier includes historical data
- ✅ Simple API structure
- ✅ No credit system to manage

#### **Alternative: IEX Cloud**
```javascript
// For real-time data
const TOKEN = 'YOUR_IEX_TOKEN';
const symbol = 'AAPL';

fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${TOKEN}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

**Why:**
- ✅ Actually real-time
- ✅ Better data quality
- ⚠️ Need to manage credits carefully

---

## 💡 Implementation Strategy

### Multi-API Approach (Recommended)
Use multiple APIs as fallbacks:

```javascript
async function fetchStockData(symbol) {
    // Try primary API (Alpha Vantage)
    try {
        return await fetchFromAlphaVantage(symbol);
    } catch (error) {
        console.warn('Alpha Vantage failed, trying IEX Cloud');
        
        // Fallback to IEX Cloud
        try {
            return await fetchFromIEX(symbol);
        } catch (error2) {
            console.warn('IEX Cloud failed, trying Finnhub');
            
            // Final fallback to Finnhub
            return await fetchFromFinnhub(symbol);
        }
    }
}
```

**Benefits:**
- ✅ Redundancy if one API is down
- ✅ Use free tiers of multiple services
- ✅ Better reliability
- ✅ Can choose best API per data type

---

## 🔧 Integration Difficulty

### Easy to Add (Similar to Finnhub):
1. **Alpha Vantage** - Almost identical structure
2. **Polygon.io** - Simple REST API
3. **Twelve Data** - Very similar to Alpha Vantage

### Medium Difficulty:
1. **IEX Cloud** - Credit system needs management
2. **Multiple APIs** - Need adapter layer

### Harder (Requires Backend):
1. **Yahoo Finance** - Python only, needs proxy server
2. **Web Scraping** - Complex, unreliable, legal issues

---

## 📝 Next Steps

### To Add Alpha Vantage Support:

1. **Get API Key:**
   - Visit: https://www.alphavantage.co/support/#api-key
   - Free, no credit card
   - Instant approval

2. **Update Settings:**
   - Add Alpha Vantage option to settings modal
   - Let users choose their preferred API

3. **Add Fetch Function:**
   - Create `fetchFromAlphaVantage(symbol)` function
   - Map response to our data format
   - Very similar to existing Finnhub code

4. **Update UI:**
   - Show which API is active
   - Display appropriate rate limit warnings

---

## 🎁 Bonus: Free Data Sources (No Code)

For users without API access:

- **Yahoo Finance** - finance.yahoo.com (free charts)
- **Google Finance** - google.com/finance (free quotes)
- **TradingView** - tradingview.com (free charts)
- **MarketWatch** - marketwatch.com (free data)
- **Investing.com** - investing.com (free everything)

---

## ⚖️ Legal Considerations

- ✅ All listed APIs allow free tier usage
- ✅ Most allow commercial use on free tier (check ToS)
- ⚠️ Yahoo Finance scraping is gray area
- ⚠️ Always read Terms of Service
- ⚠️ Don't exceed rate limits
- ⚠️ Don't resell the data

---

## 🏆 Final Recommendation

**For TakeStock, I recommend:**

1. **Primary: Alpha Vantage**
   - Best free tier for our needs
   - Includes historical data
   - Easy to integrate
   
2. **Backup: IEX Cloud**
   - For real-time quotes
   - Use sparingly to save credits
   
3. **Current: Keep Finnhub**
   - Works great if user has upgraded plan
   - Give users choice of API

**Implementation:** Add API provider selection in settings, let users use whatever key they have!
