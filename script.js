// ================= API CONFIG =================
const API_KEY = "Q8PMdjsceV0ib5WPgpBb5oU6NZMprO8y";

// ================= NAVBAR =================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// ================= DOM ELEMENTS =================
const form = document.getElementById("predictForm");
const loading = document.getElementById("loading");
const card = document.getElementById("predictionResult");

const resultSymbol = document.getElementById("resultSymbol");
const currentPriceEl = document.getElementById("currentPrice");
const predictedPriceEl = document.getElementById("predictedPrice");
const expectedChangeEl = document.getElementById("expectedChange");
const confidenceBar = document.getElementById("confidenceBar");

// ================= FETCH LIVE PRICE =================
async function fetchStockPrice(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
    throw new Error("Invalid symbol or API limit reached");
  }

  return parseFloat(data["Global Quote"]["05. price"]);
}

// ================= CHART =================
const ctx = document.getElementById("historicalChart").getContext("2d");
let chart;

function drawChart() {
  const labels = [];
  const prices = [];

  for (let i = 30; i >= 1; i--) {
    labels.push(`Day ${i}`);
    prices.push((Math.random() * 200 + 100).toFixed(2));
  }

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Price ($)",
        data: prices,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76,175,80,0.2)",
        tension: 0.3
      }]
    }
  });
}

// ================= FORM SUBMIT =================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const symbol = document.getElementById("symbol").value.trim().toUpperCase();

  if (!symbol) {
    alert("Please enter stock symbol");
    return;
  }

  loading.style.display = "block";
  card.classList.add("hidden");

  try {
    const currentPrice = await fetchStockPrice(symbol);

    // Demo prediction logic
    const changePercent = (Math.random() * 6 - 3).toFixed(2);
    const predictedPrice = (
      currentPrice * (1 + changePercent / 100)
    ).toFixed(2);

    resultSymbol.innerText = symbol;
    currentPriceEl.innerText = currentPrice;
    predictedPriceEl.innerText = predictedPrice;
    expectedChangeEl.innerText = changePercent + "%";
    expectedChangeEl.style.color =
      changePercent >= 0 ? "lightgreen" : "red";

    confidenceBar.style.width =
      Math.floor(Math.random() * 30 + 70) + "%";

    drawChart();
    card.classList.remove("hidden");

  } catch (error) {
    alert(error.message);
  } finally {
    loading.style.display = "none";
  }
});

// ================= INITIAL CHART =================
drawChart();
