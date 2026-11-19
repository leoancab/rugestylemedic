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
