/* ==========================================================================
   FM Nature — main.js
   Pure jQuery (3.7.1). Koi framework nahi, koi build step nahi.

   Sections:
   01. Product data            07. Product cards + tabs
   02. Helpers                 08. Cart (localStorage)
   03. Announcement rotator    09. Quick view modal
   04. Header / search         10. Spotlight (variant + qty)
   05. Mobile drawer           11. Brand video (click-to-play)
   06. Hero slider             12. Reviews slider, FAQ, footer, newsletter
   ========================================================================== */

(function ($) {
  'use strict';

  /* ======================================================= 01. PRODUCT DATA
     Yahan apni products add/edit karein. `img2` hover par dikhti hai.
     Price PKR (rupees) mein — paisa nahi.                                   */
  var PRODUCTS = {
    coconut: [
      { id:'cw-1', title:'Coco Bliss Easy-Open Coconut Water', price:450,  compare:600,
        img:'https://images.pexels.com/photos/32083194/pexels-photo-32083194.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        img2:'https://images.pexels.com/photos/11398730/pexels-photo-11398730.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        tag:'Bestseller', stock:true,
        desc:'Young green coconut fitted with Pakistan\'s first smart easy-opener. Chilled, 100% natural, nothing added.' },
      { id:'cw-2', title:'Whole Green Coconut (Pack of 3)', price:1250, compare:1500,
        img:'https://images.pexels.com/photos/25078444/pexels-photo-25078444.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        img2:'https://images.pexels.com/photos/32831497/pexels-photo-32831497.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        tag:'', stock:true,
        desc:'Three fresh young coconuts, hand-picked and cold-chain delivered.' },
      { id:'cw-3', title:'Brown Coconut — Mature', price:320, compare:0,
        img:'https://images.pexels.com/photos/11398730/pexels-photo-11398730.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        img2:'https://images.pexels.com/photos/25078444/pexels-photo-25078444.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        tag:'', stock:true,
        desc:'Mature brown coconut — perfect for fresh coconut milk, chutney and desserts.' },
      { id:'cw-4', title:'Coco Bliss Family Pack (6 pcs)', price:2400, compare:3000,
        img:'https://images.pexels.com/photos/32831497/pexels-photo-32831497.jpeg?auto=compress&cs=tinysrgb&w=602&h=602&fit=crop',
        img2:'https://images.pexels.com/photos/32083194/pexels-photo-32083194.jpeg?auto=compress&cs=tinysrgb&w=602&h=602&fit=crop',
        tag:'Save big', stock:true,
        desc:'Six easy-open coconuts for the whole family. Best value per coconut.' }
    ],
    dates: [
      { id:'dt-1', title:'Ajwa Dates — Madina 1kg', urdu:'عجوہ', price:4200, compare:4900,
        img:'https://images.pexels.com/photos/30709483/pexels-photo-30709483.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        img2:'https://images.pexels.com/photos/28445701/pexels-photo-28445701.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        tag:'Premium', stock:true,
        desc:'Authentic Ajwa dates imported directly from Madina. Soft, rich and sealed fresh.' },
      { id:'dt-2', title:'Sukri Dates — Premium 1kg', urdu:'سکری', price:2800, compare:3200,
        img:'https://images.pexels.com/photos/28445701/pexels-photo-28445701.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        img2:'https://images.pexels.com/photos/30709483/pexels-photo-30709483.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        tag:'', stock:true,
        desc:'Golden, crunchy-soft Sukri dates with a caramel sweetness. A Ramadan favourite.' },
      { id:'dt-3', title:'Mabroom Dates — 1kg', urdu:'مبروم', price:3600, compare:0,
        img:'https://images.pexels.com/photos/29956305/pexels-photo-29956305.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        img2:'https://images.pexels.com/photos/30709483/pexels-photo-30709483.jpeg?auto=compress&cs=tinysrgb&w=602&h=602&fit=crop',
        tag:'', stock:true,
        desc:'Long, slender Mabroom dates with a chewy texture and deep honey flavour.' },
      { id:'dt-4', title:'Madina Dates Gift Box', price:5500, compare:6500,
        img:'https://images.pexels.com/photos/30709483/pexels-photo-30709483.jpeg?auto=compress&cs=tinysrgb&w=603&h=603&fit=crop',
        img2:'https://images.pexels.com/photos/29956305/pexels-photo-29956305.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        tag:'Gift', stock:true,
        desc:'Ajwa, Sukri and Mabroom in one premium gift box — ideal for Eid and corporate gifting.' }
    ],
    dragon: [
      { id:'df-1', title:'Red Dragon Fruit — 1 pc', price:650, compare:800,
        img:'https://images.pexels.com/photos/2907428/pexels-photo-2907428.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        img2:'https://images.pexels.com/photos/2907454/pexels-photo-2907454.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        tag:'Seasonal', stock:true,
        desc:'Locally grown red-flesh dragon fruit. Sweet, juicy and packed with antioxidants.' },
      { id:'df-2', title:'Dragon Fruit Box (3 pcs)', price:1800, compare:2100,
        img:'https://images.pexels.com/photos/2907454/pexels-photo-2907454.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        img2:'https://images.pexels.com/photos/2907428/pexels-photo-2907428.jpeg?auto=compress&cs=tinysrgb&w=601&h=601&fit=crop',
        tag:'', stock:true,
        desc:'Three hand-picked dragon fruits, delivered chilled and perfectly ripe.' },
      { id:'df-3', title:'Dragon Fruit + Coconut Combo', price:1950, compare:2400,
        img:'https://images.pexels.com/photos/2907428/pexels-photo-2907428.jpeg?auto=compress&cs=tinysrgb&w=602&h=602&fit=crop',
        img2:'https://images.pexels.com/photos/32083194/pexels-photo-32083194.jpeg?auto=compress&cs=tinysrgb&w=603&h=603&fit=crop',
        tag:'Combo', stock:true,
        desc:'Two dragon fruits plus two Coco Bliss coconuts — the perfect summer box.' },
      { id:'df-4', title:'Tropical Fresh Box', price:2600, compare:0,
        img:'https://images.pexels.com/photos/29956305/pexels-photo-29956305.jpeg?auto=compress&cs=tinysrgb&w=602&h=602&fit=crop',
        img2:'https://images.pexels.com/photos/2907454/pexels-photo-2907454.jpeg?auto=compress&cs=tinysrgb&w=602&h=602&fit=crop',
        tag:'', stock:false,
        desc:'A seasonal mix of our freshest tropical fruit. Contents change weekly.' }
    ],
    karachi: [
      { id:'kh-1', title:'Karachi Weekend Coconut Deal', price:1100, compare:1600,
        img:'https://images.pexels.com/photos/25078444/pexels-photo-25078444.jpeg?auto=compress&cs=tinysrgb&w=604&h=604&fit=crop',
        img2:'https://images.pexels.com/photos/11398730/pexels-photo-11398730.jpeg?auto=compress&cs=tinysrgb&w=604&h=604&fit=crop',
        tag:'COD', stock:true,
        desc:'Karachi-only weekend bundle: 3 easy-open coconuts at a special price. Cash on delivery.' },
      { id:'kh-2', title:'Karachi COD Dates Bundle', price:3900, compare:4800,
        img:'https://images.pexels.com/photos/30709483/pexels-photo-30709483.jpeg?auto=compress&cs=tinysrgb&w=604&h=604&fit=crop',
        img2:'https://images.pexels.com/photos/28445701/pexels-photo-28445701.jpeg?auto=compress&cs=tinysrgb&w=604&h=604&fit=crop',
        tag:'COD', stock:true,
        desc:'500g Ajwa + 500g Sukri, delivered same day in Karachi with cash on delivery.' },
      { id:'kh-3', title:'Karachi Saffron + Dates Combo', price:4500, compare:5600,
        img:'https://images.pexels.com/photos/17696668/pexels-photo-17696668.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
        img2:'https://images.pexels.com/photos/30709483/pexels-photo-30709483.jpeg?auto=compress&cs=tinysrgb&w=605&h=605&fit=crop',
        tag:'Combo', stock:true,
        desc:'1g premium Kesar saffron plus 500g Ajwa dates — a thoughtful gift set.' },
      { id:'kh-4', title:'Karachi Fresh Fruit Basket', price:2200, compare:2750,
        img:'https://images.pexels.com/photos/2907454/pexels-photo-2907454.jpeg?auto=compress&cs=tinysrgb&w=603&h=603&fit=crop',
        img2:'https://images.pexels.com/photos/29956305/pexels-photo-29956305.jpeg?auto=compress&cs=tinysrgb&w=603&h=603&fit=crop',
        tag:'', stock:true,
        desc:'Dragon fruit, coconut and seasonal fruit in one basket. Karachi delivery only.' }
    ]
  };

  /* =========================================================== 02. HELPERS */
  function money(n) {
    return 'Rs ' + Number(n).toLocaleString('en-PK');
  }
  function savePct(price, compare) {
    if (!compare || compare <= price) return 0;
    return Math.round(((compare - price) / compare) * 100);
  }
  function findProduct(id) {
    var found = null;
    $.each(PRODUCTS, function (_, list) {
      $.each(list, function (_, p) {
        if (p.id === id) { found = p; return false; }
      });
      return !found;
    });
    return found;
  }
  function escapeHtml(s) {
    return $('<div>').text(s == null ? '' : s).html();
  }
  var toastTimer;
  function toast(msg) {
    var $t = $('#toast').text(msg).addClass('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $t.removeClass('is-visible'); }, 2600);
  }
  function lockScroll(on) {
    $('body').toggleClass('is-locked', !!on);
  }

  /* =============================================== 03. ANNOUNCEMENT ROTATOR */
  function initAnnounce() {
    var $track = $('#announceTrack');
    var count = $track.children().length;
    var i = 0;

    try {
      if (sessionStorage.getItem('fmnAnnounceClosed') === '1') $('#announce').hide();
    } catch (e) {}
    if (count > 1) {
      setInterval(function () {
        i = (i + 1) % count;
        $track.css('transform', 'translateX(' + (-i * 100) + '%)');
      }, 6000);
    }
    $('#announceClose').on('click', function () {
      $('#announce').slideUp(200);
      try { sessionStorage.setItem('fmnAnnounceClosed', '1'); } catch (e) {}
    });
  }

  /* ================================================== 04. HEADER + SEARCH */
  function initHeader() {
    var $header = $('#header');

    $(window).on('scroll', function () {
      $header.toggleClass('is-stuck', $(window).scrollTop() > 10);
      $('#toTop').prop('hidden', $(window).scrollTop() < 500);
    });

    $('#toTop').on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 400);
    });

    /* Desktop dropdown / mega menu — click + hover dono */
    $('.nav__item.has-dropdown, .nav__item.has-mega')
      .on('mouseenter', function () {
        $('.nav__item').not(this).removeClass('is-open');
        $(this).addClass('is-open');
      })
      .on('mouseleave', function () {
        $(this).removeClass('is-open');
      })
      .find('> .nav__link').on('click', function (e) {
        if (window.matchMedia('(min-width: 1024px)').matches) {
          e.preventDefault();
          $(this).parent().toggleClass('is-open').siblings().removeClass('is-open');
        }
      });

    /* Search toggle */
    $('#searchToggle').on('click', function () {
      var $panel = $('#searchPanel');
      var open = $panel.is(':visible');
      $panel.prop('hidden', open);
      $(this).attr('aria-expanded', !open);
      if (!open) $('#searchInput').trigger('focus');
    });

    /* Simple live search (PRODUCTS object par) */
    $('#searchInput').on('input', function () {
      var q = $.trim($(this).val()).toLowerCase();
      var $out = $('#searchResults').empty();
      if (q.length < 2) return;

      var hits = [];
      $.each(PRODUCTS, function (_, list) {
        $.each(list, function (_, p) {
          if (p.title.toLowerCase().indexOf(q) > -1) hits.push(p);
        });
      });

      if (!hits.length) {
        $out.append('<p class="muted">No products found for “' + escapeHtml(q) + '”.</p>');
        return;
      }
      $.each(hits.slice(0, 6), function (_, p) {
        $out.append(
          '<a href="#.html">' +
            '<img src="' + p.img + '" alt="" width="44" height="44" loading="lazy">' +
            '<span>' + escapeHtml(p.title) + '</span>' +
            '<strong style="margin-inline-start:auto">' + money(p.price) + '</strong>' +
          '</a>'
        );
      });
    });

    $('#searchForm').on('submit', function (e) {
      e.preventDefault();
      toast('Search page par le jayein: /search?q=' + $('#searchInput').val());
    });

    /* Bahar click ya ESC se sab band */
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.nav__item, #searchPanel, #searchToggle').length) {
        $('.nav__item').removeClass('is-open');
        $('#searchPanel').prop('hidden', true);
        $('#searchToggle').attr('aria-expanded', false);
      }
    });
    $(document).on('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $('.nav__item').removeClass('is-open');
      $('#searchPanel').prop('hidden', true);
      closeDrawer();
      closeCart();
      closeModal();
    });
  }

  /* ================================================== 05. MOBILE DRAWER */
  function openDrawer() {
    $('#drawer').prop('hidden', false);
    setTimeout(function () { $('#drawer').addClass('is-open'); }, 10);
    $('#burger').attr('aria-expanded', true);
    lockScroll(true);
    $('#drawer').find('a, button').first().trigger('focus');
  }
  function closeDrawer() {
    var $d = $('#drawer');
    if (!$d.hasClass('is-open')) return;
    $d.removeClass('is-open');
    $('#burger').attr('aria-expanded', false);
    lockScroll(false);
    setTimeout(function () { $d.prop('hidden', true); }, 280);
  }
  function initDrawer() {
    $('#burger').on('click', openDrawer);
    $(document).on('click', '[data-close-drawer]', closeDrawer);

    /* Accordion sub-menu */
    $('#drawerNav').on('click', '.has-sub > .drawer__link', function () {
      var $li = $(this).parent();
      var open = $li.hasClass('is-open');
      $li.siblings().removeClass('is-open').find('.drawer__link').attr('aria-expanded', false);
      $li.toggleClass('is-open', !open);
      $(this).attr('aria-expanded', !open);
    });
  }

  /* ===================================================== 06. HERO SLIDER */
  function initHero() {
    var $track = $('#heroTrack');
    var $slides = $track.children();
    var total = $slides.length;
    var index = 0;
    var timer = null;
    var delay = 6000;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Dots */
    var $dots = $('#heroDots');
    for (var i = 0; i < total; i++) {
      $dots.append(
        '<button type="button" class="dot" role="tab" aria-label="Go to slide ' + (i + 1) + '" data-index="' + i + '"></button>'
      );
    }

    function go(n) {
      index = (n + total) % total;
      $track.css('transform', 'translateX(' + (-index * 100) + '%)');
      $dots.children().removeClass('is-active').eq(index).addClass('is-active');
      $slides.attr('aria-hidden', 'true').eq(index).attr('aria-hidden', 'false');
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function start() { if (!reduce && !timer && total > 1) timer = setInterval(next, delay); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    $('#heroNext').on('click', function () { next(); restart(); });
    $('#heroPrev').on('click', function () { prev(); restart(); });
    $dots.on('click', '.dot', function () { go(+$(this).data('index')); restart(); });

    /* Hover / focus par pause */
    $('#hero').on('mouseenter focusin', stop).on('mouseleave focusout', start);

    /* Keyboard */
    $('#hero').attr('tabindex', '0').on('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); restart(); }
      if (e.key === 'ArrowLeft') { prev(); restart(); }
    });

    /* Touch swipe */
    var startX = 0, deltaX = 0, dragging = false;
    $track.on('touchstart', function (e) {
      startX = e.originalEvent.touches[0].clientX; deltaX = 0; dragging = true; stop();
    });
    $track.on('touchmove', function (e) {
      if (!dragging) return;
      deltaX = e.originalEvent.touches[0].clientX - startX;
    });
    $track.on('touchend', function () {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(deltaX) > 45) { deltaX < 0 ? next() : prev(); }
      start();
    });

    /* Tab hidden ho to autoplay band */
    $(document).on('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    go(0);
    start();
  }

  /* ============================================ 07. PRODUCT CARDS + TABS */
  function cardHtml(p, i) {
    var pct = savePct(p.price, p.compare);
    var html = '';

    html += '<li><article class="card" data-id="' + p.id + '">';
    html +=   '<div class="card__media">';
    html +=     '<a href="#.html" aria-label="' + escapeHtml(p.title) + '" style="position:absolute;inset:0;z-index:1"></a>';
    html +=     '<img class="card__img card__img--main" src="' + p.img + '" alt="' + escapeHtml(p.title) + '"' +
                ' width="600" height="600" loading="' + (i < 2 ? 'eager' : 'lazy') + '">';
    if (p.img2) {
      html +=   '<img class="card__img card__img--alt" src="' + p.img2 + '" alt="" width="600" height="600" loading="lazy">';
    }
    html +=     '<div class="card__badges">';
    if (!p.stock)      html += '<span class="badge badge--soldout">Sold out</span>';
    else if (pct > 0)  html += '<span class="badge badge--sale">Save ' + pct + '%</span>';
    if (p.stock && p.tag) html += '<span class="badge" style="background:var(--gold);color:#26190A">' + escapeHtml(p.tag) + '</span>';
    html +=     '</div>';
    html +=     '<button type="button" class="card__quick js-quick" style="z-index:2">' +
                  '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
                  'Quick view</button>';
    html +=   '</div>';

    html +=   '<div class="card__body">';
    html +=     '<h3 class="card__title"><a href="#.html">' + escapeHtml(p.title) +
                (p.urdu ? ' <span dir="rtl" lang="ur">' + p.urdu + '</span>' : '') + '</a></h3>';
    html +=     '<div class="card__price"><span class="price-now">' + money(p.price) + '</span>';
    if (pct > 0) html += '<s class="price-was">' + money(p.compare) + '</s>';
    html +=     '</div>';
    html +=     '<button type="button" class="btn btn--primary card__atc js-add"' + (p.stock ? '' : ' disabled') + '>' +
                  '<span class="label">' + (p.stock ? 'Add to cart' : 'Sold out') + '</span></button>';
    html +=   '</div>';
    html += '</article></li>';
    return html;
  }

  function renderProducts(key) {
    var list = PRODUCTS[key] || [];
    var html = '';
    $.each(list, function (i, p) { html += cardHtml(p, i); });
    $('#productGrid').html(html).hide().fadeIn(220);
  }

  function initTabs() {
    renderProducts('coconut');

    $('.tabs').on('click', '.tab', function () {
      var $t = $(this);
      $t.addClass('is-active').attr('aria-selected', true)
        .siblings().removeClass('is-active').attr('aria-selected', false);
      renderProducts($t.data('tab'));
    });

    /* Keyboard: arrow keys se tabs */
    $('.tabs').on('keydown', '.tab', function (e) {
      var $tabs = $('.tabs .tab');
      var i = $tabs.index(this);
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % $tabs.length;
      if (e.key === 'ArrowLeft')  n = (i - 1 + $tabs.length) % $tabs.length;
      if (e.key === 'Home')       n = 0;
      if (e.key === 'End')        n = $tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      $tabs.eq(n).trigger('focus').trigger('click');
    });
  }

  /* ============================================================= 08. CART */
  var cart = [];

  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem('fmnCart')) || []; }
    catch (e) { cart = []; }
  }
  function saveCart() {
    try { localStorage.setItem('fmnCart', JSON.stringify(cart)); } catch (e) {}
  }
  function cartCount() {
    var n = 0; $.each(cart, function (_, l) { n += l.qty; }); return n;
  }
  function cartTotal() {
    var t = 0; $.each(cart, function (_, l) { t += l.qty * l.price; }); return t;
  }
  function renderCart() {
    var n = cartCount();
    $('#cartCount').text(n).prop('hidden', n === 0);
    $('#cartItems').text(n);
    $('#cartTotal').text(money(cartTotal()));

    var $body = $('#cartBody').empty();
    if (!cart.length) {
      $body.append('<p class="cart__empty">Your cart is empty.<br>Fresh coconuts are waiting 🥥</p>');
      return;
    }
    $.each(cart, function (_, l) {
      $body.append(
        '<div class="cart-line" data-id="' + l.id + '">' +
          '<img src="' + l.img + '" alt="" width="64" height="64" loading="lazy">' +
          '<div>' +
            '<p class="cart-line__title">' + escapeHtml(l.title) + '</p>' +
            '<p class="cart-line__price">' + money(l.price) + '</p>' +
            '<span class="cart-line__qty">' +
              '<button type="button" class="js-cart-qty" data-step="-1" aria-label="Decrease">−</button>' +
              '<span>' + l.qty + '</span>' +
              '<button type="button" class="js-cart-qty" data-step="1" aria-label="Increase">+</button>' +
            '</span>' +
          '</div>' +
          '<div style="text-align:end">' +
            '<strong>' + money(l.price * l.qty) + '</strong><br>' +
            '<button type="button" class="cart-line__remove js-cart-remove">Remove</button>' +
          '</div>' +
        '</div>'
      );
    });
  }
  function addToCart(item) {
    var existing = null;
    $.each(cart, function (_, l) { if (l.id === item.id) { existing = l; return false; } });
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    saveCart();
    renderCart();
  }
  function openCart() {
    $('#cart').prop('hidden', false);
    setTimeout(function () { $('#cart').addClass('is-open'); }, 10);
    lockScroll(true);
  }
  function closeCart() {
    var $c = $('#cart');
    if (!$c.hasClass('is-open')) return;
    $c.removeClass('is-open');
    lockScroll(false);
    setTimeout(function () { $c.prop('hidden', true); }, 300);
  }

  function initCart() {
    loadCart();
    renderCart();

    $('#cartToggle').on('click', openCart);
    $(document).on('click', '[data-close-cart]', closeCart);

    /* Card se add to cart — loading + success state ke saath */
    $(document).on('click', '.js-add', function () {
      var $btn = $(this);
      if ($btn.prop('disabled')) return;
      var p = findProduct($btn.closest('.card').data('id'));
      if (!p) return;
      var $label = $btn.find('.label');
      var original = $label.text();

      $btn.prop('disabled', true).prepend('<span class="spinner"></span>');
      $label.text('Adding…');

      /* Asli site par yahan AJAX call hogi (e.g. $.post('/cart/add.js', …)) */
      setTimeout(function () {
        $btn.find('.spinner').remove();
        $btn.addClass('is-done');
        $label.text('Added ✓');
        addToCart({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });
        toast(p.title + ' — cart mein add ho gaya');

        setTimeout(function () {
          $btn.removeClass('is-done').prop('disabled', false);
          $label.text(original);
        }, 1800);
      }, 600);
    });

    /* Cart line qty +/- */
    $(document).on('click', '.js-cart-qty', function () {
      var id = $(this).closest('.cart-line').data('id');
      var step = +$(this).data('step');
      $.each(cart, function (_, l) {
        if (l.id === id) { l.qty = Math.max(1, l.qty + step); return false; }
      });
      saveCart(); renderCart();
    });

    /* Remove */
    $(document).on('click', '.js-cart-remove', function () {
      var id = $(this).closest('.cart-line').data('id');
      cart = $.grep(cart, function (l) { return l.id !== id; });
      saveCart(); renderCart();
      toast('Item cart se hata diya gaya');
    });
  }

  /* ================================================== 09. QUICK VIEW MODAL */
  function openModal(html) {
    $('#qvContent').html(html);
    $('#quickView').prop('hidden', false);
    setTimeout(function () { $('#quickView').addClass('is-open'); }, 10);
    lockScroll(true);
    $('#quickView').find('.modal__close').trigger('focus');
  }
  function closeModal() {
    var $m = $('#quickView');
    if (!$m.hasClass('is-open')) return;
    $m.removeClass('is-open');
    lockScroll(false);
    setTimeout(function () { $m.prop('hidden', true); }, 250);
  }
  function initQuickView() {
    $(document).on('click', '.js-quick', function (e) {
      e.preventDefault();
      var p = findProduct($(this).closest('.card').data('id'));
      if (!p) return;
      var pct = savePct(p.price, p.compare);

      var html = '<div class="qv">' +
        '<div><img src="' + p.img + '" alt="' + escapeHtml(p.title) + '" width="600" height="600"></div>' +
        '<div>' +
          '<h3 id="qvTitle">' + escapeHtml(p.title) +
            (p.urdu ? ' <span dir="rtl" lang="ur">' + p.urdu + '</span>' : '') + '</h3>' +
          '<div class="qv__price"><span class="price-now" style="font-size:1.35rem">' + money(p.price) + '</span>' +
            (pct > 0 ? '<s class="price-was">' + money(p.compare) + '</s><span class="badge badge--sale">Save ' + pct + '%</span>' : '') +
          '</div>' +
          '<p class="qv__desc">' + escapeHtml(p.desc || '') + '</p>' +
          '<div class="qty"><button type="button" class="qty__btn js-qv-step" data-step="-1" aria-label="Decrease">−</button>' +
            '<input type="number" class="qty__input" id="qvQty" value="1" min="1" aria-label="Quantity">' +
            '<button type="button" class="qty__btn js-qv-step" data-step="1" aria-label="Increase">+</button></div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-block-start:16px">' +
            '<button type="button" class="btn btn--primary js-qv-add" data-id="' + p.id + '"' + (p.stock ? '' : ' disabled') + '>' +
              (p.stock ? 'Add to cart' : 'Sold out') + '</button>' +
            '<a class="btn btn--gold" href="checkout.html">Buy now</a>' +
          '</div>' +
          '<a class="qv__full" href="#.html">View full details →</a>' +
        '</div>' +
      '</div>';

      openModal(html);
    });

    $(document).on('click', '[data-close-modal]', closeModal);

    $(document).on('click', '.js-qv-step', function () {
      var $i = $('#qvQty');
      $i.val(Math.max(1, (+$i.val() || 1) + (+$(this).data('step'))));
    });

    $(document).on('click', '.js-qv-add', function () {
      var p = findProduct($(this).data('id'));
      if (!p) return;
      addToCart({ id: p.id, title: p.title, price: p.price, img: p.img, qty: Math.max(1, +$('#qvQty').val() || 1) });
      closeModal();
      openCart();
      toast(p.title + ' — cart mein add ho gaya');
    });
  }

  /* ======================================================= 10. SPOTLIGHT */
  function initSpotlight() {
    var $box = $('.spotlight__content');
    if (!$box.length) return;

    function current() {
      var $opt = $('#spotVariant option:selected');
      return {
        price: +$opt.data('price'),
        compare: +$opt.data('compare') || 0,
        variant: $opt.val()
      };
    }
    function sync() {
      var v = current();
      var pct = savePct(v.price, v.compare);
      $('#spotPrice').text(money(v.price));
      $('#spotCompare').text(pct ? money(v.compare) : '').toggle(pct > 0);
      $('#spotSave').text(pct ? 'Save ' + pct + '%' : '').toggle(pct > 0);
    }

    $('#spotVariant').on('change', sync);

    $box.on('click', '.qty__btn', function () {
      var $i = $('#spotQty');
      $i.val(Math.max(1, (+$i.val() || 1) + (+$(this).data('step'))));
    });

    $box.on('click', '.js-spot-add, .js-spot-buy', function () {
      var buyNow = $(this).hasClass('js-spot-buy');
      var v = current();
      addToCart({
        id: $box.data('product-id') + '-' + v.variant,
        title: $box.data('title') + ' — ' + v.variant,
        price: v.price,
        img: $box.data('image'),
        qty: Math.max(1, +$('#spotQty').val() || 1)
      });
      if (buyNow) { window.location.href = 'checkout.html'; return; }
      openCart();
      toast('Saffron cart mein add ho gaya');
    });

    sync();
  }

  /* ================================================== 11. BRAND VIDEO */
  function initVideo() {
    $('#videoPlay').on('click', function () {
      /* YouTube sirf click ke baad load hoti hai — pehle load par 0 KB */
      var id = 'ScMzIvxBSi4'; /* <-- apni video ID yahan dalein */
      $('#videoBox').html(
        '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1" ' +
        'title="FM Nature brand film" width="1280" height="720" allow="autoplay; encrypted-media; picture-in-picture" ' +
        'allowfullscreen></iframe>'
      );
    });
  }

  /* ================================================== 12. REVIEWS SLIDER */
  function initReviews() {
    var $track = $('#reviewsTrack');
    var $slides = $track.children();
    var total = $slides.length;
    var index = 0;
    var timer = null;

    function perView() {
      if (window.matchMedia('(min-width: 1024px)').matches) return 3;
      if (window.matchMedia('(min-width: 768px)').matches) return 2;
      return 1;
    }
    function maxIndex() { return Math.max(0, total - perView()); }

    function buildDots() {
      var $d = $('#revDots').empty();
      for (var i = 0; i <= maxIndex(); i++) {
        $d.append('<button type="button" class="dot" aria-label="Review group ' + (i + 1) + '" data-index="' + i + '"></button>');
      }
      paint();
    }
    function paint() {
      $('#revDots').children().removeClass('is-active').eq(index).addClass('is-active');
    }
    function go(n) {
      index = Math.min(Math.max(n, 0), maxIndex());
      $track.css('transform', 'translateX(' + (-index * (100 / perView())) + '%)');
      paint();
    }
    function next() { go(index >= maxIndex() ? 0 : index + 1); }
    function start() { if (!timer) timer = setInterval(next, 6500); }
    function stop() { clearInterval(timer); timer = null; }

    $('#revNext').on('click', function () { next(); stop(); start(); });
    $('#revPrev').on('click', function () { go(index - 1); stop(); start(); });
    $('#revDots').on('click', '.dot', function () { go(+$(this).data('index')); stop(); start(); });
    $('#reviews').on('mouseenter focusin', stop).on('mouseleave focusout', start);

    var rStart = 0, rDelta = 0;
    $track.on('touchstart', function (e) { rStart = e.originalEvent.touches[0].clientX; stop(); });
    $track.on('touchmove', function (e) { rDelta = e.originalEvent.touches[0].clientX - rStart; });
    $track.on('touchend', function () {
      if (Math.abs(rDelta) > 45) { rDelta < 0 ? next() : go(index - 1); }
      rDelta = 0; start();
    });

    var resizeTimer;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { index = 0; buildDots(); go(0); }, 180);
    });

    buildDots();
    go(0);
    start();
  }

  /* ====================================== 13. FAQ / FOOTER / NEWSLETTER */
  function initFaq() {
    /* Ek waqt mein sirf ek answer khula rahe */
    $('#faqList').on('click', 'summary', function () {
      var $item = $(this).parent();
      $('#faqList > details').not($item).removeAttr('open');
    });
  }

  function initFooter() {
    $('#year').text(new Date().getFullYear());

    function syncFooter() {
      var desktop = window.matchMedia('(min-width: 1024px)').matches;
      $('.js-footer-acc').toggleClass('is-open', desktop);
    }
    syncFooter();
    $(window).on('resize', syncFooter);

    $('.js-footer-acc').on('click', '.footer__title', function () {
      if (window.matchMedia('(min-width: 1024px)').matches) return;
      $(this).parent().toggleClass('is-open');
    });
  }

  function initNewsletter() {
    $('#newsletterForm').on('submit', function (e) {
      e.preventDefault();
      var email = $.trim($('#nlEmail').val());
      var $msg = $('#nlMsg').removeClass('is-ok is-error');
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (!ok) {
        $msg.addClass('is-error').text('Sahi email address likhein.');
        $('#nlEmail').trigger('focus');
        return;
      }
      /* Asli site par: $.post('/subscribe', {email: email}) */
      $msg.addClass('is-ok').text('Shukriya! Discount code aapke inbox mein bhej diya gaya hai.');
      this.reset();
      toast('Newsletter subscribe ho gaya 🎉');
    });
  }

  /* ============================================================ 14. INIT */
  $(function () {
    initAnnounce();
    initHeader();
    initDrawer();
    initHero();
    initTabs();
    initCart();
    initQuickView();
    initSpotlight();
    initVideo();
    initReviews();
    initFaq();
    initFooter();
    initNewsletter();
  });

})(jQuery);
