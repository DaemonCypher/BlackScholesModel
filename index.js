function calculate() {
  // Retrieve input values
  const stockPrice = parseFloat(document.getElementById("stock-price").value);
  const strikePrice = parseFloat(document.getElementById("strike-price").value);
  const timeToMaturity = parseFloat(document.getElementById("time-to-maturity").value) / 365; // Convert days to years
  const riskFreeRate = parseFloat(document.getElementById("risk-free-rate").value) / 100;
  const dividendYield = parseFloat(document.getElementById("dividend-yield").value) / 100;
  const volatility = parseFloat(document.getElementById("volatility").value) / 100;

  if (!isNaN(stockPrice) && !isNaN(strikePrice) && !isNaN(timeToMaturity) && !isNaN(riskFreeRate) && !isNaN(dividendYield) && !isNaN(volatility)) {
    // Calculate d1 and d2
    let d1 = (Math.log(stockPrice / strikePrice) + ((riskFreeRate - dividendYield + ((volatility * volatility) / 2)) * timeToMaturity)) / (volatility * Math.sqrt(timeToMaturity));
    let d2 = d1 - volatility * Math.sqrt(timeToMaturity);

    // Calculate call option price using Black-Scholes formula
    let callPrice = (stockPrice * cumulativeDistributionFunction(d1)) - (strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cumulativeDistributionFunction(d2));
    //return callPrice;
    document.getElementById("call-option-price").textContent = `Call Option Price: $${callPrice.toFixed(2)}`;
  }
  else {
    // If any input value is NaN or empty, clear the result
    document.getElementById("call-option-price").textContent = "";
  }

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

document.getElementById("stock-price").addEventListener("input", calculate);
document.getElementById("strike-price").addEventListener("input", calculate);
document.getElementById("time-to-maturity").addEventListener("input", calculate);
document.getElementById("risk-free-rate").addEventListener("input", calculate);
document.getElementById("dividend-yield").addEventListener("input", calculate);
document.getElementById("volatility").addEventListener("input", calculate);

// Calculate initially if all fields have values
window.onload = function () {
    calculate();
};

