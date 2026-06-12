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
    name: "Диск с игрой",
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

const TOURNAMENT_CHOICE_ADVANCE_DELAY = 120;
const TOURNAMENT_CLICK_SOUND_SRC = "assets/minecraft_click.mp3";
const TOURNAMENT_CLICK_SOUND_OFFSET = 0.2;

const SOUND_MUTED_STORAGE_KEY = "denchik-sound-muted";

function readStoredMuteState() {
  try {
    return window.localStorage.getItem(SOUND_MUTED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

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
  purpleScreamerSound: null,
  effectAudioContext: null,
  tournamentClickSounds: [],
  tournamentClickSoundIndex: 0,
  tournamentClickSoundPrimed: false,
  tournamentClickBuffer: null,
  tournamentClickBufferPromise: null,
  partyPopperSound: null,
  megaExplosionSound: null,
  openGiftSound: null,
  roundAnnounceSound: null,
  mainTheme: null,
  finalTheme: null,
  activeTheme: "main",
  musicStarted: false,
  themeFadeTimer: null,
  soundMuted: readStoredMuteState(),
};

const els = {
  musicToggle: document.querySelector("#musicToggle"),
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
  claimGiftButton: document.querySelector("#claimGiftButton"),
  friendshipFinale: document.querySelector("#friendshipFinale"),
  friendshipMessage: document.querySelector("#friendshipMessage"),
  closeFinaleButtons: document.querySelectorAll("[data-close-finale]"),
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

    let isChosen = false;
    const chooseGift = (event) => {
      event?.preventDefault();

      if (isChosen) {
        return;
      }

      isChosen = true;
      card.classList.add("gift-duel-card--chosen");

      const rect = card.getBoundingClientRect();
      let particleX = rect.left + rect.width / 2;
      let particleY = rect.top + rect.height / 2;

      if (typeof event?.clientX === "number" && (event.clientX !== 0 || event.clientY !== 0)) {
        particleX = event.clientX;
        particleY = event.clientY;
      }

      spawnBlockParticles(particleX, particleY);
      window.setTimeout(() => selectTournamentWinner(giftKey), TOURNAMENT_CHOICE_ADVANCE_DELAY);
    };

    card.addEventListener("pointerdown", chooseGift);
    card.addEventListener("click", chooseGift);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        chooseGift(event);
      }
    });
    els.optionsGrid.append(card);
  });

}

function announceRound(label, title, onDone) {
  els.roundAnnouncerLabel.textContent = label;
  els.roundAnnouncerTitle.textContent = title;
  els.roundAnnouncer.hidden = false;
  playRoundAnnounceSound();

  window.setTimeout(() => {
    els.roundAnnouncer.hidden = true;
    onDone();
  }, 1850);
}

function selectTournamentWinner(giftKey, { playSound = true } = {}) {
  if (playSound) {
    playTournamentClickSound();
  }

  const round = getCurrentRound();
  state.history.push({
    roundIndex: state.roundIndex,
    matchIndex: state.matchIndex,
    winners: copyWinners(),
    resultKey: state.resultKey,
  });

  state.winners[round.id][state.matchIndex] = giftKey;

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
  playTheme("final", { restart: true });
  burstConfetti(120);
}

function openQuizWindow() {
  primeTournamentClickSound();
  els.quizWindow.hidden = false;
  document.body.classList.add("quiz-open");
  els.quizWindow.scrollTo({ top: 0 });
  restartQuiz();
  burstConfetti(70);
}

function closeQuizWindow() {
  els.quizWindow.hidden = true;
  document.body.classList.remove("quiz-open");
  playTheme("main");
}

function restartQuiz() {
  playTheme("main");
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
  playOpenGiftSound();
  const gift = gifts[state.resultKey];
  els.modalText.textContent = gift.reveal;
  els.modal.hidden = false;
  burstConfetti(90);
}

function closeModal() {
  els.modal.hidden = true;
}

const FRIENDSHIP_MESSAGE =
  "Не важно, что ты выбрал, ведь главный подарок — это наша дружба сквозь века";

function openFriendshipFinale() {
  closeModal();
  els.friendshipMessage.innerHTML = "";

  FRIENDSHIP_MESSAGE.split(" ").forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "friendship-word";
    span.textContent = word;
    span.style.animationDelay = `${260 + index * 140}ms`;
    els.friendshipMessage.append(span);

    const wordAt = 0.26 + index * 0.14;
    playTextBlip(wordAt, 0.92 + Math.random() * 0.16);

    if (word.length > 5) {
      playTextBlip(wordAt + 0.07, 0.92 + Math.random() * 0.16);
    }
  });

  els.friendshipFinale.hidden = false;
  playPartyPopper(0, 1.1);
  playPartyHorn(0.12, 1);
  playConfettiRustle(0.18, 1.4);
  burstConfetti(150, { y: window.innerHeight * 0.7, power: 13 });
  window.setTimeout(() => burstConfetti(90, { y: window.innerHeight * 0.3 }), 900);
}

function closeFriendshipFinale() {
  els.friendshipFinale.hidden = true;
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
      const alphaHex = (value) => Math.round(Math.min(1, Math.max(0, value)) * 255).toString(16).padStart(2, "0");
      // лампа закреплена сверху, по дуге ходит широкий конец луча
      const sweep = Math.sin(now / light.speed + light.phase) * light.sweep;
      const baseX = light.targetX + sweep;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // широкий мягкий конус
      const cone = ctx.createLinearGradient(light.originX, light.originY, baseX, light.targetY);
      cone.addColorStop(0, `${light.color}${alphaHex(alpha)}`);
      cone.addColorStop(1, `${light.color}00`);
      ctx.beginPath();
      ctx.moveTo(light.originX, light.originY);
      ctx.lineTo(baseX - light.width, light.targetY);
      ctx.lineTo(baseX + light.width, light.targetY);
      ctx.closePath();
      ctx.fillStyle = cone;
      ctx.fill();

      // яркое ядро луча
      const core = ctx.createLinearGradient(light.originX, light.originY, baseX, light.targetY);
      core.addColorStop(0, `${light.color}${alphaHex(alpha * 1.8)}`);
      core.addColorStop(1, `${light.color}00`);
      ctx.beginPath();
      ctx.moveTo(light.originX, light.originY);
      ctx.lineTo(baseX - light.width * 0.32, light.targetY);
      ctx.lineTo(baseX + light.width * 0.32, light.targetY);
      ctx.closePath();
      ctx.fillStyle = core;
      ctx.fill();

      // светящийся фонарь у источника
      const glow = ctx.createRadialGradient(light.originX, light.originY, 0, light.originX, light.originY, 32);
      glow.addColorStop(0, `${light.color}${alphaHex(alpha * 2.4)}`);
      glow.addColorStop(1, `${light.color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(light.originX, light.originY, 32, 0, Math.PI * 2);
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
      } else if (piece.shape === "orb") {
        const radius = piece.size * 0.5;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, "#f4ffd9");
        gradient.addColorStop(0.55, piece.color);
        gradient.addColorStop(1, `${piece.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
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
        originY: random(-14, 14),
        targetX: random(window.innerWidth * 0.08, window.innerWidth * 0.92),
        targetY: window.innerHeight + random(20, 160),
        width: random(70, 190),
        color: lightColors[index % lightColors.length],
        alpha: random(0.26, 0.5),
        ttl,
        createdAt: performance.now(),
        speed: random(220, 420),
        phase: random(0, Math.PI * 2),
        sweep: random(80, 230),
      });
    }

    ensureDrawing();
  }

  window.burstConfetti = (amount = 70, options = {}) => {
    addBurst(amount, options);
  };

  window.stageLights = addStageLights;

  // зелёные орбы опыта, всплывающие снизу, как в майнкрафте
  window.xpOrbRise = (count = 24) => {
    for (let index = 0; index < count; index += 1) {
      addBurst(1, {
        x: random(window.innerWidth * 0.05, window.innerWidth * 0.95),
        y: window.innerHeight + random(0, 50),
        angle: -Math.PI / 2,
        spread: 0.5,
        power: random(2.2, 3.8),
        gravity: -0.012,
        drag: 0.997,
        shape: "orb",
        colors: ["#8bd17c", "#aef25a", "#7ce85a", "#caff70"],
        minSize: 6,
        maxSize: 13,
        ttl: random(2400, 3800),
      });
    }
  };

  resize();
  window.addEventListener("resize", resize);
}

function addScreenFlash() {
  const flash = document.createElement("div");
  flash.className = "stage-flash";
  document.body.append(flash);
  flash.addEventListener("animationend", () => flash.remove(), { once: true });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function launchFirework({ x, delay = 0, color } = {}) {
  if (prefersReducedMotion()) {
    return;
  }

  window.setTimeout(() => {
    const rocket = document.createElement("span");
    rocket.className = "firework-rocket";
    const originX = x ?? window.innerWidth * (0.1 + Math.random() * 0.8);
    const targetY = window.innerHeight * (0.16 + Math.random() * 0.3);
    const duration = 520 + Math.random() * 280;
    const hue = color ?? randomFromList(["#ffd66b", "#20c5ba", "#ff6b5f", "#8bd17c", "#fff6e9"]);
    rocket.style.setProperty("--x", `${originX}px`);
    rocket.style.setProperty("--ty", `${targetY - window.innerHeight}px`);
    rocket.style.setProperty("--duration", `${duration}ms`);
    rocket.style.setProperty("--color", hue);
    rocket.addEventListener(
      "animationend",
      () => {
        rocket.remove();
        burstConfetti(48, {
          x: originX,
          y: targetY,
          spread: Math.PI * 2,
          power: 9.5,
          gravity: 0.05,
          ttl: 2200,
        });
        addSoundRing(originX, targetY, hue);
      },
      { once: true },
    );
    document.body.append(rocket);
  }, delay);
}

const MEGA_WORDS = ["РОК-Н-РОООЛ!!!", "ИМБА!", "МЕГА-БУМ!", "С НАСТУПАЮЩИМ, ДЕНЧИК!", "ЗАРУБА ГОДА!"];

const BOOM_PUFF_COLORS = ["#fff6e9", "#dcdcdc", "#a8a8a8", "#ffae5e", "#ff7b3a"];

function explodeMinecraft(x, y, { puffs = 14, blocks = 16 } = {}) {
  if (prefersReducedMotion()) {
    return;
  }

  addScreenFlash();
  addSoundRing(x, y, "#fff6e9");
  spawnBlockParticles(x, y, blocks);

  for (let index = 0; index < puffs; index += 1) {
    const puff = document.createElement("span");
    puff.className = "boom-puff";
    const angle = Math.random() * Math.PI * 2;
    const distance = 26 + Math.random() * 110;
    puff.style.setProperty("--x", `${x}px`);
    puff.style.setProperty("--y", `${y}px`);
    puff.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    puff.style.setProperty("--dy", `${Math.sin(angle) * distance - 18}px`);
    puff.style.setProperty("--size", `${12 + Math.random() * 22}px`);
    puff.style.setProperty("--duration", `${420 + Math.random() * 260}ms`);
    puff.style.setProperty("--color", randomFromList(BOOM_PUFF_COLORS));
    puff.addEventListener("animationend", () => puff.remove(), { once: true });
    document.body.append(puff);
  }

  document.documentElement.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: "translate(4px, -3px)" },
      { transform: "translate(-3px, 3px)" },
      { transform: "translate(0, 0)" },
    ],
    { duration: 220, iterations: 1 },
  );
}

function dropTnt({ x, delay = 0 } = {}) {
  if (prefersReducedMotion()) {
    return;
  }

  window.setTimeout(() => {
    const tnt = document.createElement("span");
    tnt.className = "tnt-block";
    const originX = x ?? window.innerWidth * (0.12 + Math.random() * 0.76);
    const targetY = window.innerHeight * (0.5 + Math.random() * 0.3);
    tnt.style.setProperty("--x", `${originX}px`);
    tnt.style.setProperty("--size", `${30 + Math.random() * 14}px`);
    tnt.style.setProperty("--dy", `${targetY + 48}px`);
    tnt.style.setProperty("--rot", `${(Math.random() * 2 - 1) * 36}deg`);
    tnt.style.setProperty("--fall", `${680 + Math.random() * 320}ms`);
    tnt.addEventListener("animationend", (event) => {
      if (event.animationName !== "tntFall") {
        return;
      }

      tnt.remove();
      explodeMinecraft(originX, targetY, { puffs: 14, blocks: 16 });
    });
    document.body.append(tnt);
  }, delay);
}

function summonCreeper({ delay = 0 } = {}) {
  if (prefersReducedMotion()) {
    return;
  }

  window.setTimeout(() => {
    const creeper = document.createElement("span");
    creeper.className = "creeper-face";
    const x = window.innerWidth * (0.15 + Math.random() * 0.7);
    const y = window.innerHeight * (0.3 + Math.random() * 0.4);
    creeper.style.setProperty("--x", `${x}px`);
    creeper.style.setProperty("--y", `${y}px`);
    creeper.addEventListener(
      "animationend",
      () => {
        creeper.remove();
        explodeMinecraft(x, y, { puffs: 24, blocks: 28 });
      },
      { once: true },
    );
    document.body.append(creeper);
  }, delay);
}

function showMegaWord(text = randomFromList(MEGA_WORDS)) {
  if (prefersReducedMotion()) {
    return;
  }

  const word = document.createElement("div");
  word.className = "mega-word";
  word.textContent = text;
  word.addEventListener("animationend", () => word.remove(), { once: true });
  document.body.append(word);
}

function rainBlocks(count = 26) {
  if (prefersReducedMotion()) {
    return;
  }

  for (let index = 0; index < count; index += 1) {
    window.setTimeout(() => {
      const particle = document.createElement("span");
      particle.className = "block-particle";
      const drift = (Math.random() * 2 - 1) * 70;
      particle.style.setProperty("--x", `${Math.random() * window.innerWidth}px`);
      particle.style.setProperty("--y", "-30px");
      particle.style.setProperty("--mx", `${drift * 0.5}px`);
      particle.style.setProperty("--my", `${window.innerHeight * 0.45}px`);
      particle.style.setProperty("--dx", `${drift}px`);
      particle.style.setProperty("--dy", `${window.innerHeight + 90}px`);
      particle.style.setProperty("--rot", `${(Math.random() * 2 - 1) * 420}deg`);
      particle.style.setProperty("--size", `${10 + Math.random() * 12}px`);
      particle.style.setProperty("--duration", `${900 + Math.random() * 700}ms`);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
      document.body.append(particle);
    }, Math.random() * 1000);
  }
}

function spawnBlockParticles(x, y, count = 16) {
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "block-particle";

    const spreadX = (Math.random() * 2 - 1) * 80;
    const lift = -(26 + Math.random() * 64);
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--mx", `${spreadX}px`);
    particle.style.setProperty("--my", `${lift}px`);
    particle.style.setProperty("--dx", `${spreadX * (1.5 + Math.random() * 0.9)}px`);
    particle.style.setProperty("--dy", `${90 + Math.random() * 170}px`);
    particle.style.setProperty("--rot", `${(Math.random() * 2 - 1) * 300}deg`);
    particle.style.setProperty("--size", `${6 + Math.random() * 9}px`);
    particle.style.setProperty("--duration", `${620 + Math.random() * 420}ms`);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
    document.body.append(particle);
  }
}

const SPLASH_TEXTS = [
  "Также попробуйте варкрафт!",
  "Компания «Чупасичкины» представляет",
  "Денчик edition!",
  "Теперь на год старше!",
  "Молекулы сойдутся!",
  "Не баг, а фича!",
  "Подарок не выбран!",
  "ха-ха классика",
];

function setupSplashText() {
  const splash = document.querySelector("#splashText");

  if (splash) {
    splash.textContent = randomFromList(SPLASH_TEXTS);
  }
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

function getTournamentClickSounds() {
  if (state.tournamentClickSounds.length === 0) {
    state.tournamentClickSounds = Array.from({ length: 5 }, () => {
      const audio = new Audio(TOURNAMENT_CLICK_SOUND_SRC);
      audio.preload = "auto";
      audio.volume = 0.95;
      audio.load();
      return audio;
    });
  }

  return state.tournamentClickSounds;
}

function loadTournamentClickBuffer() {
  if (state.tournamentClickBuffer || state.tournamentClickBufferPromise) {
    return state.tournamentClickBufferPromise;
  }

  const ctx = getEffectAudioContext();

  if (!ctx || !window.fetch) {
    return null;
  }

  state.tournamentClickBufferPromise = fetch(TOURNAMENT_CLICK_SOUND_SRC)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
    .then((buffer) => {
      state.tournamentClickBuffer = buffer;
      return buffer;
    })
    .catch(() => {
      state.tournamentClickBufferPromise = null;
      return null;
    });

  return state.tournamentClickBufferPromise;
}

function primeTournamentClickSound() {
  loadTournamentClickBuffer();

  getTournamentClickSounds().forEach((audio) => {
    audio.load();

    try {
      audio.currentTime = 0;
    } catch {}
  });

  if (state.tournamentClickSoundPrimed) {
    return;
  }

  state.tournamentClickSoundPrimed = true;
  getTournamentClickSounds().forEach((audio) => {
    const previousMuted = audio.muted;
    const previousVolume = audio.volume;
    audio.muted = true;
    audio.volume = 0;

    const resetAudio = () => {
      audio.pause();

      try {
        audio.currentTime = 0;
      } catch {}

      audio.muted = previousMuted;
      audio.volume = previousVolume;
    };

    const playAttempt = audio.play();

    if (playAttempt?.then) {
      playAttempt.then(resetAudio).catch(resetAudio);
      return;
    }

    resetAudio();
  });
}

function getPartyPopperSound() {
  if (!state.partyPopperSound) {
    state.partyPopperSound = new Audio("assets/хлопушка.mp3");
    state.partyPopperSound.preload = "auto";
    state.partyPopperSound.volume = 1;
    state.partyPopperSound.load();
  }

  return state.partyPopperSound;
}

function primePartyPopperSound() {
  const audio = getPartyPopperSound();
  audio.load();

  try {
    audio.currentTime = 0;
  } catch {}
}

function playTournamentClickSound() {
  const ctx = getEffectAudioContext();

  if (ctx?.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (ctx && state.tournamentClickBuffer) {
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = state.tournamentClickBuffer;
    gain.gain.value = 1;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0, TOURNAMENT_CLICK_SOUND_OFFSET);
    return;
  }

  loadTournamentClickBuffer();

  const sounds = getTournamentClickSounds();
  const audio = sounds[state.tournamentClickSoundIndex % sounds.length];
  state.tournamentClickSoundIndex += 1;

  try {
    audio.currentTime = TOURNAMENT_CLICK_SOUND_OFFSET;
  } catch {}

  const playAttempt = audio.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }
}

function getMegaExplosionSound() {
  if (!state.megaExplosionSound) {
    state.megaExplosionSound = new Audio("assets/minecraft-explode1.mp3");
    state.megaExplosionSound.preload = "auto";
    state.megaExplosionSound.volume = 1;
  }

  return state.megaExplosionSound;
}

function playMegaExplosionSample(delay = 0, volume = 1) {
  window.setTimeout(() => {
    const baseAudio = getMegaExplosionSound();
    const audio = baseAudio.cloneNode();
    audio.volume = volume;

    try {
      audio.currentTime = 0;
    } catch {}

    const playAttempt = audio.play();

    if (playAttempt?.catch) {
      playAttempt.catch(() => {});
    }

    audio.addEventListener("ended", () => audio.remove(), { once: true });
  }, delay);
}

function playMegaExplosionStack() {
  [0, 90, 210, 360, 540].forEach((delay, index) => {
    playMegaExplosionSample(delay, Math.max(0.72, 1 - index * 0.04));
  });
}

function getOpenGiftSound() {
  if (!state.openGiftSound) {
    state.openGiftSound = new Audio("assets/открыть подарок.mp3");
    state.openGiftSound.preload = "auto";
    state.openGiftSound.volume = 0.95;
  }

  return state.openGiftSound;
}

function playOpenGiftSound() {
  const audio = getOpenGiftSound();

  try {
    audio.currentTime = 0;
  } catch {}

  const playAttempt = audio.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }
}

function getRoundAnnounceSound() {
  if (!state.roundAnnounceSound) {
    state.roundAnnounceSound = new Audio("assets/круг турнира.mp3");
    state.roundAnnounceSound.preload = "auto";
    state.roundAnnounceSound.volume = 0.95;
  }

  return state.roundAnnounceSound;
}

function playRoundAnnounceSound() {
  const audio = getRoundAnnounceSound();

  try {
    audio.currentTime = 0;
  } catch {}

  const playAttempt = audio.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }
}

const MAIN_THEME_VOLUME = 0.55;
const FINAL_THEME_VOLUME = 0.68;

function getMainTheme() {
  if (!state.mainTheme) {
    state.mainTheme = new Audio("assets/main-theme.mp3");
    state.mainTheme.loop = true;
    state.mainTheme.preload = "auto";
    state.mainTheme.volume = MAIN_THEME_VOLUME;
    state.mainTheme.muted = state.soundMuted;
  }

  return state.mainTheme;
}

function getFinalTheme() {
  if (!state.finalTheme) {
    state.finalTheme = new Audio("assets/final-gift-theme.mp3");
    state.finalTheme.loop = true;
    state.finalTheme.preload = "auto";
    state.finalTheme.volume = FINAL_THEME_VOLUME;
    state.finalTheme.muted = state.soundMuted;
  }

  return state.finalTheme;
}

function clearThemeFade() {
  if (state.themeFadeTimer) {
    window.clearInterval(state.themeFadeTimer);
    state.themeFadeTimer = null;
  }
}

function playTheme(which, { restart = false, forceStart = false } = {}) {
  state.activeTheme = which;

  if (!state.musicStarted && !forceStart) {
    return null;
  }

  clearThemeFade();
  const active = which === "final" ? getFinalTheme() : getMainTheme();
  const inactive = which === "final" ? getMainTheme() : getFinalTheme();
  active.muted = state.soundMuted;
  inactive.muted = state.soundMuted;
  inactive.pause();

  if (restart) {
    try {
      active.currentTime = 0;
    } catch {}
  }

  active.volume = which === "final" ? FINAL_THEME_VOLUME : MAIN_THEME_VOLUME;
  const playAttempt = active.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {
      if (forceStart && active.paused) {
        state.musicStarted = false;
      }
    });
  }

  return playAttempt;
}

function duckThemeForScreamer() {
  clearThemeFade();
  getMainTheme().pause();
  getFinalTheme().pause();
}

function restoreThemeAfterScreamer() {
  if (!state.musicStarted) {
    return;
  }

  clearThemeFade();
  const active = state.activeTheme === "final" ? getFinalTheme() : getMainTheme();
  const target = state.activeTheme === "final" ? FINAL_THEME_VOLUME : MAIN_THEME_VOLUME;
  active.muted = state.soundMuted;
  active.volume = 0;
  const playAttempt = active.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }

  state.themeFadeTimer = window.setInterval(() => {
    const next = Math.min(target, active.volume + target / 42);
    active.volume = next;

    if (next >= target) {
      clearThemeFade();
    }
  }, 120);
}

function startBackgroundMusic() {
  const active = state.activeTheme === "final" ? getFinalTheme() : getMainTheme();

  if (state.musicStarted && !active.paused) {
    return;
  }

  state.musicStarted = true;
  primeTournamentClickSound();
  primePartyPopperSound();
  playTheme(state.activeTheme, { forceStart: true });
}

function setupBackgroundMusic() {
  window.setTimeout(startBackgroundMusic, 0);

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, startBackgroundMusic);
  });
}

function getThemeAudioElements() {
  return [state.mainTheme, state.finalTheme].filter(Boolean);
}

function updateMusicToggleButton() {
  const icon = els.musicToggle.querySelector("span");
  els.musicToggle.classList.toggle("music-toggle--muted", state.soundMuted);
  icon.textContent = state.soundMuted ? "🔇" : "🔊";
  els.musicToggle.setAttribute("aria-label", state.soundMuted ? "Включить музыку" : "Выключить музыку");
  els.musicToggle.title = state.soundMuted ? "Музыка выключена" : "Музыка включена";
}

function setSoundMuted(muted) {
  state.soundMuted = muted;

  try {
    window.localStorage.setItem(SOUND_MUTED_STORAGE_KEY, muted ? "1" : "0");
  } catch {}

  getThemeAudioElements().forEach((audio) => {
    audio.muted = muted;
  });

  if (!muted) {
    startBackgroundMusic();
  }

  updateMusicToggleButton();
}

function setupSoundToggle() {
  els.musicToggle.addEventListener("click", () => {
    setSoundMuted(!state.soundMuted);
  });

  updateMusicToggleButton();
}

function getEffectAudioContext() {
  if (!state.effectAudioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return null;
    }

    state.effectAudioContext = new AudioContext();
  }

  if (state.effectAudioContext.state === "suspended") {
    state.effectAudioContext.resume();
  }

  return state.effectAudioContext;
}

function createNoiseBuffer(ctx, duration) {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playNoiseHit(ctx, { delay = 0, duration = 0.18, volume = 0.35, filter = 1800, type = "bandpass" } = {}) {
  if (!ctx) {
    return;
  }

  const startAt = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filterNode = ctx.createBiquadFilter();

  source.buffer = createNoiseBuffer(ctx, duration);
  filterNode.type = type;
  filterNode.frequency.setValueAtTime(filter, startAt);
  filterNode.Q.setValueAtTime(0.82, startAt);
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  source.connect(filterNode);
  filterNode.connect(gain);
  gain.connect(ctx.destination);
  source.start(startAt);
  source.stop(startAt + duration + 0.04);
}

function playExplosion(delay = 0, power = 1) {
  const ctx = getEffectAudioContext();

  if (!ctx) {
    return;
  }

  const startAt = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  const filterNode = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const boom = ctx.createOscillator();
  const boomGain = ctx.createGain();

  source.buffer = createNoiseBuffer(ctx, 0.9);
  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(1800 * power, startAt);
  filterNode.frequency.exponentialRampToValueAtTime(80, startAt + 0.72);
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.75 * power, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.88);

  boom.type = "sine";
  boom.frequency.setValueAtTime(88, startAt);
  boom.frequency.exponentialRampToValueAtTime(34, startAt + 0.55);
  boomGain.gain.setValueAtTime(0.001, startAt);
  boomGain.gain.exponentialRampToValueAtTime(0.34 * power, startAt + 0.018);
  boomGain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.68);

  source.connect(filterNode);
  filterNode.connect(gain);
  gain.connect(ctx.destination);
  boom.connect(boomGain);
  boomGain.connect(ctx.destination);

  source.start(startAt);
  source.stop(startAt + 0.95);
  boom.start(startAt);
  boom.stop(startAt + 0.7);
}

function playPartyPopper(delay = 0, power = 1) {
  window.setTimeout(() => {
    const baseAudio = getPartyPopperSound();
    const audio = baseAudio.cloneNode();
    audio.volume = Math.min(1, 0.9 * power);

    try {
      audio.currentTime = 0;
    } catch {}

    const playAttempt = audio.play();

    if (playAttempt?.catch) {
      playAttempt.catch(() => {});
    }

    audio.addEventListener("ended", () => audio.remove(), { once: true });
  }, delay * 1000);
}

function playPartyHorn(delay = 0, intensity = 1) {
  const ctx = getEffectAudioContext();

  if (!ctx) {
    return;
  }

  const startAt = ctx.currentTime + delay;
  const duration = 0.62 + Math.random() * 0.2;
  const base = 392 + Math.random() * 56;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  lfo.type = "sine";
  lfo.frequency.setValueAtTime(6.5, startAt);
  lfoGain.gain.setValueAtTime(base * 0.018, startAt);
  lfo.connect(lfoGain);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2600, startAt);
  filter.frequency.linearRampToValueAtTime(1600, startAt + duration);
  filter.connect(ctx.destination);

  [
    [1, 0.26, "triangle"],
    [2, 0.1, "triangle"],
    [3, 0.045, "sine"],
  ].forEach(([harmonic, level, type]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(base * harmonic * 0.94, startAt);
    osc.frequency.exponentialRampToValueAtTime(base * harmonic, startAt + 0.12);
    osc.frequency.exponentialRampToValueAtTime(base * harmonic * 1.25, startAt + duration - 0.08);
    lfoGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.linearRampToValueAtTime(level * intensity, startAt + 0.09);
    gain.gain.setValueAtTime(level * intensity, startAt + duration - 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
    osc.connect(gain);
    gain.connect(filter);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  });

  lfo.start(startAt);
  lfo.stop(startAt + duration + 0.05);
}

function playTextBlip(delay = 0, pitch = 1) {
  const ctx = getEffectAudioContext();

  if (!ctx) {
    return;
  }

  const startAt = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "square";
  osc.frequency.setValueAtTime(540 * pitch, startAt);
  osc.frequency.exponentialRampToValueAtTime(430 * pitch, startAt + 0.05);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2100, startAt);
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.15, startAt + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.07);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + 0.09);
}

function playConfettiRustle(delay = 0, intensity = 1) {
  const ctx = getEffectAudioContext();

  if (!ctx) {
    return;
  }

  const sparkles = Math.floor(14 * intensity);

  for (let index = 0; index < sparkles; index += 1) {
    playNoiseHit(ctx, {
      delay: delay + Math.random() * 0.75,
      duration: 0.025 + Math.random() * 0.03,
      volume: 0.04 + Math.random() * 0.05,
      filter: 5600 + Math.random() * 3400,
      type: "bandpass",
    });
  }
}

function playApplause(delay = 0, intensity = 1, spread = 1.15) {
  const ctx = getEffectAudioContext();

  if (!ctx) {
    return;
  }

  const claps = Math.floor(20 * intensity);

  for (let index = 0; index < claps; index += 1) {
    playNoiseHit(ctx, {
      delay: delay + Math.random() * spread,
      duration: 0.035 + Math.random() * 0.055,
      volume: 0.16 + Math.random() * 0.18,
      filter: 1100 + Math.random() * 2600,
      type: "bandpass",
    });
  }
}

function playCrowdCheer(delay = 0, intensity = 1) {
  const ctx = getEffectAudioContext();

  if (!ctx) {
    return;
  }

  const startAt = ctx.currentTime + delay;
  const duration = 1.25 * intensity;
  const noise = ctx.createBufferSource();
  const noiseFilter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();

  noise.buffer = createNoiseBuffer(ctx, duration);
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(620, startAt);
  noiseFilter.Q.setValueAtTime(0.48, startAt);
  noiseGain.gain.setValueAtTime(0.001, startAt);
  noiseGain.gain.linearRampToValueAtTime(0.18 * intensity, startAt + 0.2);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(startAt);
  noise.stop(startAt + duration);

  for (let index = 0; index < Math.floor(10 * intensity); index += 1) {
    const voice = ctx.createOscillator();
    const gain = ctx.createGain();
    const voiceStart = startAt + Math.random() * 0.22;
    const voiceDuration = 0.55 + Math.random() * 0.58;
    const base = 180 + Math.random() * 520;

    voice.type = index % 2 === 0 ? "sawtooth" : "triangle";
    voice.frequency.setValueAtTime(base, voiceStart);
    voice.frequency.linearRampToValueAtTime(base * (1.18 + Math.random() * 0.34), voiceStart + voiceDuration);
    gain.gain.setValueAtTime(0.001, voiceStart);
    gain.gain.linearRampToValueAtTime(0.028 * intensity, voiceStart + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, voiceStart + voiceDuration);
    voice.connect(gain);
    gain.connect(ctx.destination);
    voice.start(voiceStart);
    voice.stop(voiceStart + voiceDuration);
  }
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
  launchFirework({ x: window.innerWidth * (0.18 + Math.random() * 0.14), delay: 140 });
  launchFirework({ x: window.innerWidth * (0.68 + Math.random() * 0.14), delay: 420 });
}

function triggerSpecialEffectsWithSound() {
  playPartyPopper(0, 1);
  playPartyPopper(0.18, 0.85);
  playConfettiRustle(0.12, 1.1);
  triggerSpecialEffects();
}

function triggerSuperEffectsWithSound() {
  playPartyPopper(0, 1);
  playPartyPopper(0.22, 0.9);
  playConfettiRustle(0.1, 1.3);
  playApplause(0.05, 1.6, 1.6);
  playApplause(0.55, 1.2, 1.4);
  playApplause(1.15, 0.9, 1.2);
  triggerSuperEffects();
}

function triggerMegaEffectsWithSound() {
  playMegaExplosionStack();
  [0, 0.26, 0.55, 0.92].forEach((delay, index) => playExplosion(delay, 0.85 + index * 0.14));
  playPartyPopper(0.03, 1.1);
  playPartyPopper(0.34, 1);
  playPartyPopper(0.72, 1.2);
  playConfettiRustle(0.2, 1.6);
  playApplause(0.15, 1.8, 1.6);
  playCrowdCheer(0.2, 1.6);
  window.setTimeout(() => {
    playCrowdCheer(0, 1.1);
    playApplause(0, 1.3, 1.3);
    playExplosion(0.25, 1.1);
  }, 900);
  triggerMegaEffects();
}

function triggerSuperEffects() {
  stageLights(7, 2100);
  addScreenFlash();
  triggerSpecialEffects();
  xpOrbRise(22);
  launchFirework({ delay: 650 });
  launchFirework({ delay: 980 });

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
  showMegaWord();
  rainBlocks(26);
  xpOrbRise(28);
  document.documentElement.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: "translate(7px, -5px)" },
      { transform: "translate(-6px, 6px)" },
      { transform: "translate(5px, 4px)" },
      { transform: "translate(-4px, -5px)" },
      { transform: "translate(0, 0)" },
    ],
    { duration: 460, iterations: 3 },
  );

  [320, 660, 1020, 1400].forEach((delay) => launchFirework({ delay }));
  [380, 780, 1180].forEach((delay) => dropTnt({ delay }));
  summonCreeper({ delay: 1000 });

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

  // финальный залп по центру
  window.setTimeout(() => {
    addScreenFlash();
    burstConfetti(240, {
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.42,
      spread: Math.PI * 2,
      power: 17,
      gravity: 0.06,
      ttl: 3200,
      minSize: 5,
      maxSize: 18,
    });
  }, 1550);
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
    state.horrorMusic.loop = false;
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

  if (!state.purpleScreamerSound) {
    state.purpleScreamerSound = new Audio("assets/фиолетовый скример.mp3");
    state.purpleScreamerSound.preload = "auto";
    state.purpleScreamerSound.volume = 1;
  }

  return {
    music: state.horrorMusic,
    scream: state.horrorScream,
    screamLayers: state.horrorScreamLayers,
    purpleScreamerSound: state.purpleScreamerSound,
  };
}

function primeHorrorAudio() {
  const { music, scream, screamLayers, purpleScreamerSound } = getHorrorAudio();

  [music, scream, ...screamLayers, purpleScreamerSound].forEach((item) => {
    item.preload = "auto";
    item.load();

    try {
      item.currentTime = 0;
    } catch {}
  });

  return { music, scream, screamLayers, purpleScreamerSound };
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

function playPurpleScreamerSound() {
  const { purpleScreamerSound } = getHorrorAudio();
  purpleScreamerSound.volume = 1;
  playAudio(purpleScreamerSound);
}

function stopHorrorAudio() {
  const { music, scream, screamLayers, purpleScreamerSound } = getHorrorAudio();
  [music, scream, ...screamLayers, purpleScreamerSound].forEach((audio) => {
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
  els.realityBreak.dataset.phase = "blink";
  els.realityBreakFace.src = "assets/screamer 1.png";

  state.screamerTimers.push(
    window.setTimeout(() => {
      els.realityBreakFace.src = "assets/screamer 2.png";
    }, 1700),
    window.setTimeout(() => {
      els.realityBreak.dataset.phase = "hold";
      els.realityBreakFace.src = "assets/screamer 3.jpeg";
    }, 3400),
    window.setTimeout(() => {
      els.realityBreak.dataset.phase = "hold";
      els.realityBreakFace.src = "assets/screamer 4.png";
      requestAnimationFrame(playPurpleScreamerSound);
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
    restoreThemeAfterScreamer();
  }, 7200);
}

function breakReality() {
  closeRealityWarning();
  if (state.realityTimer) {
    window.clearTimeout(state.realityTimer);
  }
  duckThemeForScreamer();
  stopHorrorAudio();
  els.realityDecay.hidden = false;
  els.realityBreak.hidden = true;
  els.realityBreak.dataset.phase = "blink";
  els.realityBreakFace.src = "assets/screamer 1.png";
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
  restoreThemeAfterScreamer();
}

setupConfetti();
setupLaughAnimation();
setupBackgroundMusic();
setupSoundToggle();
setupSplashText();

els.startButtons.forEach((button) => {
  button.addEventListener("click", openQuizWindow);
});

els.confettiButton.addEventListener("click", triggerSpecialEffectsWithSound);
els.superEffectsButton.addEventListener("click", triggerSuperEffectsWithSound);
els.megaEffectsButton.addEventListener("click", triggerMegaEffectsWithSound);
els.realityWarningButton.addEventListener("click", openRealityWarning);
els.closeRealityWarningButtons.forEach((button) => button.addEventListener("click", closeRealityWarning));
els.breakRealityButton.addEventListener("click", breakReality);
els.closeQuizButton.addEventListener("click", closeQuizWindow);
els.backButton.addEventListener("click", goBack);
els.restartButton.addEventListener("click", restartQuiz);
els.retryButton.addEventListener("click", restartQuiz);
els.revealButton.addEventListener("click", openModal);
els.closeModalButtons.forEach((button) => button.addEventListener("click", closeModal));
els.claimGiftButton.addEventListener("click", openFriendshipFinale);
els.closeFinaleButtons.forEach((button) => button.addEventListener("click", closeFriendshipFinale));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!els.friendshipFinale.hidden) {
      closeFriendshipFinale();
      return;
    }

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
