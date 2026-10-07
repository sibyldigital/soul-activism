// Mobile nav toggle + mailto fallback for the contact form.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // GitHub Pages can't process forms. Until a form backend (Formspree, Basin…)
  // is wired into the form's action, open the visitor's mail client instead.
  var form = document.querySelector('form[data-mailto]');
  if (form && !form.getAttribute('action')) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = [d.get('first_name'), d.get('last_name')].filter(Boolean).join(' ');
      var body = 'Name: ' + name + '\nEmail: ' + (d.get('email') || '') +
        '\nPhone: ' + (d.get('phone') || '') + '\n\n' + (d.get('message') || '');
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent('Soul Activism inquiry from ' + (name || 'website')) +
        '&body=' + encodeURIComponent(body);
      var thanks = form.querySelector('.form-thanks');
      if (thanks) thanks.hidden = false;
    });
  }
})();
