// The Boys' Brigade Nigeria - main.js
// Needs data.js to be loaded first (index.html already does this).

(function () {
  "use strict";

  const SITE_NAME = "The Boys' Brigade Nigeria";

  // EmailJS (same account as the church website)
  const EMAILJS_PUBLIC_KEY = "65PVnw82yNxjPY7rA";
  const EMAILJS_SERVICE_ID = "service_jddvkmp";
  const EMAILJS_TEMPLATE_ID = "template_0u94vmg";

  // Shared online leaderboard (Google Sheet through Apps Script)
  const BOARD_URL = "https://script.google.com/macros/s/AKfycby3NyrLeCDM-9ZdPUsk698nkjJFElRxzrFWRC8Oi1ubOdT76kmuxIRgcg2Uzny_qWcQ/exec";
  const BOARD_SIZE = 10;
  const PASS_PERCENT = 50;
  const ACTIVE_KEY = "bb-test-active";
  const TAKEN_KEY = "bb-taken";

  const DATA = window.BB_DATA || { ranks: [], officers: [], uniform: [], history: [], quiz: [], flashcards: [] };
  const TOPICS = ["ranks", "uniform", "history"];

  // Test settings come from data.js (minutes and the list of sections)
  const TEST_CONFIG = DATA.test || {};
  const TIME_LIMIT_SECONDS = Math.round((TEST_CONFIG.minutes || 5) * 60);
  const SECTIONS = TEST_CONFIG.sections || [
    { id: "ranks", name: "Ranks" },
    { id: "uniform", name: "Uniform" },
    { id: "history", name: "History" }
  ];

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

  function sectionName(id) {
    const found = SECTIONS.find((s) => s.id === id);
    return found ? found.name : id;
  }

  function questionsFor(sectionId) {
    return DATA.quiz.filter((item) => item.topic === sectionId);
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
      textEl.textContent = "All topics learned. Now take the tests to prove it.";
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

  // ---------- "Take the test" button at the end of each section ----------

  let pendingSection = null;

  function addTestCta(viewId, sectionId) {
    const view = document.getElementById(viewId);
    if (!view) return;
    if (view.querySelector(".test-cta")) return;

    const count = questionsFor(sectionId).length;
    const box = el("div", "test-cta");
    box.appendChild(el("h2", null, "Test yourself: " + sectionName(sectionId)));
    box.appendChild(el("p", null,
      count + " questions, " + fmtTime(TIME_LIMIT_SECONDS) + " on the clock. You can take this test only once."));

    const btn = el("button", "btn btn-primary", "Take the " + sectionName(sectionId) + " test");
    btn.type = "button";
    btn.addEventListener("click", () => {
      pendingSection = sectionId;
      window.location.hash = "learn-quiz";
    });
    box.appendChild(btn);

    const wrap = view.querySelector(".wrap") || view;
    wrap.appendChild(box);
  }

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

    addTestCta("learn-ranks", "ranks");
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

    addTestCta("learn-uniform", "uniform");
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

    addTestCta("learn-history", "history");
  }

  // ---------- Names on the leaderboard ----------
  // The sheet stores one "name" per row, so the person and the section
  // are packed together like this:  "John Doe | ranks"

  function cleanPart(text) {
    return String(text || "").replace(/\|/g, "").replace(/\s+/g, " ").trim();
  }

  function packName(first, surname, sectionId) {
    return (cleanPart(first) + " " + cleanPart(surname) + " | " + sectionId).slice(0, 70);
  }

  function unpackName(raw) {
    const text = String(raw || "");
    const i = text.lastIndexOf(" | ");
    if (i === -1) return { person: text.trim(), section: "" };
    return { person: text.slice(0, i).trim(), section: text.slice(i + 3).trim() };
  }

  function personKey(person, sectionId) {
    return person.toLowerCase().replace(/\s+/g, " ") + "|" + sectionId;
  }

  // ---------- One attempt only ----------

  function localTaken() {
    try {
      const raw = store(TAKEN_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function markTaken(key) {
    const list = localTaken();
    if (!list.includes(key)) list.push(key);
    store(TAKEN_KEY, JSON.stringify(list));
  }

  // Resolves to true if this person has already taken this section's test
  // (checked on this device first, then on the shared leaderboard).
  function alreadyTaken(person, sectionId) {
    const key = personKey(person, sectionId);
    if (localTaken().includes(key)) return Promise.resolve(true);

    return loadBoard().then((list) =>
      list.some((entry) => {
        const u = unpackName(entry.name);
        return u.section === sectionId && personKey(u.person, u.section) === key;
      })
    );
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
        mode: "no-cors",
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
      const raw = String(entry.name || "").trim().slice(0, 70);
      if (!raw) return;
      const u = unpackName(raw);
      const key = raw.toLowerCase();
      const row = {
        name: raw,
        person: u.person,
        section: u.section,
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

  function buildTable(rows) {
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
      tr.appendChild(el("td", "board-name", entry.person));
      tr.appendChild(el("td", null, done ? entry.score + "/" + entry.total : "-"));
      tr.appendChild(el("td", null, done ? fmtTime(entry.seconds) : "-"));
      tr.appendChild(el("td", null, resultLabel(entry)));
      body.appendChild(tr);
    });
    table.appendChild(body);

    const scroller = el("div", "board-scroll");
    scroller.appendChild(table);
    return scroller;
  }

  function renderBoardInto(box) {
    clear(box);
    const only = box.dataset.section || "";

    box.appendChild(el("h3", "board-title", "Leaderboard" + (only ? ": " + sectionName(only) : "")));
    box.appendChild(el("p", "board-note",
      BOARD_URL ? "Shared by everyone who takes the tests." : "Scores are saved on this device."));

    const holder = el("div", "board-holder", "Loading...");
    box.appendChild(holder);

    loadBoard().then((list) => {
      const rows = bestPerName(list);
      clear(holder);

      const groups = only ? [{ id: only, name: sectionName(only) }] : SECTIONS.slice();
      if (!only && rows.some((r) => !r.section)) groups.push({ id: "", name: "Earlier test" });

      let shown = false;
      groups.forEach((group) => {
        const groupRows = rows.filter((r) => r.section === group.id).slice(0, BOARD_SIZE);
        if (groupRows.length === 0) return;
        shown = true;
        if (!only) holder.appendChild(el("h4", "board-section", group.name));
        holder.appendChild(buildTable(groupRows));
      });

      if (!shown) holder.appendChild(el("p", "board-empty", "No scores yet. Be the first."));
    });
  }

  function refreshBoards() {
    document.querySelectorAll("[data-board]").forEach(renderBoardInto);
  }

  function addBoard(parent, sectionId) {
    const box = el("div", "leaderboard");
    box.setAttribute("data-board", "");
    box.dataset.section = sectionId || "";
    parent.appendChild(box);
    renderBoardInto(box);
  }

  // A leaderboard also sits in the Learn section on the home page
  const learnWrap = document.querySelector("#learn .wrap");
  if (learnWrap) {
    const homeBoard = el("div", "leaderboard");
    homeBoard.setAttribute("data-board", "");
    homeBoard.dataset.section = "";
    learnWrap.appendChild(homeBoard);
  }

  // ---------- Timed test (countdown) ----------

  const test = {
    stage: "start",   // start | running | result | failed
    section: "",
    first: "",
    surname: "",
    person: "",
    packed: "",
    key: "",
    order: [],
    index: 0,         // question shown on screen
    answered: 0,      // questions already answered
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

  function remaining() {
    return Math.max(0, TIME_LIMIT_SECONDS - elapsed());
  }

  function stopTimer() {
    if (test.timerId) {
      clearInterval(test.timerId);
      test.timerId = null;
    }
  }

  // Shows the time left. Turns red for the last 30 seconds.
  function paintClock() {
    const t = document.getElementById("quiz-timer");
    if (!t) return;
    const left = remaining();
    t.textContent = fmtTime(left);
    if (t.parentNode) {
      t.parentNode.style.background = left <= 30 ? "#A3322B" : "";
    }
  }

  function startTimer() {
    stopTimer();
    test.timerId = setInterval(() => {
      paintClock();
      if (remaining() <= 0) timeUp();
    }, 250);
  }

  function buildQuestions(sectionId) {
    return shuffle(questionsFor(sectionId)).map((item) => ({
      q: item.q,
      explain: item.explain,
      options: shuffle(item.options.map((text, i) => ({ text: text, correct: i === item.answer })))
    }));
  }

  function startTest(first, surname, sectionId) {
    test.section = sectionId;
    test.first = cleanPart(first);
    test.surname = cleanPart(surname);
    test.person = test.first + " " + test.surname;
    test.packed = packName(test.first, test.surname, sectionId);
    test.key = personKey(test.person, sectionId);

    test.order = buildQuestions(sectionId);
    test.index = 0;
    test.answered = 0;
    test.score = 0;
    test.missed = [];
    test.result = null;
    test.notice = "";
    test.start = Date.now();
    test.stage = "running";

    store("bb-first", test.first);
    store("bb-surname", test.surname);

    // The attempt counts from this moment, even if the page is closed.
    markTaken(test.key);

    // If the page is closed or reloaded mid-test, this marker is found
    // on the next load and the test is recorded as failed.
    store(ACTIVE_KEY, JSON.stringify({ packed: test.packed, total: test.order.length }));

    startTimer();
    renderQuiz();
  }

  function finishTest(timedOut) {
    stopTimer();
    const seconds = timedOut ? TIME_LIMIT_SECONDS : Math.min(elapsed(), TIME_LIMIT_SECONDS);
    unstore(ACTIVE_KEY);

    const total = test.order.length;
    saveEntry({
      name: test.packed,
      section: test.section,
      score: test.score,
      total: total,
      seconds: seconds,
      status: "done",
      at: Date.now()
    });

    test.result = { score: test.score, total: total, seconds: seconds, timedOut: !!timedOut };
    test.stage = "result";
    renderQuiz();
  }

  // The clock reached zero: unanswered questions count as wrong
  function timeUp() {
    if (test.stage !== "running") return;

    test.order.slice(test.answered).forEach((item) => {
      const right = item.options.find((o) => o.correct);
      test.missed.push({ q: item.q, yours: "No answer", right: right ? right.text : "", explain: item.explain });
    });

    finishTest(true);
  }

  function abandonTest(reason) {
    if (test.stage !== "running") return;
    stopTimer();
    unstore(ACTIVE_KEY);

    saveEntry({
      name: test.packed,
      section: test.section,
      score: 0,
      total: test.order.length,
      seconds: 0,
      status: "left",
      at: Date.now()
    });

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
        name: String(info.packed || "Unknown | ").slice(0, 70),
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

  // Small registration form shown before every test
  function renderStart(root) {
    const card = el("div", "quiz-card");

    if (test.notice) {
      card.appendChild(el("p", "quiz-notice", test.notice));
      test.notice = "";
    }

    card.appendChild(el("h2", "quiz-question", "Register for the test"));

    const rules = el("ul", "quiz-rules");
    [
      "The clock counts down from " + fmtTime(TIME_LIMIT_SECONDS) + " the moment you press Start test.",
      "When time runs out, the test ends and unanswered questions count as wrong.",
      "You cannot go back. Each answer locks as soon as you pick it.",
      "If you leave the test, switch tabs or apps, refresh or press Back, you fail.",
      "You can take each section's test only once. No second attempt.",
      "Your name, score and time go on the leaderboard."
    ].forEach((text) => rules.appendChild(el("li", null, text)));
    card.appendChild(rules);

    // First name
    const firstLabel = el("label", "quiz-label", "First name");
    firstLabel.setAttribute("for", "quiz-first");
    card.appendChild(firstLabel);

    const firstInput = el("input", "quiz-name");
    firstInput.id = "quiz-first";
    firstInput.type = "text";
    firstInput.maxLength = 20;
    firstInput.autocomplete = "given-name";
    firstInput.value = store("bb-first") || "";
    card.appendChild(firstInput);

    // Surname
    const surLabel = el("label", "quiz-label", "Surname");
    surLabel.setAttribute("for", "quiz-surname");
    card.appendChild(surLabel);

    const surInput = el("input", "quiz-name");
    surInput.id = "quiz-surname";
    surInput.type = "text";
    surInput.maxLength = 20;
    surInput.autocomplete = "family-name";
    surInput.value = store("bb-surname") || "";
    card.appendChild(surInput);

    // Section
    const secLabel = el("label", "quiz-label", "Section");
    secLabel.setAttribute("for", "quiz-section");
    card.appendChild(secLabel);

    const select = el("select", "quiz-name");
    select.id = "quiz-section";
    const blank = el("option", null, "Choose a section");
    blank.value = "";
    select.appendChild(blank);
    SECTIONS.forEach((s) => {
      const opt = el("option", null, s.name);
      opt.value = s.id;
      select.appendChild(opt);
    });
    if (pendingSection) {
      select.value = pendingSection;
      pendingSection = null;
    }
    card.appendChild(select);

    const info = el("p", "quiz-note");
    card.appendChild(info);

    function updateInfo() {
      if (!select.value) {
        info.textContent = "";
        return;
      }
      info.textContent = questionsFor(select.value).length + " questions in " +
        fmtTime(TIME_LIMIT_SECONDS) + ".";
    }
    select.addEventListener("change", updateInfo);
    updateInfo();

    const status = el("p", "quiz-feedback bad");
    status.setAttribute("role", "status");
    card.appendChild(status);

    const go = el("button", "btn btn-primary", "Start test");
    go.type = "button";
    go.addEventListener("click", () => {
      const first = cleanPart(firstInput.value);
      const surname = cleanPart(surInput.value);
      const sectionId = select.value;

      if (first.length < 2) {
        status.textContent = "Please type your first name.";
        firstInput.focus();
        return;
      }
      if (surname.length < 2) {
        status.textContent = "Please type your surname.";
        surInput.focus();
        return;
      }
      if (!sectionId) {
        status.textContent = "Please choose a section.";
        select.focus();
        return;
      }
      if (questionsFor(sectionId).length === 0) {
        status.textContent = "This section has no questions yet.";
        return;
      }

      go.disabled = true;
      status.textContent = "Checking...";

      alreadyTaken(first + " " + surname, sectionId).then((taken) => {
        if (taken) {
          go.disabled = false;
          status.textContent = first + " " + surname + " has already taken the " +
            sectionName(sectionId) + " test. Each person can take it only once.";
          return;
        }
        startTest(first, surname, sectionId);
      });
    });
    card.appendChild(go);

    root.appendChild(card);
    addBoard(root, "");
  }

  function renderRunning(root) {
    const total = test.order.length;
    const item = test.order[test.index];

    const card = el("div", "quiz-card");

    const top = el("div", "quiz-top");
    top.appendChild(el("p", "quiz-count",
      sectionName(test.section) + ": question " + (test.index + 1) + " of " + total));
    const clock = el("p", "quiz-clock");
    clock.appendChild(el("span", "quiz-clock-label", "Time left "));
    const timer = el("span", "quiz-timer", fmtTime(remaining()));
    timer.id = "quiz-timer";
    clock.appendChild(timer);
    if (remaining() <= 30) clock.style.background = "#A3322B";
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
        test.answered++;

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
          if (test.index >= total) finishTest(false);
          else renderQuiz();
        }, 700);
      });
      options.appendChild(btn);
    });

    card.appendChild(options);
    root.appendChild(card);
  }

  function addExitButtons(box) {
    const another = el("button", "btn btn-primary", "Take another section's test");
    another.type = "button";
    another.addEventListener("click", () => {
      test.stage = "start";
      renderQuiz();
    });
    box.appendChild(another);

    const back = el("a", "btn btn-outline", "Back to Learn");
    back.href = "#learn";
    box.appendChild(back);
  }

  function renderResult(root) {
    const r = test.result;
    const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
    const passed = pct >= PASS_PERCENT;

    const box = el("div", "quiz-result" + (passed ? "" : " is-failed"));

    let heading = passed ? "Test complete" : "Test complete, not passed";
    if (r.timedOut) heading = "Time is up";
    box.appendChild(el("p", "quiz-count", heading + " - " + sectionName(test.section) + " - " + test.person));

    box.appendChild(el("p", "quiz-score", r.score + " out of " + r.total));
    box.appendChild(el("p", "quiz-time",
      (r.timedOut ? "Time ran out at " : "Time used: ") + fmtTime(r.seconds)));

    let message;
    if (r.score === r.total) message = "Perfect score. You are Sure and Steadfast.";
    else if (passed) message = "Well done. You passed.";
    else message = "The pass mark is " + PASS_PERCENT + " percent. Read the topic again with the flip cards. You cannot retake this test.";
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

    addExitButtons(box);

    root.appendChild(box);
    addBoard(root, test.section);
  }

  function renderFailed(root) {
    const box = el("div", "quiz-result is-failed");
    box.appendChild(el("p", "quiz-score", "Test failed"));
    box.appendChild(el("p", null, test.notice || "You left the test, so it was marked as failed."));
    box.appendChild(el("p", null, "This test cannot be taken again."));

    addExitButtons(box);

    root.appendChild(box);
    addBoard(root, test.section);

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

  // ---------- Flip cards (key notes) ----------

  let flashTopic = "all";
  let flashIndex = 0;
  let flashBack = false;

  function flashDeck() {
    const all = DATA.flashcards || [];
    return flashTopic === "all" ? all : all.filter((c) => c.topic === flashTopic);
  }

  function renderFlash(restart) {
    const root = document.getElementById("flash-root");
    if (!root) return;
    if (restart) {
      flashIndex = 0;
      flashBack = false;
    }
    clear(root);

    if (!DATA.flashcards || DATA.flashcards.length === 0) {
      root.appendChild(el("p", null, "No cards yet. Add some in data.js."));
      return;
    }

    // Topic buttons
    const filters = el("div", "flash-filters");
    [{ id: "all", name: "All" }].concat(SECTIONS).forEach((s) => {
      const b = el("button", "btn btn-outline", s.name);
      b.type = "button";
      b.setAttribute("aria-pressed", String(flashTopic === s.id));
      b.addEventListener("click", () => {
        flashTopic = s.id;
        flashIndex = 0;
        flashBack = false;
        renderFlash();
      });
      filters.appendChild(b);
    });
    root.appendChild(filters);

    const cards = flashDeck();
    if (cards.length === 0) {
      root.appendChild(el("p", null, "No cards in this topic yet."));
      return;
    }
    if (flashIndex >= cards.length) flashIndex = 0;

    const item = cards[flashIndex];
    root.appendChild(el("p", "quiz-count", sectionName(item.topic) + ": card " + (flashIndex + 1) + " of " + cards.length));

    const card = el("button", "flashcard" + (flashBack ? " is-back" : ""));
    card.type = "button";
    card.setAttribute("aria-label", flashBack ? "Answer. Press to see the question." : "Question. Press to see the answer.");
    if (flashBack) {
      card.appendChild(el("span", "flash-label", "Answer"));
      card.appendChild(el("span", "flash-main", item.back));
    } else {
      card.appendChild(el("span", "flash-label", "Question"));
      card.appendChild(el("span", "flash-main", item.front));
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

    const shuffleBtn = el("button", "btn btn-outline", "Shuffle");
    shuffleBtn.type = "button";
    shuffleBtn.addEventListener("click", () => {
      DATA.flashcards = shuffle(DATA.flashcards);
      flashIndex = 0;
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
    nav.appendChild(shuffleBtn);
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