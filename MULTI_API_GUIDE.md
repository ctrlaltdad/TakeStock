# Multi-API Integration Guide

## Overview

TakeStock uses a **multi-API orchestration strategy** to provide complete stock data while staying within free tier API limitations. Each API serves a specific purpose:

| API | Purpose | Free Tier Limit | What It Provides |
|-----|---------|----------------|------------------|
| **Finnhub** | Real-time quotes | 60 calls/minute | Current prices, company profiles |
| **Alpha Vantage** | Historical data | 25-500 calls/day | 90-day price history |
| **Polygon.io** | Historical backup | 5 calls/minute | 90-day history (15-min delay) |

## How It Works

### Data Fetching Flow

1. **Real-time Data (Step 1)**
   - Fetch from **Finnhub** first
   - Gets: Current price, daily high/low, company name, sector, description
   - Required: Yes (app needs at least current price)

2. **Historical Data (Steps 2-3)**
   - Try **Alpha Vantage** first (higher daily limit)
   - If unavailable, try **Polygon.io** as backup
   - Gets: 90 days of OHLC (Open, High, Low, Close) data for charts
   - Required: No (app works without historical data)

3. **Data Conversion (Step 4)**
   - Unify data from different APIs into consistent format
   - Track which API provided which data
   - Display source attribution to user

### API Integration Details

#### Finnhub Integration
```javascript
// Endpoint: /api/v1/stock/profile2
// Returns: Company name, sector, industry, market cap, description

// Endpoint: /api/v1/quote
// Returns: Current price, open, high, low, previous close
```

**Error Handling**:
- 401: Invalid API key
- 429: Rate limit exceeded (60 calls/minute)
- Empty response: Invalid stock symbol

#### Alpha Vantage Integration
```javascript
// Endpoint: /query?function=TIME_SERIES_DAILY
// Returns: Daily OHLC data for last 100 trading days

// Data format:
{
  "Time Series (Daily)": {
    "2024-01-15": {
      "1. open": "150.25",
      "2. high": "152.30",
      "3. low": "149.80",
      "4. close": "151.50",
      "5. volume": "10000000"
    }
  }
}
```

**Error Handling**:
- `Note` field: Rate limit reached (25 calls/day free, 500 with registration)
- `Error Message` field: Invalid symbol or API error
- Empty time series: No data available

#### Polygon Integration
```javascript
// Endpoint: /v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}
// Returns: Daily aggregates (candles) for date range

// Data format:
{
  "results": [
    {
      "t": 1705363200000,  // Unix timestamp
      "o": 150.25,         // Open
      "h": 152.30,         // High
      "l": 149.80,         // Low
      "c": 151.50,         // Close
      "v": 10000000        // Volume
    }
  ]
}
```

**Error Handling**:
- `status: "ERROR"`: API error or invalid request
- Empty results: No data for symbol/date range
- Note: Free tier data has 15-minute delay

## Configuration Examples

### Scenario 1: Finnhub Only
**Setup**: Just Finnhub API key  
**What Works**: Current prices, company info  
**What's Missing**: Historical charts  
**Use Case**: Quick price checks, no chart analysis needed

### Scenario 2: Finnhub + Alpha Vantage (Recommended)
**Setup**: Finnhub + Alpha Vantage keys  
**What Works**: Everything (current prices + historical charts)  
**Limitations**: 25 chart requests/day (or 500 with registration)  
**Use Case**: Full analysis with chart visualization

### Scenario 3: All Three APIs (Maximum Reliability)
**Setup**: Finnhub + Alpha Vantage + Polygon keys  
**What Works**: Everything with backup  
**Benefits**: If Alpha Vantage rate limited, Polygon takes over  
**Use Case**: Heavy usage, need maximum uptime

## API Comparison

### Alpha Vantage vs Polygon for Historical Data

| Feature | Alpha Vantage | Polygon |
|---------|--------------|---------|
| Free Tier Limit | 25-500 calls/day | 5 calls/minute |
| Data Delay | Real-time | 15 minutes |
| Historical Range | 100 days | 2 years (free tier) |
| Data Quality | Adjusted | Adjusted |
| Best For | Light-medium usage | High-frequency usage |

**Recommendation**: Use Alpha Vantage as primary (better free tier limits), Polygon as backup.

## Cost Analysis (Free Tier)

### Daily Usage Calculation

**Typical User (10 stock lookups/day)**:
- Finnhub: 10 calls (quotes) + 10 calls (profiles) = 20 calls
- Alpha Vantage: 10 calls (historical)
- **Total Cost**: $0 (well within free limits)

**Power User (100 stock lookups/day)**:
- Finnhub: 100 calls (quotes) + 100 calls (profiles) = 200 calls
- Alpha Vantage: 100 calls (historical) → EXCEEDS free tier
- Polygon backup: Takes over when AV limit hit
- **Total Cost**: $0 (with Polygon backup)

**Heavy User (500 stock lookups/day)**:
- Finnhub: 500 calls → EXCEEDS free tier (60/min = ~3,600/hour max)
- Need to throttle requests or upgrade
- **Recommendation**: Implement request queuing or upgrade to paid plan

## Error Messages Explained

### "No API keys configured"
**Meaning**: No API keys found in localStorage  
**Solution**: Click Settings → Enter at least Finnhub key → Save

### "Unable to fetch stock data"
**Meaning**: Finnhub request failed (no valid quote/profile)  
**Solution**: Check API key validity, verify stock symbol exists

### "Alpha Vantage rate limit reached"
**Meaning**: Exceeded 25 calls/day (or 500 with registration)  
**Solution**: Wait until tomorrow, or app will try Polygon automatically

### "No historical data available"
**Meaning**: Neither Alpha Vantage nor Polygon returned historical data  
**Solution**: Check those API keys, or accept current-price-only view

### "Historical data not available (configure Alpha Vantage or Polygon)"
**Meaning**: Only Finnhub key configured, can't fetch historical  
**Solution**: Add Alpha Vantage or Polygon key for charts

## Data Source Transparency

The app always shows which API provided which data:

```
✓ Data from: Finnhub (real-time quote), Alpha Vantage (90-day history)
```

This ensures you know:
1. Where your data came from
2. Whether you're seeing real-time or delayed data
3. Which APIs are working correctly

## Development Notes

### Adding New APIs

To add another financial API:

1. Create fetch function (e.g., `fetchHistoricalFromNewAPI()`)
2. Parse response to standard format: `{date, open, high, low, close, volume}`
3. Add to fallback chain in `fetchStockData()`
4. Update `dataSources` tracking object
5. Add UI section in settings modal

### Testing Multi-API Logic

```javascript
// Test with only Finnhub
localStorage.setItem('finnhub_api_key', 'your_key');
localStorage.removeItem('alphavantage_api_key');
localStorage.removeItem('polygon_api_key');

// Test with Alpha Vantage fallback
localStorage.setItem('alphavantage_api_key', 'invalid_key'); // Forces error
localStorage.setItem('polygon_api_key', 'your_polygon_key'); // Should take over

// Test with all APIs
localStorage.setItem('finnhub_api_key', 'your_finnhub_key');
localStorage.setItem('alphavantage_api_key', 'your_av_key');
localStorage.setItem('polygon_api_key', 'your_polygon_key');
```

## Troubleshooting

### Chart Not Appearing
1. Check: Do you have Alpha Vantage or Polygon key configured?
2. Check browser console for API errors
3. Verify stock symbol is valid and has historical data
4. Check if you've hit rate limits (wait 24 hours)

### "Invalid stock symbol" Error
1. Verify symbol is correct (e.g., "AAPL" not "Apple")
2. Try on multiple APIs (some symbols only on certain exchanges)
3. Check if symbol is delisted or suspended

### Rate Limiting Issues
1. Finnhub: Wait 1 minute between large batches
2. Alpha Vantage: Space requests throughout day, or get free registration for 500/day
3. Polygon: Slow down to 5 calls/minute or less

## Future Enhancements

Potential improvements to multi-API system:

1. **Request Caching**: Store responses in localStorage with timestamps
2. **Smart Fallback**: Track API health, prefer faster/more reliable APIs
3. **Rate Limit Tracking**: Count requests, warn before hitting limits
4. **Batch Requests**: Queue multiple symbol lookups
5. **WebSocket Streaming**: Use Finnhub WebSocket for real-time updates
6. **More APIs**: IEX Cloud, Twelve Data, Financial Modeling Prep

## References

- [Finnhub API Documentation](https://finnhub.io/docs/api)
- [Alpha Vantage API Documentation](https://www.alphavantage.co/documentation/)
- [Polygon.io API Documentation](https://polygon.io/docs)
- [API_ALTERNATIVES.md](./API_ALTERNATIVES.md) - Detailed API comparison
