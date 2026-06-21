/* ============================================================
   ALERTA PATITAS — loader.js
   Carga las publicaciones desde Google Sheets y
   muestra las fotos almacenadas en Google Drive.

   CONFIGURACIÓN:
   Reemplaza API_URL con la misma URL de tu Apps Script
   (debe ser idéntica a la de editor.js).
   ============================================================ */

const API_URL = 'TU_URL_DE_APPS_SCRIPT_AQUI';
// Misma URL que en editor.js


/* ── Construye el HTML de una tarjeta ── */
function buildCard(m) {
  const perdido    = m.estado === 'perdido' || m.estado === 'extraviado';
  const badgeClass = perdido ? 'pet-badge--lost'   : 'pet-badge--search';
  const badgeText  = perdido ? 'Perdido'            : 'Buscando';
  const tagClass   = perdido ? 'tag--state tag--lost' : 'tag--state';

  // Las fotos vienen separadas por | en la columna "fotos"
  const fotos = (m.fotos || '').split('|').filter(Boolean);
  const fotoUrl = fotos[0] || null;

  const imgHTML = fotoUrl
    ? `<img src="${fotoUrl}" alt="${m.nombre}" class="pet-card-img" loading="lazy" />`
    : `<div class="pet-card-img pet-card-img--placeholder"><span>📷</span></div>`;

  // Acepta tanto "tamano" (nuevo) como "tamaño" (por compatibilidad
  // con hojas creadas con la versión anterior del script)
  const tamano = m.tamano || m.tamaño || '';

  return `
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
    </article>`;
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


/* ── Carga principal ── */
async function cargarMascotas() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  // Si no está configurada la URL, dejar las tarjetas estáticas de ejemplo
  if (!API_URL || API_URL === 'TU_URL_DE_APPS_SCRIPT_AQUI') {
    console.warn('loader.js: configura API_URL para cargar datos reales.');
    setGridState(grid, 'error', '⚙️ Falta configurar la URL de Apps Script en loader.js (constante API_URL).');
    return;
  }

  setGridState(grid, 'cargando', 'Cargando mascotas…');

  try {
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    if (!json.ok || !Array.isArray(json.data)) {
      throw new Error(json.error || 'Respuesta inesperada del servidor');
    }

    if (json.data.length === 0) {
      setGridState(grid, 'vacio', 'Aún no hay publicaciones. ¡Sé el primero!');
      return;
    }

    // Renderizar tarjetas
    grid.innerHTML = json.data.map(buildCard).join('');

    // Re-ejecutar filtros sobre las tarjetas nuevas
    if (typeof applyFilters === 'function') applyFilters();

  } catch (err) {
    console.error('Error cargando mascotas:', err);
    setGridState(grid, 'error', 'No se pudieron cargar las publicaciones.');
  }
}

// Ejecutar al cargar la página
cargarMascotas();
