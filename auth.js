/* ============================================================
   ALERTA PATITAS — auth.js
   Manejo de sesión (registro / login / logout), popups de
   confirmación y nombre de usuario en el header.

   CONFIGURACIÓN:
   Reemplaza API_URL con la misma URL de tu Apps Script
   (debe ser idéntica a la de loader.js).
   ============================================================ */

const AUTH_API_URL = 'https://script.google.com/macros/s/AKfycbyOz26XnOoXsUEd47122hxEtfDFgWwr4vi_NuF4lQD9dREtHiB05Ofl-TdxpZ1KodRJfg/exec';
// Misma URL que en loader.js / editor.js

const SESSION_KEY = 'alertaPatitas_usuario';


/* ── Sesión: leer / guardar / borrar ── */
function obtenerSesion() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function guardarSesion(usuario) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'home.html';
}


/* ── Popup de confirmación (éxito) ── */
function mostrarPopup(mensaje, redireccion) {
  const overlay = document.createElement('div');
  overlay.className = 'auth-popup-overlay';
  overlay.innerHTML = `
    <div class="auth-popup">
      <div class="auth-popup-icon">🐾</div>
      <p class="auth-popup-msg">${mensaje}</p>
    </div>`;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('auth-popup-overlay--visible');
  }, 10);

  setTimeout(() => {
    if (redireccion) {
      window.location.href = redireccion;
    } else {
      overlay.remove();
    }
  }, 1600);
}


/* ── Pinta el nombre de usuario en el header (si hay sesión) ── */
function pintarHeaderSesion() {
  const usuario = obtenerSesion();
  const loginWrapper = document.querySelector('.login-wrapper');
  if (!loginWrapper) return;

  if (!usuario) return; // dejar el botón "Iniciar Sesión" tal cual está en el HTML

  loginWrapper.innerHTML = `
    <button class="btn-login btn-login--activo">
      <span class="user-dot">${(usuario.nombre || '?').charAt(0).toUpperCase()}</span>
      ${usuario.nombre || 'Mi cuenta'}
    </button>
    <div class="login-dropdown">
      <div class="login-opt login-opt--primary" style="cursor:default;">
        <span class="lopt-icon">🐾</span>
        <div>
          <strong>${usuario.nombre || ''}</strong>
          <small>${usuario.correo || ''}</small>
        </div>
      </div>
      <div class="login-divider"></div>
      <a href="editor1.html" class="login-opt login-opt--publish">
        <span class="lopt-icon"></span>
        <div>
          <strong>Crea una publicación</strong>
          <small>Reporta una mascota</small>
        </div>
      </a>
      <div class="login-divider"></div>
      <a href="#" class="login-opt" id="btnCerrarSesion">
        <span class="lopt-icon"></span>
        <div>
          <strong>Cerrar sesión</strong>
          <small>Salir de tu cuenta</small>
        </div>
      </a>
    </div>`;

  const btnSalir = document.getElementById('btnCerrarSesion');
  if (btnSalir) {
    btnSalir.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }
}

document.addEventListener('DOMContentLoaded', pintarHeaderSesion);
