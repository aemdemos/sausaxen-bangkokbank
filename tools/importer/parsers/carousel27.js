/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('[data-carousel-product]');
  if (!carousel) return;

  // Only select the real slides (not slick-cloned)
  const items = Array.from(carousel.querySelectorAll('.item.slick-slide'))
    .filter(item => {
      const i = parseInt(item.getAttribute('data-slick-index'), 10);
      return !isNaN(i) && i >= 0;
    });
  if (!items.length) return;

  // Table header row matches the example exactly
  const rows = [['Carousel (carousel27)']];

  items.forEach(item => {
    // First cell: first <img> in the item (may be null)
    const img = item.querySelector('img');
    const imgCell = img || '';

    // Second cell: gather all content except <img> and whitespace text nodes
    const textNodes = [];
    item.childNodes.forEach(node => {
      if (node.nodeType === 1 && node.tagName.toLowerCase() === 'img') {
        // skip image
      } else if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
        textNodes.push(node);
      }
    });
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      // If more than one, wrap in a <div>
      const div = document.createElement('div');
      textNodes.forEach(node => div.appendChild(node));
      textCell = div;
    }
    rows.push([imgCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
