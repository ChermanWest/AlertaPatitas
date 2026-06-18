document.addEventListener("DOMContentLoaded", () => {
  // 1. Lista inicial de imágenes (Placeholders por defecto de tu proyecto)
  let galleryImages = [
    "./public/Background1@3x.png",
    "./public/merged-asset-1@2x.png",
    "./public/Thumbnail-Pair@2x.png",
    "./public/Thumbnail-Pair@2x.png"
  ];

  // Índice de la imagen que se está mostrando actualmente como principal
  let currentIndex = 0;

  // Elementos del DOM
  const mainContainer = document.getElementById("main-image-container");
  const thumbnailsContainer = document.getElementById("thumbnails-container");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const fileUpload = document.getElementById("file-upload");

  // 2. Función para animar y actualizar la galería
  function updateGallery() {
    if (galleryImages.length === 0) return;

    // Web Animations API: Animación de transición (desvanecimiento y ligero zoom)
    mainContainer.animate([
      { opacity: 0.6, transform: "scale(0.98)" },
      { opacity: 1, transform: "scale(1)" }
    ], {
      duration: 250,
      easing: "ease-out"
    });

    // Cambiar la imagen de fondo principal
    mainContainer.style.backgroundImage = `url('${galleryImages[currentIndex]}')`;

    // Limpiar y renderizar las miniaturas (excluyendo la principal actual)
    thumbnailsContainer.innerHTML = "";
    galleryImages.forEach((imgUrl, index) => {
      if (index !== currentIndex) {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.className = "thumb-img";
        img.alt = "Miniatura de mascota";
        
        // Al hacer clic en una miniatura, esta se convierte en la principal
        img.addEventListener("click", () => {
          currentIndex = index;
          updateGallery();
        });
        
        thumbnailsContainer.appendChild(img);
      }
    });
  }

  // 3. Eventos para los botones de las flechas
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita conflictos de clicks
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateGallery();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGallery();
  });

  // 4. Lógica para subir nuevas imágenes
  fileUpload.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Crear una URL temporal local de la imagen subida
        const newImageUrl = URL.createObjectURL(file);
        galleryImages.push(newImageUrl);
      }
      // Al subir nuevas fotos, fijamos la última subida como la principal
      currentIndex = galleryImages.length - 1;
      updateGallery();
    }
  });

  // Inicializar la galería por primera vez
  updateGallery();
});