/**
 * Creative Pages Manager
 */

const CreativeManager = {
  allWorks: [],
  category: null,

  async init(category = null) {
    this.category = category;
    this.allWorks = (await DataManager.getCreative()) || [];

    if (category) {
      this.renderCategoryPage();
    } else {
      this.renderHubPage();
    }

    this.bindEvents();
  },

  renderHubPage() {
    // Hub page just has static category cards, data loaded for counts
    const categories = ["drawing", "graphic-design", "photography", "singing"];

    categories.forEach((cat) => {
      const count = this.allWorks.filter((w) => w.category === cat).length;
      const countEl = document.querySelector(`[data-category="${cat}"] .count`);
      if (countEl) {
        countEl.textContent = `${count} works`;
      }
    });
  },

  renderCategoryPage() {
    const container = document.getElementById("creative-grid");
    if (!container) return;

    const works = this.allWorks.filter((w) => w.category === this.category);

    // For photography, check if there are albums
    if (this.category === "photography") {
      this.renderPhotographyPage(works);
      return;
    }

    if (works.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3>No works yet</h3>
          <p>Check back soon for new content!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = works.map((work) => this.renderCard(work)).join("");
  },

  renderPhotographyPage(works) {
    const container = document.getElementById("creative-grid");
    if (!container) return;

    // Group by album if present
    const albumWorks = works.filter((w) => w.album);
    const noAlbumWorks = works.filter((w) => !w.album);

    const albums = {};
    albumWorks.forEach((work) => {
      if (!albums[work.album]) {
        albums[work.album] = [];
      }
      albums[work.album].push(work);
    });

    let html = "";

    // Render albums first
    Object.keys(albums).forEach((albumName) => {
      html += `
        <div class="album-section" style="grid-column: 1 / -1;">
          <h3>${albumName}</h3>
          <div class="grid grid-3">
            ${albums[albumName].map((work) => this.renderCard(work)).join("")}
          </div>
        </div>
      `;
    });

    // Render works without album
    if (noAlbumWorks.length > 0) {
      if (Object.keys(albums).length > 0) {
        html += `<div class="album-section" style="grid-column: 1 / -1;"><h3>Other</h3><div class="grid grid-3">`;
      }
      html += noAlbumWorks.map((work) => this.renderCard(work)).join("");
      if (Object.keys(albums).length > 0) {
        html += `</div></div>`;
      }
    }

    container.innerHTML =
      html ||
      `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3>No photos yet</h3>
        <p>Check back soon for new content!</p>
      </div>
    `;
  },

  renderCard(work) {
    return `
      <article class="card creative-card" data-id="${work.id}">
        <div class="card-image">
          <img src="${work.images[0] || "assets/img/placeholder.jpg"}" 
               alt="${work.title}" 
               loading="lazy"
               onerror="this.src='assets/img/placeholder.jpg'">
        </div>
        <div class="card-body">
          <h3 class="card-title">${work.title}</h3>
          <div class="card-meta">
            <span>${this.formatDate(work.date)}</span>
          </div>
        </div>
      </article>
    `;
  },

  openWorkModal(work) {
    const content = `
      <div class="creative-modal-content">
        <div class="creative-modal-image">
          <img src="${work.images[0] || "assets/img/placeholder.jpg"}" alt="${work.title}" onclick="LightboxManager.open(${JSON.stringify(work.images)}, 0)">
          ${
            work.images.length > 1
              ? `
            <div class="grid grid-4 gap-sm mt-md">
              ${work.images
                .slice(1)
                .map(
                  (img, i) => `
                <img src="${img}" alt="${work.title}" style="cursor: pointer; border-radius: var(--radius-sm);" onclick="LightboxManager.open(${JSON.stringify(work.images)}, ${i + 1})">
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
        <div class="creative-modal-info">
          <h4>Date</h4>
          <p>${this.formatDate(work.date)}</p>
          
          <h4>Description</h4>
          <p>${work.description}</p>
          
          <h4>Tools Used</h4>
          <div class="flex flex-wrap gap-sm">
            ${work.tools.map((tool) => `<span class="badge">${tool}</span>`).join("")}
          </div>
          
          ${
            work.externalLink
              ? `
            <a href="${work.externalLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-lg">
              View External
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          `
              : ""
          }
        </div>
      </div>
    `;

    ModalManager.open({
      title: work.title,
      content: content,
      size: "large",
    });
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  },

  bindEvents() {
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".creative-card");
      if (card) {
        const id = card.dataset.id;
        const work = this.allWorks.find((w) => w.id === id);
        if (work) {
          this.openWorkModal(work);
        }
      }
    });
  },
};

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = CreativeManager;
}
