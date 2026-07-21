import { Link } from 'react-router-dom';

// TODO: reemplazar con los datos reales del equipo (nombre, rol y foto)
const EQUIPO = [
  {
    id: 1,
    nombre: 'Matias Sagredo ',
    rol: 'Desarrollador',
    foto: '../public/fotos-perfil/matias.png',
  },
  {
    id: 2,
    nombre: 'German Castro',
    rol: 'jefe de equipo',
    foto: '../public/fotos-perfil/german.png',
  },
  {
    id: 3,
    nombre: 'Javier Echeverria',
    rol: 'Desarrollador',
    foto: '../public/fotos-perfil/javier.png',
  },
 
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
            Alerta Patitas
          </h1>
          <p className="about-subtitle">
Conoce a las personas detrás de Alerta Patitas, quienes trabajan con dedicación para reunir a las mascotas con sus familias y brindar un hogar a quienes aún no lo tienen.
          </p>
        </div>
      </section>

      <section className="team-section">
        <div className="team-grid">
          {EQUIPO.map((miembro) => (
            <div className="team-card" key={miembro.id}>
              <div className="team-card-photo">
                {miembro.foto ? (
                  <img
                    src={miembro.foto}
                    alt={`Foto de ${miembro.nombre}`}
                    className="team-card-photo-img"
                  />
                ) : (
                  <span className="team-card-photo-placeholder">🐾</span>
                )}
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