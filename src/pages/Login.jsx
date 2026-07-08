// Importación de los hooks y componentes necesarios
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Popup from '../components/Popup';

// Clave utilizada para guardar el correo del usuario en el LocalStorage
// si este marca la opción "Recordar cuenta".
const CORREO_RECORDADO_KEY = 'alertaPatitas_correoRecordado';

export default function Login() {

  // Obtiene la función de inicio de sesión desde el contexto de autenticación.
  const { iniciarSesion } = useAuth();

  // Permite redireccionar al usuario a otra página después de iniciar sesión.
  const navigate = useNavigate();


  // Guarda el correo electrónico ingresado.
  // Si existe un correo guardado en LocalStorage, lo carga automáticamente.
  const [correo, setCorreo] = useState(
    () => localStorage.getItem(CORREO_RECORDADO_KEY) || ''
  );

  // Guarda la contraseña escrita por el usuario.
  const [contrasena, setContrasena] = useState('');

  // Indica si el usuario desea recordar su cuenta.
  // Se inicializa dependiendo de si existe un correo almacenado.
  const [recordar, setRecordar] = useState(
    () => Boolean(localStorage.getItem(CORREO_RECORDADO_KEY))
  );

  // Mensaje de error mostrado cuando ocurre algún problema.
  const [error, setError] = useState('');

  // Indica si el proceso de inicio de sesión está en curso.
  // Se utiliza para deshabilitar el botón y mostrar "Verificando..."
  const [cargando, setCargando] = useState(false);

  // Mensaje mostrado mediante el componente Popup.
  const [popup, setPopup] = useState(null);

  // ===================================================
  // Función que se ejecuta al enviar el formulario
  // ===================================================
  async function handleLogin(e) {

    // Evita que el formulario recargue la página.
    e.preventDefault();

    // Limpia cualquier error anterior.
    setError('');

    // Verifica que el usuario haya ingresado correo y contraseña.
    if (!correo.trim() || !contrasena) {
      setError('Por favor completa correo y contraseña.');
      return;
    }

    // Activa el estado de carga.
    setCargando(true);

    try {

      // Llama a la función de autenticación del contexto.
      const usuario = await iniciarSesion({
        email: correo.trim(),
        password: contrasena
      });

      // Si el usuario seleccionó "Recordar cuenta",
      // guarda el correo en el navegador.
      if (recordar)
        localStorage.setItem(CORREO_RECORDADO_KEY, correo.trim());
      else
        localStorage.removeItem(CORREO_RECORDADO_KEY);

      // Obtiene el nombre del usuario.
      // Si no existe un nick, utiliza el correo electrónico.
      const nick = usuario.user_metadata?.nick || usuario.email;

      // Muestra un mensaje de bienvenida.
      setPopup(`¡Bienvenido de nuevo, ${nick}!`);

      // Espera 1.4 segundos antes de redireccionar al inicio.
      setTimeout(() => navigate('/'), 1400);

    } catch (err) {

      // Si ocurre un error (correo o contraseña incorrectos, etc.)
      // se muestra el mensaje correspondiente.
      setError(err.message || 'No se pudo iniciar sesión.');

    } finally {

      // Independientemente del resultado,
      // se desactiva el estado de carga.
      setCargando(false);
    }
  }

  // =======================
  // Interfaz del componente
  // =======================
  return (
    <>
      {/* Encabezado de la página */}
      <section className="auth-hero">
        <h1 className="auth-hero-title">Iniciar sesión</h1>
      </section>

      <div className="auth-wrap">

        {/* Pestañas para cambiar entre Login y Registro */}
        <div className="auth-tabs">
          <span className="auth-tab auth-tab--active">
            Iniciar Sesión
          </span>

          <Link to="/registro" className="auth-tab">
            Registrarse
          </Link>
        </div>

        {/* Formulario de inicio de sesión */}
        <form
          className="auth-card"
          onSubmit={handleLogin}
          noValidate
        >

          {/* Mensaje de error */}
          <div className={`auth-error${error ? ' visible' : ''}`}>
            {error}
          </div>

          {/* Campo de correo */}
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

          {/* Campo de contraseña */}
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

          {/* Casilla para recordar el correo del usuario */}
          <label className="auth-remember">
            <input
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
            />
            {' '}
            Recordar cuenta
          </label>

          {/* Botón para iniciar sesión */}
          <button
            type="submit"
            className="btn-auth-submit"
            disabled={cargando}
          >
            {cargando ? 'Verificando…' : 'Iniciar Sesión'}
          </button>

          {/* Enlace para recuperación de contraseña */}
          <a href="#" className="auth-link-bottom">
            ¿Olvidaste tu contraseña?
          </a>

          {/* Enlace para registrarse */}
          <p className="auth-switch">
            ¿No tienes cuenta?{' '}
            <Link to="/registro">
              Regístrate aquí
            </Link>
          </p>

        </form>
      </div>

      {/* Ventana emergente que muestra mensajes al usuario */}
      <Popup mensaje={popup} />
    </>
  );
}