/**
 * Image Optimizer
 * Advanced image loading with lazy loading, blur-up placeholders, and WebP support
 */

const ImageOptimizer = {
  // Configuration
  config: {
    rootMargin: "50px 0px", // Start loading 50px before entering viewport
    threshold: 0.01,
    placeholderColor: "var(--color-bg-tertiary)",
    fadeInDuration: 300,
  },

  observer: null,

  init() {
    // Create intersection observer for lazy loading
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold,
        },
      );

      // Observe all images with data-src attribute
      this.observeImages();
    } else {
      // Fallback for older browsers - load all images immediately
      this.loadAllImages();
    }

    // Add WebP support detection
    this.detectWebPSupport();
  },

  observeImages() {
    const images = document.querySelectorAll("img[data-src], .lazy-image");
    images.forEach((img) => this.observer.observe(img));
  },

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  },

  loadImage(img) {
    const src = img.dataset.src || img.src;
    const srcset = img.dataset.srcset;
    const sizes = img.dataset.sizes;

    // Create a new image to preload
    const tempImg = new Image();

    tempImg.onload = () => {
      // Apply the loaded image
      if (srcset) img.srcset = srcset;
      if (sizes) img.sizes = sizes;
      if (img.dataset.src) img.src = img.dataset.src;

      // Add loaded class for fade-in animation
      img.classList.add("img-loaded");
      img.classList.remove("img-loading");

      // Remove placeholder
      const placeholder = img.parentElement?.querySelector(".img-placeholder");
      if (placeholder) {
        placeholder.style.opacity = "0";
        setTimeout(() => placeholder.remove(), this.config.fadeInDuration);
      }
    };

    tempImg.onerror = () => {
      img.classList.add("img-error");
      img.classList.remove("img-loading");
      // Set fallback image
      img.src = "assets/img/placeholder.svg";
    };

    img.classList.add("img-loading");
    tempImg.src = src;
    if (srcset) tempImg.srcset = srcset;
  },

  loadAllImages() {
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
    });
  },

  detectWebPSupport() {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const isSupported = webP.height === 2;
      document.documentElement.classList.add(isSupported ? "webp" : "no-webp");
      this.supportsWebP = isSupported;
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  },

  /**
   * Create optimized image HTML with lazy loading and placeholder
   * @param {Object} options - Image options
   * @returns {string} HTML string
   */
  createOptimizedImage(options) {
    const {
      src,
      alt = "",
      className = "",
      width,
      height,
      priority = false,
      placeholder = true,
    } = options;

    const loadingAttr = priority ? "eager" : "lazy";
    const fetchPriority = priority ? "high" : "low";
    const decodingAttr = priority ? "sync" : "async";

    // Generate srcset for responsive images if width is provided
    let srcset = "";
    let sizes = "";
    if (width && src && !src.includes("placeholder")) {
      const basePath = src.replace(/\.[^/.]+$/, "");
      const ext = src.split(".").pop();
      srcset = `
        ${basePath}-400w.${ext} 400w,
        ${basePath}-800w.${ext} 800w,
        ${basePath}.${ext} ${width}w
      `.trim();
      sizes = `(max-width: 400px) 400px, (max-width: 800px) 800px, ${width}px`;
    }

    const placeholderHtml = placeholder
      ? `<div class="img-placeholder" style="background: ${this.config.placeholderColor}; position: absolute; inset: 0;"></div>`
      : "";

    return `
      <div class="img-container" style="position: relative; overflow: hidden;">
        ${placeholderHtml}
        <img 
          ${priority ? `src="${src}"` : `data-src="${src}"`}
          ${srcset ? `data-srcset="${srcset}"` : ""}
          ${sizes ? `data-sizes="${sizes}"` : ""}
          alt="${alt}"
          class="${className} ${priority ? "img-loaded" : "lazy-image"}"
          loading="${loadingAttr}"
          decoding="${decodingAttr}"
          fetchpriority="${fetchPriority}"
          ${width ? `width="${width}"` : ""}
          ${height ? `height="${height}"` : ""}
          onerror="this.onerror=null; this.src='assets/img/placeholder.svg';"
        >
      </div>
    `;
  },

  /**
   * Preload critical images (hero, above-fold)
   * @param {string[]} imagePaths - Array of image paths to preload
   */
  preloadCriticalImages(imagePaths) {
    imagePaths.forEach((path) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = path;
      // Add WebP version if supported
      if (this.supportsWebP && !path.includes(".svg")) {
        link.type = "image/webp";
        link.href = path.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      }
      document.head.appendChild(link);
    });
  },

  /**
   * Re-observe new images (call after dynamic content loads)
   */
  refresh() {
    if (this.observer) {
      this.observeImages();
    }
  },
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  ImageOptimizer.init();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ImageOptimizer;
}
