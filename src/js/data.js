/**
 * NT Manuscripts Timeline - Data Loading
 * Handles fetching and processing manuscript data
 */

import { CONFIG } from './config.js';
import { store } from './store.js';

/**
 * Load manuscript data from JSON file
 * @returns {Promise<Object>} Loaded data
 */
export async function loadManuscriptData() {
  try {
    const response = await fetch(CONFIG.DATA.MANUSCRIPTS_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process and validate data
    const processedData = processManuscriptData(data);

    // Initialize store with data
    store.initializeData(processedData);

    return processedData;
  } catch (error) {
    console.error('Error loading manuscript data:', error);
    throw error;
  }
}

/**
 * Process and validate manuscript data
 * @param {Object} data - Raw data from JSON
 * @returns {Object} Processed data
 */
function processManuscriptData(data) {
  const { manuscripts, locations, repositories, metadata } = data;

  // Process each manuscript
  const processedManuscripts = manuscripts.map(manuscript => {
    return {
      ...manuscript,
      // Ensure we have a best date estimate
      dateBest: manuscript.dateBest || Math.floor((manuscript.dateStart + manuscript.dateEnd) / 2)
    };
  });

  return {
    manuscripts: processedManuscripts,
    locations,
    repositories,
    metadata
  };
}

/**
 * Resolve manuscript location to coordinates
 * @param {Object} manuscript - Manuscript object
 * @param {Object} locations - Locations lookup object
 * @param {Object} repositories - Repositories lookup object
 * @returns {Array|null} [lat, lng] or null if not found
 */
export function resolveManuscriptLocation(manuscript, locations, repositories) {
  // Priority: originLocation > discoveryLocation > repository
  if (manuscript.originLocation && locations[manuscript.originLocation]) {
    const loc = locations[manuscript.originLocation];
    return [loc.lat, loc.lng];
  }

  if (manuscript.discoveryLocation && locations[manuscript.discoveryLocation]) {
    const loc = locations[manuscript.discoveryLocation];
    return [loc.lat, loc.lng];
  }

  if (manuscript.repository && repositories[manuscript.repository]) {
    const repo = repositories[manuscript.repository];
    return [repo.lat, repo.lng];
  }

  return null;
}

/**
 * Get location name for display
 * @param {Object} manuscript - Manuscript object
 * @param {Object} locations - Locations lookup object
 * @param {Object} repositories - Repositories lookup object
 * @returns {string} Location name
 */
export function getLocationName(manuscript, locations, repositories) {
  if (manuscript.originLocation && locations[manuscript.originLocation]) {
    return locations[manuscript.originLocation].name;
  }

  if (manuscript.discoveryLocation && locations[manuscript.discoveryLocation]) {
    return locations[manuscript.discoveryLocation].name;
  }

  if (manuscript.repository && repositories[manuscript.repository]) {
    const repo = repositories[manuscript.repository];
    return `${repo.city}, ${repo.country}`;
  }

  return 'Unknown';
}
