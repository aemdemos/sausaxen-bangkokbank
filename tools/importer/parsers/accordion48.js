/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section
  const section = element.querySelector('section[data-accordion]');
  if (!section) return;

  // Find all the collapse items inside the accordion, each representing a row
  const items = section.querySelectorAll('.collapse-item');

  // Prepare the header row as specified (exact name)
  const rows = [
    ['Accordion (accordion48)']
  ];

  // Extract accordion items: [title, content]
  items.forEach(item => {
    // Title element
    const title = item.querySelector('.collapse-header');
    // Content element (the full content block, including lists, links, etc)
    const content = item.querySelector('.collapse-inner');
    if (title && content) {
      // Remove any decorative/empty spans in content (often used for toggles/controls)
      content.querySelectorAll('span:empty').forEach(span => span.remove());
      rows.push([
        title,
        content
      ]);
    }
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
