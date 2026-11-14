/* AgroLens — AI layer: Gemini vision/chat, demo fallbacks, weather & local rules */
const AI = (() => {
  const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
  const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';
  const LOCATION = { name: 'Тернопіль', lat: 49.5535, lon: 25.5948 };
  const MODEL_FALLBACKS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

  const SYSTEM_AGRO = `Ти — AgroLens, досвідчений український агроном і фітопатолог.
Ти допомагаєш і фермерам, і власникам кімнатних рослин. Відповідай українською, коротко, структуровано й практично.
Ніколи не вигадуй точний діагноз, якщо фото нечітке: вкажи ймовірні варіанти та запропонуй зробити кращий кадр.
Для хімічних препаратів завжди нагадуй про інструкцію, дозування, строк очікування та засоби захисту.
Не давай порад, що шкодять бджолам під час цвітіння. Не замінюй професійну лабораторну діагностику.`;

  function hasKey() {
    return String(Store.get().apiKey || '').trim().length > 8;
  }

  function model() {
    return Store.get().model || 'gemini-2.5-flash';
  }

  function timeout(ms = 45000) {
    const c = new AbortController();
    const id = setTimeout(() => c.abort(), ms);
    return { signal: c.signal, done: () => clearTimeout(id) };
  }

  async function geminiFetch(path, body, key, ms = 45000) {
    const t = timeout(ms);
    try {
      const res = await fetch(`${GEMINI_BASE}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
        signal: t.signal
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error?.message || `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }
      return data;
    } finally {
      t.done();
    }
  }

  function extractText(data) {
    return (data?.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('\n').trim();
  }

  function parseJSON(text) {
    if (!text) return null;
    let t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    try { return JSON.parse(t); } catch {}
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try { return JSON.parse(t.slice(start, end + 1)); } catch {}
    }
    return null;
  }

  async function validateKey(key) {
    const k = String(key || '').trim();
    if (!k) return { ok: false, error: 'Ключ порожній' };
    try {
      const t = timeout(20000);
      const res = await fetch(`${GEMINI_BASE}/models?pageSize=50`, {
        headers: { 'x-goog-api-key': k },
        signal: t.signal
      });
      t.done();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: data?.error?.message || `HTTP ${res.status}` };
      const models = (data.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent'));
      return { ok: true, models: models.map(m => String(m.name || '').replace('models/', '')) };
    } catch (e) {
      return { ok: false, error: e.name === 'AbortError' ? 'Час очікування вичерпано' : e.message };
    }
  }

  /* ---------------- demo diagnosis ---------------- */

  function plantLabel(crop, mode) {
    const map = {
      tomato: 'Томат', cucumber: 'Огірок', apple: 'Яблуня', basil: 'Базилік',
      monstera: 'Монстера', ficus: 'Фікус', wheat: 'Пшениця', generic: mode === 'home' ? 'Кімнатна рослина' : 'Культура'
    };
    return map[crop] || (mode === 'home' ? 'Кімнатна рослина' : 'Рослина');
  }

  function resultFromDisease(disease, opts = {}) {
    return {
      id: opts.id || Utils.uid('res'),
      diseaseId: disease.id,
      diagnosis: disease.name,
      latin: disease.latin,
      category: disease.category,
      plant: opts.plant || plantLabel(disease.art, opts.mode),
      confidence: opts.confidence ?? disease.confidence ?? 88,
      severity: disease.severity || 'medium',
      summary: disease.summary,
      symptoms: [...disease.symptoms],
      causes: [...disease.causes],
      treatment: {
        immediate: [...disease.treatment.immediate],
        organic: [...disease.treatment.organic],
        chemical: [...disease.treatment.chemical],
        prevention: [...disease.treatment.prevention]
      },
      weatherNote: disease.weather,
      art: disease.art,
      lesion: disease.lesion,
      source: opts.source || 'demo',
      image: opts.image || null,
      createdAt: new Date().toISOString(),
      disclaimer: opts.source === 'gemini'
        ? 'Результат сформовано AI-моделлю Gemini за одним фото. Це не лабораторний висновок: підтвердьте діагноз у спеціаліста перед дорогими обробками.'
        : 'Демо-режим AgroLens: результат узято з локальної бази знань. Підключіть Gemini у налаштуваннях для реального аналізу фото.'
    };
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function demoAnalyze({ sampleId, crop = 'tomato', mode = 'farm', fileName = '' } = {}) {
    const sample = DATA.SAMPLES.find(s => s.id === sampleId);
    let disease;
    if (sample) {
      disease = DATA.byId[sample.disease];
    } else {
      const pool = mode === 'home'
        ? ['rootRot', 'spiderMite', 'lowLight', 'powdery', 'lowHumidity']
        : ['phytophthora', 'powdery', 'downy', 'septoria', 'appleScab'];
      disease = DATA.byId[pool[hashCode(fileName + crop + Date.now()) % pool.length]];
    }
    const confidence = Math.min(97, 78 + (hashCode(fileName || sampleId || crop) % 17));
    return new Promise(resolve => {
      setTimeout(() => resolve(resultFromDisease(disease, {
        source: 'demo',
        confidence,
        plant: sample ? plantLabel(sample.type, mode) : plantLabel(crop, mode),
        mode
      })), 1200);
    });
  }

  /* ---------------- Gemini vision ---------------- */

  function normalizeAIResult(raw, meta = {}) {
    const d = raw || {};
    const fallback = DATA.DISEASES.find(x => x.name.toLowerCase() === String(d.diagnosis || '').toLowerCase()) || null;
    const severity = ['low', 'medium', 'high'].includes(d.severity) ? d.severity : (fallback?.severity || 'medium');
    const confidence = Utils.clamp(Number(d.confidence) || fallback?.confidence || 80, 30, 99);
    const treatment = d.treatment || {};
    const arr = v => Array.isArray(v) ? v.filter(Boolean).map(String) : (v ? [String(v)] : []);
    return {
      id: Utils.uid('res'),
      diseaseId: fallback?.id || null,
      diagnosis: String(d.diagnosis || fallback?.name || 'Потребує уточнення'),
      latin: String(d.latin || fallback?.latin || ''),
      category: String(d.category || fallback?.category || 'care'),
      plant: String(d.plant || meta.plant || 'Рослина'),
      confidence: Math.round(confidence),
      severity,
      summary: String(d.summary || fallback?.summary || 'Модель не змогла впевнено описати стан рослини. Спробуйте чіткіше фото листка.'),
      symptoms: arr(d.symptoms).length ? arr(d.symptoms) : (fallback?.symptoms || []),
      causes: arr(d.causes).length ? arr(d.causes) : (fallback?.causes || []),
      treatment: {
        immediate: arr(treatment.immediate || treatment.steps).slice(0, 5),
        organic: arr(treatment.organic).slice(0, 5),
        chemical: arr(treatment.chemical).slice(0, 5),
        prevention: arr(treatment.prevention).slice(0, 5)
      },
      weatherNote: String(d.weatherNote || fallback?.weather || ''),
      art: fallback?.art || meta.crop || 'generic',
      lesion: fallback?.lesion || 'none',
      source: 'gemini',
      image: meta.image || null,
      createdAt: new Date().toISOString(),
      disclaimer: String(d.disclaimer || 'Результат сформовано AI-моделлю Gemini за одним фото. Це не лабораторний висновок.')
    };
  }

  async function geminiAnalyze({ dataUrl, mime = 'image/jpeg', crop = 'generic', mode = 'farm' }) {
    const key = Store.get().apiKey;
    const base64 = String(dataUrl).split(',')[1];
    if (!base64) throw new Error('Не вдалося прочитати фото');
    const prompt = `Проаналізуй фото рослини як AgroLens.
Культура або тип: ${crop}. Режим: ${mode === 'home' ? 'кімнатна рослина / побут' : 'ферма / город'}.
Визнач найбільш імовірну хворобу, шкідника, дефіцит або проблему догляду.
Поверни ЛИШЕ валідний JSON без markdown за схемою:
{
 "plant": "культура або рослина українською",
 "diagnosis": "назва проблеми українською",
 "latin": "латинська назва або порожній рядок",
 "category": "fungal|bacterial|viral|pest|deficiency|care",
 "confidence": 0-100,
 "severity": "low|medium|high",
 "summary": "1-2 речення про стан",
 "symptoms": ["що видно на фото"],
 "causes": ["імовірні причини"],
 "treatment": {
   "immediate": ["невідкладні кроки"],
   "organic": ["біологічні/народні засоби"],
   "chemical": ["препарати з обережністю"],
   "prevention": ["профілактика"]
 },
 "weatherNote": "коли та за якої погоди обробляти",
 "disclaimer": "коротке застереження"
}
Якщо на фото не рослина або кадр нечіткий — постав diagnosis "Потрібне краще фото", confidence нижче 45 і поясни, що зробити.`;

    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_AGRO }] },
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mime || 'image/jpeg', data: base64 } }
        ]
      }],
      generationConfig: { temperature: 0.15, maxOutputTokens: 1800, responseMimeType: 'application/json' }
    };

    let data;
    let lastErr;
    for (const m of [model(), ...MODEL_FALLBACKS.filter(x => x !== model())]) {
      try {
        data = await geminiFetch(`models/${m}:generateContent`, body, key, 60000);
        break;
      } catch (e) {
        lastErr = e;
        if (e.status !== 404) break;
      }
    }
    if (!data) throw lastErr || new Error('Gemini не відповів');
    const parsed = parseJSON(extractText(data));
    if (!parsed) throw new Error('Gemini повернув неочікуваний формат відповіді');
    return normalizeAIResult(parsed, { crop, image: dataUrl });
  }

  async function analyze(opts) {
    if (opts.sampleId) return demoAnalyze(opts);
    if (!hasKey()) return demoAnalyze(opts);
    try {
      return await geminiAnalyze(opts);
    } catch (e) {
      const demo = await demoAnalyze(opts);
      demo.fallbackReason = e.message;
      return demo;
    }
  }

  /* ---------------- Gemini chat ---------------- */

  function buildContext() {
    const s = Store.get();
    const plants = s.plants.map(p => {
      const w = Store.nextWatering(p);
      return `${p.name} (${p.room}, ${p.species}) — полив ${w.daysLeft < 0 ? `прострочено на ${Math.abs(w.daysLeft)} дн.` : `через ${w.daysLeft} дн.`}, стан: ${Store.plantStatus(p).label}`;
    }).join('; ');
    const fields = s.fields.map(f => `${f.name}: ${f.crop}, ${f.area} га, стадія ${f.stage}, ризик ${f.risk}`).join('; ');
    const last = s.lastResult ? `Останній діагноз: ${s.lastResult.diagnosis}, впевненість ${s.lastResult.confidence}%, рослина ${s.lastResult.plant}.` : 'Діагностик ще не було.';
    return `Режим: ${s.mode === 'home' ? 'дім' : 'ферма'}. Рослини: ${plants || 'немає'}. Поля: ${fields || 'немає'}. ${last}`;
  }

  async function geminiChat({ messages, image }) {
    const key = Store.get().apiKey;
    const history = messages.slice(-12).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
    if (image && history.length) {
      const b64 = String(image.dataUrl).split(',')[1];
      history[history.length - 1].parts.push({ inlineData: { mimeType: image.mime || 'image/jpeg', data: b64 } });
    }
    const body = {
      systemInstruction: { parts: [{ text: `${SYSTEM_AGRO}\n\nКонтекст користувача: ${buildContext()}\n\nВідповідай максимум 180 словами. Використовуй короткі пункти, якщо це доречно.` }] },
      contents: history,
      generationConfig: { temperature: 0.45, maxOutputTokens: 900 }
    };
    let data;
    let lastErr;
    for (const m of [model(), ...MODEL_FALLBACKS.filter(x => x !== model())]) {
      try {
        data = await geminiFetch(`models/${m}:generateContent`, body, key, 60000);
        break;
      } catch (e) {
        lastErr = e;
        if (e.status !== 404) break;
      }
    }
    if (!data) throw lastErr || new Error('Gemini не відповів');
    const text = extractText(data);
    if (!text) throw new Error('Порожня відповідь Gemini');
    return { text, source: 'gemini' };
  }

  /* ---------------- local agronomist ---------------- */

  function findPlant(text) {
    const s = Store.get();
    const lower = text.toLowerCase();
    const stem = w => String(w || '').toLowerCase().replace(/[^a-zа-яіїєґ0-9]/gi, '').slice(0, 5);
    return s.plants.find(p => { const k = stem(p.name.split(' ')[0]); return k && lower.includes(k); })
      || s.plants.find(p => { const k = stem(p.species.split(' ')[0]); return k && lower.includes(k); })
      || null;
  }

  function wateringAnswer(text) {
    const plant = findPlant(text);
    if (plant) {
      const w = Store.nextWatering(plant);
      const when = w.overdue
        ? `вже прострочено на ${Math.abs(w.daysLeft)} дн. — полийте сьогодні`
        : w.today
          ? 'час полити сьогодні'
          : `наступний полив через ${w.daysLeft} дн. (${Utils.fmtDate(w.date)})`;
      return `**${plant.name}** (${plant.room})\n\n• Полив кожні ${plant.waterEvery} дн.\n• Зараз: ${when}.\n• Перевірте вологість пальцем на 2–3 см — якщо ґрунт вологий, зачекайте.\n• Поливайте під корінь, зливайте воду з піддона.`;
    }
    const due = Store.get().plants.filter(p => {
      const w = Store.nextWatering(p);
      return w.overdue || w.today;
    });
    if (due.length) {
      return `Сьогодні варто полити:\n\n${due.map(p => `• **${p.name}** — ${p.room}`).join('\n')}\n\nРешта рослин за графіком. Перевіряйте ґрунт перед поливом, а не лише дату.`;
    }
    return 'Усі рослини за графіком поливу. Найближчим часом полив не потрібен — перевірте ґрунт пальцем на 2–3 см.';
  }

  function diseaseAnswer(id) {
    const d = DATA.byId[id];
    if (!d) return null;
    return `**${d.name}** (${d.latin})\n\n${d.summary}\n\n**Що зробити зараз:**\n${d.treatment.immediate.map(x => `• ${x}`).join('\n')}\n\n**Біологічні засоби:**\n${d.treatment.organic.slice(0, 2).map(x => `• ${x}`).join('\n')}\n\nПрофілактика: ${d.treatment.prevention[0].toLowerCase()}\n\n_Це демо-порада з локальної бази. Для точного діагнозу — фото або ключ Gemini._`;
  }

  function weekPlan() {
    const s = Store.get();
    const lines = s.plants.slice(0, 5).map(p => {
      const w = Store.nextWatering(p);
      return `• **${p.name}** — ${w.overdue ? 'полити сьогодні' : w.today ? 'полити сьогодні' : `полив ${Utils.fmtShort(w.date)}`}`;
    });
    return `**План на тиждень**\n\n${lines.join('\n')}\n\n• Огляньте нижній бік листків на шкідників — 5 хвилин у середу.\n• Поверніть рослини до вікна на чверть оберту.\n• Протріть листя від пилу.\n• Перевірте, чи немає води в піддонах.`;
  }

  function localAnswer(text) {
    const t = String(text || '').toLowerCase();
    if (/полив|полити|полива|вод[аиу]|сохне ґрунт/.test(t)) return wateringAnswer(text);
    if (/план|тиждень|графік|догляд/.test(t)) return weekPlan();
    if (/кліщ|павутин/.test(t)) return diseaseAnswer('spiderMite');
    if (/попелиц|тля/.test(t)) return diseaseAnswer('aphids');
    if (/фітофтор|томат/.test(t)) return diseaseAnswer('phytophthora');
    if (/борошн|наліт біл/.test(t)) return diseaseAnswer('powdery');
    if (/жовт|хлороз/.test(t)) return diseaseAnswer('rootRot');
    if (/гнил|перелив|корін/.test(t)) return diseaseAnswer('rootRot');
    if (/світл|тінь|темн/.test(t)) return diseaseAnswer('lowLight');
    if (/сонц|опік/.test(t)) return diseaseAnswer('sunburn');
    if (/погод|оброб|завтра|дощ|вітер/.test(t)) {
      const weather = Store.get().weather;
      if (weather) {
        const risk = riskIndex(weather);
        return `**Погода в Тернополі**\n\n• Зараз ${Math.round(weather.current.temp)}°, вологість ${weather.current.humidity}%, вітер ${Math.round(weather.current.wind)} км/г.\n• Ризик хвороб: **${risk.level}** (${risk.overall}/100).\n• Найкраще вікно для обробки: ${bestWindowText(weather)}.\n\nНе обробляйте перед дощем і при вітрі понад 15 км/г.`;
      }
      return 'Натисніть «Оновити» на екрані погоди — я порахую ризик хвороб і вікно для обробки за прогнозом.';
    }
    if (/привіт|добрий|вітаю/.test(t)) {
      const s = Store.stats();
      return `Вітаю! У вас ${s.plants} рослин і ${s.fields} полів. Можу перевірити полив, пояснити симптоми або скласти план догляду. Що турбує?`;
    }
    const plant = findPlant(text);
    if (plant) {
      const w = Store.nextWatering(plant);
      return `**${plant.name}**\n\n• Місце: ${plant.room}\n• Світло: ${plant.light}\n• Полив: кожні ${plant.waterEvery} дн., ${w.overdue ? 'уже прострочено' : `через ${w.daysLeft} дн.`}\n• Стан: ${Store.plantStatus(plant).label}\n\n${plant.note || 'Огляньте листя з обох боків і перевірте вологість ґрунту.'}`;
    }
    return `Можу допомогти з діагностикою, поливом, шкідниками та планом догляду. Опишіть, що бачите: колір листя, плями, наліт, комах або як давно поливали. Або додайте фото — у демо-режимі працює миттєвий аналіз.`;
  }

  async function chat({ messages, image }) {
    if (hasKey()) {
      try {
        return await geminiChat({ messages, image });
      } catch (e) {
        const text = localAnswer(messages[messages.length - 1]?.text || '');
        return { text, source: 'demo', error: e.message };
      }
    }
    await new Promise(r => setTimeout(r, 550));
    return { text: localAnswer(messages[messages.length - 1]?.text || ''), source: 'demo' };
  }

  /* ---------------- symptom checker ---------------- */

  function checker(symptoms, context) {
    const scores = {};
    const reasons = {};
    symptoms.forEach(id => {
      const sym = DATA.SYMPTOMS.find(s => s.id === id);
      if (!sym) return;
      Object.entries(sym.weights).forEach(([d, w]) => {
        scores[d] = (scores[d] || 0) + w;
        (reasons[d] = reasons[d] || []).push(sym.label);
      });
    });
    Object.entries(context || {}).forEach(([group, val]) => {
      const w = DATA.CONTEXT_WEIGHTS[group]?.[val];
      if (!w) return;
      Object.entries(w).forEach(([d, n]) => {
        scores[d] = (scores[d] || 0) + n;
        const label = DATA.CONTEXT[group]?.find(x => x.id === val)?.label;
        if (label) (reasons[d] = reasons[d] || []).push(label);
      });
    });
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!entries.length) return [];
    const top = entries[0][1];
    return entries.map(([id, score], i) => {
      const d = DATA.byId[id];
      const pct = Math.round(Utils.clamp(58 + (score / top) * 38 - i * 4, 24, 97));
      return { disease: d, score, pct, reasons: [...new Set(reasons[id] || [])].slice(0, 3) };
    });
  }

  /* ---------------- weather ---------------- */

  function mapWeather(raw) {
    const daily = (raw.daily?.time || []).map((t, i) => ({
      date: t,
      weekday: new Date(t + 'T12:00:00').getDay(),
      max: Math.round(raw.daily.temperature_2m_max[i]),
      min: Math.round(raw.daily.temperature_2m_min[i]),
      code: raw.daily.weather_code[i],
      humidity: Math.round(raw.daily.relative_humidity_2m_mean?.[i] ?? 80),
      rain: Math.round(raw.daily.precipitation_probability_max?.[i] ?? 0)
    }));
    const hourly = (raw.hourly?.time || []).map((t, i) => ({
      time: t,
      hour: new Date(t).getHours(),
      temp: Math.round(raw.hourly.temperature_2m[i] * 10) / 10,
      humidity: Math.round(raw.hourly.relative_humidity_2m[i]),
      rain: Math.round(raw.hourly.precipitation_probability[i] || 0),
      wind: Math.round(raw.hourly.wind_speed_10m[i] || 0)
    }));
    return {
      current: {
        temp: Math.round(raw.current.temperature_2m * 10) / 10,
        feels: Math.round((raw.current.apparent_temperature ?? raw.current.temperature_2m) * 10) / 10,
        humidity: Math.round(raw.current.relative_humidity_2m),
        wind: Math.round(raw.current.wind_speed_10m),
        code: raw.current.weather_code,
        precip: raw.current.precipitation || 0
      },
      daily,
      hourly,
      location: LOCATION.name,
      updated: new Date().toISOString(),
      demo: false
    };
  }

  async function fetchWeather(force = false) {
    const s = Store.get();
    const fresh = s.weatherUpdated && (Date.now() - new Date(s.weatherUpdated).getTime() < 30 * 60 * 1000);
    if (!force && s.weather && fresh) return s.weather;
    const params = new URLSearchParams({
      latitude: LOCATION.lat,
      longitude: LOCATION.lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_mean',
      timezone: 'Europe/Kyiv',
      forecast_days: '7'
    });
    try {
      const t = timeout(12000);
      const res = await fetch(`${OPEN_METEO}?${params}`, { signal: t.signal });
      t.done();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const data = mapWeather(raw);
      Store.setWeather(data);
      return data;
    } catch (e) {
      if (s.weather) return { ...s.weather, stale: true };
      const demo = DATA.demoWeather();
      Store.setWeather(demo);
      return demo;
    }
  }

  function riskIndex(weather) {
    if (!weather) {
      return { overall: 0, level: 'Немає даних', color: '#8C9C91', parts: [] };
    }
    const daily = weather.daily || [];
    const humidity = daily.length ? daily.reduce((a, d) => a + (d.humidity || 75), 0) / daily.length : weather.current.humidity;
    const rain = daily.length ? daily.reduce((a, d) => a + (d.rain || 0), 0) / daily.length : 40;
    const avgTemp = daily.length ? daily.reduce((a, d) => a + ((d.max + d.min) / 2), 0) / daily.length : weather.current.temp;
    const mild = avgTemp >= 14 && avgTemp <= 25 ? 22 : avgTemp >= 8 ? 10 : 0;
    const fungal = Utils.clamp(Math.round((humidity - 55) * 1.45 + rain * 0.35 + mild), 4, 98);
    const phytophthora = Utils.clamp(Math.round((humidity - 58) * 1.7 + rain * 0.42 + (avgTemp >= 15 && avgTemp <= 22 ? 24 : 6)), 3, 98);
    const powdery = Utils.clamp(Math.round((humidity - 62) * 1.1 + (avgTemp >= 15 && avgTemp <= 25 ? 22 : 8) + (rain < 35 ? 14 : 0)), 3, 95);
    const mites = Utils.clamp(Math.round((100 - humidity) * 1.55 + (avgTemp > 24 ? 24 : 0)), 2, 95);
    const overall = Math.round(fungal * 0.34 + phytophthora * 0.3 + powdery * 0.2 + mites * 0.16);
    const level = overall >= 70 ? 'Високий' : overall >= 45 ? 'Помірний' : 'Низький';
    const color = overall >= 70 ? '#C96044' : overall >= 45 ? '#E9A23B' : '#4E9B62';
    return {
      overall, level, color,
      parts: [
        { id: 'phytophthora', name: 'Фітофтороз', value: phytophthora, color: '#C96044' },
        { id: 'powdery', name: 'Борошниста роса', value: powdery, color: '#E9A23B' },
        { id: 'mites', name: 'Павутинний кліщ', value: mites, color: '#7C6BB0' },
        { id: 'fungal', name: 'Інші грибкові', value: fungal, color: '#4E9B62' }
      ]
    };
  }

  function treatmentWindows(weather) {
    if (!weather?.hourly?.length) return [];
    const now = new Date();
    const rows = weather.hourly.filter(h => {
      const d = h.time ? new Date(h.time) : null;
      return !d || d >= new Date(now.getTime() - 60 * 60 * 1000);
    }).slice(0, 24);
    const groups = [];
    let current = null;
    rows.forEach(h => {
      const tempOk = h.temp >= 5 && h.temp <= 26;
      const windOk = h.wind < 15;
      const rainOk = h.rain < 35;
      const good = tempOk && windOk && rainOk;
      if (good) {
        if (!current) current = { from: h.hour, to: h.hour, scores: [], rain: [], wind: [], temp: [] };
        current.to = h.hour;
        current.scores.push(Math.round(100 - h.rain * 0.7 - h.wind * 1.2));
        current.rain.push(h.rain); current.wind.push(h.wind); current.temp.push(h.temp);
      } else if (current) {
        groups.push(current); current = null;
      }
    });
    if (current) groups.push(current);
    return groups.slice(0, 3).map(g => ({
      from: g.from, to: g.to,
      label: `${Utils.pad(g.from)}:00–${Utils.pad(g.to + 1)}:00`,
      score: Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length),
      rain: Math.round(g.rain.reduce((a, b) => a + b, 0) / g.rain.length),
      wind: Math.round(g.wind.reduce((a, b) => a + b, 0) / g.wind.length),
      temp: Math.round(g.temp.reduce((a, b) => a + b, 0) / g.temp.length)
    }));
  }

  function bestWindowText(weather) {
    const w = treatmentWindows(weather);
    if (!w.length) return 'найближчі 24 години немає сухого вікна без вітру';
    return `${w[0].label}, дощ ${w[0].rain}%, вітер ${w[0].wind} км/г`;
  }

  function weatherLine(weather) {
    if (!weather) return '—';
    const info = DATA.weatherInfo(weather.current.code);
    return `${Math.round(weather.current.temp)}°, ${info.label.toLowerCase()}, вологість ${weather.current.humidity}%`;
  }

  return {
    hasKey, model, validateKey, analyze, demoAnalyze, chat, localAnswer,
    checker, fetchWeather, riskIndex, treatmentWindows, bestWindowText,
    weatherLine, resultFromDisease, buildContext, plantLabel, LOCATION
  };
})();
