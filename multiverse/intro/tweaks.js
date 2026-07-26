/* =========================================================================
   KUL Intro — live tuning panel (purpose-built for the opening animation).
   Unlike the site-wide /tweaks.js (which drives CSS custom properties), the
   intro's knobs are runtime JS values on window.KUL_INTRO_CONFIG, so this
   panel writes to that object directly. Press "t" or the ⚙ to toggle.

   Live now  : gold hue, overall scale.
   Next replay: particle count, bird speed, dissolve, lion-form durations
                (they seed the particle system / timeline at play() time).
   ========================================================================= */
(function () {
  'use strict';

  function build() {
    var cfg = window.KUL_INTRO_CONFIG;
    if (!cfg) { return setTimeout(build, 60); } // wait for intro.js

    var controls = [
      { key: 'particleCount', label: 'Particle count', min: 800, max: 3500, step: 50, live: false },
      { key: 'goldHue',       label: 'Gold hue',       min: 30,  max: 60,   step: 1,  unit: '°', live: true },
      { key: 'birdSpeed',     label: 'Bird approach speed', min: 0.5, max: 2, step: 0.05, live: false },
      { key: 'dissolveMs',    label: 'Dissolve duration', min: 150, max: 900, step: 10, unit: 'ms', live: false },
      { key: 'lionFormMs',    label: 'Lion-form duration', min: 600, max: 2200, step: 20, unit: 'ms', live: false },
      { key: 'overallScale',  label: 'Overall scale',  min: 0.6, max: 1.4, step: 0.02, unit: '×', live: true }
    ];

    var el = document.createElement('div');
    el.id = 'kul-intro-tweaks';
    el.innerHTML =
      '<button id="kit-fab" title="Tweaks (t)">⚙</button>' +
      '<div id="kit-panel" hidden>' +
        '<div id="kit-head"><span>intro · tweaks</span><span id="kit-x" role="button">✕</span></div>' +
        '<div id="kit-body"></div>' +
        '<div id="kit-note">Live: hue &amp; scale. Others apply on next <b>Replay</b>.</div>' +
        '<div id="kit-foot">' +
          '<button id="kit-replay">Replay</button>' +
          '<button id="kit-copy">Copy</button>' +
          '<button id="kit-reset">Reset</button>' +
        '</div>' +
      '</div>';

    var css = document.createElement('style');
    css.textContent =
      '#kul-intro-tweaks{position:fixed;left:16px;bottom:16px;z-index:2147483600;font:12px/1.45 -apple-system,Inter,system-ui,sans-serif;color:#eee}' +
      '#kit-fab{width:40px;height:40px;border-radius:50%;border:1px solid #d4af3766;background:#0b0b0be6;color:#d4af37;font-size:17px;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
      '#kit-panel{position:absolute;left:0;bottom:52px;width:264px;max-height:74vh;overflow:auto;background:#0f0f0fF2;border:1px solid #2e2e2e;border-radius:10px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 12px 40px #000a}' +
      '#kit-head{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #2e2e2e;color:#d4af37;letter-spacing:.06em;text-transform:uppercase;font-size:10px}' +
      '#kit-x{cursor:pointer;color:#888}' +
      '#kit-body{padding:10px 12px;display:grid;gap:11px}' +
      '.kit-row{display:grid;gap:4px}' +
      '.kit-row label{color:#aaa;font-size:10px;text-transform:uppercase;letter-spacing:.06em}' +
      '.kit-row .kit-val{color:#d4af37;font-size:10px;float:right;font-variant-numeric:tabular-nums}' +
      '.kit-row input[type=range]{width:100%;accent-color:#d4af37}' +
      '#kit-note{padding:0 12px 8px;color:#777;font-size:10px}' +
      '#kit-note b{color:#aaa}' +
      '#kit-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #2e2e2e}' +
      '#kit-foot button{flex:1;background:#161616;color:#d4af37;border:1px solid #d4af3755;border-radius:7px;padding:7px 0;cursor:pointer;font-size:11px}' +
      '#kit-foot button:hover{background:#d4af37;color:#0b0b0b}';

    document.head.appendChild(css);
    document.body.appendChild(el);

    var body = el.querySelector('#kit-body');
    var initial = {};
    controls.forEach(function (c) {
      initial[c.key] = cfg[c.key];
      var row = document.createElement('div');
      row.className = 'kit-row';
      var id = 'kit_' + c.key;
      row.innerHTML =
        '<label for="' + id + '">' + c.label +
          '<span class="kit-val" id="' + id + '_v"></span></label>' +
        '<input type="range" id="' + id + '" min="' + c.min + '" max="' + c.max +
          '" step="' + c.step + '" value="' + cfg[c.key] + '">';
      body.appendChild(row);
      var inp = row.querySelector('#' + id);
      var val = row.querySelector('#' + id + '_v');
      var fmt = function (v) { return (Math.round(v * 100) / 100) + (c.unit || ''); };
      val.textContent = fmt(cfg[c.key]);
      inp.addEventListener('input', function () {
        var v = parseFloat(inp.value);
        cfg[c.key] = v;
        val.textContent = fmt(v);
        // live knobs: relayout for scale so the crisp lion tracks immediately
        if (c.live && window.KULIntro && window.KULIntro.mounted) {
          if (c.key === 'overallScale' && window.KULIntro._layoutMarks) {
            window.KULIntro._layoutMarks();
          }
        }
      });
    });

    var panel = el.querySelector('#kit-panel');
    var toggle = function () { panel.hidden = !panel.hidden; };
    el.querySelector('#kit-fab').addEventListener('click', toggle);
    el.querySelector('#kit-x').addEventListener('click', toggle);
    window.addEventListener('keydown', function (e) {
      if (e.key === 't' && !/input|textarea|select/i.test((document.activeElement || {}).tagName || '')) toggle();
    });

    el.querySelector('#kit-replay').addEventListener('click', function () {
      if (window.KULIntro) window.KULIntro.replay();
    });
    el.querySelector('#kit-reset').addEventListener('click', function () {
      controls.forEach(function (c) {
        cfg[c.key] = initial[c.key];
        var inp = document.getElementById('kit_' + c.key);
        var val = document.getElementById('kit_' + c.key + '_v');
        if (inp) inp.value = initial[c.key];
        if (val) val.textContent = (Math.round(initial[c.key] * 100) / 100) + (c.unit || '');
      });
      if (window.KULIntro && window.KULIntro._layoutMarks) window.KULIntro._layoutMarks();
    });
    el.querySelector('#kit-copy').addEventListener('click', function () {
      var snap = {};
      controls.forEach(function (c) { snap[c.key] = cfg[c.key]; });
      var text = JSON.stringify(snap, null, 2);
      try { navigator.clipboard.writeText(text); } catch (e) {}
      var b = el.querySelector('#kit-copy');
      b.textContent = '✓'; setTimeout(function () { b.textContent = 'Copy'; }, 1200);
      console.log('KUL intro tweaks:\n' + text);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else { build(); }
})();
