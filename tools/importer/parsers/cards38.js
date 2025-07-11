/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards38)'];
  const rows = [];
  // Find all direct card columns
  const cardCols = element.querySelectorAll(':scope > .row > div');
  cardCols.forEach((col) => {
    // Image: get the first img inside .thumb
    const img = col.querySelector('.thumb img');
    // Title: h3.title-3.line
    const title = col.querySelector('h3.title-3');
    // Description: .caption .desc (can be empty)
    const desc = col.querySelector('.caption .desc');
    // CTA: .button-group a
    const cta = col.querySelector('.button-group a');

    // Image cell: reference the <img> if present, else ""
    const imgCell = img || '';

    // Text cell: build contents
    const textCellContent = [];
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCellContent.push(strong);
    }
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCellContent.push(p);
    }
    // Add a <br> for visual separation, but only if there's a CTA
    if (cta) {
      if (textCellContent.length > 0) {
        // Only add a <br> if there is already title or description above
        textCellContent.push(document.createElement('br'));
      }
      textCellContent.push(cta);
    }
    rows.push([imgCell, textCellContent]);
  });
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
