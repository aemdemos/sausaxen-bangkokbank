/* global WebImporter */
export default function parse(element, { document }) {
  // Find the currently active tab (2025, the most recent)
  const activeInner = element.querySelector('.inner.active');
  if (!activeInner) return;
  const scrollingX = activeInner.querySelector('.scrolling-x');
  if (!scrollingX) return;
  const cols = scrollingX.querySelectorAll('.row > .col-md-4');

  const cells = [
    ['Cards (cards54)']
  ];

  cols.forEach((col) => {
    // Get image (first cell)
    let imgEl = null;
    const thumbImg = col.querySelector('.thumb img');
    if (thumbImg) {
      imgEl = thumbImg;
    }

    // Build text content (second cell)
    const textParts = [];
    // Description
    const desc = col.querySelector('.caption .desc');
    if (desc) {
      // Reference the existing element (preserves any markup)
      textParts.push(desc);
    }
    // Date (as a <p> element, after desc)
    const date = col.querySelector('.button-group .promotion-valid');
    if (date && date.textContent.trim().length > 0) {
      // Use the existing element but wrap in p for separation if not already
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textParts.push(p);
    }
    // CTA link (Read more)
    const cta = col.querySelector('.button-group .btn-primary');
    if (cta) {
      textParts.push(cta);
    }

    // Add this card row
    cells.push([
      imgEl,
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
