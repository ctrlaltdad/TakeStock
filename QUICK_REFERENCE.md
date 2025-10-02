# TakeStock - Quick Reference Card

## 🚀 5-Minute Quick Start

### Get API Keys (Pick One or More)
1. **Finnhub** (required for prices): https://finnhub.io/register
2. **Alpha Vantage** (for charts): https://www.alphavantage.co/support/#api-key
3. **Polygon** (backup charts): https://polygon.io/dashboard/signup

### Configure App
1. Open `index.html` in browser
2. Click ⚙️ Settings
3. Paste API key(s)
4. Click Save

### Test It
Search: `AAPL` or `PEP` or `TSLA`

---

## 📊 API Quick Reference

| What You Need | Use These APIs | Free Limits |
|---------------|---------------|-------------|
| Current prices only | Finnhub | 60 calls/min |
| Everything (with charts) | Finnhub + Alpha Vantage | 60/min + 25/day |
| Maximum reliability | All three | Automatic fallback |

---

## 🎯 What Works With What

### ✅ Finnhub Only
- Current price ✓
- Company info ✓
- Historical chart ✗

### ✅ Finnhub + Alpha Vantage
- Current price ✓
- Company info ✓
- Historical chart ✓

### ✅ All Three APIs
- Current price ✓
- Company info ✓
- Historical chart ✓
- Automatic backup ✓

---

## ⚡ Common Commands

### Save API Keys (Browser Console)
```javascript
// Save Finnhub key
localStorage.setItem('finnhub_api_key', 'YOUR_KEY_HERE');

// Save Alpha Vantage key
localStorage.setItem('alphavantage_api_key', 'YOUR_KEY_HERE');

// Save Polygon key
localStorage.setItem('polygon_api_key', 'YOUR_KEY_HERE');

// Reload page
location.reload();
```

### Check Saved Keys (Browser Console)
```javascript
console.log('Finnhub:', localStorage.getItem('finnhub_api_key') ? '✓ Configured' : '✗ Missing');
console.log('Alpha Vantage:', localStorage.getItem('alphavantage_api_key') ? '✓ Configured' : '✗ Missing');
console.log('Polygon:', localStorage.getItem('polygon_api_key') ? '✓ Configured' : '✗ Missing');
```

### Clear All Keys (Browser Console)
```javascript
localStorage.removeItem('finnhub_api_key');
localStorage.removeItem('alphavantage_api_key');
localStorage.removeItem('polygon_api_key');
location.reload();
```

---

## 🐛 Quick Troubleshooting

### "No API keys configured"
→ Click Settings, add at least Finnhub key

### "Invalid stock symbol"
→ Check ticker symbol (AAPL not Apple)

### "Rate limit exceeded"
→ Wait 1 minute (Finnhub) or 24 hours (Alpha Vantage)

### Chart not showing
→ Add Alpha Vantage or Polygon key

### Data looks wrong
→ Check status message to see which API provided data

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Project overview |
| **SETUP_GUIDE.md** | Step-by-step setup (3 options) |
| **MULTI_API_GUIDE.md** | Technical API details |
| **TESTING_GUIDE.md** | Testing procedures |
| **API_ALTERNATIVES.md** | API comparison |
| **DATA_INTEGRITY_POLICY.md** | Real data commitment |
| **IMPLEMENTATION_SUMMARY.md** | Developer handoff |
| **QUICK_REFERENCE.md** | This file |

---

## 🔍 Example Stock Symbols

| Symbol | Company | Sector | Good For Testing |
|--------|---------|--------|------------------|
| PEP | PepsiCo | Consumer Defensive | Business levers |
| AAPL | Apple | Technology | General testing |
| TSLA | Tesla | Auto | High volatility |
| MSFT | Microsoft | Technology | Stable stock |
| JPM | JPMorgan | Financial | Banking sector |
| JNJ | Johnson & Johnson | Healthcare | Healthcare analysis |
| XOM | Exxon | Energy | Commodity exposure |

---

## ⚙️ Settings Modal Layout

```
┌─────────────────────────────────────┐
│         TakeStock Settings          │
├─────────────────────────────────────┤
│ Multi-API Strategy Info Box        │
├─────────────────────────────────────┤
│ Finnhub API Key (Required)         │
│ [____________________________]      │
│ For: Real-time quotes               │
├─────────────────────────────────────┤
│ Alpha Vantage API Key               │
│ [____________________________]      │
│ For: Historical charts              │
├─────────────────────────────────────┤
│ Polygon.io API Key                  │
│ [____________________________]      │
│ For: Backup historical data         │
├─────────────────────────────────────┤
│  [Save API Keys]  [Clear All Keys]  │
└─────────────────────────────────────┘
```

---

## 💡 Pro Tips

### Maximize Free Tier
- Use Alpha Vantage first (higher daily limit)
- Add Polygon as backup for heavy usage
- Search one stock, then use business levers (no extra calls)

### Smart Usage Pattern
1. Morning: Check 10-15 stocks (Alpha Vantage)
2. Afternoon: Check another 10 stocks
3. Heavy usage: Polygon takes over automatically

### Rate Limit Strategy
- Finnhub: 60/min = one stock every second (plenty fast)
- Alpha Vantage: 25/day = spread throughout day
- Polygon: 5/min = one stock every 12 seconds

---

## 📱 Browser Support

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| IE 11 | N/A | ❌ Not supported |

---

## 🔒 Data Privacy

✅ All API keys stored locally (localStorage)  
✅ No keys sent to any server except APIs  
✅ No user data collected or stored  
✅ No cookies or tracking  
✅ 100% client-side application

---

## 📞 Getting Help

1. **Can't get API key?** → Check API provider's support page
2. **API not working?** → Check browser console (F12)
3. **Chart not showing?** → Verify historical API key configured
4. **Rate limited?** → Check MULTI_API_GUIDE.md for limits
5. **Data inaccurate?** → App shows real data only, check API status
6. **Something broken?** → See TESTING_GUIDE.md for debugging

---

## ⚖️ Legal

**Disclaimer**: This app is for educational purposes only. Not financial advice.

**API Terms**: Users must comply with:
- Finnhub ToS
- Alpha Vantage ToS  
- Polygon ToS

**Data Sources**: All data from APIs, attribution shown in UI.

---

## 🎓 Learning Resources

- **Finnhub Docs**: https://finnhub.io/docs/api
- **Alpha Vantage Docs**: https://www.alphavantage.co/documentation/
- **Polygon Docs**: https://polygon.io/docs

---

## 📊 Status Indicators

### Status Bar Messages

```
⚠️ Configure API keys in Settings
→ No keys configured

✓ Active APIs: Finnhub (quotes)
→ Finnhub only

✓ Active APIs: Finnhub (quotes), Alpha Vantage (historical)
→ Full setup

✓ Active APIs: Finnhub (quotes), Alpha Vantage (historical), Polygon (historical)
→ Maximum reliability
```

### Data Source Messages

```
✓ Data from: Finnhub (real-time quote), Alpha Vantage (90-day history)
→ Normal operation

✓ Data from: Finnhub (real-time quote), Polygon (90-day history)
→ Fallback to Polygon

⚠️ Current price from Finnhub • Historical data not available
→ Missing historical API
```

---

## 🚦 Quick Health Check

Run this in browser console after loading a stock:

```javascript
console.log('Current Stock:', currentStock ? '✓' : '✗');
console.log('Quote Data:', currentStock?.quote ? '✓' : '✗');
console.log('Company Info:', currentStock?.overview ? '✓' : '✗');
console.log('Historical Data:', currentStock?.historicalAvailable ? '✓' : '✗');
console.log('Data Sources:', currentStock?.dataSources);
```

Expected output:
```
Current Stock: ✓
Quote Data: ✓
Company Info: ✓
Historical Data: ✓
Data Sources: {quote: "Finnhub", profile: "Finnhub", historical: "Alpha Vantage"}
```

---

**Version**: 2.0 (Multi-API)  
**Last Updated**: January 2025  
**Print this card for quick reference!**
