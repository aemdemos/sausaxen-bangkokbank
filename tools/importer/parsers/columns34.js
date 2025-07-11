/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row that contains the columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get all direct column children
  const columns = Array.from(row.querySelectorAll(':scope > .col-md-2'));
  // For each column, get its group-link content (as a single cell for that column)
  const colContents = columns.map(col => {
    const groupLink = col.querySelector(':scope > .group-link, :scope > .group-link.no-padding-bottom');
    // fallback to full col if not found
    return groupLink || col;
  });
  // Build the cells: header row (single column), then a single row with N columns
  const cells = [
    ['Columns (columns34)'],
    colContents
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
