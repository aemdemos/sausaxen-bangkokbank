/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion block: section[data-accordion]
  const accordionSection = element.querySelector('section[data-accordion]');
  if (!accordionSection) return;
  // Select all immediate children with class 'collapse-item'
  const items = Array.from(accordionSection.querySelectorAll(':scope > .collapse-item'));
  if (!items.length) return;

  // Prepare rows for the table
  const rows = [];
  // Header row matches the example EXACTLY
  rows.push(['Accordion (accordion41)']);

  // For each accordion item, extract title cell and content cell
  items.forEach(item => {
    // Title: collapse-header (should be a single element)
    const titleEl = item.querySelector('.collapse-header');
    // Content: the .collapse-inner block (may contain .text-default.editor or just text)
    let contentEl = item.querySelector('.collapse-inner');
    // Use .text-default.editor inside if present (to be resilient to wrappers)
    if (contentEl) {
      const editor = contentEl.querySelector('.text-default.editor');
      if (editor) contentEl = editor;
    }
    // Defensive: handle missing titleEl/contentEl with empty string
    rows.push([
      titleEl || '',
      contentEl || ''
    ]);
  });

  // Create the table using the WebImporter helper, as required
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the whole accordion section's parent wrapper with the new table
  element.replaceWith(table);
}
