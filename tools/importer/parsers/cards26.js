/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row
  const headerRow = ['Cards (cards26)'];

  // Extract all text content, preserving structure
  // We'll try to reference the immediate child container if possible
  // so that all presentational structure is preserved.
  // If no children, fallback to simple text content.
  let contentEl;
  // If the element has a direct child that contains content, prefer that
  if (element.children.length === 1) {
    contentEl = element.children[0];
  } else if (element.children.length > 1) {
    // Wrap all children in a single div for structure preservation
    contentEl = document.createElement('div');
    Array.from(element.children).forEach(child => contentEl.appendChild(child));
  } else {
    // Only text node
    contentEl = document.createElement('div');
    contentEl.textContent = element.textContent.trim();
  }

  // Build the table cells
  const cells = [
    headerRow,
    [contentEl]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}