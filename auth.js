/* ============================================================
   ALERTA PATITAS — auth.js  (versión Supabase)
   Registro, login, sesión y header con nombre de usuario.
   Requiere: supabase.js cargado antes que este archivo.
   ============================================================ */

const SESSION_KEY = 'alertaPatitas_usuario';


/* ══════════════════════════════════════════
   SESIÓN LOCAL
══════════════════════════════════════════ */
function obtenerSesion() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

function guardarSesion(usuario) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'home.html';
}


/* ══════════════════════════════════════════
   POPUP DE CONFIRMACIÓN
══════════════════════════════════════════ */
function mostrarPopup(mensaje, redireccion) {
  const overlay = document.createElement('div');
  overlay.className = 'auth-popup-overlay';
  overlay.innerHTML = `
    <div class="auth-popup">
      <div class="auth-popup-icon">🐾</div>
      <p class="auth-popup-msg">${mensaje}</p>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('auth-popup-overlay--visible'), 10);
  setTimeout(() => {
    if (redireccion) window.location.href = redireccion;
    else overlay.remove();
  }, 1600);
}


/* ══════════════════════════════════════════
   HEADER: muestra nombre del usuario logueado
══════════════════════════════════════════ */
function pintarHeaderSesion() {
  const usuario      = obtenerSesion();
  const loginWrapper = document.querySelector('.login-wrapper');
  if (!loginWrapper) return;
  if (!usuario) return;

  loginWrapper.innerHTML = `
    <button class="btn-login btn-login--activo">
      <span class="user-dot">${(usuario.nick || '?').charAt(0).toUpperCase()}</span>
      ${usuario.nick || 'Mi cuenta'}
    </button>
    <div class="login-dropdown">
      <div class="login-opt login-opt--primary" style="cursor:default;">
        <span class="lopt-icon">🐾</span>
        <div>
          <strong>${usuario.nick || ''}</strong>
          <small>${usuario.email || ''}</small>
        </div>
      </div>
      <div class="login-divider"></div>
      <a href="editor1.html" class="login-opt login-opt--publish">
        <span class="lopt-icon">📝</span>
        <div>
          <strong>Crea una publicación</strong>
          <small>Reporta una mascota</small>
        </div>
      </a>
      <div class="login-divider"></div>
      <a href="#" class="login-opt" id="btnCerrarSesion">
        <span class="lopt-icon">🚪</span>
        <div>
          <strong>Cerrar sesión</strong>
          <small>Salir de tu cuenta</small>
        </div>
      </a>
    </div>`;

  document.getElementById('btnCerrarSesion')
    ?.addEventListener('click', e => { e.preventDefault(); cerrarSesion(); });
}

document.addEventListener('DOMContentLoaded', pintarHeaderSesion);


/* ══════════════════════════════════════════
   REGISTRO — Supabase
══════════════════════════════════════════ */
async function registrarUsuario({ nick, email, password }) {
  // 1. Verificar que el email no exista
  const existentes = await sb.from('usuarios').select('id').eq('email', email.toLowerCase()).get();
  if (existentes.length > 0) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.');
  }

  // 2. Verificar que el nick no esté tomado
  const nicksExistentes = await sb.from('usuarios').select('id').eq('nick', nick).get();
  if (nicksExistentes.length > 0) {
    throw new Error('Ese nick ya está en uso. Elige otro.');
  }

  // 3. Hashear la contraseña
  const salt         = sb.generateSalt();
  const passwordHash = await sb.hashPassword(password, salt);

  // 4. Insertar el usuario
  const [usuario] = await sb.from('usuarios').insert({
    nick,
    email:         email.toLowerCase(),
    password_hash: passwordHash,
    salt,
  });

  return usuario;
}


/* ══════════════════════════════════════════
   LOGIN — Supabase
══════════════════════════════════════════ */
async function loginUsuario({ email, password }) {
  // 1. Buscar el usuario por email
  const resultados = await sb.from('usuarios')
    .select('id,nick,email,password_hash,salt')
    .eq('email', email.toLowerCase())
    .get();

  if (resultados.length === 0) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  const usuario = resultados[0];

  // 2. Verificar contraseña
  const hashIntento = await sb.hashPassword(password, usuario.salt);
  if (hashIntento !== usuario.password_hash) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  // 3. Devolver solo los datos seguros (sin hash ni salt)
  return {
    id:    usuario.id,
    nick:  usuario.nick,
    email: usuario.email,
  };
}
