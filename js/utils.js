export async function loadSentence() {
  const res = await fetch("sentences.json");
  const list = await res.json();
  return list[Math.floor(Math.random() * list.length)];
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function calcWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  return Math.round(correctChars / 5 / (elapsedSeconds / 60));
}

export function calcAccuracy(totalChars, errors) {
  if (totalChars === 0) return "100%";
  const acc = Math.max(
    0,
    Math.round(((totalChars - errors) / totalChars) * 100),
  );
  return `${acc}%`;
}

export function showToast(message, duration = 2800) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

export function dismissLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.classList.add("loader--done");
  setTimeout(() => loader.remove(), 500);
}

export function renderText(paragraph, text) {
  paragraph.innerHTML = "";
  for (const ch of text) {
    const span = document.createElement("span");
    span.className = "char" + (ch === " " ? " char--space" : "");
    span.textContent = ch;
    paragraph.appendChild(span);
  }
}

export function updateChars(paragraph, typed, target) {
  const spans = paragraph.querySelectorAll(".char");
  spans.forEach((span, i) => {
    span.classList.remove("char--correct", "char--error", "char--active");
    if (i < typed.length) {
      span.classList.add(
        typed[i] === target[i] ? "char--correct" : "char--error",
      );
    } else if (i === typed.length) {
      span.classList.add("char--active");
    }
  });
}

const LS_SCORES = "sharpen_scores";
const LS_STATS = "sharpen_stats";

export function getScores() {
  try {
    return JSON.parse(localStorage.getItem(LS_SCORES)) || [];
  } catch {
    return [];
  }
}

export function saveScore(entry) {
  const scores = getScores();
  scores.push(entry);
  localStorage.setItem(LS_SCORES, JSON.stringify(scores));
}

export function clearScores() {
  localStorage.removeItem(LS_SCORES);
}

export function getStats() {
  try {
    return (
      JSON.parse(localStorage.getItem(LS_STATS)) || {
        totalGames: 0,
        totalWPM: 0,
        bestWPM: 0,
        totalAccuracy: 0,
        mpWins: 0,
        mpRaces: 0,
      }
    );
  } catch {
    return {
      totalGames: 0,
      totalWPM: 0,
      bestWPM: 0,
      totalAccuracy: 0,
      mpWins: 0,
      mpRaces: 0,
    };
  }
}

export function updateStats(patch) {
  const stats = getStats();
  Object.assign(stats, patch);
  localStorage.setItem(LS_STATS, JSON.stringify(stats));
}
