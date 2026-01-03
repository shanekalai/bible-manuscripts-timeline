/**
 * NT Manuscripts Timeline - Main Application Entry Point
 * Initializes all components and starts the application
 */

import { initializeMap } from './map.js';
import { loadManuscriptData } from './data.js';
import { initializeMarkers } from './markers.js';
import { initializeTimeline } from './timeline.js';
import { initializeUI } from './ui.js';

/**
 * Initialize the application
 */
async function init() {
  try {
    console.log('NT Manuscripts Timeline - Initializing...');

    // Show loading state
    showLoading();

    // Load manuscript data
    console.log('Loading manuscript data...');
    await loadManuscriptData();
    console.log('Data loaded successfully');

    // Initialize map
    console.log('Initializing map...');
    initializeMap('map');
    console.log('Map initialized');

    // Initialize markers
    console.log('Creating markers...');
    initializeMarkers();
    console.log('Markers created');

    // Initialize timeline controls
    console.log('Initializing timeline...');
    initializeTimeline();
    console.log('Timeline initialized');

    // Initialize UI components
    console.log('Initializing UI...');
    initializeUI();
    console.log('UI initialized');

    // Hide loading state
    hideLoading();

    console.log('NT Manuscripts Timeline - Ready!');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showError(error);
  }
}

/**
 * Show loading state
 */
function showLoading() {
  // You could add a loading spinner here
  console.log('Loading...');
}

/**
 * Hide loading state
 */
function hideLoading() {
  // Remove loading spinner
  console.log('Loading complete');
}

/**
 * Show error message
 * @param {Error} error - Error object
 */
function showError(error) {
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    mapContainer.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-error);
        padding: var(--space-8);
        text-align: center;
      ">
        <h2 style="font-family: var(--font-display); margin-bottom: var(--space-4);">
          Error Loading Application
        </h2>
        <p style="margin-bottom: var(--space-4);">
          ${error.message || 'An unexpected error occurred'}
        </p>
        <button
          onclick="location.reload()"
          style="
            padding: var(--space-3) var(--space-6);
            background: var(--color-primary);
            color: var(--color-white);
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-family: var(--font-primary);
            font-size: var(--text-base);
          "
        >
          Reload Page
        </button>
      </div>
    `;
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export init for potential manual initialization
export { init };
