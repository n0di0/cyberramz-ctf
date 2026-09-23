// CyberRamz CTF — client-side flag checking & progression
// Flags are checked client-side for simplicity (this is a beginner-friendly,
// in-person event, not a security-hardened competition).

const STORAGE_KEY = "cyberramz_progress_v1";

const ANSWERS = {
  step1a: "64",
  flag1: "encryption-is-cool!",
  flag2: "secret-pages-are-tricky",
  flag3: "hidden-in-plain-sight",
  kali1: ["nmap"],
  kali2: ["whoami"],
  kali3: ["ls -a", "ls -la", "ls -al"],
  flag4: "kali-linux-is-4-hackers",
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("none");
    return JSON.parse(raw);
  } catch {
    return { stage1: false, stage2: false, stage3: false, stage4: false, step1a: false, kali1: false, kali2: false, kali3: false };
  }
}

let progress = loadProgress();

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage unavailable — progress just won't persist across reloads
  }
}

function normalize(str) {
  return (str || "").trim().toLowerCase();
}

function checkAnswer(input, expected) {
  const val = normalize(input);
  if (Array.isArray(expected)) {
    return expected.some((e) => normalize(e) === val);
  }
  return normalize(expected) === val;
}

function setFeedback(el, message, ok) {
  el.textContent = message;
  el.className = "feedback " + (ok ? "ok" : "err");
}

function refreshUI() {
  const stages = [1, 2, 3, 4];
  let doneCount = 0;

  stages.forEach((n) => {
    const stageEl = document.getElementById(`stage${n}`);
    if (!stageEl) return;
    const isDone = progress[`stage${n}`];
    const isUnlocked = n === 1 || progress[`stage${n - 1}`];

    stageEl.classList.remove("locked", "active", "done");
    if (isDone) {
      stageEl.classList.add("done");
      doneCount++;
    } else if (isUnlocked) {
      stageEl.classList.add("active");
    } else {
      stageEl.classList.add("locked");
    }

    const statusEl = stageEl.querySelector(".stage-status");
    if (statusEl) {
      statusEl.textContent = isDone ? "cleared" : isUnlocked ? "in progress" : "locked";
    }
  });

  document.querySelectorAll(".progress .seg").forEach((seg, i) => {
    seg.classList.toggle("done", i < doneCount);
  });

  if (doneCount === 4) {
    document.getElementById("finale").classList.add("show");
  }

  // restore any already-solved sub-steps visually
  if (progress.step1a) revealStage1Part2(false);
  if (progress.kali1) markKaliDone("kali1");
  if (progress.kali2) markKaliDone("kali2");
  if (progress.kali3) markKaliDone("kali3");
  if (progress.kali1 && progress.kali2 && progress.kali3) revealKaliFlag(false);
}

/* ---------------- Stage 1 ---------------- */

function submitStep1a() {
  const input = document.getElementById("step1a-input");
  const fb = document.getElementById("step1a-feedback");
  if (checkAnswer(input.value, ANSWERS.step1a)) {
    progress.step1a = true;
    saveProgress();
    setFeedback(fb, "Correct. Base64 string unlocked below.", true);
    revealStage1Part2(true);
  } else {
    setFeedback(fb, "Not quite — decode the Caesar shift first, then solve the math.", false);
  }
}

function revealStage1Part2(animate) {
  document.getElementById("step1b-block").classList.add("show");
}

function submitFlag1() {
  const input = document.getElementById("flag1-input");
  const fb = document.getElementById("flag1-feedback");
  if (checkAnswer(input.value, ANSWERS.flag1)) {
    progress.stage1 = true;
    saveProgress();
    setFeedback(fb, "Flag accepted. Stage 2 unlocked.", true);
    refreshUI();
  } else {
    setFeedback(fb, "That's not it. Decode the Base64 string above.", false);
  }
}

/* ---------------- Stage 2 ---------------- */

function submitFlag2() {
  const input = document.getElementById("flag2-input");
  const fb = document.getElementById("flag2-feedback");
  if (checkAnswer(input.value, ANSWERS.flag2)) {
    progress.stage2 = true;
    saveProgress();
    setFeedback(fb, "Flag accepted. Stage 3 unlocked.", true);
    refreshUI();
  } else {
    setFeedback(fb, "Not the right flag. Keep looking — not every page is linked.", false);
  }
}

/* ---------------- Stage 3 ---------------- */

function submitFlag3() {
  const input = document.getElementById("flag3-input");
  const fb = document.getElementById("flag3-feedback");
  if (checkAnswer(input.value, ANSWERS.flag3)) {
    progress.stage3 = true;
    saveProgress();
    setFeedback(fb, "Flag accepted. Stage 4 unlocked.", true);
    refreshUI();
  } else {
    setFeedback(fb, "Not quite. The image is hiding more than it shows — check the raw file.", false);
  }
}

/* ---------------- Stage 4 ---------------- */

function markKaliDone(key) {
  const row = document.getElementById(key + "-row");
  if (row) row.classList.add("done-row");
  const fb = document.getElementById(key + "-feedback");
  if (fb) setFeedback(fb, "Correct.", true);
}

function submitKali(key, inputId) {
  const input = document.getElementById(inputId);
  const fb = document.getElementById(key + "-feedback");
  if (checkAnswer(input.value, ANSWERS[key])) {
    progress[key] = true;
    saveProgress();
    markKaliDone(key);
    if (progress.kali1 && progress.kali2 && progress.kali3) {
      revealKaliFlag(true);
    }
  } else {
    setFeedback(fb, "Not quite — think about what that command is built to do.", false);
  }
}

function revealKaliFlag(animate) {
  document.getElementById("kali-flag-reveal").classList.add("show");
}

function submitFlag4() {
  const input = document.getElementById("flag4-input");
  const fb = document.getElementById("flag4-feedback");
  if (checkAnswer(input.value, ANSWERS.flag4)) {
    progress.stage4 = true;
    saveProgress();
    setFeedback(fb, "Flag accepted. You're in.", true);
    refreshUI();
  } else {
    setFeedback(fb, "That's not it — copy the flag exactly as shown above.", false);
  }
}

/* ---------------- init ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("step1a-submit").addEventListener("click", submitStep1a);
  document.getElementById("flag1-submit").addEventListener("click", submitFlag1);
  document.getElementById("flag2-submit").addEventListener("click", submitFlag2);
  document.getElementById("flag3-submit").addEventListener("click", submitFlag3);
  document.getElementById("kali1-submit").addEventListener("click", () => submitKali("kali1", "kali1-input"));
  document.getElementById("kali2-submit").addEventListener("click", () => submitKali("kali2", "kali2-input"));
  document.getElementById("kali3-submit").addEventListener("click", () => submitKali("kali3", "kali3-input"));
  document.getElementById("flag4-submit").addEventListener("click", submitFlag4);

  document.querySelectorAll("input[type=text]").forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        el.nextElementSibling && el.nextElementSibling.tagName === "BUTTON"
          ? el.nextElementSibling.click()
          : el.closest(".field-row, .flag-row").querySelector("button")?.click();
      }
    });
  });

  document.getElementById("reset-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Reset all progress on this device?")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  refreshUI();
});
