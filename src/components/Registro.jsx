/* ============================================================
   ALERTA PATITAS — Register.jsx

   Bug corregido: registro.html hacía
     fetch(AUTH_API_URL, { body: JSON.stringify({ action:'registro', nombre, correo, contrasena }) })
   pero AUTH_API_URL nunca se definía en ningún archivo, y los
   nombres de campo (nombre/correo/contrasena) no coincidían con
   la función real registrarUsuario({ nick, email, password }) de
   auth.js. Es decir: el registro estaba completamente roto. Acá
   se llama directamente a Supabase Auth con los nombres correctos.
   ============================================================ */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Popup from '../components/Popup';

export default function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [popup, setPopup] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !correo.trim() || !contrasena.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (contrasena.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const usuario = await registrar({ nick: nombre.trim(), email: correo.trim(), password: contrasena.trim() });
      const nick = usuario?.user_metadata?.nick || nombre.trim();

      // Nota: si tu proyecto Supabase tiene activa la confirmación por
      // correo (Auth → Providers → Email → "Confirm email"), la sesión
      // no queda iniciada hasta que la persona confirme su casilla.
      setPopup(`¡Cuenta creada! Revisa tu correo para confirmarla, ${nick}.`);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      console.error(err);
      setError(err.message || 'No se pudo crear la cuenta.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <section className="auth-hero">
        <h1 className="auth-hero-title">Crear cuenta</h1>
      </section>

      <div className="auth-wrap">
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">
            Iniciar Sesión
          </Link>
          <span className="auth-tab auth-tab--active">Registrarse</span>
        </div>

        <div className="auth-card">
          <div className={`auth-error${error ? ' visible' : ''}`}>{error}</div>

          <form onSubmit={handleSubmit} noValidate>
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
                minLength={6}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-auth-submit" style={{ marginTop: 4 }} disabled={cargando}>
              {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>

      <Popup mensaje={popup} />
    </>
  );
}
