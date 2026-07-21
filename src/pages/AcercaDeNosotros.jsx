import { Link } from 'react-router-dom';

// TODO: reemplazar con los datos reales del equipo (nombre, rol y foto)
const EQUIPO = [
  { id: 1, nombre: '', rol: '' },
  { id: 2, nombre: '', rol: '' },
  { id: 3, nombre: '', rol: '' },
  { id: 4, nombre: '', rol: '' },
];

export default function AcercaDeNosotros() {
  return (
    <>
      <section className="about-hero">
        <span className="about-deco about-deco--bone">
          <img src="/dist/shape@2x.png" alt="" className="deco-img" />
        </span>
        <span className="about-deco about-deco--paw">
          <img src="/dist/shape1-32-png@2x.png" alt="" className="deco-img" />
        </span>

        <div className="about-hero-inner">
          <p className="about-eyebrow">Nuestro equipo</p>
          <h1 className="about-title">
            {/* TODO: nombre real del grupo */}
            Nombre del Grupo
          </h1>
          <p className="about-subtitle">
            Las personas detrás de Alerta Patitas, trabajando para reunir mascotas con sus familias.
          </p>
        </div>
      </section>

      <section className="team-section">
        <div className="team-grid">
          {EQUIPO.map((miembro) => (
            <div className="team-card" key={miembro.id}>
              <div className="team-card-photo">
                <span className="team-card-photo-placeholder">🐾</span>
              </div>
              <div className="team-card-body">
                <h3 className="team-card-name">{miembro.nombre || 'Nombre Apellido'}</h3>
                <p className="team-card-role">{miembro.rol || 'Rol en el equipo'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="team-cta">
          <p>¿Quieres saber más sobre el proyecto?</p>
          <Link to="/" className="btn-cta">Volver al inicio</Link>
        </div>
      </section>
    </>
  );
}