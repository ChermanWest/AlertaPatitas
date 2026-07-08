import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMascotas } from '../hooks/useMascotas';
import Filters, { FILTROS_INICIALES } from '../components/Filters';
import PetCard from '../components/PetCard';

/* ── Normalización de valores (igual criterio que el filters.js original) ── */
// Diccionario utilizado para estandarizar los posibles valores irregulares que puedan 
// venir de la base de datos o de la entrada del usuario a un formato unificado.
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

/**
 * Función auxiliar para limpiar y estandarizar un valor basándose en los mapas definidos arriba.
 * @param {string} campo - El nombre del campo a normalizar (ej: 'sexo', 'tamano').
 * @param {string} valorCrudo - El valor original que viene del backend.
 * @returns {string} El valor normalizado.
 */
function normalizar(campo, valorCrudo) {
  // Convertimos a string, eliminamos espacios extra y pasamos a minúsculas para evitar errores tipográficos
  const v = String(valorCrudo || '').trim().toLowerCase();
  const mapa = MAPAS_NORMALIZACION[campo];
  
  // Si existe un valor normalizado en el mapa, lo retornamos
  if (mapa && mapa[v]) return mapa[v];
  
  // Caso especial: si es un tipo de mascota desconocido, lo agrupamos como 'otros'
  if (campo === 'mascota' && v) return 'otros';
  
  // Si no coincide con nada o no hay mapa, devolvemos el valor limpio
  return v;
}

export default function Home() {
  // Hook personalizado para obtener la lista de mascotas y los estados de la petición
  const { mascotas, loading, error, recargar } = useMascotas();
  
  // Estado para los filtros temporales (mientras el usuario los selecciona en la UI)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  
  // Estado para los filtros que realmente se están aplicando a la lista de mascotas
  // (Se separan para que la lista solo cambie cuando el usuario hace clic en "Aplicar")
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES);

  // useMemo optimiza el rendimiento recalculando la lista filtrada SOLO cuando 
  // cambian las 'mascotas' traídas del servidor o los 'filtrosAplicados'.
  const visibles = useMemo(() => {
    return mascotas.filter((m) => {
const mascota = normalizar('mascota', m.mascota || m.tipo_mascota);
      const genero = normalizar('sexo', m.sexo);
      const edad = normalizar('edad', m.edad);
      const tamano = normalizar('tamano', m.tamano || m['tamaño']); // Prevención por diferentes nombres de propiedad
      const estado = normalizar('estado', m.estado);

      // Reglas de filtrado: Si hay un filtro activo y la mascota no coincide, se excluye (return false)
      if (filtrosAplicados.mascotas.length > 0 && !filtrosAplicados.mascotas.includes(mascota)) return false;
      if (filtrosAplicados.genero && genero !== filtrosAplicados.genero) return false;
      if (filtrosAplicados.edad && edad !== filtrosAplicados.edad) return false;
      if (filtrosAplicados.tamano && tamano !== filtrosAplicados.tamano) return false;
      if (filtrosAplicados.estado && estado !== filtrosAplicados.estado) return false;
      
      // Si pasó todas las validaciones anteriores, la mascota se mantiene en la lista
      return true;
    });
  }, [mascotas, filtrosAplicados]);

  return (
    <>
      {/* ── SECCIÓN HERO: Encabezado principal de la página ── */}
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

            {/* Elementos decorativos (puntitos) */}
            <div className="hero-dots">
              <span className="dot dot--active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          {/* Imágenes decorativas del hero */}
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

      {/* ── SECCIÓN DE CASOS: Filtros y listado de mascotas ── */}
      <section className="cases-section">
        <h2 className="cases-title">Ayuda a la Comunidad con estos Casos</h2>

        <div className="cases-layout">
          {/* Componente de barra lateral para los filtros */}
          <Filters
            filtros={filtros}
            setFiltros={setFiltros}
            onAplicar={() => setFiltrosAplicados(filtros)} // Pasa los filtros temporales a activos
            onLimpiar={() => {
              // Resetea tanto los filtros temporales como los aplicados
              setFiltros(FILTROS_INICIALES);
              setFiltrosAplicados(FILTROS_INICIALES);
            }}
          />

          <div className="cases-main">
            {/* Contador de resultados (solo se muestra si no está cargando, no hay error y hay datos) */}
            {!loading && !error && mascotas.length > 0 && (
              <p className="results-count">
                {visibles.length === mascotas.length
                  ? `Mostrando ${mascotas.length} mascotas`
                  : `${visibles.length} de ${mascotas.length} mascotas`}
              </p>
            )}

            <div className="cards-grid" id="cardsGrid">
              
              {/* ESTADO 1: Cargando datos desde el servidor */}
              {loading && (
                <div className="cards-loading-state visible">
                  <span className="empty-icon">🐾</span>
                  <p>Cargando mascotas…</p>
                </div>
              )}

              {/* ESTADO 2: Error al cargar los datos (incluye botón para reintentar) */}
              {!loading && error && (
                <div className="cards-error-state visible">
                  <span className="empty-icon">⚠️</span>
                  <p>No se pudieron cargar las mascotas.</p>
                  <button onClick={recargar} className="btn-filter-clear">
                    Reintentar
                  </button>
                </div>
              )}

              {/* ESTADO 3: Petición exitosa pero la base de datos está vacía */}
              {!loading && !error && mascotas.length === 0 && (
                <div className="cards-empty-state visible">
                  <span className="empty-icon">🐾</span>
                  <p>Aún no hay publicaciones. ¡Sé el primero!</p>
                  <Link to="/editor" className="btn-filter-clear">
                    Crear primera publicación
                  </Link>
                </div>
              )}

              {/* ESTADO 4: Hay datos, pero ninguno coincide con los filtros aplicados */}
              {!loading && !error && mascotas.length > 0 && visibles.length === 0 && (
                <div className="cards-empty-state visible">
                  <span className="empty-icon">🐾</span>
                  <p>No se encontraron mascotas con estos filtros.</p>
                  <small>Intenta cambiar los criterios de búsqueda.</small>
                </div>
              )}

              {/* ESTADO 5: Renderizado normal de las tarjetas (Mapeo de las mascotas visibles) */}
              {!loading && !error && visibles.map((m) => <PetCard key={m.id} mascota={m} />)}
            
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 