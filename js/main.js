/* Interactions du portfolio : langue, menu mobile, WhatsApp, lightbox, contact, scroll reveal */

// ⚠️ Remplacer ce numéro par le vrai numéro WhatsApp de Kenny (format international sans "+" ni espaces)
const WHATSAPP_NUMBER = "243978974603";

function buildWhatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function genericWhatsappMessage() {
  return translations[getCurrentLang()]["whatsapp.genericMessage"];
}

function serviceWhatsappMessage(serviceKey) {
  const lang = getCurrentLang();
  const serviceName = translations[lang][serviceKey] || "";
  return translations[lang]["whatsapp.serviceMessage"].replace("{service}", serviceName);
}

function wireWhatsappButtons() {
  document.querySelectorAll("[data-whatsapp='generic']").forEach((el) => {
    el.setAttribute("href", buildWhatsappLink(genericWhatsappMessage()));
  });
  document.querySelectorAll("[data-whatsapp-service]").forEach((el) => {
    const serviceKey = el.getAttribute("data-whatsapp-service");
    el.setAttribute("href", buildWhatsappLink(serviceWhatsappMessage(serviceKey)));
  });
}

// --- Langue ---
function initLanguage() {
  applyLanguage(getCurrentLang());
  wireWhatsappButtons();
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.getAttribute("data-lang"));
      wireWhatsappButtons();
    });
  });
}

// --- Menu mobile ---
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Lightbox galerie designs ---
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !lightboxImg || !closeBtn) return;

  function openLightbox(src, alt) {
    lightboxImg.setAttribute("src", src);
    lightboxImg.setAttribute("alt", alt || "");
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImg.setAttribute("src", "");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".design-gallery img, .project .thumb img").forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
}

// --- Formulaire de contact (Formspree) ---
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    const lang = getCurrentLang();

    submitBtn.disabled = true;
    status.style.display = "block";
    status.style.color = "var(--muted)";
    status.textContent = translations[lang]["contact.form.sending"];

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.style.color = "#4ade80";
        status.textContent = translations[lang]["contact.form.success"];
        form.reset();
      } else {
        throw new Error("Formspree error");
      }
    } catch (err) {
      status.style.color = "#f87171";
      status.textContent = translations[lang]["contact.form.error"];
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// --- Apparition fluide des sections au scroll ---
function initScrollReveal() {
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((sec) => observer.observe(sec));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initLanguage();
  initMobileMenu();
  initLightbox();
  initContactForm();
  initScrollReveal();
});
