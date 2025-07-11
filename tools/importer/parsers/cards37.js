/* global WebImporter */
export default function parse(element, { document }) {
  // Build cells array for the table
  const cells = [];
  // Header row
  cells.push(['Cards (cards37)']);

  // Each card is represented by .col-md-4
  const cardEls = element.querySelectorAll(':scope > .row > .col-md-4');
  cardEls.forEach(cardEl => {
    // First cell: image/icon from the card
    let img = null;
    const imgEl = cardEl.querySelector('.thumb img');
    if (imgEl) {
      img = imgEl;
    }
    
    // Second cell: title (h3) and below-space for description (if present)
    const textWrapper = document.createElement('div');
    const caption = cardEl.querySelector('.caption');
    if (caption) {
      // Use direct child h3 for the title
      const title = caption.querySelector('h3');
      if (title) textWrapper.appendChild(title);
      // Look for any content after h3 in caption for description
      let foundTitle = false;
      Array.from(caption.childNodes).forEach(node => {
        if (node === title) {
          foundTitle = true;
        } else if (foundTitle && (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))) {
          textWrapper.appendChild(node);
        }
      });
    }
    cells.push([
      img,
      textWrapper.childNodes.length ? textWrapper : ''
    ]);
  });

  // Create the table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
