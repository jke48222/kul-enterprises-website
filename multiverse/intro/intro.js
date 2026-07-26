/* =========================================================================
   KUL Enterprises — Opening Animation  ·  intro.js
   -------------------------------------------------------------------------
   The story (≈5.5s), exactly as Mark asked:
     1. Black stillness.
     2. The Jamaican Doctor Bird resolves out of the dark and approaches —
        small to large, confident, not frantic — flapping (3 poses) with a
        warm gold particle trail off the streamers.
     3. As it passes center, the bird DISSOLVES into gold particles.
     4. Those same particles migrate and RE-FORM into the lion mark. Targets
        come from sampling the alpha of lion-clean.png on an offscreen canvas.
     5. The lion resolves crisp (canvas crossfades into a real <img>) with the
        "KUL — ENTERPRISES LLC" wordmark.
     6. The tagline settles beneath.
     7. Gentle fade to an "Enter the site" rest state.

   Vanilla JS + Canvas 2D only. No libraries, no CDN. 60fps target: capped
   particle count, DPR-aware, additive sprite blitting, pauses when hidden.
   The bird appears ONLY here and never returns. The lion is permanent.

   Public API (window.KULIntro):
     mount(opts)     -> build DOM into opts.container (default document.body)
     play(opts)      -> run once; respects sessionStorage unless opts.force
     replay()        -> ignore sessionStorage and run again (for Jalen)
     skip()          -> jump to rest state immediately
     config          -> live-tunable settings object (see DEFAULTS)
   ========================================================================= */
(function () {
  'use strict';

  var ASSET_BASE = '/assets';
  var SESSION_KEY = 'kul_intro_seen';

  // --- Live-tunable config. tweaks.js mutates this same object. -------------
  var DEFAULTS = {
    particleCount: 2600,        // desktop budget
    particleCountMobile: 1400,  // small-screen budget
    goldHue: 46,                // base gold #D4AF37 ≈ hsl(46, 65%, 52%)
    goldSat: 66,
    goldLight: 53,
    birdSpeed: 1.0,             // >1 = faster approach, <1 = slower
    overallScale: 1.0,          // scales bird + lion + lockup together
    // phase durations (ms)
    stillnessMs: 400,
    approachMs: 1750,
    dissolveMs: 460,
    lionFormMs: 1300,
    resolveMs: 760,
    taglineMs: 680
  };

  var config = {};
  for (var k in DEFAULTS) config[k] = DEFAULTS[k];

  // ---- small math / easing toolkit ---------------------------------------
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInCubic(t) { return t * t * t; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function smooth01(a, b, x) { return clamp((x - a) / (b - a), 0, 1); }

  function isMobile() {
    return Math.min(window.innerWidth, window.innerHeight) < 620 ||
      window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 820;
  }
  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ---- image loading ------------------------------------------------------
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('Failed to load ' + src)); };
      img.src = src;
    });
  }

  /* Sample an image's alpha on a low-res offscreen canvas and return a shuffled
     list of {nx, ny} normalized to [-0.5, 0.5] against the FULL image box, so a
     later drawImage at the same box size lines the particles up with the pixels. */
  function samplePoints(img, maxDim, alphaThreshold, step) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var scale = Math.min(maxDim / w, maxDim / h, 1);
    var sw = Math.max(2, Math.round(w * scale));
    var sh = Math.max(2, Math.round(h * scale));
    var c = document.createElement('canvas');
    c.width = sw; c.height = sh;
    var g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, sw, sh);
    var data;
    try { data = g.getImageData(0, 0, sw, sh).data; }
    catch (e) { return []; } // tainted canvas guard (shouldn't happen same-origin)
    var pts = [];
    step = step || 1;
    for (var y = 0; y < sh; y += step) {
      for (var x = 0; x < sw; x += step) {
        var a = data[(y * sw + x) * 4 + 3];
        if (a > alphaThreshold) {
          pts.push({ nx: x / sw - 0.5, ny: y / sh - 0.5 });
        }
      }
    }
    // Fisher–Yates so any subset is a fair spatial sample.
    for (var i = pts.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = pts[i]; pts[i] = pts[j]; pts[j] = t;
    }
    return pts;
  }

  // ---- gold sprite (pre-rendered soft additive dot) -----------------------
  function buildGoldSprite(hue, sat, light) {
    var R = 32;
    var c = document.createElement('canvas');
    c.width = c.height = R * 2;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(R, R, 0, R, R, R);
    var core = 'hsla(' + hue + ',' + sat + '%,' + Math.min(96, light + 34) + '%,';
    var mid = 'hsla(' + hue + ',' + sat + '%,' + light + '%,';
    grd.addColorStop(0.0, core + '1)');
    grd.addColorStop(0.35, mid + '0.85)');
    grd.addColorStop(1.0, mid + '0)');
    g.fillStyle = grd;
    g.beginPath();
    g.arc(R, R, R, 0, Math.PI * 2);
    g.fill();
    return c;
  }

  // =========================================================================
  //  The intro controller
  // =========================================================================
  var Intro = {
    mounted: false,
    running: false,
    assets: null,
    els: {},
    ctx: null,
    dpr: 1,
    stageW: 0,
    stageH: 0,
    raf: 0,
    onEnterCb: null,
    _reduced: false,

    mount: function (opts) {
      if (this.mounted) return this;
      opts = opts || {};
      var container = opts.container || document.body;
      this.onEnterCb = opts.onEnter || null;

      var root = document.createElement('div');
      root.className = 'kul-intro';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-label', 'KUL Enterprises intro');
      root.hidden = true;
      root.innerHTML =
        '<div class="kul-intro__field"></div>' +
        '<canvas class="kul-intro__canvas" aria-hidden="true"></canvas>' +
        '<img class="kul-intro__lion" alt="KUL Enterprises lion mark" ' +
          'src="' + ASSET_BASE + '/brand/lion-clean.png">' +
        '<div class="kul-intro__lockup">' +
          '<div class="kul-intro__wordmark">' +
            '<span class="kul-intro__brand">KUL</span>' +
            '<span class="kul-intro__entity">Enterprises LLC</span>' +
          '</div>' +
          '<div class="kul-intro__tagline">Strength in Motion. Built on Integrity. Driven by Safety.</div>' +
          '<div class="kul-intro__rule"></div>' +
        '</div>' +
        '<button type="button" class="kul-intro__enter">Enter the site</button>' +
        '<button type="button" class="kul-intro__skip" aria-label="Skip intro">Skip</button>';
      container.appendChild(root);

      this.els.root = root;
      this.els.canvas = root.querySelector('.kul-intro__canvas');
      this.els.lion = root.querySelector('.kul-intro__lion');
      this.els.lockup = root.querySelector('.kul-intro__lockup');
      this.els.wordmark = root.querySelector('.kul-intro__wordmark');
      this.els.tagline = root.querySelector('.kul-intro__tagline');
      this.els.rule = root.querySelector('.kul-intro__rule');
      this.els.enter = root.querySelector('.kul-intro__enter');
      this.els.skip = root.querySelector('.kul-intro__skip');
      this.ctx = this.els.canvas.getContext('2d');

      var self = this;
      this.els.skip.addEventListener('click', function () { self.skip(); });
      this.els.enter.addEventListener('click', function () { self._exit(); });
      window.addEventListener('keydown', function (e) {
        if (!self.running) return;
        if (e.key === 'Escape') self.skip();
      });
      this._onResize = function () { self._resize(); };
      window.addEventListener('resize', this._onResize);
      this._onVis = function () {
        if (document.hidden) self._pause();
        else self._resume();
      };
      document.addEventListener('visibilitychange', this._onVis);

      this.mounted = true;
      return this;
    },

    play: function (opts) {
      opts = opts || {};
      if (!this.mounted) this.mount(opts);
      if (opts.onEnter) this.onEnterCb = opts.onEnter;

      if (!opts.force) {
        var seen = false;
        try { seen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}
        if (seen) { this._skipSilently(); return this; }
      }
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}

      this._reduced = prefersReduced();
      this.els.root.hidden = false;

      if (this._reduced) { this._staticFrame(); return this; }

      var self = this;
      this._ensureAssets().then(function () {
        self._start();
      }).catch(function (err) {
        // If assets can't load, don't trap the visitor — show the static frame.
        console.warn('[KULIntro] asset load failed, showing static frame:', err);
        self._staticFrame();
      });
      return this;
    },

    replay: function () {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
      this._teardownRun();
      if (this.els.root) {
        this.els.root.classList.remove('kul-intro--leaving', 'kul-intro--static');
        this.els.root.hidden = true;
      }
      return this.play({ force: true });
    },

    skip: function () {
      if (this._reduced) { this._exit(); return; }
      // Fast-forward to the rest state rather than a hard cut.
      this._teardownRun();
      this._restState(true);
    },

    // ---- assets ----------------------------------------------------------
    _ensureAssets: function () {
      if (this.assets) return Promise.resolve(this.assets);
      var self = this;
      return Promise.all([
        loadImage(ASSET_BASE + '/bird/bird-rest.png'),
        loadImage(ASSET_BASE + '/bird/bird-up.png'),
        loadImage(ASSET_BASE + '/bird/bird-down.png'),
        loadImage(ASSET_BASE + '/brand/lion-clean.png')
      ]).then(function (imgs) {
        self.assets = {
          birdRest: imgs[0], birdUp: imgs[1], birdDown: imgs[2], lion: imgs[3]
        };
        // Sample once; reused across replays.
        self.assets.birdPts = samplePoints(imgs[0], 96, 40, 1);
        self.assets.lionPts = samplePoints(imgs[3], 210, 60, 1);
        return self.assets;
      });
    },

    // ---- sizing ----------------------------------------------------------
    _resize: function () {
      var dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 2 : 2.5);
      this.dpr = dpr;
      var w = window.innerWidth, h = window.innerHeight;
      this.stageW = w; this.stageH = h;
      var cv = this.els.canvas;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this._layoutMarks();
    },

    /* Position the crisp lion + lockup to match where the particle lion lands. */
    _layoutMarks: function () {
      var w = this.stageW, h = this.stageH;
      var scale = config.overallScale;
      // lion box: a square that the particle targets are mapped into.
      var lionSize = Math.min(w, h) * (isMobile() ? 0.34 : 0.26) * scale;
      this._lionSize = lionSize;
      this._lionCx = w / 2;
      // Sit the lion a touch above true center so lockup has room beneath it.
      this._lionCy = h * (isMobile() ? 0.40 : 0.42);

      var lion = this.els.lion;
      lion.style.width = lionSize + 'px';
      lion.style.height = 'auto';
      lion.style.left = this._lionCx + 'px';
      lion.style.top = this._lionCy + 'px';

      // Lockup sits under the lion.
      this.els.lockup.style.top = (this._lionCy + lionSize * 0.56) + 'px';
    },

    // ---- run lifecycle ---------------------------------------------------
    _start: function () {
      this.running = true;
      this._resize();
      this._resetVisuals();
      this._buildParticles();
      this.sprite = buildGoldSprite(config.goldHue, config.goldSat, config.goldLight);
      this._spriteHue = config.goldHue;

      this.elapsed = 0;
      this.lastTs = 0;
      this.phaseSnapped = { dissolve: false, form: false };
      this.trail = [];
      this.trailPool = 0;
      this._flapClock = 0;

      var self = this;
      this.raf = requestAnimationFrame(function (ts) { self._loop(ts); });
    },

    _resetVisuals: function () {
      this.els.lion.style.opacity = '0';
      this.els.lion.style.transform = 'translate(-50%, -50%) scale(0.985)';
      this.els.wordmark.style.opacity = '0';
      this.els.wordmark.style.transform = 'translateY(14px)';
      this.els.tagline.style.opacity = '0';
      this.els.tagline.style.transform = 'translateY(10px)';
      this.els.rule.style.width = '0';
      this.els.enter.style.opacity = '0';
      this.els.enter.style.transform = 'translate(-50%, 8px)';
      this.els.enter.style.pointerEvents = 'none';
      this._marksRevealed = { wordmark: false, tagline: false, rule: false, enter: false };
    },

    /* Timeline marks (ms), rebuilt on demand so live tweaks to durations apply
       on the next replay. */
    _marks: function () {
      var approach = config.approachMs / clamp(config.birdSpeed, 0.3, 3);
      var m = {};
      m.stillEnd = config.stillnessMs;
      m.approachEnd = m.stillEnd + approach;
      m.dissolveEnd = m.approachEnd + config.dissolveMs;
      m.formEnd = m.dissolveEnd + config.lionFormMs;
      m.resolveEnd = m.formEnd + config.resolveMs;
      m.taglineEnd = m.resolveEnd + config.taglineMs;
      m.total = m.taglineEnd + 500;
      return m;
    },

    _buildParticles: function () {
      var budget = isMobile() ? config.particleCountMobile : config.particleCount;
      budget = clamp(Math.round(budget), 400, 4000);
      var birdPts = this.assets.birdPts;
      var lionPts = this.assets.lionPts;
      var n = budget;
      var arr = new Array(n);
      for (var i = 0; i < n; i++) {
        var b = birdPts.length ? birdPts[i % birdPts.length] : { nx: 0, ny: 0 };
        var l = lionPts.length ? lionPts[i % lionPts.length] : { nx: 0, ny: 0 };
        arr[i] = {
          bnx: b.nx, bny: b.ny,      // bird-space normalized origin
          lnx: l.nx, lny: l.ny,      // lion-space normalized target
          x: 0, y: 0,                // current screen pos
          dx: 0, dy: 0,              // dissolve drift velocity
          sx: 0, sy: 0,              // snapshot pos at form start
          size: 0.7 + Math.random() * 1.9,
          delay: Math.random() * 0.34,     // stagger fraction of the form phase
          curl: (Math.random() - 0.5),     // signed curl amount
          twk: Math.random() * Math.PI * 2, // twinkle phase
          alpha: 0
        };
      }
      this.particles = arr;
      this._nActive = n;
    },

    _loop: function (ts) {
      if (!this.running) return;
      var self = this;
      if (!this.lastTs) this.lastTs = ts;
      var dt = ts - this.lastTs;
      this.lastTs = ts;
      // clamp dt so a stall (tab switch, GC) can't teleport the timeline.
      if (dt > 60) dt = 16.7;
      this.elapsed += dt;

      // Live sprite re-tint if hue tweaked mid-run.
      if (config.goldHue !== this._spriteHue) {
        this.sprite = buildGoldSprite(config.goldHue, config.goldSat, config.goldLight);
        this._spriteHue = config.goldHue;
      }

      this._render(this.elapsed, dt);

      var m = this._marks();
      if (this.elapsed >= m.total) {
        this._restState(false);
        return;
      }
      this.raf = requestAnimationFrame(function (t) { self._loop(t); });
    },

    // ---- the frame -------------------------------------------------------
    _render: function (t, dt) {
      var ctx = this.ctx, w = this.stageW, h = this.stageH;
      var m = this._marks();
      ctx.clearRect(0, 0, w, h);

      var cx = this._lionCx, cy = this._lionCy;

      // Bird flight geometry (approach phase).
      var inApproach = t < m.approachEnd;
      var birdP = smooth01(m.stillEnd, m.approachEnd, t);          // 0..1 approach
      var birdEase = easeInOutSine(birdP);
      // Enters from upper-left distance, arcs to center, growing.
      var startX = w * 0.30, startY = h * 0.24;
      var bx = lerp(startX, cx, easeOutCubic(birdP));
      var by = lerp(startY, cy, birdEase) + Math.sin(birdP * Math.PI * 2.2) * h * 0.018 * (1 - birdP);
      var minS = Math.min(w, h);
      var birdSize = lerp(minS * 0.05, minS * (isMobile() ? 0.5 : 0.42) * config.overallScale, easeOutCubic(birdP));

      // Dissolve progress.
      var dissP = smooth01(m.approachEnd, m.dissolveEnd, t);
      // Form progress.
      var formP = smooth01(m.dissolveEnd, m.formEnd, t);

      // --- gold trail (approach only), additive ---------------------------
      this._updateTrail(dt, inApproach ? birdP : -1, bx, by, birdSize, birdEase);
      ctx.globalCompositeOperation = 'lighter';
      this._drawTrail(ctx);

      // --- bird image (approach + fading during dissolve) -----------------
      if (t < m.dissolveEnd) {
        var birdAlpha = 1;
        if (t > m.approachEnd) birdAlpha = 1 - easeInCubic(dissP); // crumble away
        // fade in out of the dark at the very start of approach
        birdAlpha *= smooth01(m.stillEnd, m.stillEnd + 260, t);
        ctx.globalCompositeOperation = 'source-over';
        this._drawBird(ctx, bx, by, birdSize, birdAlpha, t);
      }

      // --- particles: dissolve cloud -> lion ------------------------------
      if (t >= m.approachEnd && formP < 1) {
        // Snapshot bird-space origins to screen at the instant dissolve begins.
        if (!this.phaseSnapped.dissolve) {
          this._snapDissolve(bx, by, birdSize);
          this.phaseSnapped.dissolve = true;
        }
        if (formP > 0 && !this.phaseSnapped.form) {
          this._snapFormStart();
          this.phaseSnapped.form = true;
        }
        this._drawParticles(ctx, t, dissP, formP, m);
      } else if (formP >= 1 && t < m.resolveEnd + 120) {
        // brief hold where particles have landed, fading as the crisp img rises
        this._drawParticles(ctx, t, 1, 1, m);
      }

      ctx.globalCompositeOperation = 'source-over';

      // --- crisp lion crossfade + lockup reveals --------------------------
      this._revealMarks(t, m);
    },

    _drawBird: function (ctx, x, y, size, alpha, t) {
      if (alpha <= 0.001) return;
      // Flap: rest -> down -> up cycle, quicker as it nears (but never frantic).
      var speed = 0.006 + smooth01(0, 1, size / (Math.min(this.stageW, this.stageH) * 0.4)) * 0.004;
      this._flapClock += 16.7 * speed;
      var frame = this._flapClock % 3 | 0;
      var img = frame === 1 ? this.assets.birdDown : frame === 2 ? this.assets.birdUp : this.assets.birdRest;
      var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
      var draw = size;
      var dh = draw * (ih / iw);
      ctx.save();
      ctx.globalAlpha = alpha;
      // faint warm glow behind the bird as it nears
      if (size > this.stageW * 0.08) {
        ctx.globalCompositeOperation = 'lighter';
        var gl = ctx.createRadialGradient(x, y, 0, x, y, draw * 0.62);
        gl.addColorStop(0, 'hsla(' + config.goldHue + ',70%,60%,' + (0.10 * alpha) + ')');
        gl.addColorStop(1, 'hsla(' + config.goldHue + ',70%,60%,0)');
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(x, y, draw * 0.62, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(img, x - draw / 2, y - dh / 2, draw, dh);
      ctx.restore();
    },

    _snapDissolve: function (bx, by, birdSize) {
      var iw = this.assets.birdRest.naturalWidth || this.assets.birdRest.width;
      var ih = this.assets.birdRest.naturalHeight || this.assets.birdRest.height;
      var boxH = birdSize * (ih / iw);
      var p = this.particles;
      for (var i = 0; i < p.length; i++) {
        var pt = p[i];
        pt.x = bx + pt.bnx * birdSize;
        pt.y = by + pt.bny * boxH;
        var ang = Math.random() * Math.PI * 2;
        var spd = (0.4 + Math.random() * 1.2) * (birdSize * 0.0016);
        pt.dx = Math.cos(ang) * spd;
        pt.dy = Math.sin(ang) * spd - birdSize * 0.0006; // slight upward puff
        pt.alpha = 0;
      }
    },

    _snapFormStart: function () {
      var p = this.particles;
      for (var i = 0; i < p.length; i++) { p[i].sx = p[i].x; p[i].sy = p[i].y; }
    },

    _drawParticles: function (ctx, t, dissP, formP, m) {
      var p = this.particles, sprite = this.sprite;
      var cx = this._lionCx, cy = this._lionCy, L = this._lionSize;
      var iw = this.assets.lion.naturalWidth || this.assets.lion.width;
      var ih = this.assets.lion.naturalHeight || this.assets.lion.height;
      var lionBoxH = L * (ih / iw);
      // fade the whole cloud out as the crisp lion takes over
      var cloudFade = 1 - smooth01(m.formEnd - 60, m.resolveEnd, t);

      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < p.length; i++) {
        var pt = p[i];
        var px, py, a;

        if (formP <= 0) {
          // pure dissolve drift
          var dsec = (t - m.approachEnd);
          pt.x += pt.dx * 16.7;
          pt.y += pt.dy * 16.7;
          px = pt.x; py = pt.y;
          a = easeOutCubic(clamp(dsec / 220, 0, 1)) * (0.5 + 0.5 * dissP);
        } else {
          // migrate: snapshot -> lion target, staggered + curl that decays to 0
          var tx = cx + pt.lnx * L;
          var ty = cy + pt.lny * lionBoxH;
          var span = 1 - 0.34;
          var lp = clamp((formP - pt.delay * 0.34) / span, 0, 1);
          var e = easeInOutCubic(lp);
          px = lerp(pt.sx, tx, e);
          py = lerp(pt.sy, ty, e);
          // curl: perpendicular arc, strongest mid-flight, zero at both ends
          var arc = Math.sin(lp * Math.PI) * (1 - lp) * pt.curl;
          var vx = tx - pt.sx, vy = ty - pt.sy;
          var len = Math.hypot(vx, vy) || 1;
          px += (-vy / len) * arc * L * 0.12;
          py += (vx / len) * arc * L * 0.12;
          a = 0.65 + 0.35 * Math.sin(t * 0.012 + pt.twk);
          a *= 0.6 + 0.4 * lp; // brighten as they lock in
        }
        a *= cloudFade;
        if (a <= 0.01) continue;
        var s = pt.size * (1 + 0.4 * Math.sin(t * 0.01 + pt.twk));
        var d = s * 3.2;
        ctx.globalAlpha = clamp(a, 0, 1);
        ctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
    },

    // ---- gold streamer trail --------------------------------------------
    _updateTrail: function (dt, birdP, bx, by, birdSize, birdEase) {
      var tr = this.trail;
      // advance existing
      for (var i = tr.length - 1; i >= 0; i--) {
        var q = tr[i];
        q.life -= dt;
        if (q.life <= 0) { tr.splice(i, 1); continue; }
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.vx *= 0.94; q.vy *= 0.94;
      }
      if (birdP < 0) return; // only emit during approach
      // emit off the streamer tail — behind the bird relative to travel
      var emit = Math.min(6, 2 + (birdSize * 0.02) | 0);
      var tailX = bx - birdSize * 0.02;
      var tailY = by + birdSize * 0.30; // streamers trail low
      for (var e = 0; e < emit; e++) {
        if (tr.length > 340) break;
        var jitter = (birdSize * 0.05);
        tr.push({
          x: tailX + (Math.random() - 0.5) * jitter,
          y: tailY + (Math.random() - 0.5) * jitter,
          vx: (Math.random() - 0.5) * 0.02 - 0.01,
          vy: (Math.random() - 0.2) * 0.02 + 0.006,
          life: 420 + Math.random() * 360,
          maxLife: 780,
          size: (0.8 + Math.random() * 1.6) * (0.5 + birdP * 0.7)
        });
      }
    },

    _drawTrail: function (ctx) {
      var tr = this.trail, sprite = this.sprite;
      for (var i = 0; i < tr.length; i++) {
        var q = tr[i];
        var lifeFrac = q.life / q.maxLife;
        var a = Math.min(1, lifeFrac) * 0.5;
        if (a <= 0.01) continue;
        var d = q.size * 5;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, q.x - d / 2, q.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
    },

    // ---- DOM mark reveals (timeline-driven) ------------------------------
    _revealMarks: function (t, m) {
      // Crisp lion rises as particles settle.
      var lionP = smooth01(m.formEnd - 120, m.resolveEnd, t);
      if (lionP > 0) {
        var e = easeOutExpo(lionP);
        this.els.lion.style.opacity = String(e);
        this.els.lion.style.transform =
          'translate(-50%, -50%) scale(' + (0.985 + 0.015 * e) + ')';
      }
      // Wordmark.
      var wp = smooth01(m.resolveEnd - 260, m.resolveEnd + 180, t);
      if (wp > 0) {
        this.els.wordmark.style.opacity = String(wp);
        this.els.wordmark.style.transform = 'translateY(' + (14 * (1 - easeOutCubic(wp))) + 'px)';
      }
      // Tagline.
      var tp = smooth01(m.resolveEnd + 120, m.taglineEnd, t);
      if (tp > 0) {
        this.els.tagline.style.opacity = String(tp);
        this.els.tagline.style.transform = 'translateY(' + (10 * (1 - easeOutCubic(tp))) + 'px)';
        this.els.rule.style.width = (Math.min(320, this.stageW * 0.6) * easeOutCubic(tp)) + 'px';
      }
    },

    // ---- rest / exit -----------------------------------------------------
    _restState: function (fast) {
      this._teardownRun();
      // Ensure the composed final frame is fully present.
      this.els.lion.style.opacity = '1';
      this.els.lion.style.transform = 'translate(-50%, -50%) scale(1)';
      this.els.wordmark.style.transition = fast ? 'opacity 320ms ease, transform 320ms ease' : 'opacity 500ms ease, transform 500ms ease';
      this.els.tagline.style.transition = this.els.wordmark.style.transition;
      this.els.wordmark.style.opacity = '1';
      this.els.wordmark.style.transform = 'translateY(0)';
      this.els.tagline.style.opacity = '1';
      this.els.tagline.style.transform = 'translateY(0)';
      this.els.rule.style.transition = 'width 500ms ease';
      this.els.rule.style.width = Math.min(320, this.stageW * 0.6) + 'px';
      if (this.ctx) this.ctx.clearRect(0, 0, this.stageW, this.stageH);

      var self = this;
      // Reveal the Enter control.
      requestAnimationFrame(function () {
        self.els.enter.style.transition = 'opacity 420ms ease, transform 420ms ease';
        self.els.enter.style.opacity = '1';
        self.els.enter.style.transform = 'translate(-50%, 0)';
        self.els.enter.style.pointerEvents = 'auto';
      });
    },

    _staticFrame: function () {
      // reduced-motion: compose everything at once, single soft fade via CSS.
      this._reduced = true;
      this.els.root.classList.add('kul-intro--static');
      this._resize();
      this.els.enter.style.pointerEvents = 'auto';
    },

    _pause: function () {
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
      this._paused = true;
    },
    _resume: function () {
      if (!this.running || !this._paused) return;
      this._paused = false;
      this.lastTs = 0; // avoid a big dt jump; dt clamp also guards this
      var self = this;
      this.raf = requestAnimationFrame(function (ts) { self._loop(ts); });
    },

    _teardownRun: function () {
      this.running = false;
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    },

    _skipSilently: function () {
      // Session already seen: don't show the stage at all, go straight to site.
      if (this.els.root) this.els.root.hidden = true;
      if (this.onEnterCb) this.onEnterCb();
    },

    _exit: function () {
      var self = this;
      this._teardownRun();
      this.els.root.classList.add('kul-intro--leaving');
      window.setTimeout(function () {
        self.els.root.hidden = true;
        self.els.root.classList.remove('kul-intro--leaving');
        if (self.onEnterCb) self.onEnterCb();
      }, 640);
    }
  };

  // Expose the config on the controller and globally for tweaks.js.
  Intro.config = config;
  window.KUL_INTRO_CONFIG = config;
  window.KULIntro = Intro;
})();
