// RUGE Style Medic: interacciones de la página

// 1. Menú móvil
const boton = document.querySelector('.burger');
const menu = document.getElementById('menu');

if (boton && menu) {
  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('open');
    boton.setAttribute('aria-expanded', String(abierto));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('open');
      boton.setAttribute('aria-expanded', 'false');
    }
  });
}

// 2. Botones de salto: llevan al modelo indicado en data-go
document.querySelectorAll('[data-go]').forEach((b) => {
  b.addEventListener('click', () => {
    document.getElementById(b.dataset.go)?.scrollIntoView({ behavior: 'smooth' });
  });
});

// 3. Carruseles: el botón avanza y vuelve al inicio al llegar al final
document.querySelectorAll('[data-car]').forEach((c) => {
  const pista = c.querySelector('.trk');
  c.querySelector('.nx')?.addEventListener('click', () => {
    const fin = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
    pista.scrollTo({ left: fin ? 0 : pista.scrollLeft + pista.clientWidth * 0.8, behavior: 'smooth' });
  });
});

// 4. Pestañas Mujer / Hombre
document.querySelectorAll('.tabs').forEach((tabs) => {
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]');
    if (!b) return;
    tabs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    tabs.closest('section').querySelectorAll('.gr').forEach((g) => { g.hidden = g.id !== b.dataset.tab; });
  });
});

// 5. Paleta de colores de los Scrubs Básicos para mujer
const buildProductInquiryUrl = (model, color, size) => {
  const sizeText = size ? `, talla ${size}` : '';
  const message = `Hola, me interesa el modelo ${model} en color ${color} para mujer${sizeText}`;
  return `https://wa.me/593992301635?text=${encodeURIComponent(message)}`;
};

document.querySelectorAll('[data-color-palette]').forEach((palette) => {
  const image = palette.querySelector('[data-color-preview]');
  const link = palette.querySelector('[data-color-link]');
  const sizeSelect = palette.querySelector('[data-size-select]');

  if (!image || !link || !sizeSelect) {
    throw new Error('La paleta de colores de los Scrubs Básicos está incompleta.');
  }

  let selectedModel;
  let selectedColor;
  const updateContactLink = () => {
    if (!selectedModel || !selectedColor) {
      throw new Error('No se pudo determinar el modelo y color seleccionados.');
    }
    link.href = buildProductInquiryUrl(selectedModel, selectedColor, sizeSelect.value);
  };
  const selectedButton = palette.querySelector('button[data-model][data-color][aria-pressed="true"]');
  if (!selectedButton) {
    throw new Error('La paleta necesita un color seleccionado inicialmente.');
  }
  selectedModel = selectedButton.dataset.model;
  selectedColor = selectedButton.dataset.color;
  updateContactLink();
  sizeSelect.addEventListener('change', updateContactLink);

  palette.querySelectorAll('button[data-model][data-color][data-image]').forEach((button) => {
    button.addEventListener('click', () => {
      const model = button.dataset.model;
      const color = button.dataset.color;
      const selectedImage = button.dataset.image;
      if (!model || !color || !selectedImage) {
        throw new Error('El modelo seleccionado no tiene todos sus datos configurados.');
      }

      image.src = selectedImage;
      image.alt = `${model} color ${color}`;
      selectedModel = model;
      selectedColor = color;
      updateContactLink();
      palette.querySelectorAll('button[data-model][data-color]').forEach((swatch) => {
        swatch.setAttribute('aria-pressed', String(swatch === button));
      });
    });
  });
});

// 6. Galerías de colecciones y selección de color
document.querySelectorAll('[data-photo-gallery]').forEach((gallery) => {
  const image = gallery.querySelector('[data-photo-image]');
  const video = gallery.querySelector('[data-photo-video]');
  const slideList = gallery.dataset.photoSlides;
  const galleryName = gallery.dataset.galleryName;
  let galleryColor = gallery.dataset.galleryColor;
  const dotsContainer = gallery.querySelector('.product-dots');
  const dots = gallery.querySelectorAll('[data-photo-dot]');
  const colorOptions = gallery.querySelectorAll('[data-gallery-color-option]');
  const contactLink = gallery.querySelector('[data-gallery-contact]');
  const sizeSelect = gallery.querySelector('[data-size-select]');

  if (!image || !slideList || !galleryName || !galleryColor || !dotsContainer || !contactLink || !sizeSelect) {
    throw new Error('La galería no tiene sus fotos, nombre, color, indicadores o consulta configurados.');
  }

  const parseSlides = (value) => {
    const parsedSlides = value ? value.split('|') : [];
    if (!parsedSlides.length || parsedSlides.some((slide) => !slide)) {
      throw new Error('La galería contiene una lista de fotos inválida.');
    }
    return parsedSlides;
  };
  let slides = parseSlides(slideList);
  const hasColorOptions = colorOptions.length > 0;
  if (dots.length < slides.length
      || (!hasColorOptions && (slides.length < 2 || dots.length !== slides.length))) {
    throw new Error('La galería necesita una foto y un indicador por cada posición.');
  }

  let current = 0;
  let intervalId = null;
  const isVideoSlide = (slide) => /\.(mp4|webm|ogg)(?:$|\?)/i.test(slide);
  const showSlide = (index) => {
    current = index;
    const slide = slides[current];
    if (isVideoSlide(slide) && video) {
      stopRotation();
      image.hidden = true;
      video.hidden = false;
      video.setAttribute('aria-label', `Video de ${galleryName} color ${galleryColor}`);
      if (video.dataset.src !== slide) {
        video.dataset.src = slide;
        video.src = slide;
        video.load();
      }
    } else {
      if (video) {
        video.pause();
        video.hidden = true;
      }
      image.hidden = false;
      image.src = slide;
      image.alt = `${galleryName} color ${galleryColor}, foto ${current + 1} de ${slides.length}`;
    }
    dots.forEach((dot, index) => {
      dot.hidden = index >= slides.length;
      dot.classList.toggle('is-active', index === current);
      dot.setAttribute('aria-pressed', String(index === current));
      dot.setAttribute('aria-label', `Mostrar foto ${index + 1} de ${slides.length}`);
    });
  };
  const advance = () => showSlide((current + 1) % slides.length);
  const stopRotation = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };
  const startRotation = () => {
    if (slides.length > 1 && !isVideoSlide(slides[current])) {
      intervalId = window.setInterval(advance, 2000);
    }
  };
  const updateContactLink = () => {
    contactLink.href = buildProductInquiryUrl(galleryName, galleryColor, sizeSelect.value);
  };
  sizeSelect.addEventListener('change', updateContactLink);
  const selectColor = (button) => {
    const color = button.dataset.color;
    const optionSlides = button.dataset.photoSlides;
    if (!color || !optionSlides) {
      throw new Error('El color seleccionado no tiene sus fotos configuradas.');
    }

    const nextSlides = parseSlides(optionSlides);
    if (nextSlides.length > dots.length) {
      throw new Error('El color seleccionado tiene más fotos que indicadores.');
    }

    stopRotation();
    slides = nextSlides;
    galleryColor = color;
    gallery.dataset.galleryColor = color;
    dotsContainer.hidden = slides.length === 1;
    colorOptions.forEach((option) => {
      option.setAttribute('aria-pressed', String(option === button));
    });
    showSlide(0);
    updateContactLink();
    startRotation();
  };

  if (colorOptions.length) {
    colorOptions.forEach((button) => {
      if (!button.dataset.color || !button.dataset.photoSlides) {
        throw new Error('Una opción de color no tiene sus fotos configuradas.');
      }
      const optionSlides = parseSlides(button.dataset.photoSlides);
      if (optionSlides.length > dots.length) {
        throw new Error('Una opción de color tiene más fotos que indicadores.');
      }
      button.addEventListener('click', () => selectColor(button));
    });

    const selectedColor = gallery.querySelector('[data-gallery-color-option][aria-pressed="true"]');
    if (!selectedColor) {
      throw new Error('La galería necesita un color seleccionado inicialmente.');
    }
    selectColor(selectedColor);
  } else {
    showSlide(0);
    startRotation();
    updateContactLink();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (index >= slides.length) return;
      showSlide(index);
      stopRotation();
      startRotation();
    });
  });
});
