/**
 * Projects Page Manager
 */

const ProjectsManager = {
  allProjects: [],
  filteredProjects: [],
  activeTags: new Set(),
  searchQuery: "",

  async init() {
    this.allProjects = (await DataManager.getProjects()) || [];
    this.filteredProjects = [...this.allProjects];

    await this.renderFilters();
    this.renderProjects();
    this.bindEvents();
  },

  async renderFilters() {
    const tags = await DataManager.getAllTechTags();
    const filterContainer = document.getElementById("filter-tags");

    if (filterContainer && tags.length) {
      filterContainer.innerHTML = `
        <span class="filter-label">Filter by:</span>
        ${tags
          .map(
            (tag) => `
          <button class="tag" data-tag="${tag}">${tag}</button>
        `,
          )
          .join("")}
      `;
    }
  },

  renderProjects() {
    const container = document.getElementById("projects-grid");
    if (!container) return;

    if (this.filteredProjects.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>No projects found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredProjects
      .map(
        (project) => `
      <article class="card project-card" data-slug="${project.slug}">
        <div class="card-image">
          <img src="${project.images[0] || "assets/img/placeholder.jpg"}" 
               alt="${project.title}" 
               loading="lazy"
               onerror="this.src='assets/img/placeholder.jpg'">
        </div>
        <div class="card-body">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-text">${project.summary}</p>
          <div class="card-meta">
            <span>${this.formatDate(project.date)}</span>
          </div>
          <div class="card-tags">
            ${project.tech
              .slice(0, 4)
              .map(
                (tag) => `
              <span class="badge">${tag}</span>
            `,
              )
              .join("")}
            ${project.tech.length > 4 ? `<span class="badge">+${project.tech.length - 4}</span>` : ""}
          </div>
        </div>
      </article>
    `,
      )
      .join("");
  },

  filterProjects() {
    this.filteredProjects = this.allProjects.filter((project) => {
      // Search filter
      const matchesSearch =
        this.searchQuery === "" ||
        project.title.toLowerCase().includes(this.searchQuery) ||
        project.summary.toLowerCase().includes(this.searchQuery);

      // Tag filter
      const matchesTags =
        this.activeTags.size === 0 ||
        project.tech.some((tag) => this.activeTags.has(tag));

      return matchesSearch && matchesTags;
    });

    this.renderProjects();
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("project-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterProjects();
      });
    }

    // Tag filters
    document.addEventListener("click", (e) => {
      const tagBtn = e.target.closest(".tag[data-tag]");
      if (tagBtn) {
        const tag = tagBtn.dataset.tag;
        if (this.activeTags.has(tag)) {
          this.activeTags.delete(tag);
          tagBtn.classList.remove("active");
        } else {
          this.activeTags.add(tag);
          tagBtn.classList.add("active");
        }
        this.filterProjects();
      }

      // Project card click
      const projectCard = e.target.closest(".project-card");
      if (projectCard) {
        const slug = projectCard.dataset.slug;
        window.location.href = `project.html?slug=${slug}`;
      }
    });
  },
};

/**
 * Single Project Page Manager
 */
const ProjectDetailManager = {
  async init() {
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) {
      window.location.href = "projects.html";
      return;
    }

    const project = await DataManager.getProjectBySlug(slug);
    if (!project) {
      window.location.href = "404.html";
      return;
    }

    this.renderProject(project);
    this.bindEvents(project);
  },

  renderProject(project) {
    // Update page title
    document.title = `${project.title} | Alex Chen`;

    // Render header section
    const headerSection = document.getElementById("project-header");
    if (headerSection) {
      headerSection.innerHTML = `
        <h1>${project.title}</h1>
        <div class="project-meta">
          <span class="project-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${this.formatDate(project.date)}
          </span>
        </div>
        <div class="card-tags" style="margin-bottom: var(--space-lg);">
          ${project.tech.map((tag) => `<span class="badge badge-primary">${tag}</span>`).join("")}
        </div>
        <div class="project-links">
          ${
            project.repo
              ? `
            <a href="${project.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Code
            </a>
          `
              : ""
          }
          ${
            project.live
              ? `
            <a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          `
              : ""
          }
        </div>
      `;
    }

    // Render content sections
    const contentSection = document.getElementById("project-content");
    if (contentSection && project.details) {
      const sections = [];

      if (project.details.overview) {
        sections.push(`
          <div class="project-section">
            <h2>Overview</h2>
            <p>${project.details.overview}</p>
          </div>
        `);
      }

      if (project.details.features && project.details.features.length) {
        sections.push(`
          <div class="project-section">
            <h2>Features</h2>
            <ul>
              ${project.details.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        `);
      }

      if (project.details.techStack) {
        sections.push(`
          <div class="project-section">
            <h2>Tech Stack</h2>
            <p>${project.details.techStack}</p>
          </div>
        `);
      }

      if (project.details.challenges) {
        sections.push(`
          <div class="project-section">
            <h2>Challenges</h2>
            <p>${project.details.challenges}</p>
          </div>
        `);
      }

      if (project.details.learned) {
        sections.push(`
          <div class="project-section">
            <h2>What I Learned</h2>
            <p>${project.details.learned}</p>
          </div>
        `);
      }

      contentSection.innerHTML = sections.join("");
    }

    // Render gallery
    const gallerySection = document.getElementById("project-gallery");
    if (gallerySection && project.images && project.images.length) {
      gallerySection.innerHTML = `
        <h2 style="margin-bottom: var(--space-lg);">Screenshots</h2>
        <div class="project-gallery">
          ${project.images
            .map(
              (img, i) => `
            <div class="gallery-item" data-index="${i}">
              <img src="${img}" alt="${project.title} screenshot ${i + 1}" loading="lazy" onerror="this.parentElement.style.display='none'">
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  bindEvents(project) {
    // Gallery lightbox
    document.addEventListener("click", (e) => {
      const galleryItem = e.target.closest(".gallery-item");
      if (galleryItem && project.images) {
        const index = parseInt(galleryItem.dataset.index);
        LightboxManager.open(project.images, index);
      }
    });
  },
};

// Initialize based on page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("projects-grid")) {
    ProjectsManager.init();
  }
  if (document.getElementById("project-header")) {
    ProjectDetailManager.init();
  }
});
