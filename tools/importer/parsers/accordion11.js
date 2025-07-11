/* global WebImporter */
export default function parse(element, { document }) {
  // Build the rows for the accordion block table
  const rows = [];
  // The header row must EXACTLY match the block name
  rows.push(['Accordion (accordion11)']);

  // Select all immediate .collapse-item children (top-level)
  const items = element.querySelectorAll(':scope > .collapse-item');

  items.forEach((item) => {
    // Title: the .collapse-header direct child
    const header = item.querySelector(':scope > .collapse-header');
    // Content: the main body, which is usually inside .collapse-inner > .text-default.editor
    const content = item.querySelector(':scope > .collapse-inner > .text-default.editor');
    // Defensive: if either header or content is missing, skip this item
    if (!header || !content) return;
    rows.push([header, content]);
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the entire section with the block table
  element.replaceWith(block);
}
