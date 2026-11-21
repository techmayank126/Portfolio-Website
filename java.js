const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');
const typingEl = document.getElementById('typing');
const copyEmailBtn = document.getElementById('copyEmail');
const copyNumberBtn = document.getElementById('copyNumber');
const copyStatus = document.getElementById('copyStatus');
const yearEl = document.getElementById('year');
const eventSlideImage = document.getElementById('eventSlideImage');
const eventSlideVideo = document.getElementById('eventSlideVideo');
const eventVideoFallback = document.getElementById('eventVideoFallback');
const eventVideoLink = document.getElementById('eventVideoLink');
const eventSlideStatus = document.getElementById('eventSlideStatus');
const eventPrevious = document.getElementById('eventPrevious');
const eventNext = document.getElementById('eventNext');
const eventAutoplay = document.getElementById('eventAutoplay');
const eventPhotoDialog = document.getElementById('eventPhotoDialog');
const eventPhotoPreview = document.getElementById('eventPhotoPreview');
const eventPhotoTitle = document.getElementById('eventPhotoTitle');
const eventPhotoDownload = document.getElementById('eventPhotoDownload');
const eventPhotoClose = document.getElementById('eventPhotoClose');

const words = ['Creative Developer', 'Frontend Developer', 'Tech Enthusiast', 'Problem Solver'];
const eventMedia = Array.from({ length: 25 }, (_, index) => {
  const number = index + 1;
  const slides = [{
    type: 'photo',
    src: `images/samsungevent (${number}).jpeg`,
    alt: `Samsung AI Masterclass event photo ${number}`
  }];

  if (number <= 5) {
    slides.push({
      type: 'video',
      src: `videos/samsungevent (${number}).mp4`,
      alt: `Samsung AI Masterclass event video ${number}`
    });
  }

  return slides;
}).flat();
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentEventSlide = 0;
let eventAutoplayTimer;
let isEventAutoplayEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('themePreference', theme);
}

function typeLoop() {
  if (!typingEl) return;

  const currentWord = words[wordIndex % words.length];

  if (isDeleting) {
    typingEl.textContent = currentWord.slice(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      charIndex = 0;
    }
  } else {
    typingEl.textContent = currentWord.slice(0, charIndex++);
    if (charIndex > currentWord.length) {
      isDeleting = true;
      setTimeout(typeLoop, 800);
      return;
    }
  }

  const delay = isDeleting ? 60 : 120;
  setTimeout(typeLoop, delay);
}

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function scheduleEventAutoplay() {
  clearTimeout(eventAutoplayTimer);
  if (!isEventAutoplayEnabled || eventMedia[currentEventSlide].type === 'video') return;

  eventAutoplayTimer = setTimeout(() => {
    showEventSlide(currentEventSlide + 1);
  }, 5000);
}

function playEventVideo() {
  const slideIndex = currentEventSlide;
  eventSlideVideo.play().catch((error) => {
    if (slideIndex !== currentEventSlide || !isEventAutoplayEnabled) return;
    if (error.name === 'AbortError') return;
    if (error.name === 'NotAllowedError') {
      eventSlideStatus.textContent = `${currentEventSlide + 1} / ${eventMedia.length} · Press play for audio`;
      return;
    }

    eventSlideStatus.textContent = `${currentEventSlide + 1} / ${eventMedia.length} · Video unavailable`;
    eventVideoFallback.hidden = false;
    console.error('Event video playback failed.', error);
  });
}

function showEventSlide(index) {
  currentEventSlide = (index + eventMedia.length) % eventMedia.length;
  const slide = eventMedia[currentEventSlide];
  const isVideo = slide.type === 'video';

  eventSlideVideo.pause();
  eventVideoFallback.hidden = true;
  eventSlideVideo.hidden = !isVideo;
  eventSlideImage.hidden = isVideo;

  if (isVideo) {
    eventSlideVideo.src = slide.src;
    eventVideoLink.href = slide.src;
    eventSlideVideo.load();
  } else {
    eventSlideVideo.removeAttribute('src');
    eventSlideVideo.load();
    eventSlideImage.src = slide.src;
    eventSlideImage.alt = slide.alt;
  }

  eventSlideStatus.textContent = `${currentEventSlide + 1} / ${eventMedia.length} · ${isVideo ? 'Video' : 'Photo'}`;
  scheduleEventAutoplay();
}

function setActiveLink() {
  const sections = document.querySelectorAll('main section[id]');
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      currentId = section.id;
    }
  });

  navItems.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

async function copyText(value, successText) {
  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = successText;
  } catch (error) {
    copyStatus.textContent = 'Copy failed. Please copy manually.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('themePreference');
  const selectedTheme = savedTheme === 'dark' ? 'dark' : 'light';
  setTheme(selectedTheme);

  const skillsGrid = document.querySelector('.skills-list');
  if (
    skillsGrid &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.1
    });

    skillsGrid.classList.add('skills-reveal');
    skillsGrid.querySelectorAll('.skill-card').forEach((card) => {
      skillObserver.observe(card);
    });
  }

  const skillCards = document.querySelectorAll('.skill-card');
  const skillChartGrid = document.getElementById('skillChartGrid');
  const skillCharts = [];

  if (skillCards.length && skillChartGrid) {
    skillCards.forEach((card) => {
      const chart = document.createElement('div');
      chart.className = 'skill-chart';
      chart.dataset.name = card.dataset.name;
      if (card.classList.contains('active')) chart.classList.add('active');

      const ring = document.createElement('div');
      ring.className = 'skill-chart-ring';
      ring.setAttribute('role', 'progressbar');
      ring.setAttribute('aria-label', `${card.dataset.name} proficiency`);
      ring.setAttribute('aria-valuemin', '0');
      ring.setAttribute('aria-valuemax', '100');
      ring.setAttribute('aria-valuenow', '0');
      ring.style.setProperty('--skill-level', '0');

      const value = document.createElement('span');
      value.className = 'skill-chart-value';
      value.textContent = '0%';
      ring.appendChild(value);

      const name = document.createElement('span');
      name.className = 'skill-chart-name';
      name.textContent = card.dataset.name;

      chart.append(ring, name);
      skillChartGrid.appendChild(chart);
      skillCharts.push({ chart, ring, value, card });
    });

    function animateSkillChart(item, delay) {
      const target = Number(item.card.dataset.value);
      setTimeout(() => {
        item.chart.classList.add('is-visible');
        item.ring.style.setProperty('--skill-level', target);
        const start = performance.now();
        const duration = 900;

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = target * eased;
          item.value.textContent = `${Number.isInteger(target)
            ? Math.round(currentValue)
            : currentValue.toFixed(1)}%`;
          item.ring.setAttribute('aria-valuenow', String(currentValue.toFixed(1)));
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      }, delay);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      skillCharts.forEach((item) => {
        const value = item.card.dataset.value;
        item.chart.classList.add('is-visible');
        item.ring.style.setProperty('--skill-level', value);
        item.ring.setAttribute('aria-valuenow', value);
        item.value.textContent = `${value}%`;
      });
    } else {
      const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillCharts.forEach((item, index) => {
              animateSkillChart(item, index * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      chartObserver.observe(skillChartGrid);
    }

    skillCards.forEach((card) => {
      card.addEventListener('click', () => {
        skillCards.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        skillCharts.forEach((item) => item.chart.classList.remove('active'));
        card.classList.add('active');
        card.setAttribute('aria-pressed', 'true');
        const selectedChart = skillCharts.find((item) => item.card === card);
        if (selectedChart) selectedChart.chart.classList.add('active');
      });
    });
  }

  if (eventPhotoDialog && eventPhotoPreview && eventPhotoTitle && eventPhotoDownload && eventPhotoClose) {
    document.querySelectorAll('.event-feature-photo').forEach((photoButton) => {
      photoButton.addEventListener('click', () => {
        const thumbnail = photoButton.querySelector('img');
        eventPhotoPreview.src = thumbnail.src;
        eventPhotoPreview.alt = thumbnail.alt;
        eventPhotoTitle.textContent = thumbnail.alt;
        eventPhotoDownload.href = thumbnail.src;
        eventPhotoDialog.showModal();
      });
    });

    eventPhotoClose.addEventListener('click', () => {
      eventPhotoDialog.close();
    });

    eventPhotoDialog.addEventListener('click', (event) => {
      if (event.target === eventPhotoDialog) {
        eventPhotoDialog.close();
      }
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  if (eventSlideImage && eventSlideVideo && eventVideoFallback && eventVideoLink && eventSlideStatus && eventPrevious && eventNext && eventAutoplay) {
    eventAutoplay.textContent = isEventAutoplayEnabled ? 'Ⅱ' : '▶';
    eventAutoplay.setAttribute(
      'aria-label',
      isEventAutoplayEnabled ? 'Pause slideshow' : 'Play slideshow'
    );
    eventPrevious.addEventListener('click', () => showEventSlide(currentEventSlide - 1));
    eventNext.addEventListener('click', () => showEventSlide(currentEventSlide + 1));
    eventAutoplay.addEventListener('click', () => {
      isEventAutoplayEnabled = !isEventAutoplayEnabled;
      eventAutoplay.textContent = isEventAutoplayEnabled ? 'Ⅱ' : '▶';
      eventAutoplay.setAttribute(
        'aria-label',
        isEventAutoplayEnabled ? 'Pause slideshow' : 'Play slideshow'
      );
      if (isEventAutoplayEnabled) {
        if (eventMedia[currentEventSlide].type === 'video') {
          playEventVideo();
        } else {
          scheduleEventAutoplay();
        }
      } else {
        clearTimeout(eventAutoplayTimer);
        eventSlideVideo.pause();
      }
    });
    eventSlideVideo.addEventListener('ended', () => {
      if (isEventAutoplayEnabled) {
        showEventSlide(currentEventSlide + 1);
      }
    });
    eventSlideVideo.addEventListener('error', () => {
      if (eventSlideVideo.hidden || eventMedia[currentEventSlide].type !== 'video') return;
      eventVideoFallback.hidden = false;
      eventSlideStatus.textContent = `${currentEventSlide + 1} / ${eventMedia.length} · Video unavailable`;
    });
    scheduleEventAutoplay();
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = document.getElementById('emailText')?.textContent.trim();
      if (email) {
        copyText(email, 'Email copied to clipboard.');
      }
    });
  }

  if (copyNumberBtn) {
    copyNumberBtn.addEventListener('click', () => {
      const number = document.getElementById('whatsappNumber')?.textContent.trim();
      if (number) {
        copyText(number, 'Phone number copied to clipboard.');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
  typeLoop();
});
