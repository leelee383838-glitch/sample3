document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initNumberCounters();
  initHeroVideo();
  initFirstTabVideo();
});

function initHeroVideo() {
  const hero = document.querySelector(".hero");
  const video = document.querySelector(".hero-bg-video");
  if (!hero || !video) return;
  const source = video.querySelector("source");
  if (!source || !source.getAttribute("src") || source.getAttribute("src").trim() === "")
    return;
  hero.classList.add("has-video");
  video.play().catch(() => {});
}

function initFirstTabVideo() {
  const video = document.querySelector(".hero-visual video.img-fade-video");
  if (!video) return;
  video.removeAttribute("poster");
  const play = () => { video.play().catch(() => {}); };
  play();
  video.addEventListener("loadeddata", play);
  video.addEventListener("canplay", play);
  video.addEventListener("ended", () => { video.currentTime = 0; video.play(); });
}

function initHeaderScroll() {
  const header = document.querySelector(".hd");
  if (!header) return;
  const toggle = () => {
    if (window.scrollY > 10) header.classList.add("hd--scrolled");
    else header.classList.remove("hd--scrolled");
  };
  toggle();
  window.addEventListener("scroll", toggle);
}

function initNumberCounters() {
  const numElems = document.querySelectorAll(".nums .num-val");
  if (!numElems.length) return;

  // 목표값을 data-target 으로 설정
  numElems.forEach(el => {
    el.dataset.target = el.textContent.trim();
    el.textContent = "0";
  });

  const runCounters = () => {
    numElems.forEach(el => animateCount(el));
  };

  if ("IntersectionObserver" in window) {
    const section = document.querySelector(".nums");
    if (!section) return runCounters();
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounters();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(section);
  } else {
    runCounters();
  }
}

function animateCount(el) {
  const targetStr = el.dataset.target || "0";
  const match = targetStr.match(/([0-9.]+)/);
  if (!match) return;
  const numberPart = parseFloat(match[1]);
  const suffix = targetStr.replace(match[1], "");

  let start = 0;
  const duration = 1200;
  let startTs = null;

  function step(ts) {
    if (!startTs) startTs = ts;
    const progress = Math.min((ts - startTs) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(numberPart * eased * 10) / 10;
    el.textContent = formatNumber(current, numberPart) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function formatNumber(val, target) {
  // 정수/소수 자리수 유지
  if (Number.isInteger(target)) {
    return Math.round(val).toString();
  }
  return val.toFixed(1);
}

