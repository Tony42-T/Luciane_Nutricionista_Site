/* ================================
   main.js — Interatividade do site
   ================================ */

// --- MENU MOBILE ---
    (function () {
      const btn = document.getElementById('btn-mobile');
      const menu = document.getElementById('nav-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function () {
        // alterna exibição do menu no mobile
        menu.classList.toggle('hidden');
      });
    })();

const btnMobile = document.getElementById('btn-mobile');
const navMenu = document.getElementById('nav-menu');

if (btnMobile && navMenu) {
  btnMobile.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    btnMobile.classList.toggle('active');
  });

  // Fecha o menu ao clicar em um link
  const links = navMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      btnMobile.classList.remove('active');
    });
  });
}

// --- SCROLL SUAVE ---
const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70, // compensa altura do header
        behavior: 'smooth'
      });
    }
  });
});

// --- ANIMAÇÃO SIMPLES AO ROLAR ---
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const revealTop = el.getBoundingClientRect().top;
    if (revealTop < windowHeight - 100) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
