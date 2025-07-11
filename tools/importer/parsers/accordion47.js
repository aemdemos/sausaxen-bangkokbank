/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare rows for the accordion table
  const rows = [
    ['Accordion (accordion47)']
  ];

  // Select all immediate .collapse-item children
  const items = element.querySelectorAll(':scope > .collapse-item');

  items.forEach((item) => {
    // Title: find the .collapse-header element (always present)
    const header = item.querySelector('.collapse-header');
    // Content: find the .collapse-inner, prefer .text-default.editor if present
    const contentContainer = item.querySelector('.collapse-inner');
    let content = null;
    if (contentContainer) {
      const preferred = contentContainer.querySelector('.text-default.editor');
      content = preferred || contentContainer;
    } else {
      // fallback: if .collapse-inner missing, use item itself
      content = item;
    }
    rows.push([header, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
