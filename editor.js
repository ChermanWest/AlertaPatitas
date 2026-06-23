/* ============================================================
   ALERTA PATITAS — editor.js
   Formulario + galería + envío a Google Sheets/Drive
   ============================================================ */

// ⚠️ PASO OBLIGATORIO: reemplaza esto con la URL de tu
// despliegue de Apps Script (termina en /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbyOz26XnOoXsUEd47122hxEtfDFgWwr4vi_NuF4lQD9dREtHiB05Ofl-TdxpZ1KodRJfg/exec';


/* ══════════════════════════════════════════════════
   GALERÍA
══════════════════════════════════════════════════ */
const imageUpload        = document.getElementById('imageUpload');
const slidesContainer    = document.getElementById('slidesContainer');
const galleryPlaceholder = document.getElementById('galleryPlaceholder');
const btnPrev            = document.getElementById('btnPrev');
const btnNext            = document.getElementById('btnNext');
const thumbWrappers      = [
  document.getElementById('thumb0'),
  document.getElementById('thumb1'),
  document.getElementById('thumb2'),
];

// Cada slot guarda { url, file } o null
let images       = [null, null, null];
let currentIndex = 0;

thumbWrappers.forEach((tw, i) => {
  tw.addEventListener('click', (e) => {
    if (images[i]) { e.preventDefault(); showSlide(i); }
  });
});

imageUpload.addEventListener('change', (e) => {
  Array.from(e.target.files).slice(0, 3).forEach((file) => {
    const slot = images.findIndex(img => img === null);
    if (slot === -1) return;
    const url = URL.createObjectURL(file);
    images[slot] = { url, file };
    updateThumbnail(slot, url);
  });
  rebuildSlides();
  imageUpload.value = '';
});

function updateThumbnail(index, url) {
  thumbWrappers[index].innerHTML = `<img src="${url}" alt="Foto ${index + 1}" />`;
}

function rebuildSlides() {
  slidesContainer.innerHTML = '';
  const filled = images.filter(Boolean);

  if (filled.length === 0) {
    slidesContainer.style.display   = 'none';
    galleryPlaceholder.style.display = 'flex';
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
    return;
  }

  galleryPlaceholder.style.display = 'none';
  slidesContainer.style.display    = 'block';
  btnPrev.style.display = filled.length > 1 ? 'flex' : 'none';
  btnNext.style.display = filled.length > 1 ? 'flex' : 'none';

  images.forEach((item, i) => {
    if (!item) return;
    const div = document.createElement('div');
    div.classList.add('slide');
    div.dataset.index = i;
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = `Foto ${i + 1}`;
    div.appendChild(img);
    slidesContainer.appendChild(div);
  });

  showSlide(images.findIndex(Boolean));
}

function showSlide(targetIndex) {
  currentIndex = targetIndex;
  slidesContainer.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  const target = slidesContainer.querySelector(`[data-index="${targetIndex}"]`);
  if (target) target.classList.add('active');
  thumbWrappers.forEach((tw, i) => tw.classList.toggle('active', i === targetIndex));
}

btnPrev.addEventListener('click', () => {
  const fi = images.map((v, i) => v ? i : null).filter(i => i !== null);
  showSlide(fi[(fi.indexOf(currentIndex) - 1 + fi.length) % fi.length]);
});

btnNext.addEventListener('click', () => {
  const fi = images.map((v, i) => v ? i : null).filter(i => i !== null);
  showSlide(fi[(fi.indexOf(currentIndex) + 1) % fi.length]);
});


/* ══════════════════════════════════════════════════
   CONVERTIR IMAGEN A BASE64
   Apps Script necesita base64 para procesar el archivo
══════════════════════════════════════════════════ */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      // result = "data:image/jpeg;base64,/9j/4AAQ..."
      // solo queremos la parte después de la coma
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getExtension(file) {
  return file.name.split('.').pop().toLowerCase() || 'jpg';
}


/* ══════════════════════════════════════════════════
   VALIDACIÓN
══════════════════════════════════════════════════ */
function validarFormulario() {
  const errores = [];
  if (!document.getElementById('petName').value.trim())
    errores.push('El nombre de la mascota es obligatorio.');
  if (!document.getElementById('petType').value)
    errores.push('Selecciona el tipo de mascota.');
  if (!document.getElementById('petSex').value)
    errores.push('Selecciona el sexo.');
  if (!document.getElementById('petSize').value)
    errores.push('Selecciona el tamaño.');
  if (!document.getElementById('pet-description').value.trim())
    errores.push('Agrega una descripción de la mascota.');
  return errores;
}


/* ══════════════════════════════════════════════════
   FEEDBACK VISUAL
══════════════════════════════════════════════════ */
function getFeedbackEl() {
  let el = document.getElementById('publish-feedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'publish-feedback';
    el.style.cssText = `
      margin-top: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-family: var(--font-onest, sans-serif);
      font-weight: 600;
      display: none;
    `;
    document.querySelector('.btn-publish').insertAdjacentElement('afterend', el);
  }
  return el;
}

function mostrarFeedback(tipo, mensaje) {
  const el = getFeedbackEl();
  el.style.display = 'block';
  const estilos = {
    error:    { bg: '#fdecea', color: '#c0392b', border: '#f5c6c6' },
    exito:    { bg: '#eafaf1', color: '#1e8449', border: '#a9dfbf' },
    cargando: { bg: '#fef9e7', color: '#7d6608', border: '#f9e79f' },
  };
  const s = estilos[tipo] || estilos.cargando;
  el.style.background   = s.bg;
  el.style.color        = s.color;
  el.style.border       = `1px solid ${s.border}`;
  el.textContent        = mensaje;
}

function ocultarFeedback() {
  getFeedbackEl().style.display = 'none';
}

function setBtnLoading(loading) {
  const btn = document.querySelector('.btn-publish');
  btn.disabled      = loading;
  btn.style.opacity = loading ? '0.7' : '';
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Publicando…';
  } else {
    btn.textContent = btn.dataset.originalText || 'PUBLICAR 🐾';
  }
}


/* ══════════════════════════════════════════════════
   LEER DATOS DEL FORMULARIO
══════════════════════════════════════════════════ */
function leerDatos() {
  // Sesión del usuario logueado (la guarda auth.js en localStorage)
  // Si no hay sesión, autor/autor_correo quedan vacíos y la
  // publicación simplemente no tendrá dueño asignado.
  let usuario = null;
  try {
    const raw = localStorage.getItem('alertaPatitas_usuario');
    usuario = raw ? JSON.parse(raw) : null;
  } catch (err) {
    usuario = null;
  }

  return {
    nombre:        document.getElementById('petName').value.trim(),
    mascota:       document.getElementById('petType').value,
    sexo:          document.getElementById('petSex').value,
    edad:          document.getElementById('petAge')?.value || '',
    tamano:        document.getElementById('petSize').value,
    estado:        document.getElementById('estado-mascota').checked ? 'extraviado' : 'buscando',
    descripcion:   document.getElementById('pet-description').value.trim(),
    contacto:      document.querySelector('.text-area')?.value.trim() || '',
    autor:         usuario?.nombre || '',
    autor_correo:  usuario?.correo || '',
  };
}


/* ══════════════════════════════════════════════════
   MODO EDICIÓN
   Si la URL tiene ?id=XXXX, este formulario edita una
   publicación existente en vez de crear una nueva.
══════════════════════════════════════════════════ */
const params         = new URLSearchParams(window.location.search);
const idEdicion       = params.get('id');
let publicacionOriginal = null; // se llena si estamos editando

async function cargarPublicacionParaEditar() {
  if (!idEdicion) return;

  // Verificar sesión: solo usuarios logueados pueden editar
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem('alertaPatitas_usuario') || 'null');
  } catch (err) { /* noop */ }

  if (!usuario) {
    alert('Debes iniciar sesión para editar una publicación.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res  = await fetch(API_URL);
    const json = await res.json();
    if (!json.ok || !Array.isArray(json.data)) throw new Error('No se pudo cargar la publicación.');

    const item = json.data.find(m => String(m.id) === String(idEdicion));
    if (!item) {
      alert('No se encontró la publicación que intentas editar.');
      return;
    }

    // Verificar que el usuario logueado sea el autor
    const correoAutor = String(item.autor_correo || '').trim().toLowerCase();
    if (!correoAutor || correoAutor !== usuario.correo.trim().toLowerCase()) {
      alert('No tienes permiso para editar esta publicación.');
      window.location.href = 'home.html';
      return;
    }

    publicacionOriginal = item;

    // Precargar formulario con los datos existentes
    document.getElementById('petName').value         = item.nombre || '';
    document.getElementById('petType').value         = item.mascota || '';
    document.getElementById('petSex').value          = item.sexo || '';
    document.getElementById('petSize').value         = item.tamano || item['tamaño'] || '';
    if (document.getElementById('petAge')) {
      document.getElementById('petAge').value = item.edad || '';
    }
    document.getElementById('pet-description').value = item.descripcion || '';
    document.getElementById('estado-mascota').checked = (item.estado === 'extraviado' || item.estado === 'perdido');
    const ta = document.querySelector('.text-area');
    if (ta) ta.value = item.contacto || '';

    // Cambiar texto del botón a modo edición
    const btn = document.querySelector('.btn-publish');
    if (btn) btn.textContent = 'GUARDAR CAMBIOS 🐾';

    // Las fotos existentes no se recargan en los slots (son archivos,
    // no URLs) — si el usuario no sube fotos nuevas, se conservan las
    // que ya tenía la publicación.

  } catch (err) {
    console.error('Error cargando publicación para editar:', err);
    alert('Ocurrió un error al cargar la publicación.');
  }
}

cargarPublicacionParaEditar();


/* ══════════════════════════════════════════════════
   PUBLICAR — flujo completo
══════════════════════════════════════════════════ */
async function publicar() {
  ocultarFeedback();

  // 1. Validar campos
  const errores = validarFormulario();
  if (errores.length > 0) {
    mostrarFeedback('error', '⚠️ ' + errores[0]);
    return;
  }

  // 2. Verificar URL configurada
  if (!API_URL || API_URL === 'TU_URL_DE_APPS_SCRIPT_AQUI') {
    mostrarFeedback('error', '⚙️ Falta configurar la URL de Apps Script en editor.js (constante API_URL).');
    return;
  }

  setBtnLoading(true);

  // 3. Convertir imágenes a base64 (solo si el usuario subió fotos nuevas)
  mostrarFeedback('cargando', '🖼️ Preparando imágenes…');

  const fotosConArchivo = images.filter(Boolean); // slots con imagen
  let fotosBase64 = [];

  try {
    fotosBase64 = await Promise.all(
      fotosConArchivo.map(async (item) => ({
        data:      await fileToBase64(item.file),
        tipo:      item.file.type,       // ej: "image/jpeg"
        extension: getExtension(item.file),
      }))
    );
  } catch (err) {
    console.error('Error convirtiendo imágenes:', err);
    mostrarFeedback('error', '❌ Error al procesar las imágenes. Intenta de nuevo.');
    setBtnLoading(false);
    return;
  }

  // 4. Enviar a Apps Script (crear o editar según el modo)
  mostrarFeedback('cargando', idEdicion ? '⏳ Guardando cambios…' : '⏳ Guardando publicación…');

  try {
    const datos = leerDatos();

    let payload;
    if (idEdicion) {
      payload = {
        action: 'editar_mascota',
        id: idEdicion,
        ...datos,
      };
      // Nota: si el usuario sube fotos nuevas en modo edición, el
      // backend actual de "editar_mascota" no las reemplaza — solo
      // actualiza los datos de texto. Si más adelante quieres permitir
      // cambiar fotos al editar, hay que ampliar editarPublicacion()
      // en el .gs para procesarlas igual que en crearPublicacion().
    } else {
      payload = {
        ...datos,
        fotos: fotosBase64,  // array de { data, tipo, extension }
      };
    }

    // IMPORTANTE: sin "mode: no-cors" para poder leer la respuesta real.
    // Apps Script con ContentService responde con headers compatibles
    // siempre que NO se envíen headers personalizados además de
    // 'Content-Type: text/plain' (cualquier otro header dispara un
    // preflight OPTIONS que Apps Script no maneja).
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!json.ok) {
      throw new Error(json.error || 'El servidor rechazó la publicación.');
    }

    if (idEdicion) {
      mostrarFeedback('exito', '✅ ¡Cambios guardados correctamente!');
    } else {
      mostrarFeedback('exito', '✅ ¡Publicación guardada! Las fotos pueden tardar unos segundos en aparecer.');
      limpiarFormulario();
    }

  } catch (err) {
    console.error('Error al publicar:', err);
    mostrarFeedback('error', '❌ ' + (err.message || 'Error al guardar. Revisa tu conexión e intenta de nuevo.'));
  } finally {
    setBtnLoading(false);
  }
}


/* ══════════════════════════════════════════════════
   LIMPIAR FORMULARIO
══════════════════════════════════════════════════ */
function limpiarFormulario() {
  document.getElementById('petName').value         = '';
  document.getElementById('petType').value         = '';
  document.getElementById('petSex').value          = '';
  document.getElementById('petSize').value         = '';
  document.getElementById('pet-description').value = '';
  document.getElementById('estado-mascota').checked = false;
  const ta = document.querySelector('.text-area');
  if (ta) ta.value = '';

  images = [null, null, null];
  thumbWrappers.forEach((tw, i) => {
    tw.innerHTML = `
      <div class="thumb-placeholder">
        <span class="thumb-icon">📷</span>
        <span>Foto ${i + 1}</span>
      </div>`;
    tw.classList.remove('active');
  });
  rebuildSlides();
}


/* ══════════════════════════════════════════════════
   EVENTO PRINCIPAL
══════════════════════════════════════════════════ */
document.querySelector('.btn-publish').addEventListener('click', publicar);
