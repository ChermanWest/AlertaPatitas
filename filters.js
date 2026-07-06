/* ============================================================
   ALERTA PATITAS — filters.js  (versión Supabase)
   Filtra .pet-card usando data-attributes.
   Requiere: supabase.js cargado antes que este archivo.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. REFERENCIAS AL DOM ── */
  const grid     = document.getElementById('cardsGrid');
  const cards    = () => Array.from(grid.querySelectorAll('.pet-card'));
  const btnApply = document.querySelector('.btn-filter-apply');
  const range    = document.querySelector('.range-input');
  const rangeVal = document.querySelector('.range-value');

  /* ── 2. INYECTAR ELEMENTOS AUXILIARES ── */
  const counter = document.createElement('p');
  counter.className = 'results-count';
  grid.parentNode.insertBefore(counter, grid);

  const emptyState = document.createElement('div');
  emptyState.className = 'cards-empty-state';
  emptyState.innerHTML = `
    <span class="empty-icon">🐾</span>
    <p>No se encontraron mascotas con estos filtros.</p>
    <small>Intenta cambiar los criterios de búsqueda.</small>`;
  grid.appendChild(emptyState);

  const btnClear = document.createElement('button');
  btnClear.className   = 'btn-filter-clear';
  btnClear.textContent = 'Limpiar filtros';
  btnApply.insertAdjacentElement('afterend', btnClear);

  const loadingState = document.createElement('div');
  loadingState.className = 'cards-loading-state';
  loadingState.innerHTML = `<span class="empty-icon">🐾</span><p>Cargando mascotas…</p>`;
  grid.appendChild(loadingState);

  const errorState = document.createElement('div');
  errorState.className = 'cards-error-state';
  errorState.innerHTML = `<span class="empty-icon">⚠️</span><p>No se pudieron cargar las mascotas.</p>`;
  grid.appendChild(errorState);

  /* ── 3. NORMALIZACIÓN de valores ── */
  const NORMALIZAR = {
    sexo:   { 'macho':'macho','m':'macho','male':'macho','hembra':'hembra','h':'hembra','f':'hembra','female':'hembra' },
    tamano: { 'pequeño':'pequeño','pequeno':'pequeño','chico':'pequeño','mediano':'mediano','grande':'grande' },
    edad:   { 'cachorro':'cachorro','corta':'corta','corta edad':'corta','joven':'corta','adulto':'adulto','senior':'senior','mayor':'senior' },
    estado: { 'perdido':'perdido','extraviado':'perdido','buscando':'buscando','encontrado':'buscando' },
    mascota:{ 'perro':'perro','gato':'gato','ave':'ave' },
  };

  function normalizar(campo, valorCrudo) {
    const v    = String(valorCrudo || '').trim().toLowerCase();
    const mapa = NORMALIZAR[campo];
    if (mapa && mapa[v]) return mapa[v];
    if (campo === 'mascota' && v) return 'otros';
    return v;
  }

  /* ── 4. CONSTRUIR TARJETA desde registro Supabase ── */
  function construirTarjeta(item) {
    const mascota = normalizar('mascota', item.mascota);
    const genero  = normalizar('sexo',   item.sexo);
    const edad    = normalizar('edad',   item.edad);
    const tamano  = normalizar('tamano', item.tamano);
    const estado  = normalizar('estado', item.estado);

    // Las fotos en Supabase son un array de URLs, no un string con |
    const fotos      = Array.isArray(item.fotos) ? item.fotos : [];
    const primeraFoto = fotos[0] || null;

    const article = document.createElement('article');
    article.className = 'pet-card';
    article.dataset.mascota = mascota;
    article.dataset.genero  = genero;
    article.dataset.edad    = edad;
    article.dataset.tamaño  = tamano;
    article.dataset.estado  = estado;

    const estadoLabel      = estado === 'buscando' ? 'Buscando' : 'Perdido';
    const estadoBadgeClass = estado === 'buscando' ? 'pet-badge--search' : 'pet-badge--lost';

    const imgHTML = primeraFoto
      ? `<img src="${escapeHTML(primeraFoto)}" alt="${escapeHTML(item.nombre || 'Mascota')}" class="pet-card-img" loading="lazy" />`
      : `<div class="pet-card-img pet-card-img--placeholder"><span>📷</span><small>Sin foto</small></div>`;

    const mascotaLabel = mascota.charAt(0).toUpperCase() + mascota.slice(1);
    const generoLabel  = genero === 'hembra' ? 'Hembra' : 'Macho';
    const tamanoLabel  = tamano.charAt(0).toUpperCase() + tamano.slice(1);
    const edadLabel    = ({ cachorro:'Cachorro', corta:'De corta edad', adulto:'Adulto', senior:'Senior' })[edad] || '';

    article.innerHTML = `
      <div class="pet-card-img-wrap">
        ${imgHTML}
        <span class="pet-badge ${estadoBadgeClass}">${estadoLabel}</span>
      </div>
      <div class="pet-card-body">
        <h3 class="pet-card-name">${escapeHTML(item.nombre || 'Sin nombre')}</h3>
        <p class="pet-card-tags">
          <span class="tag">${escapeHTML(mascotaLabel)}</span>
          <span class="tag">${escapeHTML(generoLabel)}</span>
          <span class="tag">${escapeHTML(tamanoLabel)}</span>
          ${edadLabel ? `<span class="tag">${escapeHTML(edadLabel)}</span>` : ''}
          <span class="tag tag--state">${estadoLabel}</span>
        </p>
      </div>`;

    article.style.cursor = 'pointer';
    article.addEventListener('click', () => {
      const datos = encodeURIComponent(JSON.stringify(item));
      window.location.href = `publicacion.html?datos=${datos}`;
    });

    return article;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  /* ── 5. CARGAR MASCOTAS DESDE SUPABASE ── */
  async function cargarMascotas() {
    loadingState.classList.add('visible');
    errorState.classList.remove('visible');

    try {
      // Traer todas las mascotas ordenadas por fecha
      const data = await sb.from('mascotas')
        .select('*')
        .order('fecha', 'desc')
        .get();

      cards().forEach(c => c.remove());

      if (!Array.isArray(data) || data.length === 0) {
        emptyState.classList.add('visible');
        counter.textContent = 'No hay publicaciones aún.';
        return;
      }

      const frag = document.createDocumentFragment();
      data.forEach(item => frag.appendChild(construirTarjeta(item)));
      grid.insertBefore(frag, emptyState);

      applyFilters();

    } catch (err) {
      console.error('Error cargando mascotas:', err);
      errorState.classList.add('visible');
      counter.textContent = '';
    } finally {
      loadingState.classList.remove('visible');
    }
  }

  /* ── 6. RANGE ── */
  if (range) {
    range.addEventListener('input', () => { rangeVal.textContent = range.value + ' km'; });
  }

  /* ── 7. LEER FILTROS ── */
  function readFilters() {
    const mascotaInputs = Array.from(document.querySelectorAll('input[name="mascota"]:checked'));
    const mascotas      = mascotaInputs.map(i => i.value);
    const generoEl      = document.querySelector('input[name="genero"]:checked');
    const edadEl        = document.querySelector('input[name="edad"]:checked');
    const tamañoEl      = document.querySelector('input[name="tamano"]:checked');
    const estadoEl      = document.querySelector('input[name="estado"]:checked');
    return {
      mascotas,
      genero : generoEl  ? generoEl.value  : null,
      edad   : edadEl    ? edadEl.value    : null,
      tamaño : tamañoEl  ? tamañoEl.value  : null,
      estado : estadoEl  ? estadoEl.value  : null,
    };
  }

  /* ── 8. FILTRAR ── */
  function matchCard(card, filters) {
    const d = card.dataset;
    if (filters.mascotas.length > 0 && !filters.mascotas.includes(d.mascota)) return false;
    if (filters.genero && d.genero !== filters.genero) return false;
    if (filters.edad   && d.edad   !== filters.edad)   return false;
    if (filters.tamaño && d.tamaño !== filters.tamaño) return false;
    if (filters.estado && d.estado !== filters.estado) return false;
    return true;
  }

  function applyFilters() {
    const filters = readFilters();
    const all     = cards();
    let   visible = 0;
    all.forEach((card, i) => {
      const show = matchCard(card, filters);
      card.classList.toggle('pet-card--hidden', !show);
      if (show) { card.style.animationDelay = (visible * 40) + 'ms'; visible++; }
    });
    counter.textContent = visible === all.length
      ? `Mostrando ${all.length} mascotas`
      : `${visible} de ${all.length} mascotas`;
    emptyState.classList.toggle('visible', visible === 0);
  }

  // Exponer applyFilters globalmente para loader.js
  window.applyFilters = applyFilters;

  /* ── 9. LIMPIAR ── */
  function clearFilters() {
    document.querySelectorAll('input[name="mascota"]').forEach(i => { i.checked = false; });
    ['genero','edad','tamano','estado'].forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(i => { i.checked = false; });
    });
    if (range) { range.value = 10; rangeVal.textContent = '10 km'; }
    applyFilters();
  }

  /* ── 10. EVENTOS ── */
  btnApply.addEventListener('click', applyFilters);
  btnClear.addEventListener('click', clearFilters);
  document.querySelectorAll('.filters input').forEach(i => i.addEventListener('change', applyFilters));

  /* ── 11. ARRANCAR ── */
  cargarMascotas();

})();
