import { Link } from 'react-router-dom';

const EDAD_LABELS = { cachorro: 'Cachorro', corta: 'De corta edad', adulto: 'Adulto', senior: 'Senior' };

function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Antes, cada tarjeta codificaba el objeto entero como JSON en la URL
 * (?datos=...), lo que rompía con descripciones largas y hacía los
 * links imposibles de compartir de forma prolija. Ahora se navega por
 * id y la página de detalle pide el registro directamente a Supabase.
 */
export default function PetCard({ mascota }) {
  const fotos = Array.isArray(mascota.fotos) ? mascota.fotos : [];
  const foto = fotos[0] || null;
  const tamano = mascota.tamano || mascota['tamaño'] || '';
  const perdido = mascota.estado === 'perdido' || mascota.estado === 'extraviado';
  const badgeClass = perdido ? 'pet-badge--lost' : 'pet-badge--search';
  const badgeText = perdido ? 'Perdido' : 'Buscando';

  return (
    <Link to={`/publicacion/${mascota.id}`} className="pet-card-link">
      <article
        className="pet-card"
        data-mascota={mascota.mascota || ''}
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
            {mascota.mascota && <span className="tag">{capitalizar(mascota.mascota)}</span>}
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
