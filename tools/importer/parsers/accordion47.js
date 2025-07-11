/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, matching the example exactly
  const headerRow = ['Accordion (accordion47)'];

  // Get all top-level .collapse-item elements (accordion sections)
  const items = Array.from(element.querySelectorAll(':scope > .collapse-item'));
  const rows = [headerRow];

  items.forEach(item => {
    // Title is always in .collapse-header
    const titleElem = item.querySelector('.collapse-header');
    // Content is in .collapse-inner, which should contain the details
    const contentElem = item.querySelector('.collapse-inner');
    // Defensive: if any are missing, substitute an empty string
    const titleCell = titleElem || '';
    const contentCell = contentElem || '';
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
