/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the requirements and markdown example
  const cells = [['Cards (cards8)']];

  // Extract all card columns
  const cardCols = element.querySelectorAll('.row > .col-md-4');

  cardCols.forEach(col => {
    // Image: .thumb-info .visual-img img
    const img = col.querySelector('.thumb-info .visual-img img');
    // Title: .caption h3
    const title = col.querySelector('.thumb-info .caption h3');
    // Description: .caption p (can be empty)
    const desc = col.querySelector('.thumb-info .caption p');
    // CTA: .button-group a (contains <p> inside)
    const cta = col.querySelector('.thumb-info .button-group a');

    // First cell: image (or blank string if missing)
    const cell1 = img || '';

    // Second cell: group text content
    const cell2Content = [];
    if (title) cell2Content.push(title);
    // If description has text, include it; if not, include a blank <p> for layout (only if a title is present)
    if (desc) {
      if (desc.textContent.trim()) {
        cell2Content.push(desc);
      } else if (title) {
        // For visual/structural parity
        const emptyP = document.createElement('p');
        cell2Content.push(emptyP);
      }
    }
    if (cta) cell2Content.push(cta);

    // Always make sure there's at least one element in the text cell
    if (cell2Content.length === 0) cell2Content.push('');

    cells.push([cell1, cell2Content]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
