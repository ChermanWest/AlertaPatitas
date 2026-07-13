/* ============================================================
   ALERTA PATITAS — PublicationDetail.jsx

====================================== */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Comments from '../components/Comments';
import '../styles/PublicationDetail.css';

const EDAD_LABELS = { cachorro: 'Cachorro', corta: 'De corta edad', adulto: 'Adulto', senior: 'Senior' };

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export default function PublicationDetail() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [item, setItem] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [estadoCarga, setEstadoCarga] = useState('cargando'); // cargando | ok | vacio | error

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setEstadoCarga('cargando');
      try {
        const { data, error } = await supabase.from('mascotas').select('*').eq('id', id).single();
        if (cancelado) return;

        if (error || !data) {
          setEstadoCarga('vacio');
          return;
        }

        setItem(data);
        setIndiceActivo(0);
        setEstadoCarga('ok');
      } catch (err) {
        console.error('Error cargando publicación:', err);
        if (!cancelado) setEstadoCarga('error');
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [id]);

  // Navegación con teclado (← →)
  useEffect(() => {
    if (estadoCarga !== 'ok') return;
    const fotos = Array.isArray(item?.fotos) ? item.fotos : [];
    if (fotos.length <= 1) return;

    function manejarTecla(e) {
      if (e.key === 'ArrowLeft') {
        setIndiceActivo((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setIndiceActivo((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
      }
    }

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [estadoCarga, item]);

  // --- Variables derivadas: se calculan SIEMPRE, antes de cualquier return
  //     anticipado, para que nunca puedan quedar en temporal dead zone. ---
  const fotos = Array.isArray(item?.fotos) ? item.fotos : [];
  const hayVarias = fotos.length > 1;
  const fotoActiva = fotos[indiceActivo] || null;

  const estadoNorm = String(item?.estado || '').trim().toLowerCase();
  const estadoLabel = estadoNorm === 'buscando' ? 'Buscando' : 'Perdido';
  const badgeClass = estadoNorm === 'buscando' ? 'pub-badge--search' : 'pub-badge--lost';
  const edadLabel = EDAD_LABELS[String(item?.edad || '').toLowerCase()] || capitalize(item?.edad) || '—';
  const esAutor = Boolean(usuario && item?.autor_id && usuario.id === item.autor_id);

  const irAnterior = () => {
    if (!hayVarias) return;
    setIndiceActivo((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const irSiguiente = () => {
    if (!hayVarias) return;
    setIndiceActivo((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  if (estadoCarga === 'cargando') {
    return (
      <div className="pub-wrapper">
        <Link to="/" className="pub-back">
          ← Volver a todas las publicaciones
        </Link>

        <div className="pub-layout">
          <div className="pub-card pub-card--loading">
            <div className="pub-hero pub-hero--skeleton" />
            <div className="pub-body">
              <p>Cargando publicación…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (estadoCarga === 'vacio') {
    return (
      <div className="pub-wrapper">
        <Link to="/" className="pub-back">
          ← Volver a todas las publicaciones
        </Link>
        <div className="pub-card">
          <div className="pub-error">
            <span>🐾</span>
            <p>No se encontró la publicación.</p>
            <small>Vuelve al inicio y selecciona una mascota.</small>
          </div>
        </div>
      </div>
    );
  }

  if (estadoCarga === 'error') {
    return (
      <div className="pub-wrapper">
        <Link to="/" className="pub-back">
          ← Volver a todas las publicaciones
        </Link>
        <div className="pub-card">
          <div className="pub-error">
            <span>⚠️</span>
            <p>Ocurrió un error al cargar esta publicación.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pub-wrapper">
      <Link to="/" className="pub-back">
        ← Volver a todas las publicaciones
      </Link>

      <div className="pub-layout">
        <div className="pub-card">
          {esAutor && (
            <div className="pub-edit-bar">
              <Link to={`/editor?id=${item.id}`} className="btn-pub-edit">
                ✏️ Editar publicación
              </Link>
            </div>
          )}

          <div className="pub-hero">
            {fotoActiva ? (
              <img src={fotoActiva} alt={item.nombre || 'Mascota'} id="heroImg" />
            ) : (
              <div className="pub-hero-placeholder">
                <span>📷</span>
                <small>Sin fotos disponibles</small>
              </div>
            )}

            {hayVarias && (
              <>
                <button
                  type="button"
                  className="pub-arrow pub-arrow--prev"
                  onClick={irAnterior}
                  aria-label="Foto anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="pub-arrow pub-arrow--next"
                  onClick={irSiguiente}
                  aria-label="Foto siguiente"
                >
                  ›
                </button>
                <span className="pub-hero-counter">
                  {indiceActivo + 1} / {fotos.length}
                </span>
              </>
            )}

            <span className={`pub-badge ${badgeClass}`}>{estadoLabel}</span>
          </div>

          {hayVarias && (
            <div className="pub-thumbs">
              {fotos.map((f, i) => (
                <img
                  key={i}
                  src={f}
                  alt={`Foto ${i + 1}`}
                  className={`pub-thumb${i === indiceActivo ? ' active' : ''}`}
                  onClick={() => setIndiceActivo(i)}
                />
              ))}
            </div>
          )}

          <div className="pub-body">
            <h1 className="pub-title">{item.nombre || 'Sin nombre'}</h1>
            <div className="pub-tags">
              <span className="pub-tag">{capitalize(item.mascota || 'Mascota')}</span>
              <span className="pub-tag">{capitalize(item.sexo || '—')}</span>
              <span className="pub-tag">{edadLabel}</span>
              <span className="pub-tag">{capitalize(item.tamano || item['tamaño'] || '—')}</span>
              <span className={`pub-tag pub-tag--estado-${estadoNorm}`}>{estadoLabel}</span>
            </div>

            <div className="pub-info-grid">
              {(item.zona || item.ubicacion || item.lugar) && (
                <div className="pub-info-item">
                  <div className="pub-info-label">Zona</div>
                  <div className="pub-info-value">{item.zona || item.ubicacion || item.lugar}</div>
                </div>
              )}
              {item.fecha && (
                <div className="pub-info-item">
                  <div className="pub-info-label">Fecha</div>
                  <div className="pub-info-value">{new Date(item.fecha).toLocaleDateString('es-CL')}</div>
                </div>
              )}
            </div>

            {item.descripcion && (
              <>
                <hr className="pub-divider" />
                <p className="pub-section-title">Descripción</p>
                <p className="pub-desc">{item.descripcion}</p>
              </>
            )}

            {(item.contacto || item.telefono || item.email) && (
              <>
                <hr className="pub-divider" />
                <p className="pub-section-title">Contacto</p>
                <p className="pub-desc">{item.contacto || item.telefono || item.email}</p>
              </>
            )}
          </div>
        </div>

        <Comments mascotaId={item.id} comentariosIniciales={item.comentarios} />
      </div>
    </div>
  );
}
