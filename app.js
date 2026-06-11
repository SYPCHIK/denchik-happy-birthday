const gifts = {
  outfit: {
    name: "Друзья тебя круто оденут",
    shortName: "Круто оденут",
    tag: "Сид 1: гардеробный переворот",
    image: "assets/gift-outfit.png",
    fallbackImage: "assets/gift-party.png",
    caption: "Друзья берут стиль в свои руки и выводят Денчика на новый визуальный уровень.",
    reveal:
      "Победил вариант, где друзья официально получают право собрать тебе образ и сделать вид, что так и было задумано.",
  },
  squad: {
    name: "Стрелялка Сквад",
    shortName: "Сквад",
    tag: "Сид 2: тактический подарок",
    image: "assets/gift-squad.png",
    fallbackImage: "assets/gift-tech.png",
    caption: "Подарок для режима, где надо собраться, навестись и доказать, что реакция ещё жива.",
    reveal:
      "Турнир решил: пора в сквад. Осталось только не промахнуться по кнопке получения подарка.",
  },
  motorKit: {
    name: "Конструктор для развития моторики",
    shortName: "Моторика",
    tag: "Квалификант: пальцы в дело",
    image: "assets/gift-motor-kit.png",
    fallbackImage: "assets/gift-tech.png",
    caption: "Подарок, который честно говорит: мелкая моторика сама себя не разовьёт.",
    reveal:
      "Твои руки выбрали труд, развитие и маленькие детали, которые обязательно куда-нибудь укатятся.",
  },
  businessPen: {
    name: "Крутая ручка бизнесмена-миллионера",
    shortName: "Ручка миллионера",
    tag: "Квалификант: подпись решает",
    image: "assets/gift-business-pen.jpeg",
    fallbackImage: "assets/gift-tech.png",
    caption: "Для человека, который может подписать важный контракт, даже если это список продуктов.",
    reveal:
      "Теперь каждая подпись выглядит так, будто за ней стоит нефтяная сделка и уверенный взгляд в будущее.",
  },
  minecraftRtx: {
    name: "Майнкрафт с трассировкой лучей",
    shortName: "Minecraft RTX",
    tag: "Квалификант: кубический люкс",
    image: "assets/gift-minecraft-rtx.png",
    fallbackImage: "assets/gift-tech.png",
    caption: "Тот самый случай, когда кубы внезапно начинают светиться дороже твоей видеокарты.",
    reveal:
      "Трассировка лучей победила: теперь можно смотреть на кубы так, будто это премиальный архитектурный рендер.",
  },
  sampCase: {
    name: "Кейс-миллионера из сампа",
    shortName: "Кейс SAMP",
    tag: "Квалификант: цифровой капитал",
    image: "assets/gift-samp-case.png",
    fallbackImage: "assets/gift-adventure.png",
    caption: "Кейс для статуса, денег, легенды и лёгкого запаха виртуального успеха.",
    reveal:
      "Сетка постановила: миллионерский вайб из SAMP прошёл проверку реальностью почти без потерь.",
  },
  apartmentKit: {
    name: "Набор «Сделай квартиру сам»",
    shortName: "Квартира сам",
    tag: "Квалификант: ремонтный режим",
    image: "assets/gift-apartment-kit.png",
    fallbackImage: "assets/gift-party.png",
    caption: "Подарок для человека, которому пора почувствовать власть над стенами, полом и хаосом.",
    reveal:
      "Поздравляем: теперь квартира не сделает себя сама, зато у тебя есть официальный набор для конфликта с бытом.",
  },
  emptySlot: {
    name: "Секретный подарок на выбор от фаната дедлока",
    shortName: "Секрет от фаната дедлока",
    tag: "Тёмная лошадка турнира",
    image: "assets/вопрос.png",
    fallbackImage: "assets/gift-tech.png",
    caption: "Таинственный слот, где подарок выбирает фанат дедлока, а реальность просто соглашается.",
    reveal: "Победил секретный подарок от фаната дедлока. Что внутри - узнает только избранный.",
    isPlaceholder: false,
  },
};

const tournamentRounds = [
  {
    id: "round1",
    label: "Раунд 1",
    title: "Первый круг подарочного турнира",
    subtitle: "Все претенденты сразу в бою.",
    matches: [
      ["outfit", "squad"],
      ["motorKit", "businessPen"],
      ["sampCase", "apartmentKit"],
      ["minecraftRtx", "emptySlot"],
    ],
  },
  {
    id: "round2",
    label: "Раунд 2",
    title: "Второй круг подарочного турнира",
    subtitle: "Победители первого круга дерутся дальше.",
    matches: [
      ["winner:round1:0", "winner:round1:1"],
      ["winner:round1:2", "winner:round1:3"],
    ],
  },
  {
    id: "final",
    label: "Финал",
    title: "Главная заруба за подарок",
    subtitle: "Один клик решит судьбу Денчика.",
    matches: [["winner:round2:0", "winner:round2:1"]],
  },
];

const state = {
  roundIndex: 0,
  matchIndex: 0,
  winners: createEmptyWinners(),
  history: [],
  resultKey: "outfit",
  realityTimer: null,
  screamerTimers: [],
  screamerImageCache: [],
  horrorMusic: null,
  horrorScream: null,
  horrorScreamLayers: [],
};

const els = {
  startButtons: document.querySelectorAll("[data-start], [data-scroll-to-quiz]"),
  confettiButton: document.querySelector("[data-confetti]"),
  superEffectsButton: document.querySelector("[data-super-effects]"),
  megaEffectsButton: document.querySelector("[data-mega-effects]"),
  realityWarningButton: document.querySelector("[data-reality-warning]"),
  realityWarning: document.querySelector("#realityWarning"),
  closeRealityWarningButtons: document.querySelectorAll("[data-close-reality-warning]"),
  breakRealityButton: document.querySelector("[data-break-reality]"),
  realityDecay: document.querySelector("#realityDecay"),
  decayPixels: document.querySelector("#decayPixels"),
  realityBreak: document.querySelector("#realityBreak"),
  realityBreakFace: document.querySelector("#realityBreak .reality-break__face"),
  bitStorm: document.querySelector("#bitStorm"),
  quizWindow: document.querySelector("#quizWindow"),
  quizSection: document.querySelector("#quiz"),
  closeQuizButton: document.querySelector("#closeQuizButton"),
  stepLabel: document.querySelector("#stepLabel"),
  questionTitle: document.querySelector("#questionTitle"),
  optionsGrid: document.querySelector("#optionsGrid"),
  roundAnnouncer: document.querySelector("#roundAnnouncer"),
  roundAnnouncerLabel: document.querySelector("#roundAnnouncerLabel"),
  roundAnnouncerTitle: document.querySelector("#roundAnnouncerTitle"),
  progressBar: document.querySelector("#progressBar"),
  backButton: document.querySelector("#backButton"),
  restartButton: document.querySelector("#restartButton"),
  resultSection: document.querySelector("#result"),
  resultTitle: document.querySelector("#resultTitle"),
  resultText: document.querySelector("#resultText"),
  resultTag: document.querySelector("#resultTag"),
  giftName: document.querySelector("#giftName"),
  giftCaption: document.querySelector("#giftCaption"),
  resultImage: document.querySelector("#resultImage"),
  revealButton: document.querySelector("#revealButton"),
  retryButton: document.querySelector("#retryButton"),
  modal: document.querySelector("#giftModal"),
  modalText: document.querySelector("#modalText"),
  closeModalButtons: document.querySelectorAll("[data-close-modal]"),
  confettiCanvas: document.querySelector("#confetti"),
};

function createEmptyWinners() {
  return Object.fromEntries(tournamentRounds.map((round) => [round.id, []]));
}

function copyWinners() {
  return Object.fromEntries(Object.entries(state.winners).map(([roundId, winners]) => [roundId, [...winners]]));
}

function getTotalMatchCount() {
  return tournamentRounds.reduce((total, round) => total + round.matches.length, 0);
}

function getCompletedMatchCount() {
  return Object.values(state.winners).reduce((total, winners) => total + winners.filter(Boolean).length, 0);
}

function getCurrentRound() {
  return tournamentRounds[state.roundIndex];
}

function getCurrentMatch() {
  return getCurrentRound().matches[state.matchIndex];
}

function resolveGiftKey(slot) {
  if (!slot.startsWith("winner:")) {
    return slot;
  }

  const [, roundId, matchIndex] = slot.split(":");
  return state.winners[roundId]?.[Number(matchIndex)] ?? null;
}

function resolveGift(slot) {
  const key = resolveGiftKey(slot);
  return key ? gifts[key] : null;
}

function createGiftImage(gift, className) {
  const img = document.createElement("img");
  img.className = className;
  img.alt = gift.name;

  if (!gift.image) {
    img.hidden = true;
    return img;
  }

  img.src = gift.image;
  img.addEventListener(
    "error",
    () => {
      if (gift.fallbackImage && img.src.endsWith(gift.image)) {
        img.src = gift.fallbackImage;
        return;
      }

      img.hidden = true;
      img.closest("[data-gift-card]")?.classList.add("gift-image-missing");
    },
  );
  return img;
}

function getSlotTitle(slot) {
  const gift = resolveGift(slot);

  if (gift) {
    return gift.shortName;
  }

  if (slot.startsWith("winner:")) {
    const [, roundId, matchIndex] = slot.split(":");
    const round = tournamentRounds.find((item) => item.id === roundId);
    return `Победитель ${round?.label ?? "раунда"}-${Number(matchIndex) + 1}`;
  }

  return "Ожидает";
}

function renderTournamentMatch() {
  const round = getCurrentRound();
  const match = getCurrentMatch();
  const giftsInMatch = match.map(resolveGift);
  const completed = getCompletedMatchCount();

  els.stepLabel.textContent = `${round.label} • Матч ${state.matchIndex + 1} из ${round.matches.length}`;
  els.questionTitle.textContent = round.title;
  els.progressBar.style.width = `${(completed / getTotalMatchCount()) * 100}%`;
  els.backButton.disabled = state.history.length === 0;
  els.backButton.style.visibility = state.history.length === 0 ? "hidden" : "visible";
  els.quizSection.hidden = false;
  els.resultSection.hidden = true;

  els.optionsGrid.innerHTML = "";
  giftsInMatch.forEach((gift, index) => {
    const giftKey = resolveGiftKey(match[index]);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gift-duel-card";
    card.dataset.giftCard = "";
    card.classList.toggle("gift-duel-card--placeholder", Boolean(gift.isPlaceholder));
    card.innerHTML = `
      <span class="gift-duel-card__media"></span>
      <span class="gift-duel-card__body">
        <span class="gift-duel-card__label">${index === 0 ? "Левый претендент" : "Правый претендент"}</span>
        <span class="gift-duel-card__title">${gift.name}</span>
        <span class="gift-duel-card__caption">${gift.caption}</span>
        <span class="gift-duel-card__choose">Протащить дальше</span>
      </span>
    `;
    if (gift.image) {
      card.querySelector(".gift-duel-card__media").append(createGiftImage(gift, "gift-duel-card__image"));
    }
    card.addEventListener("click", () => selectTournamentWinner(giftKey));
    els.optionsGrid.append(card);
  });

}

function announceRound(label, title, onDone) {
  els.roundAnnouncerLabel.textContent = label;
  els.roundAnnouncerTitle.textContent = title;
  els.roundAnnouncer.hidden = false;
  triggerSpecialEffects();

  window.setTimeout(() => {
    els.roundAnnouncer.hidden = true;
    onDone();
  }, 1850);
}

function selectTournamentWinner(giftKey) {
  const round = getCurrentRound();
  state.history.push({
    roundIndex: state.roundIndex,
    matchIndex: state.matchIndex,
    winners: copyWinners(),
    resultKey: state.resultKey,
  });

  state.winners[round.id][state.matchIndex] = giftKey;
  burstConfetti(48, {
    x: Math.random() * window.innerWidth,
    y: window.innerHeight * 0.34,
    spread: Math.PI * 2,
    power: 9,
  });

  if (round.id === "final") {
    showResult(giftKey);
    return;
  }

  if (state.matchIndex < round.matches.length - 1) {
    state.matchIndex += 1;
  } else {
    state.roundIndex += 1;
    state.matchIndex = 0;

    const nextRound = getCurrentRound();
    const announcement =
      nextRound.id === "round2"
        ? ["Первый круг закончен", "Начинается второй круг"]
        : ["Второй круг закончен", "Начинается финал"];

    announceRound(announcement[0], announcement[1], renderTournamentMatch);
    return;
  }

  renderTournamentMatch();
}

function showResult(resultKey = state.winners.final[0]) {
  const gift = gifts[resultKey];
  state.resultKey = resultKey;
  els.progressBar.style.width = "100%";
  els.resultTitle.textContent = "Победитель турнира";
  els.resultText.textContent =
    "Сетка всё решила: слабые подарки вылетели, сильный подарок дошёл до финала и теперь делает вид, что так и должно было быть.";
  els.resultTag.textContent = gift.tag;
  els.giftName.textContent = gift.name;
  els.giftCaption.textContent = gift.caption;
  els.resultImage.hidden = false;
  els.resultImage.onerror = () => {
    if (gift.fallbackImage && !els.resultImage.src.endsWith(gift.fallbackImage)) {
      els.resultImage.src = gift.fallbackImage;
      return;
    }

    els.resultImage.hidden = true;
  };
  els.resultImage.alt = gift.name;
  els.resultImage.src = gift.image;
  els.quizSection.hidden = true;
  els.resultSection.hidden = false;
  els.quizWindow.scrollTo({ top: 0, behavior: "smooth" });
  burstConfetti(120);
}

function openQuizWindow() {
  els.quizWindow.hidden = false;
  document.body.classList.add("quiz-open");
  els.quizWindow.scrollTo({ top: 0 });
  restartQuiz();
  burstConfetti(70);
}

function closeQuizWindow() {
  els.quizWindow.hidden = true;
  document.body.classList.remove("quiz-open");
}

function restartQuiz() {
  state.roundIndex = 0;
  state.matchIndex = 0;
  state.winners = createEmptyWinners();
  state.history = [];
  state.resultKey = "outfit";
  renderTournamentMatch();
  els.quizWindow.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack() {
  const previous = state.history.pop();

  if (!previous) {
    return;
  }

  state.roundIndex = previous.roundIndex;
  state.matchIndex = previous.matchIndex;
  state.winners = previous.winners;
  state.resultKey = previous.resultKey;
  renderTournamentMatch();
}

function openModal() {
  const gift = gifts[state.resultKey];
  els.modalText.textContent = gift.reveal;
  els.modal.hidden = false;
  burstConfetti(90);
}

function closeModal() {
  els.modal.hidden = true;
}

function setupLaughAnimation() {
  const card = document.querySelector("#laughCard");
  const frames = [...document.querySelectorAll(".laugh-card__frame")];

  if (!card || frames.length === 0) {
    return;
  }

  function validFrameIndexes() {
    return frames
      .map((frame, index) => ({ frame, index }))
      .filter(({ frame }) => !frame.hidden && frame.complete && frame.naturalWidth > 0)
      .map(({ index }) => index);
  }

  function refreshCardState() {
    const valid = validFrameIndexes();
    card.classList.toggle("laugh-card--ready", valid.length > 0);
    card.classList.toggle("laugh-card--fallback", valid.length === 0);
    return valid;
  }

  frames.forEach((frame) => {
    frame.addEventListener("load", refreshCardState);
    frame.addEventListener("error", () => {
      frame.hidden = true;
      refreshCardState();
    });
  });

  let sequenceIndex = 0;
  const laughSequence = [
    { frame: 0, duration: 1430 },
    { frame: 1, duration: 715 },
    { frame: 2, duration: 360 },
    { frame: 3, duration: 215 },
    { frame: 2, duration: 215 },
    { frame: 3, duration: 215 },
    { frame: 2, duration: 215 },
    { frame: 3, duration: 215 },
    { frame: 2, duration: 215 },
    { frame: 1, duration: 715 },
  ];

  function showNextLaughFrame() {
    const valid = refreshCardState();
    const step = laughSequence[sequenceIndex % laughSequence.length];

    if (valid.length > 0) {
      card.dataset.frame = valid.includes(step.frame) ? String(step.frame) : String(valid[0]);
    }

    sequenceIndex += 1;
    window.setTimeout(showNextLaughFrame, step.duration);
  }

  showNextLaughFrame();
}

function setupConfetti() {
  const ctx = els.confettiCanvas.getContext("2d");
  const colors = ["#ff6b5f", "#20c5ba", "#ffd66b", "#8bd17c", "#fff6e9", "#ff2f2f"];
  const shapes = ["rect", "circle", "line", "star"];
  let pieces = [];
  let lights = [];
  let animationFrame = null;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resize() {
    els.confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
    els.confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function drawStar(size) {
    ctx.beginPath();
    for (let point = 0; point < 10; point += 1) {
      const radius = point % 2 === 0 ? size : size * 0.42;
      const angle = (Math.PI * 2 * point) / 10 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (point === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawLights(now) {
    lights = lights.filter((light) => now - light.createdAt < light.ttl);
    lights.forEach((light) => {
      const age = (now - light.createdAt) / light.ttl;
      const alpha = light.alpha * Math.sin(Math.PI * age);
      const sweep = Math.sin(now / light.speed + light.phase) * light.sweep;
      const topX = light.originX + sweep;
      const gradient = ctx.createLinearGradient(topX, light.originY, light.targetX, light.targetY);
      gradient.addColorStop(0, `${light.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, `${light.color}00`);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.moveTo(topX, light.originY);
      ctx.lineTo(light.targetX - light.width, light.targetY);
      ctx.lineTo(light.targetX + light.width, light.targetY);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    });
  }

  function draw() {
    const now = performance.now();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawLights(now);

    pieces = pieces.filter((piece) => now - piece.createdAt < piece.ttl && piece.y < window.innerHeight + 90);
    pieces.forEach((piece) => {
      const age = (now - piece.createdAt) / piece.ttl;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.spin;
      piece.vx *= piece.drag;
      piece.vy = piece.vy * piece.drag + piece.gravity;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = Math.max(0, 1 - age);
      ctx.fillStyle = piece.color;
      ctx.strokeStyle = piece.color;
      ctx.lineWidth = Math.max(1, piece.size * 0.18);

      if (piece.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, piece.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (piece.shape === "line") {
        ctx.beginPath();
        ctx.moveTo(-piece.size, 0);
        ctx.lineTo(piece.size, 0);
        ctx.stroke();
      } else if (piece.shape === "star") {
        drawStar(piece.size * 0.56);
      } else {
        ctx.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.66);
      }
      ctx.restore();
    });

    if (pieces.length > 0 || lights.length > 0) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      animationFrame = null;
    }
  }

  function ensureDrawing() {
    if (!animationFrame) {
      draw();
    }
  }

  function addBurst(amount, options = {}) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const originX = options.x ?? random(window.innerWidth * 0.08, window.innerWidth * 0.92);
    const originY = options.y ?? random(window.innerHeight * 0.08, window.innerHeight * 0.56);
    const spread = options.spread ?? Math.PI * 2;
    const baseAngle = options.angle ?? -Math.PI / 2;
    const power = options.power ?? 8;
    const palette = options.colors ?? colors;

    for (let index = 0; index < amount; index += 1) {
      const angle = baseAngle + random(-spread / 2, spread / 2);
      const speed = random(power * 0.28, power);
      pieces.push({
        x: originX + random(-12, 12),
        y: originY + random(-12, 12),
        vx: Math.cos(angle) * speed + random(-1.1, 1.1),
        vy: Math.sin(angle) * speed + random(-0.8, 0.8),
        size: random(options.minSize ?? 5, options.maxSize ?? 13),
        spin: random(-0.32, 0.32),
        rotation: Math.random() * Math.PI,
        color: palette[Math.floor(Math.random() * palette.length)],
        shape: options.shape ?? shapes[Math.floor(Math.random() * shapes.length)],
        gravity: options.gravity ?? 0.08,
        drag: options.drag ?? 0.992,
        ttl: options.ttl ?? random(1600, 2800),
        createdAt: performance.now(),
      });
    }

    ensureDrawing();
  }

  function addStageLights(count = 5, ttl = 1600) {
    const lightColors = ["#ff6b5f", "#20c5ba", "#ffd66b", "#8bd17c", "#ff2f2f"];

    for (let index = 0; index < count; index += 1) {
      lights.push({
        originX: random(window.innerWidth * 0.02, window.innerWidth * 0.98),
        originY: random(-40, 22),
        targetX: random(window.innerWidth * 0.08, window.innerWidth * 0.92),
        targetY: window.innerHeight + random(20, 160),
        width: random(70, 190),
        color: lightColors[index % lightColors.length],
        alpha: random(0.22, 0.46),
        ttl,
        createdAt: performance.now(),
        speed: random(160, 360),
        phase: random(0, Math.PI * 2),
        sweep: random(10, 80),
      });
    }

    ensureDrawing();
  }

  window.burstConfetti = (amount = 70, options = {}) => {
    addBurst(amount, options);
  };

  window.stageLights = addStageLights;

  resize();
  window.addEventListener("resize", resize);
}

function addScreenFlash() {
  const flash = document.createElement("div");
  flash.className = "stage-flash";
  document.body.append(flash);
  flash.addEventListener("animationend", () => flash.remove(), { once: true });
}

function addSoundRing(x = window.innerWidth / 2, y = window.innerHeight / 2, color = "#ffd66b") {
  const ring = document.createElement("span");
  ring.className = "sound-ring";
  ring.style.setProperty("--x", `${x}px`);
  ring.style.setProperty("--y", `${y}px`);
  ring.style.setProperty("--color", color);
  document.body.append(ring);
  ring.addEventListener("animationend", () => ring.remove(), { once: true });
}

function triggerSpecialEffects() {
  burstConfetti(90, {
    x: window.innerWidth * 0.16,
    y: window.innerHeight * 0.92,
    angle: -Math.PI / 3,
    spread: Math.PI * 0.78,
    power: 12,
  });
  burstConfetti(90, {
    x: window.innerWidth * 0.84,
    y: window.innerHeight * 0.92,
    angle: (-Math.PI * 2) / 3,
    spread: Math.PI * 0.78,
    power: 12,
  });
  burstConfetti(60, {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.08,
    angle: Math.PI / 2,
    spread: Math.PI * 0.9,
    power: 7,
  });
  addSoundRing(window.innerWidth * 0.5, window.innerHeight * 0.45, "#ffd66b");
}

function triggerSuperEffects() {
  stageLights(7, 2100);
  addScreenFlash();
  triggerSpecialEffects();

  [0.28, 0.5, 0.72].forEach((xRatio, index) => {
    window.setTimeout(() => {
      burstConfetti(70, {
        x: window.innerWidth * xRatio,
        y: window.innerHeight * randomFromList([0.24, 0.38, 0.52]),
        spread: Math.PI * 2,
        power: 10 + index * 1.4,
        ttl: 2300,
      });
      addSoundRing(window.innerWidth * xRatio, window.innerHeight * 0.42, ["#20c5ba", "#ffd66b", "#ff6b5f"][index]);
    }, 180 + index * 210);
  });
}

function randomFromList(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function triggerMegaEffects() {
  triggerSuperEffects();
  document.documentElement.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: "translate(4px, -3px)" },
      { transform: "translate(-3px, 4px)" },
      { transform: "translate(2px, 2px)" },
      { transform: "translate(0, 0)" },
    ],
    { duration: 520, iterations: 2 },
  );

  for (let wave = 0; wave < 6; wave += 1) {
    window.setTimeout(() => {
      stageLights(4, 1600);
      addScreenFlash();
      burstConfetti(120, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.55,
        spread: Math.PI * 2,
        power: 13,
        gravity: 0.055,
        ttl: 3000,
        minSize: 4,
        maxSize: 16,
      });
      addSoundRing(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.7, randomFromList(["#ff2f2f", "#20c5ba", "#ffd66b"]));
    }, wave * 260);
  }
}

function openRealityWarning() {
  els.realityWarning.hidden = false;
}

function closeRealityWarning() {
  els.realityWarning.hidden = true;
}

function getHorrorAudio() {
  if (!state.horrorMusic) {
    state.horrorMusic = new Audio("assets/horror-music.mp3");
    state.horrorMusic.loop = true;
    state.horrorMusic.preload = "auto";
    state.horrorMusic.volume = 0.88;
  }

  if (!state.horrorScream) {
    state.horrorScream = new Audio("assets/horror-scream.mp3");
    state.horrorScream.preload = "auto";
    state.horrorScream.volume = 1;
  }

  if (state.horrorScreamLayers.length !== 9) {
    state.horrorScreamLayers.forEach((layer) => layer.pause());
    state.horrorScreamLayers = Array.from({ length: 9 }, () => {
      const layer = new Audio("assets/horror-scream.mp3");
      layer.preload = "auto";
      layer.volume = 1;
      return layer;
    });
  }

  return {
    music: state.horrorMusic,
    scream: state.horrorScream,
    screamLayers: state.horrorScreamLayers,
  };
}

function primeHorrorAudio() {
  const { music, scream, screamLayers } = getHorrorAudio();

  [music, scream, ...screamLayers].forEach((item) => {
    item.preload = "auto";
    item.load();

    try {
      item.currentTime = 0;
    } catch {}
  });

  return { music, scream, screamLayers };
}

function playAudio(audio) {
  try {
    audio.currentTime = 0;
  } catch {}

  const playAttempt = audio.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }
}

function startHorrorMusic() {
  const { music } = primeHorrorAudio();
  music.volume = 0.88;
  playAudio(music);
}

function playScreamerSound() {
  const { scream, screamLayers } = getHorrorAudio();

  [scream, ...screamLayers].forEach((layer) => {
    layer.volume = 1;
    playAudio(layer);
  });
}

function stopHorrorAudio() {
  const { music, scream, screamLayers } = getHorrorAudio();
  [music, scream, ...screamLayers].forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function createBitStorm() {
  const values = ["0", "1", "ERROR", "404", "DR", "BIRTHDAY", "REALITY", "DENCHIK"];
  els.bitStorm.innerHTML = "";

  for (let index = 0; index < 160; index += 1) {
    const bit = document.createElement("span");
    bit.className = "bit";
    bit.textContent = randomFromList(values);
    bit.style.setProperty("--x", `${Math.random() * 100}%`);
    bit.style.setProperty("--y", `${Math.random() * -55}%`);
    bit.style.setProperty("--dx", `${(Math.random() - 0.5) * 160}px`);
    bit.style.setProperty("--rot", `${(Math.random() - 0.5) * 980}deg`);
    bit.style.setProperty("--duration", `${900 + Math.random() * 1900}ms`);
    bit.style.setProperty("--size", `${12 + Math.random() * 22}px`);
    bit.style.setProperty("--color", randomFromList(["#ff2f2f", "#20c5ba", "#ffd66b", "#fff6e9"]));
    els.bitStorm.append(bit);
  }
}

function primeScreamerImages() {
  if (state.screamerImageCache.length > 0) {
    return;
  }

  state.screamerImageCache = [
    "assets/screamer 1.png",
    "assets/screamer 2.png",
    "assets/screamer 3.jpeg",
    "assets/screamer 4.png",
  ].map((src) => {
    const image = new Image();
    image.src = src;
    return image;
  });
}

function clearScreamerTimers() {
  state.screamerTimers.forEach((timer) => window.clearTimeout(timer));
  state.screamerTimers = [];
}

function scheduleScreamerFaces() {
  clearScreamerTimers();
  const blinkFrames = ["assets/screamer 1.png", "assets/screamer 2.png"];
  const blinkDuration = 3200;
  const startedAt = performance.now();
  els.realityBreak.dataset.phase = "blink";
  els.realityBreakFace.src = blinkFrames[0];

  function blink() {
    const elapsed = performance.now() - startedAt;

    if (elapsed >= blinkDuration || els.realityBreak.hidden) {
      return;
    }

    els.realityBreakFace.src = blinkFrames[Math.floor(elapsed / 120) % blinkFrames.length];
    state.screamerTimers.push(window.setTimeout(blink, 120));
  }

  blink();
  state.screamerTimers.push(
    window.setTimeout(() => {
      els.realityBreak.dataset.phase = "hold";
      els.realityBreakFace.src = "assets/screamer 3.jpeg";
    }, 3400),
    window.setTimeout(() => {
      els.realityBreak.dataset.phase = "hold";
      els.realityBreakFace.src = "assets/screamer 4.png";
    }, 5400),
  );
}

function createDecayPixels() {
  const palette = ["#ff2f2f", "#20c5ba", "#ffd66b", "#ffffff", "#050609"];
  els.decayPixels.innerHTML = "";

  for (let index = 0; index < 120; index += 1) {
    const pixel = document.createElement("span");
    pixel.className = "decay-pixel";
    pixel.style.setProperty("--x", `${Math.random() * 100}%`);
    pixel.style.setProperty("--y", `${Math.random() * 100}%`);
    pixel.style.setProperty("--size", `${4 + Math.random() * 34}px`);
    pixel.style.setProperty("--color", randomFromList(palette));
    pixel.style.setProperty("--jitter-x", `${(Math.random() - 0.5) * 80}px`);
    pixel.style.setProperty("--jitter-y", `${(Math.random() - 0.5) * 80}px`);
    pixel.style.setProperty("--fall-x", `${(Math.random() - 0.5) * 220}px`);
    pixel.style.setProperty("--fall-y", `${120 + Math.random() * 260}px`);
    pixel.style.setProperty("--duration", `${1400 + Math.random() * 2600}ms`);
    pixel.style.animationDelay = `${Math.random() * 2100}ms`;
    els.decayPixels.append(pixel);
  }
}

function startScreamerPhase() {
  state.realityTimer = null;
  els.realityDecay.hidden = true;
  els.decayPixels.innerHTML = "";
  clearScreamerTimers();
  els.realityBreak.dataset.phase = "blink";
  els.realityBreakFace.src = "assets/screamer 1.png";
  els.realityBreak.hidden = false;
  scheduleScreamerFaces();
  playScreamerSound();
  createBitStorm();
  triggerMegaEffects();

  for (let wave = 0; wave < 8; wave += 1) {
    window.setTimeout(() => {
      createBitStorm();
      stageLights(8, 1400);
      burstConfetti(160, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        spread: Math.PI * 2,
        power: 16,
        colors: ["#ff2f2f", "#ffffff", "#20c5ba"],
        ttl: 2200,
      });
    }, wave * 520);
  }

  window.setTimeout(() => {
    els.realityBreak.hidden = true;
    els.bitStorm.innerHTML = "";
    clearScreamerTimers();
    stopHorrorAudio();
  }, 7200);
}

function breakReality() {
  closeRealityWarning();
  if (state.realityTimer) {
    window.clearTimeout(state.realityTimer);
  }
  stopHorrorAudio();
  els.realityDecay.hidden = false;
  els.realityBreak.hidden = true;
  els.realityBreak.dataset.phase = "blink";
  els.bitStorm.innerHTML = "";
  primeHorrorAudio();
  primeScreamerImages();
  createDecayPixels();
  startHorrorMusic();
  stageLights(4, 3900);

  state.realityTimer = window.setTimeout(startScreamerPhase, 4000);
}

function stopRealityMeltdown() {
  if (state.realityTimer) {
    window.clearTimeout(state.realityTimer);
    state.realityTimer = null;
  }

  els.realityDecay.hidden = true;
  els.realityBreak.hidden = true;
  els.decayPixels.innerHTML = "";
  els.bitStorm.innerHTML = "";
  clearScreamerTimers();
  stopHorrorAudio();
}

setupConfetti();
setupLaughAnimation();

els.startButtons.forEach((button) => {
  button.addEventListener("click", openQuizWindow);
});

els.confettiButton.addEventListener("click", triggerSpecialEffects);
els.superEffectsButton.addEventListener("click", triggerSuperEffects);
els.megaEffectsButton.addEventListener("click", triggerMegaEffects);
els.realityWarningButton.addEventListener("click", openRealityWarning);
els.closeRealityWarningButtons.forEach((button) => button.addEventListener("click", closeRealityWarning));
els.breakRealityButton.addEventListener("click", breakReality);
els.closeQuizButton.addEventListener("click", closeQuizWindow);
els.backButton.addEventListener("click", goBack);
els.restartButton.addEventListener("click", restartQuiz);
els.retryButton.addEventListener("click", restartQuiz);
els.revealButton.addEventListener("click", openModal);
els.closeModalButtons.forEach((button) => button.addEventListener("click", closeModal));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!els.modal.hidden) {
      closeModal();
      return;
    }

    if (!els.realityWarning.hidden) {
      closeRealityWarning();
      return;
    }

    if (!els.realityDecay.hidden || !els.realityBreak.hidden) {
      stopRealityMeltdown();
      return;
    }

    if (!els.quizWindow.hidden) {
      closeQuizWindow();
    }
  }
});

renderTournamentMatch();
setTimeout(() => burstConfetti(55), 600);
