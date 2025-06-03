let upgradeData = {};

fetch('data/hq_levels.json')
  .then(response => response.json())
  .then(data => upgradeData = data)
  .catch(err => {
    document.getElementById('upgradeResult').innerHTML = 'Error loading upgrade data.';
    console.error('Failed to load JSON:', err);
  });

function formatNumber(num) {
  if (typeof num !== 'number') return num;
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'G';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(0) + 'M';
  return num.toLocaleString();
}

function showUpgradeData() {
  const level = document.getElementById("hqInput").value;
  const entries = upgradeData[level];
  const container = document.getElementById("upgradeResult");

  if (!entries) {
    container.innerHTML = `<strong>No data available for HQ level ${level}.</strong>`;
    return;
  }

  let html = `<h3>Requirements for HQ Level ${level}</h3>`;
  let hqUpgrade = null;

  entries.forEach(entry => {
    if (entry.Building === "HQ Upgrade") {
      hqUpgrade = entry;
    } else {
      html += `<div class="building-line">🏗️ ${entry.Building} ${entry.Level}: Food: ${formatNumber(entry.Food)}, Iron: ${formatNumber(entry.Iron)}, Gold: ${formatNumber(entry.Gold)}</div>`;
    }
  });

  if (hqUpgrade) {
    html += `<h4>🏛️ HQ Upgrade Resource Cost</h4>`;
    html += `<div class="building-line">HQ Upgrade ${hqUpgrade.Level}: Food: ${formatNumber(hqUpgrade.Food)}, Iron: ${formatNumber(hqUpgrade.Iron)}, Gold: ${formatNumber(hqUpgrade.Gold)}${hqUpgrade.Oil ? `, Oil: ${formatNumber(hqUpgrade.Oil)}` : ''}</div>`;

    if (hqUpgrade.HeroStats) {
      const hero = hqUpgrade.HeroStats;
      html += `<div class="building-line">🎖️ Hero Stats — Cap: ${hero.LevelCap}, HP: ${formatNumber(hero.HP)}, ATK: ${hero.Attack}, DEF: ${hero.Defense}</div>`;
    }
  }

  container.innerHTML = html;
}

// Load and populate progression chart
fetch('data/hq_levels_chart.json')
  .then(res => res.json())
  .then(data => {
    const levels = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const tableRows = ['<tr><th style="color:white;">HQ Level</th><th style="color:white;">Tech Center</th><th style="color:white;">Other Buildings</th></tr>'];

    levels.forEach(level => {
      const row = data[level];
      if (row) {
        const tech = row.techCenter || '-';
        const others = (row.otherBuildings || []).join('<br>') || '-';
        tableRows.push(`<tr><td style="color:white;">${level}</td><td style="color:white;">${tech}</td><td style="color:white;">${others}</td></tr>`);
      }
    });

    const table = `<table border="1" style="width:100%; text-align:center; color:white; border-collapse:collapse;">${tableRows.join('')}</table>`;
    document.getElementById('progressionTable').innerHTML = table;
  })
  .catch(err => {
    console.error('Error loading HQ chart data:', err);
    document.getElementById('progressionTable').innerHTML = '<p style="color:red;">Failed to load progression chart.</p>';
  });
window.showUpgradeData = showUpgradeData;
