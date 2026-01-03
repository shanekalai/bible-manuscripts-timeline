# Quick Start Guide - NT Manuscripts Timeline

## Get Running in 60 Seconds

### 1. Start a Local Server

The app uses ES6 modules which require HTTP (not file://).

**Option A: Python (easiest)**
```bash
cd bible-manuscripts-timeline
python -m http.server 8000
```

**Option B: Node.js**
```bash
npx http-server -p 8000
```

**Option C: PHP**
```bash
php -S localhost:8000
```

### 2. Open in Browser

```
http://localhost:8000/src/index.html
```

### 3. Explore!

- Click ▶️ to start the animation
- Drag the timeline slider to jump to different years
- Click the speed button to adjust playback (0.5x → 1x → 2x → 4x)
- Click filter buttons to show specific manuscript types
- Click map markers to view manuscript details
- Hover over markers for quick info

## What You Should See

1. **Map loads** with grayscale tiles centered on Mediterranean
2. **Markers appear** as timeline advances
3. **Stats update** in top-right corner showing year and counts
4. **Timeline animates** smoothly from 0 AD → 1500 AD
5. **Clusters form** where markers are dense

## Common Issues

### Map doesn't load
- Check browser console for errors
- Ensure you're using HTTP, not file://
- Check internet connection (Leaflet loads from CDN)

### No markers appear
- Verify `/data/manuscripts.json` exists and is valid JSON
- Check browser console for fetch errors
- Ensure relative paths are correct

### Timeline doesn't animate
- Click the play button (▶️)
- Check that manuscripts exist for the current year range
- Open browser console to check for JavaScript errors

### Filters don't work
- Ensure at least one filter is always active
- Check that manuscript types match: 'papyrus', 'uncial', 'minuscule'

## File Structure Check

Verify these files exist:

```
✓ src/index.html
✓ src/styles.css
✓ src/js/app.js
✓ src/js/config.js
✓ src/js/data.js
✓ src/js/map.js
✓ src/js/markers.js
✓ src/js/store.js
✓ src/js/timeline.js
✓ src/js/ui.js
✓ src/js/utils.js
✓ assets/design-system.css
✓ assets/manuscript-icon.svg
✓ data/manuscripts.json
```

## Browser Console Commands

Open DevTools console (F12) and try:

```javascript
// Check if app loaded
console.log('Leaflet loaded:', typeof L !== 'undefined');

// Jump to a specific year
window.store.setYear(500);

// Get current state
console.log(window.store.get());

// Count manuscripts
console.log('Total manuscripts:', window.store.get('manuscripts').length);
```

## Next Steps

1. Read `/README.md` for detailed documentation
2. Review `/IMPLEMENTATION.md` for architecture details
3. Explore `/data/manuscripts.json` to understand data structure
4. Customize colors in `/assets/design-system.css`
5. Modify map settings in `/src/js/config.js`

## Need Help?

Check the browser console (F12) for errors. Most issues are:
- Path problems (use HTTP server)
- Missing dependencies (check CDN links in index.html)
- Invalid JSON (validate manuscripts.json)

Enjoy exploring NT manuscript history!
