/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all column elements
  const columns = Array.from(row.children);

  // For each col, extract the group-link (if it exists)
  const cellElements = columns.map(col => {
    const groupLink = col.querySelector('.group-link, .group-link.no-padding-bottom');
    return groupLink || col;
  });

  // Create the table manually to ensure header is a single th with correct colspan
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns34)';
  th.colSpan = cellElements.length;
  headerRow.appendChild(th);
  table.appendChild(headerRow);

  // Second row: one td per column (cellElements)
  const secondRow = document.createElement('tr');
  cellElements.forEach(cell => {
    const td = document.createElement('td');
    td.append(cell);
    secondRow.appendChild(td);
  });
  table.appendChild(secondRow);

  // Replace the original element with the new table
  element.replaceWith(table);
}
