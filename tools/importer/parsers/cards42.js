/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row
  const headerRow = ['Cards (cards42)'];
  const rows = [headerRow];

  // Find all cards
  const cardNodes = element.querySelectorAll('.col-md-4');
  cardNodes.forEach((col) => {
    // Image (first cell)
    let imgEl = col.querySelector('.thumb img');
    let imageCell = imgEl ? imgEl : '';

    // Text content (second cell)
    const textCellContent = [];

    // Description (caption)
    const desc = col.querySelector('.caption .desc');
    if (desc) textCellContent.push(desc);

    // Date (if present)
    const date = col.querySelector('.button-group .promotion-valid');
    if (date) {
      const dateDiv = document.createElement('div');
      dateDiv.textContent = date.textContent.trim();
      dateDiv.style.fontSize = '0.92em';
      dateDiv.style.color = '#888';
      textCellContent.push(dateDiv);
    }

    // CTA (if present)
    const cta = col.querySelector('.button-group a');
    if (cta) textCellContent.push(cta);

    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
