import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Popup from '../components/Popup';

// Clave usada en localStorage para persistir el correo cuando el usuario marca "Recordar cuenta"
const CORREO_RECORDADO_KEY = 'alertaPatitas_correoRecordado';

export default function Login() {
  // Función del contexto de autenticación que hace el llamado real de login (API/backend)
  const { iniciarSesion } = useAuth();
  // Hook de react-router para redirigir al usuario luego de iniciar sesión
  const navigate = useNavigate();

  // Estado del correo: se inicializa leyendo localStorage por si el usuario ya lo había guardado antes
  const [correo, setCorreo] = useState(() => localStorage.getItem(CORREO_RECORDADO_KEY) || '');
  // Estado de la contraseña (nunca se persiste, siempre arranca vacío)
  const [contrasena, setContrasena] = useState('');
  // Checkbox "Recordar cuenta": arranca marcado si ya existía un correo guardado en localStorage
  const [recordar, setRecordar] = useState(() => Boolean(localStorage.getItem(CORREO_RECORDADO_KEY)));
  // Mensaje de error a mostrar en el formulario (vacío = sin error)
  const [error, setError] = useState('');
  // Bandera para mostrar estado de carga y deshabilitar el botón mientras se procesa el login
  const [cargando, setCargando] = useState(false);
  // Mensaje del popup de bienvenida (null = no se muestra)
  const [popup, setPopup] = useState(null);

  // Maneja el envío del formulario de inicio de sesión
  async function handleLogin(e) {
    e.preventDefault(); // Evita que el formulario recargue la página
    setError(''); // Limpia errores previos antes de un nuevo intento

    // Validación básica en el cliente: ambos campos deben estar completos
    if (!correo.trim() || !contrasena) {
      setError('Por favor completa correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      // Llama a la función de autenticación con el correo (sin espacios) y la contraseña
      const usuario = await iniciarSesion({ email: correo.trim(), password: contrasena });

      // Si el usuario marcó "Recordar cuenta", guarda el correo en localStorage;
      // si no, se asegura de eliminar cualquier correo guardado previamente
      if (recordar) localStorage.setItem(CORREO_RECORDADO_KEY, correo.trim());
      else localStorage.removeItem(CORREO_RECORDADO_KEY);

      // Usa el nick del usuario si existe en los metadatos, si no, cae en el email
      const nick = usuario.user_metadata?.nick || usuario.email;
      setPopup(`¡Bienvenido de nuevo, ${nick}!`);
      // Espera un momento para que se vea el popup antes de redirigir al home
      setTimeout(() => navigate('/'), 1400);
    } catch (err) {
      // Muestra el mensaje de error que venga del backend, o uno genérico si no hay
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      // Se ejecuta siempre, haya éxito o error, para quitar el estado de "cargando"
      setCargando(false);
    }
  }

  return (
    <>
      {/* ── SECCIÓN HERO: encabezado simple de la página de login ── */}
      <section className="auth-hero">
        <h1 className="auth-hero-title">Iniciar sesión</h1>
      </section>

      <div className="auth-wrap">
        {/* Pestañas para alternar entre Iniciar Sesión y Registrarse */}
        <div className="auth-tabs">
          <span className="auth-tab auth-tab--active">Iniciar Sesión</span>
          <Link to="/registro" className="auth-tab">
            Registrarse
          </Link>
        </div>

        {/* Formulario principal. noValidate desactiva la validación nativa del navegador
            para manejar los mensajes de error manualmente */}
        <form className="auth-card" onSubmit={handleLogin} noValidate>
          {/* Mensaje de error: solo visible (clase "visible") cuando hay contenido en `error` */}
          <div className={`auth-error${error ? ' visible' : ''}`}>{error}</div>

          {/* Campo de correo electrónico, controlado por el estado `correo` */}
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
          {/* Campo de contraseña, controlado por el estado `contrasena` */}
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

          {/* Checkbox para activar/desactivar el "recordar correo" en localStorage */}
          <label className="auth-remember">
            <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} /> Recordar
            cuenta
          </label>

          {/* Botón de envío: se deshabilita y cambia de texto mientras `cargando` es true */}
          <button type="submit" className="btn-auth-submit" disabled={cargando}>
            {cargando ? 'Verificando…' : 'Iniciar Sesión'}
          </button>

          {/* Enlace de recuperación de contraseña (sin funcionalidad implementada aún, href="#") */}
          <a href="#" className="auth-link-bottom">
            ¿Olvidaste tu contraseña?
          </a>
          {/* Enlace de navegación hacia la página de registro para quienes no tienen cuenta */}
          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </form>
      </div>

      {/* Popup de bienvenida, solo se renderiza con contenido cuando `popup` tiene un mensaje */}
      <Popup mensaje={popup} />
    </>
  );
}
