/**
 * NT Manuscripts Timeline - Timeline Controller
 * Manages timeline animation and playback controls
 */

import { CONFIG } from './config.js';
import { store } from './store.js';
import { clamp } from './utils.js';

let animationFrameId = null;
let lastFrameTime = 0;

/**
 * Initialize timeline controls
 */
export function initializeTimeline() {
  const slider = document.getElementById('timelineSlider');
  const playBtn = document.getElementById('playBtn');
  const speedBtn = document.getElementById('speedBtn');

  if (!slider || !playBtn || !speedBtn) {
    console.error('Timeline controls not found');
    return;
  }

  // Set initial slider value
  slider.value = store.get('currentYear');

  // Slider input event
  slider.addEventListener('input', (e) => {
    const year = parseInt(e.target.value, 10);
    store.setYear(year);
  });

  // Play/Pause button
  playBtn.addEventListener('click', () => {
    togglePlayback();
  });

  // Speed button
  speedBtn.addEventListener('click', () => {
    cycleSpeed();
  });

  // Subscribe to state changes
  store.subscribe('currentYear', (year) => {
    updateSlider(year);
    updateYearDisplay(year);
  });

  store.subscribe('isPlaying', (isPlaying) => {
    updatePlayButton(isPlaying);
  });

  store.subscribe('playbackSpeed', (speed) => {
    updateSpeedDisplay(speed);
  });

  store.subscribe('visibleCount', (count) => {
    updateVisibleCount(count);
  });

  // Initialize timeline markers
  createTimelineMarkers();

  // Initial display updates
  updateYearDisplay(store.get('currentYear'));
  updateVisibleCount(store.get('visibleCount'));
}

/**
 * Toggle playback on/off
 */
function togglePlayback() {
  const isPlaying = store.get('isPlaying');

  if (isPlaying) {
    stopAnimation();
  } else {
    startAnimation();
  }

  store.set('isPlaying', !isPlaying);
}

/**
 * Start timeline animation
 */
function startAnimation() {
  lastFrameTime = Date.now();
  animate();
}

/**
 * Stop timeline animation
 */
function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/**
 * Animation loop
 */
function animate() {
  const now = Date.now();
  const elapsed = now - lastFrameTime;

  // Only update if enough time has passed
  if (elapsed >= CONFIG.TIMELINE.FRAME_DELAY / store.get('playbackSpeed')) {
    const currentYear = store.get('currentYear');
    const nextYear = currentYear + CONFIG.TIMELINE.STEP;

    if (nextYear <= CONFIG.TIMELINE.MAX_YEAR) {
      store.setYear(nextYear);
      lastFrameTime = now;
    } else {
      // Reached the end, stop playing
      store.set('isPlaying', false);
      stopAnimation();
      return;
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

/**
 * Cycle to next playback speed
 */
function cycleSpeed() {
  store.cycleSpeed();
}

/**
 * Update slider position
 * @param {number} year - Current year
 */
function updateSlider(year) {
  const slider = document.getElementById('timelineSlider');
  if (slider) {
    slider.value = year;
  }
}

/**
 * Update year display in stats overlay
 * @param {number} year - Current year
 */
function updateYearDisplay(year) {
  const yearDisplay = document.getElementById('currentYear');
  if (yearDisplay) {
    yearDisplay.textContent = year;
  }
}

/**
 * Update visible count display
 * @param {number} count - Number of visible manuscripts
 */
function updateVisibleCount(count) {
  const countDisplay = document.getElementById('visibleCount');
  if (countDisplay) {
    countDisplay.textContent = count;
  }
}

/**
 * Update play/pause button appearance
 * @param {boolean} isPlaying - Whether animation is playing
 */
function updatePlayButton(isPlaying) {
  const playBtn = document.getElementById('playBtn');
  if (!playBtn) return;

  const playIcon = playBtn.querySelector('.play-icon');
  const pauseIcon = playBtn.querySelector('.pause-icon');

  if (isPlaying) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playBtn.setAttribute('aria-label', 'Pause animation');
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playBtn.setAttribute('aria-label', 'Play animation');
  }
}

/**
 * Update speed display
 * @param {number} speed - Current playback speed
 */
function updateSpeedDisplay(speed) {
  const speedLabel = document.querySelector('.speed-label');
  if (speedLabel) {
    speedLabel.textContent = `${speed}x`;
  }
}

/**
 * Create timeline markers showing manuscript dates
 */
function createTimelineMarkers() {
  const container = document.getElementById('timelineMarkers');
  if (!container) return;

  const manuscripts = store.get('manuscripts');
  const minYear = CONFIG.TIMELINE.MIN_YEAR;
  const maxYear = CONFIG.TIMELINE.MAX_YEAR;

  // Clear existing markers
  container.innerHTML = '';

  // Group manuscripts by decade for visual markers
  const markersByDecade = new Map();

  manuscripts.forEach(manuscript => {
    const year = manuscript.dateBest || manuscript.dateStart;
    const decade = Math.floor(year / 10) * 10;

    if (!markersByDecade.has(decade)) {
      markersByDecade.set(decade, []);
    }
    markersByDecade.get(decade).push(manuscript);
  });

  // Create visual markers
  markersByDecade.forEach((manuscripts, decade) => {
    const position = ((decade - minYear) / (maxYear - minYear)) * 100;

    const marker = document.createElement('div');
    marker.className = 'timeline-marker';
    marker.style.left = `${position}%`;
    marker.title = `${decade} AD (${manuscripts.length} manuscript${manuscripts.length > 1 ? 's' : ''})`;

    container.appendChild(marker);
  });
}

/**
 * Jump to specific year
 * @param {number} year - Year to jump to
 */
export function jumpToYear(year) {
  const clampedYear = clamp(year, CONFIG.TIMELINE.MIN_YEAR, CONFIG.TIMELINE.MAX_YEAR);

  // Stop animation if playing
  if (store.get('isPlaying')) {
    togglePlayback();
  }

  store.setYear(clampedYear);
}

/**
 * Reset timeline to beginning
 */
export function resetTimeline() {
  jumpToYear(CONFIG.TIMELINE.MIN_YEAR);
}

/**
 * Jump to end of timeline
 */
export function jumpToEnd() {
  jumpToYear(CONFIG.TIMELINE.MAX_YEAR);
}
