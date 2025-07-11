/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('[data-carousel-product]');
  if (!carousel) return;

  // The slick-track contains all the slides
  const track = carousel.querySelector('.slick-track');
  if (!track) return;

  // Get all unique slides (skip clones by checking data-slick-index >= 0)
  const slides = Array.from(track.children)
    .filter(div => div.classList.contains('item') && Number(div.getAttribute('data-slick-index')) >= 0);

  // Header as per example: single cell, correct text
  const rows = [['Carousel (carousel52)']];

  // For each slide, create a row: [image, text content (if any)]
  slides.forEach(slide => {
    // Find the image (should be the first img)
    const img = slide.querySelector('img');

    // Try to find possible overlay/caption content inside the slide
    // Collect all direct children except for the image element
    const overlayCandidates = Array.from(slide.children).filter(el => el !== img);
    // If no direct children except img, also check for text nodes
    let textContent = '';
    if (overlayCandidates.length > 0) {
      // Use all overlay candidates together if multiple
      textContent = overlayCandidates.length === 1 ? overlayCandidates[0] : overlayCandidates;
    } else {
      // Fallback: if there's meaningful text directly (outside children)
      // Collect all text nodes that are not just whitespace
      const textNodes = Array.from(slide.childNodes).filter(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
      );
      if (textNodes.length > 0) {
        // Join all text nodes as a single string
        textContent = textNodes.map(node => node.textContent.trim()).join(' ');
      }
    }
    rows.push([img, textContent]);
  });

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
