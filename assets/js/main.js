(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  // Hauteur d'écran mesurée une seule fois ; recalcul seulement si la largeur change (rotation)
  let lastW = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    root.style.setProperty('--vh', innerHeight / 100 + 'px');
  });

  // En-tête : fond plein dès qu'on quitte le haut du hero
  const header = $('#header');
  const sentinel = d.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px';
  $('.hero').appendChild(sentinel);
  new IntersectionObserver(([e]) => header.classList.toggle('is-solid', !e.isIntersecting)).observe(sentinel);

  // Menu mobile
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  d.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Vidéo du hero : chargée après la page, jamais si "réduire les animations" ou économie de données
  const video = $('#hero-video');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (video && !reduce && !saveData) {
    addEventListener('load', () => {
      video.src = matchMedia('(max-width: 767px)').matches ? video.dataset.srcM : video.dataset.src;
      video.addEventListener('playing', () => video.classList.add('is-on'), { once: true });
      video.play().catch(() => {});
    });
  }

  // Ouverture : on attend que la pièce brute soit prête, puis le coup de platoir la lisse
  const hero = $('.hero'), raw = $('.hero__raw img');
  if (root.classList.contains('wow') && raw) {
    let started = false;
    const go = ok => { if (started) return; started = true; if (!ok) hero.classList.add('no-raw'); hero.classList.add('is-go'); };
    const ready = () => raw.decode().then(() => go(true), () => go(false));
    if (raw.complete && raw.naturalWidth) ready();
    else { raw.addEventListener('load', ready, { once: true }); raw.addEventListener('error', () => go(false), { once: true }); }
    setTimeout(() => go(false), 2500); // connexion lente : on saute l'effet
    $('.hero__raw').addEventListener('animationend', () => hero.classList.add('is-done'));
  }

  // Photos qui se dévoilent au défilement (galerie, services, « pourquoi nous »)
  if (!reduce) {
    const wipes = [...$$('.grid figure'), ...$$('.srv__img'), $('.bento__a'), $('.bento__e')].filter(Boolean);
    $$('.grid figure').forEach((f, i) => { f.style.transitionDelay = (i % 3) * 90 + 'ms'; });
    // une image entièrement masquée n'est jamais « vue » (ni chargée) : on observe sa carte à la place
    const targets = new Map();
    const wio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { targets.get(e.target).classList.add('is-in'); wio.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    wipes.forEach(el => {
      const t = el.closest('.srv__item') || el;
      el.classList.add('wipe'); targets.set(t, el); wio.observe(t);
    });
  }

  // Apparition douce au défilement
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal, .map').forEach(el => io.observe(el));

  // Avant / après
  const pairs = [
    { k: 'ap1', b: "Avant : mur ancien fissuré, enduit qui s’effrite", a: 'Après : mur enduit parfaitement lisse', c: 'Mur ancien fissuré, repris et enduit : une surface parfaitement lisse.' },
    { k: 'ap2', b: 'Avant : combles bruts sous la toiture', a: 'Après : combles isolés et habillés en plaques de plâtre', c: 'Combles bruts isolés et habillés en placo : une vraie pièce en plus.' },
    { k: 'ap3', b: 'Avant : grande pièce ouverte', a: 'Après : pièce séparée par une cloison avec porte', c: 'Une grande pièce séparée par une cloison avec porte.' },
    { k: 'ap4', b: 'Avant : vieux plafond taché et fissuré', a: 'Après : faux plafond neuf avec spots encastrés', c: 'Vieux plafond taché remplacé par un faux plafond avec spots encastrés.' }
  ];
  const cmp = $('.cmp'), range = $('.cmp__range'), before = $('#ba-before'), after = $('#ba-after'), cap = $('#ba-cap');
  const setPos = v => cmp.style.setProperty('--pos', v + '%');
  range.addEventListener('input', () => setPos(range.value));
  const src = (k, s) => ({ src: `assets/img/${k}-${s}-1400.webp`, srcset: `assets/img/${k}-${s}-800.webp 800w, assets/img/${k}-${s}-1400.webp 1400w` });
  const tabs = $$('.ba__tabs [role=tab]');
  const showPair = i => {
    const p = pairs[i];
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    cmp.classList.add('is-loading');
    const nb = src(p.k, 'avant'), na = src(p.k, 'apres');
    let n = 0;
    const ok = () => { if (++n === 2) cmp.classList.remove('is-loading'); };
    before.addEventListener('load', ok, { once: true });
    after.addEventListener('load', ok, { once: true });
    Object.assign(before, nb, { alt: p.b });
    Object.assign(after, na, { alt: p.a });
    cap.textContent = p.c;
    range.value = 50; setPos(50);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showPair(i));
    t.addEventListener('keydown', e => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      const j = (i + dir + tabs.length) % tabs.length;
      tabs[j].focus(); showPair(j);
    });
  });
  // Précharge les 4 paires dès que la section approche : changement d'onglet instantané
  const preload = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    preload.disconnect();
    pairs.forEach(p => ['avant', 'apres'].forEach(s => {
      const img = new Image();
      img.sizes = before.sizes;
      Object.assign(img, src(p.k, s));
    }));
  }, { rootMargin: '600px 0px' });
  preload.observe(cmp);
  // petit mouvement d'invitation quand le curseur apparaît
  if (!reduce) {
    const hint = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      hint.disconnect();
      const t0 = performance.now();
      const step = t => {
        const p = Math.min((t - t0) / 1600, 1);
        setPos(50 + Math.sin(p * Math.PI * 2) * 14 * (1 - p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: .6 });
    hint.observe(cmp);
  }

  // Galerie : 6 photos au départ, « Voir tout » pour le reste ; mosaïque sans trou
  const fBtns = $$('.filters button'), items = $$('#grid li'), more = $('#works-more'), grid = $('#grid');
  let f = 'all', all = false, tok = 0;
  const apply = () => {
    const vis = items.filter((li, i) => f === 'all' ? (all || i < 6) : li.dataset.cat === f);
    items.forEach(li => { li.hidden = !vis.includes(li); li.classList.remove('is-big', 'is-right', 'is-wide-m'); });
    // ordinateur : une grande photo par groupe de 6, alternée gauche / droite
    vis.forEach((li, i) => { if (i % 6 === 0) li.classList.add('is-big'); if (i % 12 === 6) li.classList.add('is-right'); });
    // téléphone (2 colonnes) : nombre impair -> la première photo prend toute la largeur
    if (vis.length % 2) vis[0].classList.add('is-wide-m');
    more.parentNode.hidden = all || f !== 'all';
    return vis;
  };
  // changement de filtre : la grille s'efface, change, attend ses photos, puis réapparaît (jamais de mélange)
  const swap = () => {
    if (reduce) return apply();
    const t = ++tok;
    grid.classList.add('is-swap');
    setTimeout(() => {
      if (t !== tok) return;
      const imgs = apply().map(li => li.querySelector('img'));
      imgs.forEach(img => { img.loading = 'eager'; });
      Promise.race([Promise.all(imgs.map(img => img.decode().catch(() => {}))), new Promise(r => setTimeout(r, 600))])
        .then(() => { if (t === tok) grid.classList.remove('is-swap'); });
    }, 200);
  };
  fBtns.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.f === f) return;
    f = b.dataset.f;
    fBtns.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    swap();
  }));
  more.addEventListener('click', () => {
    all = true; apply();
    items[6].tabIndex = -1; items[6].focus({ preventScroll: true });
  });
  apply();

  // Frise des étapes : la ligne se trace et les étapes s'allument une à une
  const frise = $('#frise');
  const stepIO = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { frise.classList.add('is-in'); stepIO.disconnect(); }
  }, { threshold: .5 });
  stepIO.observe(frise);

  // Avis : flèches
  const rv = $('#rv');
  const move = dir => rv.scrollBy({ left: dir * (rv.firstElementChild.offsetWidth + 18), behavior: reduce ? 'auto' : 'smooth' });
  $('#rv-prev').addEventListener('click', () => move(-1));
  $('#rv-next').addEventListener('click', () => move(1));

  // Mini formulaire du hero -> formulaire complet
  const sim = $('#sim');
  $('#quick').addEventListener('submit', e => {
    e.preventDefault();
    const v = ($('#quick input:checked') || {}).value;
    if (v) { const r = $(`#sim input[name=type][value="${v}"]`); if (r) r.checked = true; update(); }
    $('#devis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  // Simulateur de devis (démo : aucun envoi, juste une confirmation)
  const surface = $('#surface'), out = $('#surface-out strong'), ville = $('#ville'), recapV = $('#recap-v');
  const update = () => {
    out.textContent = surface.value;
    const t = ($('#sim input[name=type]:checked') || {}).value;
    const parts = [t, `environ ${surface.value} m²`, ville.value].filter(Boolean);
    recapV.textContent = t ? parts.join(' · ') : 'Choisissez un type de travaux';
  };
  sim.addEventListener('input', e => {
    const f = e.target.closest('.field');
    if (f) { f.classList.remove('is-bad'); e.target.removeAttribute('aria-invalid'); }
    if ($('#sim input[name=type]:checked') && ville.value) $('#form-err').classList.remove('is-on');
    update();
  });
  sim.addEventListener('change', update);
  update();

  const field = id => $('#' + id).closest('.field');
  sim.addEventListener('submit', e => {
    e.preventDefault();
    const nom = $('#nom'), tel = $('#tel');
    const telOk = tel.value.replace(/\D/g, '').length >= 10;
    field('nom').classList.toggle('is-bad', !nom.value.trim());
    field('tel').classList.toggle('is-bad', !telOk);
    nom.setAttribute('aria-invalid', !nom.value.trim());
    tel.setAttribute('aria-invalid', !telOk);
    const typeOk = !!$('#sim input[name=type]:checked');
    $('#form-err').classList.toggle('is-on', !typeOk || !ville.value);
    if (!nom.value.trim() || !telOk || !typeOk || !ville.value) {
      const first = !typeOk ? $('#sim input[name=type]') : !ville.value ? ville : !nom.value.trim() ? nom : tel;
      first.focus();
      return;
    }
    const done = $('#done');
    $('#done-v').textContent = `${nom.value.trim().split(' ')[0]}, Sid Ahmed vous rappelle rapidement au ${tel.value.trim()} pour fixer la visite. Projet : ${recapV.textContent}.`;
    done.hidden = false;
    sim.classList.add('is-done');
    done.focus();
    sim.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });

  // Barre de contact mobile : visible seulement après les boutons du hero
  const callbar = $('#callbar');
  new IntersectionObserver(([e]) => {
    callbar.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top < 0);
  }).observe($('#hero-ctas'));
})();
