(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const body = document.body, fx = $('#fx'), veil = $('#veil');
  const START = new Date(2026, 8, 2, 0, 0, 0); // 02/09/2026
  const GROUP = { intro: 'night', p1: 'night', p2: 'night', split: 'storm', union: 'bright', time: 'bright', final: 'bright', letter: 'bright' };
  const LETTER = 'Vitória, talvez eu não consiga colocar em palavras tudo o que você representa para mim, mas quero que saiba que sou feliz por ter você na minha vida. Desde 02 de setembro de 2026, começamos a escrever uma história que espero continuar construindo por muito tempo. Não prometo que todos os dias serão perfeitos, mas prometo que quero continuar vivendo, aprendendo e criando lembranças ao seu lado. Se existissem mil caminhos diferentes, ainda gostaria de encontrar aquele que me levasse até você.\n\nCom carinho,\nSamuel. ❤️';
  let busy = false, typing = 0, skip = false;

  // ---- cenário ----
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('i');
    s.className = 'star' + (i % 12 === 0 ? ' big' : '');
    s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 75)}%;--z:${rnd(1, 2.6)}px;animation-delay:${rnd(0, 5)}s;animation-duration:${rnd(2.5, 6)}s`;
    $('#stars').append(s);
  }
  for (let i = 0; i < 90; i++) {
    const d = document.createElement('i');
    d.className = 'drop';
    d.style.cssText = `left:${rnd(-5, 105)}%;animation-duration:${rnd(.55, 1.1)}s;animation-delay:${rnd(0, 1.5)}s;opacity:${rnd(.4, 1)}`;
    $('#rain').append(d);
  }
  const FL = ['🌸', '🌷', '🌼', '🌻', '🌺'];
  for (let i = 0; i < 30; i++) {
    const f = document.createElement('i');
    f.className = 'fw';
    f.dataset.e = FL[i % FL.length];
    f.style.cssText = `left:${3 + i * 3.2}%;--h:${rnd(30, 120)}px;--d:${rnd(0, 3).toFixed(2)}s`;
    $('#flowers').append(f);
  }

  // ---- efeitos ----
  function puff(cls, txt, css, ms) {
    const e = document.createElement('span');
    e.className = cls; e.textContent = txt; e.style.cssText = css;
    fx.append(e); setTimeout(() => e.remove(), ms);
  }
  const broken = () => puff('broken', '💔', `left:${rnd(15, 85)}%;top:${rnd(18, 42)}%;font-size:${rnd(18, 34)}px;--r:${rnd(-50, 50)}deg`, 3300);
  function burst(x, y) {
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * 6.283, d = rnd(40, 90);
      puff('spark', '❤', `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;font-size:${rnd(10, 18)}px`, 900);
    }
  }
  setInterval(() => {
    if (body.className === 'bright') {
      puff('gp', '', `left:${rnd(0, 100)}%`, 6100);
      if (Math.random() < .6) puff('lheart', '❤', `left:${rnd(38, 62)}%;font-size:${rnd(12, 26)}px`, 3700);
    } else if (body.className === 'storm') broken();
  }, 450);

  // ---- estados ----
  function set(s) {
    body.dataset.s = s; body.className = GROUP[s];
    $$('.panel').forEach(p => p.classList.toggle('on', p.dataset.p === s));
    if (s === 'letter') typeLetter(); else typing++;
    if (s === 'split') for (let i = 0; i < 14; i++) setTimeout(broken, i * 160);
  }
  function go(s, useVeil) {
    if (busy) return;
    if (!useVeil) return set(s);
    busy = true; veil.classList.add('on');
    setTimeout(() => { set(s); veil.classList.remove('on'); busy = false; }, 600);
  }
  function separate() {
    if (busy) return;
    busy = true;
    $('#photos').classList.add('shake'); $('#crack').classList.add('on');
    setTimeout(() => set('split'), 500);
    setTimeout(() => { $('#photos').classList.remove('shake'); $('#crack').classList.remove('on'); busy = false; }, 1700);
  }

  // ---- carta (máquina de escrever) ----
  async function typeLetter() {
    const t = ++typing, p = $('#typed'), box = $('#letter');
    p.textContent = ''; skip = false; $('#again').hidden = true;
    for (const ch of LETTER) {
      if (t !== typing) return;
      if (skip) { p.textContent = LETTER; break; }
      p.textContent += ch; box.scrollTop = box.scrollHeight;
      await wait(/[.,]/.test(ch) ? 280 : ch === '\n' ? 220 : 30);
    }
    if (t === typing) { box.scrollTop = box.scrollHeight; $('#again').hidden = false; }
  }
  $('#letter').addEventListener('click', () => { skip = true; });

  // ---- contador ----
  function tick() {
    const S = Math.max(0, Math.floor((Date.now() - START) / 1000));
    $('#cd').textContent = Math.floor(S / 86400);
    $('#ch').textContent = Math.floor(S % 86400 / 3600);
    $('#cm').textContent = Math.floor(S % 3600 / 60);
    $('#cs').textContent = S % 60;
  }
  tick(); setInterval(tick, 1000);

  // ---- interação ----
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-go],[data-act]');
    if (!b) return;
    burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
    if (b.dataset.act === 'split') separate();
    else if (b.dataset.act === 'restart') go('intro', true);
    else go(b.dataset.go, 'veil' in b.dataset);
  });
  addEventListener('pointermove', e => {
    const r = document.documentElement.style;
    r.setProperty('--tx', (e.clientX / innerWidth - .5) * 16 + 'deg');
    r.setProperty('--ty', -(e.clientY / innerHeight - .5) * 12 + 'deg');
  });

  set('intro');
})();
