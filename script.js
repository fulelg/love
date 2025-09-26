const targetDate = new Date('2026-02-14T00:00:00');

const images = [
  '../img/photo_2025-09-15_01-18-39.jpg',
  '../img/photo_2025-09-15_01-27-12.jpg',
  '../img/photo_2025-09-15_01-27-13.jpg',
  '../img/photo_2025-09-15_01-27-15.jpg',
  '../img/photo_2025-09-15_01-27-17.jpg',
  '../img/photo_2025-09-15_01-27-19.jpg'
];

let loadedImages = [];

function declension(number, forms) {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const now = new Date();
  let diff = targetDate - now;
  if (diff < 0) diff = 0;

  const secondsTotal = Math.floor(diff / 1000);
  const days = Math.floor(secondsTotal / (24 * 3600));
  const hours = Math.floor((secondsTotal % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = pad2(hours);
  document.getElementById('minutes').textContent = pad2(minutes);
  document.getElementById('seconds').textContent = pad2(seconds);

  document.getElementById('daysLabel').textContent = declension(days, ['день', 'дня', 'дней']);
  document.getElementById('hoursLabel').textContent = declension(hours, ['час', 'часа', 'часов']);
  document.getElementById('minutesLabel').textContent = declension(minutes, ['минута', 'минуты', 'минут']);
  document.getElementById('secondsLabel').textContent = declension(seconds, ['секунда', 'секунды', 'секунд']);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

async function preloadImages(srcs) {
  const base = new URL('.', window.location.href);
  const load = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ok: true, url: new URL(src, base).href });
    img.onerror = () => resolve({ ok: false });
    img.src = new URL(src, base).href;
  });
  const results = await Promise.all(srcs.map(load));
  return results.filter(r => r.ok).map(r => r.url);
}

function createBackground() {
  const container = document.getElementById('background');
  const { innerWidth: w, innerHeight: h } = window;

  const count = Math.min(24, Math.max(14, Math.floor((w * h) / 38000)));
  const used = new Set();

  const pool = loadedImages.length ? loadedImages : images;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'photo';

    const img = pool[i % pool.length];
    el.style.backgroundImage = `url("${img}")`;

    const sizeBase = random(120, 260);
    const scale = random(0.75, 1.15) * (w < 520 ? 0.8 : 1);
    const width = sizeBase * scale;
    const height = width * random(0.65, 1.1);

    const margin = 40;
    const x = random(margin, Math.max(margin, w - width - margin));
    const y = random(margin, Math.max(margin, h - height - margin));

    const key = `${Math.round(x/20)}-${Math.round(y/20)}`;
    if (used.has(key)) { i--; continue; }
    used.add(key);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    el.style.setProperty('--rot', `${random(-12, 12)}deg`);
    el.style.setProperty('--dur', `${random(14, 26)}s`);
    el.style.setProperty('--delay', `${random(-8, 6)}s`);
    el.style.setProperty('--float', `${random(16, 34)}px`);

    container.appendChild(el);
  }
}

let intervalId;

async function init() {
  loadedImages = await preloadImages(images);
  createBackground();
  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);
}

window.addEventListener('load', () => { init(); });

window.addEventListener('resize', () => {
  const container = document.getElementById('background');
  container.innerHTML = '';
  createBackground();
}); 