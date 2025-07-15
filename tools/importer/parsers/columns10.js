/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row that contains all columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Gather all direct column children
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-md-2'));
  if (columns.length === 0) return;

  // Header row: one cell with 'Columns', but ensure the row array has the same number of columns as the content row
  const headerRow = Array(columns.length).fill('');
  headerRow[0] = 'Columns';

  // Second row: one cell per column, collect content
  const contentRow = columns.map(col => {
    const groupLink = col.querySelector('.group-link');
    if (!groupLink) return col; // fallback
    const title = groupLink.querySelector('.title');
    const listLinks = groupLink.querySelector('.list-links ul');
    const cellContent = [];
    if (title) cellContent.push(title);
    if (listLinks) cellContent.push(listLinks);
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  });

  // Compose cells: header row and content row
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
