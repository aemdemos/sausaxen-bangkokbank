/* global WebImporter */
export default function parse(element, { document }) {
  // Find all collapse items (accordion sections)
  const collapseItems = element.querySelectorAll('.collapse-item');
  // The header row should be a single cell (matching the example)
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];
  // For each collapse item, create a row with two cells: title and content
  collapseItems.forEach((item) => {
    const headerEl = item.querySelector('.collapse-header');
    const contentEl = item.querySelector('.collapse-inner');
    if (headerEl && contentEl) {
      rows.push([headerEl, contentEl]);
    }
  });
  // Replace the element with the new table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
