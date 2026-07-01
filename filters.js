/* ============================================================
   ALERTA PATITAS — filters.js
   ============================================================
   Filtra .pet-card usando data-attributes:
     data-mascota  → perro | gato | ave | otros
     data-genero   → macho | hembra
     data-edad     → cachorro | corta | adulto | senior
     data-tamaño   → pequeño | mediano | grande
     data-estado   → perdido | buscando

   Los filtros de checkbox (mascota) son OR entre sí.
   Los filtros de radio (género, edad, tamaño, estado) son "todos" si no hay valor.
   El botón "Aplicar filtros" ejecuta el filtro.
   El botón "Limpiar filtros" resetea todo.
   El range (área) es decorativo por ahora — listo para conectar a coordenadas.
   ============================================================ */

(function () {
  'use strict';

  /* ── 0. CONFIG API (Google Apps Script) ── */
  const API_URL = 'https://script.google.com/macros/s/AKfycbyOz26XnOoXsUEd47122hxEtfDFgWwr4vi_NuF4lQD9dREtHiB05Ofl-TdxpZ1KodRJfg/exec';

  /* ── 1. REFERENCIAS AL DOM ── */
  const grid        = document.getElementById('cardsGrid');
  const cards       = () => Array.from(grid.querySelectorAll('.pet-card'));
  const btnApply    = document.querySelector('.btn-filter-apply');
  const range       = document.querySelector('.range-input');
  const rangeVal    = document.querySelector('.range-value');

  /* ── 2. INYECTAR ELEMENTOS AUXILIARES ── */

  // Contador de resultados (encima del grid, dentro de .cases-main)
  const counter = document.createElement('p');
  counter.className = 'results-count';
  grid.parentNode.insertBefore(counter, grid);

  // Estado vacío dentro del grid
  const emptyState = document.createElement('div');
  emptyState.className = 'cards-empty-state';
  emptyState.innerHTML = `
    <span class="empty-icon">🐾</span>
    <p>No se encontraron mascotas con estos filtros.</p>
    <small>Intenta cambiar los criterios de búsqueda.</small>
  `;
  grid.appendChild(emptyState);

  // Botón "Limpiar filtros" (después del botón aplicar)
  const btnClear = document.createElement('button');
  btnClear.className = 'btn-filter-clear';
  btnClear.textContent = 'Limpiar filtros';
  btnApply.insertAdjacentElement('afterend', btnClear);

  /* ── 1b. ESTADO DE CARGA / ERROR ── */
  const loadingState = document.createElement('div');
  loadingState.className = 'cards-loading-state';
  loadingState.innerHTML = `
    <span class="empty-icon">🐾</span>
    <p>Cargando mascotas…</p>
  `;
  grid.appendChild(loadingState);

  const errorState = document.createElement('div');
  errorState.className = 'cards-error-state';
  errorState.innerHTML = `
    <span class="empty-icon">⚠️</span>
    <p>No se pudieron cargar las mascotas.</p>
    <small>Revisa tu conexión e intenta de nuevo.</small>
  `;
  grid.appendChild(errorState);

  /* ── 1c. MAPEOS de valores del Sheet → valores que usan los filtros ── */
  // Tu Sheet puede traer "Macho"/"M"/"macho" etc. Normalizamos todo a minúsculas
  // y mapeamos variantes comunes a los valores exactos que usa filters.js.
  const NORMALIZAR = {
    sexo: {
      'macho': 'macho', 'm': 'macho', 'male': 'macho',
      'hembra': 'hembra', 'h': 'hembra', 'f': 'hembra', 'female': 'hembra',
    },
    tamano: {
      'pequeño': 'pequeño', 'pequeno': 'pequeño', 'chico': 'pequeño', 's': 'pequeño',
      'mediano': 'mediano', 'm': 'mediano',
      'grande': 'grande', 'l': 'grande',
    },
    edad: {
      'cachorro': 'cachorro', 'cría': 'cachorro', 'cria': 'cachorro',
      'corta': 'corta', 'corta edad': 'corta', 'joven': 'corta',
      'adulto': 'adulto',
      'senior': 'senior', 'mayor': 'senior',
    },
    estado: {
      'perdido': 'perdido',
      'buscando': 'buscando', 'encontrado': 'buscando',
    },
    mascota: {
      'perro': 'perro', 'gato': 'gato', 'ave': 'ave',
    },
  };

  function normalizar(campo, valorCrudo) {
    const v = String(valorCrudo || '').trim().toLowerCase();
    const mapa = NORMALIZAR[campo];
    if (mapa[v]) return mapa[v];
    if (campo === 'mascota' && v) return 'otros'; // cualquier otra especie cae en "Otros"
    return v; // si no matchea nada, dejamos el valor crudo (no se filtrará bien, pero no se rompe)
  }

  /* ── 1d. CONSTRUIR TARJETA HTML desde un registro del Sheet ── */
  function construirTarjeta(item) {
    const mascota = normalizar('mascota', item.mascota);
    const genero  = normalizar('sexo', item.sexo);
    const edad    = normalizar('edad', item.edad);
    const tamano  = normalizar('tamano', item.tamano || item['tamano']);
    const estado  = normalizar('estado', item.estado);

    const primeraFoto = (item.fotos || '').split('|').map(s => s.trim()).filter(Boolean)[0];

    const article = document.createElement('article');
    article.className = 'pet-card';
    article.dataset.mascota = mascota;
    article.dataset.genero  = genero;
    article.dataset.edad    = edad;
    article.dataset.tamano  = tamano;
    article.dataset.estado  = estado;

    const estadoLabel = estado === 'buscando' ? 'Buscando' : 'Perdido';
    const estadoBadgeClass = estado === 'buscando' ? 'pet-badge--search' : 'pet-badge--lost';

    const imgHTML = primeraFoto
      ? `<img src="${escapeHTML(primeraFoto)}" alt="${escapeHTML(item.nombre || 'Mascota')}" class="pet-card-img" />`
      : `<div class="pet-card-img pet-card-img--placeholder">
           <span>📷</span>
           <small>Sin foto</small>
         </div>`;

    const mascotaLabel = mascota.charAt(0).toUpperCase() + mascota.slice(1);
    const generoLabel  = genero === 'hembra' ? 'Hembra' : 'Macho';
    const tamanoLabel  = tamano.charAt(0).toUpperCase() + tamano.slice(1);
    const edadLabel    = ({ cachorro: 'Cachorro', corta: 'De corta edad', adulto: 'Adulto', senior: 'Senior' })[edad] || '';

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
      </div>
    `;

    // Navegación al hacer click en la tarjeta
    article.style.cursor = 'pointer';
    article.addEventListener('click', function () {
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

  /* ── 1e. CARGAR MASCOTAS DESDE LA API Y PINTAR EL GRID ── */
  async function cargarMascotas() {
    loadingState.classList.add('visible');
    errorState.classList.remove('visible');

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (!json.ok) {
        throw new Error(json.error || 'Respuesta no-ok de la API');
      }

      // Quitar tarjetas existentes (si las hubiera, ej. de prueba en el HTML)
      cards().forEach(c => c.remove());

      const frag = document.createDocumentFragment();
      json.data.forEach(item => {
        frag.appendChild(construirTarjeta(item));
      });
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

  /* ── 3. RANGE: valor en vivo ── */
  if (range) {
    range.addEventListener('input', () => {
      rangeVal.textContent = range.value + ' km';
    });
  }

  /* ── 4. LEER ESTADO ACTUAL DE LOS FILTROS ── */
  function readFilters() {
    // Checkboxes de mascota — OR: si ninguno está marcado = todos pasan
    const mascotaInputs = Array.from(
      document.querySelectorAll('input[name="mascota"]:checked')
    );
    const mascotas = mascotaInputs.map(i => i.value);

    // Radios — valor seleccionado o null (= sin restricción)
    const generoEl  = document.querySelector('input[name="genero"]:checked');
    const edadEl    = document.querySelector('input[name="edad"]:checked');
    const tamanoEl  = document.querySelector('input[name="tamano"]:checked');
    const estadoEl  = document.querySelector('input[name="estado"]:checked');

    return {
      mascotas,                                 // [] = sin restricción
      genero : generoEl  ? generoEl.value  : null,
      edad   : edadEl    ? edadEl.value    : null,
      tamano : tamanoEl  ? tamanoEl.value  : null,
      estado : estadoEl  ? estadoEl.value  : null,
    };
  }

  /* ── 5. LÓGICA DE FILTRADO ── */
  function matchCard(card, filters) {
    const d = card.dataset;

    // Mascota: OR entre seleccionados; vacío = todos pasan
    if (filters.mascotas.length > 0) {
      if (!filters.mascotas.includes(d.mascota)) return false;
    }

    // Género
    if (filters.genero && d.genero !== filters.genero) return false;

    // Edad
    if (filters.edad && d.edad !== filters.edad) return false;

    // Tamaño
    if (filters.tamano && d.tamano !== filters.tamano) return false;

    // Estado
    if (filters.estado && d.estado !== filters.estado) return false;

    return true;
  }

  /* ── 6. APLICAR FILTROS + ACTUALIZAR UI ── */
  function applyFilters() {
    const filters = readFilters();
    const all = cards();
    let visible = 0;

    all.forEach((card, i) => {
      const show = matchCard(card, filters);
      if (show) {
        card.classList.remove('pet-card--hidden');
        // Escalonar la animación de entrada
        card.style.animationDelay = (visible * 40) + 'ms';
        visible++;
      } else {
        card.classList.add('pet-card--hidden');
      }
    });

    // Contador
    const total = all.length;
    counter.textContent = visible === total
      ? `Mostrando ${total} mascotas`
      : `${visible} de ${total} mascotas`;

    // Estado vacío
    emptyState.classList.toggle('visible', visible === 0);
  }

  /* ── 7. LIMPIAR FILTROS ── */
  function clearFilters() {
    // Desmarcar todos los checkboxes
    document.querySelectorAll('input[name="mascota"]').forEach(i => {
      i.checked = false;
    });

    // Quitar selección de todos los radio groups
    ['genero', 'edad', 'tamano', 'estado'].forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(i => {
        i.checked = false;
      });
    });

    // Range al valor inicial
    if (range) {
      range.value = 10;
      rangeVal.textContent = '10 km';
    }

    applyFilters();
  }

  /* ── 8. EVENTOS ── */
  btnApply.addEventListener('click', applyFilters);
  btnClear.addEventListener('click', clearFilters);

  // Filtrado en tiempo real al cambiar cualquier input
  document.querySelectorAll('.filters input').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  /* ── 9. EJECUTAR AL CARGAR: traer mascotas desde Google Sheets ── */
  cargarMascotas();

})();
