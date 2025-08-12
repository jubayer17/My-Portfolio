// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize scroll progress indicator
  const scrollProgress =
    document.querySelector(".scroll-progress") || createScrollProgress();

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + "%";
  }

  // Enhanced Mobile Navigation Toggle with animations
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu");

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Animate hamburger menu
      mobileMenu.style.transform = mobileMenu.classList.contains("active")
        ? "rotate(90deg)"
        : "rotate(0deg)";

      // Prevent body scroll when menu is open
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
        // Animate menu items
        const navLinks = navMenu.querySelectorAll(".nav-link");
        navLinks.forEach((link, index) => {
          link.style.animation = `slideInLeft 0.4s ease-out ${
            index * 0.1
          }s forwards`;
        });
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (mobileMenu && navMenu) {
        mobileMenu.classList.remove("active");
        navMenu.classList.remove("active");
        mobileMenu.style.transform = "rotate(0deg)";
        document.body.style.overflow = "";
      }
    });
  });

  // Enhanced Dark Mode Toggle with smooth transitions
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or default to system preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      // Add click animation
      themeToggle.style.transform = "scale(0.95)";
      setTimeout(() => {
        themeToggle.style.transform = "scale(1)";
      }, 150);

      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }

      // Add transition effect to body
      document.body.style.transition =
        "background-color 0.3s ease, color 0.3s ease";
      setTimeout(() => {
        document.body.style.transition = "";
      }, 300);
    });
  }

  // Enhanced Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");

        // Add stagger animation for child elements
        const children = entry.target.querySelectorAll(".stagger-child");
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add("animate");
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  // Observe elements for animations
  const animateElements = document.querySelectorAll(
    ".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-scale, .section-title, .skill-category, .project-card, .about-content, .contact-content"
  );

  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Enhanced Navbar scroll effect
  let lastScrollTop = 0;
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    updateScrollProgress();

    // Add/remove scrolled class with enhanced effects
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add("scrolled");
        navbar.style.backdropFilter = "blur(20px)";
        navbar.style.webkitBackdropFilter = "blur(20px)";
      } else {
        navbar.classList.remove("scrolled");
        navbar.style.backdropFilter = "blur(10px)";
        navbar.style.webkitBackdropFilter = "blur(10px)";
      }

      // Always keep navbar visible
      navbar.style.transform = "translateY(0)";
    }
    lastScrollTop = scrollTop;
  });

  // Enhanced Active navigation link highlighting
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
        // Add pulse effect to active link
        link.style.animation = "pulse 0.6s ease-out";
        setTimeout(() => {
          link.style.animation = "";
        }, 600);
      }
    });
  });

  // Enhanced Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Add ripple effect
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);

        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Enhanced Typing animation for hero subtitle
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = "";
    typingText.style.borderRight = "2px solid var(--primary-color)";

    let index = 0;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function typeWriter() {
      if (index < text.length) {
        typingText.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, typeSpeed);
      } else {
        setTimeout(() => {
          deleteText();
        }, pauseTime);
      }
    }

    function deleteText() {
      if (typingText.textContent.length > 0) {
        typingText.textContent = typingText.textContent.slice(0, -1);
        setTimeout(deleteText, deleteSpeed);
      } else {
        index = 0;
        setTimeout(typeWriter, 500);
      }
    }

    // Start typing animation with delay
    setTimeout(typeWriter, 1000);
  }

  // Enhanced Button hover effects
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
      this.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.3)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "";
    });

    btn.addEventListener("mousedown", function () {
      this.style.transform = "translateY(0) scale(0.98)";
    });

    btn.addEventListener("mouseup", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });
  });

  // Enhanced Skill items animation
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;

    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.05) rotate(2deg)";
      this.style.zIndex = "10";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1) rotate(0deg)";
      this.style.zIndex = "1";
    });
  });

  // Enhanced Project cards with magnetic effect
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

  // Enhanced Contact form with animations
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll("input, textarea");

    formInputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.style.transform = "translateY(-2px)";
        this.style.borderColor = "var(--primary-color)";
        this.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
      });

      input.addEventListener("blur", function () {
        this.parentElement.style.transform = "translateY(0)";
        this.style.borderColor = "";
        this.style.boxShadow = "";
      });
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalText = submitButton.textContent;

        // Animate button
        submitButton.style.transform = "scale(0.95)";
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
          submitButton.textContent = "Message Sent!";
          submitButton.style.backgroundColor = "#10b981";
          submitButton.style.transform = "scale(1)";

          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = "";
            submitButton.disabled = false;
            contactForm.reset();
          }, 2000);
        }, 1500);
      }
    });
  }

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.1}px)`;
    }

    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
  });

  // Enhanced social links with individual animations
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link, index) => {
    link.style.animationDelay = `${1.2 + index * 0.1}s`;

    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.15) rotate(5deg)";
      this.style.boxShadow = "0 15px 30px rgba(37, 99, 235, 0.3)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1) rotate(0deg)";
      this.style.boxShadow = "";
    });
  });

  // Add ripple effect to clickable elements
  function addRippleEffect(element) {
    element.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple-effect");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  // Apply ripple effect to buttons and links
  buttons.forEach(addRippleEffect);
  socialLinks.forEach(addRippleEffect);
  navLinks.forEach(addRippleEffect);

  // Smooth scroll to top functionality
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.classList.add("scroll-to-top");
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  `;

  document.body.appendChild(scrollToTopBtn);

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(100px)";
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Toggle dark mode with 'D' key
    if (e.key.toLowerCase() === "d" && !e.ctrlKey && !e.altKey) {
      if (themeToggle) {
        themeToggle.click();
      }
    }

    // Close mobile menu with 'Escape' key
    if (e.key === "Escape") {
      if (navMenu && navMenu.classList.contains("active")) {
        mobileMenu.click();
      }
    }
  });

  console.log("🚀 Enhanced portfolio website loaded successfully!");
  console.log(
    '💡 Pro tip: Press "D" to toggle dark mode, "Escape" to close menus!'
  );
});

// Create scroll progress indicator if it doesn't exist
function createScrollProgress() {
  const indicator = document.createElement("div");
  indicator.classList.add("scroll-indicator");

  const progress = document.createElement("div");
  progress.classList.add("scroll-progress");

  indicator.appendChild(progress);
  document.body.insertBefore(indicator, document.body.firstChild);

  return progress;
}

// Enhanced utility functions
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Advanced scroll effects
function initAdvancedScrollEffects() {
  const parallaxElements = document.querySelectorAll(".parallax-bg");

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.2;

      parallaxElements.forEach((element) => {
        element.style.transform = `translateY(${rate}px)`;
      });
    }, 10)
  );
}

// Initialize advanced effects
document.addEventListener("DOMContentLoaded", initAdvancedScrollEffects);

// Performance optimization: Preload images
function preloadImages() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize image lazy loading
document.addEventListener("DOMContentLoaded", preloadImages);
