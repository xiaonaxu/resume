(function () {
  'use strict';

  // ====== Loader ======
  var loader = document.getElementById('loader');
  var loaderHidden = false;
  var startTime = Date.now();
  var MIN_SHOW = 2000;

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    loader.classList.add('fade-out');
    setTimeout(function () {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 600);
  }

  function scheduleHide() {
    var elapsed = Date.now() - startTime;
    var delay = Math.max(400, MIN_SHOW - elapsed);
    setTimeout(hideLoader, delay);
  }

  if (document.readyState === 'complete') {
    scheduleHide();
  } else {
    window.addEventListener('load', scheduleHide);
  }

  // Fallback: hide loader after 8s even if page hasn't fully loaded
  setTimeout(hideLoader, 8000);

  // ====== Theme Toggle ======
  var themeToggle = document.getElementById('themeToggle');
  var html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.classList.toggle('dark', theme === 'dark');
  }

  // Init theme
  var saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  themeToggle.addEventListener('click', function () {
    var current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ====== Elements ======
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');
  var allNavLinks = navLinks.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  // ====== Mobile menu ======
  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
  });

  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });

  // ====== Nav style switch + active highlight ======
  function updateNav() {
    var heroSection = document.getElementById('hero');
    var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    var pastHero = window.scrollY > heroBottom - 60;

    // Toggle nav background style
    nav.classList.toggle('on-content', pastHero);

    // Active section
    var scrollPos = window.scrollY + 100;
    var current = '';
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', function () {
    updateNav();

    // Scroll progress
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.getElementById('scrollProgress').style.width = progress + '%';

    // Back to top
    var backToTop = document.getElementById('backToTop');
    if (scrollTop > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });
  updateNav();

  // Back to top click
  document.getElementById('backToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ====== Scroll reveal ======
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.edu-card, .exp-card, .skill-card, .learn-card, .about-right'
  ).forEach(function (el) {
    el.classList.add('reveal');
    obs.observe(el);
  });

  // ====== Number Count-up ======
  var numElements = document.querySelectorAll('.num-rise');
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-target'));
      if (isNaN(target)) return;
      var duration = 1500;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        // Ease-out
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        if (target >= 100 && target % 1 === 0) {
          el.textContent = Math.floor(current);
        } else if (target < 100) {
          el.textContent = current.toFixed(1);
        } else {
          el.textContent = Math.floor(current);
        }
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target % 1 === 0 ? target : target.toFixed(1);
        }
      }
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.4 });

  numElements.forEach(function (el) { countObs.observe(el); });

  // ====== Highlight reveal ======
  var highlights = document.querySelectorAll('.highlight');
  var hlObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        hlObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  highlights.forEach(function (el) { hlObs.observe(el); });

  // ====== Gallery ======
  var photoFiles = [
    '微信图片_20260518213903.jpg',
    '微信图片_20260518213927.jpg',
    '微信图片_20260518214126.jpg',
    '微信图片_202605182141261.jpg',
    '微信图片_2026051821412610.jpg',
    '微信图片_2026051821412611.jpg',
    '微信图片_2026051821412612.jpg',
    '微信图片_2026051821412613.jpg',
    '微信图片_2026051821412614.jpg',
    '微信图片_202605182141262.jpg',
    '微信图片_202605182141263.jpg',
    '微信图片_202605182141264.jpg',
    '微信图片_202605182141265.jpg',
    '微信图片_202605182141266.jpg',
    '微信图片_202605182141267.jpg',
    '微信图片_202605182141268.jpg',
    '微信图片_202605182141269.jpg'
  ];
  var thumbs = photoFiles.map(function (f) { return 'zhijiao-photos/thumb/' + f; });
  var fulls  = photoFiles.map(function (f) { return 'zhijiao-photos/' + f; });
  var currentIndex = 0;
  var galleryBuilt = false;

  function buildGallery() {
    if (galleryBuilt) return;
    galleryBuilt = true;
    var galleryGrid = document.getElementById('galleryGrid');
    fulls.forEach(function (fullSrc, idx) {
      var item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = '<div class="gallery-shimmer"></div><img src="' + thumbs[idx] + '" alt="支教照片 ' + (idx + 1) + '" loading="lazy">';
      item.addEventListener('click', function () { openLightbox(idx); });
      galleryGrid.appendChild(item);

      // Preload full image silently, swap in later
      var fullImg = new Image();
      fullImg.onload = function () {
        var imgEl = item.querySelector('img');
        if (imgEl) { imgEl.src = fullSrc; item.classList.add('loaded'); }
      };
      fullImg.src = fullSrc;
    });
  }

  // Open gallery
  var galleryOverlay = document.getElementById('galleryOverlay');
  var openBtn = document.getElementById('openGallery');

  // Preload thumbnails on button hover (desktop)
  openBtn.addEventListener('mouseenter', function () {
    thumbs.forEach(function (src) {
      var pre = new Image();
      pre.src = src;
    });
  });

  openBtn.addEventListener('click', function () {
    buildGallery();
    galleryOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      var items = galleryGrid.querySelectorAll('.gallery-item');
      items.forEach(function (item, i) {
        setTimeout(function () { item.classList.add('revealed'); }, i * 35);
      });
    });
  });

  document.getElementById('galleryClose').addEventListener('click', function () {
    galleryOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  galleryOverlay.addEventListener('click', function (e) {
    if (e.target === galleryOverlay) {
      galleryOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCounter = document.getElementById('lightboxCounter');

  function openLightbox(idx) {
    currentIndex = idx;
    lightboxImg.src = fulls[idx];
    lightboxCounter.textContent = (idx + 1) + ' / ' + fulls.length;
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  function navLightbox(dir) {
    currentIndex = (currentIndex + dir + fulls.length) % fulls.length;
    lightboxImg.src = fulls[currentIndex];
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + fulls.length;
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function () { navLightbox(-1); });
  document.getElementById('lightboxNext').addEventListener('click', function () { navLightbox(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open') && !galleryOverlay.classList.contains('open')) return;
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('open')) closeLightbox();
      else {
        galleryOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
    if (e.key === 'ArrowLeft' && lightbox.classList.contains('open')) navLightbox(-1);
    if (e.key === 'ArrowRight' && lightbox.classList.contains('open')) navLightbox(1);
  });

  // Touch swipe for lightbox
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', function (e) {
    var diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) navLightbox(diff < 0 ? 1 : -1);
  });

  // ====== 3D Tilt ======
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) {
    var tiltCards = document.querySelectorAll('.exp-card, .skill-card');
    var TILT_MAX = 6;

    tiltCards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rx = ((y / rect.height) - 0.5) * -TILT_MAX;
        var ry = ((x / rect.width) - 0.5) * TILT_MAX;
        card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(1.02,1.02,1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = '';
      });
    });
  }

})();
