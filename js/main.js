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

  // GitHub Pages can't process forms. With a Formspree ID in data-formspree the
  // form posts to Formspree; without one, open the visitor's mail client with
  // every answer filled in.
  var form = document.querySelector('form[data-mailto]');

  // Session requests can't be in the past: tomorrow at the earliest.
  var when = document.getElementById('session-date');
  if (when) {
    var t = new Date(Date.now() + 864e5);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    when.min = t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()) + 'T09:00';
  }
  if (form) {
    var fsId = (form.getAttribute('data-formspree') || '').trim();
    if (fsId) {
      form.action = 'https://formspree.io/f/' + fsId;
    } else {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var lines = [];
        Array.prototype.forEach.call(form.elements, function (el) {
          if (!el.name || el.name.charAt(0) === '_' || el.type === 'submit') return;
          if (el.type === 'checkbox' && !el.checked) return;
          var label = form.querySelector('label[for="' + el.id + '"]');
          var title = el.type === 'checkbox' ? 'Consent' : label ? label.textContent.replace(/\s*\*$/, '').split('.')[0] : el.name;
          lines.push(title + ':\n' + el.value + '\n');
        });
        var name = form.elements.name ? form.elements.name.value : '';
        window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
          '?subject=' + encodeURIComponent('Soul Activism reading request from ' + (name || 'website')) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        var thanks = form.querySelector('.form-thanks');
        if (thanks) thanks.hidden = false;
      });
    }
  }
})();
