/**
 * NT Manuscripts Timeline - Marker Management
 * Handles creation, animation, and management of map markers
 */

import { CONFIG } from './config.js';
import { store } from './store.js';
import { addMarker, removeMarker, refreshClusters } from './map.js';
import { isManuscriptVisible, calculateMarkerOpacity } from './utils.js';
import { showTooltip, hideTooltip, showManuscriptDetail } from './ui.js';

// Store markers by manuscript ID
const markers = new Map();

/**
 * Create custom marker icon for manuscript
 * @param {Object} manuscript - Manuscript object
 * @param {number} opacity - Opacity value (0-1)
 * @returns {Object} Leaflet icon
 */
function createMarkerIcon(manuscript, opacity = 1) {
  const color = CONFIG.COLORS[manuscript.type] || CONFIG.COLORS.papyrus;

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${manuscript.id}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="16" cy="16" r="8" fill="${color}" opacity="${opacity}" filter="url(#shadow-${manuscript.id})"/>
      <circle cx="16" cy="16" r="6" fill="${color}" opacity="${Math.min(opacity * 1.2, 1)}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'manuscript-marker',
    iconSize: CONFIG.MARKERS.ICON_SIZE,
    iconAnchor: CONFIG.MARKERS.ICON_ANCHOR,
    popupAnchor: CONFIG.MARKERS.POPUP_ANCHOR
  });
}

/**
 * Create marker for manuscript
 * @param {Object} manuscript - Manuscript object
 * @returns {Object|null} Leaflet marker or null if no location
 */
export function createManuscriptMarker(manuscript) {
  const coords = store.getManuscriptLocation(manuscript);

  if (!coords) {
    console.warn(`No location found for manuscript ${manuscript.id}`);
    return null;
  }

  const currentYear = store.get('currentYear');
  const opacity = calculateMarkerOpacity(manuscript, currentYear);
  const icon = createMarkerIcon(manuscript, opacity);

  const marker = L.marker(coords, {
    icon,
    opacity: opacity > 0 ? 1 : 0,
    manuscriptId: manuscript.id
  });

  // Add event listeners
  marker.on('click', () => {
    showManuscriptDetail(manuscript);
  });

  marker.on('mouseover', (e) => {
    showTooltip(manuscript, e.originalEvent);
  });

  marker.on('mouseout', () => {
    hideTooltip();
  });

  // Store marker reference
  markers.set(manuscript.id, marker);

  // Add to map if visible
  if (isManuscriptVisible(manuscript, currentYear)) {
    addMarker(marker);
  }

  return marker;
}

/**
 * Update marker opacity based on current year
 * @param {Object} manuscript - Manuscript object
 * @param {number} currentYear - Current timeline year
 */
export function updateMarkerOpacity(manuscript, currentYear) {
  const marker = markers.get(manuscript.id);
  if (!marker) return;

  const opacity = calculateMarkerOpacity(manuscript, currentYear);
  const isVisible = isManuscriptVisible(manuscript, currentYear);

  // Update icon with new opacity
  const icon = createMarkerIcon(manuscript, opacity);
  marker.setIcon(icon);

  // Show/hide marker with animation
  if (isVisible) {
    if (!marker._map) {
      addMarker(marker);
      // Trigger animation by setting opacity after a brief delay
      setTimeout(() => {
        marker.setOpacity(1);
      }, 10);
    }
  } else {
    if (marker._map) {
      marker.setOpacity(0);
      // Remove from map after animation
      setTimeout(() => {
        removeMarker(marker);
      }, CONFIG.MARKERS.ANIMATION_DURATION);
    }
  }
}

/**
 * Update all markers based on current year and filters
 */
export function updateAllMarkers() {
  const currentYear = store.get('currentYear');
  const visibleManuscripts = store.get('visibleManuscripts');
  const allManuscripts = store.get('manuscripts');

  // Update each manuscript's marker
  allManuscripts.forEach(manuscript => {
    const marker = markers.get(manuscript.id);
    if (!marker) return;

    const shouldBeVisible = visibleManuscripts.includes(manuscript);
    const isCurrentlyVisible = marker._map !== undefined;

    if (shouldBeVisible) {
      updateMarkerOpacity(manuscript, currentYear);
    } else if (isCurrentlyVisible) {
      // Hide marker if it doesn't match current filters
      marker.setOpacity(0);
      setTimeout(() => {
        removeMarker(marker);
      }, CONFIG.MARKERS.ANIMATION_DURATION);
    }
  });

  // Refresh clusters after updates
  refreshClusters();
}

/**
 * Initialize all manuscript markers
 */
export function initializeMarkers() {
  const manuscripts = store.get('manuscripts');

  manuscripts.forEach(manuscript => {
    createManuscriptMarker(manuscript);
  });

  // Update markers to show initial state
  updateAllMarkers();

  // Subscribe to state changes
  store.subscribe('currentYear', () => {
    updateAllMarkers();
  });

  store.subscribe('visibleManuscripts', () => {
    updateAllMarkers();
  });
}

/**
 * Get marker by manuscript ID
 * @param {string} id - Manuscript ID
 * @returns {Object|null} Leaflet marker
 */
export function getMarker(id) {
  return markers.get(id) || null;
}

/**
 * Highlight marker (e.g., when manuscript is selected)
 * @param {string} id - Manuscript ID
 */
export function highlightMarker(id) {
  const marker = markers.get(id);
  if (marker && marker._map) {
    // Temporarily increase size and opacity
    const manuscript = store.getManuscript(id);
    const icon = createMarkerIcon(manuscript, 1);
    marker.setIcon(icon);
    marker.setZIndexOffset(1000);
  }
}

/**
 * Remove highlight from marker
 * @param {string} id - Manuscript ID
 */
export function unhighlightMarker(id) {
  const marker = markers.get(id);
  if (marker) {
    const manuscript = store.getManuscript(id);
    const currentYear = store.get('currentYear');
    const opacity = calculateMarkerOpacity(manuscript, currentYear);
    const icon = createMarkerIcon(manuscript, opacity);
    marker.setIcon(icon);
    marker.setZIndexOffset(0);
  }
}
