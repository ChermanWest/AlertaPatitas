import React, { useState } from 'react';

export default function FeedPrincipal({ setVista }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navegarA = (proximaVista) => {
    setVista(proximaVista);
    setMenuAbierto(false); 
  };

  return (
    <div className="home-wrapper">
      <header className="site-header">
        <div className="header-topbar"></div>
        <nav className="header-nav">
          {/* Logo */}
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navegarA('feed'); }}>
            <div className="logo-icon">
              <img src="dist/Mask-group@2x.png" alt="Logo Alerta Patitas" className="logo-icon-img" />
            </div>
            <span className="logo-text">Alerta Patitas</span>
          </a>

          {/* Nav links */}
          <ul className="nav-links">
            <li className="nav-item has-dropdown">
              <span>Inicio</span>
              <span className="chevron">⌄</span>
              <div className="dropdown">
                <a href="#" onClick={(e) => { e.preventDefault(); navegarA('feed'); }}>Inicio</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navegarA('detalle'); }}>Novedades</a>
              </div>
            </li>
            <li className="nav-item">
              <a href="#" onClick={(e) => e.preventDefault()}>Acerca de nosotros</a>
            </li>
            <li className="nav-item has-dropdown">
              <span>Páginas</span>
              <span className="chevron">⌄</span>
              <div className="dropdown">
                <a href="#" onClick={(e) => { e.preventDefault(); navegarA('feed'); }}>Repositorio</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navegarA('formulario'); }}>Crear publicación</a>
              </div>
            </li>
          </ul>

          {/* Acciones derecha */}
          <div className="nav-actions">
            <button className="btn-heart" aria-label="Favoritos">
              <span className="heart-icon">
                <img src="dist/Vector.svg" alt="Favoritos" className="nav-icon-img" />
              </span>
              <span className="badge">0</span>
            </button>

            {/* Contenedor del Login con los eventos */}
            <div 
              className="login-wrapper"
              onMouseEnter={() => setMenuAbierto(true)}
              onMouseLeave={() => setMenuAbierto(false)}
              style={{ position: 'relative' }} // Nos aseguramos de que sirva de ancla
            >
              <button className="btn-login" onClick={(e) => e.preventDefault()}>
                Iniciar Sesión
              </button>
              
              {/* 🔴 ARREGLADO: Agregamos padding superior invisible y ajustamos el top para eliminar el espacio fantasma */}
              <div 
                className="login-dropdown" 
                style={{ 
                  display: menuAbierto ? 'block' : 'none',
                  position: 'absolute',
                  top: '100%', // Se pega justo abajo del botón
                  right: 0,
                  paddingTop: '10px', // Crea un puente invisible para el mouse
                  marginTop: '-5px',  // Solapa ligeramente el área para que no haya quiebre
                  zIndex: 9999
                }}
              >
                {/* Contenedor interno para mantener el diseño visual intacto */}
                <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                  <a href="#" className="login-opt login-opt--primary" onClick={(e) => { e.preventDefault(); navegarA('login'); }}>
                    <span className="lopt-icon">
                      <img src="dist/log3.png" alt="Iniciar Sesión" className="lopt-icon-img" />
                    </span>
                    <div>
                      <strong>Iniciar Sesión</strong>
                      <small>Accede a tu cuenta</small>
                    </div>
                  </a>
                  <div className="login-divider"></div>
                  <a href="#" className="login-opt" onClick={(e) => { e.preventDefault(); navegarA('registro'); }}>
                    <span className="lopt-icon">
                      <img src="dist/reg1.png" alt="Registrarse" className="lopt-icon-img" />
                    </span>
                    <div>
                      <strong>Registrarse</strong>
                      <small>Crea una cuenta nueva</small>
                    </div>
                  </a>
                  <div className="login-divider"></div>
                  <a href="#" className="login-opt login-opt--publish" onClick={(e) => { e.preventDefault(); navegarA('formulario'); }}>
                    <span className="lopt-icon">
                      <img src="dist/shape1-32-png@2x.png" alt="Crear publicación" className="lopt-icon-img" />
                    </span>
                    <div>
                      <strong>Crea una publicación</strong>
                      <small>Reporta una mascota</small>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1 className="hero-title">
              Alerta Patitas
              <span className="hero-paw">
                <img src="dist/shape2-png@2x.png" alt="" className="hero-paw-img" />
              </span>
            </h1>
            <p className="hero-subtitle">La comunidad que ayuda a reencontrar mascotas con sus familias.</p>
            <p className="hero-body">
              Si tu mascota se perdió, no estás solo. Publica la información y recibe ayuda de personas
              cercanas que puedan colaborar en su búsqueda.<br />
              Cada dato puede ser importantísimo para volver a encontrar a tu compañero.
            </p>
            <a href="#" className="btn-cta" onClick={(e) => { e.preventDefault(); navegarA('formulario'); }}>¡Crea una publicación!</a>

            <div className="hero-dots">
              <span className="dot dot--active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          <img src="./dist/img8@2x.png" alt="Mascotas" className="hero-img" />
          <span className="deco deco--bone"><img src="dist/shape@2x.png" alt="" className="deco-img" /></span>
          <span className="deco deco--paw"><img src="dist/shape1-32-png@2x.png" alt="" className="deco-img" /></span>
          <span className="deco deco--bow"><img src="dist/shape3-png@2x.png" alt="" className="deco-img" /></span>
        </div>
      </section>

      {/* Cases Section */}
      <section className="cases-section">
        <h2 className="cases-title">Ayuda a la Comunidad con estos Casos</h2>
        <div className="cases-layout">
          <aside className="filters">
            <h3 className="filters-heading">FILTROS</h3>
            <div className="filter-group">
              <p className="filter-label">Mascota</p>
              <label className="filter-tag"><input type="checkbox" name="mascota" value="perro" defaultChecked /><span>Perro</span></label>
              <label className="filter-tag"><input type="checkbox" name="mascota" value="gato" /><span>Gato</span></label>
              <label className="filter-tag"><input type="checkbox" name="mascota" value="ave" /><span>Ave</span></label>
              <label className="filter-tag"><input type="checkbox" name="mascota" value="otros" /><span>Otros</span></label>
            </div>
            <div className="filter-group">
              <p className="filter-label">Género</p>
              <label className="filter-tag"><input type="radio" name="genero" value="macho" defaultChecked /><span>Macho</span></label>
              <label className="filter-tag"><input type="radio" name="genero" value="hembra" /><span>Hembra</span></label>
            </div>
            <div className="filter-group">
              <p className="filter-label">Edad</p>
              <label className="filter-tag"><input type="radio" name="edad" value="cachorro" /><span>Cachorro</span></label>
              <label className="filter-tag"><input type="radio" name="edad" value="adulto" /><span>Adulto</span></label>
              <label className="filter-tag"><input type="radio" name="edad" value="senior" /><span>Senior</span></label>
            </div>
            <div className="filter-group">
              <p className="filter-label">Tamaño</p>
              <label className="filter-tag"><input type="radio" name="tamano" value="pequeño" /><span>Pequeño</span></label>
              <label className="filter-tag"><input type="radio" name="tamano" value="mediano" defaultChecked /><span>Mediano</span></label>
              <label className="filter-tag"><input type="radio" name="tamano" value="grande" /><span>Grande</span></label>
            </div>
            <div className="filter-group">
              <p className="filter-label">Estado</p>
              <label className="filter-tag filter-tag--lost"><input type="radio" name="estado" value="perdido" defaultChecked /><span>Perdido</span></label>
              <label className="filter-tag filter-tag--search"><input type="radio" name="estado" value="buscando" /><span>Buscando</span></label>
            </div>
            <div className="filter-group">
              <p className="filter-label">Área de búsqueda</p>
              <div className="range-wrap">
                <input type="range" min="0" max="50" defaultValue="10" className="range-input" />
                <span className="range-value">10 km</span>
              </div>
            </div>
            <button className="btn-filter-apply">Aplicar filtros</button>
          </aside>

          <div className="cases-main">
            <div className="cards-grid" id="cardsGrid">
              <p style={{ color: '#706060', textAlign: 'center', gridColumn: '1/-1', fontFamily: 'var(--font-onest)' }}>
                🐾 Cargando casos activos de la comunidad de Arica...
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="dist/Mask-group@2x.png" alt="Alerta Patitas" className="logo-img" />
            <span className="logo-text">Alerta Patitas</span>
          </div>
          <p className="footer-copy">© 2025 Alerta Patitas — Ayudando a reunir familias con sus mascotas.</p>
        </div>
      </footer>
    </div>
  );
}