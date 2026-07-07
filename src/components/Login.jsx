import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Popup from '../components/Popup';

const CORREO_RECORDADO_KEY = 'alertaPatitas_correoRecordado';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState(() => localStorage.getItem(CORREO_RECORDADO_KEY) || '');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(() => Boolean(localStorage.getItem(CORREO_RECORDADO_KEY)));
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [popup, setPopup] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!correo.trim() || !contrasena) {
      setError('Por favor completa correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      const usuario = await iniciarSesion({ email: correo.trim(), password: contrasena });

      if (recordar) localStorage.setItem(CORREO_RECORDADO_KEY, correo.trim());
      else localStorage.removeItem(CORREO_RECORDADO_KEY);

      const nick = usuario.user_metadata?.nick || usuario.email;
      setPopup(`¡Bienvenido de nuevo, ${nick}!`);
      setTimeout(() => navigate('/'), 1400);
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <section className="auth-hero">
        <h1 className="auth-hero-title">Iniciar sesión</h1>
      </section>

      <div className="auth-wrap">
        <div className="auth-tabs">
          <span className="auth-tab auth-tab--active">Iniciar Sesión</span>
          <Link to="/registro" className="auth-tab">
            Registrarse
          </Link>
        </div>

        <form className="auth-card" onSubmit={handleLogin} noValidate>
          <div className={`auth-error${error ? ' visible' : ''}`}>{error}</div>

          <div className="auth-field">
            <input
              type="email"
              className="auth-input"
              placeholder="Correo electrónico"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <input
              type="password"
              className="auth-input"
              placeholder="Contraseña"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <label className="auth-remember">
            <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} /> Recordar
            cuenta
          </label>

          <button type="submit" className="btn-auth-submit" disabled={cargando}>
            {cargando ? 'Verificando…' : 'Iniciar Sesión'}
          </button>

          <a href="#" className="auth-link-bottom">
            ¿Olvidaste tu contraseña?
          </a>
          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </form>
      </div>

      <Popup mensaje={popup} />
    </>
  );
}
