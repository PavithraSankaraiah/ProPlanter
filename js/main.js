// ===== PROPLANTER MAIN.JS — HOME SCREEN =====

// Floating leaves
const emojis = ['🍃','🌿','🍀','🌱','🌾','🪴'];
const bg = document.getElementById('leavesBg');
if (bg) {
  for (let i = 0; i < 16; i++) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf';
    leaf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    leaf.style.cssText = `
      left:${Math.random()*100}vw;
      font-size:${1.2 + Math.random()*1.6}rem;
      animation-duration:${9 + Math.random()*11}s;
      animation-delay:${Math.random()*8}s;
    `;
    bg.appendChild(leaf);
  }
}

// HOW TO PLAY modal
let currentSlide = 0;
function buildDots() {
  const slides = document.querySelectorAll('.how-slide');
  const dots = document.getElementById('slideDots');
  if (!dots) return;
  dots.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dots.appendChild(d);
  });
}
buildDots();

function changeSlide(dir) {
  const slides = document.querySelectorAll('.how-slide');
  const dots = document.querySelectorAll('.dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = Math.max(0, Math.min(slides.length - 1, currentSlide + dir));
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  document.getElementById('prevBtn').disabled = currentSlide === 0;
  document.getElementById('nextBtn').disabled = currentSlide === slides.length - 1;
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  currentSlide = 0;
  document.querySelectorAll('.how-slide').forEach((s, i) => s.classList.toggle('active', i === 0));
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === 0));
  if (document.getElementById('prevBtn')) document.getElementById('prevBtn').disabled = true;
  if (document.getElementById('nextBtn')) document.getElementById('nextBtn').disabled = false;
}