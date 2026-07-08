/* ============================================================
   ALERTA PATITAS — Editor.jsx  (crear / editar publicación)

   Cambios de fondo respecto a editor.js:
     - subirFotos() ahora usa supabase.storage.from(bucket).upload()
       del SDK en vez de fetch() manual al endpoint de Storage.
     - autor_id ahora es el uuid real de Supabase Auth
       (session.user.id), no un id numérico de la vieja tabla
       "usuarios". Esto es lo que permite que las políticas RLS
       (auth.uid() = autor_id) funcionen tanto en la tabla
       "mascotas" como en el bucket de Storage.
     - Publicar ahora EXIGE sesión iniciada (antes se podía crear
       una publicación sin login y quedaba "huérfana", sin dueño
       real que luego pudiera editarla).
   ============================================================ */

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Gallery from '../components/Gallery';

/* Estilos inline para el aviso de feedback (igual criterio que
   mostrarFeedback() en editor.js, que también armaba los colores
   a mano en vez de depender de clases CSS que no existían). */
const ESTILOS_FEEDBACK = {
  error: { background: '#fdecea', color: '#c0392b', border: '1px solid #f5c6c6' },
  exito: { background: '#eafaf1', color: '#1e8449', border: '1px solid #a9dfbf' },
  cargando: { background: '#fef9e7', color: '#7d6608', border: '1px solid #f9e79f' },
};

// Estado inicial del formulario para crear una publicación en blanco
const FORM_INICIAL = {
  nombre: '',
  mascota: '',
  sexo: '',
  tamano: '',
  edad: '',
  estado: false, // false = "buscando", true = "perdido/extraviado"
  ubicacion: '',
  descripcion: '',
  contacto: '',
};

export default function Editor() {
  // Autenticación y navegación
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idEdicion = searchParams.get('id'); // Determina si es una creación nueva o una edición

  // Estados del componente
  const [form, setForm] = useState(FORM_INICIAL);
  const [sugerenciasUbicacion, setSugerenciasUbicacion] = useState([]);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [images, setImages] = useState([null, null, null]);
  const [publicacionOriginal, setPublicacionOriginal] = useState(null);
  const [feedback, setFeedback] = useState(null); // Maneja los mensajes de error/éxito
  const [publicando, setPublicando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(Boolean(idEdicion));

  // Función para obtener los datos de la publicación si estamos en modo "edición"
  const cargarParaEditar = useCallback(async () => {
    if (!idEdicion) return;

    // Redirige al login si intenta editar sin estar autenticado
    if (!usuario) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase.from('mascotas').select('*').eq('id', idEdicion).single();

      if (error || !data) {
        setFeedback({ tipo: 'error', mensaje: 'No se encontró la publicación que intentas editar.' });
        return;
      }

      // Verificación de seguridad: solo el autor puede editar
      if (data.autor_id !== usuario.id) {
        setFeedback({ tipo: 'error', mensaje: 'No tienes permiso para editar esta publicación.' });
        setTimeout(() => navigate('/'), 1800);
        return;
      }

      // Rellena el formulario con los datos recuperados de la BD
      setPublicacionOriginal(data);
      setForm({
        nombre: data.nombre || '',
        mascota: data.mascota || '',
        sexo: data.sexo || '',
        tamano: data.tamano || data['tamaño'] || '',
        edad: data.edad || '',
        estado: data.estado === 'perdido' || data.estado === 'extraviado',
        ubicacion: data.zona || data.ubicacion || data.lugar || '',
        descripcion: data.descripcion || '',
        contacto: data.contacto || '',
      });
    } catch (err) {
      console.error('Error cargando publicación para editar:', err);
      setFeedback({ tipo: 'error', mensaje: 'Ocurrió un error al cargar la publicación.' });
    } finally {
      setCargandoInicial(false);
    }
  }, [idEdicion, usuario, navigate]);

  // Se ejecuta al montar el componente para verificar si hay que cargar datos
  useEffect(() => {
    cargarParaEditar();
  }, [cargarParaEditar]);

  // Efecto para buscar sugerencias de autocompletado para la ubicación
  useEffect(() => {
    const consulta = form.ubicacion.trim();

    // Limpia las sugerencias si el campo está vacío
    if (!consulta) {
      setSugerenciasUbicacion([]);
      setCargandoUbicacion(false);
      return;
    }

    // Usamos un debounce (350ms) para no saturar la API con cada tecla pulsada
    const timeoutId = setTimeout(async () => {
      try {
        setCargandoUbicacion(true);
        // Petición a la API de Nominatim (OpenStreetMap) restringida a Chile (Arica y Parinacota)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&accept-language=es&countrycodes=cl&viewbox=-70.8,-17.4,-68.7,-19.3&bounded=1&q=${encodeURIComponent(`${consulta}, Arica y Parinacota, Chile`)}`,
        );

        if (!response.ok) {
          throw new Error('No se pudieron cargar las sugerencias.');
        }

        const results = await response.json();
        setSugerenciasUbicacion(
          results.map((item) => ({
            id: item.place_id,
            label: item.display_name,
          })),
        );
      } catch (err) {
        console.error('Error obteniendo sugerencias de ubicación:', err);
        setSugerenciasUbicacion([]);
      } finally {
        setCargandoUbicacion(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [form.ubicacion]);

  // Helper genérico para actualizar el estado del formulario de forma limpia
  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Comprueba que los campos obligatorios no estén vacíos antes de enviar
  function validar() {
    const errores = [];
    if (!form.nombre.trim()) errores.push('El nombre de la mascota es obligatorio.');
    if (!form.mascota) errores.push('Selecciona el tipo de mascota.');
    if (!form.sexo) errores.push('Selecciona el sexo.');
    if (!form.tamano) errores.push('Selecciona el tamaño.');
    if (!form.ubicacion.trim()) errores.push('Agrega una ubicación de avistamiento.');
    if (!form.descripcion.trim()) errores.push('Agrega una descripción de la mascota.');
    return errores;
  }

  // Sube las imágenes seleccionadas a Supabase Storage y retorna sus URLs públicas
  async function subirFotos() {
    const archivos = images.filter(Boolean); // Filtra los slots vacíos (null)
    const urls = [];

    for (let i = 0; i < archivos.length; i++) {
      const { file } = archivos[i];
      const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
      
      // Prefijar con el uuid del usuario ordena el bucket por dueño
      // y es lo que espera la policy de Storage (ver README).
      const path = `${usuario.id}/${form.nombre.replace(/\s+/g, '_')}_${Date.now()}_${i}.${ext}`;

      // Sube el archivo
      const { error: uploadError } = await supabase.storage.from('fotos-mascotas').upload(path, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });
      if (uploadError) throw uploadError;

      // Obtiene la URL pública para guardarla en la base de datos
      const { data } = supabase.storage.from('fotos-mascotas').getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  }

  // Función principal para guardar o actualizar la publicación
  async function publicar() {
    setFeedback(null);

    // Valida sesión
    if (!usuario) {
      setFeedback({ tipo: 'error', mensaje: 'Debes iniciar sesión para publicar.' });
      return;
    }

    // Ejecuta validaciones locales
    const errores = validar();
    if (errores.length > 0) {
      setFeedback({ tipo: 'error', mensaje: '⚠️ ' + errores[0] });
      return;
    }

    setPublicando(true);

    try {
      let fotoUrls = publicacionOriginal?.fotos || [];

      // Si el usuario seleccionó nuevas imágenes, súbelas
      if (images.some(Boolean)) {
        setFeedback({ tipo: 'cargando', mensaje: '🖼️ Subiendo imágenes…' });
        fotoUrls = await subirFotos();
      }

      setFeedback({ tipo: 'cargando', mensaje: idEdicion ? '⏳ Guardando cambios…' : '⏳ Guardando publicación…' });

      // Prepara el objeto con los datos normalizados para la BD
      const datos = {
        nombre: form.nombre.trim(),
        mascota: form.mascota,
        sexo: form.sexo,
        tamano: form.tamano,
        edad: form.edad,
        estado: form.estado ? 'perdido' : 'buscando',
        zona: form.ubicacion.trim(),
        ubicacion: form.ubicacion.trim(),
        lugar: form.ubicacion.trim(),
        descripcion: form.descripcion.trim(),
        contacto: form.contacto.trim(),
        autor_id: usuario.id,
        autor_correo: usuario.email,
        fotos: fotoUrls,
      };

      // Si existe 'idEdicion', actualiza; de lo contrario, inserta una nueva fila
      if (idEdicion) {
        const { error } = await supabase.from('mascotas').update(datos).eq('id', idEdicion);
        if (error) throw error;
        setFeedback({ tipo: 'exito', mensaje: '✅ ¡Cambios guardados correctamente!' });
      } else {
        const { error } = await supabase.from('mascotas').insert(datos);
        if (error) throw error;
        setFeedback({ tipo: 'exito', mensaje: '✅ ¡Publicación guardada correctamente!' });
        
        // Limpia el formulario tras el éxito
        setForm(FORM_INICIAL);
        setImages([null, null, null]);
      }
    } catch (err) {
      console.error('Error al publicar:', err);
      setFeedback({ tipo: 'error', mensaje: '❌ ' + (err.message || 'Error al guardar. Revisa tu conexión.') });
    } finally {
      setPublicando(false);
    }
  }

  // Muestra pantalla de carga mientras obtiene datos de edición
  if (cargandoInicial) {
    return <p style={{ textAlign: 'center', padding: '4rem 1rem' }}>Cargando publicación…</p>;
  }

  return (
    <div className="editor">
      {/* Encabezado */}
      <section className="container7">
        <div className="background43">
          <div className="background44"></div>
          <h1 className="heading-1">{idEdicion ? 'Editar Búsqueda' : 'Crea tu Búsqueda'}</h1>
        </div>
      </section>

      <main className="main-content">
        {/* Toggle para definir el estado: Buscando a mi mascota vs Encontré una mascota */}
        <section className="pet-info-panel3">
          <div className="tipo-de-busqueda">TIPO DE BÚSQUEDA</div>
          <div className="toggle-wrapper">
            <span className="opcion">Buscando</span>
            <label className="switch-container">
              <input type="checkbox" checked={form.estado} onChange={(e) => actualizarCampo('estado', e.target.checked)} />
              <span className="slider"></span>
            </label>
            <span className="opcion">
              Extraviado/
              <br /> Sin hogar
            </span>
          </div>
        </section>

        <div className="form-main-row2">
          {/* Lado izquierdo: Formularios básicos de la mascota */}
          <div className="left-pet-details">
            <div className="field-group">
              <label className="field-label" htmlFor="petName">
                NOMBRE:
              </label>
              <div className="input-box">
                <input
                  type="text"
                  id="petName"
                  placeholder="Nombre de la mascota"
                  autoComplete="off"
                  value={form.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)}
                />
              </div>
            </div>

            {/* Selectores de atributos (Mascota, Sexo, Tamaño, Edad) */}
            <div className="field-group">
              <label className="field-label" htmlFor="petType">TIPO DE MASCOTA:</label>
              <div className="input-box">
                <select id="petType" value={form.mascota} onChange={(e) => actualizarCampo('mascota', e.target.value)}>
                  <option value="">Seleccionar…</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="ave">Ave</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="petSex">SEXO:</label>
              <div className="input-box">
                <select id="petSex" value={form.sexo} onChange={(e) => actualizarCampo('sexo', e.target.value)}>
                  <option value="">Seleccionar…</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                  <option value="desconocido">Desconocido</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="petSize">TAMAÑO:</label>
              <div className="input-box">
                <select id="petSize" value={form.tamano} onChange={(e) => actualizarCampo('tamano', e.target.value)}>
                  <option value="">Seleccionar…</option>
                  <option value="pequeno">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="petAge">EDAD:</label>
              <div className="input-box">
                <select id="petAge" value={form.edad} onChange={(e) => actualizarCampo('edad', e.target.value)}>
                  <option value="">Seleccionar…</option>
                  <option value="cria">Cachorro</option>
                  <option value="adulto">Adulto</option>
                  <option value="senior">Senior</option>
                  <option value="desconocido">Desconocido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Componente externo encargado de gestionar la selección y previsualización de las imágenes */}
          <Gallery images={images} setImages={setImages} />

          {/* Lado derecho/Inferior: Detalles de Extravío y Contacto */}
          <section className="report-container">
            <h2 className="report-title">SECTOR DE EXTRAVÍO</h2>

            <div className="location-options">
              <h3 className="btn-location">ÚLTIMA UBICACIÓN DE AVISTAMIENTO</h3>

              {/* Autocompletado de dirección */}
              <div className="location-search-box">
                <label className="location-search-label" htmlFor="locationSearch">
                  Buscar ubicación
                </label>
                <input
                  id="locationSearch"
                  type="text"
                  className="location-search-input"
                  placeholder="Escribe la ubicación del avistamiento"
                  autoComplete="off"
                  value={form.ubicacion}
                  onChange={(e) => actualizarCampo('ubicacion', e.target.value)}
                />
              </div>

              {/* Feedback visual de la búsqueda en la API de Nominatim */}
              {cargandoUbicacion && <div className="location-suggestions-status">Buscando sugerencias…</div>}

              {/* Lista desplegable de resultados de la ubicación */}
              {!cargandoUbicacion && sugerenciasUbicacion.length > 0 && (
                <div className="location-suggestions" role="listbox" aria-label="Sugerencias de ubicación">
                  {sugerenciasUbicacion.map((sugerencia) => (
                    <button
                      key={sugerencia.id}
                      type="button"
                      className="location-suggestion"
                      onClick={() => actualizarCampo('ubicacion', sugerencia.label)}
                    >
                      {sugerencia.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="accordion">
                <div className="accordion-header">
                  <div className="accordion-info">📍 {form.ubicacion || 'Ubicación del avistamiento'}</div>
                </div>
              </div>
            </div>

            {/* Ficha de contacto */}
            <div className="contact-card">
              <div className="contact-header">
                <h3>📞 DATOS DE CONTACTO</h3>
              </div>
              <div className="accordion">
                <div className="accordion-header">
                  <input type="text" className="contact-name-input" placeholder="(nombre del contacto)" autoComplete="off" />
                </div>
              </div>
              <div className="input-group">
                <textarea
                  className="text-area"
                  placeholder="Escribe aquí tus datos de contacto…"
                  value={form.contacto}
                  onChange={(e) => actualizarCampo('contacto', e.target.value)}
                ></textarea>
                <button type="button" className="btn-save">
                  Guardar
                </button>
              </div>
            </div>

            {/* Botón final de envío. Bloqueado mientras guarda */}
            <button type="button" className="btn-publish" onClick={publicar} disabled={publicando}>
              {publicando ? 'Publicando…' : idEdicion ? 'GUARDAR CAMBIOS ' : 'PUBLICAR '}
            </button>

            {/* Renderizado de alertas (éxito, error, carga) */}
            {feedback && (
              <div
                style={{
                  marginTop: 12,
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  ...ESTILOS_FEEDBACK[feedback.tipo],
                }}
              >
                {feedback.mensaje}
              </div>
            )}

            {/* Advertencia si entró al formulario sin cuenta */}
            {!usuario && (
              <p className="auth-switch">
                Debes <Link to="/login">iniciar sesión</Link> para publicar.
              </p>
            )}
          </section>
        </div>

        {/* Sección inferior completa: Textarea de descripción */}
        <section className="description-section">
          <label htmlFor="pet-description" className="descripcion-label">
            DESCRIPCIÓN DE LA MASCOTA:
          </label>
          <textarea
            id="pet-description"
            className="input-descripcion"
            rows="5"
            placeholder="Ej: Color del pelaje, tamaño, si llevaba collar, dónde fue vista por última vez…"
            value={form.descripcion}
            onChange={(e) => actualizarCampo('descripcion', e.target.value)}
          ></textarea>
        </section>
      </main>
    </div>
  );
}