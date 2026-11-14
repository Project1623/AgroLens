/* AgroLens — inline icon set (stroke, 24×24, currentColor) */
const Icons = (() => {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M4 12h16"/>',
    leaf: '<path d="M12 21C7 21 3 17 3 12 3 6.5 8 3 21 3c0 13-3.5 18-9 18Z"/><path d="M3.5 20.5C6 14 11 9.5 18 7.5"/>',
    sprout: '<path d="M12 21v-8"/><path d="M12 13c0-4-3-7-8-7 0 4 3 7 8 7Z"/><path d="M12 10c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6Z"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/><path d="M8 7h8"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H7l-4 3v-5.2A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 14h5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6.5 19h11Z"/>',
    journal: '<path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 3v18M12 8h4M12 12h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    camera: '<path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="4"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    'arrow-right': '<path d="M4 12h16M14 6l6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'chevron-right': '<path d="m9 5 7 7-7 7"/>',
    'chevron-down': '<path d="m5 9 7 7 7-7"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    'plus-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    alert: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17.5v.1"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7a2.5 2.5 0 1 1-2.5 2.5"/>',
    humidity: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
    sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    send: '<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-8.5L2 8.5 21 3Z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l3 3M14 9l2 2"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    'wifi-off': '<path d="M2 2l20 20M8.5 8.5A10 10 0 0 1 21 9M5 12.5a10 10 0 0 1 3-2M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r=".6"/>',
    bug: '<rect x="8" y="6" width="8" height="12" rx="4"/><path d="M8 10H4M8 14H4M8 18l-3 2M16 10h4M16 14h4M16 18l3 2M9 6 7 3M15 6l2-3M12 6v12"/>',
    bacteria: '<circle cx="7" cy="8" r="3"/><circle cx="16" cy="14" r="4"/><circle cx="18" cy="6" r="1.5"/><path d="M9 10.5 12 13M13 17.5l2.5 2"/>',
    pot: '<path d="M5 9h14l-1.5 10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2L5 9Z"/><path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
    ai: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    stethoscope: '<path d="M5 3v5a4 4 0 0 0 8 0V3"/><path d="M9 12v3a5 5 0 0 0 10 0v-3"/><circle cx="19" cy="10" r="2"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    thermometer: '<path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
    rain: '<path d="M17.5 15a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6.5 15"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
    snow: '<path d="M17.5 15a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6.5 15"/><path d="M8 18v3M6.5 19.5h3M12 18v3M10.5 19.5h3M16 18v3M14.5 19.5h3"/>',
    storm: '<path d="M17.5 15a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6.5 15"/><path d="m12 14-3 5h3l-2 4 6-6h-3l2-3"/>',
    fog: '<path d="M4 10h16M6 14h12M3 18h18"/>',
    ruler: '<path d="m3 17 14-14 4 4L7 21l-4-4Z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    play: '<path d="m7 4 13 8-13 8V4Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
    gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-4"/><circle cx="12" cy="18" r="1"/>',
    lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3Z"/>',
    waves: '<path d="M2 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
    tree: '<path d="M12 22v-6"/><path d="M12 16c-4 0-7-2.5-7-6 0-3 2-5 4-5 .5-2 1.5-3 3-3s2.5 1 3 3c2 0 4 2 4 5 0 3.5-3 6-7 6Z"/>',
    apple: '<path d="M12 7c-4-2-8 1-8 6 0 4 3 8 5 8 1 0 2-.5 3-.5s2 .5 3 .5c2 0 5-4 5-8 0-5-4-8-8-6Z"/><path d="M12 7c0-2 1-4 3-4"/>',
    wheat: '<path d="M12 22V6"/><path d="M12 10c-2 0-4-2-4-4 2 0 4 2 4 4ZM12 10c2 0 4-2 4-4-2 0-4 2-4 4ZM12 15c-2 0-4-2-4-4 2 0 4 2 4 4ZM12 15c2 0 4-2 4-4-2 0-4 2-4 4ZM12 20c-2 0-4-2-4-4 2 0 4 2 4 4ZM12 20c2 0 4-2 4-4-2 0-4 2-4 4Z"/>',
    spray: '<path d="M9 8h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z"/><path d="M10 8V5h4v3M8 13h8"/><path d="M19 6h.01M21 9h.01M19 12h.01M22 4h.01"/><path d="M17 8l2-2"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    cucumber: '<path d="M5 19c-2-2 0-5 3-7 3-2 6-4 8-6 2-2 5-2 5 1 0 2-2 4-4 6-3 3-5 6-7 7-2 1-4 1-5-1Z"/><path d="M9 15c1 1 3 1 4 0"/>',
    tomato: '<circle cx="12" cy="14" r="7"/><path d="M12 7c-1-2-3-3-5-3M12 7c1-2 3-3 5-3M12 7c0-2 0-3 1-4"/>',
    hand: '<path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V15c0 4-3 6-6 6-2 0-4-1-5-3l-2-4a1.5 1.5 0 0 1 2.5-1.7L8 14"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    'alert-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.1"/>',
    'chevron-left': '<path d="m15 5-7 7 7 7"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
  };

  function get(name, cls = '') {
    const inner = P[name] || P.info;
    return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
  }

  function brand(size = 40) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="13" fill="#143826"/>
      <path d="M20 8c6.5 3.6 10 8.6 10 14 0 5.4-3.6 9.6-10 11.6C13.6 31.6 10 27.4 10 22c0-5.4 3.5-10.4 10-14Z" stroke="#DFF3E4" stroke-width="1.5"/>
      <path d="M20 10.5V32M20 21l-5.5-4.6M20 26l6-5" stroke="#DFF3E4" stroke-width="1.4" stroke-linecap="round"/>
      <circle cx="30.5" cy="10.5" r="2.6" fill="#E9A23B"/>
    </svg>`;
  }

  return { get, brand, has: n => !!P[n], names: Object.keys(P) };
})();
