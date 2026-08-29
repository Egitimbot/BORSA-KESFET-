const stocks = [
  {symbol:"ODINE", price:125.40, change:3.20, lot:1200},
  {symbol:"THYAO", price:342.50, change:-0.80, lot:450},
  {symbol:"GUNDG", price:58.20, change:5.10, lot:2500},
  {symbol:"KTLEV", price:71.35, change:1.75, lot:900},
  {symbol:"PASEU", price:87.10, change:-1.15, lot:700},
  {symbol:"AKBNK", price:69.80, change:0.45, lot:1500},
];

const funds = [
  {code:"PHE", name:"Pusula Portföy Hisse Senedi Fonu", holdings:[["ODINE","14.5%"],["PASEU","12.0%"],["GUNDG","10.2%"]]},
  {code:"Demo-2", name:"Hisse Senedi Fonu", holdings:[["THYAO","9.8%"],["AKBNK","8.7%"],["KCHOL","7.9%"]]},
  {code:"Demo-3", name:"Hisse Yoğun Fon", holdings:[["EREGL","9.4%"],["YKBNK","8.2%"],["ISCTR","7.6%"]]}
];

const tl = new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2});
const pct = n => `${n > 0 ? "+" : ""}%${Math.abs(n).toFixed(2).replace(".",",")}`;

function renderStocks(filter=""){
  const tbody = document.getElementById("stockTable");
  tbody.innerHTML = "";
  stocks
    .filter(s => s.symbol.toLowerCase().includes(filter.toLowerCase()))
    .forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="ticker">${s.symbol}</td>
        <td>${tl.format(s.price)}</td>
        <td class="${s.change >= 0 ? "positive":"negative"}">${pct(s.change)}</td>
        <td>${s.lot.toLocaleString("tr-TR")}</td>
        <td>${tl.format(s.price*s.lot)}</td>`;
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
  const sorted = [...stocks].sort((a,b)=>b.change-a.change);
  document.getElementById("bestStock").textContent = sorted[0].symbol;
  document.getElementById("bestChange").textContent = pct(sorted[0].change);
  document.getElementById("bestChange").className = "positive";
  document.getElementById("worstStock").textContent = sorted.at(-1).symbol;
  document.getElementById("worstChange").textContent = pct(sorted.at(-1).change);
  document.getElementById("worstChange").className = "negative";

  const total = stocks.reduce((sum,s)=>sum+s.price*s.lot,0);
  document.getElementById("portfolioTotal").textContent = tl.format(total);
  document.getElementById("watchCount").textContent = `${stocks.length} hisse`;
  document.getElementById("lastUpdate").textContent = new Date().toLocaleString("tr-TR");
}

document.getElementById("searchInput").addEventListener("input", e => renderStocks(e.target.value));
renderStocks();
renderFunds();
updateStats();
