// ---------- reading progress bar ----------
(function () {
  var bar = document.getElementById('progress');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = (pct || 0) + '%';
  }, { passive: true });
})();

// ---------- hero terminal, one orchestrated type-on sequence ----------
(function () {
  var el = document.getElementById('term');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.innerHTML = '<span class="p">$</span> whoami\noperator\n<span class="p">$</span> cat role.txt\noffensive security / research\n<span class="p">$</span> ls latest/\n' +
      Array.from(document.querySelectorAll('#cards .card h2')).slice(0, 3).map(function (h) { return h.textContent.trim(); }).join('\n');
    return;
  }
  var titles = Array.from(document.querySelectorAll('#cards .card h2')).slice(0, 3).map(function (h) { return h.textContent.trim(); });
  var lines = [
    { p: '$ ', c: 'whoami', out: 'operator' },
    { p: '$ ', c: 'cat focus.txt', out: 'web & infra pentests · CVE research · red team tradecraft' },
    { p: '$ ', c: 'ls ./latest', out: titles.length ? titles.join('\n') : 'no posts yet — check back soon' }
  ];
  var i = 0, j = 0, phase = 'cmd'; // cmd -> out -> next
  function tick() {
    var line = lines[i];
    if (!line) { el.innerHTML += '\n<span class="p">$</span> <span class="cur">&#9608;</span>'; return; }
    if (phase === 'cmd') {
      if (j === 0) el.innerHTML += '<span class="p">' + line.p + '</span>';
      if (j < line.c.length) {
        el.innerHTML += '<span class="c">' + line.c.charAt(j) + '</span>';
        j++; setTimeout(tick, 18 + Math.random() * 30); return;
      } else { phase = 'out'; el.innerHTML += '\n'; j = 0; setTimeout(tick, 220); return; }
    }
    if (phase === 'out') {
      el.innerHTML += line.out + '\n\n';
      i++; j = 0; phase = 'cmd';
      setTimeout(tick, 260);
      return;
    }
  }
  tick();
})();

// ---------- card filter + search ----------
(function () {
  var filters = document.getElementById('filters');
  var cards = document.querySelectorAll('#cards .card');
  var q = document.getElementById('q');
  var empty = document.getElementById('empty');
  if (!filters || !cards.length) return;
  var active = 'all';

  function apply() {
    var term = (q.value || '').toLowerCase().trim();
    var shown = 0;
    cards.forEach(function (c) {
      var matchCat = active === 'all' || c.dataset.cat === active;
      var matchText = !term || c.dataset.text.indexOf(term) !== -1;
      var show = matchCat && matchText;
      c.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    empty.hidden = shown !== 0;
  }

  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    filters.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    active = btn.dataset.f;
    apply();
  });

  if (q) {
    q.addEventListener('input', apply);
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== q) {
        e.preventDefault(); q.focus();
      }
    });
  }
})();

// ---------- post table of contents ----------
(function () {
  var prose = document.getElementById('prose');
  var toc = document.getElementById('toc');
  if (!prose || !toc) return;
  var heads = prose.querySelectorAll('h2, h3');
  if (!heads.length) { toc.style.display = 'none'; return; }
  heads.forEach(function (h, idx) {
    if (!h.id) h.id = 'sec-' + idx;
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.style.paddingLeft = h.tagName === 'H3' ? '12px' : '0';
    a.style.fontSize = h.tagName === 'H3' ? '11px' : '12px';
    toc.appendChild(a);
  });
  var links = toc.querySelectorAll('a');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (ent) {
      var link = toc.querySelector('a[href="#' + ent.target.id + '"]');
      if (!link) return;
      if (ent.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('on'); });
        link.classList.add('on');
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px' });
  heads.forEach(function (h) { obs.observe(h); });
})();
