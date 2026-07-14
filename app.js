/* ============================ 10-минутный тренер / 10-Minute Coach ============================ */
(function () {
  'use strict';
  var A = window.APP;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  /* ---------- Тайминги ---------- */
  var WORK = 45, WORK_SIDE = 50, REST = 15, REST_EX = 20, WARMUP = 60, SETS = 2;

  /* ---------- Язык ---------- */
  function detectLang() {
    var v = load('coach_lang', null);
    if (v === 'ru' || v === 'en') return v;
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('ru') === 0 ? 'ru' : 'en';
  }
  var lang = detectLang();
  function L(v) { return A.pick(v, lang); }

  /* ---------- Строки интерфейса ---------- */
  var STR = {
    ru: {
      brand: '10-минутный тренер', title: '10-минутный тренер', install: 'Установить',
      now: 'Сейчас', min10: '10 мин', minShort: 'мин',
      exercises: 'Упражнения', whatToDo: 'Что делать',
      repeat: 'повтор', lightDay: 'лёгкий день', start: 'Начать',
      rounds: function (n) { return n + ' круг' + (n === 1 ? '' : (n < 5 ? 'а' : 'ов')); },
      sets: function (n) { return n + ' подход' + (n === 1 ? '' : (n < 5 ? 'а' : 'ов')); },
      setLbl: function (n) { return 'подход ' + n; },
      structTitle: 'Структура 10 минут', weightTitle: 'Вес', kneesTitle: 'Колени — очень мягко', tempoTitle: 'Темп',
      accProgress: 'Как прогрессировать', accForm: 'Делайте правильно', accStop: 'Когда остановиться',
      motto: 'Регулярность важнее идеальности.<br>30 минут каждый день — уже победа! 🏆',
      phWarm: 'Разминка', phEx: 'Упражнение', phRest: 'Отдых', phRestNew: 'Отдых · новый круг', phActivity: 'Активность',
      warmName: 'Разминка', warmSub: 'Лёгкие движения, разогрев суставов',
      restName: 'Отдых', restSub: 'Восстановите дыхание',
      next: 'Дальше:', lastEx: 'Последнее упражнение 💪', easyEnjoy: 'Спокойно и в удовольствие',
      exOf: function (i, m, r, rs) { return 'Упражнение ' + i + ' из ' + m + ' · подход ' + r + '/' + rs; },
      switchSides: 'Смените сторону',
      back: 'Назад', pause: 'Пауза', resume: 'Продолжить', skip: 'Пропустить',
      doneH: 'Готово!', doneSub: function (b) { return 'Блок «' + b + '» завершён. Регулярность важнее идеальности — так держать!'; },
      nextBlock: function (b) { return 'Дальше: ' + b + ' (10 мин)'; }, home: 'На главную', greatDay: 'Отличный день! 💪',
      iosHint: 'Чтобы установить: <b>Поделиться</b> → <b>На экран «Домой»</b>',
      spWarm: 'Разминка', spRest: 'Отдых', spRestNew: 'Отдых. Новый круг', spDone: 'Готово! Отличная работа',
      speechLang: 'ru-RU', htmlLang: 'ru'
    },
    en: {
      brand: '10-Minute Coach', title: '10-Minute Coach', install: 'Install',
      now: 'Now', min10: '10 min', minShort: 'min',
      exercises: 'Exercises', whatToDo: 'What to do',
      repeat: 'repeat', lightDay: 'light day', start: 'Start',
      rounds: function (n) { return n + ' round' + (n === 1 ? '' : 's'); },
      sets: function (n) { return n + ' set' + (n === 1 ? '' : 's'); },
      setLbl: function (n) { return 'set ' + n; },
      structTitle: '10-minute structure', weightTitle: 'Weight', kneesTitle: 'Knees — very gently', tempoTitle: 'Tempo',
      accProgress: 'How to progress', accForm: 'Do it right', accStop: 'When to stop',
      motto: 'Consistency beats perfection.<br>30 minutes a day is already a win! 🏆',
      phWarm: 'Warm-up', phEx: 'Exercise', phRest: 'Rest', phRestNew: 'Rest · new round', phActivity: 'Activity',
      warmName: 'Warm-up', warmSub: 'Light movements, joint warm-up',
      restName: 'Rest', restSub: 'Catch your breath',
      next: 'Next:', lastEx: 'Last exercise 💪', easyEnjoy: 'Easy and enjoyable',
      exOf: function (i, m, r, rs) { return 'Exercise ' + i + ' of ' + m + ' · set ' + r + '/' + rs; },
      switchSides: 'Switch sides',
      back: 'Back', pause: 'Pause', resume: 'Resume', skip: 'Skip',
      doneH: 'Done!', doneSub: function (b) { return 'Block "' + b + '" complete. Consistency beats perfection — keep it up!'; },
      nextBlock: function (b) { return 'Next: ' + b + ' (10 min)'; }, home: 'Home', greatDay: 'Great day! 💪',
      iosHint: 'To install: <b>Share</b> → <b>Add to Home Screen</b>',
      spWarm: 'Warm-up', spRest: 'Rest', spRestNew: 'Rest. New round', spDone: 'Done! Great work',
      speechLang: 'en-US', htmlLang: 'en'
    }
  };
  function S() { return STR[lang]; }

  /* ---------- Состояние ---------- */
  var todayDow = new Date().getDay();
  var state = { dow: todayDow, block: nowBlockKey() };

  function nowBlockKey() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'day';
    return 'evening';
  }
  function isNowSelected() { return state.dow === new Date().getDay() && state.block === nowBlockKey(); }
  function fmtClock() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function dispTime(sec) { sec = Math.max(0, Math.round(sec)); return sec >= 60 ? mmss(sec) : String(sec); }

  /* ---------- Длительность блока ---------- */
  function blockDuration(block) {
    if (block.mode === 'single') return block.ex[0].s || 600;
    var sets = block.rounds || (block.mode === 'circuit' ? 1 : SETS);
    var warm = block.warmup != null ? block.warmup : WARMUP;
    var total = warm, count = block.ex.length;
    for (var i = 0; i < count; i++) {
      for (var st = 1; st <= sets; st++) {
        total += workSecs(block.ex[i]).dur;
        var last = (i === count - 1 && st === sets);
        if (!last) total += (st < sets) ? REST : REST_EX;
      }
    }
    return total;
  }
  function workSecs(ex) {
    if (ex.side) { var base = ex.s ? ex.s * 2 : WORK_SIDE; return { dur: base, switchAt: Math.round(base / 2) }; }
    return { dur: ex.s || WORK, switchAt: 0 };
  }

  function repsHtml(ex) {
    return L(ex.r).replace(/\/\s*(нога|сторона|рука|leg|side|arm)/i, '<span class="side-tag">/ $1</span>');
  }

  /* ============================ ГЛАВНЫЙ ЭКРАН ============================ */
  function renderTopbar() {
    $('#brandText').textContent = S().brand;
    var lt = $('#langToggle');
    lt.innerHTML = ['ru', 'en'].map(function (lc) {
      return '<button data-lang="' + lc + '" class="' + (lc === lang ? 'on' : '') + '">' + lc.toUpperCase() + '</button>';
    }).join('');
    lt.onclick = function (e) {
      var b = e.target.closest('[data-lang]'); if (!b) return;
      setLang(b.getAttribute('data-lang'));
    };
    var ib = $('#installBtn'); if (ib) ib.textContent = S().install;
  }

  function renderDayRow() {
    var row = $('#dayRow'); row.innerHTML = '';
    [1, 2, 3, 4, 5, 6, 0].forEach(function (dow) {
      var w = A.WEEK[dow];
      var c = el('button', 'day-chip');
      if (dow === todayDow) c.classList.add('today');
      if (dow === state.dow) c.classList.add('sel');
      if (w.recovery) c.classList.add('rest');
      c.innerHTML = '<span class="dc-num">' + (w.recovery ? '☺' : w.letter) + '</span>' +
        '<span class="dc-name">' + L(w.short) + '</span>';
      c.addEventListener('click', function () { state.dow = dow; renderAll(); });
      row.appendChild(c);
    });
  }

  function renderHero() {
    var hero = $('#hero');
    var w = A.WEEK[state.dow];
    var block = A.blockFor(state.dow, state.block);
    hero.className = 'hero ' + state.block;

    var now = isNowSelected();
    var nowLabel = now
      ? '<span class="hero-now"><span class="dot"></span>' + S().now + ' · ' + fmtClock() + '</span>'
      : '<span class="hero-now" style="color:var(--muted)">' + L(w.title) + '</span>';

    var seg = A.BLOCK_KEYS.map(function (k) {
      return '<button data-block="' + k + '" class="' + (k === state.block ? 'on' : '') + '">' +
        L(A.BLOCK_LABELS[k]) + '<span class="sg-sub">' + S().min10 + '</span></button>';
    }).join('');

    var lightBadge = w.light ? ' · <span class="light-badge">' + S().lightDay + '</span>' : '';
    var repeatBadge = w.repeat ? ' · ' + S().repeat : '';
    var dur = blockDuration(block);

    hero.innerHTML =
      '<div class="hero-top">' + nowLabel + '<span class="hero-daytag">' + L(w.tag) + '</span></div>' +
      '<div class="seg" id="seg">' + seg + '</div>' +
      '<div class="hero-title">' + L(block.title) + '</div>' +
      '<div class="hero-sub">' + L(w.title) + repeatBadge + lightBadge + ' · ~' + mmss(dur) + '</div>' +
      '<button class="btn-start" id="startBtn">▶ ' + S().start + ' <span class="b-time">· ' + L(A.BLOCK_LABELS[state.block]) + '</span></button>';

    $('#seg').addEventListener('click', function (e) {
      var b = e.target.closest('[data-block]'); if (!b) return;
      state.block = b.getAttribute('data-block'); renderAll();
    });
    $('#startBtn').addEventListener('click', function () { Player.open(state.dow, state.block); });
  }

  function renderExList() {
    var wrap = $('#exList');
    var block = A.blockFor(state.dow, state.block);
    wrap.style.setProperty('--accent',
      state.block === 'morning' ? 'var(--morning)' : state.block === 'day' ? 'var(--day)' : 'var(--evening)');

    var rounds = block.rounds || SETS;
    var head = '<div class="exlist-head"><h2>' +
      (block.mode === 'single' ? S().whatToDo : S().exercises) + '</h2><span class="ex-reps">' +
      (block.mode === 'single' ? '' : (block.mode === 'circuit' ? S().rounds(rounds) : S().sets(rounds))) + '</span></div>';

    var cards = block.ex.map(function (ex, i) {
      return '<div class="ex-card">' +
        '<div class="ex-thumb">' + A.svgFor(ex.p) + '</div>' +
        '<div class="ex-info"><div class="ex-name">' + L(ex.n) + '</div>' +
        '<div class="ex-reps">' + repsHtml(ex) + '</div></div>' +
        '<div class="ex-num">' + (i + 1) + '</div></div>';
    }).join('');

    wrap.innerHTML = head + cards;
  }

  function renderReference() {
    var I = A.INFO[lang];
    var ref = $('#reference');
    var li = function (arr) { return '<ul>' + arr.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; };
    ref.innerHTML =
      '<div class="note-row">' +
        '<div class="nr"><b>' + S().structTitle + '</b>' + I.structure + '</div>' +
        '<div class="nr"><b>' + S().weightTitle + '</b>' + I.weight + '</div>' +
        '<div class="nr knees"><b>' + S().kneesTitle + '</b>' + I.knees + '</div>' +
        '<div class="nr"><b>' + S().tempoTitle + '</b>' + I.tempo + '</div>' +
      '</div>' +
      '<details class="acc prog"><summary><span class="ico">📈</span>' + S().accProgress + '<span class="chev">›</span></summary><div class="acc-body">' + li(I.progress) + '</div></details>' +
      '<details class="acc good"><summary><span class="ico">✅</span>' + S().accForm + '<span class="chev">›</span></summary><div class="acc-body">' + li(I.form) + '</div></details>' +
      '<details class="acc stop"><summary><span class="ico">⛔</span>' + S().accStop + '<span class="chev">›</span></summary><div class="acc-body">' + li(I.stop) + '</div></details>';
  }

  function renderAll() {
    document.documentElement.lang = S().htmlLang;
    document.title = S().title;
    renderTopbar();
    renderDayRow();
    renderHero();
    renderExList();
    renderReference();
    $('#motto').innerHTML = S().motto;
    var ih = $('#iosHintText'); if (ih) ih.innerHTML = S().iosHint;
  }

  function setLang(l) {
    if (l === lang) return;
    lang = l; save('coach_lang', l);
    renderAll();
  }

  /* ============================ ПЛЕЕР ============================ */
  var Player = (function () {
    var root = $('#player');
    var steps = [], idx = 0;
    var running = false, paused = false;
    var stepEndAt = 0, stepRemain = 0, stepDur = 0;
    var raf = 0, lastBeepSec = -1, switched = false;
    var totalDur = 0, elapsedBefore = 0;
    var curBlockKey = 'morning';
    var wakeLock = null;
    var soundOn = load('coach_sound', true);
    var musicOn = load('coach_music', true);
    var music = null;
    var MUSIC = { morning: 'music-morning.mp3', day: 'music-day.mp3', evening: 'music-evening.mp3' };

    function build(block) {
      var s = [];
      if (block.mode === 'single') {
        s.push({ type: 'activity', ex: block.ex[0], dur: block.ex[0].s || 600 });
        s.push({ type: 'done' });
        return s;
      }
      var sets = block.rounds || (block.mode === 'circuit' ? 1 : SETS);
      var warm = block.warmup != null ? block.warmup : WARMUP;
      if (warm > 0) s.push({ type: 'warmup', dur: warm });
      var count = block.ex.length;
      for (var i = 0; i < count; i++) {
        var ex = block.ex[i], ws = workSecs(ex);
        for (var st = 1; st <= sets; st++) {
          s.push({ type: 'work', ex: ex, dur: ws.dur, switchAt: ws.switchAt, set: st, sets: sets, idx: i, count: count });
          var last = (i === count - 1 && st === sets);
          if (!last) {
            var interSet = (st < sets);
            var nextEx = interSet ? ex : block.ex[i + 1];
            s.push({ type: 'rest', dur: interSet ? REST : REST_EX, next: nextEx, interSet: interSet, nextSet: interSet ? st + 1 : 1 });
          }
        }
      }
      s.push({ type: 'done' });
      return s;
    }

    function open(dow, blockKey) {
      var block = A.blockFor(dow, blockKey);
      curBlockKey = blockKey;
      steps = build(block);
      idx = 0; running = true; paused = false; switched = false;
      totalDur = steps.reduce(function (a, s) { return a + (s.dur || 0); }, 0);
      root.className = 'player ' + blockKey;
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      requestWakeLock();
      initAudio();
      startMusic(blockKey);
      renderShell(block);
      enterStep(0);
    }

    function renderShell(block) {
      root.innerHTML =
        '<div class="pl-progress"><i id="plBar"></i></div>' +
        '<div class="pl-top">' +
          '<button class="pl-icon-btn" id="plClose" aria-label="close">✕</button>' +
          '<div class="pl-title"><div class="t1">' + L(A.BLOCK_LABELS[curBlockKey]) + ' · ' + L(A.WEEK[state.dow].tag) + '</div>' +
            '<div class="t2">' + L(block.title) + '</div></div>' +
          '<div class="pl-top-right">' +
            '<button class="pl-icon-btn music ' + (musicOn ? 'on' : 'off') + '" id="plMusic" aria-label="music">🎵</button>' +
            '<button class="pl-icon-btn" id="plSound" aria-label="sound">' + (soundOn ? '🔊' : '🔇') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="pl-mid" id="plMid"></div>';
      $('#plClose').addEventListener('click', close);
      $('#plSound').addEventListener('click', toggleSound);
      $('#plMusic').addEventListener('click', toggleMusic);
    }

    function enterStep(i) {
      idx = i;
      var st = steps[i];
      switched = false; lastBeepSec = -1;
      elapsedBefore = steps.slice(0, i).reduce(function (a, s) { return a + (s.dur || 0); }, 0);
      if (st.type === 'done') { renderDone(); return; }
      stepDur = st.dur; stepRemain = st.dur; stepEndAt = Date.now() + st.dur * 1000;
      renderStep(st);
      speakForStep(st);
      if (st.type === 'work' || st.type === 'activity') beep(660, 130);
      else if (st.type === 'rest') beep(430, 130);
      else if (st.type === 'warmup') beep(520, 130);
      if (!paused) loop();
    }

    function renderStep(st) {
      var mid = $('#plMid');
      var phaseCls = st.type === 'rest' ? 'rest' : st.type === 'warmup' ? 'warm' : '';
      var phaseTxt = st.type === 'warmup' ? S().phWarm
        : st.type === 'rest' ? S().phRest
        : st.type === 'activity' ? S().phActivity : S().phEx;

      var pose, name, reps, nextHtml = '', dots = '', counter = '';

      if (st.type === 'warmup') {
        pose = 'mobility'; name = S().warmName; reps = S().warmSub;
        nextHtml = S().next + ' <b>' + L(steps[idx + 1].ex.n) + '</b>';
      } else if (st.type === 'rest') {
        pose = st.next.p; name = S().restName; reps = S().restSub;
        nextHtml = S().next + ' <b>' + L(st.next.n) + '</b> · ' + (st.interSet ? S().setLbl(st.nextSet) : stripTags(repsHtml(st.next)));
      } else {
        var ex = st.ex;
        pose = ex.p; name = L(ex.n); reps = repsHtml(ex);
        if (st.type === 'work') {
          counter = S().exOf(st.idx + 1, st.count, st.set, st.sets);
          var nx = steps[idx + 1];
          if (nx && nx.type === 'rest') nextHtml = S().next + ' <b>' + L(nx.next.n) + '</b>' + (nx.interSet ? ' · ' + S().setLbl(nx.nextSet) : '');
          else if (nx && nx.type === 'done') nextHtml = S().lastEx;
          dots = dotRow(st);
        } else { counter = S().easyEnjoy; }
      }

      var restCls = (st.type === 'rest') ? ' rest' : '';
      mid.innerHTML =
        '<div class="pl-phase ' + phaseCls + '">' + phaseTxt + '</div>' +
        '<div class="pl-illus' + restCls + '">' + A.svgFor(pose) + '</div>' +
        '<div class="pl-exname">' + name + '</div>' +
        '<div class="pl-reps">' + reps + '</div>' +
        '<div class="pl-ring">' +
          '<svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52"/>' +
          '<circle class="bar' + restCls + '" id="plRingBar" cx="60" cy="60" r="52"/></svg>' +
          '<div class="pl-ring-center"><div class="pl-time" id="plTime">' + dispTime(stepDur) + '</div>' +
          '<div class="pl-count" id="plCount">' + (counter || '') + '</div></div>' +
        '</div>' +
        (dots ? '<div class="pl-dots">' + dots + '</div>' : '') +
        '<div class="pl-next">' + nextHtml + '</div>' +
        controlsHtml();

      wireControls();
      updateRing(1);
    }

    function dotRow(st) {
      var out = '', total = st.count * st.sets, done = st.idx * st.sets + (st.set - 1);
      for (var k = 0; k < total; k++) out += '<i class="' + (k < done ? 'done' : (k === done ? 'on' : '')) + '"></i>';
      return out;
    }

    function controlsHtml() {
      return '<div class="pl-controls">' +
        '<div class="pl-ctl-wrap"><button class="pl-ctl" id="plPrev">⏮</button><div class="pl-ctl-lbl">' + S().back + '</div></div>' +
        '<div class="pl-ctl-wrap"><button class="pl-ctl main" id="plPlay">' + (paused ? '▶' : '⏸') + '</button><div class="pl-ctl-lbl">' + (paused ? S().resume : S().pause) + '</div></div>' +
        '<div class="pl-ctl-wrap"><button class="pl-ctl" id="plSkip">⏭</button><div class="pl-ctl-lbl">' + S().skip + '</div></div>' +
        '</div>';
    }
    function wireControls() {
      $('#plPlay').addEventListener('click', togglePause);
      $('#plPrev').addEventListener('click', prev);
      $('#plSkip').addEventListener('click', skip);
    }

    function loop() {
      cancelAnimationFrame(raf);
      var tick = function () {
        if (!running || paused) return;
        stepRemain = (stepEndAt - Date.now()) / 1000;
        var st = steps[idx];
        var frac = Math.max(0, Math.min(1, stepRemain / stepDur));
        updateRing(frac); updateOverall();
        var t = $('#plTime'); if (t) t.textContent = dispTime(Math.max(0, Math.ceil(stepRemain)));
        if (st.switchAt && !switched && stepRemain <= st.switchAt) {
          switched = true; beep(760, 90); setTimeout(function () { beep(760, 90); }, 130);
          speak(S().switchSides);
          var cnt = $('#plCount'); if (cnt) cnt.textContent = S().switchSides;
        }
        var sec = Math.ceil(stepRemain);
        if (sec !== lastBeepSec && sec <= 3 && sec >= 1 && stepRemain > 0) { lastBeepSec = sec; beep(880, 70); }
        if (stepRemain <= 0) { enterStep(idx + 1); return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    function updateRing(frac) {
      var bar = $('#plRingBar'); if (!bar) return;
      var C = 2 * Math.PI * 52;
      bar.style.strokeDasharray = C;
      bar.style.strokeDashoffset = C * (1 - frac);
    }
    function updateOverall() {
      var bar = $('#plBar'); if (!bar) return;
      var done = elapsedBefore + (stepDur - Math.max(0, stepRemain));
      bar.style.width = Math.min(100, (done / totalDur) * 100) + '%';
    }

    function togglePause() {
      paused = !paused;
      if (paused) cancelAnimationFrame(raf);
      else { stepEndAt = Date.now() + stepRemain * 1000; loop(); }
      var b = $('#plPlay'); if (b) { b.textContent = paused ? '▶' : '⏸'; b.parentNode.querySelector('.pl-ctl-lbl').textContent = paused ? S().resume : S().pause; }
    }
    function skip() { cancelAnimationFrame(raf); if (idx < steps.length - 1) enterStep(idx + 1); }
    function prev() {
      cancelAnimationFrame(raf);
      if (stepDur - stepRemain > 2 && steps[idx].type !== 'done') enterStep(idx);
      else enterStep(Math.max(0, idx - 1));
    }

    function renderDone() {
      running = false; cancelAnimationFrame(raf); releaseWakeLock();
      var bar = $('#plBar'); if (bar) bar.style.width = '100%';
      beep(660, 120); setTimeout(function () { beep(880, 120); }, 150); setTimeout(function () { beep(1050, 200); }, 320);
      speak(S().spDone);
      $('#plMid').innerHTML =
        '<div class="pl-done-wrap">' +
          '<div class="pl-done-emoji">🎉</div>' +
          '<div class="pl-done-h">' + S().doneH + '</div>' +
          '<div class="pl-done-sub">' + S().doneSub(L(A.BLOCK_LABELS[curBlockKey])) + '</div>' +
          '<div class="pl-done-btns">' + nextBlockBtn() +
            '<button class="ghost" id="plHome">' + S().home + '</button>' +
          '</div>' +
        '</div>';
      $('#plHome').addEventListener('click', close);
      var nb = $('#plNextBlock');
      if (nb) nb.addEventListener('click', function () {
        var order = ['morning', 'day', 'evening'];
        var ni = order.indexOf(curBlockKey) + 1;
        if (ni < order.length) { state.block = order[ni]; renderAll(); open(state.dow, order[ni]); }
      });
    }
    function nextBlockBtn() {
      var order = ['morning', 'day', 'evening'];
      var ni = order.indexOf(curBlockKey) + 1;
      if (ni < order.length) return '<button class="primary" id="plNextBlock">' + S().nextBlock(L(A.BLOCK_LABELS[order[ni]])) + '</button>';
      return '<button class="primary" id="plHome2">' + S().greatDay + '</button>';
    }

    function close() {
      running = false; cancelAnimationFrame(raf); releaseWakeLock(); stopMusic();
      root.hidden = true; root.innerHTML = '';
      document.body.style.overflow = '';
      renderAll();
    }

    /* ---- Фоновая музыка (клезмер по времени суток) ---- */
    function startMusic(blockKey) {
      try {
        if (!music) { music = new Audio(); music.loop = true; music.volume = 0.32; music.preload = 'auto'; }
        var src = MUSIC[blockKey];
        if (src && (!music.src || music.src.indexOf(src) === -1)) music.src = src;
        if (musicOn && src) { try { music.currentTime = 0; } catch (e) {} music.play().catch(function () {}); }
      } catch (e) {}
    }
    function stopMusic() { try { if (music) music.pause(); } catch (e) {} }
    function toggleMusic() {
      musicOn = !musicOn; save('coach_music', musicOn);
      var b = $('#plMusic'); if (b) { b.classList.toggle('on', musicOn); b.classList.toggle('off', !musicOn); }
      try {
        if (musicOn) { if (music && music.src) music.play().catch(function () {}); else startMusic(curBlockKey); }
        else if (music) music.pause();
      } catch (e) {}
    }

    /* ---- Звук / голос ---- */
    var actx = null;
    function initAudio() {
      try {
        if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
      } catch (e) { actx = null; }
    }
    function beep(freq, ms) {
      if (!soundOn || !actx) return;
      try {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = freq; o.connect(g); g.connect(actx.destination);
        var t = actx.currentTime;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
        o.start(t); o.stop(t + ms / 1000 + 0.02);
      } catch (e) {}
    }
    function speak(text) {
      if (!soundOn || !('speechSynthesis' in window)) return;
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = S().speechLang; u.rate = 1; u.pitch = 1;
        window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      } catch (e) {}
    }
    function speakForStep(st) {
      if (st.type === 'work' || st.type === 'activity') speak(L(st.ex.n));
      else if (st.type === 'rest') speak(S().spRest);
      else if (st.type === 'warmup') speak(S().spWarm);
    }
    function toggleSound() {
      soundOn = !soundOn; save('coach_sound', soundOn);
      var b = $('#plSound'); if (b) b.textContent = soundOn ? '🔊' : '🔇';
      if (soundOn) { initAudio(); beep(700, 90); }
      else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }

    /* ---- Wake Lock ---- */
    function requestWakeLock() {
      try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen').then(function (w) { wakeLock = w; }).catch(function () {}); } catch (e) {}
    }
    function releaseWakeLock() { try { if (wakeLock) { wakeLock.release(); wakeLock = null; } } catch (e) {} }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && running) requestWakeLock();
    });

    return { open: open, close: close };
  })();

  /* ============================ Утилиты ============================ */
  function stripTags(html) { var d = el('div', null, html); return d.textContent; }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function load(k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }

  /* ============================ PWA install ============================ */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferredPrompt = e;
    var b = $('#installBtn'); if (b) b.hidden = false;
  });
  $('#installBtn').addEventListener('click', function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () { deferredPrompt = null; $('#installBtn').hidden = true; });
  });
  window.addEventListener('appinstalled', function () { $('#installBtn').hidden = true; });

  (function () {
    var isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (isiOS && !standalone && !load('coach_ioshint_closed', false)) {
      var h = $('#iosHint'); h.hidden = false;
      $('#iosHintClose').addEventListener('click', function () { h.hidden = true; save('coach_ioshint_closed', true); });
    }
  })();

  /* ============================ Старт ============================ */
  $('#clock').textContent = fmtClock();
  setInterval(function () {
    $('#clock').textContent = fmtClock();
    var nd = new Date().getDay();
    if (nd !== todayDow) todayDow = nd;
  }, 30000);

  renderAll();
})();
