# Image Optimization Guide for Portfolio

## 🚀 Implemented Optimizations

Your portfolio now includes these image optimization strategies:

### 1. **Thumbnail System for Gallery** ⭐ NEW

- Gallery shows **low-resolution thumbnails** (fast loading)
- Lightbox displays **full resolution** for viewing
- Download button gets **full resolution** file
- Run `scripts/generate-thumbnails.ps1` to create thumbnails

### 2. **Native Lazy Loading**

- Images below the fold use `loading="lazy"`
- Above-fold images use `loading="eager"` for immediate loading

### 3. **Priority Hints (fetchpriority)**

- Hero image: `fetchpriority="high"`
- First 3 project cards: `fetchpriority="high"`
- Gallery images: `fetchpriority="low"`

### 4. **Async Decoding**

- All images use `decoding="async"` to not block rendering

### 5. **Image Preloading**

- Hero image is preloaded in `<head>` for fastest LCP

### 6. **Skeleton Loading Placeholders**

- Shimmer animation while images load prevents layout shift

---

## 🖼️ Generate Thumbnails (Important!)

Run this command in PowerShell to create thumbnails for your gallery:

```powershell
# From project root directory
.\scripts\generate-thumbnails.ps1
```

This creates a `thumbs` subfolder with 600px max-width images at 60% quality.

**Thumbnail Structure:**

```
assets/img/photography/
├── photo1.jpg          (Full resolution - for download)
├── photo2.jpg
└── thumbs/
    ├── photo1.jpg      (Thumbnail - for gallery preview)
    └── photo2.jpg
```

---

## 🔧 Additional Manual Optimizations

### Convert Images to WebP/AVIF (Recommended)

Run these commands to convert your images (requires ImageMagick or similar):

```bash
# Using ImageMagick (install: https://imagemagick.org/)
# Convert all JPGs to WebP with 80% quality
for file in assets/img/**/*.jpg; do
  magick "$file" -quality 80 "${file%.jpg}.webp"
done

# Convert all PNGs to WebP
for file in assets/img/**/*.png; do
  magick "$file" -quality 90 "${file%.png}.webp"
done
```

### Using Squoosh CLI (Recommended)

```bash
# Install
npm install -g @squoosh/cli

# Convert to WebP
npx @squoosh/cli --webp '{quality: 80}' assets/img/**/*.jpg

# Convert to AVIF (best compression)
npx @squoosh/cli --avif '{quality: 60}' assets/img/**/*.jpg
```

### Generate Responsive Images

```bash
# Create multiple sizes for srcset
for file in assets/img/projects/*.jpg; do
  name="${file%.jpg}"
  magick "$file" -resize 400x "$name-400w.jpg"
  magick "$file" -resize 800x "$name-800w.jpg"
done
```

---

## 📊 Recommended Image Sizes

| Use Case            | Recommended Size | Format |
| ------------------- | ---------------- | ------ |
| Hero/Profile        | 400x400 max      | WebP   |
| Project Cards       | 800x600 max      | WebP   |
| Gallery Thumbnails  | 600x400 max      | WebP   |
| Full Gallery Images | 1600x1200 max    | WebP   |
| OG Image            | 1200x630         | JPG    |

---

## ⚡ Quick Wins

1. **Compress existing images**: Use [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. **Use SVG for icons**: Already using inline SVGs ✅
3. **Use placeholder.svg**: Already implemented ✅
4. **Set explicit dimensions**: Prevents layout shift

---

## 🎯 Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms

Test with: [PageSpeed Insights](https://pagespeed.web.dev/)
