/**
 * NT Manuscripts Timeline - Utility Functions
 * Helper functions for debouncing, throttling, and common operations
 */

/**
 * Debounce function - delays execution until after wait period of inactivity
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds to wait between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, wait) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Format year for display (handles BC/AD)
 * @param {number} year - Year to format
 * @returns {string} Formatted year string
 */
export function formatYear(year) {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  } else if (year === 0) {
    return '1 BC';
  } else {
    return `${year} AD`;
  }
}

/**
 * Format date range for manuscript
 * @param {Object} manuscript - Manuscript object
 * @returns {string} Formatted date range
 */
export function formatDateRange(manuscript) {
  if (manuscript.dateStart === manuscript.dateEnd) {
    return formatYear(manuscript.dateBest || manuscript.dateStart);
  }
  return `~${formatYear(manuscript.dateStart)}-${formatYear(manuscript.dateEnd)}`;
}

/**
 * Get manuscript type badge class
 * @param {string} type - Manuscript type
 * @returns {string} CSS class name
 */
export function getTypeBadgeClass(type) {
  const typeMap = {
    'papyrus': 'badge-papyrus',
    'uncial': 'badge-uncial',
    'minuscule': 'badge-minuscule'
  };
  return typeMap[type] || 'badge-papyrus';
}

/**
 * Get text type class
 * @param {string} textType - Text type
 * @returns {string} CSS class name
 */
export function getTextTypeClass(textType) {
  if (!textType) return '';
  const type = textType.toLowerCase();
  const typeMap = {
    'alexandrian': 'text-alexandrian',
    'byzantine': 'text-byzantine',
    'western': 'text-western',
    'caesarean': 'text-caesarean'
  };
  return typeMap[type] || '';
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate opacity based on manuscript age relative to current year
 * @param {Object} manuscript - Manuscript object
 * @param {number} currentYear - Current timeline year
 * @returns {number} Opacity value (0-1)
 */
export function calculateMarkerOpacity(manuscript, currentYear) {
  const manuscriptYear = manuscript.dateBest || manuscript.dateStart;

  // Manuscript not yet created
  if (currentYear < manuscriptYear) {
    return 0;
  }

  // Fade in over 50 years
  const fadeInYears = 50;
  const yearsSinceCreation = currentYear - manuscriptYear;

  if (yearsSinceCreation < fadeInYears) {
    return yearsSinceCreation / fadeInYears;
  }

  return 1;
}

/**
 * Check if manuscript is visible at current year
 * @param {Object} manuscript - Manuscript object
 * @param {number} currentYear - Current timeline year
 * @returns {boolean} True if manuscript should be visible
 */
export function isManuscriptVisible(manuscript, currentYear) {
  const manuscriptYear = manuscript.dateBest || manuscript.dateStart;
  return currentYear >= manuscriptYear;
}

/**
 * Get position for tooltip
 * @param {number} x - Mouse X position
 * @param {number} y - Mouse Y position
 * @param {Object} offset - Offset object {x, y}
 * @returns {Object} Position object {left, top}
 */
export function getTooltipPosition(x, y, offset) {
  return {
    left: `${x + offset.x}px`,
    top: `${y + offset.y}px`
  };
}
