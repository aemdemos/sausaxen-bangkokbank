/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards37)'];
  // Select all cards directly inside the inner row
  const cardNodes = Array.from(element.querySelectorAll('.row.row-center > .col-md-4'));
  const rows = cardNodes.map(card => {
    // The image/icon
    const img = card.querySelector('img');
    // The card's title (h3)
    const title = card.querySelector('.caption .title-3, .caption h3');
    let textCell = [];
    if (title) {
      // Reference the existing heading element, retaining tag and formatting
      textCell.push(title);
    }
    return [img, textCell];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
