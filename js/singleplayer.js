import {
  loadSentence,
  formatTime,
  calcWPM,
  calcAccuracy,
  showToast,
  dismissLoader,
  renderText,
  updateChars,
  saveScore,
  getStats,
  updateStats,
} from "./utils.js";

const state = {
  sentence: "",
  duration: 60,
  timeLeft: 60,
  timer: null,
  started: false,
  finished: false,
  errors: 0,
  totalTyped: 0,
};

const timerEl = document.getElementById("timer-display");
const wpmEl = document.getElementById("wpm-display");
const accuracyEl = document.getElementById("accuracy-display");
const errorsEl = document.getElementById("errors-display");
const displayText = document.getElementById("typing-display-text");
const input = document.getElementById("typing-input");
const restartBtn = document.getElementById("restart-btn");
const resultOverlay = document.getElementById("result-overlay");
const resultWpmEl = document.getElementById("result-wpm");
const resultAccEl = document.getElementById("result-accuracy");
const overlayRestart = document.getElementById("overlay-restart-btn");
const modeButtons = document.querySelectorAll(".mode-selector__btn");

async function init() {
  dismissLoader();
  state.sentence = await loadSentence();
  renderText(displayText, state.sentence);
  updateChars(displayText, "", state.sentence);
  timerEl.textContent = formatTime(state.duration);
  input.value = "";
  input.disabled = false;
  input.placeholder = "Start typing to begin…";
  input.focus();
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-checked", "true");
    state.duration = parseInt(btn.dataset.duration, 10);
    reset();
  });
});

input.addEventListener("input", () => {
  if (state.finished) return;

  const typed = input.value;

  if (!state.started && typed.length > 0) {
    startTimer();
  }

  const pos = typed.length - 1;
  if (pos >= 0 && typed[pos] !== state.sentence[pos]) {
    state.errors++;
  }
  state.totalTyped = typed.length;

  updateChars(displayText, typed, state.sentence);

  const elapsed = state.duration - state.timeLeft;
  const correctChars = [...typed].filter(
    (ch, i) => ch === state.sentence[i],
  ).length;
  const wpm = calcWPM(correctChars, elapsed);
  wpmEl.textContent = state.started ? wpm : "-";
  accuracyEl.textContent = state.started
    ? calcAccuracy(typed.length, state.errors)
    : "-";
  errorsEl.textContent = state.started ? state.errors : "-";

  if (typed === state.sentence) {
    finishTest();
  }
});

function startTimer() {
  state.started = true;
  state.timeLeft = state.duration;
  state.timer = setInterval(() => {
    state.timeLeft--;
    timerEl.textContent = formatTime(state.timeLeft);

    timerEl.classList.toggle(
      "timer-display--warning",
      state.timeLeft <= 10 && state.timeLeft > 5,
    );
    timerEl.classList.toggle("timer-display--critical", state.timeLeft <= 5);

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      finishTest();
    }
  }, 1000);
}

function finishTest() {
  clearInterval(state.timer);
  state.finished = true;
  input.disabled = true;

  const elapsed = state.duration - state.timeLeft || 1;
  const typed = input.value;
  const correctChars = [...typed].filter(
    (ch, i) => ch === state.sentence[i],
  ).length;
  const wpm = calcWPM(correctChars, elapsed);
  const accuracy = calcAccuracy(typed.length, state.errors);

  resultWpmEl.innerHTML = `${wpm} <span>wpm</span>`;
  resultAccEl.textContent = `${accuracy} accuracy · ${state.errors} errors`;
  resultOverlay.classList.add("is-visible");
  resultOverlay.setAttribute("aria-hidden", "false");

  const entry = {
    mode: `${state.duration}s`,
    wpm,
    accuracy: parseInt(accuracy),
    errors: state.errors,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };
  saveScore(entry);

  const s = getStats();
  updateStats({
    totalGames: s.totalGames + 1,
    totalWPM: s.totalWPM + wpm,
    bestWPM: Math.max(s.bestWPM, wpm),
    totalAccuracy: s.totalAccuracy + parseInt(accuracy),
  });

  showToast(`Saved! ${wpm} WPM · ${accuracy}`);
}

async function reset() {
  clearInterval(state.timer);
  state.started = false;
  state.finished = false;
  state.errors = 0;
  state.totalTyped = 0;
  state.timeLeft = state.duration;

  timerEl.textContent = formatTime(state.duration);
  timerEl.classList.remove("timer-display--warning", "timer-display--critical");
  wpmEl.textContent = "-";
  accuracyEl.textContent = "-";
  errorsEl.textContent = "-";

  resultOverlay.classList.remove("is-visible");
  resultOverlay.setAttribute("aria-hidden", "true");

  state.sentence = await loadSentence();
  renderText(displayText, state.sentence);
  updateChars(displayText, "", state.sentence);

  input.value = "";
  input.disabled = false;
  input.focus();
}

restartBtn.addEventListener("click", reset);
overlayRestart.addEventListener("click", reset);

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab" || e.key === "Escape") {
    e.preventDefault();
    reset();
  }
});

init();
