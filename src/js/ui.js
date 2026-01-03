/**
 * NT Manuscripts Timeline - UI Components
 * Handles info panel, tooltip, modal, and filter interactions
 */

import { CONFIG } from './config.js';
import { store } from './store.js';
import {
  formatDateRange,
  getTypeBadgeClass,
  getTextTypeClass,
  getTooltipPosition
} from './utils.js';
import { getLocationName } from './data.js';
import { highlightMarker, unhighlightMarker } from './markers.js';

let currentHighlightedMarker = null;

/**
 * Initialize UI components
 */
export function initializeUI() {
  initializeFilters();
  initializeInfoPanel();
  initializeModal();
  initializeTooltip();
  updateTotalCount();

  // Subscribe to total count changes
  store.subscribe('totalCount', updateTotalCount);
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      store.toggleFilter(filter);
    });
  });

  // Subscribe to filter changes to update button states
  store.subscribe('activeFilters', (filters) => {
    filterButtons.forEach(btn => {
      const filter = btn.dataset.filter;
      if (filters.has(filter)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });
}

/**
 * Initialize info panel
 */
function initializeInfoPanel() {
  const closeBtn = document.getElementById('closePanelBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideInfoPanel();
    });
  }

  // Subscribe to selected manuscript changes
  store.subscribe('selectedManuscript', (manuscript) => {
    if (manuscript) {
      showInfoPanel(manuscript);
    }
  });
}

/**
 * Initialize modal
 */
function initializeModal() {
  const infoBtn = document.getElementById('infoBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOverlay = document.getElementById('modalOverlay');

  if (infoBtn) {
    infoBtn.addEventListener('click', () => {
      showModal();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      hideModal();
    });
  }

  // Close modal when clicking overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        hideModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal();
      hideInfoPanel();
    }
  });
}

/**
 * Initialize tooltip
 */
function initializeTooltip() {
  // Tooltip is shown/hidden programmatically from marker events
  // No initialization needed beyond DOM setup
}

/**
 * Show manuscript detail in info panel
 * @param {Object} manuscript - Manuscript object
 */
export function showManuscriptDetail(manuscript) {
  store.set('selectedManuscript', manuscript);

  // Highlight marker
  if (currentHighlightedMarker) {
    unhighlightMarker(currentHighlightedMarker);
  }
  highlightMarker(manuscript.id);
  currentHighlightedMarker = manuscript.id;
}

/**
 * Show info panel with manuscript details
 * @param {Object} manuscript - Manuscript object
 */
function showInfoPanel(manuscript) {
  const panel = document.getElementById('infoPanel');
  const content = document.getElementById('panelContent');

  if (!panel || !content) return;

  // Build content HTML
  const locations = store.get('locations');
  const repositories = store.get('repositories');
  const locationName = getLocationName(manuscript, locations, repositories);

  const html = `
    <div class="manuscript-detail">
      <div class="detail-header">
        <span class="manuscript-id">${manuscript.id}</span>
        <span class="manuscript-badge ${getTypeBadgeClass(manuscript.type)}">
          ${manuscript.type}
        </span>
      </div>

      <div class="detail-section">
        <h4>Dating</h4>
        <p class="date-range">${formatDateRange(manuscript)}</p>
      </div>

      <div class="detail-section">
        <h4>Location</h4>
        <p>${locationName}</p>
      </div>

      <div class="detail-section">
        <h4>Contents</h4>
        <p>${manuscript.contents}</p>
      </div>

      ${manuscript.textType ? `
        <div class="detail-section">
          <h4>Text Type</h4>
          <p class="${getTextTypeClass(manuscript.textType)}">${manuscript.textType}</p>
        </div>
      ` : ''}

      ${manuscript.material ? `
        <div class="detail-section">
          <h4>Material</h4>
          <p>${manuscript.material}</p>
        </div>
      ` : ''}

      ${manuscript.dimensions ? `
        <div class="detail-section">
          <h4>Dimensions</h4>
          <p>${manuscript.dimensions}</p>
        </div>
      ` : ''}

      ${manuscript.repository ? `
        <div class="detail-section">
          <h4>Repository</h4>
          <p>${getRepositoryName(manuscript.repository, repositories)}</p>
          ${manuscript.shelfNumber ? `<p class="text-sm" style="color: var(--color-gray-500); margin-top: 4px;">${manuscript.shelfNumber}</p>` : ''}
        </div>
      ` : ''}

      ${manuscript.notes || manuscript.significance ? `
        <div class="detail-section">
          <h4>Description</h4>
          <p class="detail-description">
            ${manuscript.significance ? `<strong>${manuscript.significance}.</strong> ` : ''}
            ${manuscript.notes || ''}
          </p>
        </div>
      ` : ''}

      ${manuscript.csntmUrl ? `
        <div class="detail-section">
          <a href="${manuscript.csntmUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary);">
            View on CSNTM →
          </a>
        </div>
      ` : ''}
    </div>
  `;

  content.innerHTML = html;
  panel.classList.add('active');
}

/**
 * Hide info panel
 */
function hideInfoPanel() {
  const panel = document.getElementById('infoPanel');
  if (panel) {
    panel.classList.remove('active');
  }

  store.set('selectedManuscript', null);

  // Remove marker highlight
  if (currentHighlightedMarker) {
    unhighlightMarker(currentHighlightedMarker);
    currentHighlightedMarker = null;
  }
}

/**
 * Show tooltip for manuscript
 * @param {Object} manuscript - Manuscript object
 * @param {MouseEvent} event - Mouse event
 */
export function showTooltip(manuscript, event) {
  const tooltip = document.getElementById('manuscriptTooltip');
  if (!tooltip) return;

  // Build tooltip content
  const tooltipId = tooltip.querySelector('.tooltip-id');
  const tooltipYear = tooltip.querySelector('.tooltip-year');
  const tooltipContent = tooltip.querySelector('.tooltip-content');

  if (tooltipId) {
    tooltipId.textContent = manuscript.id;
  }

  if (tooltipYear) {
    tooltipYear.textContent = formatDateRange(manuscript);
  }

  if (tooltipContent) {
    tooltipContent.textContent = manuscript.contents;
  }

  // Position tooltip
  const position = getTooltipPosition(event.clientX, event.clientY, CONFIG.UI.TOOLTIP_OFFSET);
  tooltip.style.left = position.left;
  tooltip.style.top = position.top;

  // Show tooltip
  tooltip.classList.remove('hidden');
  setTimeout(() => {
    tooltip.classList.add('active');
  }, 10);
}

/**
 * Hide tooltip
 */
export function hideTooltip() {
  const tooltip = document.getElementById('manuscriptTooltip');
  if (tooltip) {
    tooltip.classList.remove('active');
    setTimeout(() => {
      tooltip.classList.add('hidden');
    }, 200);
  }
}

/**
 * Show modal
 */
function showModal() {
  const modal = document.getElementById('modalOverlay');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
}

/**
 * Hide modal
 */
function hideModal() {
  const modal = document.getElementById('modalOverlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 250);
  }
}

/**
 * Update total count display
 */
function updateTotalCount() {
  const totalCount = store.get('totalCount');
  const totalDisplay = document.querySelector('.stats-overlay .stat-item:last-child .stat-value');

  if (totalDisplay) {
    totalDisplay.textContent = totalCount;
  }
}

/**
 * Get repository display name
 * @param {string} repoKey - Repository key
 * @param {Object} repositories - Repositories object
 * @returns {string} Repository name
 */
function getRepositoryName(repoKey, repositories) {
  if (repositories[repoKey]) {
    const repo = repositories[repoKey];
    return `${repo.name}, ${repo.city}, ${repo.country}`;
  }
  return repoKey;
}
