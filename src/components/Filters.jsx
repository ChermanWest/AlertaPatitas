/* ============================================================
   ALERTA PATITAS — Filters.jsx

   Nota sobre un bug que se corrigió en la migración: en home.html,
   varios inputs venían "checked" de fábrica (Perro, Macho, Mediano,
   Perdido) y filters.js aplicaba los filtros automáticamente al
   cargar. Es decir, la página escondía casi todas las publicaciones
   apenas cargaba, sin que el usuario tocara nada. Aquí el estado
   inicial no filtra nada (se muestran todas las mascotas) hasta que
   la persona elige un filtro a propósito.
   ============================================================ */

export const FILTROS_INICIALES = {
  mascotas: [],
  genero: null,
  edad: null,
  tamano: null,
  estado: null,
  radio: 10,
};

const OPCIONES_MASCOTA = ['perro', 'gato', 'ave', 'otros'];
const OPCIONES_GENERO = ['macho', 'hembra'];
const OPCIONES_EDAD = ['cachorro', 'adulto', 'senior'];
const OPCIONES_TAMANO = ['pequeño', 'mediano', 'grande'];

function Capitalizada(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default function Filters({ filtros, setFiltros, onAplicar, onLimpiar }) {
  function toggleMascota(valor) {
    setFiltros((f) => {
      const set = new Set(f.mascotas);
      if (set.has(valor)) set.delete(valor);
      else set.add(valor);
      return { ...f, mascotas: Array.from(set) };
    });
  }

  return (
    <aside className="filters">
      <h3 className="filters-heading">FILTROS</h3>

      <div className="filter-group">
        <p className="filter-label">Mascota</p>
        {OPCIONES_MASCOTA.map((v) => (
          <label className="filter-tag" key={v}>
            <input type="checkbox" checked={filtros.mascotas.includes(v)} onChange={() => toggleMascota(v)} />
            <span>{Capitalizada(v)}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-label">Género</p>
        {OPCIONES_GENERO.map((v) => (
          <label className="filter-tag" key={v}>
            <input
              type="radio"
              name="genero"
              checked={filtros.genero === v}
              onChange={() => setFiltros((f) => ({ ...f, genero: v }))}
            />
            <span>{Capitalizada(v)}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-label">Edad</p>
        {OPCIONES_EDAD.map((v) => (
          <label className="filter-tag" key={v}>
            <input
              type="radio"
              name="edad"
              checked={filtros.edad === v}
              onChange={() => setFiltros((f) => ({ ...f, edad: v }))}
            />
            <span>{Capitalizada(v)}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-label">Tamaño</p>
        {OPCIONES_TAMANO.map((v) => (
          <label className="filter-tag" key={v}>
            <input
              type="radio"
              name="tamano"
              checked={filtros.tamano === v}
              onChange={() => setFiltros((f) => ({ ...f, tamano: v }))}
            />
            <span>{Capitalizada(v)}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-label">Estado</p>
        <label className="filter-tag filter-tag--lost">
          <input
            type="radio"
            name="estado"
            checked={filtros.estado === 'perdido'}
            onChange={() => setFiltros((f) => ({ ...f, estado: 'perdido' }))}
          />
          <span>Perdido</span>
        </label>
        <label className="filter-tag filter-tag--search">
          <input
            type="radio"
            name="estado"
            checked={filtros.estado === 'buscando'}
            onChange={() => setFiltros((f) => ({ ...f, estado: 'buscando' }))}
          />
          <span>Buscando</span>
        </label>
      </div>

      <div className="filter-group">
        <p className="filter-label">Área de búsqueda</p>
        <div className="range-wrap">
          <input
            type="range"
            min="0"
            max="50"
            value={filtros.radio}
            onChange={(e) => setFiltros((f) => ({ ...f, radio: Number(e.target.value) }))}
            className="range-input"
          />
          <span className="range-value">{filtros.radio} km</span>
        </div>
      </div>

      <button className="btn-filter-apply" onClick={onAplicar}>
        Aplicar filtros
      </button>
      <button className="btn-filter-clear" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </aside>
  );
}
