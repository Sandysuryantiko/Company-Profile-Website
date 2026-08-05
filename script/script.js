// ==========================================================================
// Init AOS
// ==========================================================================
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: "ease-out-cubic",
});

// ==========================================================================
// Mobile menu toggle
// ==========================================================================
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.getElementById("nav-menu");

function toggleMenu() {
  navMenu.classList.toggle("active");
  mobileMenu.classList.toggle("active");
}

mobileMenu.addEventListener("click", toggleMenu);
mobileMenu.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleMenu();
  }
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll("#nav-menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});

// ==========================================================================
// Smooth scrolling for anchor links
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      window.scrollTo({
        top: targetElement.offsetTop - 76,
        behavior: "smooth",
      });
    }
  });
});

document.getElementById("scrollCue")?.addEventListener("click", () => {
  const about = document.querySelector("#about");
  if (about) {
    window.scrollTo({ top: about.offsetTop - 76, behavior: "smooth" });
  }
});

// ==========================================================================
// Sticky nav shadow + scroll progress rail
// ==========================================================================
const mainNav = document.getElementById("mainNav");
const scrollFill = document.getElementById("scrollFill");
const backToTop = document.getElementById("backToTop");

function onScroll() {
  const scrollY = window.scrollY;

  // Nav shadow state
  if (scrollY > 30) {
    mainNav.classList.add("scrolled");
  } else {
    mainNav.classList.remove("scrolled");
  }

  // Scroll progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (scrollFill) scrollFill.style.width = progress + "%";

  // Back to top visibility
  if (backToTop) {
    if (scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================================================
// Active nav link highlighting on scroll
// ==========================================================================
const sections = document.querySelectorAll("main section, header#home");
const navItems = document.querySelectorAll("#nav-menu a[data-nav]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navItems.forEach((link) => {
          link.classList.toggle("active", link.dataset.nav === id);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

// ==========================================================================
// Portfolio: category filter tabs
// ==========================================================================
const filterTabs = document.querySelectorAll(".filter-tab");
const galleryItems = document.querySelectorAll(".gallery-item[data-category]");

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const filter = tab.dataset.filter;
    galleryItems.forEach((item) => {
      const match = filter === "all" || item.dataset.category === filter;
      item.style.display = match ? "" : "none";
    });
  });
});

// ==========================================================================
// Portfolio: lightbox
// ==========================================================================
const lightbox = document.getElementById("lightbox");

if (lightbox) {
  const lightboxMedia = document.getElementById("lightboxMedia");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxTag = document.getElementById("lightboxTag");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const allItems = Array.from(document.querySelectorAll(".gallery-item"));
  let currentIndex = 0;

  function renderLightbox(index) {
    const visibleItems = allItems.filter(
      (item) => item.style.display !== "none",
    );
    if (visibleItems.length === 0) return;

    currentIndex =
      ((index % visibleItems.length) + visibleItems.length) %
      visibleItems.length;
    const item = visibleItems[currentIndex];

    const img = item.querySelector("img");
    const caption = item.querySelector(".gallery-caption")?.textContent || "";
    const tag = item.querySelector(".exhibit-tag")?.textContent || "";
    const missing = item.classList.contains("img-missing");

    lightboxTag.textContent = tag;
    lightboxCaption.textContent = caption;

    if (missing || !img) {
      lightboxMedia.innerHTML = `
        <div class="lightbox-placeholder">
          <i class="fas fa-image"></i>
          <p>Foto belum ditambahkan</p>
        </div>`;
    } else {
      lightboxMedia.innerHTML = "";
      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.alt = img.alt;
      lightboxMedia.appendChild(fullImg);
    }

    // Store the working set for prev/next
    lightbox.dataset.setSize = visibleItems.length;
  }

  allItems.forEach((item, i) => {
    item.addEventListener("click", () => {
      const visibleItems = allItems.filter((el) => el.style.display !== "none");
      const visibleIndex = visibleItems.indexOf(item);
      renderLightbox(visibleIndex === -1 ? 0 : visibleIndex);
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev?.addEventListener("click", () =>
    renderLightbox(currentIndex - 1),
  );
  lightboxNext?.addEventListener("click", () =>
    renderLightbox(currentIndex + 1),
  );

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") renderLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") renderLightbox(currentIndex + 1);
  });
}
