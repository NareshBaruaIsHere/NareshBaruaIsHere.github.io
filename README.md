# Naresh Barua (IfElseGhost) - Portfolio Website

A clean, modern, and fully static portfolio website built with vanilla HTML, CSS, and JavaScript. Features a minimal modern design with glassmorphism effects and red accent colors.

## 🚀 Features

- **Mobile-first responsive design** - Looks great on all devices
- **Dark/Light theme toggle** - Respects system preferences and persists choice
- **Glassmorphism UI** - Modern glass-like design with blur effects
- **Red accent color scheme** - Bold and minimal aesthetic
- **Data-driven content** - All content loaded from JSON files for easy updates
- **Fast & accessible** - Optimized for performance and screen readers
- **SEO-friendly** - Proper meta tags, sitemap, and semantic HTML

## 📁 Project Structure

```
/
├── index.html              # Home page
├── about.html              # About page
├── projects.html           # Projects listing
├── project.html            # Single project details
├── creative.html           # Creative work hub
├── drawing.html            # Drawing category
├── graphic-design.html     # Graphic design category
├── photography.html        # Photography category
├── singing.html            # Singing category
├── now.html                # What I'm doing now
├── achievements.html       # Timeline of achievements
├── contact.html            # Contact information
├── 404.html                # Error page
├── robots.txt              # Search engine directives
├── sitemap.xml             # Sitemap for SEO
│
├── /assets
│   ├── /img                # Images
│   ├── favicon.svg         # Site favicon
│   └── resume.pdf          # Downloadable resume
│
├── /css
│   └── styles.css          # All styles
│
├── /js
│   ├── main.js             # Global functionality
│   ├── theme.js            # Theme switching
│   ├── data.js             # Data fetching helpers
│   ├── modal.js            # Modal & lightbox
│   ├── projects.js         # Projects page logic
│   └── creative.js         # Creative pages logic
│
├── /data
│   ├── profile.json        # Personal info & skills
│   ├── projects.json       # Project entries
│   ├── creative.json       # Creative work entries
│   ├── achievements.json   # Achievements timeline
│   └── now.json            # Current focus/learning
│
└── /partials
    ├── header.html         # Shared header/nav
    └── footer.html         # Shared footer
```

## ✏️ Updating Content

All content is driven by JSON files in the `/data` folder. No need to edit HTML!

### Profile (`data/profile.json`)

```json
{
  "name": "Your Name",
  "tagline": "Your tagline",
  "bioShort": "Short bio for about page",
  "bioLong": "Full bio with multiple paragraphs",
  "email": "your@email.com",
  "location": "City, Country",
  "socials": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  },
  "skills": {
    "languages": ["JavaScript", "Python"],
    "frameworks": ["React", "Node.js"],
    "tools": ["Git", "Docker"],
    "creative": ["Photoshop", "Figma"]
  }
}
```

### Projects (`data/projects.json`)

```json
[
  {
    "slug": "project-slug", // URL-friendly identifier
    "title": "Project Title",
    "date": "2025-01-15", // YYYY-MM-DD format
    "tech": ["React", "Node.js"], // Technology tags
    "summary": "Brief description",
    "details": {
      "overview": "Full project overview",
      "features": ["Feature 1", "Feature 2"],
      "techStack": "Technical details",
      "challenges": "Challenges faced",
      "learned": "What you learned"
    },
    "repo": "https://github.com/...", // Optional
    "live": "https://demo.com", // Optional
    "images": ["assets/img/project1.jpg"]
  }
]
```

### Creative Works (`data/creative.json`)

```json
[
  {
    "id": "unique-id",
    "title": "Work Title",
    "category": "drawing", // drawing, graphic-design, photography, singing
    "date": "2025-01-15",
    "tools": ["Procreate", "iPad"],
    "description": "Description of the work",
    "images": ["assets/img/work1.jpg"],
    "album": "Album Name", // Optional, for photography grouping
    "externalLink": "https://..." // Optional
  }
]
```

### Achievements (`data/achievements.json`)

```json
[
  {
    "title": "Achievement Title",
    "date": "2025-01-15",
    "issuer": "Organization Name",
    "description": "What you achieved",
    "link": "https://..." // Optional
  }
]
```

### Now Page (`data/now.json`)

```json
{
  "currentFocus": "What you're focused on right now",
  "whatLearning": ["Thing 1", "Thing 2"],
  "goals": ["Goal 1", "Goal 2"],
  "reading": ["Book 1", "Book 2"],
  "updatedDate": "2025-01-15"
}
```

## 🖼️ Adding Images

1. Place images in the `assets/img/` folder
2. Reference them in JSON files: `"assets/img/your-image.jpg"`
3. Use descriptive filenames
4. Optimize images for web (compress, resize)

Recommended image sizes:

- Project thumbnails: 800x500px
- Creative work: 800x800px (square)
- Profile photo: 400x400px

## 💻 Local Development

### Option 1: VS Code Live Server (Recommended)

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The site will open at `http://localhost:5500`

### Option 2: Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

### Option 3: Node.js HTTP Server

```bash
# Install globally
npm install -g http-server

# Run in project directory
http-server

# Open http://localhost:8080
```

## 🚀 Deploying to GitHub Pages

### Method 1: Deploy from main branch

1. Push your code to GitHub
2. Go to repository **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Select **/ (root)** folder
5. Click **Save**
6. Your site will be live at `https://yourusername.github.io/repository-name/`

### Method 2: Using GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/configure-pages@v3
      - uses: actions/upload-pages-artifact@v2
        with:
          path: "."
      - uses: actions/deploy-pages@v2
```

## 🌐 Custom Domain Setup

1. Purchase a domain from a registrar (Namecheap, Google Domains, etc.)

2. In your GitHub repository, go to **Settings** → **Pages**

3. Under "Custom domain", enter your domain (e.g., `alexchen.dev`)

4. Check "Enforce HTTPS"

5. Configure DNS records at your registrar:

   For apex domain (`alexchen.dev`):

   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   ```

   For www subdomain:

   ```
   CNAME www   yourusername.github.io
   ```

6. Create a `CNAME` file in your repository root containing just your domain:

   ```
   alexchen.dev
   ```

7. Update `sitemap.xml` and meta tags with your actual domain

## 🎨 Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
  --color-primary: #2563eb; /* Main brand color */
  --color-accent: #8b5cf6; /* Accent color */
  /* ... more variables */
}
```

### Fonts

The site uses Inter font. To change:

1. Update the Google Fonts link in HTML files
2. Update `--font-sans` in CSS

### Logo

The logo shows "AC" by default. Edit `partials/header.html` to change it.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Credits

- Font: [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson
- Icons: Inline SVGs from [Heroicons](https://heroicons.com/)
- Inspired by the [/now page movement](https://nownownow.com/about)

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript.
