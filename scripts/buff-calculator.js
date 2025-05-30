let buffedTimeInSeconds = 0;

function calculate() {
  const d = parseFloat(document.getElementById('days').value) || 0;
  const h = parseFloat(document.getElementById('hours').value) || 0;
  const m = parseFloat(document.getElementById('minutes').value) || 0;
  const s = parseFloat(document.getElementById('seconds').value) || 0;
  const buffPercent = parseFloat(document.getElementById('buffPercent').value) || 0;

  const totalBuffDecimal = buffPercent / 100;
  const baseSecs = (d * 86400) + (h * 3600) + (m * 60) + s;
  buffedTimeInSeconds = baseSecs / (1 + totalBuffDecimal);

  const bd = Math.floor(buffedTimeInSeconds / 86400);
  let rem = buffedTimeInSeconds % 86400;
  const bh = Math.floor(rem / 3600);
  rem %= 3600;
  const bm = Math.floor(rem / 60);
  const bs = Math.floor(rem % 60);

  document.getElementById('resultBox').innerHTML =
    `Buffed Time: ${bd}d ${bh}h ${bm}m ${bs}s`;
}

function calculateFinal() {
  const buffH = parseFloat(document.getElementById('buffSpeedHours').value) || 0;
  const buffM = parseFloat(document.getElementById('buffSpeedMinutes').value) || 0;
  const buffS = parseFloat(document.getElementById('buffSpeedSeconds').value) || 0;
  const totalBuffSecs = (buffH * 3600) + (buffM * 60) + buffS;

  const manualD = parseFloat(document.getElementById('manualDays').value) || 0;
  const manualH = parseFloat(document.getElementById('manualHours').value) || 0;
  const manualM = parseFloat(document.getElementById('manualMinutes').value) || 0;
  const totalManualSecs = (manualD * 86400) + (manualH * 3600) + (manualM * 60);

  const helps = parseFloat(document.getElementById('helps').value) || 0;
  const helpTime = parseFloat(document.getElementById('helpTime').value) || 7.5;
  const totalHelpSecs = helps * helpTime * 60;

  const totalReductionSecs = totalBuffSecs + totalManualSecs + totalHelpSecs;

  const finalSecs = Math.max(0, buffedTimeInSeconds - totalReductionSecs);

  const fd = Math.floor(finalSecs / 86400);
  let rem = finalSecs % 86400;
  const fh = Math.floor(rem / 3600);
  rem %= 3600;
  const fm = Math.floor(rem / 60);
  const fs = Math.floor(rem % 60);

  document.getElementById('finalResultBox').innerHTML =
    `Final Time: ${fd}d ${fh}h ${fm}m ${fs}s<br><br>` +
    `<u>Reduction Breakdown:</u><br>` +
    `Free Speed-up Buff: ${formatDuration(totalBuffSecs)}<br>` +
    `Instant Speed-ups Used: ${formatDuration(totalManualSecs)}<br>` +
    `Alliance Help Reduction: ${Math.floor(totalHelpSecs / 60)} minutes`;
}

function formatDuration(seconds) {
  const d = Math.floor(seconds / 86400);
  let rem = seconds % 86400;
  const h = Math.floor(rem / 3600);
  rem %= 3600;
  const m = Math.floor(rem / 60);
  const s = Math.floor(rem % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function resetForm() {
  [
    'days', 'hours', 'minutes', 'seconds', 'buffPercent',
    'buffSpeedHours', 'buffSpeedMinutes', 'buffSpeedSeconds',
    'manualDays', 'manualHours', 'manualMinutes',
    'helps', 'helpTime'
  ].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById('resultBox').innerHTML = "";
  document.getElementById('finalResultBox').innerHTML = "";
}

function getCurrentState() {
  return {
    secretaryUses: document.getElementById("secretaryUses")?.value || "",
    foodBuff: document.getElementById("foodBuff")?.value || "",
    ironBuff: document.getElementById("ironBuff")?.value || "",
    coinBuff: document.getElementById("coinBuff")?.value || "",
    food: getInputState("food"),
    iron: getInputState("iron"),
    coin: getInputState("coin")
  };
}

function getInputState(type) {
  const container = document.getElementById(type + "Inputs");
  if (!container) return [];
  const rows = container.querySelectorAll(".input-row");
  return Array.from(rows).map(row => ({
    qty: row.querySelector(".qty")?.value || "",
    level: row.querySelector(".level")?.value || ""
  }));
}

function applyState(state) {
  ["secretaryUses", "foodBuff", "ironBuff", "coinBuff"].forEach(id => {
    if (document.getElementById(id)) {
      document.getElementById(id).value = state[id] || "";
    }
  });

  ["food", "iron", "coin"].forEach(type => {
    const container = document.getElementById(type + "Inputs");
    if (!container) return;
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

function saveProgress() {
  const state = getCurrentState();
  localStorage.setItem("resourceCalcSave", JSON.stringify(state));
  alert("Progress saved locally!");
}

function loadProgress() {
  const state = JSON.parse(localStorage.getItem("resourceCalcSave") || "{}");
  applyState(state);
  alert("Progress loaded.");
}
