/* ============================================================
   ALERTA PATITAS — Editor.jsx (crear / editar publicación)
   ============================================================ */

import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Gallery from '../components/Gallery';

const ESTILOS_FEEDBACK = {
  error: { background: '#fdecea', color: '#c0392b', border: '1px solid #f5c6c6' },
  exito: { background: '#eafaf1', color: '#1e8449', border: '1px solid #a9dfbf' },
  cargando: { background: '#fef9e7', color: '#7d6608', border: '1px solid #f9e79f' },
};

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
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idEdicion = searchParams.get('id');

  const [form, setForm] = useState(FORM_INICIAL);
  const [sugerenciasUbicacion, setSugerenciasUbicacion] = useState([]);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [images, setImages] = useState([null, null, null]);
  const [publicacionOriginal, setPublicacionOriginal] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const [publicando, setPublicando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(Boolean(idEdicion));

  const cargarParaEditar = useCallback(async () => {
    if (!idEdicion) return;

    if (!usuario) {
      navigate('/login');
      return;
    }

    try {
      const respuesta = await fetch(`http://127.0.0.1:8000/api/mascotas/${idEdicion}/`);

      if (!respuesta.ok) {
        setFeedback({ tipo: 'error', mensaje: 'No se encontró la publicación que intentas editar.' });
        return;
      }

      const data = await respuesta.json();

      if (data.autor_id !== usuario.id) {
        setFeedback({ tipo: 'error', mensaje: 'No tienes permiso para editar esta publicación.' });
        setTimeout(() => navigate('/'), 1800);
        return;
      }

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

  useEffect(() => {
    cargarParaEditar();
  }, [cargarParaEditar]);

  useEffect(() => {
    const consulta = form.ubicacion.trim();

    if (!consulta) {
      setSugerenciasUbicacion([]);
      setCargandoUbicacion(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setCargandoUbicacion(true);
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
          }))
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

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

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

  async function subirFotos() {
    const archivos = images.filter(Boolean);
    const urls = [];

    for (let i = 0; i < archivos.length; i++) {
      const { file } = archivos[i];
      const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
      const path = `${usuario.id}/${form.nombre.replace(/\s+/g, '_')}_${Date.now()}_${i}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('fotos-mascotas').upload(path, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('fotos-mascotas').getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function publicar() {
    setFeedback(null);

    if (!usuario) {
      setFeedback({ tipo: 'error', mensaje: 'Debes iniciar sesión para publicar.' });
      return;
    }

    const errores = validar();
    if (errores.length > 0) {
      setFeedback({ tipo: 'error', mensaje: '⚠️ ' + errores[0] });
      return;
    }

    setPublicando(true);

    try {
      let fotoUrls = publicacionOriginal?.fotos || [];

      if (images.some(Boolean)) {
        setFeedback({ tipo: 'cargando', mensaje: '🖼️ Subiendo imágenes…' });
        fotoUrls = await subirFotos();
      }

      setFeedback({ tipo: 'cargando', mensaje: idEdicion ? '⏳ Guardando cambios…' : '⏳ Guardando publicación…' });

      const datos = {
        nombre: form.nombre.trim(),
        mascota: form.mascota,
        sexo: form.sexo,
        tamano: form.tamano,
        edad: form.edad,
        estado: form.estado ? 'perdido' : 'buscando',
        zona: form.ubicacion.trim(), 
        descripcion: form.descripcion.trim(),
        contacto: form.contacto.trim(),
        autor_id: usuario.id,
        autor_correo: usuario.email,
        fotos: fotoUrls,
      };

      let urlApi = 'http://127.0.0.1:8000/api/mascotas/';
      let metodo = 'POST';

      if (idEdicion) {
        urlApi = `http://127.0.0.1:8000/api/mascotas/${idEdicion}/`;
        metodo = 'PUT';
      }

      const resBackend = await fetch(urlApi, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!resBackend.ok) {
        throw new Error(`Error en el servidor de Django (Status: ${resBackend.status})`);
      }

      if (idEdicion) {
        setFeedback({ tipo: 'exito', mensaje: '✅ ¡Cambios guardados correctamente!' });
      } else {
        setFeedback({ tipo: 'exito', mensaje: '✅ ¡Publicación guardada correctamente!' });
        setForm(FORM_INICIAL);
        setImages([null, null, null]);
      }

      setTimeout(() => navigate('/'), 1000);

    } catch (err) {
      console.error('Error al publicar:', err);
      setFeedback({ tipo: 'error', mensaje: '❌ ' + (err.message || 'Error al guardar. Revisa tu conexión.') });
    } finally {
      setPublicando(false);
    }
  }

  if (cargandoInicial) {
    return <p style={{ textAlign: 'center', padding: '4rem 1rem' }}>Cargando publicación…</p>;
  }

  return (
    <div className="editor">
      <section className="container7">
        <div className="background43">
          <div className="background44"></div>
          <h1 className="heading-1">{idEdicion ? 'Editar Búsqueda' : 'Crea tu Búsqueda'}</h1>
        </div>
      </section>

      <main className="main-content">
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

            <div className="field-group">
              <label className="field-label" htmlFor="petType">
                TIPO DE MASCOTA:
              </label>
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
              <label className="field-label" htmlFor="petSex">
                SEXO:
              </label>
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
              <label className="field-label" htmlFor="petSize">
                TAMAÑO:
              </label>
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
              <label className="field-label" htmlFor="petAge">
                EDAD:
              </label>
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

          <Gallery images={images} setImages={setImages} />

          <section className="report-container">
            <h2 className="report-title">SECTOR DE EXTRAVÍO</h2>

            <div className="location-options">
              <h3 className="btn-location">ÚLTIMA UBICACIÓN DE AVISTAMIENTO</h3>

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

              {cargandoUbicacion && <div className="location-suggestions-status">Buscando sugerencias…</div>}

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

            <button type="button" className="btn-publish" onClick={publicar} disabled={publicando}>
              {publicando ? 'Publicando…' : idEdicion ? 'GUARDAR CAMBIOS ' : 'PUBLICAR '}
            </button>

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

            {!usuario && (
              <p className="auth-switch">
                Debes <Link to="/login">iniciar sesión</Link> para publicar.
              </p>
            )}
          </section>
        </div>

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