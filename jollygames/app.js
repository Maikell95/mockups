/* Jolly Games · maqueta de tienda con Mercado Pago automático (Maikel Ferrer) */
const IP = 'jollygames.live:25587';
const CDN_OFERTA = 'https://dunb17ur4ymx4.cloudfront.net/packages/images/7b78bd6a8087be6192ca0a1dff535c41cfc07835.webp';
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const guardar = (k, v) => { try { localStorage.setItem('jolly-' + k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { const v = localStorage.getItem('jolly-' + k); return v ? JSON.parse(v) : d; } catch { return d; } };
const img = (url, w = 200) => url ? `https://wsrv.nl/?url=${encodeURIComponent(url.replace('https://', ''))}&w=${w}&output=webp` : '';
const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2400); };

/* ======================= pixel art ======================= */
const PALETA = { k: '#000', w: '#fff', s: '#c6ccd4', S: '#7d8896', b: '#8a5a2b', d: '#4e3418', r: '#ff1f30', R: '#9a0010', a: '#00acfc', A: '#0060a0', y: '#ffd23f', Y: '#c99a00',
  g: '#3fae2a', G: '#22691a', e: '#01fb6d', c: '#5fe6ff', l: '#00b1ea', L: '#74acdf', o: '#ff8a1f', p: '#ff6fb5', m: '#e9c9a0' };
const DIBUJOS = {
  espadas: ['s..........s', 'ws........sw', '.ws......sw.', '..ws....sw..', '...ws..sw...', '....wssw....', '.....ss.....', '....b..b....', '...yb..by...', '..dy....yd..', '.dd......dd.', 'dd........dd'],
  arco: ['....bb......', '...b..s.....', '..b....s....', '.b......s...', '.b.......s..', 'bwwwwwwwwkk.', 'b........s..', '.b......s...', '.b.....s....', '..b...s.....', '...b.s......', '....bb......'],
  fiesta: ['.....y......', '....yry.....', '....rrr.....', '...raaar....', '...rrrrr....', '..ryyyyyr...', '..rrrrrrr...', '.raaaaaaar..', '.rrrrrrrrr..', 'ryyyyyyyyyr.', '............', 'a..e..y..p..'],
  bandera: ['d...........', 'dwwkkwwkkww.', 'dwwkkwwkkww.', 'dkkwwkkwwkk.', 'dkkwwkkwwkk.', 'dwwkkwwkkww.', 'dwwkkwwkkww.', 'd...........', 'd...........', 'd...........', 'd...........', 'dd..........'],
  pala: ['........ccc.', '.......ccccc', '.......ccccc', '........ccc.', '.......d.c..', '......d.....', '.....d......', '....d.......', '...d........', '..d.........', '.dd.........', 'dd..........'],
  isla: ['....w.ww....', '...wwwwwww..', '............', '..gggggggg..', '.gGgggggGgg.', '.bbbbbbbbbb.', '..bdbbbbdb..', '...SbbbbS...', '....sbbs....', '.....bb.....', '.....b......', '............'],
  muro: ['SSSSSSSSSSSS', 'sssSsssssSss', 'sssSsssssSss', 'SSSSSSSSSSSS', 'ssssssSsssss', 'ssssssSsssss', 'SSSSSSSSSSSS', 'sssSsssssSss', 'sssSsssssSss', 'SSSSSSSSSSSS', 'ssssssSsssss', 'ssssssSsssss'],
  reloj: ['....kkkk....', '.....kk.....', '...kkkkkk...', '..kwwwwwwk..', '.kwwwwrwwwk.', '.kwwwwrwwwk.', '.kwwwwrrrwk.', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '..kwwwwwwk..', '...kkkkkk...', '............'],
  trofeo: ['............', '.yyyyyyyyyy.', 'yyyyyyyyyyyy', 'y.yyyyyyyY.y', 'y.yyyyyyyY.y', '.yyyyyyyyYy.', '..yyyyyyYY..', '...yyyyYY...', '.....yY.....', '.....yY.....', '...YYYYYY...', '...YYYYYY...'],
  rayo: ['......yyyy..', '.....yyyy...', '....yyyy....', '...yyyy.....', '..yyyyyyyy..', '.....yyyy...', '....yyyy....', '...yyy......', '..yyy.......', '.yy.........', 'y...........', '............'],
  regalo: ['...yy..yy...', '....yyyy....', 'rrrrryyrrrrr', 'rRRRRyyRRRRr', 'rrrrryyrrrrr', '.aAAAyyAAAa.', '.aAAAyyAAAa.', '.aAAAyyAAAa.', '.aAAAyyAAAa.', '.aAAAyyAAAa.', '.aaaayyaaaa.', '............'],
  mando: ['............', '............', '..kkkkkkkk..', '.kaaaaaaaak.', 'kaawaaaaraak', 'kawwwaarrrak', 'kaawaaaaraak', 'kaaaakkaaaak', 'kaaak..kaaak', '.kkk....kkk.', '............', '............'],
  carro: ['............', 'kk..........', '.k..........', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '..kwwwwwwk..', '..kwwwwwwk..', '..kkkkkkkk..', '..k.........', '..kkkkkkkk..', '..kk....kk..', '............'],
  escudo: ['.SSSSSSSSSS.', 'SssssssssssS', 'SseeeeeeeesS', 'SseeeeeewesS', 'SseeeeewweS.', 'SswweewweesS', 'SseewwweeesS', '.SseeweeesS.', '.SseeeeeesS.', '..SseeeesS..', '...SssssS...', '....SSSS....'],
  pregunta: ['...yyyyyy...', '..yyYYYYyy..', '..yy....yy..', '........yy..', '.......yy...', '......yy....', '.....yy.....', '.....yy.....', '............', '.....yy.....', '.....yy.....', '............'],
  moneda: ['....yyyy....', '..yyYYYYyy..', '.yYYyyyyYYy.', '.yYyyYYyyYy.', 'yYyyYyyYyyYy', 'yYyyyYYyyyYy', 'yYyyyyyYyyYy', 'yYyyYyyYyyYy', '.yYyyYYyyYy.', '.yYYyyyyYYy.', '..yyYYYYyy..', '....yyyy....'],
  banco: ['.....SS.....', '...SSssSS...', '.SSssssssSS.', 'SSSSSSSSSSSS', '.s..s..s..s.', '.s..s..s..s.', '.s..s..s..s.', '.s..s..s..s.', 'SSSSSSSSSSSS', 'ssssssssssss', '............', '............'],
  mpago: ['....llll....', '..llllllll..', '.llllllllll.', '.lwwllllwwl.', 'lwllwllwllwl', 'lllllwwlllll', 'llllllllllll', '.llllllllll.', '..llllllll..', '....llll....', '............', '............'],
  paypal: ['.AAAAAA.....', '.AaaaaaA....', '.Aa...aaA...', '.Aa...aaA...', '.AaaaaaA....', '.AaAAAA.....', '.Aa.........', '.Aa.........', '.AA.........', '............', '............', '............'],
  tarjeta: ['............', '............', '.kkkkkkkkkk.', 'kaaaaaaaaaak', 'kkkkkkkkkkkk', 'kaaaaaaaaaak', 'kayyaaaaaaak', 'kaaaaawwwwak', '.kkkkkkkkkk.', '............', '............', '............'],
  martillo: ['..SSSSSS....', '.SsssssS....', '.SsssssSS...', '..SSSSSSd...', '......dd....', '.....dd.....', '....dd......', '...dd.......', '..dd........', '.dd.........', 'dd..........', '............'],
  // banderas 12×9
  AR: ['LLLLLLLLLLLL', 'LLLLLLLLLLLL', 'LLLLLLLLLLLL', 'wwwwwwwwwwww', 'wwwwwyywwwww', 'wwwwwwwwwwww', 'LLLLLLLLLLLL', 'LLLLLLLLLLLL', 'LLLLLLLLLLLL'],
  UY: ['wwwwwaaaaaaa', 'wyyywwwwwwww', 'wyyywaaaaaaa', 'wwwwwwwwwwww', 'aaaaaaaaaaaa', 'wwwwwwwwwwww', 'aaaaaaaaaaaa', 'wwwwwwwwwwww', 'aaaaaaaaaaaa'],
  CL: ['AAAAwwwwwwww', 'AAAAwwwwwwww', 'AwwAwwwwwwww', 'AAAAwwwwwwww', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr'],
  MX: ['ggggwwwwrrrr', 'ggggwwwwrrrr', 'ggggwwwwrrrr', 'ggggwbbwrrrr', 'ggggwbbwrrrr', 'ggggwggwrrrr', 'ggggwwwwrrrr', 'ggggwwwwrrrr', 'ggggwwwwrrrr'],
  PE: ['rrrrwwwwrrrr', 'rrrrwwwwrrrr', 'rrrrwwwwrrrr', 'rrrrwwwwrrrr', 'rrrrwggwrrrr', 'rrrrwwwwrrrr', 'rrrrwwwwrrrr', 'rrrrwwwwrrrr', 'rrrrwwwwrrrr'],
  CO: ['yyyyyyyyyyyy', 'yyyyyyyyyyyy', 'yyyyyyyyyyyy', 'yyyyyyyyyyyy', 'AAAAAAAAAAAA', 'AAAAAAAAAAAA', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr'],
  ES: ['rrrrrrrrrrrr', 'rrrrrrrrrrrr', 'yyyyyyyyyyyy', 'yyrRyyyyyyyy', 'yyRryyyyyyyy', 'yyyyyyyyyyyy', 'yyyyyyyyyyyy', 'rrrrrrrrrrrr', 'rrrrrrrrrrrr'],
  OT: ['AAAAaaaaAAAA', 'AAaaggaaaaAA', 'AaaggggaaaaA', 'aaaaggaaggaa', 'aaaaaaagggaa', 'aaggaaaaggaa', 'AaggaaaaaaaA', 'AAaaaaaaaaAA', 'AAAAaaaaAAAA'],
};
function pintar(raiz = document) {
  $$('svg[data-pixel]:not([data-ok])', raiz).forEach(svg => {
    const filas = DIBUJOS[svg.dataset.pixel]; if (!filas) return;
    svg.setAttribute('viewBox', `0 0 ${filas[0].length} ${filas.length}`);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = filas.map((f, y) => [...f].map((ch, x) => PALETA[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${PALETA[ch]}"/>` : '').join('')).join('');
    svg.dataset.ok = 1;
  });
}
const px = (n, cls = '') => `<svg data-pixel="${n}"${cls ? ` class="${cls}"` : ''}></svg>`;

/* ======================= países y monedas ======================= */
// Cambio del día: open.er-api.com (USD base) y, para Argentina, dólar oficial de dolarapi.com. Si fallan, últimos valores conocidos.
const PAISES = [
  { cod: 'AR', nombre: 'Argentina', mon: 'ARS', sim: '$', dec: 0, red: 10, tasa: 1535, mp: true, transf: 'CVU / alias' },
  { cod: 'UY', nombre: 'Uruguay', mon: 'UYU', sim: '$', dec: 0, red: 1, tasa: 40.2, mp: true, transf: 'Transferencia bancaria' },
  { cod: 'CL', nombre: 'Chile', mon: 'CLP', sim: '$', dec: 0, red: 10, tasa: 982, mp: true, transf: 'Transferencia bancaria' },
  { cod: 'MX', nombre: 'México', mon: 'MXN', sim: '$', dec: 2, red: 0, tasa: 18.46, mp: true, transf: 'SPEI' },
  { cod: 'PE', nombre: 'Perú', mon: 'PEN', sim: 'S/', dec: 2, red: 0, tasa: 3.44, mp: true, transf: 'Transferencia / Yape' },
  { cod: 'CO', nombre: 'Colombia', mon: 'COP', sim: '$', dec: 0, red: 100, tasa: 3183, mp: true, transf: 'PSE / transferencia' },
  { cod: 'ES', nombre: 'España', mon: 'EUR', sim: '€', dec: 2, red: 0, tasa: 0.894, mp: false, transf: 'Bizum / transferencia' },
  { cod: 'OT', nombre: 'Otro país', mon: 'USD', sim: 'US$', dec: 2, red: 0, tasa: 1, mp: false, transf: null },
];
let pais = PAISES.find(p => p.cod === leer('pais', 'AR')) || PAISES[0];
const DESC = 0.10;
const local = usd => { const v = usd * pais.tasa; return pais.red ? Math.round(v / pais.red) * pais.red : Math.round(v * 100) / 100; };
const fmtN = (v, p = pais) => v.toLocaleString('es-AR', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec });
const fmt = (usd, p = pais) => { const v = (p === pais ? local(usd) : (p.red ? Math.round(usd * p.tasa / p.red) * p.red : Math.round(usd * p.tasa * 100) / 100)); return `${p.sim} ${fmtN(v, p)} ${p.mon}`; };
const conMP = usd => usd * (1 - DESC);
const lineaMP = usd => pais.mp
  ? `${px('mpago')} Con <b>Mercado Pago</b>: <b>${fmt(conMP(usd))}</b> (−10 %), al instante`
  : `${px('paypal')} Con <b>PayPal</b>: <b>${fmt(conMP(usd))}</b> (−10 %), al instante`;

function ponerPais(cod) {
  pais = PAISES.find(p => p.cod === cod) || PAISES[0]; guardar('pais', pais.cod);
  $('#sel-pais').value = pais.cod;
  $('#mar-moneda').textContent = pais.mon;
  renderPrecios();
}

/* ======================= estado ======================= */
let CAT = { ranks: [], games: [], sanciones: [] };
let carrito = leer('carrito', []);
const JUEGOS = [
  { n: 'BattleBox', i: 'espadas' }, { n: 'Survival Games', i: 'arco' }, { n: 'Party', i: 'fiesta' }, { n: 'Race', i: 'bandera' },
  { n: 'Spleef', i: 'pala' }, { n: 'SkyWars', i: 'isla' }, { n: 'Walls', i: 'muro' }, { n: 'Beep Test', i: 'reloj' },
];
const ORDEN = [['Votación', 'Vote', 'Los jugadores votan'], ['Aleatorio', 'Random', 'Sorpresa en cada ronda'], ['Orden propio', 'Own Order', 'Tú decides el orden']];
const ELECCION = [['Captains', 'Capitanes eligen'], ['Market', 'Mercado de jugadores'], ['Draft', 'Por turnos'], ['Double Market', 'Mercado doble'], ['Duos', 'Parejas'], ['Trios', 'Tríos']];
const TAMANOS = [8, 10, 12];
const cfg = { tipo: 0, juegos: [], orden: 0, eleccion: 0, tamano: 0, whitelist: false, bypass: [] };

/* ======================= datos en vivo ======================= */
const contar = (el, total) => {
  const t0 = performance.now();
  const paso = t => { const k = reducido ? 1 : Math.min(1, (t - t0) / 1200); el.textContent = Math.round(total * (1 - (1 - k) ** 3)).toLocaleString('es-AR'); if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
};
fetch('https://api.mcstatus.io/v2/status/java/' + IP).then(r => r.json()).then(d => {
  const on = d.online ? d.players.online : 0;
  $$('[data-vivo="jugadores"]').forEach(el => contar(el, on));
  if (d.players?.max) $$('[data-vivo="max"]').forEach(el => { el.textContent = d.players.max; });
}).catch(() => {});
fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json()).then(d => {
  if (!d.rates) return;
  PAISES.forEach(p => { if (p.cod !== 'AR' && d.rates[p.mon]) p.tasa = d.rates[p.mon]; });
  renderPrecios();
}).catch(() => {});
fetch('https://dolarapi.com/v1/dolares/oficial').then(r => r.json()).then(d => {
  if (d.venta > 0) { PAISES[0].tasa = d.venta; PAISES[0].fuente = `dólar oficial $ ${d.venta.toLocaleString('es-AR')} (dolarapi.com)`; renderPrecios(); }
}).catch(() => {});

/* ======================= confeti pixel ======================= */
const confeti = (() => {
  const lienzo = $('#confeti'), ctx = lienzo.getContext('2d');
  const COL = ['#00acfc', '#ff0116', '#ffd23f', '#01fb6d', '#ffffff'];
  let piezas = [];
  const nueva = (x, y, rafaga) => ({ x, y, vx: rafaga ? (Math.random() - 0.5) * 9 : (Math.random() - 0.5) * 0.4, vy: rafaga ? -4 - Math.random() * 7 : 0.35 + Math.random() * 0.7,
    t: 3 + Math.floor(Math.random() * 3), c: COL[Math.floor(Math.random() * COL.length)], o: Math.random() * 6.3, g: rafaga ? 0.22 : 0, vida: rafaga ? 140 : Infinity });
  const ajustar = () => {
    lienzo.width = innerWidth * devicePixelRatio; lienzo.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    piezas = piezas.filter(p => p.vida !== Infinity);
    const n = Math.round(innerWidth * innerHeight / 30000);
    for (let i = 0; i < n; i++) piezas.push(nueva(Math.random() * innerWidth, Math.random() * innerHeight, false));
  };
  const cuadro = ms => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of piezas) {
      p.vy += p.g; p.x += p.vx + (p.g ? 0 : Math.sin(ms / 900 + p.o) * 0.35); p.y += p.vy; p.vida--;
      if (p.vida === Infinity && p.y > innerHeight + 10) { p.y = -10; p.x = Math.random() * innerWidth; }
      ctx.globalAlpha = p.vida === Infinity ? 0.45 : Math.min(1, p.vida / 40);
      ctx.fillStyle = p.c;
      const w = Math.abs(Math.cos(ms / 300 + p.o)) * p.t + 1;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(w), p.t);
    }
    piezas = piezas.filter(p => p.vida > 0 && p.y < innerHeight + 40);
    requestAnimationFrame(cuadro);
  };
  if (!reducido) { ajustar(); addEventListener('resize', ajustar); requestAnimationFrame(cuadro); }
  return (x, y, n = 60) => { if (!reducido) for (let i = 0; i < n; i++) piezas.push(nueva(x, y, true)); };
})();
const estallar = el => { const r = el.getBoundingClientRect(); confeti(r.left + r.width / 2, r.top + r.height / 2); };

/* ======================= portada ======================= */
function prepararPortada() {
  const items = ['Temporada 10', ...JUEGOS.map(j => j.n), 'Torneos con 12 países', 'Java + Bedrock'];
  const icono = i => JUEGOS.find(j => j.n === i)?.i || (i.startsWith('Temporada') ? 'trofeo' : i.startsWith('Torneos') ? 'bandera' : 'mando');
  const una = items.map(t => `<span>${px(icono(t))}${esc(t)}</span>`).join('');
  $('#cinta').innerHTML = una + una;
  $('#btn-ip').addEventListener('click', () => {
    navigator.clipboard?.writeText(IP).catch(() => {});
    $('#ip-txt').textContent = '¡Copiada!'; estallar($('#btn-ip'));
    setTimeout(() => { $('#ip-txt').textContent = 'Copiar IP'; }, 1800);
  });
}

/* ======================= oferta semanal ======================= */
const OFERTA = { key: 'oferta', nombre: 'Oferta semanal: 2 Rank Jolly+', detalle: 'Para ti o para un amigo · 1 mes', precio: 10.49, antes: 20.98, img: CDN_OFERTA };
function proximoMartes() {
  // Martes 00:00 en Argentina (UTC−3) = martes 03:00 UTC
  const ahora = new Date(); const t = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate(), 3));
  while (t.getUTCDay() !== 2 || t <= ahora) t.setUTCDate(t.getUTCDate() + 1);
  return t;
}
function arrancarCuenta() {
  const fin = proximoMartes();
  const dos = n => String(n).padStart(2, '0');
  const tic = () => {
    let s = Math.max(0, Math.floor((fin - Date.now()) / 1000));
    $('#c-d').textContent = Math.floor(s / 86400); s %= 86400;
    $('#c-h').textContent = dos(Math.floor(s / 3600)); s %= 3600;
    $('#c-m').textContent = dos(Math.floor(s / 60)); $('#c-s').textContent = dos(s % 60);
  };
  tic(); setInterval(tic, 1000);
  $('#btn-oferta').addEventListener('click', e => { anadir({ ...OFERTA }, e.currentTarget); abrirCheckout(); });
}

/* ======================= configurador ======================= */
const partidas = () => CAT.games; // [4,5,6,7,8 games, privada]
const tipoActual = () => partidas()[cfg.tipo];
const esPrivada = () => /privada/i.test(tipoActual()?.nombre || '');
const nJuegos = () => { const m = (tipoActual()?.nombre || '').match(/\[(\d+)/); return m ? +m[1] : null; };
const maxBypass = () => esPrivada() ? 8 : (/Duos|Trios/.test(ELECCION[cfg.eleccion][0]) ? 1 : 5);

function prepararConfig() {
  $('#tipos').innerHTML = partidas().map((p, i) => {
    const priv = /privada/i.test(p.nombre);
    return `<button class="op${priv ? ' privada' : ''}" data-tipo="${i}"><b>${priv ? 'Privada' : p.nombre.match(/\[(\d+)/)[1] + ' juegos'}</b><small>${priv ? 'Sin ELO ni estadísticas · invitas a quien quieras' : 'ELO y estadísticas activados'}</small><span class="pr" data-usd="${p.precio}"></span></button>`;
  }).join('');
  $('#juegos').innerHTML = JUEGOS.map((j, i) => `<button class="juego" data-juego="${i}" aria-pressed="false">${px(j.i)}<span>${esc(j.n)}</span></button>`).join('');
  $('#orden').innerHTML = ORDEN.map((o, i) => `<button class="op" data-orden="${i}">${o[0]}<small>${o[1]} · ${o[2]}</small></button>`).join('');
  $('#eleccion').innerHTML = ELECCION.map((o, i) => `<button class="op" data-eleccion="${i}">${o[0]}<small>${o[1]}</small></button>`).join('');
  $('#tamano').innerHTML = TAMANOS.map((t, i) => `<button class="op" data-tamano="${i}">${t} equipos</button>`).join('');
  pintar($('#partida'));

  $('#tipos').addEventListener('click', e => { const b = e.target.closest('[data-tipo]'); if (!b) return; cfg.tipo = +b.dataset.tipo; const n = nJuegos(); if (n && cfg.juegos.length > n) cfg.juegos.length = n; renderConfig(); });
  $('#juegos').addEventListener('click', e => {
    const b = e.target.closest('[data-juego]'); if (!b) return; const i = +b.dataset.juego; const pos = cfg.juegos.indexOf(i);
    if (pos >= 0) cfg.juegos.splice(pos, 1);
    else if (nJuegos() && cfg.juegos.length >= nJuegos()) { b.classList.remove('sacude'); void b.offsetWidth; b.classList.add('sacude'); toast(`Esta partida es de ${nJuegos()} juegos. Quita uno o elige otra.`); return; }
    else cfg.juegos.push(i);
    renderConfig();
  });
  $('#orden').addEventListener('click', e => { const b = e.target.closest('[data-orden]'); if (b) { cfg.orden = +b.dataset.orden; renderConfig(); } });
  $('#eleccion').addEventListener('click', e => { const b = e.target.closest('[data-eleccion]'); if (b) { cfg.eleccion = +b.dataset.eleccion; renderConfig(); } });
  $('#tamano').addEventListener('click', e => { const b = e.target.closest('[data-tamano]'); if (b) { cfg.tamano = +b.dataset.tamano; renderConfig(); } });
  $('#whitelist').addEventListener('change', e => { cfg.whitelist = e.target.checked; renderConfig(); });
  $('#lista-orden').addEventListener('click', e => {
    const b = e.target.closest('[data-mover]'); if (!b) return;
    const [i, d] = b.dataset.mover.split(',').map(Number); const j = i + d;
    if (j < 0 || j >= cfg.juegos.length) return;
    [cfg.juegos[i], cfg.juegos[j]] = [cfg.juegos[j], cfg.juegos[i]]; renderConfig();
  });
  $('#bypass').addEventListener('input', e => {
    const inp = e.target.closest('input'); if (!inp) return;
    inp.value = inp.value.replace(/[^\w.]/g, '').slice(0, 16);
    cfg.bypass[+inp.dataset.i] = inp.value;
    const im = inp.previousElementSibling; clearTimeout(inp._t);
    inp._t = setTimeout(() => { im.src = `https://mc-heads.net/avatar/${encodeURIComponent(inp.value || 'MHF_Steve')}/24`; }, 400);
    renderResumen();
  });
  $('#btn-partida').addEventListener('click', e => {
    const falta = faltaConfig(); if (falta) { toast(falta); return; }
    const t = tipoActual();
    const juegos = cfg.juegos.map(i => JUEGOS[i].n);
    const detalle = [juegos.join(', '), ORDEN[cfg.orden][0], ELECCION[cfg.eleccion][0], `${TAMANOS[cfg.tamano]} equipos`, cfg.whitelist ? 'whitelist en la purga' : ''].filter(Boolean).join(' · ');
    anadir({ key: 'partida-' + Date.now(), nombre: t.nombre.replace('Partida [', 'Partida de ').replace(' Games]', ' juegos'), detalle, precio: t.precio, pixel: 'mando' }, e.currentTarget);
    abrirCheckout();
  });
  renderConfig();
}
function faltaConfig() {
  const n = nJuegos();
  if (n && cfg.juegos.length !== n) return `Te faltan ${n - cfg.juegos.length} juego${n - cfg.juegos.length === 1 ? '' : 's'} por elegir.`;
  if (!n && cfg.juegos.length === 0) return 'Elige al menos un juego.';
  return '';
}
function renderConfig() {
  const n = nJuegos();
  $$('#tipos [data-tipo]').forEach(b => b.classList.toggle('on', +b.dataset.tipo === cfg.tipo));
  $$('#orden [data-orden]').forEach(b => b.classList.toggle('on', +b.dataset.orden === cfg.orden));
  $$('#eleccion [data-eleccion]').forEach(b => b.classList.toggle('on', +b.dataset.eleccion === cfg.eleccion));
  $$('#tamano [data-tamano]').forEach(b => b.classList.toggle('on', +b.dataset.tamano === cfg.tamano));
  $$('#juegos [data-juego]').forEach(b => {
    const pos = cfg.juegos.indexOf(+b.dataset.juego);
    b.classList.toggle('on', pos >= 0); b.setAttribute('aria-pressed', pos >= 0);
    b.dataset.pos = cfg.orden === 2 ? pos + 1 : '✓';
    b.classList.toggle('bloqueado', pos < 0 && n && cfg.juegos.length >= n);
  });
  const c = $('#contador-juegos');
  c.textContent = `${cfg.juegos.length}/${n || 8}`; c.classList.toggle('ok', n ? cfg.juegos.length === n : cfg.juegos.length > 0);
  $('#ayuda-juegos').textContent = n ? `Elige ${n} de los 8 juegos.` : 'En la privada activas los juegos que quieras.';
  const lo = $('#lista-orden');
  lo.classList.toggle('oculto', cfg.orden !== 2 || cfg.juegos.length < 2);
  lo.innerHTML = cfg.juegos.map((g, i) => `<li>${px(JUEGOS[g].i)}<span>${esc(JUEGOS[g].n)}</span><button data-mover="${i},-1" aria-label="Subir">▲</button><button data-mover="${i},1" aria-label="Bajar">▼</button></li>`).join('');
  pintar(lo);
  // bypass / invitados
  const mb = maxBypass();
  $('#tit-bypass').textContent = esPrivada() ? 'Invitados' : 'Bypass para tus amigos';
  $('#ayuda-bypass').textContent = esPrivada() ? 'En la privada juegan las personas que tú elijas. Escribe sus nombres de Minecraft.' : (mb === 1 ? 'En duos/trios, 1 jugador entra seguro con bypass.' : 'Hasta 5 jugadores entran seguro con bypass (1 en duos/trios).');
  const caja = $('#bypass');
  if (caja.children.length !== mb) {
    cfg.bypass.length = Math.min(cfg.bypass.length, mb);
    caja.innerHTML = Array.from({ length: mb }, (_, i) => `<label><img src="https://mc-heads.net/avatar/${encodeURIComponent(cfg.bypass[i] || 'MHF_Steve')}/24" alt=""><input data-i="${i}" maxlength="16" placeholder="Jugador ${i + 1}" value="${esc(cfg.bypass[i] || '')}" autocomplete="off" spellcheck="false"></label>`).join('');
  }
  renderResumen();
}
function renderResumen() {
  const t = tipoActual(); if (!t) return;
  const amigos = cfg.bypass.filter(Boolean);
  $('#resumen-cuerpo').innerHTML = `
    <div class="fila"><span>Tipo</span><b>${esPrivada() ? 'Partida privada' : nJuegos() + ' juegos'}</b></div>
    <div class="fila"><span>Juegos</span><b>${cfg.juegos.length || '—'}</b></div>
    ${cfg.juegos.length ? `<div class="iconos">${cfg.juegos.map(i => px(JUEGOS[i].i)).join('')}</div>` : ''}
    <div class="fila"><span>Orden</span><b>${ORDEN[cfg.orden][0]}</b></div>
    <div class="fila"><span>Equipos</span><b>${ELECCION[cfg.eleccion][0]} · ${TAMANOS[cfg.tamano]}</b></div>
    <div class="fila"><span>Whitelist en la purga</span><b>${cfg.whitelist ? 'Sí' : 'No'}</b></div>
    <div class="fila"><span>${esPrivada() ? 'Invitados' : 'Bypass'}</span><b>${amigos.length ? amigos.map(esc).join(', ') : '—'}</b></div>
    <div class="fila"><span>ELO y estadísticas</span><b class="${esPrivada() ? 'rojo' : 'verde'}">${esPrivada() ? 'Desactivados' : 'Activados'}</b></div>`;
  pintar($('#resumen-cuerpo'));
  $('#resumen-precio').textContent = fmt(t.precio);
  $('#resumen-mp').innerHTML = lineaMP(t.precio); pintar($('#resumen-mp'));
  const falta = faltaConfig();
  $('#resumen-falta').textContent = falta || 'Al pagar, el servidor crea la partida con esta configuración.';
}

/* ======================= rangos y sanciones ======================= */
const NOMBRE_RANGO = n => n.replace('Rank Gold', 'Rank Jolly Gold').replace('Rank ', '').replace(' [Monthly]', '').replace(' [Permanent]', '');
function prepararRangos() {
  const orden = ['6831337', '6954080', '7469899'].map(id => CAT.ranks.find(r => String(r.id) === id)).filter(Boolean);
  $('#lista-rangos').innerHTML = orden.map(r => {
    const nom = NOMBRE_RANGO(r.nombre); const mensual = /Monthly/.test(r.nombre);
    const cls = /Gold/.test(nom) ? 'gold' : /\+/.test(nom) ? 'plus' : '';
    const sello = /Gold/.test(nom) ? '1 partida personalizada al día' : /\+/.test(nom) ? 'x2 en la oferta de esta semana' : '';
    const v = r.ventajas;
    return `<article class="bloque rango ${cls} revelar">
      ${sello ? `<span class="sello">${sello}</span>` : ''}
      <div class="cab"><img src="${img(r.img, 160)}" alt="" width="72" height="72" loading="lazy"><div><h3 class="pixel">${esc(nom)}</h3><span class="tipo">${mensual ? 'Mensual' : 'Permanente'}</span></div></div>
      <div class="precio"><b data-usd="${r.precio}"></b><small>${mensual ? '/ mes' : 'pago único'}</small></div>
      <p class="mp-linea" data-mp="${r.precio}"></p>
      <ul>${v.map((x, i) => `<li${i >= 6 ? ' class="oculto extra"' : ''}><i>${x[0]}</i><span>${esc(x[1])}</span></li>`).join('')}</ul>
      ${v.length > 6 ? `<button class="mas">Ver las ${v.length} ventajas ▾</button>` : ''}
      <button class="btn ${cls === 'gold' ? 'amarillo' : cls === 'plus' ? 'azul' : 'rojo'} full" data-comprar="${r.id}">${px('carro')} ${mensual ? 'Suscribirme' : 'Comprar'}</button>
    </article>`;
  }).join('');
  $('#lista-sanciones').innerHTML = CAT.sanciones.map(s => `<article class="bloque sancion revelar">
      <img src="${img(s.img, 128)}" alt="" width="64" height="64" loading="lazy">
      <h3 class="pixel">${esc(s.nombre.replace('Statistics Reset', 'Reinicio de estadísticas'))}</h3>
      <p>${esc(s.ventajas[0]?.[1] || '')}</p>
      <b data-usd="${s.precio}"></b>
      <button class="btn sm gris full" data-comprar="${s.id}">${px('martillo')} Pagar</button>
    </article>`).join('');
  pintar($('#rangos')); pintar($('#sanciones'));
  $('#lista-rangos').addEventListener('click', e => {
    const m = e.target.closest('.mas'); if (!m) return;
    const art = m.closest('.rango'); const abierto = art.classList.toggle('abierto');
    $$('.extra', art).forEach(li => li.classList.toggle('oculto', !abierto));
    m.textContent = abierto ? 'Ver menos ▴' : `Ver las ${$$('li', art).length} ventajas ▾`;
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-comprar]'); if (!b) return;
    const p = [...CAT.ranks, ...CAT.sanciones].find(x => String(x.id) === b.dataset.comprar);
    const mensual = /Monthly/.test(p.nombre);
    anadir({ key: 'p' + p.id, nombre: p.nombre.includes('Rank') ? 'Rango ' + NOMBRE_RANGO(p.nombre) : p.nombre.replace('Statistics Reset', 'Reinicio de estadísticas'), detalle: mensual ? 'Suscripción mensual' : (p.nombre.includes('Rank') ? 'Permanente' : 'Sanción'), precio: p.precio, img: p.img }, b);
    abrirCheckout();
  });
}

/* ======================= países y métodos ======================= */
function prepararPaises() {
  $('#sel-pais').innerHTML = PAISES.map(p => `<option value="${p.cod}">${p.cod === 'OT' ? '🌎' : p.cod} · ${p.mon}</option>`).join('');
  $('#sel-pais').addEventListener('change', e => ponerPais(e.target.value));
  $('#paises').addEventListener('click', e => { const b = e.target.closest('[data-pais]'); if (b) { ponerPais(b.dataset.pais); estallar(b); } });
}
function renderPaises() {
  const ref = 10.49; // Rank Jolly+ mensual
  $('#paises').innerHTML = PAISES.map(p => `<button class="pais${p === pais ? ' on' : ''}" data-pais="${p.cod}">
      <span class="cod">${px(p.cod)} ${esc(p.nombre)}</span>
      <span class="ej">${fmt(conMP(ref), p)}</span>
      <small>Jolly+ con ${p.mp ? 'Mercado Pago' : 'PayPal'} (−10 %)</small>
    </button>`).join('');
  pintar($('#paises'));
  $('#metodos-info').innerHTML = `
    <div class="bloque metodo mp-card${pais.mp ? '' : ' no'}"><div class="mt">${px('mpago')} Mercado Pago</div><span class="tag">AUTOMÁTICO · −10 %</span><p>${pais.mp ? `Pagas en ${pais.mon} con saldo, tarjeta o efectivo. Se aprueba y el juego te lo entrega solo.` : `Mercado Pago no opera en ${esc(pais.nombre)}. Usa PayPal (también −10 %) o tarjeta.`}</p></div>
    <div class="bloque metodo${pais.transf ? '' : ' no'}"><div class="mt">${px('banco')} Transferencia</div><span class="tag">AUTOMÁTICO</span><p>${pais.transf ? `${esc(pais.transf)} con datos y referencia únicos por pedido. Al acreditarse se entrega sola, sin mandar comprobantes.` : 'Disponible en los países de la lista.'}</p></div>
    <div class="bloque metodo"><div class="mt">${px('paypal')} PayPal</div><span class="tag">−10 %</span><p>En dólares desde cualquier país, con el mismo descuento que hoy prometen en Discord.</p></div>
    <div class="bloque metodo"><div class="mt">${px('tarjeta')} Tarjeta</div><span class="tag gris">VÍA TEBEX</span><p>Débito o crédito con el checkout de Tebex de siempre.</p></div>`;
  pintar($('#metodos-info'));
}

/* ======================= precios (todo lo que depende de la moneda) ======================= */
function renderPrecios() {
  $$('[data-usd]').forEach(el => { el.textContent = fmt(+el.dataset.usd); });
  $$('[data-mp]').forEach(el => { el.innerHTML = lineaMP(+el.dataset.mp); pintar(el); });
  $('#oferta-antes').textContent = fmt(OFERTA.antes);
  $('#oferta-precio').textContent = fmt(OFERTA.precio);
  $('#oferta-mp').innerHTML = lineaMP(OFERTA.precio); pintar($('#oferta-mp'));
  renderPaises();
  if (CAT.games.length) renderResumen();
  if ($('#checkout').classList.contains('on') && ck.fase === 'carrito') renderCheckout();
}

/* ======================= carrito ======================= */
function anadir(item, origen) {
  if (!item.key.startsWith('partida') && carrito.some(c => c.key === item.key)) { toast('Ya está en el carrito'); return; }
  carrito.push(item); guardar('carrito', carrito); pintarNum();
  const b = $('#btn-carrito'); b.classList.remove('salta'); void b.offsetWidth; b.classList.add('salta');
  if (origen) estallar(origen);
}
const pintarNum = () => { $('#num-carrito').textContent = carrito.length; };
const subtotal = () => carrito.reduce((s, c) => s + c.precio, 0);

/* ======================= checkout ======================= */
const ck = { fase: 'carrito', edicion: leer('edicion', 'java'), usuario: leer('usuario', ''), metodo: null };
const metodosDisp = () => [
  { id: 'mp', n: 'Mercado Pago', s: 'Automático', i: 'mpago', d: true, ok: pais.mp },
  { id: 'transf', n: 'Transferencia', s: pais.transf || 'No disponible', i: 'banco', d: false, ok: !!pais.transf },
  { id: 'paypal', n: 'PayPal', s: 'En USD', i: 'paypal', d: true, ok: true },
  { id: 'tarjeta', n: 'Tarjeta', s: 'Vía Tebex', i: 'tarjeta', d: false, ok: true },
];
function abrirCheckout() {
  ck.fase = 'carrito';
  if (!ck.metodo || !metodosDisp().find(m => m.id === ck.metodo)?.ok) ck.metodo = pais.mp ? 'mp' : 'paypal';
  renderCheckout();
  $('#checkout').classList.add('on'); $('#checkout').setAttribute('aria-hidden', 'false'); $('#capa').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function cerrarCheckout() {
  $('#checkout').classList.remove('on'); $('#checkout').setAttribute('aria-hidden', 'true'); $('#capa').classList.remove('on');
  document.body.style.overflow = '';
  if (ck.fase === 'hecho') { carrito = []; guardar('carrito', carrito); pintarNum(); }
  ck.fase = 'carrito';
}
const avatar = () => ck.edicion === 'java' && ck.usuario ? `https://mc-heads.net/avatar/${encodeURIComponent(ck.usuario)}/32` : 'https://mc-heads.net/avatar/MHF_Steve/32';
const nombreJuego = () => (ck.edicion === 'bedrock' ? '.' : '') + (ck.usuario || 'TuNombre');
const conDescuento = () => ['mp', 'paypal'].includes(ck.metodo);
function totales() {
  const sub = subtotal(); const des = conDescuento() ? sub * DESC : 0;
  const enUSD = ck.metodo === 'paypal' || ck.metodo === 'tarjeta';
  return { sub, des, tot: sub - des, enUSD };
}
function renderCheckout() {
  const cuerpo = $('#checkout-cuerpo');
  if (ck.fase !== 'carrito') return;
  if (!carrito.length) {
    cuerpo.innerHTML = `<div class="vacio">${px('carro')}<p>Tu carrito está vacío.</p><a class="btn sm" href="#partida" data-cerrar>Armar una partida</a></div>`;
    pintar(cuerpo); return;
  }
  const t = totales();
  const usdFmt = n => `US$ ${n.toFixed(2)}`;
  const precioLinea = n => t.enUSD ? usdFmt(n) : fmt(n);
  const ms = metodosDisp();
  cuerpo.innerHTML = `
    <div><div class="ck-tit"><span class="n">1</span> Tu pedido</div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:8px">${carrito.map((c, i) => `<div class="linea">${c.img ? `<img src="${img(c.img, 96)}" alt="">` : px(c.pixel || 'regalo')}<div><b>${esc(c.nombre)}</b><small title="${esc(c.detalle)}">${esc(c.detalle)}</small></div><span class="pr">${precioLinea(c.precio)}</span><button class="quitar" data-quitar="${i}" aria-label="Quitar">✕</button></div>`).join('')}</div>
    </div>
    <div class="cuenta-mc"><div class="ck-tit"><span class="n">2</span> ¿A qué cuenta va?</div>
      <div class="edicion" role="group" aria-label="Edición"><button data-edicion="java" class="${ck.edicion === 'java' ? 'on' : ''}">Java</button><button data-edicion="bedrock" class="${ck.edicion === 'bedrock' ? 'on' : ''}">Bedrock</button></div>
      <label class="campo-usuario"><img id="ck-avatar" src="${avatar()}" alt=""><input id="ck-usuario" maxlength="16" placeholder="Tu usuario de Minecraft" value="${esc(ck.usuario)}" autocomplete="off" spellcheck="false"></label>
      <small class="aviso-ck">${ck.edicion === 'bedrock' ? 'En Bedrock el servidor te ve como <b>' + esc(nombreJuego()) + '</b> <span class="ejemplo">ejemplo</span>' : 'Lo recibirás en esta cuenta aunque estés desconectado.'}</small>
    </div>
    <div><div class="ck-tit"><span class="n">3</span> País y método</div>
      <label class="pais-sel" style="display:block;margin-bottom:10px"><span class="sr">País</span><select id="ck-pais" style="width:100%">${PAISES.map(p => `<option value="${p.cod}"${p === pais ? ' selected' : ''}>${esc(p.nombre)} · ${p.mon}</option>`).join('')}</select></label>
      <div class="metodos-ck">${ms.map(m => `<button class="op${m.id === 'mp' ? ' mpop' : ''}${ck.metodo === m.id ? ' on' : ''}" data-metodo="${m.id}"${m.ok ? '' : ' disabled'}><span style="display:flex;gap:8px;align-items:center">${px(m.i)} ${m.n}</span><small>${esc(m.s)}</small>${m.d ? '<span class="d">−10 %</span>' : ''}</button>`).join('')}</div>
      ${!pais.mp ? `<p class="aviso-ck" style="margin-top:8px">Mercado Pago no opera en ${esc(pais.nombre)}. PayPal mantiene el −10 %.</p>` : ''}
    </div>
    <div class="totales">
      <div><span>Subtotal</span><span>${t.enUSD ? usdFmt(t.sub) : fmt(t.sub)}</span></div>
      ${t.des ? `<div class="desc"><span>Descuento ${ck.metodo === 'mp' ? 'Mercado Pago' : 'PayPal'} −10 %</span><span>−${t.enUSD ? usdFmt(t.des) : fmt(t.des)}</span></div>` : ''}
      <div class="tot"><span>Total</span><b>${t.enUSD ? usdFmt(t.tot) : fmt(t.tot)}</b></div>
      <small>${t.enUSD ? `≈ ${fmt(t.tot)} al cambio de hoy` : `≈ US$ ${t.tot.toFixed(2)} · ${pais.fuente || 'cambio del día (open.er-api.com)'}`}</small>
    </div>
    <button class="btn ${ck.metodo === 'mp' ? 'mpbtn' : 'amarillo'} full" id="ck-pagar">${px(ms.find(m => m.id === ck.metodo).i)} ${ck.metodo === 'mp' ? 'Pagar con Mercado Pago' : ck.metodo === 'transf' ? 'Ver datos para transferir' : ck.metodo === 'paypal' ? 'Pagar con PayPal' : 'Pagar con tarjeta'}</button>
    <p class="aviso-ck centro">Simulación: no se cobra nada. Así sería el flujo real, sin abrir ticket.</p>`;
  pintar(cuerpo);
}
function prepararCheckout() {
  $('#btn-carrito').addEventListener('click', abrirCheckout);
  $('#capa').addEventListener('click', cerrarCheckout);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#checkout').classList.contains('on')) cerrarCheckout(); });
  const cuerpo = $('#checkout-cuerpo');
  $('#checkout').addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrarCheckout(); return; }
    const q = e.target.closest('[data-quitar]'); if (q) { carrito.splice(+q.dataset.quitar, 1); guardar('carrito', carrito); pintarNum(); renderCheckout(); return; }
    const ed = e.target.closest('[data-edicion]'); if (ed) { ck.edicion = ed.dataset.edicion; guardar('edicion', ck.edicion); renderCheckout(); return; }
    const m = e.target.closest('[data-metodo]'); if (m && !m.disabled) { ck.metodo = m.dataset.metodo; renderCheckout(); return; }
    if (e.target.closest('#ck-pagar')) { pagar(); return; }
    if (e.target.closest('#mp-pagar')) { e.target.closest('#mp-pagar').disabled = true; entregar('Pago aprobado en Mercado Pago'); return; }
    if (e.target.closest('#transf-ok')) { e.target.closest('#transf-ok').disabled = true; entregar('Transferencia acreditada'); return; }
    if (e.target.closest('#ext-ok')) { e.target.closest('#ext-ok').disabled = true; entregar(ck.metodo === 'paypal' ? 'Pago aprobado en PayPal' : 'Pago con tarjeta aprobado'); return; }
    if (e.target.closest('#ck-volver')) { ck.fase = 'carrito'; renderCheckout(); }
  });
  cuerpo.addEventListener('input', e => {
    if (e.target.id !== 'ck-usuario') return;
    e.target.value = e.target.value.replace(/[^\w]/g, '').slice(0, 16);
    ck.usuario = e.target.value; guardar('usuario', ck.usuario);
    clearTimeout(e.target._t); e.target._t = setTimeout(() => { $('#ck-avatar').src = avatar(); }, 400);
  });
  cuerpo.addEventListener('change', e => { if (e.target.id === 'ck-pais') { ponerPais(e.target.value); if (!metodosDisp().find(m => m.id === ck.metodo).ok || ck.metodo === 'paypal') ck.metodo = pais.mp ? 'mp' : 'paypal'; renderCheckout(); } });
}
function pagar() {
  if (!/^\w{3,16}$/.test(ck.usuario)) { toast('Escribe tu usuario de Minecraft (3 a 16 caracteres)'); $('#ck-usuario')?.focus(); return; }
  const t = totales(); const cuerpo = $('#checkout-cuerpo'); ck.fase = 'pago';
  const total = t.enUSD ? `US$ ${t.tot.toFixed(2)}` : fmt(t.tot);
  const ref = 'JG-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  let html = '';
  if (ck.metodo === 'mp') html = `<div class="mp-caja"><div class="mp-cab">mercado pago <small>simulación</small></div><div class="mp-body">
      <span style="font-size:.85rem;color:#666">Jolly Games · pedido ${ref}</span><span class="mp-monto">${total}</span>
      <div class="mp-op"><span>Dinero disponible</span><b>✓</b></div><div class="mp-op"><span>Tarjeta de débito o crédito</span><span>›</span></div>
      <button class="mp-pagar" id="mp-pagar">Pagar</button><span class="mp-nota">Incluye el 10 % de descuento por pagar con Mercado Pago</span></div></div>`;
  else if (ck.metodo === 'transf') html = `<div class="transf"><b>${esc(pais.transf)}</b>
      <div class="fila"><span>${pais.cod === 'AR' ? 'Alias' : 'Titular'}</span><code>${pais.cod === 'AR' ? 'jollygames.tienda' : 'Jolly Games'}</code></div>
      <div class="fila"><span>Referencia</span><code>${ref}</code></div><div class="fila"><span>Importe exacto</span><code>${total}</code></div>
      <small class="muted">Datos de <span class="ejemplo">ejemplo</span>. La referencia une la transferencia con tu pedido: al acreditarse, se entrega solo.</small>
      <button class="btn full" id="transf-ok">Simular aviso del banco</button></div>`;
  else html = `<div class="transf"><b>${ck.metodo === 'paypal' ? 'PayPal' : 'Checkout de Tebex'}</b><p class="muted">Aquí se abriría ${ck.metodo === 'paypal' ? 'PayPal' : 'el pago con tarjeta de Tebex'} por ${total}.</p><button class="btn full" id="ext-ok">Simular pago aprobado</button></div>`;
  cuerpo.innerHTML = `<div class="sim">
    <div class="linea"><img src="${avatar()}" alt=""><div><b>${esc(nombreJuego())}</b><small>${ck.edicion === 'java' ? 'Java' : 'Bedrock'} · ${carrito.length} producto${carrito.length > 1 ? 's' : ''}</small></div><span class="pr">${total}</span></div>
    ${html}
    <ul class="estados" id="estados">
      <li data-e="0"><span class="ic">1</span>Pago confirmado<small></small></li>
      <li data-e="1"><span class="ic">2</span>Pedido registrado en Tebex<small></small></li>
      <li data-e="2"><span class="ic">3</span>Entregado en el servidor<small></small></li>
    </ul>
    <button class="btn sm gris" id="ck-volver">← Cambiar método</button>
  </div>`;
  pintar(cuerpo);
}
function entregar(textoPago) {
  const t0 = performance.now(); const vol = $('#ck-volver'); if (vol) vol.remove();
  const lis = $$('#estados li'); lis[0].childNodes[1].textContent = textoPago;
  const paso = (i, ms) => setTimeout(() => {
    lis[i].classList.remove('activo'); lis[i].classList.add('hecho'); lis[i].querySelector('.ic').textContent = '✓';
    lis[i].querySelector('small').textContent = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s';
    if (lis[i + 1]) lis[i + 1].classList.add('activo');
    if (i === 2) fin();
  }, reducido ? 0 : ms);
  lis[0].classList.add('activo');
  paso(0, 700); paso(1, 1500); paso(2, 2400);
  const fin = () => {
    ck.fase = 'hecho';
    const seg = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',');
    const nom = esc(nombreJuego());
    const lineas = [`<span class="c-g">[Tienda]</span> <span class="c-y">Pago recibido de ${nom}.</span>`,
      ...carrito.map(c => `<span class="c-a">[Jolly Games]</span> ${nom} recibió <span class="c-o">${esc(c.nombre)}</span>`),
      carrito.some(c => c.key.startsWith('partida')) ? `<span class="c-v">» Partida creada. ¡Prepárate, ${nom}!</span>` : `<span class="c-v">» ¡Gracias por apoyar a Jolly Games!</span>`];
    const sim = $('.sim'); sim.querySelector('.mp-caja, .transf')?.remove();
    sim.insertAdjacentHTML('afterbegin', `<div class="exito"><span class="grande">¡Listo para jugar!</span><span class="tiempo">Entregado en ${seg} s · sin ticket</span></div>`);
    sim.insertAdjacentHTML('beforeend', `<div class="chat-mc" id="chat">${lineas.map(l => `<p>${l}</p>`).join('')}</div>
      <p class="aviso-ck">Hoy la tienda avisa de que las compras tardan “de 5 a 20 minutos”, y las de Mercado Pago pasan por un ticket.</p>
      <button class="btn amarillo full" data-cerrar>Volver a la tienda</button>`);
    $$('#chat p').forEach((p, i) => setTimeout(() => p.classList.add('on'), reducido ? 0 : 250 * i));
    const r = $('#checkout').getBoundingClientRect(); confeti(r.left + r.width / 2, 120, 120);
  };
}

/* ======================= reveal ======================= */
function revelar() {
  if (reducido || !('IntersectionObserver' in window)) { $$('.revelar').forEach(e => e.classList.add('visible')); return; }
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('.revelar:not(.visible)').forEach(e => obs.observe(e));
}
function navActiva() {
  const links = $$('.enlaces a'); if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  ['oferta', 'partida', 'rangos', 'sanciones', 'pagar'].forEach(id => obs.observe(document.getElementById(id)));
}

/* ======================= arranque ======================= */
pintar();
prepararPortada();
prepararPaises();
prepararCheckout();
arrancarCuenta();
$$('[data-img]').forEach(el => { el.src = img(el.dataset.img, 300); });
pintarNum();
ponerPais(pais.cod);
navActiva();
revelar();
fetch('data/catalogo.json?v=2').then(r => r.json()).then(d => {
  CAT = d;
  prepararConfig(); prepararRangos(); renderPrecios(); revelar();
}).catch(() => toast('No se pudo cargar el catálogo'));
