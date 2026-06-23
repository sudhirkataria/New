document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll effect
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page is loaded already scrolled

  // 2. Mobile Menu Drawer
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navElement = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navElement) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navElement.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navElement.classList.remove('active');
      });
    });
  }

  // 3. Stats Counter Animation
  const statsSection = document.querySelector('.stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsSection && statNumbers.length > 0) {
    const animateCounters = () => {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = 2000 / target; // Total duration: 2s

        const updateCount = () => {
          const increment = Math.ceil(target / 100);
          if (count < target) {
            count += increment;
            if (count > target) count = target;
            counter.innerText = count + suffix;
            setTimeout(updateCount, speed * increment);
          } else {
            counter.innerText = target + suffix;
          }
        };

        updateCount();
      });
    };

    // Use Intersection Observer to trigger animation when section is in view
    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target); // Run once
        }
      });
    }, observerOptions);

    observer.observe(statsSection);
  }

  // 4. FAQ Accordion Dropdowns
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // If it wasn't active, open it
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });

  // 5. Contact & Inquiry Form Validation
  const contactForm = document.getElementById('contactForm');
  const admissionForm = document.getElementById('admissionForm');

  const setupFormValidation = (form, successMsg) => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusDiv = form.querySelector('.form-status');
      if (statusDiv) {
        statusDiv.className = 'form-status';
        statusDiv.style.display = 'none';
      }

      let isValid = true;
      const inputs = form.querySelectorAll('.form-control[required]');

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--secondary)';
        } else {
          input.style.borderColor = 'var(--border-color)';
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            input.style.borderColor = 'var(--secondary)';
          }
        }
      });

      if (!isValid) {
        showFormStatus(form, 'Please fill out all required fields correctly.', 'error');
        return;
      }

      // Simulate API submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        showFormStatus(form, successMsg, 'success');
        form.reset();
      }, 1500);
    });
  };

  const showFormStatus = (form, message, type) => {
    let statusDiv = form.querySelector('.form-status');
    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.className = `form-status ${type}`;
      form.appendChild(statusDiv);
    } else {
      statusDiv.className = `form-status ${type}`;
    }
    statusDiv.innerText = message;
    statusDiv.style.display = 'block';
  };

  setupFormValidation(contactForm, 'Thank you! Your message has been sent successfully. We will get back to you shortly.');
  setupFormValidation(admissionForm, 'Thank you for your interest! Your admission inquiry has been received. Our admissions team will contact you within 24-48 hours.');
});
