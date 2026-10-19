/* ==========================================================================
   FM Nature — product.js
   Pure Vanilla JavaScript. Koi library, koi framework, koi build step nahi.

   ──────────────────────────────────────────────────────────────────────────
   DEMO vs REAL SHOPIFY
   ──────────────────────────────────────────────────────────────────────────
   Default mode DEMO hai: cart localStorage mein save hota hai taake page
   standalone chal sake. Ye asli Shopify product page honay ka daawa nahi karta.

   Asli store se jodne ke liye niche CONFIG mein:
       SHOPIFY.enabled = true
   karein AUR har variant ke <input> par asli numeric variant ID likhein:
       <input ... data-variant-id="40123456789012">

   Variant ID kahan se milti hai:
     • Admin → Products → variant kholein → URL ke aakhir mein number
     • ya: https://your-store.com/products/<handle>.js  (JSON, har variant ka id)

   Shopify enable hote hi code `/cart/add.js` aur `/cart.js` use karega aur
   Buy Now `/cart/<variantId>:<qty>` par bhej dega. Koi price/ID invent nahi
   ki gayi — jo aap bharenge wahi chalega.
   ========================================================================== */

(function () {
  'use strict';

  /* ======================================================== 00. CONFIG === */
  var CONFIG = {
    currency: 'Rs',
    locale: 'en-PK',
    whatsapp: '923706609411',
    maxQty: 20,
    cartKey: 'fmnDemoCart',

    SHOPIFY: {
      enabled: false,              // ← asli store par true karein
      addUrl: '/cart/add.js',
      cartUrl: '/cart.js',
      cartPageUrl: '/cart',
      checkoutUrl: '/checkout'
    },

    // Demo cart line ke liye product ki base info
    product: {
      title: 'Coco Bliss Organic Coconut Water',
      image: 'https://images.pexels.com/photos/32083194/pexels-photo-32083194.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
      url: 'product.html'
    }
  };

  /* ======================================================= 01. HELPERS === */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  function money(rupees) {
    return CONFIG.currency + ' ' + Number(rupees).toLocaleString(CONFIG.locale);
  }

  function savePercent(price, compare) {
    if (!compare || compare <= price) return 0;
    return Math.round(((compare - price) / compare) * 100);
  }

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  var toastTimer;
  function toast(message) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2800);
  }

  function lockScroll(on) {
    document.body.classList.toggle('is-locked', !!on);
  }

  /* Simple focus trap — drawer / cart / lightbox ke liye */
  function trapFocus(container, event) {
    var focusables = $$(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  /* ================================================== 02. ANNOUNCEMENT === */
  function initAnnouncement() {
    var bar = $('#announce');
    var close = $('#announceClose');
    if (!bar || !close) return;

    try {
      if (sessionStorage.getItem('fmnAnnounceClosed') === '1') bar.hidden = true;
    } catch (e) {}

    close.addEventListener('click', function () {
      bar.hidden = true;
      try { sessionStorage.setItem('fmnAnnounceClosed', '1'); } catch (e) {}
    });
  }

  /* ========================================================= 03. HEADER === */
  function initHeader() {
    var header = $('#header');
    var searchToggle = $('#searchToggle');
    var searchPanel = $('#searchPanel');
    var searchForm = $('#searchForm');

    window.addEventListener('scroll', function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    }, { passive: true });

    searchToggle.addEventListener('click', function () {
      var open = !searchPanel.hidden;
      searchPanel.hidden = open;
      searchToggle.setAttribute('aria-expanded', String(!open));
      if (!open) $('#searchInput').focus();
    });

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = $('#searchInput').value.trim();
      if (!q) return;
      // Asli site par: window.location.href = '/search?q=' + encodeURIComponent(q);
      toast('Demo: search page par "' + q + '" khola jayega.');
    });

    document.addEventListener('click', function (e) {
      if (!searchPanel.hidden &&
          !searchPanel.contains(e.target) &&
          !searchToggle.contains(e.target)) {
        searchPanel.hidden = true;
        searchToggle.setAttribute('aria-expanded', 'false');
      }
    });

    $('#year').textContent = new Date().getFullYear();
  }

  /* ================================================== 04. MOBILE DRAWER === */
  function initDrawer() {
    var drawer = $('#drawer');
    var burger = $('#burger');

    function open() {
      drawer.hidden = false;
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      burger.setAttribute('aria-expanded', 'true');
      lockScroll(true);
      var firstLink = $('.drawer__panel a, .drawer__panel button', drawer);
      if (firstLink) firstLink.focus();
    }
    function close() {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      lockScroll(false);
      setTimeout(function () { drawer.hidden = true; burger.focus(); }, 280);
    }

    burger.addEventListener('click', open);
    $$('[data-close-drawer]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapFocus($('.drawer__panel', drawer), e);
    });

    return { close: close };
  }

  /* ======================================================== 05. GALLERY === */
  function initGallery() {
    var mainImage = $('#mainImage');
    var thumbs = $$('.thumb');
    var stage = $('#galleryStage');
    var counter = $('#galCounter');
    var index = 0;

    function show(i, focusThumb, isInitial) {
      index = (i + thumbs.length) % thumbs.length;
      var btn = thumbs[index];

      mainImage.classList.add('is-fading');
      var next = new Image();
      next.src = btn.dataset.full;
      next.onload = next.onerror = function () {
        mainImage.src = btn.dataset.full;
        mainImage.alt = btn.dataset.alt || '';
        mainImage.classList.remove('is-fading');
      };

      thumbs.forEach(function (t, n) {
        var active = n === index;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      counter.textContent = (index + 1) + ' / ' + thumbs.length;
      if (focusThumb) thumbs[index].focus();

      // Selected thumbnail ko strip ke andar view mein lao
      // (page load par nahi, warna page khud scroll ho jata hai)
      if (!isInitial) {
        thumbs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }

    thumbs.forEach(function (btn, i) {
      btn.addEventListener('click', function () { show(i); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, true); }
      });
    });

    $('#galPrev').addEventListener('click', function () { show(index - 1); });
    $('#galNext').addEventListener('click', function () { show(index + 1); });

    /* Mobile swipe */
    var startX = 0, startY = 0, swiping = false;
    stage.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });

    stage.addEventListener('touchend', function (e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      // horizontal swipe hi count ho (vertical scroll disturb na ho)
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? show(index + 1) : show(index - 1);
      }
    }, { passive: true });

    /* Lightbox */
    var lightbox = $('#lightbox');
    var lightboxImg = $('#lightboxImg');
    var lastFocused = null;

    function openLightbox() {
      lastFocused = document.activeElement;
      lightboxImg.src = thumbs[index].dataset.full;
      lightboxImg.alt = thumbs[index].dataset.alt || '';
      lightbox.hidden = false;
      lockScroll(true);
      $('.lightbox__close', lightbox).focus();
    }
    function closeLightbox() {
      lightbox.hidden = true;
      lockScroll(false);
      if (lastFocused) lastFocused.focus();
    }
    function lightboxStep(dir) {
      show(index + dir);
      lightboxImg.src = thumbs[index].dataset.full;
      lightboxImg.alt = thumbs[index].dataset.alt || '';
    }

    $('#galZoom').addEventListener('click', openLightbox);
    mainImage.addEventListener('click', openLightbox);
    $$('[data-close-lightbox]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
    $('#lbPrev').addEventListener('click', function () { lightboxStep(-1); });
    $('#lbNext').addEventListener('click', function () { lightboxStep(1); });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxStep(1);
      if (e.key === 'ArrowLeft') lightboxStep(-1);
      if (e.key === 'Tab') trapFocus($('.lightbox__inner', lightbox), e);
    });

    show(0, false, true);
  }

  /* ================================= 06. VARIANTS / QTY / PRICE SYNC ===== */
  var PDP = {
    variant: null,   // currently selected <input>
    qty: 1
  };

  function initBuyBox() {
    var inputs = $$('#variants input[name="pack"]');
    var qtyInput = $('#qtyInput');

    function readVariant(input) {
      return {
        el: input,
        id: input.dataset.variantId || '',          // Shopify numeric ID (khaali = demo)
        key: input.value,
        label: input.dataset.label || input.value,
        price: Number(input.dataset.price) || 0,
        compare: Number(input.dataset.compare) || 0,
        units: Number(input.dataset.units) || 1,
        stock: input.dataset.stock || 'in'
      };
    }

    function render() {
      var v = PDP.variant;
      var pct = savePercent(v.price, v.compare);
      var qty = PDP.qty;

      /* Price block */
      $('#priceNow').textContent = money(v.price);

      var wasEl = $('#priceWas');
      var badgeEl = $('#saveBadge');
      if (pct > 0) {
        wasEl.textContent = money(v.compare);
        wasEl.hidden = false;
        badgeEl.textContent = 'Save ' + pct + '%';
        badgeEl.hidden = false;
      } else {
        wasEl.hidden = true;
        badgeEl.hidden = true;
      }

      /* Gallery badge */
      var galBadge = $('#galleryBadge');
      if (pct > 0) { galBadge.textContent = 'Save ' + pct + '%'; galBadge.hidden = false; }
      else { galBadge.hidden = true; }

      /* Unit price */
      var unitEl = $('#unitPrice');
      if (v.units > 1) {
        unitEl.textContent = money(Math.round(v.price / v.units)) + ' per coconut';
        unitEl.hidden = false;
      } else {
        unitEl.textContent = money(v.price) + ' per coconut';
        unitEl.hidden = false;
      }

      /* Stock */
      var stock = $('#stockStatus');
      var stockText = $('#stockText');
      stock.classList.remove('is-low', 'is-out');
      if (v.stock === 'out') {
        stock.classList.add('is-out');
        stockText.textContent = 'Out of stock';
      } else if (v.stock === 'low') {
        stock.classList.add('is-low');
        stockText.textContent = 'Only a few left — order soon';
      } else {
        stockText.textContent = 'In stock — ready to ship';
      }

      /* Line total */
      $('#lineTotal').textContent = money(v.price * qty);

      /* Variant cards selected state */
      inputs.forEach(function (input) {
        var label = input.closest('.variant');
        var on = input.checked;
        label.classList.toggle('is-selected', on);
        label.classList.toggle('is-disabled', input.dataset.stock === 'out');
      });

      /* Buttons */
      var soldOut = v.stock === 'out';
      var addBtn = $('#addToCart');
      var buyBtn = $('#buyNow');
      var stickyBtn = $('#stickyAdd');
      addBtn.disabled = soldOut;
      buyBtn.disabled = soldOut;
      stickyBtn.disabled = soldOut;
      $('.btn__label', addBtn).textContent = soldOut ? 'Sold out' : 'Add to cart';
      $('.btn__label', stickyBtn).textContent = soldOut ? 'Sold out' : 'Add to cart';

      /* Sticky bar */
      $('#stickyName').textContent = v.label + ' · ' + v.units + (v.units > 1 ? ' coconuts' : ' coconut');
      $('#stickyPrice').textContent = money(v.price * qty);
      var stickyWas = $('#stickyWas');
      if (pct > 0) { stickyWas.textContent = money(v.compare * qty); stickyWas.hidden = false; }
      else { stickyWas.hidden = true; }

      /* WhatsApp message variant ke mutabiq */
      var msg = 'Assalam o Alaikum, I want to order ' + CONFIG.product.title +
                ' — ' + v.label + ' (qty ' + qty + ').';
      $('#waOrder').href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
    }

    /* Variant change */
    inputs.forEach(function (input) {
      input.addEventListener('change', function () {
        if (input.dataset.stock === 'out') return;
        PDP.variant = readVariant(input);
        render();
      });
    });

    /* Quantity */
    function setQty(n) {
      PDP.qty = clamp(parseInt(n, 10) || 1, 1, CONFIG.maxQty);
      qtyInput.value = PDP.qty;
      render();
    }
    $('#qtyMinus').addEventListener('click', function () { setQty(PDP.qty - 1); });
    $('#qtyPlus').addEventListener('click', function () { setQty(PDP.qty + 1); });
    qtyInput.addEventListener('change', function () { setQty(qtyInput.value); });
    qtyInput.addEventListener('blur', function () { setQty(qtyInput.value); });

    /* Initial state */
    var checked = inputs.filter(function (i) { return i.checked; })[0] || inputs[0];
    checked.checked = true;
    PDP.variant = readVariant(checked);
    PDP.qty = 1;
    qtyInput.value = 1;
    render();

    return { render: render };
  }

  /* ========================================== 07. CART (demo + Shopify) === */
  var cart = [];

  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem(CONFIG.cartKey)) || []; }
    catch (e) { cart = []; }
  }
  function persistCart() {
    try { localStorage.setItem(CONFIG.cartKey, JSON.stringify(cart)); } catch (e) {}
  }
  function cartCount() {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  }
  function cartTotal() {
    return cart.reduce(function (t, l) { return t + l.qty * l.price; }, 0);
  }

  function renderCart() {
    var n = cartCount();
    var bubble = $('#cartCount');
    bubble.textContent = n;
    bubble.hidden = n === 0;
    $('#cartItems').textContent = n;
    $('#cartTotal').textContent = money(cartTotal());

    var body = $('#cartBody');
    body.innerHTML = '';

    if (!cart.length) {
      var empty = document.createElement('p');
      empty.className = 'cart__empty';
      empty.textContent = 'Your cart is empty. Fresh coconuts are waiting 🥥';
      body.appendChild(empty);
      return;
    }

    cart.forEach(function (line, i) {
      var row = document.createElement('div');
      row.className = 'cart-line';

      var img = document.createElement('img');
      img.src = line.image; img.alt = ''; img.width = 60; img.height = 60; img.loading = 'lazy';

      var mid = document.createElement('div');
      var title = document.createElement('p');
      title.className = 'cart-line__title';
      title.textContent = line.title;
      var meta = document.createElement('p');
      meta.className = 'cart-line__meta';
      meta.textContent = line.variantLabel + ' · ' + money(line.price);

      var qtyWrap = document.createElement('span');
      qtyWrap.className = 'cart-line__qty';
      var minus = document.createElement('button');
      minus.type = 'button'; minus.textContent = '−';
      minus.setAttribute('aria-label', 'Decrease quantity of ' + line.title);
      var num = document.createElement('span');
      num.textContent = line.qty;
      var plus = document.createElement('button');
      plus.type = 'button'; plus.textContent = '+';
      plus.setAttribute('aria-label', 'Increase quantity of ' + line.title);
      minus.addEventListener('click', function () { changeLineQty(i, -1); });
      plus.addEventListener('click', function () { changeLineQty(i, 1); });
      qtyWrap.appendChild(minus); qtyWrap.appendChild(num); qtyWrap.appendChild(plus);

      mid.appendChild(title); mid.appendChild(meta); mid.appendChild(qtyWrap);

      var right = document.createElement('div');
      right.style.textAlign = 'end';
      var sum = document.createElement('strong');
      sum.textContent = money(line.price * line.qty);
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-line__remove';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + line.title + ' from cart');
      remove.addEventListener('click', function () { removeLine(i); });
      right.appendChild(sum);
      right.appendChild(document.createElement('br'));
      right.appendChild(remove);

      row.appendChild(img); row.appendChild(mid); row.appendChild(right);
      body.appendChild(row);
    });
  }

  function changeLineQty(i, step) {
    if (!cart[i]) return;
    cart[i].qty = clamp(cart[i].qty + step, 1, CONFIG.maxQty);
    persistCart(); renderCart();
  }
  function removeLine(i) {
    cart.splice(i, 1);
    persistCart(); renderCart();
    toast('Item removed from cart');
  }

  function addLine(line) {
    var existing = cart.filter(function (l) { return l.key === line.key; })[0];
    if (existing) existing.qty = clamp(existing.qty + line.qty, 1, CONFIG.maxQty);
    else cart.push(line);
    persistCart(); renderCart();
  }

  function openCart() {
    var el = $('#cart');
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add('is-open'); });
    lockScroll(true);
    $('.cart__head .icon-btn', el).focus();
  }
  function closeCart() {
    var el = $('#cart');
    if (!el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    lockScroll(false);
    setTimeout(function () { el.hidden = true; }, 300);
  }

  /* ------------------------------------------ Shopify Ajax Cart API ----- */
  /**
   * Asli Shopify par item add karta hai.
   * Sirf tab chalta hai jab CONFIG.SHOPIFY.enabled === true aur
   * variant par asli numeric data-variant-id maujood ho.
   */
  function shopifyAdd(variantId, quantity) {
    return fetch(CONFIG.SHOPIFY.addUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: Number(variantId), quantity: Number(quantity) }] })
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.description || data.message || 'Add to cart failed');
        return data;
      });
    });
  }

  /** Shopify cart state padh kar header bubble update karta hai. */
  function shopifySyncCount() {
    return fetch(CONFIG.SHOPIFY.cartUrl, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var bubble = $('#cartCount');
        bubble.textContent = data.item_count;
        bubble.hidden = data.item_count === 0;
        return data;
      });
  }

  /* --------------------------------------------- Add to cart handler ---- */
  function initCartActions(buybox) {
    loadCart();
    renderCart();

    $('#cartToggle').addEventListener('click', openCart);
    $$('[data-close-cart]').forEach(function (el) {
      el.addEventListener('click', closeCart);
    });
    $('#cart').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCart();
      if (e.key === 'Tab') trapFocus($('.cart__panel'), e);
    });

    $('#cartCheckout').addEventListener('click', function () {
      if (CONFIG.SHOPIFY.enabled) { window.location.href = CONFIG.SHOPIFY.checkoutUrl; return; }
      toast('Demo mode — asli store par /checkout khulega.');
    });

    function addToCartFlow(button, thenCheckout) {
      var v = PDP.variant;
      if (!v || v.stock === 'out') return;

      var label = $('.btn__label', button);
      var original = label.textContent;

      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      label.textContent = 'Adding…';
      var spin = document.createElement('span');
      spin.className = 'spinner';
      button.insertBefore(spin, label);

      function success() {
        spin.remove();
        button.removeAttribute('aria-busy');
        button.disabled = false;
        button.classList.add('is-done');
        label.textContent = 'Added ✓';
        toast(v.label + ' added to cart');

        setTimeout(function () {
          button.classList.remove('is-done');
          label.textContent = original;
        }, 2000);

        if (thenCheckout) {
          if (CONFIG.SHOPIFY.enabled) window.location.href = CONFIG.SHOPIFY.checkoutUrl;
          else toast('Demo mode — asli store par checkout par le jayega.');
        } else {
          openCart();
        }
      }

      function failure(message) {
        spin.remove();
        button.removeAttribute('aria-busy');
        button.disabled = false;
        label.textContent = 'Try again';
        toast(message || 'Could not add to cart. Please try again.');
        setTimeout(function () { label.textContent = original; }, 2400);
      }

      /* --- Real Shopify path ------------------------------------------- */
      if (CONFIG.SHOPIFY.enabled && v.id) {
        shopifyAdd(v.id, PDP.qty)
          .then(function () { return shopifySyncCount(); })
          .then(success)
          .catch(function (err) { failure(err.message); });
        return;
      }

      /* --- Demo path ---------------------------------------------------- */
      if (CONFIG.SHOPIFY.enabled && !v.id) {
        failure('Shopify mode on hai lekin is variant par data-variant-id khaali hai.');
        return;
      }

      setTimeout(function () {
        addLine({
          key: v.key,
          title: CONFIG.product.title,
          variantLabel: v.label,
          price: v.price,
          image: CONFIG.product.image,
          qty: PDP.qty
        });
        success();
      }, 550);
    }

    $('#addToCart').addEventListener('click', function () {
      addToCartFlow(this, false);
    });
    $('#stickyAdd').addEventListener('click', function () {
      addToCartFlow(this, false);
    });

    /* Buy now */
    $('#buyNow').addEventListener('click', function () {
      var v = PDP.variant;
      if (!v || v.stock === 'out') return;

      if (CONFIG.SHOPIFY.enabled && v.id) {
        // Shopify cart permalink — seedha checkout
        window.location.href = '/cart/' + v.id + ':' + PDP.qty;
        return;
      }
      if (CONFIG.SHOPIFY.enabled && !v.id) {
        toast('Shopify mode on hai lekin is variant par data-variant-id khaali hai.');
        return;
      }

      addLine({
        key: v.key,
        title: CONFIG.product.title,
        variantLabel: v.label,
        price: v.price,
        image: CONFIG.product.image,
        qty: PDP.qty
      });
      openCart();
      toast('Demo mode — asli store par seedha checkout khulega.');
    });

    /* Agar Shopify on hai to page load par asli count dikhayein */
    if (CONFIG.SHOPIFY.enabled) {
      shopifySyncCount().catch(function () { /* storefront nahi mila — chup rahein */ });
    }

    return { close: closeCart };
  }

  /* ===================================================== 08. ACCORDION === */
  function initAccordion() {
    var items = $$('#accordion details');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        // Ek waqt mein ek hi khula rahe
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* ======================================================= 09. REVIEWS === */
  function initReviews() {
    var track = $('#reviewsTrack');
    var prev = $('#revPrev');
    var next = $('#revNext');
    if (!track || !prev || !next) return;

    function step(dir) {
      var card = track.querySelector('li');
      var amount = card ? card.getBoundingClientRect().width + 12 : 280;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
  }

  /* ================================================= 10. STICKY BUY BAR == */
  function initStickyBar() {
    var bar = $('#stickyBar');
    var actions = $('.buybox__actions');
    var footer = $('.footer');
    if (!bar || !actions) return;

    function isMobile() { return window.matchMedia('(max-width: 767px)').matches; }

    function setBarSpace(visible) {
      // Body padding set karein taake bar content ko na dhanpe
      var h = visible ? bar.offsetHeight + 'px' : '0px';
      document.documentElement.style.setProperty('--stickybar-h', h);
    }

    function update() {
      if (!isMobile()) {
        bar.hidden = true;
        bar.classList.remove('is-visible');
        setBarSpace(false);
        return;
      }
      bar.hidden = false;

      var actionsRect = actions.getBoundingClientRect();
      var footerRect = footer.getBoundingClientRect();

      // Bar tab dikhe jab asli buttons scroll se upar nikal jayen
      // aur footer abhi screen par na aaya ho.
      var pastButtons = actionsRect.bottom < 0;
      var footerVisible = footerRect.top < window.innerHeight - 40;
      var show = pastButtons && !footerVisible;

      bar.classList.toggle('is-visible', show);
      setBarSpace(show);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ============================================ 11. RELATED PRODUCTS ===== */
  function initRelated() {
    // Demo mein sab cards product.html par point karte hain.
    // Asli site par har <a href> ko us product ke URL se badlein.
    $$('.rel-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        var href = card.getAttribute('href');
        if (href && href !== 'product.html') return;   // asli link ho to normal chalne dein
        e.preventDefault();
        var title = $('.rel-card__title', card).textContent.trim();
        toast('Demo: "' + title + '" ka product page khulega.');
      });
    });
  }

  /* ============================================== 12. GLOBAL SHORTCUTS === */
  function initGlobalKeys(drawer, cartApi) {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      drawer.close();
      cartApi.close();
      var panel = $('#searchPanel');
      if (panel && !panel.hidden) {
        panel.hidden = true;
        $('#searchToggle').setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ========================================================== 13. INIT === */
  document.addEventListener('DOMContentLoaded', function () {
    initAnnouncement();
    initHeader();
    var drawer = initDrawer();
    initGallery();
    var buybox = initBuyBox();
    var cartApi = initCartActions(buybox);
    initAccordion();
    initReviews();
    initStickyBar();
    initRelated();
    initGlobalKeys(drawer, cartApi);

    // Debug / integration ke liye console se access
    window.FMNature = {
      config: CONFIG,
      state: PDP,
      getCart: function () { return cart.slice(); },
      clearCart: function () { cart = []; persistCart(); renderCart(); }
    };
  });

})();
