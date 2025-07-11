/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the markdown example
  const headerRow = ['Cards (cards53)'];
  const cardRows = [];

  // Find all cards: .row > .col-md-4
  const cols = element.querySelectorAll('.row > .col-md-4');
  cols.forEach(col => {
    // Image/icon cell
    const visualImg = col.querySelector('.thumb-info .visual-img');
    let imgEl = null;
    if (visualImg) {
      imgEl = visualImg.querySelector('img');
    }

    // Text cell: preserve h3 and p as in the HTML
    const caption = col.querySelector('.thumb-info .caption');
    // Only add the row if both image and caption exist
    if (imgEl && caption) {
      cardRows.push([imgEl, caption]);
    }
  });

  // Compose table rows
  const tableRows = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
