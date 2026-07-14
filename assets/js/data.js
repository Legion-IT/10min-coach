/* =========================================================================
   10-минутный тренер / 10-Minute Coach — данные программы + иллюстрации
   Двуязычно (ru / en). Банк упражнений по группам мышц + случайная ротация.
   ========================================================================= */
(function () {
  'use strict';

  /* ---- Помощники для SVG-иллюстраций ---- */
  var GR = '<line class="gr" x1="12" y1="107" x2="108" y2="107"/>';
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
    squat: GR + '<rect class="fig" x="72" y="70" width="36" height="8" rx="4"/>' +
      P('M79 78 V100 M101 78 V100') + H(45, 30) +
      P('M45 39 L55 67') + P('M49 47 L71 53') +
      P('M55 67 L74 71 L72 100') + P('M55 67 L57 86 L55 100'),
    bridge: GR + H(26, 83, 8) +
      P('M35 87 L72 58 L92 66') + P('M92 66 L94 100') + P('M37 87 L26 99'),
    calf: GR + H(60, 22) + P('M60 31 V64') +
      P('M60 39 L51 62') + P('M60 39 L69 62') + DB(49, 66, 90) + DB(71, 66, 90) +
      P('M60 64 L54 92 L49 100') + P('M60 64 L66 92 L71 100') +
      '<path class="hint" d="M31 46 l7 -9 l7 9"/>' + '<path class="hint" d="M75 46 l7 -9 l7 9"/>',
    legraise: '<line class="gr" x1="16" y1="98" x2="106" y2="98"/>' + H(26, 84, 8) +
      P('M34 88 L78 91') + P('M78 91 L104 93') + P('M78 91 L64 58') + P('M41 88 L35 97'),
    press: '<rect class="fig" x="22" y="92" width="66" height="8" rx="4"/>' + H(28, 84, 8) +
      P('M37 88 L72 90') + P('M72 90 L85 82 L89 99') +
      P('M46 88 L46 62') + P('M58 90 L58 64') + DB(46, 60, 90) + DB(58, 62, 90),
    fly: '<rect class="fig" x="22" y="92" width="66" height="8" rx="4"/>' + H(28, 84, 8) +
      P('M37 88 L72 90') + P('M72 90 L85 82 L89 99') +
      P('M47 88 L38 66') + DB(36, 63) + P('M59 90 L68 66') + DB(70, 63),
    onearmrow: GR + '<rect class="fig" x="60" y="66" width="46" height="8" rx="4"/>' +
      P('M68 74 V100 M98 74 V100') + H(32, 42, 8) +
      P('M39 46 L72 57') + P('M65 54 L74 68') + P('M53 51 L55 63') + DB(55, 68, 90) +
      P('M72 57 L77 100') + P('M72 57 L61 82 L63 100'),
    pushup: GR + '<rect class="fig" x="72" y="72" width="34" height="8" rx="4"/>' +
      P('M79 80 V100 M99 80 V100') + P('M20 101 L52 87 L78 70') + H(86, 63, 8) + P('M78 70 L82 74'),
    plank: GR + P('M28 100 L46 100') + P('M46 100 L49 84') + H(41, 78, 8) +
      P('M49 84 L92 96') + P('M92 96 L100 100') + P('M49 84 L47 88'),
    bentrow: GR + H(30, 44, 8) + P('M37 48 L74 56') +
      P('M74 56 L79 100') + P('M74 56 L62 82 L64 100') +
      P('M50 51 L48 65') + DB(48, 70, 90) + P('M58 53 L60 65') + DB(60, 70, 90) +
      '<path class="hint" d="M41 60 l0 -11 M41 49 l-4 5 M41 49 l4 5"/>' +
      '<path class="hint" d="M71 62 l0 -11 M71 51 l-4 5 M71 51 l4 5"/>',
    rdl: GR + H(38, 30) + P('M45 38 L77 50') + P('M77 50 L81 100') + P('M77 50 L71 100') +
      P('M55 44 L53 74') + DB(53, 79, 90) + P('M61 46 L60 74') + DB(60, 79, 90),
    deadbug: '<line class="gr" x1="16" y1="99" x2="106" y2="99"/>' + H(28, 86, 8) +
      P('M36 90 L66 92') + P('M46 90 L39 63') + P('M53 91 L59 97') +
      P('M66 92 L71 67 L85 65') + P('M60 92 L92 94'),
    birddog: GR + P('M46 56 L78 56') + H(37, 54, 8) +
      P('M48 56 L46 95') + P('M78 56 L83 80 L81 95') + P('M46 56 L21 50') + P('M78 56 L103 50'),
    superman: '<line class="gr" x1="14" y1="97" x2="106" y2="97"/>' + H(26, 80, 8) +
      P('M34 84 L74 84') + P('M40 84 L22 74') + P('M74 84 L94 74'),
    march: GR + H(58, 22) + P('M58 31 V60') + P('M58 60 L53 100') + P('M58 60 L74 62 L72 82') +
      P('M58 39 L47 51') + DB(45, 53) + P('M58 39 L69 47') + DB(71, 49),
    ohpress: GR + '<rect class="fig" x="48" y="74" width="36" height="8" rx="4"/>' +
      P('M54 82 V99 M80 82 V99') + H(58, 34) + P('M58 43 V70') + P('M58 70 L80 72') +
      P('M52 49 L50 27') + DB(50, 23) + P('M64 49 L66 27') + DB(66, 23),
    reversefly: GR + H(30, 46, 8) + P('M37 50 L72 57') +
      P('M72 57 L77 100') + P('M72 57 L63 100') +
      P('M52 53 L34 62') + DB(30, 64) + P('M52 53 L70 63') + DB(74, 65),
    lateral: GR + H(60, 22) + P('M60 31 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M60 40 L41 40') + DB(36, 40) + P('M60 40 L79 40') + DB(84, 40),
    curl: GR + H(60, 22) + P('M60 31 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M58 39 L54 60 L60 46') + P('M62 39 L66 60 L60 46') + DB(60, 44),
    ohext: GR + H(60, 28) + P('M60 37 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M57 39 L53 23') + P('M63 39 L67 23') + P('M53 23 L60 35 L67 23') + DB(60, 35),
    sideplank: GR + P('M28 100 L45 100') + P('M45 100 L47 78') + H(45, 70, 8) +
      P('M47 78 L80 92') + P('M80 92 L88 100') + P('M51 80 L53 61'),
    balance: GR + H(60, 22) + P('M60 31 V62') + P('M60 62 L60 101') + P('M60 62 L73 70 L71 86') +
      P('M60 40 L43 47') + P('M60 40 L77 47'),
    stretch: GR + H(60, 26) + P('M60 35 V68') + P('M60 68 L54 100') + P('M60 68 L66 100') +
      P('M60 40 L51 18') + P('M60 40 L69 18'),
    mobility: GR + H(60, 26) + P('M60 35 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M60 41 L75 30') + P('M60 41 L46 53') +
      '<path class="hint" d="M78 22 a11 11 0 1 1 -9 4"/>' + '<path class="hint" d="M69 24 l0 7 l7 -1"/>',
    walk: GR + H(58, 22) + P('M58 31 V60') + P('M58 60 L68 85 L66 100') + P('M58 60 L49 85 L47 100') +
      P('M58 39 L50 53') + P('M58 39 L66 51')
  };

  function svgFor(pose) {
    var inner = POSES[pose] || POSES.march;
    return '<svg class="pose" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle class="bg" cx="60" cy="61" r="57"/>' + inner + '</svg>';
  }

  /* ---- Упражнение / текст ---- */
  function E(nru, nen, rru, ren, p, o) {
    o = o || {};
    return { n: { ru: nru, en: nen }, r: { ru: rru, en: ren }, p: p, s: o.s || null, side: !!o.side };
  }
  function T(ru, en) { return { ru: ru, en: en }; }

  /* ---- Банк упражнений по группам мышц (лёгкие: гантели + коврик + лавочка) ---- */
  var POOL = {
    squat: [
      E('Вставание с лавочки', 'Sit-to-stand from bench', '8–10', '8–10', 'squat'),
      E('Неглубокий присед к лавочке с опорой', 'Assisted shallow squat to bench', '8–10', '8–10', 'squat'),
      E('Гоблет-присед (мягкий)', 'Goblet squat (shallow)', '8–12', '8–12', 'squat'),
      E('Присед к лавочке', 'Box squat to bench', '10–12', '10–12', 'squat')
    ],
    glutes: [
      E('Ягодичный мост', 'Glute bridge', '12–15', '12–15', 'bridge'),
      E('Ягодичный мост на одной ноге', 'Single-leg glute bridge', '8–10 / нога', '8–10 / leg', 'bridge', { side: true }),
      E('Ягодичный мост с маршем', 'Glute bridge march', '8–10 / сторона', '8–10 / side', 'bridge', { side: true }),
      E('Отведение ноги на четвереньках', 'Quadruped hip extension', '10–12 / нога', '10–12 / leg', 'birddog', { side: true })
    ],
    calves: [
      E('Подъёмы на носки', 'Calf raises', '12–15', '12–15', 'calf'),
      E('Подъёмы на носки на одной ноге', 'Single-leg calf raises', '10–12 / нога', '10–12 / leg', 'calf', { side: true }),
      E('Подъёмы на носки сидя', 'Seated calf raises', '15–20', '15–20', 'calf')
    ],
    legRaise: [
      E('Подъём прямой ноги лёжа', 'Lying straight-leg raise', '8–10 / нога', '8–10 / leg', 'legraise', { side: true }),
      E('Подъём согнутой ноги лёжа', 'Lying bent-knee raise', '10–12 / нога', '10–12 / leg', 'legraise', { side: true }),
      E('Отведение ноги лёжа на боку', 'Side-lying leg raise', '10–12 / нога', '10–12 / leg', 'legraise', { side: true })
    ],
    balance: [
      E('Баланс на одной ноге', 'Single-leg balance', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true }),
      E('Баланс на одной ноге с опорой', 'Single-leg balance with support', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true }),
      E('Баланс с подъёмом колена', 'Single-leg knee-raise hold', '15–25 сек / нога', '15–25 sec / leg', 'balance', { s: 20, side: true })
    ],
    chest: [
      E('Жим гантелей лёжа', 'Dumbbell bench press', '8–12', '8–12', 'press'),
      E('Жим гантелей лёжа на полу', 'Floor dumbbell press', '8–12', '8–12', 'press'),
      E('Отжимания от лавочки', 'Bench push-ups', '8–12', '8–12', 'pushup'),
      E('Разведение гантелей лёжа', 'Lying dumbbell fly', '10–12', '10–12', 'fly')
    ],
    row: [
      E('Тяга одной гантели к поясу', 'One-arm dumbbell row', '8–12 / рука', '8–12 / arm', 'onearmrow', { side: true }),
      E('Тяга гантелей в наклоне', 'Bent-over dumbbell row', '8–12', '8–12', 'bentrow'),
      E('Тяга гантелей грудью на наклонной лавочке', 'Incline chest-supported row', '8–12', '8–12', 'bentrow')
    ],
    shoulderPress: [
      E('Жим гантелей сидя', 'Seated dumbbell press', '8–12', '8–12', 'ohpress'),
      E('Жим гантелей стоя', 'Standing dumbbell press', '8–12', '8–12', 'ohpress'),
      E('Жим Арнольда (мягкий)', 'Arnold press (gentle)', '8–10', '8–10', 'ohpress')
    ],
    lateral: [
      E('Подъём гантелей в стороны', 'Lateral raises', '10–12', '10–12', 'lateral'),
      E('Подъём гантелей перед собой', 'Front raises', '10–12', '10–12', 'lateral'),
      E('Подъём в стороны сидя', 'Seated lateral raises', '10–12', '10–12', 'lateral')
    ],
    rearDelt: [
      E('Разведение гантелей в наклоне', 'Bent-over reverse fly', '10–15', '10–15', 'reversefly'),
      E('Разведение сидя в наклоне', 'Seated bent-over reverse fly', '10–15', '10–15', 'reversefly')
    ],
    biceps: [
      E('Сгибание рук молотком', 'Hammer curls', '8–12', '8–12', 'curl'),
      E('Сгибание рук на бицепс', 'Biceps curls', '8–12', '8–12', 'curl'),
      E('Сгибание рук сидя', 'Seated curls', '8–12', '8–12', 'curl')
    ],
    triceps: [
      E('Разгибание руки из-за головы', 'Overhead triceps extension', '8–12', '8–12', 'ohext'),
      E('Разгибание из-за головы сидя', 'Seated overhead extension', '8–12', '8–12', 'ohext'),
      E('Разгибание из-за головы стоя', 'Standing overhead extension', '8–12', '8–12', 'ohext')
    ],
    hinge: [
      E('Румынская тяга', 'Romanian deadlift', '8–12', '8–12', 'rdl'),
      E('Гуд-морнинг (мягкий)', 'Good morning (gentle)', '8–12', '8–12', 'rdl'),
      E('Румынская тяга на одной ноге с опорой', 'Single-leg RDL (supported)', '8–10 / нога', '8–10 / leg', 'rdl', { side: true })
    ],
    coreAntiExt: [
      E('Dead bug', 'Dead bug', '8–10 / сторона', '8–10 / side', 'deadbug', { side: true }),
      E('Опускание ног лёжа', 'Lying leg lowers', '8–12', '8–12', 'deadbug'),
      E('Dead bug (только руки)', 'Dead bug (arms only)', '10 / сторона', '10 / side', 'deadbug', { side: true })
    ],
    coreStability: [
      E('Bird dog', 'Bird dog', '8–10 / сторона', '8–10 / side', 'birddog', { side: true }),
      E('Планка с колен', 'Plank from knees', '20–30 сек', '20–30 sec', 'plank', { s: 25 }),
      E('Планка', 'Forearm plank', '20–30 сек', '20–30 sec', 'plank', { s: 25 }),
      E('Супермен (мягкий)', 'Superman (gentle)', '10–12', '10–12', 'superman')
    ],
    sideCore: [
      E('Боковая планка с колен', 'Side plank from knees', '15–25 сек / сторона', '15–25 sec / side', 'sideplank', { s: 20, side: true }),
      E('Боковая планка', 'Side plank', '15–25 сек / сторона', '15–25 sec / side', 'sideplank', { s: 20, side: true })
    ],
    carry: [
      E('Марш с гантелями на месте', 'Marching with dumbbells', '30–40 сек', '30–40 sec', 'march', { s: 40 }),
      E('Ходьба на месте', 'Marching in place', '40 сек', '40 sec', 'march', { s: 40 }),
      E('Марш с высоким подъёмом колена', 'High-knee march (gentle)', '30–40 сек', '30–40 sec', 'march', { s: 40 }),
      E('Медленная ходьба', 'Slow walk', '40 сек', '40 sec', 'walk', { s: 40 })
    ],
    stretch: [
      E('Спокойная растяжка', 'Gentle stretch', '30–40 сек', '30–40 sec', 'stretch', { s: 40 }),
      E('Растяжка над головой', 'Overhead reach stretch', '30–40 сек', '30–40 sec', 'stretch', { s: 40 }),
      E('Наклоны в стороны', 'Standing side bends', '30–40 сек', '30–40 sec', 'stretch', { s: 40 })
    ]
  };

  /* ---- Блоки-шаблоны: slots = группы мышц, из которых набираются упражнения ---- */
  var LETTERS = {
    A: {
      morning: { title: T('Мягкие ноги и колени', 'Gentle legs & knees'), slots: ['squat', 'glutes', 'calves', 'legRaise'] },
      day: { title: T('Грудь и спина', 'Chest & back'), slots: ['chest', 'row', 'chest', 'row'] },
      evening: { title: T('Задняя цепь и корпус', 'Posterior chain & core'), slots: ['hinge', 'coreAntiExt', 'coreStability', 'carry'] }
    },
    B: {
      morning: { title: T('Мягкие ноги и баланс', 'Gentle legs & balance'), slots: ['squat', 'glutes', 'balance', 'calves'] },
      day: { title: T('Плечи и верх спины', 'Shoulders & upper back'), slots: ['shoulderPress', 'rearDelt', 'lateral', 'row'] },
      evening: { title: T('Руки и корпус', 'Arms & core'), slots: ['biceps', 'triceps', 'sideCore', 'coreAntiExt'] }
    },
    C: {
      morning: { title: T('Колени + подвижность', 'Knees + mobility'), slots: ['carry', 'squat', 'legRaise', 'balance'] },
      day: { title: T('Лёгкий верх тела', 'Light upper body'), slots: ['chest', 'row', 'chest', 'rearDelt'] },
      evening: { title: T('Корпус и движение', 'Core & movement'), slots: ['coreStability', 'glutes', 'carry', 'stretch'] }
    },
    REC: {
      morning: { title: T('Спокойная активность', 'Easy activity'), mode: 'single', ex: [
        E('Спокойная прогулка или ходьба на месте', 'Easy walk or marching in place', '10 минут', '10 min', 'walk', { s: 600 })
      ] },
      day: { title: T('Мягкая подвижность', 'Gentle mobility'), mode: 'single', ex: [
        E('Круги плечами, сгибание/разгибание коленей, растяжка икр', 'Shoulder circles, knee bends, calf stretches', '10 минут', '10 min', 'mobility', { s: 600 })
      ] },
      evening: { title: T('Один лёгкий круг', 'One easy round'), mode: 'circuit', rounds: 1, warmup: 30,
        slots: ['glutes', 'coreStability', 'balance', 'carry'] }
    }
  };

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

  function blockFor(dow, key) { return LETTERS[WEEK[dow].letter][key]; }

  var INFO = {
    ru: {
      structure: '1 мин разминка · 4 упражнения по 2 подхода подряд · короткий отдых',
      weight: 'Лёгкий / средний вес. Оставляйте 2–3 повтора в запасе.',
      knees: 'Колени: начинаем очень мягко — без прыжков, глубоких приседаний и выпадов. Если боль — уменьшите амплитуду, используйте опору или пропустите упражнение.',
      tempo: 'Темп медленный и контролируемый.',
      progress: [
        'Неделя 1: делайте спокойно, учите технику.',
        'Неделя 2: делайте оба подхода в каждом упражнении.',
        'Когда стало легко — добавьте 1–2 повтора или немного веса.',
        'Кнопка 🎲 «Другие» подберёт другие упражнения на те же мышцы.'
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
        'When it feels easy, add 1–2 reps or a little weight.',
        'The 🎲 “Shuffle” button swaps in different exercises for the same muscles.'
      ],
      form: ['Breathe calmly.', 'Keep your back straight.', 'Quality over speed.', 'Muscle soreness is fine; sharp knee pain is not.'],
      stop: ['Sharp knee pain', 'Swelling', 'Joint locking', 'A feeling the knee gives way', 'See a specialist if needed']
    }
  };

  function pick(v, lang) { return (v && typeof v === 'object' && (v.ru !== undefined || v.en !== undefined)) ? (v[lang] || v.ru) : v; }

  window.APP = {
    svgFor: svgFor, POSES: POSES, POOL: POOL,
    WEEK: WEEK, BLOCK_KEYS: BLOCK_KEYS, BLOCK_LABELS: BLOCK_LABELS,
    blockFor: blockFor, INFO: INFO, pick: pick
  };
})();
