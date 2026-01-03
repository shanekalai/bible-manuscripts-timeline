# NT Manuscripts Timeline

An interactive map-based timeline visualization of New Testament manuscripts from 0 AD to 1500 AD. This application displays the geographical distribution and chronological development of early NT manuscript discoveries using an animated timeline and interactive map.

## Features

- **Interactive Map**: Leaflet-based map with grayscale CartoDB Positron tiles centered on the Mediterranean/Middle East region
- **Animated Timeline**: Smooth animation showing manuscripts appearing chronologically from 0-1500 AD
- **Filtering**: Filter manuscripts by type (Papyri, Uncials, Minuscules)
- **Manuscript Details**: Click markers to view detailed information about each manuscript
- **Marker Clustering**: Automatic grouping of nearby markers for better visibility
- **Responsive Design**: Clean, modern UI inspired by Flourish.studio

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Mapping**: Leaflet.js with MarkerCluster plugin
- **Data**: JSON-based manuscript database (130+ manuscripts)
- **Styling**: CSS3 with CSS custom properties
- **Fonts**: Google Fonts (Crimson Pro, Inter)

## Project Structure

```
bible-manuscripts-timeline/
├── assets/
│   ├── design-system.css      # CSS variables and design tokens
│   └── manuscript-icon.svg     # Map marker icon
├── data/
│   └── manuscripts.json        # Manuscript database
├── src/
│   ├── index.html             # Main HTML structure
│   ├── styles.css             # Component styles
│   └── js/
│       ├── app.js             # Main entry point
│       ├── config.js          # Configuration constants
│       ├── store.js           # State management (pub/sub)
│       ├── data.js            # Data loading & processing
│       ├── map.js             # Leaflet map initialization
│       ├── markers.js         # Marker creation & animation
│       ├── timeline.js        # Timeline controls & animation
│       ├── ui.js              # UI components (panel, tooltip, modal)
│       └── utils.js           # Utility functions
└── README.md
```

## Architecture

### State Management
The application uses a custom state store with a pub/sub pattern (`store.js`):
- Centralized state for current year, playback status, filters, selected manuscript
- Indexed data structures for fast lookups (by ID, year, type)
- Observer pattern for reactive UI updates

### Component Organization

1. **app.js** - Application initialization and error handling
2. **config.js** - Constants (map bounds, animation speeds, colors)
3. **store.js** - State management with pub/sub
4. **data.js** - Fetches and processes manuscript JSON data
5. **map.js** - Leaflet map setup and marker cluster management
6. **markers.js** - Creates markers, handles visibility and animations
7. **timeline.js** - Timeline controls (play/pause, speed, slider)
8. **ui.js** - Info panel, tooltip, modal, and filter interactions
9. **utils.js** - Helper functions (debounce, formatting, etc.)

### Data Structure

Manuscripts are stored in `/data/manuscripts.json` with:
- **locations**: Named locations with coordinates (Oxyrhynchus, Alexandria, etc.)
- **repositories**: Current storage locations (libraries, museums)
- **manuscripts**: Array of manuscript objects with:
  - `id`: Unique identifier (e.g., "P52")
  - `type`: papyrus, uncial, or minuscule
  - `dateStart`, `dateEnd`, `dateBest`: Dating information
  - `contents`: What books/passages are contained
  - `textType`: Alexandrian, Byzantine, Western, or Caesarean
  - `originLocation`: Reference to location key
  - `repository`: Reference to repository key
  - Metadata: significance, notes, dimensions, etc.

### Animation System

Timeline animation uses `requestAnimationFrame`:
- Configurable playback speeds (0.5x, 1x, 2x, 4x)
- Steps of 10 years for smooth progression
- Fade-in effect over 50 years for newly visible manuscripts
- Automatic pause at end of timeline

## Usage

### Running Locally

1. Clone the repository
2. Serve the project using a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000/src/index.html` in your browser

**Note**: Due to ES6 module imports, the app must be served via HTTP (not opened as `file://`)

### Controls

- **Play/Pause**: Click the play button to start/stop timeline animation
- **Timeline Slider**: Drag to jump to a specific year
- **Speed Control**: Click speed button to cycle through playback speeds
- **Filters**: Click filter buttons to show/hide manuscript types
- **Markers**: Click map markers to view manuscript details
- **Info Button**: Opens modal with app information

## Development

### Adding New Manuscripts

Edit `/data/manuscripts.json`:

```json
{
  "id": "P999",
  "name": "Papyrus 999",
  "type": "papyrus",
  "dateStart": 200,
  "dateEnd": 250,
  "dateBest": 225,
  "contents": "Romans 1:1-5",
  "books": ["Romans"],
  "textType": "Alexandrian",
  "originLocation": "oxyrhynchus",
  "repository": "bodmer",
  "material": "papyrus",
  "significance": "Early witness to Paul's letter"
}
```

### Adding New Locations

Add to the `locations` object in `manuscripts.json`:

```json
"newLocation": {
  "name": "New Location",
  "country": "Egypt",
  "lat": 30.0444,
  "lng": 31.2357,
  "description": "Description here"
}
```

### Customizing Styles

- Edit CSS variables in `/assets/design-system.css`
- Modify component styles in `/src/styles.css`
- Adjust map settings in `/src/js/config.js`

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported (requires ES6 modules)

## Performance

- Efficient rendering with marker clustering
- Indexed data lookups (O(1) complexity)
- Throttled/debounced event handlers
- CSS-based animations for smooth transitions

## Credits

### Data Sources
- [Center for the Study of New Testament Manuscripts (CSNTM)](https://manuscripts.csntm.org/)
- [Greek Critical New Testament (CNTR)](https://greekcntr.org/manuscripts/)
- [New Testament Virtual Manuscript Room (NTVMR)](https://ntvmr.uni-muenster.de/)
- Wikipedia: Lists of NT Papyri, Uncials, and Minuscules

### Libraries
- [Leaflet.js](https://leafletjs.com/) - Interactive maps
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) - Marker clustering
- [CartoDB](https://carto.com/) - Map tiles

### Design
- Inspired by [Flourish.studio](https://flourish.studio/) aesthetics
- Fonts: Crimson Pro (serif), Inter (sans-serif)

## License

This project is for educational and research purposes. Manuscript data is compiled from public sources and scholarly references.

## Contributing

Contributions welcome! Please ensure:
- New manuscripts have proper citations
- Dates are paleographic estimates from reliable sources
- Code follows existing patterns and style
- All features are tested across browsers

---

Built with dedication to preserving and visualizing the rich history of New Testament manuscript transmission.
