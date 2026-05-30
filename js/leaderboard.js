import { dismissLoader, showToast, getScores, clearScores } from "./utils.js";

let sortKey = "wpm";
let sortDir = "desc";

const tbody = document.getElementById("lb-tbody");
const emptyMsg = document.getElementById("lb-empty");
const clearBtn = document.getElementById("clear-lb-btn");
const sortBtns = document.querySelectorAll(".sort-btn");

function render() {
  let scores = getScores();

  
  scores = scores.slice().sort((a, b) => {
    let va = a[sortKey],
      vb = b[sortKey];
    if (sortKey === "date") {
      va = a.timestamp || 0;
      vb = b.timestamp || 0;
    }
    if (sortKey === "accuracy") {
      va = parseInt(va) || 0;
      vb = parseInt(vb) || 0;
    }
    return sortDir === "desc" ? vb - va : va - vb;
  });

  tbody.innerHTML = "";
  scores.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="lb-rank">${i + 1}</td>
      <td><span class="lb-mode-badge">${escHtml(s.mode)}</span></td>
      <td class="lb-wpm">${s.wpm}</td>
      <td>${s.accuracy}%</td>
      <td>${escHtml(s.date)}</td>
    `;
    if (i === 0) tr.style.color = "var(--color-text-primary)";
    tbody.appendChild(tr);
  });

  sortBtns.forEach((btn) => {
    btn.classList.remove("is-active", "is-asc", "is-desc");
    if (btn.dataset.sort === sortKey) {
      btn.classList.add("is-active", sortDir === "asc" ? "is-asc" : "is-desc");
    }
  });
}

sortBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sort;
    if (key === sortKey) {
      sortDir = sortDir === "desc" ? "asc" : "desc";
    } else {
      sortKey = key;
      sortDir = "desc";
    }
    render();
  });
});

clearBtn.addEventListener("click", () => {
  if (!confirm("Clear all leaderboard entries? This cannot be undone.")) return;
  clearScores();
  render();
  showToast("Leaderboard cleared.");
});

function escHtml(str = "") {
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

dismissLoader();
render();
