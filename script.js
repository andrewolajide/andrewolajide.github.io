const body = document.body;
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".menu-overlay");

let scrollY = 0;

function lockBody() {
  scrollY = window.scrollY;

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.width = "100%";
}

function unlockBody() {
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.width = "";

  window.scrollTo(0, scrollY);
}

function updateMenuState() {
  const isActive = menu.classList.contains("active");

  overlay.classList.toggle("active", isActive);

  if (isActive) {
    lockBody();
  } else {
    unlockBody();
  }
}

function toggleMenu(el) {
  el.classList.toggle("active");
  menu.classList.toggle("active");

  updateMenuState();
}

// Close when clicking outside
overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  menu.classList.remove("active");

  updateMenuState();
});

// Close when clicking links
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    menu.classList.remove("active");

    updateMenuState();
  });
});

// Close when clicking overlay
overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  menu.classList.remove("active");

  updateMenuState();
});

// fixed navbar on scroll
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Cursor trail effect
const canvas = document.getElementById("smoke-canvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // 1. Smaller initial size for a thinner trail
    this.size = Math.random() * 5 + 2;

    // 2. Dynamic Color (cycling between cyan and indigo)
    // You can change '190' to '280' for more purples, or '0' for reds
    this.hue = Math.random() * 40 + 180;

    // 3. Tightened Velocity (lower horizontal spread)
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 1) * 0.8;

    this.life = Math.random() * 50 + 20;
    this.initialLife = this.life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.97; // Particles shrink slightly instead of expanding
    this.life--;
  }

  draw() {
    const alpha = (this.life / this.initialLife) * 0.6;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    // Using HSL for vibrant, easy-to-tweak color
    ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${alpha})`;

    // Add a sharp "core" glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, ${alpha})`;

    ctx.fill();
    ctx.closePath();
  }
}

const particles = [];

window.addEventListener("mousemove", (e) => {
  // Create fewer particles per move for a cleaner line
  for (let i = 0; i < 2; i++) {
    particles.push(new Particle(e.clientX, e.clientY));
  }
});

function animate() {
  ctx.clearRect(0, 0, w, h);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(animate);
}

animate();

/* =============================
   7. SCROLL & ANIMATIONS
============================= */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) scrollTopBtn.classList.add("show");
    else scrollTopBtn.classList.remove("show");
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initScrollAnimations() {
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add("active");
      } else if (entry.boundingClientRect.top > 0) {
        entry.target.classList.remove("active");
        entry.target.style.transitionDelay = "0s";
      }
    });
  }, observerOptions);
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
initScrollToTop();
initScrollAnimations();

/* =============================
   FORM SUBMISSION LOGIC
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("myContactForm");
  const formStatus = document.getElementById("form-status");
  const submitBtn = contactForm.querySelector(".submit-btn");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the default page reload

    // 1. Visual Feedback: Loading state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sending...";
    formStatus.style.display = "none";

    // 2. Data Preparation
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      // 3. The Fetch Request
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Success Logic
        formStatus.innerText =
          "Thanks! Your message has been sent successfully.";
        formStatus.style.color = "#09f16a"; // Matches your green dot
        formStatus.style.display = "block";
        contactForm.reset();
      } else {
        // Handle server errors (e.g., 404, 500)
        throw new Error("Form submission failed.");
      }
    } catch (error) {
      // Logic for network errors or server downtime
      formStatus.innerText = "Oops! There was a problem sending your message.";
      formStatus.style.color = "#ff4d4d";
      formStatus.style.display = "block";
    } finally {
      // 4. Reset Button State
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    }
  });
});
