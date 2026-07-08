import { Link } from 'react-router-dom';

const EDAD_LABELS = { cachorro: 'Cachorro', corta: 'De corta edad', adulto: 'Adulto', senior: 'Senior' };

function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PetCard({ mascota }) {
  // 1. Extraemos la URL cruda de la imagen de forma flexible y segura
  let urlCruda = null;
  if (Array.isArray(mascota.fotos) && mascota.fotos.length > 0) {
    urlCruda = mascota.fotos[0];
  } else {
    urlCruda = mascota.imagen || mascota.foto || null;
  }

  // 2. Corregimos la URL base para evitar que se duplique "http://127.0.0.1:8000"
  let foto = null;
  if (urlCruda) {
    if (urlCruda.startsWith('http://') || urlCruda.startsWith('https://')) {
      foto = urlCruda; // Django ya envió la URL completa
    } else {
      foto = `http://127.0.0.1:8000${urlCruda.startsWith('/') ? '' : '/'}${urlCruda}`; // Ruta relativa
    }
  }

  const tamano = mascota.tamano || mascota['tamaño'] || '';
  const perdido = mascota.estado === 'perdido' || mascota.estado === 'extraviado';
  const badgeClass = perdido ? 'pet-badge--lost' : 'pet-badge--search';
  const badgeText = perdido ? 'Perdido' : 'Buscando';

  return (
    <Link to={`/publicacion/${mascota.id}`} className="pet-card-link">
      <article
        className="pet-card"
        data-mascota={mascota.tipo_mascota || ''}
        data-genero={mascota.sexo || ''}
        data-edad={mascota.edad || ''}
        data-tamano={tamano}
        data-estado={mascota.estado || ''}
      >
        <div className="pet-card-img-wrap">
          {foto ? (
            <img src={foto} alt={mascota.nombre || 'Mascota'} className="pet-card-img" loading="lazy" />
          ) : (
            <div className="pet-card-img pet-card-img--placeholder">
              <span>📷</span>
              <small>Sin foto</small>
            </div>
          )}
          <span className={`pet-badge ${badgeClass}`}>{badgeText}</span>
        </div>
        <div className="pet-card-body">
          <h3 className="pet-card-name">{mascota.nombre || 'Sin nombre'}</h3>
          <p className="pet-card-tags">
            {mascota.tipo_mascota && <span className="tag">{capitalizar(mascota.tipo_mascota)}</span>}
            {mascota.sexo && <span className="tag">{capitalizar(mascota.sexo)}</span>}
            {tamano && <span className="tag">{capitalizar(tamano)}</span>}
            {mascota.edad && <span className="tag">{EDAD_LABELS[mascota.edad] || capitalizar(mascota.edad)}</span>}
            <span className="tag tag--state">{badgeText}</span>
          </p>
        </div>
      </article>
    </Link>
  );
}