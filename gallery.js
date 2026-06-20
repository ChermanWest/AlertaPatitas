(function () {
  const slides     = Array.from(document.querySelectorAll('.slide'));
  const thumbnails = Array.from(document.querySelectorAll('.thumbnail'));
  const btnPrev    = document.getElementById('btnPrev');
  const btnNext    = document.getElementById('btnNext');

  let current  = 0;
  let animating = false;

  function goTo(index, direction) {
    if (animating || index === current) return;
    animating = true;

    const outSlide = slides[current];
    const inSlide  = slides[index];

    // Prepara la entrada del slide entrante (fuera de pantalla)
    inSlide.classList.remove('active', 'exit-right', 'exit-left', 'enter-from-left');
    if (direction === 'prev') {
      inSlide.classList.add('enter-from-left');
    } else {
      inSlide.style.transform = 'translateX(60px)';
    }
    inSlide.style.opacity = '0';

    // Pequeño delay para que el navegador pinte el estado inicial
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // Salida del slide actual
        outSlide.classList.remove('active');
        outSlide.classList.add(direction === 'prev' ? 'exit-right' : 'exit-left');

        // Entrada del nuevo slide
        inSlide.style.transform = '';
        inSlide.style.opacity   = '';
        inSlide.classList.remove('enter-from-left');
        inSlide.classList.add('active');

        // Actualiza miniatura activa
        thumbnails[current].classList.remove('active');
        thumbnails[index].classList.add('active');

        current = index;

        // Limpia clases de salida al terminar la transición
        outSlide.addEventListener('transitionend', () => {
          outSlide.classList.remove('exit-right', 'exit-left');
          animating = false;
        }, { once: true });
      });
    });
  }

  // Navegación: botones
  btnPrev.addEventListener('click', () => {
    const prev = (current - 1 + slides.length) % slides.length;
    goTo(prev, 'prev');
  });

  btnNext.addEventListener('click', () => {
    const next = (current + 1) % slides.length;
    goTo(next, 'next');
  });

  // Navegación: miniaturas
  thumbnails.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      const dir = i > current ? 'next' : 'prev';
      goTo(i, dir);
    });
  });

})();