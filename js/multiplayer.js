import {
  loadSentence,
  formatTime,
  calcWPM,
  calcAccuracy,
  showToast,
  dismissLoader,
  renderText,
  updateChars,
  getStats,
  updateStats,
} from "./utils.js";

const DURATION = 60;

let sentence = "";
let playerCount = 3;
let playerNames = [];
let results = [];
let currentIdx = 0;

let timer = null;
let timeLeft = DURATION;
let started = false;
let finished = false;
let errors = 0;

const stepSetup = document.getElementById("mp-step-setup");
const stepPlay = document.getElementById("mp-step-play");
const stepResults = document.getElementById("mp-step-results");

const setupForm = document.getElementById("mp-setup-form");
const nameInputsWrap = document.getElementById("player-name-inputs");
const countBtns = document.querySelectorAll(".player-count-btn");

const playerLabel = document.getElementById("mp-player-label");
const progressBar = document.getElementById("mp-progress-bar");
const mpTimer = document.getElementById("mp-timer");
const mpWpm = document.getElementById("mp-wpm");
const mpAccuracy = document.getElementById("mp-accuracy");
const mpDisplayText = document.getElementById("mp-display-text");
const mpInput = document.getElementById("mp-typing-input");
const mpNextBtn = document.getElementById("mp-next-btn");

const rankingTbody = document.getElementById("ranking-tbody");
const winnerText = document.getElementById("mp-winner-text");
const rematchBtn = document.getElementById("mp-rematch-btn");
const newGameBtn = document.getElementById("mp-new-game-btn");

function buildNameInputs(count) {
  nameInputsWrap.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.className = "form-label";
    label.htmlFor = `player-name-${i}`;
    label.textContent = `Player ${i + 1} name`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `player-name-${i}`;
    input.name = `player${i + 1}`;
    input.className = "form-input";
    input.placeholder = `Player ${i + 1}`;
    input.maxLength = 20;

    group.appendChild(label);
    group.appendChild(input);
    nameInputsWrap.appendChild(group);
  }
}

countBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    countBtns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-checked", "true");
    playerCount = parseInt(btn.dataset.count, 10);
    buildNameInputs(playerCount);
  });
});

buildNameInputs(playerCount);

setupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  playerNames = [];
  for (let i = 0; i < playerCount; i++) {
    const val = document.getElementById(`player-name-${i}`)?.value.trim();
    playerNames.push(val || `Player ${i + 1}`);
  }
  results = [];
  currentIdx = 0;
  sentence = await loadSentence();
  startRace();
});

function showStep(step) {
  stepSetup.classList.remove("is-active");
  stepPlay.classList.remove("is-active");
  stepResults.classList.remove("is-active");
  step.classList.add("is-active");
}

function buildProgressBar() {
  progressBar.innerHTML = "";
  for (let i = 0; i < playerCount; i++) {
    const seg = document.createElement("div");
    seg.className =
      "mp-progress-segment" +
      (i < currentIdx ? " is-done" : i === currentIdx ? " is-active" : "");
    progressBar.appendChild(seg);
  }
}

function startRace() {
  showStep(stepPlay);
  beginPlayerTurn();
}

function beginPlayerTurn() {
  clearInterval(timer);
  started = false;
  finished = false;
  errors = 0;
  timeLeft = DURATION;

  playerLabel.textContent = playerNames[currentIdx];
  buildProgressBar();

  mpTimer.textContent = formatTime(DURATION);
  mpTimer.classList.remove("timer-display--warning", "timer-display--critical");
  mpWpm.textContent = "-";
  mpAccuracy.textContent = "-";

  renderText(mpDisplayText, sentence);
  updateChars(mpDisplayText, "", sentence);

  mpInput.value = "";
  mpInput.disabled = false;
  mpNextBtn.disabled = true;
  mpNextBtn.textContent =
    currentIdx < playerCount - 1 ? "Next Player" : "See Results";

  mpInput.focus();
}

mpInput.addEventListener("input", () => {
  if (finished) return;
  const typed = mpInput.value;

  if (!started && typed.length > 0) {
    started = true;
    timer = setInterval(tick, 1000);
  }

  const pos = typed.length - 1;
  if (pos >= 0 && typed[pos] !== sentence[pos]) errors++;

  updateChars(mpDisplayText, typed, sentence);

  const elapsed = DURATION - timeLeft;
  const correctChars = [...typed].filter((ch, i) => ch === sentence[i]).length;
  const wpm = calcWPM(correctChars, elapsed);
  mpWpm.textContent = started ? wpm : "-";
  mpAccuracy.textContent = started ? calcAccuracy(typed.length, errors) : "-";

  if (typed === sentence) endPlayerTurn();
});

function tick() {
  timeLeft--;
  mpTimer.textContent = formatTime(timeLeft);
  mpTimer.classList.toggle(
    "timer-display--warning",
    timeLeft <= 10 && timeLeft > 5,
  );
  mpTimer.classList.toggle("timer-display--critical", timeLeft <= 5);
  if (timeLeft <= 0) {
    clearInterval(timer);
    endPlayerTurn();
  }
}

function endPlayerTurn() {
  clearInterval(timer);
  finished = true;
  mpInput.disabled = true;

  const elapsed = DURATION - timeLeft || 1;
  const typed = mpInput.value;
  const correctChars = [...typed].filter((ch, i) => ch === sentence[i]).length;
  const wpm = calcWPM(correctChars, elapsed);
  const accuracy = parseInt(calcAccuracy(typed.length, errors));

  results.push({ name: playerNames[currentIdx], wpm, accuracy, errors });
  mpNextBtn.disabled = false;
}

mpNextBtn.addEventListener("click", () => {
  currentIdx++;
  if (currentIdx < playerCount) {
    beginPlayerTurn();
  } else {
    showResults();
  }
});

document.addEventListener("keydown", (e) => {
  if (stepPlay.classList.contains("is-active")) {
    if (e.key === "Tab") {
      e.preventDefault();
      errors = 0;
      beginPlayerTurn();
    }
  }
});

function showResults() {
  showStep(stepResults);

  const sorted = [...results].sort(
    (a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy,
  );
  const winner = sorted[0];

  winnerText.textContent = `🏆 ${winner.name} wins with ${winner.wpm} WPM!`;

  rankingTbody.innerHTML = "";
  sorted.forEach((p, i) => {
    const tr = document.createElement("tr");
    if (i === 0) tr.className = "winner-row";

    const badges = ["gold", "silver", "bronze"];
    const badgeClass = badges[i]
      ? `rank-badge rank-badge--${badges[i]}`
      : "rank-badge";

    tr.innerHTML = `
      <td><span class="${badgeClass}">${i + 1}</span></td>
      <td>${escHtml(p.name)}</td>
      <td class="rank-wpm">${p.wpm}</td>
      <td>${p.accuracy}%</td>
      <td>${p.errors}</td>
    `;
    rankingTbody.appendChild(tr);
  });

  const s = getStats();
  updateStats({
    mpRaces: s.mpRaces + 1,
    mpWins: s.mpWins,
  });

  showToast(`Race over! ${winner.name} wins with ${winner.wpm} WPM`);
}

function escHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

rematchBtn.addEventListener("click", async () => {
  results = [];
  currentIdx = 0;
  sentence = await loadSentence();
  startRace();
});

newGameBtn.addEventListener("click", () => {
  results = [];
  currentIdx = 0;
  playerNames = [];
  buildNameInputs(playerCount);
  showStep(stepSetup);
});

dismissLoader();
