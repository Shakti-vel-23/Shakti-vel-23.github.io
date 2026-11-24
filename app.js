/**
 * ============================================================================
 * HIGH-TECH CYBER ENGINE FOR SHAKTI VEL NADARAJAN'S PORTFOLIO
 * Features:
 * - Dual-Mode Canvas (Interactive Constellation & Matrix Rain)
 * - Synthesized Web Audio Sci-Fi Sound FX Engine
 * - Interactive Terminal / CLI Emulator with History & Commands
 * - Live System Telemetry Clock
 * - Scroll-Spy Active Navigation & Mobile Drawer
 * - Dynamic Glitch Typing Subtitle
 * - 3D Card Hover Perspective Tilt
 * ============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundFX {
    constructor() {
      this.enabled = false;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    play(freq = 800, type = 'sine', duration = 0.05, gainVal = 0.05) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // audio playback failed or prevented
      }
    }

    beepHigh() { this.play(1200, 'sine', 0.04, 0.04); }
    beepLow() { this.play(400, 'triangle', 0.06, 0.05); }
    click() { this.play(900, 'square', 0.02, 0.02); }
    accessGranted() {
      if (!this.enabled) return;
      this.play(600, 'sine', 0.06, 0.05);
      setTimeout(() => this.play(900, 'sine', 0.08, 0.05), 70);
      setTimeout(() => this.play(1200, 'sine', 0.12, 0.06), 140);
    }
  }

  const sfx = new SoundFX();

  // --- HUD CONTROLS (SFX & Matrix & CRT) ---
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const matrixToggleBtn = document.getElementById('matrixToggleBtn');
  const crtToggleBtn = document.getElementById('crtToggleBtn');
  const scanlinesEl = document.querySelector('.scanlines');
  let isMatrixMode = false;

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      sfx.init();
      sfxToggleBtn.classList.toggle('active', sfx.enabled);
      sfxToggleBtn.innerHTML = sfx.enabled ? '<span>🔊 SFX: ON</span>' : '<span>🔇 SFX: OFF</span>';
      if (sfx.enabled) sfx.accessGranted();
    });
  }

  if (matrixToggleBtn) {
    matrixToggleBtn.addEventListener('click', () => {
      isMatrixMode = !isMatrixMode;
      document.body.classList.toggle('matrix-theme', isMatrixMode);
      matrixToggleBtn.classList.toggle('active', isMatrixMode);
      matrixToggleBtn.innerHTML = isMatrixMode ? '<span>⚡ MATRIX: ON</span>' : '<span>🌐 MATRIX: OFF</span>';
      sfx.beepHigh();
    });
  }

  if (crtToggleBtn) {
    crtToggleBtn.addEventListener('click', () => {
      if (scanlinesEl) {
        scanlinesEl.classList.toggle('off');
        const isActive = !scanlinesEl.classList.contains('off');
        crtToggleBtn.classList.toggle('active', isActive);
        sfx.click();
      }
    });
  }

  // --- LIVE TELEMETRY CLOCK ---
  const hudClock = document.getElementById('hudClock');
  function updateClock() {
    if (!hudClock) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    hudClock.textContent = `LOC: ${timeStr}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- DUAL-MODE CANVAS ENGINE ---
  const canvas = document.getElementById('cyberCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mode 1: Constellation Particles
  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);

  const mouse = { x: null, y: null, maxDist: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse reactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          const force = (mouse.maxDist - dist) / mouse.maxDist;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isMatrixMode ? 'rgba(34, 197, 94, 0.7)' : 'rgba(0, 242, 254, 0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Mode 2: Matrix Rain
  const matrixChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/;{}[]=+-*&%$#@!';
  const matrixFontSize = 14;
  let columns = Math.floor(width / matrixFontSize);
  let drops = Array(columns).fill(1);

  function drawMatrixRain() {
    ctx.fillStyle = 'rgba(2, 11, 5, 0.12)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#22c55e';
    ctx.font = `${matrixFontSize}px monospace`;

    if (drops.length !== columns) {
      columns = Math.floor(width / matrixFontSize);
      drops = Array(columns).fill(1);
    }

    for (let i = 0; i < drops.length; i++) {
      const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillText(text, i * matrixFontSize, drops[i] * matrixFontSize);

      if (drops[i] * matrixFontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  function renderCanvas() {
    if (!ctx) return;

    if (isMatrixMode) {
      drawMatrixRain();
    } else {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = 1 - dist / 115;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(renderCanvas);
  }
  renderCanvas();

  // --- TYPING SUBTITLE EFFECT ---
  const typingEl = document.getElementById('heroTypingText');
  const phrases = [
    'Python & MySQL Developer',
    'OpenAI & Generative AI Enthusiast',
    'Cloud Computing Explorer (GCP)',
    'Computer Science & Engineering Undergrad',
    'Building Scalable & Practical Systems'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 90;

  function typeEffect() {
    if (!typingEl) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingDelay = 1800; // Pause at end of sentence
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = 450;
    }

    setTimeout(typeEffect, typingDelay);
  }
  setTimeout(typeEffect, 600);

  // --- INTERACTIVE CYBER TERMINAL (CLI) ---
  const termBody = document.getElementById('termBody');
  const termInput = document.getElementById('termInput');
  const termChips = document.querySelectorAll('.quick-chip');

  const history = [];
  let historyIdx = -1;

  const terminalCommands = {
    help: () => `
Available system commands:
  • <span class="terminal-line output-success">whoami</span>       - Display engineer profile & background
  • <span class="terminal-line output-success">skills</span>       - Inspect technical skill matrix & proficiency
  • <span class="terminal-line output-success">projects</span>     - List key engineering projects with specs
  • <span class="terminal-line output-success">experience</span>   - View industry internships (NSIC, Babbagenz)
  • <span class="terminal-line output-success">education</span>    - Display academic credentials (KAHE)
  • <span class="terminal-line output-success">certifications</span>- Enumerate recognized certifications
  • <span class="terminal-line output-success">contact</span>      - Output communication channels & socials
  • <span class="terminal-line output-success">cat resume.txt</span>- Display resume summary
  • <span class="terminal-line output-success">matrix</span>       - Toggle falling code Matrix visualizer
  • <span class="terminal-line output-success">sfx</span>          - Toggle synthesizer audio feedback
  • <span class="terminal-line output-success">clear</span>        - Flush terminal buffer
  • <span class="terminal-line output-success">sudo hire</span>    - Instant recruiter fast-track
`,
    whoami: () => `
<span class="terminal-line output-info">NAME:</span> Shakti Vel Nadarajan
<span class="terminal-line output-info">ROLE:</span> CSE Student • Aspiring Software Developer
<span class="terminal-line output-info">UNIVERSITY:</span> Karpagam Academy of Higher Education, Coimbatore
<span class="terminal-line output-info">CORE FOCUS:</span> Python Applications, Cloud Computing (GCP), Generative AI / OpenAI API, MySQL
<span class="terminal-line output-dim">STATUS: Actively seeking software engineering internships & developer opportunities.</span>
`,
    skills: () => `
<span class="terminal-line output-info">[TECHNICAL SKILLS MATRIX]</span>
- <span class="terminal-line output-success">LANGUAGES:</span> Python (Advanced), SQL, JavaScript, HTML5/CSS3, C
- <span class="terminal-line output-success">AI & LLM:</span> OpenAI API, ChatGPT Architecture, Prompt Engineering, Applied GenAI
- <span class="terminal-line output-success">DATABASES:</span> MySQL, Relational Schema Design, Query Optimization
- <span class="terminal-line output-success">CLOUD & DEVOPS:</span> Google Cloud (GCP), Cloud Architecture Basics, IoT 201, Linux/Bash
- <span class="terminal-line output-success">TOOLS & PRACTICES:</span> Git, GitHub, VS Code, Agile / Scrum Methodology
`,
    projects: () => `
<span class="terminal-line output-info">[ENGINEERING PROJECTS]</span>
1. <span class="terminal-line output-success">Blood Donor Management System</span>
   Stack: Python, MySQL, JavaScript, HTML5/CSS3
   Role: Full-stack architecture, real-time blood group inventory, secure donor search.
2. <span class="terminal-line output-success">NeuroPrompt AI — Generative Workflow Assistant</span>
   Stack: Python, OpenAI API, Prompt Pipelines, Streamlit
   Role: Automated structured task summaries from conversational prompts.
3. <span class="terminal-line output-success">CloudPulse — Infrastructure Telemetry Dashboard</span>
   Stack: Google Cloud (GCP), Python, Cloud Functions, REST
   Role: Lightweight serverless monitoring of cloud uptime & instance latency.
4. <span class="terminal-line output-success">SQLQueryLens — Automated Database Analytics</span>
   Stack: Python, MySQL, Pandas, Query Visualizer
   Role: Automated reporting engine for identifying query latency bottlenecks.
`,
    experience: () => `
<span class="terminal-line output-info">[INDUSTRY EXPERIENCE]</span>
• <span class="terminal-line output-success">NSIC Chennai — Cloud Computing Intern</span>
  Period: 03 August 2026 – 03 September 2026
  - Configured virtual machines, network security, and cloud storage architectures.
  - Gained hands-on experience in production cloud services and resource management.
• <span class="terminal-line output-success">Babbagenz Ventures Pvt Ltd — AI & ChatGPT Developer Intern</span>
  Period: June 2024 – July 2024 (Remote)
  - Developed hands-on Python scripts integrating the OpenAI API & ChatGPT models.
  - Engineered prompt chains and automation pipelines for real-world business use cases.
`,
    education: () => `
<span class="terminal-line output-info">[ACADEMIC BACKGROUND]</span>
• <span class="terminal-line output-success">Karpagam Academy of Higher Education (KAHE), Coimbatore</span>
  Degree: Bachelor of Engineering (B.E.) — Computer Science & Engineering
  Graduation: Expected June 2027
• <span class="terminal-line output-success">Point Calimere International School</span>
  HSC: May 2023 | SSLC: March 2021
`,
    certifications: () => `
<span class="terminal-line output-info">[VERIFIED CREDENTIALS]</span>
[✔] OpenAI Certification — BabbaGenz
[✔] Applied Generative AI — Infosys Springboard
[✔] Internet of Things 201 — Infosys Springboard
[✔] Software Engineering & Agile — Infosys Springboard
[✔] Google Cloud Career Launchpad — Cloud Engineer Track
`,
    contact: () => `
<span class="terminal-line output-info">[COMMUNICATION DECK]</span>
• EMAIL:    <a href="mailto:shaktivel230@gmail.com" style="color:#00f2fe">shaktivel230@gmail.com</a>
• PHONE:    +91 63797 93547
• GITHUB:   <a href="https://github.com/Shakti-vel-23" target="_blank" style="color:#00f2fe">github.com/Shakti-vel-23 ↗</a>
• LINKEDIN: <a href="https://www.linkedin.com/in/shakti-vel-nadarajan-02b232291" target="_blank" style="color:#00f2fe">linkedin.com/in/shakti-vel-nadarajan ↗</a>
`,
    'cat resume.txt': () => `
=== RESUME SUMMARY: SHAKTI VEL NADARAJAN ===
Role: Software Developer / CSE Undergrad (KAHE '27)
Skills: Python, MySQL, OpenAI API, GCP, JavaScript
Experience: Cloud Intern @ NSIC, GenAI Intern @ Babbagenz
Contact: shaktivel230@gmail.com | +91 63797 93547
Status: Ready for immediate engineering placement & internships.
`,
    matrix: () => {
      isMatrixMode = !isMatrixMode;
      document.body.classList.toggle('matrix-theme', isMatrixMode);
      if (matrixToggleBtn) {
        matrixToggleBtn.classList.toggle('active', isMatrixMode);
        matrixToggleBtn.innerHTML = isMatrixMode ? '<span>⚡ MATRIX: ON</span>' : '<span>🌐 MATRIX: OFF</span>';
      }
      return `<span class="terminal-line output-success">[MATRIX MODE] Set to: ${isMatrixMode ? 'ENABLED (Digital Rain Active)' : 'DISABLED (Constellation Active)'}</span>`;
    },
    sfx: () => {
      sfx.enabled = !sfx.enabled;
      sfx.init();
      if (sfxToggleBtn) {
        sfxToggleBtn.classList.toggle('active', sfx.enabled);
        sfxToggleBtn.innerHTML = sfx.enabled ? '<span>🔊 SFX: ON</span>' : '<span>🔇 SFX: OFF</span>';
      }
      return `<span class="terminal-line output-success">[SYNTHESIZER SFX] Audio set to: ${sfx.enabled ? 'ACTIVE' : 'MUTED'}</span>`;
    },
    'sudo hire': () => {
      sfx.accessGranted();
      return `
<span class="terminal-line output-success">========================================================</span>
<span class="terminal-line output-success">ACCESS GRANTED: RECRUITER PRIVILEGES VERIFIED!</span>
<span class="terminal-line output-info">Shakti Vel Nadarajan is an exceptional, motivated CSE student</span>
<span class="terminal-line output-info">ready to create measurable value in Python, Cloud, and AI development.</span>
<span class="terminal-line output-info">Initiate direct outreach: <a href="mailto:shaktivel230@gmail.com" style="color:#00f2fe">shaktivel230@gmail.com</a></span>
<span class="terminal-line output-success">========================================================</span>
`;
    },
    clear: () => {
      const outputArea = document.getElementById('terminalOutput');
      if (outputArea) outputArea.innerHTML = '';
      return null;
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    const outputArea = document.getElementById('terminalOutput');
    if (!outputArea) return;

    sfx.click();

    // Echo command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line cmd-echo';
    cmdLine.innerHTML = `<span class="terminal-prompt">shakti@quantum:~$</span> ${escapeHTML(rawCmd)}`;
    outputArea.appendChild(cmdLine);

    if (cmd === '') return;

    if (terminalCommands[cmd]) {
      const res = terminalCommands[cmd]();
      if (res !== null) {
        const resLine = document.createElement('div');
        resLine.className = 'terminal-line';
        resLine.innerHTML = res;
        outputArea.appendChild(resLine);
      }
    } else {
      sfx.beepLow();
      const errLine = document.createElement('div');
      errLine.className = 'terminal-line output-warn';
      errLine.innerHTML = `command not found: "${escapeHTML(cmd)}". Type <span style="color:#00f2fe">'help'</span> for supported commands.`;
      outputArea.appendChild(errLine);
    }

    termBody.scrollTop = termBody.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        if (val.trim()) {
          history.push(val);
          historyIdx = history.length;
        }
        executeCommand(val);
        termInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (historyIdx > 0) {
          historyIdx--;
          termInput.value = history[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < history.length - 1) {
          historyIdx++;
          termInput.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          termInput.value = '';
        }
      }
    });
  }

  termChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        if (termInput) termInput.focus();
      }
    });
  });

  // --- MOBILE NAVIGATION DRAWER ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const expanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', expanded);
      sfx.click();
    });

    // Close on click link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- SCROLL-SPY ACTIVE NAV HIGHLIGHT ---
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => scrollSpyObserver.observe(sec));

  // --- INTERACTIVE COPY EMAIL BUTTON ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'shaktivel230@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        sfx.accessGranted();
        const origText = copyEmailBtn.innerText;
        copyEmailBtn.innerText = 'COPIED!';
        copyEmailBtn.style.background = 'var(--matrix-green)';
        copyEmailBtn.style.color = '#000';
        setTimeout(() => {
          copyEmailBtn.innerText = origText;
          copyEmailBtn.style.background = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      });
    });
  }

  // --- 3D TILT ON PROJECT CARDS ---
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateX = ((y - midY) / midY) * -7;
      const rotateY = ((x - midX) / midX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });

    card.addEventListener('mouseenter', () => {
      sfx.beepHigh();
    });
  });

  // Sound effects on interactive buttons & links
  document.querySelectorAll('.cyber-btn, .nav-cta-btn, .hud-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => sfx.beepHigh());
  });

  // Contact quick message generator
  const contactForm = document.getElementById('cyberContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || 'Friend';
      const subject = document.getElementById('msgSubject')?.value || 'Opportunity';
      const body = document.getElementById('msgBody')?.value || '';

      const mailtoUrl = `mailto:shaktivel230@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Contact] ${subject} from ${name}`
      )}&body=${encodeURIComponent(body)}`;

      sfx.accessGranted();
      window.location.href = mailtoUrl;
    });
  }

  // --- CERTIFICATE LIGHTBOX MODAL ---
  const certModalOverlay = document.getElementById('certModalOverlay');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalIssuer = document.getElementById('certModalIssuer');
  const certModalImg = document.getElementById('certModalImg');
  const certModalPlaceholder = document.getElementById('certModalPlaceholder');
  const certModalDirectLink = document.getElementById('certModalDirectLink');
  const certModalClose = document.getElementById('certModalClose');
  const certCards = document.querySelectorAll('.cert-card');

  function openCertModal(card) {
    const title = card.getAttribute('data-title') || 'Certificate';
    const issuer = card.getAttribute('data-issuer') || 'Issuing Authority';
    const file = card.getAttribute('data-file') || '';

    if (certModalTitle) certModalTitle.textContent = title;
    if (certModalIssuer) certModalIssuer.textContent = issuer;

    if (certModalImg && certModalPlaceholder) {
      certModalImg.style.display = 'none';
      certModalPlaceholder.style.display = 'block';

      if (file) {
        const testImg = new Image();
        testImg.onload = () => {
          certModalImg.src = file;
          certModalImg.style.display = 'block';
          certModalPlaceholder.style.display = 'none';
          if (certModalDirectLink) {
            certModalDirectLink.href = file;
            certModalDirectLink.style.display = 'inline-flex';
          }
        };
        testImg.onerror = () => {
          certModalImg.style.display = 'none';
          certModalPlaceholder.style.display = 'block';
          if (certModalDirectLink) certModalDirectLink.style.display = 'none';
        };
        testImg.src = file;
      }
    }

    if (certModalOverlay) {
      certModalOverlay.classList.add('active');
      certModalOverlay.setAttribute('aria-hidden', 'false');
    }
    sfx.accessGranted();
  }

  function closeCertModal() {
    if (certModalOverlay) {
      certModalOverlay.classList.remove('active');
      certModalOverlay.setAttribute('aria-hidden', 'true');
    }
    sfx.click();
  }

  certCards.forEach((card) => {
    card.addEventListener('click', () => openCertModal(card));
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);

  if (certModalOverlay) {
    certModalOverlay.addEventListener('click', (e) => {
      if (e.target === certModalOverlay) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModalOverlay && certModalOverlay.classList.contains('active')) {
      closeCertModal();
    }
  });

})();
