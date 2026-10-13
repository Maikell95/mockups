/* MeeTion Network · maqueta de web completa (Maikel Ferrer) */
const IP = 'meetionmc.net';
const DISCORD = 'meetionmc';
const CDN = 'https://dunb17ur4ymx4.cloudfront.net/packages/images/';
const FIN_HALLOWEEN = new Date('2026-11-01T00:00:00-05:00');
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = n => (n ?? 0).toFixed(2) + ' USD';
const guardar = (k, v) => { try { localStorage.setItem('meetion-' + k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { const v = localStorage.getItem('meetion-' + k); return v ? JSON.parse(v) : d; } catch { return d; } };

/* ======================= contenido fijo ======================= */
const MODALIDADES = {
  'survival-rpg': { icono: 'espada', texto: 'Supervivencia con progresión de RPG: encantos custom, mochilas VIP, bóvedas, trabajos con /jobs, skills, pets y armas funcionales.' },
  'towny': { icono: 'castillo', texto: 'Funda o únete a una ciudad y expande tu territorio. Con vehículos, McMMO, trabajos y su propio pase de batalla.' },
  'prison-op': { icono: 'pico', texto: 'Mina, sube de rango y hazte con el mejor equipo. Armas funcionales, llaves, kits, spawners y skills.' },
  'survival-op': { icono: 'corona', texto: 'Supervivencia potenciada: minions, rankups, ecustoms, packs y el Evento Dioses Griegos.' },
  'earth': { icono: 'globo', texto: 'La modalidad Earth, con vehículos, kits, skills, pets y el Evento Cyber Futurista.' },
  'doom-box': { icono: 'llama', texto: 'Box PvP con rangos Lite, Flash y temporales, GKits, revives, ítems y accesos.' },
};
const NOMBRE_DESTACADOS = {
  'survival-rpg': '🎃 Evento Halloween', 'towny': '🎃 Evento Halloween', 'prison-op': '🎃 Evento Halloween',
  'earth': '🤖 Evento Cyber Futurista', 'globales': '🌐 Rangos globales', 'doom-box': '🪐 Membresías', 'cuentas': '📌 Servicios de cuenta', 'survival-op': '⚔️ Destacados',
};

// Ventajas reales de los rangos permanentes de Survival RPG (tienda pública)
const RANGOS_RPG = [
  { r: 'Bronce', precio: 11.99, homes: 8, jobs: '5', encantos: 4, mochila: 'VIP', boveda: 36, proteccion: '—', extra: '' },
  { r: 'Plata', precio: 23.99, homes: 9, jobs: '5', encantos: 4, mochila: 'VIP', boveda: 36, proteccion: 60, extra: '' },
  { r: 'Oro', precio: 44.99, homes: 10, jobs: '6', encantos: 5, mochila: 'VIP+', boveda: 45, proteccion: 70, extra: '' },
  { r: 'Diamante', precio: 56.24, homes: 11, jobs: '6', encantos: 5, mochila: 'VIP+', boveda: 45, proteccion: 80, extra: '' },
  { r: 'Esmeralda', precio: 67.49, homes: 12, jobs: '7', encantos: 5, mochila: 'VIP++', boveda: 54, proteccion: 90, extra: '' },
  { r: 'Rubí', precio: 82.49, homes: 13, jobs: '8', encantos: 6, mochila: '—', boveda: '—', proteccion: 100, extra: 'Prefijo único personalizado · /near' },
  { r: 'Amatista', precio: 187.49, homes: 18, jobs: 'Todos', encantos: 6, mochila: '—', boveda: '—', proteccion: 150, extra: 'MeeTion Pass Premium permanente · Armor Stand custom · prefijo personalizado · /near' },
];
const VENTAJAS_GENERALES = ['Entrar a la network y a la modalidad cuando estén llenas', 'Prefijo del rango en el chat y en el tabulador', 'Prioridad en la cola', 'Rol en el Discord y chat exclusivo para VIPs', 'Mayor soporte en Discord y dentro del juego'];
const COMANDOS = [
  ['/recipe', 'Ver crafteos'], ['/ec', 'Abrir tu enderchest en cualquier lado'], ['/grindstone', 'Desencantar ítems'], ['/dispose', 'Eliminar basura'],
  ['/craft', 'Mesa de crafteo portátil'], ['/sit', 'Sentarte'], ['/hat', 'Ponerte un ítem en la cabeza'], ['/colors', 'Ver los colores del chat'],
  ['/colorpicker', 'Elegir color del chat'], ['/near', 'Ver jugadores cercanos (Rubí y superior)'], ['/jobs', 'Trabajos y sueldos'],
];
const VOTOS = [
  { sitio: 'Minecraft-MP · meetionmc.com', url: 'https://minecraft-mp.com/server/297192/vote/', nota: 'Ficha principal, con más de 1.100 votos' },
  { sitio: 'Minecraft-MP · meetionmc.net', url: 'https://minecraft-mp.com/server/328005/vote/', nota: 'Segunda ficha de la network' },
  { sitio: 'Minecraft IP List', url: 'https://www.minecraftiplist.com/server/MeeTionNetwork-32758', nota: 'Ficha en Minecraft IP List' },
];

/* ======================= pixel art ======================= */
const PALETA = { k: '#000', w: '#fff', s: '#c8c8d8', S: '#8a8aa0', b: '#7a5230', d: '#4e3418', r: '#c80300', o: '#fb7406', y: '#ffcf4a', Y: '#d99a10', g: '#3d8a22', G: '#2a5e17', p: '#ff8a1f', P: '#c95f00', f: '#f4f4ff', e: '#3ddc84', u: '#2f6fd6', U: '#1f4fa0', c: '#4fd1ff' };
const DIBUJOS = {
  espada: ['.........sss', '........swS.', '.......swS..', '......swS...', '.....swS....', '..b.swS.....', '..bbwS......', '...bb.......', '..bdbb......', '.dd..b......', 'dd..........', 'd...........'],
  castillo: ['s.s.s..s.s.s', 'sssss..sssss', 'sSSSs..sSSSs', 'sSkSssssSkSs', 'sSSSSSSSSSSs', 'sSSkSSSSkSSs', 'sSSSSSSSSSSs', 'sSSSSddSSSSs', 'sSSSSddSSSSs', 'sSSSSddSSSSs', 'ssssssssssss', '............'],
  pico: ['.ssssssss...', 'sSSSSSSSSs..', '.s.....bSs..', '......bb.s..', '.....bb..s..', '....bb...s..', '...bb.......', '..bb........', '.bb.........', 'bb..........', 'b...........', '............'],
  corona: ['............', 'y....y....y.', 'yy..yyy..yy.', 'yyy.yyy.yyy.', 'yyyyyyyyyyy.', 'yyryyyyyeyy.', 'yyyyyyyyyyy.', 'YYYYYYYYYYY.', '............', '............', '............', '............'],
  globo: ['...uuuuuu...', '..uggUuuuu..', '.uggggUuguu.', 'ugggggUuggUu', 'uuggguuuggUu', 'uuuguuuuuggu', 'uuuuuuguuuuu', 'uuuuugggguuu', '.uuuuggguuu.', '..uuuuguuu..', '...uuuuuu...', '............'],
  llama: ['.....r......', '....ro......', '...roo.r....', '...rooor....', '..roooyor...', '..rooyyoor..', '.rooyyyyor..', '.royywwyyor.', '.royywwyyor.', '..royyyyor..', '...rooooor..', '....rrrr....'],
  calabaza: ['.....g......', '....gG......', '..ppppppp...', '.pppppppppp.', 'ppkkppppkkpp', 'ppkkppppkkpp', 'pppppkkppppp', 'ppkpppppkpp.', 'pppkkkkkppp.', '.ppppppppp..', '..PPPPPPP...', '............'],
  fantasma: ['...ffffff...', '..ffffffff..', '.ffffffffff.', '.ffkkffkkff.', '.ffkkffkkff.', '.ffffffffff.', '.fffffkfffff', '.ffffkkkffff', '.ffffffffff.', '.ffffffffff.', '.ff.ff.ff.ff', '.f..f..f..f.'],
  gema: ['....cccc....', '...cwwccc...', '..cwwcccuc..', '.cwwcccccuu.', 'cwcccccccuuu', '.ccccccccuu.', '..ucccccuu..', '...ucccuu...', '....ucuu....', '.....uu.....', '............', '............'],
  llave: ['............', '..yyy.......', '.yYYYy......', '.yY.Yy......', '.yYYYyyyyyyy', '..yyy....y.y', '.........y.y', '............', '............', '............', '............', '............'],
  jaula: ['ssssssssssss', 'sk.k.k.k.k.s', 'sk.k.k.k.k.s', 'sk.kgggk.k.s', 'sk.gwgwg.k.s', 'sk.ggggg.k.s', 'sk.kgggk.k.s', 'sk.k.k.k.k.s', 'sk.k.k.k.k.s', 'ssssssssssss', '............', '............'],
  etiqueta: ['............', '...sssssssss', '..sYYYYYYYYs', '.sYkYYYYYYYs', 'sYYYYwwwwYYs', '.sYYYYYYYYYs', '..sYYYYYYYYs', '...sssssssss', '............', '............', '............', '............'],
  cofre: ['............', '.bbbbbbbbbb.', 'bddddddddddb', 'bdbbbbbbbbdb', 'bbbbbbbbbbbb', 'kkkkkyykkkkk', 'bbbbbyybbbbb', 'bdbbbbbbbbdb', 'bdbbbbbbbbdb', 'bddddddddddb', '.bbbbbbbbbb.', '............'],
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

/* ======================= brasas ======================= */
(() => {
  const lienzo = $('#brasas'), ctx = lienzo.getContext('2d');
  const COLORES = ['#fb7406', '#ffb347', '#c80300', '#ffcf4a', '#ff5a1f'];
  let brasas = [];
  const nueva = inicio => ({ x: Math.random() * innerWidth, y: inicio ? Math.random() * innerHeight : innerHeight + 10, t: Math.random() < 0.2 ? 4 : Math.random() < 0.6 ? 3 : 2, v: 0.4 + Math.random() * 1.3, o: Math.random() * 6.3, c: COLORES[Math.floor(Math.random() * COLORES.length)], vida: 0.6 + Math.random() * 0.4 });
  const ajustar = () => {
    lienzo.width = innerWidth * devicePixelRatio; lienzo.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    brasas = Array.from({ length: Math.round(innerWidth * innerHeight / 9000) }, () => nueva(true));
  };
  const dibujar = ms => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const b of brasas) {
      b.y -= b.v; b.x += Math.sin(ms / 900 + b.o) * 0.5;
      ctx.globalAlpha = b.vida * (0.25 + 0.75 * Math.max(0, Math.min(1, b.y / innerHeight))) * (0.7 + 0.3 * Math.sin(ms / 120 + b.o));
      ctx.fillStyle = b.c; ctx.fillRect(Math.round(b.x), Math.round(b.y), b.t, b.t);
      if (b.y < -10) Object.assign(b, nueva(false));
    }
    ctx.globalAlpha = 1;
    if (!reducido) requestAnimationFrame(dibujar);
  };
  ajustar(); addEventListener('resize', ajustar); requestAnimationFrame(dibujar);
})();

/* barra de scroll que va cambiando entre amarillo, naranja y rojo, como el fuego */
if (!reducido) {
  const raiz = document.documentElement.style;
  setInterval(() => {
    const h = 25 + 25 * Math.sin(performance.now() / 1400);   // 0 = rojo, 25 = naranja, 50 = amarillo
    raiz.setProperty('--sb-claro', `hsl(${h + 8} 100% 66%)`);
    raiz.setProperty('--sb', `hsl(${h} 100% 50%)`);
    raiz.setProperty('--sb-oscuro', `hsl(${Math.max(0, h - 6)} 100% 30%)`);
  }, 90);
}

/* ======================= datos en vivo ======================= */
const vivo = { jugadores: null, miembros: null, enLinea: null };
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
fetch('https://api.mcsrvstat.us/3/' + IP).then(r => r.json()).then(d => { vivo.jugadores = d.online ? d.players.online : 0; pintarVivo(); }).catch(() => {});
fetch(`https://discord.com/api/v10/invites/${DISCORD}?with_counts=true`).then(r => r.json()).then(d => { vivo.miembros = d.approximate_member_count; vivo.enLinea = d.approximate_presence_count; pintarVivo(); }).catch(() => {});

/* cuenta atrás */
const partes = () => { const ms = Math.max(0, FIN_HALLOWEEN - Date.now()); return { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 }; };
const p2 = n => String(n).padStart(2, '0');
setInterval(() => {
  const { d, h, m, s } = partes();
  $('#cuenta').textContent = `${d}d ${p2(h)}h ${p2(m)}m ${p2(s)}s`;
  const g = $('#cuenta-grande'); if (g) g.innerHTML = [[d, 'días'], [h, 'horas'], [m, 'min'], [s, 'seg']].map(([v, l]) => `<div><b>${p2(v)}</b><small>${l}</small></div>`).join('');
}, 1000);

/* ======================= catálogo ======================= */
let CATALOGO = [];
const modalidad = slug => CATALOGO.find(m => m.slug === slug);
// Las imágenes originales pesan ~2 MB; se sirven reducidas a webp con wsrv.nl
const imagen = (p, w = 240) => p[4] ? `https://wsrv.nl/?url=${encodeURIComponent(CDN.replace('https://', '') + p[4])}&w=${w}&h=${w}&fit=contain&output=webp&q=82` : '';
const iconoDe = p => { const n = (p[1] || '').toLowerCase(); return /llave|key/.test(n) ? 'llave' : /spawner|generador/.test(n) ? 'jaula' : /tag|prefijo/.test(n) ? 'etiqueta' : /pase|pass|nivel/.test(n) ? 'gema' : 'cofre'; };
const sinImagen = (p, tam) => `<svg class="icono" data-pixel="${iconoDe(p)}" style="width:${tam}px;height:${tam}px;margin:0 auto"></svg>`;
const todosLosProductos = () => CATALOGO.flatMap(m => [...m.evento.map(p => ({ p, m, c: null })), ...m.categorias.flatMap(c => c.productos.map(p => ({ p, m, c })))]);

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
  const base = (p[1] || '').replace(/\[.*?\]/g, '').trim().toLowerCase();
  const rango = RANGOS_RPG.find(r => r.r.toLowerCase() === base);
  const ventajas = rango ? [...VENTAJAS_GENERALES, `${rango.homes} homes`, `Trabajos en /jobs: ${rango.jobs}`, `Hasta ${rango.encantos} encantos custom por ítem`, rango.mochila !== '—' ? `Mochila ${rango.mochila}` : '', rango.boveda !== '—' ? `Bóvedas personales de ${rango.boveda} slots` : '', rango.proteccion !== '—' ? `${rango.proteccion} bloques de protección` : '', rango.extra].filter(Boolean) : null;
  $('#contenido-producto').innerHTML = `
    <h3>${esc(p[1])}</h3>
    <div class="img-grande">${imagen(p) ? `<img src="${esc(imagen(p, 400))}" alt="">` : sinImagen(p, 120)}</div>
    <p class="muted">${esc(m.emoji)} ${esc(m.nombre)}${c ? ' · ' + esc(c.emoji + ' ' + c.nombre) : ''}</p>
    ${ventajas ? `<ul>${ventajas.map(v => `<li>${esc(v)}</li>`).join('')}</ul><p class="muted" style="font-size:0.8rem">Ventajas tal como aparecen en la tienda actual (Survival RPG).</p>` : '<p class="muted" style="margin:12px 0">Entrega automática en la modalidad al completar el pago.</p>'}
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px">
      <div class="precio pixel" style="font-size:1.5rem;color:var(--gold)">${p[3] ? `<del class="muted" style="font-size:0.9rem;margin-right:8px">${p[3].toFixed(2)}</del>` : ''}${usd(p[2])}</div>
      <button class="btn gold" id="btn-add-modal">Añadir</button>
    </div>`;
  pintar($('#contenido-producto'));
  $('#btn-add-modal').onclick = () => { anadir(p, m); cerrarTodo(); };
  abrir('#modal-producto');
}

/* ======================= piezas reutilizables ======================= */
const tarjetaProducto = (p, m) => {
  const off = p[3] && p[2] ? Math.round((1 - p[2] / p[3]) * 100) : 0;
  return `<div class="card hover producto" data-ver="${esc(p[0])}">
    ${off > 0 ? `<span class="off">-${off}%</span>` : ''}
    <div class="img">${imagen(p) ? `<img loading="lazy" src="${esc(imagen(p))}" alt="">` : sinImagen(p, 80)}</div>
    <div class="nombre">${esc(p[1])}</div>
    <div class="precio">${p[3] ? `<span class="antes">${p[3].toFixed(2)} USD</span>` : ''}${(p[2] ?? 0).toFixed(2)} <small>USD</small></div>
    <button class="btn sm" data-add="${esc(p[0])}" data-mod="${esc(m.slug)}">Añadir</button>
  </div>`;
};
const JUGADORES = ['Alex_Pro', 'Kira77', 'NetherKing', 'Lia_mc', 'xDarkSoul', 'ElPana09', 'Sofi_RPG', 'BlazeHunter', 'Tomi_YT', 'Vale.mc', 'Rex_Craft', 'Nico2009'];
const SKINS = ['MHF_Steve', 'MHF_Alex', 'MHF_Blaze', 'MHF_Enderman', 'MHF_Skeleton', 'MHF_Zombie', 'MHF_Creeper', 'MHF_Villager'];
let feedTimer;
function arrancarFeed() {
  clearInterval(feedTimer);
  const lista = $('#feed'); if (!lista) return;
  const pool = todosLosProductos().filter(x => x.p[2] > 0);
  let n = 0;
  const add = hace => {
    if (!pool.length) return;
    const { p, m } = pool[Math.floor(Math.random() * pool.length)];
    const li = document.createElement('li');
    li.innerHTML = `<img src="https://mc-heads.net/avatar/${SKINS[n % SKINS.length]}/28" alt=""><div><b>${JUGADORES[n % JUGADORES.length]}</b><span>${esc(p[1])} · ${esc(m.nombre)}</span></div><span class="en-vivo" style="margin-left:auto;color:var(--muted)">${hace}</span>`;
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
      <img src="https://mc-heads.net/body/MHF_Blaze/120" alt="">
      <div><p class="label" style="margin:0">&gt; top donador de ${MES} <span class="ejemplo">ejemplo</span></p><h3>Jugador****</h3>
        <p class="muted">El que más apoyó a la network este mes. Sale aquí y gana un rango de regalo.</p></div></div>
    <div class="card meta-mes"><div class="meta-cab"><p class="label" style="margin:0">&gt; meta de ${MES} <span class="ejemplo">ejemplo</span></p><b class="pixel" id="meta-pct">0%</b></div>
      <div class="meta-bar grande"><i id="meta"></i></div>
      <p class="muted">Cada compra suma. Al llegar al 100 %: <b style="color:var(--gold)">KeyAll global y doble de llaves</b> en todas las modalidades.</p></div>
  </div>`;

/* ======================= vistas ======================= */
const VISTAS = {
  inicio() {
    const jugables = CATALOGO.filter(m => MODALIDADES[m.slug]);
    return `<div class="vista">
    <header class="hero"><div class="wrap">
      <div class="logo-wrap"><img src="logo.png" alt="MeeTion MC"></div>
      <div class="stats">
        <span class="stat"><span class="dot"></span><b data-vivo="jugadores">…</b> jugando ahora</span>
        <span class="stat">Discord <b data-vivo="miembros">…</b> miembros</span>
        <span class="stat"><b>${CATALOGO.length - 2}</b> modalidades</span>
      </div>
      <h1>Donde <span class="fuego">arde</span><br>la leyenda</h1>
      <p class="lead">La network hispana con Survival RPG, Towny, Prison OP, Survival OP, Earth y Doom Box. Elige tu modalidad y únete a miles de jugadores.</p>
      <div class="ip"><div><small>IP del servidor</small><code>${IP}</code></div><button class="btn" data-copiar>Copiar IP</button></div>
    </div></header>
    <section class="alt"><div class="wrap">
      <p class="label reveal">&gt; accesos rápidos</p><h2 class="reveal">Todo en un sitio</h2>
      <div class="accesos">
        <a class="card hover acceso reveal" href="#tienda"><svg class="icono" data-pixel="cofre"></svg><h3>Tienda</h3><p>${todosLosProductos().length} productos en ${CATALOGO.reduce((s, m) => s + m.categorias.length, 0)} categorías.</p><span class="ir">Ver tienda →</span></a>
        <a class="card hover acceso reveal" href="#votar"><svg class="icono" data-pixel="gema"></svg><h3>Votar</h3><p>Vota cada día y gana recompensas en el juego.</p><span class="ir">Votar →</span></a>
        <a class="card hover acceso reveal" href="#wiki"><svg class="icono" data-pixel="pico"></svg><h3>Wiki</h3><p>Rangos, comandos, normas y guía para empezar.</p><span class="ir">Abrir wiki →</span></a>
        <a class="card hover acceso reveal" href="#comunidad"><svg class="icono" data-pixel="llama"></svg><h3>Discord</h3><p><b data-vivo="enlinea">…</b> personas conectadas ahora mismo.</p><span class="ir">Entrar →</span></a>
      </div>
    </div></section>
    <section><div class="wrap">
      <p class="label reveal">&gt; modalidades</p><h2 class="reveal">Elige tu camino</h2>
      <div class="grid-3">${jugables.map(m => tarjetaModalidad(m)).join('')}</div>
    </div></section></div>`;
  },
  modalidades() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; modalidades</p><h1>Seis formas de jugar</h1><p>Cada modalidad tiene su progreso, sus rangos y su tienda. Tu rango global te acompaña en todas.</p></div>
    <section style="padding-top:10px"><div class="wrap"><div class="grid-3">${CATALOGO.filter(m => MODALIDADES[m.slug]).map(m => tarjetaModalidad(m)).join('')}</div></div></section></div>`;
  },
  tienda(modSlug, catSlug) {
    const m = modalidad(modSlug) || modalidad('survival-rpg');
    const cat = catSlug && catSlug !== 'destacados' ? m.categorias.find(c => c.slug === catSlug) : null;
    const productos = cat ? cat.productos : m.evento;
    const titulo = cat ? `${cat.emoji} ${cat.nombre}` : NOMBRE_DESTACADOS[m.slug] || 'Destacados';
    return `<div class="vista"><div class="wrap">
      <div class="cabecera" style="padding-bottom:22px"><p class="label">&gt; tienda oficial</p><h1>Tienda</h1><p>Paga y lo recibes en el juego al instante. ${todosLosProductos().length} productos de las ${CATALOGO.length} secciones de la tienda actual.</p></div>
      ${franjaTienda()}
      <div class="tienda">
        <aside class="lateral">
          <div class="card mods">${CATALOGO.map(x => `
            <details ${x.slug === m.slug ? 'open' : ''}><summary>${esc(x.emoji)} ${esc(x.nombre)} <small>${x.evento.length + x.categorias.reduce((s, c) => s + c.productos.length, 0)}</small></summary>
              ${x.evento.length ? `<a href="#tienda/${x.slug}/destacados" class="${x.slug === m.slug && !cat ? 'activo' : ''}">${esc(NOMBRE_DESTACADOS[x.slug] || 'Destacados')} <small>${x.evento.length}</small></a>` : ''}
              ${x.categorias.map(c => `<a href="#tienda/${x.slug}/${c.slug}" class="${cat === c ? 'activo' : ''}">${esc(c.emoji)} ${esc(c.nombre)} <small>${c.productos.length}</small></a>`).join('')}
            </details>`).join('')}
          </div>
          ${widgets()}
        </aside>
        <div>
          <select class="cat-movil" id="cat-movil" aria-label="Categoría">${CATALOGO.map(x => `<optgroup label="${esc(x.emoji + ' ' + x.nombre)}">
            ${x.evento.length ? `<option value="${x.slug}/destacados" ${x.slug === m.slug && !cat ? 'selected' : ''}>${esc(NOMBRE_DESTACADOS[x.slug] || 'Destacados')} (${x.evento.length})</option>` : ''}
            ${x.categorias.map(c => `<option value="${x.slug}/${c.slug}" ${cat === c ? 'selected' : ''}>${esc(c.emoji + ' ' + c.nombre)} (${c.productos.length})</option>`).join('')}</optgroup>`).join('')}</select>
          <div class="barra-tienda"><h2>${esc(titulo)}</h2>
            <label class="buscar">🔍<input id="buscar" placeholder="Buscar en toda la tienda…"></label>
            <select class="orden" id="orden"><option value="">Orden de la tienda</option><option value="asc">Precio ↑</option><option value="desc">Precio ↓</option><option value="off">Mayor descuento</option></select>
          </div>
          <p class="muted" style="margin:-8px 0 16px;font-size:0.9rem">${esc(m.emoji)} ${esc(m.nombre)} · ${productos.length} productos</p>
          ${cat?.aviso ? `<div class="aviso">🔔 ${esc(cat.aviso)}</div>` : ''}
          <div class="productos" id="productos" data-mod="${m.slug}">${productos.map(p => tarjetaProducto(p, m)).join('') || '<p class="vacio">No hay productos en esta categoría.</p>'}</div>
        </div>
      </div></div></div>`;
  },
  eventos() {
    const rpg = modalidad('survival-rpg'), earth = modalidad('earth'), sop = modalidad('survival-op');
    const dioses = sop?.categorias.find(c => /dioses/i.test(c.nombre));
    const muestra = (lista, n = 3) => lista.filter(p => p[4]).slice(0, n).map(p => `<div><img src="${esc(imagen(p))}" alt=""><b>${esc(p[1])}</b><br><span class="muted">${usd(p[2])}</span></div>`).join('');
    const ev = (titulo, icono, texto, lista, ruta, extra = '') => `
      <div class="card evento-card reveal" style="margin-bottom:26px"><div>
        <h3><svg data-pixel="${icono}" style="width:34px;height:34px;display:inline;vertical-align:-6px"></svg> ${titulo}</h3>
        <p class="muted">${texto}</p>${extra}
        <div class="chips"><span>${lista.length} productos</span></div>
        <a class="btn" href="#tienda/${ruta}" style="margin-top:18px">Ver productos del evento</a>
      </div><div class="muestra">${muestra(lista)}</div></div>`;
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; eventos</p><h1>Eventos activos</h1><p>Rangos y objetos de temporada, solo durante el evento.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      ${ev('Halloween 2026', 'calabaza', 'Rangos Vampiro y objetos de temporada en Survival RPG, Towny y Prison OP.', rpg.evento, 'survival-rpg/destacados', '<div class="cuenta-grande" id="cuenta-grande"></div>')}
      ${dioses ? ev('Dioses Griegos', 'corona', 'Zeus y el resto del Olimpo llegan a Survival OP: rangos temporales, permanentes y mejoras.', dioses.productos, `survival-op/${dioses.slug}`) : ''}
      ${ev('Cyber Futurista', 'globo', 'Rangos Cyber y objetos futuristas en la modalidad Earth.', earth.evento, 'earth/destacados')}
    </div></section></div>`;
  },
  votar() {
    const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; votar</p><h1>Vota y gana</h1><p>Cada voto ayuda a que más jugadores encuentren la network. Vota en todas las listas cada día.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div style="display:grid;gap:18px">${VOTOS.map((v, i) => `
        <div class="card hover voto reveal"><span class="n">${i + 1}</span><div><h3>${esc(v.sitio)}</h3><p class="muted">${esc(v.nota)}</p></div>
          <a class="btn gold" href="${esc(v.url)}" target="_blank" rel="noopener">Votar</a></div>`).join('')}
      </div>
      <div class="grid-2" style="margin-top:30px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Recompensas por voto <span class="ejemplo">ejemplo</span></h3>
          <ul style="color:var(--muted);padding-left:20px;margin-top:10px"><li>1 llave de votos por cada lista</li><li>Dinero del juego en tu modalidad</li><li>Votar en las 3 listas: llave extra</li></ul>
          <h3 class="pixel" style="font-size:0.9rem;margin-top:18px">Tu racha semanal <span class="ejemplo">ejemplo</span></h3>
          <div class="racha">${dias.map((d, i) => `<div class="${i < 4 ? 'hecho' : ''}"><b>${i < 4 ? '✔' : '·'}</b>${d}</div>`).join('')}</div></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Top votantes del mes <span class="ejemplo">ejemplo</span></h3>
          <table class="tabla" style="margin-top:10px"><tr><th>#</th><th>Jugador</th><th>Votos</th></tr>
          ${['NetherKing', 'Sofi_RPG', 'Kira77', 'Alex_Pro', 'Lia_mc'].map((j, i) => `<tr><td>${i + 1}</td><td><img src="https://mc-heads.net/avatar/${SKINS[i]}/20" style="display:inline;vertical-align:-4px;margin-right:8px">${j}</td><td>${[93, 88, 74, 71, 60][i]}</td></tr>`).join('')}</table></div>
      </div>
    </div></section></div>`;
  },
  wiki(seccion = 'primeros-pasos') {
    const SECCIONES = { 'primeros-pasos': 'Primeros pasos', rangos: 'Rangos', comandos: 'Comandos', normas: 'Normas', faq: 'Preguntas frecuentes' };
    const cuerpo = {
      'primeros-pasos': `<h2>Primeros pasos <span class="ejemplo">ejemplo</span></h2>
        <ol><li>Abre Minecraft Java (1.16 o superior) y añade el servidor <b style="color:var(--gold)">${IP}</b>.</li><li>Entra y elige tu modalidad en el lobby.</li><li>Protege tu zona y empieza a progresar.</li><li>Únete al Discord para enterarte de eventos y sorteos.</li></ol>
        <h3>¿Qué modalidad elijo?</h3><ul>${CATALOGO.filter(m => MODALIDADES[m.slug]).map(m => `<li><b>${esc(m.nombre)}</b>: ${esc(MODALIDADES[m.slug].texto)}</li>`).join('')}</ul>`,
      rangos: `<h2>Rangos de Survival RPG</h2><p>Ventajas de los rangos permanentes tal como aparecen en la tienda actual.</p>
        <h3>Todos los rangos incluyen</h3><ul>${VENTAJAS_GENERALES.map(v => `<li>${v}</li>`).join('')}</ul>
        <h3>Comparativa</h3><div class="tabla-scroll"><table class="tabla"><tr><th>Rango</th><th>Precio</th><th>Homes</th><th>/jobs</th><th>Encantos</th><th>Mochila</th><th>Bóveda</th><th>Protección</th></tr>
        ${RANGOS_RPG.map(r => `<tr><td class="rango">${r.r}</td><td>${usd(r.precio)}</td><td>${r.homes}</td><td>${r.jobs}</td><td>${r.encantos}</td><td>${r.mochila}</td><td>${r.boveda}</td><td>${r.proteccion}</td></tr>`).join('')}</table></div>
        <p class="muted" style="margin-top:10px;font-size:0.9rem">Extra: Rubí añade prefijo personalizado y /near. Amatista añade MeeTion Pass Premium permanente y Armor Stand custom.</p>
        <a class="btn" href="#tienda/survival-rpg/${modalidad('survival-rpg')?.categorias.find(c => /permanentes/i.test(c.nombre))?.slug || 'destacados'}" style="margin-top:16px">Ver rangos en la tienda</a>`,
      comandos: `<h2>Comandos de rango</h2><p>Comandos que desbloquean los rangos de Survival RPG.</p><div class="cmds" style="margin-top:14px">${COMANDOS.map(([c, d]) => `<div class="cmd"><code>${c}</code><span>${d}</span></div>`).join('')}</div>`,
      normas: `<h2>Normas <span class="ejemplo">ejemplo</span></h2><ol><li>Respeta a todos los jugadores y al staff.</li><li>Prohibidos los hacks, clientes modificados y exploits.</li><li>Nada de spam ni publicidad de otros servidores.</li><li>Prohibido el griefing fuera de las zonas permitidas.</li><li>No compartas datos personales ni cuentas.</li><li>Las sanciones las decide el staff; se pueden apelar por Discord.</li></ol>`,
      faq: `<h2>Preguntas frecuentes</h2><div class="faq">
        <details open><summary>¿Cuánto tarda en llegar mi compra?</summary><p>Se entrega sola en el juego al completar el pago, aunque estés conectado.</p></details>
        <details><summary>¿Los rangos sirven en todas las modalidades?</summary><p>Los rangos de cada modalidad funcionan en esa modalidad. Los rangos globales (MEET, MEET+ y MEETGOD) dan ventajas en toda la network.</p></details>
        <details><summary>¿Qué diferencia hay entre temporal y permanente?</summary><p>El temporal dura un tiempo limitado; el permanente es para siempre. Si ya tienes un rango, puedes mejorarlo con un Upgrade pagando solo la diferencia.</p></details>
        <details><summary>¿Puedo jugar desde Bedrock?</summary><p>Elige "Bedrock" al identificarte en la tienda; tu usuario aparecerá con un punto delante.</p></details>
        <details><summary>He tenido un problema con un pago</summary><p>Abre un ticket en el Discord con tu usuario y el comprobante.</p></details></div>`,
    };
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; wiki</p><h1>Wiki</h1><p>Todo lo que necesitas saber para jugar en MeeTion.</p></div>
    <div class="wrap wiki"><div class="card wiki-menu">${Object.entries(SECCIONES).map(([k, v]) => `<a href="#wiki/${k}" class="${k === seccion ? 'activo' : ''}">${v}</a>`).join('')}</div>
    <div class="card wiki-cuerpo">${cuerpo[seccion] || cuerpo['primeros-pasos']}</div></div></div>`;
  },
  comunidad() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; comunidad</p><h1>La comunidad</h1><p>Eventos, sorteos, soporte y anuncios: todo pasa en el Discord.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="discord reveal"><svg class="icono" data-pixel="llama"></svg><div><h2>Únete al Discord</h2><p><b data-vivo="miembros">…</b> miembros · <b data-vivo="enlinea">…</b> conectados ahora</p></div>
        <a class="btn gold" href="https://discord.gg/${DISCORD}" target="_blank" rel="noopener">Entrar al Discord</a></div>
    </div></section></div>`;
  },
};
function tarjetaModalidad(m) {
  const info = MODALIDADES[m.slug];
  const n = m.evento.length + m.categorias.reduce((s, c) => s + c.productos.length, 0);
  return `<a class="card hover modalidad reveal" href="#tienda/${m.slug}/destacados">
    <svg class="icono" data-pixel="${info.icono}"></svg>
    <h3>${esc(m.nombre)}</h3><p>${esc(info.texto)}</p>
    <div class="meta"><span>${m.categorias.length} categorías</span><span>${n} productos</span></div>
    <div class="chips">${m.categorias.slice(0, 5).map(c => `<span>${esc(c.nombre)}</span>`).join('')}</div></a>`;
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
  const meta = $('#meta'); if (meta) setTimeout(() => { meta.style.width = '62%'; const pct = $('#meta-pct'); if (pct) contar(pct, 62, '%'); }, 300);
  obsReveal?.disconnect();
  obsReveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obsReveal.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.reveal', $('#vista')).forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; obsReveal.observe(el); });
  if (!render.primera) scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  render.primera = false;
  if (vista === 'tienda') prepararTienda();
}
render.primera = true;

function prepararTienda() {
  const cont = $('#productos'), m = modalidad(cont.dataset.mod);
  const original = cont.innerHTML;
  const aplicar = () => {
    const q = $('#buscar').value.trim().toLowerCase(), orden = $('#orden').value;
    let lista;
    if (q.length >= 2) lista = todosLosProductos().filter(x => x.p[1].toLowerCase().includes(q));
    else if (orden) {
      const base = location.hash.split('/')[2];
      const cat = base && base !== 'destacados' ? m.categorias.find(c => c.slug === base) : null;
      lista = (cat ? cat.productos : m.evento).map(p => ({ p, m }));
    }
    if (!lista) { cont.innerHTML = original; return; }
    if (orden === 'asc') lista.sort((a, b) => (a.p[2] || 0) - (b.p[2] || 0));
    if (orden === 'desc') lista.sort((a, b) => (b.p[2] || 0) - (a.p[2] || 0));
    if (orden === 'off') lista.sort((a, b) => ((b.p[3] ? 1 - b.p[2] / b.p[3] : 0) - (a.p[3] ? 1 - a.p[2] / a.p[3] : 0)));
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
  if (e.target.closest('[data-copiar]')) { navigator.clipboard?.writeText(IP).catch(() => {}); aviso('<b>✔</b> IP copiada. ¡Te esperamos en el fuego!'); }
});
addEventListener('hashchange', render);

/* arranque */
pintar(); pintarSesion(); pintarCarrito();
fetch('data/catalogo.json').then(r => r.json()).then(d => { CATALOGO = d; render(); })
  .catch(() => { $('#vista').innerHTML = '<p class="vacio">No se pudo cargar el catálogo.</p>'; });
