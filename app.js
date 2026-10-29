// All report content and charts are static; JS only enhances reading and printing.
const printButton = document.querySelector('#print-report');
printButton.hidden = false;
printButton.addEventListener('click', () => window.print());
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details').forEach(element => {
    element.dataset.wasOpen = String(element.open);
    element.open = true;
  });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach(element => {
    element.open = element.dataset.wasOpen === 'true';
    delete element.dataset.wasOpen;
  });
});
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('nav a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}
