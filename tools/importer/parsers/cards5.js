/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get cards from figures in columns
  function extractCards(row) {
    // Card columns are direct children with class col-sm-*
    return Array.from(row.children)
      .filter(col => col.matches('[class*="col-sm-"]'))
      .map(col => {
        // The card figure
        const figure = col.querySelector('figure');
        if (!figure) return null;
        // Image (keep the <img> element)
        let imgEl = null;
        const imgDiv = figure.querySelector('.thumb');
        if (imgDiv) {
          imgEl = imgDiv.querySelector('img');
        }
        // Text content: title, desc, cta
        const figcap = figure.querySelector('figcaption');
        const textContent = [];
        if (figcap) {
          // Title (as heading)
          const title = figcap.querySelector('h3');
          if (title) textContent.push(title);
          // Description
          const desc = figcap.querySelector('.desc');
          if (desc) textContent.push(desc);
          // CTA (button-group link)
          const cta = figcap.querySelector('.button-group a');
          if (cta) textContent.push(cta);
        }
        // At least one element is required
        if (imgEl || textContent.length) {
          return [imgEl, textContent];
        }
        return null;
      })
      .filter(card => card !== null);
  }

  // Compose the table rows
  const cells = [];
  cells.push(['Cards (cards5)']); // Header matches exactly

  // Find all card rows (could be multiple rows with cards)
  const rows = Array.from(element.querySelectorAll('.row.row-default'));
  rows.forEach(row => {
    extractCards(row).forEach(([imgEl, textContent]) => {
      // textContent is an array of DOM nodes
      cells.push([
        imgEl,
        textContent
      ]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
