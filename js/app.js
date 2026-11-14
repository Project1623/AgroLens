/* AgroLens — router, UI state, events and flows */
const UI = {
  route: { name: 'home', id: null },
  scan: { sampleId: null, dataUrl: null, fileName: '', mime: 'image/jpeg', crop: 'tomato', analyzing: false },
  checker: { step: 1, part: null, symptoms: [], context: {}, results: null },
  journal: { filter: 'all' },
  guide: { q: '', category: 'all' },
  plants: { q: '', filter: 'all' },
  chat: { busy: false, draft: '' },
  settings: { status: null, pendingKey: null },
  result: null,
  resultTab: 'immediate',
  onboardStep: 0,
  weatherLoading: false
};

const App = (() => {
  const $ = sel => document.querySelector(sel);
  const view = $('#view');
  const nav = $('#nav-desktop');
  const tabbar = $('#tabbar');
  const modalRoot = $('#modal-root');
  const sheetRoot = $('#sheet-root');
  const toastRoot = $('#toast-root');
  let searchTimer = null;
  let overlayTimer = null;
  let booted = false;

  const TITLES = {
    home: 'Огляд', scan: 'Діагностика', result: 'Результат', plants: 'Рослини',
    checker: 'Симптом-чекер', journal: 'Журнал', guide: 'Довідник',
    weather: 'Погода й ризики', chat: 'Агроном', settings: 'Налаштування', project: 'Про проєкт'
  };

  /* ---------------- routing ---------------- */

  function parseHash() {
    const raw = (location.hash || '#/home').replace(/^#\/?/, '');
    const [name, id] = raw.split('/');
    const known = ['home', 'scan', 'result', 'plants', 'plant', 'field', 'checker', 'journal', 'guide', 'weather', 'chat', 'settings', 'project'];
    if (!known.includes(name)) return { name: 'home', id: null };
    return { name, id: id || null };
  }

  function render() {
    const next = parseHash();
    const changed = next.name !== UI.route.name || next.id !== UI.route.id;
    UI.route = next;
    const page = Views.pages[next.name];
    let html = '';
    try {
      html = page ? page(next.id) : Views.pages.home();
    } catch (e) {
      console.error('AgroLens render error', e);
      html = `<div class="card result-section"><h1 class="h1">Щось пішло не так</h1><p class="sub mt-8">Не вдалося побудувати екран. Оновіть сторінку або поверніться на головну.</p><a class="btn btn--primary mt-16" href="#/home">На головну</a></div>`;
    }
    view.innerHTML = html;
    if (changed) window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    document.title = `AgroLens — ${TITLES[next.name] || 'plant intelligence'}`;
    renderNav();
    updateChrome();
    afterRender();
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function afterRender() {
    hydrateIcons();
    if (UI.route.name === 'chat') scrollChat();
    if (UI.route.name === 'weather' && !Store.get().weather && !UI.weatherLoading) loadWeather(false);
    bindDropzone();
  }

  function renderNav() {
    const mode = Store.get().mode;
    const items = V.navItems(mode);
    const active = UI.route.name === 'plant' || UI.route.name === 'field' ? 'plants' : UI.route.name === 'result' ? 'scan' : UI.route.name;
    nav.innerHTML = `<div class="nav__label">Простір</div>
      ${items.map(it => `<a class="nav__item ${active === it.href.replace('#/', '') ? 'is-active' : ''}" href="${it.href}">${Icons.get(it.icon)}<span>${it.label}</span>${it.badge ? `<span class="nav__badge">${it.badge}</span>` : ''}</a>`).join('')}
      <div class="nav__label" style="margin-top:14px">Система</div>
      <a class="nav__item ${active === 'settings' ? 'is-active' : ''}" href="#/settings">${Icons.get('settings')}<span>Налаштування</span></a>
      <a class="nav__item ${active === 'project' ? 'is-active' : ''}" href="#/project">${Icons.get('file-text')}<span>Про проєкт</span></a>`;

    tabbar.innerHTML = [
      { href: '#/home', icon: 'home', label: 'Огляд', key: 'home' },
      { href: '#/plants', icon: mode === 'home' ? 'pot' : 'sprout', label: mode === 'home' ? 'Рослини' : 'Поля', key: 'plants' },
      { href: '#/scan', icon: 'scan', label: 'Скан', key: 'scan', scan: true },
      { href: '#/chat', icon: 'chat', label: 'Агроном', key: 'chat' },
      { href: '#/settings', icon: 'more', label: 'Ще', key: 'settings' }
    ].map(it => it.scan
      ? `<a class="tabbar__item tabbar__item--scan ${active === it.key ? 'is-active' : ''}" href="${it.href}"><span class="tabbar__scan">${Icons.get(it.icon)}</span><span>${it.label}</span></a>`
      : `<a class="tabbar__item ${active === it.key ? 'is-active' : ''}" href="${it.href}">${Icons.get(it.icon)}<span>${it.label}</span></a>`).join('');
  }

  function updateChrome() {
    const s = Store.get();
    document.documentElement.dataset.theme = s.theme;
    document.body.dataset.theme = s.theme;
    document.body.dataset.mode = s.mode;
    document.querySelectorAll('[data-mode-set]').forEach(b => b.classList.toggle('is-active', b.dataset.modeSet === s.mode));

    const chip = $('[data-ai-chip]');
    if (chip) chip.dataset.state = s.apiKey ? 'ready' : 'demo';
    const t1 = $('[data-ai-chip-title]');
    const t2 = $('[data-ai-chip-sub]');
    if (t1) t1.textContent = s.apiKey ? 'Gemini підключено' : 'Демо-режим';
    if (t2) t2.textContent = s.apiKey ? s.model + ' · реальний AI' : 'Підключити Gemini';
    const top = $('[data-ai-top]');
    if (top) top.classList.toggle('is-demo', !s.apiKey);
    const topLabel = $('[data-ai-top-label]');
    if (topLabel) topLabel.textContent = s.apiKey ? 'Gemini' : 'Демо';

    document.querySelectorAll('[data-action="toggle-theme"]').forEach(b => {
      b.dataset.icon = s.theme === 'dark' ? 'sun' : 'moon';
      b.innerHTML = Icons.get(s.theme === 'dark' ? 'sun' : 'moon');
      b.setAttribute('aria-label', s.theme === 'dark' ? 'Світла тема' : 'Темна тема');
    });
    hydrateIcons();
  }

  function hydrateIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => {
      if (el.dataset.iconDone === el.dataset.icon) return;
      el.innerHTML = Icons.get(el.dataset.icon);
      el.dataset.iconDone = el.dataset.icon;
    });
  }

  /* ---------------- toasts and overlays ---------------- */

  function toast(text, kind = 'ok') {
    const icon = kind === 'danger' ? 'alert-circle' : kind === 'warn' ? 'alert' : 'check-circle';
    const el = document.createElement('div');
    el.className = 'toast' + (kind === 'warn' ? ' toast--warn' : kind === 'danger' ? ' toast--danger' : '');
    el.innerHTML = `${Icons.get(icon)}<span>${Utils.escape(text)}</span>`;
    toastRoot.appendChild(el);
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 320); }, 3400);
  }

  function openModal(html) {
    sheetRoot.innerHTML = '';
    modalRoot.innerHTML = `<div class="modal-backdrop" data-action="modal-close"></div><div class="modal" role="dialog" aria-modal="true"><div class="modal__panel">${html}</div></div>`;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const first = modalRoot.querySelector('input, select, textarea, button:not([data-action="modal-close"])');
      if (first) first.focus({ preventScroll: true });
    }, 60);
  }

  function closeModal() {
    modalRoot.innerHTML = '';
    document.body.style.overflow = '';
  }

  function openSheet() {
    sheetRoot.innerHTML = `<div class="modal-backdrop" data-action="close-sheet"></div>${Views.sheet()}`;
  }

  function closeSheet() { sheetRoot.innerHTML = ''; }

  function showScanOverlay() {
    const sc = UI.scan;
    const visual = sc.dataUrl
      ? `<img src="${sc.dataUrl}" alt="">`
      : Art.scanCard((DATA.SAMPLES.find(x => x.id === sc.sampleId) || {}).type || 'tomato', (DATA.byId[(DATA.SAMPLES.find(x => x.id === sc.sampleId) || {}).disease] || {}).lesion || 'none', { scan: true });
    modalRoot.innerHTML = `<div class="scan-overlay">
      <div class="scan-overlay__card">
        <div class="scan-overlay__visual">${visual}<span class="scan-overlay__line"></span><span class="scan-overlay__grid"></span><span class="scan-overlay__pct" data-scan-pct>0%</span></div>
        <h3 class="scan-overlay__title mt-16" data-scan-title>Читаю зображення…</h3>
        <p class="scan-overlay__sub" data-scan-sub>Визначаю культуру, колір і текстуру уражених ділянок.</p>
        <div class="scan-steps mt-16">
          <div class="scan-step is-active" data-scan-step="0"><span class="scan-step__dot">${Icons.get('check')}</span><span>Сегментація листка</span></div>
          <div class="scan-step" data-scan-step="1"><span class="scan-step__dot">${Icons.get('check')}</span><span>Порівняння з базою хвороб</span></div>
          <div class="scan-step" data-scan-step="2"><span class="scan-step__dot">${Icons.get('check')}</span><span>План лікування й погодне вікно</span></div>
        </div>
      </div>
    </div>`;
    let pct = 0;
    const steps = [
      [0, 'Читаю зображення…', 'Визначаю культуру, колір і текстуру уражених ділянок.'],
      [34, 'Порівнюю з базою…', 'Шукаю збіг за формою плям, нальотом і локалізацією.'],
      [68, 'Формую план…', 'Перевіряю погодне вікно та готую кроки лікування.'],
      [92, 'Майже готово…', 'Оцінюю впевненість і зберігаю результат.']
    ];
    const pctEl = modalRoot.querySelector('[data-scan-pct]');
    const titleEl = modalRoot.querySelector('[data-scan-title]');
    const subEl = modalRoot.querySelector('[data-scan-sub]');
    overlayTimer = setInterval(() => {
      pct = Math.min(97, pct + 3 + Math.random() * 5);
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
      const step = steps.filter(x => pct >= x[0]).pop();
      if (step) {
        if (titleEl) titleEl.textContent = step[1];
        if (subEl) subEl.textContent = step[2];
        const idx = steps.indexOf(step);
        modalRoot.querySelectorAll('[data-scan-step]').forEach(el => {
          const n = Number(el.dataset.scanStep);
          el.classList.toggle('is-done', n < idx);
          el.classList.toggle('is-active', n === idx);
        });
      }
    }, 180);
  }

  function hideScanOverlay() {
    clearInterval(overlayTimer);
    modalRoot.innerHTML = '';
  }

  /* ---------------- scan flow ---------------- */

  function bindDropzone() {
    const dz = view.querySelector('[data-dropzone]');
    if (!dz || dz.dataset.bound) return;
    dz.dataset.bound = '1';
    ['dragover', 'dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('is-over'); }));
    dz.addEventListener('drop', e => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) readImage(f);
    });
  }

  function readImage(file) {
    if (!file.type.startsWith('image/')) { toast('Потрібен файл зображення JPG або PNG', 'warn'); return; }
    if (file.size > 8 * 1024 * 1024) { toast('Фото більше 8 МБ — стисніть або оберіть інше', 'warn'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      UI.scan.dataUrl = reader.result;
      UI.scan.fileName = file.name;
      UI.scan.mime = file.type || 'image/jpeg';
      UI.scan.sampleId = null;
      render();
      toast('Фото готове до аналізу');
    };
    reader.onerror = () => toast('Не вдалося прочитати файл', 'danger');
    reader.readAsDataURL(file);
  }

  async function runScan() {
    const sc = UI.scan;
    if (!sc.sampleId && !sc.dataUrl) { toast('Сфотографуйте листок або оберіть демо-зразок', 'warn'); return; }
    if (sc.analyzing) return;
    sc.analyzing = true;
    showScanOverlay();
    const started = Date.now();
    let result;
    try {
      result = await AI.analyze({
        sampleId: sc.sampleId || undefined,
        dataUrl: sc.dataUrl || undefined,
        mime: sc.mime,
        crop: sc.sampleId ? (DATA.SAMPLES.find(x => x.id === sc.sampleId) || {}).type : sc.crop,
        mode: Store.get().mode,
        fileName: sc.fileName
      });
    } catch (e) {
      result = await AI.demoAnalyze({ sampleId: sc.sampleId || undefined, crop: sc.crop, mode: Store.get().mode, fileName: sc.fileName });
      result.fallbackReason = e.message;
    }
    const wait = Math.max(0, 1750 - (Date.now() - started));
    setTimeout(() => {
      hideScanOverlay();
      sc.analyzing = false;
      result.saved = false;
      UI.result = result;
      Store.setLastResult(result);
      UI.resultTab = 'immediate';
      go('#/result');
      if (result.fallbackReason) toast('AI недоступний — показано демо-результат', 'warn');
      else toast(result.source === 'gemini' ? 'Gemini проаналізував фото' : 'Демо-аналіз завершено');
    }, wait);
  }

  /* ---------------- chat ---------------- */

  function scrollChat() {
    const el = document.getElementById('chat-scroll');
    if (el) el.scrollTop = el.scrollHeight;
  }

  async function sendChat(text, image) {
    const clean = String(text || '').trim();
    if (!clean && !image) return;
    if (UI.chat.busy) return;
    Store.addChat({ role: 'user', text: clean || 'Що з рослиною на фото?', createdAt: new Date().toISOString() });
    UI.chat.draft = '';
    UI.chat.busy = true;
    render();
    scrollChat();
    try {
      const messages = Store.get().chat.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text }));
      const res = await AI.chat({ messages, image });
      Store.addChat({ role: 'assistant', text: res.text, source: res.source, createdAt: new Date().toISOString() });
      if (res.error) toast('Gemini не відповів — показую демо-пораду', 'warn');
    } catch (e) {
      Store.addChat({ role: 'assistant', text: 'Не вдалося отримати відповідь. Перевірте з’єднання або ключ у налаштуваннях — демо-режим працює завжди.', source: 'demo', createdAt: new Date().toISOString() });
      toast('Помилка чату', 'danger');
    }
    UI.chat.busy = false;
    render();
    scrollChat();
  }

  function readChatImage(file) {
    if (!file || !file.type.startsWith('image/')) { toast('Оберіть фото', 'warn'); return; }
    const reader = new FileReader();
    reader.onload = () => sendChat('Що з рослиною на фото?', { dataUrl: reader.result, mime: file.type });
    reader.readAsDataURL(file);
  }

  /* ---------------- weather ---------------- */

  async function loadWeather(force = false) {
    if (UI.weatherLoading) return;
    UI.weatherLoading = true;
    const data = await AI.fetchWeather(force);
    UI.weatherLoading = false;
    if (UI.route.name === 'weather' || UI.route.name === 'home') render();
    return data;
  }

  /* ---------------- onboarding ---------------- */

  function renderOnboarding() {
    modalRoot.innerHTML = Views.onboarding();
    document.body.style.overflow = 'hidden';
  }

  function finishOnboarding() {
    Store.completeOnboarding();
    modalRoot.innerHTML = '';
    document.body.style.overflow = '';
    render();
    toast('Вітаємо в AgroLens! Демо-режим уже працює');
  }

  /* ---------------- actions ---------------- */

  const actions = {
    'toggle-theme': () => { Store.toggleTheme(); updateChrome(); },
    'set-mode': el => { Store.setMode(el.dataset.mode); UI.route.name = ''; render(); toast(el.dataset.mode === 'home' ? 'Побутовий режим · безкоштовно' : 'Фермерський режим'); },
    'open-more': () => openSheet(),
    'close-sheet': el => { closeSheet(); },
    'modal-close': () => closeModal(),
    'go-settings': () => go('#/settings'),

    'open-add-plant': () => openModal(Views.modals.addPlant()),
    'edit-plant': el => {
      const p = Store.get().plants.find(x => x.id === el.dataset.id);
      if (p) openModal(Views.modals.addPlant(p));
    },
    'delete-plant': el => {
      const p = Store.get().plants.find(x => x.id === el.dataset.id);
      if (!p) return;
      openModal(Views.modals.confirm({ title: 'Видалити рослину?', text: `«${p.name}» зникне зі списку. Події в журналі залишаться.`, action: 'delete-plant-confirm', id: p.id }));
    },
    'delete-plant-confirm': el => { Store.removePlant(el.dataset.id); closeModal(); go('#/plants'); toast('Рослину видалено'); },
    'delete-field': el => {
      const f = Store.get().fields.find(x => x.id === el.dataset.id);
      if (!f) return;
      openModal(Views.modals.confirm({ title: 'Видалити ділянку?', text: `«${f.name}» буде прибрано з господарства.`, action: 'delete-field-confirm', id: f.id }));
    },
    'delete-field-confirm': el => { Store.removeField(el.dataset.id); closeModal(); go('#/plants'); toast('Ділянку видалено'); },
    'open-add-field': () => openModal(Views.modals.addField()),
    'add-note': el => openModal(Views.modals.note(el.dataset.name || (Store.get().plants.find(p => p.id === el.dataset.id) || {}).name)),
    'journal-note': () => openModal(Views.modals.note('')),
    'water-plant': el => { Store.waterPlant(el.dataset.id); render(); toast('Полив записано в журнал'); },

    'plants-filter': el => { UI.plants.filter = el.dataset.filter; render(); },

    'scan-sample': el => {
      UI.scan.sampleId = el.dataset.id;
      UI.scan.dataUrl = null;
      UI.scan.fileName = '';
      const s = DATA.SAMPLES.find(x => x.id === el.dataset.id);
      if (s) UI.scan.crop = s.type;
      render();
      toast('Демо-зразок обрано — натисніть «Аналізувати»');
    },
    'scan-reset': () => { UI.scan = { sampleId: null, dataUrl: null, fileName: '', mime: 'image/jpeg', crop: Store.get().mode === 'home' ? 'monstera' : 'tomato', analyzing: false }; render(); },
    'scan-run': () => runScan(),

    'result-tab': el => { UI.resultTab = el.dataset.tab; render(); },
    'result-save': () => {
      const r = UI.result || Store.get().lastResult;
      if (!r) return;
      if (r.saved) { toast('Уже збережено в журналі'); return; }
      Store.saveDiagnosis(r, r.plant);
      r.saved = true;
      UI.result = r;
      if (Store.get().lastResult) Store.get().lastResult.saved = true;
      render();
      toast('Діагноз і план збережено');
    },
    'result-share': async () => {
      const r = UI.result || Store.get().lastResult;
      if (!r) return;
      const text = `AgroLens: ${r.diagnosis} (${r.confidence}%). ${r.summary}\nЩо робити: ${(r.treatment?.immediate || []).join('; ')}`;
      try {
        if (navigator.share) await navigator.share({ title: 'AgroLens — діагноз', text });
        else { await navigator.clipboard.writeText(text); toast('Результат скопійовано'); }
      } catch { toast('Не вдалося поділитися', 'warn'); }
    },

    'checker-part': el => { UI.checker.part = el.dataset.id; render(); },
    'checker-sym': el => {
      const id = el.dataset.id;
      const arr = UI.checker.symptoms;
      UI.checker.symptoms = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
      render();
    },
    'checker-context': el => { UI.checker.context = { ...UI.checker.context, [el.dataset.group]: el.dataset.id }; render(); },
    'checker-next': () => { UI.checker.step = Math.min(4, UI.checker.step + 1); render(); },
    'checker-back': () => { UI.checker.step = Math.max(1, UI.checker.step - 1); render(); },
    'checker-run': () => {
      UI.checker.results = AI.checker(UI.checker.symptoms, UI.checker.context);
      UI.checker.step = 4;
      render();
    },
    'checker-reset': () => { UI.checker = { step: 1, part: null, symptoms: [], context: {}, results: null }; render(); },
    'checker-pick': el => {
      const d = DATA.byId[el.dataset.id];
      if (!d) return;
      UI.result = AI.resultFromDisease(d, { source: 'demo', mode: Store.get().mode });
      UI.result.saved = false;
      UI.resultTab = 'immediate';
      Store.setLastResult(UI.result);
      go('#/result');
    },

    'journal-filter': el => { UI.journal.filter = el.dataset.filter; render(); },
    'export-data': () => { Store.exportJSON(); toast('Експорт JSON завантажено'); },

    'guide-filter': el => { UI.guide.category = el.dataset.cat; render(); },
    'guide-reset': () => { UI.guide = { q: '', category: 'all' }; render(); },
    'guide-open': el => openModal(Views.modals.guide(el.dataset.id)),

    'weather-refresh': async () => { toast('Оновлюю прогноз…'); await loadWeather(true); toast('Прогноз оновлено'); },

    'chat-clear': () => { Store.clearChat(); render(); toast('Чат очищено'); },
    'chat-suggest': el => sendChat(el.dataset.text),
    'chat-attach': () => { const f = document.getElementById('chat-file'); if (f) f.click(); },

    'save-key': async () => {
      const input = document.getElementById('api-key');
      const key = (input ? input.value : '').trim();
      if (!key) { toast('Введіть ключ або скористайтеся демо-режимом', 'warn'); return; }
      UI.settings.pendingKey = key;
      UI.settings.status = { ok: true, text: 'Перевіряю ключ у Google AI Studio…' };
      render();
      const res = await AI.validateKey(key);
      if (res.ok) {
        Store.setKey(key);
        UI.settings.pendingKey = null;
        UI.settings.status = { ok: true, text: `Ключ валідний. Доступно моделей: ${res.models.length}. Gemini підключено.` };
        toast('Gemini підключено');
      } else {
        UI.settings.status = { ok: false, text: `Ключ не прийнято: ${String(res.error || '').replace(/\.$/, '')}. Демо-режим лишається активним.` };
        toast('Ключ не пройшов перевірку', 'danger');
      }
      render();
      updateChrome();
    },
    'clear-key': () => {
      Store.setKey('');
      UI.settings.status = null;
      UI.settings.pendingKey = null;
      render();
      updateChrome();
      toast('Ключ видалено · демо-режим');
    },

    'reset-demo': () => openModal(Views.modals.confirm({ title: 'Повернути демо-дані?', text: 'Поточні рослини, поля й журнал буде замінено початковим набором.', action: 'reset-demo-confirm', danger: false })),
    'reset-demo-confirm': () => { Store.reset(); UI.result = null; closeModal(); go('#/home'); render(); toast('Демо-дані відновлено'); },
    'reset-all': () => openModal(Views.modals.confirm({ title: 'Скинути все?', text: 'Буде видалено рослини, поля, журнал, чат і ключ. Дію не можна скасувати.', action: 'reset-all-confirm' })),
    'reset-all-confirm': () => { Store.reset(); UI.result = null; closeModal(); go('#/home'); render(); toast('Усе скинуто до демо-стану'); },

    'onboard-mode': el => { Store.setMode(el.dataset.mode); UI.route.name = ''; renderOnboarding(); updateChrome(); },
    'onboard-next': () => { UI.onboardStep = Math.min(2, UI.onboardStep + 1); renderOnboarding(); },
    'onboard-back': () => { UI.onboardStep = Math.max(0, UI.onboardStep - 1); renderOnboarding(); },
    'onboard-skip': () => finishOnboarding(),
    'onboard-done': () => finishOnboarding()
  };

  /* ---------------- events ---------------- */

  document.addEventListener('click', e => {
    const modeBtn = e.target.closest('[data-mode-set]');
    if (modeBtn) { e.preventDefault(); Store.setMode(modeBtn.dataset.modeSet); UI.route.name = ''; render(); toast(modeBtn.dataset.modeSet === 'home' ? 'Побутовий режим · безкоштовно' : 'Фермерський режим'); return; }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (!actions[action]) return;
    const anchor = el.tagName === 'A' && el.getAttribute('href');
    if (!anchor) e.preventDefault();
    try { actions[action](el, e); } catch (err) { console.error(err); toast('Дія не вдалася', 'danger'); }
  });

  document.addEventListener('input', e => {
    const el = e.target.closest('[data-input]');
    if (!el) return;
    const name = el.dataset.input;
    if (name === 'plants-q') {
      UI.plants.q = el.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => softRender('plants-q'), 220);
    } else if (name === 'guide-q') {
      UI.guide.q = el.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => softRender('guide-q'), 220);
    } else if (name === 'chat-draft') {
      UI.chat.draft = el.value;
      el.style.height = 'auto';
      el.style.height = Math.min(110, el.scrollHeight) + 'px';
    }
  });

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-input]');
    if (!el) return;
    const name = el.dataset.input;
    if (name === 'scan-file') {
      const f = el.files && el.files[0];
      if (f) readImage(f);
    } else if (name === 'chat-file') {
      const f = el.files && el.files[0];
      if (f) readChatImage(f);
    } else if (name === 'scan-crop') {
      UI.scan.crop = el.value;
    } else if (name === 'model') {
      Store.setModel(el.value);
      updateChrome();
      toast('Модель збережено');
    }
  });

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-setting]');
    if (!el) return;
    const key = el.dataset.setting;
    if (key === 'theme') { Store.setTheme(el.checked ? 'dark' : 'light'); updateChrome(); }
    if (key === 'mode') { Store.setMode(el.checked ? 'farm' : 'home'); UI.route.name = ''; render(); }
    if (key === 'notifications' || key === 'demo') { Store.setSetting(key, el.checked); toast('Налаштування збережено'); }
  });

  document.addEventListener('submit', async e => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    const kind = form.dataset.form;
    if (kind === 'chat') {
      const ta = form.querySelector('[data-input="chat-draft"]');
      sendChat(ta ? ta.value : '');
      return;
    }
    const fd = new FormData(form);
    const val = k => String(fd.get(k) || '').trim();
    if (kind === 'plant') {
      const data = { name: val('name'), species: val('species'), room: val('room'), waterEvery: val('waterEvery'), light: val('light'), art: val('art'), note: val('note') };
      if (!data.name) { toast('Вкажіть назву рослини', 'warn'); return; }
      if (form.dataset.id) {
        Store.updatePlant(form.dataset.id, data);
        toast('Рослину оновлено');
      } else {
        Store.addPlant(data);
        toast('Рослину додано · нагадування активне');
      }
      closeModal();
      render();
    }
    if (kind === 'field') {
      if (!val('name')) { toast('Вкажіть назву ділянки', 'warn'); return; }
      Store.addField({ name: val('name'), crop: val('crop'), cropType: val('cropType'), area: val('area'), stage: val('stage'), note: val('note') });
      closeModal();
      render();
      toast('Ділянку додано');
    }
    if (kind === 'note') {
      if (!val('title')) { toast('Вкажіть заголовок', 'warn'); return; }
      const type = val('type');
      Store.addJournal({ type, title: val('title'), sub: val('text') || 'Нотатка до журналу', plant: form.dataset.plant || '', icon: type === 'treatment' ? 'spray' : type === 'water' ? 'drop' : 'edit', status: type === 'treatment' ? 'ok' : 'ok' });
      closeModal();
      render();
      toast('Запис додано в журнал');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modalRoot.querySelector('.scan-overlay')) return;
      closeModal();
      closeSheet();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      const ta = document.activeElement;
      if (ta && ta.dataset.input === 'chat-draft') { e.preventDefault(); sendChat(ta.value); }
    }
  });

  function softRender(inputName) {
    const val = inputName === 'plants-q' ? UI.plants.q : UI.guide.q;
    render();
    const next = document.querySelector(`[data-input="${inputName}"]`);
    if (next) {
      next.focus();
      next.value = val;
      try { next.setSelectionRange(val.length, val.length); } catch {}
    }
  }

  function updateNetwork() {
    const online = navigator.onLine;
    const pill = document.querySelector('[data-net-status]');
    const label = document.querySelector('[data-net-label]');
    if (pill) pill.classList.toggle('is-off', !online);
    if (label) label.textContent = online ? 'Онлайн' : 'Офлайн';
  }

  function init() {
    Store.init();
    document.documentElement.dataset.theme = Store.get().theme;
    document.body.dataset.theme = Store.get().theme;
    document.body.dataset.mode = Store.get().mode;

    render();
    hydrateIcons();
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('hashchange', render);

    setTimeout(() => {
      const boot = document.getElementById('boot');
      const app = document.getElementById('app');
      if (app) app.hidden = false;
      if (boot) boot.classList.add('is-done');
      booted = true;
      if (!Store.get().onboarded) renderOnboarding();
    }, 650);

    loadWeather(false);
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  return { init, render, go, toast, openModal, closeModal, loadWeather, UI };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
