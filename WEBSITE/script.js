(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Data proyek — ganti dengan proyek Anda */
  const projects = [
    { t: 'Nusa Pay Dashboard', d: 'Dasbor keuangan real-time dengan grafik interaktif dan ekspor laporan.', c: 'web', tags: ['React', 'Next.js', 'D3'], url: '#', pts: ['Peran: perancang UI dan pengembang utama', 'Hasil: waktu muat turun lebih dari separuh', 'Tim: 4 orang, rilis dalam 3 bulan'] },
    { t: 'Kopi Order API', d: 'API pesanan multi-cabang dengan antrean dan notifikasi status.', c: 'api', tags: ['Node.js', 'PostgreSQL', 'Redis'], url: '#', pts: ['Peran: perancang UI dan pengembang utama', 'Hasil: waktu muat turun lebih dari separuh', 'Tim: 4 orang, rilis dalam 3 bulan'] },
    { t: 'Lintang CMS', d: 'CMS ringan untuk situs UMKM, bisa diedit tanpa pelatihan.', c: 'web', tags: ['JavaScript', 'MongoDB'], url: '#', pts: ['Peran: perancang UI dan pengembang utama', 'Hasil: waktu muat turun lebih dari separuh', 'Tim: 4 orang, rilis dalam 3 bulan'] },
    { t: 'Sistem Desain Pustaka', d: 'Kumpulan komponen UI yang mudah diakses dan terdokumentasi.', c: 'ui', tags: ['CSS', 'Figma', 'A11y'], url: '#', pts: ['Peran: perancang UI dan pengembang utama', 'Hasil: waktu muat turun lebih dari separuh', 'Tim: 4 orang, rilis dalam 3 bulan'] },
    { t: 'Jadwal Kelas API', d: 'Layanan penjadwalan kelas dengan deteksi bentrok otomatis.', c: 'api', tags: ['Express', 'JWT'], url: '#', pts: ['Peran: perancang UI dan pengembang utama', 'Hasil: waktu muat turun lebih dari separuh', 'Tim: 4 orang, rilis dalam 3 bulan'] },
    { t: 'Aplikasi Kasir Web', d: 'Kasir offline-first dengan sinkronisasi saat internet kembali.', c: 'web', tags: ['PWA', 'IndexedDB'], url: '#', pts: ['Peran: perancang UI dan pengembang utama', 'Hasil: waktu muat turun lebih dari separuh', 'Tim: 4 orang, rilis dalam 3 bulan'] }
  ];

  const grid = $('#grid');
  const modal = $('#modal');
  const openModal = (p, hue) => {
    $('#mTitle').textContent = p.t; $('#mDesc').textContent = p.d;
    $('#mCover').style.setProperty('--h', hue);
    $('#mTags').innerHTML = p.tags.map(t => `<li>${t}</li>`).join('');
    $('#mPoints').innerHTML = p.pts.map(t => `<li>${t}</li>`).join('');
    modal.showModal();
  };
  $('#mClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  const render = f => {
    grid.innerHTML = '';
    projects.filter(p => f === 'all' || p.c === f).forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      const hue = (p.t.length * 37) % 360;
      el.innerHTML = `<div class="cover" style="--h:${hue}"><b>${p.t.split(' ').map(w => w[0]).join('').slice(0, 3)}</b></div><h3></h3><p></p><ul class="tags"></ul><button class="more" type="button">Lihat detail</button>`;
      el.querySelector('.more').addEventListener('click', () => openModal(p, hue));
      el.querySelector('h3').textContent = p.t;
      el.querySelector('p').textContent = p.d;
      p.tags.forEach(t => { const li = document.createElement('li'); li.textContent = t; el.querySelector('.tags').append(li); });
      grid.append(el);
    });
  };
  render('all');
  $$('.chip').forEach(b => b.addEventListener('click', () => {
    $$('.chip').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
    render(b.dataset.f);
  }));

  /* Tema */
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  $('#theme').addEventListener('click', () => {
    const n = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = n;
    try { localStorage.setItem('theme', n); } catch (e) {}
  });

  /* Menu mobile */
  const btn = $('#menuBtn'), links = $('#links');
  btn.addEventListener('click', () => btn.setAttribute('aria-expanded', links.classList.toggle('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });

  /* Nav: bayangan saat scroll + tautan aktif */
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('#links a').forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* Efek grid mengikuti kursor di hero */
  const hero = $('.hero');
  if (!reduce) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', e.clientX - r.left + 'px');
    hero.style.setProperty('--my', e.clientY - r.top + 'px');
  });

  /* Teks mengetik */
  const words = ['Frontend', 'Backend', 'UI engineer', 'Pemecah masalah'];
  const out = $('#typed');
  if (reduce) out.textContent = words[0];
  else {
    let w = 0, i = 0, del = false;
    (function tick() {
      const word = words[w];
      out.textContent = word.slice(0, i += del ? -1 : 1);
      let wait = del ? 45 : 90;
      if (!del && i === word.length) { del = true; wait = 1400; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      setTimeout(tick, wait);
    })();
  }

  /* Angka naik & bar keahlian saat terlihat */
  const once = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return;
    o.unobserve(e.target);
    $$('[data-count]', e.target).forEach(n => {
      const end = +n.dataset.count;
      if (reduce) return (n.textContent = end);
      const t0 = performance.now();
      const step = t => {
        const p = Math.min((t - t0) / 1200, 1);
        n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    $$('[data-w]', e.target).forEach(b => (b.style.width = b.dataset.w + '%'));
  }), { threshold: .3 });
  $$('.stats, .skills').forEach(el => once.observe(el));

  /* Validasi form */
  const form = $('#form'), status = $('#status');
  const msg = el => {
    if (el.validity.valueMissing) return 'Bagian ini wajib diisi.';
    if (el.validity.typeMismatch) return 'Masukkan alamat email yang valid, contoh: nama@email.com.';
    if (el.validity.tooShort) return 'Tulis minimal 10 karakter.';
    return '';
  };
  const check = el => {
    const m = msg(el);
    el.parentElement.classList.toggle('invalid', !!m);
    el.parentElement.querySelector('small').textContent = m;
    return !m;
  };
  $$('input, textarea', form).forEach(el => el.addEventListener('blur', () => check(el)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = $$('input, textarea', form).map(check).every(Boolean);
    if (!ok) { status.textContent = 'Periksa kembali kolom yang bertanda merah.'; $('.invalid input, .invalid textarea', form)?.focus(); return; }
    // Ganti dengan fetch() ke backend / layanan form (mis. Formspree) milik Anda
    status.textContent = 'Pesan terkirim. Saya akan membalas dalam 1–2 hari kerja.';
    form.reset();
  });

  /* Progress scroll */
  const bar = $('#progress');
  addEventListener('scroll', () => {
    bar.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight || 1)})`;
  }, { passive: true });

  /* Terminal di hero */
  const lines = ['$ whoami', 'rizky — full-stack developer', '', '$ cat stack.txt', 'react · node · postgres', '', '$ ls proyek/ | wc -l', '42', '', '$ status', '✔ terbuka untuk proyek baru'];
  const tout = $('#termOut');
  if (reduce) tout.textContent = lines.join('\n');
  else {
    let l = 0, c = 0, txt = '';
    (function type() {
      if (l >= lines.length) return;
      const line = lines[l];
      if (c < line.length) { txt += line[c++]; tout.textContent = txt; setTimeout(type, line.startsWith('$') ? 60 : 15); }
      else { txt += '\n'; l++; c = 0; setTimeout(type, line.startsWith('$') ? 400 : 120); }
    })();
  }

  /* Efek tilt 3D pada kartu proyek */
  if (!reduce) grid.addEventListener('pointermove', e => {
    const card = e.target.closest('.card'); if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  grid.addEventListener('pointerout', e => { const c = e.target.closest('.card'); if (c) c.style.transform = ''; });

  $('#year').textContent = new Date().getFullYear();
})();