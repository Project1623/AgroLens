/* AgroLens — scan, result, checker, journal, guide, weather */
(() => {
  const { ic, esc, pageHead, sectionHead, empty, riskBadge } = V;

  /* ---------------- scan ---------------- */

  Views.pages.scan = function scan() {
    const s = Store.get();
    const homeMode = s.mode === 'home';
    const sc = UI.scan;
    const selected = DATA.SAMPLES.find(x => x.id === sc.sampleId);
    const crops = homeMode
      ? [['monstera', 'Монстера'], ['ficus', 'Фікус'], ['basil', 'Базилік'], ['tomato', 'Томат'], ['generic', 'Інша рослина']]
      : [['tomato', 'Томат'], ['cucumber', 'Огірок'], ['apple', 'Яблуня'], ['wheat', 'Пшениця'], ['potato', 'Картопля'], ['generic', 'Інша культура']];
    const samples = DATA.SAMPLES.filter(x => homeMode ? x.mode === 'home' : x.mode === 'farm');

    const preview = sc.dataUrl
      ? `<div class="preview">
          <img src="${sc.dataUrl}" alt="Фото для діагностики">
          <span class="preview__shade"></span>
          <span class="preview__badge badge badge--glass">${ic('camera')} ${esc(sc.fileName || 'фото')}</span>
          <div class="preview__bar">
            <button class="btn btn--mint btn--sm" data-action="scan-run">${ic('sparkles')} Аналізувати</button>
            <button class="btn btn--glass btn--sm" data-action="scan-reset">${ic('refresh')} Інше фото</button>
          </div>
        </div>`
      : `<label class="dropzone" data-dropzone>
          <input type="file" accept="image/*" capture="environment" id="scan-file" data-input="scan-file">
          <span class="dropzone__corner dropzone__corner--tl"></span>
          <span class="dropzone__corner dropzone__corner--tr"></span>
          <span class="dropzone__corner dropzone__corner--bl"></span>
          <span class="dropzone__corner dropzone__corner--br"></span>
          <span class="dropzone__icon">${ic('camera')}</span>
          <strong>Сфотографуйте листок</strong>
          <span>Наведіть камеру на уражену ділянку при денному світлі. Або перетягніть файл сюди — JPG чи PNG до 8 МБ.</span>
          <span class="dropzone__cta btn btn--primary btn--sm">${ic('upload')} Обрати фото</span>
        </label>`;

    return `
      ${pageHead({
        eyebrow: ic('scan') + ' Крок 1 · фото',
        title: 'Діагностика за фото',
        sub: homeMode ? 'Один листок — і ви знаєте, що з рослиною. Працює офлайн у демо-режимі, а з ключем Gemini аналізує реальне фото.' : 'Скануйте листя, плоди або ділянку. Отримайте діагноз, ступінь ризику та план обробки з урахуванням погоди.',
        actions: `<a class="btn btn--ghost" href="#/checker">${ic('stethoscope')} Без фото: симптом-чекер</a>`
      })}
      <div class="scan-layout">
        <section class="card upload-card">
          ${preview}
          <div class="flex wrap mt-12" style="justify-content:space-between">
            <div class="field" style="margin:0;flex:1;min-width:190px">
              <label for="scan-crop">Що на фото</label>
              <select class="select" id="scan-crop" data-input="scan-crop">
                ${crops.map(([id, label]) => `<option value="${id}" ${sc.crop === id ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </div>
            <div class="field" style="margin:0;flex:1;min-width:170px">
              <label>Режим аналізу</label>
              <div class="chip-row" style="height:40px;align-items:center">
                <span class="chip chip--sm ${s.apiKey ? 'chip--green' : ''}">${ic(s.apiKey ? 'sparkles' : 'shield')} ${s.apiKey ? 'Gemini vision' : 'демо-база'}</span>
              </div>
            </div>
          </div>
          <div class="inline-note mt-12">${ic('info')} Демо-режим миттєво повертає результат із локальної бази знань. Реальний AI вмикається після ключа Google AI Studio у налаштуваннях.</div>
        </section>

        <div class="scan-side">
          <section class="card panel">
            <div class="panel__head"><h3 class="panel__title">Як це працює</h3><span class="badge badge--green">3 кроки</span></div>
            <div class="scan-steps">
              <div class="scan-step ${sc.dataUrl ? 'is-done' : 'is-active'}"><span class="scan-step__dot">${ic('check')}</span><span>Фото або демо-листок</span></div>
              <div class="scan-step ${sc.dataUrl ? 'is-active' : ''}"><span class="scan-step__dot">${ic('check')}</span><span>Аналіз і впевненість</span></div>
              <div class="scan-step"><span class="scan-step__dot">${ic('check')}</span><span>План лікування та вікно обробки</span></div>
            </div>
          </section>

          <section class="card panel">
            <div class="panel__head"><h3 class="panel__title">Демо-зразки</h3><span class="tiny">без камери</span></div>
            <div class="sample-row">
              ${samples.map(x => {
                const d = DATA.byId[x.disease];
                return `<button class="sample ${sc.sampleId === x.id ? 'is-active' : ''}" data-action="scan-sample" data-id="${x.id}" type="button" title="${esc(x.label)} — ${esc(x.note)}">
                  ${Art.scanCard(x.type, d ? d.lesion : 'none', { scan: false })}
                  <span class="sample__label"><b>${esc(x.label)}</b><span>${esc(x.note)}</span></span>
                </button>`;
              }).join('')}
            </div>
            ${selected ? `<div class="inline-note mt-12">${ic('target')} Обрано: <strong>${esc(selected.label)}</strong> · ${esc(selected.note)}. Натисніть «Аналізувати».</div>` : ''}
          </section>

          <section class="card panel">
            <div class="panel__head"><h3 class="panel__title">Щоб діагноз був точним</h3></div>
            <div class="tips">
              <div class="tip"><span class="tip__n">1</span><span>Заповніть кадр листком, не розмивайте фон.</span></div>
              <div class="tip"><span class="tip__n">2</span><span>Знімайте при денному світлі, без спалаху.</span></div>
              <div class="tip"><span class="tip__n">3</span><span>Покажіть і верхній, і нижній бік листка.</span></div>
              <div class="tip"><span class="tip__n">4</span><span>Додайте фото плода або стебла, якщо є плями.</span></div>
            </div>
          </section>
        </div>
      </div>

      ${sc.sampleId || sc.dataUrl ? `<div class="result-actions" style="justify-content:center;margin-top:20px">
        <button class="btn btn--primary btn--lg" data-action="scan-run">${ic('sparkles')} Аналізувати ${sc.sampleId ? 'демо-зразок' : 'фото'}</button>
        <button class="btn btn--ghost btn--lg" data-action="scan-reset">${ic('refresh')} Скинути</button>
      </div>` : ''}`;
  };

  /* ---------------- result ---------------- */

  Views.pages.result = function result() {
    const r = UI.result || Store.get().lastResult;
    if (!r) {
      return `${pageHead({ eyebrow: ic('scan'), title: 'Результат діагностики', sub: 'Тут з’явиться діагноз після сканування.' })}
        ${empty('scan', 'Ще немає результату', 'Сфотографуйте листок або оберіть демо-зразок — діагноз і план лікування з’являться тут.', `<a class="btn btn--primary mt-16" href="#/scan">${ic('scan')} До сканування</a>`)}`;
    }
    const sev = DATA.SEVERITY[r.severity] || DATA.SEVERITY.medium;
    const tab = UI.resultTab || 'immediate';
    const tabs = [
      ['immediate', 'Невідкладно'],
      ['organic', 'Біологічно'],
      ['chemical', 'Препарати'],
      ['prevention', 'Профілактика']
    ];
    const steps = (r.treatment && r.treatment[tab]) || [];
    const weather = Store.get().weather;
    const windowText = weather ? AI.bestWindowText(weather) : 'завантажте прогноз';

    return `
      <div class="result-head">
        <a class="btn btn--ghost btn--sm" href="#/scan">${ic('arrow-left')} Нове сканування</a>
        <span class="badge badge--${r.source === 'gemini' ? 'green' : 'amber'}">${ic(r.source === 'gemini' ? 'sparkles' : 'shield')} ${r.source === 'gemini' ? 'Gemini vision' : 'демо-база'}</span>
        <span class="spacer"></span>
        <button class="btn btn--ghost btn--sm" data-action="result-save">${ic('journal')} ${r.saved ? 'Збережено' : 'Зберегти в журнал'}</button>
        <button class="btn btn--ghost btn--sm" data-action="result-share">${ic('share')} Поділитися</button>
      </div>

      <section class="card result-hero">
        <div class="result-hero__art">${Art.scanCard(r.art || 'generic', r.lesion || 'none', { scan: false })}</div>
        <div class="result-hero__body">
          <div class="flex wrap"><span class="badge badge--${r.severity === 'high' ? 'danger' : r.severity === 'low' ? 'green' : 'amber'}">${sev.label} ризик</span><span class="badge badge--green">${esc(r.plant || 'Рослина')}</span></div>
          <h1 class="h1 mt-12">${esc(r.diagnosis)}</h1>
          ${r.latin ? `<p class="latin">${esc(r.latin)}</p>` : ''}
          <p class="sub mt-12">${esc(r.summary || '')}</p>
          <div class="confidence mt-16">
            <span class="confidence__ring">${Art.ring(r.confidence, sev.color, 40, 3.5)}</span>
            <span class="confidence__text"><strong>${r.confidence}% впевненості</strong><span>${r.source === 'gemini' ? 'аналіз Gemini за фото' : 'локальна база · демо'}</span></span>
          </div>
          <div class="result-actions">
            <button class="btn btn--primary" data-action="result-save">${ic('check')} Зберегти план</button>
            <a class="btn btn--ghost" href="#/chat">${ic('chat')} Спитати агронома</a>
            <a class="btn btn--ghost" href="#/scan">${ic('refresh')} Ще фото</a>
          </div>
          <div class="disclaimer">${ic('info')} ${esc(r.disclaimer || 'Це не лабораторний висновок.')}</div>
        </div>
      </section>

      <div class="result-grid">
        <section class="card result-section">
          <h3 class="h3">Що зробити</h3>
          <p class="small mt-4">Порядок дій залежить від стадії. Почніть із невідкладних кроків.</p>
          <div class="treatment-tabs">
            ${tabs.map(([id, label]) => `<button class="${tab === id ? 'is-active' : ''}" data-action="result-tab" data-tab="${id}" type="button">${label}</button>`).join('')}
          </div>
          <ul class="treatment-list">
            ${steps.map(s => `<li>${esc(s)}</li>`).join('') || '<li>Для цього розділу немає окремих кроків — дотримуйтеся загального плану.</li>'}
          </ul>
          <div class="weather-window mt-16">
            <span class="weather-window__icon">${ic('cloud')}</span>
            <span><strong>Вікно для обробки</strong><span>${esc(windowText)}</span></span>
          </div>
        </section>

        <div class="scan-side">
          <section class="card result-section">
            <h3 class="h3">Симптоми на фото</h3>
            <div class="list-check">
              ${(r.symptoms || []).slice(0, 5).map(x => `<div class="list-check__item"><span class="list-check__icon">${ic('check')}</span><span>${esc(x)}</span></div>`).join('')}
            </div>
          </section>
          <section class="card result-section">
            <h3 class="h3">Імовірні причини</h3>
            <div class="list-check">
              ${(r.causes || []).slice(0, 4).map(x => `<div class="list-check__item"><span class="list-check__icon list-check__icon--amber">${ic('alert')}</span><span>${esc(x)}</span></div>`).join('')}
            </div>
            ${r.weatherNote ? `<div class="inline-note mt-12">${ic('cloud')} ${esc(r.weatherNote)}</div>` : ''}
          </section>
          <section class="card result-section">
            <h3 class="h3">Профілактика</h3>
            <div class="list-check">
              ${(r.treatment?.prevention || []).slice(0, 3).map(x => `<div class="list-check__item"><span class="list-check__icon">${ic('shield')}</span><span>${esc(x)}</span></div>`).join('')}
            </div>
          </section>
        </div>
      </div>`;
  };

  /* ---------------- symptom checker ---------------- */

  Views.pages.checker = function checker() {
    const c = UI.checker;
    const step = c.step;
    const stepper = `<div class="checker-steps">
      ${[[1, 'Частина'], [2, 'Симптоми'], [3, 'Умови'], [4, 'Результат']].map(([n, label], i) => `
        ${i ? '<span class="checker-line"></span>' : ''}
        <span class="checker-step ${step === n ? 'is-active' : step > n ? 'is-done' : ''}"><span class="checker-step__n">${step > n ? ic('check') : n}</span>${label}</span>`).join('')}
    </div>`;

    let body = '';
    if (step === 1) {
      body = `<section class="card result-section">
        <h3 class="h3">Що оглядаємо?</h3>
        <p class="small mt-4">Оберіть частину рослини, яка виглядає незвично.</p>
        <div class="choice-grid mt-16">
          ${DATA.PARTS.map(p => `<button class="choice ${c.part === p.id ? 'is-active' : ''}" data-action="checker-part" data-id="${p.id}" type="button"><span class="choice__icon">${ic(p.icon)}</span><strong>${p.label}</strong><span>${p.hint}</span></button>`).join('')}
        </div>
        <div class="result-actions"><span class="spacer"></span><button class="btn btn--primary" data-action="checker-next" ${c.part ? '' : 'disabled'}>Далі: симптоми ${ic('arrow-right')}</button></div>
      </section>`;
    } else if (step === 2) {
      body = `<section class="card result-section">
        <h3 class="h3">Що ви бачите?</h3>
        <p class="small mt-4">Позначте все, що помітили. Можна кілька варіантів.</p>
        <div class="symptom-grid mt-16">
          ${DATA.SYMPTOMS.map(s => `<button class="symptom ${c.symptoms.includes(s.id) ? 'is-active' : ''}" data-action="checker-sym" data-id="${s.id}" type="button">${ic(s.icon)} ${s.label}</button>`).join('')}
        </div>
        <div class="result-actions">
          <button class="btn btn--ghost" data-action="checker-back">${ic('arrow-left')} Назад</button>
          <span class="spacer"></span>
          <button class="btn btn--primary" data-action="checker-next" ${c.symptoms.length ? '' : 'disabled'}>Далі: умови ${ic('arrow-right')}</button>
        </div>
      </section>`;
    } else if (step === 3) {
      body = `<section class="card result-section">
        <h3 class="h3">Умови утримання</h3>
        <p class="small mt-4">Це допомагає відрізнити хворобу від проблеми догляду.</p>
        <div class="context-grid mt-16">
          ${Object.entries(DATA.CONTEXT).map(([group, opts]) => `<div class="context-group"><h4 class="h4">${group === 'watering' ? 'Полив' : group === 'light' ? 'Світло' : 'Місце'}</h4><div class="context-opts">${opts.map(o => `<button class="chip ${c.context[group] === o.id ? 'is-active' : ''}" data-action="checker-context" data-group="${group}" data-id="${o.id}" type="button">${o.label}</button>`).join('')}</div></div>`).join('')}
        </div>
        <div class="result-actions">
          <button class="btn btn--ghost" data-action="checker-back">${ic('arrow-left')} Назад</button>
          <span class="spacer"></span>
          <button class="btn btn--primary" data-action="checker-run">${ic('sparkles')} Показати ймовірні причини</button>
        </div>
      </section>`;
    } else {
      const res = c.results || [];
      body = `<section class="card result-section">
        <div class="flex-between wrap"><div><h3 class="h3">Можливі причини</h3><p class="small mt-4">Розрахунок за ${c.symptoms.length} ${c.symptoms.length === 1 ? 'симптомом' : 'симптомами'} та умовами утримання.</p></div><button class="btn btn--ghost btn--sm" data-action="checker-reset">${ic('refresh')} Спочатку</button></div>
        ${res.length ? `<div class="cause-list">
          ${res.map((x, i) => `<div class="cause">
            <div class="cause__top"><span class="cause__rank">${i + 1}</span><span class="cause__text"><strong>${esc(x.disease.name)}</strong><span>${esc(x.disease.summary)}</span></span><span class="cause__pct">${x.pct}%</span></div>
            <div class="cause__bar"><i style="width:${x.pct}%"></i></div>
            <div class="cause__actions">
              <a class="chip chip--sm chip--green" href="#/scan">${ic('scan')} Сканувати фото</a>
              <button class="chip chip--sm" data-action="guide-open" data-id="${x.disease.id}" type="button">${ic('book')} У довідник</button>
              <button class="chip chip--sm" data-action="checker-pick" data-id="${x.disease.id}" type="button">${ic('sparkles')} Повний план</button>
            </div>
          </div>`).join('')}
        </div>` : `${empty('search', 'Недостатньо даних', 'Позначте більше симптомів або додайте фото — так результат буде точнішим.')}`}
      </section>`;
    }

    return `${pageHead({
      eyebrow: ic('stethoscope') + ' Без фото',
      title: 'Симптом-чекер',
      sub: 'Покроковий розбір: частина рослини, симптоми, умови. Працює офлайн і не потребує ключа.',
      actions: `<a class="btn btn--primary" href="#/scan">${ic('scan')} Сканувати листок</a>`
    })}${stepper}${body}`;
  };

  /* ---------------- journal ---------------- */

  Views.pages.journal = function journal() {
    const s = Store.get();
    const st = Store.stats();
    const filter = UI.journal.filter || 'all';
    const filters = [['all', 'Усі'], ['scan', 'Діагностика'], ['water', 'Полив'], ['treatment', 'Обробки'], ['note', 'Нотатки']];
    const list = s.journal.filter(j => filter === 'all' || j.type === filter);
    const groups = {};
    list.forEach(j => {
      const key = new Date(j.createdAt).toDateString();
      (groups[key] = groups[key] || []).push(j);
    });
    const dayLabel = key => {
      const d = new Date(key);
      const diff = Utils.daysBetween(d, new Date());
      if (diff === 0) return 'Сьогодні · ' + Utils.fmtDate(d);
      if (diff === 1) return 'Учора · ' + Utils.fmtDate(d);
      return Utils.weekday(d) + ' · ' + Utils.fmtDate(d, true);
    };

    return `${pageHead({
      eyebrow: ic('journal') + ' Історія догляду',
      title: 'Журнал',
      sub: 'Кожен полив, скан і обробка зберігаються на пристрої. Це допомагає бачити динаміку й не повторювати помилок.',
      actions: `<button class="btn btn--ghost" data-action="journal-note">${ic('plus')} Додати нотатку</button><button class="btn btn--ghost" data-action="export-data">${ic('download')} Експорт</button>`
    })}
    <div class="journal-stats">
      <div class="jstat"><strong>${st.journal}</strong><span>усього подій</span></div>
      <div class="jstat"><strong>${st.scans}</strong><span>діагностик</span></div>
      <div class="jstat"><strong>${s.journal.filter(j => j.type === 'water').length}</strong><span>поливів</span></div>
      <div class="jstat"><strong>${s.journal.filter(j => j.type === 'treatment').length}</strong><span>обробок</span></div>
    </div>
    <div class="journal-filters">
      ${filters.map(([id, label]) => `<button class="chip ${filter === id ? 'is-active' : ''}" data-action="journal-filter" data-filter="${id}">${label}</button>`).join('')}
    </div>
    ${Object.keys(groups).length ? Object.entries(groups).map(([key, items]) => `
      <div class="journal-day">
        <div class="journal-day__label">${dayLabel(key)}<span class="divider" style="flex:1;margin:0"></span></div>
        ${items.map(j => {
          const icon = j.icon === 'drop' ? 'drop' : j.icon === 'bug' ? 'bug' : j.icon === 'spray' ? 'spray' : j.icon === 'pot' ? 'pot' : j.icon === 'trash' ? 'trash' : j.icon === 'plus' ? 'plus' : 'scan';
          const cls = j.status === 'danger' ? 'journal-item__icon--danger' : j.status === 'warning' ? 'journal-item__icon--amber' : '';
          return `<div class="journal-item">
            <span class="journal-item__icon ${cls}">${ic(icon)}</span>
            <span class="journal-item__body"><strong>${esc(j.title)}</strong><span>${esc(j.sub || '')}${j.plant ? ' · ' + esc(j.plant) : ''}</span></span>
            <span class="journal-item__time">${Utils.fmtTime(j.createdAt)}</span>
            <span class="journal-item__status">${j.status === 'warning' ? `<span class="badge badge--amber">огляд</span>` : j.status === 'danger' ? `<span class="badge badge--danger">ризик</span>` : `<span class="badge badge--green">ок</span>`}</span>
          </div>`;
        }).join('')}
      </div>`).join('') : empty('journal', 'Записів не знайдено', 'Змініть фільтр або додайте першу подію.', `<a class="btn btn--primary mt-16" href="#/scan">${ic('scan')} Сканувати</a>`)}`;
  };

  /* ---------------- guide ---------------- */

  Views.pages.guide = function guide() {
    const q = (UI.guide.q || '').toLowerCase();
    const cat = UI.guide.category || 'all';
    const list = DATA.DISEASES.filter(d => {
      if (cat !== 'all' && d.category !== cat) return false;
      if (!q) return true;
      return (d.name + ' ' + d.latin + ' ' + d.summary + ' ' + d.symptoms.join(' ')).toLowerCase().includes(q);
    });
    return `${pageHead({
      eyebrow: ic('book') + ' Офлайн-довідник',
      title: 'Довідник хвороб',
      sub: '16 поширених хвороб, шкідників і проблем догляду. Працює без інтернету — база вбудована в застосунок.',
      actions: `<a class="btn btn--primary" href="#/scan">${ic('scan')} Перевірити фото</a>`
    })}
    <div class="guide-tools">
      <label class="search">${ic('search')}<input type="search" placeholder="Пошук: фітофтороз, попелиця, жовте листя…" value="${esc(UI.guide.q || '')}" data-input="guide-q"></label>
    </div>
    <div class="chip-row" style="margin-bottom:16px">
      <button class="chip ${cat === 'all' ? 'is-active' : ''}" data-action="guide-filter" data-cat="all">Усі · ${DATA.DISEASES.length}</button>
      ${Object.entries(DATA.CATEGORIES).map(([id, c]) => `<button class="chip ${cat === id ? 'is-active' : ''}" data-action="guide-filter" data-cat="${id}">${ic(c.icon)} ${c.label}</button>`).join('')}
    </div>
    ${list.length ? `<div class="guide-grid">
      ${list.map(d => `<button class="guide-card" data-action="guide-open" data-id="${d.id}" type="button">
        <span class="guide-card__art">${Art.scanCard(d.art, d.lesion, { scan: false })}</span>
        <span class="guide-card__body">
          <strong>${esc(d.name)}</strong>
          <small>${esc(d.latin)}</small>
          <span class="guide-card__desc">${esc(d.summary)}</span>
          <span class="guide-card__tags"><span class="chip chip--sm">${DATA.CATEGORIES[d.category].label}</span>${d.household ? '<span class="chip chip--sm">кімнатні</span>' : ''}</span>
        </span>
      </button>`).join('')}
    </div>` : empty('search', 'Нічого не знайдено', 'Спробуйте інший запит або скиньте фільтр категорії.', `<button class="btn btn--ghost mt-16" data-action="guide-reset">${ic('refresh')} Скинути пошук</button>`)}`;
  };

  /* ---------------- weather ---------------- */

  Views.pages.weather = function weatherPage() {
    const s = Store.get();
    const w = s.weather;
    if (!w) {
      return `${pageHead({ eyebrow: ic('cloud') + ' Прогноз', title: 'Погода й ризики', sub: 'Завантажуємо прогноз для Тернополя…' })}
        <section class="card result-section">${empty('cloud', 'Оновлюємо прогноз', 'Дані Open-Meteo завантажуються автоматично. Якщо мережі немає — покажемо демо-прогноз.', `<button class="btn btn--primary mt-16" data-action="weather-refresh">${ic('refresh')} Оновити зараз</button>`)}</section>`;
    }
    const info = DATA.weatherInfo(w.current.code);
    const risk = AI.riskIndex(w);
    const windows = AI.treatmentWindows(w);
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const forecast = (w.daily || []).slice(0, 7).map((d, i) => `<div class="forecast-day">
      <span class="forecast-day__name">${i === 0 ? 'Сьогодні' : days[d.weekday]}</span>
      <span class="forecast-day__icon">${Art.weather(d.code)}</span>
      <span class="forecast-day__max">${d.max}°</span>
      <span class="forecast-day__min">${d.min}°</span>
      <span class="forecast-day__rain">${ic('drop')} ${d.rain}%</span>
    </div>`).join('');
    const maxT = Math.max(...(w.hourly || []).slice(0, 24).map(h => h.temp), 1);
    const minT = Math.min(...(w.hourly || []).slice(0, 24).map(h => h.temp), 0);
    const hourly = (w.hourly || []).slice(0, 24).map(h => {
      const pct = Utils.clamp(Math.round(((h.temp - minT) / Math.max(maxT - minT, 1)) * 74 + 18), 12, 100);
      return `<div title="${Utils.pad(h.hour)}:00 · ${h.temp}° · дощ ${h.rain}% · вітер ${h.wind} км/г" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
        <div style="height:${pct}%;border-radius:5px 5px 3px 3px;background:${h.rain > 45 ? 'linear-gradient(180deg,#7FA9C9,#4D7EA8)' : 'linear-gradient(180deg,#9FD8AC,#4E9B62)'}"></div>
      </div>`;
    }).join('');

    return `${pageHead({
      eyebrow: ic('cloud') + ' Open-Meteo · ' + esc(w.location),
      title: 'Погода й ризики',
      sub: 'Ризик хвороб, вікно для обробки та прогноз на тиждень. Оновлення кожні 30 хвилин; без мережі — демо-дані.',
      actions: `<button class="btn btn--ghost" data-action="weather-refresh">${ic('refresh')} Оновити</button>`
    })}
    <section class="card card--dark weather-hero">
      <div class="weather-hero__body">
        <div class="weather-hero__top"><span class="badge badge--glass">${w.demo ? 'демо-прогноз' : 'актуальний прогноз'}</span>${w.stale ? '<span class="badge badge--amber">офлайн-копія</span>' : ''}<span class="badge badge--glass">оновлено ${Utils.fmtTime(w.updated)}</span></div>
        <div class="weather-hero__temp">${Math.round(w.current.temp)}<sup>°C</sup></div>
        <div class="weather-hero__cond">${info.label}</div>
        <div class="weather-hero__meta">
          <span class="weather-meta">${ic('thermometer')} відчувається ${Math.round(w.current.feels)}°</span>
          <span class="weather-meta">${ic('humidity')} вологість ${w.current.humidity}%</span>
          <span class="weather-meta">${ic('wind')} вітер ${w.current.wind} км/г</span>
          <span class="weather-meta">${ic('drop')} опади ${w.current.precip} мм</span>
        </div>
      </div>
      <div class="weather-hero__art">${Art.weather(w.current.code)}</div>
    </section>

    <div class="section-head"><h2 class="h2">Ризик хвороб</h2><span class="badge badge--${risk.overall >= 70 ? 'danger' : risk.overall >= 45 ? 'amber' : 'green'}">${risk.level}</span></div>
    <section class="card risk-card">
      <div class="gauge">${Art.ring(risk.overall, risk.color, 168, 10)}<div class="gauge__text"><strong>${risk.overall}</strong><span>індекс ризику</span></div></div>
      <div class="risk-list">
        ${risk.parts.map(p => `<div class="risk-row"><span class="risk-row__name">${p.name}</span><span class="risk-row__bar"><i style="width:${p.value}%;background:${p.color}"></i></span><span class="risk-row__val">${p.value}%</span></div>`).join('')}
        <div class="inline-note mt-8">${ic('info')} Індекс враховує вологість, опади й температуру. Обробка доцільна при ризику вище 45% та сухому вікні.</div>
      </div>
    </section>

    <div class="section-head"><h2 class="h2">Прогноз на 7 днів</h2><span class="tiny">${esc(w.location)}</span></div>
    <section class="card"><div class="forecast">${forecast}</div></section>

    <div class="grid-2 mt-16">
      <section class="card result-section">
        <h3 class="h3">Вікна для обробки</h3>
        <p class="small mt-4">Температура 5–26 °C, вітер до 15 км/г, ймовірність дощу до 35%.</p>
        <div class="window-list mt-12">
          ${windows.length ? windows.map(x => `<div class="window-row"><span class="window-row__time">${x.label}</span><span class="window-row__icon">${ic('sun')}</span><span class="window-row__text">${x.temp}°, вітер ${x.wind} км/г, дощ ${x.rain}%</span><span class="window-row__score">${x.score}/100</span></div>`).join('') : `<div class="inline-note">${ic('alert')} Найближчі 24 години немає придатного вікна. Не обробляйте перед дощем.</div>`}
        </div>
      </section>
      <section class="card result-section">
        <h3 class="h3">Температура за 24 години</h3>
        <p class="small mt-4">Висота стовпчика — температура, синій колір — висока ймовірність дощу.</p>
        <div style="display:flex;gap:3px;align-items:flex-end;height:120px;margin-top:18px">${hourly}</div>
        <div class="flex-between mt-8 tiny"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
      </section>
    </div>`;
  };
})();
