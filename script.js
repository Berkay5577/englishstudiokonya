/* ========================================
   ENGLISH STUDIO - MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initQuickContactForm();
  initCounters();
  initTestimonialsSlider();
  initQuiz();
  initContactForm();
  initFloatingWords();
});

/* ---------- HEADER SCROLL ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ---------- QUICK CONTACT FORM ---------- */
function initQuickContactForm() {
  const form = document.getElementById('quickContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();

    if (!name || !phone) {
      showToast('Lütfen tüm alanları doldurun.', 'error');
      return;
    }

    // Simulate submission
    const btn = form.querySelector('.btn-quick');
    const originalText = btn.textContent;
    btn.textContent = 'Gönderiliyor...';
    btn.disabled = true;

    setTimeout(() => {
      showToast('Bilgileriniz alındı! En kısa sürede sizi arayacağız. 📞');
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
}

/* ---------- ANIMATED COUNTERS ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length === 0) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(easeProgress * (target - start) + start);
    element.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ---------- TESTIMONIALS SLIDER ---------- */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (!slider || !prevBtn || !nextBtn) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  let currentIndex = 0;

  function getVisibleCards() {
    const width = window.innerWidth;
    if (width > 1024) return 3;
    if (width > 768) return 2;
    return 1;
  }

  function updateSlider() {
    const visible = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    currentIndex = Math.min(currentIndex, maxIndex);
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);
    slider.style.transform = `translateX(-${offset}px)`;
    slider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    const visible = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener('resize', updateSlider);

  // Auto-slide
  let autoSlide = setInterval(() => {
    const visible = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  }, 5000);

  slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      const visible = getVisibleCards();
      const maxIndex = Math.max(0, cards.length - visible);
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateSlider();
    }, 5000);
  });
}

/* ---------- MINI QUIZ ---------- */
function initQuiz() {
  const quizContainer = document.getElementById('quizContainer');
  if (!quizContainer) return;

  const questions = [
    {
      question: '"I ____ to the cinema yesterday." cümlesini tamamlayın:',
      options: ['go', 'went', 'gone', 'going'],
      correct: 1
    },
    {
      question: '"She is ____ than her brother." cümlesini tamamlayın:',
      options: ['tall', 'more tall', 'taller', 'tallest'],
      correct: 2
    },
    {
      question: '"What colour will you paint the children\'s bedroom?" cümlesinin Türkçe karşılığı nedir?',
      options: [
        'Çocukların odasını ne zaman boyayacaksın?',
        'Çocukların yatak odasını ne renge boyayacaksın?',
        'Çocukların odasını kim boyayacak?',
        'Çocukların yatak odası ne renk?'
      ],
      correct: 1
    },
    {
      question: '"I can\'t understand this email." cümlesinde eksik olan kelime hangisi?',
      options: ['can', 'do', 'am', 'Eksik kelime yok'],
      correct: 3
    },
    {
      question: '"She ____ English for five years." cümlesini tamamlayın:',
      options: ['learns', 'has been learning', 'learned', 'is learning'],
      correct: 1
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const progressSteps = quizContainer.querySelectorAll('.quiz-progress .step');
  const questionElements = quizContainer.querySelectorAll('.quiz-question');
  const resultElement = quizContainer.querySelector('.quiz-result');
  const nextBtn = quizContainer.querySelector('.quiz-next');
  const restartBtn = quizContainer.querySelector('.quiz-restart');

  function showQuestion(index) {
    questionElements.forEach((q, i) => {
      q.classList.toggle('active', i === index);
    });

    progressSteps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
      step.classList.toggle('done', i < index);
    });

    answered = false;
    if (nextBtn) nextBtn.style.display = 'none';
  }

  // Setup option clicks
  questionElements.forEach((q, qIndex) => {
    const options = q.querySelectorAll('.quiz-option');
    options.forEach((opt, optIndex) => {
      opt.addEventListener('click', () => {
        if (answered) return;
        answered = true;

        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        if (optIndex === questions[qIndex].correct) {
          opt.classList.add('correct');
          score++;
        } else {
          opt.classList.add('wrong');
          options[questions[qIndex].correct].classList.add('correct');
        }

        if (nextBtn) {
          nextBtn.style.display = 'inline-flex';
          nextBtn.textContent = currentQuestion < questions.length - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör 🎉';
        }
      });
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!answered) return;

      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
      } else {
        // Show result
        questionElements.forEach(q => q.classList.remove('active'));
        progressSteps.forEach(s => s.classList.add('done'));
        if (resultElement) {
          resultElement.classList.add('active');
          const scoreCircle = resultElement.querySelector('.score-circle');
          if (scoreCircle) scoreCircle.textContent = `${score}/${questions.length}`;

          const resultTitle = resultElement.querySelector('h3');
          const resultDesc = resultElement.querySelector('p');

          if (score <= 1) {
            resultTitle.textContent = 'Başlangıç Seviyesi 🌱';
            resultDesc.textContent = 'İngilizce yolculuğunuza bizimle başlayın! İlk 12 ders ücretsiz.';
          } else if (score <= 3) {
            resultTitle.textContent = 'Orta Seviye 📚';
            resultDesc.textContent = 'Güzel bir temeliniz var! Konuşma pratiği ile çok daha ileriye gidebilirsiniz.';
          } else {
            resultTitle.textContent = 'İleri Seviye 🌟';
            resultDesc.textContent = 'Tebrikler! Cambridge sınavlarına hazırlanarak seviyenizi belgeleyebilirsiniz.';
          }
        }
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      answered = false;

      questionElements.forEach(q => {
        q.classList.remove('active');
        q.querySelectorAll('.quiz-option').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'wrong');
        });
      });

      progressSteps.forEach(s => {
        s.classList.remove('active', 'done');
      });

      if (resultElement) resultElement.classList.remove('active');
      showQuestion(0);
    });
  }

  showQuestion(0);
}

/* ---------- CONTACT FORM ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const phone = formData.get('phone')?.trim();
    const email = formData.get('email')?.trim();

    if (!name || !phone) {
      showToast('Lütfen gerekli alanları doldurun.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Gönderiliyor...';
    btn.disabled = true;

    setTimeout(() => {
      showToast('Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz. ✅');
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });
}

/* ---------- FLOATING WORDS ---------- */
function initFloatingWords() {
  const container = document.querySelector('.floating-words');
  if (!container) return;

  const words = ['Hello', 'English', 'Learn', 'Fun', 'Play', 'Read', 'Speak', 'Write', 'Listen', 'Dream', 'World', 'Book', 'Happy', 'Smart'];

  function createWord() {
    const word = document.createElement('span');
    word.classList.add('floating-word');
    word.textContent = words[Math.floor(Math.random() * words.length)];
    word.style.left = Math.random() * 100 + '%';
    word.style.fontSize = (Math.random() * 2 + 1) + 'rem';
    word.style.animationDuration = (Math.random() * 15 + 15) + 's';
    word.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(word);

    setTimeout(() => word.remove(), 30000);
  }

  // Create initial words
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createWord(), i * 2000);
  }

  // Keep creating
  setInterval(createWord, 4000);
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function showToast(message, type = 'success') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ---------- SMOOTH SCROLL FOR ANCHORS ---------- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href');
  if (targetId === '#') return;

  const target = document.querySelector(targetId);
  if (target) {
    e.preventDefault();
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});
