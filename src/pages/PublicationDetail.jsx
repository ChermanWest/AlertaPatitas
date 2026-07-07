/* ============================================================
   ALERTA PATITAS — PublicationDetail.jsx
   ============================================================ */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/PublicationDetail.css';

const EDAD_LABELS = { cachorro: 'Cachorro', corta: 'De corta edad', adulto: 'Adulto', senior: 'Senior' };

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-CL');
}

export default function PublicationDetail() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [item, setItem] = useState(null);
  const [fotoActiva, setFotoActiva] = useState(null);
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
        const fotos = Array.isArray(data.fotos) ? data.fotos : [];
        setFotoActiva(fotos[0] || null);
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

  if (estadoCarga === 'cargando') {
    return (
      <div className="pub-wrapper">
        <div className="pub-card">
          <div className="pub-error">
            <span>🐾</span>
            <p>Cargando publicación…</p>
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

  const fotos = Array.isArray(item.fotos) ? item.fotos : [];
  const estadoNorm = String(item.estado || '').trim().toLowerCase();
  const estadoLabel = estadoNorm === 'buscando' ? 'Buscando' : 'Perdido';
  const badgeClass = estadoNorm === 'buscando' ? 'pub-badge--search' : 'pub-badge--lost';
  const edadLabel = EDAD_LABELS[String(item.edad || '').toLowerCase()] || capitalize(item.edad) || '—';
  const esAutor = Boolean(usuario && item.autor_id && usuario.id === item.autor_id);

  return (
    <div className="pub-wrapper">
      <Link to="/" className="pub-back">
        ← Volver a todas las publicaciones
      </Link>

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
          <span className={`pub-badge ${badgeClass}`}>{estadoLabel}</span>
        </div>

        {fotos.length > 1 && (
          <div className="pub-thumbs">
            {fotos.map((f, i) => (
              <img
                key={i}
                src={f}
                alt={`Foto ${i + 1}`}
                className={`pub-thumb${f === fotoActiva ? ' active' : ''}`}
                onClick={() => setFotoActiva(f)}
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
                <div className="pub-info-value">{formatDate(item.fecha)}</div>
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
    </div>
  );
}
