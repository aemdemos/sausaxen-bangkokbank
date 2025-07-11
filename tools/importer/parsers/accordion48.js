/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion section within the element
  const section = element.querySelector('section[data-accordion]');
  if (!section) return;

  // Get all accordion items (collapse-item direct children)
  const items = section.querySelectorAll(':scope > .collapse-item');

  // Prepare the rows for the block table
  const rows = [];
  // Header row must match spec
  rows.push(['Accordion (accordion48)']);

  items.forEach(item => {
    // Title: .collapse-header (reference directly)
    const title = item.querySelector('.collapse-header');
    // Content: .collapse-inner (reference directly)
    const content = item.querySelector('.collapse-inner');
    if (title && content) {
      rows.push([title, content]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the whole accordion section with the block
  section.replaceWith(block);
}
