# NT Manuscripts Timeline - Design Documentation

## Overview
This document provides comprehensive design guidance for the NT Manuscripts Timeline visualization app. The design emphasizes clarity, scholarly aesthetics, and modern interactivity inspired by Flourish.studio.

---

## Design Philosophy

### Core Principles
1. **Clarity First** - Information should be immediately understandable
2. **Scholarly Aesthetic** - Warm, professional colors that respect the historical nature of the content
3. **Modern Interactivity** - Smooth animations and responsive interactions
4. **Accessibility** - WCAG 2.1 AA compliant color contrasts and interactive elements

---

## Color System

### Primary Palette - Warm Parchment
The color palette evokes ancient manuscripts and scholarly environments:

- **Parchment Light** (`#F5E6D3`) - Backgrounds, subtle accents
- **Parchment** (`#E8D4B8`) - Secondary backgrounds
- **Parchment Dark** (`#D4A574`) - Accents, quill icon
- **Ink** (`#2C2C2C`) - Primary text, outlines
- **Ink Light** (`#4A4A4A`) - Secondary text

### Manuscript Type Colors
Distinct colors for each manuscript category:

- **Papyrus** (`#C97B3C`) - Warm terracotta (earliest manuscripts)
- **Uncial** (`#5B8C5A`) - Deep sage green (formal scripts)
- **Minuscule** (`#6B7FA8`) - Slate blue (later cursive scripts)

### Text Type Colors
For filtering and legend displays:

- **Alexandrian** (`#8B4789`) - Royal purple
- **Byzantine** (`#B85450`) - Byzantine red
- **Western** (`#7A8E4A`) - Olive green
- **Caesarean** (`#5F7B9A`) - Caesarean blue

### Neutral System
Grayscale for backgrounds and UI elements:

- **Map Background** (`#E5E5E5`) - Light gray for map
- **Gray 100-700** - Full range for UI components

---

## Typography

### Font Families

**Primary Font**: Inter
- Clean, modern sans-serif
- Excellent readability at all sizes
- Used for: Body text, UI controls, labels

**Display Font**: Crimson Pro
- Elegant serif with scholarly feel
- Used for: Headings, manuscript IDs, emphasis

**Monospace Font**: JetBrains Mono
- Used for: Dates, technical data, year labels

### Font Scale
```
xs:   12px (0.75rem)   - Small labels, captions
sm:   14px (0.875rem)  - Secondary text, filter buttons
base: 16px (1rem)      - Body text (default)
lg:   18px (1.125rem)  - Emphasis text
xl:   20px (1.25rem)   - Section headings
2xl:  24px (1.5rem)    - Panel titles
3xl:  30px (1.875rem)  - Page title
4xl:  36px (2.25rem)   - Hero headings
```

### Font Weights
- Light (300) - Rare, only for very large text
- Normal (400) - Body text
- Medium (500) - Emphasis, buttons
- Semibold (600) - Headings, important labels
- Bold (700) - Major headings, manuscript IDs

---

## Iconography

### Manuscript Icon (`manuscript-icon.svg`)
**Design Specifications:**
- **Size**: 40x40px viewBox (scalable)
- **Elements**: Simplified scroll with quill overlay
- **Colors**: Parchment (#F5E6D3) with ink outlines (#2C2C2C)
- **Usage**:
  - Map markers: 20-32px
  - Header logo: 48px
  - Large display: up to 64px

**Design Rationale:**
- Simplified from the original manuscript.png for small-size clarity
- Flat design aesthetic (no gradients) for modern look
- Drop shadow for depth on map
- Clear silhouette for instant recognition

### UI Icons
All UI icons use inline SVG with currentColor fill for easy theming:
- **Info icon** - Circle with 'i'
- **Play/Pause** - Triangle/Double bars
- **Close** - X mark
- **Speed control** - Play with speed indicator

---

## Layout Structure

### Viewport Distribution
```
┌─────────────────────────────────────────┐
│ Header (80px)                           │  ~6%
├─────────────────────────────────────────┤
│                                         │
│                                         │
│         Map Container                   │  ~80%
│         (with Stats Overlay)            │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ Timeline Bar (120px)                    │  ~14%
└─────────────────────────────────────────┘
```

### Header Components (Left to Right)
1. Icon (48px) + Title + Subtitle
2. Spacer (flex-grow)
3. Filter buttons group
4. Info button

### Map Area
- **Main**: Full container for Leaflet/map library
- **Stats Overlay**: Position absolute, top-right
  - Current year
  - Visible manuscript count
  - Total manuscript count

### Timeline Bar Layout
```
[Play Button] [━━━━━ Timeline Slider ━━━━━] [Speed]
    (56px)    (flexible, min 400px)         (48px)
```

---

## Interactive Components

### 1. Timeline Slider
**Specifications:**
- **Track**: 8px height, rounded, light gray background
- **Thumb**: 24px circle, primary color, white border (3px)
- **Range**: 0 AD to 1500 AD (step: 10 years)
- **Labels**: 4 major marks (0, 500, 1000, 1500)
- **Markers**: Thin vertical lines showing manuscript dates

**Interactions:**
- Hover: Thumb scales 110%
- Drag: Smooth scrubbing with debounced map updates
- Click track: Jump to position
- Keyboard: Arrow keys move ±10 years

### 2. Play/Pause Button
**Specifications:**
- **Size**: 56px circle
- **Border**: 2px primary color
- **Icon**: Play triangle OR pause bars (toggle)

**States:**
- Default: White background, primary icon
- Hover: Primary background, white icon, scale 105%
- Active: Scale 98%
- Playing: Swap to pause icon

**Animation Speed Options:**
- 0.5x (slow) - 2 seconds per 50 years
- 1x (normal) - 1 second per 50 years
- 2x (fast) - 0.5 seconds per 50 years
- 4x (very fast) - 0.25 seconds per 50 years

### 3. Filter Buttons
**Specifications:**
- **Height**: 36px
- **Padding**: 8px 16px
- **Border radius**: 8px
- **Dot**: 10px circle in manuscript color

**States:**
- Default: White background, gray text
- Hover: Light gray background
- Active: Primary background, white text
- Focus: 2px outline (accessibility)

### 4. Manuscript Tooltip
**Trigger**: Hover over map marker
**Position**: Follow cursor with 8px offset
**Animation**: Fade in + slide up (150ms)

**Content Structure:**
```
┌─────────────────────────┐
│ P52          ~125 AD   │ ← Header (ID + Year)
├─────────────────────────┤
│ Gospel of John         │ ← Brief description
└─────────────────────────┘
```

### 5. Info Panel (Slide-out)
**Specifications:**
- **Width**: 400px (100% on mobile)
- **Position**: Fixed right, full height
- **Animation**: Slide from right (350ms ease-out)
- **Backdrop**: Optional semi-transparent overlay

**Trigger**: Click on map marker or search result

**Content Sections:**
- Header (ID + Type badge)
- Dating
- Location
- Contents
- Text Type
- Description

**Close Actions:**
- Close button (X)
- Click backdrop (if overlay enabled)
- ESC key

### 6. Modal (About/Info)
**Specifications:**
- **Max width**: 600px
- **Max height**: 80vh
- **Backdrop**: Dark overlay (50% opacity) + blur
- **Animation**: Fade in overlay + scale up modal

---

## Spacing System

Uses 4px base unit (0.25rem):

```
1  = 4px    (tight)
2  = 8px    (compact)
3  = 12px   (default gap)
4  = 16px   (standard padding)
6  = 24px   (section spacing)
8  = 32px   (large gaps)
12 = 48px   (major sections)
```

**Application:**
- Component padding: 16px (--space-4)
- Element gaps: 8-12px (--space-2 to --space-3)
- Section margins: 24-32px (--space-6 to --space-8)

---

## Shadow System

Elevation hierarchy:

- **sm**: Subtle depth (buttons, cards)
- **md**: Default elevation (controls, overlays)
- **lg**: Prominent elements (stats overlay)
- **xl**: Modals, panels, major UI

**Usage Guidelines:**
- Map markers: sm shadow
- Floating controls: md shadow
- Stats overlay: lg shadow
- Modals/panels: xl shadow

---

## Animation Guidelines

### Timing Functions
- **Fast**: 150ms ease-in-out - Micro-interactions (hover states)
- **Base**: 250ms ease-in-out - Standard transitions (panel open)
- **Slow**: 350ms ease-in-out - Large movements (modals)

### Animation Types

**Fade In:**
```css
opacity: 0 → 1
transform: translateY(10px) → translateY(0)
duration: 250ms
```

**Slide In:**
```css
transform: translateX(100%) → translateX(0)
duration: 350ms ease-out
```

**Scale Hover:**
```css
transform: scale(1) → scale(1.05)
duration: 150ms ease-in-out
```

**Pulse (loading):**
```css
opacity: 1 → 0.5 → 1
duration: 2s infinite
```

### Timeline Animation
When playing:
1. Update slider value every 100ms
2. Update year display (no animation, instant)
3. Fade in new manuscript markers (250ms)
4. Map pan/zoom should be smooth (500ms ease-out)

---

## Responsive Breakpoints

### Desktop Large (1920px+)
- Max content width: 1920px
- Stats overlay: Top right with full spacing
- Info panel: 400px width

### Desktop (1024px - 1919px)
- Standard layout
- Slightly reduced spacing

### Tablet (768px - 1023px)
- Header stacks vertically
- Filter buttons wrap
- Info panel: 100% width
- Reduced font sizes (90%)

### Mobile (< 768px)
- Single column layout
- Timeline labels: 2 marks only (0 AD, 1500 AD)
- Stats overlay: Compact, vertical stack
- Play button: 48px
- Touch-optimized targets (44px minimum)

---

## Accessibility

### Color Contrast
All text meets WCAG 2.1 AA standards:
- **Normal text**: 4.5:1 minimum
- **Large text** (18px+): 3:1 minimum
- **UI components**: 3:1 minimum

### Keyboard Navigation
- Tab order: Header → Filters → Map → Timeline → Panel
- Focus indicators: 2px outline in primary color
- ESC key: Close modals/panels
- Space/Enter: Activate buttons
- Arrow keys: Navigate timeline slider

### Screen Readers
- Semantic HTML (header, main, aside, nav)
- ARIA labels for icon buttons
- ARIA live regions for dynamic year updates
- Alt text for icons

### Motion
- Respect prefers-reduced-motion
- Disable auto-play animation if set
- Reduce transition times to 0ms

---

## Map Integration Recommendations

### Recommended Libraries
1. **Leaflet** (preferred)
   - Lightweight, flexible
   - Good plugin ecosystem
   - Easy custom marker styling

2. **Mapbox GL JS** (alternative)
   - Beautiful rendering
   - Better performance for large datasets
   - Requires API key

### Map Styling
- **Base map**: Light grayscale (Mapbox Light, CartoDB Positron)
- **Water**: Very light blue (#E8F4F8)
- **Land**: Light gray (#E5E5E5)
- **Borders**: Subtle gray lines (#D1D1D1)
- **Labels**: Minimal, small font

### Marker Styling
```javascript
// Example Leaflet marker
const manuscriptIcon = L.divIcon({
  html: '<img src="assets/manuscript-icon.svg">',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: 'manuscript-marker'
});
```

**Marker Sizes by Zoom:**
- Zoom 3-5: 16px (overview)
- Zoom 6-8: 24px (standard)
- Zoom 9+: 32px (detailed)

**Clustering:**
- Use marker clustering for overlapping manuscripts
- Cluster threshold: 3+ manuscripts within 50px
- Cluster style: Circle with count, primary color

---

## Implementation Guidelines

### CSS Organization
Files are structured as:
1. **design-system.css** - Variables, tokens, utilities
2. **styles.css** - Component styles, layout

Load order:
```html
<link rel="stylesheet" href="assets/design-system.css">
<link rel="stylesheet" href="src/styles.css">
```

### JavaScript Interaction Classes
Use these classes for state management:

- `.active` - Element is selected/visible
- `.hidden` - Display none
- `.invisible` - Visibility hidden (maintains space)
- `.disabled` - Non-interactive state

### Data Attributes
Recommended data attributes for JavaScript:

```html
<button data-filter="papyrus">
<div data-manuscript-id="P52">
<div data-year="125">
```

---

## Performance Considerations

### Image Optimization
- SVG icons: Already optimized, ~2KB each
- Use SVG sprites for repeated icons
- Inline critical SVGs (header icon, play button)

### Animation Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during animation)

### Rendering Optimization
- Debounce timeline slider updates (100ms)
- Throttle map updates (250ms)
- Virtual scrolling for long manuscript lists
- Lazy load manuscript details

---

## Future Enhancements

### Potential Features
1. **Dark Mode**
   - Invert color scheme
   - Darker map background (#2C2C2C)
   - Light markers on dark background

2. **Print Stylesheet**
   - Static map snapshot
   - Manuscript list table
   - Remove interactive controls

3. **Export Options**
   - Download current view as PNG
   - Export filtered data as CSV
   - Share link with current state

4. **Advanced Filters**
   - Multi-select text types
   - Date range selector
   - Search by manuscript ID or content

5. **Comparison Mode**
   - Side-by-side manuscript comparison
   - Highlight differences in text types
   - Timeline synchronization

---

## Design Assets Checklist

✅ Custom SVG icon (`manuscript-icon.svg`)
✅ Design system CSS (`design-system.css`)
✅ HTML structure (`index.html`)
✅ Main stylesheet (`styles.css`)
✅ Design documentation (this file)

---

## Questions for Developers

Before implementation, consider:

1. **Map Library**: Leaflet or Mapbox? (Recommend Leaflet for simplicity)
2. **Data Loading**: Client-side JSON or API endpoint?
3. **State Management**: Vanilla JS, React, or Vue?
4. **Browser Support**: Modern only or IE11 compatibility?
5. **Hosting**: Static site or server-side rendering?

---

## Resources

### Google Fonts
- Import: `https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap`

### Design Inspiration
- Flourish.studio - Data visualization aesthetic
- uiverse.io - Interactive component patterns
- Observable - Timeline interaction patterns

### Map Resources
- Leaflet: https://leafletjs.com/
- Mapbox: https://www.mapbox.com/
- CartoDB Basemaps: https://carto.com/basemaps/

---

**Design Version**: 1.0.0
**Last Updated**: 2026-01-03
**Designer**: Claude (Graphic Designer Agent)
