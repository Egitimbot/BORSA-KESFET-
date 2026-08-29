# Borsa Keşfeti - Otomatik BIST Fiyat Sürümü

Bu sürüm GitHub Pages + GitHub Actions ile ücretsiz çalışır.

## Ne yapar?
- ODINE, THYAO, GUNDG, KTLEV, PASEU ve AKBNK fiyatlarını gecikmeli olarak alır.
- GitHub Actions hafta içi yaklaşık 15 dakikada bir fiyatları günceller.
- Site `data/live-prices.json` dosyasını okuyup tabloyu yeniler.
- API anahtarı gerekmez.

## GitHub'a yükleme
Mevcut repository'nin ana klasörüne şu dosya/klasörlerin tamamını yükle:
- index.html
- style.css
- app.js
- stocks.json
- data/
- scripts/
- .github/

Önemli: `.github/workflows/update-prices.yml` dosyasının yolu aynen korunmalı.

## İlk çalıştırma
GitHub repository > Actions > "BIST fiyatlarini guncelle" > Run workflow.
İlk işlem tamamlanınca `data/live-prices.json` gerçek fiyatlarla dolar.

## Yeni hisse ekleme
1. `stocks.json` içindeki symbols listesine kodu ekle.
2. `app.js` içindeki `portfolioLots` alanına aynı kod ve lot miktarını ekle.
3. Commit changes yap.

## Not
Yahoo Finance Borsa İstanbul kotasyonlarını `.IS` uzantısıyla gecikmeli olarak sunar.
Bu veri yatırım kararı için tek başına kullanılmamalıdır.
