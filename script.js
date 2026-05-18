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

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

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

})();
