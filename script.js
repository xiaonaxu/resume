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

  // ====== Cursor Trail Particles ======
  var canvas = document.getElementById('cursorTrail');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouseX = -100;
  var mouseY = -100;
  var lastSpawn = 0;
  var W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hide when mouse leaves
  document.addEventListener('mouseleave', function () {
    mouseX = -100;
    mouseY = -100;
  });

  // Spawn particles
  function spawnParticle(x, y) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 0.3 + Math.random() * 1.2;
    var colors = ['#c17f59', '#d4a574', '#e0b98a', '#f0d5b8', '#e8a87c', '#c9956b'];
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.3,
      life: 1,
      decay: 0.008 + Math.random() * 0.02,
      size: 2 + Math.random() * 3.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animateParticles(ts) {
    ctx.clearRect(0, 0, W, H);

    // Spawn near cursor
    if (mouseX > 0 && mouseY > 0 && ts - lastSpawn > 16) {
      var count = Math.floor(Math.random() * 2) + 1;
      for (var j = 0; j < count; j++) {
        spawnParticle(mouseX + (Math.random() - 0.5) * 12, mouseY + (Math.random() - 0.5) * 8);
      }
      lastSpawn = ts;
    }

    // Update and draw
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.01; // subtle gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.7;
      ctx.fill();

      // Soft glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.12;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(animateParticles);
  }

  requestAnimationFrame(animateParticles);

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

  // ====== PDF Viewer ======
  var pdfOverlay = document.getElementById('pdfOverlay');
  var pdfFrame = document.getElementById('pdfFrame');
  var pdfLoading = document.getElementById('pdfLoading');

  pdfFrame.addEventListener('load', function () {
    pdfLoading.style.display = 'none';
    pdfFrame.classList.add('loaded');
  });

  document.getElementById('previewResume').addEventListener('click', function () {
    pdfLoading.style.display = '';
    pdfFrame.classList.remove('loaded');
    pdfFrame.src = '许晓娜简历.pdf';
    pdfOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closePdf() {
    pdfOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      pdfFrame.src = '';
      pdfFrame.classList.remove('loaded');
    }, 400);
  }

  document.getElementById('pdfClose').addEventListener('click', closePdf);

  pdfOverlay.addEventListener('click', function (e) {
    if (e.target === pdfOverlay) closePdf();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pdfOverlay.classList.contains('open')) closePdf();
  });

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

  // ====== Mascot Pet ======
  var mascotPet = document.getElementById('mascotPet');
  var mascotVideo = document.getElementById('mascotVideo');
  var mascotPreloaded = false;

  function preloadMascot() {
    if (mascotPreloaded) return;
    mascotPreloaded = true;
    mascotVideo.muted = true;
    mascotVideo.play().catch(function () {
      // Retry on next interaction
      mascotPreloaded = false;
    });
  }

  // Try immediately
  preloadMascot();

  // Also try on any interaction as fallback
  document.addEventListener('click', preloadMascot, { once: true });
  document.addEventListener('scroll', preloadMascot, { once: true });

  // Button bounces the pet with audio
  var mascotBtn = document.getElementById('showMascot');
  mascotBtn.addEventListener('click', function (e) {
    e.preventDefault();
    preloadMascot();
    mascotPet.classList.remove('bounce');
    void mascotPet.offsetWidth;
    mascotPet.classList.add('bounce');
    mascotPet.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Pause, unmute, restart with sound (user-click triggered)
    mascotVideo.pause();
    mascotVideo.muted = false;
    mascotVideo.currentTime = 0;
    mascotVideo.play().then(function () {
      // Re-mute after playback
      setTimeout(function () {
        mascotVideo.muted = true;
      }, 4000);
    }).catch(function () {
      mascotVideo.muted = true;
    });
  });

  // Dragging
  var dragging = false, dragStartX, dragStartY, petStartX, petStartY;
  mascotPet.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    var rect = mascotPet.getBoundingClientRect();
    petStartX = rect.left;
    petStartY = rect.top;
    mascotPet.style.animation = 'none';
    mascotPet.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - dragStartX;
    var dy = e.clientY - dragStartY;
    mascotPet.style.right = 'auto';
    mascotPet.style.bottom = 'auto';
    mascotPet.style.left = (petStartX + dx) + 'px';
    mascotPet.style.top = (petStartY + dy) + 'px';
  });

  document.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    mascotPet.style.transition = '';
    mascotPet.style.animation = '';
  });

  // Touch drag
  mascotPet.addEventListener('touchstart', function (e) {
    dragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    var rect = mascotPet.getBoundingClientRect();
    petStartX = rect.left;
    petStartY = rect.top;
    mascotPet.style.animation = 'none';
    mascotPet.style.transition = 'none';
  }, { passive: false });

  document.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    var dx = e.touches[0].clientX - dragStartX;
    var dy = e.touches[0].clientY - dragStartY;
    mascotPet.style.right = 'auto';
    mascotPet.style.bottom = 'auto';
    mascotPet.style.left = (petStartX + dx) + 'px';
    mascotPet.style.top = (petStartY + dy) + 'px';
  }, { passive: false });

  document.addEventListener('touchend', function () {
    if (!dragging) return;
    dragging = false;
    mascotPet.style.transition = '';
    mascotPet.style.animation = '';
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
