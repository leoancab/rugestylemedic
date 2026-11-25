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

// 5. Opciones de color para las colecciones
const whatsappCities = [
  ['Portoviejo', '593998395769'],
  ['Manta', '593985265038'],
  ['Guayaquil', '593985770816'],
];

const buildProductInquiryUrl = (model, color, size, audience = 'mujer') => {
  const sizeText = size ? `, talla ${size}` : '';
  const message = `Hola, me interesa el modelo ${model} en color ${color} para ${audience}${sizeText}`;
  return `https://wa.me/593992301635?text=${encodeURIComponent(message)}`;
};

const buildCityProductInquiryActions = (templateLink) => {
  const container = document.createElement('div');
  container.className = 'city-whatsapp-actions';
  const links = whatsappCities.map(([city, phone]) => {
    const link = document.createElement('a');
    link.className = 'btn';
    link.dataset.city = city;
    link.dataset.phone = phone;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = `Consultar en ${city}`;
    link.setAttribute('aria-label', `Consultar por WhatsApp en ${city}`);
    container.appendChild(link);
    return link;
  });
  templateLink.replaceWith(container);

  return (buildUrl) => {
    links.forEach((link) => {
      link.href = buildUrl(link.dataset.city, link.dataset.phone);
    });
  };
};

const floatingWhatsApp = document.querySelector('.wa');
if (floatingWhatsApp) {
  const picker = document.createElement('div');
  picker.className = 'wa-city-picker';
  picker.id = 'wa-city-picker';
  picker.setAttribute('role', 'dialog');
  picker.setAttribute('aria-label', 'Elige una sucursal de WhatsApp');
  picker.hidden = true;

  const title = document.createElement('p');
  title.textContent = 'Escríbenos a tu sucursal';
  picker.appendChild(title);

  whatsappCities.forEach(([city, phone]) => {
    const link = document.createElement('a');
    link.className = 'wa-city-option';
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(`Hola RUGE Style Medic, quiero comunicarme con la sucursal de ${city}`)}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = city;
    link.setAttribute('aria-label', `Escribir por WhatsApp a la sucursal de ${city}`);
    picker.appendChild(link);
  });

  document.body.appendChild(picker);
  floatingWhatsApp.setAttribute('aria-controls', picker.id);
  floatingWhatsApp.setAttribute('aria-expanded', 'false');
  floatingWhatsApp.setAttribute('aria-label', 'Elegir sucursal para escribir por WhatsApp');
  floatingWhatsApp.addEventListener('click', (event) => {
    event.preventDefault();
    picker.hidden = !picker.hidden;
    floatingWhatsApp.setAttribute('aria-expanded', String(!picker.hidden));
  });

  document.addEventListener('click', (event) => {
    if (!picker.contains(event.target) && !floatingWhatsApp.contains(event.target)) {
      picker.hidden = true;
      floatingWhatsApp.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !picker.hidden) {
      picker.hidden = true;
      floatingWhatsApp.setAttribute('aria-expanded', 'false');
      floatingWhatsApp.focus();
    }
  });
}

const availableColors = [
  ['Morado', '#7a2e8e'],
  ['Morado profundo', '#4b145b'],
  ['Vino', '#7a1e3a'],
  ['Vino oscuro', '#4a1026'],
  ['Gris claro', '#d9d9d9'],
  ['Beige grisaceo', '#b8aa9a'],
  ['Beige', '#d8c3a5'],
  ['Beige suave', '#e8dccb'],
  ['Kaki', '#a8996e'],
  ['Arena', '#c2a878'],
  ['Terracota', '#b65a3c'],
  ['Terracota suave', '#d08a70'],
  ['Coral', '#f26b5b'],
  ['Coral pastel', '#f5a29a'],
  ['Pardo', '#765341'],
  ['Amarillo Pastel', '#f4e79a'],
  ['Pistacho', '#b7d18b'],
  ['Miel', '#d9a441'],
  ['Rojo', '#d8262f'],
  ['Naranja', '#ef7c24'],
  ['Negro', '#111111'],
  ['Blanco', '#ffffff'],
  ['Mostaza', '#c89b19'],
  ['Celeste cielo', '#89cff0'],
  ['Azul marino', '#183153'],
  ['Azul intenso', '#163b8c'],
  ['Azul royal', '#4169e1'],
  ['Azul electrico', '#1464f4'],
  ['Turquesa', '#38bfc1'],
  ['Turquesa oscura', '#007c78'],
  ['Verde petroleo', '#135b58'],
  ['Verde hoja', '#4e9a51'],
  ['Verde militar', '#4b5631'],
  ['Lila claro', '#c8a2c8'],
  ['Menta pastel', '#a8dcc8'],
  ['Celeste menta', '#a5dde0'],
  ['Rosa pastel', '#f2b8c6'],
  ['Rosa', '#e783a2'],
  ['Rosa yoga', '#d8a5b5'],
  ['Fucsia', '#d81b75'],
  ['Palo de rosa claro', '#d8a1a7'],
];

const normalizeColor = (color) => color
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('es');

document.querySelectorAll('[data-color-selector]').forEach((container) => {
  const existingButtons = [...container.querySelectorAll('button[data-color]')];
  const existingByColor = new Map(existingButtons.map((button) => [normalizeColor(button.dataset.color), button]));
  const model = existingButtons.find((button) => button.dataset.model)?.dataset.model;
  const requestedNames = new Set(availableColors.map(([name]) => normalizeColor(name)));
  const legacyColors = existingButtons
    .filter((button) => !requestedNames.has(normalizeColor(button.dataset.color)))
    .map((button) => [button.dataset.color, button.style.getPropertyValue('--swatch-color') || '#808080']);
  const orderedColors = [...availableColors, ...legacyColors];
  const selectedColor = existingButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.color;

  container.replaceChildren(...orderedColors.map(([name, swatchColor]) => {
    const button = existingByColor.get(normalizeColor(name)) || document.createElement('button');
    button.type = 'button';
    button.dataset.color = name;
    if (model) button.dataset.model = model;
    if (container.closest('[data-color-palette]')) {
      button.dataset.model = button.dataset.model || container.closest('[data-color-palette]').dataset.model || 'Scrub Básico';
    } else {
      button.dataset.galleryColorOption = '';
    }
    button.style.setProperty('--swatch-color', swatchColor);
    button.setAttribute('aria-pressed', String(normalizeColor(name) === normalizeColor(selectedColor || '')));
    button.replaceChildren();
    const swatch = document.createElement('span');
    swatch.setAttribute('aria-hidden', 'true');
    button.append(swatch, document.createTextNode(name));
    return button;
  }));
});

document.querySelectorAll('[data-color-palette]').forEach((palette) => {
  const image = palette.querySelector('[data-color-preview]');
  const link = palette.querySelector('[data-color-link]');
  const sizeSelect = palette.querySelector('[data-size-select]');

  if (!image || !link || !sizeSelect) {
    throw new Error('La paleta de colores de los Scrubs Básicos está incompleta.');
  }

  const updateCityActions = document.querySelector('#view-mujer, #view-hombre, #view-damas')
    ? buildCityProductInquiryActions(link)
    : null;

  let selectedModel;
  let selectedColor;
  const updateContactLink = () => {
    if (!selectedModel || !selectedColor) {
      throw new Error('No se pudo determinar el modelo y color seleccionados.');
    }
    if (updateCityActions) {
      updateCityActions((city, phone) => {
        const sizeText = sizeSelect.value ? `, talla ${sizeSelect.value}` : '';
        const message = `Hola RUGE, quiero consultar el modelo ${selectedModel} en color ${selectedColor} para mujer${sizeText}`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      });
    } else {
      link.href = buildProductInquiryUrl(selectedModel, selectedColor, sizeSelect.value);
    }
  };
  const selectedButton = palette.querySelector('button[data-model][data-color][aria-pressed="true"]');
  if (!selectedButton) {
    throw new Error('La paleta necesita un color seleccionado inicialmente.');
  }
  selectedModel = selectedButton.dataset.model;
  selectedColor = selectedButton.dataset.color;
  updateContactLink();
  sizeSelect.addEventListener('change', updateContactLink);

  palette.querySelectorAll('button[data-model][data-color]').forEach((button) => {
    button.addEventListener('click', () => {
      const model = button.dataset.model;
      const color = button.dataset.color;
      const selectedImage = button.dataset.image;
      if (!model || !color) {
        throw new Error('El modelo seleccionado no tiene todos sus datos configurados.');
      }

      if (selectedImage) {
        image.src = selectedImage;
        image.alt = `${model} color ${color}`;
      }
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

  const updateCityActions = document.querySelector('#view-mujer, #view-hombre, #view-damas')
    ? buildCityProductInquiryActions(contactLink)
    : null;

  const parseSlides = (value) => {
    const parsedSlides = value ? value.split('|') : [];
    if (!parsedSlides.length || parsedSlides.some((slide) => !slide)) {
      throw new Error('La galería contiene una lista de fotos inválida.');
    }
    return parsedSlides;
  };
  const defaultSlides = parseSlides(slideList);
  let slides = defaultSlides;
  const hasColorOptions = colorOptions.length > 0;
  if (dots.length < slides.length
    || (!hasColorOptions && slides.length > 1 && dots.length !== slides.length)) {
    throw new Error('La galería necesita una foto y un indicador por cada posición.');
  }

  let current = 0;
  let intervalId = null;
  let isGalleryVisible = false;
  let isVideoManuallyPaused = false;

  const isVideoSlide = (slide) => /\.(mp4|webm|ogg)(?:$|\?)/i.test(slide);
  const syncVideoPlayback = () => {
    if (!video || video.hidden) return;
    if (isGalleryVisible && !isVideoManuallyPaused) {
      if (video.readyState >= 2) {
        void video.play().catch(() => { });
      } else {
        video.addEventListener('canplay', () => {
          if (isGalleryVisible && !isVideoManuallyPaused) {
            void video.play().catch(() => { });
          }
        }, { once: true });
      }
    } else {
      video.pause();
    }
  };
  const showSlide = (index) => {
    current = index;
    const slide = slides[current];
    if (isVideoSlide(slide) && video) {
      stopRotation();
      image.hidden = true;
      video.hidden = false;
      isVideoManuallyPaused = false;
      video.setAttribute('aria-label', `Video de ${galleryName} color ${galleryColor}`);
      if (video.dataset.src !== slide) {
        video.dataset.src = slide;
        video.src = slide;
        video.load();
      }
      syncVideoPlayback();
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
  if (video) {
    video.addEventListener('ended', () => {
      if (!isVideoSlide(slides[current])) return;
      video.currentTime = 0;
      showSlide(0);
      startRotation();
    });
  }
  const updateContactLink = () => {
    const audience = gallery.dataset.galleryAudience || 'mujer';
    if (updateCityActions) {
      updateCityActions((city, phone) => {
        const sizeText = sizeSelect.value ? `, talla ${sizeSelect.value}` : '';
        const message = `Hola RUGE, quiero consultar la colección ${galleryName} en color ${galleryColor} para ${audience}${sizeText}`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      });
    } else {
      contactLink.href = buildProductInquiryUrl(galleryName, galleryColor, sizeSelect.value, audience);
    }
  };
  sizeSelect.addEventListener('change', updateContactLink);
  const selectColor = (button) => {
    const color = button.dataset.color;
    const optionSlides = button.dataset.photoSlides;
    if (!color) {
      throw new Error('El color seleccionado no tiene su nombre configurado.');
    }

    const nextSlides = optionSlides ? parseSlides(optionSlides) : defaultSlides;
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
      if (!button.dataset.color) {
        throw new Error('Una opción de color no tiene su nombre configurado.');
      }
      if (button.dataset.photoSlides) {
        const optionSlides = parseSlides(button.dataset.photoSlides);
        if (optionSlides.length > dots.length) {
          throw new Error('Una opción de color tiene más fotos que indicadores.');
        }
      }
      button.addEventListener('click', () => selectColor(button));
    });

    const selectedColor = gallery.querySelector('[data-gallery-color-option][aria-pressed="true"]');
    if (!selectedColor) {
      throw new Error('La galería necesita un color seleccionado inicialmente.');
    }
    selectColor(selectedColor);
  } else {
    dotsContainer.hidden = slides.length === 1;
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

  if (video && 'IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target !== gallery) return;
        isGalleryVisible = entry.isIntersecting;
        syncVideoPlayback();
      });
    }, { threshold: 0.25 });
    visibilityObserver.observe(gallery);
  } else {
    isGalleryVisible = true;
  }
});
