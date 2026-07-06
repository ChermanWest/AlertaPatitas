/* ============================================================
   ALERTA PATITAS — loader.js  (versión Supabase)
   Carga las publicaciones desde Supabase PostgreSQL.
   Requiere: supabase.js cargado antes que este archivo.
   ============================================================ */


/* ── Construye el HTML de una tarjeta ── */
function buildCard(m) {
  const perdido    = m.estado === 'perdido' || m.estado === 'extraviado';
  const badgeClass = perdido ? 'pet-badge--lost'   : 'pet-badge--search';
  const badgeText  = perdido ? 'Perdido'            : 'Buscando';
  const tagClass   = perdido ? 'tag--state tag--lost' : 'tag--state';

  // Las fotos ahora son un array de URLs directas de Supabase Storage
  const fotos   = Array.isArray(m.fotos) ? m.fotos : (m.fotos || '').split('|').filter(Boolean);
  const fotoUrl = fotos[0] || null;

  const imgHTML = fotoUrl
    ? `<img src="${fotoUrl}" alt="${m.nombre}" class="pet-card-img" loading="lazy" />`
    : `<div class="pet-card-img pet-card-img--placeholder"><span>📷</span></div>`;

  const tamano = m.tamano || m.tamaño || '';

  // Codificar datos para la página de detalle
  const datosCodificados = encodeURIComponent(JSON.stringify(m));
  const href = `publicacion.html?datos=${datosCodificados}`;

  return `
    <a class="pet-card-link" href="${href}">
    <article class="pet-card"
      data-mascota="${m.mascota  || ''}"
      data-genero="${m.sexo     || ''}"
      data-edad="${m.edad      || ''}"
      data-tamano="${tamano}"
      data-estado="${m.estado   || ''}">
      <div class="pet-card-img-wrap">
        ${imgHTML}
        <span class="pet-badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="pet-card-body">
        <h3 class="pet-card-name">${m.nombre || 'Sin nombre'}</h3>
        <p class="pet-card-tags">
          ${m.mascota ? `<span class="tag">${capitalizar(m.mascota)}</span>` : ''}
          ${m.sexo    ? `<span class="tag">${capitalizar(m.sexo)}</span>`    : ''}
          ${tamano    ? `<span class="tag">${capitalizar(tamano)}</span>`    : ''}
          ${m.edad    ? `<span class="tag">${capitalizar(m.edad)}</span>`    : ''}
          <span class="tag ${tagClass}">${badgeText}</span>
        </p>
      </div>
    </article>
    </a>`;
}

function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/* ── Estado de carga dentro del grid ── */
function setGridState(grid, tipo, mensaje) {
  if (tipo === 'cargando') {
    grid.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;
                  align-items:center;gap:12px;padding:48px 24px;
                  color:#888;font-family:var(--font-body,sans-serif);">
        <span style="font-size:36px">⏳</span>
        <p style="font-size:14px;font-weight:500">${mensaje}</p>
      </div>`;
  } else if (tipo === 'error') {
    grid.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;
                  align-items:center;gap:12px;padding:48px 24px;
                  color:#c0392b;font-family:var(--font-body,sans-serif);">
        <span style="font-size:36px">❌</span>
        <p style="font-size:14px;font-weight:600">${mensaje}</p>
        <button onclick="cargarMascotas()"
          style="padding:8px 20px;border-radius:999px;border:1.5px solid #c0392b;
                 background:transparent;color:#c0392b;cursor:pointer;font-weight:600;">
          Reintentar
        </button>
      </div>`;
  } else if (tipo === 'vacio') {
    grid.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;
                  align-items:center;gap:12px;padding:48px 24px;
                  color:#888;font-family:var(--font-body,sans-serif);">
        <span style="font-size:48px;opacity:0.4">🐾</span>
        <p style="font-size:15px;font-weight:500">${mensaje}</p>
        <a href="editor1.html"
          style="padding:10px 24px;border-radius:999px;background:#8b4513;
                 color:#fff;text-decoration:none;font-weight:700;font-size:13px;">
          Crear primera publicación
        </a>
      </div>`;
  }
}


/* ── Carga principal desde Supabase ── */
async function cargarMascotas() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  setGridState(grid, 'cargando', 'Cargando mascotas…');

  try {
    // Traer todas las mascotas ordenadas por fecha descendente
    const data = await sb.from('mascotas')
      .select('*')
      .order('fecha', 'desc')
      .get();

    if (!Array.isArray(data) || data.length === 0) {
      setGridState(grid, 'vacio', 'Aún no hay publicaciones. ¡Sé el primero!');
      return;
    }

    grid.innerHTML = data.map(buildCard).join('');

    // Re-ejecutar filtros si filters.js ya fue cargado
    if (typeof applyFilters === 'function') applyFilters();

  } catch (err) {
    console.error('Error cargando mascotas:', err);
    setGridState(grid, 'error', 'No se pudieron cargar las publicaciones.');
  }
}

// Ejecutar al cargar la página
cargarMascotas();
