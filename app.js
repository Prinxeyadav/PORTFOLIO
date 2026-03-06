/* ═══════════════════════════════════════════════
   PRINCE KUMAR PORTFOLIO — FRONTEND JS
   Calls backend REST API for all dynamic data
═══════════════════════════════════════════════ */

  // If on Live Server (5500) → call http://localhost:5000
// If opened directly on 5000 → use same-origin
const API = window.location.port === '5500' ? 'http://localhost:5000' : '';// same-origin (server serves both)

/* ─── UTILS ──────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

async function apiFetch(endpoint) {
  const res = await fetch(API + endpoint);
  if (!res.ok) throw new Error(`API ${endpoint} → ${res.status}`);
  return res.json();
}

/* ─── LOADER ─────────────────────────────────── */
async function runLoader() {
  const bar    = $('loaderBar');
  const status = $('loaderStatus');
  const steps  = [
    [20,  'Connecting to Node.js server...'],
    [45,  'Loading profile data...'],
    [65,  'Fetching projects from API...'],
    [82,  'Loading hackathon history...'],
    [95,  'Initializing JARVIS interface...'],
    [100, 'System ready.']
  ];
  for (const [pct, msg] of steps) {
    await delay(320);
    bar.style.width = pct + '%';
    status.textContent = msg;
  }
  await delay(400);
  $('loader').classList.add('hidden');
}
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ─── CURSOR ─────────────────────────────────── */
function initCursor() {
  const cur  = $('cursor');
  const ring = $('cursorRing');
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.api-card,.project-card,.skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.transform = 'translate(-50%,-50%) scale(2.2)';
      cur.style.background = 'var(--red)';
      ring.style.width  = '50px';
      ring.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.transform = 'translate(-50%,-50%) scale(1)';
      cur.style.background = 'var(--gold)';
      ring.style.width  = '34px';
      ring.style.height = '34px';
    });
  });
}

/* ─── PARTICLES ──────────────────────────────── */
function initParticles() {
  const canvas = $('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(random) {
      this.x  = random ? Math.random() * W : W * Math.random();
      this.y  = random ? Math.random() * H : H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.4 + 0.3;
      this.a  = Math.random() * 0.45 + 0.08;
      const t = Math.random();
      this.color = t < 0.4
        ? `rgba(240,165,0,${this.a})`
        : t < 0.7
          ? `rgba(0,212,255,${this.a})`
          : `rgba(192,57,43,${this.a})`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x<0||this.x>W||this.y<0||this.y>H) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < 110; i++) particles.push(new Particle());

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(240,165,0,${0.055*(1-d/95)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  })();
}

/* ─── NAVBAR ─────────────────────────────────── */
function initNav() {
  const nav = $('navbar');
  const links = $$('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    // active link
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // hamburger
  $('hamburger').addEventListener('click', () => {
    $('mobileMenu').classList.toggle('open');
  });
}
function closeMobile() { $('mobileMenu').classList.remove('open'); }
window.closeMobile = closeMobile;

/* ─── SCROLL REVEAL ──────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ─── TYPING EFFECT ──────────────────────────── */
function initTyping() {
  const el    = $('heroRole');
  const roles = [
    'Full Stack Developer',
    'Backend Engineer',
    'Data Analyst',
    'UI/UX Designer',
    'Hackathon Warrior',
    'Java Developer',
    'Python Developer'
  ];
  let ri = 0, ci = 0, del = false;

  function tick() {
    const base = '⚡ ' + roles[ri];
    if (!del) {
      el.textContent = base.slice(0, ci + 1);
      ci++;
      if (ci === base.length) { del = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = base.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, del ? 38 : 72);
  }
  setTimeout(tick, 1800);
}

/* ─── COUNTER ANIMATION ──────────────────────── */
function animCount(el, target, suffix = '') {
  let start = 0;
  const step = Math.ceil(target / 40);
  const t = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(t);
  }, 40);
}

/* ─── FETCH & RENDER STATS ───────────────────── */
async function loadStats() {
  try {
    const { data } = await apiFetch('/api/stats');
    animCount($('statProjects'), data.projects);
    animCount($('statSkills'),   data.skills);
    animCount($('statHacks'),    data.hackathons);
    animCount($('statVisitors'), data.visitors);
    $('badgeText').textContent = 'AVAILABLE FOR OPPORTUNITIES';
    $('apiStatus').innerHTML = '<span class="api-dot"></span> API ONLINE';
  } catch {
    $('statProjects').textContent = '4';
    $('statSkills').textContent   = '30+';
    $('statHacks').textContent    = '2';
    $('statVisitors').textContent = '✓';
    $('badgeText').textContent    = 'AVAILABLE FOR OPPORTUNITIES';
    $('apiStatus').innerHTML      = '<span class="api-dot"></span> OFFLINE MODE';
    $('apiStatus').classList.add('offline');
  }
}

/* ─── FETCH & RENDER SKILLS ──────────────────── */
const COLOR_MAP = { red: 'red', blue: 'blue', gold: 'gold' };
async function loadSkills() {
  const grid = $('skillsGrid');
  try {
    const { data } = await apiFetch('/api/skills');
    grid.innerHTML = data.map((sk, i) => `
      <div class="skill-card" style="animation-delay:${i * 0.08}s">
        <div class="skill-icon">${sk.icon}</div>
        <div class="skill-cat">${sk.category}</div>
        <div class="skill-tags">
          ${sk.items.map(t => `<span class="skill-tag ${COLOR_MAP[sk.color] || 'red'}">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
    // animate them in
    setTimeout(() => {
      $$('.skill-card').forEach((c,i) => setTimeout(() => c.classList.add('appear'), i * 80));
    }, 50);
  } catch(err) {
    grid.innerHTML = '<div class="loading-msg">⚠ Could not load skills — server offline.</div>';
  }
}

/* ─── FETCH & RENDER PROJECTS ────────────────── */
const GRADIENTS = [
  'linear-gradient(135deg,#1a0505,#2a0a0a)',
  'linear-gradient(135deg,#050f1a,#0a1e2a)',
  'linear-gradient(135deg,#0f0f05,#1a1a0a)',
  'linear-gradient(135deg,#0f051a,#1a0a2a)'
];
async function loadProjects() {
  const grid = $('projectsGrid');
  try {
    const { data } = await apiFetch('/api/projects');
    grid.innerHTML = data.map((p, i) => `
      <div class="project-card" style="animation-delay:${i*0.1}s">
        <div class="proj-thumb" data-emoji="${p.icon}" style="background:${GRADIENTS[i % GRADIENTS.length]}">
          <span class="proj-icon">${p.icon}</span>
          <div class="proj-thumb-scan"></div>
        </div>
        <div class="proj-body">
          <div class="proj-cat">// ${p.category}</div>
          <div class="proj-name">${p.title}</div>
          <p class="proj-desc">${p.description}</p>
          <div class="proj-stack">
            ${p.stack.map(s => `<span class="stack-tag">${s}</span>`).join('')}
          </div>
          <div class="proj-links">
            <a href="${p.github}" target="_blank" class="proj-btn pri">⚙ CODE</a>
            <a href="${p.live}"   target="_blank" class="proj-btn sec">↗ DEMO</a>
          </div>
        </div>
      </div>
    `).join('');
    setTimeout(() => {
      $$('.project-card').forEach((c,i) => setTimeout(() => c.classList.add('appear'), i * 100));
    }, 50);
  } catch {
    grid.innerHTML = '<div class="loading-msg">⚠ Could not load projects — server offline.</div>';
  }
}

/* ─── FETCH & RENDER HACKATHONS ──────────────── */
async function loadHackathons() {
  const tl = $('hackTimeline');
  try {
    const { data } = await apiFetch('/api/hackathons');
    tl.innerHTML = data.map((h, i) => `
      <div class="hack-item" style="animation-delay:${i*0.15}s">
        <div class="hack-dot ${h.status === 'competed' ? 'gold' : 'red'}"></div>
        <div class="hack-card">
          <div class="hack-head">
            <div>
              <div class="hack-title">${h.name}</div>
              <div class="hack-org">${h.organizer} · ${h.duration} · ${h.location}</div>
            </div>
            <span class="hack-badge ${h.status}">${h.status === 'competed' ? '✓ COMPETED' : '⚡ UPCOMING'}</span>
          </div>
          <p class="hack-desc">${h.description}</p>
          <div class="hack-tags">
            ${h.highlights.map(tag => `<span class="hack-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
    setTimeout(() => {
      $$('.hack-item').forEach((c,i) => setTimeout(() => c.classList.add('appear'), i * 150));
    }, 50);
  } catch {
    tl.innerHTML = '<div class="loading-msg">⚠ Could not load hackathons — server offline.</div>';
  }
}

/* ─── API EXPLORER ───────────────────────────── */
async function callApi(endpoint) {
  const box = $('apiResponseBox');
  const pre = $('apiResponse');
  const ep  = $('arbEndpoint');
  box.style.display = 'block';
  ep.textContent = endpoint;
  pre.textContent = '// Loading...';
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    const data = await apiFetch(endpoint);
    pre.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    pre.textContent = `// Error: ${err.message}`;
  }
}
window.callApi = callApi;

/* ─── CONTACT FORM ───────────────────────────── */
function initContactForm() {
  const form     = $('contactForm');
  const btn      = $('submitBtn');
  const feedback = $('formFeedback');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = '⟳ SENDING...';
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const payload = {
      name:    $('fName').value.trim(),
      email:   $('fEmail').value.trim(),
      subject: $('fSubject').value.trim(),
      message: $('fMessage').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        feedback.textContent = '✓ MESSAGE SENT — JARVIS HAS NOTIFIED PRINCE.';
        feedback.className = 'form-feedback success';
        form.reset();
        btn.textContent = '✓ SENT!';
        btn.style.background = 'linear-gradient(135deg, #00884a, #005530)';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = '⚡ SEND MESSAGE';
          btn.style.background = '';
          feedback.textContent = '';
        }, 4000);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      feedback.textContent = '⚠ ' + err.message;
      feedback.className = 'form-feedback error';
      btn.disabled = false;
      btn.textContent = '⚡ SEND MESSAGE';
    }
  });
}

/* ─── INTERSECT OBSERVER for hackathons/projects ─ */
function initDynamicReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const items = e.target.querySelectorAll('.hack-item, .project-card, .skill-card');
        items.forEach((item, i) => setTimeout(() => item.classList.add('appear'), i * 100));
      }
    });
  }, { threshold: 0.05 });

  [$('skillsGrid'), $('projectsGrid'), $('hackTimeline')].forEach(el => {
    if (el) obs.observe(el);
  });
}

/* ─── INIT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  // Start loader animation
  runLoader();

  // Core UI
  initParticles();
  initCursor();
  initNav();
  initReveal();
  initTyping();
  initContactForm();
  initDynamicReveal();

  // Load API data in parallel
  await Promise.allSettled([
    loadStats(),
    loadSkills(),
    loadProjects(),
    loadHackathons()
  ]);
});

