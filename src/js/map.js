/**
 * NT Manuscripts Timeline - Map Component
 * Manages Leaflet map instance and base configuration
 */

import { CONFIG } from './config.js';

let mapInstance = null;
let markerClusterGroup = null;

/**
 * Initialize Leaflet map
 * @param {string} containerId - DOM element ID for map container
 * @returns {Object} Map instance
 */
export function initializeMap(containerId) {
  // Remove placeholder if it exists
  const container = document.getElementById(containerId);
  const placeholder = container.querySelector('.map-placeholder');
  if (placeholder) {
    placeholder.remove();
  }

  // Create map instance
  mapInstance = L.map(containerId, {
    center: CONFIG.MAP.DEFAULT_CENTER,
    zoom: CONFIG.MAP.DEFAULT_ZOOM,
    minZoom: CONFIG.MAP.MIN_ZOOM,
    maxZoom: CONFIG.MAP.MAX_ZOOM,
    maxBounds: CONFIG.MAP.MAX_BOUNDS,
    zoomControl: true,
    attributionControl: true
  });

  // Add tile layer (CartoDB Positron - grayscale)
  L.tileLayer(CONFIG.MAP.TILE_LAYER.url, {
    attribution: CONFIG.MAP.TILE_LAYER.attribution,
    subdomains: CONFIG.MAP.TILE_LAYER.subdomains,
    maxZoom: CONFIG.MAP.TILE_LAYER.maxZoom
  }).addTo(mapInstance);

  // Initialize marker cluster group
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: CONFIG.MARKERS.CLUSTER_RADIUS,
    disableClusteringAtZoom: CONFIG.MARKERS.CLUSTER_MAX_ZOOM,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: createClusterIcon
  });

  mapInstance.addLayer(markerClusterGroup);

  return mapInstance;
}

/**
 * Create custom cluster icon
 * @param {Object} cluster - Marker cluster object
 * @returns {Object} Leaflet DivIcon
 */
function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  let className = 'marker-cluster marker-cluster-';

  if (count < 10) {
    className += 'small';
  } else if (count < 50) {
    className += 'medium';
  } else {
    className += 'large';
  }

  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: className,
    iconSize: L.point(40, 40)
  });
}

/**
 * Get map instance
 * @returns {Object} Leaflet map instance
 */
export function getMap() {
  return mapInstance;
}

/**
 * Get marker cluster group
 * @returns {Object} Marker cluster group
 */
export function getMarkerClusterGroup() {
  return markerClusterGroup;
}

/**
 * Add marker to map
 * @param {Object} marker - Leaflet marker
 */
export function addMarker(marker) {
  if (markerClusterGroup) {
    markerClusterGroup.addLayer(marker);
  }
}

/**
 * Remove marker from map
 * @param {Object} marker - Leaflet marker
 */
export function removeMarker(marker) {
  if (markerClusterGroup) {
    markerClusterGroup.removeLayer(marker);
  }
}

/**
 * Clear all markers from map
 */
export function clearMarkers() {
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers();
  }
}

/**
 * Refresh marker clusters
 */
export function refreshClusters() {
  if (markerClusterGroup) {
    markerClusterGroup.refreshClusters();
  }
}

/**
 * Fit map to bounds of all markers
 */
export function fitToBounds() {
  if (markerClusterGroup && mapInstance) {
    const bounds = markerClusterGroup.getBounds();
    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}

/**
 * Resize map (call after container size changes)
 */
export function invalidateSize() {
  if (mapInstance) {
    mapInstance.invalidateSize();
  }
}
