/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the block name exactly
  const headerRow = ['Cards (cards2)'];
  const rows = [];

  // Defensive: ensure 'element' exists
  if (!element) return;

  // Get all direct card columns (should be .col-md-4, but robust to structure)
  const cardCols = element.querySelectorAll(':scope > div');

  cardCols.forEach((col) => {
    // Find image inside possible .thumb > img
    const img = col.querySelector('img');
    // Find the caption/text block
    const caption = col.querySelector('.caption');
    // Only process if both image and caption exist
    if (img && caption) {
      rows.push([img, caption]);
    } else if (img) {
      rows.push([img, '']);
    } else if (caption) {
      rows.push(['', caption]);
    }
    // If neither img nor caption, skip
  });

  // Only build the table if there's at least one card
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
