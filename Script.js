"use strict";

// Global copy email function
function copyEmail() {
  const email = 'shivamsinghrathore70@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const toast = document.getElementById('copy-toast');
    if(!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    const toast = document.getElementById('copy-toast');
    if(toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); }
  });
}


// Global function for mobile nav links
function closeMobileNav() {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if(hamburger) hamburger.classList.remove('open');
  if(mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener("DOMContentLoaded", () => {


  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const lerp = (a,b,t) => a+(b-a)*t;
  const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
  const map = (v,a,b,c,d) => { if(v<=a)return c; if(v>=b)return d; return c+(v-a)/(b-a)*(d-c); };

  /* ── Copyright ───────────────────────────── */
  const cy = $("#copyright-year");
  if(cy) cy.textContent = `© ${new Date().getFullYear()} Shivam Singh`;

  /* ── Scroll-reveal via IntersectionObserver ─ */
  // Inject the .visible rule
  const styleEl = document.createElement("style");
  styleEl.textContent = `.will-reveal{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1);}.will-reveal.visible{opacity:1!important;transform:none!important;}`;
  document.head.appendChild(styleEl);

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){ en.target.classList.add("visible"); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  $$(".proj,.as-bio,.as-exp,.as-ach,.work-header,.as-top,.skills-sec,.ft-body,.edu-row,.exp-item,.ach-item").forEach(el => {
    el.classList.add("will-reveal");
    revObs.observe(el);
  });

  /* ── Counters — start after intro fades out ── */
  const startCounters = () => {
    $$(".count-up").forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const isCGPA = el.dataset.cgpa === "1";
      const dur = 1800, t0 = performance.now();
      const step = now => {
        const p = clamp((now-t0)/dur, 0, 1);
        const e = p<.5 ? 2*p*p : -1+(4-2*p)*p;
        const v = Math.round(e * target);
        el.textContent = isCGPA ? (v/100).toFixed(2) : v;
        if(p<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  // Intro dismisses at 1.5s, start counters just after so user sees them animate
  setTimeout(startCounters, 1700);

  /* ── INTRO OVERLAY ───────────────────────── */
  const intro = $("#intro");
  const introBar = $(".intro-bar");
  const introPct = $("#intro-pct");
  let introDone = false;

  // Stagger letters
  $$(".in-l").forEach((l, i) => setTimeout(() => l.classList.add("show"), 120 + i * 70));

  const dismissIntro = () => {
    if(introDone || !intro) return;
    introDone = true;
    intro.classList.add("gone");
    // Hard remove after transition
    setTimeout(() => { if(intro && intro.parentNode) intro.parentNode.removeChild(intro); }, 1000);
  };

  // ALWAYS dismiss after 1.5s no matter what
  setTimeout(dismissIntro, 1500);

  const setLoadPct = pct => {
    if(introPct) introPct.textContent = String(Math.round(pct)).padStart(2,"0");
    if(introBar) introBar.style.width = pct + "%";
    if(pct >= 100) setTimeout(dismissIntro, 250);
  };

  /* ── Cursor ──────────────────────────────── */
  /* ── Cursor — always active on desktop ─── */
  const dot = $("#c-dot"), ring = $("#c-ring"), trail = $("#c-trail");
  const isTouchOnly = window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(pointer:fine)").matches;
  if(dot && ring && !isTouchOnly) {
    // Show elements
    [dot, ring, trail].forEach(el => { if(el) el.style.display = "block"; });
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my, tx = mx, ty = my;
    document.addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; }, {passive:true});
    (function tick(){
      dot.style.left  = mx + "px"; dot.style.top  = my + "px";
      rx = lerp(rx,mx,.14);        ry = lerp(ry,my,.14);
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      tx = lerp(tx,mx,.06);        ty = lerp(ty,my,.06);
      if(trail){ trail.style.left = tx+"px"; trail.style.top = ty+"px"; }
      requestAnimationFrame(tick);
    })();
    $$("a,button,.pi-btn,.cta-gold,.cta-ghost,.sk,.ftl,.nav-resume,.pif").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("big"));
      el.addEventListener("mouseleave", () => ring.classList.remove("big"));
    });
  } else {
    // Pure touch device — restore default cursor
    [dot, ring, trail].forEach(el => { if(el) el.style.display = "none"; });
    document.body.style.cursor = "auto";
  }

  /* ── Side rail live coords ───────────────── */
  const srScroll = $("#sr-scroll"), srXY = $("#sr-xy");
  window.addEventListener("scroll", () => {
    const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight) * 100;
    if(srScroll) srScroll.textContent = p.toFixed(1)+"%";
  }, {passive:true});
  document.addEventListener("mousemove", e => {
    if(srXY) srXY.textContent = String(Math.round(e.clientX)).padStart(3,"0")+" / "+String(Math.round(e.clientY)).padStart(3,"0");
  }, {passive:true});

  /* ── Navbar ──────────────────────────────── */
  const nav = $("#nav");
  if(nav) {
    const fn = () => nav.classList.toggle("stuck", window.scrollY > 60);
    window.addEventListener("scroll", fn, {passive:true});
    fn();
  }

  /* ── Smooth scroll ───────────────────────── */
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const t = document.getElementById(a.getAttribute("href").slice(1));
    if(t) { e.preventDefault(); t.scrollIntoView({behavior:"smooth"}); }
  }));

  /* ── 3D tilt ─────────────────────────────── */
  $$(".pv-frame").forEach(f => {
    f.addEventListener("mousemove", e => {
      const r = f.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      f.style.transform = `perspective(1000px) rotateX(${-y*7}deg) rotateY(${x*7}deg)`;
    });
    f.addEventListener("mouseleave", () => {
      f.style.transition = "transform .7s cubic-bezier(.16,1,.3,1)";
      f.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
      setTimeout(() => f.style.transition = "", 700);
    });
  });

  /* ── Skill magnetic ──────────────────────── */
  $$(".sk").forEach(sk => {
    sk.addEventListener("mousemove", e => {
      const r = sk.getBoundingClientRect();
      const dx = (e.clientX-(r.left+r.width/2))*.3;
      const dy = (e.clientY-(r.top+r.height/2))*.3;
      sk.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
    });
    sk.addEventListener("mouseleave", () => sk.style.transform = "");
  });

  /* ── YT progress bar ─────────────────────── */
  const ytFill = $(".yt-bar-fill");
  if(ytFill) {
    let p=0, going=true;
    setInterval(() => {
      if(!going) return;
      p += Math.random()*1.8;
      if(p >= 100) { p=100; going=false; setTimeout(()=>{ p=0; going=true; }, 2200); }
      ytFill.style.width = p+"%";
    }, 75);
  }

  /* ── Marquee pause ───────────────────────── */
  const mq = $(".marquee-track");
  if(mq) {
    mq.parentElement.addEventListener("mouseenter", () => mq.style.animationPlayState="paused");
    mq.parentElement.addEventListener("mouseleave", () => mq.style.animationPlayState="running");
  }

  /* ── Image sequence ──────────────────────── */
  (function initSequence() {
    const canvas = $("#scrolly-canvas");
    if(!canvas) return;

    const ctx = canvas.getContext("2d", {alpha:false});
    const seqLoader = $("#loader");
    const ldFill = $("#ld-fill");
    const ldPct  = $("#ld-pct");

    const TOTAL = 95;
    const imgs = [];
    let loaded = 0, ready = false;

    // Hide sequence loader
    const hideSeqLoader = () => {
      if(!seqLoader) return;
      seqLoader.style.transition = "opacity .6s";
      seqLoader.style.opacity = "0";
      seqLoader.style.pointerEvents = "none";
      setTimeout(() => { if(seqLoader && seqLoader.parentNode) seqLoader.parentNode.removeChild(seqLoader); }, 700);
    };

    // Force hide sequence loader after 1s max
    setTimeout(hideSeqLoader, 1000);

    // Canvas resize
    const rsz = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if(ready) draw(curIdx());
    };
    window.addEventListener("resize", rsz, {passive:true});
    rsz();

    const draw = idx => {
      // Find nearest loaded frame if target isn't ready yet
      let img = imgs[clamp(idx, 0, TOTAL-1)];
      if(!img || !img.complete || !img.naturalWidth) {
        // Scan backwards for nearest ready frame
        for(let i = idx - 1; i >= 0; i--) {
          if(imgs[i] && imgs[i].complete && imgs[i].naturalWidth) { img = imgs[i]; break; }
        }
        if(!img || !img.complete || !img.naturalWidth) return;
      }
      const cr = canvas.width/canvas.height, ir = img.width/img.height;
      let w=canvas.width, h=canvas.height, ox=0, oy=0;
      if(cr>ir){ h=canvas.width/ir; oy=(canvas.height-h)/2; }
      else { w=canvas.height*ir; ox=(canvas.width-w)/2; }
      ctx.fillStyle = "#06060c";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, ox, oy, w, h);
    };

    const getP = () => {
      const sw = $("#scroll-sequence");
      if(!sw) return 0;
      const r = sw.getBoundingClientRect(), max = r.height - window.innerHeight;
      return max <= 0 ? 0 : clamp(-r.top/max, 0, 1);
    };
    const curIdx = () => Math.floor(getP() * (TOTAL-1));

    // Scroll-linked overlay animations
    const s1=$('#section-1'), s2=$('#section-2'), s3=$('#section-3');
    window.addEventListener("scroll", () => {
      if(ready) draw(curIdx());
      const p = getP();
      if(s1){ const op=p>.08?map(p,.08,.26,1,0):1; s1.style.opacity=op; s1.style.transform=`translateY(${map(p,0,.26,0,-70)}px)`; s1.style.pointerEvents=op>.05?"auto":"none"; }
      if(s2){ let op=0; if(p>=.18&&p<=.30)op=map(p,.18,.30,0,1); else if(p>.30&&p<=.52)op=1; else if(p>.52&&p<=.62)op=map(p,.52,.62,1,0); s2.style.opacity=op; s2.style.transform=`translateY(${map(p,.18,.62,70,-70)}px)`; s2.style.pointerEvents=op>.05?"auto":"none"; }
      if(s3){ let op=0; if(p>=.52&&p<=.65)op=map(p,.52,.65,0,1); else if(p>.65&&p<=.83)op=1; else if(p>.83&&p<=.93)op=map(p,.83,.93,1,0); s3.style.opacity=op; s3.style.transform=`translateY(${map(p,.52,.93,70,-70)}px)`; s3.style.pointerEvents=op>.05?"auto":"none"; }
    }, {passive:true});

    // Load frames — priority loading for visible frames first
    // Load frame 0 immediately, then batch the rest
    const BATCH = 10; // load 10 at a time to avoid network congestion

    const loadFrame = (i) => {
      const img = new Image();
      imgs[i] = img;
      const done = () => {
        loaded++;
        const pct = Math.round(loaded / TOTAL * 100);
        setLoadPct(pct);
        if(ldFill) ldFill.style.width = pct + "%";
        if(ldPct)  ldPct.textContent  = pct;
        if(loaded === TOTAL) {
          ready = true;
          hideSeqLoader();
          draw(curIdx());
          window.dispatchEvent(new Event("scroll"));
        } else if(loaded === 1) {
          // First frame loaded — draw immediately so user sees something
          ready = true;
          draw(0);
          hideSeqLoader();
        }
      };
      img.onload  = done;
      img.onerror = done;
      img.decoding = 'async'; // non-blocking decode
      img.src = `public/sequence/frame_${String(i).padStart(2,"0")}_delay-0.052s.png`;
    };

    // Pre-fill array slots
    for(let i = 0; i < TOTAL; i++) imgs.push(null);

    // Load frame 0 first (visible immediately)
    loadFrame(0);

    // Then load rest in batches after a small delay
    let batchStart = 1;
    const loadNextBatch = () => {
      const end = Math.min(batchStart + BATCH, TOTAL);
      for(let i = batchStart; i < end; i++) loadFrame(i);
      batchStart = end;
      if(batchStart < TOTAL) setTimeout(loadNextBatch, 50);
    };
    setTimeout(loadNextBatch, 100);
  })();

  /* ── About section: 3D tilt on cards ──────── */
  $$(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      const intensity = 6;
      card.style.transform = `perspective(700px) rotateX(${-y*intensity}deg) rotateY(${x*intensity}deg) translateZ(8px)`;
      card.style.boxShadow = `${-x*12}px ${-y*12}px 30px rgba(255,184,0,0.06)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .6s cubic-bezier(.16,1,.3,1), box-shadow .6s";
      card.style.transform  = "perspective(700px) rotateX(0) rotateY(0) translateZ(0)";
      card.style.boxShadow  = "";
      setTimeout(() => card.style.transition = "", 650);
    });
  });

  /* ── Skill tags: track mouse for inner glow ── */
  $$(".sk").forEach(sk => {
    sk.addEventListener("mousemove", e => {
      const r  = sk.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y  = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      sk.style.setProperty("--mx", x + "%");
      sk.style.setProperty("--my", y + "%");
    });
  });

  /* ── About title: subtle parallax on mousemove ── */
  const aboutTitle = $("#about-title");
  if(aboutTitle) {
    const aboutSec = aboutTitle.closest(".about-sec");
    if(aboutSec) {
      aboutSec.addEventListener("mousemove", e => {
        const r  = aboutSec.getBoundingClientRect();
        const x  = (e.clientX - r.left  - r.width  / 2) / r.width;
        const y  = (e.clientY - r.top   - r.height / 2) / r.height;
        aboutTitle.style.transform = `translate(${x*8}px, ${y*5}px)`;
      });
      aboutSec.addEventListener("mouseleave", () => {
        aboutTitle.style.transition = "transform .8s cubic-bezier(.16,1,.3,1)";
        aboutTitle.style.transform  = "translate(0,0)";
        setTimeout(() => aboutTitle.style.transition = "", 850);
      });
    }
  }


  /* ════════════════════════════════════════════
     GITHUB + LEETCODE LIVE STATS
  ════════════════════════════════════════════ */
  (function initStats() {

    // ── Helpers ──────────────────────────────
    const el = id => document.getElementById(id);
    const fmt = n => n >= 1000 ? (n/1000).toFixed(1)+'k' : String(n);

    // Animate a number counting up
    const animateNum = (element, target, decimals=0, suffix='') => {
      if(!element) return;
      const dur = 1400, t0 = performance.now();
      const step = now => {
        const p = Math.min((now-t0)/dur, 1);
        const e = p<.5 ? 2*p*p : -1+(4-2*p)*p;
        const v = decimals ? (e*target).toFixed(decimals) : Math.round(e*target);
        element.textContent = v + suffix;
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // ── Intersection Observer to trigger on scroll ──
    const statsSection = document.getElementById('stats');
    if(!statsSection) return;

    let loaded = false;
    const statsObs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !loaded) {
        loaded = true;
        statsObs.disconnect();
        fetchGitHub();
        fetchLeetCode();
      }
    }, { threshold: 0.1 });
    statsObs.observe(statsSection);

    // ── Generate contribution graph (decorative with real-ish pattern) ──
    const buildContribGraph = () => {
      const graph = document.getElementById('gh-contrib-graph');
      if(!graph) return;
      graph.innerHTML = '';
      const weeks = 24;
      const days = 7;
      for(let w = 0; w < weeks; w++) {
        const weekEl = document.createElement('div');
        weekEl.className = 'cg-week';
        for(let d = 0; d < days; d++) {
          const dayEl = document.createElement('div');
          const rand = Math.random();
          const level = rand < 0.45 ? 0 : rand < 0.62 ? 1 : rand < 0.78 ? 2 : rand < 0.90 ? 3 : 4;
          dayEl.className = `cg-day cg-l${level}`;
          const titles = ['No contributions','1-2 contributions','3-5 contributions','6-9 contributions','10+ contributions'];
          dayEl.title = titles[level];
          weekEl.appendChild(dayEl);
        }
        graph.appendChild(weekEl);
      }
    };
    buildContribGraph();

    // ── GITHUB API ────────────────────────────
    const fetchGitHub = async () => {
      const username = 'Shivam-Singh-Hash';
      try {
        // Fetch user profile
        const res = await fetch(`https://api.github.com/users/${username}`);
        if(!res.ok) throw new Error('GitHub API failed');
        const data = await res.json();

        // Avatar
        const avatarEl = document.getElementById('gh-avatar');
        if(avatarEl && data.avatar_url) {
          avatarEl.innerHTML = `<img src="${data.avatar_url}" alt="GitHub avatar" loading="lazy"/>`;
        }

        // Name & bio
        const nameEl = el('gh-name');
        if(nameEl) nameEl.textContent = data.name || 'Shivam Singh';
        const bioEl = el('gh-bio');
        if(bioEl) bioEl.textContent = data.bio || 'Software Engineer · Java · Python · React';

        // Stats with animation
        animateNum(el('gh-repos'),     data.public_repos || 0);
        animateNum(el('gh-followers'), data.followers    || 0);
        animateNum(el('gh-following'), data.following    || 0);

        // Stars — fetch all repos to sum stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if(reposRes.ok) {
          const repos = await reposRes.json();
          const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
          animateNum(el('gh-stars'), totalStars);

          // Build language breakdown
          const langCount = {};
          repos.forEach(r => { if(r.language) langCount[r.language] = (langCount[r.language]||0)+1; });
          const sorted = Object.entries(langCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
          const total  = sorted.reduce((s,[,v])=>s+v,0);
          const colors = { Java:'#b07219', Python:'#3572A5', JavaScript:'#f1e05a', HTML:'#e34c26', CSS:'#563d7c', 'C++':'#f34b7d', TypeScript:'#2b7489' };

          const langsEl = document.getElementById('gh-langs');
          if(langsEl && sorted.length) {
            langsEl.innerHTML = sorted.map(([lang, count]) => {
              const pct = ((count/total)*100).toFixed(1);
              const color = colors[lang] || 'var(--blue)';
              return `<div class="sc-lang-item">
                <div class="sc-lang-top"><span>${lang}</span><span>${pct}%</span></div>
                <div class="sc-lang-bar-wrap"><div class="sc-lang-bar" style="width:0%;background:${color}" data-w="${pct}"></div></div>
              </div>`;
            }).join('');
            // Animate bars
            setTimeout(() => {
              document.querySelectorAll('.sc-lang-bar').forEach(bar => {
                bar.style.width = bar.dataset.w + '%';
              });
            }, 100);
          }
        }

      } catch(err) {
        console.warn('GitHub fetch failed:', err);
        // Fallback static data
        animateNum(el('gh-repos'),     12);
        animateNum(el('gh-followers'),  8);
        animateNum(el('gh-following'), 15);
        animateNum(el('gh-stars'),      6);
        const bioEl = el('gh-bio');
        if(bioEl) bioEl.textContent = 'Software Engineer · Java · Python · React';
        const langsEl = el('gh-langs');
        if(langsEl) langsEl.innerHTML = [
          ['Java','#b07219',45],['Python','#3572A5',30],['JavaScript','#f1e05a',25]
        ].map(([l,c,p])=>`<div class="sc-lang-item"><div class="sc-lang-top"><span>${l}</span><span>${p}%</span></div><div class="sc-lang-bar-wrap"><div class="sc-lang-bar" style="width:0%;background:${c}" data-w="${p}"></div></div></div>`).join('');
        setTimeout(()=>{ document.querySelectorAll('.sc-lang-bar').forEach(b=>b.style.width=b.dataset.w+'%'); },100);
      }
    };

    // ── LEETCODE — Multi-API fallback chain ──────────────────────
    const fetchLeetCode = async () => {

      // Your real fallback numbers — update only when you want to
      const FALLBACK = { easy:80, med:71, hard:23, total:174, easyT:932, medT:2026, hardT:915 };

      // Helper: fetch with a timeout
      const fetchWithTimeout = (url, opts={}, ms=6000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        return fetch(url, { ...opts, signal: controller.signal })
          .finally(() => clearTimeout(timer));
      };

      // ── Try API 1: alfa-leetcode-api (most reliable) ─────────
      const tryAlfa = async () => {
        const r = await fetchWithTimeout(
          `https://alfa-leetcode-api.onrender.com/Shivam--Singh/solved`, {}, 7000
        );
        if (!r.ok) throw new Error('alfa failed');
        const d = await r.json();
        // Also fetch profile for rank
        const r2 = await fetchWithTimeout(
          `https://alfa-leetcode-api.onrender.com/Shivam--Singh`, {}, 7000
        );
        const profile = r2.ok ? await r2.json() : {};
        return {
          easy:  d.easySolved   ?? 0,
          med:   d.mediumSolved ?? 0,
          hard:  d.hardSolved   ?? 0,
          total: d.solvedProblem ?? (d.easySolved+d.mediumSolved+d.hardSolved),
          easyT: d.totalEasy    ?? 932,
          medT:  d.totalMedium  ?? 2026,
          hardT: d.totalHard    ?? 915,
          rank:  profile.ranking ?? 0,
          accept: d.acceptanceRate ?? 0,
        };
      };

      // ── Try API 2: leetcode-stats-api ────────────────────────
      const tryStats = async () => {
        const r = await fetchWithTimeout(
          `https://leetcode-stats-api.herokuapp.com/Shivam--Singh`, {}, 7000
        );
        if (!r.ok) throw new Error('stats api failed');
        const d = await r.json();
        if (d.status === 'error') throw new Error(d.message);
        return {
          easy:  d.easySolved   ?? 0,
          med:   d.mediumSolved ?? 0,
          hard:  d.hardSolved   ?? 0,
          total: d.totalSolved  ?? 0,
          easyT: d.totalEasy    ?? 932,
          medT:  d.totalMedium  ?? 2026,
          hardT: d.totalHard    ?? 915,
          rank:  d.ranking      ?? 0,
          accept: d.acceptanceRate ?? 0,
        };
      };

      // ── Try API 3: CORS proxy → official LeetCode GraphQL ────
      const tryGraphQL = async () => {
        const QUERY = `{"query":"query { matchedUser(username:\"Shivam--Singh\") { submitStats { acSubmissionNum { difficulty count } } profile { ranking } } allQuestionsCount { difficulty count } }"}`;
        const r = await fetchWithTimeout(
          `https://corsproxy.io/?url=${encodeURIComponent('https://leetcode.com/graphql')}`,
          { method:'POST', headers:{'Content-Type':'application/json'}, body: QUERY },
          8000
        );
        if (!r.ok) throw new Error('graphql proxy failed');
        const json = await r.json();
        const user = json?.data?.matchedUser;
        if (!user) throw new Error('no user');
        const ac  = user.submitStats.acSubmissionNum;
        const all = json?.data?.allQuestionsCount ?? [];
        const get = (arr, key, diff) => arr.find(x=>x.difficulty===diff)?.[key] ?? 0;
        return {
          easy:  get(ac,  'count', 'Easy'),
          med:   get(ac,  'count', 'Medium'),
          hard:  get(ac,  'count', 'Hard'),
          total: get(ac,  'count', 'All'),
          easyT: get(all, 'count', 'Easy')   || 932,
          medT:  get(all, 'count', 'Medium') || 2026,
          hardT: get(all, 'count', 'Hard')   || 915,
          rank:  user.profile?.ranking ?? 0,
          accept: 0,
        };
      };

      // ── Try API 4: vercel proxy ────────────────────────────────
      const tryVercel = async () => {
        const r = await fetchWithTimeout(
          `https://leetcode-api-faisalshahbaz.vercel.app/Shivam--Singh`, {}, 7000
        );
        if (!r.ok) throw new Error('vercel failed');
        const d = await r.json();
        return {
          easy:  d.easySolved   ?? 0,
          med:   d.mediumSolved ?? 0,
          hard:  d.hardSolved   ?? 0,
          total: d.totalSolved  ?? 0,
          easyT: 932, medT: 2026, hardT: 915,
          rank: 0, accept: 0,
        };
      };

      // ── Run all 4, take the FIRST that succeeds ───────────────
      let data = null;
      const apis = [tryAlfa, tryStats, tryGraphQL, tryVercel];
      for (const api of apis) {
        try {
          data = await api();
          // Validate — must have at least 1 solved
          if (data && (data.easy + data.med + data.hard) >= 1) {
            console.log('✅ LeetCode data loaded:', data);
            break;
          }
        } catch (e) {
          console.warn('LC API attempt failed:', e.message);
        }
      }

      // If all APIs failed, use fallback
      if (!data || (data.easy + data.med + data.hard) < 1) {
        console.warn('All LeetCode APIs failed — using fallback');
        data = FALLBACK;
      }

      // ── Render the data ───────────────────────────────────────
      const { easy, med, hard, total, easyT, medT, hardT, rank, accept } = data;

      // Rank / bio line
      const rankEl = el('lc-rank');
      if (rankEl) rankEl.textContent = (rank && rank < 600000)
        ? `Global Rank #${fmt(rank)}`
        : '3rd Year CSE · Galgotias University';

      // Total solved + ring
      animateNum(el('lc-total'), total || (easy + med + hard));
      const ring = document.getElementById('lc-ring');
      if (ring) {
        setTimeout(() => {
          const grandTotal = (easyT||932) + (medT||2026) + (hardT||915);
          const solved     = total || (easy + med + hard);
          ring.style.strokeDashoffset = Math.max(0, 314 - (314 * solved / grandTotal)).toFixed(2);
        }, 200);
      }

      // Difficulty numbers
      el('lc-easy') && animateNum(el('lc-easy'), easy);
      el('lc-med')  && animateNum(el('lc-med'),  med);
      el('lc-hard') && animateNum(el('lc-hard'), hard);

      // Difficulty bars
      setTimeout(() => {
        const eb = el('lc-easy-bar'), mb = el('lc-med-bar'), hb = el('lc-hard-bar');
        if (eb) eb.style.width = (((easy||0) / (easyT||932))  * 100).toFixed(1) + '%';
        if (mb) mb.style.width = (((med||0)  / (medT||2026)) * 100).toFixed(1) + '%';
        if (hb) hb.style.width = (((hard||0) / (hardT||915)) * 100).toFixed(1) + '%';
      }, 200);

      // Bottom stats
      const acceptEl  = el('lc-accept');
      const contestEl = el('lc-contest');
      const contribEl = el('lc-contrib');
      const solved    = total || (easy + med + hard);
      if (acceptEl)  acceptEl.textContent  = accept > 0 ? parseFloat(accept).toFixed(1)+'%' : '~58%';
      if (contestEl) animateNum(contestEl, solved);
      if (contribEl) contribEl.textContent = hard;
    };

  })(); // end initStats

  /* ════════════════════════════════════════════
     TIMELINE — animate items on scroll
  ════════════════════════════════════════════ */
  (function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if(!items.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach((en, i) => {
        if(en.isIntersecting) {
          setTimeout(() => en.target.classList.add('tl-visible'), i * 120);
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    items.forEach(el => obs.observe(el));
  })();

  /* ════════════════════════════════════════════
     SKILL BARS + RADIAL RINGS — animate on scroll
  ════════════════════════════════════════════ */
  (function initSkillBars() {
    const sec = document.getElementById('skills');
    if(!sec) return;
    let fired = false;
    const obs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !fired) {
        fired = true;
        obs.disconnect();
        document.querySelectorAll('.sbar-fill').forEach((bar, i) => {
          const pct = bar.closest('.sbar')?.dataset.pct || 0;
          setTimeout(() => { bar.style.width = pct + '%'; }, i * 80);
        });
        document.querySelectorAll('.radial-ring').forEach((ring, i) => {
          const pct = parseFloat(ring.dataset.pct || 0) / 100;
          const offset = 188.5 - (188.5 * pct);
          setTimeout(() => { ring.style.strokeDashoffset = offset; }, 200 + i * 100);
        });
      }
    }, { threshold: 0.15 });
    obs.observe(sec);
  })();

  /* ════════════════════════════════════════════
     CONTACT FORM — EmailJS
  ════════════════════════════════════════════ */
  (function initContactForm() {
    const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    if(typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const form    = document.getElementById('contact-form');
    const btn     = document.getElementById('cf-submit');
    const btnText = document.getElementById('cf-btn-text');
    const status  = document.getElementById('cf-status');
    if(!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();

      if(typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        const name    = document.getElementById('cf-name')?.value    || '';
        const subject = document.getElementById('cf-subject')?.value || 'Portfolio Contact';
        const msg     = document.getElementById('cf-msg')?.value     || '';
        window.location.href = `mailto:shivamsinghrathore70@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + '\n\n' + msg)}`;
        if(status) { status.textContent = '↗ Opening your email client...'; status.className = 'cf-status success'; }
        return;
      }

      btn.disabled = true;
      btnText.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M12 2a10 10 0 0 1 10 10"/></svg> Sending...';
      status.className = 'cf-status';
      status.style.display = 'none';

      try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        status.textContent = "✓ Message sent! I'll get back to you soon.";
        status.className = 'cf-status success';
        form.reset();
      } catch(err) {
        status.textContent = '✕ Failed to send. Please email me directly at shivamsinghrathore70@gmail.com';
        status.className = 'cf-status error';
      } finally {
        btn.disabled = false;
        btnText.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg> Send Message';
      }
    });

    document.querySelectorAll('.cf-input, .cf-textarea').forEach(inp => {
      inp.addEventListener('focus', () => inp.parentElement.classList.add('focused'));
      inp.addEventListener('blur',  () => inp.parentElement.classList.remove('focused'));
    });
  })();


  /* ════════════════════════════════════════════
     DARK / LIGHT MODE TOGGLE
  ════════════════════════════════════════════ */
  (function initTheme() {
    const btn  = document.getElementById('theme-toggle');
    const body = document.body;
    // Load saved preference
    const saved = localStorage.getItem('theme');
    if(saved === 'light') body.classList.add('light-mode');

    if(!btn) return;
    btn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  })();

  /* ════════════════════════════════════════════
     MOBILE HAMBURGER NAV
  ════════════════════════════════════════════ */
  (function initMobileNav() {
    const hamburger  = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    if(!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on overlay click
    mobileMenu.addEventListener('click', e => {
      if(e.target === mobileMenu) closeMobileNav();
    });
  })();

  /* ════════════════════════════════════════════
     TESTIMONIALS — animate on scroll
  ════════════════════════════════════════════ */
  (function initTestimonials() {
    const cards = document.querySelectorAll('.testi-card');
    if(!cards.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach((en, i) => {
        if(en.isIntersecting) {
          setTimeout(() => {
            en.target.style.opacity = '1';
            en.target.style.transform = 'translateY(0)';
          }, i * 120);
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity .7s var(--out), transform .7s var(--out)';
      obs.observe(card);
    });
  })();


  /* ════════════════════════════════════════════
     BACK TO TOP BUTTON
  ════════════════════════════════════════════ */
  (function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if(!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ════════════════════════════════════════════
     COPY EMAIL TO CLIPBOARD
  ════════════════════════════════════════════ */
  (function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    if(copyBtn) copyBtn.addEventListener('click', copyEmail);
  })();

  /* ════════════════════════════════════════════
     PAGE TRANSITIONS
  ════════════════════════════════════════════ */
  (function initPageTransitions() {
    const overlay = document.getElementById('page-transition');
    if(!overlay) return;

    // Fade in on page load
    overlay.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('active');
      });
    });

    // Intercept links to case study pages
    document.querySelectorAll('a[href$=".html"]:not([target="_blank"])').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if(!href || href.startsWith('http') || href.startsWith('#')) return;
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 420);
      });
    });
  })();

  /* ════════════════════════════════════════════
     KEYBOARD SHORTCUTS
  ════════════════════════════════════════════ */
  (function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // Skip if typing in input/textarea
      if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

      switch(e.key) {
        case 't': case 'T':
          // Toggle theme
          document.body.classList.toggle('light-mode');
          localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
          break;
        case 'Escape':
          // Close mobile nav
          closeMobileNav();
          break;
        case 'ArrowUp':
          if(e.ctrlKey || e.metaKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        case '/':
          // Focus contact form
          e.preventDefault();
          const nameField = document.getElementById('cf-name');
          if(nameField) {
            nameField.focus();
            nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          break;
      }
    });
  })();


  /* ════════════════════════════════════════════
     AUTO UPDATE COPYRIGHT YEAR
  ════════════════════════════════════════════ */
  (function updateCopyrightYear() {
    const el = document.getElementById('copyright-year');
    if(el) el.textContent = '© ' + new Date().getFullYear() + ' Shivam Singh';
  })();


  /* ════════════════════════════════════════════
     FILM GRAIN OVERLAY
  ════════════════════════════════════════════ */
  (function initGrain() {
    const c = document.getElementById('grain-canvas');
    if(!c) return;
    const ctx = c.getContext('2d');
    let W, H, frame;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener('resize', resize, { passive: true });
    resize();
    const draw = () => {
      const img = ctx.createImageData(W, H);
      const d = img.data;
      for(let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 30; // ~12% alpha, final opacity comes from CSS 0.032
      }
      ctx.putImageData(img, 0, 0);
      frame = requestAnimationFrame(draw);
    };
    draw();
  })();

  /* ════════════════════════════════════════════
     HERO SUBTITLE TYPEWRITER
  ════════════════════════════════════════════ */
  (function initHeroTyping() {
    const el = document.getElementById('hero-sub-typed');
    if(!el) return;
    const lines = ['Software Engineer crafting scalable systems\nand immersive digital experiences.'];
    const text = lines[0];
    let i = 0;
    const type = () => {
      if(i <= text.length) {
        el.innerHTML = text.slice(0, i).replace(/\n/g, '<br>');
        i++;
        setTimeout(type, i === 1 ? 0 : 28);
      }
    };
    // Start after intro dismisses
    setTimeout(type, 1900);
  })();

  /* ════════════════════════════════════════════
     CURSOR CLICK BURST
  ════════════════════════════════════════════ */
  (function initClickBurst() {
    if(window.matchMedia('(pointer:coarse)').matches) return;
    document.addEventListener('click', e => {
      const x = e.clientX, y = e.clientY;
      // Gold ring
      const ring = document.createElement('div');
      ring.className = 'cursor-burst-ring';
      ring.style.left = x + 'px';
      ring.style.top  = y + 'px';
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 600);
      // 6 sparks
      for(let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.className = 'cursor-spark';
        spark.style.left = x + 'px';
        spark.style.top  = y + 'px';
        const angle = (i / 6) * Math.PI * 2;
        const dist  = 8 + Math.random() * 6;
        spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        // Random subtle color variation
        if(Math.random() > 0.5) spark.style.background = '#fff';
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 700);
      }
    });
  })();

  /* ════════════════════════════════════════════
     SCROLL PROGRESS BAR
  ════════════════════════════════════════════ */
  (function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if(!bar) return;
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max * 100).toFixed(2) : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ════════════════════════════════════════════
     ACTIVE NAV HIGHLIGHTING
     Scroll-position approach — works for sections
     of any height (tall Work/About sections included)
  ════════════════════════════════════════════ */
  (function initActiveNav() {
    const navLinks = document.querySelectorAll('.nl[href^="#"]');
    if(!navLinks.length) return;

    // Build map: sectionId → navLink element
    const map = {};
    navLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if(sec) map[id] = { el: sec, link: a };
    });

    const OFFSET = window.innerHeight * 0.25; // trigger at 25% from top

    const update = () => {
      const scrollY = window.scrollY;
      let current = null;
      let minDist = Infinity;

      Object.values(map).forEach(({ el, link }) => {
        const top  = el.getBoundingClientRect().top + scrollY;
        const bot  = top + el.offsetHeight;
        // Section is "active" if scroll position is inside it (with offset)
        if(scrollY + OFFSET >= top && scrollY + OFFSET < bot) {
          const dist = Math.abs(scrollY + OFFSET - top);
          if(dist < minDist) { minDist = dist; current = link; }
        }
      });

      navLinks.forEach(a => a.classList.remove('nav-active'));
      if(current) current.classList.add('nav-active');
    };

    window.addEventListener('scroll', update, { passive: true });
    update(); // run once on load
  })();


  /* ════════════════════════════════════════════
     SECTION COUNTER (RIGHT RAIL)
  ════════════════════════════════════════════ */
  (function initSectionCounter() {
    const el = document.getElementById('sr-section');
    if(!el) return;
    // Map section IDs to numbers
    const SECTIONS = [
      { id: 'scroll-sequence', num: 1 },
      { id: 'work',            num: 2 },
      { id: 'about',           num: 3 },
      { id: 'skills',          num: 4 },
      { id: 'timeline',        num: 5 },
      { id: 'testimonials',    num: 6 },
      { id: 'contact',         num: 7 },
    ];
    const TOTAL = SECTIONS.length;
    const pad = n => String(n).padStart(2, '0');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const found = SECTIONS.find(s => s.id === entry.target.id);
          if(found) el.textContent = pad(found.num) + ' / ' + pad(TOTAL);
        }
      });
    }, { threshold: 0.15 });
    SECTIONS.forEach(s => {
      const sec = document.getElementById(s.id);
      if(sec) obs.observe(sec);
    });
  })();

  /* ════════════════════════════════════════════
     SKILL BAR NUMBER COUNT-UP
  ════════════════════════════════════════════ */
  (function initSkillBarCountUp() {
    const sec = document.getElementById('skills');
    if(!sec) return;
    let fired = false;
    const obs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !fired) {
        fired = true;
        obs.disconnect();
        document.querySelectorAll('.sbar').forEach((bar, i) => {
          const pct = parseInt(bar.dataset.pct || '0', 10);
          const numEl = bar.querySelector('.sbar-pct');
          if(!numEl) return;
          numEl.textContent = '0%';
          const dur = 1200, t0 = performance.now();
          setTimeout(() => {
            const step = now => {
              const p = Math.min((now - t0) / dur, 1);
              const e = p < .5 ? 2*p*p : -1 + (4-2*p)*p;
              numEl.textContent = Math.round(e * pct) + '%';
              if(p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }, i * 80);
        });
      }
    }, { threshold: 0.15 });
    obs.observe(sec);
  })();

  /* ════════════════════════════════════════════
     CONFETTI ON FORM SUBMIT
  ════════════════════════════════════════════ */
  function launchConfetti() {
    const COLORS = ['#FFB800','#ffd875','#ffffff','#ff8c00','#fffbe0'];
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99995;';
    document.body.appendChild(canvas);
    const ctx2 = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      r: 4 + Math.random() * 5,
      d: 1.5 + Math.random() * 2.5,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      dt: (Math.random() - .5) * 2,
      tilt: Math.random() * 10 - 5,
      ts: .2 + Math.random() * .3,
    }));
    let alive = true;
    setTimeout(() => { alive = false; setTimeout(() => canvas.remove(), 500); }, 3500);
    const draw2 = () => {
      if(!alive) return;
      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx2.beginPath();
        ctx2.fillStyle = p.c;
        ctx2.save();
        ctx2.translate(p.x, p.y);
        ctx2.rotate(p.tilt * Math.PI / 180);
        ctx2.fillRect(-p.r, -p.r * .4, p.r * 2, p.r * .8);
        ctx2.restore();
        p.y  += p.d;
        p.x  += p.dt * .4;
        p.tilt += p.ts;
        if(p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      });
      requestAnimationFrame(draw2);
    };
    draw2();
  }

  // Patch initContactForm to fire confetti on success
  (function patchContactConfetti() {
    const form = document.getElementById('contact-form');
    const origSubmit = form ? form._confettiPatched : null;
    if(!form || form._confettiPatched) return;
    form._confettiPatched = true;
    form.addEventListener('submit', () => {
      // We watch for cf-status to get 'success' class
      setTimeout(() => {
        const status = document.getElementById('cf-status');
        if(status && status.classList.contains('success')) launchConfetti();
      }, 1200);
    });
  })();

  /* ════════════════════════════════════════════
     AVAILABLE FOR HIRE BADGE → SCROLL TO CONTACT
  ════════════════════════════════════════════ */
  (function initAvailableBadge() {
    const badge = document.getElementById('available-badge');
    const contact = document.getElementById('contact');
    if(!badge || !contact) return;
    const scrollToContact = () => {
      contact.scrollIntoView({ behavior: 'smooth' });
      badge.classList.add('contact-pulse');
      setTimeout(() => badge.classList.remove('contact-pulse'), 1500);
    };
    badge.addEventListener('click', scrollToContact);
    badge.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToContact(); } });
  })();

  /* ════════════════════════════════════════════
     RESUME MODAL
  ════════════════════════════════════════════ */
  (function initResumeModal() {
    const openBtn = document.getElementById('nav-resume-btn');
    const modal   = document.getElementById('resume-modal');
    const closeBtn= document.getElementById('rmodal-close');
    const iframe  = document.getElementById('rmodal-iframe');
    const fallback= document.getElementById('rmodal-fallback');
    if(!openBtn || !modal) return;

    const openModal = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Detect localhost / file:// — show fallback
      const isLocal = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      if(isLocal && iframe && fallback) {
        iframe.style.display = 'none';
        fallback.style.display = 'flex';
      }
    };
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  })();

  /* ════════════════════════════════════════════
     EASTER EGG — type "shivam"
  ════════════════════════════════════════════ */
  (function initEasterEgg() {
    const overlay  = document.getElementById('easter-egg');
    const confCvs  = document.getElementById('easter-confetti');
    if(!overlay || !confCvs) return;

    const TARGET = 'shivam';
    let typed = '', confLoop = null;

    const COLORS = ['#FFB800','#ffd875','#ffffff','#ff8c00','#a78bfa','#f472b6'];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 200,
      r: 5 + Math.random() * 6,
      d: 2 + Math.random() * 3,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      dt: (Math.random() - .5) * 3,
      tilt: Math.random() * 10 - 5,
      ts: .3 + Math.random() * .4,
    }));

    const startConfetti = () => {
      confCvs.width  = window.innerWidth;
      confCvs.height = window.innerHeight;
      const ctx3 = confCvs.getContext('2d');
      const frame3 = () => {
        ctx3.clearRect(0, 0, confCvs.width, confCvs.height);
        pieces.forEach(p => {
          ctx3.save();
          ctx3.translate(p.x, p.y);
          ctx3.rotate(p.tilt * Math.PI / 180);
          ctx3.fillStyle = p.c;
          ctx3.fillRect(-p.r, -p.r * .4, p.r * 2, p.r * .8);
          ctx3.restore();
          p.y += p.d; p.x += p.dt * .4; p.tilt += p.ts;
          if(p.y > confCvs.height + 30) { p.y = -30; p.x = Math.random() * confCvs.width; }
        });
        confLoop = requestAnimationFrame(frame3);
      };
      frame3();
    };

    const open = () => {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      startConfetti();
    };
    const close = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if(confLoop) { cancelAnimationFrame(confLoop); confLoop = null; }
    };

    document.addEventListener('keydown', e => {
      if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      if(e.key === 'Escape' && overlay.classList.contains('open')) { close(); return; }
      if(overlay.classList.contains('open')) return;
      if(e.key.length === 1) {
        typed += e.key.toLowerCase();
        if(typed.length > TARGET.length) typed = typed.slice(-TARGET.length);
        if(typed === TARGET) { typed = ''; open(); }
      }
    });
    overlay.addEventListener('click', close);
  })();


  /* ════════════════════════════════════════════
     CURSOR COLOR CYCLE
     Cycles: gold → blue → green → purple on each click
  ════════════════════════════════════════════ */
  (function initCursorColorCycle() {
    if(window.matchMedia('(pointer:coarse)').matches) return;
    const dot   = document.getElementById('c-dot');
    const ring  = document.getElementById('c-ring');
    const trail = document.getElementById('c-trail');
    if(!dot) return;

    const COLORS = [
      { dot: '#FFB800', ring: 'rgba(255,184,0,.5)',   trail: 'rgba(255,184,0,.07)',  shadow: '0 0 12px #FFB800, 0 0 24px rgba(255,184,0,.5)' },
      { dot: '#4f9eff', ring: 'rgba(79,158,255,.5)',  trail: 'rgba(79,158,255,.07)', shadow: '0 0 12px #4f9eff, 0 0 24px rgba(79,158,255,.5)' },
      { dot: '#34d399', ring: 'rgba(52,211,153,.5)',  trail: 'rgba(52,211,153,.07)', shadow: '0 0 12px #34d399, 0 0 24px rgba(52,211,153,.5)' },
      { dot: '#a78bfa', ring: 'rgba(167,139,250,.5)', trail: 'rgba(167,139,250,.07)',shadow: '0 0 12px #a78bfa, 0 0 24px rgba(167,139,250,.5)' },
    ];
    let idx = 0;

    const applyColor = (c) => {
      dot.style.background  = c.dot;
      dot.style.boxShadow   = c.shadow;
      if(ring)  ring.style.borderColor  = c.ring;
      if(trail) trail.style.background  = `radial-gradient(circle, ${c.trail} 0%, transparent 70%)`;
    };
    applyColor(COLORS[0]);

    document.addEventListener('click', () => {
      idx = (idx + 1) % COLORS.length;
      applyColor(COLORS[idx]);
    });
  })();


  /* ════════════════════════════════════════════
     SCROLL PARALLAX ON PROJECT IMAGES
     Images scroll at 60% of card speed → depth effect
  ════════════════════════════════════════════ */
  (function initProjectParallax() {
    const images = document.querySelectorAll('.pv-img');
    if(!images.length) return;
    const update = () => {
      images.forEach(img => {
        const parent = img.closest('.pv-frame');
        if(!parent) return;
        const rect = parent.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift  = (center / window.innerHeight) * 30; // ±30px
        img.style.transform = `translateY(${shift}px) scale(1.08)`;
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();


  /* ════════════════════════════════════════════
     WEB AUDIO — SHARED CONTEXT
  ════════════════════════════════════════════ */
  const _audioCtx = (() => {
    let ctx = null;
    return () => {
      if(!ctx) {
        try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
      }
      return ctx;
    };
  })();


  /* ════════════════════════════════════════════
     EASTER EGG — CHIME SOUND
     Called from initEasterEgg re-wired below
  ════════════════════════════════════════════ */
  function playEasterChime() {
    const ctx = _audioCtx();
    if(!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // Wire chime into easter egg: listen for it opening
  (function wireEasterChime() {
    const overlay = document.getElementById('easter-egg');
    if(!overlay) return;
    const obs = new MutationObserver(muts => {
      muts.forEach(m => {
        if(m.type === 'attributes' && overlay.classList.contains('open')) playEasterChime();
      });
    });
    obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  })();


  /* ════════════════════════════════════════════
     NAV HOVER TICK SOUND
     Tiny mechanical click on nav link hover
     Toggle: Shift+S   (shown as tooltip)
  ════════════════════════════════════════════ */
  (function initNavTick() {
    let enabled = true; // on by default

    const playTick = () => {
      if(!enabled) return;
      const ctx = _audioCtx();
      if(!ctx) return;
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for(let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8) * 0.25;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      // Tiny bandpass to shape it as a "click"
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 3200;
      bpf.Q.value = 0.8;
      src.connect(bpf);
      bpf.connect(ctx.destination);
      src.start();
    };

    document.querySelectorAll('.nl, .nav-logo, .ftl').forEach(el => {
      el.addEventListener('mouseenter', playTick);
    });

    // Shift+S toggles hover sounds
    document.addEventListener('keydown', e => {
      if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      if(e.key === 'S' && e.shiftKey) {
        enabled = !enabled;
        // Brief toast-style feedback
        const toast = document.getElementById('copy-toast');
        if(toast) {
          toast.textContent = enabled ? '🔊 Hover sounds ON' : '🔇 Hover sounds OFF';
          toast.classList.add('show');
          setTimeout(() => { toast.classList.remove('show'); toast.textContent = '✓ Email copied!'; }, 1800);
        }
      }
    });
  })();


  /* ════════════════════════════════════════════
     MAGNETIC BUTTONS
     CTAs and nav links gently pull toward cursor
  ════════════════════════════════════════════ */
  (function initMagneticButtons() {
    if(window.matchMedia('(pointer:coarse)').matches) return;

    const SELECTORS = '.cta-gold, .cta-ghost, .pi-btn, button.nav-resume, .rmodal-btn--dl';
    const STRENGTH  = 0.38; // pull fraction (0–1)
    const RADIUS    = 90;   // activation radius in px

    document.querySelectorAll(SELECTORS).forEach(el => {
      el.addEventListener('mousemove', e => {
        const r   = el.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const dx  = e.clientX - cx;
        const dy  = e.clientY - cy;
        const dist= Math.hypot(dx, dy);
        if(dist < RADIUS) {
          const pull = (1 - dist / RADIUS) * STRENGTH;
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        }
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        el.style.transform  = '';
        setTimeout(() => el.style.transition = '', 520);
      });
    });
  })();


  /* ════════════════════════════════════════════
     SERVICE WORKER REGISTRATION
  ════════════════════════════════════════════ */
  (function registerSW() {
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(() => console.log('SW registered'))
          .catch(() => {}); // fail silently on localhost
      });
    }
  })();


}); // DOMContentLoaded
