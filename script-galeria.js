document.addEventListener("DOMContentLoaded", () => {
  const slidesContainer = document.getElementById("slidesContainer");
  const thumbnailsContainer = document.getElementById("thumbnailsContainer");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const imageUpload = document.getElementById("imageUpload");

  let currentIndex = 0;

  // Función para actualizar la vista (imágenes y miniaturas)
  function updateGallery() {
    const slides = document.querySelectorAll(".slide");
    const thumbnails = document.querySelectorAll(".thumbnail-wrapper:not(.upload-btn)");

    // Ocultar todas las imágenes y desactivar miniaturas
    slides.forEach((slide, index) => {
      slide.classList.remove("active");
      if (thumbnails[index]) thumbnails[index].classList.remove("active");
    });

    // Mostrar la imagen actual
    if (slides[currentIndex]) {
      slides[currentIndex].classList.add("active");
      if (thumbnails[currentIndex]) thumbnails[currentIndex].classList.add("active");
    }
  }

  // Eventos de flechas de navegación
  btnNext.addEventListener("click", () => {
    const totalSlides = document.querySelectorAll(".slide").length;
    if (totalSlides > 0) {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateGallery();
    }
  });

  btnPrev.addEventListener("click", () => {
    const totalSlides = document.querySelectorAll(".slide").length;
    if (totalSlides > 0) {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateGallery();
    }
  });

  // Delegación de eventos para las miniaturas (por si se agregan dinámicamente)
  thumbnailsContainer.addEventListener("click", (e) => {
    const thumbnail = e.target.closest(".thumbnail-wrapper:not(.upload-btn)");
    if (thumbnail) {
      currentIndex = parseInt(thumbnail.getAttribute("data-index"));
      updateGallery();
    }
  });

  // Lógica para SUBIR IMÁGENES
  imageUpload.addEventListener("change", function(event) {
    const files = event.target.files;
    if (!files.length) return;

    Array.from(files).forEach(file => {
      // Usamos FileReader para mostrar la imagen sin necesidad de un servidor
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const newImageUrl = e.target.result;
        const totalSlides = document.querySelectorAll(".slide").length;

        // 1. Crear nuevo Slide (Imagen principal)
        const newSlide = document.createElement("div");
        newSlide.className = "slide";
        newSlide.setAttribute("data-index", totalSlides);
        newSlide.innerHTML = `<img src="${newImageUrl}" alt="Imagen subida ${totalSlides + 1}" />`;
        slidesContainer.appendChild(newSlide);

        // 2. Crear nueva Miniatura
        const newThumbnail = document.createElement("div");
        newThumbnail.className = "thumbnail-wrapper";
        newThumbnail.setAttribute("data-index", totalSlides);
        newThumbnail.innerHTML = `<img src="${newImageUrl}" alt="Miniatura ${totalSlides + 1}" />`;
        
        // Insertar la nueva miniatura antes del primer botón de subida
        const firstUploadBtn = document.querySelector(".upload-btn");
        thumbnailsContainer.insertBefore(newThumbnail, firstUploadBtn);

        // 3. Opcional: Ocultar un botón de subida si ya llegamos a 3 imágenes
        if (document.querySelectorAll(".thumbnail-wrapper:not(.upload-btn)").length >= 3) {
           if(firstUploadBtn) firstUploadBtn.style.display = 'none';
        }

        // 4. Cambiar la vista a la nueva imagen recién subida
        currentIndex = totalSlides;
        updateGallery();
      };

      reader.readAsDataURL(file);
    });
    
    // Resetear el input para permitir subir la misma imagen dos veces si se desea
    imageUpload.value = ""; 
  });
});