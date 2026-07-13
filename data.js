/* =========================================================================
   10-минутный тренер / 10-Minute Coach — данные программы + иллюстрации
   Двуязычно (ru / en). Источник: постер «30 минут в день с гантелями и лавочкой».
   ========================================================================= */
(function () {
  'use strict';

  /* ---- Помощники для SVG-иллюстраций ---- */
  var GR = '<line class="gr" x1="10" y1="107" x2="110" y2="107"/>';
  function DB(x, y, a) {
    a = a || 0;
    return '<g class="eq" transform="translate(' + x + ',' + y + ') rotate(' + a + ')">' +
      '<line x1="-9" y1="0" x2="9" y2="0"/>' +
      '<line x1="-9" y1="-6" x2="-9" y2="6"/>' +
      '<line x1="9" y1="-6" x2="9" y2="6"/>' +
      '</g>';
  }
  function P(d) { return '<path class="fig" d="' + d + '"/>'; }
  function H(cx, cy) { return '<circle class="head" cx="' + cx + '" cy="' + cy + '" r="8"/>'; }

  /* ---- Позы (внутренняя разметка SVG, viewBox 0 0 120 120) ---- */
  var POSES = {
    squat: GR +
      '<rect class="fig" x="72" y="72" width="34" height="8" rx="3"/>' +
      P('M78 80 V101 M100 80 V101') + H(46, 32) +
      P('M46 40 L54 68') + P('M50 48 L70 54') +
      P('M54 68 L74 72 L72 101') + P('M54 68 L58 88 L56 101'),
    bridge: GR +
      '<circle class="head" cx="28" cy="84" r="7"/>' +
      P('M36 88 L72 60 L92 66') + P('M92 66 L94 101') + P('M40 88 L28 100'),
    calf: GR + H(60, 24) + P('M60 32 V66') +
      P('M60 40 L50 62') + P('M60 40 L70 62') +
      DB(48, 66, 90) + DB(72, 66, 90) +
      P('M60 66 L53 94 L49 101') + P('M60 66 L67 94 L71 101') +
      '<path class="hint" d="M30 44 l7 -9 l7 9"/>' +
      '<path class="hint" d="M76 44 l7 -9 l7 9"/>',
    legraise: '<line class="gr" x1="16" y1="96" x2="110" y2="96"/>' +
      '<circle class="head" cx="26" cy="82" r="7"/>' +
      P('M34 86 L78 90') + P('M78 90 L104 92') + P('M78 90 L64 58') + P('M40 86 L34 95'),
    press: '<rect class="fig" x="24" y="90" width="64" height="7" rx="3"/>' +
      '<circle class="head" cx="30" cy="82" r="7"/>' +
      P('M38 86 L72 88') + P('M72 88 L84 80 L88 96') +
      P('M46 86 L46 62') + P('M58 88 L58 64') + DB(46, 60, 90) + DB(58, 62, 90),
    onearmrow: GR + '<rect class="fig" x="60" y="66" width="46" height="7" rx="3"/>' +
      P('M68 73 V100 M98 73 V100') + '<circle class="head" cx="32" cy="42" r="7"/>' +
      P('M38 46 L72 58') + P('M64 55 L74 68') + P('M52 51 L54 64') + DB(54, 68, 90) +
      P('M72 58 L76 100') + P('M72 58 L60 82 L62 100'),
    pushup: GR + '<rect class="fig" x="74" y="72" width="32" height="7" rx="3"/>' +
      P('M80 79 V100 M100 79 V100') + P('M20 102 L52 88 L78 68') +
      '<circle class="head" cx="86" cy="62" r="7"/>' + P('M78 68 L82 74'),
    bentrow: GR + '<circle class="head" cx="32" cy="44" r="7"/>' +
      P('M38 48 L74 56') + P('M74 56 L78 100') + P('M74 56 L62 82 L64 100') +
      P('M50 51 L48 66') + DB(48, 70, 90) + P('M58 53 L60 66') + DB(60, 70, 90) +
      '<path class="hint" d="M40 60 l0 -10 M40 50 l-4 5 M40 50 l4 5"/>' +
      '<path class="hint" d="M70 62 l0 -10 M70 52 l-4 5 M70 52 l4 5"/>',
    rdl: GR + H(38, 32) + P('M44 39 L76 50') + P('M76 50 L80 101') + P('M76 50 L70 101') +
      P('M54 44 L52 76') + DB(52, 80, 90) + P('M60 46 L59 76') + DB(59, 80, 90),
    deadbug: '<line class="gr" x1="16" y1="98" x2="108" y2="98"/>' +
      '<circle class="head" cx="28" cy="86" r="7"/>' +
      P('M36 90 L66 92') + P('M46 90 L40 64') + P('M52 91 L58 97') +
      P('M66 92 L70 68 L84 66') + P('M60 92 L92 94'),
    birddog: GR + P('M46 58 L78 58') + '<circle class="head" cx="38" cy="56" r="7"/>' +
      P('M48 58 L46 96') + P('M78 58 L82 82 L80 96') + P('M46 58 L22 52') + P('M78 58 L102 52'),
    march: GR + H(58, 24) + P('M58 32 V60') + P('M58 60 L54 101') + P('M58 60 L74 62 L72 82') +
      P('M58 40 L48 52') + DB(46, 54) + P('M58 40 L70 48') + DB(72, 50),
    ohpress: GR + '<rect class="fig" x="48" y="72" width="36" height="7" rx="3"/>' +
      P('M54 79 V98 M80 79 V98') + H(58, 34) + P('M58 42 V68') + P('M58 68 L80 70') +
      P('M52 48 L50 26') + DB(50, 22) + P('M64 48 L66 26') + DB(66, 22),
    reversefly: GR + '<circle class="head" cx="32" cy="46" r="7"/>' +
      P('M38 50 L72 58') + P('M72 58 L76 101') + P('M72 58 L62 101') +
      P('M52 54 L34 62') + DB(31, 63) + P('M52 54 L70 64') + DB(73, 65),
    lateral: GR + H(60, 24) + P('M60 32 V66') + P('M60 66 L54 101') + P('M60 66 L66 101') +
      P('M60 42 L40 40') + DB(35, 40) + P('M60 42 L80 40') + DB(85, 40),
    curl: GR + H(60, 24) + P('M60 32 V66') + P('M60 66 L54 101') + P('M60 66 L66 101') +
      P('M57 40 L53 60 L60 47') + DB(61, 45) + P('M63 40 L67 60 L60 47'),
    ohext: GR + H(60, 30) + P('M60 38 V66') + P('M60 66 L54 101') + P('M60 66 L66 101') +
      P('M57 40 L53 24') + P('M63 40 L67 24') + P('M53 24 L60 36 L67 24') + DB(60, 36),
    sideplank: GR + P('M28 100 L44 100') + P('M44 100 L46 78') +
      '<circle class="head" cx="44" cy="70" r="7"/>' + P('M46 78 L80 92') +
      P('M80 92 L88 100') + P('M50 80 L52 62'),
    balance: GR + H(60, 24) + P('M60 32 V62') + P('M60 62 L60 102') + P('M60 62 L72 70 L70 86') +
      P('M60 40 L44 48') + P('M60 40 L76 48'),
    stretch: GR + H(60, 26) + P('M60 34 V68') + P('M60 68 L54 101') + P('M60 68 L66 101') +
      P('M60 40 L50 18') + P('M60 40 L70 18'),
    mobility: GR + H(60, 26) + P('M60 34 V66') + P('M60 66 L54 101') + P('M60 66 L66 101') +
      P('M60 42 L74 30') + P('M60 42 L46 54') +
      '<path class="hint" d="M74 22 a10 10 0 1 1 -8 4"/>' +
      '<path class="hint" d="M66 24 l0 6 l6 -1"/>',
    walk: GR + H(58, 24) + P('M58 32 V60') + P('M58 60 L68 86 L66 101') + P('M58 60 L50 86 L48 101') +
      P('M58 40 L50 54') + P('M58 40 L66 52')
  };

  function svgFor(pose) {
    var inner = POSES[pose] || POSES.march;
    return '<svg class="pose" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      inner + '</svg>';
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
      structure: '1 мин разминка · 2 круга по 4 упражнения · короткий отдых',
      weight: 'Лёгкий / средний вес. Оставляйте 2–3 повтора в запасе.',
      knees: 'Колени: начинаем очень мягко — без прыжков, глубоких приседаний и выпадов. Если боль — уменьшите амплитуду, используйте опору или пропустите упражнение.',
      tempo: 'Темп медленный и контролируемый.',
      progress: [
        'Неделя 1: делайте спокойно, учите технику.',
        'Неделя 2: 2 полных круга в каждом блоке.',
        'Когда стало легко — добавьте 1–2 повтора или немного веса.'
      ],
      form: ['Дышите спокойно.', 'Спина ровная.', 'Качество важнее скорости.', 'Боль в мышцах допустима, резкая боль в колене — нет.'],
      stop: ['Острая боль в колене', 'Отёк', 'Заклинивание сустава', 'Ощущение, что колено подворачивается', 'При необходимости обратитесь к специалисту']
    },
    en: {
      structure: '1-min warm-up · 2 rounds of 4 exercises · short rest',
      weight: 'Light / medium weight. Leave 2–3 reps in reserve.',
      knees: 'Knees: start very gently — no jumping, deep squats or lunges. If it hurts, reduce the range, use support, or skip the exercise.',
      tempo: 'Slow, controlled tempo.',
      progress: [
        'Week 1: go easy, learn the technique.',
        'Week 2: 2 full rounds per block.',
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
