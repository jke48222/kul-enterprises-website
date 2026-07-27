/* ============================================================
   KUL s10 · THE JOURNEY — film engine
   Scroll-LINKED only: scroll position deterministically selects
   the active beat of each scene; CSS transitions supply the
   fades. Native scroll is never hijacked. Reduced motion (or no
   JS) renders the full screenplay as a static document.
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var rm = matchMedia('(prefers-reduced-motion: reduce)');
  function setRM() { root.classList.toggle('rm', rm.matches); }
  setRM();
  if (rm.addEventListener) rm.addEventListener('change', setRM);

  /* ---------- nav: hairline + recede while the film plays ----------
     The bar stands down once the visitor is inside the film, but it is
     never removed from the page: CSS restores it on :hover along the top
     edge and on :focus-within, so Tab always reaches the way out. */
  var gnav = document.getElementById('gnav');
  var lastY = 0, downAccum = 0;
  function navScroll(y) {
    gnav.classList.toggle('scrolled', y > 12);
    if (rm.matches || sheetOpen) { root.classList.remove('hidebars'); lastY = y; downAccum = 0; return; }
    var dy = y - lastY;
    if (dy > 0) { downAccum += dy; if (downAccum > 90 && y > 400) root.classList.add('hidebars'); }
    else if (dy < -4 || y < 200) { downAccum = 0; root.classList.remove('hidebars'); }
    lastY = y;
  }

  /* ---------- chapter sheet (the disclosure behind "Chapters") ---------- */
  var chapBtn = document.getElementById('chapBtn');
  var sheet = document.getElementById('chapsheet');
  var panel = sheet.querySelector('.csheet__panel');
  var sheetOpen = false, lastFocus = null;

  function sheetStops() {
    return [].slice.call(panel.querySelectorAll('a[href],button')).filter(function (el) {
      return el.offsetWidth || el.offsetHeight || el.getClientRects().length;
    });
  }
  function setSheet(open) {
    if (open === sheetOpen) return;
    sheetOpen = open;
    if (open) { lastFocus = document.activeElement; root.classList.remove('hidebars'); downAccum = 0; }
    sheet.classList.toggle('is-open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    chapBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      /* the close control takes focus: the way out is the first thing a
         keyboard visitor lands on, and no first Enter navigates away */
      var x = document.getElementById('csheetX');
      var stops = sheetStops();
      (x || stops[0] || chapBtn).focus();
    } else if (lastFocus && document.contains(lastFocus)) {
      lastFocus.focus();
    } else {
      chapBtn.focus();
    }
  }
  chapBtn.addEventListener('click', function () { setSheet(!sheetOpen); });
  document.getElementById('csheetX').addEventListener('click', function () { setSheet(false); });
  document.getElementById('csheetScrim').addEventListener('click', function () { setSheet(false); });
  panel.querySelectorAll('a[href]').forEach(function (a) {
    a.addEventListener('click', function () { setSheet(false); });
  });
  /* Escape closes; Tab stays inside the open sheet */
  addEventListener('keydown', function (e) {
    if (!sheetOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); setSheet(false); return; }
    if (e.key !== 'Tab') return;
    var stops = sheetStops();
    if (!stops.length) return;
    var first = stops[0], last = stops[stops.length - 1];
    if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* ---------- sound stub (music by Akilah — pending) ---------- */
  /* No audio file exists yet, so the control tells the truth rather than
     pretending to play: it discloses the status of Akilah's score. */
  var sound = document.getElementById('sound');
  var note = document.getElementById('soundNote');
  if (sound && note) {
    sound.addEventListener('click', function () {
      var open = sound.getAttribute('aria-expanded') === 'true';
      sound.setAttribute('aria-expanded', open ? 'false' : 'true');
      note.classList.toggle('show', !open);
    });
  }

  /* ---------- reveal (normal-flow sections only) ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if (rm.matches) { reveals.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var rObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add('in');
      else rObs.observe(el);
    });
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  }

  /* ---------- document mode: the whole screenplay, typeset still ---------- */
  var docBtn = document.getElementById('docMode');
  if (docBtn) {
    docBtn.addEventListener('click', function () {
      var on = !root.classList.contains('doc');
      root.classList.toggle('doc', on);
      docBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      docBtn.querySelector('.lbl').textContent = on ? 'Watch the film' : 'Read it as a document';
      requestAnimationFrame(function () { dispatchEvent(new Event('resize')); });
    });
  }

  /* ---------- token sync (S1 finale plate|photo · pacing) ---------- */
  function syncTokens() {
    var t = getComputedStyle(root).getPropertyValue('--hero-treatment').trim().replace(/["']/g, '') || 'plate';
    root.setAttribute('data-hero', t === 'photo' ? 'photo' : 'plate');
    var k = pace();
    if (k !== lastPace) { lastPace = k; layout(); docH = root.scrollHeight; needFrame = true; }
  }
  var lastPace = null;

  /* ============================================================
     SCENES
     ============================================================ */
  var VH = function () { return innerHeight || 800; };
  var scenes = [].slice.call(document.querySelectorAll('.scene')).map(function (el, idx) {
    var beats = [].slice.call(el.querySelectorAll('.beat'));
    var weights = beats.map(function (b) { return parseFloat(b.getAttribute('data-w')) || 1; });
    var sum = weights.reduce(function (a, b) { return a + b; }, 0);
    // cumulative beat windows in [0,1] with a small settle tail
    var cum = [], acc = 0;
    weights.forEach(function (w) { acc += w; cum.push(acc / sum); });
    var track = el.querySelector('.scene__track');
    var bgs = [].slice.call(el.querySelectorAll('.bg__ph'));
    bgs.forEach(function (b) {
      b._beats = (b.getAttribute('data-beats') || '').split(/\s+/).filter(Boolean).map(Number);
    });
    // stagger indexes for lines; the step shrinks as the roll grows so the
    // whole cascade lands inside the beat's scroll window
    beats.forEach(function (b) {
      var ls = [].slice.call(b.querySelectorAll('.l'));
      ls.forEach(function (l, i) { l.style.setProperty('--i', i); });
      if (ls.length > 1) {
        b.style.setProperty('--st', Math.min(0.34, 1.5 / (ls.length - 1)).toFixed(3) + 's');
      }
    });
    return {
      el: el, track: track, beats: beats, cum: cum, sum: sum, bgs: bgs, idx: idx,
      active: -1, top: 0, len: 1,
      no: el.getAttribute('data-no') || '',
      stick: el.querySelector('.stick')
    };
  });

  var total = document.getElementById('sceneTotal');
  if (total) total.textContent = String(scenes.length).padStart(2, '0');

  function pace() {
    var p = parseFloat(getComputedStyle(root).getPropertyValue('--pace')) || 100;
    return Math.min(200, Math.max(50, p)) / 100;
  }

  function layout() {
    if (rm.matches) return;
    var y = scrollY, k = pace();
    scenes.forEach(function (s) {
      // track length: ~26vh of scroll per weight unit + a settle viewport, × pace
      s.track.style.setProperty('--len', Math.round((s.sum * 26 + 60) * k));
    });
    // force reflow read after lengths set
    scenes.forEach(function (s) {
      var r = s.track.getBoundingClientRect();
      s.top = r.top + y;
      s.len = Math.max(1, r.height - VH());
    });
  }

  function setBeat(s, i) {
    if (i === s.active) return;
    s.active = i;
    s.beats.forEach(function (b, j) { b.classList.toggle('on', j === i); });
    s.el.setAttribute('data-beat', i);
    var shot = false;
    s.bgs.forEach(function (b) {
      var on = b._beats.indexOf(i) !== -1;
      b.classList.toggle('show', on);
      if (on) shot = true;
    });
    if (s.bgs.length) s.el.classList.toggle('shot', shot);
    if (s.el.classList.contains('g-s11')) s.el.classList.toggle('wm', i >= 6);
    if (s.el.classList.contains('g-s12')) s.el.classList.toggle('sunrise', i >= 8);
    if (s.onBeat) s.onBeat(i);
  }

  var hudScene = document.getElementById('sceneNow');
  var railFill = document.getElementById('railFill');
  var docH = 1;

  function frame() {
    var y = scrollY;
    navScroll(y);
    if (railFill) {
      var f = Math.min(1, Math.max(0, y / Math.max(1, docH - VH())));
      railFill.style.transform = 'scaleY(' + f.toFixed(4) + ')';
    }
    if (rm.matches) return;
    var vh = VH();
    var current = null;
    scenes.forEach(function (s) {
      var rel = y - s.top;
      if (rel < -vh || rel > s.len + vh) { return; }               // far away
      var p = Math.min(1, Math.max(0, rel / s.len));
      s.el.style.setProperty('--p', p.toFixed(4));
      // active beat from cumulative windows (settle tail keeps last beat)
      var i = 0;
      while (i < s.cum.length - 1 && p > s.cum[i]) i++;
      if (rel >= -vh * 0.5 && rel <= s.len + vh * 0.5) setBeat(s, i);
      if (rel >= 0 && rel <= s.len) current = s;
      if (s.el.classList.contains('g-s13')) s.el.classList.toggle('lit', p > 0.62);
    });
    if (current && hudScene) {
      hudScene.textContent = current.no;
      document.body.classList.toggle('lit-hud', !!current.el._lightHud &&
        (!current.el.classList.contains('g-s13') || current.el.classList.contains('lit')));
    }
  }

  scenes.forEach(function (s) {
    if (s.el.classList.contains('scene--light') || s.el.classList.contains('g-s13')) s.el._lightHud = true;
  });

  /* ---------- S1: gold particles resolve into the LION ---------- */
  (function () {
    var scene = scenes[0];
    if (!scene) return;
    var canvas = scene.el.querySelector('canvas.film');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var pts = null, parts = null, dpr = 1, W = 0, H = 0;
    var img = new Image();
    img.src = '/studio/assets/brand/lion-clean.png';
    img.onload = function () {
      try {
        var sw = 160, sh = Math.round(sw * img.height / img.width);
        var oc = document.createElement('canvas');
        oc.width = sw; oc.height = sh;
        var octx = oc.getContext('2d');
        octx.drawImage(img, 0, 0, sw, sh);
        var d = octx.getImageData(0, 0, sw, sh).data;
        pts = [];
        for (var yy = 0; yy < sh; yy += 2) {
          for (var xx = 0; xx < sw; xx += 2) {
            var a = d[(yy * sw + xx) * 4 + 3];
            if (a > 120) pts.push([xx / sw - 0.5, yy / sh - 0.5]);
          }
        }
      } catch (e) { pts = null; }
      build();
    };
    img.onerror = function () { pts = null; build(); };

    function build() {
      var n = pts ? Math.min(pts.length, 1900) : 500;
      parts = [];
      // walk the sampled silhouette in order (not at random) so the resolved
      // mark reads evenly instead of clumping
      for (var i = 0; i < n; i++) {
        var t = pts ? pts[Math.floor(i * pts.length / n)] : null;
        var ang = Math.random() * Math.PI * 2;
        if (!t) { var rr = 0.5 + Math.random() * 0.12; t = [Math.cos(ang) * rr * 0.4, Math.sin(ang) * rr * 0.4]; }
        parts.push({
          tx: t[0], ty: t[1],
          sx: (Math.random() - 0.5) * 2.4, sy: (Math.random() - 0.5) * 1.6,
          ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 0.8,
          r: 0.7 + Math.random() * 1.4
        });
      }
    }
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      var w = canvas.clientWidth || canvas.parentElement.clientWidth || innerWidth;
      var h = canvas.clientHeight || canvas.parentElement.clientHeight || innerHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    size();
    addEventListener('resize', size);
    if (window.ResizeObserver) new ResizeObserver(size).observe(canvas);

    var CONV_BEAT = 4;              // particles converge across beat 4
    scene.onBeat = function (i) {
      canvas.classList.toggle('show', i >= 3 && i <= CONV_BEAT);
    };
    scene.draw = function (time) {
      if (rm.matches || !parts || !canvas.classList.contains('show')) return;
      size();
      var p = parseFloat(scene.el.style.getPropertyValue('--p')) || 0;
      // convergence: 0 at start of beat 4 window, 1 at its end
      var a0 = scene.cum[CONV_BEAT - 1] || 0, a1 = scene.cum[CONV_BEAT] || 1;
      var conv = Math.min(1, Math.max(0, (p - a0) / (a1 - a0)));
      conv = conv * conv * (3 - 2 * conv);                       // smoothstep
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var scale = Math.min(W, H) * 0.42;
      var cx = W / 2, cy = H * 0.46;
      var gold = getComputedStyle(root).getPropertyValue('--gold').trim() || '#D4AF37';
      ctx.fillStyle = gold;
      for (var i = 0; i < parts.length; i++) {
        var q = parts[i];
        var wob = (1 - conv) * 14;
        var x0 = cx + q.sx * W * 0.5 + Math.cos(time * 0.0006 * q.sp + q.ph) * wob;
        var y0 = cy + q.sy * H * 0.5 + Math.sin(time * 0.0007 * q.sp + q.ph) * wob;
        var x1 = cx + q.tx * scale;
        var y1 = cy + q.ty * scale;
        var x = x0 + (x1 - x0) * conv, y = y0 + (y1 - y0) * conv;
        ctx.globalAlpha = 0.25 + 0.75 * conv;
        ctx.beginPath();
        ctx.arc(x, y, q.r * (0.8 + conv * 0.4), 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
  })();

  /* ---------- main loop ---------- */
  var needFrame = true;
  addEventListener('scroll', function () { needFrame = true; }, { passive: true });
  addEventListener('resize', function () {
    layout(); docH = document.documentElement.scrollHeight; needFrame = true;
  });
  function loop(t) {
    if (needFrame || (scenes[0] && scenes[0].draw)) {
      if (needFrame) { frame(); needFrame = false; }
      if (scenes[0] && scenes[0].draw) scenes[0].draw(t);
    }
    requestAnimationFrame(loop);
  }

  layout();
  docH = document.documentElement.scrollHeight;
  syncTokens();
  new MutationObserver(syncTokens).observe(root, { attributes: true, attributeFilter: ['style'] });
  frame();
  requestAnimationFrame(loop);
  // fonts/images can shift track offsets — re-measure once settled
  setTimeout(function () { layout(); docH = document.documentElement.scrollHeight; needFrame = true; }, 600);
  addEventListener('load', function () { layout(); docH = document.documentElement.scrollHeight; needFrame = true; });
})();
