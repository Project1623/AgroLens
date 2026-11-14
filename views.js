/* AgroLens — view helpers, navigation, home, plants and fields */
const V = (() => {
  const esc = Utils.escape;
  const ic = (name, cls = '') => Icons.get(name, cls);

  function pageHead({ eyebrow = '', title = '', sub = '', actions = '' }) {
    return `<div class="page-head">
      <div class="page-head__text">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        <h1 class="h1">${title}</h1>
        ${sub ? `<p class="sub mt-8">${sub}</p>` : ''}
      </div>
      ${actions ? `<div class="flex wrap">${actions}</div>` : ''}
    </div>`;
  }

  function sectionHead(title, link = '', href = '#/') {
    return `<div class="section-head">
      <h2 class="h2">${title}</h2>
      ${link ? `<a class="link-arrow" href="${href}">${link} ${ic('arrow-right')}</a>` : ''}
    </div>`;
  }

  function empty(icon, title, text, action = '') {
    return `<div class="empty">
      <span class="empty__icon">${ic(icon)}</span>
      <strong>${title}</strong>
      <span>${text}</span>
      ${action}
    </div>`;
  }

  function statusBadge(status) {
    return `<span class="badge badge--${status.cls}"><span class="dot dot--${status.cls}"></span>${esc(status.label)}</span>`;
  }

  function waterPill(plant) {
    const w = Store.nextWatering(plant);
    const cls = w.overdue ? 'water-pill--danger' : w.daysLeft <= 1 ? 'water-pill--warn' : '';
    const label = w.overdue
      ? `прострочено ${Math.abs(w.daysLeft)} дн.`
      : w.today ? 'полити сьогодні' : `через ${w.daysLeft} дн.`;
    return `<span class="water-pill ${cls}">${ic('drop')}${label}</span>`;
  }

  function riskBadge(risk) {
    const map = {
      low: { cls: 'green', label: 'Низький ризик' },
      medium: { cls: 'amber', label: 'Помірний ризик' },
      high: { cls: 'danger', label: 'Високий ризик' }
    };
    const r = map[risk] || map.low;
    return `<span class="badge badge--${r.cls}">${r.label}</span>`;
  }

  function navItems(mode) {
    if (mode === 'home') {
      return [
        { href: '#/home', icon: 'home', label: 'Мій дім' },
        { href: '#/plants', icon: 'pot', label: 'Мої рослини', badge: Store.stats().urgent || '' },
        { href: '#/scan', icon: 'scan', label: 'Сканувати листок' },
        { href: '#/checker', icon: 'stethoscope', label: 'Симптом-чекер' },
        { href: '#/journal', icon: 'journal', label: 'Журнал догляду' },
        { href: '#/guide', icon: 'book', label: 'Офлайн-довідник' },
        { href: '#/weather', icon: 'cloud', label: 'Погода й ризики' },
        { href: '#/chat', icon: 'chat', label: 'Агроном + AI' }
      ];
    }
    return [
      { href: '#/home', icon: 'home', label: 'Огляд' },
      { href: '#/scan', icon: 'scan', label: 'Діагностика' },
      { href: '#/plants', icon: 'sprout', label: 'Господарство', badge: Store.stats().urgent || '' },
      { href: '#/checker', icon: 'stethoscope', label: 'Симптом-чекер' },
      { href: '#/weather', icon: 'cloud', label: 'Погода й ризики' },
      { href: '#/journal', icon: 'journal', label: 'Журнал' },
      { href: '#/guide', icon: 'book', label: 'Довідник' },
      { href: '#/chat', icon: 'chat', label: 'Агроном + AI' }
    ];
  }

  function home() {
    const s = Store.get();
    const st = Store.stats();
    const homeMode = s.mode === 'home';
    const att = s.plants.map(p => ({ p, st: Store.plantStatus(p), w: Store.nextWatering(p) }))
      .filter(x => x.st.key !== 'good' || x.w.overdue)
      .sort((a, b) => (a.w.daysLeft || 0) - (b.w.daysLeft || 0))
      .slice(0, 4);
    const weather = s.weather;

    const heroTitle = homeMode ? 'Дім, де рослини почуваються добре' : 'Бачити рослину наскрізь';
    const heroSub = homeMode
      ? 'Сфотографуйте листок, отримайте діагноз і план догляду. Нагадування про полив, журнал і офлайн-довідник — усе в одному місці.'
      : 'Фото листка перетворюється на діагноз, план лікування та вікно обробки за погодою. Польові культури й кімнатні рослини — в одному застосунку.';

    const attRows = att.map(({ p, st }) => `
      <a class="attention__item" href="#/plant/${p.id}">
        <span class="attention__art">${Art.plant(p.art, 'card')}</span>
        <span class="attention__text">
          <strong>${esc(p.name)}</strong>
          <span>${esc(p.room)} · ${st.label}</span>
        </span>
        <span class="attention__meta">${waterPill(p)}<span class="attention__arrow">${ic('chevron-right')}</span></span>
      </a>`).join('');

    const fieldRows = s.fields.slice(0, 3).map(f => `
      <a class="attention__item" href="#/field/${f.id}">
        <span class="attention__art">${Art.field(f.cropType)}</span>
        <span class="attention__text">
          <strong>${esc(f.name)} · ${esc(f.crop)}</strong>
          <span>${f.area} га · ${esc(f.stage)} · скан ${esc(f.lastScan)}</span>
        </span>
        <span class="attention__meta">${riskBadge(f.risk)}${ic('chevron-right', 'attention__arrow')}</span>
      </a>`).join('');

    const quick = homeMode ? [
      { href: '#/scan', icon: 'scan', title: 'Діагностика', sub: 'фото → діагноз', cls: '' },
      { href: '#/plants', icon: 'pot', title: 'Полив', sub: `${st.today} рослин чекають`, cls: 'quick--amber' },
      { href: '#/checker', icon: 'stethoscope', title: 'Симптоми', sub: 'без фото', cls: '' },
      { href: '#/guide', icon: 'book', title: 'Довідник', sub: 'працює офлайн', cls: '' }
    ] : [
      { href: '#/scan', icon: 'scan', title: 'Сканувати', sub: 'листок або плід', cls: '' },
      { href: '#/plants', icon: 'sprout', title: 'Поля', sub: `${st.fields} ділянки`, cls: '' },
      { href: '#/weather', icon: 'cloud', title: 'Обробка', sub: 'вікно за погодою', cls: 'quick--amber' },
      { href: '#/journal', icon: 'journal', title: 'Журнал', sub: `${st.journal} подій`, cls: '' }
    ];

    return `
      <div class="hello-row">
        <span class="weekday">${Utils.todayLong()}</span>
        <span class="status-pill"><span class="status-pill__dot"></span>${homeMode ? 'Побутовий режим · безкоштовно' : 'Фермерський режим'}</span>
      </div>
      <section class="home-hero card card--dark">
        <div class="home-hero__content">
          <div class="eyebrow" style="color:#9FD8AC">${ic('sparkles')} AgroLens · plant intelligence</div>
          <h1 class="h1 mt-12">${heroTitle}</h1>
          <p class="sub">${heroSub}</p>
          <div class="home-hero__actions">
            <a class="btn btn--mint btn--lg" href="#/scan">${ic('scan')} Сканувати листок</a>
            <a class="btn btn--glass btn--lg" href="#/chat">${ic('chat')} Запитати агронома</a>
          </div>
        </div>
        <div class="home-hero__art">
          ${Art.hero()}
          <span class="hero-tag hero-tag--a">${ic('shield')} ${s.apiKey ? 'Gemini підключено' : 'демо · офлайн'}</span>
          <span class="hero-tag hero-tag--b">${ic('target')} ${st.scans} сканувань</span>
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat card">
          <div class="stat__top"><span class="stat__label">${homeMode ? 'Мої рослини' : 'Поля й сад'}</span><span class="stat__icon">${ic(homeMode ? 'pot' : 'layers')}</span></div>
          <div class="stat__value">${homeMode ? st.plants : st.fields}<small>${homeMode ? 'рослин' : 'ділянки'}</small></div>
          <div class="stat__foot">${ic('leaf')} ${homeMode ? 'кімнатні та балконні' : `${st.hectares.toFixed(1)} га під наглядом`}</div>
        </div>
        <div class="stat card ${st.urgent ? 'stat--amber' : ''}">
          <div class="stat__top"><span class="stat__label">Потребують уваги</span><span class="stat__icon">${ic('alert')}</span></div>
          <div class="stat__value">${st.urgent}<small>зараз</small></div>
          <div class="stat__foot">${ic('clock')} ${st.today} з поливом сьогодні</div>
        </div>
        <div class="stat card">
          <div class="stat__top"><span class="stat__label">Діагностик</span><span class="stat__icon">${ic('scan')}</span></div>
          <div class="stat__value">${st.scans}<small>усього</small></div>
          <div class="stat__foot">${ic('sparkles')} ${s.apiKey ? 'Gemini vision' : 'локальна демо-база'}</div>
        </div>
        <div class="stat card">
          <div class="stat__top"><span class="stat__label">Записів у журналі</span><span class="stat__icon">${ic('journal')}</span></div>
          <div class="stat__value">${st.journal}<small>подій</small></div>
          <div class="stat__foot">${ic('shield')} зберігається на пристрої</div>
        </div>
      </div>

      <div class="home-grid">
        <section class="card panel">
          <div class="panel__head">
            <h3 class="panel__title">${homeMode ? 'Що потребує уваги' : 'Поля й рослини під наглядом'}</h3>
            <a class="link-arrow" href="${homeMode ? '#/plants' : '#/plants'}">Усі ${ic('arrow-right')}</a>
          </div>
          ${homeMode
            ? (attRows || empty('check-circle', 'Усе гаразд', 'Усі рослини политі та здорові. Гарний день, щоб оглянути нижній бік листків.'))
            : `<div class="attention">${fieldRows}</div>${attRows ? `<div class="divider"></div><div class="attention">${attRows}</div>` : ''}`}
        </section>

        <div class="scan-side">
          <section class="card panel">
            <div class="panel__head"><h3 class="panel__title">Швидкі дії</h3></div>
            <div class="quick-grid">
              ${quick.map(q => `<a class="quick ${q.cls}" href="${q.href}"><span class="quick__icon">${ic(q.icon)}</span><strong>${q.title}</strong><span>${q.sub}</span></a>`).join('')}
            </div>
          </section>

          <a class="weather-mini card" href="#/weather">
            <span class="weather-mini__temp">${weather ? Math.round(weather.current.temp) + '°' : '—'}</span>
            <span class="weather-mini__text">
              <strong>${weather ? DATA.weatherInfo(weather.current.code).label : 'Погода'}</strong>
              <span>${weather ? `${esc(weather.location)} · вологість ${weather.current.humidity}%` : 'Натисніть, щоб завантажити прогноз'}</span>
            </span>
            <span class="weather-mini__art">${weather ? Art.weather(weather.current.code) : Art.weather(2)}</span>
          </a>

          <div class="mode-hint card">
            ${ic('lightbulb')}
            <span>${homeMode ? 'Побутовий режим безкоштовний і повний: рослини, нагадування, чекер, довідник, чат.' : 'Усі побутові функції доступні безкоштовно — перемкніть режим на «Дім» у бічній панелі.'}</span>
          </div>
        </div>
      </div>

      ${sectionHead('Останні події', 'Весь журнал', '#/journal')}
      <div class="card panel" style="padding:8px 18px">
        ${s.journal.slice(0, 3).map(j => journalRow(j)).join('') || empty('journal', 'Журнал порожній', 'Полийте рослину або запустіть діагностику — подія з’явиться тут.')}
      </div>`;
  }

  function journalRow(j) {
    const icon = j.icon === 'drop' ? 'drop' : j.icon === 'bug' ? 'bug' : j.icon === 'spray' ? 'spray' : j.icon === 'pot' ? 'pot' : j.icon === 'trash' ? 'trash' : 'scan';
    const cls = j.status === 'danger' ? 'journal-item__icon--danger' : j.status === 'warning' ? 'journal-item__icon--amber' : '';
    return `<a class="journal-item" href="#/journal" style="background:transparent;border:0;border-bottom:1px solid var(--line);border-radius:0;margin:0">
      <span class="journal-item__icon ${cls}">${ic(icon)}</span>
      <span class="journal-item__body"><strong>${esc(j.title)}</strong><span>${esc(j.sub || '')}</span></span>
      <span class="journal-item__time">${Utils.relative(j.createdAt)}</span>
    </a>`;
  }

  function plants() {
    const s = Store.get();
    const homeMode = s.mode === 'home';
    const q = (UI.plants.q || '').toLowerCase();
    const filter = UI.plants.filter || 'all';
    let list = s.plants.filter(p => !q || (p.name + ' ' + p.species + ' ' + p.room).toLowerCase().includes(q));
    if (filter === 'attention') list = list.filter(p => Store.plantStatus(p).key !== 'good' || Store.nextWatering(p).overdue);
    if (filter === 'today') list = list.filter(p => { const w = Store.nextWatering(p); return w.today || w.overdue; });

    const cards = list.map(p => {
      const st = Store.plantStatus(p);
      return `<a class="plant-card" href="#/plant/${p.id}">
        <span class="plant-card__art">
          ${Art.plant(p.art, 'card')}
          <span class="plant-card__badge">${p.health === 'risk' ? `<span class="badge badge--danger">увага</span>` : p.health === 'attention' ? `<span class="badge badge--amber">огляд</span>` : `<span class="badge badge--green">здорова</span>`}</span>
          <span class="plant-card__health">${ic('heart')} ${p.room}</span>
        </span>
        <span class="plant-card__body">
          <strong>${esc(p.name)}</strong>
          <small>${esc(p.species)}</small>
          <span class="plant-card__foot">
            <span class="plant-card__room">${ic('drop')} ${waterPill(p)}</span>
            <span class="dot dot--${st.cls}"></span>
          </span>
        </span>
      </a>`;
    }).join('');

    const addCard = `<button class="add-card" data-action="open-add-plant" type="button">
      <span class="add-card__plus">${ic('plus')}</span>
      <strong>Додати рослину</strong>
      <span class="tiny">нагадаємо про полив</span>
    </button>`;

    return `
      ${pageHead({
        eyebrow: ic('pot') + ' ' + (homeMode ? 'Побутовий режим' : 'Господарство'),
        title: homeMode ? 'Мої рослини' : 'Поля, сад і рослини',
        sub: homeMode ? 'Один список для кімнатних, балконних і городніх рослин. Полив, світло й нотатки — поруч.' : 'Польові культури, сад і теплиця. Скануйте ділянки, відстежуйте ризик і плануйте обробки.',
        actions: `<button class="btn btn--primary" data-action="open-add-plant">${ic('plus')} Додати рослину</button>`
      })}
      <div class="guide-tools">
        <label class="search">${ic('search')}<input type="search" placeholder="Пошук за назвою, видом або кімнатою" value="${esc(UI.plants.q || '')}" data-input="plants-q"></label>
        <div class="chip-row">
          <button class="chip ${filter === 'all' ? 'is-active' : ''}" data-action="plants-filter" data-filter="all">Усі · ${s.plants.length}</button>
          <button class="chip ${filter === 'attention' ? 'is-active' : ''}" data-action="plants-filter" data-filter="attention">Потребують уваги</button>
          <button class="chip ${filter === 'today' ? 'is-active' : ''}" data-action="plants-filter" data-filter="today">Полити сьогодні</button>
        </div>
      </div>
      <div class="plant-grid">${cards}${addCard}</div>

      ${!homeMode ? `
        ${sectionHead('Ділянки', 'Погода й ризики', '#/weather')}
        <div class="grid-3">
          ${s.fields.map(f => `
            <a class="field-card" href="#/field/${f.id}">
              <span class="field-card__art">${Art.field(f.cropType)}<span class="field-card__risk">${riskBadge(f.risk)}</span></span>
              <span class="field-card__body">
                <strong>${esc(f.name)} · ${esc(f.crop)}</strong>
                <small>${esc(f.stage)} · ${f.area} га</small>
                <span class="field-card__meta"><span>${ic('scan')} ${esc(f.lastScan)}</span><span>${ic('chevron-right')}</span></span>
              </span>
            </a>`).join('')}
          <button class="field-card" data-action="open-add-field" type="button" style="display:grid;place-items:center;min-height:210px;border-style:dashed">
            <span style="display:grid;place-items:center;gap:8px;color:var(--green)">${ic('plus')}<strong style="font-size:12px">Додати ділянку</strong></span>
          </button>
        </div>` : ''}`;
  }

  function plant(id) {
    const s = Store.get();
    const p = s.plants.find(x => x.id === id);
    if (!p) return empty('pot', 'Рослину не знайдено', 'Можливо, її видалено. Поверніться до списку.', `<a class="btn btn--primary mt-16" href="#/plants">До рослин</a>`);
    const st = Store.plantStatus(p);
    const w = Store.nextWatering(p);
    const entries = s.journal.filter(j => j.plant === p.name).slice(0, 6);
    const waterPct = Utils.clamp(Math.round(100 - (w.daysLeft / Math.max(p.waterEvery, 1)) * 100), 5, 100);

    return `
      <div class="result-head">
        <a class="btn btn--ghost btn--sm" href="#/plants">${ic('arrow-left')} Назад</a>
        <span class="spacer"></span>
        <button class="btn btn--ghost btn--sm" data-action="edit-plant" data-id="${p.id}">${ic('edit')} Редагувати</button>
        <button class="btn btn--danger btn--sm" data-action="delete-plant" data-id="${p.id}">${ic('trash')} Видалити</button>
      </div>

      <section class="card plant-detail-hero">
        <div class="plant-detail-hero__art">
          ${Art.plant(p.art, 'card')}
          <span class="hero-tag" style="left:16px;bottom:16px;right:auto">${ic('map-pin')} ${esc(p.room)}</span>
        </div>
        <div class="plant-detail-hero__body">
          <div class="flex wrap">
            <span class="badge badge--${st.cls === 'bad' ? 'danger' : st.cls === 'warn' ? 'amber' : 'green'}">${st.label}</span>
            <span class="badge badge--glass">${esc(p.pot)}</span>
          </div>
          <h1 class="h1 mt-12">${esc(p.name)}</h1>
          <p class="latin">${esc(p.species)}</p>
          <p class="sub mt-12">${esc(p.note || 'Додайте нотатку про цю рослину, щоб не забути особливості догляду.')}</p>
          <div class="care-rings">
            <div class="care-ring">
              <span class="care-ring__svg">${Art.ring(waterPct, w.overdue ? '#E9A23B' : '#4E9B62', 34, 3)}</span>
              <span class="care-ring__text"><strong>Полив</strong><span>${w.overdue ? `прострочено ${Math.abs(w.daysLeft)} дн.` : w.today ? 'сьогодні' : `через ${w.daysLeft} дн.`}</span></span>
            </div>
            <div class="care-ring">
              <span class="care-ring__svg">${Art.ring(82, '#7CC48D', 34, 3)}</span>
              <span class="care-ring__text"><strong>Світло</strong><span>${esc(p.light)}</span></span>
            </div>
            <div class="care-ring">
              <span class="care-ring__svg">${Art.ring(64, '#E9A23B', 34, 3)}</span>
              <span class="care-ring__text"><strong>Вологість</strong><span>перевіряти щотижня</span></span>
            </div>
          </div>
          <div class="result-actions">
            <button class="btn btn--primary" data-action="water-plant" data-id="${p.id}">${ic('drop')} Полити</button>
            <a class="btn btn--ghost" href="#/scan">${ic('scan')} Діагностика</a>
            <button class="btn btn--ghost" data-action="add-note" data-id="${p.id}">${ic('edit')} Нотатка</button>
          </div>
        </div>
      </section>

      <div class="grid-2 mt-16">
        <section class="card result-section">
          <h3 class="h3">План догляду</h3>
          <p class="small mt-4">Наступний полив — ${Utils.fmtDate(w.date, true)}. Орієнтуйтеся на ґрунт, а не лише на календар.</p>
          <div class="timeline mt-16">
            <div class="tl-item"><span class="tl-item__dot">${ic('drop')}</span><span class="tl-item__body"><strong>Полив</strong><span>кожні ${p.waterEvery} ${Utils.plural(p.waterEvery, 'день', 'дні', 'днів')}, під корінь</span></span><span class="tl-item__date">${Utils.fmtShort(w.date)}</span></div>
            <div class="tl-item"><span class="tl-item__dot">${ic('sun')}</span><span class="tl-item__body"><strong>Світло</strong><span>${esc(p.light)}; повертайте до вікна на чверть оберту</span></span><span class="tl-item__date">щотижня</span></div>
            <div class="tl-item"><span class="tl-item__dot">${ic('hand')}</span><span class="tl-item__body"><strong>Огляд листя</strong><span>нижній бік, черешки, молоді пагони</span></span><span class="tl-item__date">п’ятниця</span></div>
            <div class="tl-item"><span class="tl-item__dot tl-item__dot--amber">${ic('leaf')}</span><span class="tl-item__body"><strong>Підживлення</strong><span>раз на 3–4 тижні у вегетацію</span></span><span class="tl-item__date">1 числа</span></div>
          </div>
        </section>
        <section class="card result-section">
          <h3 class="h3">Історія рослини</h3>
          <p class="small mt-4">Події з журналу, пов’язані з цією рослиною.</p>
          ${entries.length ? `<div class="mt-12">${entries.map(j => `
            <div class="journal-item" style="background:transparent;border:0;border-bottom:1px solid var(--line);border-radius:0">
              <span class="journal-item__icon">${ic(j.icon || 'journal')}</span>
              <span class="journal-item__body"><strong>${esc(j.title)}</strong><span>${esc(j.sub || '')}</span></span>
              <span class="journal-item__time">${Utils.relative(j.createdAt)}</span>
            </div>`).join('')}</div>` : empty('journal', 'Ще немає подій', 'Полийте рослину або додайте нотатку — історія з’явиться тут.')}
        </section>
      </div>`;
  }

  function field(id) {
    const s = Store.get();
    const f = s.fields.find(x => x.id === id);
    if (!f) return empty('layers', 'Ділянку не знайдено', 'Поверніться до господарства й оберіть іншу ділянку.', `<a class="btn btn--primary mt-16" href="#/plants">Назад</a>`);
    const entries = s.journal.filter(j => j.plant === f.name).slice(0, 5);
    return `
      <div class="result-head"><a class="btn btn--ghost btn--sm" href="#/plants">${ic('arrow-left')} Назад</a><span class="spacer"></span><button class="btn btn--danger btn--sm" data-action="delete-field" data-id="${f.id}">${ic('trash')} Видалити</button></div>
      <section class="result-hero card">
        <div class="result-hero__art">${Art.field(f.cropType)}</div>
        <div class="result-hero__body">
          <div class="flex wrap">${riskBadge(f.risk)}<span class="badge badge--glass">${f.area} га</span></div>
          <h1 class="h1 mt-12">${esc(f.name)}</h1>
          <p class="sub mt-4">${esc(f.crop)} · ${esc(f.stage)}</p>
          <p class="sub mt-12">${esc(f.note || 'Додайте нотатку про стан ділянки.')}</p>
          <div class="result-actions">
            <a class="btn btn--primary" href="#/scan">${ic('scan')} Сканувати ділянку</a>
            <a class="btn btn--ghost" href="#/weather">${ic('cloud')} Вікно обробки</a>
          </div>
          <div class="disclaimer">${ic('info')} Останній скан: ${esc(f.lastScan)}. Ризик оновлюється за погодою та журналом.</div>
        </div>
      </section>
      <div class="grid-2 mt-16">
        <section class="card result-section">
          <h3 class="h3">Що робити далі</h3>
          <div class="list-check">
            <div class="list-check__item"><span class="list-check__icon">${ic('check')}</span><span>Огляньте 5 рослин по діагоналі поля та зафіксуйте площу ураження.</span></div>
            <div class="list-check__item"><span class="list-check__icon">${ic('check')}</span><span>Порівняйте прогноз із порогом: обробка потрібна, якщо ризик вище 45%.</span></div>
            <div class="list-check__item"><span class="list-check__icon">${ic('check')}</span><span>Оберіть сухе вікно без вітру понад 15 км/г.</span></div>
            <div class="list-check__item"><span class="list-check__icon list-check__icon--amber">${ic('alert')}</span><span>Дотримуйтеся строку очікування препарату до збору врожаю.</span></div>
          </div>
        </section>
        <section class="card result-section">
          <h3 class="h3">Останні події ділянки</h3>
          ${entries.length ? `<div class="mt-12">${entries.map(j => `<div class="journal-item" style="background:transparent;border:0;border-bottom:1px solid var(--line);border-radius:0"><span class="journal-item__icon">${ic(j.icon || 'scan')}</span><span class="journal-item__body"><strong>${esc(j.title)}</strong><span>${esc(j.sub || '')}</span></span><span class="journal-item__time">${Utils.relative(j.createdAt)}</span></div>`).join('')}</div>` : empty('journal', 'Подій ще немає', 'Запустіть сканування або додайте нотатку.')}
        </section>
      </div>`;
  }

  return {
    esc, ic, pageHead, sectionHead, empty, statusBadge, waterPill, riskBadge,
    navItems, home, plants, plant, field, journalRow
  };
})();

const Views = (() => {
  const pages = {
    home: V.home,
    plants: V.plants,
    plant: id => V.plant(id),
    field: id => V.field(id)
  };

  return { pages, V };
})();
