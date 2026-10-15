/* Minemora Network · maqueta de web completa (Maikel Ferrer) */
const IP = 'mc.minemora.net';
const INVITACION = '7srsBDWqM9';
const CDN = 'dunb17ur4ymx4.cloudfront.net/packages/images/';
const FIN_HALLOWEEN = new Date('2026-11-02T00:00:00-04:00'); // fecha de ejemplo
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const guardar = (k, v) => { try { localStorage.setItem('minemora-' + k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { const v = localStorage.getItem('minemora-' + k); return v ? JSON.parse(v) : d; } catch { return d; } };

/* ======================= moneda: USD y bolívares ======================= */
// Tasa oficial (BCV) del día desde ve.dolarapi.com; si no responde se usa una tasa de ejemplo y se avisa.
let tasa = 877.90, tasaEjemplo = true, tasaFecha = '';
let moneda = leer('moneda', 'USD');
const bs = n => 'Bs. ' + ((n ?? 0) * tasa).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd = n => (n ?? 0).toFixed(2) + ' USD';
const precio = n => moneda === 'VES' ? bs(n) : usd(n);
const precioAlt = n => moneda === 'VES' ? usd(n) : bs(n);
const precioCorto = n => moneda === 'VES' ? `<small>Bs.</small> ${((n ?? 0) * tasa).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${(n ?? 0).toFixed(2)} <small>USD</small>`;
const textoTasa = () => `Bs. ${tasa.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function ponerMoneda(m) {
  moneda = m; guardar('moneda', m);
  $$('[data-moneda]').forEach(b => b.classList.toggle('on', b.dataset.moneda === m));
  pintarCarrito();
  if (CATALOGO.length) render(true);
}

/* ======================= contenido fijo ======================= */
const MODALIDADES = [
  { id: 'survival', nombre: 'Survival', icono: 'bloque', c: '#55ff55', tag: 'Halloween', tienda: 'survival',
    texto: 'Survival con historia: misiones, NPCs del pueblo, dioses y calabozos. Proteges tu terreno con claimblocks y ganas moras jugando.',
    puntos: ['Misiones y NPCs del pueblo', 'Dioses y calabozos', 'Claims con claimblocks', 'Spawn de Halloween esta temporada'] },
  { id: 'skywars', nombre: 'SkyWars', icono: 'trofeo', c: '#55ffff', tag: 'Competitivo', ruta: 'skywars',
    texto: 'SkyWars competitivo: sistema de Rating con ranking, cosméticos animados propios y progreso por niveles.',
    puntos: ['Rating y ranking', 'Cosméticos animados propios', 'Progreso por niveles', 'Torneos con premio de 30 USD'] },
  { id: 'eggwars', nombre: 'EggWars', icono: 'huevo', c: '#ffaa00', tienda: 'eggwars',
    texto: 'Protege tu huevo y rompe el de los demás. Se juega en Solo o por equipos.',
    puntos: ['Modo Solo y Team', 'Boosts de EXP para subir de nivel'] },
  { id: 'skypvp', nombre: 'SkyPvP', icono: 'espada', c: '#ff5555', tienda: 'skypvp',
    texto: 'Islas en el cielo, tienda con moras y PvP sin pausa.',
    puntos: ['Tienda que se paga con moras', 'Sky Plus: compra sin gastar moras ni experiencia'] },
  { id: 'kitpvp', nombre: 'KitPvP', icono: 'escudo', c: '#e05cb5',
    texto: 'Eliges un kit y entras directo al combate.', puntos: ['Kits listos para pelear'] },
];

// Rangos de la tienda (precios y ventajas reales; las ventajas salen de la descripción de cada rango en Tebex)
const RANGOS = [
  { id: 'mm', nombre: 'MM', c: '#55ff55', planes: ['1830440', '1830442', '3398702'] },
  { id: 'mmc', nombre: 'MMC', c: '#ffaa00', planes: ['1517717', '1528376', '3398910'] },
  { id: 'mmc-plus', nombre: 'MMC+', c: '#55ffff', planes: ['1830450', '1830451', '3398950'] },
  { id: 'mml', nombre: 'MML', c: '#e05cb5', planes: ['6278953', '6281061'] },
];
// "—" = no aparece en la descripción de ese rango en la tienda
const COMPARATIVA = [
  ['Homes en Survival', '5', '10', '15', '15'],
  ['Colores en el chat', 1, 1, 1, 1],
  ['Entrada anunciada', 1, 1, 1, 1],
  ['/prefijo propio', 0, 1, 1, '—'],
  ['Fly en los lobbies', 0, 0, 1, 1],
  ['/near', 1, 1, 1, 1],
  ['/back', 1, 1, 1, '—'],
  ['/ec, /hat y /craft', 0, 1, 1, 1],
  ['/anvil', 0, 0, 1, 1],
  ['Cosméticos de lobby', '2 tipos', '5 tipos', '7 tipos', '—'],
  ['Ventajas activables (/mml)', 0, 0, 0, 1],
  ['Moras extra', 0, 0, 0, 'x2'],
];
const COMANDOS = [
  ['/sethome', 'Guardar un home (/home para volver)', 'MM+'], ['/near', 'Ver jugadores cerca', 'MM+'], ['/back', 'Volver a donde moriste', 'MM+'],
  ['/prefijo', 'Ponerte un prefijo antes del rango', 'MMC+'], ['/ride', 'Montarte en otros jugadores (lobby)', 'MMC+'], ['/ec', 'Abrir tu EnderChest', 'MMC+'],
  ['/hat', 'Ponerte un ítem de sombrero', 'MMC+'], ['/craft', 'Mesa de crafteo portátil', 'MMC+'], ['/salto', 'Saltar grandes distancias', 'MMC+'],
  ['/fly', 'Volar en los lobbies', 'MMC+ y MML'], ['/pantalla', 'Mandar un mensaje en pantalla', 'MMC+'], ['/anvil', 'Yunque en cualquier lugar', 'MMC+ y MML'],
  ['/mml', 'Activar TreeCapitator, picado rápido y más', 'MML'], ['/claimtp', 'Ir a tus claims sin home', 'MML'], ['/itemrename', 'Renombrar ítems sin experiencia', 'MML'],
  ['/perfil', 'Efectos y sonido de entrada', 'MML'], ['/spawner', 'Colocar y manejar tus spawners', 'Spawners'], ['/fly', 'Volar en Survival', 'Fly Survival'],
];
const VOTOS = [
  { sitio: 'Minecraft-MP', url: 'https://minecraft-mp.com/server/96846/vote/', nota: 'Ficha de Minemora en Minecraft-MP' },
  { sitio: 'MinecraftServers.org', url: 'https://minecraftservers.org/vote/315975', nota: 'Ficha de Minemora en MinecraftServers.org' },
];
const REDES = [
  { n: 'Discord', u: 'https://discord.gg/' + INVITACION, t: 'discord.gg/' + INVITACION, c: '#5865f2', i: 'DC' },
  { n: 'YouTube', u: 'https://www.youtube.com/@MinemoraNetwork', t: '@MinemoraNetwork', c: '#e62117', i: 'YT' },
  { n: 'Instagram', u: 'https://www.instagram.com/minemoraoficial/', t: '@minemoraoficial', c: '#c13584', i: 'IG' },
  { n: 'TikTok', u: 'https://www.tiktok.com/@minemora.network', t: '@minemora.network', c: '#111', i: 'TT' },
  { n: 'Facebook', u: 'https://fb.com/MinemoraNetwork', t: 'MinemoraNetwork', c: '#1877f2', i: 'FB' },
];

/* métodos de pago: lo que hoy no existe en la tienda */
const METODOS = {
  pagomovil: { nombre: 'Pago Móvil', sub: 'En bolívares, a la tasa BCV del día', c: '#4fd1ff', icono: 'telefono', monto: n => bs(n) },
  binance: { nombre: 'Binance Pay', sub: 'USDT sin comisión, desde la app', c: '#f0b90b', icono: 'usdt', monto: n => (n ?? 0).toFixed(2) + ' USDT' },
  zinli: { nombre: 'Zinli', sub: 'Saldo en dólares de tu Zinli', c: '#b48cff', icono: 'billetera', monto: n => usd(n) },
  paypal: { nombre: 'PayPal o tarjeta', sub: 'Tarjeta internacional o PayPal', c: '#33b5ff', icono: 'tarjeta', monto: n => usd(n), hoy: true },
};

/* ======================= pixel art ======================= */
const PALETA = { r: '#e3262f', k: '#000', w: '#fff', s: '#c8c8d8', S: '#8a8aa0', b: '#7a5230', d: '#4e3418', r: '#e3262f', R: '#8e0f16', y: '#ffcf4a', Y: '#d99a10', g: '#3d8a22', G: '#2a5e17', p: '#ff8a1f', P: '#c95f00',
  f: '#f4f4ff', e: '#26a17b', E: '#1a7a5c', u: '#2f6fd6', U: '#1f4fa0', c: '#4fd1ff', v: '#8149ae', V: '#4b2a6b', M: '#c43998', D: '#6e1f58', L: '#f1cde5', z: '#b48cff', Z: '#6b3fc4', x: '#5865f2', X: '#3c45a5', o: '#ffaa00', n: '#1a0c24' };
const DIBUJOS = {
  mora: ['....g..g....', '....gGGg....', '...DMMDMD...', '..DMLMDMLD..', '.DMMDMMDMMD.', '.DLMDMLMDMD.', '.DMMDMMDMMD.', '..DMLMDMLD..', '..DDMMDMDD..', '...DDMMDD...', '.....DD.....', '............'],
  espada: ['.........sss', '........swS.', '.......swS..', '......swS...', '.....swS....', '..b.swS.....', '..bbwS......', '...bb.......', '..bdbb......', '.dd..b......', 'dd..........', 'd...........'],
  escudo: ['.SSSSSSSSSS.', 'SssssssssssS', 'SsMMMMMMMMsS', 'SsMMwMMwMMsS', 'SsMMwwwwMMsS', 'SsMMwMMwMMsS', 'SsMMwMMwMMsS', '.SsMMMMMMsS.', '.SsMMMMMMsS.', '..SsMMMMsS..', '...SssssS...', '....SSSS....'],
  bloque: ['gggggggggggg', 'gGggggGggggg', 'GgGgGGgGgGGg', 'bGbbGbbbGbbG', 'bbbbbbdbbbbb', 'bdbbbbbbbbdb', 'bbbbdbbbbbbb', 'bbbbbbbbdbbb', 'bdbbbbbbbbbb', 'bbbbbdbbbbdb', 'bbdbbbbbbbbb', 'dddddddddddd'],
  pico: ['..cccccccc..', '.cuuuuuuuuc.', 'cuu..bd..uuc', 'cu...bd...uc', 'c....bd....c', '.....bd.....', '.....bd.....', '.....bd.....', '.....bd.....', '.....bd.....', '.....bd.....', '............'],
  huevo: ['....kkkk....', '...kVVVVk...', '..kVvvvVVk..', '..kVvwvvVk..', '.kVvvvvvvVk.', '.kVvvvMvvVk.', '.kVvvvvvvVk.', '.kVVvMvvvVk.', '..kVVvvVVk..', '...kVVVVk...', '....kkkk....', '............'],
  trofeo: ['..yyyyyyyy..', 'yyyYyyyyYyyy', 'y.yYyyyyYy.y', 'y.yyyyyyyy.y', '.yyyyyyyyyy.', '...yyyyyy...', '....yyyy....', '.....yy.....', '.....yy.....', '...YYYYYY...', '..YYYYYYYY..', '............'],
  corona: ['............', 'y....y....y.', 'yy..yyy..yy.', 'yyy.yyy.yyy.', 'yyyyyyyyyyy.', 'yyMyyyyycyy.', 'yyyyyyyyyyy.', 'YYYYYYYYYYY.', '............', '............', '............', '............'],
  cofre: ['............', '.bbbbbbbbbb.', 'bddddddddddb', 'bdbbbbbbbbdb', 'bbbbbbbbbbbb', 'kkkkkyykkkkk', 'bbbbbyybbbbb', 'bdbbbbbbbbdb', 'bdbbbbbbbbdb', 'bddddddddddb', '.bbbbbbbbbb.', '............'],
  calabaza: ['.....g......', '....gG......', '..ppppppp...', '.pppppppppp.', 'ppkkppppkkpp', 'ppkkppppkkpp', 'pppppkkppppp', 'ppkpppppkpp.', 'pppkkkkkppp.', '.ppppppppp..', '..PPPPPPP...', '............'],
  murcielago: ['............', '............', 'v....vv....v', 'vv..vvvv..vv', 'vvv.vrvrv.vv', 'vvvvvvvvvvvv', '.vvvvvvvvvv.', '..vv.vv.vv..', '..v......v..', '............', '............', '............'],
  gema: ['....cccc....', '...cwwccc...', '..cwwcccuc..', '.cwwcccccuu.', 'cwcccccccuuu', '.ccccccccuu.', '..ucccccuu..', '...ucccuu...', '....ucuu....', '.....uu.....', '............', '............'],
  rayo: ['......yyyy..', '.....yyyy...', '....yyyy....', '...yyyy.....', '..yyyyyyyy..', '.....yyyy...', '....yyyy....', '...yyy......', '..yyy.......', '.yy.........', 'y...........', '............'],
  jaula: ['ssssssssssss', 'sk.k.k.k.k.s', 'sk.k.k.k.k.s', 'sk.kgggk.k.s', 'sk.gwgwg.k.s', 'sk.ggggg.k.s', 'sk.kgggk.k.s', 'sk.k.k.k.k.s', 'sk.k.k.k.k.s', 'ssssssssssss', '............', '............'],
  pluma: ['.........ss.', '........sfs.', '.......sffs.', '......sffs..', '.....sffs...', '....sffs....', '...sffs.....', '..sffs......', '..sss.......', '.s..........', 's...........', '............'],
  libro: ['.RRRRRRRRR..', '.RrrrrrrrRw.', '.RryyyyyrRw.', '.RrrrrrrrRw.', '.RryyyyrrRw.', '.RrrrrrrrRw.', '.RrrrrrrrRw.', '.RrrrrrrrRw.', '.RrrrrrrrRw.', '.RRRRRRRRRw.', '..wwwwwwwww.', '............'],
  chat: ['............', '.xxxxxxxxxx.', 'xxxxxxxxxxxx', 'xxwwxxxxwwxx', 'xxwwxxxxwwxx', 'xxxxxxxxxxxx', 'xxxwxxxxwxxx', 'xxxxwwwwxxxx', '.xxxxxxxxxx.', '..XX....XX..', '............', '............'],
  telefono: ['..kkkkkkkk..', '..kSSSSSSk..', '..kcccccck..', '..kcwwwwck..', '..kcccccck..', '..kcwwwcck..', '..kcccccck..', '..kcwwccck..', '..kcccccck..', '..kSSSSSSk..', '..kSSkkSSk..', '..kkkkkkkk..'],
  usdt: ['....eeee....', '..eeeeeeee..', '.eewwwwwwee.', '.eeeewweeee.', 'eeeewwwweeee', 'eewwwwwwwwee', 'eeeewwwweeee', 'eeeeewweeeee', '.eeeewweeee.', '.EeeewweeeE.', '..EEeeeeEE..', '....EEEE....'],
  billetera: ['............', '.zzzzzzzzz..', 'zZZZZZZZZZz.', 'zzzzzzzzzzzz', 'zzzzzzzzwwwz', 'zzzzzzzzwkwz', 'zzzzzzzzwwwz', 'zzzzzzzzzzzz', 'zZZZZZZZZZZz', '.zzzzzzzzzz.', '............', '............'],
  tarjeta: ['............', '............', 'uuuuuuuuuuuu', 'uuuuuuuuuuuu', 'kkkkkkkkkkkk', 'uuuuuuuuuuuu', 'uyyuuuuuuuuu', 'uyyuuwwuwwuu', 'uuuuuuuuuuuu', 'UUUUUUUUUUUU', '............', '............'],
  ticket: ['............', 'ssssssssssss', 'sSSSSSSSSSSs', 'sS.ss.ss.sSs', 'Ss........sS', 'sS.ssssss.Ss', 'Ss........sS', 'sS.ss.ss.sSs', 'sSSSSSSSSSSs', 'ssssssssssss', '............', '............'],
};
function pintar(raiz = document) {
  $$('svg[data-pixel]:not([data-ok])', raiz).forEach(svg => {
    const filas = DIBUJOS[svg.dataset.pixel]; if (!filas) return;
    svg.setAttribute('viewBox', `0 0 ${filas[0].length} ${filas.length}`);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = filas.map((f, y) => [...f].map((ch, x) => PALETA[ch] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${PALETA[ch]}"/>` : '').join('')).join('');
    svg.dataset.ok = 1;
  });
}
const px = (nombre, extra = '') => `<svg data-pixel="${nombre}" ${extra}></svg>`;

/* ======================= cielo: estrellas, moras que caen y algún murciélago ======================= */
const estallar = (() => {
  const lienzo = $('#cielo'), ctx = lienzo.getContext('2d');
  let estrellas = [], moras = [], chispas = [], murcielagos = [];
  const MORA = DIBUJOS.mora;
  const ALA = [['n....nn....n', 'nn..nnnn..nn', 'nnnnnnnnnnnn', '.nnnnnnnnnn.', '..n..nn..n..'], ['............', '....nnnn....', '.nnnnnnnnnn.', 'nnnnnnnnnnnn', 'n...n..n...n']];
  const nueva = inicio => ({ x: Math.random() * innerWidth, y: inicio ? Math.random() * innerHeight : -40, e: Math.random() < 0.3 ? 3 : 2, v: 0.2 + Math.random() * 0.45, o: Math.random() * 6.3, a: 0.25 + Math.random() * 0.35 });
  const dibujarMora = (x, y, e, alfa) => {
    ctx.globalAlpha = alfa;
    for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) { const c = PALETA[MORA[j][i]]; if (c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x + i * e), Math.round(y + j * e), e, e); } }
  };
  const ajustar = () => {
    lienzo.width = innerWidth * devicePixelRatio; lienzo.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    estrellas = Array.from({ length: Math.round(innerWidth * innerHeight / 6500) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, t: Math.random() < 0.2 ? 2 : 1, o: Math.random() * 6.3, c: Math.random() < 0.25 ? '#55ffff' : '#f1cde5' }));
    moras = Array.from({ length: Math.max(6, Math.round(innerWidth / 150)) }, () => nueva(true));
  };
  let proximo = 6000;
  const dibujar = ms => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of estrellas) { ctx.globalAlpha = 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(ms / 800 + s.o)); ctx.fillStyle = s.c; ctx.fillRect(Math.round(s.x), Math.round(s.y), s.t, s.t); }
    for (const m of moras) {
      if (!reducido) { m.y += m.v; m.x += Math.sin(ms / 1400 + m.o) * 0.35; }
      dibujarMora(m.x, m.y, m.e, m.a);
      if (m.y > innerHeight + 40) Object.assign(m, nueva(false));
    }
    // murciélagos: detalle de temporada, pocos y de vez en cuando
    if (!reducido && ms > proximo && murcielagos.length < 2) { const izq = Math.random() < 0.5; murcielagos.push({ x: izq ? -60 : innerWidth + 60, y: 90 + Math.random() * innerHeight * 0.4, v: (izq ? 1 : -1) * (1.3 + Math.random()), e: 2 + Math.floor(Math.random() * 2), o: Math.random() * 6.3 }); proximo = ms + 7000 + Math.random() * 9000; }
    ctx.globalAlpha = 0.9; ctx.fillStyle = '#05020a';
    murcielagos = murcielagos.filter(b => {
      b.x += b.v; const y = b.y + Math.sin(ms / 260 + b.o) * 10, f = ALA[Math.floor(ms / 140) % 2];
      f.forEach((fila, j) => [...fila].forEach((ch, i) => { if (ch === 'n') ctx.fillRect(Math.round(b.x + i * b.e), Math.round(y + j * b.e), b.e, b.e); }));
      return b.x > -80 && b.x < innerWidth + 80;
    });
    chispas = chispas.filter(c => {
      c.vy += 0.25; c.x += c.vx; c.y += c.vy; c.vida--;
      if (c.mora) dibujarMora(c.x, c.y, 2, Math.min(1, c.vida / 30));
      else { ctx.globalAlpha = Math.min(1, c.vida / 30); ctx.fillStyle = c.c; ctx.fillRect(Math.round(c.x), Math.round(c.y), c.t, c.t); }
      return c.vida > 0;
    });
    ctx.globalAlpha = 1;
    if (!reducido || chispas.length) requestAnimationFrame(dibujar);
  };
  ajustar(); addEventListener('resize', ajustar); requestAnimationFrame(dibujar);
  // estallido de moras (al copiar la IP, al sumar al carrito o al tocar el logo)
  return (x, y, n = 16) => {
    if (reducido) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 5;
      chispas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, vida: 50 + Math.random() * 30, mora: i % 4 === 0, t: 3 + Math.floor(Math.random() * 3), c: ['#e05cb5', '#c43998', '#f1cde5', '#55ffff'][i % 4] });
    }
  };
})();
const estallarEn = el => { const r = el.getBoundingClientRect(); estallar(r.left + r.width / 2, r.top + r.height / 2); };

/* ======================= datos en vivo ======================= */
const vivo = { jugadores: null, maximo: null, miembros: null, enLinea: null, motd: null };
const contar = (el, total, suf = '') => {
  if (!el) return;
  const t0 = performance.now();
  const paso = t => { const k = reducido ? 1 : Math.min(1, (t - t0) / 1300); el.textContent = Math.round(total * (1 - (1 - k) ** 3)).toLocaleString('es-VE') + suf; if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
};
// MOTD con códigos § de Minecraft → HTML propio (sin insertar HTML de terceros)
const COLORES_MC = { 0: '#000', 1: '#0000aa', 2: '#00aa00', 3: '#00aaaa', 4: '#aa0000', 5: '#aa00aa', 6: '#ffaa00', 7: '#aaaaaa', 8: '#555555', 9: '#5555ff', a: '#55ff55', b: '#55ffff', c: '#ff5555', d: '#ff55ff', e: '#ffff55', f: '#ffffff' };
const MOTD_RESPALDO = '§f  §7§l>§f§l>§7§l§m-§f§l§m-§6§l<§e§l< §f§lMINEMORA §7⚔ §5§lNETWORK §c1.8-26.2 §e§l>§6§l>§f§l§m-§7§l§m-§f§l<§7§l<\n      §7§l❰ §a§lSURVIVAL: §6§lHALLOWEEN §8& §b§lBOOST X4 ❱';
function motdHtml(raw) {
  let html = '', est = { c: '#aaa' };
  const partes = raw.trim().split(/(§[0-9a-fk-or])/i);
  for (const p of partes) {
    const m = /^§([0-9a-fk-or])$/i.exec(p);
    if (m) { const k = m[1].toLowerCase(); if (COLORES_MC[k]) est = { c: COLORES_MC[k] }; else if (k === 'l') est.b = 1; else if (k === 'm') est.s = 1; else if (k === 'o') est.i = 1; else if (k === 'r') est = { c: '#aaa' }; continue; }
    if (!p) continue;
    html += p.split('\n').map(t => `<span style="color:${est.c};${est.b ? 'font-weight:700;' : 'font-weight:400;'}${est.s ? 'text-decoration:line-through;' : ''}${est.i ? 'font-style:italic;' : ''}">${esc(t.replace(/^\s+/, ' '))}</span>`).join('<br>');
  }
  return html;
}
const pintarVivo = () => {
  $$('[data-vivo="jugadores"]').forEach(el => vivo.jugadores != null && contar(el, vivo.jugadores));
  $$('[data-vivo="miembros"]').forEach(el => vivo.miembros != null && contar(el, vivo.miembros));
  $$('[data-vivo="enlinea"]').forEach(el => vivo.enLinea != null && contar(el, vivo.enLinea));
  $$('[data-vivo="tasa"]').forEach(el => { el.textContent = textoTasa(); });
  $$('[data-vivo="tasa-nota"]').forEach(el => { el.innerHTML = tasaEjemplo ? '<span class="ejemplo">tasa de ejemplo</span>' : `tasa oficial BCV${tasaFecha ? ' del ' + tasaFecha : ''}`; });
  $$('[data-vivo="motd"]').forEach(el => { el.innerHTML = motdHtml(vivo.motd || MOTD_RESPALDO); });
};
fetch('https://api.mcstatus.io/v2/status/java/' + IP).then(r => r.json()).then(d => { vivo.jugadores = d.online ? d.players.online : 0; if (d.motd?.raw) vivo.motd = d.motd.raw; pintarVivo(); }).catch(() => {});
fetch(`https://discord.com/api/v10/invites/${INVITACION}?with_counts=true`).then(r => r.json()).then(d => { vivo.miembros = d.approximate_member_count; vivo.enLinea = d.approximate_presence_count; pintarVivo(); }).catch(() => {});
fetch('https://ve.dolarapi.com/v1/dolares/oficial').then(r => r.json()).then(d => {
  const v = d.promedio || d.venta;
  if (v > 0) {
    tasa = v; tasaEjemplo = false;
    if (d.fechaActualizacion) tasaFecha = new Date(d.fechaActualizacion).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', timeZone: 'America/Caracas' });
    pintarCarrito(); if (CATALOGO.length) render(true);
  }
}).catch(() => {});

/* cuentas atrás */
const proximoSabado = () => { const d = new Date(); d.setHours(18, 0, 0, 0); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7)); return d; };
const FIN_TORNEO = proximoSabado();
const partes = fin => { const ms = Math.max(0, fin - Date.now()); return { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 }; };
const p2 = n => String(n).padStart(2, '0');
const cajasCuenta = fin => { const { d, h, m, s } = partes(fin); return [[d, 'días'], [h, 'horas'], [m, 'min'], [s, 'seg']].map(([v, l]) => `<div><b>${p2(v)}</b><small>${l}</small></div>`).join(''); };
setInterval(() => {
  $$('[data-cuenta]').forEach(el => { el.innerHTML = cajasCuenta(el.dataset.cuenta === 'torneo' ? FIN_TORNEO : FIN_HALLOWEEN); });
}, 1000);

/* ======================= catálogo ======================= */
let CATALOGO = [];
const imagen = (p, w = 200) => p[4] ? `https://wsrv.nl/?url=${encodeURIComponent(CDN + p[4])}&w=${w}&output=webp` : '';
const todos = () => CATALOGO.flatMap(s => s.categorias.flatMap(c => c.productos.map(p => ({ p, s, c }))));
const producto = id => todos().find(x => x.p[0] === id);
const DESTACADO = '6278953'; // "Artículo destacado" de la tienda actual
// Descripción de Tebex ya convertida a texto: "## título", "- punto" o párrafo
function descHtml(t) {
  let html = '', lista = false;
  for (const l of (t || '').split('\n')) {
    if (/^- /.test(l)) {
      if (!lista) { html += '<ul>'; lista = true; }
      const s = l.slice(2), k = s.indexOf(':');
      html += `<li>${k > 0 && k < 42 ? `<b>${esc(s.slice(0, k))}</b>${esc(s.slice(k))}` : esc(s)}</li>`;
      continue;
    }
    if (lista) { html += '</ul>'; lista = false; }
    if (/^## /.test(l)) html += `<h3>${esc(l.slice(3).replace(/♥️/g, '♥'))}</h3>`;
    else if (l.trim()) html += `<p>${esc(l)}</p>`;
  }
  return html + (lista ? '</ul>' : '');
}

/* ======================= sesión y carrito ======================= */
let sesion = leer('sesion', null);
let carrito = leer('carrito', []);
let pagarTrasEntrar = false;
const avatarDe = (nombre, tam = 32) => /^[A-Za-z0-9_]{3,16}$/.test(nombre || '') ? `https://mc-heads.net/avatar/${nombre}/${tam}` : `https://mc-heads.net/avatar/MHF_Steve/${tam}`;
const totalCarrito = () => carrito.reduce((s, l) => s + l.precio * l.cant, 0);
function pintarSesion() {
  $('#avatar').src = avatarDe(sesion?.nombre);
  $('#nombre-usuario').textContent = sesion ? sesion.nombre : 'Entrar';
}
function pintarCarrito() {
  const n = carrito.reduce((s, l) => s + l.cant, 0), num = $('#num-carrito');
  if (num.textContent !== String(n)) { num.textContent = n; num.classList.remove('salta'); void num.offsetWidth; num.classList.add('salta'); }
  $('#lineas').innerHTML = carrito.length ? carrito.map((l, i) => `
    <div class="linea">${l.img ? `<img src="${esc(l.img)}" alt="">` : px('cofre', 'class="icono" style="width:48px;height:48px;margin:0"')}
      <div><b>${esc(l.nombre)}</b><small class="muted">${esc(l.grupo)}</small>
        <div class="cant"><button data-menos="${i}" aria-label="Quitar uno">−</button><span>${l.cant}</span><button data-mas="${i}" aria-label="Sumar uno">+</button></div></div>
      <div class="p">${precio(l.precio * l.cant)}</div></div>`).join('') : '<p class="vacio">Tu carrito está vacío.<br>Agrega algo de la tienda.</p>';
  const total = totalCarrito();
  $('#total').textContent = precio(total);
  $('#total-alt').textContent = carrito.length ? `≈ ${precioAlt(total)}${moneda === 'USD' ? ' a la tasa de hoy' : ''}` : '';
  guardar('carrito', carrito); pintar($('#lineas'));
}
function anadir(p, s, desde) {
  const ex = carrito.find(l => l.id === p[0]);
  ex ? ex.cant++ : carrito.push({ id: p[0], nombre: p[1], precio: p[2] || 0, img: imagen(p, 96), grupo: s.nombre, cant: 1 });
  pintarCarrito(); aviso(`<b>✔</b> ${esc(p[1])} al carrito`);
  if (desde) estallarEn(desde);
}

/* ======================= modales y avisos ======================= */
const abrir = sel => { $('#capa').classList.add('on'); $(sel).classList.add('on'); };
const cerrarTodo = () => { $$('.modal.on, .cajon.on').forEach(e => e.classList.remove('on')); $('#capa').classList.remove('on'); clearTimeout(entregaTimer); };
$('#capa').addEventListener('click', cerrarTodo);
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarTodo(); });
document.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrarTodo(); });
const aviso = html => { const t = $('#toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2300); };

$('#btn-carrito').addEventListener('click', () => abrir('#cajon'));
$('#btn-pagar').addEventListener('click', () => {
  if (!carrito.length) return aviso('Tu carrito está vacío');
  cerrarTodo();
  if (!sesion) { pagarTrasEntrar = true; return abrirLogin(); }
  abrirPago();
});
$('#lineas').addEventListener('click', e => {
  const mas = e.target.dataset.mas, menos = e.target.dataset.menos;
  if (mas != null) carrito[mas].cant++;
  if (menos != null) { carrito[menos].cant--; if (carrito[menos].cant <= 0) carrito.splice(menos, 1); }
  pintarCarrito();
});
$('#btn-menu').addEventListener('click', () => $('#links').classList.toggle('abierto'));

const abrirLogin = () => { $('#input-usuario').value = sesion?.nombre || ''; abrir('#modal-login'); setTimeout(() => $('#input-usuario').focus(), 200); };
$('#btn-usuario').addEventListener('click', abrirLogin);
const previa = () => { const n = $('#input-usuario').value.trim(); $('#previa').src = avatarDe(n, 48); $('#previa-txt').textContent = n || 'Así vas a aparecer en la tienda'; };
let tPrev; $('#input-usuario').addEventListener('input', () => { clearTimeout(tPrev); tPrev = setTimeout(previa, 350); });
const entrar = () => {
  const n = $('#input-usuario').value.trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(n)) return aviso('Escribe un nick válido (3 a 16 letras, números o _)');
  sesion = { nombre: n }; guardar('sesion', sesion); pintarSesion(); cerrarTodo(); aviso(`<b>✔</b> ¡Epa, ${esc(n)}!`);
  if (pagarTrasEntrar) { pagarTrasEntrar = false; setTimeout(abrirPago, 300); }
};
$('#btn-entrar').addEventListener('click', entrar);
$('#input-usuario').addEventListener('keydown', e => { if (e.key === 'Enter') entrar(); });

function verProducto(id) {
  const hit = producto(id); if (!hit) return;
  const { p, s, c } = hit;
  $('#contenido-producto').innerHTML = `
    <h3>${esc(p[1])}</h3>
    <div class="img-grande">${p[4] ? `<img src="${esc(imagen(p, 400))}" alt="">` : px('cofre', 'class="icono" style="width:120px;height:120px"')}</div>
    <p class="muted">${esc(s.nombre)} · ${esc(c.nombre)}</p>
    <div class="ventajas">${descHtml(p[5])}</div>
    <p class="muted" style="font-size:0.8rem">Descripción tal como aparece en la tienda actual. Llega sola al juego al completar el pago.</p>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;flex-wrap:wrap">
      <div><div class="pixel" style="font-size:1.4rem;color:var(--cian)">${precio(p[2])}</div><small class="muted">≈ ${precioAlt(p[2])}</small></div>
      <button class="btn mora" id="btn-add-modal">Agregar</button>
    </div>`;
  pintar($('#contenido-producto'));
  $('#btn-add-modal').onclick = e => { anadir(p, s, e.currentTarget); cerrarTodo(); };
  abrir('#modal-producto');
}

/* ======================= pago simulado: método → datos → entrega ======================= */
let pago = { paso: 1, metodo: null }, entregaTimer;
const PASOS = ['1 · Método', '2 · Pagar', '3 · Entrega'];
function abrirPago() { pago = { paso: 1, metodo: null }; pintarPago(); abrir('#modal-pago'); }
function qrSvg(semilla) {
  // QR de mentira (decorativo) con las tres esquinas típicas
  const N = 25; let r = semilla, out = '';
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const esq = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
  const lleno = (x, y) => { for (const [a, b] of [[0, 0], [N - 7, 0], [0, N - 7]]) if (x >= a && x < a + 7 && y >= b && y < b + 7) { const i = x - a, j = y - b; return i === 0 || j === 0 || i === 6 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4); } return false; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (esq(x, y) ? lleno(x, y) : rnd() < 0.48) out += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  return `<svg class="qr" viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" aria-label="Código QR de ejemplo">${out}</svg>`;
}
function pintarPago() {
  const total = totalCarrito(), m = METODOS[pago.metodo];
  const pasos = `<div class="pasos">${PASOS.map((t, i) => `<span class="${i + 1 === pago.paso ? 'on' : i + 1 < pago.paso ? 'hecho' : ''}">${t}</span>`).join('')}</div>`;
  let cuerpo = '';
  if (pago.paso === 1) {
    cuerpo = `<h3>¿Cómo quieres pagar?</h3>
      <p class="muted" style="margin-bottom:14px">Total: <b style="color:var(--cian)">${usd(total)}</b> · ${bs(total)} (${tasaEjemplo ? 'tasa de ejemplo' : 'tasa BCV de hoy'}). Hoy la tienda solo acepta PayPal y Paymentwall.</p>
      <div class="opciones-pago">${Object.entries(METODOS).map(([k, v]) => `
        <button class="opcion-pago" data-metodo="${k}" style="--c:${v.c}">${px(v.icono)}
          <div><b>${v.nombre}</b><span>${v.sub}</span><span class="monto">${v.monto(total)}</span>${v.hoy ? '<span class="hoy">lo único que hay hoy</span>' : ''}</div></button>`).join('')}
      </div>`;
  } else if (pago.paso === 2) {
    const dato = (k, v, grande) => `<div class="dato"><span>${k}</span><b class="${grande ? 'grande' : ''}">${v}</b></div>`;
    const ej = ' <span class="ejemplo">ejemplo</span>';
    let datos = '', lado = '', nota = '', campo = '';
    if (pago.metodo === 'pagomovil') {
      datos = dato('Banco', 'Banco de Venezuela · 0102' + ej) + dato('Teléfono', '0414-000-0000' + ej) + dato('RIF', 'J-00000000-0' + ej) + dato('Monto exacto', bs(total), true) + dato('Tasa', `${textoTasa()} por dólar`);
      campo = '<div class="campo"><label class="pixel" for="ref">Número de referencia</label><input id="ref" inputmode="numeric" maxlength="12" placeholder="Últimos 6 dígitos"></div>';
      nota = 'Haces el Pago Móvil desde la app de tu banco y pegas la referencia. La web la confirma sola con el banco: sin mandar capture por Discord y sin esperar a un staff.';
      lado = px('telefono', 'style="width:110px;height:110px;margin:0 auto"');
    } else if (pago.metodo === 'binance') {
      datos = dato('Pay ID', '000 000 000' + ej) + dato('Moneda', 'USDT') + dato('Monto exacto', (total).toFixed(2) + ' USDT', true) + dato('Referencia', 'MORA-' + String(Math.floor(total * 1000)).padStart(5, '0'));
      nota = 'Escaneas el QR con la app de Binance y pagas en USDT. Binance avisa a la tienda en el momento y la compra se entrega sola.';
      lado = qrSvg(Math.floor(total * 100) + 7);
    } else if (pago.metodo === 'zinli') {
      datos = dato('Enviar a', 'pagos@minemora.net' + ej) + dato('Monto exacto', usd(total), true) + dato('Concepto', esc(sesion?.nombre || 'tu nick'));
      campo = '<div class="campo"><label class="pixel" for="ref">Código de la operación</label><input id="ref" maxlength="16" placeholder="Lo ves en tu Zinli"></div>';
      nota = 'Envías el saldo desde tu Zinli con tu nick en el concepto. La operación se valida y la compra entra al juego.';
      lado = px('billetera', 'style="width:110px;height:110px;margin:0 auto"');
    } else {
      datos = dato('Monto', usd(total), true) + dato('Pasarela', 'PayPal / tarjeta internacional');
      nota = 'Es el método que ya existe en la tienda. Se mantiene para quien tenga PayPal o tarjeta internacional.';
      lado = px('tarjeta', 'style="width:110px;height:110px;margin:0 auto"');
    }
    cuerpo = `<h3 style="color:${m.c}">${m.nombre}</h3>
      <div class="datos-pago"><div>${datos}${campo}</div><div>${lado}</div></div>
      <p class="nota-pago">${nota}</p>
      <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
        <button class="btn ghost" data-volver>Cambiar método</button>
        <button class="btn mora" data-confirmar style="flex:1">${pago.metodo === 'paypal' ? 'Ir a PayPal (simulado)' : 'Ya pagué'}</button>
      </div>`;
  } else {
    const nick = esc(sesion?.nombre || 'Steve');
    const lista = carrito.map(l => `${esc(l.nombre)}${l.cant > 1 ? ' x' + l.cant : ''}`).join(', ');
    cuerpo = `<h3>Entregando en el juego</h3>
      <div class="entrega">
        <div><i>✔</i> Pago recibido por ${esc(m.nombre)}</div>
        <div><i>✔</i> Nick verificado: <b>${nick}</b></div>
        <div><i>✔</i> Comandos enviados al servidor</div>
        <div><i>✔</i> Listo, ya lo tienes</div>
      </div>
      <div class="chat-mc" id="chat-mc">
        <span style="color:#ff55ff;font-weight:700">[Minemora]</span> <span style="color:#fff">¡Gracias, ${nick}!</span> <span style="color:#aaa">Tu compra llegó:</span> <span style="color:#55ffff">${lista}</span><br>
        <span style="color:#ffaa00">★</span> <span style="color:#ffff55">${nick}</span> <span style="color:#aaa">apoyó al servidor. ¡Gracias por mantener Minemora en pie!</span>
      </div>
      <p class="nota-pago">Simulación: no se cobró nada. En la versión real esto pasa solo, aunque no haya ningún staff conectado y sin abrir ticket.</p>
      <button class="btn cian full" data-cerrar style="margin-top:16px">Listo</button>`;
  }
  $('#contenido-pago').innerHTML = pasos + cuerpo;
  pintar($('#contenido-pago'));
  if (pago.paso === 3) {
    const filas = $$('.entrega div');
    let i = 0;
    const sig = () => { if (i < filas.length) { filas[i++].classList.add('hecho'); entregaTimer = setTimeout(sig, reducido ? 0 : 650); } else { $('#chat-mc').classList.add('on'); estallarEn($('#chat-mc')); } };
    entregaTimer = setTimeout(sig, reducido ? 0 : 400);
    carrito = []; pintarCarrito();
  }
}
$('#modal-pago').addEventListener('click', e => {
  const met = e.target.closest('[data-metodo]');
  if (met) { pago.metodo = met.dataset.metodo; pago.paso = 2; return pintarPago(); }
  if (e.target.closest('[data-volver]')) { pago.paso = 1; return pintarPago(); }
  if (e.target.closest('[data-confirmar]')) {
    const ref = $('#ref');
    if (ref && ref.value.trim().length < 4) { ref.focus(); return aviso('Pega la referencia (es una simulación, vale cualquier número)'); }
    pago.paso = 3; pintarPago();
  }
});

/* ======================= piezas reutilizables ======================= */
const tarjetaProducto = (p, s) => `<div class="card hover producto" data-ver="${esc(p[0])}">
    ${p[0] === DESTACADO ? '<span class="destacado">Destacado</span>' : ''}
    <div class="img">${p[4] ? `<img loading="lazy" src="${esc(imagen(p))}" alt="">` : px('cofre', 'class="icono" style="width:80px;height:80px;margin:0 auto"')}</div>
    <div class="nombre">${esc(p[1])}</div>
    <div class="precio">${precioCorto(p[2])}</div>
    <div class="alt">≈ ${precioAlt(p[2])}</div>
    <button class="btn sm" data-add="${esc(p[0])}">Agregar</button>
  </div>`;
const JUGADORES = ['Chamo_PvP', 'LaGochita', 'xAndresVE', 'Pana_Mora', 'ElCatire', 'Yorman77', 'Mariale_', 'Kevin2010', 'Wuilmer_YT', 'Dayana_mc', 'ElMaracucho', 'Gabo_09'];
const SKINS = ['MHF_Steve', 'MHF_Alex', 'MHF_Blaze', 'MHF_Enderman', 'MHF_Skeleton', 'MHF_Zombie', 'MHF_Creeper', 'MHF_Witch', 'MHF_Villager', 'MHF_Golem'];
const METODO_FEED = ['Pago Móvil', 'Binance Pay', 'Pago Móvil', 'Zinli', 'PayPal', 'Pago Móvil'];
let feedTimer;
function arrancarFeed() {
  clearInterval(feedTimer);
  const lista = $('#feed'); if (!lista) return;
  const pool = todos().filter(x => x.s.slug !== 'extras');
  let n = 0;
  const add = hace => {
    const { p } = pool[Math.floor(Math.random() * pool.length)];
    const li = document.createElement('li');
    li.innerHTML = `<img src="https://mc-heads.net/avatar/${SKINS[n % SKINS.length]}/28" alt=""><div><b>${JUGADORES[n % JUGADORES.length]}</b><span>${esc(p[1])} · ${METODO_FEED[n % METODO_FEED.length]}</span></div><span style="margin-left:auto;color:var(--muted);font-size:0.75rem;white-space:nowrap">${hace}</span>`;
    lista.prepend(li); while (lista.children.length > 6) lista.lastChild.remove(); n++;
  };
  ['hace 5 h', 'hace 3 h', 'hace 2 h', 'hace 1 h', 'hace 20 min', 'hace 3 min'].forEach(add);
  if (!reducido) feedTimer = setInterval(() => add('ahora'), 5500);
}
const selectorMoneda = () => `<div class="moneda" role="group" aria-label="Moneda"><button data-moneda="USD" class="${moneda === 'USD' ? 'on' : ''}">USD</button><button data-moneda="VES" class="${moneda === 'VES' ? 'on' : ''}">Bs.</button></div>`;
function tarjetaModalidad(m) {
  const destino = m.ruta ? '#' + m.ruta : m.tienda ? `#tienda/${m.tienda}` : '#wiki';
  return `<div class="card hover modalidad reveal" style="--c:${m.c}"><span class="franja"></span>${m.tag ? `<span class="tag">${m.tag}</span>` : ''}
    ${px(m.icono, 'class="icono"')}<h3>${esc(m.nombre)}</h3><p>${esc(m.texto)}</p>
    <ul>${m.puntos.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <a class="btn sm ghost" href="${destino}">${m.ruta ? 'Ver ranking' : m.tienda ? 'Ver en la tienda' : 'Leer la wiki'} →</a></div>`;
}
const bloqueMetodos = n => `<div class="metodos">${Object.values(METODOS).map(v => `
  <div class="metodo ${v.hoy ? 'hoy' : ''}" style="--c:${v.c}">${px(v.icono)}<div><b>${v.nombre}</b><span>${v.sub}</span><span class="monto">${v.monto(n)}</span></div></div>`).join('')}</div>`;

/* ======================= vistas ======================= */
const VISTAS = {
  inicio() {
    const mml = producto(DESTACADO)?.p;
    return `<div class="vista">
    <header class="hero"><div class="hero-fondo"></div><div class="wrap">
      <div class="logo-wrap" id="logo" title="¡Toca!"><img src="logo.webp" alt="Minemora Network">
        <span class="mora-flota" style="left:-4%;top:18%">${px('mora')}</span><span class="mora-flota" style="right:-2%;top:56%;animation-delay:-1.8s;width:26px;height:26px">${px('mora')}</span></div>
      <div class="stats">
        <span class="stat"><span class="dot"></span><b data-vivo="jugadores">…</b> jugando ahora</span>
        <span class="stat">Discord <b data-vivo="miembros">…</b> miembros</span>
        <span class="stat">Desde <b>2018</b></span>
      </div>
      <div class="motd"><small>MOTD del servidor, en vivo</small><div data-vivo="motd"></div></div>
      <h1>La network no-premium<br><span class="brillo">de Venezuela</span></h1>
      <p class="lead">Survival, SkyWars, EggWars, SkyPvP y KitPvP. Entra con cualquier versión de la 1.8 a la 26.2, tengas cuenta premium o no.</p>
      <div class="ip"><div><small>IP del servidor</small><code>${IP}</code></div><button class="btn cian" data-copiar>Copiar IP</button></div>
    </div></header>
    <section class="alt"><div class="wrap bolivares">
      <div class="reveal"><p class="label">&gt; paga como pagas todo</p><h2>Paga en bolívares,<br>sin PayPal</h2>
        <p class="muted" style="font-size:1.05rem">Hoy la tienda solo cobra con PayPal y Paymentwall, y muchos jugadores no tienen ninguno de los dos. Con la web nueva cada precio se ve también en bolívares y se paga con <b style="color:#4fd1ff">Pago Móvil</b>, <b style="color:#f0b90b">Binance Pay</b> o <b style="color:#b48cff">Zinli</b>.</p>
        <div class="tasa">Tasa de hoy: <b data-vivo="tasa">…</b> <small class="muted" data-vivo="tasa-nota"></small></div>
        <div class="antes-despues">
          <div class="paso-ad mal">${px('ticket')}<div><b>Hoy</b><span>Sin PayPal ni tarjeta internacional no hay forma de pagar en la tienda.</span></div></div>
          <div class="paso-ad bien">${px('rayo')}<div><b>Con la web nueva</b><span>Pagas en bolívares, USDT o Zinli y el rango llega solo al juego. Sin tickets ni capturas.</span></div></div>
        </div>
        <a class="btn mora" href="#tienda" style="margin-top:20px" data-ir-bs>Ver la tienda en bolívares</a></div>
      <div class="reveal"><p class="label">&gt; ${mml ? esc(mml[1]) + ', el artículo destacado' : 'ejemplo'}</p>${bloqueMetodos(mml ? mml[2] : 9.45)}</div>
    </div></section>
    <section><div class="wrap">
      <p class="label reveal">&gt; accesos rápidos</p><h2 class="reveal">Todo en un solo lugar</h2>
      <div class="accesos">
        <a class="card hover acceso reveal" href="#tienda">${px('cofre', 'class="icono"')}<h3>Tienda</h3><p>${todos().length} artículos de la tienda actual, en dólares o en bolívares.</p><span class="ir">Ver tienda →</span></a>
        <a class="card hover acceso reveal" href="#rangos">${px('corona', 'class="icono"')}<h3>Rangos</h3><p>MM, MMC, MMC+ y MML lado a lado, con todas sus ventajas.</p><span class="ir">Comparar →</span></a>
        <a class="card hover acceso reveal" href="#skywars">${px('trofeo', 'class="icono"')}<h3>SkyWars</h3><p>Ranking por Rating, divisiones y torneos con premio.</p><span class="ir">Ver ranking →</span></a>
        <a class="card hover acceso reveal" href="#comunidad">${px('chat', 'class="icono"')}<h3>Discord</h3><p><b data-vivo="enlinea">…</b> personas conectadas ahora mismo.</p><span class="ir">Entrar →</span></a>
      </div>
    </div></section>
    <section class="alt"><div class="wrap">
      <p class="label reveal">&gt; modalidades</p><h2 class="reveal">Elige cómo jugar</h2>
      <div class="modos">${MODALIDADES.map(tarjetaModalidad).join('')}</div>
    </div></section></div>`;
  },
  modalidades() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; modalidades</p><h1>Cinco formas de jugar</h1><p>Un solo nick para todo: tu rango, tus cosméticos y tus amigos te siguen en todas las modalidades.</p></div>
    <section style="padding-top:10px"><div class="wrap"><div class="modos">${MODALIDADES.map(tarjetaModalidad).join('')}</div>
      <div class="card reveal" style="margin-top:26px"><h3 class="pixel" style="font-size:1rem;margin-bottom:6px">Versiones</h3><p class="muted">De la 1.8 a la 26.2, con cuenta premium o no-premium (los no-premium entran con <b style="color:var(--cian)">/login</b>).</p></div>
    </div></section></div>`;
  },
  rangos(id = 'mml') {
    const r = RANGOS.find(x => x.id === id) || RANGOS[3];
    const planes = r.planes.map(producto).filter(Boolean);
    const base = planes[0]?.p;
    const celda = v => v === 1 ? '<td class="si">✔</td>' : v === 0 ? '<td class="no">✕</td>' : `<td>${esc(v)}</td>`;
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; rangos</p><h1>Rangos</h1><p>Valen en toda la network. Precios y ventajas tal como están en la tienda actual.</p></div>
    <div class="wrap" style="padding-bottom:30px">
      <div class="rango-tabs">${RANGOS.map(x => { const p = producto(x.planes[0])?.p; return `<a class="rango-tab ${x === r ? 'on' : ''}" style="--c:${x.c}" href="#rangos/${x.id}">${p ? `<img src="${esc(imagen(p, 80))}" alt="">` : ''}${x.nombre}</a>`; }).join('')}</div>
      <div class="rango-detalle" style="--c:${r.c}">
        <div class="card rango-lado">${base ? `<img src="${esc(imagen(base, 420))}" alt="">` : ''}<h2>${r.nombre}</h2><p class="muted">Desde ${precio(base?.[2])}</p>
          <div class="planes">${planes.map(({ p }) => `<div class="plan"><div><b>${esc(p[1].split('|')[1]?.trim() || p[1])}</b><small>≈ ${precioAlt(p[2])}</small></div><div style="display:flex;align-items:center;gap:10px"><span class="p">${precio(p[2])}</span><button class="btn sm" data-add="${p[0]}">+</button></div></div>`).join('')}</div>
        </div>
        <div class="card ventajas">${base ? descHtml(base[5]) : ''}</div>
      </div>
      <h2 style="margin-top:50px" class="reveal">Comparativa</h2>
      <div class="card reveal tabla-scroll"><table class="tabla"><tr><th>Ventaja</th>${RANGOS.map(x => `<th style="color:${x.c}">${x.nombre}</th>`).join('')}</tr>
        <tr><td>Precio 1 mes</td>${RANGOS.map(x => `<td class="rango">${precio(producto(x.planes[0])?.p[2])}</td>`).join('')}</tr>
        ${COMPARATIVA.map(([n, ...v]) => `<tr><td>${esc(n)}</td>${v.map(celda).join('')}</tr>`).join('')}</table>
        <p class="muted" style="font-size:0.85rem;margin-top:10px">"—" significa que la descripción de ese rango en la tienda no lo menciona.</p></div>
      ${(() => { const up = CATALOGO.find(s => s.slug === 'rangos')?.categorias.find(c => c.slug === 'actualizar-rango'); return up ? `<h2 style="margin-top:50px" class="reveal">¿Ya tienes rango? Súbelo</h2><div class="productos">${up.productos.map(p => tarjetaProducto(p, { nombre: 'Rangos' })).join('')}</div>` : ''; })()}
    </div></div>`;
  },
  tienda(secSlug, catSlug) {
    const s = CATALOGO.find(x => x.slug === secSlug) || CATALOGO[0];
    const cat = s.categorias.find(c => c.slug === catSlug) || s.categorias[0];
    return `<div class="vista"><div class="wrap">
      <div class="cabecera" style="padding-bottom:22px"><p class="label">&gt; tienda oficial</p><h1>Tienda</h1><p>Los ${todos().length} artículos de la tienda actual. Pagas como te quede cómodo y lo recibes en el juego al momento.</p></div>
      <div class="card pago-local"><div class="iconos">${px('telefono')}${px('usdt')}${px('billetera')}</div>
        <div><h3>Pago Móvil, Binance Pay y Zinli</h3><p>Precios en bolívares a <b data-vivo="tasa">…</b> por dólar (<span data-vivo="tasa-nota"></span>). PayPal y tarjeta siguen disponibles.</p></div>
        ${selectorMoneda()}</div>
      <div class="tienda">
        <aside class="lateral">
          <div class="card mods">${CATALOGO.map(x => `<div class="grupo">${px(x.icono)} ${esc(x.nombre)}</div>
            ${x.categorias.map(c => `<a href="#tienda/${x.slug}/${c.slug}" class="${cat === c ? 'activo' : ''}">${esc(c.nombre)} <small>${c.productos.length}</small></a>`).join('')}`).join('')}
          </div>
          <div class="card widget"><h4>Compras recientes <span class="ejemplo">ejemplo</span><span class="en-vivo">EN VIVO</span></h4><ul class="feed" id="feed"></ul></div>
        </aside>
        <div>
          <select class="cat-movil" id="cat-movil" aria-label="Categoría">${CATALOGO.map(x => `<optgroup label="${esc(x.nombre)}">${x.categorias.map(c => `<option value="${x.slug}/${c.slug}" ${cat === c ? 'selected' : ''}>${esc(c.nombre)} (${c.productos.length})</option>`).join('')}</optgroup>`).join('')}</select>
          <div class="barra-tienda"><h2>${esc(cat.nombre)}</h2>
            <label class="buscar">${px('gema', 'style="width:18px;height:18px;flex:none"')}<input id="buscar" placeholder="Buscar en toda la tienda…"></label>
            <select class="orden" id="orden" aria-label="Orden"><option value="">Orden de la tienda</option><option value="asc">Precio ↑</option><option value="desc">Precio ↓</option></select>
          </div>
          <p class="muted" style="margin:0 0 16px;font-size:0.9rem">${esc(s.nombre)} · ${cat.productos.length} artículos${moneda === 'VES' ? ' · en bolívares a la tasa de hoy' : ''}</p>
          <div class="productos" id="productos" data-sec="${s.slug}" data-cat="${cat.slug}">${cat.productos.map(p => tarjetaProducto(p, s)).join('')}</div>
        </div>
      </div></div></div>`;
  },
  skywars(modo = 'solo') {
    const NOMBRES = ['xNeoMora', 'Kraken_VE', 'LaPandaPvP', 'Zeta_07', 'ElGocho', 'Vortex_YT', 'Nayeli_', 'DarkCatire', 'Brayan2009', 'MoraSlayer', 'Pana_Rush', 'Lucho_mc'];
    const semilla = modo === 'solo' ? 0 : modo === 'equipos' ? 4 : 8;
    const filas = NOMBRES.map((n, i) => NOMBRES[(i + semilla) % NOMBRES.length]).map((n, i) => { const rating = 2460 - i * 97 - (i * i * 3) - semilla * 6; const v = 410 - i * 27 - semilla; return { n, rating, v, k: Math.round(v * (3.1 - i * 0.12)), nivel: 92 - i * 5 }; });
    const div = r => r >= 2200 ? ['Mora', '#e05cb5'] : r >= 1900 ? ['Diamante', '#55ffff'] : r >= 1600 ? ['Oro', '#ffaa00'] : r >= 1300 ? ['Hierro', '#c8c8d8'] : ['Piedra', '#8a8aa0'];
    const insignia = r => { const [n, c] = div(r); return `<span class="division" style="--c:${c}">${n}</span>`; };
    const top = filas.slice(0, 3);
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; skywars</p><h1>SkyWars competitivo</h1><p>Cada partida suma o resta Rating. Sube de división, desbloquea cosméticos por nivel y entra a los torneos.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="grid-3" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        ${[['trofeo', 'Rating y ranking', 'Un sistema de Rating que ordena a los jugadores en un ranking competitivo.'], ['gema', 'Cosméticos animados', 'Cosméticos propios del servidor, animados, que no vas a ver en otro lado.'], ['rayo', 'Niveles', 'Progreso por niveles mientras juegas.'], ['corona', 'Torneos', 'Torneos con premio de 30 USD.']].map(([i, t, d]) => `<div class="card reveal">${px(i, 'class="icono"')}<h3 class="pixel" style="font-size:1rem">${t}</h3><p class="muted">${d}</p></div>`).join('')}
      </div>
      <h2 class="reveal" style="margin-top:54px">Ranking de la temporada <span class="ejemplo">ejemplo</span></h2>
      <div class="filtros">${[['solo', 'Solo'], ['equipos', 'Equipos'], ['historico', 'Histórico']].map(([k, t]) => `<a href="#skywars/${k}" class="${k === modo ? 'on' : ''}">${t}</a>`).join('')}</div>
      <div class="podio">${[1, 0, 2].map(i => `<div class="n${i + 1}"><img src="https://mc-heads.net/body/${SKINS[i + 2]}/120" alt=""><b class="pixel" style="font-size:0.8rem;display:block;margin-bottom:6px;overflow-wrap:anywhere">${top[i].n}</b><div class="bloque"><span>#${i + 1}</span>${top[i].rating}</div></div>`).join('')}</div>
      <div class="card tabla-scroll reveal"><table class="tabla"><tr><th>#</th><th>Jugador</th><th>Rating</th><th>División</th><th>Victorias</th><th>Kills</th><th>Nivel</th></tr>
        ${filas.map((f, i) => `<tr><td class="rango">${i + 1}</td><td style="white-space:nowrap"><img src="https://mc-heads.net/avatar/${SKINS[(i + 2) % SKINS.length]}/20" alt="" style="display:inline;vertical-align:-4px;margin-right:8px">${f.n}</td><td class="rango" style="color:var(--cian)">${f.rating}</td><td>${insignia(f.rating)}</td><td>${f.v}</td><td>${f.k}</td><td>${f.nivel}</td></tr>`).join('')}</table></div>
      <h2 class="reveal" style="margin-top:54px">Cosméticos animados <span class="ejemplo">ejemplo</span></h2>
      <div class="cosmeticos">
        <div class="card cosmetico reveal"><div class="escena"><div class="jaula-c"></div><img class="jug" src="https://mc-heads.net/body/MHF_Alex/80" alt=""></div><h3 class="pixel" style="font-size:0.9rem">Jaula de moras</h3></div>
        <div class="card cosmetico reveal"><div class="escena estela">${Array.from({ length: 8 }, (_, i) => `<i style="left:${40 + i * 6}%;animation-delay:-${i * 0.22}s"></i>`).join('')}<img class="jug" src="https://mc-heads.net/body/MHF_Steve/80" alt=""></div><h3 class="pixel" style="font-size:0.9rem">Estela al caminar</h3></div>
        <div class="card cosmetico reveal"><div class="escena kill">${Array.from({ length: 10 }, (_, i) => `<i style="--a:${i * 36}deg;animation-delay:-${(i % 3) * 0.2}s"></i>`).join('')}</div><h3 class="pixel" style="font-size:0.9rem">Efecto de kill</h3></div>
      </div>
      <div class="card torneo reveal" style="margin-top:54px"><div><p class="label">&gt; próximo torneo</p><h2 style="margin-bottom:8px">Torneo de SkyWars</h2>
        <p class="muted">Inscripción gratis desde el Discord. Fecha y formato <span class="ejemplo">ejemplo</span></p>
        <div class="cuenta-grande" data-cuenta="torneo">${cajasCuenta(FIN_TORNEO)}</div>
        <a class="btn cian" href="#comunidad">Inscribirme en el Discord</a></div>
        <div class="premio"><small>Premio</small><b>30 USD</b><small>≈ ${bs(30)}</small></div></div>
    </div></section></div>`;
  },
  eventos() {
    const surv = CATALOGO.find(s => s.slug === 'survival');
    const boosts = surv ? surv.categorias[0].productos.filter(p => /boost/i.test(p[1])) : [];
    const muestra = lista => lista.filter(p => p[4]).slice(0, 3).map(p => `<div data-ver="${esc(p[0])}"><img src="${esc(imagen(p))}" alt=""><b>${esc(p[1])}</b><br><span class="muted">${precio(p[2])}</span></div>`).join('');
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; eventos</p><h1>Eventos activos</h1><p>Lo de temporada, mientras dure.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="card evento-card reveal"><div>
        <h3>${px('calabaza')} Halloween en Survival</h3>
        <p class="muted">El spawn de Survival se vistió de Halloween. Date una vuelta antes de que lo cambien.</p>
        <div class="cuenta-grande" data-cuenta="halloween">${cajasCuenta(FIN_HALLOWEEN)}</div>
        <p class="muted" style="font-size:0.8rem">Fecha de cierre <span class="ejemplo">ejemplo</span></p>
        <button class="btn" data-copiar style="margin-top:12px">Copiar IP y entrar</button>
      </div><div class="escena" style="height:220px;background:url('fondo.webp') center/cover;border:3px solid #000"></div></div>
      <div class="card evento-card reveal"><div>
        <h3>${px('rayo')} Boost x4 en Survival</h3>
        <p class="muted">El servidor anuncia Boost x4 en el MOTD. Con un boost propio ganas moras, claimblocks y niveles cada 10 minutos, aunque estés AFK.</p>
        <div class="boost-tabla" style="margin-top:14px">
          <div style="--c:#55ff55"><b>x2</b><span>20 moras · 15 claimblocks · 2 niveles</span></div>
          <div style="--c:#55ffff"><b>x3</b><span>30 moras · 17 claimblocks · 3 niveles</span></div>
          <div style="--c:#e05cb5"><b>x4</b><span>40 moras · 20 claimblocks · 4 niveles</span></div>
        </div>
        <p class="muted" style="font-size:0.8rem;margin-top:8px">Cada 10 minutos, durante 5 días. Datos de la tienda.</p>
        <a class="btn" href="#tienda/survival" style="margin-top:14px">Ver boosts</a>
      </div><div class="muestra">${muestra(boosts)}</div></div>
      <div class="card evento-card reveal"><div>
        <h3>${px('trofeo')} Torneo de SkyWars</h3>
        <p class="muted">Torneos con premio de 30 USD (≈ ${bs(30)}). El ganador lo puede cobrar por Pago Móvil o en USDT.</p>
        <a class="btn cian" href="#skywars" style="margin-top:14px">Ver ranking y torneo</a>
      </div><div class="premio" style="text-align:center;padding:26px;background:#000;border:3px solid #000;box-shadow:inset 0 0 0 2px var(--oro)"><b class="pixel" style="font-size:2.6rem;color:var(--oro);text-shadow:3px 3px 0 #000">30 USD</b><p class="muted">premio del torneo</p></div></div>
    </div></section></div>`;
  },
  votar() {
    const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; votar</p><h1>Vota y gana</h1><p>Cada voto ayuda a que más jugadores encuentren Minemora. Vota en todas las listas cada día.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div style="display:grid;gap:18px">${VOTOS.map((v, i) => `
        <div class="card hover voto reveal"><span class="n">${i + 1}</span><div><h3>${esc(v.sitio)}</h3><p class="muted">${esc(v.nota)}</p></div>
          <a class="btn cian" href="${esc(v.url)}" target="_blank" rel="noopener">Votar</a></div>`).join('')}
      </div>
      <div class="grid-2" style="margin-top:30px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Recompensas por voto <span class="ejemplo">ejemplo</span></h3>
          <ul style="color:var(--muted);padding-left:20px;margin-top:10px"><li>Moras en Survival por cada lista</li><li>Claimblocks extra</li><li>Votar en las 2 listas: caja de Halloween</li></ul>
          <h3 class="pixel" style="font-size:0.9rem;margin-top:18px">Tu racha semanal <span class="ejemplo">ejemplo</span></h3>
          <div class="racha">${dias.map((d, i) => `<div class="${i < 4 ? 'hecho' : ''}"><b>${i < 4 ? '✔' : '·'}</b>${d}</div>`).join('')}</div></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Top votantes del mes <span class="ejemplo">ejemplo</span></h3>
          <table class="tabla" style="margin-top:10px"><tr><th>#</th><th>Jugador</th><th>Votos</th></tr>
          ${JUGADORES.slice(0, 5).map((j, i) => `<tr><td>${i + 1}</td><td><img src="https://mc-heads.net/avatar/${SKINS[i]}/20" alt="" style="display:inline;vertical-align:-4px;margin-right:8px">${j}</td><td>${[61, 58, 52, 47, 40][i]}</td></tr>`).join('')}</table></div>
      </div>
    </div></section></div>`;
  },
  wiki(seccion = 'primeros-pasos') {
    const SECCIONES = { 'primeros-pasos': 'Primeros pasos', moras: 'Moras', comandos: 'Comandos', pagos: 'Pagos', normas: 'Normas', faq: 'Preguntas frecuentes' };
    const cuerpo = {
      'primeros-pasos': `<h2>Primeros pasos</h2>
        <ol><li>Abre Minecraft Java (de la 1.8 a la 26.2) y agrega el servidor <b style="color:var(--cian)">${IP}</b>.</li><li>Si no tienes cuenta premium, regístrate y entra con <b>/login</b>.</li><li>Elige tu modalidad en el lobby.</li><li>Únete al Discord para enterarte de eventos y torneos.</li></ol>
        <h3>¿Qué modalidad elijo?</h3><ul>${MODALIDADES.map(m => `<li><b>${m.nombre}</b>: ${esc(m.texto)}</li>`).join('')}</ul>
        <h3>¿Tienes premium ahora?</h3><p>Con "Convertir No-Premium" pasas todo (rango, datos de Survival, amigos, clan, cosméticos y 2FA del Discord) de tu cuenta no-premium a una premium.</p>`,
      moras: `<h2>Moras</h2><p>Las moras son la moneda de Minemora. Se usan en Survival y en la tienda de SkyPvP.</p>
        <h3>Cómo ganar más</h3><ul><li><b>Boost x2</b>: 20 moras cada 10 minutos, estés o no AFK.</li><li><b>Boost x3</b>: 30 moras cada 10 minutos.</li><li><b>Boost x4</b>: 40 moras cada 10 minutos.</li><li><b>MML</b>: ganas el doble de moras por hora que un jugador normal.</li></ul>
        <h3>En SkyPvP</h3><p>Con <b>Sky Plus</b> no gastas moras al comprar en la tienda de SkyPvP ni experiencia al encantar (excepto manzanas de Notch y pociones de fuerza).</p>
        <h3>Claimblocks</h3><p>Los boosts también suman claimblocks cada 10 minutos (15, 17 o 20 según el boost). Los packs de 1000, 3000 y 7000 valen hasta que se reinicie el mundo de Survival.</p>`,
      comandos: `<h2>Comandos de rango</h2><p>Lo que desbloquea cada rango, según la tienda.</p><div class="cmds" style="margin-top:14px">${COMANDOS.map(([c, d, r]) => `<div class="cmd"><code>${c}</code><span>${d}</span><small>${r}</small></div>`).join('')}</div>`,
      pagos: `<h2>Formas de pago</h2><p>Hoy la tienda acepta PayPal y Paymentwall (tarjetas prepago y PaysafeCard). La web nueva suma:</p>
        <ul><li><b>Pago Móvil</b>: en bolívares, con el monto calculado a la tasa oficial del día.</li><li><b>Binance Pay</b>: en USDT, desde la app.</li><li><b>Zinli</b>: con tu saldo en dólares.</li><li><b>PayPal o tarjeta</b>: igual que ahora.</li></ul>
        <p style="margin-top:10px">En todos los casos la compra llega sola al juego. Soporte de pagos: <b style="color:var(--text)">soporte@minemora.net</b>.</p>`,
      normas: `<h2>Normas <span class="ejemplo">ejemplo</span></h2><ol><li>Respeta a todos los jugadores y al staff.</li><li>Prohibidos los hacks, clientes modificados y exploits.</li><li>Nada de spam ni publicidad de otros servidores.</li><li>Prohibidas las multicuentas para saltarse sanciones.</li><li>No compartas datos personales ni cuentas.</li><li>Las sanciones se pueden apelar por Discord.</li></ol>`,
      faq: `<h2>Preguntas frecuentes</h2><div class="faq">
        <details open><summary>¿Puedo pagar en bolívares?</summary><p>Sí. Elige "Bs." arriba para ver los precios en bolívares y paga con Pago Móvil. También puedes pagar en USDT con Binance Pay o con Zinli.</p></details>
        <details><summary>¿Cuánto tarda en llegar mi compra?</summary><p>Llega sola al juego al confirmarse el pago. No hace falta abrir ticket.</p></details>
        <details><summary>¿Los rangos sirven en todas las modalidades?</summary><p>Sí, MM, MMC, MMC+ y MML son de toda la network. Algunas ventajas son de Survival o de los lobbies.</p></details>
        <details><summary>¿Me puedo quitar una sanción?</summary><p>En Extras están Desbaneo, Unmute, Desbaneo de Discord y Quitar Blacklist. No aplican a bans por multicuentas o fraude.</p></details>
        <details><summary>Tuve un problema con un pago</summary><p>Escribe a soporte@minemora.net con tu nick y el comprobante.</p></details></div>`,
    };
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; wiki</p><h1>Wiki</h1><p>Lo que necesitas saber para jugar en Minemora.</p></div>
    <div class="wrap wiki"><div class="card wiki-menu">${Object.entries(SECCIONES).map(([k, v]) => `<a href="#wiki/${k}" class="${k === seccion ? 'activo' : ''}">${v}</a>`).join('')}</div>
    <div class="card wiki-cuerpo">${cuerpo[seccion] || cuerpo['primeros-pasos']}</div></div></div>`;
  },
  comunidad() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; comunidad</p><h1>La comunidad</h1><p>Minemora empezó como un servidor LAN entre amigos y hoy es una de las networks no-premium de habla hispana más conocidas. Todo pasa en el Discord.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="discord reveal">${px('chat', 'class="icono"')}<div><h2>Únete al Discord</h2><p><b data-vivo="miembros">…</b> miembros · <b data-vivo="enlinea">…</b> conectados ahora</p></div>
        <a class="btn cian" href="https://discord.gg/${INVITACION}" target="_blank" rel="noopener">Entrar al Discord</a></div>
      <div class="redes" style="margin-top:26px">${REDES.slice(1).map(r => `<a class="card hover red reveal" href="${r.u}" target="_blank" rel="noopener" style="--c:${r.c}"><i>${r.i}</i><div><b>${r.n}</b><span>${r.t}</span></div></a>`).join('')}</div>
      <div class="grid-2" style="margin-top:26px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Dueños</h3>
          <div class="duenos">${['Tehin', 'Elecast'].map(n => `<div class="dueno"><img src="https://mc-heads.net/avatar/${n}/56" alt=""><div><b>${n}</b><span>DUEÑO</span></div></div>`).join('')}</div></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Contacto</h3><p class="muted" style="margin-top:8px">Pagos: <b style="color:var(--text)">soporte@minemora.net</b><br>Todo lo demás: Discord.</p>
          <p class="muted" style="margin-top:10px"><b style="color:var(--cian)">${IP}</b> · Java 1.8 – 26.2</p><button class="btn sm" data-copiar style="margin-top:12px">Copiar IP</button></div>
      </div>
    </div></section></div>`;
  },
};

/* ======================= enrutador ======================= */
let obsReveal;
function render(mismaVista) {
  const y = scrollY;
  const [ruta = 'inicio', ...args] = (location.hash.slice(1) || 'inicio').split('/');
  const vista = VISTAS[ruta] ? ruta : 'inicio';
  $('#vista').innerHTML = VISTAS[vista](...args);
  $$('#links a').forEach(a => a.classList.toggle('activo', a.dataset.ruta === vista));
  $('#links').classList.remove('abierto');
  $$('[data-moneda]').forEach(b => b.classList.toggle('on', b.dataset.moneda === moneda));
  pintar($('#vista')); pintarVivo(); arrancarFeed();
  obsReveal?.disconnect();
  if (mismaVista === true) { $$('.reveal', $('#vista')).forEach(el => el.classList.add('visible')); scrollTo(0, y); }
  else {
    obsReveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obsReveal.unobserve(e.target); } }), { threshold: 0.12 });
    $$('.reveal', $('#vista')).forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; obsReveal.observe(el); });
    if (!render.primera) scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  }
  render.primera = false;
  if (vista === 'tienda') prepararTienda();
  const logo = $('#logo'); if (logo) logo.onclick = () => estallarEn(logo);
}
render.primera = true;

function prepararTienda() {
  const cont = $('#productos');
  const s = CATALOGO.find(x => x.slug === cont.dataset.sec), cat = s.categorias.find(c => c.slug === cont.dataset.cat);
  const original = cont.innerHTML;
  const aplicar = () => {
    const q = $('#buscar').value.trim().toLowerCase(), orden = $('#orden').value;
    let lista;
    if (q.length >= 2) lista = todos().filter(x => x.p[1].toLowerCase().includes(q) || x.c.nombre.toLowerCase().includes(q));
    else if (orden) lista = cat.productos.map(p => ({ p, s }));
    if (!lista) { cont.innerHTML = original; pintar(cont); return; }
    if (orden === 'asc') lista.sort((a, b) => a.p[2] - b.p[2]);
    if (orden === 'desc') lista.sort((a, b) => b.p[2] - a.p[2]);
    cont.innerHTML = lista.map(x => tarjetaProducto(x.p, x.s)).join('') || '<p class="vacio">Sin resultados.</p>';
    pintar(cont);
  };
  $('#cat-movil').addEventListener('change', e => { location.hash = 'tienda/' + e.target.value; });
  $('#buscar').addEventListener('input', aplicar);
  $('#orden').addEventListener('change', aplicar);
}

/* clics globales: agregar, ver producto, copiar IP, moneda */
document.addEventListener('click', e => {
  const mon = e.target.closest('[data-moneda]');
  if (mon) return ponerMoneda(mon.dataset.moneda);
  if (e.target.closest('[data-ir-bs]')) { moneda = 'VES'; guardar('moneda', 'VES'); pintarCarrito(); }
  const add = e.target.closest('[data-add]');
  if (add) { e.stopPropagation(); const hit = producto(add.dataset.add); if (hit) anadir(hit.p, hit.s, add); return; }
  const ver = e.target.closest('[data-ver]');
  if (ver) return verProducto(ver.dataset.ver);
  const cop = e.target.closest('[data-copiar]');
  if (cop) {
    navigator.clipboard?.writeText(IP).catch(() => {});
    const caja = cop.closest('.ip');
    if (caja) { caja.querySelector('.copiado')?.remove(); caja.insertAdjacentHTML('beforeend', '<span class="copiado">¡IP copiada!</span>'); setTimeout(() => caja.querySelector('.copiado')?.remove(), 1500); }
    else aviso('<b>✔</b> IP copiada. ¡Nos vemos adentro!');
    estallarEn(cop);
  }
});
addEventListener('hashchange', () => render());

/* arranque */
pintar(); pintarSesion(); pintarCarrito();
fetch('data/catalogo.json?v=1').then(r => r.json()).then(d => { CATALOGO = d; render(); })
  .catch(() => { $('#vista').innerHTML = '<p class="vacio">No se pudo cargar el catálogo.</p>'; });
