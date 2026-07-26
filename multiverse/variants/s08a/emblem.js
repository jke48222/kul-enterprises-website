/*
 * KUL s08a — "Particle Calm" emblem engine.
 * One generative element: a gold particle field that drifts, breathes, and
 * periodically resolves toward the KUL lion (sampled from the real brand
 * raster) or an abstract wheel form. Vanilla, dependency-free.
 *
 * Contract with the page:
 *   - <div data-emblem><canvas></canvas></div>
 *   - Config lives in CSS custom properties on :root (see readConfig).
 *   - Live tweaks (tweaks.js) mutate :root style; a MutationObserver re-reads.
 *   - prefers-reduced-motion  -> single static resolved frame, no loop.
 *   - Slow devices            -> watchdog thins the field, then freezes.
 *   - Off-viewport / hidden   -> loop pauses.
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var wrap = document.querySelector('[data-emblem]');
  if (!wrap) return;
  var canvas = wrap.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------- config */

  var cfg = {
    density: 1, size: 1, resolve: 2.2, drift: 1,
    scale: 1, form: 'lion', gold: '#D4AF37'
  };

  function readVar(cs, name, fallback) {
    var v = cs.getPropertyValue(name);
    return v ? v.trim() : fallback;
  }
  function readNum(cs, name, fallback) {
    var n = parseFloat(readVar(cs, name, ''));
    return isFinite(n) ? n : fallback;
  }
  function readConfig() {
    var cs = getComputedStyle(doc);
    var prev = { density: cfg.density, gold: cfg.gold, form: cfg.form, scale: cfg.scale };
    cfg.density = clamp(readNum(cs, '--p-density', 1), 0.2, 2.2);
    cfg.size    = clamp(readNum(cs, '--p-size', 1), 0.4, 2.4);
    cfg.resolve = clamp(readNum(cs, '--resolve-speed', 2.2), 0.6, 5);
    cfg.drift   = clamp(readNum(cs, '--drift-energy', 1), 0.1, 2.5);
    cfg.scale   = clamp(readNum(cs, '--emblem-scale', 1), 0.55, 1.3);
    cfg.form    = readVar(cs, '--emblem-form', 'lion').replace(/["']/g, '') || 'lion';
    cfg.gold    = readVar(cs, '--gold', '#D4AF37');
    return prev;
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ----------------------------------------------------------------- color */

  function hexRgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return { r: 212, g: 175, b: 55 };
    var n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function mix(c1, c2, t) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t)
    };
  }
  function rgba(c, a) { return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')'; }

  /* A pre-rendered radial sprite: deep bronze core -> gold body -> pale halo.
     The dark core is what keeps the field crisp on the steel-light ground. */
  var sprite = null;
  var SPR = 64;
  function buildSprite() {
    var gold = hexRgb(cfg.gold);
    var dark = mix(gold, { r: 24, g: 16, b: 2 }, 0.62);
    var pale = mix(gold, { r: 255, g: 248, b: 224 }, 0.55);
    var c = document.createElement('canvas');
    c.width = c.height = SPR;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(SPR / 2, SPR / 2, 0, SPR / 2, SPR / 2, SPR / 2);
    grad.addColorStop(0.00, rgba(dark, 0.95));
    grad.addColorStop(0.18, rgba(mix(dark, gold, 0.55), 0.92));
    grad.addColorStop(0.42, rgba(gold, 0.78));
    grad.addColorStop(0.62, rgba(gold, 0.30));
    grad.addColorStop(0.82, rgba(pale, 0.10));
    grad.addColorStop(1.00, rgba(pale, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, SPR, SPR);
    sprite = c;
  }

  /* -------------------------------------------------------------- geometry */
  /* Physics runs in "unit space": emblem centre = (0,0), resolve radius = 1. */

  var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, pxK = 1;

  function resize() {
    var rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
    if (frozen || isStatic) renderStatic();
  }
  function layout() {
    cx = W / 2;
    cy = H / 2;
    R = Math.min(W, H) * 0.335 * cfg.scale;
    pxK = Math.min(W, H) / 560; /* keeps particle px sizes proportional */
  }

  /* --------------------------------------------------------------- targets */

  var lionPts = null;      /* sampled from the brand raster, or null       */
  var lionPending = false;
  var abstractPts = null;

  function buildAbstract() {
    /* A calm wheel: full outer ring, broken inner ring, hub. */
    var pts = [];
    var i, n, a;
    n = 156;
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      pts.push({ x: Math.cos(a) * 0.96, y: Math.sin(a) * 0.96, w: 1 });
    }
    n = 96;
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      /* leave a gap at the upper right — motion, not a sealed circle */
      if (a > 5.4 || a < 0.55) continue;
      pts.push({ x: Math.cos(a) * 0.62, y: Math.sin(a) * 0.62, w: 0.9 });
    }
    n = 40;
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      pts.push({ x: Math.cos(a) * 0.16, y: Math.sin(a) * 0.16, w: 0.8 });
    }
    abstractPts = pts;
  }

  function loadLion() {
    if (lionPts || lionPending) return;
    lionPending = true;
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      try {
        var G = 132; /* sampling grid */
        var c = document.createElement('canvas');
        c.width = c.height = G;
        var g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(img, 0, 0, G, G);
        var data = g.getImageData(0, 0, G, G).data;
        var cand = [];
        var minX = G, maxX = 0, minY = G, maxY = 0;
        for (var y = 0; y < G; y++) {
          for (var x = 0; x < G; x++) {
            var o = (y * G + x) * 4;
            var lum = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
            if (lum > 30) { /* the lion is the bright figure on black */
              var w = Math.pow(lum / 255, 1.5);
              cand.push({ x: x, y: y, w: w });
              if (x < minX) minX = x; if (x > maxX) maxX = x;
              if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
          }
        }
        if (cand.length < 220) { lionPending = false; return; } /* bad read */
        var mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
        var ext = Math.max(maxX - minX, maxY - minY) / 2 || 1;
        var k = 1.0 / ext; /* fit the head inside the unit resolve circle */
        var cum = [], total = 0;
        for (var i = 0; i < cand.length; i++) { total += cand[i].w; cum.push(total); }
        lionPts = { cand: cand, cum: cum, total: total, mx: mx, my: my, k: k, jit: k };
        lionPending = false;
        if (isStatic || frozen) renderStatic();
        else if (phase !== 'drift' && wantForm() === 'lion') retarget();
      } catch (e) {
        lionPending = false; /* e.g. file:// canvas taint — abstract carries on */
      }
    };
    img.onerror = function () { lionPending = false; };
    img.src = '/assets/brand/lion-black.png';
  }

  function sampleLion() {
    var L = lionPts;
    var r = Math.random() * L.total;
    var lo = 0, hi = L.cum.length - 1, mid;
    while (lo < hi) {
      mid = (lo + hi) >> 1;
      if (L.cum[mid] < r) lo = mid + 1; else hi = mid;
    }
    var c = L.cand[lo];
    return {
      x: (c.x - L.mx + (Math.random() - 0.5) * 1.15) * L.k,
      y: (c.y - L.my + (Math.random() - 0.5) * 1.15) * L.k
    };
  }
  function sampleAbstract() {
    var p = abstractPts[(Math.random() * abstractPts.length) | 0];
    return {
      x: p.x + (Math.random() - 0.5) * 0.045,
      y: p.y + (Math.random() - 0.5) * 0.045
    };
  }

  var cycleFlip = false;
  function wantForm() {
    if (cfg.form === 'abstract') return 'abstract';
    if (cfg.form === 'cycle') return cycleFlip ? 'abstract' : 'lion';
    return 'lion';
  }
  function resolvedForm() {
    var f = wantForm();
    if (f === 'lion' && !lionPts) { loadLion(); return 'abstract'; }
    return f;
  }

  /* ------------------------------------------------------------- particles */

  var parts = [];

  function spawn() {
    var base = clamp(Math.floor((W * H) / 165), 700, 2400);
    var n = Math.round(base * cfg.density * thin);
    parts.length = 0;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.sqrt(Math.random()) * 1.1;
      parts.push({
        x: Math.cos(a) * r, y: Math.sin(a) * r,
        vx: 0, vy: 0,
        tx: 0, ty: 0,
        s: 0.75 + Math.pow(Math.random(), 1.6) * 1.9,  /* few large, many fine */
        a: 0.30 + Math.random() * 0.62,
        ph: Math.random() * Math.PI * 2,
        sh: 0.5 + Math.random() * 1.3,                  /* shimmer speed */
        kv: 0.8 + Math.random() * 0.5,                  /* spring variance */
        dl: 0                                            /* gather delay */
      });
    }
  }

  function retarget() {
    var form = resolvedForm();
    var stagger = cfg.resolve * 0.5;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var t = form === 'lion' ? sampleLion() : sampleAbstract();
      p.tx = t.x; p.ty = t.y;
      p.dl = Math.random() * stagger;
    }
  }

  /* ----------------------------------------------------------- state cycle */

  var phase = 'drift';   /* drift -> gather -> hold -> release -> drift */
  var tP = 0;            /* seconds in current phase */
  var t = 0;             /* global clock */
  var DRIFT_DUR = 6.5, HOLD_DUR = 6.0, RELEASE_DUR = 1.1;
  var holdGlow = 0;      /* 0..1, eases during hold for a settled shimmer */

  function toGather() {
    phase = 'gather'; tP = 0;
    retarget();
  }
  function toRelease() {
    phase = 'release'; tP = 0;
    cycleFlip = !cycleFlip;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var d = Math.hypot(p.x, p.y) || 1;
      var imp = 0.55 + Math.random() * 0.75;
      p.vx += (p.x / d) * imp;
      p.vy += (p.y / d) * imp;
    }
  }

  /* pointer — a gentle, respectful repulsion */
  var px = 0, py = 0, pOn = false;
  wrap.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    px = ((e.clientX - rect.left) - cx) / (R || 1);
    py = ((e.clientY - rect.top) - cy) / (R || 1);
    pOn = true;
  });
  wrap.addEventListener('pointerleave', function () { pOn = false; });
  wrap.addEventListener('click', function () {
    if (isStatic || frozen) return;
    if (phase === 'drift') toGather();
    else if (phase === 'hold') toRelease();
  });

  /* ------------------------------------------------------------------ step */

  function step(dt) {
    t += dt;
    tP += dt;
    var i, p;

    if (phase === 'drift' && tP >= DRIFT_DUR) toGather();
    else if (phase === 'gather' && tP >= cfg.resolve * 1.45) { phase = 'hold'; tP = 0; }
    else if (phase === 'hold' && tP >= HOLD_DUR) toRelease();
    else if (phase === 'release' && tP >= RELEASE_DUR) { phase = 'drift'; tP = 0; }

    holdGlow += ((phase === 'hold' ? 1 : 0) - holdGlow) * Math.min(1, dt * 2.2);

    var E = cfg.drift * 0.85;
    var damp = Math.exp(-dt * 2.1);
    var springOn = phase === 'gather' || phase === 'hold';
    var Tq = Math.max(0.35, cfg.resolve * 0.42);
    var w0 = (2 * Math.PI) / Tq;

    for (i = 0; i < parts.length; i++) {
      p = parts[i];

      if (springOn && (phase === 'hold' || tP >= p.dl)) {
        var k = w0 * w0 * p.kv;
        var c = 2 * Math.sqrt(k) * 0.92;           /* a touch underdamped   */
        p.vx += ((p.tx - p.x) * k - p.vx * c) * dt;
        p.vy += ((p.ty - p.y) * k - p.vy * c) * dt;
        if (phase === 'hold') {                     /* the emblem breathes  */
          p.vx += Math.sin(t * 1.3 + p.ph) * 0.012;
          p.vy += Math.cos(t * 1.1 + p.ph * 1.7) * 0.012;
        }
      } else {
        var ang =
          Math.sin(p.x * 2.05 + t * 0.50 + p.ph * 0.11) * 1.9 +
          Math.cos(p.y * 2.35 - t * 0.38) * 1.6 +
          Math.sin((p.x + p.y) * 1.15 + t * 0.21) * 1.1;
        p.vx += Math.cos(ang) * E * dt;
        p.vy += Math.sin(ang) * E * dt;
        var d = Math.hypot(p.x, p.y);
        if (d > 1.18) {                             /* cohesion — stay a cloud */
          var pull = (d - 1.18) * 2.6 * dt;
          p.vx -= (p.x / d) * pull;
          p.vy -= (p.y / d) * pull;
        }
        p.vx *= damp;
        p.vy *= damp;
      }

      if (pOn && phase !== 'release') {
        var dxp = p.x - px, dyp = p.y - py;
        var dp = dxp * dxp + dyp * dyp;
        if (dp < 0.14 && dp > 0.0001) {
          var f = (0.14 - dp) * 6.5 * dt;
          dp = Math.sqrt(dp);
          p.vx += (dxp / dp) * f;
          p.vy += (dyp / dp) * f;
        }
      }

      /* hard speed cap keeps release elegant, not explosive */
      var sp = p.vx * p.vx + p.vy * p.vy;
      if (sp > 6.25) { sp = 2.5 / Math.sqrt(sp); p.vx *= sp; p.vy *= sp; }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  /* ---------------------------------------------------------------- render */

  function render() {
    ctx.clearRect(0, 0, W, H);
    var boost = 1 + holdGlow * 0.22;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var alpha = p.a * (0.72 + 0.28 * Math.sin(p.ph + t * p.sh)) * boost;
      if (alpha <= 0.02) continue;
      var rad = p.s * cfg.size * pxK * 2.6; /* sprite half-extent in px */
      ctx.globalAlpha = alpha > 1 ? 1 : alpha;
      ctx.drawImage(sprite, cx + p.x * R - rad, cy + p.y * R - rad, rad * 2, rad * 2);
    }
    ctx.globalAlpha = 1;
  }

  function renderStatic() {
    /* One resolved, breathing-less frame: the emblem as a still. */
    layout();
    var form = resolvedForm();
    ctx.clearRect(0, 0, W, H);
    var n = Math.round(clamp(Math.floor((W * H) / 165), 700, 2400) * cfg.density);
    for (var i = 0; i < n; i++) {
      var tp = form === 'lion' ? sampleLion() : sampleAbstract();
      var s = 0.75 + Math.pow(Math.random(), 1.6) * 1.9;
      var a = 0.34 + Math.random() * 0.6;
      var rad = s * cfg.size * pxK * 2.6;
      ctx.globalAlpha = a;
      ctx.drawImage(sprite, cx + tp.x * R - rad, cy + tp.y * R - rad, rad * 2, rad * 2);
    }
    ctx.globalAlpha = 1;
    wrap.classList.add('is-live');
  }

  /* ------------------------------------------------------------------ loop */

  var running = false, rafId = 0, last = 0, isStatic = false, frozen = false;
  var ema = 16, slowFrames = 0, thin = 1;

  function frame(now) {
    rafId = 0;
    if (!running) return;
    var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;

    /* watchdog: thin the field on slow devices, then freeze to a still */
    var ms = dt * 1000;
    ema += (ms - ema) * 0.06;
    if (ema > 27) { slowFrames++; } else if (slowFrames > 0) { slowFrames--; }
    if (slowFrames > 80) {
      slowFrames = 0;
      if (thin > 0.45) { thin *= 0.6; spawn(); retarget(); ema = 16; }
      else { freeze(); return; }
    }

    step(dt);
    render();
    if (!wrap.classList.contains('is-live')) wrap.classList.add('is-live');
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || isStatic || frozen) return;
    running = true;
    last = performance.now();
    ema = 16;
    if (!rafId) rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }
  function freeze() {
    stop();
    frozen = true;
    renderStatic();
  }

  var inView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (isStatic || frozen) return;
      if (inView && !document.hidden) start(); else stop();
    }, { threshold: 0.02 }).observe(wrap);
  }
  document.addEventListener('visibilitychange', function () {
    if (isStatic || frozen) return;
    if (!document.hidden && inView) start(); else stop();
  });

  /* --------------------------------------------------- live tweaks + modes */

  new MutationObserver(function () {
    var prev = readConfig();
    if (cfg.gold !== prev.gold) buildSprite();
    if (cfg.scale !== prev.scale) layout();
    if (Math.abs(cfg.density - prev.density) > 0.001) { spawn(); if (phase !== 'drift') retarget(); }
    if (cfg.form !== prev.form && !isStatic && !frozen) {
      if (phase === 'drift') toGather(); else retarget();
    }
    if (isStatic || frozen) renderStatic();
  }).observe(doc, { attributes: true, attributeFilter: ['style'] });

  function applyMode() {
    if (reduced.matches) {
      stop();
      isStatic = true;
      renderStatic();
    } else {
      isStatic = false;
      frozen = false;
      thin = 1;
      spawn();
      phase = 'drift'; tP = DRIFT_DUR - 1.6; t = 0; /* first resolve arrives early */
      if (inView && !document.hidden) start();
    }
  }
  if (reduced.addEventListener) reduced.addEventListener('change', applyMode);

  /* ------------------------------------------------------------------ boot */

  readConfig();
  buildSprite();
  buildAbstract();
  loadLion();
  resize();
  spawn();
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { resize(); }).observe(wrap);
  } else {
    window.addEventListener('resize', resize);
  }
  applyMode();
})();
