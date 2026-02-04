/**
 * Main JavaScript
 * Global functionality and component loading
 */

// Load partials (header/footer)
async function loadPartials() {
  try {
    // Load header
    const headerResponse = await fetch("partials/header.html");
    const headerHtml = await headerResponse.text();
    document.getElementById("header-placeholder").innerHTML = headerHtml;

    // Load footer
    const footerResponse = await fetch("partials/footer.html");
    const footerHtml = await footerResponse.text();
    document.getElementById("footer-placeholder").innerHTML = footerHtml;

    // Initialize after partials are loaded
    initializeAfterLoad();
  } catch (error) {
    console.error("Error loading partials:", error);
  }
}

function initializeAfterLoad() {
  // Set active nav link
  setActiveNavLink();

  // Initialize mobile menu
  initMobileMenu();

  // Set current year in footer
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Load social links in footer
  loadFooterSocials();

  // Re-initialize theme icons after header loads
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");
  if (sunIcon && moonIcon) {
    if (currentTheme === "dark") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  }
}

function setActiveNavLink() {
  const currentPage =
    window.location.pathname.split("/").pop().replace(".html", "") || "index";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const page = link.dataset.page;
    if (page === currentPage) {
      link.classList.add("active");
    } else if (currentPage === "project" && page === "projects") {
      // Also highlight Projects for project detail pages
      link.classList.add("active");
    } else if (
      ["drawing", "graphic-design", "photography", "singing"].includes(
        currentPage,
      ) &&
      page === "creative"
    ) {
      // Highlight Creative for category pages
      link.classList.add("active");
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }
}

async function loadFooterSocials() {
  const profile = await DataManager.getProfile();
  const container = document.getElementById("footer-socials");

  if (!container || !profile || !profile.socials) return;

  const socialIcons = {
    github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    behance: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM6.545 9.64c.56 0 1.01-.13 1.36-.397.35-.264.52-.678.52-1.25 0-.3-.05-.553-.158-.76-.11-.21-.26-.377-.454-.5-.19-.12-.41-.21-.67-.26-.26-.05-.537-.07-.84-.07H3.19v3.24h3.36zm.19 5.12c.333 0 .64-.03.93-.1.29-.068.54-.18.76-.34.218-.16.39-.37.51-.64.12-.27.19-.6.19-1.01 0-.8-.22-1.37-.66-1.71-.442-.34-1.01-.51-1.72-.51H3.19v4.31h3.54zM15.94 15.44c.47.48 1.15.72 2.02.72.62 0 1.16-.16 1.6-.48.44-.32.71-.67.83-1.03h2.78c-.44 1.37-1.11 2.36-2.01 2.97-.9.61-2.01.91-3.31.91-.91 0-1.72-.14-2.45-.43-.74-.29-1.36-.71-1.87-1.26-.51-.55-.9-1.21-1.17-1.98-.27-.77-.41-1.63-.41-2.58 0-.91.13-1.76.41-2.53.28-.77.67-1.43 1.18-1.99.51-.55 1.12-.98 1.84-1.29.72-.31 1.52-.47 2.4-.47.99 0 1.86.19 2.6.57.74.38 1.35.9 1.83 1.55.48.65.83 1.4 1.05 2.25.22.85.29 1.75.22 2.68h-8.25c.05 1.01.38 1.78.85 2.24zm3.53-5.29c-.38-.41-.97-.62-1.78-.62-.54 0-.98.1-1.32.28-.34.19-.6.43-.79.72-.19.29-.33.6-.41.92-.08.32-.13.62-.14.9h5.22c-.12-.85-.41-1.51-.78-1.92v-.28zM15.3 4.91h5.38V6.4H15.3V4.91z"/></svg>`,
    dribbble: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/></svg>`,
  };

  container.innerHTML = Object.entries(profile.socials)
    .filter(([key, value]) => value && socialIcons[key])
    .map(
      ([key, value]) => `
      <a href="${value}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${key}">
        ${socialIcons[key]}
      </a>
    `,
    )
    .join("");
}

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      ${
        type === "success"
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
      }
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = "slideIn 0.25s ease reverse";
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

// Copy to clipboard helper
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  } catch (err) {
    showToast("Failed to copy", "error");
  }
}

// Format date helper
function formatDate(dateStr, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadPartials();
});

// Export helpers
if (typeof module !== "undefined" && module.exports) {
  module.exports = { showToast, copyToClipboard, formatDate };
}
