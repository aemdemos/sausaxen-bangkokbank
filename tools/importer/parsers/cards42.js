/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards42)'];
  const rows = [headerRow];

  // Get the card columns
  const cardCols = element.querySelectorAll('.row > .col-md-4');
  cardCols.forEach(col => {
    // Image: always present in .thumb img
    let imageEl = null;
    const img = col.querySelector('.thumb img');
    if (img) {
      imageEl = img;
    }

    // Text content cell
    const textCell = [];
    // Description (main text)
    const desc = col.querySelector('.caption .desc');
    if (desc) textCell.push(desc);
    // Date (as a <p>)
    const date = col.querySelector('.button-group .promotion-valid');
    if (date) textCell.push(date);
    // CTA (Read more link)
    const cta = col.querySelector('.button-group a');
    if (cta) textCell.push(cta);

    // Add row only if at least image and some text exists
    if (imageEl && textCell.length > 0) {
      rows.push([imageEl, textCell]);
    }
  });

  // Create and replace with cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
