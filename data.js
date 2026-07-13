/* =========================================================================
   10-минутный тренер / 10-Minute Coach — данные программы + иллюстрации
   Двуязычно (ru / en). Источник: постер «30 минут в день с гантелями и лавочкой».
   ========================================================================= */
(function () {
  'use strict';

  /* ---- Помощники для SVG-иллюстраций ---- */
  var GR = '<line class="gr" x1="12" y1="107" x2="108" y2="107"/>';
  // Гантель: рукоять + два круглых «блина». a — угол (90 = вертикально).
  function DB(x, y, a) {
    a = a || 0;
    return '<g class="eq" transform="translate(' + x + ',' + y + ') rotate(' + a + ')">' +
      '<line class="eqbar" x1="-8" y1="0" x2="8" y2="0"/>' +
      '<circle class="eqplate" cx="-10.5" cy="0" r="6"/>' +
      '<circle class="eqplate" cx="10.5" cy="0" r="6"/>' +
      '</g>';
  }
  function P(d) { return '<path class="fig" d="' + d + '"/>'; }
  function H(cx, cy, r) { return '<circle class="head" cx="' + cx + '" cy="' + cy + '" r="' + (r || 9) + '"/>'; }

  /* ---- Позы (внутренняя разметка SVG, viewBox 0 0 120 120) ---- */
  var POSES = {
    // Вставание с лавочки
    squat: GR + '<rect class="fig" x="72" y="70" width="36" height="8" rx="4"/>' +
      P('M79 78 V100 M101 78 V100') + H(45, 30) +
      P('M45 39 L55 67') + P('M49 47 L71 53') +
      P('M55 67 L74 71 L72 100') + P('M55 67 L57 86 L55 100'),
    // Ягодичный мост
    bridge: GR + H(26, 83, 8) +
      P('M35 87 L72 58 L92 66') + P('M92 66 L94 100') + P('M37 87 L26 99'),
    // Подъёмы на носки
    calf: GR + H(60, 22) + P('M60 31 V64') +
      P('M60 39 L51 62') + P('M60 39 L69 62') + DB(49, 66, 90) + DB(71, 66, 90) +
      P('M60 64 L54 92 L49 100') + P('M60 64 L66 92 L71 100') +
      '<path class="hint" d="M31 46 l7 -9 l7 9"/>' + '<path class="hint" d="M75 46 l7 -9 l7 9"/>',
    // Подъём прямой ноги лёжа
    legraise: '<line class="gr" x1="16" y1="98" x2="106" y2="98"/>' + H(26, 84, 8) +
      P('M34 88 L78 91') + P('M78 91 L104 93') + P('M78 91 L64 58') + P('M41 88 L35 97'),
    // Жим гантелей лёжа
    press: '<rect class="fig" x="22" y="92" width="66" height="8" rx="4"/>' + H(28, 84, 8) +
      P('M37 88 L72 90') + P('M72 90 L85 82 L89 99') +
      P('M46 88 L46 62') + P('M58 90 L58 64') + DB(46, 60, 90) + DB(58, 62, 90),
    // Тяга одной гантели к поясу
    onearmrow: GR + '<rect class="fig" x="60" y="66" width="46" height="8" rx="4"/>' +
      P('M68 74 V100 M98 74 V100') + H(32, 42, 8) +
      P('M39 46 L72 57') + P('M65 54 L74 68') + P('M53 51 L55 63') + DB(55, 68, 90) +
      P('M72 57 L77 100') + P('M72 57 L61 82 L63 100'),
    // Отжимания от лавочки
    pushup: GR + '<rect class="fig" x="72" y="72" width="34" height="8" rx="4"/>' +
      P('M79 80 V100 M99 80 V100') + P('M20 101 L52 87 L78 70') + H(86, 63, 8) + P('M78 70 L82 74'),
    // Тяга гантелей в наклоне
    bentrow: GR + H(30, 44, 8) + P('M37 48 L74 56') +
      P('M74 56 L79 100') + P('M74 56 L62 82 L64 100') +
      P('M50 51 L48 65') + DB(48, 70, 90) + P('M58 53 L60 65') + DB(60, 70, 90) +
      '<path class="hint" d="M41 60 l0 -11 M41 49 l-4 5 M41 49 l4 5"/>' +
      '<path class="hint" d="M71 62 l0 -11 M71 51 l-4 5 M71 51 l4 5"/>',
    // Румынская тяга
    rdl: GR + H(38, 30) + P('M45 38 L77 50') + P('M77 50 L81 100') + P('M77 50 L71 100') +
      P('M55 44 L53 74') + DB(53, 79, 90) + P('M61 46 L60 74') + DB(60, 79, 90),
    // Dead bug
    deadbug: '<line class="gr" x1="16" y1="99" x2="106" y2="99"/>' + H(28, 86, 8) +
      P('M36 90 L66 92') + P('M46 90 L39 63') + P('M53 91 L59 97') +
      P('M66 92 L71 67 L85 65') + P('M60 92 L92 94'),
    // Bird dog
    birddog: GR + P('M46 56 L78 56') + H(37, 54, 8) +
      P('M48 56 L46 95') + P('M78 56 L83 80 L81 95') + P('M46 56 L21 50') + P('M78 56 L103 50'),
    // Марш с гантелями на месте
    march: GR + H(58, 22) + P('M58 31 V60') + P('M58 60 L53 100') + P('M58 60 L74 62 L72 82') +
      P('M58 39 L47 51') + DB(45, 53) + P('M58 39 L69 47') + DB(71, 49),
    // Жим гантелей сидя
    ohpress: GR + '<rect class="fig" x="48" y="74" width="36" height="8" rx="4"/>' +
      P('M54 82 V99 M80 82 V99') + H(58, 34) + P('M58 43 V70') + P('M58 70 L80 72') +
      P('M52 49 L50 27') + DB(50, 23) + P('M64 49 L66 27') + DB(66, 23),
    // Разведение гантелей в наклоне
    reversefly: GR + H(30, 46, 8) + P('M37 50 L72 57') +
      P('M72 57 L77 100') + P('M72 57 L63 100') +
      P('M52 53 L34 62') + DB(30, 64) + P('M52 53 L70 63') + DB(74, 65),
    // Подъём гантелей в стороны
    lateral: GR + H(60, 22) + P('M60 31 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M60 40 L41 40') + DB(36, 40) + P('M60 40 L79 40') + DB(84, 40),
    // Сгибание рук молотком
    curl: GR + H(60, 22) + P('M60 31 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M58 39 L54 60 L60 46') + P('M62 39 L66 60 L60 46') + DB(60, 44),
    // Разгибание руки из-за головы
    ohext: GR + H(60, 28) + P('M60 37 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M57 39 L53 23') + P('M63 39 L67 23') + P('M53 23 L60 35 L67 23') + DB(60, 35),
    // Боковая планка с колен
    sideplank: GR + P('M28 100 L45 100') + P('M45 100 L47 78') + H(45, 70, 8) +
      P('M47 78 L80 92') + P('M80 92 L88 100') + P('M51 80 L53 61'),
    // Баланс на одной ноге
    balance: GR + H(60, 22) + P('M60 31 V62') + P('M60 62 L60 101') + P('M60 62 L73 70 L71 86') +
      P('M60 40 L43 47') + P('M60 40 L77 47'),
    // Спокойная растяжка
    stretch: GR + H(60, 26) + P('M60 35 V68') + P('M60 68 L54 100') + P('M60 68 L66 100') +
      P('M60 40 L51 18') + P('M60 40 L69 18'),
    // Мягкая подвижность (круги плечами)
    mobility: GR + H(60, 26) + P('M60 35 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M60 41 L75 30') + P('M60 41 L46 53') +
      '<path class="hint" d="M78 22 a11 11 0 1 1 -9 4"/>' + '<path class="hint" d="M69 24 l0 7 l7 -1"/>',
    // Спокойная ходьба
    walk: GR + H(58, 22) + P('M58 31 V60') + P('M58 60 L68 85 L66 100') + P('M58 60 L49 85 L47 100') +
      P('M58 39 L50 53') + P('M58 39 L66 51')
  };

  function svgFor(pose) {
    var inner = POSES[pose] || POSES.march;
    return '<svg class="pose" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle class="bg" cx="60" cy="61" r="57"/>' + inner + '</svg>';
  }

  /* ---- Упражнение: E(имяRU, имяEN, повторыRU, повторыEN, поза, опции) ---- */
  function E(nru, nen, rru, ren, p, o) {
    o = o || {};
    return { n: { ru: nru, en: nen }, r: { ru: rru, en: ren }, p: p, s: o.s || null, side: !!o.side };
  }
  function T(ru, en) { return { ru: ru, en: en }; }

  /* ---- Блоки по дням-типам (А / B / C / Восстановление) ---- */
  var LETTERS = {
    A: {
      morning: { title: T('Мягкие ноги и колени', 'Gentle legs & knees'), ex: [
        E('Вставание с лавочки', 'Sit-to-stand from bench', '8–10', '8–10', 'squat'),
        E('Ягодичный мост', 'Glute bridge', '12–15', '12–15', 'bridge'),
        E('Подъёмы на носки', 'Calf raises', '12–15', '12–15', 'calf'),
        E('Подъём прямой ноги лёжа', 'Lying straight-leg raise', '8–10 / нога', '8–10 / leg', 'legraise', { side: true })
      ] },
      day: { title: T('Грудь и спина', 'Chest & back'), ex: [
        E('Жим гантелей лёжа', 'Dumbbell bench press', '8–12', '8–12', 'press'),
        E('Тяга одной гантели к поясу', 'One-arm dumbbell row', '8–12 / рука', '8–12 / arm', 'onearmrow', { side: true }),
        E('Отжимания от лавочки', 'Bench push-ups', '8–12', '8–12', 'pushup'),
        E('Тяга гантелей грудью на наклонной лавочке', 'Incline chest-supported row', '8–12', '8–12', 'bentrow')
      ] },
      evening: { title: T('Задняя цепь и корпус', 'Posterior chain & core'), ex: [
        E('Румынская тяга', 'Romanian deadlift', '8–12', '8–12', 'rdl'),
        E('Dead bug', 'Dead bug', '8–10 / сторона', '8–10 / side', 'deadbug', { side: true }),
        E('Bird dog', 'Bird dog', '8–10 / сторона', '8–10 / side', 'birddog', { side: true }),
        E('Марш с гантелями на месте', 'Marching with dumbbells', '30–40 сек', '30–40 sec', 'march', { s: 40 })
      ] }
    },
    B: {
      morning: { title: T('Мягкие ноги и баланс', 'Gentle legs & balance'), ex: [
        E('Неглубокий присед к лавочке с опорой', 'Assisted shallow squat to bench', '8–10', '8–10', 'squat'),
        E('Ягодичный мост', 'Glute bridge', '12–15', '12–15', 'bridge'),
        E('Баланс на одной ноге с опорой', 'Single-leg balance with support', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true }),
        E('Подъёмы на носки', 'Calf raises', '12–15', '12–15', 'calf')
      ] },
      day: { title: T('Плечи и верх спины', 'Shoulders & upper back'), ex: [
        E('Жим гантелей сидя', 'Seated dumbbell press', '8–12', '8–12', 'ohpress'),
        E('Разведение гантелей в наклоне', 'Bent-over reverse fly', '10–15', '10–15', 'reversefly'),
        E('Подъём гантелей в стороны', 'Lateral raises', '10–12', '10–12', 'lateral'),
        E('Тяга гантелей в наклоне', 'Bent-over dumbbell row', '8–12', '8–12', 'bentrow')
      ] },
      evening: { title: T('Руки и корпус', 'Arms & core'), ex: [
        E('Сгибание рук молотком', 'Hammer curls', '8–12', '8–12', 'curl'),
        E('Разгибание руки из-за головы', 'Overhead triceps extension', '8–12', '8–12', 'ohext'),
        E('Боковая планка с колен', 'Side plank from knees', '15–25 сек / сторона', '15–25 sec / side', 'sideplank', { s: 20, side: true }),
        E('Dead bug', 'Dead bug', '8–10 / сторона', '8–10 / side', 'deadbug', { side: true })
      ] }
    },
    C: {
      morning: { title: T('Колени + подвижность', 'Knees + mobility'), ex: [
        E('Ходьба на месте', 'Marching in place', '40 сек', '40 sec', 'walk', { s: 40 }),
        E('Вставание с лавочки', 'Sit-to-stand from bench', '10–12', '10–12', 'squat'),
        E('Подъём прямой ноги лёжа', 'Lying straight-leg raise', '10 / нога', '10 / leg', 'legraise', { side: true }),
        E('Баланс на одной ноге', 'Single-leg balance', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true })
      ] },
      day: { title: T('Лёгкий верх тела', 'Light upper body'), ex: [
        E('Отжимания от лавочки', 'Bench push-ups', '8–15', '8–15', 'pushup'),
        E('Тяга гантелей грудью на наклонной лавочке', 'Incline chest-supported row', '10–12', '10–12', 'bentrow'),
        E('Жим гантелей лёжа (лёгкий)', 'Dumbbell bench press (light)', '8–12', '8–12', 'press'),
        E('Разведение гантелей лёжа или в наклоне', 'Dumbbell fly (lying or bent-over)', '10–12', '10–12', 'reversefly')
      ] },
      evening: { title: T('Корпус и движение', 'Core & movement'), ex: [
        E('Bird dog', 'Bird dog', '8–10 / сторона', '8–10 / side', 'birddog', { side: true }),
        E('Ягодичный мост', 'Glute bridge', '12–15', '12–15', 'bridge'),
        E('Марш с гантелями на месте', 'Marching with dumbbells', '30–40 сек', '30–40 sec', 'march', { s: 40 }),
        E('Спокойная растяжка', 'Gentle stretch', '30–40 сек', '30–40 sec', 'stretch', { s: 40 })
      ] }
    },
    REC: {
      morning: { title: T('Спокойная активность', 'Easy activity'), mode: 'single', ex: [
        E('Спокойная прогулка или ходьба на месте', 'Easy walk or marching in place', '10 минут', '10 min', 'walk', { s: 600 })
      ] },
      day: { title: T('Мягкая подвижность', 'Gentle mobility'), mode: 'single', ex: [
        E('Круги плечами, сгибание/разгибание коленей, растяжка икр', 'Shoulder circles, knee bends, calf stretches', '10 минут', '10 min', 'mobility', { s: 600 })
      ] },
      evening: { title: T('Один лёгкий круг', 'One easy round'), mode: 'circuit', rounds: 1, warmup: 30, ex: [
        E('Ягодичный мост', 'Glute bridge', '12–15', '12–15', 'bridge'),
        E('Bird dog', 'Bird dog', '8–10 / сторона', '8–10 / side', 'birddog', { side: true }),
        E('Баланс на одной ноге', 'Single-leg balance', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true }),
        E('Медленная ходьба', 'Slow walk', '40 сек', '40 sec', 'walk', { s: 40 })
      ] }
    }
  };

  /* ---- Неделя (индекс = день недели, Date.getDay(): 0=Вс … 6=Сб) ---- */
  var WEEK = [
    { title: T('Воскресенье', 'Sunday'),    short: T('Вс', 'Sun'), tag: T('Восстановление', 'Recovery'), letter: 'REC', light: true, recovery: true },
    { title: T('Понедельник', 'Monday'),    short: T('Пн', 'Mon'), tag: T('День A', 'Day A'), letter: 'A' },
    { title: T('Вторник', 'Tuesday'),       short: T('Вт', 'Tue'), tag: T('День B', 'Day B'), letter: 'B' },
    { title: T('Среда', 'Wednesday'),       short: T('Ср', 'Wed'), tag: T('День C', 'Day C'), letter: 'C', light: true },
    { title: T('Четверг', 'Thursday'),      short: T('Чт', 'Thu'), tag: T('День A', 'Day A'), letter: 'A', repeat: true },
    { title: T('Пятница', 'Friday'),        short: T('Пт', 'Fri'), tag: T('День B', 'Day B'), letter: 'B', repeat: true },
    { title: T('Суббота', 'Saturday'),      short: T('Сб', 'Sat'), tag: T('День C', 'Day C'), letter: 'C', light: true, repeat: true }
  ];

  var BLOCK_KEYS = ['morning', 'day', 'evening'];
  var BLOCK_LABELS = { morning: T('Утро', 'Morning'), day: T('День', 'Midday'), evening: T('Вечер', 'Evening') };

  function blocksForDow(dow) { return LETTERS[WEEK[dow].letter]; }
  function blockFor(dow, key) { return LETTERS[WEEK[dow].letter][key]; }

  /* ---- Справочная информация ---- */
  var INFO = {
    ru: {
      structure: '1 мин разминка · 4 упражнения по 2 подхода подряд · короткий отдых',
      weight: 'Лёгкий / средний вес. Оставляйте 2–3 повтора в запасе.',
      knees: 'Колени: начинаем очень мягко — без прыжков, глубоких приседаний и выпадов. Если боль — уменьшите амплитуду, используйте опору или пропустите упражнение.',
      tempo: 'Темп медленный и контролируемый.',
      progress: [
        'Неделя 1: делайте спокойно, учите технику.',
        'Неделя 2: делайте оба подхода в каждом упражнении.',
        'Когда стало легко — добавьте 1–2 повтора или немного веса.'
      ],
      form: ['Дышите спокойно.', 'Спина ровная.', 'Качество важнее скорости.', 'Боль в мышцах допустима, резкая боль в колене — нет.'],
      stop: ['Острая боль в колене', 'Отёк', 'Заклинивание сустава', 'Ощущение, что колено подворачивается', 'При необходимости обратитесь к специалисту']
    },
    en: {
      structure: '1-min warm-up · 4 exercises × 2 sets back-to-back · short rest',
      weight: 'Light / medium weight. Leave 2–3 reps in reserve.',
      knees: 'Knees: start very gently — no jumping, deep squats or lunges. If it hurts, reduce the range, use support, or skip the exercise.',
      tempo: 'Slow, controlled tempo.',
      progress: [
        'Week 1: go easy, learn the technique.',
        'Week 2: do both sets of every exercise.',
        'When it feels easy, add 1–2 reps or a little weight.'
      ],
      form: ['Breathe calmly.', 'Keep your back straight.', 'Quality over speed.', 'Muscle soreness is fine; sharp knee pain is not.'],
      stop: ['Sharp knee pain', 'Swelling', 'Joint locking', 'A feeling the knee gives way', 'See a specialist if needed']
    }
  };

  function pick(v, lang) { return (v && typeof v === 'object' && (v.ru !== undefined || v.en !== undefined)) ? (v[lang] || v.ru) : v; }

  window.APP = {
    svgFor: svgFor, POSES: POSES,
    WEEK: WEEK, BLOCK_KEYS: BLOCK_KEYS, BLOCK_LABELS: BLOCK_LABELS,
    blocksForDow: blocksForDow, blockFor: blockFor,
    INFO: INFO, pick: pick
  };
})();
