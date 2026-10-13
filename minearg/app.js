/* MINEARG Network · maqueta de web completa (Maikel Ferrer) */
const IP = 'mc.minearg.net';
const DISCORD = 'minearg';
const CDN = 'https://dunb17ur4ymx4.cloudfront.net/packages/images/';
const FIN_HALLOWEEN = new Date('2026-11-01T00:00:00-03:00');
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const guardar = (k, v) => { try { localStorage.setItem('minearg-' + k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { const v = localStorage.getItem('minearg-' + k); return v ? JSON.parse(v) : d; } catch { return d; } };

/* ======================= moneda ======================= */
// Los pesos se calculan al dólar oficial del día (dolarapi.com); si falla, se usa el último valor conocido
let dolar = 1535;
let moneda = leer('moneda', 'USD');
const ars = n => '$ ' + Math.round((n ?? 0) * dolar).toLocaleString('es-AR');
const usd = n => (n ?? 0).toFixed(2) + ' USD';
const precio = n => moneda === 'ARS' ? ars(n) : usd(n);
const precioCorto = n => moneda === 'ARS' ? `${ars(n)} <small>ARS</small>` : `${(n ?? 0).toFixed(2)} <small>USD</small>`;
function ponerMoneda(m) {
  moneda = m; guardar('moneda', m);
  $$('[data-moneda]').forEach(b => b.classList.toggle('on', b.dataset.moneda === m));
  pintarCarrito();
  if (CATALOGO.length) render(true);
}

/* ======================= contenido fijo ======================= */
const MODALIDADES = {
  'survival-op': { icono: 'espada', texto: 'Survival potenciado y custom: armas con encantamientos únicos, VIPs con kits y disfraces, trabajos, McMMO, clanes, parcelas y vehículos con /autos.' },
  'semiop': { icono: 'escudo', texto: 'El punto medio: protegés tu zona con un bloque, VIPs con llaves de bosses, kits de netherite y trabajos.' },
  'anarquico': { icono: 'tnt', texto: 'La modalidad anárquica. Entrá con un kit de netherite y sobreviví como puedas.' },
};
const NOMBRE_DESTACADOS = { 'survival-op': '🎃 Temporada Halloween', 'semiop': '🎃 Temporada Halloween' };

// Ventajas reales de los VIP permanentes de Survival OP (tienda pública)
const VIPS_OP = [
  { r: 'Bestia', temp: 6, perma: 15, homes: 10, prot: 10, disfraces: 6, dinero: '300.000', pociones: 2, subasta: '—', near: '—', tp: 'No' },
  { r: 'Épico', temp: 10, perma: 25, homes: 15, prot: 15, disfraces: 12, dinero: '500.000', pociones: 3, subasta: '—', near: '—', tp: 'Sí' },
  { r: 'Legendario', temp: 15.5, perma: 40.5, homes: 20, prot: 20, disfraces: 18, dinero: '1.000.000', pociones: 4, subasta: 5, near: '300', tp: 'Sí' },
  { r: 'Dios', temp: 22.5, perma: 60, homes: 30, prot: 30, disfraces: 24, dinero: '2.000.000', pociones: 5, subasta: 10, near: '400', tp: 'Sí' },
  { r: 'Eterno', temp: null, perma: 100, homes: 50, prot: 50, disfraces: 26, dinero: '5.000.000', pociones: 6, subasta: 15, near: '500', tp: 'Sí' },
];
const VIPS_SEMI = [
  { r: 'Bestia', perma: 9, area: '50×50', homes: 6, llaves: 2, kit: '1 set' },
  { r: 'Épico', perma: 15, area: '95×95', homes: 12, llaves: 4, kit: '2 sets' },
  { r: 'Legendario', perma: 42, area: '130×130', homes: 20, llaves: 6, kit: '3 sets' },
];
const COMANDOS = [
  ['/fly', 'Volar'], ['/d', 'Disfrazarte de mobs'], ['/feed', 'Llenar la comida'], ['/heal', 'Curarte toda la vida'],
  ['/ec', 'Abrir tu enderchest donde quieras'], ['/craft', 'Mesa de trabajo portátil'], ['/mesas', 'Menú con todas las mesas'], ['/back', 'Volver a tu posición anterior'],
  ['/hat', 'Ponerte un ítem en la cabeza'], ['/fix hand', 'Reparar el ítem en la mano'], ['/fix all', 'Reparar todo el inventario'], ['/nick', 'Cambiar tu nombre'],
  ['/condense', 'Pasar ítems a bloques'], ['/ah sellinventory', 'Subastar inventarios'], ['/near', 'Ver jugadores cercanos'], ['/autos', 'Sacar y guardar tus vehículos'],
];
const VOTOS = [
  { sitio: '40 Servidores MC', url: 'https://www.40servidoresmc.es/minearg/votar', nota: 'La lista que enlaza la tienda actual' },
  { sitio: 'Minecraft-MP', url: 'https://minecraft-mp.com/server/232881/vote/', nota: 'Ficha de MINEARG Network en Minecraft-MP' },
];

/* ======================= pixel art ======================= */
const PALETA = { k: '#000', w: '#fff', s: '#c8c8d8', S: '#8a8aa0', b: '#7a5230', d: '#4e3418', r: '#e3262f', R: '#8e0f16', o: '#f59a32', y: '#ffcf4a', Y: '#d99a10', g: '#3d8a22', G: '#2a5e17', p: '#ff8a1f', P: '#c95f00', f: '#f4f4ff', e: '#3ddc84', u: '#2f6fd6', U: '#1f4fa0', c: '#4fd1ff', v: '#8149ae', V: '#4b2a6b', n: '#1a1024', m: '#e9d2af' };
const DIBUJOS = {
  espada: ['.........sss', '........swS.', '.......swS..', '......swS...', '.....swS....', '..b.swS.....', '..bbwS......', '...bb.......', '..bdbb......', '.dd..b......', 'dd..........', 'd...........'],
  escudo: ['.SSSSSSSSSS.', 'SssssssssssS', 'SsrrrrrrrrsS', 'SsrrwrrwrrsS', 'SsrrwwwwrrsS', 'SsrrwrrwrrsS', 'SsrrwrrwrrsS', '.SsrrrrrrsS.', '.SsrrrrrrsS.', '..SsrrrrsS..', '...SssssS...', '....SSSS....'],
  tnt: ['rrrrrrrrrrrr', 'rRrRrRrRrRrr', 'rrrrrrrrrrrr', 'wwwwwwwwwwww', 'wkkkwkwkkkkw', 'wwkwwkkwwkww', 'wwkwwkwkwkww', 'wwkwwkwkwkww', 'wwwwwwwwwwww', 'rrrrrrrrrrrr', 'rRrRrRrRrRrr', 'rrrrrrrrrrrr'],
  regalo: ['...rr..rr...', '....rrrr....', 'vvvvvrrvvvvv', 'vVVVVrrVVVVv', 'vvvvvrrvvvvv', '.vVVVrrVVVv.', '.vVVVrrVVVv.', '.vVVVrrVVVv.', '.vVVVrrVVVv.', '.vVVVrrVVVv.', '.vvvvrrvvvv.', '............'],
  rayo: ['......yyyy..', '.....yyyy...', '....yyyy....', '...yyyy.....', '..yyyyyyyy..', '.....yyyy...', '....yyyy....', '...yyy......', '..yyy.......', '.yy.........', 'y...........', '............'],
  corona: ['............', 'y....y....y.', 'yy..yyy..yy.', 'yyy.yyy.yyy.', 'yyyyyyyyyyy.', 'yyryyyyyeyy.', 'yyyyyyyyyyy.', 'YYYYYYYYYYY.', '............', '............', '............', '............'],
  calabaza: ['.....g......', '....gG......', '..ppppppp...', '.pppppppppp.', 'ppkkppppkkpp', 'ppkkppppkkpp', 'pppppkkppppp', 'ppkpppppkpp.', 'pppkkkkkppp.', '.ppppppppp..', '..PPPPPPP...', '............'],
  murcielago: ['............', '............', 'v....vv....v', 'vv..vvvv..vv', 'vvv.vrvrv.vv', 'vvvvvvvvvvvv', '.vvvvvvvvvv.', '..vv.vv.vv..', '..v......v..', '............', '............', '............'],
  fantasma: ['...ffffff...', '..ffffffff..', '.ffffffffff.', '.ffkkffkkff.', '.ffkkffkkff.', '.ffffffffff.', '.fffffkfffff', '.ffffkkkffff', '.ffffffffff.', '.ffffffffff.', '.ff.ff.ff.ff', '.f..f..f..f.'],
  gema: ['....cccc....', '...cwwccc...', '..cwwcccuc..', '.cwwcccccuu.', 'cwcccccccuuu', '.ccccccccuu.', '..ucccccuu..', '...ucccuu...', '....ucuu....', '.....uu.....', '............', '............'],
  llave: ['............', '..yyy.......', '.yYYYy......', '.yY.Yy......', '.yYYYyyyyyyy', '..yyy....y.y', '.........y.y', '............', '............', '............', '............', '............'],
  jaula: ['ssssssssssss', 'sk.k.k.k.k.s', 'sk.k.k.k.k.s', 'sk.kgggk.k.s', 'sk.gwgwg.k.s', 'sk.ggggg.k.s', 'sk.kgggk.k.s', 'sk.k.k.k.k.s', 'sk.k.k.k.k.s', 'ssssssssssss', '............', '............'],
  cofre: ['............', '.bbbbbbbbbb.', 'bddddddddddb', 'bdbbbbbbbbdb', 'bbbbbbbbbbbb', 'kkkkkyykkkkk', 'bbbbbyybbbbb', 'bdbbbbbbbbdb', 'bdbbbbbbbbdb', 'bddddddddddb', '.bbbbbbbbbb.', '............'],
  moneda: ['....yyyy....', '..yyYYYYyy..', '.yYYyyyyYYy.', '.yYyyYYyyYy.', 'yYyyYyyYyyYy', 'yYyyyYYyyyYy', 'yYyyyyyYyyYy', 'yYyyYyyYyyYy', '.yYyyYYyyYy.', '.yYYyyyyYYy.', '..yyYYYYyy..', '....yyyy....'],
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

/* ======================= noche: estrellas, luciérnagas y murciélagos ======================= */
(() => {
  const lienzo = $('#noche'), ctx = lienzo.getContext('2d');
  let estrellas = [], luces = [], murcielagos = [];
  const ALA = [['n....nn....n', 'nn..nnnn..nn', 'nnnnnnnnnnnn', '.nnnnnnnnnn.', '..n..nn..n..'], ['............', '....nnnn....', '.nnnnnnnnnn.', 'nnnnnnnnnnnn', 'n...n..n...n']];
  const luz = inicio => ({ x: Math.random() * innerWidth, y: inicio ? Math.random() * innerHeight : innerHeight + 10, t: Math.random() < 0.3 ? 3 : 2, v: 0.15 + Math.random() * 0.5, o: Math.random() * 6.3, c: Math.random() < 0.7 ? '#f59a32' : '#ffcf4a' });
  const murcielago = () => { const izq = Math.random() < 0.5; return { x: izq ? -60 : innerWidth + 60, y: 60 + Math.random() * innerHeight * 0.45, v: (izq ? 1 : -1) * (1.2 + Math.random() * 1.4), e: 2 + Math.floor(Math.random() * 2), o: Math.random() * 6.3 }; };
  const ajustar = () => {
    lienzo.width = innerWidth * devicePixelRatio; lienzo.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    estrellas = Array.from({ length: Math.round(innerWidth * innerHeight / 7000) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight * 0.75, t: Math.random() < 0.2 ? 2 : 1, o: Math.random() * 6.3 }));
    luces = Array.from({ length: Math.round(innerWidth * innerHeight / 26000) }, () => luz(true));
  };
  let proximo = 0;
  const dibujar = ms => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of estrellas) { ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(ms / 700 + s.o)); ctx.fillStyle = '#d2b7ff'; ctx.fillRect(Math.round(s.x), Math.round(s.y), s.t, s.t); }
    for (const l of luces) {
      l.y -= l.v; l.x += Math.sin(ms / 1200 + l.o) * 0.6;
      ctx.globalAlpha = 0.35 + 0.65 * Math.max(0, Math.sin(ms / 380 + l.o)); ctx.fillStyle = l.c; ctx.fillRect(Math.round(l.x), Math.round(l.y), l.t, l.t);
      if (l.y < -10) Object.assign(l, luz(false));
    }
    if (ms > proximo && murcielagos.length < 3) { murcielagos.push(murcielago()); proximo = ms + 2500 + Math.random() * 5000; }
    ctx.globalAlpha = 1; ctx.fillStyle = '#07040b';
    murcielagos = murcielagos.filter(b => {
      b.x += b.v; const y = b.y + Math.sin(ms / 260 + b.o) * 10;
      const f = ALA[Math.floor(ms / 140) % 2];
      f.forEach((fila, j) => [...fila].forEach((ch, i) => { if (ch === 'n') ctx.fillRect(Math.round(b.x + i * b.e), Math.round(y + j * b.e), b.e, b.e); }));
      return b.x > -80 && b.x < innerWidth + 80;
    });
    ctx.globalAlpha = 1;
    if (!reducido) requestAnimationFrame(dibujar);
  };
  ajustar(); addEventListener('resize', ajustar); requestAnimationFrame(dibujar);
})();

/* ======================= datos en vivo ======================= */
const vivo = { jugadores: null, maximo: null, miembros: null, enLinea: null };
const contar = (el, total, suf = '') => {
  if (!el) return;
  const t0 = performance.now();
  const paso = t => { const k = reducido ? 1 : Math.min(1, (t - t0) / 1300); el.textContent = Math.round(total * (1 - (1 - k) ** 3)).toLocaleString('es-AR') + suf; if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
};
const pintarVivo = () => {
  $$('[data-vivo="jugadores"]').forEach(el => vivo.jugadores != null ? contar(el, vivo.jugadores) : null);
  $$('[data-vivo="miembros"]').forEach(el => vivo.miembros != null ? contar(el, vivo.miembros) : null);
  $$('[data-vivo="enlinea"]').forEach(el => vivo.enLinea != null ? contar(el, vivo.enLinea) : null);
  $$('[data-vivo="dolar"]').forEach(el => { el.textContent = '$ ' + dolar.toLocaleString('es-AR'); });
};
fetch('https://api.mcstatus.io/v2/status/java/' + IP).then(r => r.json()).then(d => { vivo.jugadores = d.online ? d.players.online : 0; pintarVivo(); }).catch(() => {});
fetch(`https://discord.com/api/v10/invites/${DISCORD}?with_counts=true`).then(r => r.json()).then(d => { vivo.miembros = d.approximate_member_count; vivo.enLinea = d.approximate_presence_count; pintarVivo(); }).catch(() => {});
fetch('https://dolarapi.com/v1/dolares/oficial').then(r => r.json()).then(d => { if (d.venta > 0) { dolar = d.venta; pintarCarrito(); if (moneda === 'ARS' && CATALOGO.length) render(true); else pintarVivo(); } }).catch(() => {});

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
// Las imágenes de Tebex se sirven reducidas a webp con wsrv.nl
const imagen = (p, w = 240) => p[4] ? `https://wsrv.nl/?url=${encodeURIComponent(CDN.replace('https://', '') + p[4])}&w=${w}&h=${w}&fit=contain&output=webp&q=82` : '';
const iconoDe = p => { const n = (p[1] || '').toLowerCase(); return /llave/.test(n) ? 'llave' : /spawner/.test(n) ? 'jaula' : /\$|giftcard/.test(n) ? 'moneda' : /pase/.test(n) ? 'gema' : 'cofre'; };
const sinImagen = (p, tam) => `<svg class="icono" data-pixel="${iconoDe(p)}" style="width:${tam}px;height:${tam}px;margin:0 auto"></svg>`;
const todosLosProductos = () => CATALOGO.flatMap(m => [...m.evento.map(p => ({ p, m, c: null })), ...m.categorias.flatMap(c => c.productos.map(p => ({ p, m, c })))]);
const totalDe = m => m.evento.length + m.categorias.reduce((s, c) => s + c.productos.length, 0);

/* ======================= sesión y carrito ======================= */
let sesion = leer('sesion', null);
let carrito = leer('carrito', []);
const avatarDe = (nombre, tam = 32) => /^[A-Za-z0-9_]{3,16}$/.test(nombre || '') ? `https://mc-heads.net/avatar/${nombre}/${tam}` : `https://mc-heads.net/avatar/MHF_Steve/${tam}`;
function pintarSesion() {
  $('#avatar').src = avatarDe(sesion?.nombre);
  $('#nombre-usuario').textContent = sesion ? sesion.nombre : 'Ingresá';
}
function pintarCarrito() {
  $('#num-carrito').textContent = carrito.reduce((s, l) => s + l.cant, 0);
  $('#lineas').innerHTML = carrito.length ? carrito.map((l, i) => `
    <div class="linea">${l.img ? `<img src="${esc(l.img)}" alt="">` : '<svg class="icono" data-pixel="cofre" style="width:48px;height:48px;margin:0"></svg>'}
      <div><b>${esc(l.nombre)}</b><small class="muted">${esc(l.modalidad)}</small>
        <div class="cant"><button data-menos="${i}">−</button><span>${l.cant}</span><button data-mas="${i}">+</button></div></div>
      <div class="p">${precio(l.precio * l.cant)}</div></div>`).join('') : '<p class="vacio">Tu carrito está vacío.<br>Sumá algo de la tienda.</p>';
  const total = carrito.reduce((s, l) => s + l.precio * l.cant, 0);
  $('#total').textContent = precio(total);
  $('#pago-total').textContent = carrito.length ? `Total: ${usd(total)} · ${ars(total)} ARS` : '';
  guardar('carrito', carrito); pintar($('#lineas'));
}
function anadir(p, m) {
  const ex = carrito.find(l => l.id === p[0]);
  ex ? ex.cant++ : carrito.push({ id: p[0], nombre: p[1], precio: p[2] || 0, img: imagen(p, 96), modalidad: m.nombre, cant: 1 });
  pintarCarrito(); aviso(`<b>✔</b> ${esc(p[1])} al carrito`);
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

$('#btn-usuario').addEventListener('click', () => { $('#input-usuario').value = sesion?.nombre || ''; abrir('#modal-login'); setTimeout(() => $('#input-usuario').focus(), 200); });
const previa = () => { const n = $('#input-usuario').value.trim(); $('#previa').src = avatarDe(n, 48); $('#previa-txt').textContent = n || 'Así vas a aparecer en la tienda'; };
let tPrev; $('#input-usuario').addEventListener('input', () => { clearTimeout(tPrev); tPrev = setTimeout(previa, 350); });
$('#btn-entrar').addEventListener('click', () => {
  const n = $('#input-usuario').value.trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(n)) return aviso('Escribí un usuario válido (3–16 caracteres)');
  sesion = { nombre: n }; guardar('sesion', sesion); pintarSesion(); cerrarTodo(); aviso(`<b>✔</b> ¡Hola, ${esc(n)}!`);
});

function verProducto(id) {
  const hit = todosLosProductos().find(x => x.p[0] === id); if (!hit) return;
  const { p, m, c } = hit;
  const lineas = (p[5] || '').split('\n').map(l => l.replace(/\*\*/g, '').replace(/^(COMANDOS|EXTRAS)\s*:?\s*/i, '').replace(/^\/\s+/, '/').trim()).filter(l => !/^(VIP .* PERMANENTE|Comandos:?)$/i.test(l)).filter(l => l && !/^#?El (nombre|Nick)/i.test(l) && !/click para/i.test(l));
  $('#contenido-producto').innerHTML = `
    <h3>${esc(p[1])}</h3>
    <div class="img-grande">${imagen(p) ? `<img src="${esc(imagen(p, 400))}" alt="">` : sinImagen(p, 120)}</div>
    <p class="muted">${esc(m.emoji)} ${esc(m.nombre)}${c ? ' · ' + esc(c.emoji + ' ' + c.nombre) : ''}</p>
    ${lineas.length ? `<ul>${lineas.map(v => `<li>${esc(v)}</li>`).join('')}</ul>` : ''}
    <p class="muted" style="font-size:0.8rem">Descripción tal como aparece en la tienda actual. Se entrega sola en el juego al completar el pago.</p>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px">
      <div class="pixel" style="font-size:1.4rem;color:var(--gold)">${precio(p[2])}<span class="precio-ars">${moneda === 'ARS' ? usd(p[2]) : ars(p[2]) + ' ARS'}</span></div>
      <button class="btn gold" id="btn-add-modal">Sumar</button>
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
    <div class="precio">${p[3] ? `<span class="antes">${precio(p[3])}</span>` : ''}${precioCorto(p[2])}</div>
    <button class="btn sm" data-add="${esc(p[0])}">Sumar</button>
  </div>`;
};
const JUGADORES = ['Tincho_09', 'xLautaro', 'Fede_PvP', 'Cami.mc', 'Nahue77', 'ElBrujo', 'Sofi_OP', 'DarkGaucho', 'Juanchi_YT', 'Meli22', 'RulosMC', 'Facu2010'];
const SKINS = ['MHF_Steve', 'MHF_Alex', 'MHF_Blaze', 'MHF_Enderman', 'MHF_Skeleton', 'MHF_Zombie', 'MHF_Creeper', 'MHF_Witch'];
let feedTimer;
function arrancarFeed() {
  clearInterval(feedTimer);
  const lista = $('#feed'); if (!lista) return;
  const pool = todosLosProductos().filter(x => x.p[2] > 0 && x.m.slug !== 'giftcards');
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
const selectorMoneda = () => `<div class="moneda" role="group" aria-label="Moneda"><button data-moneda="USD" class="${moneda === 'USD' ? 'on' : ''}">USD</button><button data-moneda="ARS" class="${moneda === 'ARS' ? 'on' : ''}">ARS</button></div>`;
const MES = new Date().toLocaleDateString('es', { month: 'long' });
const widgets = () => `
  <div class="card widget"><h4>Compras recientes <span class="en-vivo">EN VIVO</span></h4><ul class="feed" id="feed"></ul></div>`;
// Franja de arriba de la tienda: se ve nada más entrar, sin hacer scroll.
const franjaTienda = () => `
  <div class="franja-tienda">
    <div class="card donador-mes"><span class="corona-flota"><svg data-pixel="corona"></svg></span>
      <img src="https://mc-heads.net/body/MHF_Witch/120" alt="">
      <div><p class="label" style="margin:0">&gt; top #1 de ${MES} <span class="ejemplo">ejemplo</span></p><h3>Jugador****</h3>
        <p class="muted">El que más aportó este mes. Sale acá y se lleva un premio.</p></div></div>
    <div class="card meta-mes"><div class="meta-cab"><p class="label" style="margin:0">&gt; meta de ${MES} <span class="ejemplo">ejemplo</span></p><b class="pixel" id="meta-pct">0%</b></div>
      <div class="meta-bar grande"><i id="meta"></i></div>
      <p class="muted">Cada compra suma. Al llegar al 100 %: <b style="color:var(--gold)">llaves de Halloween</b> para todo el servidor.</p></div>
  </div>`;

/* ======================= vistas ======================= */
const VISTAS = {
  inicio() {
    const jugables = CATALOGO.filter(m => MODALIDADES[m.slug]);
    return `<div class="vista">
    <header class="hero"><div class="wrap">
      <div class="logo-wrap"><img src="logo.webp" alt="MINEARG"><span class="roca" style="left:6%;bottom:12%"></span><span class="roca" style="right:9%;bottom:6%;animation-delay:-1.6s;width:10px;height:10px"></span></div>
      <div class="stats">
        <span class="stat"><span class="dot"></span><b data-vivo="jugadores">…</b> jugando ahora</span>
        <span class="stat">Discord <b data-vivo="miembros">…</b> miembros</span>
        <span class="stat">Versiones <b>1.8 – 1.21</b></span>
      </div>
      <h1>Survival OP<br><span class="rayo">⚡ Custom ⚡</span></h1>
      <p class="lead">La network argentina de Survival OP, SemiOP y Anárquico. Elegí tu modalidad, copiá la IP y entrá.</p>
      <div class="ip"><div><small>IP del servidor</small><code>${IP}</code></div><button class="btn" data-copiar>Copiar IP</button></div>
    </div></header>
    <section class="alt"><div class="wrap pesos">
      <div class="reveal"><p class="label">&gt; pagá en pesos</p><h2>Pesos argentinos,<br>sin abrir ticket</h2>
        <p class="muted" style="font-size:1.05rem">Cada precio de la tienda se ve también en pesos y se paga con <span class="mp">Mercado Pago</span>. Lo comprado llega solo al juego, aunque no haya ningún staff conectado.</p>
        <p class="cambio" style="margin-top:14px">Dólar oficial de hoy: <b data-vivo="dolar">…</b> · Por ejemplo, el VIP Dios Permanente sale <b>${ars(60)}</b>.</p>
        <a class="btn gold" href="#tienda/survival-op/vip" style="margin-top:18px" data-ir-ars>Ver la tienda en pesos</a></div>
      <div class="antes-despues reveal">
        <div class="paso mal"><i>🎫</i><div><b>Hoy</b><span>Para pagar en pesos abrís un ticket en el Discord, esperás a que te atienda un staff y te entregan a mano.</span></div></div>
        <div class="paso mal"><i>🧱</i><div><b>Hoy</b><span>"+1 Parcela" también pide ticket para que un staff haga el trabajo.</span></div></div>
        <div class="paso bien"><i>⚡</i><div><b>Con la web nueva</b><span>Elegís, pagás en pesos o en dólares y lo tenés en el juego al instante. El staff no toca nada.</span></div></div>
      </div>
    </div></section>
    <section><div class="wrap">
      <p class="label reveal">&gt; accesos rápidos</p><h2 class="reveal">Todo en un solo lugar</h2>
      <div class="accesos">
        <a class="card hover acceso reveal" href="#tienda"><svg class="icono" data-pixel="cofre"></svg><h3>Tienda</h3><p>${todosLosProductos().length} productos en ${CATALOGO.reduce((s, m) => s + m.categorias.length + (m.evento.length ? 1 : 0), 0)} categorías, en dólares o en pesos.</p><span class="ir">Ver tienda →</span></a>
        <a class="card hover acceso reveal" href="#votar"><svg class="icono" data-pixel="gema"></svg><h3>Votar</h3><p>Votá todos los días y ganá recompensas en el juego.</p><span class="ir">Votar →</span></a>
        <a class="card hover acceso reveal" href="#wiki"><svg class="icono" data-pixel="espada"></svg><h3>Wiki</h3><p>Comparativa de VIPs, comandos, normas y guía para arrancar.</p><span class="ir">Abrir wiki →</span></a>
        <a class="card hover acceso reveal" href="#comunidad"><svg class="icono" data-pixel="murcielago"></svg><h3>Discord</h3><p><b data-vivo="enlinea">…</b> personas conectadas ahora mismo.</p><span class="ir">Entrar →</span></a>
      </div>
    </div></section>
    <section class="alt"><div class="wrap">
      <p class="label reveal">&gt; modalidades</p><h2 class="reveal">Elegí cómo jugar</h2>
      <div class="grid-3">${jugables.map(m => tarjetaModalidad(m)).join('')}</div>
    </div></section></div>`;
  },
  modalidades() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; modalidades</p><h1>Tres formas de jugar</h1><p>Cada modalidad tiene su progreso, sus VIPs y su sección en la tienda.</p></div>
    <section style="padding-top:10px"><div class="wrap"><div class="grid-3">${CATALOGO.filter(m => MODALIDADES[m.slug]).map(m => tarjetaModalidad(m)).join('')}</div></div></section></div>`;
  },
  tienda(modSlug, catSlug) {
    const m = modalidad(modSlug) || modalidad('survival-op');
    let cat = catSlug && catSlug !== 'destacados' ? m.categorias.find(c => c.slug === catSlug) : null;
    if (!cat && !m.evento.length) cat = m.categorias[0];
    const productos = cat ? cat.productos : m.evento;
    const titulo = cat ? `${cat.emoji} ${cat.nombre}` : NOMBRE_DESTACADOS[m.slug] || 'Destacados';
    const opcion = (x, c) => `<option value="${x.slug}/${c ? c.slug : 'destacados'}" ${(c ? cat === c : x.slug === m.slug && !cat) ? 'selected' : ''}>${esc(c ? c.emoji + ' ' + c.nombre : NOMBRE_DESTACADOS[x.slug])} (${(c ? c.productos : x.evento).length})</option>`;
    return `<div class="vista"><div class="wrap">
      <div class="cabecera" style="padding-bottom:22px"><p class="label">&gt; tienda oficial</p><h1>Tienda</h1><p>Pagás y lo recibís en el juego al instante. ${todosLosProductos().length} productos de la tienda actual, en dólares o en pesos.</p></div>
      ${franjaTienda()}
      <div class="tienda">
        <aside class="lateral">
          <div class="card mods">${CATALOGO.map(x => `
            <details ${x.slug === m.slug ? 'open' : ''}><summary>${esc(x.emoji)} ${esc(x.nombre)} <small>${totalDe(x)}</small></summary>
              ${x.evento.length ? `<a href="#tienda/${x.slug}/destacados" class="${x.slug === m.slug && !cat ? 'activo' : ''}">${esc(NOMBRE_DESTACADOS[x.slug] || 'Destacados')} <small>${x.evento.length}</small></a>` : ''}
              ${x.categorias.map(c => `<a href="#tienda/${x.slug}/${c.slug}" class="${cat === c ? 'activo' : ''}">${esc(c.emoji)} ${esc(c.nombre)} <small>${c.productos.length}</small></a>`).join('')}
            </details>`).join('')}
          </div>
          ${widgets()}
        </aside>
        <div>
          <select class="cat-movil" id="cat-movil" aria-label="Categoría">${CATALOGO.map(x => `<optgroup label="${esc(x.emoji + ' ' + x.nombre)}">
            ${x.evento.length ? opcion(x, null) : ''}${x.categorias.map(c => opcion(x, c)).join('')}</optgroup>`).join('')}</select>
          <div class="barra-tienda"><h2>${esc(titulo)}</h2>
            ${selectorMoneda()}
            <label class="buscar">🔍<input id="buscar" placeholder="Buscar en toda la tienda…"></label>
            <select class="orden" id="orden"><option value="">Orden de la tienda</option><option value="asc">Precio ↑</option><option value="desc">Precio ↓</option></select>
          </div>
          <p class="muted" style="margin:-8px 0 16px;font-size:0.9rem">${esc(m.emoji)} ${esc(m.nombre)} · ${productos.length} productos${moneda === 'ARS' ? ` · en pesos al dólar oficial de hoy (<span data-vivo="dolar">…</span>)` : ''}</p>
          ${cat?.aviso ? `<div class="aviso">🔔 ${esc(cat.aviso)}</div>` : ''}
          <div class="productos" id="productos" data-mod="${m.slug}" data-cat="${cat ? cat.slug : ''}">${productos.map(p => tarjetaProducto(p, m)).join('') || '<p class="vacio">No hay productos en esta categoría.</p>'}</div>
        </div>
      </div></div></div>`;
  },
  eventos() {
    const op = modalidad('survival-op'), semi = modalidad('semiop');
    const llaves = op.evento.filter(p => /halloween/i.test(p[1]));
    const pase = op.evento.filter(p => /pase/i.test(p[1]));
    const armas = [...op.evento.filter(p => /espada|hacha/i.test(p[1])), ...semi.evento];
    const muestra = (lista, n = 3) => lista.filter(p => p[4]).slice(0, n).map(p => `<div data-ver="${esc(p[0])}" style="cursor:pointer"><img src="${esc(imagen(p))}" alt=""><b>${esc(p[1])}</b><br><span class="muted">${precio(p[2])}</span></div>`).join('');
    const ev = (titulo, icono, texto, lista, ruta, extra = '') => `
      <div class="card evento-card reveal" style="margin-bottom:26px"><div>
        <h3><svg data-pixel="${icono}" style="width:34px;height:34px;display:inline;vertical-align:-6px"></svg> ${titulo}</h3>
        <p class="muted">${texto}</p>${extra}
        <div class="chips"><span>${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}</span></div>
        <a class="btn" href="#tienda/${ruta}" style="margin-top:18px">Ver en la tienda</a>
      </div><div class="muestra">${muestra(lista)}</div></div>`;
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; eventos</p><h1>Eventos activos</h1><p>Lo de temporada, solo mientras dure el evento.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      ${ev('Cofre de Halloween 2026', 'calabaza', 'Conseguí llaves y abrí el cofre de Halloween en /warp cofres. Cada llave te da un premio.', llaves, 'survival-op/destacados', '<div class="cuenta-grande" id="cuenta-grande"></div><p class="muted" style="font-size:0.8rem">Fecha de cierre <span class="ejemplo">ejemplo</span></p>')}
      ${ev('Pase de Batalla VIP', 'gema', 'Subí de nivel, completá misiones y reclamá premios exclusivos durante toda la temporada.', pase, 'survival-op/destacados')}
      ${ev('Armas de temporada', 'espada', 'Espadas y hachas con encantamientos únicos, con tu nick en el nombre. En Survival OP y SemiOP.', armas, 'survival-op/destacados')}
    </div></section></div>`;
  },
  votar() {
    const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; votar</p><h1>Votá y ganá</h1><p>Cada voto ayuda a que más jugadores encuentren MINEARG. Votá en todas las listas cada día.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div style="display:grid;gap:18px">${VOTOS.map((v, i) => `
        <div class="card hover voto reveal"><span class="n">${i + 1}</span><div><h3>${esc(v.sitio)}</h3><p class="muted">${esc(v.nota)}</p></div>
          <a class="btn gold" href="${esc(v.url)}" target="_blank" rel="noopener">Votar</a></div>`).join('')}
      </div>
      <div class="grid-2" style="margin-top:30px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Recompensas por voto <span class="ejemplo">ejemplo</span></h3>
          <ul style="color:var(--muted);padding-left:20px;margin-top:10px"><li>1 llave premium por cada lista</li><li>Dinero del juego en tu modalidad</li><li>Votar en las 2 listas: llave de Halloween</li></ul>
          <h3 class="pixel" style="font-size:0.9rem;margin-top:18px">Tu racha semanal <span class="ejemplo">ejemplo</span></h3>
          <div class="racha">${dias.map((d, i) => `<div class="${i < 4 ? 'hecho' : ''}"><b>${i < 4 ? '✔' : '·'}</b>${d}</div>`).join('')}</div></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Top votantes del mes <span class="ejemplo">ejemplo</span></h3>
          <table class="tabla" style="margin-top:10px"><tr><th>#</th><th>Jugador</th><th>Votos</th></tr>
          ${['DarkGaucho', 'Sofi_OP', 'Nahue77', 'Tincho_09', 'Cami.mc'].map((j, i) => `<tr><td>${i + 1}</td><td><img src="https://mc-heads.net/avatar/${SKINS[i]}/20" style="display:inline;vertical-align:-4px;margin-right:8px">${j}</td><td>${[61, 58, 52, 47, 40][i]}</td></tr>`).join('')}</table></div>
      </div>
    </div></section></div>`;
  },
  wiki(seccion = 'primeros-pasos') {
    const SECCIONES = { 'primeros-pasos': 'Primeros pasos', vips: 'VIPs', comandos: 'Comandos', normas: 'Normas', faq: 'Preguntas frecuentes' };
    const cuerpo = {
      'primeros-pasos': `<h2>Primeros pasos</h2>
        <ol><li>Abrí Minecraft Java (de la 1.8 a la 1.21) y agregá el servidor <b style="color:var(--gold)">${IP}</b>.</li><li>Elegí tu modalidad en el lobby.</li><li>Protegé tu zona y empezá a progresar.</li><li>Sumate al Discord para enterarte de eventos y sorteos.</li></ol>
        <h3>¿Qué modalidad elijo?</h3><ul>${CATALOGO.filter(m => MODALIDADES[m.slug]).map(m => `<li><b>${esc(m.nombre)}</b>: ${esc(MODALIDADES[m.slug].texto)}</li>`).join('')}</ul>`,
      vips: `<h2>VIPs de Survival OP</h2><p>Ventajas de los VIP permanentes tal como aparecen en la tienda actual. Los temporales duran 30 días.</p>
        <h3>Todos incluyen</h3><ul><li>/fly, /d, /feed, /ec, /craft, /back y /mesas</li><li>Kit del VIP cada 30 días y cajas de pociones OP todos los días</li><li>/ah sellinventory y /condense</li></ul>
        <h3>Comparativa</h3><div class="tabla-scroll"><table class="tabla"><tr><th>VIP</th><th>30 días</th><th>Permanente</th><th>Homes</th><th>Protecciones</th><th>Disfraces</th><th>Dinero</th><th>Pociones/día</th><th>Subasta</th><th>/near</th><th>TP sin espera</th></tr>
        ${VIPS_OP.map(r => `<tr><td class="rango">${r.r}</td><td>${r.temp ? precio(r.temp) : '—'}</td><td>${precio(r.perma)}</td><td>${r.homes}</td><td>${r.prot}</td><td>${r.disfraces}</td><td>$${r.dinero}</td><td>${r.pociones}</td><td>${r.subasta}</td><td>${r.near}</td><td>${r.tp}</td></tr>`).join('')}</table></div>
        <p class="muted" style="margin-top:10px;font-size:0.9rem">Desde Épico: /hat, /heal y /fix hand. Desde Legendario: /fix all y /nick. Eterno suma disfraz de dragón, /efectos y chat violeta.</p>
        <h3>VIPs de SemiOP</h3><div class="tabla-scroll"><table class="tabla"><tr><th>VIP</th><th>Permanente</th><th>Zona protegida</th><th>Homes</th><th>Llaves de bosses</th><th>Kit</th></tr>
        ${VIPS_SEMI.map(r => `<tr><td class="rango">${r.r}</td><td>${precio(r.perma)}</td><td>${r.area}</td><td>${r.homes}</td><td>${r.llaves}</td><td>${r.kit}</td></tr>`).join('')}</table></div>
        <a class="btn" href="#tienda/survival-op/vip" style="margin-top:16px">Ver VIPs en la tienda</a>`,
      comandos: `<h2>Comandos de VIP</h2><p>Lo que desbloquean los VIP de Survival OP.</p><div class="cmds" style="margin-top:14px">${COMANDOS.map(([c, d]) => `<div class="cmd"><code>${c}</code><span>${d}</span></div>`).join('')}</div>`,
      normas: `<h2>Normas <span class="ejemplo">ejemplo</span></h2><ol><li>Respetá a todos los jugadores y al staff.</li><li>Prohibidos los hacks, clientes modificados y exploits.</li><li>Nada de spam ni publicidad de otros servidores.</li><li>Prohibido el griefing fuera de las zonas permitidas.</li><li>No compartas datos personales ni cuentas.</li><li>Las sanciones las decide el staff y se pueden apelar por Discord.</li></ol>`,
      faq: `<h2>Preguntas frecuentes</h2><div class="faq">
        <details open><summary>¿Puedo pagar en pesos argentinos?</summary><p>Sí. Elegí "ARS" arriba y pagá con Mercado Pago; no hace falta abrir ticket.</p></details>
        <details><summary>¿Cuánto tarda en llegar mi compra?</summary><p>Se entrega sola en el juego al completar el pago, aunque estés conectado.</p></details>
        <details><summary>¿Qué diferencia hay entre temporal y permanente?</summary><p>El temporal dura 30 días; el permanente es para siempre.</p></details>
        <details><summary>¿Puedo pasar mis cosas a otra cuenta?</summary><p>Con "Migrar cuenta" se transfieren tu rango, VIP, dinero, McMMO, trabajos, kills y nivel a otra cuenta tuya.</p></details>
        <details><summary>¿Cómo funcionan las GiftCards?</summary><p>Comprás una GiftCard y te llega el código al correo para regalársela a quien quieras.</p></details>
        <details><summary>Tuve un problema con un pago</summary><p>Escribí a mineargnetwork@gmail.com o abrí un ticket en el Discord con tu usuario y el comprobante.</p></details></div>`,
    };
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; wiki</p><h1>Wiki</h1><p>Todo lo que tenés que saber para jugar en MINEARG.</p></div>
    <div class="wrap wiki"><div class="card wiki-menu">${Object.entries(SECCIONES).map(([k, v]) => `<a href="#wiki/${k}" class="${k === seccion ? 'activo' : ''}">${v}</a>`).join('')}</div>
    <div class="card wiki-cuerpo">${cuerpo[seccion] || cuerpo['primeros-pasos']}</div></div></div>`;
  },
  comunidad() {
    return `<div class="vista"><div class="wrap cabecera"><p class="label">&gt; comunidad</p><h1>La comunidad</h1><p>Eventos, sorteos, soporte y anuncios: todo pasa en el Discord.</p></div>
    <section style="padding-top:10px"><div class="wrap">
      <div class="discord reveal"><svg class="icono" data-pixel="murcielago"></svg><div><h2>Sumate al Discord</h2><p><b data-vivo="miembros">…</b> miembros · <b data-vivo="enlinea">…</b> conectados ahora</p></div>
        <a class="btn gold" href="https://discord.gg/${DISCORD}" target="_blank" rel="noopener">Entrar al Discord</a></div>
      <div class="grid-2" style="margin-top:26px">
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">Contacto</h3><p class="muted" style="margin-top:8px">Correo: <b style="color:var(--text)">mineargnetwork@gmail.com</b><br>Soporte y compras: ticket en el Discord.</p></div>
        <div class="card reveal"><h3 class="pixel" style="font-size:1rem">IP del servidor</h3><p class="muted" style="margin-top:8px"><b style="color:var(--gold)">${IP}</b> · Java 1.8 – 1.21</p><button class="btn sm" data-copiar style="margin-top:12px">Copiar IP</button></div>
      </div>
    </div></section></div>`;
  },
};
function tarjetaModalidad(m) {
  const info = MODALIDADES[m.slug];
  return `<a class="card hover modalidad reveal" href="#tienda/${m.slug}/destacados">
    <svg class="icono" data-pixel="${info.icono}"></svg>
    <h3>${esc(m.nombre)}</h3><p>${esc(info.texto)}</p>
    <div class="meta"><span>${(n => n + (n === 1 ? ' categoría' : ' categorías'))(m.categorias.length + (m.evento.length ? 1 : 0))}</span><span>${totalDe(m)} productos</span></div>
    <div class="chips">${m.categorias.slice(0, 5).map(c => `<span>${esc(c.nombre)}</span>`).join('')}</div></a>`;
}

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
  const meta = $('#meta'); if (meta) setTimeout(() => { meta.style.width = '58%'; const pct = $('#meta-pct'); if (pct) contar(pct, 58, '%'); }, 300);
  obsReveal?.disconnect();
  if (mismaVista === true) { $$('.reveal', $('#vista')).forEach(el => el.classList.add('visible')); scrollTo(0, y); }
  else {
    obsReveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obsReveal.unobserve(e.target); } }), { threshold: 0.12 });
    $$('.reveal', $('#vista')).forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; obsReveal.observe(el); });
    if (!render.primera) scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  }
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
      const cat = m.categorias.find(c => c.slug === cont.dataset.cat);
      lista = (cat ? cat.productos : m.evento).map(p => ({ p, m }));
    }
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

/* clics globales: sumar, ver producto, copiar IP, moneda */
document.addEventListener('click', e => {
  const mon = e.target.closest('[data-moneda]');
  if (mon) return ponerMoneda(mon.dataset.moneda);
  if (e.target.closest('[data-ir-ars]')) { moneda = 'ARS'; guardar('moneda', 'ARS'); pintarCarrito(); }
  const add = e.target.closest('[data-add]');
  if (add) { e.stopPropagation(); const hit = todosLosProductos().find(x => x.p[0] === add.dataset.add); if (hit) anadir(hit.p, hit.m); return; }
  const ver = e.target.closest('[data-ver]');
  if (ver) return verProducto(ver.dataset.ver);
  if (e.target.closest('[data-copiar]')) { navigator.clipboard?.writeText(IP).catch(() => {}); aviso('<b>⚡</b> IP copiada. ¡Nos vemos adentro!'); }
});
addEventListener('hashchange', () => render());

/* arranque */
pintar(); pintarSesion(); pintarCarrito();
fetch('data/catalogo.json').then(r => r.json()).then(d => { CATALOGO = d; render(); })
  .catch(() => { $('#vista').innerHTML = '<p class="vacio">No se pudo cargar el catálogo.</p>'; });
