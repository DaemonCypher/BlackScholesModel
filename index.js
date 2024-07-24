const stockPriceInput = document.getElementById("stock-price");
const strikePriceInput = document.getElementById("strike-price");
const timeToMaturityInput = document.getElementById("time-to-maturity");
const riskFreeRateInput = document.getElementById("risk-free-rate");
const dividendYieldInput = document.getElementById("dividend-yield");
const volatilityInput = document.getElementById("volatility");
const graphContainer = document.getElementById("graph-container");

function calculate() {
    const stockPrice = parseFloat(stockPriceInput.value);
    const strikePrice = parseFloat(strikePriceInput.value);
    const timeToMaturity = parseFloat(timeToMaturityInput.value) / 365; // Convert days to years
    const riskFreeRate = parseFloat(riskFreeRateInput.value) / 100;
    const dividendYield = parseFloat(dividendYieldInput.value) / 100;
    const volatility = parseFloat(volatilityInput.value) / 100;

    if (!isNaN(stockPrice) && !isNaN(strikePrice) && !isNaN(timeToMaturity) && !isNaN(riskFreeRate) && !isNaN(dividendYield) && !isNaN(volatility)) {
        const d1 = calcD1(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility);
        const d2 = calcD2(d1, volatility, timeToMaturity);
        displayCallOptionPrice(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility, d1, d2);
        displayPutOptionPrice(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility, d1, d2);
        graphContainer.style.display = "block"; // Show the graph container
        plotGraph(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility);
    } else {
        // If any input value is NaN or empty, clear the result and hide the graph
        document.getElementById("put-option-price").textContent = "";
        document.getElementById("call-option-price").textContent = "";
        graphContainer.style.display = "none";
    }
}

function calcD1(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility) {
    return (Math.log(stockPrice / strikePrice) + (riskFreeRate - dividendYield + (volatility * volatility) / 2) * timeToMaturity) / (volatility * Math.sqrt(timeToMaturity));
}

function calcD2(d1, volatility, timeToMaturity) {
    return d1 - volatility * Math.sqrt(timeToMaturity);
}

function displayPutOptionPrice(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility, d1, d2) {
    const putPrice = (strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cumulativeDistributionFunction(-d2)) - (stockPrice * Math.exp(-dividendYield * timeToMaturity) * cumulativeDistributionFunction(-d1));
    document.getElementById("put-option-price").textContent = `Put Option Price: $${putPrice.toFixed(2)}`;
}

function displayCallOptionPrice(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility, d1, d2) {
    const callPrice = (stockPrice * cumulativeDistributionFunction(d1)) - (strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cumulativeDistributionFunction(d2));
    document.getElementById("call-option-price").textContent = `Call Option Price: $${callPrice.toFixed(2)}`;
}

function cumulativeDistributionFunction(x) {
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;

    var sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x) / Math.sqrt(2.0);

    var t = 1.0 / (1.0 + p * x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
}

stockPriceInput.addEventListener("input", calculate);
strikePriceInput.addEventListener("input", calculate);
timeToMaturityInput.addEventListener("input", calculate);
riskFreeRateInput.addEventListener("input", calculate);
dividendYieldInput.addEventListener("input", calculate);
volatilityInput.addEventListener("input", calculate);

window.onload = function () {
    calculate();
};

function updateTable(id, value) {
    document.getElementById(id).value = value;
}

function calculateCallPrice(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility) {
    const d1 = calcD1(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility);
    const d2 = calcD2(d1, volatility, timeToMaturity);
    return (stockPrice * cumulativeDistributionFunction(d1)) - (strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cumulativeDistributionFunction(d2));
}

function plotGraph(stockPrice, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility) {
    const stockPriceFrom = parseFloat(document.getElementById("table-stock-price-from").value);
    const stockPriceTo = parseFloat(document.getElementById("table-stock-price-to").value);

    const xValues = [];
    const yValues = [];

    for (let x = stockPriceFrom; x <= stockPriceTo; x += 0.1) {
        xValues.push(x);
        const callPrice = calculateCallPrice(x, strikePrice, timeToMaturity, riskFreeRate, dividendYield, volatility);
        yValues.push(callPrice);
    }

    // Display using Plotly
    const data = [{ x: xValues, y: yValues, mode: "lines" }];
    const layout = { title: "Call Option Price vs Stock Price", height: 400, width: 800 }; // Adjust the layout dimensions as needed
    Plotly.newPlot("option-chart", data, layout);
}
