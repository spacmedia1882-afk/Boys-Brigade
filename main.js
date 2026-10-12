// The Boys' Brigade Nigeria - main.js
// Needs data.js to be loaded first (index.html already does this).

(function () {
  "use strict";

  const SITE_NAME = "The Boys' Brigade Nigeria";

  // EmailJS (same account as the church website)
  const EMAILJS_PUBLIC_KEY = "65PVnw82yNxjPY7rA";
  const EMAILJS_SERVICE_ID = "service_jddvkmp";
  const EMAILJS_TEMPLATE_ID = "template_0u94vmg";

  // Shared online leaderboard. Leave empty to keep scores on this device only.
  const BOARD_URL = "";
  const BOARD_SIZE = 10;
  const PASS_PERCENT = 50;
  const ACTIVE_KEY = "bb-test-active";

  const DATA = window.BB_DATA || { ranks: [], officers: [], uniform: [], history: [], quiz: [] };
  const TOPICS = ["ranks", "uniform", "history"];

  // ---------- Small helpers ----------

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* storage blocked: ignore */ }
    return null;
  }

  function unstore(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function fmtTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  // ---------- Footer year ----------

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");

  function closeMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "Close" : "Menu";
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mainNav.classList.contains("open")) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // ---------- Reading level: Kids or Leaders ----------

  let mode = store("bb-mode") === "leaders" ? "leaders" : "kids";
  const modeButtons = document.querySelectorAll(".mode-switch button");

  function pick(item) {
    return mode === "kids" ? item.kids : item.leaders;
  }

  function paintModeButtons() {
    modeButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.mode === mode));
    });
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      store("bb-mode", mode);
      paintModeButtons();
      renderCurrentView();
    });
  });

  paintModeButtons();

  // ---------- Progress: topics learned ----------

  function getLearned() {
    try {
      const raw = store("bb-learned");
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function setLearned(list) {
    store("bb-learned", JSON.stringify(list));
  }

  function paintProgress() {
    const learned = getLearned().filter((t) => TOPICS.includes(t));
    const count = learned.length;

    const countEl = document.getElementById("progress-count");
    const totalEl = document.getElementById("progress-total");
    const fillEl = document.getElementById("progress-fill");
    const textEl = document.querySelector(".progress-text");

    if (countEl) countEl.textContent = String(count);
    if (totalEl) totalEl.textContent = String(TOPICS.length);
    if (fillEl) fillEl.style.width = Math.round((count / TOPICS.length) * 100) + "%";
    if (textEl && count === TOPICS.length) {
      textEl.textContent = "All topics learned. Now take the test to prove it.";
    }

    document.querySelectorAll("a[data-topic]").forEach((link) => {
      link.classList.toggle("learned", learned.includes(link.dataset.topic));
    });

    document.querySelectorAll(".mark-learned").forEach((btn) => {
      const done = learned.includes(btn.dataset.topic);
      btn.textContent = done ? "Learned" : "I have learned this";
      btn.classList.toggle("is-done", done);
    });
  }

  document.querySelectorAll(".mark-learned").forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.dataset.topic;
      const learned = getLearned();
      const index = learned.indexOf(topic);
      if (index === -1) learned.push(topic);
      else learned.splice(index, 1);
      setLearned(learned);
      paintProgress();
    });
  });

  // ---------- Ranks page ----------

  function badgeSVG(rank) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 56 56");
    svg.setAttribute("width", "56");
    svg.setAttribute("height", "56");
    svg.setAttribute("aria-hidden", "true");

    const bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("width", "56");
    bg.setAttribute("height", "56");
    bg.setAttribute("rx", "4");
    bg.setAttribute("fill", "#111111");
    svg.appendChild(bg);

    if (rank.chevrons) {
      for (let i = 0; i < rank.chevrons; i++) {
        const y = 14 + i * 11;
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M12 " + y + " L28 " + (y + 11) + " L44 " + y);
        path.setAttribute("stroke", "#FFFFFF");
        path.setAttribute("stroke-width", "4");
        path.setAttribute("fill", "none");
        svg.appendChild(path);
      }
    } else {
      const abbr = rank.name.split(" ").map((w) => w[0]).join("");
      const label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", "28");
      label.setAttribute("y", "35");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "20");
      label.setAttribute("font-weight", "700");
      label.setAttribute("fill", "#FFFFFF");
      label.textContent = abbr;
      svg.appendChild(label);
    }
    return svg;
  }

  function renderRanks() {
    const list = document.getElementById("ranks-list");
    const officers = document.getElementById("officers-list");
    if (!list || !officers) return;
    clear(list);
    clear(officers);

    DATA.ranks.forEach((rank) => {
      const card = el("div", "rank-card");
      const badge = el("div", "rank-badge");
      badge.appendChild(badgeSVG(rank));

      const body = el("div", "rank-body");
      body.appendChild(el("h3", "rank-name", rank.name));
      body.appendChild(el("p", "rank-meta", rank.mark + " \u00B7 Usual age " + rank.age));
      body.appendChild(el("p", "rank-text", pick(rank)));

      card.appendChild(badge);
      card.appendChild(body);
      list.appendChild(card);
    });

    DATA.officers.forEach((officer) => {
      const card = el("div", "rank-card");
      const body = el("div", "rank-body");
      body.appendChild(el("h3", "rank-name", officer.name));
      body.appendChild(el("p", "rank-text", pick(officer)));
      card.appendChild(body);
      officers.appendChild(card);
    });
  }

  // ---------- Uniform page ----------

  let currentPart = null;

  function setPart(id) {
    const part = DATA.uniform.find((p) => p.id === id);
    if (!part) return;
    currentPart = id;

    const info = document.getElementById("uniform-info");
    if (info) {
      clear(info);
      info.appendChild(el("p", "info-name", part.name));
      info.appendChild(el("p", "info-where", "Worn: " + part.where));
      info.appendChild(el("p", "info-text", pick(part)));
    }

    document.querySelectorAll(".uniform-figure .part").forEach((node) => {
      node.classList.toggle("active", node.dataset.part === id);
    });

    document.querySelectorAll("#uniform-buttons button").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.part === id));
    });
  }

  function renderUniform() {
    const buttons = document.getElementById("uniform-buttons");
    if (!buttons) return;
    clear(buttons);

    DATA.uniform.forEach((part) => {
      const li = el("li");
      const btn = el("button", "part-button", part.name);
      btn.type = "button";
      btn.dataset.part = part.id;
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => setPart(part.id));
      li.appendChild(btn);
      buttons.appendChild(li);
    });

    if (currentPart) setPart(currentPart);
  }

  document.querySelectorAll(".uniform-figure .part").forEach((node) => {
    node.addEventListener("click", () => setPart(node.dataset.part));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setPart(node.dataset.part);
      }
    });
  });

  // ---------- History page ----------

  function renderHistory() {
    const list = document.getElementById("history-list");
    if (!list) return;
    clear(list);

    DATA.history.forEach((item) => {
      const li = el("li", "timeline-item");
      li.appendChild(el("span", "timeline-year", item.year));
      li.appendChild(el("h3", "timeline-title", item.title));
      li.appendChild(el("p", "timeline-text", pick(item)));
      list.appendChild(li);
    });
  }

  // ---------- Leaderboard ----------

  function localBoard() {
    try {
      const raw = store("bb-board");
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function loadBoard() {
    if (BOARD_URL) {
      return fetch(BOARD_URL)
        .then((r) => r.json())
        .then((list) => (Array.isArray(list) ? list : localBoard()))
        .catch(() => localBoard());
    }
    return Promise.resolve(localBoard());
  }

  function saveEntry(entry) {
    const list = localBoard();
    list.push(entry);
    store("bb-board", JSON.stringify(list.slice(-300)));

    if (BOARD_URL) {
      fetch(BOARD_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry)
      }).catch(() => { /* offline: the local copy is kept */ });
    }
  }

  // Negative when a should rank above b
  function compareEntries(a, b) {
    const aRank = a.status === "done" ? 0 : 1;
    const bRank = b.status === "done" ? 0 : 1;
    if (aRank !== bRank) return aRank - bRank;
    if (aRank === 0) {
      if (a.score !== b.score) return b.score - a.score;
      return a.seconds - b.seconds;
    }
    return 0;
  }

  function bestPerName(list) {
    const best = {};
    list.forEach((entry) => {
      const name = String(entry.name || "").trim().slice(0, 24);
      if (!name) return;
      const key = name.toLowerCase();
      const row = {
        name: name,
        score: Number(entry.score) || 0,
        total: Number(entry.total) || 0,
        seconds: Number(entry.seconds) || 0,
        status: entry.status === "done" ? "done" : "left"
      };
      if (!best[key] || compareEntries(row, best[key]) < 0) best[key] = row;
    });
    return Object.keys(best).map((k) => best[k]).sort(compareEntries);
  }

  function resultLabel(entry) {
    if (entry.status !== "done") return "Failed (left)";
    const pct = entry.total ? (entry.score / entry.total) * 100 : 0;
    return pct >= PASS_PERCENT ? "Passed" : "Failed";
  }

  function renderBoardInto(box) {
    clear(box);
    box.appendChild(el("h3", "board-title", "Leaderboard"));
    box.appendChild(el("p", "board-note",
      BOARD_URL ? "Shared by everyone who takes the test." : "Scores are saved on this device."));

    const holder = el("div", "board-holder", "Loading...");
    box.appendChild(holder);

    loadBoard().then((list) => {
      const rows = bestPerName(list).slice(0, BOARD_SIZE);
      clear(holder);

      if (rows.length === 0) {
        holder.appendChild(el("p", "board-empty", "No scores yet. Be the first."));
        return;
      }

      const table = el("table", "board-table");
      const head = el("thead");
      const headRow = el("tr");
      ["#", "Name", "Score", "Time", "Result"].forEach((t) => {
        headRow.appendChild(el("th", null, t));
      });
      head.appendChild(headRow);
      table.appendChild(head);

      const body = el("tbody");
      rows.forEach((entry, i) => {
        const tr = el("tr", entry.status === "done" ? "" : "is-failed");
        const done = entry.status === "done";
        tr.appendChild(el("td", null, String(i + 1)));
        tr.appendChild(el("td", "board-name", entry.name));
        tr.appendChild(el("td", null, done ? entry.score + "/" + entry.total : "-"));
        tr.appendChild(el("td", null, done ? fmtTime(entry.seconds) : "-"));
        tr.appendChild(el("td", null, resultLabel(entry)));
        body.appendChild(tr);
      });
      table.appendChild(body);

      const scroller = el("div", "board-scroll");
      scroller.appendChild(table);
      holder.appendChild(scroller);
    });
  }

  function refreshBoards() {
    document.querySelectorAll("[data-board]").forEach(renderBoardInto);
  }

  function addBoard(parent) {
    const box = el("div", "leaderboard");
    box.setAttribute("data-board", "");
    parent.appendChild(box);
    renderBoardInto(box);
  }

  // A leaderboard also sits in the Learn section on the home page
  const learnWrap = document.querySelector("#learn .wrap");
  if (learnWrap) {
    const homeBoard = el("div", "leaderboard");
    homeBoard.setAttribute("data-board", "");
    learnWrap.appendChild(homeBoard);
  }

  // ---------- Timed test ----------

  const test = {
    stage: "start",   // start | running | result | failed
    name: "",
    order: [],
    index: 0,
    score: 0,
    start: 0,
    timerId: null,
    missed: [],
    result: null,
    notice: ""
  };

  function elapsed() {
    return Math.round((Date.now() - test.start) / 1000);
  }

  function stopTimer() {
    if (test.timerId) {
      clearInterval(test.timerId);
      test.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    test.timerId = setInterval(() => {
      const t = document.getElementById("quiz-timer");
      if (t) t.textContent = fmtTime(elapsed());
    }, 250);
  }

  function buildQuestions() {
    return shuffle(DATA.quiz).map((item) => ({
      q: item.q,
      explain: item.explain,
      options: shuffle(item.options.map((text, i) => ({ text: text, correct: i === item.answer })))
    }));
  }

  function startTest(name) {
    test.name = name;
    test.order = buildQuestions();
    test.index = 0;
    test.score = 0;
    test.missed = [];
    test.result = null;
    test.notice = "";
    test.start = Date.now();
    test.stage = "running";

    store("bb-name", name);
    // If the page is closed or reloaded mid-test, this marker is found
    // on the next load and the test is recorded as failed.
    store(ACTIVE_KEY, JSON.stringify({ name: name, total: test.order.length }));

    startTimer();
    renderQuiz();
  }

  function finishTest() {
    stopTimer();
    const seconds = elapsed();
    unstore(ACTIVE_KEY);

    const total = test.order.length;
    saveEntry({ name: test.name, score: test.score, total: total, seconds: seconds, status: "done", at: Date.now() });

    test.result = { score: test.score, total: total, seconds: seconds };
    test.stage = "result";
    renderQuiz();
  }

  function abandonTest(reason) {
    if (test.stage !== "running") return;
    stopTimer();
    unstore(ACTIVE_KEY);

    saveEntry({ name: test.name, score: 0, total: test.order.length, seconds: 0, status: "left", at: Date.now() });

    test.stage = "failed";
    test.notice = reason;
    if (currentViewId === "learn-quiz") renderQuiz();
  }

  // A test that was running when the page closed or reloaded counts as failed
  (function recoverAbandoned() {
    const raw = store(ACTIVE_KEY);
    if (!raw) return;
    try {
      const info = JSON.parse(raw);
      saveEntry({
        name: String(info.name || "Unknown").slice(0, 24),
        score: 0,
        total: Number(info.total) || 0,
        seconds: 0,
        status: "left",
        at: Date.now()
      });
      test.notice = "Your last test was left unfinished, so it was marked as failed.";
    } catch (e) { /* ignore */ }
    unstore(ACTIVE_KEY);
  })();

  // Switching tabs or apps counts as leaving
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && test.stage === "running") {
      abandonTest("You left the page during the test, so it was marked as failed.");
    }
  });

  // Ask the browser to confirm before closing or reloading mid-test
  window.addEventListener("beforeunload", (event) => {
    if (test.stage === "running") {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  function renderStart(root) {
    const card = el("div", "quiz-card");

    if (test.notice) {
      card.appendChild(el("p", "quiz-notice", test.notice));
      test.notice = "";
    }

    card.appendChild(el("h2", "quiz-question", "Ready for the test?"));

    const rules = el("ul", "quiz-rules");
    [
      "The timer starts the moment you press Start test.",
      "You cannot go back. Each answer locks as soon as you pick it.",
      "If you leave the test, switch tabs or apps, refresh or press Back, you fail.",
      "Questions and answers are shuffled every time.",
      "Your name, score and time go on the leaderboard."
    ].forEach((text) => rules.appendChild(el("li", null, text)));
    card.appendChild(rules);

    const label = el("label", "quiz-label", "Your name");
    label.setAttribute("for", "quiz-name");
    card.appendChild(label);

    const input = el("input", "quiz-name");
    input.id = "quiz-name";
    input.type = "text";
    input.maxLength = 20;
    input.autocomplete = "name";
    input.value = store("bb-name") || "";
    card.appendChild(input);

    const status = el("p", "quiz-feedback bad");
    status.setAttribute("role", "status");
    card.appendChild(status);

    const go = el("button", "btn btn-primary", "Start test");
    go.type = "button";
    go.addEventListener("click", () => {
      const name = input.value.trim().replace(/\s+/g, " ");
      if (name.length < 2) {
        status.textContent = "Please type your name first.";
        input.focus();
        return;
      }
      startTest(name);
    });
    card.appendChild(go);

    root.appendChild(card);
    addBoard(root);
  }

  function renderRunning(root) {
    const total = test.order.length;
    const item = test.order[test.index];

    const card = el("div", "quiz-card");

    const top = el("div", "quiz-top");
    top.appendChild(el("p", "quiz-count", "Question " + (test.index + 1) + " of " + total));
    const clock = el("p", "quiz-clock");
    clock.appendChild(el("span", "quiz-clock-label", "Time "));
    const timer = el("span", "quiz-timer", fmtTime(elapsed()));
    timer.id = "quiz-timer";
    clock.appendChild(timer);
    top.appendChild(clock);
    card.appendChild(top);

    const track = el("div", "quiz-progress");
    const fill = el("div", "quiz-progress-fill");
    fill.style.width = Math.round((test.index / total) * 100) + "%";
    track.appendChild(fill);
    card.appendChild(track);

    card.appendChild(el("h2", "quiz-question", item.q));

    const options = el("div", "quiz-options");
    item.options.forEach((option) => {
      const btn = el("button", "quiz-option", option.text);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (test.stage !== "running") return;

        // Lock every option straight away: no changing the answer
        options.querySelectorAll("button").forEach((b) => { b.disabled = true; });

        if (option.correct) {
          test.score++;
          btn.classList.add("is-correct");
        } else {
          btn.classList.add("is-wrong");
          const right = item.options.find((o) => o.correct);
          test.missed.push({ q: item.q, yours: option.text, right: right ? right.text : "", explain: item.explain });
        }

        setTimeout(() => {
          if (test.stage !== "running") return;
          test.index++;
          if (test.index >= total) finishTest();
          else renderQuiz();
        }, 700);
      });
      options.appendChild(btn);
    });

    card.appendChild(options);
    root.appendChild(card);
  }

  function renderResult(root) {
    const r = test.result;
    const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
    const passed = pct >= PASS_PERCENT;

    const box = el("div", "quiz-result" + (passed ? "" : " is-failed"));
    box.appendChild(el("p", "quiz-count", passed ? "Test complete" : "Test complete, not passed"));
    box.appendChild(el("p", "quiz-score", r.score + " out of " + r.total));
    box.appendChild(el("p", "quiz-time", "Time: " + fmtTime(r.seconds)));

    let message;
    if (r.score === r.total) message = "Perfect score. You are Sure and Steadfast.";
    else if (passed) message = "Well done. You passed.";
    else message = "The pass mark is " + PASS_PERCENT + " percent. Read the topics again and try once more.";
    box.appendChild(el("p", null, message));

    if (test.missed.length > 0) {
      box.appendChild(el("h3", "review-title", "Review your mistakes"));
      const list = el("ul", "review-list");
      test.missed.forEach((m) => {
        const li = el("li");
        li.appendChild(el("p", "review-q", m.q));
        li.appendChild(el("p", "review-a", "Right answer: " + m.right));
        li.appendChild(el("p", "review-x", m.explain));
        list.appendChild(li);
      });
      box.appendChild(list);
    }

    const again = el("button", "btn btn-primary", "Try again");
    again.type = "button";
    again.addEventListener("click", () => {
      test.stage = "start";
      renderQuiz();
    });
    box.appendChild(again);

    const back = el("a", "btn btn-outline", "Back to Learn");
    back.href = "#learn";
    box.appendChild(back);

    root.appendChild(box);
    addBoard(root);
  }

  function renderFailed(root) {
    const box = el("div", "quiz-result is-failed");
    box.appendChild(el("p", "quiz-score", "Test failed"));
    box.appendChild(el("p", null, test.notice || "You left the test, so it was marked as failed."));

    const again = el("button", "btn btn-primary", "Try again");
    again.type = "button";
    again.addEventListener("click", () => {
      test.stage = "start";
      renderQuiz();
    });
    box.appendChild(again);

    const back = el("a", "btn btn-outline", "Back to Learn");
    back.href = "#learn";
    box.appendChild(back);

    root.appendChild(box);
    addBoard(root);

    // The failure has been shown once. Next visit starts fresh.
    test.notice = "";
    test.stage = "start";
  }

  function renderQuiz() {
    const root = document.getElementById("quiz-root");
    if (!root) return;
    clear(root);

    if (DATA.quiz.length === 0) {
      root.appendChild(el("p", null, "No questions yet. Add some in data.js."));
      return;
    }

    if (test.stage === "running") renderRunning(root);
    else if (test.stage === "result") renderResult(root);
    else if (test.stage === "failed") renderFailed(root);
    else renderStart(root);
  }

  // ---------- Flashcards ----------

  let flashIndex = 0;
  let flashBack = false;

  function renderFlash(restart) {
    const root = document.getElementById("flash-root");
    if (!root) return;
    if (restart) {
      flashIndex = 0;
      flashBack = false;
    }
    clear(root);

    const cards = DATA.quiz;
    if (cards.length === 0) {
      root.appendChild(el("p", null, "No cards yet. Add some questions in data.js."));
      return;
    }

    const item = cards[flashIndex];
    root.appendChild(el("p", "quiz-count", "Card " + (flashIndex + 1) + " of " + cards.length));

    const card = el("button", "flashcard" + (flashBack ? " is-back" : ""));
    card.type = "button";
    card.setAttribute("aria-label", flashBack ? "Answer. Press to see the question." : "Question. Press to see the answer.");
    if (flashBack) {
      card.appendChild(el("span", "flash-label", "Answer"));
      card.appendChild(el("span", "flash-main", item.options[item.answer]));
      card.appendChild(el("span", "flash-sub", item.explain));
    } else {
      card.appendChild(el("span", "flash-label", "Question"));
      card.appendChild(el("span", "flash-main", item.q));
      card.appendChild(el("span", "flash-sub", "Press to flip"));
    }
    card.addEventListener("click", () => {
      flashBack = !flashBack;
      renderFlash();
      const fresh = root.querySelector(".flashcard");
      if (fresh) fresh.focus();
    });
    root.appendChild(card);

    const nav = el("div", "flash-nav");

    const prev = el("button", "btn btn-outline", "Previous");
    prev.type = "button";
    prev.addEventListener("click", () => {
      flashIndex = (flashIndex - 1 + cards.length) % cards.length;
      flashBack = false;
      renderFlash();
    });

    const nextBtn = el("button", "btn btn-primary", "Next");
    nextBtn.type = "button";
    nextBtn.addEventListener("click", () => {
      flashIndex = (flashIndex + 1) % cards.length;
      flashBack = false;
      renderFlash();
    });

    nav.appendChild(prev);
    nav.appendChild(nextBtn);
    root.appendChild(nav);
  }

  // ---------- Page switching ----------
  // Everything lives in index.html. The home page is #home and every
  // other page is an element with class "view". The link's #id decides
  // which one is shown.

  const homeEl = document.getElementById("home");
  const viewEls = document.querySelectorAll(".view");
  let currentViewId = null;

  function renderView(id) {
    switch (id) {
      case "learn-ranks": renderRanks(); break;
      case "learn-uniform": renderUniform(); break;
      case "learn-history": renderHistory(); break;
      case "learn-quiz":
        if (test.stage === "result") test.stage = "start";
        renderQuiz();
        break;
      case "learn-flashcards": renderFlash(true); break;
      default: break;
    }
    paintProgress();
  }

  function renderCurrentView() {
    if (!currentViewId) return;
    // Re-draw text for the new reading level. A running test is never touched.
    switch (currentViewId) {
      case "learn-ranks": renderRanks(); break;
      case "learn-uniform": renderUniform(); break;
      case "learn-history": renderHistory(); break;
      default: break;
    }
  }

  function showPage() {
    if (!homeEl) return;

    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;

    // Going to any other page during the test means leaving it
    if (test.stage === "running" && id !== "learn-quiz") {
      abandonTest("You left the test, so it was marked as failed.");
    }

    viewEls.forEach((view) => { view.hidden = true; });

    if (target && target.classList.contains("view")) {
      currentViewId = id;
      homeEl.hidden = true;
      target.hidden = false;
      window.scrollTo(0, 0);
      renderView(id);

      const heading = target.querySelector("h1");
      if (heading) {
        document.title = heading.textContent + " - " + SITE_NAME;
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    } else {
      currentViewId = null;
      homeEl.hidden = false;
      document.title = SITE_NAME;
      paintProgress();
      refreshBoards();

      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    }
  }

  window.addEventListener("hashchange", showPage);

  // On every fresh load or reload, start at the home page.
  // This removes any leftover #page from the address bar.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  showPage();

  // ---------- Hero squad marches in ----------

  const heroRanks = document.getElementById("hero-ranks");
  if (heroRanks) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroRanks.classList.add("is-in"));
    });
  }

  // ---------- Contact form (EmailJS) ----------

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  let emailReady = false;
  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailReady = true;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.elements["name"].value.trim();
      const email = contactForm.elements["email"].value.trim();
      const message = contactForm.elements["message"].value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in every field.";
        return;
      }

      if (!emailReady) {
        formStatus.textContent = "The message service did not load. Please use the WhatsApp button to reach us.";
        return;
      }

      const button = contactForm.querySelector("button[type='submit']");
      const originalText = button ? button.textContent : "Send message";
      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }
      formStatus.textContent = "";

      // The field names match the church template (name, email,
      // phone_number, message). This form has no phone box, so a
      // note is sent in its place.
      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          name: name,
          email: email,
          phone_number: "Not provided (Boys' Brigade website form)",
          message: message
        })
        .then(() => {
          formStatus.textContent = "Thank you! Your message has been sent.";
          contactForm.reset();
        })
        .catch((error) => {
          console.error("EmailJS error:", error);
          formStatus.textContent = "Sorry, your message could not be sent. Please try again.";
        })
        .finally(() => {
          if (button) {
            button.disabled = false;
            button.textContent = originalText;
          }
        });
    });
  }
})();