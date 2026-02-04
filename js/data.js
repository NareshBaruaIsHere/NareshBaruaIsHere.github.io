/**
 * Data Manager
 * Handles fetching and caching JSON data
 */

const DataManager = {
  cache: {},

  async fetch(filename) {
    // Return cached data if available
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    try {
      const response = await fetch(`data/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return null;
    }
  },

  async getProfile() {
    return this.fetch("profile.json");
  },

  async getProjects() {
    return this.fetch("projects.json");
  },

  async getCreative() {
    return this.fetch("creative.json");
  },

  async getAchievements() {
    return this.fetch("achievements.json");
  },

  async getNow() {
    return this.fetch("now.json");
  },

  // Helper to get a single project by slug
  async getProjectBySlug(slug) {
    const projects = await this.getProjects();
    if (!projects) return null;
    return projects.find((p) => p.slug === slug);
  },

  // Helper to get creative works by category
  async getCreativeByCategory(category) {
    const creative = await this.getCreative();
    if (!creative) return [];
    return creative.filter((c) => c.category === category);
  },

  // Helper to get latest items
  async getLatestProjects(count = 3) {
    const projects = await this.getProjects();
    if (!projects) return [];
    return projects
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);
  },

  async getLatestCreative(count = 6) {
    const creative = await this.getCreative();
    if (!creative) return [];
    return creative
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);
  },

  // Get all unique tech tags from projects
  async getAllTechTags() {
    const projects = await this.getProjects();
    if (!projects) return [];
    const tags = new Set();
    projects.forEach((p) => p.tech.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  },

  // Clear cache if needed
  clearCache() {
    this.cache = {};
  },
};

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = DataManager;
}
