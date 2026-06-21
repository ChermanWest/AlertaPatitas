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

  /* ── 1. REFERENCIAS AL DOM ── */
  const grid        = document.getElementById('cardsGrid');
  const cards       = () => Array.from(grid.querySelectorAll('.pet-card'));
  const btnApply    = document.querySelector('.btn-filter-apply');
  const range       = document.querySelector('.range-input');
  const rangeVal    = document.querySelector('.range-value');

  /* ── 2. INYECTAR ELEMENTOS AUXILIARES ── */

  // Contador de resultados (encima del grid)
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
    const tamañoEl  = document.querySelector('input[name="tamaño"]:checked');
    const estadoEl  = document.querySelector('input[name="estado"]:checked');

    return {
      mascotas,                                 // [] = sin restricción
      genero : generoEl  ? generoEl.value  : null,
      edad   : edadEl    ? edadEl.value    : null,
      tamaño : tamañoEl  ? tamañoEl.value  : null,
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
    if (filters.tamaño && d.tamaño !== filters.tamaño) return false;

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
    ['genero', 'edad', 'tamaño', 'estado'].forEach(name => {
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

  /* ── 9. EJECUTAR AL CARGAR ── */
  applyFilters();

})();
