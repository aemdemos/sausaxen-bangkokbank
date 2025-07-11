/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Cards (cards49)'];
  // Collect the card columns in this block
  const cardCols = element.querySelectorAll(':scope > .col-md-4');
  const rows = [];
  cardCols.forEach((col) => {
    // For each card: get the .caption.editor element (contains heading + link)
    const caption = col.querySelector('.caption');
    if (caption) {
      rows.push([caption]);
    }
  });
  // Only create if there are cards (but must always create header row)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
