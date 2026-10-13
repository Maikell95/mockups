/* MineBosh Network · maqueta de web completa (Maikel Ferrer) */
const IP = 'minebosh.net';
const PUERTO_BEDROCK = 19132;
const DISCORD = 'minebosh';
const CDN = 'https://dunb17ur4ymx4.cloudfront.net/packages/images/';
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = n => (n ?? 0).toFixed(2) + ' USD';
const guardar = (k, v) => { try { localStorage.setItem('minebosh-' + k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { const v = localStorage.getItem('minebosh-' + k); return v ? JSON.parse(v) : d; } catch { return d; } };

/* ======================= contenido fijo ======================= */
// Descripciones a partir de lo que vende cada modalidad en la tienda y de los anuncios del Discord
const MODALIDADES = {
  bajobox: { icono: 'pico', tag: 'Box PvP', texto: 'Box PvP con kits de Tierra, Aire y Fuego, bundles Carnero, Electroshock y Burpy, y picos OP como el Detonador y el Dupper.' },
  clashbox: { icono: 'corona', tag: 'Box PvP', texto: 'Box PvP con aire de Clash Royale: kits MiniPekka, Leñador y Arquera; bundles Bruja Nocturna, Mega Caballero y Monje.' },
  pokebox: { icono: 'pokeball', tag: 'Box PvP', texto: 'Box PvP con temática Pokémon: kits SuperBall, UltraBall y MasterBall; bundles Charizard, Articuno y Mew.' },
  worldbox: { icono: 'globo', tag: 'Box PvP', texto: 'Box PvP de países y universo: kits Estelar, Mundial y Universal; bundles China, Rusia y Tierra.' },
  gens: { icono: 'gema', tag: 'Generadores', texto: 'Generadores en tu isla con rankup, GKits refinados, mascotas, cristales, esencias, tokens, perlas, pase de batalla y el Gens Collector.' },
  anarquico: { icono: 'tnt', tag: 'Anárquico', texto: 'Economía con /pedidos, /shop y /vender, spawners de gólems, kits Vikingo, Centurión, Kraken y Brutalizador y herramientas Bosh.' },
  earth: { icono: 'tierra', tag: 'Supervivencia', texto: 'Supervivencia con kits Gem, Titanos, Dragón y Arceus, llaves Apocalípticas y la armadura MineBosh. Las protecciones inactivas más de 30 días se pueden asaltar.' },
  oneblock: { icono: 'bloque', tag: 'Supervivencia', texto: 'Empiezas en un solo bloque y de ahí sale todo. Kits Gem, Titanos, Dragón y Arceus, llaves y dinero infinito.' },
  survivalop: { icono: 'espada', tag: 'Supervivencia', texto: 'Temporada nueva (1.21.8) desde julio de 2026, con 100 USD en GiftCard para el top millonario, el de horas jugadas y el de asesinatos. Kits Némesis, Artemisa, Cerbero y Cronos.' },
  fullpvp: { icono: 'escudo', tag: 'PvP', texto: 'PvP directo: entras, te equipas y a pelear. Kits Tier 14 y Tier 15 y llaves OP.' },
};
const COLOR_RANGO = { Hero: '#7bd88f', Nova: '#19c3c3', Meteor: '#ff8a3d', Gold: '#ffcf3a', Bosh: '#34d64a', Peak: '#b48cff', Ghost: '#e9f1ff' };
const REGLAS = [
  ['Contenido +18', 'No se acepta ningún contenido NSFW en el servidor ni en el Discord.'],
  ['Estafas', 'Prohibidos los enlaces de estafa: Steam falsos, páginas de códigos, etc.'],
  ['Tickets', 'Úsalos solo cuando haga falta; los tickets sin motivo se cierran y pueden sancionarse.'],
  ['Promoción de servidores', 'No se puede mencionar otros servidores por nombre, IP, enlace, vídeo o Discord.'],
  ['Difamación', 'No está permitido desprestigiar ni levantar falsos al staff o al servidor.'],
  ['Hacks y mods ilegales', 'Cualquier modificación ilegal o hack está prohibido.'],
  ['Acoso', 'No se tolera el acoso a otros jugadores.'],
  ['Farmeo de kills', 'Prohibido farmear asesinatos para sacar ventaja.'],
  ['Zona de revisión', 'Si un staff te lleva a la zona de SS, sigue sus indicaciones.'],
  ['Dupe', 'Duplicar objetos con bugs está prohibido.'],
];
const MODS_PROHIBIDOS = ['FireRocketKey', 'Aldeano invisible', 'accurate-block-placement', 'TotemHelp / totemfast', 'Input lag', 'No Input Lag Tick Rate', 'No jump delay', 'Auto Aim', 'InvMove', 'Firework Helper', 'ItemSwapper', 'FixElytraBug', 'Shifttotem', 'HovenTotem', 'Better Place Bind'];
const TICKETS = ['Soporte técnico', 'Reportar a un usuario', 'Reportar un bug', 'Sanciones y anticheat', 'Pagos de la tienda', 'Solicitar revive'];
const VOTOS = [{ sitio: '40 Servidores MC', url: 'https://www.40servidoresmc.es/minebosh/votar', nota: 'Su ficha principal, con más de 650 votos' }];

/* ======================= pixel art ======================= */
const PALETA = { k: '#000', w: '#fff', s: '#c8c8d8', S: '#8a8aa0', b: '#7a5230', d: '#4e3418', r: '#e8332f', R: '#9e1d1a', o: '#ff8a3d', y: '#ffcf3a', Y: '#d99a10', g: '#34d64a', G: '#16a334', h: '#0b5c1c', e: '#3ddc84', u: '#2f6fd6', U: '#1f4fa0', c: '#19c3c3', p: '#b48cff', m: '#a0703a' };
const DIBUJOS = {
  espada: ['.........sss', '........swS.', '.......swS..', '......swS...', '.....swS....', '..b.swS.....', '..bbwS......', '...bb.......', '..bdbb......', '.dd..b......', 'dd..........', 'd...........'],
  pico: ['.ssssssss...', 'sSSSSSSSSs..', '.s.....bSs..', '......bb.s..', '.....bb..s..', '....bb...s..', '...bb.......', '..bb........', '.bb.........', 'bb..........', 'b...........', '............'],
  corona: ['............', 'y....y....y.', 'yy..yyy..yy.', 'yyy.yyy.yyy.', 'yyyyyyyyyyy.', 'yyryyyyyeyy.', 'yyyyyyyyyyy.', 'YYYYYYYYYYY.', '............', '............', '............', '............'],
  pokeball: ['....kkkk....', '..kkrrrrkk..', '.krrrrrrrrk.', '.krrrrrrrrk.', 'krrrrkkrrrrk', 'kkkkkwwkkkkk', 'kwwwwkkwwwwk', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '..kkwwwwkk..', '....kkkk....', '............'],
  globo: ['...uuuuuu...', '..uggUuuuu..', '.uggggUuguu.', 'ugggggUuggUu', 'uuggguuuggUu', 'uuuguuuuuggu', 'uuuuuuguuuuu', 'uuuuugggguuu', '.uuuuggguuu.', '..uuuuguuu..', '...uuuuuu...', '............'],
  tierra: ['...gggggg...', '..gGgggGgg..', '.ggggggggGg.', 'gggGgggggggg', 'mmmmmmmmmmmm', 'mbmmmmbmmmbm', 'mmmmbmmmmmmm', 'mmbmmmmmbmmm', 'mmmmmmbmmmmm', 'mbmmmmmmmmbm', 'mmmmbmmmmmmm', '............'],
  bloque: ['gggggggggggg', 'gGggggGggggg', 'ggggGggggGgg', 'mgmmgmmmgmmg', 'mmmmmmmmmmmm', 'mbmmmmbmmmbm', 'mmmmbmmmmmmm', 'mmbmmmmmbmmm', 'mmmmmmbmmmmm', 'mbmmmmmmmmbm', 'mmmmbmmmmmmm', 'mmmmmmmmmmmm'],
  gema: ['....cccc....', '...cwwccc...', '..cwwcccuc..', '.cwwcccccuu.', 'cwcccccccuuu', '.ccccccccuu.', '..ucccccuu..', '...ucccuu...', '....ucuu....', '.....uu.....', '............', '............'],
  tnt: ['rrrrrrrrrrrr', 'rRrRrRrRrRrr', 'rrrrrrrrrrrr', 'wwwwwwwwwwww', 'wkkkwkwkkkkw', 'wwkwwkkwwkww', 'wwkwwkwkwkww', 'wwkwwkwkwkww', 'wwwwwwwwwwww', 'rrrrrrrrrrrr', 'rRrRrRrRrRrr', 'rrrrrrrrrrrr'],
  escudo: ['.SSSSSSSSSS.', 'SssssssssssS', 'SsggggggggsS', 'SsggwggwggsS', 'SsggwwwwggsS', 'SsggwggwggsS', 'SsggwggwggsS', '.SsggggggsS.', '.SsggggggsS.', '..SsggggsS..', '...SssssS...', '....SSSS....'],
  llave: ['............', '..yyy.......', '.yYYYy......', '.yY.Yy......', '.yYYYyyyyyyy', '..yyy....y.y', '.........y.y', '............', '............', '............', '............', '............'],
  cofre: ['............', '.bbbbbbbbbb.', 'bddddddddddb', 'bdbbbbbbbbdb', 'bbbbbbbbbbbb', 'kkkkkyykkkkk', 'bbbbbyybbbbb', 'bdbbbbbbbbdb', 'bdbbbbbbbbdb', 'bddddddddddb', '.bbbbbbbbbb.', '............'],
  loro: ['............', '....rrr.....', '...rrkrr....', '..yrrrrr....', '..y.rrrrr...', '....rrrrrr..', '....rrruuR..', '.....rruuuR.', '......ryy...', '.......y....', '......y.y...', '............'],
  hoja: ['......g.....', '.....gGg....', '....gGgGg...', '...gGgggGg..', '..gGggGggGg.', '..ggGgggGgg.', '...gggGggg..', '....ggGgg...', '.....ggg....', '......b.....', '......b.....', '............'],
};
function pintar(raiz = document) {
  $$('svg[data-pixel]:not([data-ok])', raiz).forEach(svg => {
    const filas = DIBUJOS[svg.dataset.pixel]; if (!filas) return;
    svg.setAttribute('viewBox', `0 0 ${filas[0].length} ${filas.length}`);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.innerHTML = filas.map((f, y) => [...f].map((ch, x) => PALETA[ch] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${PALETA[ch]}"/>` : '').join('')).join('');
    svg.dataset.ok = 1;
  });
}

/* ======================= selva: hojas que caen, luciérnagas y loros ======================= */
(() => {
  const lienzo = $('#selva'), ctx = lienzo.getContext('2d');
  // Hojas de selva: 4 tipos y 3 tonos de verde. Se pintan una vez en un lienzo pequeño y luego se giran al caer.
  const TIPOS_HOJA = {"ovalada": ["........aab.", "......aabbbb", ".....abbbcbb", "....abbbcbbb", "...abbbcbbb.", "..abbbcbbb..", "..abbcbbb...", ".abbcbbb....", ".abcbbb.....", ".acbb.......", "tt..........", "t..........."], "larga": ["..............ab", ".............abb", "...........aabbc", ".........aabbbc.", ".......aabbbcc..", ".....aabbbcc....", "...aabbbcc......", ".aabbbcc........", "tbbcc...........", "t..............."], "ancha": ["......a......", ".....abb.....", "....abbcb....", "...abbbcbb...", "..abbbbcbbb..", ".abbcbbcbbcb.", "abbbbcbcbcbbc", "abbbbbcccbbbc", "abbbbbbcbbbbc", ".abbbbbcbbbc.", "..abbbbcbbc..", "...aabbcbc...", "......t......", "......t......"], "redonda": ["..aab..", ".aabbb.", "abbcbbb", "abbcbbc", ".bbcbc.", "..bcc..", "...t...", "...t..."]};
  const PALETAS_HOJA = [{"a": "#9cf06e", "b": "#45c94a", "c": "#1f7a2c", "t": "#6b4a2b"}, {"a": "#6fd65a", "b": "#2f9e3c", "c": "#16592a", "t": "#5a3d22"}, {"a": "#d8f06a", "b": "#9ccf3a", "c": "#5b8a1f", "t": "#6b4a2b"}];
  const PESO_TIPO = [['ovalada', 0.35], ['larga', 0.25], ['ancha', 0.2], ['redonda', 0.2]];
  const cacheHoja = {};
  const lienzoHoja = (tipo, p) => {
    const k = tipo + p; if (cacheHoja[k]) return cacheHoja[k];
    const filas = TIPOS_HOJA[tipo], pal = PALETAS_HOJA[p], c = document.createElement('canvas');
    c.width = Math.max(...filas.map(f => f.length)); c.height = filas.length;
    const g = c.getContext('2d');
    filas.forEach((f, j) => [...f].forEach((ch, i) => { if (pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(i, j, 1, 1); } }));
    return (cacheHoja[k] = c);
  };
  const tipoAlAzar = () => { let r = Math.random(); for (const [t, w] of PESO_TIPO) { if ((r -= w) < 0) return t; } return 'ovalada'; };
  // Guacamayo de perfil (32x24, como los del logo): el cuerpo es fijo y las alas cambian por fotograma.
  const LORO = {"arriba": ["..............KK", ".............KuuK", "............KuuuUK", "...........KuuuuuK", "...........KyyuuuUK", "............KyyyyuuK", ".............KyyyyyuK...KKKK", "..............KrryyyyK.KrrrrK", "...............KrrryyKKrrwwwrK", "................KKrrrKKrwwkwsSK", "................KKKKKKrrrwwssSSK", "..............KKrrrrrrrrrrrKsSK", "KKKKKKK.....KKrrrrorrrrrrrRKSK", "KuuuuuuKKKKKrrrrrrrrrrrrRRK", ".KUuuuuuuuurrrrrrrrrrrrRRK", "..KKUUUuurrRRrrrrrrrRRRK", "....KKKKKUURRRRRRRRRKKK", ".........KKKKKKKKKKK.K", "...................KK", "", "", "", "", ""], "medio": ["", "", "", "", "", "", "........................KKKK", ".......................KrrrrK", "......................KrrwwwrK", "..........KKKKKKKK....KrwwkwsSK", "........KKuuuuyyyyKKKKrrrwwssSSK", ".......KUUuuuuyyyyyrrKrrrrrKsSK", "KKKKKKK.KKUUuuuyyyrrrKrrrrRKSK", "KuuuuuuKKKKKKKKKKKKKKrrrRRK", ".KUuuuuuuuurrrrrrrrrrrrRRK", "..KKUUUuurrRRrrrrrrrRRRK", "....KKKKKUURRRRRRRRRKKK", ".........KKKKKKKKKKK.K", "...................KK", "", "", "", "", ""], "abajo": ["", "", "", "", "", "", "........................KKKK", ".......................KrrrrK", "......................KrrwwwrK", "......................KrwwkwsSK", "................KKKKKKrrrwwssSSK", "..............KKrrrrrrrrrrrKsSK", "KKKKKKK.....KKrrrrorrrrrrrRKSK", "KuuuuuuKKKKKrrKyyyrrKrrrRRK", ".KUuuuuuuuurrrKyyyyrKrrRRK", "..KKUUUuurrRRKuyyyyKRRRK", "....KKKKKUURKuuuyyKRKKK", ".........KKKuuuuuKKK.K", "..........KUuuuuK..KK", "..........KUUuuK", "...........KKKK", "", "", ""]};
  const ALETEO = ['arriba', 'medio', 'abajo', 'medio'];
  const C = {"g": "#3fbf4a", "G": "#16a334", "b": "#7a5230", "r": "#e8332f", "R": "#a51d1a", "o": "#ff7a4a", "y": "#ffcf3a", "Y": "#e09a12", "u": "#3a9cf0", "U": "#1d4fa8", "w": "#ffffff", "k": "#111111", "s": "#e4e0d4", "S": "#7a7466", "K": "#000000"};
  let hojas = [], luces = [], loros = [];
  const hoja = inicio => {
    const e = [2, 2, 3, 3, 3, 4][Math.floor(Math.random() * 6)];
    return { x: Math.random() * innerWidth, y: inicio ? Math.random() * innerHeight : -40, e, tipo: tipoAlAzar(), p: Math.floor(Math.random() * PALETAS_HOJA.length),
      v: (0.25 + Math.random() * 0.4) * (0.7 + e * 0.15), rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.02, vuelta: 600 + Math.random() * 900, o: Math.random() * 6.3,
      alfa: 0.5 + e * 0.1 };
  };
  const luz = () => ({ x: Math.random() * innerWidth, y: innerHeight * (0.35 + Math.random() * 0.65), t: Math.random() < 0.3 ? 3 : 2, o: Math.random() * 6.3 });
  // Cada loro vuela con su altura, velocidad y tamaño (los pequeños parecen más lejos); a veces en bandada.
  const loro = (base) => {
    const izq = base ? base.v > 0 : Math.random() < 0.5;
    const e = base ? base.e : (Math.random() < 0.35 ? 2 : 3);  // 2 = lejos (64 px), 3 = cerca (96 px)
    return { x: base ? base.x - (izq ? 1 : -1) * (100 + Math.random() * 70) : (izq ? -110 : innerWidth + 110), y: base ? base.y + 25 + Math.random() * 35 : 175 + Math.random() * innerHeight * 0.35,
      v: base ? base.v * (0.95 + Math.random() * 0.1) : (izq ? 1 : -1) * (1.5 + Math.random() * 1.1) * (e === 2 ? 0.75 : 1), e, o: Math.random() * 6.3, fase: Math.random() * 4, planeo: 0 };
  };
  const ajustar = () => {
    lienzo.width = innerWidth * devicePixelRatio; lienzo.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;
    hojas = Array.from({ length: Math.round(innerWidth * innerHeight / 38000) }, () => hoja(true));
    luces = Array.from({ length: Math.round(innerWidth * innerHeight / 30000) }, luz);
  };
  // Al dar la vuelta se usa el ancho del sprite completo (las filas no miden todas lo mismo).
  const dibujarSprite = (filas, x, y, e, espejo) => {
    const ancho = Math.max(...filas.map(f => f.length));
    filas.forEach((f, j) => [...f].forEach((ch, i) => { if (C[ch]) { ctx.fillStyle = C[ch]; ctx.fillRect(Math.round(x + (espejo ? ancho - 1 - i : i) * e), Math.round(y + j * e), e, e); } }));
  };
  let proximo = 0;
  const dibujar = ms => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const l of luces) { ctx.globalAlpha = Math.max(0, Math.sin(ms / 500 + l.o)) * 0.8; ctx.fillStyle = '#e8ff8a'; ctx.fillRect(Math.round(l.x + Math.sin(ms / 1500 + l.o) * 12), Math.round(l.y + Math.cos(ms / 1700 + l.o) * 8), l.t, l.t); }
    for (const h of hojas) {
      h.y += h.v; h.x += Math.sin(ms / 900 + h.o) * 0.6; h.rot += h.vr + Math.sin(ms / 1100 + h.o) * 0.004;
      // El ancho cambia con el tiempo para que parezca que la hoja da vueltas al caer.
      const giro = Math.cos(ms / h.vuelta + h.o);
      const img = lienzoHoja(h.tipo, h.p);
      ctx.save(); ctx.globalAlpha = h.alfa; ctx.translate(Math.round(h.x), Math.round(h.y)); ctx.rotate(h.rot);
      ctx.scale(h.e * (0.25 + 0.75 * Math.abs(giro)) * Math.sign(giro || 1), h.e);
      ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
      if (h.y > innerHeight + 40) Object.assign(h, hoja(false));
    }
    ctx.globalAlpha = 1;
    if (ms > proximo && loros.length < 3) {
      const guia = loro(); loros.push(guia);
      if (Math.random() < 0.4) { loros.push(loro(guia)); if (Math.random() < 0.4) loros.push(loro(guia)); }
      proximo = ms + 5000 + Math.random() * 8000;
    }
    loros = loros.filter(b => {
      b.x += b.v;
      // Alterna aleteo y planeo: al planear baja un poco con las alas abiertas.
      if (b.planeo > 0) b.planeo--; else if (Math.random() < 0.006) b.planeo = 60 + Math.random() * 80;
      const ala = b.planeo > 0 ? 'medio' : ALETEO[Math.floor(ms / 95 + b.fase) % 4];
      const impulso = ala === 'abajo' ? -1.5 : ala === 'arriba' ? 1 : 0;
      b.y += b.planeo > 0 ? 0.25 : -0.08;
      const y = b.y + Math.sin(b.x / 160 + b.o) * 14 + impulso * b.e;
      ctx.globalAlpha = b.e === 2 ? 0.75 : 1;
      dibujarSprite(LORO[ala], b.x, y, b.e, b.v < 0);
      ctx.globalAlpha = 1;
      return b.x > -280 && b.x < innerWidth + 280;
    });
    if (!reducido) requestAnimationFrame(dibujar);
  };
  ajustar(); addEventListener('resize', ajustar); requestAnimationFrame(dibujar);
})();

/* ======================= datos en vivo ======================= */
const vivo = { jugadores: null, maximo: null, miembros: null, enLinea: null };
const contar = (el, total, suf = '') => {
  if (!el) return;
  const t0 = performance.now();
  const paso = t => { const k = reducido ? 1 : Math.min(1, (t - t0) / 1300); el.textContent = Math.round(total * (1 - (1 - k) ** 3)).toLocaleString('es') + suf; if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
};
const pintarVivo = () => {
  $$('[data-vivo="jugadores"]').forEach(el => vivo.jugadores != null ? contar(el, vivo.jugadores) : null);
  $$('[data-vivo="miembros"]').forEach(el => vivo.miembros != null ? contar(el, vivo.miembros) : null);
  $$('[data-vivo="enlinea"]').forEach(el => vivo.enLinea != null ? contar(el, vivo.enLinea) : null);
};
fetch('https://api.mcstatus.io/v2/status/java/' + IP).then(r => r.json()).then(d => { vivo.jugadores = d.online ? d.players.online : 0; vivo.maximo = d.players?.max; pintarVivo(); }).catch(() => {});
// Si Discord no responde (bloqueos, red), se muestra la última cifra conocida en vez de dejar el hueco.
const DISCORD_RESPALDO = { miembros: 38120, enLinea: 2300 };
fetch(`https://discord.com/api/v10/invites/${DISCORD}?with_counts=true`).then(r => { if (!r.ok) throw r; return r.json(); })
  .then(d => { vivo.miembros = d.approximate_member_count; vivo.enLinea = d.approximate_presence_count; })
  .catch(() => { vivo.miembros = DISCORD_RESPALDO.miembros; vivo.enLinea = DISCORD_RESPALDO.enLinea; })
  .finally(pintarVivo);

/* cuenta atrás al próximo KeyAll (domingos, hora de ejemplo 17:00 de Colombia) */
const proximoKeyAll = () => {
  const ahora = new Date();
  const col = new Date(ahora.getTime() + (ahora.getTimezoneOffset() - 300) * 60000);
  const obj = new Date(col); obj.setHours(17, 0, 0, 0);
  obj.setDate(obj.getDate() + ((7 - obj.getDay()) % 7));
  if (obj <= col) obj.setDate(obj.getDate() + 7);
  return obj - col;
};
const p2 = n => String(n).padStart(2, '0');
setInterval(() => {
  const ms = proximoKeyAll();
  const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
  $('#cuenta').textContent = `${d}d ${p2(h)}h ${p2(m)}m ${p2(s)}s`;
  const g = $('#cuenta-grande'); if (g) g.innerHTML = [[d, 'días'], [h, 'horas'], [m, 'min'], [s, 'seg']].map(([v, l]) => `<div><b>${p2(v)}</b><small>${l}</small></div>`).join('');
}, 1000);

/* ======================= catálogo y rangos ======================= */
let CATALOGO = [];
let RANGOS = [];
const seccion = slug => CATALOGO.find(m => m.slug === slug);
const jugables = () => CATALOGO.filter(m => MODALIDADES[m.slug]);
// Las imágenes de Tebex se sirven reducidas a webp con wsrv.nl
const imagen = (p, w = 240) => p[4] ? `https://wsrv.nl/?url=${encodeURIComponent(CDN.replace('https://', '') + p[4])}&w=${w}&h=${w}&fit=contain&output=webp&q=82` : '';
const icono = (m, w = 96) => m.icono ? `https://wsrv.nl/?url=${encodeURIComponent(m.icono.replace('https://', ''))}&w=${w}&h=${w}&fit=contain&output=webp&q=85` : '';
const iconoDe = p => { const n = (p[1] || '').toLowerCase(); return /llave/.test(n) ? 'llave' : /huevo|mascota|caramelo/.test(n) ? 'hoja' : /cristal|gema|esencia|token|perla/.test(n) ? 'gema' : /spawner|golem/.test(n) ? 'bloque' : 'cofre'; };
const sinImagen = (p, tam) => `<svg class="icono" data-pixel="${iconoDe(p)}" style="width:${tam}px;height:${tam}px;margin:0 auto"></svg>`;
const todosLosProductos = () => CATALOGO.flatMap(m => m.categorias.flatMap(c => c.productos.map(p => ({ p, m, c }))));
const totalDe = m => m.categorias.reduce((s, c) => s + c.productos.length, 0);

/* ======================= sesión y carrito ======================= */
let sesion = leer('sesion', null);
let carrito = leer('carrito', []);
const avatarDe = (nombre, edicion, tam = 32) => edicion === 'java' && /^[A-Za-z0-9_]{3,16}$/.test(nombre || '') ? `https://mc-heads.net/avatar/${nombre}/${tam}` : `https://mc-heads.net/avatar/MHF_Steve/${tam}`;
function pintarSesion() {
  $('#avatar').src = sesion ? avatarDe(sesion.nombre, sesion.edicion) : avatarDe(null);
  $('#nombre-usuario').textContent = sesion ? (sesion.edicion === 'bedrock' ? '.' : '') + sesion.nombre : 'Identifícate';
}
function pintarCarrito() {
  $('#num-carrito').textContent = carrito.reduce((s, l) => s + l.cant, 0);
  $('#lineas').innerHTML = carrito.length ? carrito.map((l, i) => `
    <div class="linea">${l.img ? `<img src="${esc(l.img)}" alt="">` : '<svg class="icono" data-pixel="cofre" style="width:48px;height:48px;margin:0"></svg>'}
      <div><b>${esc(l.nombre)}</b><small class="muted">${esc(l.modalidad)}</small>
        <div class="cant"><button data-menos="${i}">−</button><span>${l.cant}</span><button data-mas="${i}">+</button></div></div>
      <div class="p">${usd(l.precio * l.cant)}</div></div>`).join('') : '<p class="vacio">Tu carrito está vacío.<br>Añade algo de la tienda.</p>';
  $('#total').textContent = usd(carrito.reduce((s, l) => s + l.precio * l.cant, 0));
  guardar('carrito', carrito); pintar($('#lineas'));
}
function anadir(p, m) {
  const ex = carrito.find(l => l.id === p[0]);
  ex ? ex.cant++ : carrito.push({ id: p[0], nombre: p[1], precio: p[2] || 0, img: imagen(p, 96), modalidad: m.nombre, cant: 1 });
  pintarCarrito(); aviso(`<b>✔</b> ${esc(p[1])} añadido al carrito`);
  if (!sesion) setTimeout(() => abrir('#modal-login'), 500);
}

/* ======================= modales y avisos ======================= */
const abrir = sel => { $('#capa').classList.add('on'); $(sel).classList.add('on'); };
const cerrarTodo = () => { $$('.modal.on, .cajon.on').forEach(e => e.classList.remove('on')); $('#capa').classList.remove('on'); };
$('#capa').addEventListener('click', cerrarTodo);
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarTodo(); });
document.addEventListener('click', e => { if (e.target.closest('[data-cerrar]')) cerrarTodo(); });
const aviso = html => { const t = $('#toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2300); };

$('#btn-carrito').addEventListener('click', () => abrir('#cajon'));
$('#btn-pagar').addEventListener('click', () => { if (!carrito.length) return aviso('Tu carrito está vacío'); cerrarTodo(); abrir('#modal-pago'); });
$('#lineas').addEventListener('click', e => {
  const mas = e.target.dataset.mas, menos = e.target.dataset.menos;
  if (mas != null) carrito[mas].cant++;
  if (menos != null) { carrito[menos].cant--; if (carrito[menos].cant <= 0) carrito.splice(menos, 1); }
  pintarCarrito();
});
$('#btn-menu').addEventListener('click', () => $('#links').classList.toggle('abierto'));

let edicion = 'java';
$('#btn-usuario').addEventListener('click', () => { $('#input-usuario').value = sesion?.nombre || ''; abrir('#modal-login'); setTimeout(() => $('#input-usuario').focus(), 200); });
$$('[data-edicion]').forEach(b => b.addEventListener('click', () => { edicion = b.dataset.edicion; $$('[data-edicion]').forEach(x => x.classList.toggle('on', x === b)); previa(); }));
const previa = () => { const n = $('#input-usuario').value.trim(); $('#previa').src = avatarDe(n, edicion, 48); $('#previa-txt').textContent = n ? (edicion === 'bedrock' ? '.' : '') + n : 'Así aparecerás en la tienda'; };
let tPrev; $('#input-usuario').addEventListener('input', () => { clearTimeout(tPrev); tPrev = setTimeout(previa, 350); });
$('#btn-entrar').addEventListener('click', () => {
  const n = $('#input-usuario').value.trim();
  if (!/^[A-Za-z0-9_ ]{3,16}$/.test(n)) return aviso('Escribe un usuario válido (3–16 caracteres)');
  sesion = { nombre: n, edicion }; guardar('sesion', sesion); pintarSesion(); cerrarTodo(); aviso(`<b>✔</b> ¡Hola, ${esc(n)}!`);
});

function verProducto(id) {
  const hit = todosLosProductos().find(x => x.p[0] === id); if (!hit) return;
  const { p, m, c } = hit;
  const lineas = (p[5] || '').split('\n').map(l => l.replace(/^[❄️●\s]+/u, '').trim()).filter(l => l && l !== p[1] && !/^(USD|Comprar|Subscribe|[\d.]+)$/.test(l) && !/no es un producto oficial|revisa que el contenido|incluye el IVA/i.test(l));
  $('#contenido-producto').innerHTML = `
    <h3>${esc(p[1])}</h3>
    <div class="img-grande">${imagen(p) ? `<img src="${esc(imagen(p, 400))}" alt="">` : sinImagen(p, 120)}</div>
    <p class="muted">${esc(m.nombre)} · ${esc(c.nombre)}</p>
    ${lineas.length ? `<ul>${lineas.map(v => `<li>${esc(v)}</li>`).join('')}</ul>` : ''}
    <p class="muted" style="font-size:0.8rem">Descripción tal como aparece en la tienda actual. Se entrega sola en el juego al completar el pago.</p>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px">
      <div class="pixel" style="font-size:1.5rem;color:var(--gold)">${p[2] ? usd(p[2]) : 'Precio a medida'}</div>
      <button class="btn gold" id="btn-add-modal">Añadir</button>
    </div>`;
  pintar($('#contenido-producto'));
  $('#btn-add-modal').onclick = () => { anadir(p, m); cerrarTodo(); };
  abrir('#modal-producto');
}

/* ======================= piezas reutilizables ======================= */
const tarjetaProducto = (p, m) => `<div class="card hover producto" data-ver="${esc(p[0])}">
    <div class="img">${imagen(p) ? `<img loading="lazy" src="${esc(imagen(p))}" alt="">` : sinImagen(p, 80)}</div>
    <div class="nombre">${esc(p[1])}</div>
    <div class="precio">${p[2] ? `${p[2].toFixed(2)} <small>USD</small>` : '<small>a medida</small>'}</div>
    <button class="btn sm" data-add="${esc(p[0])}">Añadir</button>
  </div>`;
const JUGADORES = ['Santi_07', 'xJuanpa', 'NicoPvP', 'Vale.mc', 'ElPaisa22', 'DarkBosh', 'Mafe_Gens', 'BrayanYT', 'TomasBox', 'Luci_09', 'Kevo2011', 'Sami_OP'];
const SKINS = ['MHF_Steve', 'MHF_Alex', 'MHF_Blaze', 'MHF_Enderman', 'MHF_Skeleton', 'MHF_Zombie', 'MHF_Creeper', 'MHF_Villager'];
let feedTimer;
function arrancarFeed() {
  clearInterval(feedTimer);
  const lista = $('#feed'); if (!lista) return;
  const pool = todosLosProductos().filter(x => x.p[2] > 0 && x.p[2] < 120);
  let n = 0;
  const add = hace => {
    if (!pool.length) return;
    const { p, m } = pool[Math.floor(Math.random() * pool.length)];
    const li = document.createElement('li');
    li.innerHTML = `<img src="https://mc-heads.net/avatar/${SKINS[n % SKINS.length]}/28" alt=""><div><b>${JUGADORES[n % JUGADORES.length]}</b><span>${esc(p[1])} · ${esc(m.nombre)}</span></div><span style="margin-left:auto;color:var(--muted);font-size:0.75rem;white-space:nowrap">${hace}</span>`;
    lista.prepend(li); while (lista.children.length > 6) lista.lastChild.remove(); n++;
  };
  ['hace 5 h', 'hace 3 h', 'hace 2 h', 'hace 1 h', 'hace 25 min', 'hace 4 min'].forEach(add);
  if (!reducido) feedTimer = setInterval(() => add('ahora'), 5000);
}
const widgets = () => `
  <div class="card widget"><h4><svg data-pixel="corona" style="width:20px;height:20px"></svg> Top comprador <span class="ejemplo">ejemplo</span></h4>
    <div class="top-donador"><img src="https://mc-heads.net/avatar/MHF_Enderman/44" alt=""><div><b>Jugador****</b><br><span class="muted" style="font-size:0.85rem">El que más compró este mes</span></div></div></div>
  <div class="card widget"><h4>Compras recientes <span class="en-vivo">EN VIVO</span></h4><ul class="feed" id="feed"></ul></div>
  <div class="card widget"><h4>Mega KeyAll (x2 llaves de kits)</h4><div class="meta-bar"><i id="meta"></i></div><p class="muted" style="font-size:0.85rem">Meta de la comunidad: al 100 %, KeyAll doble para todos.</p></div>`;
const ip = () => `<div class="ip"><div><small>Java 1.16 – 1.21</small><code>${IP}</code></div><div><small>Bedrock · puerto</small><code>${PUERTO_BEDROCK}</code></div><button class="btn" data-copiar>Copiar IP</button></div>`;

/* --- comparador de rangos --- */
const NIVELES = ['Hero', 'Nova', 'Meteor', 'Gold', 'Bosh', 'Peak', 'Ghost'];
const fila = (etq, v, max) => {
  const inf = v === '∞';
  const pct = inf ? 100 : Math.round((Number(v) / max) * 100);
  return `<div class="limite"><span>${etq}</span><div class="barra"><i style="width:${pct}%"></i></div><b>${inf ? '∞' : v}</b></div>`;
};
function fichaRango(nombre) {
  const r = RANGOS.find(x => x.nombre === nombre); if (!r) return '';
  const max = k => Math.max(...RANGOS.map(x => x.limites[k] === '∞' ? 0 : Number(x.limites[k])));
  return `<div class="ficha-rango" style="--rc:${COLOR_RANGO[nombre]}">
    <div class="ficha-cab"><span class="insignia pixel">${nombre}</span>
      <div class="precios"><div><small>En una modalidad</small><b>${usd(r.precioModalidad)}</b></div><div><small>Global (todas)</small><b>${usd(r.precioGlobal)}</b></div></div></div>
    <div class="grid-2" style="gap:26px">
      <div><h4 class="pixel">Límites del rango global</h4>
        ${fila('Hogares', r.limites.hogares, max('hogares'))}${fila('Protecciones', r.limites.protecciones, max('protecciones'))}${fila('Misiones a la vez', r.limites.misiones, max('misiones'))}
        ${fila('Tumbas', r.limites.tumbas, max('tumbas'))}${fila('Objetos en subasta', r.limites.subasta, max('subasta'))}${fila('Tiendas en cofres', r.limites.tiendas, max('tiendas'))}</div>
      <div><h4 class="pixel">Comandos que desbloquea</h4><div class="chips">${r.comandos.map(c => `<span>${esc(c)}</span>`).join('')}</div>
        <h4 class="pixel" style="margin-top:18px">Kit en cada modalidad</h4><p class="muted">${r.kitDias ? `Kit especial del rango cada ${r.kitDias} días, más los kits de los rangos inferiores.` : 'Kit especial del rango y acceso a mochilas y tradeos de tu rango.'}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><a class="btn sm" href="#tienda/rangos-globales/permanentes">Comprar global</a><a class="btn sm ghost" href="#modalidades">Elegir modalidad</a></div></div>
    </div></div>`;
}

/* ======================= vistas ======================= */
const VISTAS = {
  inicio() {
    return `<div class="vista">
    <header class="hero"><div class="hero-fondo"></div><div class="wrap">
      <div class="logo-wrap"><img src="logo.webp" alt="MineBosh"></div>
      <div class="stats">
        <span class="stat"><span class="dot"></span><b data-vivo="jugadores">…</b> jugando ahora</span>
        <span class="stat">Discord <b data-vivo="miembros">…</b> miembros</span>
        <span class="stat"><b>${jugables().length}</b> modalidades</span>
      </div>
      <h1>Diez mundos,<br><span class="brillo">una sola network</span></h1>
      <p class="lead">Box PvP, Gens, Anárquico, Earth, OneBlock, Survival OP y FullPvP. Java y Bedrock, con rangos que valen en una modalidad o en todas.</p>
      ${ip()}
    </div></header>
    <section class="alt"><div class="wrap">
      <p class="label reveal">&gt; modalidades</p><h2 class="reveal">¿A qué quieres jugar hoy?</h2>
      <div class="mods-grid">${jugables().map(m => tarjetaModalidad(m, true)).join('')}</div>
      <a class="btn ghost" href="#modalidades" style="margin-top:26px">Ver todas con detalle</a>
    </div></section>
    <section><div class="wrap">
      <p class="label reveal">&gt; rangos</p><h2 class="reveal">Modalidad, global o Prime</h2>
      <div class="tres-rangos">${tresRangos()}</div>
      <a class="btn" href="#rangos" style="margin-top:26px">Comparar rangos</a>
    </div></section>
    <section class="alt"><div class="wrap">
      <p class="label reveal">&gt; accesos rápidos</p><h2 class="reveal">Todo en un sitio</h2>
      <div class="accesos">
        <a class="card hover acceso reveal" href="#tienda"><svg class="icono" data-pixel="cofre"></svg><h3>Tienda</h3><p>${todosLosProductos().length} productos, ordenados por modalidad y sin menús repetidos.</p><span class="ir">Ver tienda →</span></a>
        <a class="card hover acceso reveal" href="#eventos"><svg class="icono" data-pixel="llave"></svg><h3>KeyAll</h3><p>Llaves gratis para todos cada domingo en las modalidades Box.</p><span class="ir">Ver eventos →</span></a>
        <a class="card hover acceso reveal" href="#wiki"><svg class="icono" data-pixel="espada"></svg><h3>Wiki</h3><p>Cómo entrar desde Java o Bedrock, reglas, mods prohibidos y soporte.</p><span class="ir">Abrir wiki →</span></a>
        <a class="card hover acceso reveal" href="#comunidad"><svg class="icono" data-pixel="loro"></svg><h3>Discord</h3><p><b data-vivo="enlinea">…</b> personas conectadas ahora mismo.</p><span class="ir">Entrar →</span></a>
      </div>
    </div></section></div>`;
  },
  modalidades() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; modalidades</p><h1>Diez formas de jugar</h1><p>Cada modalidad tiene su progreso, sus kits y su tienda. Los rangos globales y Prime valen en todas.</p></div>
    <section style="padding-top:10px"><div class="wrap"><div class="grid-3">${jugables().map(m => tarjetaModalidad(m)).join('')}</div></div></section></div>`;
  },
  rangos(nivel = 'Gold') {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; rangos</p><h1>¿Qué rango te conviene?</h1><p>Los siete rangos (Hero, Nova, Meteor, Gold, Bosh, Peak y Ghost) existen en cada modalidad y en versión global. Prime es el plan que lo incluye todo.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="tres-rangos">${tresRangos()}</div>
      <h2 style="margin-top:50px">Compara nivel a nivel</h2>
      <div class="selector-rango">${NIVELES.map(n => `<a href="#rangos/${n}" class="${n === nivel ? 'on' : ''}" style="--rc:${COLOR_RANGO[n]}">${n}</a>`).join('')}</div>
      ${fichaRango(NIVELES.includes(nivel) ? nivel : 'Gold')}
      <h2 style="margin-top:50px">Todos los rangos globales</h2>
      <div class="tabla-scroll"><table class="tabla"><tr><th>Rango</th><th>Modalidad</th><th>Global</th><th>Hogares</th><th>Protecciones</th><th>Misiones</th><th>Tumbas</th><th>Subasta</th><th>Tiendas</th><th>Comandos</th></tr>
      ${RANGOS.map(r => `<tr><td class="rango" style="color:${COLOR_RANGO[r.nombre]}">${r.nombre}</td><td>${usd(r.precioModalidad)}</td><td>${usd(r.precioGlobal)}</td><td>${r.limites.hogares}</td><td>${r.limites.protecciones}</td><td>${r.limites.misiones}</td><td>${r.limites.tumbas}</td><td>${r.limites.subasta}</td><td>${r.limites.tiendas}</td><td>${r.comandos.length}</td></tr>`).join('')}
      <tr><td class="rango" style="color:var(--gold)">Prime</td><td colspan="2">79.99 USD/mes · 359.99 USD para siempre</td><td colspan="7">Límites de Ghost en todas las modalidades y recompensas por duplicado</td></tr></table></div>
      <p class="muted" style="margin-top:10px;font-size:0.9rem">Datos tal como aparecen en la tienda actual. Los beneficios pueden cambiar según la temporada de cada modalidad.</p>
    </div></section></div>`;
  },
  tienda(modSlug, catSlug) {
    const m = seccion(modSlug) || seccion('rangos-globales') || CATALOGO[0];
    const cat = m.categorias.find(c => c.slug === catSlug) || m.categorias[0];
    return `<div class="vista"><div class="wrap">
      <div class="cabecera" style="padding-bottom:22px"><p class="label">&gt; tienda oficial</p><h1>Tienda</h1><p>Pagas y lo recibes en el juego al instante. ${todosLosProductos().length} productos de la tienda actual, cada uno en su modalidad.</p></div>
      <div class="tienda">
        <aside class="lateral">
          <div class="card mods">${CATALOGO.map(x => `
            <details ${x.slug === m.slug ? 'open' : ''}><summary>${x.icono ? `<img src="${esc(icono(x, 48))}" alt="" class="mini">` : ''} ${esc(x.nombre)} <small>${totalDe(x)}</small></summary>
              ${x.categorias.map(c => `<a href="#tienda/${x.slug}/${c.slug}" class="${cat === c && x === m ? 'activo' : ''}">${esc(c.nombre)} <small>${c.productos.length}</small></a>`).join('')}
            </details>`).join('')}
          </div>
          ${widgets()}
        </aside>
        <div>
          <select class="cat-movil" id="cat-movil" aria-label="Categoría">${CATALOGO.map(x => `<optgroup label="${esc(x.nombre)}">
            ${x.categorias.map(c => `<option value="${x.slug}/${c.slug}" ${cat === c && x === m ? 'selected' : ''}>${esc(c.nombre)} (${c.productos.length})</option>`).join('')}</optgroup>`).join('')}</select>
          <div class="barra-tienda"><h2>${m.icono ? `<img src="${esc(icono(m, 72))}" alt="" class="mini-h">` : ''}${esc(m.nombre)} · ${esc(cat.nombre)}</h2>
            <label class="buscar">🔍<input id="buscar" placeholder="Buscar en toda la tienda…"></label>
            <select class="orden" id="orden"><option value="">Orden de la tienda</option><option value="asc">Precio ↑</option><option value="desc">Precio ↓</option></select>
          </div>
          ${cat.desc ? `<div class="aviso">ℹ️ ${esc(cat.desc.split('\n')[0])}</div>` : ''}
          ${/rangos|permanentes/i.test(cat.nombre) ? `<div class="aviso">📊 ¿Dudas entre rango de modalidad y global? <a href="#rangos" style="text-decoration:underline">Compáralos aquí</a>.</div>` : ''}
          <div class="productos" id="productos" data-mod="${m.slug}" data-cat="${cat.slug}">${cat.productos.map(p => tarjetaProducto(p, m)).join('') || '<p class="vacio">No hay productos en esta categoría.</p>'}</div>
        </div>
      </div></div></div>`;
  },
  eventos() {
    const box = jugables().filter(m => /box/.test(m.slug)).map(m => m.nombre).join(', ');
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; eventos</p><h1>Eventos y temporadas</h1><p>Lo que pasa cada semana y lo que llega con cada temporada.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="card evento-card reveal" style="margin-bottom:26px"><div>
        <h3><svg data-pixel="llave" style="width:34px;height:34px;display:inline;vertical-align:-6px"></svg> KeyAll de los domingos</h3>
        <p class="muted">Llaves para todos los conectados. Cada domingo en ${esc(box)} y FullPvP; algunas semanas es global y se suman OneBlock, Earth, Gens OP y Survival OP.</p>
        <div class="cuenta-grande" id="cuenta-grande"></div><p class="muted" style="font-size:0.8rem">Hora del KeyAll <span class="ejemplo">ejemplo</span></p>
      </div><div class="muestra-mods">${jugables().slice(0, 6).map(m => `<div>${m.icono ? `<img src="${esc(icono(m, 96))}" alt="">` : `<svg data-pixel="${MODALIDADES[m.slug].icono}" style="width:48px;height:48px;margin:0 auto 6px;display:block"></svg>`}<b>${esc(m.nombre)}</b></div>`).join('')}</div></div>
      <div class="grid-2">
        <div class="card reveal"><h3 class="pixel" style="font-size:1.1rem">Survival OP · nueva temporada</h3><p class="muted" style="margin-top:8px">Desde el 5 de julio de 2026 en la 1.21.8, con muchos errores resueltos y cambios de infraestructura. Premios: 100 USD en GiftCard para el top millonario, el de horas jugadas y el de asesinatos.</p><a class="btn sm" href="#tienda/survivalop" style="margin-top:14px">Ver Survival OP</a></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1.1rem">Gens OP · nueva temporada</h3><p class="muted" style="margin-top:8px">Llegó en junio con Gens Collector, rankup con más niveles, pase de batalla con mejores premios y mascotas rebalanceadas.</p><a class="btn sm" href="#tienda/gens" style="margin-top:14px">Ver Gens</a></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1.1rem">Purga de protecciones</h3><p class="muted" style="margin-top:8px">En Earth y Survival OP, las protecciones con más de 30 días de inactividad se eliminan: las bases abandonadas se pueden asaltar.</p></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1.1rem">Descuentos en la tienda</h3><p class="muted" style="margin-top:8px">Cuando hay descuento activo (como el 70 % de agosto), aquí sale el aviso con la fecha de fin, sin depender de los anuncios del Discord.</p></div>
      </div>
    </div></section></div>`;
  },
  votar() {
    const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; votar</p><h1>Vota y gana</h1><p>Cada voto ayuda a que más jugadores encuentren MineBosh.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div style="display:grid;gap:18px">${VOTOS.map((v, i) => `
        <div class="card hover voto reveal"><span class="n">${i + 1}</span><div><h3>${esc(v.sitio)}</h3><p class="muted">${esc(v.nota)}</p></div>
          <a class="btn gold" href="${esc(v.url)}" target="_blank" rel="noopener">Votar</a></div>`).join('')}
      </div>
      <div class="grid-2" style="margin-top:30px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Recompensas por voto <span class="ejemplo">ejemplo</span></h3>
          <ul style="color:var(--muted);padding-left:20px;margin-top:10px"><li>1 Llave Bosh por voto</li><li>Dinero del juego en tu modalidad</li><li>7 días seguidos: Llave Todo o Nada</li></ul>
          <h3 class="pixel" style="font-size:0.9rem;margin-top:18px">Tu racha semanal <span class="ejemplo">ejemplo</span></h3>
          <div class="racha">${dias.map((d, i) => `<div class="${i < 4 ? 'hecho' : ''}"><b>${i < 4 ? '✔' : '·'}</b>${d}</div>`).join('')}</div></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Top votantes del mes <span class="ejemplo">ejemplo</span></h3>
          <table class="tabla" style="margin-top:10px"><tr><th>#</th><th>Jugador</th><th>Votos</th></tr>
          ${['DarkBosh', 'Mafe_Gens', 'NicoPvP', 'Santi_07', 'Vale.mc'].map((j, i) => `<tr><td>${i + 1}</td><td><img src="https://mc-heads.net/avatar/${SKINS[i]}/20" style="display:inline;vertical-align:-4px;margin-right:8px">${j}</td><td>${[64, 59, 51, 47, 40][i]}</td></tr>`).join('')}</table></div>
      </div>
    </div></section></div>`;
  },
  wiki(seccionW = 'primeros-pasos') {
    const SECCIONES = { 'primeros-pasos': 'Primeros pasos', reglas: 'Reglas', mods: 'Mods prohibidos', soporte: 'Soporte y tickets', faq: 'Preguntas frecuentes' };
    const cuerpo = {
      'primeros-pasos': `<h2>Primeros pasos</h2>
        <h3>Desde Java</h3><ol><li>Abre Minecraft Java (de la 1.16 a la 1.21) y añade el servidor <b style="color:var(--gold)">${IP}</b>.</li><li>Elige tu modalidad en el lobby.</li></ol>
        <h3>Desde Bedrock (móvil, consola, Windows)</h3><ol><li>Añade el servidor <b style="color:var(--gold)">${IP}</b> con el puerto <b style="color:var(--gold)">${PUERTO_BEDROCK}</b>.</li><li>Tu nombre aparecerá con un punto delante (.TuNombre).</li></ol>
        <h3>¿Qué modalidad elijo?</h3><ul>${jugables().map(m => `<li><b>${esc(m.nombre)}</b>: ${esc(MODALIDADES[m.slug].texto)}</li>`).join('')}</ul>`,
      reglas: `<h2>Reglas</h2><p>Resumen de las reglas publicadas en el Discord. Saltártelas puede acabar en sanción.</p><div class="cmds" style="margin-top:14px">${REGLAS.map(([t, d]) => `<div class="cmd" style="flex-direction:column;gap:4px"><code>${t}</code><span>${d}</span></div>`).join('')}</div>`,
      mods: `<h2>Mods prohibidos</h2><p>Estos mods se sancionan, además de cualquier hack o cliente modificado.</p><div class="chips" style="margin-top:14px">${MODS_PROHIBIDOS.map(m => `<span>${m}</span>`).join('')}</div>`,
      soporte: `<h2>Soporte y tickets</h2><p>El soporte se pide abriendo un ticket en el Discord, en la categoría que toque:</p><ul>${TICKETS.map(t => `<li>${t}</li>`).join('')}</ul><p style="margin-top:12px">No etiquetes al staff sin necesidad ni abras tickets sin motivo: se cierran al momento.</p><a class="btn" href="https://discord.gg/${DISCORD}" target="_blank" rel="noopener" style="margin-top:16px">Abrir el Discord</a>`,
      faq: `<h2>Preguntas frecuentes</h2><div class="faq">
        <details open><summary>¿Los rangos son para siempre?</summary><p>Sí, todos los rangos son permanentes. Los de modalidad valen solo en esa modalidad; los globales, en todas. Prime puede ser mensual o permanente.</p></details>
        <details><summary>¿Cuánto tarda en llegar mi compra?</summary><p>Se entrega sola en el juego al completar el pago.</p></details>
        <details><summary>¿Puedo mejorar mi rango sin pagarlo entero?</summary><p>Sí: cada modalidad y los rangos globales tienen "Mejora de rango", que cobra solo la diferencia.</p></details>
        <details><summary>¿Hay reembolsos?</summary><p>No. Todos los pagos son finales; intentar revertir un pago supone un baneo permanente.</p></details>
        <details><summary>Tengo un problema con un pago</summary><p>Abre un ticket de "Pagos de la tienda" en el Discord o escribe a mineboshnetwork@gmail.com.</p></details></div>`,
    };
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; wiki</p><h1>Wiki</h1><p>Todo lo que necesitas para jugar en MineBosh.</p></div>
    <div class="wrap wiki"><div class="card wiki-menu">${Object.entries(SECCIONES).map(([k, v]) => `<a href="#wiki/${k}" class="${k === seccionW ? 'activo' : ''}">${v}</a>`).join('')}</div>
    <div class="card wiki-cuerpo">${cuerpo[seccionW] || cuerpo['primeros-pasos']}</div></div></div>`;
  },
  comunidad() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; comunidad</p><h1>La comunidad</h1><p>Anuncios, eventos, sorteos, tradeos y soporte: todo pasa en el Discord.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="discord reveal"><svg class="icono" data-pixel="loro"></svg><div><h2>Únete al Discord</h2><p><b data-vivo="miembros">…</b> miembros · <b data-vivo="enlinea">…</b> conectados ahora</p></div>
        <a class="btn gold" href="https://discord.gg/${DISCORD}" target="_blank" rel="noopener">Entrar al Discord</a></div>
      <div class="grid-2" style="margin-top:26px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Creadores de contenido</h3><p class="muted" style="margin-top:8px">¿Haces directos o vídeos? Revisa los requisitos de media en el Discord y consigue tu rango.</p></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">IP del servidor</h3><p class="muted" style="margin-top:8px"><b style="color:var(--gold)">${IP}</b> · Bedrock: puerto ${PUERTO_BEDROCK}</p><button class="btn sm" data-copiar style="margin-top:12px">Copiar IP</button></div>
      </div>
    </div></section></div>`;
  },
};
function tresRangos() {
  const g = seccion('rangos-globales'), pr = seccion('prime');
  const min = r => Math.min(...r.map(x => x.precioModalidad)), max = r => Math.max(...r.map(x => x.precioModalidad));
  return `
    <div class="card tipo-rango reveal"><span class="etq">En una modalidad</span><h3>Rango de modalidad</h3><p class="desde">${usd(min(RANGOS))} – ${usd(max(RANGOS))}</p>
      <ul><li>Vale solo en la modalidad donde lo compras</li><li>Kit especial del rango y kits inferiores</li><li>Más mochilas y tradeos exclusivos</li><li>Prefijo, chat de color y rol VIP en Discord</li></ul><a class="btn sm ghost" href="#modalidades">Elegir modalidad</a></div>
    <div class="card tipo-rango destacado reveal"><span class="etq">En todas</span><h3>Rango global</h3><p class="desde">${usd(Math.min(...RANGOS.map(r => r.precioGlobal)))} – ${usd(Math.max(...RANGOS.map(r => r.precioGlobal)))}</p>
      <ul><li>Vale en las ${jugables().length} modalidades</li><li>Recompensas diarias y paquete de llaves</li><li>Más hogares, protecciones, subastas y tiendas</li><li>Comandos extra según el nivel</li></ul><a class="btn sm" href="#tienda/rangos-globales/permanentes">Ver globales</a></div>
    <div class="card tipo-rango prime reveal"><span class="etq">Todo incluido</span><h3>Prime</h3><p class="desde">79.99 USD/mes · 359.99 USD</p>
      <ul><li>Los límites del máximo nivel en todas partes</li><li>Todas las recompensas por duplicado (5 llaves → 10)</li><li>Hogares, protecciones y subastas sin límite</li><li>Mensual o para siempre</li></ul><a class="btn sm gold" href="#tienda/prime">Ver Prime</a></div>`;
}
function tarjetaModalidad(m, mini) {
  const info = MODALIDADES[m.slug];
  return `<a class="card hover modalidad ${mini ? 'mini' : ''} reveal" href="#tienda/${m.slug}">
    <div class="mod-cab">${m.icono ? `<img src="${esc(icono(m, 128))}" alt="" class="mod-img">` : `<svg class="icono" data-pixel="${info.icono}"></svg>`}<span class="tag">${esc(info.tag)}</span></div>
    <h3>${esc(m.nombre)}</h3>${mini ? '' : `<p>${esc(info.texto)}</p>`}
    <div class="meta"><span>${m.categorias.length} categorías</span><span>${totalDe(m)} productos</span></div>
    ${mini ? '' : `<div class="chips">${m.categorias.slice(0, 6).map(c => `<span>${esc(c.nombre)}</span>`).join('')}</div>`}</a>`;
}

/* ======================= enrutador ======================= */
let obsReveal;
function render() {
  const [ruta = 'inicio', ...args] = (location.hash.slice(1) || 'inicio').split('/');
  const vista = VISTAS[ruta] ? ruta : 'inicio';
  $('#vista').innerHTML = VISTAS[vista](...args);
  $$('#links a').forEach(a => a.classList.toggle('activo', a.dataset.ruta === vista));
  $('#links').classList.remove('abierto');
  pintar($('#vista')); pintarVivo(); arrancarFeed();
  const meta = $('#meta'); if (meta) setTimeout(() => meta.style.width = '37%', 300);
  obsReveal?.disconnect();
  obsReveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obsReveal.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.reveal', $('#vista')).forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; obsReveal.observe(el); });
  if (!render.primera && !(vista === 'rangos' && render.anterior === 'rangos')) scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  render.primera = false; render.anterior = vista;
  if (vista === 'tienda') prepararTienda();
}
render.primera = true;

function prepararTienda() {
  const cont = $('#productos'), m = seccion(cont.dataset.mod);
  const original = cont.innerHTML;
  const aplicar = () => {
    const q = $('#buscar').value.trim().toLowerCase(), orden = $('#orden').value;
    let lista;
    if (q.length >= 2) lista = todosLosProductos().filter(x => x.p[1].toLowerCase().includes(q) || x.m.nombre.toLowerCase().includes(q));
    else if (orden) lista = (m.categorias.find(c => c.slug === cont.dataset.cat)?.productos || []).map(p => ({ p, m }));
    if (!lista) { cont.innerHTML = original; return; }
    if (orden === 'asc') lista.sort((a, b) => (a.p[2] || 0) - (b.p[2] || 0));
    if (orden === 'desc') lista.sort((a, b) => (b.p[2] || 0) - (a.p[2] || 0));
    cont.innerHTML = lista.slice(0, 120).map(x => tarjetaProducto(x.p, x.m)).join('') || '<p class="vacio">Sin resultados.</p>';
    pintar(cont);
  };
  $('#cat-movil').addEventListener('change', e => { location.hash = 'tienda/' + e.target.value; });
  $('#buscar').addEventListener('input', aplicar);
  $('#orden').addEventListener('change', aplicar);
}

/* clics globales: añadir, ver producto, copiar IP */
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { e.stopPropagation(); const hit = todosLosProductos().find(x => x.p[0] === add.dataset.add); if (hit) anadir(hit.p, hit.m); return; }
  const ver = e.target.closest('[data-ver]');
  if (ver) return verProducto(ver.dataset.ver);
  if (e.target.closest('[data-copiar]')) { navigator.clipboard?.writeText(IP).catch(() => {}); aviso('<b>✔</b> IP copiada. ¡Nos vemos en la selva!'); }
});
addEventListener('hashchange', render);

/* arranque */
pintar(); pintarSesion(); pintarCarrito();
Promise.all([fetch('data/catalogo.json').then(r => r.json()), fetch('data/rangos.json').then(r => r.json())])
  .then(([cat, rangos]) => { CATALOGO = cat; RANGOS = rangos; render(); })
  .catch(() => { $('#vista').innerHTML = '<p class="vacio">No se pudo cargar el catálogo.</p>'; });
