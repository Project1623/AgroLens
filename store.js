/* AgroLens — state, persistence and small utilities */
const Utils = (() => {
  const DAY = 86400000;
  const MONTHS = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
  const MONTHS_SHORT = ['січ.', 'лют.', 'бер.', 'квіт.', 'трав.', 'черв.', 'лип.', 'серп.', 'вер.', 'жовт.', 'лист.', 'груд.'];
  const WEEKDAYS = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п’ятниця', 'субота'];
  const WEEKDAYS_SHORT = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const pad = n => String(n).padStart(2, '0');

  function date(iso) {
    if (iso instanceof Date) return iso;
    if (typeof iso === 'number') return new Date(iso);
    if (!iso) return new Date();
    return new Date(iso);
  }

  function fmtDate(iso, withYear = false) {
    const d = date(iso);
    if (isNaN(d)) return '—';
    return `${d.getDate()} ${MONTHS[d.getMonth()]}${withYear ? ' ' + d.getFullYear() : ''}`;
  }

  function fmtShort(iso) {
    const d = date(iso);
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  }

  function fmtTime(iso) {
    const d = date(iso);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function fmtDateTime(iso) {
    const d = date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function weekday(iso, short = false) {
    const d = date(iso);
    return (short ? WEEKDAYS_SHORT : WEEKDAYS)[d.getDay()];
  }

  function todayLong() {
    const d = new Date();
    return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  function daysBetween(a, b) {
    return Math.round((date(b).setHours(0, 0, 0, 0) - date(a).setHours(0, 0, 0, 0)) / DAY);
  }

  function addDays(iso, days) {
    const d = date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  function relative(iso) {
    const diff = daysBetween(iso, new Date());
    if (diff === 0) return 'сьогодні';
    if (diff === 1) return 'вчора';
    if (diff === 2) return '2 дні тому';
    if (diff < 0) return `через ${Math.abs(diff)} дн.`;
    if (diff < 7) return `${diff} дн. тому`;
    return fmtShort(iso);
  }

  function plural(n, one, few, many) {
    const num = Math.abs(n) % 100;
    const n1 = num % 10;
    if (num > 10 && num < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return 'Доброї ночі';
    if (h < 12) return 'Добрий ранок';
    if (h < 18) return 'Добрий день';
    return 'Добрий вечір';
  }

  function escape(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function uid(prefix = 'id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function slug(str) {
    return String(str).toLowerCase().replace(/[^a-z0-9а-яіїєґ]+/gi, '-').replace(/(^-|-$)/g, '');
  }

  function capitalize(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function mdLite(text = '') {
    let t = escape(text);
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\n{2,}/g, '</p><p>');
    t = t.replace(/\n/g, '<br>');
    t = t.replace(/^• /gm, '');
    return `<p>${t}</p>`;
  }

  function parseList(text = '') {
    return text.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
  }

  function clampText(text = '', max = 120) {
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }

  return {
    DAY, MONTHS, MONTHS_SHORT, WEEKDAYS, WEEKDAYS_SHORT,
    pad, date, fmtDate, fmtShort, fmtTime, fmtDateTime, weekday, todayLong,
    daysBetween, addDays, relative, plural, greeting, escape, uid, clamp, slug,
    capitalize, mdLite, parseList, clampText
  };
})();

const Store = (() => {
  const KEY = 'agrolens.v3';
  let state = null;
  let saveTimer = null;
  const listeners = new Set();

  function isoDaysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  function seed() {
    return {
      version: 3,
      theme: 'light',
      mode: 'farm',
      onboarded: false,
      apiKey: '',
      model: 'gemini-2.5-flash',
      settings: { notifications: true, sound: false, demo: true },
      plants: DATA.PLANTS_SEED.map(p => ({
        ...p,
        lastWatered: isoDaysAgo(p.lastWateredDays),
        createdAt: isoDaysAgo(30 + Math.floor(Math.random() * 60))
      })),
      fields: DATA.FIELDS_SEED.map(f => ({ ...f, createdAt: isoDaysAgo(60) })),
      journal: DATA.JOURNAL_SEED.map((j, i) => ({
        id: `j-seed-${i}`,
        ...j,
        createdAt: isoDaysAgo(j.daysAgo)
      })),
      chat: [],
      lastResult: null,
      weather: null,
      weatherUpdated: null,
      counters: { scans: 14, treatments: 3 }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return seed();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 3) return seed();
      const base = seed();
      return {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings || {}) },
        plants: Array.isArray(parsed.plants) ? parsed.plants : base.plants,
        fields: Array.isArray(parsed.fields) ? parsed.fields : base.fields,
        journal: Array.isArray(parsed.journal) ? parsed.journal : base.journal,
        chat: Array.isArray(parsed.chat) ? parsed.chat : []
      };
    } catch {
      return seed();
    }
  }

  function init() {
    if (!state) state = load();
    return state;
  }

  function get() { return state || init(); }
  function getKey(k) { return get()[k]; }

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(get())); } catch (e) { console.warn('AgroLens: не вдалося зберегти стан', e); }
    }, 120);
  }

  function commit() {
    persist();
    listeners.forEach(fn => { try { fn(get()); } catch (e) { console.warn(e); } });
  }

  function set(patch) {
    state = { ...get(), ...patch };
    commit();
    return state;
  }

  function update(mutator) {
    const next = mutator(get());
    state = next || get();
    commit();
    return state;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function reset() {
    state = seed();
    try { localStorage.removeItem(KEY); } catch {}
    commit();
    return state;
  }

  function setMode(mode) { return set({ mode: mode === 'home' ? 'home' : 'farm' }); }
  function setTheme(theme) { return set({ theme: theme === 'dark' ? 'dark' : 'light' }); }
  function toggleTheme() { return setTheme(get().theme === 'dark' ? 'light' : 'dark'); }
  function completeOnboarding() { return set({ onboarded: true }); }

  function setKey(key) {
    return set({ apiKey: String(key || '').trim() });
  }

  function setModel(model) {
    return set({ model: String(model || 'gemini-2.5-flash').trim() });
  }

  function setSetting(name, value) {
    return set({ settings: { ...get().settings, [name]: value } });
  }

  function nextWatering(plant) {
    const last = new Date(plant.lastWatered);
    const next = new Date(last.getTime() + plant.waterEvery * Utils.DAY);
    const daysLeft = Utils.daysBetween(new Date(), next);
    return { date: next, daysLeft, overdue: daysLeft < 0, today: daysLeft === 0 };
  }

  function plantStatus(plant) {
    const w = nextWatering(plant);
    if (plant.health === 'risk') return { key: 'risk', label: 'Потрібна увага', cls: 'bad' };
    if (plant.health === 'attention') return { key: 'attention', label: 'Спостерігати', cls: 'warn' };
    if (w.overdue) return { key: 'thirsty', label: 'Час полити', cls: 'warn' };
    return { key: 'good', label: 'Здорова', cls: 'good' };
  }

  function waterPlant(id) {
    const plant = get().plants.find(p => p.id === id);
    if (!plant) return;
    const now = new Date().toISOString();
    update(s => {
      const plants = s.plants.map(p => p.id === id ? { ...p, lastWatered: now } : p);
      const journal = [{
        id: Utils.uid('j'),
        type: 'water',
        title: `Полив: ${plant.name}`,
        sub: `Наступний полив через ${plant.waterEvery} ${Utils.plural(plant.waterEvery, 'день', 'дні', 'днів')}`,
        plant: plant.name,
        icon: 'drop',
        status: 'ok',
        createdAt: now
      }, ...s.journal];
      return { ...s, plants, journal, counters: { ...s.counters, treatments: s.counters.treatments } };
    });
  }

  function addPlant(data) {
    const plant = {
      id: Utils.uid('p'),
      name: data.name || 'Нова рослина',
      species: data.species || 'Рослина',
      room: data.room || 'Дім',
      art: data.art || 'generic',
      waterEvery: Number(data.waterEvery) || 7,
      lastWatered: new Date().toISOString(),
      light: data.light || 'Розсіяне',
      health: 'good',
      pot: data.pot || 'Ø 18 см',
      note: data.note || '',
      createdAt: new Date().toISOString()
    };
    update(s => ({
      ...s,
      plants: [plant, ...s.plants],
      journal: [{
        id: Utils.uid('j'), type: 'plant', title: `Додано рослину: ${plant.name}`,
        sub: `${plant.room} · полив кожні ${plant.waterEvery} дн.`, plant: plant.name,
        icon: 'plus', status: 'ok', createdAt: plant.createdAt
      }, ...s.journal]
    }));
    return plant;
  }

  function updatePlant(id, patch) {
    update(s => ({ ...s, plants: s.plants.map(p => p.id === id ? { ...p, ...patch } : p) }));
  }

  function removePlant(id) {
    const plant = get().plants.find(p => p.id === id);
    update(s => ({
      ...s,
      plants: s.plants.filter(p => p.id !== id),
      journal: plant ? [{
        id: Utils.uid('j'), type: 'note', title: `Видалено рослину: ${plant.name}`,
        sub: plant.room, plant: plant.name, icon: 'trash', status: 'ok', createdAt: new Date().toISOString()
      }, ...s.journal] : s.journal
    }));
  }

  function addField(data) {
    const field = {
      id: Utils.uid('f'),
      name: data.name || 'Нове поле',
      crop: data.crop || 'Культура',
      cropType: data.cropType || 'generic',
      area: Number(data.area) || 1,
      stage: data.stage || 'Вегетація',
      risk: 'low',
      lastScan: 'ще не сканували',
      note: data.note || '',
      createdAt: new Date().toISOString()
    };
    update(s => ({ ...s, fields: [field, ...s.fields] }));
    return field;
  }

  function removeField(id) {
    update(s => ({ ...s, fields: s.fields.filter(f => f.id !== id) }));
  }

  function addJournal(entry) {
    const item = {
      id: Utils.uid('j'),
      createdAt: new Date().toISOString(),
      icon: 'scan',
      status: 'ok',
      ...entry
    };
    update(s => ({ ...s, journal: [item, ...s.journal] }));
    return item;
  }

  function setLastResult(result) {
    return set({ lastResult: result || null });
  }

  function saveDiagnosis(result, plantName = '') {
    const item = addJournal({
      type: 'scan',
      title: `Діагностика: ${result.diagnosis}`,
      sub: `${result.plant || 'Рослина'} · впевненість ${result.confidence}%${result.source === 'demo' ? ' · демо' : ' · Gemini'}`,
      plant: plantName || result.plant || 'Рослина',
      icon: 'scan',
      status: result.severity === 'high' ? 'warning' : 'ok'
    });
    update(s => ({
      ...s,
      lastResult: result,
      counters: { ...s.counters, scans: (s.counters.scans || 0) + 1 }
    }));
    return item;
  }

  function addChat(message) {
    update(s => ({
      ...s,
      chat: [...s.chat, { ...message, id: message.id || Utils.uid('m'), createdAt: message.createdAt || new Date().toISOString() }].slice(-80)
    }));
  }

  function clearChat() { return set({ chat: [] }); }

  function setWeather(data) {
    return set({ weather: data, weatherUpdated: new Date().toISOString() });
  }

  function stats() {
    const s = get();
    const urgent = s.plants.filter(p => {
      const st = plantStatus(p);
      return st.key === 'risk' || st.key === 'attention' || nextWatering(p).overdue;
    }).length;
    const today = s.plants.filter(p => nextWatering(p).today || nextWatering(p).overdue).length;
    return {
      plants: s.plants.length,
      fields: s.fields.length,
      hectares: s.fields.reduce((sum, f) => sum + (Number(f.area) || 0), 0),
      urgent,
      today,
      scans: s.counters?.scans || 0,
      journal: s.journal.length,
      treatments: s.journal.filter(j => j.type === 'treatment').length
    };
  }

  function exportJSON() {
    const s = get();
    const payload = { app: 'AgroLens', exportedAt: new Date().toISOString(), data: s };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrolens-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return {
    init, get, getKey, set, update, subscribe, reset, commit,
    setMode, setTheme, toggleTheme, completeOnboarding,
    setKey, setModel, setSetting, nextWatering, plantStatus,
    waterPlant, addPlant, updatePlant, removePlant, addField, removeField,
    addJournal, setLastResult, saveDiagnosis, addChat, clearChat,
    setWeather, stats, exportJSON, KEY
  };
})();
