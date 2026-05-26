const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const pwInput = document.getElementById("password");
const emailHint = document.getElementById("email-hint");
const pwHint = document.getElementById("pw-hint");
const togglePw = document.getElementById("togglePw");

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

togglePw.addEventListener("click", () => {
  const isHidden = pwInput.type === "password";
  pwInput.type = isHidden ? "text" : "password";
  togglePw.textContent = isHidden ? "hide" : "show";
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

pwInput.addEventListener("blur", () => {
  const val = pwInput.value;
  if (!val) {
    setFieldState(pwInput, pwHint, "error", "Password is required.");
  } else if (containsSQLInjection(val)) {
    setFieldState(
      pwInput,
      pwHint,
      "error",
      "Password contains invalid characters.",
    );
  } else {
    setFieldState(pwInput, pwHint, "", "");
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

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
  } else if (!pwVal) {
    setFieldState(pwInput, pwHint, "error", "Password is required.");
    shakeField(pwInput);
    valid = false;
  }

  if (valid) {
    window.location.href = "index.html";
  }
});
