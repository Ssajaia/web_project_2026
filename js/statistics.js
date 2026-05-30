import { dismissLoader, getStats, getScores } from "./utils.js";

const statTotalGames = document.getElementById("stat-total-games");
const statBestWpm = document.getElementById("stat-best-wpm");
const statAvgWpm = document.getElementById("stat-avg-wpm");
const statAvgAcc = document.getElementById("stat-avg-acc");
const statMpWins = document.getElementById("stat-mp-wins");
const statMpRaces = document.getElementById("stat-mp-races");
const statsEmpty = document.getElementById("stats-empty");
const statsContent = document.getElementById("stats-content");
const recentList = document.getElementById("recent-list");
const recentEmpty = document.getElementById("recent-empty");

function render() {
  const s = getStats();
  const scores = getScores();

  if (scores.length === 0 && s.totalGames === 0) {
    statsEmpty.hidden = false;
    statsContent.hidden = true;
    return;
  }
  statsEmpty.hidden = true;
  statsContent.hidden = false;

  const avgWpm = s.totalGames > 0 ? Math.round(s.totalWPM / s.totalGames) : 0;
  const avgAcc =
    s.totalGames > 0 ? Math.round(s.totalAccuracy / s.totalGames) : 0;

  statTotalGames.textContent = s.totalGames;
  statBestWpm.textContent = s.bestWPM || "-";
  statAvgWpm.textContent = s.totalGames > 0 ? avgWpm : "-";
  statAvgAcc.textContent = s.totalGames > 0 ? avgAcc : "-";
  statMpWins.textContent = s.mpWins;
  statMpRaces.textContent = s.mpRaces;

  const recent = scores
    .slice()
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 10);

  if (recent.length === 0) {
    recentEmpty.classList.remove("hidden");
    recentList.innerHTML = "";
    return;
  }
  recentEmpty.classList.add("hidden");
  recentList.innerHTML = "";

  recent.forEach((entry, i) => {
    const item = document.createElement("article");
    item.className = "recent-item";
    item.setAttribute("role", "listitem");
    item.innerHTML = `
      <span class="recent-item__mode">${escHtml(entry.mode)}</span>
      <span class="recent-item__wpm">${entry.wpm} <small style="color:var(--color-text-muted);font-size:0.7rem;">wpm</small></span>
      <span class="recent-item__acc">${entry.accuracy}%</span>
      <span class="recent-item__date">${escHtml(entry.date)}</span>
    `;
    if (entry.wpm === s.bestWPM && i === 0) {
      item.style.background = "rgba(240,240,240,0.02)";
    }
    recentList.appendChild(item);
  });
}


dismissLoader();
render();
