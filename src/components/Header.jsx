import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
 * Nota: en el HTML original el ".login-dropdown" nunca se
 * mostraba/ocultaba desde JS (ningún auth.js/etc. le agrega un
 * listener de click) — se abre por CSS al pasar el mouse sobre
 * ".login-wrapper" (o similar, dependiendo de tu hoja de estilos).
 * Por eso acá el dropdown se deja siempre montado en el DOM,
 * igual que antes, para que tu CSS de hover siga funcionando
 * sin cambios.
 */
export default function Header() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="site-header">
      <div className="header-topbar"></div>
      <nav className="header-nav">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <img src="/dist/Mask-group@2x.png" alt="Logo Alerta Patitas" className="logo-icon-img" />
          </div>
          <span className="logo-text">Alerta Patitas</span>
        </Link>

        <ul className="nav-links">
          <li className="nav-item has-dropdown">
            <span>Inicio</span>
            <span className="chevron">⌄</span>
            <div className="dropdown">
              <Link to="/">Inicio</Link>
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
              <Link to="/editor">Crear publicación</Link>
            </div>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="btn-heart" aria-label="Favoritos">
            <span className="heart-icon">
              <img src="/dist/Vector.svg" alt="Favoritos" className="nav-icon-img" />
            </span>
            <span className="badge">0</span>
          </button>

          <div className="login-wrapper">
            {!usuario ? (
              <>
                <button className="btn-login">Iniciar Sesión</button>
                <div className="login-dropdown">
                  <Link to="/login" className="login-opt login-opt--primary">
                    <span className="lopt-icon">
                      <img src="/dist/log3.png" alt="Iniciar Sesión" className="lopt-icon-img" />
                    </span>
                    <div>
                      <strong>Iniciar Sesión</strong>
                      <small>Accede a tu cuenta</small>
                    </div>
                  </Link>
                  <div className="login-divider"></div>
                  <Link to="/registro" className="login-opt">
                    <span className="lopt-icon">
                      <img src="/dist/reg1.png" alt="Registrarse" className="lopt-icon-img" />
                    </span>
                    <div>
                      <strong>Registrarse</strong>
                      <small>Crea una cuenta nueva</small>
                    </div>
                  </Link>
                  <div className="login-divider"></div>
                  <Link to="/editor" className="login-opt login-opt--publish">
                    <span className="lopt-icon">
                      <img src="/dist/shape1-32-png@2x.png" alt="Crear publicación" className="lopt-icon-img" />
                    </span>
                    <div>
                      <strong>Crea una publicación</strong>
                      <small>Reporta una mascota</small>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <button className="btn-login btn-login--activo">
                  <span className="user-dot">{usuario.nick.charAt(0).toUpperCase()}</span>
                  {usuario.nick}
                </button>
                <div className="login-dropdown">
                  <div className="login-opt login-opt--primary" style={{ cursor: 'default' }}>
                    <span className="lopt-icon">🐾</span>
                    <div>
                      <strong>{usuario.nick}</strong>
                      <small>{usuario.email}</small>
                    </div>
                  </div>
                  <div className="login-divider"></div>
                  <Link to="/editor" className="login-opt login-opt--publish">
                    <span className="lopt-icon">📝</span>
                    <div>
                      <strong>Crea una publicación</strong>
                      <small>Reporta una mascota</small>
                    </div>
                  </Link>
                  <div className="login-divider"></div>
                  <a
                    href="#"
                    className="login-opt"
                    id="btnCerrarSesion"
                    onClick={(e) => {
                      e.preventDefault();
                      cerrarSesion();
                    }}
                  >
                    <span className="lopt-icon">🚪</span>
                    <div>
                      <strong>Cerrar sesión</strong>
                      <small>Salir de tu cuenta</small>
                    </div>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
