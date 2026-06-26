// Harness condiviso della presentazione (plain JS, niente JSX → caricabile anche da file://).
// Ogni modulo definisce window.SLIDES = [{title, content:()=>JSX}] e poi chiama BV.start().
(function () {
  const { useState, useEffect, useRef } = React;
  const h = React.createElement;

  function curIndex() {
    const path = location.pathname;
    let idx = (window.MODULES || []).findIndex(m => path.endsWith(m.file));
    return idx < 0 ? 0 : idx;
  }

  function App() {
    const SLIDES = window.SLIDES || [];
    const MODULES = window.MODULES || [];
    const MOD_IDX = curIndex();
    const cur = MODULES[MOD_IDX] || { n: 1, title: '', accent: '--accent-blue' };
    const prevMod = MODULES[MOD_IDX - 1] || null;
    const nextMod = MODULES[MOD_IDX + 1] || null;
    const accent = 'var(' + cur.accent + ')';

    const [i, setI] = useState(location.hash === '#last' ? Math.max(0, SLIDES.length - 1) : 0);

    useEffect(() => { if (location.hash) history.replaceState(null, '', location.pathname); }, []);

    const goNext = () => { if (i < SLIDES.length - 1) setI(i + 1); else if (nextMod) location.href = nextMod.file; };
    const goPrev = () => { if (i > 0) setI(i - 1); else if (prevMod) location.href = prevMod.file + '#last'; };

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
        else if (e.key === 'ArrowLeft') goPrev();
        else if (e.key === 'Escape') location.href = 'index.html';
        else if (e.key >= '1' && e.key <= '9') {
          const k = parseInt(e.key, 10) - 1;
          if (k < MODULES.length && k !== MOD_IDX) location.href = MODULES[k].file;
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    });

    // Swipe touch (mobile)
    const tx = useRef(null);
    const onTS = (e) => { tx.current = e.changedTouches[0].clientX; };
    const onTE = (e) => {
      if (tx.current == null) return;
      const dx = e.changedTouches[0].clientX - tx.current;
      tx.current = null;
      if (Math.abs(dx) > 60) { dx < 0 ? goNext() : goPrev(); }
    };

    const slide = SLIDES[i] || { content: () => null, title: '' };
    const prevLabel = (i === 0 && prevMod) ? ('‹ Mod. ' + prevMod.n) : '‹ Indietro';
    const nextLabel = (i === SLIDES.length - 1 && nextMod) ? ('Mod. ' + nextMod.n + ' ›') : 'Avanti ›';

    return h('div', { className: 'app', style: { '--accent': accent }, onTouchStart: onTS, onTouchEnd: onTE },
      h('div', { className: 'topbar' },
        h('a', { className: 'home', href: 'index.html', title: 'Dashboard (ESC)' }, '⌂'),
        h('div', { className: 'pills' },
          MODULES.map((m, k) => h('a', {
            key: k,
            href: k === MOD_IDX ? undefined : m.file,
            className: 'pill' + (k === MOD_IDX ? ' on' : ''),
            style: { '--accent': 'var(' + m.accent + ')' },
            title: 'Modulo ' + m.n + ' · ' + m.title
          }, m.n))
        ),
        h('span', { className: 'count' }, (i + 1) + ' / ' + SLIDES.length)
      ),
      h('div', { className: 'modtitle' }, 'Modulo ' + cur.n + ' · ' + cur.title),
      h('div', { className: 'stage' }, slide.content()),
      h('div', { className: 'nav' },
        h('button', { className: 'btn ghost', onClick: goPrev, disabled: i === 0 && !prevMod }, prevLabel),
        h('span', { className: 'slidetitle' }, slide.title || ''),
        h('button', { className: 'btn primary', onClick: goNext, disabled: i === SLIDES.length - 1 && !nextMod }, nextLabel)
      ),
      h('div', { className: 'progress' }, h('div', { style: { width: (((i + 1) / SLIDES.length) * 100) + '%' } }))
    );
  }

  window.BV = { start: function () { ReactDOM.createRoot(document.getElementById('root')).render(h(App)); } };
})();
