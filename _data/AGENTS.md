# _data/ - Jekyll Data Files

Configuration data for Jekyll plugins and site features. Primary focus: responsive image presets and wiki content.

## STRUCTURE

```
_data/
├── picture.yml         # jekyll_picture_tag presets (99 LOC) - responsive image configuration
├── navigation.yml      # Site navigation menu items
└── wikis/              # Wiki JSON source files
    └── *.json          # Individual wiki data collections
```

## picture.yml - Responsive Image Configuration

**Purpose**: Defines presets for `jekyll_picture_tag` plugin to generate responsive images with multiple formats and sizes.

**Recent Addition**: Jan 8 2026 (commit 3197ff4) - initial setup with comprehensive preset library.

### Media Queries
```yaml
media_queries:
  mobile: "max-width: 480px"
  tablet: "max-width: 768px"
  laptop: "max-width: 1024px"
  desktop: "max-width: 1200px"
  wide: "min-width: 1201px"
```

### Available Presets

| Preset | Formats | Use Case | Key Features |
|--------|---------|----------|--------------|
| `webp` | WebP + original | General images (legacy) | Basic responsive images |
| `react-lightbox` | WebP + original | **RECOMMENDED** - Images with lightbox | Auto-enhanced with React Photo View, zoom/pan, gallery support |
| `avif` | AVIF + WebP + original | Modern browsers | Smaller files, slower build |
| `loaded` | AVIF + JP2 + WebP + original | Maximum compatibility | All formats, slowest build |
| `thumbnail` | WebP + original | Small fixed-size images | Pixel ratios [1, 1.5, 2], base_width: 250px |
| `avatar` | Original | Square profile images | Crop 1:1, base_width: 100px |
| `lazy` | WebP + original | Lazy-loaded images | `data_auto` markup, noscript fallback |
| `direct` | WebP (single) | Direct URL (no picture tag) | Returns URL only, 600px width |

### Usage Syntax

**Basic** (uses preset defaults):
```liquid
{% picture jpt-webp logo001.jpg %}
```

**With attributes**:
```liquid
{% picture jpt-webp image.jpg --alt "Description" --link /full-size.jpg %}
```

**Art direction** (different images per breakpoint):
```liquid
{% picture jpt-webp hero.jpg mobile:hero-mobile.jpg tablet:hero-tablet.jpg %}
```

**Cropping**:
```liquid
{% picture jpt-webp photo.jpg 16:9 %}
{% picture jpt-webp photo.jpg 1:1 center %}
```

### Responsive Strategy

**Width-based srcsets** (default):
- Generates [200, 400, 800, 1200, 1600]px widths
- Browser selects based on `sizes` attribute
- Example output: `srcset="image-400.webp 400w, image-800.webp 800w, ..."`

**Pixel-ratio srcsets** (fixed-size):
- Used for thumbnails/avatars
- Generates 1x, 1.5x, 2x variants
- Example: `srcset="avatar-100.jpg 1x, avatar-150.jpg 1.5x, avatar-200.jpg 2x"`

### Generated HTML Structure

```html
<picture>
  <source srcset="/assets/img/generated/image-400.webp 400w,
                  /assets/img/generated/image-800.webp 800w,
                  /assets/img/generated/image-1200.webp 1200w"
          sizes="(max-width: 480px) calc(100vw - 16px), 80vw"
          type="image/webp">
  <source srcset="/assets/img/generated/image-400.jpg 400w,
                  /assets/img/generated/image-800.jpg 800w,
                  /assets/img/generated/image-1200.jpg 1200w"
          sizes="(max-width: 480px) calc(100vw - 16px), 80vw"
          type="image/jpeg">
  <img src="/assets/img/generated/image-800.jpg"
       alt="..."
       loading="lazy">
</picture>
```

## React Lightbox Integration (react-photo-view)

**Replaces**: jQuery-based Lightbox2 (removed Jan 8 2026)  
**Library**: react-photo-view v3.x with smooth zoom animations

### Single Image with Lightbox

```liquid
{% picture react-lightbox logo001.jpg --alt "Description" %}
```

Automatically enhanced with:
- Click to zoom fullscreen
- Pinch-to-zoom on mobile
- Smooth animations
- Keyboard navigation (ESC to close)

### Gallery (Multiple Images)

```liquid
{% picture react-lightbox img1.jpg --picture data-gallery="project" --alt "Image 1" %}
{% picture react-lightbox img2.jpg --picture data-gallery="project" --alt "Image 2" %}
{% picture react-lightbox img3.jpg --picture data-gallery="project" --alt "Image 3" %}
```

Images with same `data-gallery` value:
- Navigate with arrow keys (← →)
- Swipe between images on mobile
- Shows counter (1/3, 2/3, etc.)

### How It Works

1. Jekyll generates `<picture data-lightbox="true">` elements
2. Browser loads page (static HTML, fast initial render)
3. React island hydration finds `data-lightbox` pictures
4. Auto-enhances with `ImageLightbox` component
5. Click image → fullscreen modal with zoom/pan

## WHERE TO LOOK

| Task | File/Location | Notes |
|------|---------------|-------|
| Add new preset | `picture.yml` | Copy existing preset, modify formats/widths |
| Change media queries | `picture.yml:3-8` | Affects all presets using `sizes` |
| Modify webp preset | `picture.yml:52-53` | Primary preset used in production |
| Add lazy loading | Use `lazy` preset | `data_auto` markup for lazyload library |
| Get direct URL | Use `direct` preset | Returns single URL, no picture tag |
| Configure wiki data | `wikis/*.json` | See `_plugins/AGENTS.md` for structure |

## CONVENTIONS

**Preset Naming**: Use descriptive names matching use case (`webp`, `thumbnail`, `avatar`, not `preset1`, `preset2`).

**Format Order Matters**: List modern formats first, original last. Browser automatically selects supported format.

**Sizes Attribute**: Critical for performance. Tells browser image display size before layout complete.

**Link Wrapping**: When using `link_source: true` in preset, image auto-wraps in `<a>` to full-size version.

## ANTI-PATTERNS

- **NEVER** commit generated images (`assets/img/generated/`) - build artifacts
- **NEVER** use preset without understanding `sizes` attribute - defaults to `100vw` (too large)
- **AVOID** creating presets with identical settings - reuse existing
- **AVOID** excessive format combinations (`loaded` preset) unless necessary - slows build

## BUILD BEHAVIOR

**Image Processing**:
1. Jekyll reads `{% picture %}` tags during build
2. Plugin checks `_data/picture.yml` for preset configuration
3. Generates responsive images in `assets/img/generated/`
4. Creates `<picture>` element with srcsets
5. Caches generated images (incremental builds skip unchanged)

**Performance**:
- WebP preset: ~2-5s per image first build
- AVIF preset: ~10-20s per image (slow compression)
- Cached images: instant on subsequent builds

## CURRENT USAGE

**Production**: Minimal - only `test-note.md` uses `{% picture jpt-webp logo001.jpg %}`

**Ready for Expansion**: Configuration complete, add to:
- Project pages (`_projects/*.md`)
- Note content (`_notes/*.md`)
- Layout templates (`_layouts/*.html`)

## REFERENCES

- [jekyll_picture_tag Documentation](https://rbuchberger.github.io/jekyll_picture_tag/)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WebP Format](https://developers.google.com/speed/webp)
- [AVIF Format](https://jakearchibald.com/2020/avif-has-landed/)
