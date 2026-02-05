/**
 * Modal Manager
 * Handles modal dialogs with accessibility support
 */

const ModalManager = {
  activeModal: null,
  previouslyFocused: null,

  init() {
    this.createModalContainer();
    this.bindEvents();
  },

  createModalContainer() {
    if (!document.getElementById("modal-container")) {
      const container = document.createElement("div");
      container.id = "modal-container";
      document.body.appendChild(container);
    }
  },

  open(options) {
    const {
      title,
      content,
      size = "default",
      type = "default",
      onClose,
    } = options;

    // Store currently focused element
    this.previouslyFocused = document.activeElement;

    const modalHtml = `
      <div class="modal-overlay ${type === "lightbox" ? "lightbox-modal" : ""}" id="active-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        ${type === "lightbox" ? this.renderLightboxContent(content) : this.renderDefaultContent(title, content, size)}
      </div>
    `;

    const container = document.getElementById("modal-container");
    container.innerHTML = modalHtml;

    // Trigger reflow for animation
    requestAnimationFrame(() => {
      const overlay = document.getElementById("active-modal");
      overlay.classList.add("active");
    });

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Store callback
    this.onCloseCallback = onClose;
    this.activeModal = document.getElementById("active-modal");

    // Focus first focusable element
    const focusable = this.activeModal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable) focusable.focus();
  },

  renderDefaultContent(title, content, size) {
    const sizeClass = size === "large" ? 'style="max-width: 900px;"' : "";
    return `
      <div class="modal" ${sizeClass}>
        <div class="modal-header">
          <h3 id="modal-title">${title || ""}</h3>
          <button class="modal-close" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
  },

  renderLightboxContent(content) {
    return `
      <button class="lightbox-close" aria-label="Close lightbox">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      ${
        content.showNav
          ? `
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      `
          : ""
      }
      ${
        content.showActions
          ? `
        <div class="lightbox-actions">
          <button class="lightbox-action-btn" onclick="LightboxManager.downloadImage()" aria-label="Download image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button class="lightbox-action-btn" onclick="LightboxManager.openComments()" aria-label="View comments">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments
          </button>
        </div>
      `
          : ""
      }
      <div class="modal">
        <div class="modal-body">
          <img src="${content.src}" alt="${content.alt || ""}" />
        </div>
      </div>
    `;
  },

  close() {
    if (!this.activeModal) return;

    this.activeModal.classList.remove("active");

    setTimeout(() => {
      const container = document.getElementById("modal-container");
      if (container) container.innerHTML = "";
      document.body.style.overflow = "";

      // Restore focus
      if (this.previouslyFocused) {
        this.previouslyFocused.focus();
      }

      // Execute callback
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }

      this.activeModal = null;
    }, 250);
  },

  bindEvents() {
    // Close on overlay click (clicking outside modal content)
    document.addEventListener("click", (e) => {
      // For lightbox: close when clicking outside the image
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.classList.contains("lightbox-modal")
      ) {
        this.close();
      }
      // For lightbox: close when clicking the modal wrapper but not the image
      if (
        e.target.closest(".lightbox-modal") &&
        !e.target.closest("img") &&
        !e.target.closest(".lightbox-nav") &&
        !e.target.closest(".lightbox-action-btn") &&
        !e.target.closest(".lightbox-close")
      ) {
        this.close();
      }
      if (
        e.target.closest(".modal-close") ||
        e.target.closest(".lightbox-close")
      ) {
        this.close();
      }
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.close();
      }

      // Trap focus
      if (e.key === "Tab" && this.activeModal) {
        this.trapFocus(e);
      }
    });
  },

  trapFocus(e) {
    const focusableElements = this.activeModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  },
};

// Lightbox Manager for image galleries
const LightboxManager = {
  images: [],
  currentIndex: 0,
  photoInfo: null,

  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.photoInfo = null;
    this.showImage();
    this.bindNavEvents();
  },

  openPhoto(photos, startIndex = 0) {
    this.images = photos;
    this.photos = null;
    this.currentIndex = startIndex;
    this.showPhotoImage();
    this.bindNavEvents();
  },

  showImage() {
    const image = this.images[this.currentIndex];
    ModalManager.open({
      type: "lightbox",
      content: {
        src: image.src || image,
        alt: image.alt || "",
        showNav: this.images.length > 1,
      },
    });
  },

  showPhotoImage() {
    const image = this.images[this.currentIndex];

    ModalManager.open({
      type: "lightbox",
      content: {
        src: image,
        alt: "Photo",
        showNav: this.images.length > 1,
        showActions: true,
      },
    });
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  },

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  },

  updateImage() {
    const modal = document.getElementById("active-modal");
    if (modal) {
      const img = modal.querySelector("img");
      const image = this.images[this.currentIndex];

      if (img) {
        img.src = image;
        img.alt = "Photo";
      }
    }
  },

  downloadImage() {
    const image = this.images[this.currentIndex];
    const src = image;
    const originalName = src.split("/").pop() || "photo.jpg";
    const ext = originalName.split(".").pop();
    const filename = `IfElseGhost_${this.currentIndex + 1}.${ext}`;

    // Create a temporary link to download
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  openComments() {
    // Placeholder for comments functionality
    const photo = this.photos ? this.photos[this.currentIndex] : null;
    alert(
      "Comments feature coming soon!" +
        (photo ? `\n\nPhoto: ${photo.title}` : ""),
    );
  },

  bindNavEvents() {
    document.addEventListener("click", this.handleNavClick);
    document.addEventListener("keydown", this.handleKeyNav);
  },

  handleNavClick(e) {
    if (e.target.closest(".lightbox-next")) {
      LightboxManager.next();
    }
    if (e.target.closest(".lightbox-prev")) {
      LightboxManager.prev();
    }
  },

  handleKeyNav(e) {
    if (!ModalManager.activeModal) return;
    if (e.key === "ArrowRight") LightboxManager.next();
    if (e.key === "ArrowLeft") LightboxManager.prev();
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  ModalManager.init();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ModalManager, LightboxManager };
}
