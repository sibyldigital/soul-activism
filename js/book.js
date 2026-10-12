// Book a Reading: three gated steps.
//   1. Intake form  -> sent to Formspree; unlocks step 2 only when Formspree accepts it.
//   2. Pick a time  -> Google appointment page in a new tab; the client confirms they booked.
//   3. Pay          -> PayPal checkout; "completed" only shows after PayPal approves and captures.
(function () {
  var flow = document.getElementById('booking-flow');
  if (!flow) return;

  var FORMSPREE = 'https://formspree.io/f/' + flow.getAttribute('data-formspree');
  var PRICES = { 'Soul Activism Reading': '200.00', 'Soul Relationships Reading': '200.00', 'Soul Sync': '200.00' };
  var KEY = 'sa-booking';

  var state = load() || { step: 1, answers: {} };

  function load() { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; } }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var steps = flow.querySelectorAll('.step-card');
  function render() {
    Array.prototype.forEach.call(steps, function (el) {
      var n = +el.getAttribute('data-step');
      el.classList.toggle('is-done', n < state.step);
      el.classList.toggle('is-active', n === state.step);
      el.classList.toggle('is-locked', n > state.step);
      el.setAttribute('aria-disabled', n > state.step ? 'true' : 'false');
      var body = el.querySelector('.step-body');
      if (body) body.hidden = n !== state.step;
    });
    var done = document.getElementById('booking-done');
    done.hidden = state.step !== 4;
    if (state.step === 4) {
      document.getElementById('done-name').textContent = state.answers.name || '';
      document.getElementById('done-ref').textContent = state.orderId || '';
    }
    var sum = document.getElementById('pay-summary');
    if (sum && state.answers['reading-type']) {
      sum.textContent = state.answers['reading-type'] + ': $' + price();
    }
    if (state.step === 3) loadPayPal();
  }

  function price() { return PRICES[state.answers['reading-type']] || '200.00'; }

  function post(data) {
    return fetch(FORMSPREE, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { if (!r.ok) throw new Error('Formspree ' + r.status); return r; });
  }

  // Preselect the reading type from ?reading=... (links on service pages).
  var form = document.getElementById('intake');
  var pre = new URLSearchParams(location.search).get('reading');
  if (pre && form.elements['reading-type']) {
    Array.prototype.forEach.call(form.elements['reading-type'].options, function (o) { if (o.value === pre) o.selected = true; });
  }

  // ---- Step 1: intake
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = form.querySelector('.step-error');
    var btn = form.querySelector('button[type=submit]');
    err.hidden = true; btn.disabled = true; btn.textContent = 'Sending…';
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit') return;
      if (el.type === 'checkbox') { if (el.checked) data[el.name] = el.value; return; }
      data[el.name] = el.value;
    });
    if (data._gotcha) return;
    data._subject = 'New reading request: ' + data['reading-type'] + ' (' + data.name + ')';
    post(data).then(function () {
      state.answers = { name: data.name, email: data.email, 'reading-type': data['reading-type'] };
      state.step = 2; save(); render();
      flow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function () {
      err.hidden = false;
    }).then(function () { btn.disabled = false; btn.textContent = 'Continue to scheduling'; });
  });

  // ---- Step 2: schedule
  var opened = false;
  var bookedBtn = document.getElementById('booked-btn');
  document.getElementById('open-calendar').addEventListener('click', function () {
    opened = true; bookedBtn.disabled = false;
  });
  bookedBtn.addEventListener('click', function () {
    if (!opened && !confirm('Have you booked your time on the calendar?')) return;
    state.step = 3; save(); render();
  });

  // ---- Step 3: PayPal
  var ppLoaded = false;
  function loadPayPal() {
    if (ppLoaded) return; ppLoaded = true;
    var holder = document.getElementById('paypal-buttons');
    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(flow.getAttribute('data-paypal')) + '&currency=USD&intent=capture';
    s.onload = function () {
      window.paypal.Buttons({
        style: { color: 'gold', shape: 'rect', label: 'pay' },
        createOrder: function (d, actions) {
          return actions.order.create({
            purchase_units: [{ description: state.answers['reading-type'] + ' with Zan Dean', amount: { currency_code: 'USD', value: price() } }]
          });
        },
        onApprove: function (d, actions) {
          return actions.order.capture().then(function (order) {
            state.orderId = order.id; state.step = 4; save(); render();
            post({
              _subject: 'PAID: ' + state.answers['reading-type'] + ' (' + state.answers.name + ')',
              name: state.answers.name, email: state.answers.email,
              'reading-type': state.answers['reading-type'], amount: '$' + price(),
              'paypal-order-id': order.id, status: order.status
            }).catch(function () {});
          });
        },
        onError: function () { document.getElementById('pay-error').hidden = false; }
      }).render(holder);
    };
    s.onerror = function () { document.getElementById('pay-error').hidden = false; };
    document.head.appendChild(s);
  }

  document.getElementById('start-over').addEventListener('click', function () {
    state = { step: 1, answers: {} }; save(); location.reload();
  });

  render();
})();
