/**
 * NT Manuscripts Timeline - State Management
 * Central state store with pub/sub pattern
 */

import { CONFIG } from './config.js';

class Store {
  constructor() {
    // Initialize state
    this.state = {
      currentYear: CONFIG.TIMELINE.DEFAULT_YEAR,
      isPlaying: false,
      playbackSpeed: CONFIG.TIMELINE.ANIMATION_SPEEDS[CONFIG.TIMELINE.DEFAULT_SPEED_INDEX],
      currentSpeedIndex: CONFIG.TIMELINE.DEFAULT_SPEED_INDEX,
      activeFilters: new Set(['all']), // 'all', 'papyrus', 'uncial', 'minuscule'
      selectedManuscript: null,
      manuscripts: [],
      locations: {},
      repositories: {},
      manuscriptsById: new Map(),
      manuscriptsByYear: new Map(),
      manuscriptsByType: {
        papyrus: [],
        uncial: [],
        minuscule: []
      },
      visibleManuscripts: [],
      totalCount: 0,
      visibleCount: 0
    };

    // Subscribers for state changes
    this.subscribers = new Map();
  }

  /**
   * Get current state or specific state property
   * @param {string} key - Optional state key
   * @returns {*} State value
   */
  get(key) {
    if (key) {
      return this.state[key];
    }
    return this.state;
  }

  /**
   * Set state and notify subscribers
   * @param {string|Object} keyOrObj - State key or object of key-value pairs
   * @param {*} value - Value to set (if key is string)
   */
  set(keyOrObj, value) {
    const updates = typeof keyOrObj === 'string'
      ? { [keyOrObj]: value }
      : keyOrObj;

    const changedKeys = new Set();

    // Update state and track changes
    for (const [key, val] of Object.entries(updates)) {
      if (this.state[key] !== val) {
        this.state[key] = val;
        changedKeys.add(key);
      }
    }

    // Notify subscribers of changes
    changedKeys.forEach(key => {
      this.notify(key, this.state[key]);
    });
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(key).delete(callback);
    };
  }

  /**
   * Notify subscribers of state change
   * @param {string} key - State key that changed
   * @param {*} value - New value
   */
  notify(key, value) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        callback(value);
      });
    }

    // Also notify 'any' subscribers (for any state change)
    if (this.subscribers.has('*')) {
      this.subscribers.get('*').forEach(callback => {
        callback(key, value);
      });
    }
  }

  /**
   * Initialize data indexes for fast lookup
   * @param {Object} data - Manuscript data from JSON
   */
  initializeData(data) {
    const { manuscripts, locations, repositories, metadata } = data;

    // Store raw data
    this.set({
      manuscripts,
      locations,
      repositories,
      totalCount: metadata.totalManuscripts
    });

    // Build indexes
    const byId = new Map();
    const byYear = new Map();
    const byType = {
      papyrus: [],
      uncial: [],
      minuscule: []
    };

    manuscripts.forEach(manuscript => {
      // Index by ID
      byId.set(manuscript.id, manuscript);

      // Index by year (using best date estimate)
      const year = manuscript.dateBest || manuscript.dateStart;
      if (!byYear.has(year)) {
        byYear.set(year, []);
      }
      byYear.get(year).push(manuscript);

      // Index by type
      if (byType[manuscript.type]) {
        byType[manuscript.type].push(manuscript);
      }
    });

    this.set({
      manuscriptsById: byId,
      manuscriptsByYear: byYear,
      manuscriptsByType: byType
    });

    // Calculate initial visible manuscripts
    this.updateVisibleManuscripts();
  }

  /**
   * Update visible manuscripts based on current year and filters
   */
  updateVisibleManuscripts() {
    const { manuscripts, currentYear, activeFilters } = this.state;

    const visible = manuscripts.filter(manuscript => {
      // Check year visibility
      const manuscriptYear = manuscript.dateBest || manuscript.dateStart;
      if (currentYear < manuscriptYear) {
        return false;
      }

      // Check filter
      if (activeFilters.has('all')) {
        return true;
      }

      return activeFilters.has(manuscript.type);
    });

    this.set({
      visibleManuscripts: visible,
      visibleCount: visible.length
    });
  }

  /**
   * Toggle filter
   * @param {string} filter - Filter to toggle
   */
  toggleFilter(filter) {
    const { activeFilters } = this.state;
    const newFilters = new Set(activeFilters);

    if (filter === 'all') {
      newFilters.clear();
      newFilters.add('all');
    } else {
      newFilters.delete('all');

      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }

      // If no filters selected, default to 'all'
      if (newFilters.size === 0) {
        newFilters.add('all');
      }
    }

    this.set({ activeFilters: newFilters });
    this.updateVisibleManuscripts();
  }

  /**
   * Set current year
   * @param {number} year - Year to set
   */
  setYear(year) {
    this.set({ currentYear: year });
    this.updateVisibleManuscripts();
  }

  /**
   * Cycle to next playback speed
   */
  cycleSpeed() {
    const speeds = CONFIG.TIMELINE.ANIMATION_SPEEDS;
    const newIndex = (this.state.currentSpeedIndex + 1) % speeds.length;
    this.set({
      currentSpeedIndex: newIndex,
      playbackSpeed: speeds[newIndex]
    });
  }

  /**
   * Get manuscript by ID
   * @param {string} id - Manuscript ID
   * @returns {Object} Manuscript object
   */
  getManuscript(id) {
    return this.state.manuscriptsById.get(id);
  }

  /**
   * Get location coordinates for a manuscript
   * @param {Object} manuscript - Manuscript object
   * @returns {Array} [lat, lng] or null
   */
  getManuscriptLocation(manuscript) {
    const { locations, repositories } = this.state;

    // Try origin location first
    if (manuscript.originLocation && locations[manuscript.originLocation]) {
      const loc = locations[manuscript.originLocation];
      return [loc.lat, loc.lng];
    }

    // Try discovery location
    if (manuscript.discoveryLocation && locations[manuscript.discoveryLocation]) {
      const loc = locations[manuscript.discoveryLocation];
      return [loc.lat, loc.lng];
    }

    // Fall back to repository location
    if (manuscript.repository && repositories[manuscript.repository]) {
      const repo = repositories[manuscript.repository];
      return [repo.lat, repo.lng];
    }

    return null;
  }
}

// Create singleton instance
export const store = new Store();
