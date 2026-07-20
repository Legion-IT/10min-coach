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
    toetraise: GR + H(60, 22) + P('M60 31 V64') +
      P('M60 39 L47 58') + P('M60 39 L73 58') +
      P('M60 64 L54 98 L43 98') + P('M60 64 L66 98 L82 98') +
      '<path class="hint" d="M38 92 l7 -10 l7 10"/>' + '<path class="hint" d="M75 92 l7 -10 l7 10"/>',
    legraise: '<line class="gr" x1="16" y1="98" x2="106" y2="98"/>' + H(26, 84, 8) +
      P('M34 88 L78 91') + P('M78 91 L104 93') + P('M78 91 L64 58') + P('M41 88 L35 97'),
    kneeext: GR + '<rect class="fig" x="44" y="64" width="48" height="8" rx="4"/>' +
      P('M50 72 V100 M86 72 V100') + H(34, 42, 8) + P('M39 48 L56 66') +
      P('M58 68 L80 80 L104 80') + P('M57 68 L66 96') +
      '<path class="hint" d="M89 70 l13 10 l-13 10"/>',
    heelslide: '<line class="gr" x1="16" y1="98" x2="108" y2="98"/>' + H(25, 84, 8) +
      P('M34 88 L68 91') + P('M68 91 L84 75 L101 96') + P('M64 91 L96 94') +
      '<path class="hint" d="M75 84 l18 0 M93 84 l-6 -5 M93 84 l-6 5"/>',
    clamshell: '<line class="gr" x1="16" y1="100" x2="108" y2="100"/>' + H(28, 80, 8) +
      P('M36 84 L70 89') + P('M70 89 L94 98') + P('M70 89 L91 72') + P('M70 89 L88 92') +
      '<path class="hint" d="M83 76 a16 16 0 0 1 18 -4"/>',
    hipabduction: GR + H(58, 23) + P('M58 32 V63') + P('M58 63 L53 100') +
      P('M58 63 L88 73 L99 83') + P('M58 41 L43 50') + P('M58 41 L75 42') +
      '<path class="hint" d="M83 63 l18 17 M101 80 l-8 -1 M101 80 l-3 -8"/>',
    hipadduction: '<line class="gr" x1="16" y1="100" x2="108" y2="100"/>' + H(28, 80, 8) +
      P('M36 84 L72 91') + P('M72 91 L94 76') + P('M71 91 L98 96') + P('M54 88 L70 66') +
      '<path class="hint" d="M58 77 l16 14 M74 91 l-8 -1 M74 91 l-2 -8"/>',
    press: '<rect class="fig" x="22" y="92" width="66" height="8" rx="4"/>' + H(28, 84, 8) +
      P('M37 88 L72 90') + P('M72 90 L85 82 L89 99') +
      P('M46 88 L46 62') + P('M58 90 L58 64') + DB(46, 60, 90) + DB(58, 62, 90),
    fly: '<rect class="fig" x="22" y="92" width="66" height="8" rx="4"/>' + H(28, 84, 8) +
      P('M37 88 L72 90') + P('M72 90 L85 82 L89 99') +
      P('M47 88 L38 66') + DB(36, 63) + P('M59 90 L68 66') + DB(70, 63),
    pullover: '<rect class="fig" x="22" y="92" width="66" height="8" rx="4"/>' + H(28, 84, 8) +
      P('M37 88 L72 90') + P('M72 90 L85 82 L89 99') +
      P('M49 88 L41 55 L31 42') + P('M58 89 L50 55 L40 42') + DB(35, 42, -25) +
      '<path class="hint" d="M39 51 a20 20 0 0 1 18 10"/>',
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
    crunch: '<line class="gr" x1="16" y1="99" x2="106" y2="99"/>' + H(36, 78, 8) +
      P('M43 83 L67 91') + P('M67 91 L86 78 L96 98') + P('M61 91 L93 94') +
      P('M38 81 L31 68') + P('M39 80 L50 69') +
      '<path class="hint" d="M49 76 a18 18 0 0 0 15 12"/>',
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
    sidebend: GR + H(57, 26) + P('M57 35 C48 48 48 59 55 70') +
      P('M55 70 L50 100') + P('M55 70 L68 100') + P('M53 43 L39 59') + P('M61 43 L77 33') +
      DB(38, 63, 90) + '<path class="hint" d="M72 35 a25 25 0 0 0 -17 33"/>',
    rotation: GR + H(58, 32) + '<rect class="fig" x="36" y="72" width="46" height="8" rx="4"/>' +
      P('M44 80 V100 M76 80 V100') + P('M58 41 V68') + P('M48 51 L76 51') +
      '<path class="hint" d="M39 41 a25 15 0 0 1 42 0"/>' + '<path class="hint" d="M81 41 l-8 -1 l4 -7"/>',
    catcow: GR + H(34, 60, 8) + P('M43 63 C55 47 75 47 88 63') +
      P('M48 65 L46 98') + P('M84 65 L86 98') + P('M45 64 L30 78') + P('M88 64 L103 78') +
      '<path class="hint" d="M55 78 C65 88 78 88 88 78"/>',
    mobility: GR + H(60, 26) + P('M60 35 V66') + P('M60 66 L54 100') + P('M60 66 L66 100') +
      P('M60 41 L75 30') + P('M60 41 L46 53') +
      '<path class="hint" d="M78 22 a11 11 0 1 1 -9 4"/>' + '<path class="hint" d="M69 24 l0 7 l7 -1"/>',
    walk: GR + H(58, 22) + P('M58 31 V60') + P('M58 60 L68 85 L66 100') + P('M58 60 L49 85 L47 100') +
      P('M58 39 L50 53') + P('M58 39 L66 51'),
    farmer: GR + H(60, 22) + P('M60 31 V65') + P('M60 65 L54 100') + P('M60 65 L66 100') +
      P('M54 42 L42 70') + P('M66 42 L78 70') + DB(42, 76, 90) + DB(78, 76, 90)
  };

  function svgFor(pose) {
    var inner = POSES[pose] || POSES.march;
    return '<svg class="pose" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle class="bg" cx="60" cy="61" r="57"/>' + inner + '</svg>';
  }

  /* ---- Упражнение / текст ---- */
  function E(nru, nen, rru, ren, p, o) {
    o = o || {};
    return { n: { ru: nru, en: nen }, r: { ru: rru, en: ren }, p: p, s: o.s || null, side: !!o.side, m: o.m || null, e: o.e || null, w: o.w || null };
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
      E('Подъёмы на носки сидя', 'Seated calf raises', '15–20', '15–20', 'calf'),
      E('Подъёмы на носки с гантелями', 'Dumbbell calf raises', '10–15', '10–15', 'calf')
    ],
    legRaise: [
      E('Подъём прямой ноги лёжа', 'Lying straight-leg raise', '8–10 / нога', '8–10 / leg', 'legraise', { side: true }),
      E('Подъём согнутой ноги лёжа', 'Lying bent-knee raise', '10–12 / нога', '10–12 / leg', 'legraise', { side: true }),
      E('Отведение ноги лёжа на боку', 'Side-lying leg raise', '10–12 / нога', '10–12 / leg', 'legraise', { side: true })
    ],
    balance: [
      E('Баланс на одной ноге', 'Single-leg balance', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true }),
      E('Баланс на одной ноге с опорой', 'Single-leg balance with support', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true }),
      E('Баланс с подъёмом колена', 'Single-leg knee-raise hold', '15–25 сек / нога', '15–25 sec / leg', 'balance', { s: 20, side: true }),
      E('Удержание гантели на одной ноге', 'Single-leg dumbbell hold', '20–30 сек / нога', '20–30 sec / leg', 'balance', { s: 25, side: true })
    ],
    chest: [
      E('Жим гантелей лёжа', 'Dumbbell bench press', '8–12', '8–12', 'press'),
      E('Жим гантелей лёжа на полу', 'Floor dumbbell press', '8–12', '8–12', 'press'),
      E('Отжимания от лавочки', 'Bench push-ups', '8–12', '8–12', 'pushup'),
      E('Разведение гантелей лёжа', 'Lying dumbbell fly', '10–12', '10–12', 'fly'),
      E('Отжимания от стены', 'Wall push-ups', '8–12', '8–12', 'pushup')
    ],
    row: [
      E('Тяга одной гантели к поясу', 'One-arm dumbbell row', '8–12 / рука', '8–12 / arm', 'onearmrow', { side: true }),
      E('Тяга гантелей в наклоне', 'Bent-over dumbbell row', '8–12', '8–12', 'bentrow'),
      E('Тяга гантелей грудью на наклонной лавочке', 'Incline chest-supported row', '8–12', '8–12', 'bentrow')
    ],
    shoulderPress: [
      E('Жим гантелей сидя', 'Seated dumbbell press', '8–12', '8–12', 'ohpress'),
      E('Жим гантелей стоя', 'Standing dumbbell press', '8–12', '8–12', 'ohpress'),
      E('Жим Арнольда (мягкий)', 'Arnold press (gentle)', '8–10', '8–10', 'ohpress'),
      E('Жим ладонями вверх у стены', 'Wall shoulder press isometric', '20–30 сек', '20–30 sec', 'ohpress', { s: 25 })
    ],
    lateral: [
      E('Подъём гантелей в стороны', 'Lateral raises', '10–12', '10–12', 'lateral'),
      E('Подъём гантелей перед собой', 'Front raises', '10–12', '10–12', 'lateral'),
      E('Подъём в стороны сидя', 'Seated lateral raises', '10–12', '10–12', 'lateral')
    ],
    rearDelt: [
      E('Разведение гантелей в наклоне', 'Bent-over reverse fly', '10–15', '10–15', 'reversefly'),
      E('Разведение сидя в наклоне', 'Seated bent-over reverse fly', '10–15', '10–15', 'reversefly'),
      E('Отведение прямых рук назад стоя', 'Standing reverse arm sweep', '10–12', '10–12', 'reversefly')
    ],
    biceps: [
      E('Сгибание рук молотком', 'Hammer curls', '8–12', '8–12', 'curl'),
      E('Сгибание рук на бицепс', 'Biceps curls', '8–12', '8–12', 'curl'),
      E('Сгибание рук сидя', 'Seated curls', '8–12', '8–12', 'curl'),
      E('Сгибание руки с самосопротивлением', 'Self-resisted biceps curl', '8–10 / рука', '8–10 / arm', 'curl', { side: true })
    ],
    triceps: [
      E('Разгибание руки из-за головы', 'Overhead triceps extension', '8–12', '8–12', 'ohext'),
      E('Разгибание из-за головы сидя', 'Seated overhead extension', '8–12', '8–12', 'ohext'),
      E('Разгибание из-за головы стоя', 'Standing overhead extension', '8–12', '8–12', 'ohext'),
      E('Разгибание рук от стены', 'Wall triceps press', '8–12', '8–12', 'ohext')
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
      E('Наклоны в стороны', 'Standing side bends', '30–40 сек', '30–40 sec', 'sidebend', { s: 40 })
    ],
    quads: [
      E('Вставание с лавочки', 'Sit-to-stand from bench', '6–8', '6–8', 'squat'),
      E('Неглубокий присед к лавочке с опорой', 'Assisted shallow squat to bench', '6–8', '6–8', 'squat'),
      E('Гоблет-присед к лавочке', 'Goblet box squat', '6–10', '6–10', 'squat'),
      E('Разгибание колена сидя', 'Seated knee extension', '8–10 / нога', '8–10 / leg', 'kneeext', { side: true })
    ],
    hamstrings: [
      E('Румынская тяга', 'Romanian deadlift', '6–10', '6–10', 'rdl'),
      E('Гуд-морнинг (мягкий)', 'Good morning (gentle)', '6–10', '6–10', 'rdl'),
      E('Скольжение пятками лёжа', 'Heel slides', '8–10', '8–10', 'heelslide'),
      E('Мост с пятками дальше от таза', 'Long-lever glute bridge', '8–10', '8–10', 'heelslide')
    ],
    gluteMax: [
      E('Ягодичный мост', 'Glute bridge', '8–12', '8–12', 'bridge'),
      E('Ягодичный мост с гантелью', 'Weighted glute bridge', '8–12', '8–12', 'bridge'),
      E('Сумо-тяга с гантелью', 'Dumbbell sumo deadlift', '6–10', '6–10', 'rdl'),
      E('Ягодичный мост на одной ноге', 'Single-leg glute bridge', '6–8 / нога', '6–8 / leg', 'bridge', { side: true }),
      E('Отведение ноги на четвереньках', 'Quadruped hip extension', '8–10 / нога', '8–10 / leg', 'birddog', { side: true }),
      E('Отведение ноги назад стоя с опорой', 'Supported standing hip extension', '8–10 / нога', '8–10 / leg', 'hipabduction', { side: true })
    ],
    gluteMed: [
      E('Отведение ноги лёжа на боку', 'Side-lying leg raise', '8–10 / нога', '8–10 / leg', 'legraise', { side: true }),
      E('Ракушка лёжа на боку', 'Side-lying clamshell', '8–12 / сторона', '8–12 / side', 'clamshell', { side: true }),
      E('Отведение бедра стоя с опорой', 'Supported standing hip abduction', '8–10 / нога', '8–10 / leg', 'hipabduction', { side: true }),
      E('Боковой шаг без резинки', 'Bodyweight side step', '8–10 / сторона', '8–10 / side', 'hipabduction', { side: true }),
      E('Боковой шаг с гантелью у груди', 'Dumbbell side step', '8–10 / сторона', '8–10 / side', 'hipabduction', { side: true })
    ],
    adductors: [
      E('Приведение ноги лёжа на боку', 'Side-lying hip adduction', '8–10 / нога', '8–10 / leg', 'hipadduction', { side: true }),
      E('Сжимание подушки коленями', 'Pillow knee squeeze', '20–30 сек', '20–30 sec', 'hipadduction', { s: 25 }),
      E('Узкая стойка: мягкое вставание', 'Narrow-stance sit-to-stand', '6–8', '6–8', 'squat'),
      E('Неглубокий сумо-присед с гантелью', 'Dumbbell sumo squat', '6–10', '6–10', 'squat')
    ],
    tibialis: [
      E('Подъём носков стоя у стены', 'Standing toe raises', '10–15', '10–15', 'toetraise'),
      E('Подъём носков сидя', 'Seated toe raises', '12–15', '12–15', 'toetraise'),
      E('Медленный перекат пятка–носок', 'Slow heel-to-toe rocks', '30–40 сек', '30–40 sec', 'toetraise', { s: 35 })
    ],
    lats: [
      E('Тяга одной гантели к поясу', 'One-arm dumbbell row', '6–10 / рука', '6–10 / arm', 'onearmrow', { side: true }),
      E('Пуловер с гантелью лёжа', 'Dumbbell pullover', '8–10', '8–10', 'pullover'),
      E('Тяга локтями назад лёжа грудью на лавке', 'Chest-supported elbow row', '8–10', '8–10', 'bentrow'),
      E('Тяга локтей вниз стоя с напряжением', 'Standing lat pull-down squeeze', '10–12', '10–12', 'bentrow')
    ],
    midBack: [
      E('Тяга гантелей в наклоне', 'Bent-over dumbbell row', '8–10', '8–10', 'bentrow'),
      E('Тяга гантелей грудью на наклонной лавочке', 'Incline chest-supported row', '8–10', '8–10', 'bentrow'),
      E('Сведение лопаток с лёгкими гантелями', 'Dumbbell scapular retraction', '10–12', '10–12', 'reversefly'),
      E('Сведение лопаток стоя', 'Standing scapular squeeze', '10–12', '10–12', 'reversefly')
    ],
    sideDelts: [
      E('Подъём гантелей в стороны', 'Lateral raises', '8–10', '8–10', 'lateral'),
      E('Подъём в стороны сидя', 'Seated lateral raises', '8–10', '8–10', 'lateral'),
      E('Частичные подъёмы в стороны', 'Partial lateral raises', '10–12', '10–12', 'lateral'),
      E('Удержание рук в стороны без веса', 'Bodyweight lateral arm hold', '20–30 сек', '20–30 sec', 'lateral', { s: 25 })
    ],
    lowerAbs: [
      E('Обратное скручивание', 'Reverse crunch', '8–10', '8–10', 'crunch'),
      E('Опускание ног лёжа', 'Lying leg lowers', '6–10', '6–10', 'deadbug'),
      E('Пятка к полу лёжа', 'Dead bug heel taps', '8–10 / сторона', '8–10 / side', 'deadbug', { side: true }),
      E('Dead bug с лёгкой гантелью', 'Dumbbell dead bug', '6–8 / сторона', '6–8 / side', 'deadbug', { side: true })
    ],
    abs: [
      E('Dead bug', 'Dead bug', '6–8 / сторона', '6–8 / side', 'deadbug', { side: true }),
      E('Скручивание с малой амплитудой', 'Small-range crunch', '8–10', '8–10', 'crunch'),
      E('Планка с колен', 'Plank from knees', '20–30 сек', '20–30 sec', 'plank', { s: 25 }),
      E('Планка', 'Forearm plank', '20–30 сек', '20–30 sec', 'plank', { s: 25 }),
      E('Скручивание с лёгкой гантелью', 'Dumbbell crunch', '8–10', '8–10', 'crunch')
    ],
    obliques: [
      E('Боковая планка с колен', 'Side plank from knees', '15–25 сек / сторона', '15–25 sec / side', 'sideplank', { s: 20, side: true }),
      E('Боковая планка', 'Side plank', '15–25 сек / сторона', '15–25 sec / side', 'sideplank', { s: 20, side: true }),
      E('Наклоны в стороны с гантелью', 'Dumbbell side bends', '8–10 / сторона', '8–10 / side', 'sidebend', { side: true }),
      E('Поворот корпуса сидя без рывков', 'Seated trunk rotations', '8–10 / сторона', '8–10 / side', 'rotation', { side: true }),
      E('Колено к противоположному локтю стоя', 'Standing cross-body knee raise', '8–10 / сторона', '8–10 / side', 'rotation', { side: true })
    ],
    spinalErectors: [
      E('Bird dog', 'Bird dog', '6–8 / сторона', '6–8 / side', 'birddog', { side: true }),
      E('Супермен (мягкий)', 'Superman (gentle)', '8–10', '8–10', 'superman'),
      E('Гуд-морнинг без веса', 'Bodyweight good morning', '8–10', '8–10', 'rdl'),
      E('Гуд-морнинг с лёгкой гантелью', 'Dumbbell good morning', '8–10', '8–10', 'rdl')
    ],
    mobility: [
      E('Круги плечами и тазом', 'Shoulder and hip circles', '30–40 сек', '30–40 sec', 'mobility', { s: 40 }),
      E('Кошка-корова', 'Cat-cow', '30–40 сек', '30–40 sec', 'catcow', { s: 40 }),
      E('Мягкая разминка коленей', 'Gentle knee mobility', '30–40 сек', '30–40 sec', 'mobility', { s: 40 })
    ],
    loadedCarry: [
      E('Марш с гантелями на месте', 'Marching with dumbbells', '30–40 сек', '30–40 sec', 'march', { s: 40 }),
      E('Фермерское удержание стоя', 'Farmer hold', '30–40 сек', '30–40 sec', 'farmer', { s: 40 }),
      E('Медленная ходьба с гантелями', 'Slow farmer walk', '30–40 сек', '30–40 sec', 'farmer', { s: 40 })
    ]
  };

  var CAT_MUSCLE = {
    squat: T('квадрицепс', 'quads'), quads: T('квадрицепс', 'quads'),
    glutes: T('ягодицы', 'glutes'), gluteMax: T('большая ягодичная', 'glute max'),
    gluteMed: T('средняя ягодичная', 'glute med'), adductors: T('приводящие бедра', 'adductors'),
    calves: T('икры', 'calves'), tibialis: T('передняя голень', 'tibialis'),
    legRaise: T('сгибатели бедра', 'hip flexors'), balance: T('стабилизаторы', 'stabilizers'),
    chest: T('грудь', 'chest'), row: T('спина', 'back'), lats: T('широчайшие', 'lats'), midBack: T('середина спины', 'mid-back'),
    shoulderPress: T('плечи', 'shoulders'), lateral: T('средняя дельта', 'side delts'), sideDelts: T('средняя дельта', 'side delts'),
    rearDelt: T('задняя дельта', 'rear delts'), biceps: T('бицепс', 'biceps'), triceps: T('трицепс', 'triceps'),
    hinge: T('задняя цепь', 'posterior chain'), hamstrings: T('задняя поверхность бедра', 'hamstrings'),
    coreAntiExt: T('пресс', 'abs'), coreStability: T('кор', 'core'), lowerAbs: T('нижний пресс', 'lower abs'),
    abs: T('пресс', 'abs'), sideCore: T('косые мышцы', 'obliques'), obliques: T('косые мышцы', 'obliques'),
    spinalErectors: T('разгибатели спины', 'spinal erectors'),
    carry: T('общая выносливость', 'conditioning'), loadedCarry: T('хват и корпус', 'grip + core'),
    stretch: T('растяжка', 'stretch'), mobility: T('подвижность', 'mobility')
  };

  function equipmentFor(ex) {
    if (ex.e) return ex.e;
    var n = ex.n.en.toLowerCase();
    if (/bent-over reverse fly/.test(n)) return ['stand'];
    if (/lying dumbbell fly/.test(n)) return ['bench', 'mat'];
    if (/floor|lying|glute bridge|dead bug|plank|bird dog|quadruped|superman|heel slide|clamshell|hip adduction|crunch|cat-cow|pillow/.test(n)) return ['mat'];
    if (/bench|chest-supported|sit-to-stand|box squat|seated|incline|knee extension/.test(n)) return ['bench'];
    if (/pullover|fly/.test(n)) return ['bench', 'mat'];
    return ['stand'];
  }

  function loadFor(ex) {
    if (ex.w) return ex.w;
    var n = ex.n.en.toLowerCase();
    return /dumbbell|goblet|weighted|farmer|curl|lateral raise|front raise|reverse fly|triceps extension|overhead extension|arnold press|romanian deadlift|single-leg rdl|\brow\b/.test(n) ? 'dumbbell' : 'bodyweight';
  }

  Object.keys(POOL).forEach(function (cat) {
    (POOL[cat] || []).forEach(function (ex) {
      if (!ex.m) ex.m = CAT_MUSCLE[cat] || T('всё тело', 'full body');
      if (!ex.e) ex.e = equipmentFor(ex);
      if (!ex.w) ex.w = loadFor(ex);
    });
  });

  /* ---- Блоки-шаблоны: slots = группы мышц, из которых набираются упражнения ---- */
  var LETTERS = {
    A: {
      morning: { title: T('Ноги: все основные мышцы', 'Legs: all major muscles'), slots: ['quads', 'hamstrings', 'gluteMax', 'gluteMed', 'adductors', 'calves', 'tibialis', 'balance'] },
      day: { title: T('Верх: жим, тяга, плечи, руки', 'Upper: push, pull, shoulders, arms'), slots: ['chest', 'lats', 'midBack', 'shoulderPress', 'sideDelts', 'rearDelt', 'triceps', 'biceps'] },
      evening: { title: T('Пресс, спина и задняя цепь', 'Abs, back & posterior chain'), slots: ['abs', 'lowerAbs', 'obliques', 'spinalErectors', 'hamstrings', 'gluteMax', 'loadedCarry', 'mobility'] }
    },
    B: {
      morning: { title: T('Колени, таз и голень', 'Knees, hips & lower leg'), slots: ['mobility', 'quads', 'gluteMed', 'adductors', 'calves', 'tibialis', 'abs', 'loadedCarry'] },
      day: { title: T('Спина, грудь и плечевой пояс', 'Back, chest & shoulder girdle'), slots: ['lats', 'chest', 'midBack', 'rearDelt', 'sideDelts', 'shoulderPress', 'biceps', 'triceps'] },
      evening: { title: T('Руки + пресс без повторов', 'Arms + abs without repeats'), slots: ['biceps', 'triceps', 'abs', 'lowerAbs', 'obliques', 'spinalErectors', 'gluteMax', 'stretch'] }
    },
    C: {
      morning: { title: T('Лёгкий полный низ тела', 'Light full lower body'), slots: ['mobility', 'quads', 'hamstrings', 'gluteMax', 'gluteMed', 'adductors', 'calves', 'balance'] },
      day: { title: T('Лёгкий полный верх тела', 'Light full upper body'), slots: ['chest', 'lats', 'midBack', 'sideDelts', 'rearDelt', 'biceps', 'triceps', 'mobility'] },
      evening: { title: T('Корпус: пресс, косые, поясница', 'Core: abs, obliques, low back'), slots: ['abs', 'lowerAbs', 'obliques', 'spinalErectors', 'gluteMax', 'loadedCarry', 'mobility', 'stretch'] }
    },
    REC: {
      morning: { title: T('Спокойная активность', 'Easy activity'), mode: 'single', ex: [
        E('Спокойная прогулка или ходьба на месте', 'Easy walk or marching in place', '10 минут', '10 min', 'walk', { s: 600 })
      ] },
      day: { title: T('Мягкая подвижность', 'Gentle mobility'), mode: 'single', ex: [
        E('Круги плечами, сгибание/разгибание коленей, растяжка икр', 'Shoulder circles, knee bends, calf stretches', '10 минут', '10 min', 'mobility', { s: 600 })
      ] },
      evening: { title: T('Один лёгкий круг на всё тело', 'One easy full-body round'), mode: 'circuit', rounds: 1, warmup: 30,
        slots: ['mobility', 'gluteMax', 'abs', 'obliques', 'balance', 'loadedCarry'] }
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
      structure: '1 мин разминка · 3–4 упражнения · 2 подхода подряд · отдых на смену веса',
      weight: 'Лёгкий / средний вес. Оставляйте 2–3 повтора в запасе.',
      knees: 'Колени: начинаем очень мягко — без прыжков, глубоких приседаний и выпадов. Если боль — уменьшите амплитуду, используйте опору или пропустите упражнение.',
      tempo: 'Темп медленный и контролируемый.',
      progress: [
        'Неделя 1: один аккуратный подход, без гонки за количеством.',
        'Неделя 2: сохраняйте тот же объём, но делайте движения чище и ровнее.',
        'Когда стало легко — добавьте 1–2 повтора, 5 секунд удержания или немного веса.',
        'Кнопка 🎲 «Другие» подберёт другие упражнения на те же мышцы, без ломки структуры.'
      ],
      form: ['Дышите спокойно.', 'Спина ровная.', 'Живот слегка напряжён, особенно в упражнениях на пресс.', 'Качество важнее скорости.', 'Боль в мышцах допустима, резкая боль в колене — нет.'],
      stop: ['Острая боль в колене', 'Отёк', 'Заклинивание сустава', 'Ощущение, что колено подворачивается', 'При необходимости обратитесь к специалисту']
    },
    en: {
      structure: '1-min warm-up · 3–4 exercises · 2 consecutive sets · time to change weight',
      weight: 'Light / medium weight. Leave 2–3 reps in reserve.',
      knees: 'Knees: start very gently — no jumping, deep squats or lunges. If it hurts, reduce the range, use support, or skip the exercise.',
      tempo: 'Slow, controlled tempo.',
      progress: [
        'Week 1: one careful set, no chasing reps.',
        'Week 2: keep the same volume, but make each rep cleaner and steadier.',
        'When it feels easy, add 1–2 reps, 5 seconds of holding, or a little weight.',
        'The 🎲 “Shuffle” button swaps in different exercises for the same muscles without breaking the structure.'
      ],
      form: ['Breathe calmly.', 'Keep your back straight.', 'Brace your abs lightly, especially on core work.', 'Quality over speed.', 'Muscle soreness is fine; sharp knee pain is not.'],
      stop: ['Sharp knee pain', 'Swelling', 'Joint locking', 'A feeling the knee gives way', 'See a specialist if needed']
    }
  };

  function pick(v, lang) { return (v && typeof v === 'object' && (v.ru !== undefined || v.en !== undefined)) ? (v[lang] || v.ru) : v; }
  function muscleFor(ex, lang) { return ex && ex.m ? pick(ex.m, lang) : ''; }

  /* ---- Объяснения «как делать» (по английскому названию упражнения) ---- */
  var DESC = {
    'Sit-to-stand from bench': T('Сядьте на край лавочки, стопы на ширине таза. Встаньте, отталкиваясь пятками и сжимая ягодицы, затем медленно опуститесь обратно. Колени смотрят на носки, спина прямая.', 'Sit on the edge of the bench, feet hip-width. Stand up by pushing through your heels and squeezing your glutes, then lower back down slowly. Knees track over toes, back straight.'),
    'Assisted shallow squat to bench': T('Держитесь за опору. Опускайтесь неглубоко, как будто садитесь на лавочку, слегка коснитесь её и встаньте. Вес на пятках, спина ровная.', 'Hold a support. Squat shallowly as if sitting toward the bench, lightly touch it and stand. Weight on your heels, back flat.'),
    'Goblet squat (shallow)': T('Держите одну гантель у груди двумя руками. Присядьте неглубоко, разводя колени в стороны, корпус прямой; встаньте через пятки.', 'Hold one dumbbell at your chest with both hands. Squat shallowly with knees pushing out, torso upright; drive up through your heels.'),
    'Box squat to bench': T('Приседайте, пока мягко не коснётесь лавочки, не заваливаясь назад, и сразу встаньте. Контролируйте спуск — не падайте на лавку.', 'Squat until you lightly touch the bench without collapsing back, then stand right up. Control the descent — don’t drop onto the bench.'),
    'Glute bridge': T('Лягте на спину, колени согнуты, стопы на полу. Поднимите таз, сжимая ягодицы, до прямой линии плечи–бёдра, и медленно опуститесь.', 'Lie on your back, knees bent, feet flat. Lift your hips by squeezing your glutes until shoulders–hips form a straight line, then lower slowly.'),
    'Single-leg glute bridge': T('Мост на одной ноге, вторую выпрямите или подтяните к груди. Поднимайте таз ровно, без перекоса. По 8–10 на ногу.', 'Bridge on one leg; extend or tuck the other. Lift your hips evenly, without tilting. 8–10 per leg.'),
    'Glute bridge march': T('В верхней точке моста попеременно отрывайте стопы от пола, как марш, удерживая таз ровным.', 'At the top of the bridge, lift each foot off the floor in turn, like marching, keeping your hips level.'),
    'Quadruped hip extension': T('На четвереньках отведите согнутую ногу назад и вверх, пяткой к потолку. Не прогибайте поясницу — работайте ягодицей.', 'On all fours, push one bent leg back and up, heel toward the ceiling. Don’t arch your lower back — drive with the glute.'),
    'Calf raises': T('Стоя, медленно поднимитесь на носки как можно выше, задержитесь на секунду и плавно опуститесь. Держитесь за опору для баланса.', 'Standing, rise onto your toes as high as you can, pause a second, and lower slowly. Hold a support for balance.'),
    'Single-leg calf raises': T('То же на одной ноге, придерживаясь за опору. По 10–12 на ногу.', 'Same on one leg, holding a support. 10–12 per leg.'),
    'Seated calf raises': T('Сидя, поставьте гантели на колени и поднимайте пятки, вставая на носки. Мягкий вариант для коленей.', 'Seated, rest dumbbells on your knees and lift your heels onto your toes. A knee-friendly option.'),
    'Lying straight-leg raise': T('Лёжа на спине, одна нога согнута. Поднимите прямую ногу до высоты согнутого колена и медленно опустите. Поясница прижата к полу.', 'Lie on your back, one knee bent. Raise the straight leg to the height of the bent knee and lower slowly. Keep your lower back pressed down.'),
    'Lying bent-knee raise': T('Лёжа, поднимайте согнутую в колене ногу к груди и опускайте. Мягко для тазобедренного сустава.', 'Lying down, raise a bent knee toward your chest and lower. Gentle on the hips.'),
    'Side-lying leg raise': T('Лёжа на боку, поднимайте верхнюю прямую ногу вверх и медленно опускайте. Корпус неподвижен.', 'Lying on your side, raise the top straight leg up and lower slowly. Keep your torso still.'),
    'Single-leg balance': T('Стойте на одной ноге, вторую слегка приподнимите. Корпус ровный, взгляд в одну точку. 20–30 сек на ногу.', 'Stand on one leg, lift the other slightly. Torso tall, gaze fixed on one point. 20–30 sec per leg.'),
    'Single-leg balance with support': T('То же, придерживаясь одним пальцем за опору. Постепенно уменьшайте поддержку.', 'Same, with one finger on a support. Gradually rely on it less.'),
    'Single-leg knee-raise hold': T('Стоя на одной ноге, поднимите колено другой до уровня таза и удерживайте. 15–25 сек на ногу.', 'Standing on one leg, raise the other knee to hip height and hold. 15–25 sec per leg.'),
    'Dumbbell bench press': T('Лёжа на лавочке, гантели над грудью. Опускайте до уровня груди, локти под ~45°, и выжимайте вверх. Таз не отрывайте.', 'Lie on the bench, dumbbells over your chest. Lower to chest level, elbows ~45°, then press up. Keep your hips down.'),
    'Floor dumbbell press': T('То же лёжа на полу: локти касаются пола, что ограничивает амплитуду и бережёт плечи.', 'Same but on the floor: your elbows touch the floor, limiting the range and protecting the shoulders.'),
    'Bench push-ups': T('Руки на лавочке чуть шире плеч, тело прямое. Опускайтесь, сгибая локти, и отжимайтесь. Чем выше опора — тем легче.', 'Hands on the bench a bit wider than shoulders, body straight. Lower by bending your elbows, then push up. The higher the surface, the easier.'),
    'Lying dumbbell fly': T('Лёжа, руки с гантелями чуть согнуты. Разведите их в стороны по дуге до лёгкого растяжения груди и сведите обратно.', 'Lying down, arms slightly bent holding dumbbells. Open them out in an arc until you feel a light chest stretch, then bring them back together.'),
    'One-arm dumbbell row': T('Упритесь одной рукой и коленом в лавочку, спина ровная. Тяните гантель к поясу, сводя лопатку, и опускайте. По 8–12 на руку.', 'Brace one hand and knee on the bench, back flat. Pull the dumbbell to your waist, squeezing the shoulder blade, then lower. 8–12 per arm.'),
    'Bent-over dumbbell row': T('Наклонитесь вперёд со прямой спиной, гантели свисают. Тяните к поясу, сводя лопатки, и опускайте.', 'Hinge forward with a flat back, dumbbells hanging. Row them to your waist, squeezing your shoulder blades, then lower.'),
    'Incline chest-supported row': T('Лягте грудью на наклонную лавочку. Тяните гантели к поясу — спина работает без нагрузки на поясницу.', 'Lie chest-down on an incline bench. Row the dumbbells to your waist — the back works without loading the lower back.'),
    'Seated dumbbell press': T('Сидя, спина прямая, гантели у плеч. Выжмите вверх, не до полного замка локтей, и опустите. Поясницу не прогибайте.', 'Seated, back straight, dumbbells at your shoulders. Press up without fully locking the elbows, then lower. Don’t arch your lower back.'),
    'Standing dumbbell press': T('То же стоя, корпус напряжён. Выжимайте вверх, не разворачивая рёбра.', 'Same standing, core braced. Press up without flaring your ribs.'),
    'Arnold press (gentle)': T('Начните с гантелей у груди ладонями к себе, разворачивайте кисти и выжимайте вверх. Медленно и мягко.', 'Start with dumbbells at your chest, palms toward you; rotate your wrists and press up. Slow and gentle.'),
    'Lateral raises': T('Стоя, руки чуть согнуты. Поднимайте гантели через стороны до уровня плеч и медленно опускайте. Не раскачивайтесь.', 'Standing, arms slightly bent. Raise the dumbbells out to shoulder height and lower slowly. Don’t swing.'),
    'Front raises': T('Поднимайте гантели перед собой до уровня плеч и опускайте. Корпус неподвижен.', 'Raise the dumbbells in front of you to shoulder height and lower. Keep your torso still.'),
    'Seated lateral raises': T('То же сидя — исключает раскачку, техника чище.', 'Same seated — removes momentum for cleaner form.'),
    'Bent-over reverse fly': T('В наклоне со прямой спиной разводите гантели в стороны, сводя лопатки. Локти чуть согнуты.', 'Hinged over with a flat back, open the dumbbells out to the sides, squeezing your shoulder blades. Elbows slightly bent.'),
    'Seated bent-over reverse fly': T('То же сидя, грудь к бёдрам. Работают задние дельты и середина спины.', 'Same seated, chest toward your thighs. Works the rear delts and mid-back.'),
    'Hammer curls': T('Ладони смотрят друг на друга. Сгибайте руки, поднимая гантели к плечам, локти у корпуса; опускайте медленно.', 'Palms facing each other. Curl the dumbbells to your shoulders with elbows tucked in; lower slowly.'),
    'Biceps curls': T('Ладони вперёд. Сгибайте руки к плечам, не раскачиваясь корпусом, и опускайте под контролем.', 'Palms forward. Curl to your shoulders without swinging your body, then lower under control.'),
    'Seated curls': T('То же сидя — исключает читинг корпусом.', 'Same seated — removes body swing.'),
    'Overhead triceps extension': T('Держите гантель двумя руками над головой. Опускайте её за голову, сгибая локти, и разгибайте. Локти смотрят вперёд.', 'Hold one dumbbell overhead with both hands. Lower it behind your head by bending your elbows, then extend. Elbows point forward.'),
    'Seated overhead extension': T('То же сидя, спина прямая — устойчивее.', 'Same seated, back straight — more stable.'),
    'Standing overhead extension': T('То же стоя, корпус напряжён.', 'Same standing, core braced.'),
    'Romanian deadlift': T('Гантели у бёдер, колени чуть согнуты. Отводите таз назад, опуская гантели вдоль ног со прямой спиной, до растяжения задней поверхности бедра; вернитесь, сжимая ягодицы.', 'Dumbbells at your thighs, knees soft. Push your hips back, lowering the dumbbells along your legs with a flat back until you feel a hamstring stretch; return by squeezing your glutes.'),
    'Good morning (gentle)': T('Гантель у груди или на плечах. Наклоняйтесь вперёд от таза со прямой спиной и выпрямляйтесь. Амплитуда небольшая.', 'Dumbbell at your chest or shoulders. Hinge forward from the hips with a flat back and stand tall. Keep the range small.'),
    'Single-leg RDL (supported)': T('Держась за опору, наклоняйтесь вперёд, отводя одну ногу назад, спина прямая. По 8–10 на ногу.', 'Holding a support, hinge forward while extending one leg back, flat back. 8–10 per leg.'),
    'Dead bug': T('Лёжа на спине, руки вверх, колени над тазом. Опускайте противоположную руку и ногу, поясница прижата к полу; вернитесь. По 8–10 на сторону.', 'Lie on your back, arms up, knees over hips. Lower the opposite arm and leg while keeping your lower back pressed down; return. 8–10 per side.'),
    'Lying leg lowers': T('Лёжа, ноги вверх. Медленно опускайте ноги, не отрывая поясницу от пола, и поднимайте обратно.', 'Lying down, legs up. Slowly lower your legs without letting your lower back arch, then raise them back.'),
    'Dead bug (arms only)': T('Как dead bug, но двигаются только руки — самый мягкий вариант для кора.', 'Like the dead bug but moving only the arms — the gentlest core option.'),
    'Bird dog': T('На четвереньках вытяните противоположную руку и ногу параллельно полу, удержите баланс, вернитесь. Спина ровная. По 8–10 на сторону.', 'On all fours, extend the opposite arm and leg parallel to the floor, hold your balance, then return. Keep your back flat. 8–10 per side.'),
    'Plank from knees': T('Упор на предплечья и колени, тело прямое от головы до колен. Напрягите живот, не проваливайте поясницу. 20–30 сек.', 'Support on forearms and knees, body straight from head to knees. Brace your abs, don’t let your hips sag. 20–30 sec.'),
    'Forearm plank': T('Упор на предплечья и носки, тело прямое. Напрягите живот и ягодицы. 20–30 сек.', 'Support on forearms and toes, body straight. Brace your abs and glutes. 20–30 sec.'),
    'Superman (gentle)': T('Лёжа на животе, одновременно приподнимите руки и ноги, вытягиваясь; задержитесь и опуститесь. Мягко, без рывка.', 'Lying face down, lift your arms and legs together, lengthening; hold briefly and lower. Gently, no jerking.'),
    'Side plank from knees': T('На боку, упор на предплечье и колени, таз вверх, тело прямое. Держите. 15–25 сек на сторону.', 'On your side, support on forearm and knees, hips up, body straight. Hold. 15–25 sec per side.'),
    'Side plank': T('То же с упором на стопы. Не проваливайте таз. 15–25 сек на сторону.', 'Same supported on your feet. Don’t let your hips drop. 15–25 sec per side.'),
    'Marching with dumbbells': T('С гантелями в руках маршируйте на месте, поднимая колени, корпус прямой. 30–40 сек.', 'Holding dumbbells, march in place lifting your knees, torso tall. 30–40 sec.'),
    'Marching in place': T('Маршируйте на месте в комфортном темпе, руки работают в такт. 40 сек.', 'March in place at a comfortable pace, arms swinging in rhythm. 40 sec.'),
    'High-knee march (gentle)': T('Маршируйте, поднимая колени повыше, но без прыжков и рывков. 30–40 сек.', 'March lifting your knees higher, but no jumping or jerking. 30–40 sec.'),
    'Slow walk': T('Спокойно ходите на месте или по комнате, восстанавливая дыхание. 40 сек.', 'Walk slowly in place or around the room, recovering your breath. 40 sec.'),
    'Gentle stretch': T('Медленно потянитесь всем телом, дышите спокойно, без боли. 30–40 сек.', 'Stretch your whole body slowly, breathing calmly, no pain. 30–40 sec.'),
    'Overhead reach stretch': T('Поднимите руки над головой и мягко тянитесь вверх, вытягивая позвоночник. 30–40 сек.', 'Reach your arms overhead and gently stretch up, lengthening your spine. 30–40 sec.'),
    'Standing side bends': T('Стоя, мягко наклоняйтесь в стороны, растягивая бок. Без рывков. 30–40 сек.', 'Standing, gently bend side to side, stretching your flank. No bouncing. 30–40 sec.'),
    'Goblet box squat': T('Держите гантель у груди и садитесь к лавочке до лёгкого касания. Колени идут по линии носков, корпус высокий, вставайте через пятки.', 'Hold a dumbbell at your chest and sit toward the bench until you lightly touch it. Knees track over toes, torso tall, stand through your heels.'),
    'Seated knee extension': T('Сидя на лавочке, медленно выпрямите одно колено, напрягите переднюю поверхность бедра и опустите. Не бросайте ногу вниз.', 'Sitting on the bench, slowly straighten one knee, tighten the front thigh, then lower. Do not drop the leg.'),
    'Heel slides': T('Лёжа на спине, пятки на полу. Медленно подтягивайте пятки к тазу и возвращайте назад, чувствуя заднюю поверхность бедра.', 'Lie on your back with heels on the floor. Slowly slide your heels toward your hips and back, feeling your hamstrings work.'),
    'Long-lever glute bridge': T('Поставьте пятки чуть дальше от таза, чем в обычном мосте. Поднимайте таз, удерживая рёбра вниз: больше работы для задней поверхности бедра.', 'Place your heels a bit farther from your hips than in a normal bridge. Lift your hips with ribs down: more hamstring work.'),
    'Weighted glute bridge': T('Положите гантель на таз, удерживая её руками. Поднимайте таз за счёт ягодиц, не прогибая поясницу.', 'Place a dumbbell on your hips and hold it. Lift through your glutes without arching your lower back.'),
    'Side-lying clamshell': T('Лёжа на боку, колени согнуты. Стопы вместе, верхнее колено открывается вверх как ракушка. Таз не заваливайте назад.', 'Lie on your side with knees bent. Feet stay together while the top knee opens like a clamshell. Do not roll your pelvis back.'),
    'Supported standing hip abduction': T('Держась за опору, отведите прямую ногу в сторону и верните. Корпус остаётся высоким, носок смотрит вперёд.', 'Holding a support, move one straight leg out to the side and return. Torso stays tall, toes point forward.'),
    'Bodyweight side step': T('Слегка согните колени и сделайте маленький шаг в сторону, затем приставьте вторую ногу. Двигайтесь мягко, без прыжков.', 'Bend knees slightly, take a small side step, then bring the other foot in. Move gently, no jumping.'),
    'Side-lying hip adduction': T('Лёжа на боку, верхнюю ногу поставьте перед собой, нижнюю прямую поднимайте вверх. Работает внутренняя поверхность бедра.', 'Lie on your side, place the top leg in front, and lift the lower straight leg. Works the inner thigh.'),
    'Pillow knee squeeze': T('Сидя или лёжа, зажмите подушку между коленями и мягко сжимайте. Дышите ровно, не задерживайте дыхание.', 'Sitting or lying down, place a pillow between your knees and squeeze gently. Breathe steadily, do not hold your breath.'),
    'Narrow-stance sit-to-stand': T('Стопы чуть уже обычного. Встаньте с лавочки и сядьте обратно медленно, сохраняя колени мягкими и устойчивыми.', 'Feet a little narrower than usual. Stand from the bench and sit back down slowly, keeping knees soft and steady.'),
    'Standing toe raises': T('Спиной к стене или держась за опору, поднимайте носки на себя, пятки остаются на полу. Контролируйте опускание.', 'With your back near a wall or holding support, lift your toes toward you while heels stay down. Control the lowering.'),
    'Seated toe raises': T('Сидя, пятки на полу. Поднимайте носки вверх и медленно опускайте. Хорошо укрепляет переднюю часть голени.', 'Sitting, heels on the floor. Lift your toes up and lower slowly. Strengthens the front of the shin.'),
    'Slow heel-to-toe rocks': T('Медленно перекатывайтесь с пяток на носки и обратно, держась за опору. Движение маленькое и плавное.', 'Slowly rock from heels to toes and back, holding support. Keep the movement small and smooth.'),
    'Dumbbell pullover': T('Лёжа, держите одну гантель двумя руками над грудью. Медленно заведите её за голову до комфортной амплитуды и верните.', 'Lying down, hold one dumbbell with both hands over your chest. Slowly move it behind your head within a comfortable range and return.'),
    'Chest-supported elbow row': T('Лягте грудью на лавочку. Тяните локти назад вдоль корпуса, представляя, что опускаете плечи от ушей.', 'Lie chest-down on the bench. Pull elbows back along your body, imagining your shoulders moving away from your ears.'),
    'Dumbbell scapular retraction': T('В лёгком наклоне или лёжа грудью на лавке сведите лопатки, почти не сгибая локти, и отпустите. Амплитуда маленькая.', 'In a light hinge or chest-supported position, squeeze shoulder blades with almost straight elbows, then release. Small range.'),
    'Partial lateral raises': T('Поднимайте гантели в стороны только до комфортной высоты. Плечи опущены, движение медленное.', 'Raise dumbbells out to the sides only to a comfortable height. Shoulders stay down, movement slow.'),
    'Reverse crunch': T('Лёжа на спине, колени согнуты. Мягко подкрутите таз, подтягивая колени к себе, затем верните без рывка.', 'Lie on your back with knees bent. Gently curl your pelvis to bring knees toward you, then return without jerking.'),
    'Dead bug heel taps': T('Лёжа, колени над тазом. По очереди касайтесь пяткой пола, сохраняя поясницу прижатой. Работает нижний пресс.', 'Lie with knees over hips. Tap one heel to the floor at a time while keeping your lower back down. Works lower abs.'),
    'Small-range crunch': T('Лёжа, стопы на полу. Слегка поднимите лопатки, как будто рёбра тянутся к тазу, и медленно опуститесь. Шею не тяните.', 'Lie with feet on the floor. Lift shoulder blades slightly as ribs move toward hips, then lower slowly. Do not pull your neck.'),
    'Dumbbell side bends': T('Держите лёгкую гантель в одной руке. Наклонитесь в сторону на небольшую амплитуду и вернитесь, не заваливая корпус вперёд.', 'Hold a light dumbbell in one hand. Bend sideways through a small range and return, without folding forward.'),
    'Seated trunk rotations': T('Сидя, поверните корпус вправо и влево в комфортной амплитуде. Движение идёт от рёбер, таз остаётся устойчивым.', 'Sitting, rotate your torso right and left within a comfortable range. Move from the ribs while hips stay steady.'),
    'Bodyweight good morning': T('Руки на груди. Отведите таз назад, наклонитесь с ровной спиной и вернитесь. Это мягкая тренировка поясницы и задней цепи.', 'Hands at chest. Push hips back, hinge with a flat back, and return. A gentle drill for low back and posterior chain.'),
    'Shoulder and hip circles': T('Делайте медленные круги плечами и тазом. Амплитуда комфортная, задача — разогреть суставы.', 'Make slow circles with shoulders and hips. Comfortable range; the goal is to warm the joints.'),
    'Cat-cow': T('На четвереньках мягко округляйте и прогибайте спину, двигаясь вместе с дыханием. Без давления на поясницу.', 'On all fours, gently round and arch your back with your breath. No forcing the lower back.'),
    'Gentle knee mobility': T('Держась за опору, мягко сгибайте и разгибайте колени в небольшой амплитуде. Колени смотрят туда же, куда носки.', 'Holding support, gently bend and straighten your knees through a small range. Knees point the same way as toes.'),
    'Farmer hold': T('Встаньте прямо с гантелями в руках. Плечи вниз, живот слегка напряжён, стойте ровно и дышите.', 'Stand tall holding dumbbells. Shoulders down, abs lightly braced, stand steady and breathe.'),
    'Slow farmer walk': T('Идите медленно с гантелями, корпус высокий, шаги тихие. Если мало места — маршируйте на месте.', 'Walk slowly with dumbbells, torso tall, quiet steps. If space is limited, march in place.'),
    'Dumbbell calf raises': T('Держите гантели по бокам, медленно поднимитесь на носки и так же медленно опуститесь. При необходимости стойте рядом с опорой.', 'Hold dumbbells at your sides, rise slowly onto your toes, then lower with control. Stand near support if needed.'),
    'Single-leg dumbbell hold': T('Держите лёгкую гантель в одной руке и стойте на противоположной ноге рядом с опорой. Корпус ровный, колено мягкое.', 'Hold a light dumbbell in one hand and balance on the opposite leg near support. Stay tall with a soft knee.'),
    'Dumbbell sumo deadlift': T('Поставьте стопы чуть шире плеч, держите гантель перед собой. Отведите таз назад, опустите гантель между ног и встаньте за счёт ягодиц.', 'Stand slightly wider than shoulder width and hold a dumbbell in front. Hinge the hips back, lower it between your legs, then stand using your glutes.'),
    'Dumbbell side step': T('Держите лёгкую гантель у груди. Сделайте небольшой шаг в сторону, сохраняя стопы параллельными и колени мягкими.', 'Hold a light dumbbell at your chest. Take a small step sideways with parallel feet and soft knees.'),
    'Dumbbell sumo squat': T('Держите гантель у груди, стопы немного шире плеч. Присядьте неглубоко, направляя колени по линии носков, затем плавно встаньте.', 'Hold a dumbbell at your chest with feet slightly wider than shoulder width. Squat shallowly with knees tracking toes, then stand smoothly.'),
    'Dumbbell dead bug': T('Лёжа на спине, держите лёгкую гантель над грудью двумя руками. Прижимая поясницу к полу, поочерёдно касайтесь пяткой пола.', 'Lie on your back holding one light dumbbell above your chest with both hands. Keep your lower back down and tap one heel to the floor at a time.'),
    'Dumbbell crunch': T('Лёжа на спине, держите лёгкую гантель у груди. Слегка поднимите лопатки, не тяните шею, затем медленно опуститесь.', 'Lie on your back with a light dumbbell at your chest. Lift the shoulder blades slightly without pulling the neck, then lower slowly.'),
    'Dumbbell good morning': T('Держите лёгкую гантель у груди, колени мягкие. Отведите таз назад с ровной спиной и вернитесь, напрягая ягодицы.', 'Hold a light dumbbell at your chest with soft knees. Hinge the hips back with a long spine, then return by squeezing the glutes.'),
    'Wall push-ups': T('Поставьте ладони на стену чуть шире плеч. Согните локти, приблизьте грудь к стене и плавно оттолкнитесь, сохраняя корпус прямым.', 'Place your hands on a wall slightly wider than your shoulders. Bend the elbows toward the wall and press away while keeping your body straight.'),
    'Wall shoulder press isometric': T('Встаньте спиной к стене, согните руки и мягко давите предплечьями вверх и назад в стену. Плечи не поднимайте к ушам.', 'Stand with your back to a wall, bend your arms, and gently press the forearms upward and back into it. Keep shoulders away from ears.'),
    'Standing reverse arm sweep': T('Встаньте ровно, слегка отведите прямые руки назад и сведите лопатки. Не прогибайте поясницу и не поднимайте плечи.', 'Stand tall, sweep straight arms slightly behind you, and squeeze the shoulder blades. Do not arch the lower back or shrug.'),
    'Self-resisted biceps curl': T('Одной рукой создавайте сопротивление другой. Медленно сгибайте рабочую руку, затем так же медленно разгибайте, сохраняя локоть у корпуса.', 'Use one hand to resist the other. Slowly curl the working arm, then lower with the same control while keeping the elbow by your side.'),
    'Wall triceps press': T('Упритесь ладонями в стену на уровне груди, локти направьте вниз. Согните локти, приблизьте лицо к стене и разогните руки за счёт трицепса.', 'Place hands on a wall at chest height with elbows pointing down. Bend toward the wall, then straighten the arms using the triceps.'),
    'Supported standing hip extension': T('Держась за опору, отведите прямую ногу немного назад, не прогибая поясницу. Сожмите ягодицу и медленно верните ногу.', 'Hold support and move one straight leg slightly behind you without arching the back. Squeeze the glute and return slowly.'),
    'Standing lat pull-down squeeze': T('Поднимите руки, затем тяните локти вниз к рёбрам, сильно напрягая широчайшие. Корпус остаётся ровным.', 'Raise your arms, then pull the elbows down toward your ribs while strongly squeezing the lats. Keep your torso tall.'),
    'Standing scapular squeeze': T('Встаньте ровно, согните руки и мягко сведите лопатки назад и вниз. Не выпячивайте рёбра и не поднимайте плечи.', 'Stand tall with bent arms and gently draw the shoulder blades back and down. Do not flare the ribs or shrug.'),
    'Bodyweight lateral arm hold': T('Поднимите руки в стороны чуть ниже плеч и удерживайте. Локти мягкие, плечи опущены, корпус неподвижен.', 'Raise the arms out to the sides just below shoulder height and hold. Keep elbows soft, shoulders down, and torso still.'),
    'Standing cross-body knee raise': T('Поднимайте колено к противоположному локтю, слегка поворачивая рёбра. Таз остаётся устойчивым, движение спокойное.', 'Lift one knee toward the opposite elbow with a small rib-cage rotation. Keep the hips steady and move calmly.'),
    'Easy walk or marching in place': T('Спокойная прогулка или ходьба на месте 10 минут — лёгкая активность для восстановления.', 'An easy 10-minute walk or marching in place — light activity for recovery.'),
    'Shoulder circles, knee bends, calf stretches': T('Мягкая подвижность 10 минут: круги плечами, лёгкое сгибание/разгибание коленей, растяжка икр. Спокойно.', '10 minutes of gentle mobility: shoulder circles, light knee bends, calf stretches. Take it easy.')
  };
  function descFor(ex, lang) { var d = DESC[ex.n.en]; return d ? (d[lang] || d.ru) : ''; }

  /* ---- Видео «как делать» (YouTube ID по базовому движению = позе) ---- */
  var VIDEO = {
    squat: 'JO7D6GJ98wY', bridge: 'Q_Bpj91Yiis', calf: 'k8ipHzKeAkQ', legraise: 'Zr-PtqcpeWM',
    balance: 'tTQ5QG7rR-s', press: 'pKZMNVbfUzQ', fly: 'IDd4irl0060', onearmrow: 'Qx2f4YwJAu4',
    pushup: '49jfZ_z7-us', plank: 'mH5Sfb_KTGg', bentrow: 'k6zVg1zu-x0', rdl: 'hQgFixeXdZo',
    deadbug: 'g_BYB0R-4Ws', birddog: 'biN8oIV1umA', superman: 'HAjQVUp9mS4', march: '-aQbL65YHR0',
    ohpress: '1jYq9QQEWqE', reversefly: 'Vppb2I0qz3k', lateral: 'pgrWjBfaFe8', curl: 'zC3nLlEvin4',
    ohext: '-Vyt2QdsR7E', sideplank: '7Zat7RFY52Y', stretch: 'H_VH2eilukE', mobility: 'JYqLwajOGjI',
    walk: 'V55s_GcJN_A', catcow: 'xyNwxiuERXc', clamshell: 'Cn09FlW5Zfs', crunch: 'gAyTBB4lm3I',
    farmer: 'lLAw6fUccKA', heelslide: 'Bz0wSFRjH2c', hipabduction: 'qBqKuEQl9sI', hipadduction: 'ha1V5hEhB_E',
    kneeext: 'VuJZ6dqMf8M', pullover: 'Qc4L9I3pHnw', rotation: 'fBQ1nMmf3b0', sidebend: 'wY9nQ-yfRwo',
    toetraise: 'mmLnKYwdDMM'
  };
  function videoFor(ex) { return ex && VIDEO[ex.p] ? VIDEO[ex.p] : ''; }

  window.APP = {
    svgFor: svgFor, POSES: POSES, POOL: POOL,
    WEEK: WEEK, BLOCK_KEYS: BLOCK_KEYS, BLOCK_LABELS: BLOCK_LABELS,
    blockFor: blockFor, INFO: INFO, pick: pick, muscleFor: muscleFor, DESC: DESC, descFor: descFor,
    VIDEO: VIDEO, videoFor: videoFor
  };
})();
