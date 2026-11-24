/* Backpacking Route – plan an overland route through Thailand, Laos, Cambodia and Vietnam.
   Everything runs in the browser; your route is stored only on this device. */
(function () {
  'use strict';

  const CFG = window.BR_CONFIG || {};
  const STORE_KEY = 'br-state-v1';

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  // Daily cost per person in EUR from the cost sheet (incl. inflation to departure, 1 EUR = 1.16 USD).
  // Places: [name, tags, priority 1-3, minimum nights, lat, lng, island]
  const META = {
    th: {
      name: 'Thailand', code: 'TH', color: '#0F766E', ink: '#FFFFFF', bar: '#2BB3A3', dot: '#0F766E',
      sub: 'Bangkok, Chiang Mai, the islands', hub: { lat: 13.75, lng: 100.50 },
      rates: { backpack: 30.51, mid: 69.74, luxury: 139.48 },
      pool: [
        ['Bangkok', ['city', 'party'], 3, 1, 13.75, 100.50, false],
        ['Kanchanaburi', ['nature'], 2, 1, 14.02, 99.53, false],
        ['Ayutthaya', ['city'], 2, 1, 14.35, 100.57, false],
        ['Sukhothai', ['city'], 1, 1, 17.01, 99.82, false],
        ['Chiang Mai', ['city', 'nature'], 3, 1, 18.79, 98.98, false],
        ['Pai', ['nature', 'party'], 2, 1, 19.36, 98.44, false],
        ['Chiang Rai', ['city', 'nature'], 1, 1, 19.91, 99.83, false],
        ['Phuket', ['party', 'nature'], 1, 1, 7.88, 98.39, false],
        ['Koh Phi Phi', ['party', 'nature'], 2, 1, 7.74, 98.77, true],
        ['Krabi', ['nature'], 2, 1, 8.06, 98.92, false],
        ['Koh Lanta', ['nature'], 1, 1, 7.62, 99.04, true],
        ['Khao Sok', ['nature'], 2, 2, 8.91, 98.53, false],
        ['Koh Samui', ['nature'], 1, 1, 9.51, 100.01, true],
        ['Koh Phangan', ['party'], 3, 1, 9.73, 100.03, true],
        ['Koh Tao', ['nature'], 2, 1, 10.10, 99.84, true]
      ]
    },
    la: {
      name: 'Laos', code: 'LA', color: '#237032', ink: '#FFFFFF', bar: '#51CF66', dot: '#237032',
      sub: 'Luang Prabang, Vang Vieng, 4000 Islands', hub: { lat: 17.97, lng: 102.63 },
      rates: { backpack: 29.27, mid: 53.21, luxury: 133.03 },
      pool: [
        ['4000 Islands', ['nature', 'party'], 3, 1, 13.95, 105.93, true],
        ['Champasak', ['city'], 1, 1, 14.89, 105.87, false],
        ['Pakse', ['city'], 1, 1, 15.12, 105.80, false],
        ['Bolaven Plateau', ['nature'], 2, 2, 15.18, 106.23, false],
        ['Tad Lo', ['nature'], 1, 1, 15.53, 106.36, false],
        ['Savannakhet', ['city'], 1, 1, 16.55, 104.75, false],
        ['Thakhek Loop', ['nature'], 2, 3, 17.40, 104.80, false],
        ['Vientiane', ['city'], 1, 1, 17.97, 102.63, false],
        ['Vang Vieng', ['party', 'nature'], 3, 1, 18.92, 102.45, false],
        ['Phonsavan', ['nature'], 1, 1, 19.45, 103.20, false],
        ['Luang Prabang', ['city', 'nature'], 3, 1, 19.89, 102.13, false],
        ['Huay Xai', ['nature'], 1, 2, 20.27, 100.41, false],
        ['Luang Namtha', ['nature'], 1, 1, 20.95, 101.40, false],
        ['Nong Khiaw', ['nature'], 2, 1, 20.57, 102.61, false],
        ['Muang Ngoi', ['nature'], 1, 1, 20.71, 102.68, false]
      ]
    },
    kh: {
      name: 'Cambodia', code: 'KH', color: '#C2255C', ink: '#FFFFFF', bar: '#F06595', dot: '#C2255C',
      sub: 'Angkor, Phnom Penh, Koh Rong', hub: { lat: 11.56, lng: 104.92 },
      rates: { backpack: 28.92, mid: 61.34, luxury: 157.74 },
      pool: [
        ['Battambang', ['city', 'nature'], 2, 1, 13.10, 103.20, false],
        ['Siem Reap', ['city', 'nature'], 3, 2, 13.36, 103.86, false],
        ['Koh Ker', ['nature'], 1, 1, 13.78, 104.54, false],
        ['Kampong Thom', ['nature'], 1, 1, 12.71, 104.89, false],
        ['Phnom Penh', ['city'], 3, 1, 11.56, 104.92, false],
        ['Kampot', ['nature'], 2, 1, 10.61, 104.18, false],
        ['Kep', ['nature'], 1, 1, 10.48, 104.32, false],
        ['Sihanoukville', ['party'], 1, 1, 10.63, 103.52, false],
        ['Koh Rong', ['party', 'nature'], 2, 1, 10.72, 103.24, true],
        ['Koh Rong Samloem', ['nature'], 2, 1, 10.60, 103.30, true],
        ['Kampong Cham', ['city'], 1, 1, 11.99, 105.46, false],
        ['Kratie', ['nature'], 1, 1, 12.49, 106.02, false],
        ['Mondulkiri', ['nature'], 1, 2, 12.45, 107.19, false],
        ['Ratanakiri', ['nature'], 1, 2, 13.74, 106.99, false],
        ['Stung Treng', ['nature'], 1, 1, 13.53, 105.97, false]
      ]
    },
    vn: {
      name: 'Vietnam', code: 'VN', color: '#FFC93C', ink: '#14213D', bar: '#FFC93C', dot: '#B07A00',
      sub: 'Hanoi, Ha Giang, Hoi An, Saigon', hub: { lat: 21.03, lng: 105.85 },
      rates: { backpack: 28.89, mid: 52.53, luxury: 148.84 },
      pool: [
        ['Sapa', ['nature'], 1, 2, 22.34, 103.84, false],
        ['Ha Giang Loop', ['nature'], 3, 3, 22.82, 104.98, false],
        ['Hanoi', ['city', 'party'], 3, 1, 21.03, 105.85, false],
        ['Ha Long Bay', ['nature'], 2, 1, 20.95, 107.05, false],
        ['Cat Ba', ['nature', 'party'], 2, 1, 20.73, 107.05, true],
        ['Ninh Binh', ['nature'], 2, 1, 20.25, 105.97, false],
        ['Phong Nha', ['nature'], 2, 1, 17.59, 106.28, false],
        ['Hue', ['city'], 1, 1, 16.46, 107.59, false],
        ['Hoi An', ['city', 'party'], 3, 1, 15.88, 108.33, false],
        ['Da Nang', ['city'], 1, 1, 16.05, 108.20, false],
        ['Nha Trang', ['party'], 1, 1, 12.24, 109.19, false],
        ['Da Lat', ['nature'], 2, 1, 11.94, 108.44, false],
        ['Ho Chi Minh City', ['city', 'party'], 2, 1, 10.78, 106.70, false],
        ['Mekong Delta', ['nature'], 1, 1, 10.03, 105.78, false],
        ['Phu Quoc', ['nature'], 1, 1, 10.23, 103.96, true]
      ]
    }
  };
  // Airports with flights between the four countries, used when you arrive or leave by plane
  const AIRPORTS = {
    th: [{ name: 'Bangkok', lat: 13.69, lng: 100.75 }, { name: 'Chiang Mai', lat: 18.77, lng: 98.96 }, { name: 'Phuket', lat: 8.11, lng: 98.31 }, { name: 'Krabi', lat: 8.10, lng: 98.98 }, { name: 'Koh Samui', lat: 9.55, lng: 100.06 }],
    la: [{ name: 'Vientiane', lat: 17.99, lng: 102.56 }, { name: 'Luang Prabang', lat: 19.90, lng: 102.16 }, { name: 'Pakse', lat: 15.13, lng: 105.78 }],
    kh: [{ name: 'Phnom Penh', lat: 11.35, lng: 104.85 }, { name: 'Siem Reap', lat: 13.37, lng: 104.22 }],
    vn: [{ name: 'Hanoi', lat: 21.22, lng: 105.81 }, { name: 'Da Nang', lat: 16.04, lng: 108.20 }, { name: 'Ho Chi Minh City', lat: 10.82, lng: 106.66 }, { name: 'Phu Quoc', lat: 10.17, lng: 103.99 }]
  };
  // Where you land when you fly in from home
  const ARRIVAL = { th: ['Bangkok'], la: ['Vientiane', 'Luang Prabang'], kh: ['Phnom Penh', 'Siem Reap'], vn: ['Hanoi', 'Ho Chi Minh City'] };
  function nearestAirport(cid, pt) {
    if (!pt) return AIRPORTS[cid][0];
    return AIRPORTS[cid].reduce((a, b) => (km(b, pt) < km(a, pt) ? b : a));
  }

  // Classic overland loop while the Thailand–Cambodia land border is closed
  const COUNTRY_ORDER = ['th', 'la', 'kh', 'vn'];
  const TAG_LABEL = { nature: 'Nature', city: 'City', party: 'Party' };
  const STYLE_LABEL = { backpack: 'Backpack', mid: 'Mid-range', luxury: 'Luxury' };

  // Land crossings. Status checked November 2026.
  const CROSSINGS = [
    { pair: ['th', 'la'], names: { th: 'Nong Khai', la: 'Thanaleng (Vientiane)' }, lat: 17.88, lng: 102.72, note: 'Friendship Bridge I over the Mekong, just outside Vientiane', open: true },
    { pair: ['th', 'la'], names: { th: 'Chiang Khong', la: 'Huay Xai' }, lat: 20.23, lng: 100.45, note: 'Friendship Bridge IV, start of the Mekong slow boat', open: true },
    { pair: ['th', 'la'], names: { th: 'Mukdahan', la: 'Savannakhet' }, lat: 16.57, lng: 104.73, note: 'Friendship Bridge II over the Mekong', open: true },
    { pair: ['th', 'la'], names: { th: 'Chong Mek', la: 'Vang Tao' }, lat: 15.13, lng: 105.48, note: 'Quiet crossing, about an hour from Pakse', open: true },
    { pair: ['th', 'kh'], names: { th: 'Aranyaprathet', kh: 'Poipet' }, lat: 13.67, lng: 102.55, note: '', open: false },
    { pair: ['th', 'kh'], names: { th: 'Hat Lek', kh: 'Cham Yeam' }, lat: 11.65, lng: 102.91, note: '', open: false },
    { pair: ['kh', 'la'], names: { kh: 'Trapeang Kriel', la: 'Nong Nok Khiene' }, lat: 13.93, lng: 105.98, note: 'The only Cambodia–Laos crossing, right by the 4000 Islands', open: true },
    { pair: ['kh', 'vn'], names: { kh: 'Bavet', vn: 'Moc Bai' }, lat: 11.07, lng: 106.17, note: 'Busiest crossing, on the Phnom Penh – Saigon road', open: true },
    { pair: ['kh', 'vn'], names: { kh: 'Prek Chak', vn: 'Xa Xia (Ha Tien)' }, lat: 10.42, lng: 104.45, note: 'Coastal crossing near Kep, ferries on to Phu Quoc', open: true },
    { pair: ['kh', 'vn'], names: { kh: 'Kaam Samnor', vn: 'Vinh Xuong' }, lat: 10.92, lng: 105.18, note: 'River crossing by boat on the Mekong', open: true },
    { pair: ['la', 'vn'], names: { la: 'Sop Hun', vn: 'Tay Trang' }, lat: 21.30, lng: 102.99, note: 'Mountain crossing near Dien Bien Phu', open: true },
    { pair: ['la', 'vn'], names: { la: 'Nong Haet', vn: 'Nam Can' }, lat: 19.38, lng: 104.15, note: 'Mountain crossing east of Phonsavan', open: true },
    { pair: ['la', 'vn'], names: { la: 'Nam Phao', vn: 'Cau Treo' }, lat: 18.40, lng: 105.13, note: 'Main crossing on the Vientiane – Vinh road', open: true },
    { pair: ['la', 'vn'], names: { la: 'Dansavanh', vn: 'Lao Bao' }, lat: 16.62, lng: 106.59, note: 'Central crossing on the road to Hue', open: true }
  ];

  // ---------------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------------

  const $ = (sel, root) => (root || document).querySelector(sel);
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function eur(n) { return '€' + Math.round(n).toLocaleString('en-GB'); }
  function km(a, b) {
    const r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }
  function poolEntry(cid, name) { return META[cid].pool.find((p) => p[0] === name); }
  function toStop(p, nights, score) {
    return { place: p[0], tags: p[1], score: score, nights: nights, lat: p[4], lng: p[5], island: p[6] };
  }
  function announce(text) { const el = $('#announce'); if (el) { el.textContent = ''; setTimeout(() => { el.textContent = text; }, 30); } }

  const ICON = {
    route: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC93C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.5"></circle><circle cx="18" cy="6" r="2.5"></circle><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"></path></svg>',
    info: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v6M12 7.5h.01"></path></svg>',
    arrowR: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    arrowL: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>',
    up: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"></path></svg>',
    down: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>',
    x: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
    search: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6478" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>',
    share: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"></path></svg>',
    border: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC93C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="13" rx="3"></rect><path d="M4 11h16M8 21l1.5-4M16 21l-1.5-4"></path></svg>',
    plane: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 13.5L3 11l1.5-1.5 7.5 1L16 6.5c1-1 2.6-1.3 3.3-.6.7.7.4 2.3-.6 3.3l-4 4 1 7.5L14.2 22l-2.5-7.5-3.2 3.2.3 2.3-1.3 1.3-1.5-3.3-3.3-1.5 1.3-1.3 2.3.3z"></path></svg>',
    check: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"></path></svg>',
    checkDark: '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14213D" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"></path></svg>',
    thumbUp: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v9H4v-9h3zM7 11l4-8c1.7 0 3 1.3 3 3v3h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"></path></svg>',
    thumbDown: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 13V4h3v9h-3zM17 13l-4 8c-1.7 0-3-1.3-3-3v-3H5a2 2 0 0 1-2-2.3l1.2-7A2 2 0 0 1 6.2 4H17"></path></svg>'
  };

  // ---------------------------------------------------------------------------
  // Route logic
  // ---------------------------------------------------------------------------

  // Best open crossing between two countries.
  // mode 'set': rough, any stops count · 'path': planning, last + first stop · 'live': user's route, the stop you leave from weighs most
  function pickCrossing(a, b, listA, listB, mode) {
    const all = CROSSINGS.filter((c) => c.pair.indexOf(a) >= 0 && c.pair.indexOf(b) >= 0);
    const open = all.filter((c) => c.open);
    if (!open.length) return { kind: all.length ? 'closed' : 'none' };
    const near = (list, c, which) => {
      if (!list.length) return 0;
      if (mode !== 'set') return km(which === 'last' ? list[list.length - 1] : list[0], c);
      return Math.min.apply(null, list.map((x) => km(x, c)));
    };
    let best = null, bestCost = Infinity;
    open.forEach((c) => {
      const cost = near(listA, c, 'last') + (mode === 'live' ? 0.5 : 1) * near(listB, c, 'first');
      if (cost < bestCost) { bestCost = cost; best = c; }
    });
    return { kind: 'land', c: best };
  }

  // Order stops as a short path from start to end (nearest neighbour, then 2-opt)
  function orderStops(list, start, end) {
    if (list.length < 2) return list;
    const d = (p, q) => (p && q ? km(p, q) : 0);
    const cost = (seq) => {
      let t = d(start, seq[0]) + d(seq[seq.length - 1], end);
      for (let i = 0; i < seq.length - 1; i++) t += km(seq[i], seq[i + 1]);
      return t;
    };
    const rest = list.slice();
    let seq = [];
    let cur = start;
    if (!cur) {
      let fi = 0;
      if (end) rest.forEach((x, i) => { if (km(x, end) > km(rest[fi], end)) fi = i; });
      cur = rest[fi];
      seq.push(rest.splice(fi, 1)[0]);
    }
    while (rest.length) {
      let bi = 0;
      rest.forEach((x, i) => { if (km(cur, x) < km(cur, rest[bi])) bi = i; });
      cur = rest[bi];
      seq.push(rest.splice(bi, 1)[0]);
    }
    let best = cost(seq), improved = true, guard = 0;
    while (improved && guard < 50) {
      improved = false; guard++;
      for (let i = 0; i < seq.length - 1; i++) {
        for (let j = i + 1; j < seq.length; j++) {
          const cand = seq.slice(0, i).concat(seq.slice(i, j + 1).reverse(), seq.slice(j + 1));
          const c = cost(cand);
          if (c < best - 0.5) { best = c; seq = cand; improved = true; }
        }
      }
    }
    return seq;
  }

  function pathCost(seq, start, end) {
    if (!seq.length) return 0;
    let t = (start ? km(start, seq[0]) : 0) + (end ? km(seq[seq.length - 1], end) : 0);
    for (let i = 0; i < seq.length - 1; i++) t += km(seq[i], seq[i + 1]);
    return t;
  }

  // Order a country's stops between how you arrive and how you leave.
  // entry: a crossing point, 'fly' (pick the airport that fits best) or 'arrive' (first country: a big international airport)
  // exit: a crossing point, 'fly' or null (free)
  function arrange(cid, list, entry, exit) {
    if (list.length < 2) return list.slice();
    const starts = entry === 'arrive' ? AIRPORTS[cid].filter((a) => ARRIVAL[cid].indexOf(a.name) >= 0) : (entry === 'fly' ? AIRPORTS[cid] : [entry]);
    const ends = exit === 'fly' ? AIRPORTS[cid] : [exit];
    let best = null;
    starts.forEach((a) => ends.forEach((b) => {
      const seq = orderStops(list, a, b);
      const c = pathCost(seq, a, b);
      if (!best || c < best.c) best = { seq: seq, c: c };
    }));
    return best.seq;
  }

  // How you arrive in and leave a country in the current route
  function routeEnds(s, cid, mode) {
    const i = s.order.indexOf(cid);
    const prev = s.order[i - 1], next = s.order[i + 1];
    const viaLand = (a, b) => { const r = pickCrossing(a, b, s.stops[a], s.stops[b], mode); return r.kind === 'land' ? r.c : null; };
    return {
      entry: prev ? (viaLand(prev, cid) || 'fly') : 'arrive',
      exit: next ? (viaLand(cid, next) || 'fly') : null
    };
  }

  function selectStops(s, cid, days, anchors) {
    const m = META[cid];
    const picked = s.vibes;
    const anyVibe = picked.nature || picked.city || picked.party;
    const scored = m.pool.map((p, idx) => {
      const matches = p[1].filter((t) => picked[t]).length;
      const pt = { lat: p[4], lng: p[5] };
      const dist = anchors.length ? Math.min.apply(null, anchors.map((a) => km(a, pt))) : Infinity;
      // Close to where you enter or leave: bonus. Far away: costs more the shorter your stay
      const near = anchors.length ? 4 * Math.max(0, 1 - dist / 500) : 0;
      const far = anchors.length ? dist / (days * 40) : 0;
      return { idx: idx, p: p, min: p[3] || 1, score: p[2] * 2 + (anyVibe ? matches * 3 : 0) + near - far };
    }).filter((c) => c.min <= days);
    const avg = s.pace === 'relaxed' ? 4 : 2.5;
    const n = Math.max(1, Math.min(scored.length, days, Math.round(days / avg)));
    const chosen = [];
    let used = 0;
    scored.slice().sort((a, b) => b.score - a.score || a.idx - b.idx).forEach((c) => {
      if (chosen.length < n && used + c.min <= days) { chosen.push(c); used += c.min; }
    });
    const w = (c) => Math.max(1, c.score);
    const sumW = chosen.reduce((a, c) => a + w(c), 0);
    chosen.forEach((c) => { c.nights = Math.max(c.min, Math.floor(days * w(c) / sumW)); });
    let total = chosen.reduce((a, c) => a + c.nights, 0);
    let k = 0;
    while (total < days && chosen.length) { chosen[k % chosen.length].nights++; total++; k++; }
    while (total > days) {
      let big = null;
      chosen.forEach((c) => { if (c.nights > c.min && (!big || c.nights > big.nights)) big = c; });
      if (!big) break;
      big.nights--; total--;
    }
    return chosen.map((c) => toStop(c.p, c.nights, Math.max(1, Math.round(c.score))));
  }

  function buildRoute(s) {
    const order = COUNTRY_ORDER.filter((c) => s.days[c] > 0);
    const stops = { th: [], kh: [], la: [], vn: [] };
    order.forEach((cid) => { stops[cid] = selectStops(s, cid, s.days[cid], []); });
    const draft = { order: order, stops: stops };
    // 1. rough crossings from a first pick; 2. pick again near those crossings and order each country; 3. settle on the real ends
    const ends1 = {};
    order.forEach((cid) => { ends1[cid] = routeEnds(draft, cid, 'set'); });
    order.forEach((cid) => {
      const e = ends1[cid];
      const anchors = [e.entry, e.exit].filter((x) => x && typeof x === 'object');
      stops[cid] = arrange(cid, selectStops(s, cid, s.days[cid], anchors), e.entry, e.exit);
    });
    order.forEach((cid) => { const e = routeEnds(draft, cid, 'path'); stops[cid] = arrange(cid, stops[cid], e.entry, e.exit); });
    return { order: order, stops: stops };
  }

  // Everything the route screen shows, worked out from the state
  function describeRoute(s) {
    const rs = s.routeStyle;
    const budget = Number(s.maxBudget) || 0;
    let day = 1, total = 0, totalDays = 0, backpackTotal = 0, priciest = null, weakest = null;
    const legs = s.order.map((cid, i) => {
      const m = META[cid];
      const list = s.stops[cid];
      const days = list.reduce((a, x) => a + x.nights, 0);
      const rate = m.rates[rs];
      const cost = days * rate;
      total += cost; totalDays += days; backpackTotal += days * m.rates.backpack;
      if (days >= 4 && (!priciest || cost > priciest.cost)) priciest = { cid: cid, name: m.name, cost: cost, rate: rate };
      if (list.length > 1) list.forEach((x) => { if (!weakest || x.score < weakest.score) weakest = { cid: cid, place: x.place, score: x.score, nights: x.nights, rate: rate }; });
      const range = days > 0 ? 'Day ' + day + '–' + (day + days - 1) : 'No stops yet';
      day += days;
      const next = s.order[i + 1];
      return { cid: cid, i: i, m: m, list: list, days: days, rate: rate, cost: cost, range: range, border: next ? describeBorder(s, cid, next) : null };
    });
    const pct = budget > 0 ? total / budget : 0;
    let status;
    if (budget <= 0) status = { label: 'No budget', bg: '#F1F2F5', fg: '#5B6478', bar: '#B8BECC', text: 'Add a budget on the first screen to see whether your route fits.' };
    else if (pct > 1) status = { label: 'Over budget', bg: '#FDECEC', fg: '#B02525', bar: '#C92A2A', text: 'You are ' + eur(total - budget) + ' over your budget. These changes get you closer:' };
    else if (pct > 0.85) status = { label: 'Tight', bg: '#FFF0DB', fg: '#8A4B00', bar: '#E8890C', text: 'It fits, but only ' + eur(budget - total) + ' is left for surprises. Here is how to keep more:' };
    else status = { label: 'Plenty of room', bg: '#E6F6EA', fg: '#1E6B30', bar: '#2F9E44', text: 'Nice: you keep ' + eur(budget - total) + ' as a buffer.' };
    const tips = [];
    if (budget > 0 && pct > 0.85) {
      if (priciest) tips.push({ text: '3 fewer days in ' + priciest.name, saves: eur(3 * priciest.rate), action: 'save-cut', cid: priciest.cid });
      if (rs !== 'backpack') tips.push({ text: 'Switch the trip to Backpack', saves: eur(total - backpackTotal), action: 'save-backpack' });
      else if (weakest) tips.push({ text: 'Skip ' + weakest.place, saves: eur(weakest.nights * weakest.rate), action: 'save-skip', cid: weakest.cid, place: weakest.place });
    }
    return { legs: legs, total: total, totalDays: totalDays, budget: budget, pct: pct, status: status, tips: tips };
  }

  function describeBorder(s, cid, next) {
    const m = META[cid], nm = META[next];
    const list = s.stops[cid], nextList = s.stops[next];
    const lastStop = list[list.length - 1], firstNext = nextList[0];
    const from = lastStop ? lastStop.place : m.name;
    const to = firstNext ? firstNext.place : nm.name;
    const r = pickCrossing(cid, next, list, nextList, 'live');
    if (r.kind !== 'land') {
      const ap1 = nearestAirport(cid, lastStop), ap2 = nearestAirport(next, firstNext);
      const steps = [];
      if (lastStop && lastStop.place !== ap1.name) steps.push('Get from ' + from + ' to ' + ap1.name + ' airport');
      steps.push((steps.length ? 'fly' : 'Fly') + ' to ' + ap2.name);
      if (firstNext && firstNext.place !== ap2.name) steps.push('then on to ' + to);
      const why = r.kind === 'closed'
        ? 'All ' + m.name + '–' + nm.name + ' land crossings have been closed since June 2025, with no reopening date (checked Nov 2026). '
        : m.name + ' and ' + nm.name + ' do not share a border. ';
      return { kind: r.kind, title: r.kind === 'closed' ? 'Land border closed' : 'No land border', name: 'Fly ' + ap1.name + ' → ' + ap2.name,
        info: why + steps.join(', ') + '. Flight ≈ €[XX].' };
    }
    const c = r.c;
    const dist = (lastStop ? km(lastStop, c) : 0) + (firstNext ? km(c, firstNext) : 0);
    const island = (lastStop && lastStop.island) || (firstNext && firstNext.island);
    const hrs = Math.max(3, Math.round(dist * 1.35 / 40 + 1.5 + (island ? 2 : 0)));
    const out = { kind: 'land', title: 'Border crossing', name: c.names[cid] + ' → ' + c.names[next],
      info: c.note + '. ' + from + ' → border → ' + to + ': ≈ ' + hrs + ' hrs' + (island ? ' incl. ferry' : '') + '.', tip: null };
    // Do you leave from a sensible place?
    let closer = null;
    list.slice(0, -1).forEach((x) => { const dd = km(x, c); if (!closer || dd < closer.d) closer = { x: x, d: dd }; });
    const lastGain = lastStop && closer ? km(lastStop, c) - closer.d : 0;
    if (closer && lastGain > 250) {
      out.tip = { text: 'You leave ' + m.name + ' from ' + from + ', ≈ ' + Math.round(km(lastStop, c) * 1.35) + ' km from this border. Ending in ' + closer.x.place + ' saves ≈ ' + Math.round(lastGain * 1.35) + ' km.',
        label: 'End ' + m.name + ' in ' + closer.x.place, action: 'tip-end', cid: cid, place: closer.x.place };
      return out;
    }
    // Is there a more logical first stop just across the border?
    if (firstNext) {
      let nearest = null;
      nm.pool.forEach((p) => { const dd = km({ lat: p[4], lng: p[5] }, c); if (!nearest || dd < nearest.d) nearest = { p: p, d: dd }; });
      const gain = km(c, firstNext) - nearest.d;
      if (nearest.p[0] !== firstNext.place && gain > 250) {
        const inRoute = nextList.some((x) => x.place === nearest.p[0]);
        out.tip = { text: nearest.p[0] + ' is only ≈ ' + Math.round(nearest.d * 1.35) + ' km past the border, ' + Math.round(gain * 1.35) + ' km less than going straight to ' + firstNext.place + '.',
          label: inRoute ? 'Move ' + nearest.p[0] + ' to the start' : 'Start ' + nm.name + ' in ' + nearest.p[0], action: 'tip-start', cid: next, place: nearest.p[0] };
      }
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Sharing: the whole route fits in the link
  // ---------------------------------------------------------------------------

  function routeCode(s) {
    const head = { backpack: 'b', mid: 'm', luxury: 'l' }[s.routeStyle] + (s.pace === 'relaxed' ? 'r' : 'a') +
      ['nature', 'city', 'party'].map((v) => (s.vibes[v] ? '1' : '0')).join('') + (Number(s.maxBudget) || 0);
    const body = s.order.map((cid) => cid + s.stops[cid].map((x) => '.' + META[cid].pool.findIndex((p) => p[0] === x.place).toString(36) + '-' + x.nights).join('')).join('_');
    return head + '~' + body;
  }
  function appBase() { return location.origin + location.pathname; }
  function shareLink(s) { return /^https?:$/.test(location.protocol) ? appBase() + '#r=' + encodeURIComponent(routeCode(s)) : ''; }

  function decodeRoute(code) {
    const parts = code.split('~');
    const head = parts[0] || '', body = parts[1] || '';
    const style = { b: 'backpack', m: 'mid', l: 'luxury' }[head[0]] || 'backpack';
    const order = [];
    const stops = { th: [], kh: [], la: [], vn: [] };
    body.split('_').forEach((seg) => {
      const cid = seg.slice(0, 2);
      const meta = META[cid];
      if (!meta || order.indexOf(cid) >= 0) return;
      order.push(cid);
      seg.slice(2).split('.').filter(Boolean).forEach((t) => {
        const bits = t.split('-');
        const p = meta.pool[parseInt(bits[0], 36)];
        if (p && !stops[cid].some((x) => x.place === p[0])) stops[cid].push(toStop(p, Math.max(1, Math.min(30, parseInt(bits[1], 10) || 1)), p[2] * 2));
      });
    });
    if (!order.length) return null;
    const days = { th: 0, kh: 0, la: 0, vn: 0 };
    order.forEach((cid) => { days[cid] = stops[cid].reduce((a, x) => a + x.nights, 0); });
    return {
      order: order, stops: stops, days: days, style: style, routeStyle: style,
      pace: head[1] === 'r' ? 'relaxed' : 'active',
      vibes: { nature: head[2] === '1', city: head[3] === '1', party: head[4] === '1' },
      maxBudget: String(parseInt(head.slice(5), 10) || '')
    };
  }

  function shareText(s, d) {
    const names = s.order.map((c) => META[c].name);
    const namesText = names.length > 1 ? names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1] : (names[0] || '');
    const lines = ['My backpacking route: ' + d.totalDays + ' days through ' + namesText + ' (≈ ' + eur(d.total) + ', ' + STYLE_LABEL[s.routeStyle] + ')', ''];
    s.order.forEach((cid) => {
      const list = s.stops[cid];
      const days = list.reduce((a, x) => a + x.nights, 0);
      lines.push(META[cid].name + ', ' + days + ' days: ' + list.map((x) => x.place + ' (' + x.nights + 'n)').join(' → '));
    });
    const link = shareLink(s);
    lines.push('', link ? 'Open my route and plan yours: ' + link : 'Planned with Backpacking Route');
    return lines.join('\n');
  }

  // ---------------------------------------------------------------------------
  // Feedback (Google Form) and visitor stats (GoatCounter) – both optional, see config.js
  // ---------------------------------------------------------------------------

  function formConfig() {
    const raw = (CFG.FEEDBACK_FORM || '').trim();
    if (!raw) return null;
    try {
      const u = new URL(raw);
      const cfg = { action: u.origin + u.pathname.replace(/\/viewform$/, '/formResponse') };
      u.searchParams.forEach((v, k) => {
        if (k.indexOf('entry.') !== 0) return;
        const t = v.trim().toUpperCase();
        if (t === 'RATING') cfg.rating = k;
        else if (t === 'FEEDBACK' || t === 'TEXT') cfg.text = k;
        else if (t === 'ROUTE') cfg.route = k;
      });
      return cfg.rating || cfg.text ? cfg : null;
    } catch (e) { return null; }
  }
  function sendFeedback(rating, text) {
    const cfg = formConfig();
    if (!cfg) return Promise.resolve(false);
    const body = new URLSearchParams();
    if (cfg.rating) body.append(cfg.rating, rating === 'up' ? 'Useful' : 'Not useful');
    if (cfg.text && text) body.append(cfg.text, text);
    if (cfg.route) body.append(cfg.route, shareLink(state) || routeCode(state));
    return fetch(cfg.action, { method: 'POST', mode: 'no-cors', body: body }).then(() => true);
  }
  function initStats() {
    const code = (CFG.GOATCOUNTER_CODE || '').trim();
    if (!code || !/^[a-z0-9-]+$/i.test(code)) return;
    const sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://gc.zgo.at/count.js';
    sc.setAttribute('data-goatcounter', 'https://' + code + '.goatcounter.com/count');
    document.head.appendChild(sc);
  }
  function track(name) {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true }); } catch (e) { /* stats are optional */ }
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  function defaultState() {
    return {
      screen: 'plan',
      days: { th: 0, kh: 0, la: 0, vn: 0 },
      style: 'backpack', pace: 'active',
      vibes: { nature: true, city: false, party: true },
      maxBudget: '',
      loadStep: 0,
      routeStyle: 'backpack', order: [], stops: { th: [], kh: [], la: [], vn: [] },
      editing: false, adding: null, query: '',
      sheet: null, copied: false,
      feedback: null, fbText: '', fbDone: null,
      fromLink: false,
      confirmReset: false
    };
  }

  let state = defaultState();
  let timers = [];
  let resetTimer = null;

  function save() {
    if (state.fromLink) return; // opening someone else's link never overwrites your own route
    try {
      const keep = {
        days: state.days, style: state.style, pace: state.pace, vibes: state.vibes, maxBudget: state.maxBudget,
        routeStyle: state.routeStyle, order: state.order,
        stops: Object.keys(state.stops).reduce((o, cid) => { o[cid] = state.stops[cid].map((x) => [x.place, x.nights, x.score]); return o; }, {}),
        hasRoute: state.order.length > 0
      };
      localStorage.setItem(STORE_KEY, JSON.stringify(keep));
    } catch (e) { /* private mode or storage full: the app still works, it just won't remember */ }
  }

  function restore() {
    const m = (location.hash || '').match(/[#&]r=([^&]+)/);
    if (m) {
      try {
        const shared = decodeRoute(decodeURIComponent(m[1]));
        if (shared) { Object.assign(state, shared, { screen: 'route', fromLink: true }); track('opened-shared-route'); return; }
      } catch (e) { /* a broken link just opens the planner */ }
    }
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const k = JSON.parse(raw);
      ['days', 'style', 'pace', 'vibes', 'maxBudget', 'routeStyle'].forEach((key) => { if (k[key] != null) state[key] = k[key]; });
      if (k.hasRoute && Array.isArray(k.order)) {
        const stops = { th: [], kh: [], la: [], vn: [] };
        k.order.forEach((cid) => {
          if (!META[cid]) return;
          (k.stops[cid] || []).forEach((t) => { const p = poolEntry(cid, t[0]); if (p) stops[cid].push(toStop(p, t[1], t[2])); });
        });
        state.order = k.order.filter((c) => META[c]);
        state.stops = stops;
        state.screen = 'route';
      }
    } catch (e) { /* ignore a broken save */ }
  }

  // update(patch)           -> full render
  // update(patch, 'quiet')  -> no render (typing); caller refreshes the parts that changed
  function update(patch, mode) {
    const prevScreen = state.screen;
    Object.assign(state, patch);
    save();
    if (mode === 'quiet') return;
    render();
    if (state.screen !== prevScreen) window.scrollTo(0, 0);
  }

  function updStops(cid, fn) {
    const all = Object.assign({}, state.stops);
    all[cid] = fn(all[cid].slice());
    update({ stops: all });
  }

  function clearTimers() { timers.forEach((t) => clearTimeout(t)); timers = []; }

  function generate() {
    const planDays = COUNTRY_ORDER.reduce((a, k) => a + state.days[k], 0);
    if (!planDays) return;
    const r = buildRoute(state);
    clearTimers();
    if (state.fromLink || /[#&]r=/.test(location.hash)) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* fine */ }
    }
    update({ screen: 'loading', loadStep: 0, order: r.order, stops: r.stops, routeStyle: state.style, editing: false, adding: null, query: '', fromLink: false, feedback: null, fbText: '', fbDone: null, sheet: null });
    track('route-generated');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = reduce ? 250 : 700;
    [1, 2, 3].forEach((n) => timers.push(setTimeout(() => update({ loadStep: n }), step * n)));
    timers.push(setTimeout(() => update({ screen: 'route' }), step * 3 + 500));
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  function pressed(on) { return on ? 'true' : 'false'; }

  function renderPlan() {
    const s = state;
    const countries = COUNTRY_ORDER.map((id) => {
      const m = META[id];
      const on = s.days[id] > 0;
      return '<div class="country-row">' +
        '<div class="badge' + (on ? '' : ' off') + '" id="badge-' + id + '"' + (on ? ' style="background:' + m.color + ';color:' + m.ink + '"' : '') + '>' + m.code + '</div>' +
        '<div class="country-text"><span class="country-name">' + m.name + '</span><span class="hint">' + esc(m.sub) + '</span></div>' +
        '<div class="stepper">' +
          '<button class="step" data-action="days" data-cid="' + id + '" data-d="-1" aria-label="One day less in ' + m.name + '">−</button>' +
          '<input class="step-input" id="days-' + id + '" data-input="days" data-cid="' + id + '" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="90" value="' + s.days[id] + '" aria-label="Days in ' + m.name + '">' +
          '<button class="step plus" data-action="days" data-cid="' + id + '" data-d="1" aria-label="One day more in ' + m.name + '">+</button>' +
        '</div></div>';
    }).join('');
    const styles = [['backpack', 'Backpack', 'hostels, street food'], ['mid', 'Mid-range', 'private rooms'], ['luxury', 'Luxury', 'hotels, transfers']]
      .map((b) => '<button class="pill" data-action="style" data-id="' + b[0] + '" aria-pressed="' + pressed(s.style === b[0]) + '"><span class="pill-label">' + b[1] + '</span><span class="pill-sub">' + b[2] + '</span></button>').join('');
    const paces = [['relaxed', 'Relaxed', 'longer at each stop'], ['active', 'Active', 'see more places']]
      .map((t) => '<button class="pill" data-action="pace" data-id="' + t[0] + '" aria-pressed="' + pressed(s.pace === t[0]) + '"><span class="pill-label">' + t[1] + '</span><span class="pill-sub">' + t[2] + '</span></button>').join('');
    const vibes = ['nature', 'city', 'party']
      .map((v) => '<button class="pill" data-action="vibe" data-id="' + v + '" aria-pressed="' + pressed(s.vibes[v]) + '"><span class="pill-label">' + TAG_LABEL[v] + '</span></button>').join('');
    return '<div class="screen">' +
      '<header class="topbar"><div class="brand"><div class="brand-mark">' + ICON.route + '</div><span class="brand-name">Backpacking Route</span></div>' +
        '<button class="icon-btn" data-action="info" aria-label="About this app">' + ICON.info + '</button></header>' +
      '<section class="hero"><span class="eyebrow">Southeast Asia overland</span><h1>Plan your backpacking route in one minute</h1>' +
        '<p>Pick your countries and days. We work out the route, the border crossings and your daily budget.</p></section>' +
      '<section class="block"><h2>1. Countries &amp; days</h2>' + countries + '<span class="hint">Tap a number to type it, or use − and +. Leave a country at 0 to skip it.</span></section>' +
      '<section class="block"><h2>2. Travel style</h2><div class="pills three">' + styles + '</div></section>' +
      '<section class="block"><h2>3. Pace</h2><div class="pills two">' + paces + '</div></section>' +
      '<section class="block"><div class="block-head"><h2>4. What are you into?</h2><span class="hint">pick any</span></div><div class="pills three">' + vibes + '</div></section>' +
      '<section class="block"><div class="block-head"><h2>5. Your budget</h2><span class="hint">optional</span></div><div class="card">' +
        '<label class="field-label" for="br-budget">How much can you spend in total?</label>' +
        '<div class="money"><span aria-hidden="true">€</span><input id="br-budget" data-input="budget" type="number" inputmode="numeric" min="0" step="100" placeholder="e.g. 2500" value="' + esc(s.maxBudget) + '"></div>' +
        '<span class="hint">Leave out your flight to Asia. We check whether your route fits and show you where to save.</span></div></section>' +
      '<div style="flex-grow:1;min-height:24px"></div>' +
      '<div class="cta-bar"><div class="cta" id="plan-cta">' + renderPlanCta() + '</div></div>' +
      '<div class="footer-links"><button data-action="info">About</button><button data-action="info" data-focus="privacy">Privacy</button>' +
        '<button data-action="reset"' + (s.confirmReset ? ' class="danger"' : '') + '>' + (s.confirmReset ? 'Tap again to clear everything' : 'Start over') + '</button></div>' +
    '</div>';
  }

  function renderPlanCta() {
    const s = state;
    const planDays = COUNTRY_ORDER.reduce((a, k) => a + s.days[k], 0);
    const count = COUNTRY_ORDER.filter((k) => s.days[k] > 0).length;
    const budget = Number(s.maxBudget) || 0;
    const sub = planDays ? count + (count === 1 ? ' country · ' : ' countries · ') + STYLE_LABEL[s.style] + ' · ' + (budget > 0 ? eur(budget) : 'no budget set') : 'Add days to at least one country';
    return '<div style="min-width:0"><div class="cta-days">' + planDays + (planDays === 1 ? ' day' : ' days') + '</div>' +
      '<div class="cta-sub">' + sub + '</div></div>' +
      '<button class="btn-yellow" data-action="generate"' + (planDays ? '' : ' disabled') + '>Make my route ' + ICON.arrowR + '</button>';
  }

  function renderLoading() {
    const s = state;
    const vibeNames = ['nature', 'city', 'party'].filter((v) => s.vibes[v]).map((v) => TAG_LABEL[v]);
    const texts = [vibeNames.length ? 'Picking places for ' + vibeNames.join(' + ') : 'Picking the classic highlights', 'Finding the border crossings', 'Working out your daily budget'];
    const planDays = s.order.reduce((a, c) => a + s.days[c], 0);
    return '<div class="loading" role="status">' +
      '<div style="display:flex;justify-content:center"><svg aria-hidden="true" width="160" height="110" viewBox="0 0 160 110" fill="none">' +
        '<path class="br-route" d="M18 88 C 50 88, 40 30, 80 40 S 120 70, 142 22" stroke="#FFC93C" stroke-width="5" stroke-linecap="round"></path>' +
        '<circle class="br-dot" cx="18" cy="88" r="9" fill="#2BB3A3"></circle><circle cx="80" cy="40" r="6" fill="#F06595"></circle><circle class="br-dot" cx="142" cy="22" r="9" fill="#FFC93C"></circle></svg></div>' +
      '<div><h2>Building your route</h2><p>' + planDays + ' days through ' + s.order.length + (s.order.length === 1 ? ' country' : ' countries') + '</p></div>' +
      '<div class="load-steps">' + texts.map((t, i) => {
        const cls = s.loadStep > i ? ' done' : (s.loadStep === i ? ' active' : '');
        return '<div class="load-step' + cls + '"><div class="load-dot">' + (s.loadStep > i ? ICON.checkDark : '') + '</div><span>' + esc(t) + '</span></div>';
      }).join('') + '</div></div>';
  }

  function renderSearchResults(cid) {
    const m = META[cid];
    const q = state.query.trim().toLowerCase();
    if (!q) return '<span class="hint">Type one or two letters to see matching places.</span>';
    const inRoute = state.stops[cid].map((x) => x.place);
    const matches = m.pool.map((p, pi) => {
      const lower = p[0].toLowerCase();
      let at = lower.indexOf(q) === 0 ? 0 : -1;
      if (at < 0) { const w = lower.indexOf(' ' + q); if (w >= 0) at = w + 1; }
      return { p: p, pi: pi, at: at };
    }).filter((x) => x.at >= 0).sort((a, b) => (a.at === 0 ? 0 : 1) - (b.at === 0 ? 0 : 1) || b.p[2] - a.p[2]).slice(0, 6);
    if (!matches.length) return '<span class="hint">No match. For now we cover the ' + m.pool.length + ' most popular places in ' + m.name + '.</span>';
    return matches.map((x) => {
      const taken = inRoute.indexOf(x.p[0]) >= 0;
      const name = esc(x.p[0].slice(0, x.at)) + '<b>' + esc(x.p[0].slice(x.at, x.at + q.length)) + '</b>' + esc(x.p[0].slice(x.at + q.length));
      const note = taken ? 'in your route' : TAG_LABEL[x.p[1].filter((t) => state.vibes[t])[0] || x.p[1][0]];
      return '<button class="match" data-action="add-place" data-cid="' + cid + '" data-pi="' + x.pi + '"' + (taken ? ' disabled' : '') + '>' +
        '<span class="match-name">' + name + '</span><span class="tag">' + note + '</span></button>';
    }).join('');
  }

  function renderLeg(leg) {
    const s = state;
    const m = leg.m;
    const arrowBg = m.ink === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(20,33,61,0.12)';
    const stops = leg.list.map((x, k) => {
      const shown = x.tags.filter((t) => s.vibes[t])[0] || x.tags[0];
      if (!s.editing) {
        return '<div class="stop"><div class="dot" style="background:' + m.dot + '"></div><span class="stop-name">' + esc(x.place) + '</span>' +
          '<span class="tag">' + TAG_LABEL[shown] + '</span><span class="nights">' + x.nights + 'n</span></div>';
      }
      return '<div class="stop-edit"><div class="line"><div style="display:flex;align-items:center;gap:10px;min-width:0"><div class="dot" style="background:' + m.dot + '"></div><span class="stop-name">' + esc(x.place) + '</span></div>' +
          '<button class="remove" data-action="stop-remove" data-cid="' + leg.cid + '" data-k="' + k + '" aria-label="Remove ' + esc(x.place) + '">' + ICON.x + '</button></div>' +
        '<div class="line"><div style="display:flex;gap:6px">' +
          '<button class="mini" data-action="stop-up" data-cid="' + leg.cid + '" data-k="' + k + '" aria-label="Move ' + esc(x.place) + ' earlier">' + ICON.up + '</button>' +
          '<button class="mini" data-action="stop-down" data-cid="' + leg.cid + '" data-k="' + k + '" aria-label="Move ' + esc(x.place) + ' later">' + ICON.down + '</button></div>' +
          '<div style="display:flex;align-items:center;gap:4px">' +
          '<button class="mini" data-action="stop-dec" data-cid="' + leg.cid + '" data-k="' + k + '" aria-label="One night less in ' + esc(x.place) + '">−</button>' +
          '<span class="mini-val">' + x.nights + (x.nights === 1 ? ' night' : ' nights') + '</span>' +
          '<button class="mini plus" data-action="stop-inc" data-cid="' + leg.cid + '" data-k="' + k + '" aria-label="One night more in ' + esc(x.place) + '">+</button></div></div></div>';
    }).join('');
    let add = '';
    if (s.editing) {
      const open = s.adding === leg.cid;
      add = '<button class="add-btn" data-action="add-toggle" data-cid="' + leg.cid + '" aria-expanded="' + pressed(open) + '">' + (open ? 'Close' : '+ Add a place in ' + m.name) + '</button>';
      if (open) {
        add += '<div class="search"><label class="hint" style="font-weight:600" for="br-search-' + leg.cid + '">Search the top ' + m.pool.length + ' places in ' + m.name + '</label>' +
          '<div class="search-box">' + ICON.search + '<input id="br-search-' + leg.cid + '" data-input="search" data-cid="' + leg.cid + '" type="text" autocomplete="off" enterkeyhint="done" placeholder="Start typing, e.g. ko" value="' + esc(s.query) + '"></div>' +
          '<div id="results-' + leg.cid + '" style="display:flex;flex-direction:column;gap:8px">' + renderSearchResults(leg.cid) + '</div></div>';
      }
    }
    let border = '';
    if (leg.border) {
      const b = leg.border;
      border = '<div class="border' + (b.kind === 'closed' ? ' closed' : '') + '"><div class="border-icon">' + (b.kind === 'land' ? ICON.border : ICON.plane) + '</div>' +
        '<div class="border-text"><span class="border-title">' + b.title + '</span><span class="border-name">' + esc(b.name) + '</span><span class="border-info">' + esc(b.info) + '</span></div></div>';
      if (b.tip) {
        border += '<div class="border-tip"><span><strong>Tip:</strong> ' + esc(b.tip.text) + '</span>' +
          '<button class="btn-outline" data-action="' + b.tip.action + '" data-cid="' + b.tip.cid + '" data-place="' + esc(b.tip.place) + '">' + esc(b.tip.label) + '</button></div>';
      }
    }
    return '<div class="leg"><div class="leg-head" style="background:' + m.color + ';color:' + m.ink + '">' +
        (s.editing ? '<div class="arrows">' +
          '<button class="arrow" style="background:' + arrowBg + ';color:' + m.ink + '" data-action="country-move" data-i="' + leg.i + '" data-d="-1" aria-label="Move ' + m.name + ' earlier">' + ICON.up + '</button>' +
          '<button class="arrow" style="background:' + arrowBg + ';color:' + m.ink + '" data-action="country-move" data-i="' + leg.i + '" data-d="1" aria-label="Move ' + m.name + ' later">' + ICON.down + '</button></div>' : '') +
        '<div style="flex-grow:1;display:flex;flex-direction:column;gap:2px"><span class="leg-name">' + m.name + '</span><span class="leg-sub">' + leg.range + '</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:2px;text-align:right"><span class="leg-cost">' + eur(leg.cost) + '</span><span class="leg-sub">' + leg.days + ' days · ' + eur(leg.rate) + '/day</span></div></div>' +
      '<div class="leg-body">' + (leg.list.length ? stops : '<p class="empty">No stops yet. Add a place below.</p>') + add + '</div>' +
      border + '</div>';
  }

  function renderFeedback() {
    const s = state;
    const hasForm = !!formConfig();
    let inner;
    if (!s.feedback) {
      inner = '<div class="thumbs"><button class="thumb" data-action="fb" data-v="up">' + ICON.thumbUp + ' Yes</button>' +
        '<button class="thumb" data-action="fb" data-v="down">' + ICON.thumbDown + ' Not really</button></div>';
    } else if (!s.fbDone && hasForm) {
      const q = s.feedback === 'up' ? 'Thanks! Anything that would make it even better?' : 'Thanks for being honest. What was off about this route?';
      const ph = s.feedback === 'up' ? 'e.g. I would love to see Koh Lipe in the list' : 'e.g. too many places, or the costs felt too low';
      inner = '<label class="field-label" for="br-feedback">' + q + '</label>' +
        '<textarea id="br-feedback" data-input="fb" rows="3" maxlength="1000" placeholder="' + ph + '">' + esc(s.fbText) + '</textarea>' +
        '<div class="thumbs"><button class="btn-light" data-action="fb-skip">Skip</button>' +
        '<button class="btn-dark" id="fb-send" data-action="fb-send"' + (s.fbText.trim() ? '' : ' disabled') + '>Send</button></div>';
    } else {
      const failed = s.fbDone === 'failed';
      const text = failed ? 'Could not send it. You seem to be offline, try again later.' :
        (s.fbDone === 'sent' ? 'Thanks, we got your feedback!' : 'Thanks for your rating!');
      inner = '<div class="done' + (failed ? ' warn' : '') + '">' + (failed ? '' : ICON.check) + '<span>' + text + '</span></div>' +
        (failed ? '<button class="btn-dark" data-action="fb-send">Try again</button>' : '');
    }
    return '<section class="panel" id="feedback"><span class="panel-title">Was this route useful?</span>' + inner + '</section>';
  }

  function renderRoute() {
    const s = state;
    const d = describeRoute(s);
    const vibeNames = ['nature', 'city', 'party'].filter((v) => s.vibes[v]).map((v) => TAG_LABEL[v]);
    const chips = [STYLE_LABEL[s.routeStyle], s.pace === 'relaxed' ? 'Relaxed' : 'Active'].concat(vibeNames.length ? [vibeNames.join(' + ')] : []);
    const bar = d.legs.map((l) => '<div style="flex-grow:' + Math.max(l.days, 0.01) + ';background:' + l.m.bar + '"></div>').join('');
    const st = d.status;
    const budgetBlock = d.budget > 0 ?
      '<div style="display:flex;flex-direction:column;gap:8px"><div class="meter" role="img" aria-label="' + Math.round(d.pct * 100) + '% of your budget"><div style="width:' + Math.min(100, Math.round(d.pct * 100)) + '%;background:' + st.bar + '"></div></div>' +
      '<div class="meter-legend"><span>Estimated <strong>' + eur(d.total) + '</strong></span><span>Your budget <strong>' + eur(d.budget) + '</strong></span></div></div>' : '';
    const tips = d.tips.map((t) => '<div class="save-tip"><div><strong>' + esc(t.text) + '</strong><span class="saves">saves ≈ ' + t.saves + '</span></div>' +
      '<button class="btn-outline" data-action="' + t.action + '"' + (t.cid ? ' data-cid="' + t.cid + '"' : '') + (t.place ? ' data-place="' + esc(t.place) + '"' : '') + '>Apply</button></div>').join('');
    return '<div class="screen">' +
      '<header class="route-top"><button class="link-btn" data-action="back">' + ICON.arrowL + ' Change plan</button>' +
        '<div class="brand"><span class="brand-name">Backpacking Route</span><button class="icon-btn" data-action="info" aria-label="About this app">' + ICON.info + '</button></div></header>' +
      (s.fromLink ? '<div class="banner"><strong>Someone shared this route with you.</strong> Tap Customize to tweak it, or Change plan to make your own.</div>' : '') +
      '<section class="summary"><div class="summary-row"><div><span class="eyebrow">Your route</span><div class="big">' + d.totalDays + ' days</div></div>' +
        '<div style="text-align:right"><div class="muted-light">Estimated total</div><div class="mid">' + eur(d.total) + '</div><div class="muted-light">≈ ' + eur(d.totalDays ? d.total / d.totalDays : 0) + ' a day</div></div></div>' +
        '<div class="days-bar" aria-hidden="true">' + bar + '</div>' +
        '<div class="chips">' + chips.map((c) => '<span class="chip">' + esc(c) + '</span>').join('') + '</div>' +
        '<button class="btn-yellow" data-action="share">' + ICON.share + ' Share this route</button></section>' +
      '<section class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><span class="panel-title">Budget check</span>' +
        '<span class="status" style="background:' + st.bg + ';color:' + st.fg + '">' + st.label + '</span></div>' + budgetBlock +
        '<p>' + esc(st.text) + '</p>' + tips +
        '<div class="legend"><span><i style="background:#2F9E44"></i>Plenty of room</span><span><i style="background:#E8890C"></i>Tight</span><span><i style="background:#C92A2A"></i>Over budget</span></div></section>' +
      '<div class="day-head"><div><h2>Day by day</h2><span class="hint">' + (s.editing ? 'Move, remove or add places' : 'Our suggestion – tweak it any way you like') + '</span></div>' +
        '<button class="edit-btn' + (s.editing ? ' on' : '') + '" data-action="edit">' + (s.editing ? 'Done' : 'Customize') + '</button></div>' +
      d.legs.map(renderLeg).join('') +
      renderFeedback() +
      '<section class="fineprint"><strong>How we estimate costs</strong><span>Daily costs per country and travel style from backpacker budget sources, adjusted for local inflation and the euro–dollar rate. Excludes flights, visas and big one-off activities. Travel times are rough estimates from distance. Border status checked November 2026: borders and visa rules change, so always check before you go.</span><span>Prices as of October 2026</span></section>' +
      '<div class="footer-links" style="padding-top:12px"><button data-action="info">About</button><button data-action="info" data-focus="privacy">Privacy</button>' +
        '<button data-action="reset"' + (s.confirmReset ? ' class="danger"' : '') + '>' + (s.confirmReset ? 'Tap again to clear everything' : 'Start over') + '</button></div>' +
      '<div class="route-end"></div></div>';
  }

  function renderShareSheet() {
    const d = describeRoute(state);
    const text = shareText(state, d);
    const canNative = !!navigator.share;
    const hasLink = !!shareLink(state);
    return '<div class="overlay" data-action="close-sheet"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="share-title" data-stop="1">' +
      '<div class="sheet-head"><h2 id="share-title">Share your route</h2><button class="close" data-action="close-sheet" aria-label="Close">' + ICON.x + '</button></div>' +
      '<div class="preview">' + esc(text) + '</div>' +
      '<div class="share-actions">' +
        (canNative ? '<button class="btn-dark" data-action="share-native">Share…</button>' : '') +
        '<a class="btn-wa" href="https://wa.me/?text=' + encodeURIComponent(text) + '" target="_blank" rel="noopener" data-track="route-shared-whatsapp">Send via WhatsApp</a>' +
        '<button class="btn-ghost" data-action="share-copy">' + (state.copied ? 'Copied!' : 'Copy text') + '</button></div>' +
      (hasLink ? '' : '<span class="hint">Open the app from its web address to include a link that opens this exact route.</span>') +
    '</div></div>';
  }

  function renderInfoSheet() {
    const hasForm = !!formConfig();
    const hasStats = !!(CFG.GOATCOUNTER_CODE || '').trim();
    return '<div class="overlay" data-action="close-sheet"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="info-title" data-stop="1">' +
      '<div class="sheet-head"><h2 id="info-title">About Backpacking Route</h2><button class="close" data-action="close-sheet" aria-label="Close">' + ICON.x + '</button></div>' +
      '<p>Hi, I\'m Camiel, a student from the Netherlands heading off to backpack Southeast Asia in 2027. Working out a route across borders, buses and a budget felt like a puzzle, so I built the planner I wanted myself, with AI (Claude) as my coding partner.</p>' +
      '<p>Your feedback through the "Was this route useful?" box helps me make it better.</p>' +
      '<h3>Good to know</h3>' +
      '<p>Costs, travel times and routes are estimates to help you plan, not promises. Border crossings were checked in November 2026, but borders, visa rules and prices change: always check official travel advice before you go.</p>' +
      '<h3 id="privacy">Privacy</h3>' +
      '<p>No account, no cookies. Your route is saved only on this device, in your browser. When you share a route, it travels inside the link.</p>' +
      (hasForm ? '<p>If you send feedback, your rating, your comment and the route go to a Google Form that only I can read. Please don\'t include personal details.</p>' : '') +
      (hasStats ? '<p>I count visits with GoatCounter, which uses no cookies and doesn\'t track you across websites.</p>' : '') +
      '<p class="hint">Inter font by The Inter Project Authors, SIL Open Font License 1.1.</p>' +
    '</div></div>';
  }

  // Re-render while keeping focus and cursor where they were
  function render() {
    const app = $('#app');
    const active = document.activeElement;
    const focusId = active && active.id ? active.id : null;
    const focusAction = !focusId && active && active.dataset ? active.dataset.action + '|' + (active.dataset.cid || '') + '|' + (active.dataset.k || '') + '|' + (active.dataset.id || '') + '|' + (active.dataset.v || '') : null;
    let sel = null;
    try { if (focusId && active.selectionStart != null) sel = [active.selectionStart, active.selectionEnd]; } catch (e) { /* number inputs have no selection */ }

    app.innerHTML = state.screen === 'plan' ? renderPlan() : (state.screen === 'loading' ? renderLoading() : renderRoute());
    const sheetRoot = $('#sheet-root');
    sheetRoot.innerHTML = state.sheet === 'share' ? renderShareSheet() : (state.sheet === 'info' ? renderInfoSheet() : '');
    document.body.style.overflow = state.sheet ? 'hidden' : '';

    let target = null;
    if (focusId) target = document.getElementById(focusId);
    else if (focusAction) {
      const parts = focusAction.split('|');
      target = Array.prototype.find.call(document.querySelectorAll('[data-action="' + parts[0] + '"]'), (el) =>
        (el.dataset.cid || '') === parts[1] && (el.dataset.k || '') === parts[2] && (el.dataset.id || '') === parts[3] && (el.dataset.v || '') === parts[4]);
    }
    if (target && !state.sheet) {
      target.focus({ preventScroll: true });
      if (sel) { try { target.setSelectionRange(sel[0], sel[1]); } catch (e) { /* not a text field */ } }
    }
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  function onClick(e) {
    const trackEl = e.target.closest('[data-track]');
    if (trackEl) track(trackEl.dataset.track);
    const el = e.target.closest('[data-action]');
    if (!el) return;
    // Clicks inside a sheet never close it through the backdrop
    if (el.dataset.action === 'close-sheet' && el.classList.contains('overlay') && e.target.closest('[data-stop]')) return;
    if (el.disabled) return;
    const a = el.dataset.action;
    const cid = el.dataset.cid;
    const k = parseInt(el.dataset.k, 10);
    const s = state;

    switch (a) {
      case 'days': { const n = Object.assign({}, s.days); n[cid] = Math.max(0, Math.min(90, n[cid] + parseInt(el.dataset.d, 10))); update({ days: n }); break; }
      case 'style': update({ style: el.dataset.id }); break;
      case 'pace': update({ pace: el.dataset.id }); break;
      case 'vibe': { const n = Object.assign({}, s.vibes); n[el.dataset.id] = !n[el.dataset.id]; update({ vibes: n }); break; }
      case 'generate': generate(); break;
      case 'reset': {
        if (!s.confirmReset) {
          update({ confirmReset: true });
          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => { if (state.confirmReset) update({ confirmReset: false }); }, 4000);
          break;
        }
        clearTimeout(resetTimer);
        clearTimers();
        try { localStorage.removeItem(STORE_KEY); } catch (err) { /* nothing saved */ }
        try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { /* fine */ }
        state = defaultState();
        render();
        window.scrollTo(0, 0);
        announce('Cleared. You can start a new route.');
        break;
      }
      case 'back': clearTimers(); update({ screen: 'plan', fromLink: false, sheet: null, editing: false, adding: null }); break;
      case 'info': {
        update({ sheet: 'info' });
        const focus = el.dataset.focus ? document.getElementById(el.dataset.focus) : null;
        if (focus) focus.scrollIntoView({ block: 'start' });
        const close = $('#sheet-root .close'); if (close) close.focus();
        break;
      }
      case 'share': update({ sheet: 'share', copied: false }); { const c = $('#sheet-root .close'); if (c) c.focus(); } break;
      case 'close-sheet': update({ sheet: null }); break;
      case 'share-native': {
        const text = shareText(s, describeRoute(s));
        track('route-shared-native');
        try { navigator.share({ title: 'My backpacking route', text: text }).catch(() => {}); } catch (err) { /* not available */ }
        break;
      }
      case 'share-copy': {
        const text = shareText(s, describeRoute(s));
        const done = () => { update({ copied: true }); announce('Copied to clipboard'); track('route-shared-copy'); };
        const fallback = () => {
          const ta = document.createElement('textarea');
          ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (err) { /* nothing more we can do */ }
          document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
        break;
      }
      case 'edit': update({ editing: !s.editing, adding: null, query: '', fromLink: false }); break;
      case 'country-move': {
        const i = parseInt(el.dataset.i, 10), j = i + parseInt(el.dataset.d, 10);
        if (j < 0 || j >= s.order.length) break;
        const o = s.order.slice(); const t = o[i]; o[i] = o[j]; o[j] = t;
        const stops = Object.assign({}, s.stops);
        const draft = { order: o, stops: stops };
        const from = Math.max(0, Math.min(i, j) - 1), to = Math.min(o.length - 1, Math.max(i, j) + 1);
        ['set', 'live'].forEach((mode) => {
          for (let x = from; x <= to; x++) { const c = o[x]; const e = routeEnds(draft, c, mode); stops[c] = arrange(c, stops[c], e.entry, e.exit); }
        });
        update({ order: o, stops: stops });
        announce(META[o[j]].name + ' moved. Stops re-ordered for the new arrival.');
        break;
      }
      case 'stop-inc': updStops(cid, (l) => { l[k] = Object.assign({}, l[k], { nights: Math.min(30, l[k].nights + 1) }); return l; }); break;
      case 'stop-dec': updStops(cid, (l) => { l[k] = Object.assign({}, l[k], { nights: Math.max(1, l[k].nights - 1) }); return l; }); break;
      case 'stop-remove': updStops(cid, (l) => { l.splice(k, 1); return l; }); announce('Removed'); break;
      case 'stop-up': updStops(cid, (l) => { if (k > 0) { const t = l[k - 1]; l[k - 1] = l[k]; l[k] = t; } return l; }); break;
      case 'stop-down': updStops(cid, (l) => { if (k < l.length - 1) { const t = l[k + 1]; l[k + 1] = l[k]; l[k] = t; } return l; }); break;
      case 'add-toggle': {
        const open = s.adding === cid;
        update({ adding: open ? null : cid, query: '' });
        if (!open) { const input = document.getElementById('br-search-' + cid); if (input) input.focus(); }
        break;
      }
      case 'add-place': addPlace(cid, META[cid].pool[parseInt(el.dataset.pi, 10)]); break;
      case 'tip-end': updStops(cid, (l) => { const i = l.findIndex((x) => x.place === el.dataset.place); if (i >= 0) l.push(l.splice(i, 1)[0]); return l; }); break;
      case 'tip-start': updStops(cid, (l) => {
        const i = l.findIndex((x) => x.place === el.dataset.place);
        const p = poolEntry(cid, el.dataset.place);
        const item = i >= 0 ? l.splice(i, 1)[0] : toStop(p, Math.max(1, p[3] || 1), p[2] * 2);
        l.unshift(item);
        return l;
      }); break;
      case 'save-cut': cutNights(cid, 3); break;
      case 'save-backpack': update({ routeStyle: 'backpack' }); break;
      case 'save-skip': updStops(cid, (l) => l.filter((x) => x.place !== el.dataset.place)); break;
      case 'fb': {
        const v = el.dataset.v;
        track(v === 'up' ? 'feedback-up' : 'feedback-down');
        if (formConfig()) update({ feedback: v, fbDone: null });
        else update({ feedback: v, fbDone: 'rated' });
        const ta = document.getElementById('br-feedback'); if (ta) ta.focus();
        break;
      }
      case 'fb-skip': submitFeedback(''); break;
      case 'fb-send': submitFeedback(s.fbText.trim()); break;
      default: break;
    }
  }

  function addPlace(cid, p) {
    if (!p) return;
    const e = routeEnds(state, cid, 'live');
    const ends = { start: typeof e.entry === 'object' ? e.entry : null, end: e.exit && typeof e.exit === 'object' ? e.exit : null };
    updStops(cid, (l) => {
      const item = toStop(p, Math.max(2, p[3] || 1), p[2] * 2);
      // Put it where it adds the least travel, counting the way in and out of the country
      let at = l.length, bestAdd = Infinity;
      for (let i = 0; i <= l.length; i++) {
        const prev = i === 0 ? ends.start : l[i - 1];
        const nxt = i === l.length ? ends.end : l[i];
        const add = (prev ? km(prev, item) : 0) + (nxt ? km(item, nxt) : 0) - (prev && nxt ? km(prev, nxt) : 0);
        if (add < bestAdd) { bestAdd = add; at = i; }
      }
      l.splice(at, 0, item);
      return l;
    });
    update({ adding: null, query: '' });
    announce(p[0] + ' added');
  }

  function cutNights(cid, n) {
    updStops(cid, (l) => {
      let left = n;
      while (left > 0) {
        let bi = -1;
        l.forEach((x, i) => { if (x.nights > 1 && (bi < 0 || x.nights > l[bi].nights)) bi = i; });
        if (bi < 0) break;
        l[bi] = Object.assign({}, l[bi], { nights: l[bi].nights - 1 });
        left--;
      }
      return l;
    });
  }

  function submitFeedback(text) {
    const rating = state.feedback;
    sendFeedback(rating, text)
      .then(() => update({ fbDone: text ? 'sent' : 'rated', fbText: text ? '' : state.fbText }))
      .catch(() => update({ fbDone: 'failed', fbText: text }));
  }

  function onInput(e) {
    const el = e.target;
    const kind = el.dataset && el.dataset.input;
    if (!kind) return;
    if (kind === 'days') {
      const cid = el.dataset.cid;
      const n = Object.assign({}, state.days);
      const v = parseInt(el.value, 10);
      n[cid] = isNaN(v) ? 0 : Math.max(0, Math.min(90, v));
      update({ days: n }, 'quiet');
      const badge = document.getElementById('badge-' + cid);
      if (badge) {
        const on = n[cid] > 0;
        badge.className = 'badge' + (on ? '' : ' off');
        badge.style.background = on ? META[cid].color : '';
        badge.style.color = on ? META[cid].ink : '';
      }
      const cta = $('#plan-cta'); if (cta) cta.innerHTML = renderPlanCta();
    } else if (kind === 'budget') {
      update({ maxBudget: el.value }, 'quiet');
      const cta = $('#plan-cta'); if (cta) cta.innerHTML = renderPlanCta();
    } else if (kind === 'search') {
      update({ query: el.value }, 'quiet');
      const box = document.getElementById('results-' + el.dataset.cid);
      if (box) box.innerHTML = renderSearchResults(el.dataset.cid);
    } else if (kind === 'fb') {
      update({ fbText: el.value }, 'quiet');
      const btn = $('#fb-send'); if (btn) btn.disabled = !el.value.trim();
    }
  }

  function onChange(e) {
    const el = e.target;
    if (el.dataset && el.dataset.input === 'days' && String(state.days[el.dataset.cid]) !== el.value) el.value = state.days[el.dataset.cid];
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      if (state.sheet) { update({ sheet: null }); return; }
      if (state.adding) { const cid = state.adding; update({ adding: null, query: '' }); const b = document.querySelector('[data-action="add-toggle"][data-cid="' + cid + '"]'); if (b) b.focus(); return; }
    }
    const el = e.target;
    if (e.key === 'Enter' && el.dataset && el.dataset.input === 'search') {
      e.preventDefault();
      const first = document.querySelector('#results-' + el.dataset.cid + ' .match:not([disabled])');
      if (first) addPlace(el.dataset.cid, META[el.dataset.cid].pool[parseInt(first.dataset.pi, 10)]);
    }
  }

  // ---------------------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------------------

  restore();
  render();
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('change', onChange);
  // Select the whole number when you tap it, so typing replaces it
  document.addEventListener('focusin', (e) => { if (e.target.dataset && e.target.dataset.input === 'days') { try { e.target.select(); } catch (err) { /* fine */ } } });

  // iPhone: two quick taps on a button can still zoom the page. Treat the second tap as a normal tap instead.
  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const btn = e.target.closest('button, .btn-wa');
    const now = Date.now();
    if (btn && now - lastTap < 350 && !btn.disabled) { e.preventDefault(); btn.click(); }
    lastTap = now;
  }, { passive: false });
  window.addEventListener('hashchange', () => { if (/[#&]r=/.test(location.hash)) { state = defaultState(); restore(); render(); window.scrollTo(0, 0); } });
  initStats();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is a bonus */ }); });
  }

})();
