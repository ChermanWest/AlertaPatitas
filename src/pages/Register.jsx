/* ============================================================
   ALERTA PATITAS — Register.jsx
   Pantalla de registro de nuevos usuarios.
   ============================================================ */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Popup from '../components/Popup';

export default function Register() {
  // Función de registro provista por el contexto de autenticación
  const { registrar } = useAuth();
  // Para redirigir al usuario luego de registrarse
  const navigate = useNavigate();

  // Estados de los campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Mensaje de error a mostrar en el formulario
  const [error, setError] = useState('');
  // Indica si la petición de registro está en curso (deshabilita el botón)
  const [cargando, setCargando] = useState(false);
  // Mensaje del popup de confirmación (null = oculto)
  const [popup, setPopup] = useState(null);

  // Maneja el envío del formulario de registro
  async function handleSubmit(e) {
    e.preventDefault(); // Evita el recargado de página por defecto del form
    setError(''); // Limpia errores previos

    // Validación básica: todos los campos deben estar completos
    if (!nombre.trim() || !correo.trim() || !contrasena.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    // Validación de longitud mínima de la contraseña
    if (contrasena.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true); // Activa el estado de carga (deshabilita botón)
    try {
      // Llama a la función de registro del contexto de auth con los datos limpios
      const usuario = await registrar({ nick: nombre.trim(), email: correo.trim(), password: contrasena.trim() });

      // Intenta obtener el nick guardado en los metadatos del usuario;
      // si no existe, usa el nombre ingresado como respaldo
      const nick = usuario?.user_metadata?.nick || nombre.trim();

      
      setPopup(`¡Cuenta creada! Revisa tu correo para confirmarla, ${nick}.`);

      // Espera 1.8s 
    } catch (err) {
      // Si algo falla (correo duplicado, error de red, etc.), muestra el error
      console.error(err);
      setError(err.message || 'No se pudo crear la cuenta.');
    } finally {
      // Se ejecuta siempre, haya éxito o error: desactiva el estado de carga
      setCargando(false);
    }
  }

  return (
    <>
      {/* Encabezado de la sección */}
      <section className="auth-hero">
        <h1 className="auth-hero-title">Crear cuenta</h1>
      </section>

      <div className="auth-wrap">
        {/* Pestañas de navegación entre login y registro */}
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">
            Iniciar Sesión
          </Link>
          <span className="auth-tab auth-tab--active">Registrarse</span>
        </div>

        <div className="auth-card">
          {/* Contenedor del mensaje de error; visible solo si hay texto en "error" */}
          <div className={`auth-error${error ? ' visible' : ''}`}>{error}</div>

          {/* noValidate desactiva la validación nativa del navegador,
              ya que la validación se maneja manualmente en handleSubmit */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Campo: nombre o nick */}
            <div className="auth-field">
              <input
                type="text"
                className="auth-input"
                placeholder="Nombre o nick"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {/* Campo: correo electrónico */}
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

            {/* Campo: contraseña (mínimo 6 caracteres) */}
            <div className="auth-field">
              <input
                type="password"
                className="auth-input"
                placeholder="Contraseña"
                required
                minLength={6}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            {/* Botón de envío; se deshabilita y cambia texto mientras carga */}
            <button type="submit" className="btn-auth-submit" style={{ marginTop: 4 }} disabled={cargando}>
              {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          {/* Enlace alternativo hacia la pantalla de login */}
          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>

      {/* Popup de confirmación de cuenta creada */}
      <Popup mensaje={popup} />
    </>
  );
}
