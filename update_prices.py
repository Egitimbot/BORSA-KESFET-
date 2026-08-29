#!/usr/bin/env python3
import json
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path
import time

ROOT = Path(__file__).resolve().parent
symbols = json.loads((ROOT / "stocks.json").read_text(encoding="utf-8"))["symbols"]

prices = {}
errors = {}

for symbol in symbols:
    yahoo_symbol = f"{symbol}.IS"
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(yahoo_symbol)}?interval=1m&range=1d"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; BorsaKesfeti/1.0)",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            payload = json.load(response)

        result = payload["chart"]["result"][0]
        meta = result.get("meta", {})

        price = meta.get("regularMarketPrice")
        prev = meta.get("chartPreviousClose") or meta.get("previousClose")
        market_time = meta.get("regularMarketTime")

        change_pct = None
        if isinstance(price, (int, float)) and isinstance(prev, (int, float)) and prev != 0:
            change_pct = (price - prev) / prev * 100

        prices[symbol] = {
            "price": round(float(price), 4) if isinstance(price, (int, float)) else None,
            "previousClose": round(float(prev), 4) if isinstance(prev, (int, float)) else None,
            "changePct": round(float(change_pct), 4) if change_pct is not None else None,
            "currency": meta.get("currency", "TRY"),
            "marketTime": datetime.fromtimestamp(market_time, timezone.utc).isoformat() if market_time else None,
        }
    except Exception as exc:
        errors[symbol] = str(exc)

    time.sleep(0.35)

out = {
    "ok": len(prices) > 0 and len(errors) == 0,
    "updatedAt": datetime.now(timezone.utc).isoformat(),
    "source": "Yahoo Finance",
    "prices": prices,
    "errors": errors,
}

(ROOT / "live-prices.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(json.dumps(out, ensure_ascii=False, indent=2))
