# Testing Guide for Multi-API Integration

This guide helps you verify that the multi-API system is working correctly.

## Pre-Testing Checklist

1. ✅ Open `index.html` in a modern browser
2. ✅ Open browser Developer Tools (F12)
3. ✅ Navigate to the Console tab
4. ✅ Have at least one API key ready

## Test Scenarios

### Test 1: Finnhub Only (Current Price)

**Setup**:
```javascript
// In browser console:
localStorage.setItem('finnhub_api_key', 'YOUR_FINNHUB_KEY');
localStorage.removeItem('alphavantage_api_key');
localStorage.removeItem('polygon_api_key');
location.reload();
```

**Expected Behavior**:
1. Status bar shows: "✓ Active APIs: Finnhub (quotes)"
2. Search for "AAPL"
3. Should see:
   - ✅ Company name and description
   - ✅ Current price and daily stats
   - ❌ No historical chart (expected)
   - ⚠️ Warning: "Historical data not available (configure Alpha Vantage or Polygon API key)"

**Console Output**:
```
Fetching data for AAPL...
✓ Finnhub quote successful
✓ Finnhub profile successful
⚠ No historical data available
```

### Test 2: Finnhub + Alpha Vantage (Full Functionality)

**Setup**:
```javascript
// In browser console:
localStorage.setItem('finnhub_api_key', 'YOUR_FINNHUB_KEY');
localStorage.setItem('alphavantage_api_key', 'YOUR_AV_KEY');
localStorage.removeItem('polygon_api_key');
location.reload();
```

**Expected Behavior**:
1. Status bar shows: "✓ Active APIs: Finnhub (quotes), Alpha Vantage (historical)"
2. Search for "PEP"
3. Should see:
   - ✅ Company name and description
   - ✅ Current price and daily stats
   - ✅ 90-day historical price chart
   - ✅ Success message: "✓ Data from: Finnhub (real-time quote), Alpha Vantage (90-day history)"

**Console Output**:
```
Fetching data for PEP...
✓ Finnhub quote successful
✓ Finnhub profile successful
✓ Alpha Vantage historical successful (90 days)
✓ Chart rendered with 90 data points
```

### Test 3: Alpha Vantage Fallback to Polygon

**Setup**:
```javascript
// In browser console:
localStorage.setItem('finnhub_api_key', 'YOUR_FINNHUB_KEY');
localStorage.setItem('alphavantage_api_key', 'INVALID_KEY'); // Force failure
localStorage.setItem('polygon_api_key', 'YOUR_POLYGON_KEY');
location.reload();
```

**Expected Behavior**:
1. Search for "TSLA"
2. Should see:
   - ✅ Company info from Finnhub
   - ✅ Current price from Finnhub
   - ✅ Historical chart from Polygon (after Alpha Vantage fails)
   - ✅ Success message: "✓ Data from: Finnhub (real-time quote), Polygon (90-day history)"

**Console Output**:
```
Fetching data for TSLA...
✓ Finnhub quote successful
✓ Finnhub profile successful
⚠ Alpha Vantage historical fetch failed: Invalid API key
✓ Polygon historical successful (fallback)
✓ Chart rendered with Polygon data
```

### Test 4: All Three APIs (Maximum Reliability)

**Setup**:
```javascript
// In browser console:
localStorage.setItem('finnhub_api_key', 'YOUR_FINNHUB_KEY');
localStorage.setItem('alphavantage_api_key', 'YOUR_AV_KEY');
localStorage.setItem('polygon_api_key', 'YOUR_POLYGON_KEY');
location.reload();
```

**Expected Behavior**:
1. Search for "MSFT"
2. Should use Alpha Vantage for historical (primary)
3. Polygon remains as backup if Alpha Vantage fails

### Test 5: No API Keys

**Setup**:
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

**Expected Behavior**:
1. Status bar shows: "⚠️ Configure API keys in Settings to use real-time stock data"
2. Try to search for "AAPL"
3. Should see error: "Please configure at least one API key"

### Test 6: Invalid Stock Symbol

**Setup**: Use any valid API key configuration

**Test**:
1. Search for "INVALID123"
2. Expected error: "Invalid stock symbol" or "Unable to fetch stock data"
3. No data should be displayed

### Test 7: Rate Limiting

**Setup**: Make many rapid requests with Alpha Vantage

**Test**:
```javascript
// Search for 30 different symbols rapidly
const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', ...];
for (const symbol of symbols) {
    // Search manually or via script
}
```

**Expected Behavior**:
1. First 25 requests succeed with Alpha Vantage
2. After 25, Alpha Vantage returns rate limit error
3. App automatically falls back to Polygon
4. If Polygon also limited, see error message

## Manual UI Testing

### Settings Modal
1. Click "⚙️ Settings" button
2. Verify three sections visible:
   - Finnhub API Key
   - Alpha Vantage API Key
   - Polygon.io API Key
3. Each section should have:
   - Description
   - Link to get API key
   - Input field
   - Masked display of saved key (••••••••last4)

### Data Source Display
1. After successful search, check info/warning bar
2. Should show: "✓ Data from: [API names with data types]"
3. Verify it matches which APIs you configured

### Historical Chart
1. With historical API configured:
   - Chart should appear below current price
   - Hover over points to see tooltips
   - 90 data points (approximately)
2. Without historical API:
   - Chart section hidden
   - Warning message displayed

## API Response Validation

### Check Finnhub Quote Response
```javascript
// In console after search:
// Should see structure like:
{
  c: 151.50,  // current price
  h: 152.30,  // high
  l: 149.80,  // low
  o: 150.25,  // open
  pc: 150.00  // previous close
}
```

### Check Alpha Vantage Response
```javascript
// Should see structure like:
{
  "Time Series (Daily)": {
    "2024-01-15": {
      "1. open": "150.25",
      "2. high": "152.30",
      "3. low": "149.80",
      "4. close": "151.50",
      "5. volume": "10000000"
    },
    // ... 90+ days
  }
}
```

### Check Polygon Response
```javascript
// Should see structure like:
{
  "results": [
    {
      "t": 1705363200000,
      "o": 150.25,
      "h": 152.30,
      "l": 149.80,
      "c": 151.50,
      "v": 10000000
    },
    // ... 90+ days
  ]
}
```

## Debugging Tips

### Enable Detailed Logging
Add to top of `app.js`:
```javascript
const DEBUG = true;

function debugLog(message, data) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`, data);
    }
}
```

Then add throughout code:
```javascript
debugLog('Finnhub response:', profileData);
debugLog('Alpha Vantage response:', historicalData);
debugLog('Data sources:', dataSources);
```

### Common Issues

**Issue**: "CORS error" in console  
**Cause**: Running from file:// instead of http://  
**Fix**: Use local server (python -m http.server)

**Issue**: Chart not appearing  
**Cause**: No historical API configured or API error  
**Fix**: Check console for API errors, verify keys

**Issue**: Data sources message wrong  
**Cause**: `dataSources` object not updating correctly  
**Fix**: Check `convertMultiApiData()` function

**Issue**: API working in Postman but not in app  
**Cause**: API key not being sent correctly  
**Fix**: Check localStorage values, verify key format

## Success Criteria

✅ **Test 1 Passes**: Current price displays without historical API  
✅ **Test 2 Passes**: Full functionality with Finnhub + Alpha Vantage  
✅ **Test 3 Passes**: Fallback from Alpha Vantage to Polygon works  
✅ **Test 4 Passes**: All APIs integrate correctly  
✅ **Test 5 Passes**: Clear error when no keys configured  
✅ **Test 6 Passes**: Invalid symbols handled gracefully  
✅ **Test 7 Passes**: Rate limiting triggers fallback  

## Performance Benchmarks

**Target Response Times**:
- Finnhub quote: < 500ms
- Alpha Vantage historical: < 1s
- Polygon historical: < 1s
- Total page load: < 2s

**Measure in Console**:
```javascript
console.time('Stock Fetch');
// ... make request ...
console.timeEnd('Stock Fetch');
```

## Reporting Bugs

If you encounter issues, please report with:
1. Which test scenario failed
2. Browser and version
3. API keys used (do NOT share actual keys, just which ones)
4. Full console output
5. Screenshot of error message
6. Network tab showing failed requests

## Next Steps After Testing

Once all tests pass:
1. ✅ Document any API-specific quirks
2. ✅ Update error messages if needed
3. ✅ Consider adding request caching
4. ✅ Implement rate limit tracking
5. ✅ Add loading states for slow APIs
