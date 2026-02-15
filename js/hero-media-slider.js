/**
 * Hero Media Infinite Vertical Scroll
 * -----------------------------------
 * - 3 independent columns
 * - Auto-height slides
 * - True infinite loop
 * - requestAnimationFrame based
 * - Ultra smooth motion
 * - Pause on hover / focus / touch
 * - Reduced motion compliant
 */
(function () {
    const GAP = 24;
    const BASE_SPEED = 0.9; // px per frame
    const SPEED_VARIANCE = 0.35;

    const heroMedia = document.querySelector('.hero__media');
    if (!heroMedia) return;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const columns = Array.from(
        heroMedia.querySelectorAll('.hero__media-column')
    ).map((column, index) => {
        const track = column.querySelector('.hero__media-track');

        // Duplicate slides for infinite loop
        track.innerHTML += track.innerHTML;

        return {
            track,
            offset: 0,
            height: 0,
            speed: BASE_SPEED + Math.random() * SPEED_VARIANCE + index * 0.8,
            paused: false
        };
    });

    /**
     * Measure half height for infinite loop
     */
    function measure() {
        columns.forEach(col => {
            col.height = col.track.scrollHeight / 2;
            col.offset = 0;
            col.track.style.transform = 'translateY(0px)';
        });
    }

    /**
     * Animation loop
     */
    function animate() {
        if (!prefersReducedMotion) {
            columns.forEach(col => {
                if (col.paused) return;

                col.offset += col.speed;

                if (col.offset >= col.height) {
                    col.offset = 0;
                }

                col.track.style.transform = `translateY(-${col.offset}px)`;
            });
        }

        requestAnimationFrame(animate);
    }

    /**
     * Pause all columns
     */
    function pauseAll() {
        columns.forEach(col => (col.paused = true));
    }

    /**
     * Resume all columns
     */
    function resumeAll() {
        if (prefersReducedMotion) return;
        columns.forEach(col => (col.paused = false));
    }

    // Event listeners
    heroMedia.addEventListener('mouseenter', pauseAll);
    heroMedia.addEventListener('mouseleave', resumeAll);
    heroMedia.addEventListener('focusin', pauseAll);
    heroMedia.addEventListener('focusout', resumeAll);
    heroMedia.addEventListener('touchstart', pauseAll, { passive: true });
    heroMedia.addEventListener('touchend', resumeAll);

    window.addEventListener('resize', () => {
        pauseAll();
        measure();
        resumeAll();
    });

    window.addEventListener('load', () => {
        measure();
        animate();
    });
})();

/**
 * Exhibition Slider
 * -----------------
 * Horizontal slider with prev/next controls
 * Keyboard accessible with arrow keys
 * Screen reader announcements
 */
(function () {
    const track = document.querySelector('.exhibition-slider__track');
    if (!track) return;

    const slides = track.children;
    const prev = document.querySelector('[aria-label="Previous slide"]');
    const next = document.querySelector('[aria-label="Next slide"]');
    const viewport = document.querySelector('#exhibition-slider-viewport');
    const announcement = document.getElementById('exhibition-slider-announcement');

    let index = 0;
    const totalSlides = slides.length;

    /**
     * Update slider position and button states
     */
    function update(announce = true) {
        const slideWidth = slides[0].offsetWidth + 24;
        track.style.setProperty('--offset', `-${index * slideWidth}px`);

        // Update ARIA attributes for current slide
        Array.from(slides).forEach((slide, i) => {
            const isCurrent = i === index;
            slide.setAttribute('aria-current', isCurrent ? 'true' : 'false');
            slide.setAttribute('tabindex', isCurrent ? '0' : '-1');
        });

        // Update button states
        const isFirst = index === 0;
        const isLast = index === totalSlides - 1;

        prev.classList.toggle('is-disabled', isFirst);
        prev.setAttribute('aria-disabled', isFirst);
        prev.setAttribute('tabindex', isFirst ? '-1' : '0');

        next.classList.toggle('is-disabled', isLast);
        next.setAttribute('aria-disabled', isLast);
        next.setAttribute('tabindex', isLast ? '-1' : '0');

        // Announce to screen readers
        if (announce && announcement) {
            announcement.textContent = `Slide ${index + 1} of ${totalSlides}: ${slides[index].querySelector('h3')?.textContent || ''}`;
        }
    }

    /**
     * Navigate to previous slide
     */
    function goToPrevious() {
        if (index === 0) return;
        index--;
        update();
    }

    /**
     * Navigate to next slide
     */
    function goToNext() {
        if (index === totalSlides - 1) return;
        index++;
        update();
    }

    // Button click handlers
    prev.addEventListener('click', goToPrevious);
    next.addEventListener('click', goToNext);

    // Keyboard navigation
    if (viewport) {
        viewport.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    goToNext();
                    break;
                case 'Home':
                    e.preventDefault();
                    index = 0;
                    update();
                    break;
                case 'End':
                    e.preventDefault();
                    index = totalSlides - 1;
                    update();
                    break;
            }
        });
    }

    // Keyboard support for buttons
    [prev, next].forEach(button => {
        if (button) {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        }
    });

    window.addEventListener('resize', () => {
        update(false);
    });

    // Initialize
    update(false);
})();

/**
 * School Chooser Carousel Keyboard Navigation
 * --------------------------------------------
 * Arrow key navigation for school chooser carousel
 */
(function () {
  const section = document.querySelector('.school-chooser');
  if (!section) return;

  const track = section.querySelector('.school-chooser__track');
  const slides = Array.from(track.children);
  const dots = section.querySelectorAll('.school-chooser__pagination button');

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function update() {
    if (!isMobile()) {
      track.style.transform = '';
      dots.forEach(d => d.classList.remove('is-active'));
      return;
    }

    const slideWidth = slides[0].offsetWidth + 16;
    track.style.transform = `translateX(-${index * slideWidth}px)`;

    dots.forEach((dot, i) =>
      dot.classList.toggle('is-active', i === index)
    );
  }

  // DOT CLICK
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
  });

  // TOUCH START
  track.addEventListener('touchstart', e => {
    if (!isMobile()) return;

    startX = e.touches[0].clientX;
    currentX = startX;
    isSwiping = true;
  }, { passive: true });

  // TOUCH MOVE
  track.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  // TOUCH END
  track.addEventListener('touchend', () => {
    if (!isSwiping) return;

    const delta = startX - currentX;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      if (delta > 0 && index < slides.length - 1) index++;
      if (delta < 0 && index > 0) index--;
    }

    isSwiping = false;
    update();
  });

  window.addEventListener('resize', update);
  update();
})();


