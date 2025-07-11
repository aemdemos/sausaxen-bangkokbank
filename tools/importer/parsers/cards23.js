/* global WebImporter */
export default function parse(element, { document }) {
  // Table must have header row matching example exactly
  const cells = [['Cards (cards23)']];

  // Find both desktop and mobile rows, but process only the first available with cards
  let cardsRow = element.querySelector('.desktop-teaser-container .row.row-left');
  if (!cardsRow) {
    cardsRow = element.querySelector('.mobile-teaser-container .row.row-left');
  }
  if (cardsRow) {
    // Each card column
    cardsRow.querySelectorAll(':scope > div').forEach((col) => {
      const thumb = col.querySelector('.thumb-square-caption');
      if (!thumb) return;

      // Extract image from background-image CSS
      let imgEl = null;
      const style = thumb.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (match) {
        imgEl = document.createElement('img');
        imgEl.src = match[1];
        imgEl.alt = '';
      }

      // Extract text content as a single block, preserving semantic structure
      const info = thumb.querySelector('.info');
      let textContent = null;
      if (info) {
        // Instead of cloning, reference the block in-place if possible
        // But we want only h3 and p from within info (preserves heading and paragraph semantics)
        const frag = document.createDocumentFragment();
        info.childNodes.forEach((node) => {
          if (
            (node.nodeType === 1 && (node.tagName.toLowerCase() === 'h3' || node.tagName.toLowerCase() === 'p'))
          ) {
            frag.appendChild(node);
          }
        });
        // If we have at least one node (title or description)
        if (frag.childNodes.length > 0) {
          textContent = frag;
        }
      }
      if (imgEl && textContent) {
        cells.push([imgEl, textContent]);
      }
    });
  }

  // Only create the table if we have cards (rows > 1)
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
