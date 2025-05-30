let outputByLevel = { food: {}, iron: {}, coin: {} };
let dataLoaded = false;

fetch('/data/rssdata.json')
  .then(res => res.json())
  .then(data => {
    outputByLevel.food = data.food;
    outputByLevel.iron = data.iron;
    outputByLevel.coin = data.gold;
    dataLoaded = true;
  })
  .catch(err => console.error('Failed to load level data:', err));

function formatNumber(n) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function addResourceRow(type) {
  const container = document.getElementById(type + "Inputs");
  const div = document.createElement("div");
  div.className = "input-row";
  div.innerHTML = `
    <input type="number" placeholder="Qty" class="qty">
    <input type="number" placeholder="Level (1–35)" class="level">
    <button class="remove-btn" onclick="this.parentNode.remove()">Remove</button>
  `;
  container.appendChild(div);
}

export function calculateAll() {
  if (!dataLoaded) {
    alert("Resource data is still loading. Please wait a moment.");
    return;
  }
  calculateResource("food");
  calculateResource("iron");
  calculateResource("coin");
}

function calculateResource(type) {
  const container = document.getElementById(type + "Inputs");
  const buff = parseFloat(document.getElementById(type + "Buff").value) || 0;
  const secretaryUses = parseFloat(document.getElementById("secretaryUses").value) || 0;
  let totalHourly = 0;

  container.querySelectorAll(".input-row").forEach(row => {
    const qty = parseInt(row.querySelector(".qty").value) || 0;
    const level = parseInt(row.querySelector(".level").value) || 0;
    const baseOutput = outputByLevel[type][level] || 0;
    totalHourly += qty * baseOutput;
  });

  const buffedHourly = totalHourly * (1 + buff / 100);
  const secBonus = buffedHourly * (5 / 60) * secretaryUses;
  const daily = buffedHourly * 24 + secBonus;
  const weekly = daily * 7;
  const monthly = daily * 30;

  document.getElementById(type + "Result").innerHTML = `
    Hourly: ${formatNumber(buffedHourly)}<br>
    Daily: ${formatNumber(daily)}<br>
    Weekly: ${formatNumber(weekly)}<br>
    Monthly: ${formatNumber(monthly)}<br>
    Secretary Bonus Daily: +${formatNumber(secBonus)}`;
}

export function resetForm() {
  ["food", "iron", "coin"].forEach(type => {
    document.getElementById(type + "Inputs").innerHTML = "";
    document.getElementById(type + "Result").innerHTML = "";
    document.getElementById(type + "Buff").value = "";
  });
  document.getElementById("secretaryUses").value = "";
}

export function saveProgress() {
  const state = getCurrentState();
  localStorage.setItem("resourceCalcSave", JSON.stringify(state));
  alert("Progress saved locally!");
}

export function loadProgress() {
  const state = JSON.parse(localStorage.getItem("resourceCalcSave") || "{}");
  applyState(state);
  alert("Progress loaded.");
}

function getCurrentState() {
  return {
    secretaryUses: document.getElementById("secretaryUses").value,
    foodBuff: document.getElementById("foodBuff").value,
    ironBuff: document.getElementById("ironBuff").value,
    coinBuff: document.getElementById("coinBuff").value,
    food: getInputState("food"),
    iron: getInputState("iron"),
    coin: getInputState("coin")
  };
}

function getInputState(type) {
  const container = document.getElementById(type + "Inputs");
  return Array.from(container.querySelectorAll(".input-row")).map(row => ({
    qty: row.querySelector(".qty").value,
    level: row.querySelector(".level").value
  }));
}

function applyState(state) {
  document.getElementById("secretaryUses").value = state.secretaryUses || "";
  document.getElementById("foodBuff").value = state.foodBuff || "";
  document.getElementById("ironBuff").value = state.ironBuff || "";
  document.getElementById("coinBuff").value = state.coinBuff || "";

  ["food", "iron", "coin"].forEach(type => {
    const container = document.getElementById(type + "Inputs");
    container.innerHTML = "";
    (state[type] || []).forEach(entry => {
      const div = document.createElement("div");
      div.className = "input-row";
      div.innerHTML = `
        <input type="number" placeholder="Qty" class="qty" value="${entry.qty || ''}">
        <input type="number" placeholder="Level (1–35)" class="level" value="${entry.level || ''}">
        <button class="remove-btn" onclick="this.parentNode.remove()">Remove</button>
      `;
      container.appendChild(div);
    });
  });
}
