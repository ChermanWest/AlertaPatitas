import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import '../styles/Header.css';

function tiempoTranscurrido(fechaISO) {
  const ahora = new Date();
  const fecha = new Date(fechaISO);
  const diffMin = Math.floor((ahora - fecha) / 60000);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `hace ${diffHoras} h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 7) return `hace ${diffDias} d`;
  return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
}

export default function Header() {
  const { usuario, cerrarSesion } = useAuth();

  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [notifAbierto, setNotifAbierto] = useState(false);
  const notifRef = useRef(null);

  const cargarNotificaciones = useCallback(async () => {
    if (!usuario) return;

    const { data, error } = await supabase
      .from('notificaciones')
      .select('id, mascota_id, mascota_nombre, autor_nombre, leido, fecha')
      .eq('usuario_id', usuario.id)
      .order('fecha', { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotificaciones(data);
      setNoLeidas(data.filter((n) => !n.leido).length);
    }
  }, [usuario]);

  // Carga inicial + suscripción en tiempo real
  useEffect(() => {
    if (!usuario) {
      setNotificaciones([]);
      setNoLeidas(0);
      return;
    }

    cargarNotificaciones();

    const canal = supabase
      .channel(`notificaciones-${usuario.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificaciones',
          filter: `usuario_id=eq.${usuario.id}`,
        },
        () => cargarNotificaciones()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [usuario, cargarNotificaciones]);

  // Cierra el dropdown si haces clic fuera de él
  useEffect(() => {
    function alClickAfuera(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifAbierto(false);
      }
    }
    document.addEventListener('mousedown', alClickAfuera);
    return () => document.removeEventListener('mousedown', alClickAfuera);
  }, []);

  // Al abrir el dropdown, marca todo como leído (igual que Instagram)
  async function alClickCampana() {
    if (!usuario) return;

    const seVaAbrir = !notifAbierto;
    setNotifAbierto(seVaAbrir);

    if (seVaAbrir && noLeidas > 0) {
      const idsNoLeidas = notificaciones.filter((n) => !n.leido).map((n) => n.id);

      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
      setNoLeidas(0);

      await supabase.from('notificaciones').update({ leido: true }).in('id', idsNoLeidas);
    }
  }

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
            <Link to="/acerca-de-nosotros">Acerca de nosotros</Link>
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
          <div className="notif-wrapper" ref={notifRef}>
            <button
              className="btn-heart"
              aria-label="Notificaciones"
              onClick={alClickCampana}
            >
              <span className="heart-icon">
                <img src="/dist/Vector.svg" alt="Notificaciones" className="nav-icon-img" />
              </span>
              {usuario && noLeidas > 0 && (
                <span className="badge">{noLeidas > 9 ? '9+' : noLeidas}</span>
              )}
            </button>

            {usuario && notifAbierto && (
              <div className="notif-dropdown">
                <div className="notif-header">Notificaciones</div>

                {notificaciones.length === 0 ? (
                  <p className="notif-vacio">Aún no tienes notificaciones.</p>
                ) : (
                  notificaciones.map((n) => (
                    <Link
                      key={n.id}
                      to={`/mascota/${n.mascota_id}`}
                      className={`notif-item ${n.leido ? '' : 'notif-item--nueva'}`}
                      onClick={() => setNotifAbierto(false)}
                    >
                      <span className="notif-icon">💬</span>
                      <div className="notif-texto">
                        <p>
                          <strong>{n.autor_nombre}</strong> comentó en la publicacion de {' '}
                          <strong>{n.mascota_nombre}</strong>
                        </p>
                        <small>{tiempoTranscurrido(n.fecha)}</small>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

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
