(() => {
  const progress = document.getElementById('reading-progress');
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const fullscreenButton = document.getElementById('fullscreen-button');
  const fullscreenLabel = document.getElementById('fullscreen-label');
  const sections = [...document.querySelectorAll('.section-anchor')];

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    header.classList.toggle('has-scrolled', window.scrollY > 15);
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
    mainNav.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  }

  async function toggleFullscreen() {
    const isPresentation = document.body.classList.contains('presentation-mode');
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        document.body.classList.remove('presentation-mode');
      } else if (isPresentation) {
        document.body.classList.remove('presentation-mode');
      } else {
        if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
        document.body.classList.add('presentation-mode');
      }
    } catch (error) {
      // Keep a usable presentation layout even when the browser blocks fullscreen.
      document.body.classList.toggle('presentation-mode', !isPresentation);
    }
    syncFullscreenLabel();
  }

  function syncFullscreenLabel() {
    const isActive = Boolean(document.fullscreenElement) || document.body.classList.contains('presentation-mode');
    fullscreenLabel.textContent = isActive ? 'Salir' : 'Presentar';
    fullscreenButton.setAttribute('aria-pressed', String(isActive));
    fullscreenButton.setAttribute('aria-label', isActive ? 'Salir del modo de presentación' : 'Activar modo de presentación');
    document.body.classList.toggle('presentation-mode', isActive);
  }

  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) document.body.classList.remove('presentation-mode');
    syncFullscreenLabel();
  });



  // Copiar el prompt de demostración MCP para ejecutarlo desde ProjectManager.
  const copyPromptButton = document.getElementById('copy-email-prompt');
  const emailPrompt = document.getElementById('email-agent-prompt');
  const copyFeedback = document.getElementById('copy-feedback');

  if (copyPromptButton && emailPrompt && copyFeedback) {
    copyPromptButton.addEventListener('click', async () => {
      const promptText = emailPrompt.textContent.trim();
      try {
        await navigator.clipboard.writeText(promptText);
        copyPromptButton.innerHTML = '<span aria-hidden="true">✓</span> Prompt copiado';
        copyFeedback.textContent = 'Prompt copiado.';
      } catch (error) {
        const temporaryField = document.createElement('textarea');
        temporaryField.value = promptText;
        temporaryField.setAttribute('readonly', '');
        temporaryField.style.position = 'absolute';
        temporaryField.style.left = '-9999px';
        document.body.appendChild(temporaryField);
        temporaryField.select();
        const copied = document.execCommand('copy');
        temporaryField.remove();
        if (copied) {
          copyPromptButton.innerHTML = '<span aria-hidden="true">✓</span> Prompt copiado';
          copyFeedback.textContent = 'Prompt copiado.';
        } else {
          copyFeedback.textContent = 'No se pudo copiar automáticamente. Selecciona y copia el texto del prompt.';
        }
      }
    });
  }

  // ESC closes the mobile menu when fullscreen is not active.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    }
  });
})();
