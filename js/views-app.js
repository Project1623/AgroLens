/* AgroLens — chat, settings, project, onboarding and modal contents */
(() => {
  const { ic, esc, pageHead } = V;

  /* ---------------- chat ---------------- */

  Views.pages.chat = function chat() {
    const s = Store.get();
    const messages = s.chat || [];
    const aiReady = !!s.apiKey;
    const typing = UI.chat.busy ? `<div class="msg msg--ai"><span class="msg__avatar">${ic('leaf')}</span><span class="msg__bubble"><span class="typing"><i></i><i></i><i></i></span></span></div>` : '';
    const welcome = `<div class="msg msg--ai">
      <span class="msg__avatar">${ic('leaf')}</span>
      <span class="msg__bubble"><p><strong>Вітаю! Я агроном AgroLens.</strong></p><p>Можу перевірити графік поливу, пояснити симптоми, скласти план догляду або підказати вікно для обробки. Опишіть, що турбує, або додайте фото.</p><p class="msg__disclaimer">${aiReady ? 'Відповіді генерує Gemini з контекстом ваших рослин.' : 'Демо-режим: відповіді з локальної бази знань. Ключ Gemini вмикає реальний AI.'}</p></span>
    </div>`;

    return `${pageHead({
      eyebrow: ic('chat') + ' Агроном + AI-агент',
      title: 'Чат з агрономом',
      sub: 'Запитайте про полив, хвороби, шкідників або план на тиждень. Агент бачить ваші рослини, поля й останній діагноз.',
      actions: `<button class="btn btn--ghost" data-action="chat-clear">${ic('trash')} Очистити</button><a class="btn btn--ghost" href="#/settings">${ic('settings')} Налаштувати AI</a>`
    })}
    <section class="chat-shell">
      <div class="chat-head">
        <span class="chat-head__avatar">${ic('leaf')}</span>
        <span class="chat-head__text"><strong>Агроном AgroLens</strong><span>${aiReady ? 'Gemini · ' + esc(s.model) : 'демо-режим · локальна база'}</span></span>
        <span class="chat-head__actions"><span class="badge badge--${aiReady ? 'green' : 'amber'}">${aiReady ? 'AI онлайн' : 'демо'}</span></span>
      </div>
      <div class="chat-scroll" id="chat-scroll">
        <span class="chat-day">${Utils.todayLong()}</span>
        ${messages.length ? messages.map(m => `<div class="msg msg--${m.role === 'user' ? 'user' : 'ai'}">
          <span class="msg__avatar">${ic(m.role === 'user' ? 'user' : 'leaf')}</span>
          <span class="msg__bubble">${Utils.mdLite(m.text)}${m.source === 'demo' ? '<div class="msg__disclaimer">демо-відповідь · локальна база</div>' : ''}</span>
          <span class="msg__time">${Utils.fmtTime(m.createdAt)}</span>
        </div>`).join('') : welcome}
        ${typing}
      </div>
      <div class="chat-context">${ic('info')} ${aiReady ? 'Контекст: рослини, поля, останній діагноз · ключ зберігається лише на пристрої' : 'Без ключа відповідає локальний агроном · ключ Gemini не обов’язковий'}</div>
      <div class="chat-suggestions">
        ${DATA.CHAT_PROMPTS.map(p => `<button class="chat-suggestion" data-action="chat-suggest" data-text="${esc(p)}" type="button">${esc(p)}</button>`).join('')}
      </div>
      <form class="composer" data-form="chat">
        <button class="composer__attach" type="button" data-action="chat-attach" aria-label="Додати фото">${ic('camera')}</button>
        <div class="composer__field">
          <textarea rows="1" placeholder="Запитайте про рослину або догляд…" data-input="chat-draft">${esc(UI.chat.draft || '')}</textarea>
          <button class="composer__send" type="submit" aria-label="Надіслати">${ic('send')}</button>
        </div>
        <input type="file" accept="image/*" id="chat-file" data-input="chat-file" hidden>
      </form>
    </section>`;
  };

  /* ---------------- settings ---------------- */

  Views.pages.settings = function settings() {
    const s = Store.get();
    const keySet = !!s.apiKey;
    const status = UI.settings.status;
    return `${pageHead({
      eyebrow: ic('settings') + ' Конфігурація',
      title: 'Налаштування',
      sub: 'AI-ключ, теми, режими й дані. Усе зберігається локально у браузері — без сервера та реєстрації.',
      actions: `<a class="btn btn--ghost" href="#/project">${ic('file-text')} Про проєкт ПР5</a>`
    })}
    <div class="settings-grid">
      <div>
        <section class="card settings-section">
          <div class="flex-between"><h3 class="h3">AI-діагностика</h3><span class="badge badge--${keySet ? 'green' : 'amber'}">${keySet ? 'ключ додано' : 'демо-режим'}</span></div>
          <p class="small mt-4">Без ключа працює локальна демо-база. Ключ Google AI Studio вмикає реальний аналіз фото та чат Gemini.</p>
          <div class="field">
            <label for="api-key">Ключ Gemini API</label>
            <input class="input input--mono" id="api-key" type="password" autocomplete="off" spellcheck="false" placeholder="AIza…" value="${esc(UI.settings.pendingKey ?? s.apiKey)}" data-input="api-key">
            <span class="field-hint">Ключ зберігається в localStorage цього браузера і надсилається лише до Google Generative Language API.</span>
          </div>
          <div class="flex wrap mt-12">
            <button class="btn btn--primary btn--sm" data-action="save-key">${ic('check')} Зберегти й перевірити</button>
            <button class="btn btn--ghost btn--sm" data-action="clear-key" ${keySet ? '' : 'disabled'}>${ic('trash')} Видалити ключ</button>
            <a class="btn btn--ghost btn--sm" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">${ic('external')} Отримати безкоштовно</a>
          </div>
          ${status ? `<div class="key-status ${status.ok ? '' : 'key-status--err'}">${ic(status.ok ? 'check-circle' : 'x-circle')} ${esc(status.text)}</div>` : keySet ? `<div class="key-status">${ic('check-circle')} Ключ збережено. Перевірте з’єднання кнопкою вище.</div>` : `<div class="key-status key-status--warn">${ic('info')} Демо-режим активний. Усі функції доступні без ключа.</div>`}
          <div class="field">
            <label for="model">Модель</label>
            <select class="select" id="model" data-input="model">
              <option value="gemini-2.5-flash" ${s.model === 'gemini-2.5-flash' ? 'selected' : ''}>Gemini 2.5 Flash — баланс швидкості й якості</option>
              <option value="gemini-2.0-flash" ${s.model === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash — швидка</option>
              <option value="gemini-2.5-pro" ${s.model === 'gemini-2.5-pro' ? 'selected' : ''}>Gemini 2.5 Pro — детальніший розбір</option>
            </select>
          </div>
          <div class="inline-note mt-12">${ic('lock')} Ключ не потрапляє до журналу, експорту чи чату. Видаліть його однією кнопкою.</div>
        </section>

        <section class="card settings-section">
          <h3 class="h3">Вигляд і режим</h3>
          <div class="setting-row">
            <span class="setting-row__icon">${ic('moon')}</span>
            <span class="setting-row__text"><strong>Темна тема</strong><span>Зручно ввечері та в теплиці</span></span>
            <label class="switch"><input type="checkbox" data-setting="theme" ${s.theme === 'dark' ? 'checked' : ''}><span></span></label>
          </div>
          <div class="setting-row">
            <span class="setting-row__icon">${ic('sprout')}</span>
            <span class="setting-row__text"><strong>Фермерський режим</strong><span>Поля, гектари, ризик обробки. Вимкніть для побутового режиму.</span></span>
            <label class="switch"><input type="checkbox" data-setting="mode" ${s.mode === 'farm' ? 'checked' : ''}><span></span></label>
          </div>
          <div class="setting-row">
            <span class="setting-row__icon">${ic('bell')}</span>
            <span class="setting-row__text"><strong>Нагадування</strong><span>Полив і огляди в межах застосунку</span></span>
            <label class="switch"><input type="checkbox" data-setting="notifications" ${s.settings.notifications ? 'checked' : ''}><span></span></label>
          </div>
          <div class="setting-row">
            <span class="setting-row__icon">${ic('sparkles')}</span>
            <span class="setting-row__text"><strong>Демо-підказки</strong><span>Показувати пояснення локальної бази</span></span>
            <label class="switch"><input type="checkbox" data-setting="demo" ${s.settings.demo ? 'checked' : ''}><span></span></label>
          </div>
        </section>
      </div>

      <div>
        <section class="card settings-section">
          <h3 class="h3">Дані</h3>
          <p class="small mt-4">Рослин, полів і журналу: ${Store.get().plants.length + Store.get().fields.length + Store.get().journal.length}. Дані не синхронізуються з хмарою.</p>
          <div class="data-actions">
            <button class="btn btn--ghost btn--sm" data-action="export-data">${ic('download')} Експорт JSON</button>
            <button class="btn btn--ghost btn--sm" data-action="reset-demo">${ic('refresh')} Демо-дані</button>
          </div>
          <div class="divider"></div>
          <div class="danger-zone">
            <h4 class="h4">Небезпечна зона</h4>
            <p class="small mt-4">Скидання видалить рослини, поля, журнал, чат і ключ із цього браузера.</p>
            <button class="btn btn--danger btn--sm mt-12" data-action="reset-all">${ic('trash')} Скинути все</button>
          </div>
        </section>

        <section class="card about-card mt-16">
          <span class="about-card__mark">${Icons.brand(66)}</span>
          <h2 class="h2">AgroLens</h2>
          <p class="small">Кишеньковий агроном зі штучним інтелектом. ПР5 · КНШІ-11 · 2026</p>
          <div class="about-stats">
            <span class="about-stat"><strong>16</strong><span>хвороб</span></span>
            <span class="about-stat"><strong>4</strong><span>ролі</span></span>
            <span class="about-stat"><strong>100%</strong><span>офлайн-база</span></span>
          </div>
          <a class="btn btn--ghost btn--sm mt-16" href="#/project">${ic('file-text')} Сценарій, план, чекліст</a>
        </section>
      </div>
    </div>`;
  };

  /* ---------------- project ---------------- */

  Views.pages.project = function project() {
    const p = DATA.PROJECT;
    const stMap = { done: ['green', 'виконано'], 'in-progress': ['amber', 'у роботі'], planned: ['', 'заплановано'] };
    return `${pageHead({
      eyebrow: ic('file-text') + ' ПР5 · командна робота',
      title: 'Проєкт AgroLens',
      sub: 'Сценарій, ролі, технічне завдання, план, чекліст і висновки. Цей екран — стислий опис прототипу для захисту.',
      actions: `<a class="btn btn--ghost" href="#/home">${ic('home')} До застосунку</a>`
    })}
    <section class="card card--dark project-hero">
      <div>
        <div class="eyebrow" style="color:#9FD8AC">${ic('sparkles')} ${esc(p.tagline)}</div>
        <h2 class="h1 mt-12" style="font-size:clamp(28px,3.4vw,44px)">AgroLens</h2>
        <p class="sub mt-12" style="max-width:62ch">${esc(p.scenario)}</p>
        <div class="flex wrap mt-16"><span class="badge badge--glass">PWA · HTML/CSS/JS</span><span class="badge badge--glass">Gemini + демо</span><span class="badge badge--glass">офлайн-довідник</span><span class="badge badge--glass">2 режими</span></div>
      </div>
      <div class="project-hero__art">${Art.hero()}</div>
    </section>

    <div class="section-head"><h2 class="h2">Сценарій одним реченням</h2></div>
    <section class="card" style="padding:22px">
      <div class="flex" style="align-items:flex-start;gap:14px"><span class="setting-row__icon">${ic('target')}</span><p style="font-size:15px;line-height:1.6">${esc(p.scenario)}</p></div>
      <div class="inline-note mt-12">${ic('info')} ${esc(p.scenarioShort)}</div>
    </section>

    <div class="section-head"><h2 class="h2">Ролі команди</h2><span class="tiny">4 ролі · спільна відповідальність</span></div>
    <div class="grid-4">
      ${p.roles.map(r => `<div class="card role-card">
        <span class="role-card__avatar" style="background:${r.accent}">${r.initials}</span>
        <strong>${esc(r.name)}</strong>
        <span class="badge badge--green">${esc(r.role)}</span>
        <p class="small mt-8">${esc(r.duty)}</p>
      </div>`).join('')}
    </div>

    <div class="section-head"><h2 class="h2">Технічне завдання</h2><span class="tiny">3 вимоги · 3 критерії приймання</span></div>
    <div class="grid-3">
      ${p.requirements.map(r => `<div class="card requirement">
        <div class="flex-between"><span class="badge badge--green">${r.id}</span>${ic('check-circle')}</div>
        <h4 class="h4 mt-8">${esc(r.title)}</h4>
        <p class="small mt-4">${esc(r.text)}</p>
        <div class="inline-note mt-12">${ic('check')} <span><strong>Критерій:</strong> ${esc(r.criteria)}</span></div>
      </div>`).join('')}
    </div>

    <div class="section-head"><h2 class="h2">План робіт</h2><span class="tiny">7 завдань · залежності позначено</span></div>
    <div class="card" style="padding:0;overflow:hidden">
      <div style="overflow-x:auto">
        <table class="table">
          <thead><tr><th>#</th><th>Завдання</th><th>Виконавець</th><th>Час</th><th>Результат</th><th>Залежність</th><th>Статус</th></tr></thead>
          <tbody>
            ${p.tasks.map(t => {
              const st = stMap[t.status] || stMap.planned;
              return `<tr><td class="mono">${t.id}</td><td><strong>${esc(t.title)}</strong></td><td>${esc(t.owner)}</td><td class="nowrap">${t.hours} год</td><td>${esc(t.result)}</td><td><span class="dep">${ic('link')} ${esc(t.dep)}</span></td><td><span class="badge badge--${st[0]}">${st[1]}</span></td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid-2 mt-16">
      <section class="card result-section">
        <h3 class="h3">Чекліст готовності</h3>
        <div class="list-check mt-12">
          ${p.checklist.map(c => `<div class="list-check__item"><span class="list-check__icon ${c.done ? '' : 'list-check__icon--amber'}">${ic(c.done ? 'check' : 'clock')}</span><span>${esc(c.text)}</span></div>`).join('')}
        </div>
      </section>
      <section class="card result-section">
        <h3 class="h3">Тест-кейси</h3>
        <div class="list-check mt-12">
          ${p.tests.map(t => `<div class="list-check__item"><span class="list-check__icon">${ic('check')}</span><span><strong>${t.id}.</strong> ${esc(t.case)} — <em>${esc(t.expected)}</em></span></div>`).join('')}
        </div>
        <div class="inline-note mt-12">${ic('shield')} 8 із 8 тест-кейсів пройдено в демо-режимі; реальний Gemini перевіряється після додавання ключа.</div>
      </section>
    </div>

    <div class="section-head"><h2 class="h2">Висновки команди</h2></div>
    <section class="card result-section">
      <p class="sub">Прототип доводить, що одну потребу — «що з моєю рослиною?» — можна закрити за один сценарій у двох режимах. Фермер отримує швидкий тріаж і вікно обробки, власник кімнатних рослин — безкоштовний повний побутовий режим. Офлайн-база й демо-діагностика знімають бар’єр ключа та зв’язку; Gemini додає реальний аналіз фото без зміни сценарію. Наступний крок — польові випробування й уточнення порогів ризику.</p>
      <div class="divider"></div>
      <h4 class="h4">Особистий внесок</h4>
      <div class="grid-2 mt-12">
        ${p.contributions.map(c => `<div class="contrib"><strong>${esc(c.name)}</strong><p class="small mt-4">${esc(c.text)}</p></div>`).join('')}
      </div>
    </section>`;
  };

  /* ---------------- onboarding ---------------- */

  Views.onboarding = function onboarding() {
    const step = UI.onboardStep || 0;
    const s = Store.get();
    const slides = [
      `<span class="onboard__art">${Art.hero()}</span>
       <div class="eyebrow">${ic('sparkles')} AgroLens · ПР5</div>
       <h1 class="h1 mt-12">Бачити рослину наскрізь</h1>
       <p class="sub mt-8" style="max-width:44ch">Фото листка → діагноз → план лікування. Для ферми, городу й кімнатних рослин. Без реєстрації та сервера.</p>
       <div class="onboard__modes">
         <button class="onboard__mode ${s.mode === 'farm' ? 'is-active' : ''}" data-action="onboard-mode" data-mode="farm" type="button"><span>${ic('sprout')}</span><strong>Ферма</strong><small>поля, гектари, обробки</small></button>
         <button class="onboard__mode ${s.mode === 'home' ? 'is-active' : ''}" data-action="onboard-mode" data-mode="home" type="button"><span>${ic('pot')}</span><strong>Дім</strong><small>рослини, полив, догляд</small></button>
       </div>`,
      `<div class="eyebrow">${ic('grid')} Що всередині</div>
       <h1 class="h1 mt-12">Один застосунок — дві глибини</h1>
       <div class="onboard__features">
         <span>${ic('scan')} Діагностика за фото й демо-зразки</span>
         <span>${ic('stethoscope')} Симптом-чекер без фото</span>
         <span>${ic('pot')} Мої рослини та нагадування про полив</span>
         <span>${ic('journal')} Журнал догляду й експорт</span>
         <span>${ic('book')} Офлайн-довідник на 16 хвороб</span>
         <span>${ic('cloud')} Погодні ризики та вікно обробки</span>
         <span>${ic('chat')} Агроном + AI-агент</span>
         <span>${ic('shield')} Дані лише на пристрої</span>
       </div>
       <div class="inline-note mt-16">${ic('info')} Побутовий режим безкоштовний і не обмежений: усі функції доступні садівникам і власникам кімнатних рослин.</div>`,
      `<div class="eyebrow">${ic('sparkles')} Реальний AI — за бажанням</div>
       <h1 class="h1 mt-12">Почніть без ключа</h1>
       <p class="sub mt-8" style="max-width:46ch">Демо-режим працює одразу: локальна база, симптом-чекер, чат і погода. Ключ Google AI Studio вмикає аналіз реального фото та Gemini-чат — його можна додати пізніше в налаштуваннях.</p>
       <div class="onboard__key">${ic('key')} <span>Ключ зберігається лише у вашому браузері. Отримати можна безкоштовно в Google AI Studio.</span></div>
       <div class="flex wrap mt-16"><a class="btn btn--ghost" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">${ic('external')} Google AI Studio</a><span class="tiny">Крок можна пропустити</span></div>`
    ];
    return `<div class="onboard">
      <div class="onboard__card">
        <div class="onboard__brand"><span>${Icons.brand(38)}</span><strong>AgroLens</strong><span class="spacer"></span><button class="icon-btn icon-btn--ghost" data-action="onboard-skip" aria-label="Пропустити">${ic('close')}</button></div>
        <div class="onboard__body">${slides[step]}</div>
        <div class="onboard__foot">
          <span class="onboard__dots">${slides.map((_, i) => `<i class="${i === step ? 'is-active' : ''}"></i>`).join('')}</span>
          ${step > 0 ? `<button class="btn btn--ghost btn--sm" data-action="onboard-back">${ic('arrow-left')} Назад</button>` : `<button class="btn btn--ghost btn--sm" data-action="onboard-skip">Пропустити</button>`}
          ${step < slides.length - 1
            ? `<button class="btn btn--primary btn--sm" data-action="onboard-next">Далі ${ic('arrow-right')}</button>`
            : `<button class="btn btn--primary btn--sm" data-action="onboard-done">${ic('check')} Почати</button>`}
        </div>
      </div>
    </div>`;
  };

  /* ---------------- modal contents ---------------- */

  const artOptions = [
    ['monstera', 'Монстера'], ['ficus', 'Фікус'], ['basil', 'Базилік'], ['tomato', 'Томат'],
    ['snake', 'Сансев’єра'], ['apple', 'Яблуня'], ['cucumber', 'Огірок'], ['generic', 'Інша']
  ];

  Views.modals = {
    addPlant(plant) {
      const p = plant || {};
      return `<div class="modal__head"><div><h3 class="modal__title">${plant ? 'Редагувати рослину' : 'Нова рослина'}</h3><p class="modal__sub">Нагадаємо про полив і додамо рослину до журналу.</p></div><button class="icon-btn icon-btn--ghost modal__close" data-action="modal-close" aria-label="Закрити">${ic('close')}</button></div>
        <form data-form="plant" data-id="${p.id || ''}">
          <div class="grid-2">
            <div class="field"><label for="p-name">Назва *</label><input class="input" id="p-name" name="name" required value="${esc(p.name || '')}" placeholder="Наприклад, Монстера"></div>
            <div class="field"><label for="p-species">Вид</label><input class="input" id="p-species" name="species" value="${esc(p.species || '')}" placeholder="Monstera deliciosa"></div>
            <div class="field"><label for="p-room">Кімната / місце</label><input class="input" id="p-room" name="room" value="${esc(p.room || '')}" placeholder="Вітальня, балкон, город"></div>
            <div class="field"><label for="p-water">Полив, днів</label><input class="input" id="p-water" name="waterEvery" type="number" min="1" max="60" value="${p.waterEvery || 7}"></div>
            <div class="field"><label for="p-light">Світло</label><select class="select" id="p-light" name="light"><option ${p.light === 'Тінь / півтінь' ? 'selected' : ''}>Тінь / півтінь</option><option ${p.light === 'Розсіяне' ? 'selected' : ''}>Розсіяне</option><option ${p.light === 'Яскраве розсіяне' ? 'selected' : ''}>Яскраве розсіяне</option><option ${p.light === 'Пряме сонце' ? 'selected' : ''}>Пряме сонце</option></select></div>
            <div class="field"><label for="p-art">Ілюстрація</label><select class="select" id="p-art" name="art">${artOptions.map(([id, label]) => `<option value="${id}" ${p.art === id ? 'selected' : ''}>${label}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label for="p-note">Нотатка</label><textarea class="textarea" id="p-note" name="note" placeholder="Особливості догляду, місце, історія">${esc(p.note || '')}</textarea></div>
          <div class="modal__foot"><button class="btn btn--ghost" type="button" data-action="modal-close">Скасувати</button><button class="btn btn--primary" type="submit">${ic('check')} ${plant ? 'Зберегти' : 'Додати рослину'}</button></div>
        </form>`;
    },

    addField(field) {
      const f = field || {};
      return `<div class="modal__head"><div><h3 class="modal__title">Нова ділянка</h3><p class="modal__sub">Поле, сад або теплиця — з площею та стадією культури.</p></div><button class="icon-btn icon-btn--ghost modal__close" data-action="modal-close" aria-label="Закрити">${ic('close')}</button></div>
        <form data-form="field">
          <div class="grid-2">
            <div class="field"><label for="f-name">Назва *</label><input class="input" id="f-name" name="name" required placeholder="Поле №3"></div>
            <div class="field"><label for="f-crop">Культура</label><input class="input" id="f-crop" name="crop" placeholder="Пшениця озима"></div>
            <div class="field"><label for="f-type">Тип</label><select class="select" id="f-type" name="cropType"><option value="wheat">Пшениця</option><option value="tomato">Томати</option><option value="apple">Яблуня</option><option value="cucumber">Огірки</option><option value="generic">Інше</option></select></div>
            <div class="field"><label for="f-area">Площа, га</label><input class="input" id="f-area" name="area" type="number" min="0.1" step="0.1" value="1"></div>
            <div class="field"><label for="f-stage">Стадія</label><input class="input" id="f-stage" name="stage" placeholder="Вегетація"></div>
          </div>
          <div class="field"><label for="f-note">Нотатка</label><textarea class="textarea" id="f-note" name="note" placeholder="Стан посіву, особливості"></textarea></div>
          <div class="modal__foot"><button class="btn btn--ghost" type="button" data-action="modal-close">Скасувати</button><button class="btn btn--primary" type="submit">${ic('check')} Додати ділянку</button></div>
        </form>`;
    },

    note(plantName) {
      return `<div class="modal__head"><div><h3 class="modal__title">Нотатка</h3><p class="modal__sub">${plantName ? 'Для рослини «' + esc(plantName) + '»' : 'Довільна подія в журналі'}</p></div><button class="icon-btn icon-btn--ghost modal__close" data-action="modal-close" aria-label="Закрити">${ic('close')}</button></div>
        <form data-form="note" data-plant="${esc(plantName || '')}">
          <div class="field"><label for="n-title">Заголовок *</label><input class="input" id="n-title" name="title" required placeholder="Огляд нижнього боку листя"></div>
          <div class="field"><label for="n-text">Деталі</label><textarea class="textarea" id="n-text" name="text" placeholder="Що помітили, що зробили"></textarea></div>
          <div class="field"><label for="n-type">Тип</label><select class="select" id="n-type" name="type"><option value="note">Нотатка</option><option value="treatment">Обробка</option><option value="water">Полив</option><option value="scan">Огляд</option></select></div>
          <div class="modal__foot"><button class="btn btn--ghost" type="button" data-action="modal-close">Скасувати</button><button class="btn btn--primary" type="submit">${ic('check')} Додати</button></div>
        </form>`;
    },

    guide(id) {
      const d = DATA.byId[id];
      if (!d) return '';
      const sev = DATA.SEVERITY[d.severity];
      const block = (title, arr) => `<h4 class="h4 mt-16">${title}</h4><ul class="treatment-list">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
      return `<div class="modal__head"><div><span class="badge badge--${d.severity === 'high' ? 'danger' : d.severity === 'low' ? 'green' : 'amber'}">${sev.label} ризик</span><h3 class="modal__title mt-8">${esc(d.name)}</h3><p class="latin">${esc(d.latin)}</p></div><button class="icon-btn icon-btn--ghost modal__close" data-action="modal-close" aria-label="Закрити">${ic('close')}</button></div>
        <p class="sub">${esc(d.summary)}</p>
        <div class="flex wrap mt-12"><span class="badge badge--green">${DATA.CATEGORIES[d.category].label}</span>${d.plants.map(p => `<span class="chip chip--sm">${esc(AI.plantLabel(p, 'farm'))}</span>`).join('')}${d.household ? '<span class="badge badge--amber">побутовий режим</span>' : ''}</div>
        <div class="inline-note mt-16">${ic('cloud')} ${esc(d.weather)}</div>
        ${block('Симптоми', d.symptoms)}
        ${block('Що зробити негайно', d.treatment.immediate)}
        ${block('Біологічні засоби', d.treatment.organic)}
        ${block('Препарати — обережно', d.treatment.chemical)}
        ${block('Профілактика', d.treatment.prevention)}
        <div class="modal__foot"><a class="btn btn--ghost" href="#/scan" data-action="modal-close">${ic('scan')} Сканувати фото</a><a class="btn btn--primary" href="#/chat" data-action="modal-close">${ic('chat')} Запитати агронома</a></div>`;
    },

    confirm({ title, text, action, id, danger = true }) {
      return `<div class="modal__head"><div><h3 class="modal__title">${esc(title)}</h3><p class="modal__sub">${esc(text)}</p></div><button class="icon-btn icon-btn--ghost modal__close" data-action="modal-close" aria-label="Закрити">${ic('close')}</button></div>
        <div class="modal__foot"><button class="btn btn--ghost" data-action="modal-close">Скасувати</button><button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-action="${action}" data-id="${esc(id || '')}">${ic(danger ? 'trash' : 'check')} Підтвердити</button></div>`;
    }
  };

  Views.sheet = function sheet() {
    return `<div class="sheet" role="dialog" aria-label="Більше">
      <div class="sheet__grab"></div>
      <div class="sheet__title">AgroLens</div>
      <a class="sheet__link" href="#/plants">${ic('pot')} Мої рослини <span>${ic('chevron-right')}</span></a>
      <a class="sheet__link" href="#/checker">${ic('stethoscope')} Симптом-чекер <span>${ic('chevron-right')}</span></a>
      <a class="sheet__link" href="#/journal">${ic('journal')} Журнал <span>${ic('chevron-right')}</span></a>
      <a class="sheet__link" href="#/guide">${ic('book')} Довідник <span>${ic('chevron-right')}</span></a>
      <a class="sheet__link" href="#/weather">${ic('cloud')} Погода й ризики <span>${ic('chevron-right')}</span></a>
      <a class="sheet__link" href="#/settings">${ic('settings')} Налаштування <span>${ic('chevron-right')}</span></a>
      <a class="sheet__link" href="#/project">${ic('file-text')} Про проєкт ПР5 <span>${ic('chevron-right')}</span></a>
      <div class="divider"></div>
      <button class="sheet__link" data-action="toggle-theme" type="button" style="width:100%">${ic('moon')} Змінити тему <span>${ic('chevron-right')}</span></button>
      <button class="sheet__link" data-action="modal-close" type="button" style="width:100%">${ic('close')} Закрити <span>${ic('chevron-right')}</span></button>
    </div>`;
  };
})();
