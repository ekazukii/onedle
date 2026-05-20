(function () {
  const THEMES = [
    { id: 'grand-line', label: 'Grand Line' },
    { id: 'dark-pirate', label: 'Dark Pirate' },
    { id: 'marine', label: 'Marine' }
  ];
  const STORAGE_KEY = 'onedle-theme';

  function applyTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.setAttribute('data-active', String(dot.getAttribute('data-theme-id') === id));
    });
  }

  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some(t => t.id === stored)) return stored;
    return 'grand-line';
  }

  function setTheme(id) {
    localStorage.setItem(STORAGE_KEY, id);
    applyTheme(id);
  }

  // Inject sooner to avoid flash
  document.documentElement.setAttribute('data-theme', getInitialTheme());

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('theme-switcher');
    if (!container) return;
    THEMES.forEach(t => {
      const dot = document.createElement('span');
      dot.className = 'theme-dot';
      dot.setAttribute('data-theme-id', t.id);
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Switch to ' + t.label + ' theme');
      dot.title = t.label;
      dot.addEventListener('click', () => setTheme(t.id));
      dot.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setTheme(t.id);
        }
      });
      container.appendChild(dot);
    });
    applyTheme(getInitialTheme());
  });
})();
