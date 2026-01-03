# Design Quick Start Guide

## Getting Started with the NT Manuscripts Timeline Design

This guide helps developers quickly implement the design system.

---

## File Structure

```
bible-manuscripts-timeline/
├── assets/
│   ├── manuscript-icon.svg          # Custom map marker icon
│   ├── design-system.css            # CSS variables & design tokens
│   ├── DESIGN-README.md             # Complete design documentation
│   └── COMPONENT-REFERENCE.md       # Component specifications
├── src/
│   ├── index.html                   # HTML structure & mockup
│   └── styles.css                   # Main stylesheet
└── data/
    └── manuscripts.json              # Manuscript data (130 entries)
```

---

## Step 1: Load Fonts

Add to your HTML `<head>`:

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## Step 2: Load Stylesheets

```html
<!-- Load in this order -->
<link rel="stylesheet" href="assets/design-system.css">
<link rel="stylesheet" href="src/styles.css">
```

---

## Step 3: Use Color Variables

The design system provides all colors as CSS variables:

```css
/* Example usage */
.my-element {
  background-color: var(--color-parchment-light);
  color: var(--color-ink);
  border: 1px solid var(--color-gray-300);
}

/* Manuscript type colors */
.papyrus-marker {
  background-color: var(--color-papyrus);
}
```

**Key Color Variables:**
- `--color-parchment-light`, `--color-parchment`, `--color-parchment-dark`
- `--color-ink`, `--color-ink-light`
- `--color-papyrus`, `--color-uncial`, `--color-minuscule`
- `--color-primary`, `--color-primary-hover`
- `--color-gray-100` through `--color-gray-700`

---

## Step 4: Use Typography Scale

```css
/* Font families */
font-family: var(--font-primary);    /* Inter - body text */
font-family: var(--font-display);    /* Crimson Pro - headings */
font-family: var(--font-mono);       /* JetBrains Mono - dates */

/* Font sizes */
font-size: var(--text-xs);    /* 12px */
font-size: var(--text-sm);    /* 14px */
font-size: var(--text-base);  /* 16px */
font-size: var(--text-xl);    /* 20px */
font-size: var(--text-2xl);   /* 24px */
font-size: var(--text-3xl);   /* 30px */

/* Font weights */
font-weight: var(--font-normal);    /* 400 */
font-weight: var(--font-medium);    /* 500 */
font-weight: var(--font-semibold);  /* 600 */
font-weight: var(--font-bold);      /* 700 */
```

---

## Step 5: Use Spacing System

```css
/* Spacing scale (4px base unit) */
padding: var(--space-4);      /* 16px - standard padding */
gap: var(--space-3);          /* 12px - default gap */
margin-bottom: var(--space-6); /* 24px - section spacing */

/* Border radius */
border-radius: var(--radius-md);    /* 8px */
border-radius: var(--radius-lg);    /* 12px */
border-radius: var(--radius-full);  /* fully rounded */

/* Shadows */
box-shadow: var(--shadow-sm);    /* Subtle */
box-shadow: var(--shadow-md);    /* Standard */
box-shadow: var(--shadow-lg);    /* Prominent */
```

---

## Step 6: Implement Map Markers

### Using the Custom Icon

**Leaflet Example:**
```javascript
const manuscriptIcon = L.divIcon({
  html: '<img src="assets/manuscript-icon.svg" width="24" height="24">',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: 'manuscript-marker',
  popupAnchor: [0, -12]
});

// Create marker
L.marker([lat, lng], { icon: manuscriptIcon })
  .addTo(map)
  .bindPopup(manuscriptHTML);
```

**Mapbox Example:**
```javascript
// Load icon as image
map.loadImage('assets/manuscript-icon.svg', (error, image) => {
  if (error) throw error;
  map.addImage('manuscript-icon', image);

  // Add markers layer
  map.addLayer({
    id: 'manuscripts',
    type: 'symbol',
    source: 'manuscripts',
    layout: {
      'icon-image': 'manuscript-icon',
      'icon-size': 0.6
    }
  });
});
```

### Color-code by Type
```javascript
// Function to get marker color
function getMarkerColor(type) {
  const colors = {
    'papyrus': '#C97B3C',
    'uncial': '#5B8C5A',
    'minuscule': '#6B7FA8'
  };
  return colors[type] || '#8B6B47';
}

// Apply to marker
marker.getElement().style.filter = `hue-rotate(${hueValue}deg)`;
```

---

## Step 7: Timeline Implementation

### HTML Structure
```html
<div class="timeline-bar">
  <button class="play-btn" id="playBtn">
    <svg class="play-icon">...</svg>
  </button>

  <div class="timeline-slider-container">
    <input type="range" class="timeline-slider"
           min="0" max="1500" value="100" step="10">
  </div>

  <div class="speed-control">
    <button class="icon-btn">1x</button>
  </div>
</div>
```

### JavaScript Controller
```javascript
const timeline = {
  currentYear: 100,
  isPlaying: false,
  speed: 1, // 1x speed

  play() {
    this.isPlaying = true;
    this.interval = setInterval(() => {
      this.currentYear += 10;
      if (this.currentYear > 1500) this.currentYear = 0;
      this.update();
    }, 1000 / this.speed);
  },

  pause() {
    this.isPlaying = false;
    clearInterval(this.interval);
  },

  update() {
    document.getElementById('timelineSlider').value = this.currentYear;
    document.getElementById('currentYear').textContent = this.currentYear;
    updateMap(this.currentYear); // Your map update function
  }
};

// Event listeners
document.getElementById('playBtn').addEventListener('click', () => {
  timeline.isPlaying ? timeline.pause() : timeline.play();
});

document.getElementById('timelineSlider').addEventListener('input', (e) => {
  timeline.currentYear = parseInt(e.target.value);
  timeline.update();
});
```

---

## Step 8: Filter Manuscripts

### JavaScript Filter Logic
```javascript
let activeFilter = 'all';

function filterManuscripts(type) {
  activeFilter = type;

  // Update button states
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === type);
  });

  // Filter markers on map
  manuscripts.forEach(ms => {
    const shouldShow = (type === 'all' || ms.type === type)
                       && ms.dateBest <= timeline.currentYear;
    ms.marker.setOpacity(shouldShow ? 1 : 0);
  });

  updateVisibleCount();
}

// Event listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filterManuscripts(btn.dataset.filter);
  });
});
```

---

## Step 9: Show Manuscript Details

### Open Info Panel
```javascript
function showManuscriptDetails(manuscript) {
  const panel = document.getElementById('infoPanel');
  const content = document.getElementById('panelContent');

  // Build detail HTML
  content.innerHTML = `
    <div class="manuscript-detail">
      <div class="detail-header">
        <span class="manuscript-id">${manuscript.id}</span>
        <span class="manuscript-badge badge-${manuscript.type}">
          ${manuscript.type}
        </span>
      </div>

      <div class="detail-section">
        <h4>Dating</h4>
        <p class="date-range">~${manuscript.dateStart}-${manuscript.dateEnd} AD</p>
      </div>

      <div class="detail-section">
        <h4>Location</h4>
        <p>${manuscript.location}</p>
      </div>

      <div class="detail-section">
        <h4>Contents</h4>
        <p>${manuscript.contents}</p>
      </div>

      <div class="detail-section">
        <h4>Text Type</h4>
        <p class="text-${manuscript.textType.toLowerCase()}">${manuscript.textType}</p>
      </div>

      <div class="detail-section">
        <h4>Description</h4>
        <p class="detail-description">${manuscript.description || 'No description available.'}</p>
      </div>
    </div>
  `;

  // Show panel
  panel.classList.add('active');
}

// Close panel
document.getElementById('closePanelBtn').addEventListener('click', () => {
  document.getElementById('infoPanel').classList.remove('active');
});
```

---

## Step 10: Tooltip on Hover

### JavaScript Tooltip
```javascript
const tooltip = document.getElementById('manuscriptTooltip');

function showTooltip(manuscript, event) {
  tooltip.querySelector('.tooltip-id').textContent = manuscript.id;
  tooltip.querySelector('.tooltip-year').textContent = `~${manuscript.dateBest} AD`;
  tooltip.querySelector('.tooltip-content').textContent = manuscript.contents;

  // Position near cursor
  tooltip.style.left = event.pageX + 15 + 'px';
  tooltip.style.top = event.pageY + 15 + 'px';

  // Show with animation
  tooltip.classList.remove('hidden');
  setTimeout(() => tooltip.classList.add('active'), 10);
}

function hideTooltip() {
  tooltip.classList.remove('active');
  setTimeout(() => tooltip.classList.add('hidden'), 150);
}

// Attach to markers
marker.on('mouseover', (e) => showTooltip(manuscript, e.originalEvent));
marker.on('mouseout', hideTooltip);
```

---

## Common Patterns

### Loading State
```javascript
function setLoading(isLoading) {
  const mapContainer = document.getElementById('map');
  if (isLoading) {
    mapContainer.classList.add('animate-pulse');
  } else {
    mapContainer.classList.remove('animate-pulse');
  }
}
```

### Responsive Check
```javascript
function isMobile() {
  return window.innerWidth < 768;
}

function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}
```

### Keyboard Shortcuts
```javascript
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case ' ':  // Spacebar
      e.preventDefault();
      timeline.isPlaying ? timeline.pause() : timeline.play();
      break;
    case 'Escape':
      document.getElementById('infoPanel').classList.remove('active');
      document.getElementById('modalOverlay').classList.add('hidden');
      break;
    case 'ArrowLeft':
      timeline.currentYear = Math.max(0, timeline.currentYear - 10);
      timeline.update();
      break;
    case 'ArrowRight':
      timeline.currentYear = Math.min(1500, timeline.currentYear + 10);
      timeline.update();
      break;
  }
});
```

---

## Data Structure Reference

The `manuscripts.json` file has this structure:

```javascript
{
  "metadata": { /* version, sources, etc */ },
  "locations": { /* location definitions */ },
  "manuscripts": [
    {
      "id": "P52",
      "type": "papyrus",
      "dateStart": 100,
      "dateEnd": 150,
      "dateBest": 125,
      "location": "oxyrhynchus",  // references locations key
      "contents": "Gospel of John",
      "textType": "Alexandrian",
      "description": "..."
    }
  ]
}
```

### Load and Process Data
```javascript
async function loadManuscripts() {
  const response = await fetch('data/manuscripts.json');
  const data = await response.json();

  // Process manuscripts
  data.manuscripts.forEach(ms => {
    // Get location details
    const location = data.locations[ms.location];

    // Create marker
    const marker = createMarker(location.lat, location.lng, ms);

    // Store reference
    ms.marker = marker;
    ms.locationData = location;
  });

  return data;
}
```

---

## Performance Tips

1. **Debounce timeline updates**
   ```javascript
   let timelineDebounce;
   slider.addEventListener('input', (e) => {
     clearTimeout(timelineDebounce);
     timelineDebounce = setTimeout(() => {
       updateMap(e.target.value);
     }, 100);
   });
   ```

2. **Use CSS transforms for animations** (GPU-accelerated)
   ```css
   /* Good */
   transform: translateX(0);
   opacity: 1;

   /* Avoid */
   left: 0;
   width: 400px;
   ```

3. **Marker clustering for dense areas**
   ```javascript
   // Leaflet MarkerCluster
   const markers = L.markerClusterGroup({
     maxClusterRadius: 50,
     iconCreateFunction: (cluster) => {
       return L.divIcon({
         html: `<div class="cluster">${cluster.getChildCount()}</div>`,
         className: 'manuscript-cluster'
       });
     }
   });
   ```

---

## Browser Support

Designed for modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not supported:** Internet Explorer

**Progressive Enhancement:**
- Core functionality works without JS (static map view)
- Animations disabled if `prefers-reduced-motion` is set

---

## Next Steps

1. **Review Design Files**
   - Read `/assets/DESIGN-README.md` for complete specifications
   - Check `/assets/COMPONENT-REFERENCE.md` for component details

2. **Choose Map Library**
   - Leaflet (recommended for simplicity)
   - Mapbox GL JS (for advanced features)

3. **Set Up Development Environment**
   - Local web server (e.g., `python -m http.server`)
   - Build tools if needed (Vite, Webpack, etc.)

4. **Implement Core Features**
   - Load and display map
   - Add manuscript markers
   - Connect timeline slider
   - Test responsiveness

5. **Add Interactivity**
   - Click handlers for details
   - Play/pause animation
   - Filter controls
   - Tooltips

---

## Questions?

Refer to:
- **Design specs**: `/assets/DESIGN-README.md`
- **Component reference**: `/assets/COMPONENT-REFERENCE.md`
- **HTML structure**: `/src/index.html`
- **Stylesheet**: `/src/styles.css`
- **Design system**: `/assets/design-system.css`

---

**Happy Coding!**

This design system provides a solid foundation for building a beautiful, professional visualization of New Testament manuscripts. Focus on creating an experience that honors the historical significance of these ancient texts while making them accessible and engaging for modern audiences.
