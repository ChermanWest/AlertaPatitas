import React from 'react';
import "../../editor1.css";

export default function FormularioReporte() {
  return (
    <div className="editor">
      <section className="container7">
        <div className="background43">
          <div className="background44"></div>
          <section className="header-header3">
            <div className="background45"></div>
            <div className="header-header-row-12">
              <div className="div23">🐾 Alerta Patitas</div>
              <nav className="nav-list3">
                <span>Inicio</span>
                <span>Acerca de nosotros</span>
                <span>Páginas ⌄</span>
              </nav>
            </div>
          </section>
          <h1 className="heading-1">Crea tu Búsqueda</h1>
        </div>
      </section>

      {/* ══ CONTENIDO PRINCIPAL ══ */}
      <main className="main-content">

        {/* Toggle tipo de búsqueda */}
        <section className="pet-info-panel3">
          <div className="tipo-de-busqueda">TIPO DE BÚSQUEDA</div>
          <div className="toggle-wrapper">
            <span className="opcion">Buscando</span>
            <label className="switch-container">
              <input type="checkbox" id="estado-mascota" />
              <span className="slider"></span>
            </label>
            <span className="opcion">Extraviado/<br /> Sin hogar</span>
          </div>
        </section>

        {/* ══ FILA PRINCIPAL: izquierda | centro | derecha ══ */}
        <div className="form-main-row2">

          {/* ── IZQUIERDA: datos de la mascota ── */}
          <div className="left-pet-details">
            <div className="field-group">
              <label className="field-label" htmlFor="petName">NOMBRE:</label>
              <div className="input-box">
                <input type="text" id="petName" placeholder="Nombre de la mascota" autoComplete="off" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="petType">TIPO DE MASCOTA:</label>
              <div className="input-box">
                <select id="petType">
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
                <select id="petSex">
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
                <select id="petSize">
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
                <select id="petAge">
                  <option value="">Seleccionar…</option>
                  <option value="cria">Cachorro</option>
                  <option value="adulto">Adulto</option>
                  <option value="senior">Senior</option>
                  <option value="desconocido">Desconocido</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── CENTRO: galería ── */}
          <section className="center-image-section" aria-label="Galería de fotos">
            <div className="gallery-main" id="galleryMain">
              <div className="gallery-placeholder-text" id="galleryPlaceholder">
                <span className="gallery-icon">🐾</span>
                <span>Sube una foto de tu mascota</span>
              </div>
              <div id="slidesContainer"></div>
              <button className="nav-btn nav-btn--prev" id="btnPrev" aria-label="Foto anterior">&#8592;</button>
              <button className="nav-btn nav-btn--next" id="btnNext" aria-label="Foto siguiente">&#8594;</button>
            </div>

            <div className="image-thumbnails" id="thumbnailsContainer">
              <label className="thumbnail-wrapper" id="thumb0" htmlFor="imageUpload" title="Subir foto 1">
                <div className="thumb-placeholder">
                  <span className="thumb-icon">📷</span>
                  <span>Foto 1</span>
                </div>
              </label>
              <label className="thumbnail-wrapper" id="thumb1" htmlFor="imageUpload" title="Subir foto 2">
                <div className="thumb-placeholder">
                  <span className="thumb-icon">📷</span>
                  <span>Foto 2</span>
                </div>
              </label>
              <label className="thumbnail-wrapper" id="thumb2" htmlFor="imageUpload" title="Subir foto 3">
                <div className="thumb-placeholder">
                  <span className="thumb-icon">📷</span>
                  <span>Foto 3</span>
                </div>
              </label>
            </div>

            <input type="file" id="imageUpload" accept="image/*" multiple />
          </section>

          {/* ── DERECHA: ubicación + contacto ── */}
          <section className="report-container">
            <h2 className="report-title">SECTOR DE EXTRAVÍO</h2>

            <div className="location-options">
              <button className="btn btn-location">
                📍 ÚLTIMA UBICACIÓN DE AVISTAMIENTO
              </button>
              <button className="btn btn-location">
                ✏️ INGRESAR DIRECCIÓN MANUALMENTE
              </button>
            </div>

            <div className="accordion">
              <div className="accordion-header">
                <div className="accordion-info">📍 11 de Septiembre (El Roble)</div>
                <span className="icon-chevron">⌄</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-header">
                <h3>📞 DATOS DE CONTACTO</h3>
              </div>
              <div className="accordion">
                <div className="accordion-header">
                  <input
                    type="text"
                    id="contactName"
                    className="contact-name-input"
                    placeholder="(nombre del contacto)"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="input-group">
                <textarea className="text-area" placeholder="Escribe aquí tus datos de contacto…"></textarea>
                <button className="btn-save">Guardar</button>
              </div>
            </div>

            <button className="btn btn-publish">PUBLICAR 🐾</button>
          </section>

        </div>

        {/* ══ DESCRIPCIÓN ══ */}
        <section className="description-section">
          <label htmlFor="pet-description" className="descripcion-label">DESCRIPCIÓN DE LA MASCOTA:</label>
          <textarea
            id="pet-description"
            className="input-descripcion"
            placeholder="Ej: Color del pelaje, tamaño, si llevaba collar, dónde fue vista por última vez…"
            rows="5"
          ></textarea>
        </section>

      </main>

      <footer className="background55"></footer>
    </div>
  );
}