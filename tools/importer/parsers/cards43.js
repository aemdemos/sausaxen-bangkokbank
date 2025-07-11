/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards43)'];
  const cells = [headerRow];

  // Get all .row.row-default direct children (cards might be in different rows)
  const rowContainers = Array.from(element.querySelectorAll(':scope .row.row-default'));
  for (const row of rowContainers) {
    // Each row may have .col-sm-12, .col-sm-6, etc. for cards
    const cardCols = Array.from(row.querySelectorAll(':scope > div'));
    for (const cardCol of cardCols) {
      const figure = cardCol.querySelector('figure');
      if (!figure) continue;
      // First cell: image (reference the existing <img> element)
      const imgDiv = figure.querySelector('.thumb');
      let imageEl = null;
      if (imgDiv) {
        imageEl = imgDiv.querySelector('img');
      }
      // Second cell: text (reference the existing elements, keep structure)
      const figcaption = figure.querySelector('figcaption');
      // Compose as a single container for all text content
      const textFragment = document.createDocumentFragment();
      if (figcaption) {
        // Title (h3)
        const h3 = figcaption.querySelector('h3');
        if (h3) textFragment.appendChild(h3);
        // Description (desc)
        const desc = figcaption.querySelector('.desc');
        if (desc) {
          Array.from(desc.childNodes).forEach(node => {
            // Only append elements and meaningful text
            if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
              textFragment.appendChild(node);
            }
          });
        }
        // CTA (button-group)
        const btnGroup = figcaption.querySelector('.button-group');
        if (btnGroup) {
          Array.from(btnGroup.childNodes).forEach(node => {
            // Only append elements (links/buttons)
            if (node.nodeType === 1) {
              textFragment.appendChild(node);
            }
          });
        }
      }
      cells.push([
        imageEl,
        textFragment
      ]);
    }
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
