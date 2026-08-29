const portfolioLots = {
  ODINE: 1200,
  THYAO: 450,
  GUNDG: 2500,
  KTLEV: 900,
  PASEU: 700,
  AKBNK: 1500,
};

let stocks = Object.keys(portfolioLots).map(symbol => ({
  symbol, price: null, changePct: null, lot: portfolioLots[symbol]
}));

const funds = [
  {code:"PHE", name:"Pusula Portföy Hisse Senedi Fonu", holdings:[["ODINE","14.5%"],["PASEU","12.0%"],["GUNDG","10.2%"]]},
  {code:"Demo-2", name:"Hisse Senedi Fonu", holdings:[["THYAO","9.8%"],["AKBNK","8.7%"],["KCHOL","7.9%"]]},
  {code:"Demo-3", name:"Hisse Yoğun Fon", holdings:[["EREGL","9.4%"],["YKBNK","8.2%"],["ISCTR","7.6%"]]}
];

const tl = new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2});
const pct = n => n == null ? "—" : `${n > 0 ? "+" : n < 0 ? "-" : ""}%${Math.abs(n).toFixed(2).replace(".",",")}`;

function renderStocks(filter=""){
  const tbody = document.getElementById("stockTable");
  tbody.innerHTML = "";
  stocks
    .filter(s => s.symbol.toLowerCase().includes(filter.toLowerCase()))
    .forEach(s => {
      const tr = document.createElement("tr");
      const amount = s.price == null ? null : s.price*s.lot;
      tr.innerHTML = `
        <td class="ticker">${s.symbol}</td>
        <td>${s.price == null ? "—" : tl.format(s.price)}</td>
        <td class="${s.changePct == null ? "neutral" : s.changePct >= 0 ? "positive":"negative"}">${pct(s.changePct)}</td>
        <td>${s.lot.toLocaleString("tr-TR")}</td>
        <td>${amount == null ? "—" : tl.format(amount)}</td>`;
      tbody.appendChild(tr);
    });
}

function renderFunds(){
  const grid = document.getElementById("fundGrid");
  grid.innerHTML = funds.map(f => `
    <article class="fund-card">
      <h4>${f.code}</h4>
      <p>${f.name}</p>
      ${f.holdings.map(h => `<div class="holding"><span>${h[0]}</span><strong>${h[1]}</strong></div>`).join("")}
    </article>`).join("");
}

function updateStats(){
  const valid = stocks.filter(s => s.price != null && s.changePct != null);
  if (valid.length) {
    const sorted = [...valid].sort((a,b)=>b.changePct-a.changePct);
    document.getElementById("bestStock").textContent = sorted[0].symbol;
    document.getElementById("bestChange").textContent = pct(sorted[0].changePct);
    document.getElementById("bestChange").className = sorted[0].changePct >= 0 ? "positive" : "negative";
    document.getElementById("worstStock").textContent = sorted.at(-1).symbol;
    document.getElementById("worstChange").textContent = pct(sorted.at(-1).changePct);
    document.getElementById("worstChange").className = sorted.at(-1).changePct >= 0 ? "positive" : "negative";
  }

  const total = stocks.reduce((sum,s)=>sum+(s.price == null ? 0 : s.price*s.lot),0);
  document.getElementById("portfolioTotal").textContent = tl.format(total);
  document.getElementById("watchCount").textContent = `${stocks.length} hisse`;
}

async function loadLivePrices(){
  const status = document.getElementById("dataStatus");
  try {
    const response = await fetch(`/live-prices.json?t=${Date.now()}`, {cache:"no-store"});
    if (!response.ok) throw new Error("Veri dosyası okunamadı");
    const payload = await response.json();

    stocks = Object.keys(portfolioLots).map(symbol => {
      const d = payload.prices?.[symbol] || {};
      return {
        symbol,
        price: Number.isFinite(d.price) ? d.price : null,
        changePct: Number.isFinite(d.changePct) ? d.changePct : null,
        lot: portfolioLots[symbol],
      };
    });

    document.getElementById("lastUpdate").textContent =
      payload.updatedAt ? new Date(payload.updatedAt).toLocaleString("tr-TR") : "—";

    status.textContent = payload.ok ? "Veri güncel" : "Kısmi veri";
    renderStocks(document.getElementById("searchInput").value);
    updateStats();
  } catch (err) {
    status.textContent = "Veri alınamadı";
    console.error(err);
  }
}

document.getElementById("searchInput").addEventListener("input", e => renderStocks(e.target.value));
renderStocks();
renderFunds();
updateStats();
loadLivePrices();
setInterval(loadLivePrices, 60_000);
