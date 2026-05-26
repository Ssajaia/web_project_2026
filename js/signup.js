const signupForm = document.getElementById("signupForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const pwInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");

const usernameHint = document.getElementById("username-hint");
const emailHint = document.getElementById("email-hint");
const pwHint = document.getElementById("pw-hint");
const confirmHint = document.getElementById("confirm-hint");

const segs = [
  document.getElementById("seg1"),
  document.getElementById("seg2"),
  document.getElementById("seg3"),
  document.getElementById("seg4"),
];

const SEG_COLORS = {
  1: "seg--weak",
  2: "seg--fair",
  3: "seg--strong",
  4: "seg--great",
};
const SEG_LABELS = { 0: "—", 1: "Weak", 2: "Fair", 3: "Strong", 4: "Strong" };

const ruleEls = {
  len: document.getElementById("rule-len"),
  upper: document.getElementById("rule-upper"),
  num: document.getElementById("rule-num"),
  sym: document.getElementById("rule-sym"),
};

const SQL_PATTERN =
  /('|--|;|\/\*|\*\/|xp_|exec\s*\(|select\s+|insert\s+|update\s+|delete\s+|drop\s+|union\s+|or\s+1\s*=\s*1|and\s+1\s*=\s*1)/i;

function containsSQLInjection(val) {
  return SQL_PATTERN.test(val);
}

function setFieldState(input, hint, state, msg) {
  input.classList.remove("input--error", "input--ok");
  hint.classList.remove("hint--error", "hint--ok");
  if (state === "error") {
    input.classList.add("input--error");
    hint.classList.add("hint--error");
  } else if (state === "ok") {
    input.classList.add("input--ok");
    hint.classList.add("hint--ok");
  }
  hint.textContent = msg || "";
}

function shakeField(input) {
  input.classList.add("shake");
  input.addEventListener(
    "animationend",
    () => input.classList.remove("shake"),
    {
      once: true,
    },
  );
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

const RULES = {
  len: { fn: (v) => v.length > 8, label: "More than 8 characters" },
  upper: { fn: (v) => /[A-Z]/.test(v), label: "One uppercase letter (A–Z)" },
  num: { fn: (v) => /[0-9]/.test(v), label: "One number (0–9)" },
  sym: {
    fn: (v) => /[^A-Za-z0-9]/.test(v),
    label: "One special character (!@#$…)",
  },
};

const strengthLabel = document.getElementById("strengthLabel");

function getScore(val) {
  if (!val) return 0;
  return Object.values(RULES).filter((r) => r.fn(val)).length;
}

function updateStrength(val) {
  const score = getScore(val);

  Object.entries(RULES).forEach(([key, rule]) => {
    ruleEls[key].classList.toggle("rule--met", rule.fn(val));
  });

  segs.forEach((seg, i) => {
    seg.className = "strength-bar-seg";
    if (val && i < score) {
      seg.classList.add(SEG_COLORS[score] || "seg--great");
    }
  });

  strengthLabel.textContent = val ? SEG_LABELS[score] || "—" : "—";
  return score;
}

function isStrongPassword(val) {
  return getScore(val) === 4;
}

function setupToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  btn.addEventListener("click", () => {
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "hide" : "show";
  });
}

setupToggle("togglePw", "password");
setupToggle("toggleConfirm", "confirm");

pwInput.addEventListener("input", () => {
  const val = pwInput.value;
  const score = updateStrength(val);

  if (!val) {
    setFieldState(pwInput, pwHint, "", "");
  } else if (containsSQLInjection(val)) {
    setFieldState(
      pwInput,
      pwHint,
      "error",
      "Password contains invalid characters.",
    );
  } else if (score < 4) {
    const missing = 4 - score;
    setFieldState(
      pwInput,
      pwHint,
      "error",
      `${missing} requirement${missing > 1 ? "s" : ""} not met.`,
    );
  } else {
    setFieldState(pwInput, pwHint, "ok", "Password is strong ✓");
  }
});

usernameInput.addEventListener("blur", () => {
  const val = usernameInput.value.trim();
  if (!val) {
    setFieldState(
      usernameInput,
      usernameHint,
      "error",
      "Username is required.",
    );
  } else if (containsSQLInjection(val)) {
    setFieldState(
      usernameInput,
      usernameHint,
      "error",
      "Username contains invalid characters.",
    );
  } else if (val.length < 3) {
    setFieldState(
      usernameInput,
      usernameHint,
      "error",
      "At least 3 characters.",
    );
  } else {
    setFieldState(usernameInput, usernameHint, "ok", "");
  }
});

emailInput.addEventListener("blur", () => {
  const val = emailInput.value.trim();
  if (!val) {
    setFieldState(emailInput, emailHint, "error", "Email is required.");
  } else if (containsSQLInjection(val)) {
    setFieldState(
      emailInput,
      emailHint,
      "error",
      "Email contains invalid characters.",
    );
  } else if (!validateEmail(val)) {
    setFieldState(
      emailInput,
      emailHint,
      "error",
      "Enter a valid email address.",
    );
  } else {
    setFieldState(emailInput, emailHint, "ok", "");
  }
});

confirmInput.addEventListener("blur", () => {
  if (!confirmInput.value) {
    setFieldState(
      confirmInput,
      confirmHint,
      "error",
      "Please confirm your password.",
    );
  } else if (confirmInput.value !== pwInput.value) {
    setFieldState(
      confirmInput,
      confirmHint,
      "error",
      "Passwords do not match.",
    );
  } else {
    setFieldState(confirmInput, confirmHint, "ok", "");
  }
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  const usernameVal = usernameInput.value.trim();
  if (containsSQLInjection(usernameVal)) {
    setFieldState(
      usernameInput,
      usernameHint,
      "error",
      "Username contains invalid characters.",
    );
    shakeField(usernameInput);
    valid = false;
  } else if (!usernameVal || usernameVal.length < 3) {
    setFieldState(
      usernameInput,
      usernameHint,
      "error",
      "Username must be at least 3 characters.",
    );
    shakeField(usernameInput);
    valid = false;
  }

  const emailVal = emailInput.value.trim();
  if (containsSQLInjection(emailVal)) {
    setFieldState(
      emailInput,
      emailHint,
      "error",
      "Email contains invalid characters.",
    );
    shakeField(emailInput);
    valid = false;
  } else if (!emailVal || !validateEmail(emailVal)) {
    setFieldState(
      emailInput,
      emailHint,
      "error",
      "Enter a valid email address.",
    );
    shakeField(emailInput);
    valid = false;
  }

  const pwVal = pwInput.value;
  if (containsSQLInjection(pwVal)) {
    setFieldState(
      pwInput,
      pwHint,
      "error",
      "Password contains invalid characters.",
    );
    shakeField(pwInput);
    valid = false;
  } else if (!isStrongPassword(pwVal)) {
    const missing = 4 - getScore(pwVal);
    setFieldState(
      pwInput,
      pwHint,
      "error",
      `Password not strong enough — ${missing} requirement${missing > 1 ? "s" : ""} not met.`,
    );
    shakeField(pwInput);
    updateStrength(pwVal);
    valid = false;
  }

  if (confirmInput.value !== pwInput.value) {
    setFieldState(
      confirmInput,
      confirmHint,
      "error",
      "Passwords do not match.",
    );
    shakeField(confirmInput);
    valid = false;
  }

  if (valid) {
    window.location.href = "index.html";
  }
});
