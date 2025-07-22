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

  // Mobile Navigation Toggle
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu");

  mobileMenu.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Dark Mode Toggle with enhanced transitions
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or default to system preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      showNotification("Light mode activated ☀️", "info");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      showNotification("Dark mode activated 🌙", "info");
    }
  });

  // Enhanced smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop =
          targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Close mobile menu if open
        mobileMenu.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Enhanced navbar with scroll effects
  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;

  function updateNavbar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show navbar on scroll (optional)
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  }

  // Enhanced active navigation link highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;
      if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Optimized scroll event handler
  const throttledScrollHandler = throttle(() => {
    updateScrollProgress();
    updateNavbar();
    updateActiveNavLink();
    animateOnScroll();
  }, 16);

  window.addEventListener("scroll", throttledScrollHandler);

  // Add form field animations
  const formInputs = document.querySelectorAll("input, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });
  });

  // Enhanced Contact Form Handling
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();

    // Enhanced validation
    if (!name || name.length < 2) {
      showNotification(
        "Please enter a valid name (at least 2 characters).",
        "error"
      );
      document.getElementById("name").focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error");
      document.getElementById("email").focus();
      return;
    }

    if (!message || message.length < 10) {
      showNotification(
        "Please enter a message (at least 10 characters).",
        "error"
      );
      document.getElementById("message").focus();
      return;
    }

    // Show loading state with enhanced UX
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<span>Sending...</span><div class="spinner"></div>';
    submitButton.disabled = true;
    contactForm.classList.add("loading");

    // Simulate form submission with realistic delay
    setTimeout(() => {
      // Reset form
      contactForm.reset();

      // Reset button state
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      contactForm.classList.remove("loading");

      // Show enhanced success message
      showNotification(
        "🎉 Thank you for your message! I'll get back to you within 24 hours.",
        "success"
      );

      // Add confetti effect (simple implementation)
      createConfetti();
    }, 2000);
  });

  // Enhanced Download Resume functionality
  const downloadResumeBtn = document.getElementById("download-resume");
  downloadResumeBtn.addEventListener("click", function (e) {
    e.preventDefault();

    showNotification(
      "📄 Resume download will be available soon! Check back later.",
      "info"
    );

    // Example of how you might handle actual file download:
    // const link = document.createElement('a');
    // link.href = 'assets/Your_Name_Resume.pdf';
    // link.download = 'Your_Name_Resume.pdf';
    // link.click();
  });

  // Enhanced scroll animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Add different animation classes based on element type
        if (element.classList.contains("skill-category")) {
          element.classList.add("slide-in-left");
        } else if (element.classList.contains("project-card")) {
          element.classList.add("fade-in-up");
        } else if (element.classList.contains("about-content")) {
          element.classList.add("slide-in-right");
        } else {
          element.classList.add("fade-in-up");
        }

        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Fallback scroll animation for browsers without Intersection Observer
  function animateOnScroll() {
    if ("IntersectionObserver" in window) return;

    const elements = document.querySelectorAll(
      ".skill-category, .project-card, .about-content"
    );

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("fade-in-up");
      }
    });
  }

  // Initialize animations
  if ("IntersectionObserver" in window) {
    const animatedElements = document.querySelectorAll(
      ".skill-category, .project-card, .about-content"
    );
    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animateOnScroll();
  }

  // Enhanced utility functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notif) => notif.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "12px",
      color: "white",
      fontWeight: "500",
      zIndex: "10000",
      opacity: "0",
      transform: "translateX(100%)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      maxWidth: "400px",
      wordWrap: "break-word",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    });

    // Set background color based on type
    const colors = {
      success: "linear-gradient(135deg, #10b981, #059669)",
      error: "linear-gradient(135deg, #ef4444, #dc2626)",
      info: "linear-gradient(135deg, #3b82f6, #2563eb)",
      warning: "linear-gradient(135deg, #f59e0b, #d97706)",
    };
    notification.style.background = colors[type] || colors.info;

    // Add to DOM
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => removeNotification(notification));

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after delay
    setTimeout(() => removeNotification(notification), 5000);
  }

  function removeNotification(notification) {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  function createConfetti() {
    // Simple confetti effect
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background: ${
                  ["#6366f1", "#10b981", "#f59e0b", "#ef4444"][
                    Math.floor(Math.random() * 4)
                  ]
                };
                z-index: 10000;
                pointer-events: none;
                animation: confetti-fall ${
                  Math.random() * 2 + 1
                }s ease-out forwards;
            `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }

  // Keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // Press 'Escape' to close mobile menu or notifications
    if (e.key === "Escape") {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";

      // Close notifications
      const notifications = document.querySelectorAll(".notification");
      notifications.forEach((notif) => removeNotification(notif));
    }

    // Press 'D' to toggle dark mode (when not typing in inputs)
    if (e.key === "d" && !e.target.matches("input, textarea")) {
      themeToggle.click();
    }
  });

  // Enhanced performance optimizations
  const debouncedResize = debounce(() => {
    // Handle resize events
    updateActiveNavLink();
  }, 250);

  window.addEventListener("resize", debouncedResize);

  // Initialize everything
  updateScrollProgress();
  updateNavbar();
  updateActiveNavLink();

  // Page load animation
  document.body.style.opacity = "0";
  window.addEventListener("load", function () {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";

    // Trigger text animations
    setTimeout(() => {
      const animatedTexts = document.querySelectorAll(".animate-text");
      animatedTexts.forEach((el, index) => {
        setTimeout(() => {
          el.style.animationPlayState = "running";
        }, index * 200);
      });
    }, 300);

    // Trigger initial animations
    setTimeout(() => {
      const heroElements = document.querySelectorAll(
        ".hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-buttons, .social-links, .scroll-cue"
      );
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.animationDelay = `${index * 0.1}s`;
        }, index * 100);
      });
    }, 100);
  });

  // Add CSS for confetti animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: currentColor;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .form-group.focused label {
            transform: translateY(-25px) scale(0.9);
            color: var(--primary-color);
        }
        
        .form-group label {
            position: absolute;
            top: 1.25rem;
            left: 1.25rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--bg-primary);
            padding: 0 0.5rem;
            border-radius: 4px;
        }
        
        .form-group {
            position: relative;
            margin-bottom: 2rem;
        }
        
        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);

  console.log("🚀 Enhanced portfolio website loaded successfully!");
  console.log(
    '💡 Pro tip: Press "D" to toggle dark mode, "Escape" to close menus!'
  );
});

// Create scroll progress indicator if it doesn't exist
function createScrollProgress() {
  const indicator = document.createElement("div");
  indicator.className = "scroll-indicator";
  indicator.innerHTML = '<div class="scroll-progress"></div>';
  document.body.prepend(indicator);
  return indicator.querySelector(".scroll-progress");
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
  const parallaxElements = document.querySelectorAll(".hero::before");

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      parallaxElements.forEach((element) => {
        element.style.transform = `translateY(${rate}px)`;
      });
    }, 10)
  );
}

// Initialize advanced effects
document.addEventListener("DOMContentLoaded", initAdvancedScrollEffects);

// Service Worker registration for better performance (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // You can register a service worker here for offline functionality
    console.log("💼 Service Worker support detected");
  });
}

// Performance monitoring
if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.entryType === "paint") {
        console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      }
    });
  });

  observer.observe({ entryTypes: ["paint"] });
}
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const form = this;
    const emailInput = form.email.value.trim();

    // Basic client-side email format validation (optional, but recommended)
    if (!isValidEmail(emailInput)) {
      showNotification("Please enter a valid email address.", "error");
      form.email.focus();
      return;
    }

    // Call MailboxLayer API to verify email existence
    const accessKey = "d61e3d5d5bfb4b752e7cc8ed817085aa";
    const apiUrl = `https://apilayer.net/api/check?access_key=${accessKey}&email=${encodeURIComponent(
      emailInput
    )}&smtp=1&format=1`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (
          data.smtp_check === true &&
          data.format_valid === true &&
          data.mx_found === true
        ) {
          // Email seems valid and exists, now send email with emailjs
          emailjs.sendForm("service_evb1klj", "template_2fkernr", form).then(
            function () {
              showNotification(
                "🎉 Thank you for your message! I'll get back to you within 24 hours.",
                "success"
              );
              form.reset();
            },
            function (error) {
              console.error("Failed to send:", error);
              alert("Failed to send message. Please try again.");
            }
          );
        } else {
          showNotification(
            "The email address does not appear to be valid or does not exist.",
            "error"
          );
          form.email.focus();
        }
      })
      .catch((error) => {
        console.error("Error verifying email:", error);
        showNotification(
          "Unable to verify email address at this time. Please try again later.",
          "error"
        );
      });
  });

// Utility function for basic email format validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
