import { useState } from 'react';

/**
 * Sube hasta 3 fotos y permite navegar entre ellas antes de publicar.
 * `images` es un array de longitud 3: cada casilla es `null` o
 * `{ url, file }` (url = object URL local para la vista previa,
 * file = File original que luego se sube a Supabase Storage).
 *
 * Nota: script-galeria.js (no estaba enlazado desde ningún .html)
 * y la galería embebida en editor.js hacían básicamente lo mismo;
 * quedaron unificadas en este único componente.
 */
export default function Gallery({ images, setImages }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const filledIndexes = images.map((img, i) => (img ? i : null)).filter((i) => i !== null);
  const hayImagenes = filledIndexes.length > 0;

  function handleUpload(e) {
    const files = Array.from(e.target.files).slice(0, 3);
    if (!files.length) return;

    setImages((prev) => {
      const next = [...prev];
      let primerSlotNuevo = null;
      files.forEach((file) => {
        const slot = next.findIndex((v) => v === null);
        if (slot === -1) return;
        next[slot] = { url: URL.createObjectURL(file), file };
        if (primerSlotNuevo === null) primerSlotNuevo = slot;
      });
      if (primerSlotNuevo !== null) setCurrentIndex(primerSlotNuevo);
      return next;
    });

    e.target.value = '';
  }

  function showSlide(i) {
    setCurrentIndex(i);
  }

  function prev() {
    if (filledIndexes.length < 2) return;
    const pos = filledIndexes.indexOf(currentIndex);
    setCurrentIndex(filledIndexes[(pos - 1 + filledIndexes.length) % filledIndexes.length]);
  }

  function next() {
    if (filledIndexes.length < 2) return;
    const pos = filledIndexes.indexOf(currentIndex);
    setCurrentIndex(filledIndexes[(pos + 1) % filledIndexes.length]);
  }

  return (
    <section className="center-image-section" aria-label="Galería de fotos">
      <div className="gallery-main" id="galleryMain">
        {!hayImagenes && (
          <div className="gallery-placeholder-text" id="galleryPlaceholder">
            <span className="gallery-icon">🐾</span>
            <span>Sube una foto de tu mascota</span>
          </div>
        )}

        <div id="slidesContainer">
          {images.map(
            (img, i) =>
              img && (
                <div key={i} className={`slide${i === currentIndex ? ' active' : ''}`} data-index={i}>
                  <img src={img.url} alt={`Foto ${i + 1}`} />
                </div>
              )
          )}
        </div>

        {filledIndexes.length > 1 && (
          <>
            <button type="button" className="nav-btn nav-btn--prev" onClick={prev} aria-label="Foto anterior">
              &#8592;
            </button>
            <button type="button" className="nav-btn nav-btn--next" onClick={next} aria-label="Foto siguiente">
              &#8594;
            </button>
          </>
        )}
      </div>

      <div className="image-thumbnails" id="thumbnailsContainer">
        {[0, 1, 2].map((i) => (
          <label
            key={i}
            className={`thumbnail-wrapper${i === currentIndex && images[i] ? ' active' : ''}`}
            id={`thumb${i}`}
            htmlFor="imageUpload"
            title={`Subir foto ${i + 1}`}
            onClick={(e) => {
              if (images[i]) {
                e.preventDefault();
                showSlide(i);
              }
            }}
          >
            {images[i] ? (
              <img src={images[i].url} alt={`Foto ${i + 1}`} />
            ) : (
              <div className="thumb-placeholder">
                <span className="thumb-icon">📷</span>
                <span>Foto {i + 1}</span>
              </div>
            )}
          </label>
        ))}
      </div>

      <input type="file" id="imageUpload" accept="image/*" multiple onChange={handleUpload} />
    </section>
  );
}
