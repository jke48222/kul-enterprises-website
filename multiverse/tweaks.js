/*
 * KUL Multiverse — shared tweaks panel.
 * Contract for variant pages:
 *   1. Define your design decisions as CSS custom properties on :root.
 *   2. Declare  window.KUL_TWEAKS = { style: 's01a', controls: [...] }  BEFORE this script runs.
 *      control: { var: '--gold', label: 'Gold', type: 'color'|'range'|'select',
 *                 value: '#D4AF37', min, max, step, unit, options: [] }
 *   3. Include  <script src="/tweaks.js" defer></script>
 * Press "t" (or the ⚙ button) to toggle. "Copy snapshot" exports a JSON decision snapshot.
 */
(function () {
  const cfg = window.KUL_TWEAKS;
  if (!cfg || !Array.isArray(cfg.controls) || !cfg.controls.length) return;

  const root = document.documentElement;
  const initial = {};
  cfg.controls.forEach((c) => {
    const cur = getComputedStyle(root).getPropertyValue(c.var).trim();
    initial[c.var] = cur || String(c.value ?? '');
    if (c.value != null && !cur) root.style.setProperty(c.var, String(c.value) + (c.unit || ''));
  });

  const el = document.createElement('div');
  el.id = 'kul-tweaks';
  el.innerHTML = `
    <button id="kt-fab" title="Tweaks (t)">⚙</button>
    <div id="kt-panel" hidden>
      <div id="kt-head">
        <span>${cfg.style || 'variant'} · tweaks</span>
        <span id="kt-x" role="button">✕</span>
      </div>
      <div id="kt-body"></div>
      <div id="kt-foot">
        <button id="kt-copy">Copy snapshot</button>
        <button id="kt-reset">Reset</button>
      </div>
    </div>`;
  const css = document.createElement('style');
  css.textContent = `
    #kul-tweaks{position:fixed;right:16px;bottom:16px;z-index:2147483000;font:12px/1.45 -apple-system,Inter,system-ui,sans-serif;color:#eee}
    #kt-fab{width:40px;height:40px;border-radius:50%;border:1px solid #d4af3766;background:#0b0b0bd9;color:#d4af37;font-size:17px;cursor:pointer;backdrop-filter:blur(8px)}
    #kt-panel{position:absolute;right:0;bottom:52px;width:260px;max-height:70vh;overflow:auto;background:#0f0f0fe6;border:1px solid #2e2e2e;border-radius:10px;backdrop-filter:blur(14px);box-shadow:0 12px 40px #000a}
    #kt-head{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #2e2e2e;color:#d4af37;letter-spacing:.04em;text-transform:uppercase;font-size:10px}
    #kt-x{cursor:pointer;color:#888}
    #kt-body{padding:10px 12px;display:grid;gap:10px}
    .kt-row{display:grid;gap:4px}
    .kt-row label{color:#aaa;font-size:10px;text-transform:uppercase;letter-spacing:.06em}
    .kt-row .kt-val{color:#666;font-size:10px;float:right}
    .kt-row input[type=range]{width:100%;accent-color:#d4af37}
    .kt-row input[type=color]{width:100%;height:26px;border:1px solid #2e2e2e;background:none;border-radius:6px;padding:0}
    .kt-row select{width:100%;background:#161616;color:#eee;border:1px solid #2e2e2e;border-radius:6px;padding:5px 6px;font-size:12px}
    #kt-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #2e2e2e}
    #kt-foot button{flex:1;background:#161616;color:#d4af37;border:1px solid #d4af3755;border-radius:7px;padding:7px 0;cursor:pointer;font-size:11px}
    #kt-foot button:hover{background:#d4af37;color:#0b0b0b}
  `;
  document.head.appendChild(css);
  document.body.appendChild(el);

  const panel = el.querySelector('#kt-panel');
  const body = el.querySelector('#kt-body');
  const overrides = {};

  cfg.controls.forEach((c) => {
    const row = document.createElement('div');
    row.className = 'kt-row';
    const id = 'kt_' + c.var.replace(/[^a-z0-9]/gi, '');
    const label = `<label for="${id}">${c.label || c.var}<span class="kt-val" id="${id}_v"></span></label>`;
    let input;
    if (c.type === 'color') {
      input = `<input type="color" id="${id}" value="${(c.value || initial[c.var] || '#d4af37').trim()}">`;
    } else if (c.type === 'select') {
      input = `<select id="${id}">${(c.options || [])
        .map((o) => `<option value="${o}" ${String(o) === String(c.value) ? 'selected' : ''}>${o}</option>`)
        .join('')}</select>`;
    } else {
      input = `<input type="range" id="${id}" min="${c.min ?? 0}" max="${c.max ?? 100}" step="${c.step ?? 1}" value="${parseFloat(c.value) || 0}">`;
    }
    row.innerHTML = label + input;
    body.appendChild(row);
    const inp = row.querySelector('#' + id);
    const val = row.querySelector('#' + id + '_v');
    const apply = () => {
      const v = c.type === 'range' ? inp.value + (c.unit || '') : inp.value;
      root.style.setProperty(c.var, v);
      overrides[c.var] = v;
      if (val) val.textContent = v;
    };
    inp.addEventListener('input', apply);
    if (val) val.textContent = (c.type === 'range' ? (parseFloat(c.value) || 0) + (c.unit || '') : String(c.value ?? ''));
  });

  const toggle = () => { panel.hidden = !panel.hidden; };
  el.querySelector('#kt-fab').addEventListener('click', toggle);
  el.querySelector('#kt-x').addEventListener('click', toggle);
  window.addEventListener('keydown', (e) => {
    if (e.key === 't' && !/input|textarea|select/i.test(document.activeElement.tagName)) toggle();
  });

  el.querySelector('#kt-reset').addEventListener('click', () => {
    Object.keys(overrides).forEach((k) => root.style.removeProperty(k));
    location.reload();
  });

  // Copy must survive strict surfaces (gallery iframes, embedded panes):
  // async clipboard -> execCommand fallback -> parent-page relay -> manual textarea.
  function copyViaExec(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (_) { return false; }
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) {}
    return copyViaExec(text);
  }
  function showManual(text) {
    let m = panel.querySelector('#kt-manual');
    if (!m) {
      m = document.createElement('textarea');
      m.id = 'kt-manual';
      m.readOnly = true;
      m.style.cssText = 'width:calc(100% - 24px);height:110px;margin:0 12px 12px;background:#161616;color:#d4af37;border:1px solid #2e2e2e;border-radius:7px;font:10px/1.45 ui-monospace,Menlo,monospace;padding:6px;resize:vertical';
      panel.appendChild(m);
    }
    m.hidden = false;
    m.value = text;
    m.focus();
    m.select();
  }

  el.querySelector('#kt-copy').addEventListener('click', async () => {
    const snapshot = { style: cfg.style, takenAt: new Date().toISOString(), overrides };
    const text = JSON.stringify(snapshot, null, 2);
    const b = el.querySelector('#kt-copy');
    console.log('KUL tweaks snapshot:\n' + text);

    if (await copyText(text)) {
      b.textContent = 'Copied ✓';
    } else if (window.parent !== window) {
      // Framed (the gallery grid): hand the copy to the top-level page.
      window.parent.postMessage({ type: 'kul-tweaks-copy', style: cfg.style, text: text }, location.origin);
      b.textContent = 'Sent to page ↑';
    } else {
      showManual(text);
      b.textContent = 'Select + copy ↓';
    }
    setTimeout(() => (b.textContent = 'Copy snapshot'), 1800);
  });
})();
