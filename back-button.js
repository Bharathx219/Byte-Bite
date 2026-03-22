(function () {
  if (document.querySelector('.bb-back-button')) return;
  var path = window.location.pathname.toLowerCase();
  if (path.endsWith('/index.html') || path.endsWith('/')) return;

  var style = document.createElement('style');
  style.textContent =
    '.bb-back-row{' +
    'width:100%;display:flex;align-items:center;' +
    'padding:10px 16px 6px;box-sizing:border-box;' +
    '}' +
    '.bb-back-button{' +
    'display:inline-flex;align-items:center;justify-content:center;' +
    'width:40px;height:40px;padding:0;border:1px solid #d8d8d8;border-radius:999px;' +
    'background:#fff;color:#1f2937;font:400 24px/1 Arial,sans-serif;cursor:pointer;' +
    'box-shadow:0 1px 2px rgba(0,0,0,.06);transition:background .15s ease,border-color .15s ease,color .15s ease;' +
    '}' +
    '.bb-back-button:hover{background:#f7f7f7;border-color:#cfcfcf;}' +
    '.bb-back-button:focus-visible{outline:2px solid #8c2828;outline-offset:2px;}' +
    '@media (max-width:640px){.bb-back-row{padding:8px 12px 4px;}.bb-back-button{width:36px;height:36px;font-size:22px;}}';

  document.head.appendChild(style);

  var row = document.createElement('div');
  row.className = 'bb-back-row';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'bb-back-button';
  btn.setAttribute('aria-label', 'Go back');
  btn.innerHTML = '<span aria-hidden="true">&#8592;</span>';

  btn.addEventListener('click', function () {
    var hasReferrer = !!document.referrer;
    var sameOriginReferrer = false;

    if (hasReferrer) {
      try {
        sameOriginReferrer = new URL(document.referrer).origin === window.location.origin;
      } catch (e) {
        sameOriginReferrer = false;
      }
    }

    if (sameOriginReferrer && window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = 'index.html';
  });

  row.appendChild(btn);

  var headerEl = document.querySelector('.swiggy-top-banner, header, .top-banner, .site-header');
  var anchorEl = headerEl || document.querySelector('nav, main, .container, .content, section');
  if (anchorEl && anchorEl.parentNode) {
    anchorEl.parentNode.insertBefore(row, anchorEl.nextSibling);
  } else {
    document.body.insertBefore(row, document.body.firstChild);
  }
})();
