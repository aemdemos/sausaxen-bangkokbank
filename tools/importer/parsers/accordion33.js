/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block name as header
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find all .collapse-item elements (accordion items)
  const collapseItems = element.querySelectorAll('.collapse-item');
  collapseItems.forEach((collapseItem) => {
    // Title cell: the header
    const header = collapseItem.querySelector('.collapse-header');
    // Content cell: everything in .collapse-inner
    const content = collapseItem.querySelector('.collapse-inner');
    
    // Defensive: only add if both header and content exist
    if (header && content) {
      rows.push([header, content]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original block
  element.replaceWith(block);
}
