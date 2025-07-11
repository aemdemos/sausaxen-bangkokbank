/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('[data-carousel-product]');
  if (!carousel) return;

  // Find the track of slides
  const track = carousel.querySelector('.slick-track');
  if (!track) return;

  // Collect unique slides (exclude clones)
  const slides = Array.from(track.children)
    .filter(div => div.classList.contains('slick-slide') && !div.classList.contains('slick-cloned'));

  // Try to find any possible text overlays or captions: look for elements that are not the carousel,
  // but are siblings inside .center-content or .inner-container
  // In this specific HTML, there are no such overlays, but make it robust for future variations
  let textBlocks = [];
  let possibleCaptionContainers = [];

  // Search up for containers that may have overlay/caption text
  if (carousel.parentElement) {
    const parent = carousel.parentElement;
    possibleCaptionContainers = Array.from(parent.children).filter(child => child !== carousel);
  }
  if (possibleCaptionContainers.length > 0) {
    // Pick only containers that have visible/meaningful text
    textBlocks = possibleCaptionContainers.filter(el => el.textContent.trim().length > 0);
  }

  // Now build the rows
  const rows = [];
  // Header row matches the example exactly
  rows.push(['Carousel (carousel27)']);

  // For each slide, first cell is its <img>, second cell is corresponding text block if present
  slides.forEach((slide, idx) => {
    const img = slide.querySelector('img');
    let imageElem = img || '';
    // If there are caption/text overlays, assign them to slides in order
    let textCell = '';
    if (textBlocks.length > idx) {
      textCell = textBlocks[idx]; // reference existing element!
    }
    rows.push([imageElem, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
