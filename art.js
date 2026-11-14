/* AgroLens — hand-built botanical SVG art (offline, no external images) */
const Art = (() => {
  let counter = 0;
  const uid = p => `${p}${++counter}`;

  const PAL = {
    mint: '#BFE6C9',
    mint2: '#7CC48D',
    leaf1: '#4E9B62',
    leaf2: '#1F5C3A',
    leaf3: '#2F7D4F',
    dark: '#0B2417',
    amber: '#E9A23B',
    brown: '#7A4A24',
    cream: '#F3F8EA'
  };

  /* ---------------- leaf shapes (200 × 200 box) ---------------- */

  function leafMonstera(tone = 'plant') {
    const g = uid('mon'), m = uid('monmask');
    const c1 = tone === 'scan' ? '#3A7D55' : PAL.leaf1;
    const c2 = tone === 'scan' ? '#16452C' : PAL.leaf2;
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.55)' : 'rgba(210,241,217,.85)';
    return `<defs>
      <linearGradient id="${g}" x1="50" y1="20" x2="150" y2="180" gradientUnits="userSpaceOnUse">
        <stop stop-color="${c1}"/><stop offset=".55" stop-color="${PAL.leaf3}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <mask id="${m}">
        <path d="M100 18 C62 26 34 60 39 101 C43 133 66 157 100 176 C134 157 157 133 161 101 C166 60 138 26 100 18Z" fill="#fff"/>
        <path d="M58 58 C74 66 84 78 87 92 C73 87 62 74 58 58Z" fill="#000"/>
        <path d="M47 92 C62 96 74 104 82 116 C66 116 52 106 47 92Z" fill="#000"/>
        <path d="M55 126 C68 126 80 132 88 142 C72 146 59 139 55 126Z" fill="#000"/>
        <path d="M142 58 C126 66 116 78 113 92 C127 87 138 74 142 58Z" fill="#000"/>
        <path d="M153 92 C138 96 126 104 118 116 C134 116 148 106 153 92Z" fill="#000"/>
        <path d="M145 126 C132 126 120 132 112 142 C128 146 141 139 145 126Z" fill="#000"/>
        <ellipse cx="86" cy="72" rx="4.5" ry="9" fill="#000" transform="rotate(-22 86 72)"/>
        <ellipse cx="113" cy="104" rx="3.5" ry="7" fill="#000" transform="rotate(25 113 104)"/>
      </mask>
    </defs>
    <g>
      <path d="M100 18 C62 26 34 60 39 101 C43 133 66 157 100 176 C134 157 157 133 161 101 C166 60 138 26 100 18Z" fill="url(#${g})" stroke="${stroke}" stroke-width="1.8" mask="url(#${m})"/>
      <g fill="none" stroke="${tone === 'scan' ? 'rgba(210,245,220,.35)' : 'rgba(240,255,244,.42)'}" stroke-width="1.5" stroke-linecap="round">
        <path d="M100 27V169"/>
        <path d="M100 62 C88 66 78 76 72 90M100 62 C112 66 122 76 128 90"/>
        <path d="M100 100 C86 104 76 114 70 128M100 100 C114 104 124 114 130 128"/>
        <path d="M100 134 C90 138 82 146 77 156M100 134 C110 138 118 146 123 156"/>
      </g>
    </g>`;
  }

  function leafTomato(tone = 'plant') {
    const g = uid('tom');
    const c1 = tone === 'scan' ? '#3E8058' : PAL.leaf1;
    const c2 = tone === 'scan' ? '#17482E' : PAL.leaf2;
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.5)' : 'rgba(214,243,220,.8)';
    const leaflet = `M0 -34 C16 -28 24 -12 21 8 C18 24 8 33 0 36 C-8 33 -18 24 -21 8 C-24 -12 -16 -28 0 -34Z`;
    const items = [
      [100, 48, 0, .92], [76, 72, -38, .78], [124, 72, 38, .78],
      [63, 108, -60, .8], [137, 108, 60, .8],
      [74, 140, -36, .76], [126, 140, 36, .76]
    ];
    return `<defs>
      <linearGradient id="${g}" x1="60" y1="40" x2="150" y2="170" gradientUnits="userSpaceOnUse">
        <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <path d="M100 184 C98 150 102 116 100 84 C99 62 100 44 100 32" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
    ${items.map(([x, y, r, s]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="${leaflet}" fill="url(#${g})" stroke="${stroke}" stroke-width="1.7"/>
      <path d="M0 -26V30M0 -4 -12 -12M0 8 12 0" fill="none" stroke="rgba(235,255,240,.32)" stroke-width="1.2" stroke-linecap="round"/>
    </g>`).join('')}`;
  }

  function leafApple(tone = 'plant') {
    const g = uid('app');
    const c1 = tone === 'scan' ? '#43865C' : '#5AA96B';
    const c2 = tone === 'scan' ? '#19492F' : '#215F3C';
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.5)' : 'rgba(219,246,225,.8)';
    return `<defs><linearGradient id="${g}" x1="60" y1="25" x2="145" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <path d="M100 24 C130 40 149 72 143 112 C139 143 120 165 100 176 C80 165 61 143 57 112 C51 72 70 40 100 24Z" fill="url(#${g})" stroke="${stroke}" stroke-width="1.8"/>
      <g fill="none" stroke="rgba(236,255,241,.35)" stroke-width="1.4" stroke-linecap="round">
        <path d="M100 34V170"/>
        <path d="M100 62 C84 70 74 84 70 100M100 62 C116 70 126 84 130 100"/>
        <path d="M100 104 C86 112 78 124 75 138M100 104 C114 112 122 124 125 138"/>
      </g>
      <g fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".5">
        <path d="M72 60l-5 3M128 60l5 3M61 92l-5 2M139 92l5 2M58 124l-5 2M142 124l5 2M68 154l-4 3M132 154l4 3"/>
      </g>`;
  }

  function leafCucumber(tone = 'plant') {
    const g = uid('cuc');
    const c1 = tone === 'scan' ? '#3F8259' : '#58A769';
    const c2 = tone === 'scan' ? '#17482E' : '#1F5C3A';
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.5)' : 'rgba(219,246,225,.8)';
    return `<defs><linearGradient id="${g}" x1="45" y1="35" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <path d="M100 30 C112 30 118 48 128 52 C140 58 158 54 162 68 C166 82 150 92 148 104 C146 118 158 130 150 142 C142 154 126 148 114 154 C104 160 100 178 88 174 C76 170 76 152 66 146 C54 140 38 144 34 130 C30 116 46 106 48 94 C50 80 38 68 46 56 C54 44 70 50 82 44 C90 40 92 30 100 30Z" fill="url(#${g})" stroke="${stroke}" stroke-width="1.8"/>
      <g fill="none" stroke="rgba(236,255,241,.3)" stroke-width="1.2" stroke-linecap="round">
        <path d="M100 100 L62 62M100 100 L138 62M100 100 L52 104M100 100 L148 104M100 100 L66 146M100 100 L134 146M100 100 L100 170M100 100 L100 40"/>
      </g>`;
  }

  function leafBasil(tone = 'plant') {
    const g = uid('bas');
    const c1 = tone === 'scan' ? '#44875D' : '#63B274';
    const c2 = tone === 'scan' ? '#19492F' : '#2A6B45';
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.5)' : 'rgba(223,247,228,.8)';
    const lf = `M0 -23 C14 -17 19 -4 15 10 C12 20 5 25 0 27 C-5 25 -12 20 -15 10 C-19 -4 -14 -17 0 -23Z`;
    const leaves = [[78, 62, -52, .78], [122, 62, 52, .78], [70, 102, -64, .82], [130, 102, 64, .82], [80, 140, -44, .76], [120, 140, 44, .76], [100, 38, 0, .72]];
    return `<defs><linearGradient id="${g}" x1="70" y1="40" x2="135" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <path d="M100 184V34" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round"/>
      ${leaves.map(([x, y, r, s]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
        <path d="${lf}" fill="url(#${g})" stroke="${stroke}" stroke-width="1.6"/>
        <path d="M0 -18V22" stroke="rgba(240,255,244,.3)" stroke-width="1.1"/>
      </g>`).join('')}`;
  }

  function leafFicus(tone = 'plant') {
    const g = uid('fic');
    const c1 = tone === 'scan' ? '#3D7F57' : '#4F9F64';
    const c2 = tone === 'scan' ? '#16462C' : '#1C5637';
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.5)' : 'rgba(214,243,220,.8)';
    return `<defs><linearGradient id="${g}" x1="70" y1="25" x2="130" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <path d="M100 22 C122 34 133 52 126 74 C122 90 112 96 114 112 C116 132 128 142 120 158 C112 174 96 178 88 168 C78 156 84 140 80 126 C76 110 64 100 68 82 C72 62 82 46 100 22Z" fill="url(#${g})" stroke="${stroke}" stroke-width="1.8"/>
      <g fill="none" stroke="rgba(236,255,241,.32)" stroke-width="1.3" stroke-linecap="round">
        <path d="M98 28 C96 70 100 110 96 162"/>
        <path d="M98 60 C86 68 78 80 76 94M98 60 C110 68 118 80 120 92"/>
        <path d="M96 104 C86 114 82 126 82 138M96 104 C106 114 112 126 114 136"/>
      </g>`;
  }

  function leafSnake(tone = 'plant') {
    const g = uid('snk');
    const c1 = tone === 'scan' ? '#3D7F57' : '#4F9F64';
    const c2 = tone === 'scan' ? '#123F28' : '#1A5032';
    const stroke = tone === 'scan' ? 'rgba(191,230,201,.5)' : 'rgba(207,240,215,.8)';
    const blade = `M0 70 C-10 38 -8 4 2 -34 C5 -46 13 -46 16 -34 C28 4 26 38 14 70Z`;
    return `<defs><linearGradient id="${g}" x1="70" y1="30" x2="135" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      ${[[80, 100, -10, .95], [106, 106, 4, 1.12], [132, 96, 16, .88], [118, 112, -16, .8]].map(([x, y, r, s]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
        <path d="${blade}" fill="url(#${g})" stroke="${stroke}" stroke-width="1.5"/>
        <g stroke="rgba(210,240,218,.28)" stroke-width="1.1">
          <path d="M3 -24 C-4 -12 6 -6 -1 6 C-7 16 4 22 -2 34 C-6 44 2 52 -1 62"/>
        </g>
      </g>`).join('')}`;
  }

  function leafGeneric(tone = 'plant') {
    const g = uid('gen');
    return `<defs><linearGradient id="${g}" x1="60" y1="25" x2="140" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="${tone === 'scan' ? '#3E8058' : PAL.leaf1}"/><stop offset="1" stop-color="${tone === 'scan' ? '#17482E' : PAL.leaf2}"/></linearGradient></defs>
      <path d="M100 20 C130 38 146 72 140 110 C135 145 118 168 100 178 C82 168 65 145 60 110 C54 72 70 38 100 20Z" fill="url(#${g})" stroke="rgba(214,243,220,.75)" stroke-width="1.8"/>
      <path d="M100 30V170M100 60 C82 70 72 86 68 102M100 60 C118 70 128 86 132 102M100 108 C84 118 76 132 72 146M100 108 C116 118 124 132 128 146" fill="none" stroke="rgba(236,255,241,.3)" stroke-width="1.3" stroke-linecap="round"/>`;
  }

  const LEAVES = {
    monstera: leafMonstera,
    tomato: leafTomato,
    apple: leafApple,
    cucumber: leafCucumber,
    basil: leafBasil,
    ficus: leafFicus,
    snake: leafSnake,
    wheat: leafGeneric,
    generic: leafGeneric
  };

  function leaf(type = 'generic', tone = 'plant') {
    return (LEAVES[type] || leafGeneric)(tone);
  }

  /* ---------------- lesions / symptoms ---------------- */

  function lesions(kind = 'none') {
    const wrap = (body, clipId) => clipId
      ? `<g clip-path="url(#${clipId})">${body}</g>`
      : body;

    if (kind === 'phytophthora') {
      const spots = [[78, 92, 12], [116, 120, 14], [93, 142, 9], [132, 84, 8], [72, 124, 7]];
      return spots.map(([x, y, r]) => `<g>
        <circle cx="${x}" cy="${y}" r="${r + 4}" fill="${PAL.amber}" opacity=".2"/>
        <circle cx="${x}" cy="${y}" r="${r}" fill="#7A4A24" opacity=".9" stroke="#4E2E14" stroke-width="1.2"/>
        <circle cx="${x}" cy="${y}" r="${r * .55}" fill="none" stroke="#C98B4B" stroke-width="1" opacity=".8"/>
        <circle cx="${x}" cy="${y}" r="${r * .22}" fill="#3C2310"/>
      </g>`).join('');
    }
    if (kind === 'powdery') {
      const blobs = [[74, 78, 20, 12, -18], [118, 96, 24, 14, 14], [92, 132, 18, 10, 8], [132, 62, 14, 9, -20], [64, 114, 13, 8, 22]];
      return blobs.map(([x, y, rx, ry, r]) => `<g transform="rotate(${r} ${x} ${y})">
        <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#F1FAF2" opacity=".62"/>
        <ellipse cx="${x}" cy="${y}" rx="${rx * .55}" ry="${ry * .55}" fill="#FFFFFF" opacity=".5"/>
      </g>`).join('') + [[80, 70], [124, 90], [100, 126], [138, 70], [70, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".8"/>`).join('');
    }
    if (kind === 'downy') {
      const polys = [
        'M62 82 88 74 96 96 76 108Z', 'M108 70 136 78 130 102 106 94Z',
        'M82 122 110 116 118 142 90 150Z', 'M124 118 148 128 140 150 120 142Z'
      ];
      return polys.map(p => `<path d="${p}" fill="#D8A24A" opacity=".55" stroke="#A56A18" stroke-width="1.2"/>`).join('');
    }
    if (kind === 'scab') {
      return [[76, 84, 13, 9], [118, 116, 15, 11], [96, 144, 8, 7], [132, 74, 7, 6]].map(([x, y, rx, ry]) =>
        `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#6E5B2C" opacity=".65" stroke="#4C3D1B" stroke-width="1"/>`).join('');
    }
    if (kind === 'septoria') {
      return [[72, 86], [102, 104], [128, 82], [88, 138], [122, 136], [106, 66]].map(([x, y]) =>
        `<g><circle cx="${x}" cy="${y}" r="6" fill="#8E6B3A" opacity=".7"/><circle cx="${x}" cy="${y}" r="2.4" fill="#2E2013"/><circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${PAL.amber}" stroke-width="1" opacity=".4"/></g>`).join('');
    }
    if (kind === 'aphids') {
      let out = '';
      const pts = [[86, 88], [92, 84], [98, 92], [104, 86], [90, 102], [100, 104], [110, 98], [118, 92], [82, 112], [96, 118], [112, 114], [124, 108], [104, 130], [90, 134]];
      pts.forEach(([x, y], i) => {
        out += `<g><ellipse cx="${x}" cy="${y}" rx="2.6" ry="3.6" fill="${i % 3 === 0 ? '#8FBF6A' : '#A9CF7A'}" stroke="#4F7132" stroke-width=".6"/><circle cx="${x}" cy="${y - 3}" r="1.1" fill="#3E5A28"/></g>`;
      });
      return out;
    }
    if (kind === 'spiderMite') {
      let out = `<g stroke="rgba(240,250,240,.28)" stroke-width=".8" fill="none">
        <path d="M55 70 150 150M150 70 55 150M40 110 160 110M100 40V170"/>
        <path d="M62 58 100 96 138 58M62 162 100 124 138 162"/>
      </g>`;
      for (let i = 0; i < 46; i++) {
        const x = 58 + ((i * 37) % 84);
        const y = 58 + ((i * 53) % 102);
        out += `<circle cx="${x}" cy="${y}" r="${i % 4 === 0 ? 1.6 : 1}" fill="#E9D9A6" opacity=".6"/>`;
      }
      return out;
    }
    if (kind === 'rootRot') {
      return `<path d="M100 18 C62 26 34 60 39 101 C43 133 66 157 100 176 C134 157 157 133 161 101 C166 60 138 26 100 18Z" fill="none" stroke="${PAL.amber}" stroke-width="10" opacity=".22"/>
        <path d="M100 18 C62 26 34 60 39 101 C43 133 66 157 100 176 C134 157 157 133 161 101 C166 60 138 26 100 18Z" fill="none" stroke="#D8B24A" stroke-width="4" opacity=".25"/>`;
    }
    if (kind === 'chlorosis') {
      return `<g opacity=".5">
        <path d="M100 58 C86 66 76 80 72 96 L84 100 C88 86 96 74 108 68Z" fill="#D8D25A"/>
        <path d="M100 104 C114 110 124 122 128 138 L116 142 C112 128 106 118 96 112Z" fill="#D8D25A"/>
        <path d="M100 58 C114 66 124 80 128 96 L116 100 C112 86 104 74 92 68Z" fill="#D8D25A"/>
      </g>`;
    }
    if (kind === 'sunburn') {
      return `<g><ellipse cx="104" cy="82" rx="34" ry="24" fill="#EFE6C4" opacity=".55"/><ellipse cx="104" cy="82" rx="20" ry="13" fill="#F7F1DA" opacity=".5"/></g>`;
    }
    return '';
  }

  const LESION_MAP = {
    phytophthora: 'phytophthora',
    powdery: 'powdery',
    downy: 'downy',
    appleScab: 'scab',
    septoria: 'septoria',
    aphids: 'aphids',
    spiderMite: 'spiderMite',
    rootRot: 'rootRot',
    chlorosis: 'chlorosis',
    sunburn: 'sunburn'
  };

  /* ---------------- scan card (320 × 260) ---------------- */

  function scanCard(type = 'generic', lesion = 'none', opts = {}) {
    const bg = uid('scbg'), glow = uid('scgl'), line = uid('scl');
    const scan = opts.scan !== false;
    return `<svg viewBox="0 0 320 260" class="art-scan" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="${bg}" x1="0" y1="0" x2="320" y2="260" gradientUnits="userSpaceOnUse">
          <stop stop-color="#123B26"/><stop offset="1" stop-color="#06170E"/>
        </linearGradient>
        <radialGradient id="${glow}" cx="160" cy="130" r="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(124,196,141,.35)"/><stop offset="1" stop-color="rgba(124,196,141,0)"/>
        </radialGradient>
        <linearGradient id="${line}" x1="20" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(124,196,141,0)"/><stop offset=".5" stop-color="#9BE0AE"/><stop offset="1" stop-color="rgba(233,162,59,0)"/>
        </linearGradient>
      </defs>
      <rect width="320" height="260" fill="url(#${bg})"/>
      <g opacity=".14" stroke="#9BE0AE" stroke-width=".6">
        ${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 26.6} 0V260"/>`).join('')}
        ${Array.from({ length: 11 }, (_, i) => `<path d="M0 ${i * 26}H320"/>`).join('')}
      </g>
      <circle cx="160" cy="130" r="118" fill="url(#${glow})"/>
      <circle cx="160" cy="130" r="92" fill="none" stroke="rgba(155,224,174,.18)" stroke-width="1" stroke-dasharray="3 7"/>
      <circle cx="160" cy="130" r="106" fill="none" stroke="rgba(155,224,174,.10)" stroke-width="1"/>
      <g transform="translate(160 130) scale(.78) translate(-100 -100)">
        ${leaf(type, 'scan')}
        ${lesions(lesion)}
      </g>
      ${scan ? `<g class="art-scan-beam"><rect x="24" y="0" width="272" height="1.6" fill="url(#${line})"/></g>` : ''}
      <g fill="none" stroke="rgba(191,230,201,.5)" stroke-width="1.4">
        <path d="M16 34V16h18M304 34V16h-18M16 226v18h18M304 226v18h-18"/>
      </g>
      <g fill="rgba(191,230,201,.55)">
        <circle cx="38" cy="130" r="2"/><circle cx="282" cy="130" r="2"/>
        <circle cx="160" cy="34" r="2"/><circle cx="160" cy="226" r="2"/>
      </g>
      <g opacity=".75">
        <circle cx="246" cy="58" r="3" fill="#E9A23B"><animate attributeName="opacity" values="1;.3;1" dur="2.6s" repeatCount="indefinite"/></circle>
        <path d="M246 58h14M246 58v-14" stroke="#E9A23B" stroke-width=".8" opacity=".55"/>
      </g>
      <text x="28" y="240" font-family="ui-monospace, monospace" font-size="7" fill="rgba(191,230,201,.45)" letter-spacing="1.6">AGROLENS · SCAN</text>
    </svg>`;
  }

  /* ---------------- hero composition (520 × 430) ---------------- */

  function hero() {
    const gl = uid('hgl'), lg = uid('hlg');
    return `<svg viewBox="0 0 520 430" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="${gl}" cx="280" cy="210" r="190" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(124,196,141,.30)"/><stop offset="1" stop-color="rgba(124,196,141,0)"/>
        </radialGradient>
        <linearGradient id="${lg}" x1="180" y1="60" x2="400" y2="380" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(155,224,174,0)"/><stop offset=".5" stop-color="rgba(155,224,174,.55)"/><stop offset="1" stop-color="rgba(233,162,59,0)"/>
        </linearGradient>
      </defs>
      <circle cx="280" cy="210" r="185" fill="url(#${gl})"/>
      <g opacity=".22" stroke="#9BE0AE" stroke-width=".7">
        ${Array.from({ length: 8 }, (_, i) => `<circle cx="280" cy="210" r="${70 + i * 20}" stroke-dasharray="${i % 2 ? '2 9' : 'none'}"/>`).join('')}
      </g>
      <g opacity=".18" stroke="#9BE0AE" stroke-width=".6">
        ${Array.from({ length: 10 }, (_, i) => `<path d="M${40 + i * 50} 20V410"/>`).join('')}
        ${Array.from({ length: 8 }, (_, i) => `<path d="M20 ${30 + i * 50}H500"/>`).join('')}
      </g>
      <g transform="translate(280 205) rotate(-10) scale(1.45) translate(-100 -100)" filter="drop-shadow(0 30px 60px rgba(0,0,0,.32))">
        ${leafMonstera('plant')}
      </g>
      <g class="art-scan-beam"><rect x="120" y="0" width="320" height="1.8" fill="url(#${lg})"/></g>
      <g fill="#BFE6C9">
        <circle cx="140" cy="120" r="3"><animate attributeName="opacity" values="1;.2;1" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="430" cy="140" r="2.4"><animate attributeName="opacity" values=".3;1;.3" dur="4s" repeatCount="indefinite"/></circle>
        <circle cx="400" cy="330" r="2"><animate attributeName="opacity" values="1;.4;1" dur="2.4s" repeatCount="indefinite"/></circle>
      </g>
      <g stroke="#9BE0AE" stroke-width="1" opacity=".45">
        <path d="M140 120h-26M140 120v-26"/>
        <path d="M430 140h22M430 140v22"/>
        <path d="M400 330h20M400 330v18"/>
      </g>
      <g opacity=".55" fill="none" stroke="#E9A23B" stroke-width="1">
        <circle cx="446" cy="286" r="3"/>
        <path d="M446 276v-8M446 296v8M436 286h-8M456 286h8"/>
      </g>
    </svg>`;
  }

  /* ---------------- potted plants (240 × 180) ---------------- */

  function plant(type = 'monstera', tone = 'card') {
    const halo = uid('halo'), pot = uid('pot');
    const potFill1 = tone === 'card' ? '#2E5A41' : '#DCEEDD';
    const potFill2 = tone === 'card' ? '#153826' : '#B9DCC0';
    const stroke = tone === 'card' ? 'rgba(191,230,201,.5)' : 'rgba(18,59,37,.25)';
    const leafBody = (() => {
      if (type === 'monstera') {
        return `<g transform="translate(120 76) scale(.62) translate(-100 -100)">${leafMonstera('plant')}</g>
        <g transform="translate(88 98) rotate(-24) scale(.4) translate(-100 -100)" opacity=".85">${leafMonstera('plant')}</g>
        <path d="M120 112V134" stroke="${stroke}" stroke-width="2.4"/>`;
      }
      if (type === 'ficus') {
        return `<g stroke="${stroke}" stroke-width="2" fill="none"><path d="M120 136V52M120 100 C104 92 94 82 92 66M120 112 C136 104 146 92 148 76M120 78 C110 72 106 64 106 54"/></g>
        ${[[118, 50, -4, .34], [96, 70, -42, .3], [144, 80, 40, .3], [92, 100, -58, .3], [148, 108, 56, .3], [106, 120, -30, .28], [136, 126, 28, .28]].map(([x, y, r, s]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-100 -100)">${leafFicus('plant')}</g>`).join('')}`;
      }
      if (type === 'basil') {
        return `<g stroke="${stroke}" stroke-width="1.8" fill="none"><path d="M120 136V64M120 100 C108 92 102 84 100 74M120 112 C132 104 138 96 140 86"/></g>
        ${[[98, 66, -50, .28], [142, 66, 50, .28], [94, 94, -62, .3], [146, 94, 62, .3], [102, 120, -40, .28], [140, 120, 40, .28], [120, 52, 0, .3]].map(([x, y, r, s]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-100 -100)">${leafBasil('plant')}</g>`).join('')}`;
      }
      if (type === 'tomato') {
        return `<g transform="translate(120 78) scale(.62) translate(-100 -100)">${leafTomato('plant')}</g>
        <g><circle cx="96" cy="112" r="7" fill="#D9604A"/><circle cx="144" cy="120" r="6" fill="#D9604A"/><circle cx="126" cy="104" r="5" fill="#E1795E"/></g>`;
      }
      if (type === 'snake') {
        return `<g transform="translate(120 102) scale(.52) translate(-100 -100)">${leafSnake('plant')}</g>`;
      }
      if (type === 'apple') {
        return `<g transform="translate(120 84) scale(.55) translate(-100 -100)">${leafApple('plant')}</g>`;
      }
      return `<g transform="translate(120 84) scale(.55) translate(-100 -100)">${leafGeneric('plant')}</g>`;
    })();
    return `<svg viewBox="0 0 240 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="${halo}" cx="120" cy="92" r="86" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(124,196,141,.22)"/><stop offset="1" stop-color="rgba(124,196,141,0)"/>
        </radialGradient>
        <linearGradient id="${pot}" x1="88" y1="120" x2="152" y2="172" gradientUnits="userSpaceOnUse">
          <stop stop-color="${potFill1}"/><stop offset="1" stop-color="${potFill2}"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="92" r="86" fill="url(#${halo})"/>
      <ellipse cx="120" cy="166" rx="46" ry="7" fill="rgba(0,0,0,.18)"/>
      ${leafBody}
      <path d="M90 124H150L142 168H98Z" fill="url(#${pot})" stroke="${stroke}" stroke-width="1.6"/>
      <path d="M86 118H154V127H86Z" rx="3" fill="url(#${pot})" stroke="${stroke}" stroke-width="1.4"/>
      <ellipse cx="120" cy="124" rx="31" ry="5" fill="#0A2014" opacity=".45"/>
      <path d="M104 137c6 2 26 2 32 0" stroke="rgba(255,255,255,.14)" stroke-width="1.4"/>
    </svg>`;
  }

  /* ---------------- fields (320 × 160) ---------------- */

  function field(type = 'wheat') {
    const sky = uid('fsky'), hill = uid('fhill'), sun = uid('fsun');
    const crop = (() => {
      if (type === 'wheat') {
        return `<g stroke="#D9B25E" stroke-width="1.3" opacity=".8">
          ${Array.from({ length: 26 }, (_, i) => {
            const x = 8 + i * 12.4, y = 118 + (i % 3) * 8;
            return `<path d="M${x} ${y}V${y - 34 + (i % 4) * 4}"/><ellipse cx="${x}" cy="${y - 38 + (i % 4) * 4}" rx="2.4" ry="5" fill="#E4C275" stroke="none"/>`;
          }).join('')}
        </g>`;
      }
      if (type === 'tomato') {
        return `<g>${Array.from({ length: 7 }, (_, i) => {
          const x = 24 + i * 44, y = 124;
          return `<g><path d="M${x} ${y}V${y - 26}" stroke="#4E7A3A" stroke-width="2"/><circle cx="${x}" cy="${y - 30}" r="14" fill="#2F6B42"/><circle cx="${x - 9}" cy="${y - 22}" r="8" fill="#3A7D4C"/><circle cx="${x + 9}" cy="${y - 22}" r="8" fill="#3A7D4C"/><circle cx="${x - 4}" cy="${y - 28}" r="2.6" fill="#D9604A"/><circle cx="${x + 6}" cy="${y - 34}" r="2.2" fill="#E1795E"/></g>`;
        }).join('')}</g>`;
      }
      if (type === 'apple') {
        return `<g>${Array.from({ length: 5 }, (_, i) => {
          const x = 38 + i * 62, y = 128;
          return `<g><path d="M${x} ${y}V${y - 22}" stroke="#6B4B2A" stroke-width="3"/><circle cx="${x}" cy="${y - 38}" r="19" fill="#2C6440"/><circle cx="${x - 12}" cy="${y - 30}" r="11" fill="#357548"/><circle cx="${x + 12}" cy="${y - 30}" r="11" fill="#357548"/><circle cx="${x}" cy="${y - 42}" r="2.2" fill="#D9604A"/></g>`;
        }).join('')}</g>`;
      }
      return `<g>${[0, 1, 2].map(i => `<path d="M${32 + i * 96} 140 Q${112 + i * 40} ${76 + i * 6} ${210 + i * 24} 140" stroke="rgba(191,230,201,.35)" stroke-width="1.5" fill="none"/><path d="M${44 + i * 96} 140 Q${124 + i * 40} ${88 + i * 6} ${210 + i * 24} 140" stroke="rgba(191,230,201,.18)" stroke-width="10" fill="none"/>`).join('')}</g>`;
    })();
    return `<svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2A6443"/><stop offset=".55" stop-color="#17402A"/><stop offset="1" stop-color="#0A2014"/>
        </linearGradient>
        <linearGradient id="${hill}" x1="0" y1="80" x2="0" y2="160" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1E4E33"/><stop offset="1" stop-color="#0B2417"/>
        </linearGradient>
        <radialGradient id="${sun}" cx="264" cy="38" r="38" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(233,162,59,.55)"/><stop offset="1" stop-color="rgba(233,162,59,0)"/>
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#${sky})"/>
      <circle cx="264" cy="38" r="38" fill="url(#${sun})"/>
      <circle cx="264" cy="38" r="13" fill="#E9B45C"/>
      <path d="M0 96 C54 76 92 88 136 82 C188 74 232 92 320 78V160H0Z" fill="url(#${hill})"/>
      <path d="M0 116 C64 100 120 112 180 106 C238 100 280 110 320 104V160H0Z" fill="#123523" opacity=".8"/>
      <g opacity=".2" stroke="#BFE6C9" stroke-width=".6">
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 40} 0V160"/>`).join('')}
        ${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${i * 40}H320"/>`).join('')}
      </g>
      ${crop}
      <g transform="translate(250 46)" opacity=".8">
        <path d="M-10 0h20M-5 0l-6-6M5 0l6-6" stroke="rgba(191,230,201,.6)" stroke-width="1.2"/>
        <circle cx="0" cy="2" r="2.6" fill="#E9A23B"><animate attributeName="opacity" values="1;.2;1" dur="2.2s" repeatCount="indefinite"/></circle>
      </g>
    </svg>`;
  }

  /* ---------------- weather ---------------- */

  function weather(code = 1) {
    const sun = `<circle cx="42" cy="40" r="14" fill="url(#wsun)" stroke="#F2C879" stroke-width="1.6"/>
      <g stroke="#F2C879" stroke-width="1.6" stroke-linecap="round" opacity=".8">
        <path d="M42 16v-6M42 70v-6M18 40h-6M72 40h-5M25 23l-4-4M63 61l-4-4M59 23l4-4M21 61l4-4"/>
      </g>`;
    const cloud = (x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M34 72a15 15 0 0 1 2-30 20 20 0 0 1 38-2 13 13 0 0 1 5 25Z" fill="url(#wcloud)" stroke="rgba(236,250,240,.7)" stroke-width="1.6"/>
    </g>`;
    let body = '';
    if (code === 0) body = sun;
    else if (code <= 3) body = `<g transform="translate(6 -8) scale(.8)">${sun}</g>${cloud(4, 12, 1)}`;
    else if (code === 45 || code === 48) body = `<g opacity=".9">${cloud(2, 0, .95)}<g stroke="rgba(236,250,240,.6)" stroke-width="1.4"><path d="M18 84h66M28 94h48"/></g></g>`;
    else if (code >= 71 && code <= 77) body = `${cloud(0, -4, .9)}<g stroke="#BFE6C9" stroke-width="1.8" stroke-linecap="round"><path d="M32 82v8M32 96v4M50 82v8M50 96v4M68 82v8M68 96v4"/></g>`;
    else if (code >= 95) body = `${cloud(0, -6, .9)}<path d="m48 76-8 14h8l-5 16 16-20h-8l5-10Z" fill="#F2C879" stroke="#E9A23B" stroke-width="1"/>`;
    else body = `${cloud(0, -6, .9)}<g stroke="#9CC8E8" stroke-width="2" stroke-linecap="round"><path d="m34 82-3 9M50 82l-3 9M66 82l-3 9"/></g>`;
    return `<svg viewBox="0 0 100 110" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="wsun" cx="42" cy="36" r="18" gradientUnits="userSpaceOnUse"><stop stop-color="#F6D89A"/><stop offset="1" stop-color="#E9A23B"/></radialGradient>
        <linearGradient id="wcloud" x1="30" y1="40" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop stop-color="rgba(236,250,240,.22)"/><stop offset="1" stop-color="rgba(236,250,240,.06)"/></linearGradient>
      </defs>${body}</svg>`;
  }

  /* ---------------- progress rings ---------------- */

  function ring(value = 70, color = '#4E9B62', size = 44, stroke = 4) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>`;
  }

  /* ---------------- field / crop icon ---------------- */

  function cropIcon(type = 'wheat', size = 24) {
    const map = { wheat: 'wheat', tomato: 'tomato', apple: 'apple', cucumber: 'cucumber', generic: 'leaf', monstera: 'leaf', ficus: 'leaf', basil: 'leaf', snake: 'leaf' };
    return Icons.get(map[type] || 'leaf');
  }

  return { scanCard, hero, plant, field, weather, ring, leaf, lesions, cropIcon, pal: PAL };
})();
