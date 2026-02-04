/**
 * Theme Manager
 * Handles light/dark theme switching with localStorage persistence
 */

const ThemeManager = {
  STORAGE_KEY: "portfolio-theme",

  init() {
    this.applyInitialTheme();
    this.bindEvents();
  },

  applyInitialTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      this.setTheme(prefersDark ? "dark" : "light");
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateToggleIcon(theme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  },

  updateToggleIcon(theme) {
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");

    if (sunIcon && moonIcon) {
      if (theme === "dark") {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      } else {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      }
    }
  },

  bindEvents() {
    // Listen for theme toggle button
    document.addEventListener("click", (e) => {
      if (e.target.closest("#theme-toggle")) {
        this.toggleTheme();
      }
    });

    // Listen for system preference changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
  },
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ThemeManager;
}
