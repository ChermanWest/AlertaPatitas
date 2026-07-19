import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMascotas } from '../hooks/useMascotas';
import Filters, { FILTROS_INICIALES } from '../components/Filters';
import PetCard from '../components/PetCard';

/* ── Normalización de valores (igual criterio que el filters.js original) ── */
const MAPAS_NORMALIZACION = {
  sexo: { macho: 'macho', m: 'macho', male: 'macho', hembra: 'hembra', h: 'hembra', f: 'hembra', female: 'hembra' },
  tamano: { 'pequeño': 'pequeño', pequeno: 'pequeño', chico: 'pequeño', mediano: 'mediano', grande: 'grande' },
  edad: {
    cachorro: 'cachorro',
    corta: 'corta',
    'corta edad': 'corta',
    joven: 'corta',
    adulto: 'adulto',
    senior: 'senior',
    mayor: 'senior',
  },
  estado: { perdido: 'perdido', extraviado: 'perdido', buscando: 'buscando', encontrado: 'buscando' },
  mascota: { perro: 'perro', gato: 'gato', ave: 'ave' },
};

function normalizar(campo, valorCrudo) {
  const v = String(valorCrudo || '').trim().toLowerCase();
  const mapa = MAPAS_NORMALIZACION[campo];
  if (mapa && mapa[v]) return mapa[v];
  if (campo === 'mascota' && v) return 'otros';
  return v;
}

export default function Home() {
  const { mascotas, loading, error, recargar } = useMascotas();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES);

  const visibles = useMemo(() => {
    return mascotas.filter((m) => {
      const mascota = normalizar('mascota', m.mascota);
      const genero = normalizar('sexo', m.sexo);
      const edad = normalizar('edad', m.edad);
      const tamano = normalizar('tamano', m.tamano || m['tamaño']);
      const estado = normalizar('estado', m.estado);

      if (filtrosAplicados.mascotas.length > 0 && !filtrosAplicados.mascotas.includes(mascota)) return false;
      if (filtrosAplicados.genero && genero !== filtrosAplicados.genero) return false;
      if (filtrosAplicados.edad && edad !== filtrosAplicados.edad) return false;
      if (filtrosAplicados.tamano && tamano !== filtrosAplicados.tamano) return false;
      if (filtrosAplicados.estado && estado !== filtrosAplicados.estado) return false;
      return true;
    });
  }, [mascotas, filtrosAplicados]);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1 className="hero-title">
              Alerta Patitas
              <span className="hero-paw">
                <img src="/dist/shape2-png@2x.png" alt="" className="hero-paw-img" />
              </span>
            </h1>
            <p className="hero-subtitle">La comunidad que ayuda a reencontrar mascotas con sus familias.</p>
            <p className="hero-body">
              Si tu mascota se perdió, no estás solo. Publica la información y recibe ayuda de personas
              cercanas que puedan colaborar en su búsqueda.
              <br />
              Cada dato puede ser importante para volver a encontrar a tu compañero.
            </p>
            <Link to="/editor" className="btn-cta">
              Crea una publicación!
            </Link>


          </div>

          <img src="/dist/img8@2x.png" alt="Mascotas" className="hero-img" />
          <span className="deco deco--bone">
            <img src="/dist/shape@2x.png" alt="" className="deco-img" />
          </span>
          <span className="deco deco--paw">
            <img src="/dist/shape1-32-png@2x.png" alt="" className="deco-img" />
          </span>
          <span className="deco deco--bow">
            <img src="/dist/shape3-png@2x.png" alt="" className="deco-img" />
          </span>
        </div>
      </section>

      <section className="cases-section">
        <h2 className="cases-title">Ayuda a la Comunidad con estos Casos</h2>

        <div className="cases-layout">
          <Filters
            filtros={filtros}
            setFiltros={setFiltros}
            onAplicar={() => setFiltrosAplicados(filtros)}
            onLimpiar={() => {
              setFiltros(FILTROS_INICIALES);
              setFiltrosAplicados(FILTROS_INICIALES);
            }}
          />

          <div className="cases-main">
            {!loading && !error && mascotas.length > 0 && (
              <p className="results-count">
                {visibles.length === mascotas.length
                  ? `Mostrando ${mascotas.length} mascotas`
                  : `${visibles.length} de ${mascotas.length} mascotas`}
              </p>
            )}

            <div className="cards-grid" id="cardsGrid">
              {loading && (
                <div className="cards-loading-state visible">
                  <span className="empty-icon">🐾</span>
                  <p>Cargando mascotas…</p>
                </div>
              )}

              {!loading && error && (
                <div className="cards-error-state visible">
                  <span className="empty-icon">⚠️</span>
                  <p>No se pudieron cargar las mascotas.</p>
                  <button onClick={recargar} className="btn-filter-clear">
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !error && mascotas.length === 0 && (
                <div className="cards-empty-state visible">
                  <span className="empty-icon">🐾</span>
                  <p>Aún no hay publicaciones. ¡Sé el primero!</p>
                  <Link to="/editor" className="btn-filter-clear">
                    Crear primera publicación
                  </Link>
                </div>
              )}

              {!loading && !error && mascotas.length > 0 && visibles.length === 0 && (
                <div className="cards-empty-state visible">
                  <span className="empty-icon">🐾</span>
                  <p>No se encontraron mascotas con estos filtros.</p>
                  <small>Intenta cambiar los criterios de búsqueda.</small>
                </div>
              )}

              {!loading && !error && visibles.map((m) => <PetCard key={m.id} mascota={m} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
