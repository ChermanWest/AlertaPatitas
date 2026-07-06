/* ============================================================
   ALERTA PATITAS — editor.js  (versión Supabase)
   Formulario + galería + envío a Supabase PostgreSQL + Storage.
   Requiere: supabase.js cargado antes que este archivo.
   ============================================================ */


/* ══════════════════════════════════════════════════
   GALERÍA (igual que antes, sin cambios)
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
   SUBIR FOTOS A SUPABASE STORAGE
   Ya NO necesitamos convertir a base64.
   Subimos el File directamente.
══════════════════════════════════════════════════ */
async function subirFotos(nombre) {
  const fotosConArchivo = images.filter(Boolean);
  const urls = [];

  for (let i = 0; i < fotosConArchivo.length; i++) {
    const { file } = fotosConArchivo[i];
    const ext  = file.name.split('.').pop().toLowerCase() || 'jpg';
    // Nombre único: nombre_mascota + timestamp + índice
    const path = `${nombre.replace(/\s+/g, '_')}_${Date.now()}_${i}.${ext}`;
    const url  = await sb.uploadFile('fotos-mascotas', path, file);
    urls.push(url);
  }

  return urls; // array de URLs públicas
}


/* ══════════════════════════════════════════════════
   VALIDACIÓN (igual que antes)
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
   FEEDBACK VISUAL (igual que antes)
══════════════════════════════════════════════════ */
function getFeedbackEl() {
  let el = document.getElementById('publish-feedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'publish-feedback';
    el.style.cssText = `
      margin-top:12px;padding:12px 16px;border-radius:12px;
      font-size:14px;font-family:var(--font-onest,sans-serif);
      font-weight:600;display:none;`;
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
  el.style.background = s.bg;
  el.style.color      = s.color;
  el.style.border     = `1px solid ${s.border}`;
  el.textContent      = mensaje;
}

function ocultarFeedback() { getFeedbackEl().style.display = 'none'; }

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
  let usuario = null;
  try { usuario = JSON.parse(localStorage.getItem('alertaPatitas_usuario') || 'null'); }
  catch { usuario = null; }

  return {
    nombre:       document.getElementById('petName').value.trim(),
    mascota:      document.getElementById('petType').value,
    sexo:         document.getElementById('petSex').value,
    edad:         document.getElementById('petAge')?.value || '',
    tamano:       document.getElementById('petSize').value,
    estado:       document.getElementById('estado-mascota').checked ? 'perdido' : 'buscando',
    descripcion:  document.getElementById('pet-description').value.trim(),
    contacto:     document.querySelector('.text-area')?.value.trim() || '',
    autor_id:     usuario?.id    || null,
    autor_correo: usuario?.email || '',
  };
}


/* ══════════════════════════════════════════════════
   MODO EDICIÓN
══════════════════════════════════════════════════ */
const params          = new URLSearchParams(window.location.search);
const idEdicion       = params.get('id');
let   publicacionOriginal = null;

async function cargarPublicacionParaEditar() {
  if (!idEdicion) return;

  let usuario = null;
  try { usuario = JSON.parse(localStorage.getItem('alertaPatitas_usuario') || 'null'); }
  catch { usuario = null; }

  if (!usuario) {
    alert('Debes iniciar sesión para editar una publicación.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const resultados = await sb.from('mascotas').select('*').eq('id', idEdicion).get();

    if (!resultados || resultados.length === 0) {
      alert('No se encontró la publicación que intentas editar.');
      return;
    }

    const item = resultados[0];

    // Verificar que el usuario sea el autor
    if (!item.autor_correo || item.autor_correo.toLowerCase() !== usuario.email.toLowerCase()) {
      alert('No tienes permiso para editar esta publicación.');
      window.location.href = 'home.html';
      return;
    }

    publicacionOriginal = item;

    // Precargar el formulario
    document.getElementById('petName').value         = item.nombre  || '';
    document.getElementById('petType').value         = item.mascota || '';
    document.getElementById('petSex').value          = item.sexo    || '';
    document.getElementById('petSize').value         = item.tamano  || '';
    if (document.getElementById('petAge'))
      document.getElementById('petAge').value = item.edad || '';
    document.getElementById('pet-description').value = item.descripcion || '';
    document.getElementById('estado-mascota').checked = (item.estado === 'perdido' || item.estado === 'extraviado');
    const ta = document.querySelector('.text-area');
    if (ta) ta.value = item.contacto || '';

    const btn = document.querySelector('.btn-publish');
    if (btn) btn.textContent = 'GUARDAR CAMBIOS 🐾';

  } catch (err) {
    console.error('Error cargando publicación para editar:', err);
    alert('Ocurrió un error al cargar la publicación.');
  }
}

cargarPublicacionParaEditar();


/* ══════════════════════════════════════════════════
   PUBLICAR — flujo completo con Supabase
══════════════════════════════════════════════════ */
async function publicar() {
  ocultarFeedback();

  const errores = validarFormulario();
  if (errores.length > 0) {
    mostrarFeedback('error', '⚠️ ' + errores[0]);
    return;
  }

  setBtnLoading(true);

  try {
    const datos = leerDatos();

    // 1. Subir fotos al Storage de Supabase
    let fotoUrls = publicacionOriginal?.fotos || []; // conservar fotos existentes al editar

    if (images.some(Boolean)) {
      mostrarFeedback('cargando', '🖼️ Subiendo imágenes…');
      fotoUrls = await subirFotos(datos.nombre);
    }

    mostrarFeedback('cargando', idEdicion ? '⏳ Guardando cambios…' : '⏳ Guardando publicación…');

    if (idEdicion) {
      // ── EDITAR ──
      await sb.from('mascotas').update(
        { ...datos, fotos: fotoUrls },
        'id',
        idEdicion
      );
      mostrarFeedback('exito', '✅ ¡Cambios guardados correctamente!');

    } else {
      // ── CREAR ──
      await sb.from('mascotas').insert({
        ...datos,
        fotos: fotoUrls,
      });
      mostrarFeedback('exito', '✅ ¡Publicación guardada correctamente!');
      limpiarFormulario();
    }

  } catch (err) {
    console.error('Error al publicar:', err);
    mostrarFeedback('error', '❌ ' + (err.message || 'Error al guardar. Revisa tu conexión.'));
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

document.querySelector('.btn-publish').addEventListener('click', publicar);
