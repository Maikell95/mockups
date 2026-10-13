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
    const e = [1, 1, 1, 2, 2, 2][Math.floor(Math.random() * 6)];   // pequeñas
    return { x: Math.random() * innerWidth, y: inicio ? Math.random() * innerHeight : -40, e, tipo: tipoAlAzar(), p: Math.floor(Math.random() * PALETAS_HOJA.length),
      v: (0.25 + Math.random() * 0.4) * (0.7 + e * 0.15), rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.02, vuelta: 600 + Math.random() * 900, o: Math.random() * 6.3,
      alfa: 0.5 + e * 0.1 };
  };
  const luz = () => ({ x: Math.random() * innerWidth, y: innerHeight * (0.35 + Math.random() * 0.65), t: Math.random() < 0.3 ? 3 : 2, o: Math.random() * 6.3 });
  // Guacamayo posado (de perfil, mirando a la derecha): cabeza arriba, ala amarilla y azul, cola colgando.
  const POSADO = ['....KKKK....', '...KrrrrK...', '..KrrwwkK...', '..KrrwwrsK..', '..KrrrrrSK..', '..KrrrrrK...', '.KryyrrrK...', '.KryyyrrK...', '.KruuyyrK...', '.KruuurrK...', '..KuuurK....', '..KkKKkK....', '...KuuK.....', '...KuuK.....', '...KuUK.....', '....KK......'];
  // Dónde se posan (en las coordenadas 0–2000 × 0–400 de cada capa del paisaje): barandilla, ramas y tejado
  // del árbol gigante y las copas de los árboles que sobresalen.
  const AX = 1720;
  const PERCHAS_ARBOL = [['.paisaje .pj-arbol', AX - 85, 140], ['.paisaje .pj-arbol', AX + 180, 140], ['.paisaje .pj-arbol', AX - 52, 210], ['.paisaje .pj-arbol', AX + 160, 180], ['.paisaje .pj-arbol', AX, 62]];
  const perchas = () => PERCHAS_ARBOL.concat(window.__perchasSelva || []);   // las de la selva se generan con los árboles
  const enPantalla = ([sel, x, y]) => {
    const el = $(sel); if (!el) return null;
    const c = el.getBoundingClientRect(), esc = Math.max(c.width / 2000, c.height / 400);
    const ox = (el.getAttribute('preserveAspectRatio') || '').startsWith('xMax') ? c.width - 2000 * esc : (c.width - 2000 * esc) / 2;
    return { x: c.left + ox + x * esc, y: c.top + c.height - 400 * esc + y * esc };
  };
  const E = 1.5;   // tamaño de cada píxel del loro (pequeños)
  const perchaLibre = (actual) => {
    const ocupadas = new Set(loros.map(l => l.percha));
    const P = perchas();
    const libres = P.map((p, i) => i).filter(i => i !== actual && !ocupadas.has(i)).filter(i => { const p = enPantalla(P[i]); return p && p.x > 20 && p.x < innerWidth - 20 && p.y > 120 && p.y < innerHeight - 20; });
    return libres.length ? libres[Math.floor(Math.random() * libres.length)] : null;
  };
  const loro = (ahora) => {
    const p = perchaLibre(null); if (p === null) return null;
    const izq = Math.random() < 0.5;
    return { estado: 'vuela', percha: p, desde: { x: izq ? -60 : innerWidth + 60, y: 120 + Math.random() * innerHeight * 0.3 }, t0: ahora, dur: 4000 + Math.random() * 2500, fase: Math.random() * 4 };
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
    filas.forEach((f, j) => [...f].forEach((ch, i) => { if (C[ch]) { ctx.fillStyle = C[ch]; ctx.fillRect(Math.round(x + (espejo ? ancho - 1 - i : i) * e), Math.round(y + j * e), Math.ceil(e), Math.ceil(e)); } }));
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
    if (ms > proximo && loros.length < 3) { const l = loro(ms); if (l) loros.push(l); proximo = ms + 4000 + Math.random() * 6000; }
    const suave = k => k * k * (3 - 2 * k);
    loros = loros.filter(b => {
      const destino = b.percha === null ? b.salida : enPantalla(perchas()[b.percha]);
      if (!destino) return false;
      if (b.estado === 'posado') {
        // posado: de vez en cuando se gira; al rato despega hacia otra percha o se va de la pantalla
        if (ms > b.gira) { b.mira = !b.mira; b.gira = ms + 1500 + Math.random() * 3000; }
        dibujarSprite(POSADO, destino.x - 6 * E, destino.y - 16 * E, E, b.mira);
        if (ms > b.hasta) {
          const otra = Math.random() < 0.6 ? perchaLibre(b.percha) : null;
          b.desde = { x: destino.x, y: destino.y - 10 * E }; b.t0 = ms; b.estado = 'vuela';
          if (otra !== null) { b.percha = otra; b.dur = 2500 + Math.random() * 2000; }
          else { b.percha = null; b.salida = { x: Math.random() < 0.5 ? -80 : innerWidth + 80, y: 60 + Math.random() * innerHeight * 0.25 }; b.dur = 3500 + Math.random() * 2000; }
        }
        return true;
      }
      // en vuelo: trayectoria en arco desde donde estaba hasta la percha (o fuera de la pantalla)
      const k = Math.min(1, (ms - b.t0) / b.dur), s2 = suave(k);
      const x = b.desde.x + (destino.x - b.desde.x) * s2;
      const y = b.desde.y + (destino.y - 18 * E - b.desde.y) * s2 - Math.sin(Math.PI * k) * 70;
      const ala = k > 0.85 ? 'medio' : ALETEO[Math.floor(ms / 95 + b.fase) % 4];
      dibujarSprite(LORO[ala], x - 16 * E, y - 12 * E, E, destino.x < b.desde.x);
      if (k >= 1) {
        if (b.percha === null) return false;
        b.estado = 'posado'; b.hasta = ms + 4000 + Math.random() * 7000; b.mira = destino.x < b.desde.x; b.gira = ms + 2000;
      }
      return true;
    });
    if (!reducido) requestAnimationFrame(dibujar);
  };
  ajustar(); addEventListener('resize', ajustar); requestAnimationFrame(dibujar);
})();

/* ======================= paisaje de selva (capas con parallax) ======================= */
(() => {
  let semilla = 11;
  const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
  const r = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const preparar = (sel, contenido, alinear = 'xMidYMax') => { const svg = $(sel); if (!svg) return; svg.setAttribute('viewBox', '0 0 2000 400'); svg.setAttribute('preserveAspectRatio', alinear + ' slice'); svg.innerHTML = contenido; };
  // Perfil de bloques que cambia en cada bloque, como el terreno de Minecraft.
  const cordillera = (base, amp, bloque, suave) => {
    let d = 'M0 400 V' + base, previo = base;
    for (let x = 0; x <= 2000; x += bloque) {
      const onda = base - amp * (0.5 + 0.5 * Math.sin(x / suave) * Math.cos(x / (suave * 2.7) + 1));
      let y = Math.round((onda + (azar() - 0.5) * amp * 0.45) / 8) * 8;
      if (y === previo) y += azar() < 0.5 ? -8 : 8;
      y = Math.max(16, Math.min(392, y)); previo = y;
      d += ` V${y} H${x + bloque}`;
    }
    return d + ' V400 Z';
  };
  const textura = (id, base, motas, n = 26) => {
    let t = `<rect width="16" height="16" fill="${base}"/>`;
    for (let i = 0; i < n; i++) t += r(Math.floor(azar() * 16), Math.floor(azar() * 16), azar() < 0.3 ? 2 : 1, 1, motas[Math.floor(azar() * motas.length)]);
    return `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">${t}</pattern>`;
  };

  // Hojas de jungla como en Minecraft: grupitos de hojas de varios verdes con huecos oscuros entre ellas.
  const hojasJungla = (id, hueco, tonos) => {
    let t = `<rect width="16" height="16" fill="${hueco}"/>`;
    for (let i = 0; i < 46; i++) t += r(Math.floor(azar() * 16), Math.floor(azar() * 16), azar() < 0.5 ? 2 : 1, azar() < 0.5 ? 2 : 1, tonos[Math.floor(azar() * tonos.length)]);
    for (let i = 0; i < 5; i++) t += r(Math.floor(azar() * 16), Math.floor(azar() * 16), 1, 1, tonos[tonos.length - 1]);
    return `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">${t}</pattern>`;
  };
  // Copa redondeada hecha de filas de bloques con el borde irregular (nada de rectángulos lisos).
  // Copa redondeada hecha de filas de bloques con el borde irregular. La luz llega de arriba a la derecha
  // (de donde vienen los rayos de sol): canto superior y lado derecho iluminados, lado izquierdo y parte baja en sombra.
  const copa = (cx, top, ancho, alto, relleno, luz, sombra) => {
    let c = '';
    for (let j = 0; j < alto; j += 6) {
      const t = (j + 3) / alto, mitad = Math.max(8, (ancho / 2) * Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)) + (azar() - 0.5) * 14);
      const x = Math.round((cx - mitad) / 2) * 2, w = Math.round(mitad) * 2;
      c += r(x, top + j, w, 6, relleno);
      if (j === 0) c += r(x + w * 0.4, top, w * 0.6, 2, luz);              // canto de arriba, sobre todo a la derecha
      c += r(x + w - 4, top + j, 4, 6, luz) + r(x, top + j, 4, 6, sombra);  // lado derecho al sol, izquierdo en sombra
      if (j >= alto - 12) c += r(x, top + j + 3, w, 3, sombra);
    }
    return c;
  };
  // Tronco con la cara derecha iluminada, la izquierda en sombra y raíces abiertas abajo.
  const tronco = (x, top, base, w, corteza, luz, sombra) =>
    r(x, top, w, base - top, corteza) + r(x + w - 2, top, 2, base - top, luz) + r(x, top, 2, base - top, sombra)
    + r(x - 4, base - 10, 4, 10, corteza) + r(x + w, base - 8, 4, 8, corteza) + r(x - 8, base - 4, 4, 4, sombra);

  // 1) Montañas lejanas con la cascada (colores apagados: están lejos).
  const lejos = cordillera(200, 150, 10, 170);
  const XC = 430;   // x de la cascada (en coordenadas 0–2000)
  // Pico rocoso más alto que la cordillera: la cascada sale de una grieta cerca de la cima.
  let pico = 'M290 400', y = 400;
  for (let k = 0; k <= 26; k++) { const x = 290 + k * 10, alt = 400 - Math.min(k, 26 - k) * 30 - azar() * 14; y = Math.round(alt / 6) * 6; pico += ` V${y} H${x + 10}`; }
  pico += ' V400 Z';
  preparar('.paisaje .pj-lejos', `<defs>${textura('pj-roca', '#2d4a35', ['#335440', '#273f2e', '#3a5c44'])}${textura('pj-pico', '#3a4840', ['#46564c', '#2e3a33', '#4f6052', '#3a5c44'], 34)}
    <pattern id="pj-agua-cae" width="12" height="24" patternUnits="userSpaceOnUse">
      ${r(0, 0, 12, 24, '#3a6a80')}${r(2, 0, 2, 10, '#6f9cb2')}${r(7, 6, 2, 12, '#55879e')}${r(4, 14, 2, 8, '#8fb6c8')}${r(9, 18, 2, 6, '#6f9cb2')}
      <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 24" dur="1.1s" repeatCount="indefinite"/></pattern></defs>
    <path d="${lejos}" fill="#5f8a52" transform="translate(0 -2)" shape-rendering="crispEdges"/>
    <path d="${lejos}" fill="url(#pj-roca)" shape-rendering="crispEdges"/>
    <path d="${pico}" fill="#8fae7a" transform="translate(0 -3)" shape-rendering="crispEdges"/>
    <path d="${pico}" fill="url(#pj-pico)" shape-rendering="crispEdges"/>
    <g shape-rendering="crispEdges">${r(XC - 10, 92, 34, 16, '#141c16')}${r(XC - 10, 92, 34, 3, '#2a3a2e')}${r(XC, 100, 16, 300, 'url(#pj-agua-cae)')}${r(XC - 2, 100, 2, 300, '#9fbccc', 'opacity="0.3"')}${r(XC + 16, 100, 2, 300, '#1e3a48', 'opacity="0.5"')}</g>`);

  // 2) Templo de la jungla: pirámide escalonada de piedra musgosa con escalinata, entrada y enredaderas.
  const piedra = textura('pj-piedra', '#5e6458', ['#6f7568', '#4c5248', '#4f7a2c', '#5f8a34', '#3f6626'], 40);
  let templo = '';
  const TX = 700;
  for (const [x, y, w, h] of [[TX, 250, 240, 60], [TX + 25, 205, 190, 45], [TX + 50, 165, 140, 40], [TX + 80, 130, 80, 35]]) {
    templo += r(x, y, w, h, 'url(#pj-piedra)') + r(x, y, w, 3, '#a9c48a') + r(x + w - 8, y + 3, 8, h - 3, '#3e443a');
  }
  templo += r(TX + 100, 140, 40, 25, '#141810') + r(TX + 104, 144, 32, 2, '#2a3022');            // entrada oscura
  for (let y = 165; y < 310; y += 9) templo += r(TX + 96, y, 48, 5, '#7d8373') + r(TX + 96, y + 5, 48, 2, '#4c5248');   // escalinata
  for (let i = 0; i < 22; i++) { const x = TX + 6 + Math.floor(azar() * 228), y = [250, 205, 165, 130][Math.floor(azar() * 4)], l = 8 + Math.floor(azar() * 26); templo += r(x, y + 3, 2, l, azar() < 0.5 ? '#3f6626' : '#4f7a2c'); }
  preparar('.paisaje .pj-templo', `<defs>${piedra}</defs><g shape-rendering="crispEdges">${templo}</g>`);

  // Árboles en pixel art con volumen (como la referencia): la copa es un racimo de grupos de hojas; cada grupo
  // tiene sombra abajo, tono medio y brillo arriba a la derecha (de donde viene la luz). Los grupos de abajo y de
  // la izquierda son más oscuros. El tronco tiene corteza y se abre en ramas que entran en la copa.
  const PAL_HOJAS = [
    ['#0a1a09', '#10290e', '#173813', '#1f4919', '#2a5c22', '#386f2d'],   // fila del fondo
    ['#0b1d0a', '#13330f', '#1c4a16', '#28621e', '#3a7c2c', '#56963f'],
    ['#0c200b', '#153a11', '#20551a', '#2f7124', '#468f34', '#69ab4b'],   // fila de delante
  ];
  const PAL_TRONCO = [['#0f0a05', '#1c140a', '#2a1f10'], ['#1a1108', '#35261a', '#523b26'], ['#1e1409', '#43301d', '#6b4f33']];
  const lienzoArbol = (w, h, fila, conTronco = true, nGrupos = 0) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'), hoja = PAL_HOJAS[fila], tr = PAL_TRONCO[fila];
    const disco = (cx, cy, rad, col) => { g.fillStyle = col; for (let y = -rad; y <= rad; y++) { const m = Math.floor(Math.sqrt(rad * rad - y * y) + 0.35); g.fillRect(Math.round(cx - m), Math.round(cy + y), m * 2 + 1, 1); } };
    const copaY = conTronco ? h * 0.38 : h * 0.5, rx = w * 0.46, ry = conTronco ? h * 0.33 : h * 0.46;
    if (conTronco) {
      const tx = w / 2, base = h - 1, tw = Math.max(3, Math.round(w * 0.13));
      for (let y = Math.round(copaY); y <= base; y++) {
        const k = (y - copaY) / (base - copaY), raiz = y > base - 4 ? (4 - (base - y)) * 1.6 : 0;
        const ancho = Math.round(tw * (0.75 + 0.45 * k) + raiz), x0 = Math.round(tx - ancho / 2);
        for (let x = 0; x < ancho; x++) { const t = x / ancho; g.fillStyle = azar() < 0.14 ? tr[0] : t < 0.3 ? tr[0] : t < 0.72 ? tr[1] : tr[2]; g.fillRect(x0 + x, y, 1, 1); }
      }
      // ramas que suben en diagonal hacia la copa
      for (const d of [-1, 1, -0.4]) {
        let x = tx, y = copaY + (h - copaY) * 0.3;
        for (let i = 0; i < w * 0.22; i++) { x += d; y -= 0.8; g.fillStyle = tr[1]; g.fillRect(Math.round(x), Math.round(y), 2, 2); g.fillStyle = tr[2]; g.fillRect(Math.round(x) + 1, Math.round(y), 1, 1); }
      }
    }
    // Copa de pocos bloques de hojas como en Minecraft: cada bloque es un cuadrado con textura de hojas,
    // cara superior y derecha al sol, cara inferior e izquierda en sombra. Primero los de abajo.
    const cx = w / 2, n = nGrupos || 6, bloques = [], lado = Math.max(6, Math.round(Math.min(w, 60) * 0.34));
    for (let i = 0; i < n; i++) {
      const a = azar() * Math.PI * 2, d = Math.sqrt(azar()) * 0.7;
      bloques.push({ x: Math.round((cx + Math.cos(a) * d * rx) / 2) * 2, y: Math.round((copaY + Math.sin(a) * d * ry) / 2) * 2 });
    }
    bloques.push({ x: Math.round(cx), y: Math.round(copaY - ry * 0.45) });   // bloque de arriba, centrado
    bloques.sort((p, q) => q.y - p.y);
    for (const p of bloques) {
      const x0 = Math.round(p.x - lado / 2), y0 = Math.round(p.y - lado / 2);
      const luz = ((p.x - cx) / rx) * 0.5 - ((p.y - copaY) / ry) * 0.8, t = Math.max(0, Math.min(2, Math.round(1 + luz)));
      g.fillStyle = hoja[t + 1]; g.fillRect(x0, y0, lado, lado);
      for (let k = 0; k < lado * lado * 0.35; k++) { g.fillStyle = hoja[t + (azar() < 0.5 ? 0 : 2)]; g.fillRect(x0 + Math.floor(azar() * lado), y0 + Math.floor(azar() * lado), 1, 1); }   // textura de hojas
      g.fillStyle = hoja[t + 2]; g.fillRect(x0, y0, lado, 1); g.fillRect(x0 + lado - 1, y0, 1, lado);    // arriba y derecha al sol
      g.fillStyle = hoja[t]; g.fillRect(x0, y0 + lado - 1, lado, 1); g.fillRect(x0, y0, 1, lado);        // abajo e izquierda en sombra
    }
    return { url: c.toDataURL(), w, h, cima: Math.round(copaY - ry) };
  };
  const imagen = (a, x, y, esc) => `<image href="${a.url}" x="${Math.round(x)}" y="${Math.round(y)}" width="${a.w * esc}" height="${a.h * esc}" style="image-rendering:pixelated"/>`;

  // 3) Selva: árboles con tronco en tres filas de profundidad (los de atrás más pequeños y oscuros),
  //    algunos gigantes que sobresalen, y sotobosque oscuro entre los troncos. Se deja un claro delante del templo.
  const PERCHAS_SELVA = [];
  let bosque = `<rect x="0" y="250" width="2000" height="150" fill="url(#pj-sotobosque)"/>`;
  const FILAS = [
    { base: 330, alto: [70, 120], copa: [70, 110], paso: [40, 70], hojas: 'url(#pj-hojas-f)', corteza: '#2e2414', luz: '#4a6e3c', sombra: '#0c1c0a', tluz: '#4a3a22', tsom: '#1a140a' },
    { base: 368, alto: [90, 160], copa: [80, 130], paso: [55, 95], hojas: 'url(#pj-hojas)', corteza: 'url(#pj-corteza-m)', luz: '#5f8f48', sombra: '#102a0e', tluz: '#6e5530', tsom: '#241a0e' },
    { base: 402, alto: [110, 200], copa: [90, 150], paso: [80, 140], hojas: 'url(#pj-hojas)', corteza: 'url(#pj-corteza-m)', luz: '#7aaf5e', sombra: '#0e260c', tluz: '#7a6038', tsom: '#2a1e10' },
  ];
  const entre = ([a, b]) => a + azar() * (b - a);
  // 5 modelos por fila (se reutilizan) y cada árbol se coloca con su escala
  const MODELOS = [0, 1, 2].map(fila => Array.from({ length: 5 }, (_, i) => lienzoArbol([30, 36, 42][fila] + i * 4, [46, 56, 66][fila] + i * 6, fila)));
  FILAS.forEach((f, fila) => {
    for (let x = -30 + azar() * 40; x < 2030; x += entre(f.paso)) {
      if (x > 680 + fila * 6 && x < 950 - fila * 6) continue;     // claro alrededor del templo
      const gigante = fila === 1 && azar() < 0.15;
      const m = MODELOS[fila][Math.floor(azar() * 5)], esc = (gigante ? 3.4 : 2.2 + fila * 0.4) * (0.85 + azar() * 0.3);
      const y = f.base - m.h * esc;
      bosque += imagen(m, x - (m.w * esc) / 2, y, esc);
      if (fila > 0) PERCHAS_SELVA.push(['.paisaje .pj-media', Math.round(x), Math.round(y + m.cima * esc + 2)]);
    }
  });
  window.__perchasSelva = PERCHAS_SELVA;
  preparar('.paisaje .pj-media', `<defs>${hojasJungla('pj-hojas', '#132e10', ['#22491b', '#2a5822', '#1e4218', '#30642a', '#3d7432'])}
    ${hojasJungla('pj-hojas-f', '#0e220c', ['#183816', '#1e4419', '#163212', '#244e1e'])}${textura('pj-corteza-m', '#4e3c20', ['#5e4828', '#3e2f18', '#6a5230'], 40)}
    <linearGradient id="pj-sotobosque" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1c0a" stop-opacity="0"/><stop offset="0.45" stop-color="#0c1c0a" stop-opacity="0.85"/><stop offset="1" stop-color="#081408"/></linearGradient></defs>
    <g shape-rendering="crispEdges">${bosque}</g>`);

  // 4) Árbol gigante de jungla (tronco 2×2) con casa en la copa, a la derecha y en primer plano.
  let arbol = '';
  const AX = 1720;
  arbol += r(AX, 120, 90, 290, 'url(#pj-corteza)') + r(AX + 70, 120, 20, 290, '#3a2c16');                       // tronco y su lado en sombra
  arbol += r(AX - 20, 360, 30, 50, 'url(#pj-corteza)') + r(AX + 85, 350, 30, 60, 'url(#pj-corteza)');            // raíces
  arbol += r(AX - 60, 210, 70, 12, 'url(#pj-corteza)') + r(AX + 90, 180, 80, 12, 'url(#pj-corteza)');             // ramas
  for (const [x, y] of [[AX + 20, 260], [AX + 40, 300], [AX + 10, 330]]) arbol += r(x, y, 10, 14, '#b8732a') + r(x + 2, y + 2, 6, 3, '#d8903a');   // cacao
  // plataforma de tablones con barandilla y la casita
  arbol += r(AX - 110, 158, 320, 12, 'url(#pj-tablas)') + r(AX - 110, 168, 320, 3, '#4a3418');
  arbol += r(AX - 110, 140, 320, 3, '#6e5030');
  for (let x = AX - 108; x < AX + 210; x += 18) arbol += r(x, 140, 3, 18, '#6e5030');
  arbol += r(AX - 60, 96, 110, 62, 'url(#pj-tablas)') + r(AX + 50, 100, 10, 58, '#4a3418');                     // casita
  arbol += r(AX - 70, 84, 140, 12, '#5a3f22') + r(AX - 56, 72, 112, 12, '#5a3f22') + r(AX - 40, 62, 80, 10, '#5a3f22');   // tejado escalonado
  arbol += r(AX - 30, 112, 22, 20, '#2a1c0c') + `<rect x="${AX - 28}" y="${114}" width="18" height="16" fill="#ffcf6a"><animate attributeName="opacity" values="0.75;1;0.8;1;0.75" dur="3s" repeatCount="indefinite"/></rect>` + r(AX - 20, 112, 2, 20, '#2a1c0c') + r(AX - 30, 121, 22, 2, '#2a1c0c');   // ventana con luz
  arbol += r(AX + 8, 118, 22, 40, '#3a2810');                                                                      // puerta
  for (let y = 170; y < 360; y += 10) arbol += r(AX - 95, y, 18, 2, '#8a6a3a');                                  // escalera de cuerda
  arbol += r(AX - 96, 170, 2, 190, '#6e5030') + r(AX - 79, 170, 2, 190, '#6e5030');
  // copa enorme por bloques
  // copa enorme con volumen: racimo de grupos de hojas iluminados desde arriba a la derecha
  const copaGigante = lienzoArbol(240, 84, 2, false, 44);
  arbol += imagen(copaGigante, AX - 300, -140, 2.6);
  for (let i = 0; i < 26; i++) { const x = AX - 190 + Math.floor(azar() * 500), l = 20 + Math.floor(azar() * 110); arbol += r(x, 70, 3, l, azar() < 0.5 ? '#2f6a22' : '#3b7f2a'); }   // lianas
  preparar('.paisaje .pj-arbol', `<defs>${textura('pj-corteza', '#5a4524', ['#6e5530', '#4a3820', '#7a6038'], 50)}${hojasJungla('pj-hojas2', '#122a0f', ['#21501b', '#2a6022', '#1c4517', '#306a27', '#3f7a33'])}
    <pattern id="pj-tablas" width="16" height="16" patternUnits="userSpaceOnUse">${r(0, 0, 16, 16, '#9a7448')}${r(0, 7, 16, 1, '#6e5030')}${r(0, 15, 16, 1, '#6e5030')}${r(5, 0, 1, 7, '#6e5030')}${r(12, 8, 1, 7, '#6e5030')}</pattern></defs>
    <g shape-rendering="crispEdges">${arbol}</g>`, 'xMaxYMax');
  // la copa sube por encima del marco normal: se amplía el viewBox hacia arriba (misma escala)
  $('.paisaje .pj-arbol')?.setAttribute('viewBox', '0 -160 2000 560');   // alineada a la derecha para que el árbol quede en el borde

  // 5) Suelo de hierba en primer plano, con helechos y flores.
  const suelo = cordillera(250, 80, 10, 60);
  let plantas = '';
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(azar() * 2000), tipo = azar();
    if (tipo < 0.6) plantas += r(x, 0, 3, 10, '#3b8a2a') + r(x + 4, 3, 3, 7, '#2f7a22');
    else if (tipo < 0.8) plantas += r(x, 2, 4, 4, '#d83a2a') + r(x + 1, 6, 2, 6, '#2f7a22');
    else plantas += r(x, 2, 4, 4, '#f0d040') + r(x + 1, 6, 2, 6, '#2f7a22');
  }
  // hierba arriba y tierra debajo: la misma silueta 12 unidades más abajo tapa la hierba y deja solo una franja verde
  preparar('.paisaje .pj-cerca', `<defs>${textura('pj-tierra', '#3a281a', ['#46301f', '#2e2014', '#4e3624'])}${textura('pj-hierba', '#2f5f22', ['#376a28', '#28521d', '#3e752d'])}</defs>
    <path d="${suelo}" fill="#5f8f48" transform="translate(0 -2)" opacity="0.7" shape-rendering="crispEdges"/>
    <path d="${suelo}" fill="url(#pj-hierba)" shape-rendering="crispEdges"/>
    <path d="${suelo}" fill="url(#pj-tierra)" transform="translate(0 12)" shape-rendering="crispEdges"/>`);
  const cerca = $('.paisaje .pj-cerca');
  // plantas sobre el borde del suelo: se colocan siguiendo el perfil
  if (cerca) {
    const alturas = {}; suelo.replace(/V(\d+) H(\d+)/g, (_, y, x) => { alturas[+x] = +y; });
    const xs = Object.keys(alturas).map(Number).sort((a, b) => a - b);
    const alto = x => { let y = 250; for (const k of xs) { if (k > x) break; y = alturas[k]; } return y; };
    let p = '';
    plantas.replace(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)" fill="([^"]+)" \/>/g, (_, x, y, w, hh, f) => { p += r(+x, alto(+x) - 12 + +y, +w, +hh, f); });
    cerca.insertAdjacentHTML('beforeend', `<g shape-rendering="crispEdges">${p}</g>`);
  }

  // Parallax: la escena sube con el scroll hasta enseñar el río y el suelo; cada capa se mueve un poco distinto.
  const escena = $('.paisaje');
  let mx = 0, pendiente = false;
  const mover = () => {
    pendiente = false;
    const sube = Math.min(scrollY * 0.45, innerHeight * (innerWidth > 920 ? 0.28 : 0.2));
    escena.style.transform = `translateY(${(-sube).toFixed(1)}px)`;
    if (reducido) return;
    $$('.paisaje .pj').forEach(el => { const k = +el.dataset.k; el.style.transform = `translate(${(-mx * k * 60).toFixed(1)}px, ${(sube * k * 0.8).toFixed(1)}px)`; });
  };
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  if (!reducido) addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; pedir(); }, { passive: true });
  mover();

  // Río: agua de Minecraft en movimiento (1 píxel = 5 px), con espuma y la salpicadura de la cascada.
  const rio = $('.paisaje .pj-rio'); if (!rio) return;
  const rctx = rio.getContext('2d');
  // Azul verdoso apagado: el río está lejos y no debe robar protagonismo.
  const AGUA = [[14, 34, 48], [18, 44, 62], [22, 56, 78], [28, 68, 92], [36, 82, 106], [50, 100, 122], [74, 126, 146]];
  let W = 0, H = 0, img;
  const ajustarRio = () => { W = Math.ceil(rio.clientWidth / 5); H = Math.ceil(rio.clientHeight / 5); rio.width = W; rio.height = H; img = rctx.createImageData(W, H); };
  const lejosSvg = $('.paisaje .pj-lejos');
  const pintarRio = t => {
    const d = img.data;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      // río tranquilo: ondas lentas que se desplazan despacio a la derecha
      let v = Math.sin(x * 0.09 - t * 0.35 + y * 0.25) + Math.sin(y * 0.5 + t * 0.2) * 0.5 + Math.sin((x - t * 2) * 0.05) + Math.sin(x * 0.021 + t * 0.07) * 1.2;
      v = (v + 3.8) / 7.6;
      if (y < 2) v = Math.min(1, v + 0.25 - y * 0.1);
      const c = AGUA[Math.max(0, Math.min(AGUA.length - 1, Math.floor(v * AGUA.length)))];
      const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
    }
    rctx.putImageData(img, 0, 0);
    // espuma que corre con el agua
    rctx.fillStyle = '#6f97ac';
    for (let k = 0; k < W / 12; k++) { const x = ((k * 37 + t * 3) % (W + 10)) - 5, y = (k * 13) % H; rctx.fillRect(Math.round(x), y, 2, 1); }
    // salpicadura donde cae la cascada (se calcula su posición real en pantalla)
    if (lejosSvg) {
      const caja = lejosSvg.getBoundingClientRect(), rc = rio.getBoundingClientRect();
      const esc = Math.max(caja.width / 2000, caja.height / 400), ox = (caja.width - 2000 * esc) / 2;
      const sx = (caja.left + ox + (XC + 9) * esc - rc.left) / 5;
      rctx.fillStyle = '#9fbccc';
      for (let k = 0; k < 7; k++) rctx.fillRect(Math.round(sx + Math.sin(t * 3 + k * 2) * 3), Math.round(Math.abs(Math.sin(t * 2.5 + k)) * 2), 1, 1);
    }
  };
  ajustarRio(); addEventListener('resize', ajustarRio);
  pintarRio(0);
  if (reducido) return;
  let ultimo = 0;
  const bucle = ms => { if (ms - ultimo > 80 && rio.getBoundingClientRect().top < innerHeight) { ultimo = ms; pintarRio(ms / 1000); } requestAnimationFrame(bucle); };
  requestAnimationFrame(bucle);
})();

/* ======================= hojas al hacer clic ======================= */
// Cada estallido usa un lienzo pequeño solo alrededor del clic y se elimina al acabar.
(() => {
  if (reducido) return;
  const COLORES = ['#8af06a', '#34d64a', '#16a334', '#ffcf3a', '#3b7f2a'];
  const TAM = 200, MAX = 4;
  let activos = 0;
  document.addEventListener('pointerdown', e => {
    if (activos >= MAX || !e.target.closest('button, a, .producto, .card.hover, [data-copiar]')) return;
    activos++;
    const dpr = Math.min(devicePixelRatio, 2), c = document.createElement('canvas');
    c.width = c.height = TAM * dpr;
    c.style.cssText = `position:fixed;left:${e.clientX - TAM / 2}px;top:${e.clientY - TAM / 2}px;width:${TAM}px;height:${TAM}px;pointer-events:none;z-index:80`;
    document.body.appendChild(c);
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const hojas = Array.from({ length: 14 }, () => { const a = Math.random() * Math.PI * 2, v = 70 + Math.random() * 150; return { x: TAM / 2, y: TAM / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 110, vida: 0.6 + Math.random() * 0.5, c: COLORES[(Math.random() * COLORES.length) | 0], o: Math.random() * 6 }; });
    let antes = performance.now();
    const paso = ahora => {
      const dt = Math.min(0.05, (ahora - antes) / 1000); antes = ahora;
      ctx.clearRect(0, 0, TAM, TAM);
      let vivas = 0;
      for (const h of hojas) {
        if ((h.vida -= dt) <= 0) continue;
        vivas++;
        h.vy += 260 * dt; h.vx *= 1 - 2.5 * dt; h.x += (h.vx + Math.sin(ahora / 120 + h.o) * 30) * dt; h.y += h.vy * dt;
        ctx.globalAlpha = Math.min(1, h.vida * 3); ctx.fillStyle = h.c; ctx.fillRect(h.x | 0, h.y | 0, 4, 2); ctx.fillRect((h.x | 0) + 1, (h.y | 0) - 1, 2, 4);
      }
      if (vivas) requestAnimationFrame(paso); else { c.remove(); activos--; }
    };
    requestAnimationFrame(paso);
  }, { passive: true });
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
const MES = new Date().toLocaleDateString('es', { month: 'long' });
const widgets = () => `
  <div class="card widget"><h4>Compras recientes <span class="en-vivo">EN VIVO</span></h4><ul class="feed" id="feed"></ul></div>`;
// Franja de arriba de la tienda: se ve nada más entrar, sin hacer scroll.
const franjaTienda = () => `
  <div class="franja-tienda">
    <div class="card donador-mes"><span class="corona-flota"><svg data-pixel="corona"></svg></span>
      <img src="https://mc-heads.net/body/MHF_Enderman/120" alt="">
      <div><p class="label" style="margin:0">&gt; top comprador de ${MES} <span class="ejemplo">ejemplo</span></p><h3>Jugador****</h3>
        <p class="muted">El que más compró este mes. Sale aquí, en la portada de la tienda.</p></div></div>
    <div class="card meta-mes"><div class="meta-cab"><p class="label" style="margin:0">&gt; mega keyall (x2 llaves de kits)</p><b class="pixel" id="meta-pct">0%</b></div>
      <div class="meta-bar grande"><i id="meta"></i></div>
      <p class="muted">Meta de la comunidad que ya tienen en su tienda: cada compra suma y al 100 % hay <b style="color:var(--gold)">KeyAll con el doble de llaves</b> para todos.</p></div>
  </div>`;
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
    <header class="hero"><div class="wrap">
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
      ${franjaTienda()}
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
  const meta = $('#meta'); if (meta) setTimeout(() => { meta.style.width = '37%'; const pct = $('#meta-pct'); if (pct) contar(pct, 37, '%'); }, 300);
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
