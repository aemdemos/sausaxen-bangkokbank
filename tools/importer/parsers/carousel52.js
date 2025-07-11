/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('[data-carousel-product]');
  if (!carousel) return;

  // Find the slick-track containing slides
  const track = carousel.querySelector('.slick-track');
  if (!track) return;

  // Get all real slide items (exclude .slick-cloned)
  const slides = Array.from(track.children).filter(div => div.classList.contains('item') && !div.classList.contains('slick-cloned'));

  const cells = [['Carousel (carousel52)']];

  slides.forEach(slide => {
    // Image cell: first image in the slide
    const img = slide.querySelector('img');
    const imgCell = img || '';

    // Text cell: collect all non-image content from the slide (deep)
    // We'll create a fragment containing all content except <img> elements
    const contentFragment = document.createDocumentFragment();
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.currentNode;
    while(node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'img') {
        // skip images
      } else if (node !== slide) {
        // Only add top-level non-img nodes (skip the slide root)
        // If it's a text node
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          contentFragment.appendChild(p);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Only add if parent is slide or not inside <img>
          if (!node.closest('img')) {
            contentFragment.appendChild(node);
          }
        }
      }
      node = walker.nextSibling();
    }
    // If contentFragment has any children, use it as the text cell
    let textCell = '';
    if (contentFragment.childNodes.length > 0) {
      textCell = Array.from(contentFragment.childNodes);
    }
    cells.push([imgCell, textCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
