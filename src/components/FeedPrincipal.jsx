import React from 'react';

export default function FeedPrincipal() {
  return (
    <div className="home-wrapper">
      <header className="site-header">
        <div className="header-topbar"></div>
        <nav className="header-nav">
          {/* Logo */}
          <a href="#" className="logo">
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
                <a href="#">Inicio</a>
                <a href="#">Novedades</a>
              </div>
            </li>
            <li className="nav-item">
              <a href="#">Acerca de nosotros</a>
            </li>
            <li className="nav-item has-dropdown">
              <span>Páginas</span>
              <span className="chevron">⌄</span>
              <div className="dropdown">
                <a href="#">Repositorio</a>
                <a href="editor1.html">Crear publicación</a>
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

            {/* Botón de Iniciar Sesión */}
            <div className="login-wrapper">
              <button className="btn-login">Iniciar Sesión</button>
              <div className="login-dropdown">
                <a href="login.html" className="login-opt login-opt--primary">
                  <span className="lopt-icon">
                    <img src="dist/log3.png" alt="Iniciar Sesión" className="lopt-icon-img" />
                  </span>
                  <div>
                    <strong>Iniciar Sesión</strong>
                    <small>Accede a tu cuenta</small>
                  </div>
                </a>
                <div className="login-divider"></div>
                <a href="registro.html" className="login-opt">
                  <span className="lopt-icon">
                    <img src="dist/reg1.png" alt="Registrarse" className="lopt-icon-img" />
                  </span>
                  <div>
                    <strong>Registrarse</strong>
                    <small>Crea una cuenta nueva</small>
                  </div>
                </a>
                <div className="login-divider"></div>
                <a href="editor1.html" className="login-opt login-opt--publish">
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
        </nav>
      </header>

      <section className="hero">
        <div className="hero-inner">
          {/* Texto izquierdo */}
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
              Cada dato puede ser importante para volver a encontrar a tu compañero.
            </p>
            <a href="editor1.html" className="btn-cta">Crea una publicación!</a>

            {/* Dots carrusel decorativos */}
            <div className="hero-dots">
              <span className="dot dot--active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>

          {/* Imagen derecha */}
          <img src="./dist/img8@2x.png" alt="Mascotas" className="hero-img" />
          <span className="deco deco--bone">
            <img src="dist/shape@2x.png" alt="" className="deco-img" />
          </span>
          <span className="deco deco--paw">
            <img src="dist/shape1-32-png@2x.png" alt="" className="deco-img" />
          </span>
          <span className="deco deco--bow">
            <img src="dist/shape3-png@2x.png" alt="" className="deco-img" />
          </span>
        </div>
      </section>

      <section className="cases-section">
        <h2 className="cases-title">Ayuda a la Comunidad con estos Casos</h2>

        <div className="cases-layout">
          {/* ── FILTROS ── */}
          <aside className="filters">
            <h3 className="filters-heading">FILTROS</h3>

            {/* Mascota */}
            <div className="filter-group">
              <p className="filter-label">Mascota</p>
              <label className="filter-tag">
                <input type="checkbox" name="mascota" value="perro" defaultChecked />
                <span>Perro</span>
              </label>
              <label className="filter-tag">
                <input type="checkbox" name="mascota" value="gato" />
                <span>Gato</span>
              </label>
              <label className="filter-tag">
                <input type="checkbox" name="mascota" value="ave" />
                <span>Ave</span>
              </label>
              <label className="filter-tag">
                <input type="checkbox" name="mascota" value="otros" />
                <span>Otros</span>
              </label>
            </div>

            {/* Género */}
            <div className="filter-group">
              <p className="filter-label">Género</p>
              <label className="filter-tag">
                <input type="radio" name="genero" value="macho" defaultChecked />
                <span>Macho</span>
              </label>
              <label className="filter-tag">
                <input type="radio" name="genero" value="hembra" />
                <span>Hembra</span>
              </label>
            </div>

            {/* Edad */}
            <div className="filter-group">
              <p className="filter-label">Edad</p>
              <label className="filter-tag">
                <input type="radio" name="edad" value="cachorro" />
                <span>Cachorro</span>
              </label>
              <label className="filter-tag">
                <input type="radio" name="edad" value="adulto" />
                <span>Adulto</span>
              </label>
              <label className="filter-tag">
                <input type="radio" name="edad" value="senior" />
                <span>Senior</span>
              </label>
            </div>

            {/* Tamaño */}
            <div className="filter-group">
              <p className="filter-label">Tamaño</p>
              <label className="filter-tag">
                <input type="radio" name="tamano" value="pequeño" />
                <span>Pequeño</span>
              </label>
              <label className="filter-tag">
                <input type="radio" name="tamano" value="mediano" defaultChecked />
                <span>Mediano</span>
              </label>
              <label className="filter-tag">
                <input type="radio" name="tamano" value="grande" />
                <span>Grande</span>
              </label>
            </div>

            {/* Estado */}
            <div className="filter-group">
              <p className="filter-label">Estado</p>
              <label className="filter-tag filter-tag--lost">
                <input type="radio" name="estado" value="perdido" defaultChecked />
                <span>Perdido</span>
              </label>
              <label className="filter-tag filter-tag--search">
                <input type="radio" name="estado" value="buscando" />
                <span>Buscando</span>
              </label>
            </div>

            {/* Área de búsqueda */}
            <div className="filter-group">
              <p className="filter-label">Área de búsqueda</p>
              <div className="range-wrap">
                <input type="range" min="0" max="50" defaultValue="10" className="range-input" />
                <span className="range-value">10 km</span>
              </div>
            </div>

            <button className="btn-filter-apply">Aplicar filtros</button>
          </aside>

          {/* ── COLUMNA PRINCIPAL ── */}
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