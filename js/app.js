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
