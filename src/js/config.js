/**
 * NT Manuscripts Timeline - Configuration
 * Constants and configuration values for the application
 */

export const CONFIG = {
  // Timeline settings
  TIMELINE: {
    MIN_YEAR: 0,
    MAX_YEAR: 1500,
    STEP: 10,
    DEFAULT_YEAR: 100,
    ANIMATION_SPEEDS: [0.5, 1, 2, 4],
    DEFAULT_SPEED_INDEX: 1,
    FRAME_DELAY: 100, // milliseconds between animation frames
  },

  // Map settings
  MAP: {
    DEFAULT_CENTER: [35.0, 30.0], // Mediterranean focus
    DEFAULT_ZOOM: 5,
    MIN_ZOOM: 3,
    MAX_ZOOM: 12,
    MAX_BOUNDS: [
      [25.0, 0.0],   // Southwest
      [50.0, 50.0]   // Northeast
    ],
    TILE_LAYER: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }
  },

  // Marker settings
  MARKERS: {
    ICON_SIZE: [32, 32],
    ICON_ANCHOR: [16, 32],
    POPUP_ANCHOR: [0, -32],
    CLUSTER_RADIUS: 50,
    CLUSTER_MAX_ZOOM: 9,
    ANIMATION_DURATION: 300, // milliseconds
  },

  // Manuscript type colors (match CSS variables)
  COLORS: {
    papyrus: '#C97B3C',
    uncial: '#5B8C5A',
    minuscule: '#6B7FA8',
  },

  // Data source
  DATA: {
    MANUSCRIPTS_URL: '../data/manuscripts.json',
  },

  // UI settings
  UI: {
    TOOLTIP_OFFSET: { x: 10, y: -10 },
    DEBOUNCE_DELAY: 150,
    THROTTLE_DELAY: 100,
  }
};
