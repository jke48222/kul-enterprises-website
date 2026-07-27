/* KUL s10 — chapter chrome behaviour (shared). */
(function(){
  'use strict';
  var root = document.documentElement;
  var rm = matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.toggle('rm', rm.matches);
  if(rm.addEventListener) rm.addEventListener('change', function(){ root.classList.toggle('rm', rm.matches); });

  /* ---- global nav hairline on scroll ---- */
  var gnav = document.getElementById('gnav');
  if(gnav){
    var onScroll = function(){ gnav.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll(); addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var sheet  = document.getElementById('msheet');
  if(burger && sheet){
    var setSheet = function(open){
      sheet.classList.toggle('open', open);
      sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function(){ setSheet(true); });
    var x = document.getElementById('msheetX');
    if(x) x.addEventListener('click', function(){ setSheet(false); });
    sheet.querySelectorAll('[data-close]').forEach(function(a){ a.addEventListener('click', function(){ setSheet(false); }); });
  }

  /* ---- smooth same-page anchor scroll accounting for sticky navs ---- */
  function offset(){
    return (parseInt(getComputedStyle(root).getPropertyValue('--nav-h'))||52) +
           (parseInt(getComputedStyle(root).getPropertyValue('--sub-h'))||54) + 8;
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length < 2) return;
      var t = document.querySelector(id);
      if(!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top:y, behavior: rm.matches ? 'auto' : 'smooth' });
    });
  });

  /* ---- keep the current chapter pill in view on the rail (rail-only scroll) ---- */
  var crail = document.querySelector('.cnav__links');
  var cur = crail && crail.querySelector('[aria-current]');
  if(crail && cur){
    var rl = crail.getBoundingClientRect(), cl = cur.getBoundingClientRect();
    if(cl.left < rl.left || cl.right > rl.right){
      crail.scrollLeft += (cl.left - rl.left) - (rl.width - cl.width) / 2;
    }
  }

  /* ---- reveal on scroll (failsafe never leaves content hidden) ---- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  function showEl(el){ el.classList.add('in'); }
  if(rm.matches || !('IntersectionObserver' in window)){
    reveals.forEach(showEl);
  } else {
    var revObs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ showEl(en.target); revObs.unobserve(en.target); }
      });
    }, { rootMargin:'0px 0px -8% 0px', threshold:0.06 });
    reveals.forEach(function(el){
      var top = el.getBoundingClientRect().top;
      if(top < (window.innerHeight || 800) * 0.95){ showEl(el); }
      else { revObs.observe(el); }
    });
    setTimeout(function(){ reveals.forEach(function(el){ if(!el.classList.contains('in')) showEl(el); }); }, 1500);
  }

  /* ---- generic accordion (optional per page) ---- */
  document.querySelectorAll('[data-acc] .acc__q').forEach(function(btn){
    var panel = btn.nextElementSibling;
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      if(open){
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(function(){ panel.style.height='0px'; });
        btn.setAttribute('aria-expanded','false');
      } else {
        btn.setAttribute('aria-expanded','true');
        panel.style.height = panel.scrollHeight + 'px';
        panel.addEventListener('transitionend', function te(){ panel.style.height='auto'; panel.removeEventListener('transitionend', te); });
      }
    });
  });
})();
